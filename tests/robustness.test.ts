import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import type { AppData, DateKey } from '../src/domain/types';
import { emptyAppData, normalizeAppData, serializeAppData } from '../src/domain/rules/appData';
import { buildTodayView } from '../src/domain/rules/todayView';
import { buildWeekView } from '../src/domain/rules/weekView';
import { buildHistory, sessionDates, tonnageDelta } from '../src/domain/rules/history';
import { sessionSummary } from '../src/domain/rules/summary';
import { allExercises, buildHeatmap, buildPrList, liftHistory, muscleVolumes, weeklyTonnageHistory } from '../src/domain/rules/statsView';
import { buildVolumeView } from '../src/domain/rules/volume';
import { buildGoalRows } from '../src/domain/rules/goals';
import { buildProfileStats } from '../src/domain/rules/profileStats';
import { restDayInfo } from '../src/domain/rules/restDay';
import { buildRunCards, weekCardioSummary } from '../src/domain/rules/runs';
import { planReminders } from '../src/domain/rules/reminders';
import { backupStatus, buildBackupFile, extractBackupPayload, mergeAppData, summarizeBackup } from '../src/domain/rules/backup';
import { weekDateKeys } from '../src/domain/format/dates';
import { lineChartGeometry, radarGeometry, weightChartGeometry, barChartGeometry } from '../src/domain/rules/charts';
import { buildReadiness } from '../src/domain/rules/readiness';

const TODAY = '2026-10-28' as DateKey;
const NOW = new Date(2026, 9, 28, 12, 0, 0);

/** Générateur pseudo-aléatoire déterministe (mulberry32). */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const JUNK: unknown[] = [null, 0, -1, 1e9, '', 'x', '2026-10-28', 'abc', [], {}, [null], { a: 1 }, true, false, '12,5', ' ', '9'.repeat(40)];

/** Copie profonde dans laquelle des valeurs aléatoires sont remplacées par n'importe quoi. */
function mutate(value: unknown, rand: () => number, rate: number): unknown {
  if (rand() < rate) return JUNK[Math.floor(rand() * JUNK.length)];
  if (Array.isArray(value)) {
    const out = value.map((v) => mutate(v, rand, rate));
    if (rand() < rate) out.splice(Math.floor(rand() * (out.length + 1)), 0, JUNK[Math.floor(rand() * JUNK.length)]);
    return out;
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      if (rand() < rate / 3) continue; // clé supprimée
      out[k] = mutate(v, rand, rate);
    }
    if (rand() < rate) out[`inconnu_${Math.floor(rand() * 99)}`] = JUNK[Math.floor(rand() * JUNK.length)];
    return out;
  }
  return value;
}

/** Données réalistes servant de base aux mutations. */
const BASE = {
  workouts: {
    '2026-10-20': {
      dev_couche: [{ done: true, weight: '60', reps: '10' }, { done: true, weight: '62.5', reps: '8' }, null],
      tractions: [{ done: true, weight: '', reps: '8' }],
      planche_ab: [{ done: true, weight: '', reps: '45' }],
    },
    '2026-10-27': { dev_couche: [{ done: true, weight: '65', reps: '10' }] },
  },
  runLogs: { '2026-10-22': { done: true, duration: '30', distance: '5', rpe: '7', pace: 360 } },
  prs: { dev_couche: { weight: 65, reps: 10, date: '2026-10-27' }, tractions: { weight: 10, reps: 8, date: '2026-10-20' } },
  activeDays: ['2026-10-20', '2026-10-22', '2026-10-27'],
  bodyWeight: 80,
  age: 28,
  weightLog: [{ date: '2026-10-01', kg: 82 }, { date: '2026-10-20', kg: 80 }],
  exNotes: { '2026-10-20': { dev_couche: { settings: 'cran 4', rpe: '8' } } },
  dayProgram: { '2026-10-20': 'pecs_tri', '2026-10-27': 'pecs_tri' },
  dayOrder: { '2026-10-20': ['tractions', 'dev_couche'] },
  skipped: { '2026-10-20': ['dips'] },
  swaps: { '2026-10-20': { dips: { id: 'dips_machine', name: 'Dips machine', sets: 3, repsLabel: '8-12 reps', defaultReps: 10, type: 'compound', muscles: ['triceps'], restSec: 90, swappedFrom: 'dips', swappedName: 'Dips' } } },
  sessionMeta: { '2026-10-20': { start: 1760000000000, last: 1760003000000, ms: 3000000, prog: { key: 'pecs_tri', name: 'Pectoraux & Triceps' }, prs: [{ id: 'dev_couche', name: 'Développé couché', w: 62.5, r: 8 }], note: 'ok' } },
  readiness: { '2026-10-20': { sleep: 4, stress: 3, soreness: 5, score: 4 } },
  goals: [{ id: 'g_1', type: 'lift', exId: 'dev_couche', target: 80, startDate: '2026-10-01', start: 60 }, { id: 'g_2', type: 'weight', target: 75, startDate: '2026-10-01', start: 82 }],
  prefs: { sound: true, vibrate: false, reminder: { enabled: true, time: '18:30', days: [1, 3, 5] }, volTargets: { pecs: [10, 20] }, backupSnooze: 1 },
  profile: { pseudo: 'Len', avatar: 'blue', since: '2026-01-01' },
  program: {
    v: 1,
    programs: { haut: { label: 'Haut', fullName: 'Haut du corps', type: 'gym', color: 'blue', exercises: [{ id: 'a', name: 'A', sets: 3, repsLabel: '8-12 reps', defaultReps: 10, type: 'compound', muscles: ['pecs'], restSec: 90, superset: 'A' }, { id: 'b', name: 'B', sets: 3, repsLabel: '10 reps', defaultReps: 10, type: 'isolation', muscles: ['dos'], restSec: 60, superset: 'A' }] }, repos: { label: 'Repos', fullName: 'Repos', type: 'rest', color: 'grey', exercises: [] } },
    order: ['haut', 'repos'],
    weekly: { lundi: 'haut', mardi: 'repos', mercredi: 'haut', jeudi: 'repos', vendredi: 'haut', samedi: 'repos', dimanche: 'repos' },
    runs: { r1: { name: 'Tempo', desc: 'd', detail: 'e', targetDistance: 5, targetDuration: 30, targetPace: 360 } },
    runOrder: ['r1'],
    runWeekly: { lundi: '', mardi: 'r1', mercredi: '', jeudi: '', vendredi: '', samedi: '', dimanche: '' },
    weeklyKm: 20,
  },
  lastBackup: 1760000000000,
  champFutur: { x: 1 },
};

