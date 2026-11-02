import type { AppData, DateKey, Exercise, ExerciseId } from '../types';
import { getEffectiveDayProgram, orderedExercises } from './program';
import { getSet, isSkipped } from './sets';

function activeOrdered(data: AppData, date: DateKey): Exercise[] {
  const { prog } = getEffectiveDayProgram(data, date);
  return orderedExercises(data, date, prog).filter((e) => !isSkipped(data, date, e.id));
}

/** Prochain exercice du même superset à enchaîner pour la série `setIdx`, s'il y en a un. */
export function supersetNext(
  data: AppData,
  date: DateKey,
  exId: ExerciseId,
  setIdx: number,
): Exercise | null {
  const list = activeOrdered(data, date);
  const cur = list.find((e) => e.id === exId);
  if (!cur || !cur.superset) return null;
  const group = list.filter((e) => e.superset === cur.superset);
  if (group.length < 2) return null;
  return (
    group
      .slice(group.indexOf(cur) + 1)
      .find((e) => setIdx < e.sets && !getSet(data, date, e.id, setIdx).done) ?? null
  );
}

/** Repos à lancer après une série : le plus long du superset, sinon celui de l'exercice. */
export function supersetRest(
  data: AppData,
  date: DateKey,
  exId: ExerciseId,
  defaultRest: number,
): number {
  const list = activeOrdered(data, date);
  const cur = list.find((e) => e.id === exId);
  if (!cur || !cur.superset) return defaultRest || 90;
  return Math.max(...list.filter((e) => e.superset === cur.superset).map((e) => e.restSec || 90));
}
