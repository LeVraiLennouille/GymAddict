import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import type { AppData, DateKey, Exercise } from '../src/domain/types';
import { emptyAppData, normalizeAppData, serializeAppData } from '../src/domain/rules/appData';
import { dayExercises, getEffectiveDayProgram, getProgramConfig, sanitizeExercise, sanitizeProgramConfig } from '../src/domain/rules/program';
import { getDayProgress } from '../src/domain/rules/sets';
import { getProgressionSuggestion } from '../src/domain/rules/progression';
import { buildTodayView } from '../src/domain/rules/todayView';
import { buildPrTimeline, liftHistory } from '../src/domain/rules/statsView';
import { customExercise, exerciseLibrary, exerciseTemplate } from '../src/domain/rules/swap';
import {
  DEFAULT_EQUIPMENT, describePlates, getEquipment, getUnit, platesFor, plateColor, plateScale,
} from '../src/domain/rules/plates';
import {
  elapsedSeconds, progressToTarget, remainingToTarget, stopwatchElapsedMs, stopwatchInitial, stopwatchPause, stopwatchRunning, stopwatchStart,
} from '../src/domain/rules/stopwatch';
import {
  displayMassInput, fmtMass, fmtMassUnit, fmtTonnageIn, fmtTonnageValue, fromUnit, kgToLb, lbToKg, parseMassInput, toUnit,
} from '../src/domain/format/units';
import { addDayExercise, removeDayExercise } from '../src/domain/actions/exercises';
import { defaultEquipment, resetEquipment, setBarWeight, setThemeMode, setUnit, togglePlate } from '../src/domain/actions/settings';
import { applyTemplate } from '../src/domain/actions/templates';
import { PROGRAM_TEMPLATES, findTemplate } from '../src/domain/defaults/templates';
import { completeSet, registerPR, saveDayProgramOverride } from '../src/domain/actions/workout';
import { setRunDay } from '../src/domain/actions/program';
import { buildHistory, fmtSetLine } from '../src/domain/rules/history';
import { buildGoalRows } from '../src/domain/rules/goals';
import { DAYS_ORDER } from '../src/domain/defaults/constants';

const TODAY = '2026-10-28' as DateKey; // mercredi → « abdos » par défaut
const k = (s: string): DateKey => s as DateKey;
const fresh = (): AppData => emptyAppData(TODAY);
const gymDay = (): AppData => saveDayProgramOverride(fresh(), TODAY, 'pecs_tri');

