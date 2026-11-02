import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import type { AppData, DateKey, Goal } from '../src/domain/types';
import { emptyAppData, normalizeAppData } from '../src/domain/rules/appData';
import {
  allExercises,
  buildHeatmap,
  buildPrList,
  liftHistory,
  muscleVolumes,
  weeklyTonnageHistory,
  weightPoints,
} from '../src/domain/rules/statsView';
import {
  barChartGeometry,
  chartTicks,
  fmtDayMonth,
  lineChartGeometry,
  radarGeometry,
  weightChartGeometry,
} from '../src/domain/rules/charts';
import { buildGoalRows, goalCurrent, goalEta, goalProgress, linSlope } from '../src/domain/rules/goals';
import { buildVolumeView, fmtSets, volumeTargets, weekMonday } from '../src/domain/rules/volume';
import { buildHistory, sessionDates, tonnageDelta, previousSimilar } from '../src/domain/rules/history';
import { sessionSummary } from '../src/domain/rules/summary';
import { checkGoalsAchieved, deleteGoal, saveGoal } from '../src/domain/actions/goals';
import { addWeightEntry, deleteWeightEntry } from '../src/domain/actions/weight';
import { resetVolumeTargets, saveVolumeTargets } from '../src/domain/actions/volume';
import { duplicateSession } from '../src/domain/actions/history';
import { completeSet, saveDayProgramOverride, setSetField } from '../src/domain/actions/workout';
import { setRunDone } from '../src/domain/actions/cardio';
import { saveBodyWeightEntry } from '../src/domain/actions/profile';

const TODAY = '2026-10-28' as DateKey; // mercredi
const NOW = new Date(2026, 9, 28, 12, 0, 0);
const fresh = (): AppData => emptyAppData(TODAY);
const k = (s: string): DateKey => s as DateKey;

/** Remplit `n` séries validées d'un exercice à une date. */
function lift(d: AppData, date: string, exId: string, w: string, r: string, n = 3): AppData {
  let out = d;
  for (let i = 0; i < n; i++) {
    out = completeSet(out, { date: k(date), exId, idx: i, done: true, weight: w, reps: r, now: 1 });
  }
  return out;
}

describe('graphiques : géométrie', () => {
  it('graduations de l\'axe', () => {
    assert.deepEqual(chartTicks(3), [0, 1, 2]);
    assert.deepEqual(chartTicks(5), [0, 1, 2, 3, 4]);
    assert.deepEqual(chartTicks(9), [0, 2, 4, 6, 8]);
    assert.equal(fmtDayMonth(k('2026-10-28')), '28/10');
  });

  it('courbe : un point au centre, plusieurs points alignés sur la grille', () => {
    const one = lineChartGeometry([{ key: k('2026-10-01'), value: 60 }]);
    assert.equal(one.points[0]?.x, 175);
    assert.equal(one.area, '');
    const g = lineChartGeometry([
      { key: k('2026-10-01'), value: 60 },
      { key: k('2026-10-08'), value: 70 },
      { key: k('2026-10-15'), value: 65 },
    ]);
    assert.equal(g.points[0]?.x, 42);
    assert.equal(g.points[2]?.x, 308);
    assert.ok((g.points[1]?.y ?? 0) < (g.points[0]?.y ?? 0)); // 70 kg plus haut que 60 kg
    assert.equal(g.yTicks.length, 3);
    assert.ok(g.area.endsWith('Z'));
    assert.equal(g.xTicks[0]?.anchor, 'start');
    assert.equal(g.xTicks[2]?.anchor, 'end');
    assert.equal(g.dotRadius, 3.5);
  });

  it('histogramme : hauteurs proportionnelles', () => {
    const g = barChartGeometry([
      { key: k('2026-10-05'), value: 1000 },
      { key: k('2026-10-12'), value: 2000 },
    ]);
    assert.equal(g.bars.length, 2);
    assert.ok((g.bars[1]?.height ?? 0) > (g.bars[0]?.height ?? 0));
    assert.equal(g.yTicks[0]?.label, '0');
    assert.ok((g.yTicks[2]?.label ?? '').endsWith(' t'));
  });

  it('radar : 7 axes, aire seulement s\'il y a des données', () => {
    const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const empty = radarGeometry([0, 0, 0, 0, 0, 0, 0], labels);
    assert.equal(empty.hasData, false);
    assert.equal(empty.rings.length, 4);
    assert.equal(empty.spokes.length, 7);
    const g = radarGeometry([100, 50, 0, 0, 0, 0, 0], labels);
    assert.equal(g.hasData, true);
    assert.equal(g.dots[0]?.y, 145 - 92); // axe du haut, plein rayon
    assert.equal(g.labels[0]?.anchor, 'middle');
    assert.equal(g.labels.length, 7);
  });

  it('poids : au moins deux pesées', () => {
    assert.equal(weightChartGeometry([{ date: k('2026-10-01'), kg: 80 }]), null);
    const g = weightChartGeometry([
      { date: k('2026-10-01'), kg: 80 },
      { date: k('2026-10-11'), kg: 78 },
    ]);
    assert.ok(g);
    assert.equal(g.points[0]?.x, 38);
    assert.equal(g.points[1]?.x, 308);
    assert.ok((g.points[1]?.y ?? 0) > (g.points[0]?.y ?? 0)); // 78 plus bas que 80
    assert.equal(g.xFirst.label, '2026-10-01');
  });
});

