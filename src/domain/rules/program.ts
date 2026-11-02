import type {
  AppData,
  DateKey,
  DayName,
  EffectiveProgram,
  ExDef,
  Exercise,
  ExerciseType,
  MuscleKey,
  Program,
  ProgramConfig,
  ProgramId,
  RunDef,
  RunId,
  SupersetGroup,
} from '../types';
import {
  ALL_MUSCLE_KEYS,
  DAYS_ORDER,
  EXERCISE_TYPES,
  MUSCLE_FIXES,
  PROGRAM_COLORS,
} from '../defaults/constants';
import {
  DEFAULT_PROGRAMS,
  DEFAULT_RUNS,
  DEFAULT_RUN_ORDER,
  DEFAULT_RUN_WEEKLY,
  defaultProgramConfig,
} from '../defaults/programs';
import { dayNameOf } from '../format/dates';
import { asId, asInt, asName, boundedNumber, clone, cleanText, has, isRecord } from './sanitize';

const clamp = (n: number, min: number, max: number): number => Math.min(max, Math.max(min, n));

const isMuscleKey = (v: string): v is MuscleKey => (ALL_MUSCLE_KEYS as readonly string[]).includes(v);
const isExerciseType = (v: unknown): v is ExerciseType =>
  typeof v === 'string' && (EXERCISE_TYPES as readonly string[]).includes(v);

export const REST_PROGRAM: Program = DEFAULT_PROGRAMS['repos'] ?? {
  label: 'Repos',
  fullName: 'Repos Total',
  type: 'rest',
  color: 'grey',
  exercises: [],
};

/* ------------------------------------------------------------------ */
/* Nettoyage d'un exercice / d'un programme importé                    */
/* ------------------------------------------------------------------ */

export function sanitizeExercise(raw: unknown): Exercise | null {
  if (!isRecord(raw)) return null;
  const id = asId(raw['id']);
  const name = asName(raw['name']);
  if (!id || !name) return null;

  const defaultReps = clamp(asInt(raw['defaultReps'], 10), 1, 999);
  const isTime = Boolean(raw['isTime']);
  const type = isExerciseType(raw['type']) ? raw['type'] : 'isolation';
  let muscles: MuscleKey[] = Array.isArray(raw['muscles'])
    ? raw['muscles'].map(String).filter(isMuscleKey)
    : [];

  const ex: Exercise = {
    id,
    name,
    sets: clamp(asInt(raw['sets'], 3), 1, 12),
    repsLabel: asName(raw['repsLabel']) ?? `${defaultReps}${isTime ? ' sec' : ' reps'}`,
    defaultReps,
    type,
    muscles,
    restSec: clamp(asInt(raw['restSec'], 90), 10, 600),
  };
  if (isTime) ex.isTime = true;

  const step = parseFloat(String(raw['step']));
  if (step > 0) ex.step = step;

  const ss = String(raw['superset'] ?? '');
  if (/^[A-D]$/.test(ss)) ex.superset = ss as SupersetGroup;

  if (raw['optional']) ex.optional = true;
  if (typeof raw['swappedFrom'] === 'string') ex.swappedFrom = raw['swappedFrom'];
  if (typeof raw['swappedName'] === 'string') ex.swappedName = raw['swappedName'];

  const fix = MUSCLE_FIXES[ex.id];
  if (fix && JSON.stringify(ex.muscles) === JSON.stringify(fix.from)) {
    muscles = [...fix.to];
    ex.muscles = muscles;
  }
  return ex;
}

