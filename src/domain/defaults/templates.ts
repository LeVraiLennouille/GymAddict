import type { DayName, Exercise, ExerciseType, MuscleKey, Program, ProgramColor, ProgramId } from '../types';
import { DEFAULT_PROGRAMS } from './programs';

/** Programmes prêts à l'emploi, importables depuis l'éditeur. */
export interface ProgramTemplate {
  id: string;
  name: string;
  tagline: string;
  level: 'Débutant' | 'Intermédiaire' | 'Tous niveaux';
  daysPerWeek: number;
  /** Précision affichée sous la description (ex. alternance A/B). */
  note?: string;
  programs: Record<ProgramId, Program>;
  order: ProgramId[];
  /** Séance de chaque jour ; un jour absent est un jour de repos. */
  weekly: Partial<Record<DayName, ProgramId>>;
}

/** Exercice déjà connu de l'appli (même identifiant : l'historique et les records sont partagés), avec ajustements. */
function known(id: string, patch: Partial<Exercise> = {}): Exercise {
  for (const program of Object.values(DEFAULT_PROGRAMS)) {
    const found = program.exercises.find((e) => e.id === id);
    if (found) {
      const ex: Exercise = { ...found, muscles: [...found.muscles], ...patch };
      delete ex.superset;
      return ex;
    }
  }
  throw new Error(`Exercice par défaut introuvable : ${id}`);
}

function fresh(
  id: string,
  name: string,
  sets: number,
  repsLabel: string,
  defaultReps: number,
  type: ExerciseType,
  muscles: MuscleKey[],
  restSec: number,
  step?: number,
): Exercise {
  const ex: Exercise = { id, name, sets, repsLabel, defaultReps, type, muscles, restSec };
  if (step) ex.step = step;
  return ex;
}

const reps = (label: string, n: number, sets: number, extra: Partial<Exercise> = {}): Partial<Exercise> => ({
  sets,
  repsLabel: label,
  defaultReps: n,
  ...extra,
});

/* Exercices propres aux modèles (les autres réutilisent ceux de l'appli) */
const ROWING = fresh('rowing_barre', 'Rowing Barre Penché', 4, '8-10 reps', 9, 'compound', ['dos', 'biceps'], 120, 2.5);
const FACE_PULL = fresh('face_pull', 'Face Pull', 3, '12-15 reps', 13, 'isolation', ['epaules', 'trapezes'], 60);
const ROMANIAN = fresh('souleve_roumain', 'Soulevé de Terre Roumain', 3, '8-10 reps', 9, 'compound', ['jambes'], 150, 2.5);
const DEADLIFT = fresh('souleve_de_terre', 'Soulevé de Terre', 3, '5 reps', 5, 'compound', ['jambes', 'dos'], 180, 5);
const HIP_THRUST = fresh('hip_thrust', 'Hip Thrust', 3, '8-12 reps', 10, 'compound', ['jambes'], 120, 2.5);

function program(label: string, fullName: string, color: ProgramColor, exercises: Exercise[]): Program {
  return { label, fullName, type: 'gym', color, exercises };
}

const PUSH = program('Push', 'Push (Pecs, Épaules, Triceps)', 'red', [
  known('dev_couche', reps('6-8 reps', 7, 4, { restSec: 150 })),
  known('dev_militaire', reps('8-10 reps', 9, 3)),
  known('dev_incline', reps('8-12 reps', 10, 3)),
  known('elevations_laterales', reps('12-15 reps', 13, 3)),
  known('ext_triceps_poulie', reps('10-12 reps', 11, 3)),
  known('dips', reps('8-12 reps', 10, 3)),
]);

const PULL = program('Pull', 'Pull (Dos, Biceps)', 'blue', [
  known('tractions', reps('6-10 reps', 8, 4, { restSec: 150 })),
  { ...ROWING },
  known('tirage_vertical', reps('10-12 reps', 11, 3)),
  { ...FACE_PULL },
  known('curl_ez_bar', reps('10-12 reps', 11, 3)),
  known('shrugs', reps('12-15 reps', 13, 3)),
]);

