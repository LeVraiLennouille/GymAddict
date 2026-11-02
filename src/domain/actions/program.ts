/**
 * Édition du programme : planning, séances, exercices, sorties.
 * Chaque fonction renvoie un nouvel `AppData` (ou `null`/`{ ok: false }` quand l'opération est refusée).
 */
import type {
  AppData,
  DayName,
  Exercise,
  ExerciseId,
  ExerciseType,
  MuscleKey,
  Program,
  ProgramColor,
  ProgramConfig,
  ProgramId,
  RunDef,
  RunId,
  SupersetGroup,
} from '../types';
import { ALL_MUSCLE_KEYS } from '../defaults/constants';
import { buildRepsLabel, exRepFields } from '../rules/progression';
import { getProgramConfig, rememberExNames } from '../rules/program';
import { boundedNumber, cleanName, cleanText, clone, has } from '../rules/sanitize';
import { findKnownByName } from '../rules/swap';

/** Applique une modification à une copie du programme ; renvoie `data` tel quel si rien n'a changé. */
function edit(data: AppData, fn: (cfg: ProgramConfig) => void): AppData {
  const current = getProgramConfig(data);
  const cfg = clone(current);
  fn(cfg);
  if (JSON.stringify(cfg) === JSON.stringify(current)) return data;
  return rememberExNames({ ...data, program: cfg });
}

const clamp = (n: number, min: number, max: number): number => Math.min(max, Math.max(min, n));

function move<T>(list: T[], index: number, dir: -1 | 1): boolean {
  const j = index + dir;
  const a = list[index];
  const b = list[j];
  if (a === undefined || b === undefined) return false;
  list[index] = b;
  list[j] = a;
  return true;
}

/* ------------------------------------------------------------------ */
/* Planning et séances                                                 */
/* ------------------------------------------------------------------ */

export function setWeeklyProgram(data: AppData, day: DayName, programId: ProgramId): AppData {
  return edit(data, (cfg) => {
    if (has(cfg.programs, programId)) cfg.weekly[day] = programId;
  });
}

export function addProgram(data: AppData, nowMs: number): { data: AppData; id: ProgramId } {
  const id = `prog_${nowMs.toString(36)}`;
  const next = edit(data, (cfg) => {
    cfg.programs[id] = { label: 'Séance', fullName: 'Nouvelle séance', type: 'gym', color: 'green', exercises: [] };
    cfg.order.push(id);
  });
  return { data: next, id };
}

export function setProgramName(data: AppData, id: ProgramId, field: 'label' | 'fullName', text: string): AppData {
  const name = cleanName(text);
  return edit(data, (cfg) => {
    const p = cfg.programs[id];
    if (p) p[field] = name || (field === 'label' ? 'Séance' : 'Nouvelle séance');
  });
}

export function setProgramColor(data: AppData, id: ProgramId, color: ProgramColor): AppData {
  return edit(data, (cfg) => {
    const p = cfg.programs[id];
    if (p) p.color = color;
  });
}

export function moveProgram(data: AppData, id: ProgramId, dir: -1 | 1): AppData {
  return edit(data, (cfg) => {
    move(cfg.order, cfg.order.indexOf(id), dir);
  });
}

/** Supprime une séance (jamais « repos ») ; les jours qui l'utilisaient retombent sur « repos ». */
export function deleteProgram(data: AppData, id: ProgramId): AppData | null {
  if (id === 'repos' || !has(getProgramConfig(data).programs, id)) return null;
  const next = edit(data, (cfg) => {
    delete cfg.programs[id];
    cfg.order = cfg.order.filter((k) => k !== id);
    for (const day of Object.keys(cfg.weekly) as DayName[]) if (cfg.weekly[day] === id) cfg.weekly[day] = 'repos';
  });
  const dayProgram = { ...next.dayProgram };
  for (const [date, key] of Object.entries(dayProgram)) if (key === id) delete dayProgram[date as keyof typeof dayProgram];
  return { ...next, dayProgram };
}

