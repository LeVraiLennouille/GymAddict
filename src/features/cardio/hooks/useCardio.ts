import { useMemo } from 'react';
import { useAppStore } from '@/data/store/appStore';
import { useTodayKey } from '@/data/store/useTodayKey';
import { saveAge } from '@/domain/actions/profile';
import { setRunDone, setRunText, type RunTextField } from '@/domain/actions/cardio';
import { weekDateKeys } from '@/domain/format/dates';
import { buildRunCards, type RunCardView } from '@/domain/rules/runs';
import { getAge, maxHeartRate, zoneRanges, type ZoneRange } from '@/domain/rules/zones';
import type { DateKey } from '@/domain/types';
import { showToast } from '@/ui/feedbackStore';

export interface CardioModel {
  age: number;
  fcMax: number;
  zones: ZoneRange[];
  runs: RunCardView[];
  actions: {
    saveAge: (age: number) => void;
    setText: (date: DateKey, field: RunTextField, text: string) => void;
    toggleDone: (date: DateKey, done: boolean) => void;
  };
}

/** Modèle de l'onglet Cardio : zones de fréquence cardiaque et sorties de la semaine. */
export function useCardio(): CardioModel {
  const data = useAppStore((s) => s.data);
  const update = useAppStore((s) => s.update);
  const today = useTodayKey();

  const age = getAge(data);
  const runs = useMemo(() => buildRunCards(data, weekDateKeys()), [data, today]);

  return {
    age,
    fcMax: maxHeartRate(age),
    zones: zoneRanges(age),
    runs,
    actions: {
      saveAge: (value) => {
        update((d) => saveAge(d, value));
        showToast('Âge sauvegardé');
      },
      setText: (date, field, text) => update((d) => setRunText(d, date, field, text)),
      toggleDone: (date, done) => update((d) => setRunDone(d, date, done)),
    },
  };
}