export function sanitizeProgramConfig(raw: unknown): ProgramConfig | null {
  if (!isRecord(raw) || !isRecord(raw['programs'])) return null;

  const programs: Record<ProgramId, Program> = {};
  for (const [id, p] of Object.entries(raw['programs'])) {
    if (!isRecord(p)) continue;
    const type = p['type'] === 'rest' ? 'rest' : 'gym';
    const colorRaw = p['color'];
    const color = PROGRAM_COLORS.find((c) => c === colorRaw) ?? (type === 'rest' ? 'grey' : 'green');
    const exercises =
      type === 'rest' || !Array.isArray(p['exercises'])
        ? []
        : p['exercises']
            .map(sanitizeExercise)
            .filter((e): e is Exercise => e !== null);
    programs[id] = {
      label: asName(p['label']) ?? asName(p['fullName']) ?? 'Séance',
      fullName: asName(p['fullName']) ?? asName(p['label']) ?? 'Séance',
      type,
      color,
      exercises,
    };
  }
  if (!has(programs, 'repos')) programs['repos'] = clone(REST_PROGRAM);

  const order = (Array.isArray(raw['order']) ? raw['order'].map(String) : Object.keys(programs)).filter(
    (k) => has(programs, k),
  );
  for (const k of Object.keys(programs)) if (!order.includes(k)) order.push(k);

  const weeklyRaw = isRecord(raw['weekly']) ? raw['weekly'] : {};
  const weekly = {} as Record<DayName, ProgramId>;
  for (const day of DAYS_ORDER) {
    const k = String(weeklyRaw[day] ?? '');
    weekly[day] = has(programs, k) ? k : 'repos';
  }

  const hasRuns = isRecord(raw['runs']);
  const runsSrc: Record<string, unknown> = hasRuns ? (raw['runs'] as Record<string, unknown>) : DEFAULT_RUNS;
  const runs: Record<RunId, RunDef> = {};
  for (const [id, r] of Object.entries(runsSrc)) {
    if (!isRecord(r)) continue;
    runs[id] = {
      name: cleanText(r['name'], 40) || 'Sortie',
      desc: cleanText(r['desc'], 240),
      detail: cleanText(r['detail'], 240),
      targetDistance: boundedNumber(r['targetDistance'], 0, 200),
      targetDuration: boundedNumber(r['targetDuration'], 0, 600),
      targetPace: boundedNumber(r['targetPace'], 0, 1800),
    };
  }

  const runOrderSrc: string[] = hasRuns
    ? Array.isArray(raw['runOrder'])
      ? raw['runOrder'].map(String)
      : Object.keys(runs)
    : DEFAULT_RUN_ORDER;
  const runOrder = runOrderSrc.filter((k) => has(runs, k));
  for (const k of Object.keys(runs)) if (!runOrder.includes(k)) runOrder.push(k);

  const runWeeklySrc: Record<string, unknown> = hasRuns
    ? isRecord(raw['runWeekly'])
      ? raw['runWeekly']
      : {}
    : DEFAULT_RUN_WEEKLY;
  const runWeekly = {} as Record<DayName, RunId | ''>;
  for (const day of DAYS_ORDER) {
    const k = String(runWeeklySrc[day] ?? '');
    runWeekly[day] = has(runs, k) ? k : '';
  }

  return {
    v: 1,
    programs,
    order,
    weekly,
    runs,
    runOrder,
    runWeekly,
    weeklyKm: boundedNumber(raw['weeklyKm'], 0, 500),
  };
}

/* ------------------------------------------------------------------ */
/* Lecture du programme                                                */
/* ------------------------------------------------------------------ */

const DEFAULT_CONFIG: ProgramConfig = defaultProgramConfig();

/** Configuration de programme active : celle de l'utilisateur, sinon la configuration par défaut. */
export const getProgramConfig = (data: AppData): ProgramConfig => data.program ?? DEFAULT_CONFIG;

export function suggestedProgramKey(cfg: ProgramConfig, day: DayName): ProgramId {
  const key = cfg.weekly[day];
  return has(cfg.programs, key) ? key : 'repos';
}

/** Programmes proposés dans le sélecteur, dans l'ordre choisi. */
export const programPickerKeys = (cfg: ProgramConfig): ProgramId[] =>
  cfg.order.filter((k) => has(cfg.programs, k));

