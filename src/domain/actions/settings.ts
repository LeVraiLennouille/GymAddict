import type { AppData, Equipment, ThemeMode, Unit } from '../types';
import { DEFAULT_EQUIPMENT, getEquipment } from '../rules/plates';

const withPrefs = (data: AppData, patch: Partial<AppData['prefs']>): AppData => ({ ...data, prefs: { ...data.prefs, ...patch } });

export const setUnit = (data: AppData, unit: Unit): AppData => withPrefs(data, { unit });
export const setThemeMode = (data: AppData, theme: ThemeMode): AppData => withPrefs(data, { theme });

function withEquipment(data: AppData, unit: Unit, equipment: Equipment): AppData {
  return withPrefs(data, { equipment: { ...data.prefs.equipment, [unit]: equipment } });
}

/** Poids de la barre (dans l'unité choisie), entre 0 et 100. */
export function setBarWeight(data: AppData, unit: Unit, bar: number): AppData {
  if (!Number.isFinite(bar) || bar < 0 || bar > 100) return data;
  return withEquipment(data, unit, { ...getEquipment(data, unit), bar });
}

/** Ajoute le disque s'il manque, le retire sinon ; la liste reste triée du plus lourd au plus léger. */
export function togglePlate(data: AppData, unit: Unit, size: number): AppData {
  if (!(size > 0 && size <= 100)) return data;
  const current = getEquipment(data, unit);
  const plates = current.plates.includes(size)
    ? current.plates.filter((p) => p !== size)
    : [...current.plates, size].sort((a, b) => b - a);
  return withEquipment(data, unit, { ...current, plates });
}

export function resetEquipment(data: AppData, unit: Unit): AppData {
  const equipment = { ...data.prefs.equipment };
  delete equipment[unit];
  const prefs: AppData['prefs'] = { ...data.prefs };
  if (equipment.kg || equipment.lb) prefs.equipment = equipment;
  else delete prefs.equipment;
  return { ...data, prefs };
}

export const defaultEquipment = (unit: Unit): Equipment => DEFAULT_EQUIPMENT[unit];
