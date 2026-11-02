import type { AppData, DateKey } from '../types';
import { getProgramConfig } from '../rules/program';
import { sessionSummary } from '../rules/summary';
import { emptySet } from '../rules/appData';
import { saveDayProgramOverride, saveExNote, setSetField } from './workout';

export type DuplicateError = 'today' | 'has-sets' | 'not-found';

/**
 * Préremplit la séance d'aujourd'hui avec les charges et répétitions d'une séance passée.
 * Refusé si aujourd'hui a déjà des séries validées ou si le programme n'existe plus.
 */
export function duplicateSession(
  data: AppData,
  from: DateKey,
  today: DateKey,
): { ok: true; data: AppData; count: number } | { ok: false; error: DuplicateError } {
  if (from === today) return { ok: false, error: 'today' };
  const hasDone = Object.values(data.workouts[today] ?? {}).some((sets) => sets.some((s) => s.done));
  if (hasDone) return { ok: false, error: 'has-sets' };

  const summary = sessionSummary(data, from);
  const key = summary.program?.key;
  const program = key ? getProgramConfig(data).programs[key] : undefined;
  if (!key || !program || !summary.exercises.length) return { ok: false, error: 'not-found' };

  // On repart d'une journée vierge, puis on remplit exercice par exercice.
  const workouts = { ...data.workouts };
  delete workouts[today];
  const exNotes = { ...data.exNotes };
  delete exNotes[today];
  const skipped = { ...data.skipped };
  delete skipped[today];
  const dayOrder = { ...data.dayOrder };
  delete dayOrder[today];
  let next: AppData = saveDayProgramOverride({ ...data, workouts, exNotes, skipped, dayOrder }, today, key);

  let count = 0;
  for (const ex of program.exercises) {
    const past = summary.exercises.find((e) => e.id === ex.id);
    if (!past) continue;
    past.sets.slice(0, ex.sets).forEach((set, i) => {
      next = setSetField(next, today, ex.id, i, 'weight', String(set.weight ?? emptySet().weight));
      next = setSetField(next, today, ex.id, i, 'reps', String(set.reps ?? emptySet().reps));
    });
    if (past.settings) next = saveExNote(next, today, ex.id, 'settings', past.settings);
    count++;
  }
  return { ok: true, data: next, count };
}