/** Exécute toutes les vues de l'appli sur des données quelconques : aucune ne doit lever d'exception. */
function exerciseEverything(d: AppData): void {
  const week = weekDateKeys(NOW);
  const dates = [...new Set<DateKey>([TODAY, '2026-10-20' as DateKey, '2026-10-27' as DateKey, ...sessionDates(d)])];
  for (const date of dates) {
    buildTodayView(d, date);
    const s = sessionSummary(d, date);
    tonnageDelta(d, date, s);
    restDayInfo(d, date);
  }
  buildWeekView(d, NOW);
  buildHistory(d);
  buildHeatmap(d, NOW);
  muscleVolumes(d, NOW);
  buildPrList(d);
  buildProfileStats(d, NOW);
  buildGoalRows(d, NOW);
  for (const offset of [0, -1, -5]) buildVolumeView(d, offset, NOW);
  for (const ex of allExercises(d)) {
    liftHistory(d, ex.id);
    weeklyTonnageHistory(d, ex.id);
  }
  buildRunCards(d, week);
  weekCardioSummary(d, week);
  planReminders(d, NOW);
  backupStatus(d, NOW);
  summarizeBackup(d);
  buildBackupFile(d, NOW);
  buildReadiness({ sleep: 3, stress: 3, soreness: 3 });
  const series = weightChartGeometry(d.weightLog);
  assert.ok(series === null || series.points.length === d.weightLog.length);
  const vals = allExercises(d).slice(0, 5).map((_e, i) => ({ key: TODAY, value: i + 1 }));
  if (vals.length) {
    lineChartGeometry(vals);
    barChartGeometry(vals);
  }
  radarGeometry(muscleVolumes(d, NOW), ['a', 'b', 'c', 'd', 'e', 'f', 'g']);
}

describe('robustesse : données corrompues', () => {
  it('les données de référence passent par toutes les vues', () => {
    const d = normalizeAppData(BASE, TODAY);
    exerciseEverything(d);
    assert.deepEqual(d.extras, { champFutur: { x: 1 } });
  });

  it('1 500 variantes aléatoires : aucune exception, normalisation idempotente', () => {
    for (let seed = 1; seed <= 1500; seed++) {
      const rand = rng(seed);
      const rate = [0.02, 0.05, 0.15][seed % 3] ?? 0.05;
      const mutated = mutate(BASE, rand, rate);
      let normalized: AppData;
      try {
        normalized = normalizeAppData(mutated, TODAY);
        exerciseEverything(normalized);
        extractBackupPayload(JSON.parse(JSON.stringify(mutated)));
        mergeAppData(normalized, normalizeAppData(mutate(BASE, rng(seed + 9999), rate), TODAY));
      } catch (error) {
        throw new Error(`graine ${seed} : ${(error as Error).stack ?? String(error)}`);
      }
      const again = normalizeAppData(JSON.parse(serializeAppData(normalized)), TODAY);
      assert.deepEqual(again, normalized, `normalisation non idempotente (graine ${seed})`);
    }
  });

  it('entrées non objet', () => {
    for (const junk of [null, undefined, 0, 'x', [], [[]], true]) {
      const d = normalizeAppData(junk, TODAY);
      exerciseEverything(d);
      assert.deepEqual(d, normalizeAppData(JSON.parse(serializeAppData(d)), TODAY));
    }
    exerciseEverything(emptyAppData(TODAY));
  });
});
