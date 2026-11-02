import type { AppData, DateKey, ExDef, ExerciseId, Program, ProgramId, RunLog, SessionPR, SetLog } from '../types';
import { toNumber } from '../format/numbers';
import { findExDef, findExName, getProgramConfig, getEffectiveDayProgram } from './program';

export interface SummaryExercise {
  id: ExerciseId;
  name: string;
  def: ExDef | undefined;
  sets: SetLog[];
  settings: string;
  rpe: string;
}

export interface SessionSummary {
  date: DateKey;
  exercises: SummaryExercise[];
  program: { key: ProgramId | null; name: string } | null;
  run: RunLog | null;
  sets: number;
  tonnage: number;
  /** RPE moyen des exercices renseignés. */
  rpe: number | null;
  minutes: number | null;
  prs: SessionPR[];
  note: string;
  /** Heure de début (timestamp ms) de la séance, si connue. */
  start: number | null;
  /** Exercices du programme passés (« Sauter ») et jamais commencés. */
  skipped: string[];
}

/** Programme de la séance : celui enregistré, sinon celui qui recouvre le plus d'exercices faits. */
function inferProgram(
  data: AppData,
  date: DateKey,
  doneIds: ExerciseId[],
): { key: ProgramId | null; name: string } | null {
  const cfg = getProgramConfig(data);
  const meta = data.sessionMeta[date]?.prog;
  if (meta) return { key: cfg.programs[meta.key] ? meta.key : null, name: meta.name || 'Séance' };

  const suggested = getEffectiveDayProgram(data, date).key;
  let best: ProgramId | null = null;
  let bestCount = 0;
  for (const [key, prog] of Object.entries(cfg.programs)) {
    if (prog.type === 'rest') continue;
    const count = prog.exercises.filter((e) => doneIds.includes(e.id)).length;
    if (count > bestCount || (count === bestCount && count > 0 && key === suggested)) {
      best = key;
      bestCount = count;
    }
  }
  const prog: Program | undefined = best ? cfg.programs[best] : undefined;
  return best && prog ? { key: best, name: prog.fullName } : null;
}

export function sessionSummary(data: AppData, date: DateKey): SessionSummary {
  const day = data.workouts[date] ?? {};
  const notes = data.exNotes[date] ?? {};
  const meta = data.sessionMeta[date] ?? {};

  const exercises: SummaryExercise[] = [];
  const rpes: number[] = [];
  let sets = 0;
  let tonnage = 0;

  for (const [id, all] of Object.entries(day)) {
    const done = all.filter((s) => s.done);
    if (!done.length) continue;
    const def = findExDef(data, id);
    const note = notes[id];
    sets += done.length;
    if (!def?.isTime) {
      for (const s of done) tonnage += toNumber(s.weight) * (toNumber(s.reps) || 10);
    }
    const rpe = parseFloat(note?.rpe ?? '');
    if (rpe > 0) rpes.push(rpe);
    exercises.push({ id, name: findExName(data, id), def, sets: done, settings: note?.settings ?? '', rpe: note?.rpe ?? '' });
  }

  const program = exercises.length ? inferProgram(data, date, exercises.map((e) => e.id)) : null;
  if (program?.key) {
    const order = (getProgramConfig(data).programs[program.key]?.exercises ?? []).map((e) => e.id);
    const rank = (id: string): number => {
      const i = order.indexOf(id);
      return i < 0 ? 99 : i;
    };
    exercises.sort((a, b) => rank(a.id) - rank(b.id));
  }

  const run = data.runLogs[date]?.done ? (data.runLogs[date] ?? null) : null;
  const doneIds = new Set(exercises.map((e) => e.id));

  return {
    date,
    exercises,
    program,
    run,
    sets,
    tonnage: Math.round(tonnage),
    rpe: rpes.length ? Math.round((rpes.reduce((a, b) => a + b, 0) / rpes.length) * 10) / 10 : null,
    minutes: meta.ms && meta.ms > 0 ? Math.max(1, Math.round(meta.ms / 6e4)) : null,
    prs: meta.prs ?? [],
    note: meta.note ?? '',
    start: meta.start ?? null,
    skipped: (data.skipped[date] ?? []).filter((id) => !doneIds.has(id)).map((id) => findExName(data, id)),
  };
}