describe('unités kg / lb', () => {
  it('conversions et arrondis', () => {
    assert.equal(toUnit(60, 'kg'), 60);
    assert.equal(toUnit(60, 'lb'), 132.3);
    assert.equal(fromUnit(135, 'lb'), 61.235);
    assert.equal(fromUnit(62.5, 'kg'), 62.5);
    assert.ok(Math.abs(kgToLb(lbToKg(200)) - 200) < 1e-9);
  });

  it('affichage', () => {
    assert.equal(fmtMass(62.5, 'kg'), '62,5');
    assert.equal(fmtMassUnit(62.5, 'kg'), '62,5 kg');
    assert.equal(fmtMassUnit(62.369, 'lb'), '137,5 lb');
    assert.equal(fmtTonnageIn(850, 'kg'), '850 kg');
    assert.ok(fmtTonnageIn(1250, 'kg').endsWith(' t'));
    assert.match(fmtTonnageIn(1000, 'lb'), /^2\D205 lb$/);
    assert.match(fmtTonnageValue(1000, 'lb'), /^2\D205$/);
  });

  it('saisie : aller-retour sans dérive', () => {
    for (const lb of ['135', '137,5', '45', '225', '97.5']) {
      const stored = parseMassInput(lb, 'lb');
      assert.equal(displayMassInput(stored, 'lb'), lb.replace('.', ','), lb);
    }
    assert.equal(parseMassInput('62,5', 'kg'), '62.5');
    assert.equal(displayMassInput('62.5', 'kg'), '62,5');
    assert.equal(parseMassInput('', 'kg'), '');
    assert.equal(parseMassInput('abc', 'lb'), '');
    assert.equal(parseMassInput('-5', 'kg'), '');
    assert.equal(displayMassInput('', 'lb'), '');
  });

  it('palier de progression adapté à l\'unité (5 lb par défaut)', () => {
    const ex: Exercise = { id: 'dev', name: 'DC', sets: 3, repsLabel: '8-12 reps', defaultReps: 10, type: 'compound', muscles: ['pecs'], restSec: 120 };
    const last = { date: TODAY, sets: [1, 2, 3].map(() => ({ done: true, weight: '60', reps: '12' })) };
    assert.deepEqual(getProgressionSuggestion(ex, last, 'kg'), { kind: 'up', from: 60, weight: 62.5, step: 2.5, target: 8 });

    // charges saisies en livres (135 lb enregistrés en kg)
    const lbLast = { date: TODAY, sets: [1, 2, 3].map(() => ({ done: true, weight: parseMassInput('135', 'lb'), reps: '12' })) };
    const lb = getProgressionSuggestion(ex, lbLast, 'lb');
    assert.equal(lb?.kind === 'up' ? toUnit(lb.step, 'lb') : -1, 5);
    assert.equal(toUnit(lb?.weight ?? 0, 'lb'), 140);
    const small = getProgressionSuggestion({ ...ex, step: 1.25 }, lbLast, 'lb'); // 1,25 kg ≈ 2,8 lb -> 3 lb, mini 2,5
    assert.equal(toUnit(small?.weight ?? 0, 'lb'), 138);
  });

  it('historique et objectifs affichés dans l\'unité choisie', () => {
    let d = completeSet(gymDay(), { date: TODAY, exId: 'dev_couche', idx: 0, done: true, weight: '100', reps: '10', now: 1 });
    assert.ok(buildHistory(d)[0]?.rows[0]?.meta.includes('1 t'));
    d = setUnit(d, 'lb');
    assert.match(buildHistory(d)[0]?.rows[0]?.meta ?? '', /2\D205 lb/);
    assert.equal(fmtSetLine('60', '10', false, 'kg'), '60 kg × 10');
    assert.equal(fmtSetLine('60', '10', false, 'lb'), '132,3 lb × 10');
    assert.equal(fmtSetLine('', '45', true), '45 s');
    const goal = { id: 'g', type: 'weight' as const, target: 70, startDate: k('2026-09-01'), start: 80 };
    let w: AppData = { ...fresh(), goals: [goal], weightLog: [{ date: k('2026-09-01'), kg: 80 }, { date: k('2026-10-20'), kg: 78 }] };
    assert.ok(buildGoalRows(w, new Date(2026, 9, 28))[0]?.etaText.includes('kg/sem.'));
    w = setUnit(w, 'lb');
    assert.ok(buildGoalRows(w, new Date(2026, 9, 28))[0]?.etaText.includes('lb/sem.'));
  });
});

