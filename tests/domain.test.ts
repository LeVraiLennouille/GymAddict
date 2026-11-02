import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import type { AppData, DateKey, Exercise } from '../src/domain/types';
import { calc1RM } from '../src/domain/rules/oneRepMax';
import { getWarmupSets } from '../src/domain/rules/warmup';
import { computeReadinessScore, readinessMessage, readinessTone } from '../src/domain/rules/readiness';
import { getFunEquivalent } from '../src/domain/rules/funEquivalent';
import { buildRepsLabel, exRepFields, getProgressionSuggestion } from '../src/domain/rules/progression';
import { emptyAppData, normalizeAppData, serializeAppData } from '../src/domain/rules/appData';
import {
  dayExercises,
  getEffectiveDayProgram,
  orderedExercises,
  sanitizeExercise,
  sanitizeProgramConfig,
} from '../src/domain/rules/program';
import { computeRegularity, computeStreak } from '../src/domain/rules/streak';
import { getDayProgress, getLastSession, getTonnageFor, topSet } from '../src/domain/rules/sets';
import { supersetNext, supersetRest } from '../src/domain/rules/supersets';
import { buildSwapDef, swapCandidates } from '../src/domain/rules/swap';
import {
  applyProgressionWeight,
  applySwap,
  completeSet,
  postponeExercise,
  registerPR,
  revertSwap,
  saveDayProgramOverride,
  saveSessionNote,
  setSetField,
  skipExercise,
} from '../src/domain/actions/workout';
import { DEFAULT_PROGRAMS, DEFAULT_WEEKLY } from '../src/domain/defaults/programs';
import { fmtKg, fmtPace, fmtRest, fmtTonnage } from '../src/domain/format/numbers';
import { dayNameOf, dateToKey, weekDateKeys } from '../src/domain/format/dates';
import { buildTodayView } from '../src/domain/rules/todayView';
import { sessionSummary } from '../src/domain/rules/summary';
import { restDayInfo } from '../src/domain/rules/restDay';

const TODAY = '2026-10-28' as DateKey; // mercredi
const fresh = (): AppData => emptyAppData(TODAY);

describe('formules', () => {
  it('1RM de Brzycki', () => {
    assert.equal(calc1RM(100, 1), 100);
    assert.equal(calc1RM(80, 10), 106.7);
    assert.equal(calc1RM('60', '8'), 74.5);
    assert.equal(calc1RM(0, 5), 0);
    assert.equal(calc1RM('abc', 5), 0);
  });

  it("échauffement arrondi au 0,5 kg", () => {
    const sets = getWarmupSets(100);
    assert.deepEqual(sets.map((s) => s.weight), [40, 60, 75, 85, 95]);
    assert.deepEqual(getWarmupSets(0), []);
    assert.equal(getWarmupSets(62.5)[0]?.weight, 25);
  });

  it('forme du jour', () => {
    assert.equal(computeReadinessScore({ sleep: 5, stress: 4, soreness: 4 }), 4.3);
    assert.equal(readinessTone(4.3), 'good');
    assert.equal(readinessTone(3.2), 'mid');
    assert.equal(readinessTone(2), 'low');
    assert.ok(readinessMessage(1.5).includes('10–15%'));
  });

  it('équivalents ludiques', () => {
    assert.equal(getFunEquivalent(0), null);
    assert.deepEqual(getFunEquivalent(3000), { count: 2, name: 'voitures' });
    assert.equal(getFunEquivalent(2)?.name, 'chats');
  });

  it('formats', () => {
    assert.equal(fmtKg(62.5), '62,5');
    assert.equal(fmtRest(45), '45s');
    assert.equal(fmtRest(90), '1m30');
    assert.equal(fmtRest(120), '2min');
    assert.equal(fmtPace(330), '5:30');
    assert.equal(fmtTonnage(850), '850 kg');
    assert.ok(fmtTonnage(1250).endsWith(' t'));
  });

  it('dates', () => {
    assert.equal(dayNameOf(TODAY), 'mercredi');
    assert.equal(dateToKey(new Date(2026, 0, 5)), '2026-01-05');
    const week = weekDateKeys(new Date(2026, 9, 28));
    assert.equal(week.lundi, '2026-10-26');
    assert.equal(week.dimanche, '2026-11-01');
  });
});

