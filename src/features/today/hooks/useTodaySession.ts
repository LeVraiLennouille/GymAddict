import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/data/store/appStore';
import { useTodayKey } from '@/data/store/useTodayKey';
import {
  applyProgressionWeight,
  applySwap,
  completeSet,
  markSummaryShown,
  postponeExercise,
  registerPR,
  revertSwap,
  saveDayProgramOverride,
  saveExNote,
  saveReadiness,
  saveSessionNote,
  setSetField,
  skipExercise,
} from '@/domain/actions/workout';
import { toNumber } from '@/domain/format/numbers';
import { buildReadiness, readinessMessage } from '@/domain/rules/readiness';
import { buildTodayView, type SetView, type TodayView } from '@/domain/rules/todayView';
import { getProgramConfig, programPickerKeys } from '@/domain/rules/program';
import { getDayProgress, getSet, isNewRecord } from '@/domain/rules/sets';
import { restDayInfo, type RestDayInfo } from '@/domain/rules/restDay';
import { computeRegularity, computeStreak } from '@/domain/rules/streak';
import { supersetNext, supersetRest } from '@/domain/rules/supersets';
import { buildSwapDef, findKnownByName, swapCandidates, type SwapTarget } from '@/domain/rules/swap';
import { normName, cleanName } from '@/domain/rules/sanitize';
import type { DateKey, Exercise, ExerciseId, ProgramConfig, ProgramId, ReadinessInput } from '@/domain/types';
import { vibrate } from '@/services/feedback';
import { useTimerStore } from '@/services/timerStore';
import { showToast, useFeedbackStore } from '@/ui/feedbackStore';
import { checkGoals } from '@/features/stats/checkGoals';
import { buildPrInfo } from '../prInfo';

const READINESS_DELAY_MS = 900;
const SUMMARY_DELAY_MS = 900;

export interface TodayActions {
  toggleSet: (ex: Exercise, set: SetView) => void;
  commitWeight: (ex: Exercise, index: number, text: string) => void;
  commitReps: (ex: Exercise, index: number, text: string) => void;
  applyProgression: (ex: Exercise, weight: number) => void;
  skip: (ex: Exercise, skip: boolean) => void;
  postpone: (ex: Exercise) => void;
  commitSetting: (ex: Exercise, text: string) => void;
  commitRpe: (ex: Exercise, text: string) => void;
  commitSessionNote: (text: string) => void;
  chooseProgram: (key: ProgramId | null) => void;
  submitReadiness: (input: ReadinessInput) => void;
  candidatesFor: (ex: Exercise) => SwapTarget[];
  swapTo: (ex: Exercise, target: SwapTarget) => void;
  swapToCustom: (ex: Exercise, name: string) => boolean;
  revert: (ex: Exercise) => void;
  openSummary: () => void;
}

export interface DaySession {
  date: DateKey;
  view: TodayView;
  config: ProgramConfig;
  pickerKeys: ProgramId[];
  pseudo: string;
  /** Renseigné uniquement un jour de repos. */
  rest: { info: RestDayInfo; streak: number; regularity: number } | null;
  readinessOpen: boolean;
  closeReadiness: () => void;
  actions: TodayActions;
}

/**
 * Modèle d'une journée d'entraînement (aujourd'hui ou un autre jour de la semaine) : lit le store, dérive la vue (domaine) et expose des actions.
 * Les composants n'ont aucune règle métier : ils affichent `view` et appellent `actions`.
 */
