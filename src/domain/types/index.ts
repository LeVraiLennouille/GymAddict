/**
 * Types du domaine GymAddict.
 * Fichier pur TypeScript : aucune dépendance à React, Expo ou au stockage.
 * Le format `AppData` reste compatible avec l'objet JSON `fitcore` de l'ancienne appli web.
 */

/** Date locale au format `AAAA-MM-JJ`. */
export type DateKey = `${number}-${number}-${number}`;

export type DayName =
  | 'lundi'
  | 'mardi'
  | 'mercredi'
  | 'jeudi'
  | 'vendredi'
  | 'samedi'
  | 'dimanche';

export type MuscleKey =
  | 'pecs'
  | 'dos'
  | 'epaules'
  | 'biceps'
  | 'triceps'
  | 'abdos'
  | 'jambes'
  | 'trapezes'
  | 'mollets';

export type ExerciseType = 'compound' | 'isolation' | 'echauffement';
export type ProgramColor = 'red' | 'blue' | 'yellow' | 'green' | 'grey';
export type ProgramType = 'gym' | 'rest';
export type SupersetGroup = 'A' | 'B' | 'C' | 'D';
export type AvatarKey = 'red' | 'blue' | 'yellow' | 'green' | 'grey' | 'white';

export type ExerciseId = string;
export type ProgramId = string;
export type RunId = string;

/* ------------------------------------------------------------------ */
/* Programme                                                           */
/* ------------------------------------------------------------------ */

export interface Exercise {
  id: ExerciseId;
  name: string;
  sets: number;
  repsLabel: string;
  defaultReps: number;
  type: ExerciseType;
  muscles: MuscleKey[];
  restSec: number;
  isTime?: boolean;
  /** Incrément de charge proposé pour la progression (kg). */
  step?: number;
  superset?: SupersetGroup;
  optional?: boolean;
  /** Renseignés uniquement pour un exercice remplacé le temps d'une séance. */
  swappedFrom?: ExerciseId;
  swappedName?: string;
}

export interface Program {
  label: string;
  fullName: string;
  type: ProgramType;
  color: ProgramColor;
  exercises: Exercise[];
}

export interface RunDef {
  name: string;
  desc: string;
  detail: string;
  targetDistance: number;
  targetDuration: number;
  /** Allure cible en secondes par km. */
  targetPace: number;
}

export interface ProgramConfig {
  v: 1;
  programs: Record<ProgramId, Program>;
  order: ProgramId[];
  weekly: Record<DayName, ProgramId>;
  runs: Record<RunId, RunDef>;
  runOrder: RunId[];
  runWeekly: Record<DayName, RunId | ''>;
  weeklyKm: number;
}

/** Programme résolu pour une date donnée. */
export interface EffectiveProgram {
  key: ProgramId;
  prog: Program;
  dayName: DayName;
  /** `true` si le programme vient du planning hebdomadaire (pas d'un choix manuel). */
  isSuggestion: boolean;
}

/* ------------------------------------------------------------------ */
/* Journaux                                                            */
/* ------------------------------------------------------------------ */

export interface SetLog {
  done: boolean;
  /** Chaînes : on conserve le format historique (saisie libre, virgule acceptée). */
  weight: string;
  reps: string;
}

export interface RunLog {
  done: boolean;
  duration: string;
  distance: string;
  rpe: string;
  /** Allure moyenne en s/km, `''` si non calculable. */
  pace?: number | '';
}

export interface PersonalRecord {
  weight: number;
  reps: number;
  date: DateKey;
}

export interface ExNote {
  settings: string;
  rpe: string;
}

export interface SessionPR {
  id: ExerciseId;
  name: string;
  w: number;
  r: number;
}

export interface SessionMeta {
  start?: number;
  last?: number;
  /** Durée active cumulée en millisecondes. */
  ms?: number;
  prog?: { key: ProgramId; name: string };
  prs?: SessionPR[];
  summaryShown?: boolean;
  note?: string;
}

export interface Readiness {
  sleep: number;
  stress: number;
  soreness: number;
  score: number;
}

export interface ReadinessInput {
  sleep: number;
  stress: number;
  soreness: number;
}

export interface ExDef {
  id: ExerciseId;
  name: string;
  type: ExerciseType;
  muscles: MuscleKey[];
  isTime: boolean;
}

export interface WeightEntry {
  date: DateKey;
  kg: number;
}

export type GoalType = 'weight' | 'lift';

export interface Goal {
  id: string;
  type: GoalType;
  exId?: ExerciseId;
  target: number;
  startDate: DateKey;
  start: number;
  achievedAt?: DateKey;
}

export interface ReminderPrefs {
  enabled: boolean;
  /** `HH:MM` */
  time: string;
  /** Jours JS (0 = dimanche). */
  days: number[];
}

export type VolumeTargets = Partial<Record<MuscleKey, [number, number]>>;

export interface Prefs {
  sound: boolean;
  vibrate: boolean;
  reminder?: ReminderPrefs;
  backupSnooze?: number;
  persistAsked?: boolean;
  volTargets?: VolumeTargets;
}

export interface Profile {
  pseudo: string;
  avatar: AvatarKey;
  since: DateKey;
}

/* ------------------------------------------------------------------ */
/* Données persistées                                                  */
/* ------------------------------------------------------------------ */

export interface AppData {
  schemaVersion: 1;
  workouts: Record<DateKey, Record<ExerciseId, SetLog[]>>;
  runLogs: Record<DateKey, RunLog>;
  prs: Record<ExerciseId, PersonalRecord>;
  activeDays: DateKey[];
  age?: number;
  bodyWeight?: number;
  weightLog: WeightEntry[];
  exNotes: Record<DateKey, Record<ExerciseId, ExNote>>;
  dayProgram: Record<DateKey, ProgramId>;
  dayOrder: Record<DateKey, ExerciseId[]>;
  skipped: Record<DateKey, ExerciseId[]>;
  swaps: Record<DateKey, Record<ExerciseId, Exercise>>;
  sessionMeta: Record<DateKey, SessionMeta>;
  readiness: Record<DateKey, Readiness>;
  exNames: Record<ExerciseId, string>;
  exDefs: Record<ExerciseId, ExDef>;
  goals: Goal[];
  prefs: Prefs;
  profile: Profile;
  program?: ProgramConfig;
  lastBackup?: number;
  /** Clés inconnues de cette version : conservées telles quelles pour ne rien perdre. */
  extras: Record<string, unknown>;
}

/* ------------------------------------------------------------------ */
/* Résultats de calcul                                                 */
/* ------------------------------------------------------------------ */

export interface DayProgress {
  done: number;
  total: number;
  pct: number;
}

export interface LastSession {
  date: DateKey;
  /** Uniquement les séries validées. */
  sets: SetLog[];
}

export interface TopSet {
  w: number;
  r: number;
}

export interface RepFields {
  failure: boolean;
  min: number;
  max: number;
}

export type ProgressionSuggestion =
  | { kind: 'up'; from: number; weight: number; step: number; target: number }
  | { kind: 'hold'; from: number; weight: number; next: number; target: number };

export interface WarmupSet {
  pct: number;
  reps: number;
  label: string;
  weight: number;
}

export interface FunEquivalent {
  count: number;
  name: string;
}