describe('progression', () => {
  const dev: Exercise = {
    id: 'dev_couche', name: 'Développé couché', sets: 3, repsLabel: '8-12 reps',
    defaultReps: 10, type: 'compound', muscles: ['pecs'], restSec: 120,
  };

  it('lit la fourchette de répétitions', () => {
    assert.deepEqual(exRepFields(dev), { failure: false, min: 8, max: 12 });
    assert.deepEqual(exRepFields({ ...dev, repsLabel: 'Échec' }), { failure: true, min: 10, max: 10 });
    assert.deepEqual(exRepFields({ ...dev, repsLabel: '15 reps' }), { failure: false, min: 15, max: 15 });
  });

  it('reconstruit le libellé', () => {
    assert.equal(buildRepsLabel(dev, 6, 10), '6-10 reps');
    assert.equal(buildRepsLabel({ ...dev, repsLabel: '10-12 reps / jambe' }, 10, 12), '10-12 reps / jambe');
  });

  it('propose de monter quand toutes les séries atteignent le haut de la fourchette', () => {
    const last = { date: '2026-10-20' as DateKey, sets: [1, 2, 3].map(() => ({ done: true, weight: '60', reps: '12' })) };
    assert.deepEqual(getProgressionSuggestion(dev, last), { kind: 'up', from: 60, weight: 62.5, step: 2.5, target: 8 });
  });

  it('garde la charge sinon', () => {
    const last = { date: '2026-10-20' as DateKey, sets: [{ done: true, weight: '60', reps: '12' }, { done: true, weight: '60', reps: '10' }, { done: true, weight: '60', reps: '9' }] };
    assert.deepEqual(getProgressionSuggestion(dev, last), { kind: 'hold', from: 60, weight: 60, next: 62.5, target: 12 });
  });

  it('pas de suggestion si séance incomplète, échec, temps ou échauffement', () => {
    const two = { date: '2026-10-20' as DateKey, sets: [{ done: true, weight: '60', reps: '12' }, { done: true, weight: '60', reps: '12' }] };
    assert.equal(getProgressionSuggestion(dev, two), null);
    assert.equal(getProgressionSuggestion(dev, null), null);
    const full = { date: two.date, sets: [...two.sets, two.sets[0]!] };
    assert.equal(getProgressionSuggestion({ ...dev, repsLabel: 'Échec' }, full), null);
    assert.equal(getProgressionSuggestion({ ...dev, isTime: true }, full), null);
    assert.equal(getProgressionSuggestion({ ...dev, type: 'echauffement' }, full), null);
  });

  it('respecte un incrément personnalisé', () => {
    const last = { date: '2026-10-20' as DateKey, sets: [1, 2, 3].map(() => ({ done: true, weight: '20', reps: '12' })) };
    assert.equal(getProgressionSuggestion({ ...dev, step: 1 }, last)?.weight, 21);
  });
});

describe('programmes par défaut', () => {
  it('le planning par défaut ne référence que des programmes existants', () => {
    for (const key of Object.values(DEFAULT_WEEKLY)) assert.ok(DEFAULT_PROGRAMS[key], key);
  });

  it('résout le programme du jour (suggestion puis choix manuel)', () => {
    const data = fresh();
    const eff = getEffectiveDayProgram(data, TODAY); // mercredi -> abdos
    assert.equal(eff.key, 'abdos');
    assert.equal(eff.isSuggestion, true);
    const changed = saveDayProgramOverride(data, TODAY, 'jambes');
    const eff2 = getEffectiveDayProgram(changed, TODAY);
    assert.equal(eff2.key, 'jambes');
    assert.equal(eff2.isSuggestion, false);
    assert.equal(getEffectiveDayProgram(saveDayProgramOverride(changed, TODAY, null), TODAY).key, 'abdos');
  });

  it('un choix manuel vers un programme supprimé retombe sur la suggestion', () => {
    const data = { ...fresh(), dayProgram: { [TODAY]: 'inconnu' } };
    assert.equal(getEffectiveDayProgram(data, TODAY).key, 'abdos');
  });
});

