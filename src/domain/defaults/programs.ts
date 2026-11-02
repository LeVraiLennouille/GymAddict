import type { DayName, Exercise, Program, ProgramConfig, ProgramId, RunDef, RunId } from '../types';
import { clone } from '../rules/sanitize';

/**
 * Programmes par défaut (repris tels quels de l'ancienne appli web).
 * Les listes d'exercices sont conservées séparément pour rester fidèles aux données d'origine.
 */

const EX_LUNDI: Exercise[] = [
  { id: "dev_pec_echauff", name: "Développé couché (à vide)", sets: 2, repsLabel: "15 reps", defaultReps: 15, type: "echauffement", muscles: ["pecs","triceps"], restSec: 60 },
  { id: "tractions", name: "Tractions", sets: 2, repsLabel: "Échec", defaultReps: 10, type: "compound", muscles: ["dos","biceps"], restSec: 120 },
  { id: "dips", name: "Dips", sets: 2, repsLabel: "Échec", defaultReps: 10, type: "compound", muscles: ["triceps"], restSec: 120 },
  { id: "dev_couche", name: "Développé couché", sets: 4, repsLabel: "8-12 reps", defaultReps: 10, type: "compound", muscles: ["pecs"], restSec: 120 },
  { id: "pupitre_halteres", name: "Pupitre haltères", sets: 4, repsLabel: "8-12 reps", defaultReps: 10, type: "compound", muscles: ["biceps"], restSec: 120 },
  { id: "bar_front", name: "Barre au front (EZ Bar)", sets: 3, repsLabel: "10-12 reps", defaultReps: 10, type: "isolation", muscles: ["triceps"], restSec: 90 },
  { id: "curl_ez_bar", name: "Curl (EZ Bar)", sets: 3, repsLabel: "12-15 reps", defaultReps: 15, type: "isolation", muscles: ["biceps"], restSec: 90 },
  { id: "dev_incline", name: "Développé incliné (haltères ou machine)", sets: 3, repsLabel: "10-12 reps", defaultReps: 10, type: "compound", muscles: ["pecs"], restSec: 120 },
  { id: "ecarte_poulie_haute", name: "Écartés à la poulie haute", sets: 3, repsLabel: "12-15 reps", defaultReps: 15, type: "isolation", muscles: ["pecs"], restSec: 90 },
  { id: "ext_triceps_poulie", name: "Extensions Triceps (Corde)", sets: 3, repsLabel: "12-15 reps", defaultReps: 15, type: "isolation", muscles: ["triceps"], restSec: 90 },
  { id: "papillon_pecs", name: "Papillons Pecs", sets: 3, repsLabel: "10-12 reps", defaultReps: 10, type: "isolation", muscles: ["pecs"], restSec: 120 },
  { id: "pompes", name: "Pompes", sets: 3, repsLabel: "10-12 reps", defaultReps: 10, type: "isolation", muscles: ["pecs"], restSec: 90 },
];

const EX_MARDI: Exercise[] = [
  { id: "tractions", name: "Tractions", sets: 2, repsLabel: "Échec", defaultReps: 10, type: "compound", muscles: ["dos","biceps"], restSec: 120 },
  { id: "tirage_vertical", name: "Tirage Vertical (Poulie Haute)", sets: 3, repsLabel: "10-12 reps", defaultReps: 11, type: "compound", muscles: ["dos"], restSec: 120 },
  { id: "papillon_dos", name: "Papillons Dorsaux", sets: 3, repsLabel: "10-12 reps", defaultReps: 10, type: "isolation", muscles: ["dos"], restSec: 120 },
  { id: "tirage_horizontal", name: "Tirage Horizontal", sets: 4, repsLabel: "8-12 reps", defaultReps: 10, type: "compound", muscles: ["dos"], restSec: 120 },
  { id: "pull_over_poulie", name: "Pull-over à la poulie haute", sets: 3, repsLabel: "12-15 reps", defaultReps: 15, type: "isolation", muscles: ["dos"], restSec: 90 },
  { id: "dev_militaire", name: "Développé Militaire Assis", sets: 4, repsLabel: "8-12 reps", defaultReps: 10, type: "compound", muscles: ["epaules"], restSec: 120 },
  { id: "elevations_laterales", name: "Élévations Latérales", sets: 4, repsLabel: "12-15 reps", defaultReps: 15, type: "isolation", muscles: ["epaules"], restSec: 90 },
  { id: "oiseau_poulie", name: "Oiseau à la Poulie Haute", sets: 3, repsLabel: "15-20 reps", defaultReps: 18, type: "isolation", muscles: ["epaules"], restSec: 90 },
  { id: "tirage_menton", name: "Tirage Menton", sets: 3, repsLabel: "10-12 reps", defaultReps: 11, type: "compound", muscles: ["epaules","trapezes"], restSec: 120 },
  { id: "shrugs", name: "Shrugs", sets: 3, repsLabel: "12-15 reps", defaultReps: 15, type: "isolation", muscles: ["trapezes"], restSec: 90 },
];

