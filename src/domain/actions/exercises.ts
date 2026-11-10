import type { AppData, DateKey, Exercise, ExerciseId } from '../types';
import { dayExercises, getEffectiveDayProgram, baseId, isAddedExercise, sanitizeExercise } from '../rules/program';
import { doneSetCount } from '../rules/sets';

export type AddExerciseError = 'rest-day' | 'already-in-day' | 'invalid';

/** Ajoute un exercice à la séance d'un jour, sans toucher au programme. Refusé un jour de repos ou s'il y est déjà. */
export function addDayExercise(
  data: AppData,
  date: DateKey,
  exercise: Exercise,
): { ok: true; data: AppData } | { ok: false; error: AddExerciseError } {
  const effective = getEffectiveDayProgram(data, date);
  if (effective.prog.type === 'rest') return { ok: false, error: 'rest-day' };

  const ex = sanitizeExercise(exercise);
  if (!ex) return { ok: false, error: 'invalid' };
  const taken = new Set(dayExercises(data, date, effective.prog).flatMap((e) => [e.id, baseId(e)]));
  if (taken.has(ex.id)) return { ok: false, error: 'already-in-day' };

  // Un ajout n'appartient à aucun superset du programme.
  delete ex.superset;
  const skipped = { ...data.skipped };
  const dayList = skipped[date];
  if (dayList) skipped[date] = dayList.filter((id) => id !== ex.id);
  return {
    ok: true,
    data: {
      ...data,
      addedExercises: { ...data.addedExercises, [date]: [...(data.addedExercises[date] ?? []), ex] },
      exNames: { ...data.exNames, [ex.id]: ex.name },
      exDefs: {
        ...data.exDefs,
        [ex.id]: { id: ex.id, name: ex.name, type: ex.type, muscles: ex.muscles, isTime: Boolean(ex.isTime) },
      },
      skipped,
    },
  };
}

export type RemoveExerciseError = 'not-added' | 'has-sets';

/** Retire un exercice ajouté à la volée, tant qu'aucune de ses séries n'est validée. */
export function removeDayExercise(
  data: AppData,
  date: DateKey,
  exId: ExerciseId,
): { ok: true; data: AppData } | { ok: false; error: RemoveExerciseError } {
  const ex = data.addedExercises[date]?.find((e) => e.id === exId);
  if (!ex || !isAddedExercise(data, date, exId)) return { ok: false, error: 'not-added' };
  if (doneSetCount(data, date, ex) > 0) return { ok: false, error: 'has-sets' };

  const addedExercises = { ...data.addedExercises };
  const rest = (addedExercises[date] ?? []).filter((e) => e.id !== exId);
  if (rest.length) addedExercises[date] = rest;
  else delete addedExercises[date];

  const dropKey = <T,>(map: Record<DateKey, Record<string, T>>): Record<DateKey, Record<string, T>> => {
    const day = map[date];
    if (!day || !(exId in day)) return map;
    const copy = { ...day };
    delete copy[exId];
    const out = { ...map };
    if (Object.keys(copy).length) out[date] = copy;
    else delete out[date];
    return out;
  };

  const skipped = { ...data.skipped };
  const skipList = skipped[date]?.filter((id) => id !== exId);
  if (skipList && skipList.length) skipped[date] = skipList;
  else delete skipped[date];
  const dayOrder = { ...data.dayOrder };
  const order = dayOrder[date]?.filter((id) => id !== exId);
  if (order && order.length) dayOrder[date] = order;
  else delete dayOrder[date];

  return {
    ok: true,
    data: { ...data, addedExercises, workouts: dropKey(data.workouts), exNotes: dropKey(data.exNotes), skipped, dayOrder },
  };
}