export function useDaySession(
  date: DateKey,
  onReveal: (exerciseId: ExerciseId) => void,
  options: { askReadiness?: boolean } = {},
): DaySession {
  const router = useRouter();
  const data = useAppStore((s) => s.data);
  const update = useAppStore((s) => s.update);
  const view = useMemo(() => buildTodayView(data, date), [data, date]);
  const prefsRef = useRef(data.prefs);
  prefsRef.current = data.prefs;
  const getData = useAppStore.getState;

  const rest = useMemo(
    () =>
      view.isRest
        ? { info: restDayInfo(data, date), streak: computeStreak(data), regularity: computeRegularity(data) }
        : null,
    [view.isRest, data, date],
  );

  /* --- Check-in « forme du jour » : proposé une fois, 0,9 s après l'arrivée sur une séance --- */
  const [readinessOpen, setReadinessOpen] = useState(false);
  const asked = useRef<string | null>(null);
  const needsReadiness = Boolean(options.askReadiness) && !view.isRest && !view.readiness;
  useEffect(() => {
    if (!needsReadiness || asked.current === date) return;
    const id = setTimeout(() => {
      asked.current = date;
      setReadinessOpen(true);
    }, READINESS_DELAY_MS);
    return () => clearTimeout(id);
  }, [needsReadiness, date]);

  /* --- Records --- */
  const checkRecord = useCallback(
    (ex: Exercise, weightText: string, repsText: string) => {
      const weight = toNumber(weightText);
      const reps = parseInt(repsText, 10) || 0;
      if (!isNewRecord(getData().data.prs[ex.id], weight, reps)) return;
      update((d) => registerPR(d, { date, exId: ex.id, name: ex.name, weight, reps }).data);
      useFeedbackStore.getState().showPr(buildPrInfo(getData().data, ex.name, weight, reps));
      checkGoals();
    },
    [date, getData, update],
  );

  const repsFor = useCallback(
    (ex: Exercise, index: number): string => {
      const stored = getSet(getData().data, date, ex.id, index).reps;
      return stored !== '' ? stored : ex.defaultReps ? String(ex.defaultReps) : '';
    },
    [date, getData],
  );

  const maybeFinishDay = useCallback(() => {
    const state = getData().data;
    const progress = getDayProgress(state, date);
    if (progress.total === 0 || progress.pct !== 100 || state.sessionMeta[date]?.summaryShown) return;
    update((d) => markSummaryShown(d, date));
    useTimerStore.getState().dismiss();
    vibrate(prefsRef.current, 'finish');
    setTimeout(() => {
      useFeedbackStore.getState().hidePr();
      router.push(`/summary/${date}`);
    }, SUMMARY_DELAY_MS);
  }, [date, getData, router, update]);

  const actions = useMemo<TodayActions>(
    () => ({
      toggleSet: (ex, set) => {
        const nextDone = !set.done;
        update((d) =>
          completeSet(d, {
            date,
            exId: ex.id,
            idx: set.index,
            done: nextDone,
            weight: set.weight,
            reps: set.reps,
            now: Date.now(),
          }),
        );
        if (!nextDone) return;

        const state = getData().data;
        const next = supersetNext(state, date, ex.id, set.index);
        if (next) {
          showToast(`Superset : enchaîne avec ${next.name}`);
          setTimeout(() => onReveal(next.id), 150);
        } else {
          useTimerStore.getState().start(supersetRest(state, date, ex.id, ex.restSec || 90), ex.name);
        }
        if (set.weight) checkRecord(ex, set.weight, set.reps);
        maybeFinishDay();
      },

      commitWeight: (ex, index, text) => {
        update((d) => setSetField(d, date, ex.id, index, 'weight', text));
        if (text) checkRecord(ex, text, repsFor(ex, index));
      },

      commitReps: (ex, index, text) => update((d) => setSetField(d, date, ex.id, index, 'reps', text)),

      applyProgression: (ex, weight) => update((d) => applyProgressionWeight(d, date, ex, weight)),

      skip: (ex, skip) => update((d) => skipExercise(d, date, ex.id, skip)),

      postpone: (ex) => {
        const result = postponeExercise(getData().data, date, ex.id);
        if (result.status === 'moved') {
          update(() => result.data);
          showToast('Exercice reporté à la fin');
        } else if (result.status === 'already-last') {
          showToast("C'est déjà le dernier exercice");
        }
      },

      commitSetting: (ex, text) => update((d) => saveExNote(d, date, ex.id, 'settings', text)),
      commitRpe: (ex, text) => update((d) => saveExNote(d, date, ex.id, 'rpe', text)),
      commitSessionNote: (text) => update((d) => saveSessionNote(d, date, text)),

      chooseProgram: (key) => update((d) => saveDayProgramOverride(d, date, key)),

      submitReadiness: (input) => {
        const readiness = buildReadiness(input);
        update((d) => saveReadiness(d, date, readiness));
        setReadinessOpen(false);
        showToast(readinessMessage(readiness.score));
      },

      candidatesFor: (ex) => swapCandidates(getData().data, ex, date),

      swapTo: (ex, target) => {
        const swapped = buildSwapDef(ex, target);
        update((d) => applySwap(d, date, ex, swapped));
      },

      swapToCustom: (ex, rawName) => {
        const name = cleanName(rawName);
        if (!name) return false;
        const known = findKnownByName(getData().data, name);
        const target: SwapTarget = {
          id: known?.id ?? `custom_${normName(name).replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')}`,
          name: known?.name ?? name,
          type: ex.type,
          muscles: ex.muscles,
          ...(ex.isTime ? { isTime: true } : {}),
        };
        const swapped = buildSwapDef(ex, target);
        update((d) => applySwap(d, date, ex, swapped));
        return true;
      },

      revert: (ex) => {
        const result = revertSwap(getData().data, date, ex);
        if (result.status === 'ok') update(() => result.data);
        else if (result.status === 'blocked') showToast('Impossible : une série est déjà validée');
      },

      openSummary: () => router.push(`/summary/${date}`),
    }),
    [checkRecord, date, getData, maybeFinishDay, onReveal, repsFor, router, update],
  );

  return {
    date,
    view,
    config: getProgramConfig(data),
    pickerKeys: programPickerKeys(getProgramConfig(data)),
    pseudo: data.profile.pseudo,
    rest,
    readinessOpen,
    closeReadiness: () => setReadinessOpen(false),
    actions,
  };
}

/** Séance d'aujourd'hui : propose en plus le check-in « forme du jour ». */
export function useTodaySession(onReveal: (exerciseId: ExerciseId) => void): DaySession {
  return useDaySession(useTodayKey(), onReveal, { askReadiness: true });
}