describe('nettoyage', () => {
  it('borne les valeurs d\'un exercice et corrige les anciens muscles', () => {
    const ex = sanitizeExercise({ id: 'tractions', name: 'Tractions', sets: 99, restSec: 1, muscles: ['triceps'], type: 'nimporte' });
    assert.ok(ex);
    assert.equal(ex.sets, 12);
    assert.equal(ex.restSec, 10);
    assert.equal(ex.type, 'isolation');
    assert.deepEqual(ex.muscles, ['dos', 'biceps']);
  });

  it('ignore les muscles inconnus et garde superset valide', () => {
    const ex = sanitizeExercise({ id: 'x', name: 'X', muscles: ['pecs', 'cerveau'], superset: 'B', step: '1,25' });
    assert.deepEqual(ex?.muscles, ['pecs']);
    assert.equal(ex?.superset, 'B');
    assert.equal(sanitizeExercise({ id: 'x', name: 'X', superset: 'Z' })?.superset, undefined);
    assert.equal(sanitizeExercise({ name: 'sans id' }), null);
  });

  it('refuse une configuration sans programmes, complète une configuration partielle', () => {
    assert.equal(sanitizeProgramConfig(null), null);
    assert.equal(sanitizeProgramConfig({}), null);
    const cfg = sanitizeProgramConfig({ programs: { haut: { label: 'Haut', exercises: [{ id: 'a', name: 'A' }] } }, weekly: { lundi: 'haut', mardi: 'fantome' } });
    assert.ok(cfg);
    assert.ok(cfg.programs['repos']);
    assert.equal(cfg.weekly.lundi, 'haut');
    assert.equal(cfg.weekly.mardi, 'repos');
    assert.equal(cfg.programs['haut']?.exercises.length, 1);
    assert.ok(cfg.order.includes('haut') && cfg.order.includes('repos'));
    assert.deepEqual(cfg.runOrder, ['hiit', 'tempo', 'longue']);
  });
});

/** Données au format de l'ancienne appli web (clé `fitcore`), avec trous et valeurs hétérogènes. */
const LEGACY = {
  workouts: {
    '2026-10-20': {
      dev_couche: [{ done: true, weight: '60', reps: '12' }, null, { done: true, weight: 62.5, reps: 10 }],
      planche_ab: [{ done: true, weight: '', reps: '45' }],
    },
    '2026-10-26': { dev_couche: [{ done: false, weight: '', reps: '' }] },
  },
  runLogs: { '2026-10-22': { done: true, duration: '30', distance: '5', rpe: '7', pace: 360 } },
  prs: { dev_couche: { weight: '62.5', reps: '10', date: '2026-10-20' } },
  activeDays: ['2026-10-20', '2026-10-20', 'pas-une-date', '2026-10-27'],
  bodyWeight: 78,
  age: 24,
  prefs: { sound: false, reminder: { enabled: true, time: '18:30', days: [1, 3, 9] }, volTargets: { pecs: [10, 20], dos: [5, 2] } },
  profile: { pseudo: 'Len', avatar: 'inconnu' },
  goals: [{ id: 'g_1', type: 'lift', exId: 'dev_couche', target: 80, startDate: '2026-10-01', start: 60 }, { id: 'g_2', type: 'bizarre', target: 5 }],
  champFutur: { a: 1 },
};

describe('normalisation des données', () => {
  const data = normalizeAppData(LEGACY, TODAY);

  it('comble les trous et convertit les types', () => {
    const sets = data.workouts['2026-10-20' as DateKey]?.['dev_couche'];
    assert.equal(sets?.length, 3);
    assert.deepEqual(sets?.[1], { done: false, weight: '', reps: '' });
    assert.deepEqual(sets?.[2], { done: true, weight: '62.5', reps: '10' });
  });

  it('nettoie les listes et les valeurs invalides', () => {
    assert.deepEqual(data.activeDays, ['2026-10-20', '2026-10-27']);
    assert.deepEqual(data.prs['dev_couche'], { weight: 62.5, reps: 10, date: '2026-10-20' });
    assert.equal(data.profile.avatar, 'red');
    assert.equal(data.profile.since, TODAY);
    assert.equal(data.goals.length, 1);
    assert.deepEqual(data.prefs.reminder, { enabled: true, time: '18:30', days: [1, 3] });
    assert.deepEqual(data.prefs.volTargets, { pecs: [10, 20] });
    assert.equal(data.prefs.sound, false);
    assert.equal(data.prefs.vibrate, true);
  });

  it('crée le journal de poids à partir de l\'ancien poids unique', () => {
    assert.deepEqual(data.weightLog, [{ date: TODAY, kg: 78 }]);
  });

  it('retient les noms des exercices du programme', () => {
    assert.equal(data.exNames['dev_couche'], 'Développé couché');
    assert.equal(data.exDefs['planche_ab']?.isTime, true);
  });

  it('conserve les clés inconnues à la sauvegarde', () => {
    const json = JSON.parse(serializeAppData(data)) as Record<string, unknown>;
    assert.deepEqual(json['champFutur'], { a: 1 });
    assert.equal(json['schemaVersion'], 1);
    assert.ok(!('extras' in json));
  });

  it("l'aller-retour JSON est stable", () => {
    const again = normalizeAppData(JSON.parse(serializeAppData(data)), TODAY);
    assert.deepEqual(again, data);
  });

  it('accepte n\'importe quoi sans planter', () => {
    for (const junk of [null, undefined, 42, 'texte', [], { workouts: 5, prefs: 'x', profile: [] }]) {
      const d = normalizeAppData(junk, TODAY);
      assert.equal(d.schemaVersion, 1);
      assert.deepEqual(d.activeDays, []);
    }
  });
});