describe('disques et barre', () => {
  const kg = DEFAULT_EQUIPMENT.kg;
  const lb = DEFAULT_EQUIPMENT.lb;

  it('charge répartie de chaque côté, plus gros disques d\'abord', () => {
    assert.deepEqual(platesFor(62.5, kg).perSide, [20, 1.25]);
    assert.deepEqual(platesFor(100, kg).perSide, [25, 15]);
    assert.deepEqual(platesFor(60, kg).perSide, [20]);
    assert.deepEqual(platesFor(140, kg).perSide, [25, 25, 10]);
    assert.equal(platesFor(62.5, kg).exact, true);
    assert.equal(platesFor(62.5, kg).achieved, 62.5);
  });

  it('barre seule, charge inférieure à la barre, charge impossible', () => {
    assert.deepEqual(platesFor(20, kg), { bar: 20, perSide: [], achieved: 20, exact: true, belowBar: false });
    const below = platesFor(15, kg);
    assert.equal(below.belowBar, true);
    assert.equal(below.exact, false);
    assert.equal(below.achieved, 20);
    const odd = platesFor(22, kg); // 1 kg de chaque côté : aucun disque
    assert.equal(odd.exact, false);
    assert.equal(odd.achieved, 20);
  });

  it('avec le matériel réellement disponible', () => {
    const limited = { bar: 20, plates: [20, 10, 5] };
    const load = platesFor(62.5, limited);
    assert.deepEqual(load.perSide, [20]);
    assert.equal(load.exact, false);
    assert.equal(load.achieved, 60);
    assert.deepEqual(platesFor(100, { bar: 20, plates: [] }).perSide, []);
  });

  it('livres', () => {
    assert.deepEqual(platesFor(135, lb).perSide, [45]);
    assert.deepEqual(platesFor(225, lb).perSide, [45, 45]);
    assert.equal(describePlates(platesFor(225, lb)), '2 × 45');
    assert.equal(describePlates(platesFor(62.5, kg)), '20 + 1,25');
    assert.equal(describePlates(platesFor(20, kg)), 'barre seule');
  });

  it('couleurs et tailles de dessin', () => {
    assert.equal(plateColor(20, 'kg'), '#1E5BD6');
    assert.equal(plateColor(25, 'kg'), '#E5323F');
    assert.equal(plateColor(45, 'lb'), '#1E5BD6'); // 45 lb ≈ 20 kg
    assert.ok(plateScale(25, 'kg') >= plateScale(10, 'kg'));
    assert.ok(plateScale(10, 'kg') > plateScale(1.25, 'kg'));
    assert.ok(plateScale(1.25, 'kg') >= 0.3);
  });

  it('réglages : barre, disques, retour aux valeurs par défaut', () => {
    let d = fresh();
    assert.deepEqual(getEquipment(d), DEFAULT_EQUIPMENT.kg);
    d = setBarWeight(d, 'kg', 15);
    d = togglePlate(d, 'kg', 25); // retiré
    d = togglePlate(d, 'kg', 0.5); // ajouté, en dernier
    assert.deepEqual(getEquipment(d), { bar: 15, plates: [20, 15, 10, 5, 2.5, 1.25, 0.5] });
    assert.deepEqual(getEquipment(d, 'lb'), DEFAULT_EQUIPMENT.lb); // l'autre unité n'est pas touchée
    assert.equal(setBarWeight(d, 'kg', -3), d);
    assert.equal(setBarWeight(d, 'kg', 500), d);
    assert.equal(togglePlate(d, 'kg', 0), d);
    const back = normalizeAppData(JSON.parse(serializeAppData(d)), TODAY);
    assert.deepEqual(getEquipment(back), getEquipment(d));
    const reset = resetEquipment(d, 'kg');
    assert.equal(reset.prefs.equipment, undefined);
    assert.deepEqual(defaultEquipment('lb'), DEFAULT_EQUIPMENT.lb);
  });

  it('préférences : lecture tolérante de l\'unité, du thème et du matériel', () => {
    const d = normalizeAppData({ prefs: { unit: 'lb', theme: 'dark', equipment: { lb: { bar: 45, plates: [10, 45, 10, 'x', -5, 0] }, kg: 'n' } } }, TODAY);
    assert.equal(getUnit(d), 'lb');
    assert.equal(d.prefs.theme, 'dark');
    assert.deepEqual(d.prefs.equipment, { lb: { bar: 45, plates: [45, 10] } });
    const junk = normalizeAppData({ prefs: { unit: 'stone', theme: 'rose', equipment: 5 } }, TODAY);
    assert.equal(junk.prefs.unit, undefined);
    assert.equal(junk.prefs.theme, undefined);
    assert.equal(junk.prefs.equipment, undefined);
    assert.equal(getUnit(junk), 'kg');
    assert.equal(setThemeMode(fresh(), 'light').prefs.theme, 'light');
  });
});

describe('chronomètre d\'une série', () => {
  it('démarre, se met en pause, reprend', () => {
    let s = stopwatchInitial();
    assert.equal(stopwatchRunning(s), false);
    assert.equal(stopwatchElapsedMs(s, 5000), 0);
    s = stopwatchStart(s, 1000);
    assert.equal(stopwatchRunning(s), true);
    assert.equal(stopwatchElapsedMs(s, 4500), 3500);
    s = stopwatchPause(s, 4500);
    assert.equal(stopwatchRunning(s), false);
    assert.equal(stopwatchElapsedMs(s, 99999), 3500); // figé en pause
    s = stopwatchStart(s, 10_000);
    assert.equal(stopwatchElapsedMs(s, 12_000), 5500);
    assert.equal(elapsedSeconds(s, 12_000), 5);
  });

  it('démarrer ou mettre en pause deux fois ne change rien', () => {
    const s = stopwatchStart(stopwatchInitial(), 1000);
    assert.equal(stopwatchStart(s, 5000), s);
    const p = stopwatchPause(s, 2000);
    assert.equal(stopwatchPause(p, 9000), p);
  });

  it('compte à rebours et progression vers la cible', () => {
    let s = stopwatchStart(stopwatchInitial(), 0);
    assert.equal(remainingToTarget(s, 0, 45), 45);
    assert.equal(remainingToTarget(s, 10_200, 45), 35); // arrondi supérieur : 34,8 s -> 35 s
    assert.equal(remainingToTarget(s, 45_000, 45), 0);
    assert.equal(remainingToTarget(s, 60_000, 45), 0);
    assert.equal(progressToTarget(s, 22_500, 45), 0.5);
    assert.equal(progressToTarget(s, 90_000, 45), 1);
    assert.equal(progressToTarget(s, 5000, 0), 0);
    s = stopwatchPause(s, 3000);
    assert.equal(remainingToTarget(s, 99_000, 10), 7);
  });

  it('une horloge qui recule ne donne jamais de temps négatif', () => {
    const s = stopwatchStart(stopwatchInitial(), 5000);
    assert.equal(stopwatchElapsedMs(s, 4000), 0);
    assert.equal(stopwatchPause(s, 4000).accumulatedMs, 0);
  });
});

