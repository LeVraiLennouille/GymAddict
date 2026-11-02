import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import type { AppData, DateKey, Exercise } from '../src/domain/types';
import { emptyAppData, normalizeAppData, serializeAppData } from '../src/domain/rules/appData';
import { getProgramConfig, orderedExercises, getEffectiveDayProgram } from '../src/domain/rules/program';
import { exRepFields } from '../src/domain/rules/progression';
import {
  addExercise,
  addProgram,
  addRun,
  applyExercisePatch,
  deleteExercise,
  deleteProgram,
  deleteRun,
  moveExercise,
  moveProgram,
  moveRun,
  resetProgramConfig,
  setProgramColor,
  setProgramName,
  setRunDay,
  setRunField,
  setWeeklyKm,
  setWeeklyProgram,
  updateExercise,
} from '../src/domain/actions/program';
import {
  backupFileName,
  backupStatus,
  buildBackupFile,
  extractBackupPayload,
  markBackedUp,
  mergeAppData,
  snoozeBackup,
  summarizeBackup,
} from '../src/domain/rules/backup';
import { completeSet, saveDayProgramOverride, registerPR } from '../src/domain/actions/workout';
import { saveBodyWeightEntry } from '../src/domain/actions/profile';
import { parsePace } from '../src/domain/format/numbers';

const TODAY = '2026-10-28' as DateKey;
const NOW = new Date(2026, 9, 28, 12, 0, 0);
const fresh = (): AppData => emptyAppData(TODAY);
const k = (s: string): DateKey => s as DateKey;

const base: Exercise = { id: 'ex_1', name: 'Pompes', sets: 3, repsLabel: '8-12 reps', defaultReps: 10, type: 'isolation', muscles: ['pecs'], restSec: 90 };

describe('éditeur : exercice', () => {
  it('nom, séries, repos bornés', () => {
    assert.equal(applyExercisePatch(base, { name: '  Dips <b>  lestés ' }).name, 'Dips b lestés');
    assert.equal(applyExercisePatch(base, { name: '   ' }).name, 'Pompes');
    assert.equal(applyExercisePatch(base, { sets: 99 }).sets, 12);
    assert.equal(applyExercisePatch(base, { sets: 0 }).sets, 1);
    assert.equal(applyExercisePatch(base, { restSec: 5 }).restSec, 10);
    assert.equal(applyExercisePatch(base, { restSec: 9999 }).restSec, 600);
    assert.equal(base.sets, 3); // l'original n'est pas modifié
  });

  it('fourchette de répétitions, échec et secondes', () => {
    const r = applyExercisePatch(base, { reps: { min: 6, max: 10 } });
    assert.equal(r.repsLabel, '6-10 reps');
    assert.equal(r.defaultReps, 8);
    assert.equal(applyExercisePatch(base, { reps: { min: 12, max: 8 } }).repsLabel, '12 reps'); // max < min : fixé à min
    const failure = applyExercisePatch(base, { failure: true });
    assert.equal(failure.repsLabel, 'Échec');
    assert.deepEqual(exRepFields(failure), { failure: true, min: 10, max: 10 });
    assert.equal(applyExercisePatch(failure, { failure: false }).repsLabel, '10 reps');
    const time = applyExercisePatch(base, { isTime: true });
    assert.equal(time.isTime, true);
    assert.equal(time.repsLabel, '8-12 sec');
    assert.equal(applyExercisePatch(time, { isTime: false }).repsLabel, '8-12 reps');
    assert.equal(applyExercisePatch(time, { isTime: false }).isTime, undefined);
  });

  it('superset, incrément, optionnel, type, muscles', () => {
    assert.equal(applyExercisePatch(base, { superset: 'B' }).superset, 'B');
    assert.equal(applyExercisePatch({ ...base, superset: 'B' }, { superset: null }).superset, undefined);
    assert.equal(applyExercisePatch(base, { step: 1.25 }).step, 1.25);
    assert.equal(applyExercisePatch({ ...base, step: 1.25 }, { step: null }).step, undefined);
    assert.equal(applyExercisePatch({ ...base, step: 5 }, { step: 0 }).step, undefined);
    assert.equal(applyExercisePatch(base, { optional: true }).optional, true);
    assert.equal(applyExercisePatch({ ...base, optional: true }, { optional: false }).optional, undefined);
    assert.equal(applyExercisePatch(base, { type: 'compound' }).type, 'compound');
    assert.deepEqual(applyExercisePatch(base, { toggleMuscle: 'triceps' }).muscles, ['pecs', 'triceps']);
    assert.deepEqual(applyExercisePatch(base, { toggleMuscle: 'pecs' }).muscles, []);
  });
});

