import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import type { AppData, DateKey, ExerciseType, MuscleKey, ProgramColor } from '../src/domain/types';
import { normalizeAppData, serializeAppData } from '../src/domain/rules/appData';
import { getProgramConfig, getEffectiveDayProgram, orderedExercises } from '../src/domain/rules/program';
import { buildSwapDef, swapCandidates } from '../src/domain/rules/swap';
import { buildReadiness } from '../src/domain/rules/readiness';
import { mergeAppData } from '../src/domain/rules/backup';
import * as W from '../src/domain/actions/workout';
import * as C from '../src/domain/actions/cardio';
import * as P from '../src/domain/actions/profile';
import * as G from '../src/domain/actions/goals';
import * as Wt from '../src/domain/actions/weight';
import * as V from '../src/domain/actions/volume';
import * as H from '../src/domain/actions/history';
import * as E from '../src/domain/actions/program';
import * as R from '../src/domain/actions/reminders';
import { markBackedUp, snoozeBackup } from '../src/domain/rules/backup';
import { emptyAppData } from '../src/domain/rules/appData';
import { addDays } from '../src/domain/format/dates';
import { sessionDates } from '../src/domain/rules/history';

const TODAY = '2026-10-28' as DateKey;

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

const pick = <T,>(rand: () => number, list: readonly T[]): T => list[Math.floor(rand() * list.length)] as T;
const WORDS = ['', ' ', '0', '5', '12,5', '60', '999999999999', '-3', 'abc', '<b>x</b>', 'Dips', 'développé couché', '1e9', '0,0'];
const EX_IDS = ['dev_couche', 'tractions', 'dips', 'planche_ab', 'crunchs', 'inconnu'];
const PROGS = ['pecs_tri', 'dos_ep', 'abdos', 'jambes', 'repos', 'inconnu'];
const MUSCLES: MuscleKey[] = ['pecs', 'dos', 'epaules', 'biceps', 'triceps', 'abdos', 'jambes', 'trapezes', 'mollets'];
const TYPES: ExerciseType[] = ['compound', 'isolation', 'echauffement'];
const COLORS: ProgramColor[] = ['red', 'blue', 'yellow', 'green', 'grey'];
const DAYS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'] as const;

type Op = (d: AppData, r: () => number, step: number) => AppData;

const date = (r: () => number): DateKey => addDays(TODAY, -Math.floor(r() * 12));