describe('exercice ajouté à la volée', () => {
  const extra = (d: AppData, id = 'leg_curl') => {
    const ex = exerciseTemplate(d, id);
    assert.ok(ex);
    return ex;
  };

  it('modèle repris du programme, sinon de la définition connue', () => {
    const d = fresh();
    const fromProgram = exerciseTemplate(d, 'curl_ez_bar');
    assert.equal(fromProgram?.sets, 3);
    assert.equal(fromProgram?.repsLabel, '12-15 reps');
    assert.equal(exerciseTemplate(d, 'inconnu'), null);
    const known = { ...d, exDefs: { vieux: { id: 'vieux', name: 'Ancien', type: 'isolation' as const, muscles: ['dos' as const], isTime: true } } };
    const t = exerciseTemplate(known, 'vieux');
    assert.equal(t?.isTime, true);
    assert.equal(t?.repsLabel, '30-60 sec');
    const own = customExercise('Mon exo', ['pecs'], 'compound', 4096);
    assert.equal(own.id, 'ex_35s');
    assert.equal(own.restSec, 120);
  });

  it('s\'ajoute à la séance du jour et compte dans l\'avancement', () => {
    const d = gymDay();
    const before = getDayProgress(d, TODAY).total;
    const res = addDayExercise(d, TODAY, extra(d, 'leg_extension'));
    assert.ok(res.ok);
    if (!res.ok) return;
    const { prog } = getEffectiveDayProgram(res.data, TODAY);
    assert.ok(dayExercises(res.data, TODAY, prog).some((e) => e.id === 'leg_extension'));
    assert.equal(getDayProgress(res.data, TODAY).total, before + 3);
    const view = buildTodayView(res.data, TODAY).exercises;
    assert.equal(view.find((e) => e.exercise.id === 'leg_extension')?.added, true);
    assert.equal(view.find((e) => e.exercise.id === 'dev_couche')?.added, false);
    // le programme lui-même n'est pas modifié
    assert.equal(getProgramConfig(res.data).programs['pecs_tri']?.exercises.length, getProgramConfig(d).programs['pecs_tri']?.exercises.length);
    // et il survit à un rechargement
    const back = normalizeAppData(JSON.parse(serializeAppData(res.data)), TODAY);
    assert.deepEqual(back.addedExercises, res.data.addedExercises);
  });

  it('bibliothèque : ce qui n\'est pas déjà dans la séance, par ordre alphabétique', () => {
    const d = gymDay();
    const lib = exerciseLibrary(d, TODAY);
    assert.ok(lib.length > 10);
    assert.ok(!lib.some((i) => i.id === 'dev_couche'), 'déjà au programme du jour');
    const legCurl = lib.find((i) => i.id === 'leg_curl');
    assert.deepEqual(legCurl?.muscles, ['jambes']);
    const names = lib.map((i) => i.name);
    assert.deepEqual(names, [...names].sort((a, b) => a.localeCompare(b)));
    // une fois ajouté, l'exercice sort de la bibliothèque
    const added = addDayExercise(d, TODAY, exerciseTemplate(d, 'leg_curl') as Exercise);
    assert.ok(added.ok);
    if (added.ok) assert.ok(!exerciseLibrary(added.data, TODAY).some((i) => i.id === 'leg_curl'));
  });

  it('refusé un jour de repos, si l\'exercice est déjà au programme, ou si invalide', () => {
    assert.deepEqual(addDayExercise(saveDayProgramOverride(fresh(), TODAY, 'repos'), TODAY, extra(fresh())), { ok: false, error: 'rest-day' });
    assert.deepEqual(addDayExercise(gymDay(), TODAY, extra(gymDay(), 'dev_couche')), { ok: false, error: 'already-in-day' });
    const once = addDayExercise(gymDay(), TODAY, extra(gymDay()));
    assert.ok(once.ok);
    if (once.ok) assert.deepEqual(addDayExercise(once.data, TODAY, extra(gymDay())), { ok: false, error: 'already-in-day' });
    assert.deepEqual(addDayExercise(gymDay(), TODAY, { ...extra(gymDay()), name: '   ' }), { ok: false, error: 'invalid' });
  });

  it('un exercice remplacé laisse son identifiant d\'origine inutilisable', () => {
    // dips est au programme : l'ajouter à nouveau est refusé même s'il a été remplacé par une machine
    const base = gymDay();
    const swapped = { ...base, swaps: { [TODAY]: { dips: { ...extra(base, 'dips'), id: 'dips_machine', swappedFrom: 'dips', swappedName: 'Dips' } } } };
    assert.deepEqual(addDayExercise(swapped, TODAY, extra(base, 'dips')), { ok: false, error: 'already-in-day' });
  });

  it('se retire tant qu\'aucune série n\'est validée, en nettoyant tout', () => {
    const d = gymDay();
    const added = addDayExercise(d, TODAY, extra(d));
    assert.ok(added.ok);
    if (!added.ok) return;
    assert.deepEqual(removeDayExercise(added.data, TODAY, 'dev_couche'), { ok: false, error: 'not-added' });
    const started = completeSet(added.data, { date: TODAY, exId: 'leg_curl', idx: 0, done: true, weight: '20', reps: '12', now: 1 });
    assert.deepEqual(removeDayExercise(started, TODAY, 'leg_curl'), { ok: false, error: 'has-sets' });
    const removed = removeDayExercise(added.data, TODAY, 'leg_curl');
    assert.ok(removed.ok);
    if (removed.ok) {
      assert.equal(removed.data.addedExercises[TODAY], undefined);
      assert.equal(buildTodayView(removed.data, TODAY).exercises.some((e) => e.exercise.id === 'leg_curl'), false);
    }
  });
});