const LEGS = program('Legs', 'Legs (Jambes, Mollets)', 'green', [
  known('squat', reps('6-10 reps', 8, 4, { restSec: 180 })),
  { ...ROMANIAN },
  known('leg_press', reps('10-12 reps', 11, 3)),
  known('leg_curl', reps('10-12 reps', 11, 3)),
  known('mollets', reps('12-15 reps', 13, 4)),
  known('planche_ab', reps('30–60 sec', 45, 3)),
]);

const UPPER_A = program('Haut A', 'Haut du Corps A (Force)', 'yellow', [
  known('dev_couche', reps('6-8 reps', 7, 4, { restSec: 150 })),
  { ...ROWING, sets: 4, repsLabel: '6-8 reps', defaultReps: 7 },
  known('dev_militaire', reps('8-10 reps', 9, 3)),
  known('tirage_vertical', reps('8-12 reps', 10, 3)),
  known('curl_ez_bar', reps('10-12 reps', 11, 2)),
  known('ext_triceps_poulie', reps('10-12 reps', 11, 2)),
]);

const LOWER_A = program('Bas A', 'Bas du Corps A (Force)', 'grey', [
  known('squat', reps('6-8 reps', 7, 4, { restSec: 180 })),
  { ...ROMANIAN },
  known('leg_press', reps('10-12 reps', 11, 3)),
  known('leg_curl', reps('10-12 reps', 11, 3)),
  known('mollets', reps('12-15 reps', 13, 4)),
]);

const UPPER_B = program('Haut B', 'Haut du Corps B (Volume)', 'yellow', [
  known('dev_incline', reps('8-10 reps', 9, 4)),
  known('tractions', reps('6-10 reps', 8, 4)),
  known('elevations_laterales', reps('12-15 reps', 13, 3)),
  known('tirage_horizontal', reps('8-12 reps', 10, 3)),
  known('pupitre_halteres', reps('10-12 reps', 11, 3)),
  known('bar_front', reps('10-12 reps', 11, 3)),
]);

const LOWER_B = program('Bas B', 'Bas du Corps B (Volume)', 'grey', [
  { ...DEADLIFT },
  known('fentes_marchees', reps('10-12 reps / jambe', 11, 3)),
  known('leg_extension', reps('12-15 reps', 13, 3)),
  { ...HIP_THRUST },
  known('mollets', reps('12-15 reps', 13, 4)),
  known('crunchs', reps('20–25 reps', 22, 3)),
]);

const FIVE_A = program('5×5 A', '5×5 — Séance A', 'red', [
  known('squat', reps('5 reps', 5, 5, { restSec: 180, step: 2.5 })),
  known('dev_couche', reps('5 reps', 5, 5, { restSec: 180, step: 2.5 })),
  { ...ROWING, sets: 5, repsLabel: '5 reps', defaultReps: 5, restSec: 180 },
]);

const FIVE_B = program('5×5 B', '5×5 — Séance B', 'blue', [
  known('squat', reps('5 reps', 5, 5, { restSec: 180, step: 2.5 })),
  known('dev_militaire', reps('5 reps', 5, 5, { restSec: 180, step: 2.5 })),
  { ...DEADLIFT, sets: 1, restSec: 240 },
]);

const FULL_A = program('Full A', 'Full Body A', 'green', [
  known('squat', reps('8-10 reps', 9, 3, { restSec: 150 })),
  known('dev_couche', reps('8-10 reps', 9, 3)),
  known('tirage_horizontal', reps('8-12 reps', 10, 3)),
  known('elevations_laterales', reps('12-15 reps', 13, 2)),
  known('crunchs', reps('20–25 reps', 22, 3)),
]);