describe('éditeur : séances et planning', () => {
  it('crée une séance, la renomme, la colore, la place dans la semaine', () => {
    const { data, id } = addProgram(fresh(), 1000);
    assert.equal(id, 'prog_rs');
    let d = setProgramName(data, id, 'fullName', 'Haut du corps');
    d = setProgramName(d, id, 'label', '');
    d = setProgramColor(d, id, 'blue');
    d = setWeeklyProgram(d, 'samedi', id);
    d = setWeeklyProgram(d, 'dimanche', 'nimporte');
    const cfg = getProgramConfig(d);
    assert.equal(cfg.programs[id]?.fullName, 'Haut du corps');
    assert.equal(cfg.programs[id]?.label, 'Séance');
    assert.equal(cfg.programs[id]?.color, 'blue');
    assert.equal(cfg.weekly.samedi, id);
    assert.equal(cfg.weekly.dimanche, 'repos'); // inchangé
    assert.equal(cfg.order[cfg.order.length - 1], id);
    assert.equal(getEffectiveDayProgram(d, k('2026-10-31')).key, id); // samedi
  });

  it('ordre des séances', () => {
    const { data, id } = addProgram(fresh(), 1);
    const order = (d: AppData) => getProgramConfig(d).order;
    const n = order(data).length;
    const up = moveProgram(data, id, -1);
    assert.equal(order(up)[n - 2], id);
    assert.deepEqual(order(moveProgram(data, id, 1)), order(data)); // déjà dernière
  });

  it('suppression : « repos » protégé, planning et choix manuels nettoyés', () => {
    assert.equal(deleteProgram(fresh(), 'repos'), null);
    assert.equal(deleteProgram(fresh(), 'inconnu'), null);
    let d = setWeeklyProgram(fresh(), 'samedi', 'jambes');
    d = saveDayProgramOverride(d, k('2026-10-20'), 'jambes');
    d = saveDayProgramOverride(d, k('2026-10-21'), 'abdos');
    const after = deleteProgram(d, 'jambes');
    assert.ok(after);
    const cfg = getProgramConfig(after);
    assert.equal(cfg.programs['jambes'], undefined);
    assert.ok(!cfg.order.includes('jambes'));
    assert.equal(cfg.weekly.samedi, 'repos');
    assert.equal(cfg.weekly.mercredi === 'jambes' ? 'oups' : 'ok', 'ok');
    assert.equal(after.dayProgram[k('2026-10-20')], undefined);
    assert.equal(after.dayProgram[k('2026-10-21')], 'abdos');
  });

  it('réinitialisation du programme', () => {
    const { data } = addProgram(fresh(), 1);
    assert.ok(data.program);
    const reset = resetProgramConfig(data);
    assert.equal(reset.program, undefined);
    assert.equal(getProgramConfig(reset).programs['prog_1'], undefined);
  });
});