/** Revient au programme par défaut (les séances déjà faites ne sont pas touchées). */
export function resetProgramConfig(data: AppData): AppData {
  const next = { ...data };
  delete next.program;
  return rememberExNames(next);
}

/* ------------------------------------------------------------------ */
/* Exercices                                                           */
/* ------------------------------------------------------------------ */

export interface ExercisePatch {
  name?: string;
  sets?: number;
  reps?: { min: number; max: number };
  failure?: boolean;
  isTime?: boolean;
  type?: ExerciseType;
  restSec?: number;
  /** `null` : retire l'incrément personnalisé. */
  step?: number | null;
  /** `null` : retire du superset. */
  superset?: SupersetGroup | null;
  optional?: boolean;
  /** Ajoute le muscle s'il est absent, le retire sinon. */
  toggleMuscle?: MuscleKey;
}

/** Applique une modification à un exercice (fonction pure, sans effet sur le reste du programme). */
export function applyExercisePatch(ex: Exercise, patch: ExercisePatch): Exercise {
  const out: Exercise = { ...ex, muscles: [...ex.muscles] };

  if (patch.name !== undefined) out.name = cleanName(patch.name) || ex.name;
  if (patch.sets !== undefined) out.sets = clamp(Math.round(patch.sets) || 1, 1, 12);
  if (patch.restSec !== undefined) out.restSec = clamp(Math.round(patch.restSec) || 90, 10, 600);
  if (patch.type !== undefined) out.type = patch.type;
  if (patch.optional !== undefined) {
    if (patch.optional) out.optional = true;
    else delete out.optional;
  }
  if (patch.step !== undefined) {
    if (patch.step !== null && patch.step > 0) out.step = patch.step;
    else delete out.step;
  }
  if (patch.superset !== undefined) {
    if (patch.superset) out.superset = patch.superset;
    else delete out.superset;
  }
  if (patch.toggleMuscle && (ALL_MUSCLE_KEYS as readonly string[]).includes(patch.toggleMuscle)) {
    const m = patch.toggleMuscle;
    out.muscles = out.muscles.includes(m) ? out.muscles.filter((x) => x !== m) : [...out.muscles, m];
  }

  // Répétitions : fourchette, « jusqu'à l'échec », secondes ou répétitions.
  const before = exRepFields(ex);
  if (patch.isTime !== undefined) {
    if (patch.isTime) out.isTime = true;
    else delete out.isTime;
  }
  if (patch.reps) {
    const min = clamp(Math.round(patch.reps.min) || 1, 1, 999);
    const max = clamp(Math.round(patch.reps.max) || min, min, 999);
    // Même fourchette qu'avant : on ne touche ni au libellé ni aux répétitions par défaut.
    if (before.failure || before.min !== min || before.max !== max || patch.isTime !== undefined) {
      out.defaultReps = Math.round((min + max) / 2);
      out.repsLabel = buildRepsLabel(out, min, max);
    }
  } else if (patch.failure !== undefined) {
    if (patch.failure) {
      out.repsLabel = 'Échec';
    } else {
      const n = out.defaultReps || 10;
      out.repsLabel = buildRepsLabel({ ...out, repsLabel: `${n}` }, n, n);
    }
  } else if (patch.isTime !== undefined && !before.failure) {
    out.repsLabel = buildRepsLabel(out, before.min, before.max);
  }
  return out;
}

export function addExercise(data: AppData, programId: ProgramId, nowMs: number): { data: AppData; id: ExerciseId } {
  const id = `ex_${nowMs.toString(36)}`;
  const next = edit(data, (cfg) => {
    const program = cfg.programs[programId];
    if (!program || program.type === 'rest') return; // un jour de repos n'a pas d'exercices
    program.exercises.push({
      id,
      name: 'Nouvel exercice',
      sets: 3,
      repsLabel: '8-12 reps',
      defaultReps: 10,
      type: 'isolation',
      muscles: [],
      restSec: 90,
    });
  });
  return { data: next, id };
}

