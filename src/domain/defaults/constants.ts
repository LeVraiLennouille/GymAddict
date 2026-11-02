import type { AvatarKey, DayName, ExerciseType, MuscleKey, ProgramColor } from '../types';

export const DAYS_ORDER: readonly DayName[] = [
  'lundi',
  'mardi',
  'mercredi',
  'jeudi',
  'vendredi',
  'samedi',
  'dimanche',
];

export const DAY_LABELS: Record<DayName, string> = {
  lundi: 'Lundi',
  mardi: 'Mardi',
  mercredi: 'Mercredi',
  jeudi: 'Jeudi',
  vendredi: 'Vendredi',
  samedi: 'Samedi',
  dimanche: 'Dimanche',
};

/** Index `Date.getDay()` (0 = dimanche) vers nom de jour. */
export const DAY_JS_MAP: readonly DayName[] = [
  'dimanche',
  'lundi',
  'mardi',
  'mercredi',
  'jeudi',
  'vendredi',
  'samedi',
];

/** Muscles suivis dans les statistiques (radar, volume hebdomadaire). */
export const MUSCLE_KEYS: readonly MuscleKey[] = [
  'pecs',
  'dos',
  'epaules',
  'biceps',
  'triceps',
  'abdos',
  'jambes',
];

/** Tous les muscles utilisables dans un exercice. */
export const ALL_MUSCLE_KEYS: readonly MuscleKey[] = [...MUSCLE_KEYS, 'trapezes', 'mollets'];

export const MUSCLE_LABELS: Record<MuscleKey, string> = {
  pecs: 'Pecs',
  dos: 'Dos',
  epaules: 'Épaules',
  biceps: 'Biceps',
  triceps: 'Triceps',
  abdos: 'Abdos',
  jambes: 'Jambes',
  trapezes: 'Trapèzes',
  mollets: 'Mollets',
};

export const EXERCISE_TYPES: readonly ExerciseType[] = ['compound', 'isolation', 'echauffement'];

export const EXERCISE_TYPE_LABELS: Record<ExerciseType, string> = {
  compound: 'Compound',
  isolation: 'Isolation',
  echauffement: 'Échauffement',
};

export const PROGRAM_COLORS: readonly ProgramColor[] = ['red', 'blue', 'yellow', 'green', 'grey'];

export const AVATARS: readonly AvatarKey[] = ['red', 'blue', 'yellow', 'green', 'grey', 'white'];

/** Durée d'inactivité (ms) au-delà de laquelle le chrono d'une séance est mis en pause. */
export const SESSION_GAP_MS = 27e5;

/** Corrections de muscles appliquées aux anciens programmes enregistrés. */
export const MUSCLE_FIXES: Record<string, { from: MuscleKey[]; to: MuscleKey[] }> = {
  tractions: { from: ['triceps'], to: ['dos', 'biceps'] },
  pupitre_halteres: { from: ['triceps'], to: ['biceps'] },
  curl_ez_bar: { from: ['triceps'], to: ['biceps'] },
};
