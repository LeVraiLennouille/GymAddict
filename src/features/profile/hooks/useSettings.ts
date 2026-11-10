import { useAppStore } from '@/data/store/appStore';
import { resetEquipment, setBarWeight, setThemeMode, setUnit, togglePlate } from '@/domain/actions/settings';
import { getEquipment, getUnit } from '@/domain/rules/plates';
import type { Equipment, ThemeMode, Unit } from '@/domain/types';
import { showToast } from '@/ui/feedbackStore';

export interface SettingsModel {
  unit: Unit;
  theme: ThemeMode;
  equipment: Equipment;
  actions: {
    setUnit: (unit: Unit) => void;
    setTheme: (theme: ThemeMode) => void;
    setBar: (bar: number) => void;
    togglePlate: (size: number) => void;
    resetEquipment: () => void;
  };
}

/** Modèle des réglages : unité, thème, barre et disques disponibles. */
export function useSettings(): SettingsModel {
  const data = useAppStore((s) => s.data);
  const update = useAppStore((s) => s.update);
  const unit = getUnit(data);
  return {
    unit,
    theme: data.prefs.theme ?? 'system',
    equipment: getEquipment(data, unit),
    actions: {
      setUnit: (next) => update((d) => setUnit(d, next)),
      setTheme: (next) => update((d) => setThemeMode(d, next)),
      setBar: (bar) => update((d) => setBarWeight(d, getUnit(d), bar)),
      togglePlate: (size) => update((d) => togglePlate(d, getUnit(d), size)),
      resetEquipment: () => {
        update((d) => resetEquipment(d, getUnit(d)));
        showToast('Matériel par défaut rétabli');
      },
    },
  };
}
