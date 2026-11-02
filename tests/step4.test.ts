import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import type { AppData, DateKey } from '../src/domain/types';
import { emptyAppData, normalizeAppData } from '../src/domain/rules/appData';
import { getProgramConfig } from '../src/domain/rules/program';
import {
  runForDay,
  runGoalSummary,
  runLineDetail,
  runPaceSec,
  runPlanList,
  weekCardioSummary,
  emptyRunLog,
  buildRunCards,
} from '../src/domain/rules/runs';
import { getAge, maxHeartRate, zoneRanges } from '../src/domain/rules/zones';
import { buildWeekView } from '../src/domain/rules/weekView';
import { buildProfileStats, totalTonnageAllTime } from '../src/domain/rules/profileStats';
import { setRunDone, setRunText } from '../src/domain/actions/cardio';
import { resetAllData, saveAge, saveBodyWeightEntry } from '../src/domain/actions/profile';
import { completeSet, saveDayProgramOverride, saveProfile } from '../src/domain/actions/workout';
import { weekDateKeys } from '../src/domain/format/dates';

const TODAY = '2026-10-28' as DateKey; // mercredi
const NOW = new Date(2026, 9, 28, 12, 0, 0);
const fresh = (): AppData => emptyAppData(TODAY);

describe('sorties running', () => {
  const cfg = getProgramConfig(fresh());

  it('planning par défaut : sorties sur les jours prévus', () => {
    const plan = runPlanList(cfg);
    assert.ok(plan.length > 0);
    for (const { day, run } of plan) assert.equal(runForDay(cfg, day)?.id, run.id);
    assert.equal(runForDay(cfg, 'lundi'), runForDay(cfg, 'lundi')); // stable
  });

  it('allure moyenne', () => {
    assert.equal(runPaceSec({ duration: '30', distance: '5' }), 360);
    assert.equal(runPaceSec({ duration: '30', distance: '5,5' }), 327);
    assert.equal(runPaceSec({ duration: '', distance: '5' }), 0);
    assert.equal(runPaceSec({ duration: '30', distance: '0' }), 0);
  });

  const run = { name: 'Tempo', desc: '', detail: '', targetDistance: 5, targetDuration: 30, targetPace: 360 };

  it('objectif et écart', () => {
    assert.equal(runGoalSummary({ ...run, targetDistance: 0, targetDuration: 0, targetPace: 0 }, emptyRunLog()), null);
    assert.deepEqual(runGoalSummary(run, emptyRunLog()), { targets: '5 km · 30 min · 6:00 /km', progress: [] });
    assert.deepEqual(runGoalSummary(run, { ...emptyRunLog(), distance: '3,8', duration: '25' })?.progress, [
      '−1,2 km',
      '−5 min',
      '+35 s/km',
    ]);
    assert.deepEqual(runGoalSummary(run, { ...emptyRunLog(), distance: '5', duration: '25' })?.progress, [
      'distance atteinte',
      '−5 min',
      'allure tenue (−60 s/km)',
    ]);
    assert.deepEqual(runGoalSummary(run, { ...emptyRunLog(), distance: '5', duration: '30' })?.progress, [
      'distance atteinte',
      'durée atteinte',
      'allure tenue (pile)',
    ]);
    assert.deepEqual(runGoalSummary(run, { ...emptyRunLog(), distance: '5', duration: '35' })?.progress.at(-1), '+60 s/km');
  });

  it('ligne de résumé : objectif, réalisé ou « à faire »', () => {
    assert.equal(runLineDetail(run, emptyRunLog()), '5 km · 30 min · 6:00 /km');
    assert.equal(runLineDetail({ ...run, targetDistance: 0, targetDuration: 0, targetPace: 0 }, emptyRunLog()), 'à faire');
    assert.equal(runLineDetail(run, { done: true, duration: '28', distance: '5', rpe: '' }), '5 km · 28 min · 5:36 /km');
    assert.equal(runLineDetail(run, { done: true, duration: '', distance: '', rpe: '' }), 'faite');
  });

  it('actions : saisie, allure recalculée, validation', () => {
    let d = setRunText(fresh(), TODAY, 'duration', '30');
    assert.equal(d.runLogs[TODAY]?.pace, '');
    d = setRunText(d, TODAY, 'distance', '5');
    assert.equal(d.runLogs[TODAY]?.pace, 360);
    d = setRunText(d, TODAY, 'rpe', '7');
    assert.equal(d.runLogs[TODAY]?.pace, 360); // RPE ne touche pas l'allure
    assert.equal(d.activeDays.includes(TODAY), false);
    d = setRunDone(d, TODAY, true);
    assert.equal(d.runLogs[TODAY]?.done, true);
    assert.ok(d.activeDays.includes(TODAY));
    d = setRunDone(d, TODAY, false);
    assert.equal(d.runLogs[TODAY]?.done, false);
    assert.equal(d.runLogs[TODAY]?.duration, '30');
  });

  it('bilan de la semaine', () => {
    const week = weekDateKeys(NOW);
    const plan = runPlanList(cfg);
    assert.ok(plan.length >= 2);
    let d = fresh();
    const [a, b] = plan;
    assert.ok(a && b);
    d = setRunText(setRunText(d, week[a.day], 'duration', '30'), week[a.day], 'distance', '5');
    d = setRunDone(d, week[a.day], true);
    d = setRunText(d, week[b.day], 'distance', '8'); // sans durée : compte la distance, pas l'allure
    const s = weekCardioSummary(d, week);
    assert.ok(s);
    assert.equal(s.planned, plan.length);
    assert.equal(s.done, 1);
    assert.equal(s.distanceKm, 13);
    assert.equal(s.durationMin, 30);
    assert.equal(s.paceSec, 360);
  });

  it('cartes de sortie : une par sortie planifiée, avec objectif et allure', () => {
    const week = weekDateKeys(NOW);
    const plan = runPlanList(cfg);
    const first = plan[0];
    assert.ok(first);
    let d = setRunText(setRunText(fresh(), week[first.day], 'duration', '30'), week[first.day], 'distance', '5');
    const cards = buildRunCards(d, week);
    assert.equal(cards.length, plan.length);
    assert.equal(cards[0]?.date, week[first.day]);
    assert.equal(cards[0]?.paceSec, 360);
    assert.ok((cards[0]?.goal?.targets ?? '').length > 0);
    assert.equal(cards[1]?.paceSec, 0);
    d = setRunDone(d, week[first.day], true);
    assert.equal(buildRunCards(d, week)[0]?.log.done, true);
  });

  it('pas de bilan sans sortie ni objectif', () => {
    const none = normalizeAppData({ program: { programs: { repos: { label: 'R', type: 'rest' } }, runs: {} } }, TODAY);
    assert.equal(weekCardioSummary(none, weekDateKeys(NOW)), null);
    const goal = normalizeAppData({ program: { programs: { repos: { label: 'R', type: 'rest' } }, runs: {}, weeklyKm: 20 } }, TODAY);
    assert.equal(weekCardioSummary(goal, weekDateKeys(NOW))?.weeklyKm, 20);
  });
});

