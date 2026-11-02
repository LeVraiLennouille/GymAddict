import { useMemo } from 'react';
import { useAppStore } from '@/data/store/appStore';
import { useTodayKey } from '@/data/store/useTodayKey';
import { deleteGoal, saveGoal, GOAL_ERROR_MESSAGES, type GoalInput } from '@/domain/actions/goals';
import { saveBodyWeightEntry } from '@/domain/actions/profile';
import { resetVolumeTargets, saveVolumeTargets } from '@/domain/actions/volume';
import { addWeightEntry, deleteWeightEntry } from '@/domain/actions/weight';
import { MUSCLE_KEYS, MUSCLE_LABELS } from '@/domain/defaults/constants';
import { radarGeometry, type RadarGeometry } from '@/domain/rules/charts';
import { buildGoalRows, type GoalRow } from '@/domain/rules/goals';
import { sessionDates } from '@/domain/rules/history';
import { getBodyWeight } from '@/domain/rules/profile';
import { computeRegularity, computeStreak } from '@/domain/rules/streak';
import { allExercises, buildHeatmap, buildPrList, muscleVolumes, type HeatWeek, type PrRow } from '@/domain/rules/statsView';
import type { DateKey, ExerciseId, MuscleKey } from '@/domain/types';
import { showToast } from '@/ui/feedbackStore';
import { checkGoals } from '../checkGoals';

export interface StatsModel {
  streak: number;
  regularity: number;
  sessionCount: number;
  heatmap: HeatWeek[];
  radar: RadarGeometry;
  goals: GoalRow[];
  prs: PrRow[];
  exercises: { id: ExerciseId; name: string }[];
  bodyWeight: number;
  actions: {
    saveGoal: (input: GoalInput) => boolean;
    deleteGoal: (id: string) => void;
    addWeight: (raw: string, date: DateKey) => boolean;
    deleteWeight: (date: DateKey) => void;
    saveBodyWeight: (raw: string) => void;
    saveVolumeTargets: (targets: Record<MuscleKey, [number, number]>) => boolean;
    resetVolumeTargets: () => void;
  };
}

/** Modèle de l'onglet Stats : indicateurs, graphiques, objectifs et pesées. */
export function useStats(): StatsModel {
  const data = useAppStore((s) => s.data);
  const update = useAppStore((s) => s.update);
  const today = useTodayKey();

  const heatmap = useMemo(() => buildHeatmap(data), [data, today]);
  const radar = useMemo(() => radarGeometry(muscleVolumes(data), MUSCLE_KEYS.map((m) => MUSCLE_LABELS[m])), [data, today]);
  const goals = useMemo(() => buildGoalRows(data), [data, today]);
  const prs = useMemo(() => buildPrList(data), [data]);
  const exercises = useMemo(() => allExercises(data), [data]);

  return {
    streak: computeStreak(data),
    regularity: computeRegularity(data),
    sessionCount: sessionDates(data).length,
    heatmap,
    radar,
    goals,
    prs,
    exercises,
    bodyWeight: getBodyWeight(data),
    actions: {
      saveGoal: (input) => {
        const result = saveGoal(useAppStore.getState().data, input, today, Date.now());
        if (!result.ok) {
          showToast(GOAL_ERROR_MESSAGES[result.error]);
          return false;
        }
        update(() => result.data);
        showToast('Objectif enregistré');
        checkGoals();
        return true;
      },
      deleteGoal: (id) => {
        update((d) => deleteGoal(d, id));
        showToast('Objectif supprimé');
      },
      addWeight: (raw, date) => {
        const result = addWeightEntry(useAppStore.getState().data, raw, date, today);
        if (!result.ok) {
          showToast(result.error === 'future' ? 'La date ne peut pas être dans le futur' : 'Poids invalide (20 à 300 kg)');
          return false;
        }
        update(() => result.data);
        showToast('Pesée enregistrée');
        checkGoals();
        return true;
      },
      deleteWeight: (date) => {
        update((d) => deleteWeightEntry(d, date));
        showToast('Pesée supprimée');
      },
      saveBodyWeight: (raw) => {
        const result = saveBodyWeightEntry(useAppStore.getState().data, raw, today);
        if (!result.ok) {
          showToast('Poids invalide (20 à 300 kg)');
          return;
        }
        update(() => result.data);
        showToast('Poids de corps sauvegardé');
        checkGoals();
      },
      saveVolumeTargets: (targets) => {
        const next = saveVolumeTargets(useAppStore.getState().data, targets);
        if (!next) {
          showToast('Minimum ≤ maximum pour chaque muscle');
          return false;
        }
        update(() => next);
        showToast('Objectifs de volume enregistrés');
        return true;
      },
      resetVolumeTargets: () => {
        update((d) => resetVolumeTargets(d));
        showToast('Objectifs par défaut rétablis');
      },
    },
  };
}