describe('statistiques', () => {
  let d = fresh();
  d = lift(d, '2026-10-12', 'dev_couche', '60', '10'); // lundi 12
  d = lift(d, '2026-10-14', 'dev_couche', '62.5', '8'); // même semaine
  d = lift(d, '2026-10-21', 'dev_couche', '65', '10'); // semaine suivante

  it('historique des charges par séance', () => {
    const h = liftHistory(d, 'dev_couche');
    assert.deepEqual(h.map((p) => [p.date, p.max]), [['2026-10-12', 60], ['2026-10-14', 62.5], ['2026-10-21', 65]]);
    assert.equal(liftHistory(d, 'inconnu').length, 0);
  });

  it('tonnage par semaine (lundi)', () => {
    assert.deepEqual(weeklyTonnageHistory(d, 'dev_couche'), [
      { week: '2026-10-12', tonnage: 3 * 600 + 3 * 500 },
      { week: '2026-10-19', tonnage: 3 * 650 },
    ]);
  });

  it('liste des exercices : programme + historique, triée', () => {
    const named = { ...d, workouts: { ...d.workouts, [k('2026-09-01')]: { vieux: [{ done: true, weight: '10', reps: '10' }] } }, exNames: { ...d.exNames, vieux: 'Ancien exo' } };
    const all = allExercises(named);
    assert.ok(all.some((e) => e.id === 'dev_couche'));
    assert.ok(all.some((e) => e.id === 'vieux'));
    const names = all.map((e) => e.name);
    assert.deepEqual(names, [...names].sort((a, b) => a.localeCompare(b)));
    assert.equal(new Set(all.map((e) => e.id)).size, all.length);
  });

  it('calendrier : 16 semaines, niveaux selon la charge, aujourd\'hui repéré', () => {
    const heat = buildHeatmap(d, NOW);
    assert.equal(heat.length, 16);
    assert.ok(heat.every((w) => w.cells.length === 7));
    const cells = heat.flatMap((w) => w.cells);
    const find = (date: string) => cells.find((c) => c.date === date);
    assert.equal(find('2026-10-28')?.today, true);
    assert.equal(find('2026-10-29')?.future, true);
    assert.equal(find('2026-10-29')?.level, 0);
    assert.equal(find('2026-10-21')?.level, 4); // plus grosse charge
    assert.ok((find('2026-10-12')?.level ?? 0) >= 3);
    assert.equal(find('2026-10-21')?.clickable, true);
    assert.equal(find('2026-10-20')?.clickable, false);
    assert.equal(heat[15]?.cells[0]?.date, '2026-10-26'); // dernière semaine commence lundi
    const run = setRunDone(d, k('2026-10-22'), true);
    assert.equal(buildHeatmap(run, NOW).flatMap((w) => w.cells).find((c) => c.date === '2026-10-22')?.load, 500);
  });

  it('répartition musculaire sur 7 jours', () => {
    const v = lift(lift(fresh(), '2026-10-27', 'dev_couche', '100', '10', 2), '2026-10-20', 'dev_couche', '100', '10', 1);
    const vols = muscleVolumes(v, NOW);
    assert.equal(vols.length, 7);
    assert.equal(vols[0], 2000); // pecs : les 2 séries d'hier seulement (20 oct est hors fenêtre)
    assert.equal(vols[1], 0);
    // échauffement exclu
    const warm = lift(fresh(), '2026-10-27', 'dev_pec_echauff', '20', '15', 3);
    assert.deepEqual(muscleVolumes(warm, NOW), [0, 0, 0, 0, 0, 0, 0]);
  });

  it('records triés, avec 1RM et ratio au poids de corps', () => {
    let r = fresh();
    r = { ...r, prs: { a: { weight: 100, reps: 5, date: TODAY }, b: { weight: 140, reps: 1, date: TODAY } }, bodyWeight: 80 };
    const list = buildPrList(r);
    assert.deepEqual(list.map((p) => p.id), ['b', 'a']);
    assert.equal(list[0]?.oneRm, 140);
    assert.equal(list[1]?.oneRm, 112.5);
    assert.equal(list[1]?.bodyRatio, 1.25);
  });

  it('poids : période', () => {
    let w = fresh();
    for (const [date, kg] of [['2026-07-01', '85'], ['2026-09-20', '82'], ['2026-10-20', '80']] as const) {
      w = saveBodyWeightEntry(w, kg, k(date)).data;
    }
    assert.equal(weightPoints(w, 'all', NOW).length, 3);
    assert.equal(weightPoints(w, '90', NOW).length, 2);
    assert.equal(weightPoints(w, '30', NOW).length, 1);
  });
});