export function updateExercise(data: AppData, programId: ProgramId, exId: ExerciseId, patch: ExercisePatch): AppData {
  let linkedId: string | null = null;
  if (patch.name !== undefined && exId.startsWith('ex_')) {
    // Un exercice créé à la main qui porte le nom d'un exercice connu reprend son identifiant :
    // l'historique et les records sont alors partagés.
    const known = findKnownByName(data, patch.name);
    const inProgram = getProgramConfig(data).programs[programId]?.exercises.some((e) => e.id === known?.id);
    if (known && known.id !== exId && !inProgram) linkedId = known.id;
  }
  return edit(data, (cfg) => {
    const list = cfg.programs[programId]?.exercises;
    const i = list ? list.findIndex((e) => e.id === exId) : -1;
    const ex = list?.[i];
    if (!list || !ex) return;
    const updated = applyExercisePatch(ex, patch);
    if (linkedId) updated.id = linkedId;
    list[i] = updated;
  });
}

export function moveExercise(data: AppData, programId: ProgramId, exId: ExerciseId, dir: -1 | 1): AppData {
  return edit(data, (cfg) => {
    const list = cfg.programs[programId]?.exercises;
    if (list) move(list, list.findIndex((e) => e.id === exId), dir);
  });
}

export function deleteExercise(data: AppData, programId: ProgramId, exId: ExerciseId): AppData {
  return edit(data, (cfg) => {
    const p: Program | undefined = cfg.programs[programId];
    if (p) p.exercises = p.exercises.filter((e) => e.id !== exId);
  });
}

/* ------------------------------------------------------------------ */
/* Sorties running                                                     */
/* ------------------------------------------------------------------ */

export function setRunDay(data: AppData, day: DayName, runId: RunId | ''): AppData {
  return edit(data, (cfg) => {
    cfg.runWeekly[day] = runId && has(cfg.runs, runId) ? runId : '';
  });
}

export function setWeeklyKm(data: AppData, raw: string): AppData {
  return edit(data, (cfg) => {
    cfg.weeklyKm = boundedNumber(raw, 0, 500);
  });
}

export function addRun(data: AppData, nowMs: number): { data: AppData; id: RunId } {
  const id = `run_${nowMs.toString(36)}`;
  const next = edit(data, (cfg) => {
    cfg.runs[id] = { name: 'Nouvelle sortie', desc: '', detail: '', targetDistance: 0, targetDuration: 0, targetPace: 0 };
    cfg.runOrder.push(id);
  });
  return { data: next, id };
}

export type RunField = 'name' | 'desc' | 'detail' | 'targetDistance' | 'targetDuration' | 'targetPace';

const RUN_LIMITS = {
  targetDistance: [0, 200],
  targetDuration: [0, 600],
  targetPace: [0, 1800],
} as const;

/** Modifie un champ de sortie ; pour l'allure, `value` est en secondes par km. */
export function setRunField(data: AppData, runId: RunId, field: RunField, value: string): AppData {
  return edit(data, (cfg) => {
    const run: RunDef | undefined = cfg.runs[runId];
    if (!run) return;
    if (field === 'name') run.name = cleanText(value, 40) || 'Sortie';
    else if (field === 'desc' || field === 'detail') run[field] = cleanText(value, 240);
    else run[field] = boundedNumber(value, RUN_LIMITS[field][0], RUN_LIMITS[field][1]);
  });
}

export function moveRun(data: AppData, runId: RunId, dir: -1 | 1): AppData {
  return edit(data, (cfg) => {
    move(cfg.runOrder, cfg.runOrder.indexOf(runId), dir);
  });
}

export function deleteRun(data: AppData, runId: RunId): AppData {
  return edit(data, (cfg) => {
    delete cfg.runs[runId];
    cfg.runOrder = cfg.runOrder.filter((k) => k !== runId);
    for (const day of Object.keys(cfg.runWeekly) as DayName[]) if (cfg.runWeekly[day] === runId) cfg.runWeekly[day] = '';
  });
}
