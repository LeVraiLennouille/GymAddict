/**
 * Actions pures : `(AppData, arguments) => AppData`.
 * Aucune dépendance à React ni au stockage ; elles sont testables telles quelles.
 */
import type {
  AppData,
  DateKey,
  ExNote,
  Exercise,
  ExerciseId,
  Profile,
  ProgramId,
  Readiness,
  SessionMeta,
  SetLog,
} from '../types';
import { SESSION_GAP_MS } from '../defaults/constants';
import { emptySet } from '../rules/appData';
import { getEffectiveDayProgram, orderedExercises, baseId } from '../rules/program';
import { getSet, isNewRecord } from '../rules/sets';
import { toNumber } from '../format/numbers';

/* ------------------------------------------------------------------ */
/* Séries                                                              */
/* ------------------------------------------------------------------ */

export function setSetField<K extends keyof SetLog>(
  data: AppData,
  date: DateKey,
  exId: ExerciseId,
  idx: number,
  field: K,
  value: SetLog[K],
): AppData {
  const day = data.workouts[date] ?? {};
  const sets = [...(day[exId] ?? [])];
  while (sets.length <= idx) sets.push(emptySet());
  sets[idx] = { ...(sets[idx] ?? emptySet()), [field]: value };
  return { ...data, workouts: { ...data.workouts, [date]: { ...day, [exId]: sets } } };
}

export function markDayActive(data: AppData, date: DateKey): AppData {
  return data.activeDays.includes(date) ? data : { ...data, activeDays: [...data.activeDays, date] };
}

function updateSessionMeta(
  data: AppData,
  date: DateKey,
  recipe: (meta: SessionMeta) => SessionMeta,
): AppData {
  const meta = recipe({ ...(data.sessionMeta[date] ?? {}) });
  return { ...data, sessionMeta: { ...data.sessionMeta, [date]: meta } };
}

/** Met à jour le chronomètre d'activité de la séance (pause au-delà de 45 min sans série). */
export function touchSession(data: AppData, date: DateKey, now: number): AppData {
  const effective = getEffectiveDayProgram(data, date);
  return updateSessionMeta(data, date, (meta) => {
    if (meta.start) {
      if (meta.last && now - meta.last <= SESSION_GAP_MS) meta.ms = (meta.ms ?? 0) + (now - meta.last);
    } else {
      meta.start = now;
      meta.ms = 0;
    }
    meta.last = now;
    if (!meta.prog && effective.prog.type !== 'rest') {
      meta.prog = { key: effective.key, name: effective.prog.fullName };
    }
    return meta;
  });
}

export interface CompleteSetArgs {
  date: DateKey;
  exId: ExerciseId;
  idx: number;
  done: boolean;
  /** Valeurs affichées à l'écran (utilisées si rien n'est encore enregistré). */
  weight: string;
  reps: string;
  now: number;
}

/** Valide ou annule une série en une seule modification. */
export function completeSet(data: AppData, a: CompleteSetArgs): AppData {
  let next = setSetField(data, a.date, a.exId, a.idx, 'done', a.done);
  if (!a.done) return next;
  next = touchSession(markDayActive(next, a.date), a.date, a.now);
  const stored = getSet(next, a.date, a.exId, a.idx);
  if (stored.weight === '' && a.weight) next = setSetField(next, a.date, a.exId, a.idx, 'weight', a.weight);
  if (stored.reps === '' && a.reps) next = setSetField(next, a.date, a.exId, a.idx, 'reps', a.reps);
  return next;
}

/** Applique une nouvelle charge à toutes les séries non validées d'un exercice. */
export function applyProgressionWeight(
  data: AppData,
  date: DateKey,
  ex: Exercise,
  weight: number,
): AppData {
  let next = data;
  for (let i = 0; i < ex.sets; i++) {
    if (getSet(next, date, ex.id, i).done) continue;
    next = setSetField(next, date, ex.id, i, 'weight', String(weight));
  }
  return next;
}

/* ------------------------------------------------------------------ */
/* Records                                                             */
/* ------------------------------------------------------------------ */

export interface RegisterPrResult {
  data: AppData;
  isRecord: boolean;
}

export function registerPR(
  data: AppData,
  args: { date: DateKey; exId: ExerciseId; name: string; weight: number; reps: number },
): RegisterPrResult {
  const { date, exId, name, weight, reps } = args;
  if (!isNewRecord(data.prs[exId], weight, reps)) return { data, isRecord: false };
  const withPr: AppData = { ...data, prs: { ...data.prs, [exId]: { weight, reps, date } } };
  const next = updateSessionMeta(withPr, date, (meta) => ({
    ...meta,
    prs: [...(meta.prs ?? []).filter((p) => p.id !== exId), { id: exId, name, w: weight, r: reps }],
  }));
  return { data: next, isRecord: true };
}

/* ------------------------------------------------------------------ */
/* Notes                                                               */
/* ------------------------------------------------------------------ */