describe('poids de corps (ajout / suppression)', () => {
  it('refuse le futur et les valeurs invalides', () => {
    assert.deepEqual(addWeightEntry(fresh(), '80', k('2026-10-29'), TODAY), { ok: false, error: 'future' });
    assert.deepEqual(addWeightEntry(fresh(), '5', TODAY, TODAY), { ok: false, error: 'invalid' });
  });

  it('supprime une pesée et recale le poids actuel', () => {
    let d = fresh();
    d = saveBodyWeightEntry(d, '80', k('2026-10-20')).data;
    d = saveBodyWeightEntry(d, '78', TODAY).data;
    d = deleteWeightEntry(d, TODAY);
    assert.equal(d.bodyWeight, 80);
    d = deleteWeightEntry(d, k('2026-10-20'));
    assert.equal(d.bodyWeight, undefined);
    assert.deepEqual(d.weightLog, []);
  });
});

describe('objectifs', () => {
  it('pente d\'une régression', () => {
    assert.equal(linSlope([{ x: 0, y: 0 }]), 0);
    assert.equal(linSlope([{ x: 0, y: 0 }, { x: 10, y: 5 }]), 0.5);
    assert.equal(linSlope([{ x: 1, y: 3 }, { x: 1, y: 5 }]), 0);
  });

  it('création : validations', () => {
    const base = fresh();
    const make = (input: Parameters<typeof saveGoal>[1], d = base) => saveGoal(d, input, TODAY, 1000);
    assert.deepEqual(make({ type: 'lift', exId: 'dev_couche', target: '0' }), { ok: false, error: 'invalid-target' });
    assert.deepEqual(make({ type: 'lift', target: '100' }), { ok: false, error: 'choose-exercise' });
    assert.deepEqual(make({ type: 'weight', target: '75' }), { ok: false, error: 'add-weight' });
    const withWeight = saveBodyWeightEntry(base, '80', TODAY).data;
    assert.deepEqual(make({ type: 'weight', target: '80' }, withWeight), { ok: false, error: 'already-there' });
    const lifted = lift(base, '2026-10-20', 'dev_couche', '100', '5');
    assert.deepEqual(make({ type: 'lift', exId: 'dev_couche', target: '90' }, lifted), { ok: false, error: 'already-reached' });
    const ok = make({ type: 'lift', exId: 'dev_couche', target: '110' }, lifted);
    assert.ok(ok.ok);
    if (!ok.ok) return;
    assert.equal(ok.data.goals[0]?.start, 100);
    assert.equal(ok.data.goals[0]?.id, 'g_rs');
    assert.deepEqual(saveGoal(ok.data, { type: 'lift', exId: 'dev_couche', target: '120' }, TODAY, 2), { ok: false, error: 'exists' });
  });

  it('progression : charge à atteindre', () => {
    let d = lift(fresh(), '2026-10-01', 'dev_couche', '60', '10');
    const created = saveGoal(d, { type: 'lift', exId: 'dev_couche', target: '80' }, k('2026-10-01'), 1);
    assert.ok(created.ok);
    if (!created.ok) return;
    d = lift(created.data, '2026-10-20', 'dev_couche', '70', '10');
    const goal = d.goals[0] as Goal;
    const p = goalProgress(d, goal);
    assert.equal(p.cur, 70);
    assert.equal(Math.round(p.pct), 50);
    assert.equal(p.done, false);
    assert.equal(goalCurrent(d, goal), 70);
    const rows = buildGoalRows(d, NOW);
    assert.equal(rows[0]?.name, 'Développé couché');
  });

  it('estimation de date : tendance suffisante, sinon explications', () => {
    let d = fresh();
    d = lift(d, '2026-09-20', 'dev_couche', '60', '10');
    d = lift(d, '2026-10-04', 'dev_couche', '65', '10');
    d = lift(d, '2026-10-20', 'dev_couche', '70', '10');
    d = { ...d, goals: [{ id: 'g', type: 'lift', exId: 'dev_couche', target: 100, startDate: k('2026-09-20'), start: 60 }] };
    const goal = d.goals[0] as Goal;
    const eta = goalEta(d, goal, goalProgress(d, goal), NOW);
    assert.equal(eta.kind, 'date');
    if (eta.kind === 'date') {
      assert.ok(eta.days > 30 && eta.days < 200);
      assert.ok(eta.rate > 0);
    }
    // pas assez de séances
    const few = { ...d, workouts: { [k('2026-10-20')]: d.workouts[k('2026-10-20')] ?? {} } };
    assert.equal(goalEta(few, goal, goalProgress(few, goal), NOW).kind, 'nodata');
  });

  it('poids : objectif de perte, direction opposée détectée', () => {
    let d = fresh();
    for (const [date, kg] of [['2026-09-01', '80'], ['2026-10-01', '82'], ['2026-10-20', '83']] as const) {
      d = saveBodyWeightEntry(d, kg, k(date)).data;
    }
    d = { ...d, goals: [{ id: 'w', type: 'weight', target: 75, startDate: k('2026-09-01'), start: 80 }] };
    const goal = d.goals[0] as Goal;
    const p = goalProgress(d, goal);
    assert.equal(p.dir, -1);
    assert.equal(p.pct, 0);
    assert.equal(goalEta(d, goal, p, NOW).kind, 'wrong');
  });

  it('objectif atteint : marqué une seule fois, supprimable', () => {
    let d = lift(fresh(), '2026-10-20', 'dev_couche', '100', '5');
    d = { ...d, goals: [{ id: 'g', type: 'lift', exId: 'dev_couche', target: 100, startDate: k('2026-10-01'), start: 80 }] };
    const first = checkGoalsAchieved(d, TODAY);
    assert.equal(first.achieved.length, 1);
    assert.equal(first.data.goals[0]?.achievedAt, TODAY);
    const second = checkGoalsAchieved(first.data, TODAY);
    assert.equal(second.achieved.length, 0);
    assert.equal(second.data, first.data);
    assert.deepEqual(deleteGoal(first.data, 'g').goals, []);
  });
});