const EX_MERCREDI: Exercise[] = [
  { id: "squat", name: "Squat (Barre)", sets: 4, repsLabel: "6-10 reps", defaultReps: 8, type: "compound", muscles: ["jambes"], restSec: 120 },
  { id: "leg_press", name: "Presse à Cuisses", sets: 3, repsLabel: "10-12 reps", defaultReps: 11, type: "compound", muscles: ["jambes"], restSec: 120 },
  { id: "fentes_marchees", name: "Fentes Marchées (Haltères)", sets: 3, repsLabel: "10-12 reps / jambe", defaultReps: 11, type: "compound", muscles: ["jambes"], restSec: 120 },
  { id: "leg_extension", name: "Leg Extension", sets: 3, repsLabel: "12-15 reps", defaultReps: 15, type: "isolation", muscles: ["jambes"], restSec: 90 },
  { id: "leg_curl", name: "Leg Curl", sets: 3, repsLabel: "12-15 reps", defaultReps: 15, type: "isolation", muscles: ["jambes"], restSec: 90 },
  { id: "mollets", name: "Mollets Debout Machine", sets: 4, repsLabel: "15-20 reps", defaultReps: 18, type: "isolation", muscles: ["mollets"], restSec: 90 },
];

const EX_JEUDI: Exercise[] = [
  { id: "dev_pec_echauff", name: "Développé couché (à vide)", sets: 2, repsLabel: "15 reps", defaultReps: 15, type: "echauffement", muscles: ["pecs","triceps"], restSec: 60 },
  { id: "tractions", name: "Tractions", sets: 2, repsLabel: "Échec", defaultReps: 10, type: "compound", muscles: ["dos","biceps"], restSec: 120 },
  { id: "dips", name: "Dips", sets: 2, repsLabel: "Échec", defaultReps: 10, type: "compound", muscles: ["triceps"], restSec: 120 },
  { id: "dev_couche", name: "Développé couché", sets: 4, repsLabel: "8-12 reps", defaultReps: 10, type: "compound", muscles: ["pecs"], restSec: 120 },
  { id: "pupitre_halteres", name: "Pupitre haltères", sets: 4, repsLabel: "8-12 reps", defaultReps: 10, type: "compound", muscles: ["biceps"], restSec: 120 },
  { id: "bar_front", name: "Barre au front (EZ Bar)", sets: 3, repsLabel: "10-12 reps", defaultReps: 10, type: "isolation", muscles: ["triceps"], restSec: 90 },
  { id: "curl_ez_bar", name: "Curl (EZ Bar)", sets: 3, repsLabel: "12-15 reps", defaultReps: 15, type: "isolation", muscles: ["biceps"], restSec: 90 },
  { id: "dev_incline", name: "Développé incliné (haltères ou machine)", sets: 3, repsLabel: "10-12 reps", defaultReps: 10, type: "compound", muscles: ["pecs"], restSec: 120 },
  { id: "ecarte_poulie_haute", name: "Écartés à la poulie haute", sets: 3, repsLabel: "12-15 reps", defaultReps: 15, type: "isolation", muscles: ["pecs"], restSec: 90 },
  { id: "ext_triceps_poulie", name: "Extensions Triceps (Corde)", sets: 3, repsLabel: "12-15 reps", defaultReps: 15, type: "isolation", muscles: ["triceps"], restSec: 90 },
  { id: "papillon_pecs", name: "Papillons Pecs", sets: 3, repsLabel: "10-12 reps", defaultReps: 10, type: "isolation", muscles: ["pecs"], restSec: 120 },
  { id: "pompes", name: "Pompes", sets: 3, repsLabel: "10-12 reps", defaultReps: 10, type: "isolation", muscles: ["pecs"], restSec: 90 },
];