const OPS: Record<string, Op> = {
  completeSet: (d, r, n) => W.completeSet(d, { date: date(r), exId: pick(r, EX_IDS), idx: Math.floor(r() * 5), done: r() < 0.8, weight: pick(r, WORDS), reps: pick(r, WORDS), now: 1_760_000_000_000 + n * 60_000 }),
  setSetField: (d, r) => W.setSetField(d, date(r), pick(r, EX_IDS), Math.floor(r() * 6), pick(r, ['weight', 'reps'] as const), pick(r, WORDS)),
  registerPR: (d, r) => W.registerPR(d, { date: date(r), exId: pick(r, EX_IDS), name: pick(r, WORDS), weight: Math.round(r() * 200), reps: Math.floor(r() * 15) }).data,
  exNote: (d, r) => W.saveExNote(d, date(r), pick(r, EX_IDS), pick(r, ['settings', 'rpe'] as const), pick(r, WORDS)),
  sessionNote: (d, r) => W.saveSessionNote(d, date(r), pick(r, WORDS)),
  skip: (d, r) => W.skipExercise(d, date(r), pick(r, EX_IDS), r() < 0.6),
  postpone: (d, r) => W.postponeExercise(d, date(r), pick(r, EX_IDS)).data,
  override: (d, r) => W.saveDayProgramOverride(d, date(r), r() < 0.2 ? null : pick(r, PROGS)),
  readiness: (d, r) => W.saveReadiness(d, date(r), buildReadiness({ sleep: 1 + Math.floor(r() * 5), stress: 1 + Math.floor(r() * 5), soreness: 1 + Math.floor(r() * 5) })),
  profile: (d, r) => W.saveProfile(d, { pseudo: pick(r, WORDS), avatar: pick(r, ['red', 'blue', 'green', 'yellow', 'grey', 'white'] as const) }),
  pref: (d, r) => W.setPref(d, pick(r, ['sound', 'vibrate'] as const), r() < 0.5),
  swap: (d, r) => {
    const dt = date(r);
    const withProg = W.saveDayProgramOverride(d, dt, pick(r, ['pecs_tri', 'dos_ep', 'jambes', 'abdos']));
    const { prog } = getEffectiveDayProgram(withProg, dt);
    const list = orderedExercises(withProg, dt, prog);
    const cur = list[Math.floor(r() * list.length)];
    if (!cur) return d;
    const cands = swapCandidates(withProg, cur, dt);
    const known = cands[Math.floor(r() * cands.length)];
    const target = known ?? { id: `custom_${Math.floor(r() * 5)}`, name: pick(r, ['Machine', 'Poulie', 'Barre']), type: cur.type, muscles: cur.muscles };
    return W.applySwap(withProg, dt, cur, buildSwapDef(cur, target));
  },
  revertSwap: (d, r) => {
    const dates = Object.keys(d.swaps) as DateKey[];
    const dt = dates[Math.floor(r() * dates.length)];
    const swapped = dt ? Object.values(d.swaps[dt] ?? {})[0] : undefined;
    return dt && swapped ? W.revertSwap(d, dt, swapped).data : d;
  },
  runText: (d, r) => C.setRunText(d, date(r), pick(r, ['duration', 'distance', 'rpe'] as const), pick(r, WORDS)),
  runDone: (d, r) => C.setRunDone(d, date(r), r() < 0.7),
  age: (d, r) => P.saveAge(d, Math.floor(r() * 90)),
  weight: (d, r) => {
    const res = Wt.addWeightEntry(d, pick(r, ['78', '80,5', '79.2', '82', 'abc', '5']), date(r), TODAY);
    return res.ok ? res.data : d;
  },
  delWeight: (d, r) => {
    const entry = d.weightLog[Math.floor(r() * d.weightLog.length)];
    return entry ? Wt.deleteWeightEntry(d, entry.date) : d;
  },
  goal: (d, r, n) => {
    const res = G.saveGoal(d, { type: pick(r, ['lift', 'weight'] as const), exId: pick(r, EX_IDS), target: pick(r, ['70', '100', '85,5', '200', '0', 'abc']) }, TODAY, n + 1000);
    return res.ok ? res.data : d;
  },
  delGoal: (d, r) => (d.goals.length ? G.deleteGoal(d, (d.goals[Math.floor(r() * d.goals.length)] ?? d.goals[0])?.id ?? '') : d),
  checkGoals: (d) => G.checkGoalsAchieved(d, TODAY).data,
  achieve: (d, r, n) => {
    const goal = d.goals.find((g) => g.type === 'lift' && g.exId);
    if (!goal?.exId) return d;
    const done = W.completeSet(d, { date: date(r), exId: goal.exId, idx: 0, done: true, weight: String(goal.target), reps: '5', now: n });
    return G.checkGoalsAchieved(done, TODAY).data;
  },
  volTargets: (d, r) => {
    const t = Object.fromEntries(MUSCLES.slice(0, 7).map((m) => [m, [Math.floor(r() * 10), 5 + Math.floor(r() * 20)]])) as never;
    return V.saveVolumeTargets(d, t) ?? d;
  },
  volReset: (d) => V.resetVolumeTargets(d),
  duplicate: (d, r) => {
    const days = sessionDates(d);
    const from = days[Math.floor(r() * days.length)] ?? date(r);
    const res = H.duplicateSession(d, from, TODAY);
    return res.ok ? res.data : d;
  },
  addProgram: (d, _r, n) => E.addProgram(d, n + 1).data,
  progName: (d, r) => E.setProgramName(d, pick(r, PROGS), pick(r, ['label', 'fullName'] as const), pick(r, WORDS)),
  progColor: (d, r) => E.setProgramColor(d, pick(r, PROGS), pick(r, COLORS)),
  moveProgram: (d, r) => E.moveProgram(d, pick(r, PROGS), r() < 0.5 ? -1 : 1),
  deleteProgram: (d, r) => E.deleteProgram(d, pick(r, PROGS)) ?? d,
  weekly: (d, r) => E.setWeeklyProgram(d, pick(r, DAYS), pick(r, PROGS)),
  addExercise: (d, r, n) => E.addExercise(d, pick(r, PROGS), n + 5000).data,
  updateExercise: (d, r) => {
    const cfg = getProgramConfig(d);
    const pid = pick(r, Object.keys(cfg.programs));
    const ex = cfg.programs[pid]?.exercises[0];
    if (!ex) return d;
    const patch = pick(r, [
      { name: pick(r, WORDS) }, { sets: Math.floor(r() * 20) - 2 }, { restSec: Math.floor(r() * 900) },
      { reps: { min: Math.floor(r() * 20), max: Math.floor(r() * 20) } }, { failure: r() < 0.5 }, { isTime: r() < 0.5 },
      { type: pick(r, TYPES) }, { step: r() < 0.3 ? null : Math.round(r() * 10) / 4 }, { superset: pick(r, ['A', 'B', 'C', 'D', null] as const) },
      { optional: r() < 0.5 }, { toggleMuscle: pick(r, MUSCLES) },
    ] as E.ExercisePatch[]);
    return E.updateExercise(d, pid, ex.id, patch);
  },
  moveExercise: (d, r) => {
    const cfg = getProgramConfig(d);
    const pid = pick(r, Object.keys(cfg.programs));
    const ex = cfg.programs[pid]?.exercises[0];
    return ex ? E.moveExercise(d, pid, ex.id, r() < 0.5 ? -1 : 1) : d;
  },
  deleteExercise: (d, r) => {
    const cfg = getProgramConfig(d);
    const pid = pick(r, Object.keys(cfg.programs));
    const ex = cfg.programs[pid]?.exercises[0];
    return ex ? E.deleteExercise(d, pid, ex.id) : d;
  },
  addRun: (d, _r, n) => E.addRun(d, n + 9000).data,
  runField: (d, r) => {
    const id = pick(r, Object.keys(getProgramConfig(d).runs));
    return E.setRunField(d, id, pick(r, ['name', 'desc', 'detail', 'targetDistance', 'targetDuration', 'targetPace'] as const), pick(r, WORDS));
  },
  runDay: (d, r) => E.setRunDay(d, pick(r, DAYS), pick(r, Object.keys(getProgramConfig(d).runs).concat(['', 'inconnu']))),
  weeklyKm: (d, r) => E.setWeeklyKm(d, pick(r, WORDS)),
  deleteRun: (d, r) => E.deleteRun(d, pick(r, Object.keys(getProgramConfig(d).runs))),
  resetProgram: (d) => E.resetProgramConfig(d),
  reminder: (d, r) => R.setReminderDays(R.setReminderTime(R.setReminderEnabled(d, r() < 0.7), pick(r, ['6:07', '18:00', '23:59', 'xx'])), [1, 3, 5].filter(() => r() < 0.8)),
  backup: (d, r, n) => (r() < 0.5 ? markBackedUp(d, 1_760_000_000_000 + n) : snoozeBackup(d, 1_760_000_000_000 + n)),
  merge: (d, r, n) => {
    let other = emptyAppData(TODAY);
    other = W.completeSet(other, { date: date(r), exId: pick(r, EX_IDS), idx: 0, done: true, weight: '40', reps: '8', now: n });
    return mergeAppData(d, other).data;
  },
  reset: (d) => P.resetAllData(d, TODAY),
};