describe('volume hebdomadaire', () => {
  it('fourchettes par défaut et personnalisées', () => {
    assert.deepEqual(volumeTargets(fresh()).pecs, [10, 20]);
    const t = volumeTargets(fresh());
    t.pecs = [12, 18];
    const saved = saveVolumeTargets(fresh(), t);
    assert.ok(saved);
    assert.deepEqual(volumeTargets(saved).pecs, [12, 18]);
    t.dos = [20, 10];
    assert.equal(saveVolumeTargets(fresh(), t), null);
    assert.equal(resetVolumeTargets(saved).prefs.volTargets, undefined);
  });

  it('lundi de la semaine décalée', () => {
    assert.equal(weekMonday(0, NOW).getDate(), 26);
    assert.equal(weekMonday(-1, NOW).getDate(), 19);
  });

  it('séries réelles (principal ×1, secondaires ×0,5) et séries prévues', () => {
    // tractions : dos principal, biceps secondaire
    let d = saveDayProgramOverride(fresh(), k('2026-10-27'), 'pecs_tri');
    d = lift(d, '2026-10-27', 'tractions', '0', '8', 4);
    const v = buildVolumeView(d, 0, NOW);
    const dos = v.rows.find((r) => r.muscle === 'dos');
    const biceps = v.rows.find((r) => r.muscle === 'biceps');
    assert.equal(dos?.actual, 4);
    assert.equal(biceps?.actual, 2);
    assert.equal(dos?.state, 'under');
    // le jeudi suivant n'est pas encore passé : des séries sont prévues
    assert.ok(v.rows.some((r) => r.planned > 0));
    assert.ok(v.note.includes('Avec les séances prévues'));
    assert.ok(v.scale >= 25);
    // semaine passée : pas de prévu
    const past = buildVolumeView(d, -1, NOW);
    assert.ok(past.rows.every((r) => r.planned === 0));
    assert.ok(past.note.endsWith('cette semaine-là.'));
  });

  it('formatage des séries au demi près', () => {
    assert.equal(fmtSets(2), '2');
    assert.equal(fmtSets(2.5), '2,5');
    assert.equal(fmtSets(2.2), '2');
  });
});