export function saveExNote(
  data: AppData,
  date: DateKey,
  exId: ExerciseId,
  field: keyof ExNote,
  value: string,
): AppData {
  const day = data.exNotes[date] ?? {};
  const note: ExNote = { settings: '', rpe: '', ...(day[exId] ?? {}), [field]: value };
  return { ...data, exNotes: { ...data.exNotes, [date]: { ...day, [exId]: note } } };
}

export function saveSessionNote(data: AppData, date: DateKey, text: string): AppData {
  const note = String(text ?? '').slice(0, 600);
  return updateSessionMeta(data, date, (meta) => {
    if (note.trim()) meta.note = note;
    else delete meta.note;
    return meta;
  });
}

export function markSummaryShown(data: AppData, date: DateKey): AppData {
  return updateSessionMeta(data, date, (meta) => ({ ...meta, summaryShown: true }));
}

/* ------------------------------------------------------------------ */
/* Organisation de la séance                                           */
/* ------------------------------------------------------------------ */

export function saveDayProgramOverride(data: AppData, date: DateKey, key: ProgramId | null): AppData {
  const dayProgram = { ...data.dayProgram };
  if (key === null) delete dayProgram[date];
  else dayProgram[date] = key;
  return { ...data, dayProgram };
}

export function skipExercise(data: AppData, date: DateKey, exId: ExerciseId, skip: boolean): AppData {
  const list = (data.skipped[date] ?? []).filter((id) => id !== exId);
  if (skip) list.push(exId);
  const skipped = { ...data.skipped };
  if (list.length) skipped[date] = list;
  else delete skipped[date];
  return { ...data, skipped };
}

export type PostponeStatus = 'moved' | 'already-last' | 'not-found';

export function postponeExercise(
  data: AppData,
  date: DateKey,
  exId: ExerciseId,
): { data: AppData; status: PostponeStatus } {
  const { prog } = getEffectiveDayProgram(data, date);
  const list = orderedExercises(data, date, prog);
  const target = list.find((e) => e.id === exId);
  if (!target) return { data, status: 'not-found' };
  if (list[list.length - 1]?.id === exId) return { data, status: 'already-last' };
  const order = list.filter((e) => e.id !== exId).map(baseId).concat(baseId(target));
  return { data: { ...data, dayOrder: { ...data.dayOrder, [date]: order } }, status: 'moved' };
}

/* ------------------------------------------------------------------ */
/* Remplacement d'exercice                                             */
/* ------------------------------------------------------------------ */

export function applySwap(
  data: AppData,
  date: DateKey,
  current: Exercise,
  swapped: Exercise,
): AppData {
  const from = swapped.swappedFrom ?? current.id;
  const skipped = { ...data.skipped };
  const dayList = skipped[date];
  if (dayList) skipped[date] = dayList.filter((id) => id !== current.id);
  return {
    ...data,
    swaps: { ...data.swaps, [date]: { ...(data.swaps[date] ?? {}), [from]: swapped } },
    exNames: { ...data.exNames, [swapped.id]: swapped.name },
    exDefs: {
      ...data.exDefs,
      [swapped.id]: {
        id: swapped.id,
        name: swapped.name,
        type: swapped.type,
        muscles: swapped.muscles,
        isTime: Boolean(swapped.isTime),
      },
    },
    skipped,
  };
}

export type RevertStatus = 'ok' | 'blocked' | 'not-swapped';

export function revertSwap(
  data: AppData,
  date: DateKey,
  swapped: Exercise,
): { data: AppData; status: RevertStatus } {
  if (!swapped.swappedFrom) return { data, status: 'not-swapped' };
  for (let i = 0; i < swapped.sets; i++) {
    if (getSet(data, date, swapped.id, i).done) return { data, status: 'blocked' };
  }
  const swaps = { ...data.swaps };
  const day = { ...(swaps[date] ?? {}) };
  delete day[swapped.swappedFrom];
  if (Object.keys(day).length) swaps[date] = day;
  else delete swaps[date];

  const workouts = { ...data.workouts };
  const dayWorkouts = workouts[date];
  if (dayWorkouts) {
    const copy = { ...dayWorkouts };
    delete copy[swapped.id];
    workouts[date] = copy;
  }
  return { data: { ...data, swaps, workouts }, status: 'ok' };
}

/* ------------------------------------------------------------------ */
/* Forme du jour, profil, préférences                                  */
/* ------------------------------------------------------------------ */

export const saveReadiness = (data: AppData, date: DateKey, r: Readiness): AppData => ({
  ...data,
  readiness: { ...data.readiness, [date]: r },
});

export const saveProfile = (data: AppData, patch: Partial<Profile>): AppData => ({
  ...data,
  profile: { ...data.profile, ...patch },
});

export const setPref = (data: AppData, key: 'sound' | 'vibrate', value: boolean): AppData => ({
  ...data,
  prefs: { ...data.prefs, [key]: value },
});

/** Poids de travail (kg) d'une série, utile pour les contrôles de record. */
export const setWeight = (s: SetLog): number => toNumber(s.weight);
