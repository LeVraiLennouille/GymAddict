import { useAppStore } from '@/data/store/appStore';
import {
  addExercise,
  addProgram,
  addRun,
  deleteExercise,
  deleteProgram,
  deleteRun,
  moveExercise,
  moveProgram,
  moveRun,
  resetProgramConfig,
  setProgramColor,
  setProgramName,
  setRunDay,
  setRunField,
  setWeeklyKm,
  setWeeklyProgram,
  updateExercise,
  type ExercisePatch,
  type RunField,
} from '@/domain/actions/program';
import { getProgramConfig, programPickerKeys } from '@/domain/rules/program';
import type { DayName, ExerciseId, ProgramColor, ProgramConfig, ProgramId, RunId } from '@/domain/types';
import { showToast } from '@/ui/feedbackStore';

export interface ProgramEditor {
  config: ProgramConfig;
  programKeys: ProgramId[];
  /** `true` si l'utilisateur a déjà personnalisé son programme. */
  customized: boolean;
  actions: {
    setWeekly: (day: DayName, programId: ProgramId) => void;
    setRunDay: (day: DayName, runId: RunId | '') => void;
    setWeeklyKm: (raw: string) => void;
    addProgram: () => ProgramId;
    renameProgram: (id: ProgramId, field: 'label' | 'fullName', text: string) => void;
    colorProgram: (id: ProgramId, color: ProgramColor) => void;
    moveProgram: (id: ProgramId, dir: -1 | 1) => void;
    deleteProgram: (id: ProgramId) => boolean;
    addExercise: (programId: ProgramId) => ExerciseId;
    updateExercise: (programId: ProgramId, exId: ExerciseId, patch: ExercisePatch) => void;
    moveExercise: (programId: ProgramId, exId: ExerciseId, dir: -1 | 1) => void;
    deleteExercise: (programId: ProgramId, exId: ExerciseId) => void;
    addRun: () => RunId;
    setRunField: (runId: RunId, field: RunField, value: string) => void;
    moveRun: (runId: RunId, dir: -1 | 1) => void;
    deleteRun: (runId: RunId) => void;
    resetAll: () => void;
  };
}

/** Modèle de l'éditeur : lit le programme courant et applique chaque modification immédiatement. */
export function useProgramEditor(): ProgramEditor {
  const data = useAppStore((s) => s.data);
  const update = useAppStore((s) => s.update);
  const config = getProgramConfig(data);

  return {
    config,
    programKeys: programPickerKeys(config),
    customized: Boolean(data.program),
    actions: {
      setWeekly: (day, id) => update((d) => setWeeklyProgram(d, day, id)),
      setRunDay: (day, id) => update((d) => setRunDay(d, day, id)),
      setWeeklyKm: (raw) => update((d) => setWeeklyKm(d, raw)),

      addProgram: () => {
        const result = addProgram(useAppStore.getState().data, Date.now());
        update(() => result.data);
        return result.id;
      },
      renameProgram: (id, field, text) => update((d) => setProgramName(d, id, field, text)),
      colorProgram: (id, color) => update((d) => setProgramColor(d, id, color)),
      moveProgram: (id, dir) => update((d) => moveProgram(d, id, dir)),
      deleteProgram: (id) => {
        const next = deleteProgram(useAppStore.getState().data, id);
        if (!next) {
          showToast('La séance « Repos » ne peut pas être supprimée');
          return false;
        }
        update(() => next);
        showToast('Séance supprimée');
        return true;
      },

      addExercise: (programId) => {
        const result = addExercise(useAppStore.getState().data, programId, Date.now());
        update(() => result.data);
        return result.id;
      },
      updateExercise: (programId, exId, patch) => update((d) => updateExercise(d, programId, exId, patch)),
      moveExercise: (programId, exId, dir) => update((d) => moveExercise(d, programId, exId, dir)),
      deleteExercise: (programId, exId) => update((d) => deleteExercise(d, programId, exId)),

      addRun: () => {
        const result = addRun(useAppStore.getState().data, Date.now());
        update(() => result.data);
        return result.id;
      },
      setRunField: (runId, field, value) => update((d) => setRunField(d, runId, field, value)),
      moveRun: (runId, dir) => update((d) => moveRun(d, runId, dir)),
      deleteRun: (runId) => {
        update((d) => deleteRun(d, runId));
        showToast('Sortie supprimée');
      },

      resetAll: () => {
        update((d) => resetProgramConfig(d));
        showToast('Programme par défaut rétabli');
      },
    },
  };
}