describe('séance', () => {
  const NOW = new Date(2026, 9, 28, 18, 0, 0).getTime();
  const base = (): AppData => saveDayProgramOverride(normalizeAppData(LEGACY, TODAY), TODAY, 'pecs_tri');

  it('valide une série, active le jour et démarre le chrono', () => {
    const d = completeSet(base(), { date: TODAY, exId: 'dev_couche', idx: 0, done: true, weight: '65', reps: '10', now: NOW });
    const s = d.workouts[TODAY]?.['dev_couche']?.[0];
    assert.deepEqual(s, { done: true, weight: '65', reps: '10' });
    assert.ok(d.activeDays.includes(TODAY));
    assert.equal(d.sessionMeta[TODAY]?.start, NOW);
    assert.equal(d.sessionMeta[TODAY]?.prog?.key, 'pecs_tri');
  });

  it('ne remplace pas une charge déjà saisie', () => {
    let d = setSetField(base(), TODAY, 'dev_couche', 0, 'weight', '70');
    d = completeSet(d, { date: TODAY, exId: 'dev_couche', idx: 0, done: true, weight: '65', reps: '10', now: NOW });
    assert.equal(d.workouts[TODAY]?.['dev_couche']?.[0]?.weight, '70');
    assert.equal(d.workouts[TODAY]?.['dev_couche']?.[0]?.reps, '10');
  });

  it('annuler une série ne touche pas au reste', () => {
    let d = completeSet(base(), { date: TODAY, exId: 'dev_couche', idx: 1, done: true, weight: '60', reps: '8', now: NOW });
    d = completeSet(d, { date: TODAY, exId: 'dev_couche', idx: 1, done: false, weight: '60', reps: '8', now: NOW + 1000 });
    assert.equal(d.workouts[TODAY]?.['dev_couche']?.[1]?.done, false);
    assert.equal(d.workouts[TODAY]?.['dev_couche']?.[0]?.done, false); // trou comblé
  });

  it('le chrono ne compte que les pauses courtes', () => {
    let d = base();
    const step = (t: number) => (d = completeSet(d, { date: TODAY, exId: 'dev_couche', idx: 0, done: true, weight: '1', reps: '1', now: t }));
    step(NOW);
    step(NOW + 5 * 60_000); // +5 min : compté
    step(NOW + 5 * 60_000 + 60 * 60_000); // +1 h : pause, non compté
    assert.equal(d.sessionMeta[TODAY]?.ms, 5 * 60_000);
  });

  it('calcule progression et tonnage', () => {
    let d = base();
    for (let i = 0; i < 2; i++) {
      d = completeSet(d, { date: TODAY, exId: 'dev_couche', idx: i, done: true, weight: '60', reps: '10', now: NOW });
    }
    const p = getDayProgress(d, TODAY);
    assert.equal(p.done, 2);
    assert.equal(p.total, 2 + 2 + 2 + 4 + 4 + 3 + 3 + 3 + 3 + 3 + 3 + 3);
    assert.equal(getTonnageFor(d, TODAY), 1200);
  });

  it("le tonnage ignore les exercices chronométrés et les séries non validées", () => {
    let d = saveDayProgramOverride(fresh(), TODAY, 'abdos');
    d = completeSet(d, { date: TODAY, exId: 'planche_ab', idx: 0, done: true, weight: '20', reps: '45', now: NOW });
    d = completeSet(d, { date: TODAY, exId: 'crunchs', idx: 0, done: true, weight: '10', reps: '20', now: NOW });
    d = setSetField(d, TODAY, 'crunchs', 1, 'weight', '999');
    assert.equal(getTonnageFor(d, TODAY), 200);
  });

  it('sauter un exercice le retire du total', () => {
    let d = base();
    const before = getDayProgress(d, TODAY).total;
    d = skipExercise(d, TODAY, 'dips', true);
    assert.equal(getDayProgress(d, TODAY).total, before - 2);
    d = skipExercise(d, TODAY, 'dips', false);
    assert.equal(getDayProgress(d, TODAY).total, before);
    assert.equal(d.skipped[TODAY], undefined);
  });

  it('reporter un exercice à la fin', () => {
    const d = base();
    const r = postponeExercise(d, TODAY, 'tractions');
    assert.equal(r.status, 'moved');
    const { prog } = getEffectiveDayProgram(r.data, TODAY);
    const ids = orderedExercises(r.data, TODAY, prog).map((e) => e.id);
    assert.equal(ids[ids.length - 1], 'tractions');
    assert.equal(postponeExercise(r.data, TODAY, 'tractions').status, 'already-last');
    assert.equal(postponeExercise(r.data, TODAY, 'nimporte').status, 'not-found');
  });

  it('détecte les records et les enregistre pour la séance', () => {
    const d = base(); // record actuel : 62,5 × 10
    assert.equal(registerPR(d, { date: TODAY, exId: 'dev_couche', name: 'DC', weight: 60, reps: 12 }).isRecord, false);
    assert.equal(registerPR(d, { date: TODAY, exId: 'dev_couche', name: 'DC', weight: 62.5, reps: 10 }).isRecord, false);
    const up = registerPR(d, { date: TODAY, exId: 'dev_couche', name: 'DC', weight: 62.5, reps: 11 });
    assert.equal(up.isRecord, true);
    assert.deepEqual(up.data.prs['dev_couche'], { weight: 62.5, reps: 11, date: TODAY });
    assert.equal(up.data.sessionMeta[TODAY]?.prs?.length, 1);
    const again = registerPR(up.data, { date: TODAY, exId: 'dev_couche', name: 'DC', weight: 70, reps: 5 });
    assert.equal(again.data.sessionMeta[TODAY]?.prs?.length, 1); // remplacé, pas dupliqué
    assert.equal(registerPR(d, { date: TODAY, exId: 'nouveau', name: 'N', weight: 20, reps: 10 }).isRecord, true);
    assert.equal(registerPR(d, { date: TODAY, exId: 'nouveau', name: 'N', weight: 0, reps: 10 }).isRecord, false);
  });

  it('retrouve la dernière séance et la meilleure série', () => {
    const last = getLastSession(base(), 'dev_couche', TODAY);
    assert.equal(last?.date, '2026-10-20');
    assert.equal(last?.sets.length, 2); // la série « fantôme » (trou) n'est pas validée
    assert.deepEqual(topSet(last?.sets ?? []), { w: 62.5, r: 10 });
    assert.equal(getLastSession(base(), 'dev_couche', '2026-10-20' as DateKey), null);
  });

  it('applique une nouvelle charge aux séries restantes', () => {
    let d = completeSet(base(), { date: TODAY, exId: 'dev_couche', idx: 0, done: true, weight: '60', reps: '10', now: NOW });
    const { prog } = getEffectiveDayProgram(d, TODAY);
    const ex = dayExercises(d, TODAY, prog).find((e) => e.id === 'dev_couche');
    assert.ok(ex);
    d = applyProgressionWeight(d, TODAY, ex, 62.5);
    assert.equal(d.workouts[TODAY]?.['dev_couche']?.[0]?.weight, '60'); // validée : intacte
    assert.equal(d.workouts[TODAY]?.['dev_couche']?.[1]?.weight, '62.5');
    assert.equal(d.workouts[TODAY]?.['dev_couche']?.[3]?.weight, '62.5');
  });

  it('note de séance bornée à 600 caractères et supprimable', () => {
    let d = saveSessionNote(base(), TODAY, 'x'.repeat(700));
    assert.equal(d.sessionMeta[TODAY]?.note?.length, 600);
    d = saveSessionNote(d, TODAY, '   ');
    assert.equal(d.sessionMeta[TODAY]?.note, undefined);
  });
});

