import type {
  AppData,
  DateKey,
  DayProgress,
  Exercise,
  ExNote,
  FunEquivalent,
  LastSession,
  PersonalRecord,
  Program,
  ProgramId,
  ProgressionSuggestion,
  Readiness,
  TopSet,
} from '../types';
import { toNumber } from '../format/numbers';
import { getFunEquivalent } from './funEquivalent';
import { getProgressionSuggestion } from './progression';
import { getEffectiveDayProgram, orderedExercises } from './program';
import { getDayProgress, getLastSession, getSet, getTonnageFor, isSkipped, topSet } from './sets';

export interface SetView {
  index: number;
  done: boolean;
  /** Valeur affichée : saisie enregistrée, sinon dernière séance, sinon record. */
  weight: string;
  reps: string;
  /** Charge ≥ record personnel : drapeau « PR ». */
  atRecord: boolean;
}

export interface ExerciseView {
  exercise: Exercise;
  skipped: boolean;
  doneSets: number;
  complete: boolean;
  /** Exercice (ou superset) à faire maintenant. */
  active: boolean;
  record: PersonalRecord | undefined;
  last: LastSession | null;
  lastTop: TopSet | null;
  suggestion: ProgressionSuggestion | null;
  suggestionApplied: boolean;
  sets: SetView[];
  note: ExNote;
}

export interface TodayView {
  date: DateKey;
  programKey: ProgramId;
  program: Program;
  isRest: boolean;
  /** Programme choisi à la main (et non celui du planning). */
  isOverride: boolean;
  progress: DayProgress;
  readiness: Readiness | undefined;
  tonnage: number;
  funEquivalent: FunEquivalent | null;
  exercises: ExerciseView[];
  sessionNote: string;
  showSummaryButton: boolean;
}

function buildExerciseView(data: AppData, date: DateKey, ex: Exercise): Omit<ExerciseView, 'active'> {
  const record = data.prs[ex.id];
  const note: ExNote = { settings: '', rpe: '', ...(data.exNotes[date]?.[ex.id] ?? {}) };
  const skipped = isSkipped(data, date, ex.id);
  if (skipped) {
    return {
      exercise: ex, skipped, doneSets: 0, complete: false, record, last: null, lastTop: null,
      suggestion: null, suggestionApplied: false, sets: [], note,
    };
  }

  const last = getLastSession(data, ex.id, date);
  const lastTop = last ? topSet(last.sets) : null;
  const suggestion = getProgressionSuggestion(ex, last);

  const sets: SetView[] = [];
  let doneSets = 0;
  for (let i = 0; i < ex.sets; i++) {
    const stored = getSet(data, date, ex.id, i);
    const weight =
      stored.weight !== ''
        ? stored.weight
        : lastTop && lastTop.w > 0
          ? String(lastTop.w)
          : record
            ? String(record.weight)
            : '';
    const reps = stored.reps !== '' ? stored.reps : ex.defaultReps ? String(ex.defaultReps) : '';
    if (stored.done) doneSets++;
    sets.push({
      index: i,
      done: stored.done,
      weight,
      reps,
      atRecord: Boolean(record) && weight !== '' && toNumber(weight) >= (record?.weight ?? Infinity),
    });
  }

  const suggestionApplied =
    suggestion?.kind === 'up' &&
    sets.some((_, i) => {
      const s = getSet(data, date, ex.id, i);
      return !s.done && toNumber(s.weight) >= suggestion.weight;
    });

  return {
    exercise: ex,
    skipped,
    doneSets,
    complete: ex.sets > 0 && doneSets === ex.sets,
    record,
    last,
    lastTop,
    suggestion: doneSets < ex.sets ? suggestion : null,
    suggestionApplied,
    sets,
    note,
  };
}

/** Tout ce dont l'écran « Séance » a besoin pour une date, sans aucune logique d'affichage. */
export function buildTodayView(data: AppData, date: DateKey): TodayView {
  const effective = getEffectiveDayProgram(data, date);
  const { prog } = effective;
  const isRest = prog.type === 'rest';
  const progress = getDayProgress(data, date);
  const tonnage = getTonnageFor(data, date);

  const parts = isRest ? [] : orderedExercises(data, date, prog).map((ex) => buildExerciseView(data, date, ex));

  // L'exercice actif est le premier non terminé ; ses partenaires de superset le sont aussi.
  let activeFound = false;
  let activeSuperset = '';
  const exercises: ExerciseView[] = parts.map((p) => {
    let active = false;
    if (!p.skipped && !p.complete) {
      if (!activeFound) {
        active = true;
        activeFound = true;
        activeSuperset = p.exercise.superset ?? '';
      } else if (activeSuperset && p.exercise.superset === activeSuperset) {
        active = true;
      }
    }
    return { ...p, active };
  });

  return {
    date,
    programKey: effective.key,
    program: prog,
    isRest,
    isOverride: !effective.isSuggestion,
    progress,
    readiness: data.readiness[date],
    tonnage,
    funEquivalent: getFunEquivalent(tonnage),
    exercises,
    sessionNote: data.sessionMeta[date]?.note ?? '',
    showSummaryButton: progress.done > 0,
  };
}