describe('1RM estimé et frise des records', () => {
  const d0 = (): AppData => {
    let d = gymDay();
    d = completeSet(d, { date: k('2026-10-20'), exId: 'dev_couche', idx: 0, done: true, weight: '100', reps: '5', now: 1 });
    d = completeSet(d, { date: k('2026-10-20'), exId: 'dev_couche', idx: 1, done: true, weight: '80', reps: '10', now: 2 });
    return d;
  };

  it('la meilleure série donne le 1RM de la séance', () => {
    const h = liftHistory(d0(), 'dev_couche');
    assert.equal(h.length, 1);
    assert.equal(h[0]?.max, 100);
    assert.equal(h[0]?.oneRm, 112.5); // 100 × 5 > 80 × 10 (106,7)
  });

  it('répétitions vides : 10 par défaut', () => {
    const d = completeSet(gymDay(), { date: k('2026-10-21'), exId: 'dev_couche', idx: 0, done: true, weight: '60', reps: '', now: 1 });
    assert.equal(liftHistory(d, 'dev_couche')[0]?.oneRm, 80);
  });

  it('frise : plus récent d\'abord, regroupée par mois', () => {
    let d = fresh();
    d = registerPR(d, { date: k('2026-09-15'), exId: 'dev_couche', name: 'Développé couché', weight: 90, reps: 5 }).data;
    d = registerPR(d, { date: k('2026-10-20'), exId: 'dev_couche', name: 'Développé couché', weight: 100, reps: 5 }).data;
    d = registerPR(d, { date: k('2026-10-20'), exId: 'squat', name: 'Squat', weight: 140, reps: 1 }).data;
    const t = buildPrTimeline(d);
    assert.deepEqual(t.map((m) => [m.key, m.events.length]), [['2026-10', 2], ['2026-09', 1]]);
    assert.deepEqual(t[0]?.events.map((e) => e.name), ['Squat', 'Développé couché']); // même jour : le plus lourd d'abord
    assert.equal(t[0]?.events[1]?.oneRm, 112.5);
    assert.equal(t[0]?.events[0]?.oneRm, 140); // une répétition : la charge elle-même
    assert.equal(buildPrTimeline(d, 1).flatMap((m) => m.events).length, 1);
    assert.deepEqual(buildPrTimeline(fresh()), []);
  });
});