describe('supersets', () => {
  const withSuperset = (): AppData => {
    const cfg = sanitizeProgramConfig({
      programs: {
        haut: {
          label: 'Haut',
          exercises: [
            { id: 'a', name: 'A', sets: 3, restSec: 60, superset: 'A' },
            { id: 'b', name: 'B', sets: 3, restSec: 120, superset: 'A' },
            { id: 'c', name: 'C', sets: 3, restSec: 90 },
          ],
        },
      },
      weekly: { mercredi: 'haut' },
    });
    return { ...fresh(), ...(cfg ? { program: cfg } : {}) };
  };

  it('enchaîne l\'exercice suivant du superset puis reprend le repos le plus long', () => {
    let d = withSuperset();
    assert.equal(supersetNext(d, TODAY, 'a', 0)?.id, 'b');
    assert.equal(supersetRest(d, TODAY, 'a', 60), 120);
    assert.equal(supersetRest(d, TODAY, 'c', 90), 90);
    d = completeSet(d, { date: TODAY, exId: 'b', idx: 0, done: true, weight: '', reps: '', now: 1 });
    assert.equal(supersetNext(d, TODAY, 'a', 0), null);
    assert.equal(supersetNext(d, TODAY, 'c', 0), null);
  });
});

describe('remplacement d\'exercice', () => {
  const NOW = 1;
  const base = (): AppData => saveDayProgramOverride(fresh(), TODAY, 'pecs_tri');

  it('propose des exercices du même muscle, jamais ceux du jour', () => {
    const d = base();
    const { prog } = getEffectiveDayProgram(d, TODAY);
    const inDay = prog.exercises.map((e) => e.id);
    const cur = prog.exercises.find((e) => e.id === 'tractions')!;
    const found = swapCandidates(d, cur, TODAY);
    assert.ok(found.length > 0);
    assert.equal(found[0]?.muscles[0], 'dos'); // même muscle principal en tête (égalité : ordre alphabétique)
    for (const c of found) {
      assert.ok(!inDay.includes(c.id), c.id);
      assert.ok(c.type !== 'echauffement');
      assert.ok(c.muscles.some((m) => cur.muscles.includes(m)));
    }
  });

  it('aucune suggestion quand tous les exercices du muscle sont déjà au programme', () => {
    const d = base();
    const { prog } = getEffectiveDayProgram(d, TODAY);
    const cur = prog.exercises.find((e) => e.id === 'dev_couche')!;
    assert.deepEqual(swapCandidates(d, cur, TODAY), []);
  });

  it('remplace puis rétablit', () => {
    let d = base();
    const { prog } = getEffectiveDayProgram(d, TODAY);
    const cur = prog.exercises.find((e) => e.id === 'dev_couche')!;
    const swapped = buildSwapDef(cur, { id: 'dev_machine', name: 'Développé machine', type: 'compound', muscles: ['pecs'] });
    assert.equal(swapped.swappedFrom, 'dev_couche');
    assert.equal(swapped.sets, cur.sets);
    d = applySwap(d, TODAY, cur, swapped);
    const list = dayExercises(d, TODAY, prog);
    assert.ok(list.some((e) => e.id === 'dev_machine'));
    assert.ok(!list.some((e) => e.id === 'dev_couche'));
    assert.equal(d.exNames['dev_machine'], 'Développé machine');

    // série validée => retour impossible
    const done = completeSet(d, { date: TODAY, exId: 'dev_machine', idx: 0, done: true, weight: '50', reps: '10', now: NOW });
    assert.equal(revertSwap(done, TODAY, swapped).status, 'blocked');

    const back = revertSwap(d, TODAY, swapped);
    assert.equal(back.status, 'ok');
    assert.equal(back.data.swaps[TODAY], undefined);
    assert.ok(dayExercises(back.data, TODAY, prog).some((e) => e.id === 'dev_couche'));
    assert.equal(revertSwap(back.data, TODAY, cur).status, 'not-swapped');
  });

  it('un remplaçant chronométré change le format de répétitions', () => {
    const cur: Exercise = { id: 'a', name: 'A', sets: 3, repsLabel: '8-12 reps', defaultReps: 10, type: 'isolation', muscles: ['abdos'], restSec: 60 };
    const s = buildSwapDef(cur, { id: 'p', name: 'Planche', type: 'isolation', muscles: ['abdos'], isTime: true });
    assert.equal(s.isTime, true);
    assert.equal(s.repsLabel, '30-60 sec');
    assert.equal(s.defaultReps, 45);
  });
});