export function getEffectiveDayProgram(data: AppData, date: DateKey): EffectiveProgram {
  const cfg = getProgramConfig(data);
  const dayName = dayNameOf(date);
  const override = data.dayProgram[date];
  const overridden = override ? cfg.programs[override] : undefined;
  if (override && overridden) return { key: override, prog: overridden, dayName, isSuggestion: false };
  const key = suggestedProgramKey(cfg, dayName);
  return { key, prog: cfg.programs[key] ?? REST_PROGRAM, dayName, isSuggestion: true };
}

/** Exercices du jour, avec les remplacements ponctuels appliqués. */
export function dayExercises(data: AppData, date: DateKey, prog: Program | undefined): Exercise[] {
  if (!prog) return [];
  const swaps = data.swaps[date];
  return swaps ? prog.exercises.map((ex) => swaps[ex.id] ?? ex) : prog.exercises;
}

export const baseId = (ex: Exercise): string => ex.swappedFrom ?? ex.id;

/** Regroupe les exercices d'un même superset côte à côte. */
export function groupSupersets(list: Exercise[]): Exercise[] {
  const out: Exercise[] = [];
  const seen = new Set<Exercise>();
  for (const ex of list) {
    if (seen.has(ex)) continue;
    out.push(ex);
    seen.add(ex);
    if (ex.superset) {
      for (const other of list) {
        if (!seen.has(other) && other.superset === ex.superset) {
          out.push(other);
          seen.add(other);
        }
      }
    }
  }
  return out;
}

/** Exercices du jour dans l'ordre choisi (reports « à la fin » compris). */
export function orderedExercises(data: AppData, date: DateKey, prog: Program | undefined): Exercise[] {
  const list = dayExercises(data, date, prog);
  const order = data.dayOrder[date];
  let sorted = list;
  if (order && order.length) {
    const byBase = new Map<string, Exercise>();
    list.forEach((ex) => byBase.set(baseId(ex), ex));
    sorted = order.map((id) => byBase.get(id)).filter((e): e is Exercise => e !== undefined);
    list.forEach((ex) => {
      if (!sorted.includes(ex)) sorted.push(ex);
    });
  }
  return groupSupersets(sorted);
}

/** Retient le nom et la définition de chaque exercice du programme (pour l'historique). */
export function rememberExNames(data: AppData): AppData {
  const cfg = getProgramConfig(data);
  let names = data.exNames;
  let defs = data.exDefs;
  let changed = false;
  for (const prog of Object.values(cfg.programs)) {
    for (const ex of prog.exercises) {
      if (names[ex.id] !== ex.name) {
        if (!changed) {
          names = { ...names };
          defs = { ...defs };
          changed = true;
        }
        names[ex.id] = ex.name;
      }
      const def = { id: ex.id, name: ex.name, type: ex.type, muscles: ex.muscles, isTime: Boolean(ex.isTime) };
      if (JSON.stringify(defs[ex.id]) !== JSON.stringify(def)) {
        if (!changed) {
          names = { ...names };
          defs = { ...defs };
          changed = true;
        }
        defs[ex.id] = def;
      }
    }
  }
  return changed ? { ...data, exNames: names, exDefs: defs } : data;
}

export function findExName(data: AppData, id: string): string {
  for (const prog of Object.values(getProgramConfig(data).programs)) {
    const ex = prog.exercises.find((e) => e.id === id);
    if (ex) return ex.name;
  }
  return data.exNames[id] ?? id;
}

/** Définition d'un exercice (programme actuel d'abord, puis historique). */
export function findExDef(data: AppData, id: string): ExDef | undefined {
  for (const prog of Object.values(getProgramConfig(data).programs)) {
    const ex = prog.exercises.find((e) => e.id === id);
    if (ex) return { id: ex.id, name: ex.name, type: ex.type, muscles: ex.muscles, isTime: Boolean(ex.isTime) };
  }
  return data.exDefs[id];
}
