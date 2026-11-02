import type {
  AppData,
  DateKey,
  DayProgress,
  Exercise,
  ExerciseId,
  LastSession,
  PersonalRecord,
  SetLog,
  TopSet,
} from '../types';
import { dayExercises, getEffectiveDayProgram } from './program';
import { emptySet } from './appData';
import { toNumber } from '../format/numbers';

export function getSet(data: AppData, date: DateKey, exId: ExerciseId, idx: number): SetLog {
  return data.workouts[date]?.[exId]?.[idx] ?? emptySet();
}

export const getSkipped = (data: AppData, date: DateKey): ExerciseId[] => data.skipped[date] ?? [];
export const isSkipped = (data: AppData, date: DateKey, exId: ExerciseId): boolean =>
  getSkipped(data, date).includes(exId);

/** Nombre de séries validées pour un exercice. */
export function doneSetCount(data: AppData, date: DateKey, ex: Exercise): number {
  let n = 0;
  for (let i = 0; i < ex.sets; i++) if (getSet(data, date, ex.id, i).done) n++;
  return n;
}

export function getDayProgress(data: AppData, date: DateKey): DayProgress {
  const { prog } = getEffectiveDayProgram(data, date);
  if (prog.type === 'rest' || prog.exercises.length === 0) return { done: 0, total: 0, pct: 0 };
  let total = 0;
  let done = 0;
  for (const ex of dayExercises(data, date, prog)) {
    if (isSkipped(data, date, ex.id)) continue;
    for (let i = 0; i < ex.sets; i++) {
      total++;
      if (getSet(data, date, ex.id, i).done) done++;
    }
  }
  return { done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
}

/** Tonnage de la journée : somme charge × répétitions des séries validées (exercices chronométrés exclus). */
export function getTonnageFor(data: AppData, date: DateKey): number {
  const { prog } = getEffectiveDayProgram(data, date);
  const day = data.workouts[date];
  if (prog.type === 'rest' || !day) return 0;
  let total = 0;
  for (const ex of dayExercises(data, date, prog)) {
    if (ex.isTime) continue;
    for (const set of day[ex.id] ?? []) {
      if (set.done) total += toNumber(set.weight) * (toNumber(set.reps) || ex.defaultReps || 10);
    }
  }
  return Math.round(total);
}

/** Dernière séance précédente où l'exercice a été fait (séries validées seulement). */
export function getLastSession(data: AppData, exId: ExerciseId, before: DateKey): LastSession | null {
  const dates = Object.keys(data.workouts)
    .filter((d): d is DateKey => d < before && Boolean(data.workouts[d as DateKey]?.[exId]))
    .sort()
    .reverse();
  for (const date of dates) {
    const sets = (data.workouts[date]?.[exId] ?? []).filter((s) => s.done);
    if (sets.length) return { date, sets };
  }
  return null;
}

/** Meilleure série : charge la plus haute, puis le plus de répétitions. */
export function topSet(sets: SetLog[]): TopSet | null {
  return sets.reduce<TopSet | null>((best, s) => {
    const w = toNumber(s.weight);
    const r = toNumber(s.reps);
    return !best || w > best.w || (w === best.w && r > best.r) ? { w, r } : best;
  }, null);
}

/** `true` si (poids, reps) bat le record enregistré. */
export function isNewRecord(pr: PersonalRecord | undefined, weight: number, reps: number): boolean {
  if (!(weight > 0)) return false;
  return !pr || weight > pr.weight || (weight === pr.weight && reps > pr.reps);
}