describe('streak et régularité', () => {
  const NOW = new Date(2026, 9, 28, 12, 0, 0);
  const withDays = (...days: string[]): AppData => ({ ...fresh(), activeDays: days as DateKey[] });

  it('compte les jours consécutifs, aujourd\'hui facultatif', () => {
    assert.equal(computeStreak(withDays(), NOW), 0);
    assert.equal(computeStreak(withDays('2026-10-27', '2026-10-26', '2026-10-25'), NOW), 3);
    assert.equal(computeStreak(withDays('2026-10-28', '2026-10-27'), NOW), 2);
    assert.equal(computeStreak(withDays('2026-10-28', '2026-10-26'), NOW), 1);
    assert.equal(computeStreak(withDays('2026-10-25'), NOW), 0);
  });

  it('régularité sur 7 jours', () => {
    assert.equal(computeRegularity(withDays(), NOW), 0);
    assert.equal(computeRegularity(withDays('2026-10-28', '2026-10-27', '2026-10-22', '2026-10-01'), NOW), 43);
    assert.equal(computeRegularity(withDays('2026-10-28', '2026-10-27', '2026-10-26', '2026-10-25', '2026-10-24', '2026-10-23', '2026-10-22'), NOW), 100);
  });
});

describe('vue de la séance du jour', () => {
  const NOW = 1;
  const base = (): AppData => saveDayProgramOverride(normalizeAppData(LEGACY, TODAY), TODAY, 'pecs_tri');

  it('jour de repos : aucune carte', () => {
    const rest = saveDayProgramOverride(fresh(), TODAY, 'repos');
    const v = buildTodayView(rest, TODAY);
    assert.equal(v.isRest, true);
    assert.deepEqual(v.exercises, []);
    assert.equal(v.isOverride, true);
  });

  it('premier exercice actif, valeurs préremplies depuis la dernière séance ou le record', () => {
    const v = buildTodayView(base(), TODAY);
    assert.equal(v.isRest, false);
    assert.equal(v.isOverride, true);
    assert.equal(v.exercises.filter((e) => e.active).length, 1);
    assert.equal(v.exercises.find((e) => e.active)?.exercise.id, 'dev_pec_echauff');
    const dc = v.exercises.find((e) => e.exercise.id === 'dev_couche')!;
    assert.equal(dc.sets[0]?.weight, '62.5'); // meilleure série de la dernière séance
    assert.equal(dc.sets[0]?.reps, '10'); // reps par défaut
    assert.equal(dc.sets[0]?.atRecord, true); // 62,5 ≥ record 62,5
    assert.equal(dc.lastTop?.w, 62.5);
    assert.equal(dc.suggestion, null); // dernière séance incomplète (2 séries / 4)
  });

  it("l'exercice actif suit la progression et enchaîne le superset", () => {
    const cfg = sanitizeProgramConfig({
      programs: { haut: { label: 'H', exercises: [
        { id: 'a', name: 'A', sets: 1, superset: 'A' }, { id: 'b', name: 'B', sets: 1, superset: 'A' }, { id: 'c', name: 'C', sets: 1 },
      ] } },
      weekly: { mercredi: 'haut' },
    })!;
    let d: AppData = { ...fresh(), program: cfg };
    let v = buildTodayView(d, TODAY);
    assert.deepEqual(v.exercises.map((e) => e.active), [true, true, false]);
    d = completeSet(d, { date: TODAY, exId: 'a', idx: 0, done: true, weight: '', reps: '', now: NOW });
    v = buildTodayView(d, TODAY);
    assert.deepEqual(v.exercises.map((e) => e.active), [false, true, false]);
    assert.equal(v.exercises[0]?.complete, true);
    d = completeSet(d, { date: TODAY, exId: 'b', idx: 0, done: true, weight: '', reps: '', now: NOW });
    assert.deepEqual(buildTodayView(d, TODAY).exercises.map((e) => e.active), [false, false, true]);
  });

  it('un exercice sauté n\'est jamais actif et ne compte pas', () => {
    const d = skipExercise(base(), TODAY, 'dev_pec_echauff', true);
    const v = buildTodayView(d, TODAY);
    assert.equal(v.exercises[0]?.skipped, true);
    assert.deepEqual(v.exercises[0]?.sets, []);
    assert.equal(v.exercises.find((e) => e.active)?.exercise.id, 'tractions');
  });

  it('suggestion « monter » détectée puis marquée comme appliquée', () => {
    const full = setSetField(setSetField(setSetField(setSetField(base(), '2026-10-21' as DateKey, 'dev_couche', 0, 'done', true), '2026-10-21' as DateKey, 'dev_couche', 1, 'done', true), '2026-10-21' as DateKey, 'dev_couche', 2, 'done', true), '2026-10-21' as DateKey, 'dev_couche', 3, 'done', true);
    let d = full;
    for (let i = 0; i < 4; i++) {
      d = setSetField(d, '2026-10-21' as DateKey, 'dev_couche', i, 'weight', '60');
      d = setSetField(d, '2026-10-21' as DateKey, 'dev_couche', i, 'reps', '12');
    }
    let ex = buildTodayView(d, TODAY).exercises.find((e) => e.exercise.id === 'dev_couche')!;
    assert.equal(ex.suggestion?.kind, 'up');
    assert.equal(ex.suggestionApplied, false);
    d = applyProgressionWeight(d, TODAY, ex.exercise, 62.5);
    ex = buildTodayView(d, TODAY).exercises.find((e) => e.exercise.id === 'dev_couche')!;
    assert.equal(ex.suggestionApplied, true);
  });

  it('tonnage, bouton de résumé et note de séance', () => {
    let d = base();
    assert.equal(buildTodayView(d, TODAY).showSummaryButton, false);
    d = completeSet(d, { date: TODAY, exId: 'dev_couche', idx: 0, done: true, weight: '100', reps: '10', now: NOW });
    d = saveSessionNote(d, TODAY, 'Bonne séance');
    const v = buildTodayView(d, TODAY);
    assert.equal(v.tonnage, 1000);
    assert.deepEqual(v.funEquivalent, { count: 1.7, name: 'vaches' });
    assert.equal(v.showSummaryButton, true);
    assert.equal(v.sessionNote, 'Bonne séance');
  });
});