describe('bibliothèque de programmes', () => {
  it('au moins PPL, haut/bas et 5×5', () => {
    for (const id of ['ppl3', 'ppl6', 'upper_lower', 'five_by_five']) assert.ok(findTemplate(id), id);
    assert.equal(findTemplate('inconnu'), undefined);
  });

  for (const t of PROGRAM_TEMPLATES) {
    it(`modèle « ${t.name} » : données cohérentes`, () => {
      assert.equal(new Set(PROGRAM_TEMPLATES.map((x) => x.id)).size, PROGRAM_TEMPLATES.length);
      assert.deepEqual([...t.order].sort(), Object.keys(t.programs).sort());
      assert.equal(Object.keys(t.weekly).length, t.daysPerWeek, 'jours par semaine annoncés');
      for (const day of Object.keys(t.weekly)) assert.ok(DAYS_ORDER.includes(day as never), day);
      for (const id of Object.values(t.weekly)) assert.ok(id && t.programs[id], `séance inconnue ${id}`);
      for (const [key, p] of Object.entries(t.programs)) {
        assert.ok(p.exercises.length >= 3, `${key} : trop peu d'exercices`);
        assert.equal(new Set(p.exercises.map((e) => e.id)).size, p.exercises.length, `${key} : identifiants en double`);
        for (const ex of p.exercises) {
          assert.deepEqual(sanitizeExercise(ex), ex, `${key}/${ex.id} : modifié par le nettoyage`);
          assert.ok(ex.muscles.length > 0, `${key}/${ex.id} : sans muscle`);
        }
      }
    });
  }

  it('ajout : les séances s\'ajoutent sans toucher au planning, doublons renumérotés', () => {
    const t = findTemplate('ppl3');
    assert.ok(t);
    const before = getProgramConfig(fresh());
    const first = applyTemplate(fresh(), t, 'add');
    const cfg = getProgramConfig(first.data);
    assert.deepEqual(first.programIds, ['ppl_push', 'ppl_pull', 'ppl_legs']);
    assert.deepEqual(cfg.weekly, before.weekly);
    assert.equal(cfg.order[cfg.order.length - 1], 'repos');
    assert.ok(cfg.order.includes('ppl_push'));
    assert.deepEqual(sanitizeProgramConfig(cfg), cfg);
    const second = applyTemplate(first.data, t, 'add');
    assert.deepEqual(second.programIds, ['ppl_push_2', 'ppl_pull_2', 'ppl_legs_2']);
    assert.equal(getProgramConfig(second.data).programs['ppl_push']?.exercises.length, 6);
    assert.equal(second.data.exNames['rowing_barre'], 'Rowing Barre Penché');
  });

  it('remplacement : planning du modèle, anciennes séances supprimées, sorties conservées', () => {
    const t = findTemplate('upper_lower');
    assert.ok(t);
    let d = setRunDay(fresh(), 'samedi', 'hiit');
    d = saveDayProgramOverride(d, k('2026-10-20'), 'jambes');
    d = saveDayProgramOverride(d, k('2026-10-21'), 'repos');
    const res = applyTemplate(d, t, 'replace');
    const cfg = getProgramConfig(res.data);
    assert.deepEqual(Object.keys(cfg.programs).sort(), ['repos', 'ul_lower_a', 'ul_lower_b', 'ul_upper_a', 'ul_upper_b']);
    assert.deepEqual(cfg.order, ['ul_upper_a', 'ul_lower_a', 'ul_upper_b', 'ul_lower_b', 'repos']);
    assert.equal(cfg.weekly.lundi, 'ul_upper_a');
    assert.equal(cfg.weekly.mercredi, 'repos');
    assert.equal(cfg.weekly.dimanche, 'repos');
    assert.equal(cfg.runWeekly.samedi, 'hiit');
    assert.equal(res.data.dayProgram[k('2026-10-20')], undefined); // « jambes » n'existe plus
    assert.equal(res.data.dayProgram[k('2026-10-21')], 'repos');
    assert.deepEqual(sanitizeProgramConfig(cfg), cfg);
    // le lundi 26 octobre (séance de force haut du corps)
    assert.equal(getEffectiveDayProgram(res.data, k('2026-10-26')).key, 'ul_upper_a');
  });

  it('un modèle importé reste jouable : les exercices connus gardent leurs records', () => {
    const t = findTemplate('five_by_five');
    assert.ok(t);
    let d = registerPR(fresh(), { date: k('2026-10-20'), exId: 'squat', name: 'Squat (Barre)', weight: 120, reps: 5 }).data;
    d = applyTemplate(d, t, 'replace').data;
    d = saveDayProgramOverride(d, TODAY, 'fx_a');
    const squat = buildTodayView(d, TODAY).exercises.find((e) => e.exercise.id === 'squat');
    assert.equal(squat?.record?.weight, 120);
    assert.equal(squat?.exercise.sets, 5);
  });
});