const FULL_B = program('Full B', 'Full Body B', 'blue', [
  known('leg_press', reps('10-12 reps', 11, 3)),
  known('dev_militaire', reps('8-10 reps', 9, 3)),
  known('tirage_vertical', reps('10-12 reps', 11, 3)),
  known('curl_ez_bar', reps('10-12 reps', 11, 2)),
  known('ext_triceps_poulie', reps('10-12 reps', 11, 2)),
  known('planche_ab', reps('30–60 sec', 45, 3)),
]);

const FULL_C = program('Full C', 'Full Body C', 'yellow', [
  { ...ROMANIAN, sets: 3 },
  known('dev_incline', reps('8-12 reps', 10, 3)),
  known('tractions', reps('6-10 reps', 8, 3)),
  known('fentes_marchees', reps('10-12 reps / jambe', 11, 2)),
  known('mollets', reps('12-15 reps', 13, 3)),
]);

export const PROGRAM_TEMPLATES: readonly ProgramTemplate[] = [
  {
    id: 'ppl6',
    name: 'Push / Pull / Legs — 6 jours',
    tagline: 'Chaque groupe musculaire est travaillé deux fois par semaine.',
    level: 'Intermédiaire',
    daysPerWeek: 6,
    programs: { ppl_push: PUSH, ppl_pull: PULL, ppl_legs: LEGS },
    order: ['ppl_push', 'ppl_pull', 'ppl_legs'],
    weekly: { lundi: 'ppl_push', mardi: 'ppl_pull', mercredi: 'ppl_legs', jeudi: 'ppl_push', vendredi: 'ppl_pull', samedi: 'ppl_legs' },
  },
  {
    id: 'ppl3',
    name: 'Push / Pull / Legs — 3 jours',
    tagline: 'Une séance par groupe, avec du repos entre chaque.',
    level: 'Tous niveaux',
    daysPerWeek: 3,
    programs: { ppl_push: PUSH, ppl_pull: PULL, ppl_legs: LEGS },
    order: ['ppl_push', 'ppl_pull', 'ppl_legs'],
    weekly: { lundi: 'ppl_push', mercredi: 'ppl_pull', vendredi: 'ppl_legs' },
  },
  {
    id: 'upper_lower',
    name: 'Haut / Bas du corps — 4 jours',
    tagline: 'Deux séances de force, deux séances de volume.',
    level: 'Intermédiaire',
    daysPerWeek: 4,
    programs: { ul_upper_a: UPPER_A, ul_lower_a: LOWER_A, ul_upper_b: UPPER_B, ul_lower_b: LOWER_B },
    order: ['ul_upper_a', 'ul_lower_a', 'ul_upper_b', 'ul_lower_b'],
    weekly: { lundi: 'ul_upper_a', mardi: 'ul_lower_a', jeudi: 'ul_upper_b', vendredi: 'ul_lower_b' },
  },
  {
    id: 'five_by_five',
    name: '5×5 — force de base',
    tagline: 'Trois exercices lourds par séance, 5 séries de 5, charge augmentée à chaque fois.',
    level: 'Débutant',
    daysPerWeek: 3,
    note: "Les séances A et B alternent : cette semaine A-B-A, la suivante B-A-B. Échange simplement les séances du lundi et du vendredi d'une semaine à l'autre.",
    programs: { fx_a: FIVE_A, fx_b: FIVE_B },
    order: ['fx_a', 'fx_b'],
    weekly: { lundi: 'fx_a', mercredi: 'fx_b', vendredi: 'fx_a' },
  },
  {
    id: 'full_body',
    name: 'Full body — 3 jours',
    tagline: "Tout le corps à chaque séance : idéal pour reprendre ou s'entraîner peu souvent.",
    level: 'Débutant',
    daysPerWeek: 3,
    programs: { fb_a: FULL_A, fb_b: FULL_B, fb_c: FULL_C },
    order: ['fb_a', 'fb_b', 'fb_c'],
    weekly: { lundi: 'fb_a', mercredi: 'fb_b', vendredi: 'fb_c' },
  },
];

export const findTemplate = (id: string): ProgramTemplate | undefined => PROGRAM_TEMPLATES.find((t) => t.id === id);