describe('éditeur : exercices d\'une séance', () => {
  it('ajouter, modifier, déplacer, supprimer', () => {
    const { data: withProg, id: pid } = addProgram(fresh(), 5);
    const { data: withEx, id: e1 } = addExercise(withProg, pid, 10);
    const { data: two, id: e2 } = addExercise(withEx, pid, 20);
    const list = (d: AppData) => getProgramConfig(d).programs[pid]?.exercises.map((e) => e.id);
    assert.deepEqual(list(two), [e1, e2]);
    assert.equal(e1, 'ex_a');

    let d = updateExercise(two, pid, e1, { name: 'Tractions lestées', sets: 4, toggleMuscle: 'dos' });
    const ex = getProgramConfig(d).programs[pid]?.exercises[0];
    assert.equal(ex?.name, 'Tractions lestées');
    assert.equal(ex?.sets, 4);
    assert.deepEqual(ex?.muscles, ['dos']);
    assert.equal(d.exNames[e1], 'Tractions lestées'); // retenu pour l'historique

    d = moveExercise(d, pid, e1, 1);
    assert.deepEqual(list(d), [e2, e1]);
    d = moveExercise(d, pid, e1, 1); // déjà dernier
    assert.deepEqual(list(d), [e2, e1]);
    d = deleteExercise(d, pid, e2);
    assert.deepEqual(list(d), [e1]);
    assert.equal(updateExercise(d, 'inconnu', e1, { sets: 5 }).program?.programs['inconnu'], undefined);
  });

  it('un exercice créé à la main prend l\'identifiant d\'un exercice connu du même nom', () => {
    const { data: p, id: pid } = addProgram(fresh(), 5);
    const { data: withEx, id } = addExercise(p, pid, 10);
    const linked = updateExercise(withEx, pid, id, { name: 'développé couché' });
    assert.equal(getProgramConfig(linked).programs[pid]?.exercises[0]?.id, 'dev_couche');
    // nom inconnu : l'identifiant reste
    const plain = updateExercise(withEx, pid, id, { name: 'Exercice inventé' });
    assert.equal(getProgramConfig(plain).programs[pid]?.exercises[0]?.id, id);
  });

  it('la séance du jour reflète immédiatement les modifications', () => {
    const { data: p, id: pid } = addProgram(fresh(), 5);
    const { data: withEx, id } = addExercise(p, pid, 10);
    let d = updateExercise(withEx, pid, id, { sets: 2, name: 'Mon exo' });
    d = saveDayProgramOverride(d, TODAY, pid);
    const { prog } = getEffectiveDayProgram(d, TODAY);
    assert.deepEqual(orderedExercises(d, TODAY, prog).map((e) => [e.name, e.sets]), [['Mon exo', 2]]);
  });
});

describe('éditeur : sorties', () => {
  it('créer, renseigner, planifier, supprimer', () => {
    const { data, id } = addRun(fresh(), 7);
    assert.equal(id, 'run_7');
    let d = setRunField(data, id, 'name', '  Fractionné <i>10×400 ');
    d = setRunField(d, id, 'targetDistance', '8,5');
    d = setRunField(d, id, 'targetDuration', '999');
    d = setRunField(d, id, 'targetPace', String(parsePace('5:30')));
    d = setRunField(d, id, 'desc', 'x'.repeat(300));
    const run = getProgramConfig(d).runs[id];
    assert.equal(run?.name, 'Fractionné i10×400');
    assert.equal(run?.targetDistance, 8.5);
    assert.equal(run?.targetDuration, 0); // hors limites : remis à 0
    assert.equal(run?.targetPace, 330);
    assert.equal(run?.desc.length, 240);

    d = setRunDay(d, 'samedi', id);
    assert.equal(getProgramConfig(d).runWeekly.samedi, id);
    d = setRunDay(d, 'samedi', 'nimporte');
    assert.equal(getProgramConfig(d).runWeekly.samedi, '');
    d = setRunDay(d, 'samedi', id);

    d = setWeeklyKm(d, '25');
    assert.equal(getProgramConfig(d).weeklyKm, 25);
    d = setWeeklyKm(d, '9999');
    assert.equal(getProgramConfig(d).weeklyKm, 0);

    const order = getProgramConfig(d).runOrder;
    assert.equal(order[order.length - 1], id);
    assert.equal(getProgramConfig(moveRun(d, id, -1)).runOrder[order.length - 2], id);

    const gone = deleteRun(d, id);
    assert.equal(getProgramConfig(gone).runs[id], undefined);
    assert.equal(getProgramConfig(gone).runWeekly.samedi, '');
    assert.ok(!getProgramConfig(gone).runOrder.includes(id));
  });

  it('lecture de l\'allure saisie', () => {
    assert.equal(parsePace('5:30'), 330);
    assert.equal(parsePace("5'30"), 330);
    assert.equal(parsePace('6'), 360);
    assert.equal(parsePace('5:75'), 0);
    assert.equal(parsePace('abc'), 0);
    assert.equal(parsePace(''), 0);
  });
});