describe('zones cardio', () => {
  it('FC max et plages', () => {
    assert.equal(maxHeartRate(25), 195);
    const z = zoneRanges(25);
    assert.equal(z.length, 5);
    assert.deepEqual([z[0]?.min, z[0]?.max], [98, 117]);
    assert.deepEqual([z[4]?.min, z[4]?.max], [176, 195]);
  });

  it('âge par défaut', () => {
    assert.equal(getAge(fresh()), 25);
    assert.equal(getAge(saveAge(fresh(), 32)), 32);
    assert.equal(getAge({ ...fresh(), age: 0 }), 25);
  });
});

describe('vue de la semaine', () => {
  it('sept jours, aujourd\'hui repéré, planning par défaut', () => {
    const v = buildWeekView(fresh(), NOW);
    assert.deepEqual(v.days.map((d) => d.day), ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']);
    assert.equal(v.days.filter((d) => d.isToday).length, 1);
    assert.equal(v.days.find((d) => d.isToday)?.day, 'mercredi');
    assert.equal(v.days[0]?.date, '2026-10-26');
    assert.ok(v.days.some((d) => d.isRest));
    assert.ok(v.days.every((d) => !d.isOverride));
  });

  it('programme modifié et avancement', () => {
    let d = saveDayProgramOverride(fresh(), TODAY, 'pecs_tri');
    d = completeSet(d, { date: TODAY, exId: 'dev_couche', idx: 0, done: true, weight: '60', reps: '10', now: 1 });
    const day = buildWeekView(d, NOW).days.find((x) => x.isToday);
    assert.equal(day?.isOverride, true);
    assert.equal(day?.programKey, 'pecs_tri');
    assert.equal(day?.progress.done, 1);
    assert.ok((day?.progress.total ?? 0) > 1);
  });

  it('sortie du jour dans la ligne de semaine', () => {
    const cfg = getProgramConfig(fresh());
    const first = runPlanList(cfg)[0];
    assert.ok(first);
    const v = buildWeekView(fresh(), NOW);
    const day = v.days.find((x) => x.day === first.day);
    assert.equal(day?.run?.name, first.run.name);
    assert.equal(day?.run?.done, false);
    assert.ok(v.cardio);
    const done = setRunDone(fresh(), weekDateKeys(NOW)[first.day], true);
    assert.equal(buildWeekView(done, NOW).days.find((x) => x.day === first.day)?.run?.done, true);
  });
});

describe('profil', () => {
  it('tonnage total, séances, régularité', () => {
    let d = fresh();
    d = completeSet(d, { date: '2026-10-27' as DateKey, exId: 'dev_couche', idx: 0, done: true, weight: '100', reps: '10', now: 1 });
    d = completeSet(d, { date: TODAY, exId: 'x', idx: 0, done: true, weight: '50', reps: '', now: 1 }); // reps vides => 10
    d = completeSet(d, { date: TODAY, exId: 'planche', idx: 0, done: true, weight: '', reps: '45', now: 1 }); // sans charge
    assert.equal(totalTonnageAllTime(d), 1500);
    const s = buildProfileStats(d, NOW);
    assert.equal(s.sessions, 2);
    assert.equal(s.streak, 2);
    assert.equal(s.regularity, 29);
    assert.equal(s.tonnage, 1500);
    assert.equal(s.equivalent?.name, 'voiture');
  });

  it('profil vide : pas d\'équivalent, ancienneté depuis la création', () => {
    const s = buildProfileStats(fresh(), NOW);
    assert.equal(s.equivalent, null);
    assert.equal(s.memberDays, 0);
    const old = saveProfile(fresh(), { since: '2026-10-18' as DateKey });
    assert.equal(buildProfileStats(old, NOW).memberDays, 10);
  });

  it('poids de corps : bornes, une pesée par jour, tri', () => {
    assert.equal(saveBodyWeightEntry(fresh(), '19,9', TODAY).ok, false);
    assert.equal(saveBodyWeightEntry(fresh(), '301', TODAY).ok, false);
    assert.equal(saveBodyWeightEntry(fresh(), 'abc', TODAY).ok, false);
    let r = saveBodyWeightEntry(fresh(), '78,26', TODAY);
    assert.equal(r.ok, true);
    assert.deepEqual(r.data.weightLog, [{ date: TODAY, kg: 78.3 }]);
    r = saveBodyWeightEntry(r.data, '77.5', TODAY);
    assert.equal(r.data.weightLog.length, 1);
    assert.equal(r.data.weightLog[0]?.kg, 77.5);
    r = saveBodyWeightEntry(r.data, '80', '2026-10-20' as DateKey);
    assert.deepEqual(r.data.weightLog.map((e) => e.date), ['2026-10-20', TODAY]);
    assert.equal(r.data.bodyWeight, 77.5); // dernière pesée par date
  });

  it('réinitialisation : garde programme, préférences, noms et profil', () => {
    let d = fresh();
    d = saveProfile(d, { pseudo: 'Len', avatar: 'blue', since: '2026-01-01' as DateKey });
    d = { ...d, prefs: { sound: false, vibrate: true }, exNames: { a: 'A' }, age: 30 };
    d = completeSet(d, { date: TODAY, exId: 'dev_couche', idx: 0, done: true, weight: '60', reps: '10', now: 1 });
    d = saveBodyWeightEntry(d, '80', TODAY).data;
    const r = resetAllData(d, TODAY);
    assert.deepEqual(r.workouts, {});
    assert.deepEqual(r.activeDays, []);
    assert.deepEqual(r.prs, {});
    assert.deepEqual(r.weightLog, []);
    assert.equal(r.age, undefined);
    assert.deepEqual(r.profile, { pseudo: 'Len', avatar: 'blue', since: TODAY });
    assert.equal(r.prefs.sound, false);
    assert.equal(r.exNames['a'], 'A');
    assert.equal(r.exNames['dev_couche'], 'Développé couché');
  });
});