const EX_VENDREDI: Exercise[] = [
  { id: "tractions", name: "Tractions", sets: 2, repsLabel: "Échec", defaultReps: 10, type: "compound", muscles: ["dos","biceps"], restSec: 120 },
  { id: "tirage_vertical", name: "Tirage Vertical (Poulie Haute)", sets: 3, repsLabel: "10-12 reps", defaultReps: 11, type: "compound", muscles: ["dos"], restSec: 120 },
  { id: "papillon_dos", name: "Papillons Dorsaux", sets: 3, repsLabel: "10-12 reps", defaultReps: 10, type: "isolation", muscles: ["dos"], restSec: 120 },
  { id: "tirage_horizontal", name: "Tirage Horizontal", sets: 4, repsLabel: "8-12 reps", defaultReps: 10, type: "compound", muscles: ["dos"], restSec: 120 },
  { id: "pull_over_poulie", name: "Pull-over à la poulie haute", sets: 3, repsLabel: "12-15 reps", defaultReps: 15, type: "isolation", muscles: ["dos"], restSec: 90 },
  { id: "dev_militaire", name: "Développé Militaire Assis", sets: 4, repsLabel: "8-12 reps", defaultReps: 10, type: "compound", muscles: ["epaules"], restSec: 120 },
  { id: "elevations_laterales", name: "Élévations Latérales", sets: 4, repsLabel: "12-15 reps", defaultReps: 15, type: "isolation", muscles: ["epaules"], restSec: 90 },
  { id: "oiseau_poulie", name: "Oiseau à la Poulie Haute", sets: 3, repsLabel: "15-20 reps", defaultReps: 18, type: "isolation", muscles: ["epaules"], restSec: 90 },
  { id: "tirage_menton", name: "Tirage Menton", sets: 3, repsLabel: "10-12 reps", defaultReps: 11, type: "compound", muscles: ["epaules","trapezes"], restSec: 120 },
  { id: "shrugs", name: "Shrugs", sets: 3, repsLabel: "12-15 reps", defaultReps: 15, type: "isolation", muscles: ["trapezes"], restSec: 90 },
];

const EX_ABDOS: Exercise[] = [
  { id: "planche_ab", name: "Planche", sets: 4, repsLabel: "30–60 sec", defaultReps: 45, type: "isolation", muscles: ["abdos"], restSec: 60, isTime: true },
  { id: "crunchs", name: "Crunchs", sets: 4, repsLabel: "20–25 reps", defaultReps: 20, type: "isolation", muscles: ["abdos"], restSec: 60 },
  { id: "crunchs_obliques", name: "Crunchs Obliques", sets: 3, repsLabel: "15–20 reps / côté", defaultReps: 15, type: "isolation", muscles: ["abdos"], restSec: 60 },
  { id: "relevés_jambes", name: "Relevés de Jambes", sets: 3, repsLabel: "15–20 reps", defaultReps: 15, type: "compound", muscles: ["abdos"], restSec: 75 },
  { id: "mountain_climbers", name: "Mountain Climbers", sets: 3, repsLabel: "30 sec", defaultReps: 30, type: "isolation", muscles: ["abdos"], restSec: 60, isTime: true },
  { id: "russian_twists", name: "Russian Twists (lest)", sets: 3, repsLabel: "20 reps", defaultReps: 20, type: "isolation", muscles: ["abdos"], restSec: 60 },
  { id: "ab_wheel", name: "Roue Abdominale", sets: 3, repsLabel: "8–12 reps", defaultReps: 10, type: "compound", muscles: ["abdos"], restSec: 90 },
];