describe('historique et duplication', () => {
  let d = fresh();
  d = saveDayProgramOverride(d, k('2026-10-20'), 'pecs_tri');
  d = lift(d, '2026-10-20', 'dev_couche', '60', '10', 2);
  d = lift(d, '2026-10-20', 'tractions', '', '8', 3);
  d = setSetField(d, k('2026-10-20'), 'dev_couche', 0, 'weight', '60');
  d = saveDayProgramOverride(d, k('2026-10-27'), 'pecs_tri');
  d = lift(d, '2026-10-27', 'dev_couche', '65', '10', 2);
  d = setRunDone(d, k('2026-09-15'), true);

  it('liste des jours avec séance ou sortie, récents d\'abord', () => {
    assert.deepEqual(sessionDates(d), ['2026-10-27', '2026-10-20', '2026-09-15']);
  });

  it('regroupement par mois', () => {
    const h = buildHistory(d);
    assert.deepEqual(h.map((m) => [m.key, m.count]), [['2026-10', 2], ['2026-09', 1]]);
    const row = h[0]?.rows[1];
    assert.equal(row?.date, '2026-10-20');
    assert.equal(row?.day, 20);
    assert.ok(row?.meta.includes('2 exos'));
    assert.ok(row?.meta.includes('5 séries'));
    assert.equal(h[0]?.rows[0]?.title.length ? true : false, true);
    assert.equal(h[1]?.rows[0]?.color, 'run');
    assert.equal(h[1]?.rows[0]?.title, 'Course');
  });

  it('comparaison avec la séance précédente du même programme', () => {
    const today = sessionSummary(d, k('2026-10-27'));
    const prev = previousSimilar(d, k('2026-10-27'), today);
    assert.equal(prev?.date, '2026-10-20');
    const delta = tonnageDelta(d, k('2026-10-27'), today);
    assert.equal(delta?.since, '2026-10-20');
    // 20 oct = 60×10×2 + 0×8×3 = 1200 ; 27 oct = 65×10×2 = 1300 → +8 %
    assert.equal(delta?.pct, 8);
    assert.equal(tonnageDelta(d, k('2026-10-20'), sessionSummary(d, k('2026-10-20'))), null);
  });

  it('duplication : préremplit les charges, refuse si aujourd\'hui est déjà entamé', () => {
    const r = duplicateSession(d, k('2026-10-20'), TODAY);
    assert.ok(r.ok);
    if (!r.ok) return;
    assert.equal(r.count, 2);
    const day = r.data.workouts[TODAY];
    assert.equal(day?.['dev_couche']?.[0]?.weight, '60');
    assert.equal(day?.['dev_couche']?.[0]?.reps, '10');
    assert.equal(day?.['dev_couche']?.[0]?.done, false);
    assert.equal(day?.['tractions']?.length, 2); // limité aux 2 séries prévues au programme
    assert.equal(r.data.dayProgram[TODAY], 'pecs_tri');

    assert.deepEqual(duplicateSession(d, TODAY, TODAY), { ok: false, error: 'today' });
    const started = lift(d, TODAY, 'dev_couche', '50', '10', 1);
    assert.deepEqual(duplicateSession(started, k('2026-10-20'), TODAY), { ok: false, error: 'has-sets' });
    assert.deepEqual(duplicateSession(d, k('2026-09-15'), TODAY), { ok: false, error: 'not-found' });
  });

  it('données importées sans programme : duplication impossible sans planter', () => {
    const odd = normalizeAppData({ workouts: { '2026-10-01': { dev_couche: [{ done: true, weight: '50', reps: '5' }] } } }, TODAY);
    const res = duplicateSession(odd, k('2026-10-01'), TODAY);
    assert.ok(res.ok === true || res.error === 'not-found');
  });
});
