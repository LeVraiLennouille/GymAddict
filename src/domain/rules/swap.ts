import type { AppData, DateKey, Exercise, ExerciseId, ExerciseType, MuscleKey } from '../types';
import { baseId, dayExercises, findExDef, getEffectiveDayProgram, getProgramConfig } from './program';
import { normName } from './sanitize';

/** Exercice proposé en remplacement (définition complète ou partielle). */
export type SwapTarget = Pick<Exercise, 'id' | 'name' | 'type' | 'muscles'> &
  Partial<Pick<Exercise, 'isTime' | 'repsLabel' | 'defaultReps' | 'restSec' | 'step'>>;

/** Exercices déjà connus (programme + historique), sans doublon, triés par nom. */
export function knownExercises(data: AppData): { id: ExerciseId; name: string }[] {
  const names: Record<string, string> = { ...data.exNames };
  for (const prog of Object.values(getProgramConfig(data).programs)) {
    for (const ex of prog.exercises) names[ex.id] = ex.name;
  }
  return Object.entries(names)
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function findKnownByName(data: AppData, name: string): { id: ExerciseId; name: string } | undefined {
  const key = normName(name);
  return knownExercises(data).find((e) => normName(e.name) === key);
}

/** Suggestions de remplacement : même muscle, jamais un exercice déjà au programme du jour. */
export function swapCandidates(data: AppData, current: Exercise, date: DateKey): SwapTarget[] {
  const { prog } = getEffectiveDayProgram(data, date);
  const inDay = new Set(dayExercises(data, date, prog).map((e) => e.id));

  const pool = new Map<string, SwapTarget>();
  for (const def of Object.values(data.exDefs)) pool.set(def.id, def);
  for (const p of Object.values(getProgramConfig(data).programs)) {
    for (const ex of p.exercises) pool.set(ex.id, ex);
  }

  const main = current.muscles[0];
  return [...pool.values()]
    .filter(
      (e) =>
        !inDay.has(e.id) &&
        e.type !== 'echauffement' &&
        e.muscles.some((m) => current.muscles.includes(m)),
    )
    .map((e) => {
      let score = 0;
      if (e.muscles[0] === main) score += 3;
      if (e.type === current.type) score += 1;
      if (Boolean(e.isTime) === Boolean(current.isTime)) score += 1;
      return { e, score };
    })
    .sort((a, b) => b.score - a.score || a.e.name.localeCompare(b.e.name))
    .slice(0, 8)
    .map((x) => x.e);
}

/** Construit l'exercice « remplaçant » en gardant le volume (séries × répétitions) de l'original. */
export function buildSwapDef(current: Exercise, target: SwapTarget): Exercise {
  const timeChanged = Boolean(target.isTime) !== Boolean(current.isTime);
  const swapped: Exercise = {
    ...current,
    id: target.id,
    name: target.name,
    type: target.type || current.type,
    muscles: target.muscles.length ? [...target.muscles] : [...current.muscles],
    restSec: target.restSec || current.restSec,
    swappedFrom: current.swappedFrom ?? current.id,
    swappedName: current.swappedName ?? current.name,
  };
  if (target.isTime) swapped.isTime = true;
  else delete swapped.isTime;

  if (timeChanged) {
    swapped.repsLabel = target.repsLabel || (target.isTime ? '30-60 sec' : '8-12 reps');
    swapped.defaultReps = target.defaultReps || (target.isTime ? 45 : 10);
  }
  delete swapped.step;
  if (target.step && target.step > 0) swapped.step = target.step;
  return swapped;
}

/**
 * Exercice prêt à être ajouté à une séance : la version complète du programme si elle existe
 * (séries, répétitions, repos), sinon une fiche construite à partir de sa définition connue.
 */
export function exerciseTemplate(data: AppData, id: ExerciseId): Exercise | null {
  for (const prog of Object.values(getProgramConfig(data).programs)) {
    const ex = prog.exercises.find((e) => e.id === id);
    if (ex) {
      const copy: Exercise = { ...ex, muscles: [...ex.muscles] };
      delete copy.superset;
      delete copy.swappedFrom;
      delete copy.swappedName;
      return copy;
    }
  }
  const def = data.exDefs[id];
  if (!def) return null;
  const ex: Exercise = {
    id: def.id,
    name: def.name,
    sets: 3,
    repsLabel: def.isTime ? '30-60 sec' : '8-12 reps',
    defaultReps: def.isTime ? 45 : 10,
    type: def.type,
    muscles: [...def.muscles],
    restSec: def.type === 'compound' ? 120 : 90,
  };
  if (def.isTime) ex.isTime = true;
  return ex;
}

/** Nouvel exercice inventé par l'utilisateur (identifiant unique, valeurs par défaut raisonnables). */
export function customExercise(name: string, muscles: Exercise['muscles'], type: Exercise['type'], nowMs: number): Exercise {
  return {
    id: `ex_${nowMs.toString(36)}`,
    name,
    sets: 3,
    repsLabel: '8-12 reps',
    defaultReps: 10,
    type,
    muscles: [...muscles],
    restSec: type === 'compound' ? 120 : 90,
  };
}

export interface LibraryItem {
  id: ExerciseId;
  name: string;
  muscles: MuscleKey[];
  type: ExerciseType;
}

/** Exercices connus que l'on peut ajouter à la séance d'un jour (ceux qui n'y sont pas déjà), par ordre alphabétique. */
export function exerciseLibrary(data: AppData, date: DateKey): LibraryItem[] {
  const { prog } = getEffectiveDayProgram(data, date);
  const taken = new Set(dayExercises(data, date, prog).flatMap((e) => [e.id, baseId(e)]));
  const items: LibraryItem[] = [];
  for (const { id, name } of knownExercises(data)) {
    if (taken.has(id)) continue;
    const def = findExDef(data, id);
    items.push({ id, name, muscles: def ? [...def.muscles] : [], type: def?.type ?? 'isolation' });
  }
  return items;
}