const sample = (): AppData => {
  let d = fresh();
  d = saveDayProgramOverride(d, k('2026-10-20'), 'pecs_tri');
  d = completeSet(d, { date: k('2026-10-20'), exId: 'dev_couche', idx: 0, done: true, weight: '60', reps: '10', now: 1 });
  d = registerPR(d, { date: k('2026-10-20'), exId: 'dev_couche', name: 'DC', weight: 60, reps: 10 }).data;
  d = saveBodyWeightEntry(d, '80', k('2026-10-20')).data;
  return d;
};

describe('sauvegarde : fichier', () => {
  it('aller-retour : enveloppe puis normalisation', () => {
    const d = sample();
    const file = buildBackupFile(d, NOW);
    assert.equal(file.app, 'GymAddict');
    assert.equal(file.format, 1);
    assert.equal(file.exportedAt, NOW.toISOString());
    const text = JSON.stringify(file);
    const payload = extractBackupPayload(JSON.parse(text));
    assert.ok(payload);
    const restored = normalizeAppData(payload, TODAY);
    assert.deepEqual(restored.workouts, d.workouts);
    assert.deepEqual(restored.prs, d.prs);
    assert.deepEqual(restored.weightLog, d.weightLog);
    assert.deepEqual(restored.activeDays, d.activeDays);
    assert.deepEqual(restored.sessionMeta, d.sessionMeta);
    assert.deepEqual(restored.dayProgram, d.dayProgram);
    assert.deepEqual(restored, normalizeAppData(JSON.parse(serializeAppData(d)), TODAY));
  });

  it('formats reconnus et refusés', () => {
    const raw = JSON.parse(serializeAppData(sample())) as unknown;
    assert.ok(extractBackupPayload(raw)); // ancien export brut
    assert.ok(extractBackupPayload({ fitcore: raw }));
    assert.equal(extractBackupPayload({ n: 1 }), null);
    assert.equal(extractBackupPayload([]), null);
    assert.equal(extractBackupPayload(null), null);
    assert.equal(extractBackupPayload('texte'), null);
    assert.equal(extractBackupPayload({ app: 'GymAddict', format: 1, data: 'x' }), null);
  });

  it('nom de fichier et résumé', () => {
    assert.equal(backupFileName(NOW), 'gymaddict-sauvegarde-2026-10-28.json');
    const s = summarizeBackup(sample());
    assert.deepEqual(s, { sessionDays: 1, records: 1, weighIns: 1, goals: 0, firstDay: '2026-10-20', lastDay: '2026-10-20' });
    assert.equal(summarizeBackup(fresh()).firstDay, null);
  });
});