export const DEFAULT_PROGRAMS: Record<ProgramId, Program> = {
  pecs_tri: {
    label: "Pecs & Triceps",
    fullName: "Pectoraux & Triceps",
    type: "gym",
    color: "red",
    exercises: EX_LUNDI,
  },
  dos_ep: {
    label: "Dos & Épaules",
    fullName: "Dos & Épaules",
    type: "gym",
    color: "blue",
    exercises: EX_MARDI,
  },
  abdos: {
    label: "Abdos",
    fullName: "Abdominaux & Core",
    type: "gym",
    color: "green",
    exercises: EX_ABDOS,
  },
  jambes: {
    label: "Jambes",
    fullName: "Jambes & Mollets",
    type: "gym",
    color: "yellow",
    exercises: EX_MERCREDI,
  },
  epaules: {
    label: "Épaules",
    fullName: "Épaules & Trapèzes",
    type: "gym",
    color: "blue",
    exercises: EX_JEUDI,
  },
  rappel: {
    label: "Rappel",
    fullName: "Rappel Haut du Corps",
    type: "gym",
    color: "red",
    exercises: EX_VENDREDI,
  },
  repos: {
    label: "Repos",
    fullName: "Repos Total",
    type: "rest",
    color: "grey",
    exercises: [],
  },
};

export const DEFAULT_ORDER: ProgramId[] = ["pecs_tri","dos_ep","abdos","jambes","epaules","rappel","repos"];

export const DEFAULT_WEEKLY: Record<DayName, ProgramId> = {
  lundi: "pecs_tri",
  mardi: "dos_ep",
  mercredi: "abdos",
  jeudi: "pecs_tri",
  vendredi: "dos_ep",
  samedi: "repos",
  dimanche: "repos"
};

export const DEFAULT_RUNS: Record<RunId, RunDef> = {
  hiit: {
    name: "Fractionné HIIT",
    desc: "Intervalles haute intensité pour brûler max de calories.",
    detail: "10min éco · 10-15× (30s sprint/30s récup) · 5min retour",
    targetDistance: 0,
    targetDuration: 35,
    targetPace: 0,
  },
  tempo: {
    name: "Tempo",
    desc: "Allure soutenue sur 5km pour développer ton seuil lactique.",
    detail: "5km continu, légèrement inconfortable mais constant",
    targetDistance: 5,
    targetDuration: 0,
    targetPace: 0,
  },
  longue: {
    name: "Sortie longue",
    desc: "Endurance fondamentale Zone 2 pour brûler les graisses.",
    detail: "45–60min très lent, conversation possible",
    targetDistance: 0,
    targetDuration: 50,
    targetPace: 0,
  },
};

export const DEFAULT_RUN_ORDER: RunId[] = ["hiit","tempo","longue"];

export const DEFAULT_RUN_WEEKLY: Record<DayName, RunId | ''> = {
  lundi: "",
  mardi: "hiit",
  mercredi: "",
  jeudi: "tempo",
  vendredi: "",
  samedi: "",
  dimanche: "longue"
};

/** Configuration par défaut (utilisée tant que l'utilisateur n'a pas modifié son programme). */
export function defaultProgramConfig(): ProgramConfig {
  return {
    v: 1,
    programs: clone(DEFAULT_PROGRAMS),
    order: [...DEFAULT_ORDER],
    weekly: { ...DEFAULT_WEEKLY },
    runs: clone(DEFAULT_RUNS),
    runOrder: [...DEFAULT_RUN_ORDER],
    runWeekly: { ...DEFAULT_RUN_WEEKLY },
    weeklyKm: 0,
  };
}