/** Champs dont la valeur doit survivre telle quelle à un enregistrement puis un rechargement. */
const PERSISTED: (keyof AppData)[] = ['workouts', 'runLogs', 'prs', 'activeDays', 'weightLog', 'exNotes', 'dayProgram', 'dayOrder', 'skipped', 'swaps', 'sessionMeta', 'readiness', 'goals', 'prefs', 'profile', 'program', 'age', 'bodyWeight', 'lastBackup'];

describe('actions : suites d\'opérations aléatoires', () => {
  it('aucune exception et tout ce qui est enregistré survit à un rechargement', () => {
    const names = Object.keys(OPS);
    for (let seed = 1; seed <= 250; seed++) {
      const r = rng(seed);
      let d = normalizeAppData(null, TODAY);
      const log: string[] = [];
      for (let step = 0; step < 40; step++) {
        const name = pick(r, names);
        log.push(name);
        try {
          d = (OPS[name] as Op)(d, r, step);
        } catch (error) {
          throw new Error(`graine ${seed}, étape ${step} (${name}) : ${(error as Error).stack ?? String(error)}\nsuite : ${log.join(', ')}`);
        }
        const reloaded = normalizeAppData(JSON.parse(serializeAppData(d)), TODAY);
        for (const key of PERSISTED) {
          assert.deepEqual(reloaded[key], d[key], `graine ${seed}, étape ${step} (${name}) : « ${key} » ne survit pas à un rechargement\nsuite : ${log.join(', ')}`);
        }
      }
    }
  });
});