describe('sauvegarde : fusion', () => {
  it('ne remplace jamais l\'existant, ajoute ce qui manque', () => {
    const cur = sample();
    let inc = fresh();
    inc = completeSet(inc, { date: k('2026-10-20'), exId: 'dev_couche', idx: 0, done: true, weight: '999', reps: '1', now: 1 }); // même jour : ignoré
    inc = completeSet(inc, { date: k('2026-10-10'), exId: 'dev_couche', idx: 0, done: true, weight: '50', reps: '10', now: 1 }); // nouveau jour
    inc = registerPR(inc, { date: k('2026-10-10'), exId: 'dev_couche', name: 'DC', weight: 70, reps: 5 }).data; // meilleur record
    inc = registerPR(inc, { date: k('2026-10-10'), exId: 'tractions', name: 'T', weight: 10, reps: 8 }).data; // nouvel exercice
    inc = saveBodyWeightEntry(inc, '79', k('2026-10-10')).data;
    inc = saveBodyWeightEntry(inc, '95', k('2026-10-20')).data; // même date : ignoré
    inc = { ...inc, goals: [{ id: 'g1', type: 'weight', target: 75, startDate: k('2026-10-01'), start: 80 }] };

    const { data, added } = mergeAppData(cur, inc);
    assert.equal(data.workouts[k('2026-10-20')]?.['dev_couche']?.[0]?.weight, '60');
    assert.equal(data.workouts[k('2026-10-10')]?.['dev_couche']?.[0]?.weight, '50');
    assert.deepEqual(data.prs['dev_couche'], { weight: 70, reps: 5, date: k('2026-10-10') });
    assert.equal(data.prs['tractions']?.weight, 10);
    assert.deepEqual(data.weightLog.map((e) => [e.date, e.kg]), [['2026-10-10', 79], ['2026-10-20', 80]]);
    assert.equal(data.bodyWeight, 80);
    assert.equal(data.goals.length, 1);
    assert.deepEqual(added, { sessionDaysAdded: 1, recordsImproved: 2, weighInsAdded: 1, goalsAdded: 1 });
    assert.deepEqual(data.activeDays, ['2026-10-10', '2026-10-20']);
  });

  it('record égal ou moins bon : conservé tel quel', () => {
    const cur = sample(); // 60 × 10
    const worse = { ...fresh(), prs: { dev_couche: { weight: 60, reps: 8, date: k('2026-09-01') } } };
    assert.equal(mergeAppData(cur, worse).data.prs['dev_couche']?.reps, 10);
    assert.equal(mergeAppData(cur, worse).added.recordsImproved, 0);
    const tieMoreReps = { ...fresh(), prs: { dev_couche: { weight: 60, reps: 12, date: k('2026-09-01') } } };
    assert.equal(mergeAppData(cur, tieMoreReps).data.prs['dev_couche']?.reps, 12);
  });

  it('programme et profil : ceux de l\'appareil gagnent, sinon ceux du fichier', () => {
    const withProgram = addProgram(fresh(), 1).data;
    assert.equal(mergeAppData(fresh(), withProgram).data.program, withProgram.program);
    const mine = { ...withProgram, profile: { pseudo: 'Moi', avatar: 'blue' as const, since: k('2026-10-01') } };
    const theirs = { ...fresh(), profile: { pseudo: 'Autre', avatar: 'red' as const, since: k('2025-01-01') } };
    assert.equal(mergeAppData(mine, theirs).data.profile.pseudo, 'Moi');
    const merged = mergeAppData(fresh(), theirs).data.profile;
    assert.equal(merged.pseudo, 'Autre');
    assert.equal(merged.since, '2025-01-01'); // ancienneté la plus ancienne
    assert.equal(mergeAppData({ ...fresh(), age: 30 }, { ...fresh(), age: 20 }).data.age, 30);
    assert.equal(mergeAppData(fresh(), { ...fresh(), age: 20 }).data.age, 20);
  });
});

describe('sauvegarde : rappel', () => {
  const days = (n: number): AppData => {
    let d = fresh();
    for (let i = 1; i <= n; i++) {
      d = completeSet(d, { date: k(`2026-10-${String(i).padStart(2, '0')}`), exId: 'x', idx: 0, done: true, weight: '10', reps: '10', now: 1 });
    }
    return d;
  };

  it('pas de rappel sans assez d\'historique', () => {
    assert.deepEqual(backupStatus(days(2), NOW), { due: false, daysSince: null });
  });

  it('rappel si jamais sauvegardé ou plus de 14 jours', () => {
    assert.deepEqual(backupStatus(days(3), NOW), { due: true, daysSince: null });
    const recent = markBackedUp(days(3), NOW.getTime() - 5 * 864e5);
    assert.deepEqual(backupStatus(recent, NOW), { due: false, daysSince: 5 });
    const old = markBackedUp(days(3), NOW.getTime() - 15 * 864e5);
    assert.deepEqual(backupStatus(old, NOW), { due: true, daysSince: 15 });
  });

  it('« plus tard » repousse de 7 jours', () => {
    const d = snoozeBackup(days(5), NOW.getTime());
    assert.equal(backupStatus(d, NOW).due, false);
    assert.equal(backupStatus(d, new Date(NOW.getTime() + 8 * 864e5)).due, true);
    assert.equal(backupStatus(markBackedUp(d, NOW.getTime()), NOW).due, false);
    assert.equal(markBackedUp(d, 5).prefs.backupSnooze, undefined);
  });
});