describe('résumé de séance', () => {
  const NOW = 1;
  it('agrège séries, tonnage, programme, records et notes', () => {
    let d = saveDayProgramOverride(fresh(), TODAY, 'pecs_tri');
    d = completeSet(d, { date: TODAY, exId: 'dev_couche', idx: 0, done: true, weight: '60', reps: '10', now: NOW });
    d = completeSet(d, { date: TODAY, exId: 'dev_couche', idx: 1, done: true, weight: '60', reps: '8', now: NOW });
    d = completeSet(d, { date: TODAY, exId: 'tractions', idx: 0, done: true, weight: '', reps: '10', now: NOW });
    d = registerPR(d, { date: TODAY, exId: 'dev_couche', name: 'Développé couché', weight: 60, reps: 10 }).data;
    const s = sessionSummary(d, TODAY);
    assert.equal(s.sets, 3);
    assert.equal(s.tonnage, 1080);
    assert.equal(s.program?.key, 'pecs_tri');
    assert.deepEqual(s.exercises.map((e) => e.id), ['tractions', 'dev_couche']); // ordre du programme
    assert.equal(s.prs.length, 1);
    assert.equal(s.exercises[1]?.name, 'Développé couché');
  });

  it('séance vide : rien à résumer', () => {
    const s = sessionSummary(fresh(), TODAY);
    assert.equal(s.sets, 0);
    assert.equal(s.program, null);
    assert.deepEqual(s.exercises, []);
  });
});

describe('jour de repos', () => {
  it('trouve la prochaine séance et la dernière réalisée', () => {
    const d = normalizeAppData(LEGACY, TODAY);
    const rest = saveDayProgramOverride(d, TODAY, 'repos');
    const info = restDayInfo(rest, TODAY);
    assert.equal(info.next?.date, '2026-10-29'); // jeudi : pecs/triceps
    assert.equal(info.next?.name, DEFAULT_PROGRAMS['pecs_tri']?.fullName);
    assert.equal(info.last?.date, '2026-10-27');
    assert.equal(restDayInfo(fresh(), TODAY).last, null);
  });
});
