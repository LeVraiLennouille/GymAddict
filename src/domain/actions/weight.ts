import type { AppData, DateKey } from '../types';
import { saveBodyWeightEntry } from './profile';

export type WeightError = 'future' | 'invalid';

/** Ajoute une pesée à une date donnée (pas dans le futur). */
export function addWeightEntry(
  data: AppData,
  raw: string,
  date: DateKey,
  today: DateKey,
): { ok: true; data: AppData } | { ok: false; error: WeightError } {
  if (date > today) return { ok: false, error: 'future' };
  const result = saveBodyWeightEntry(data, raw, date);
  return result.ok ? { ok: true, data: result.data } : { ok: false, error: 'invalid' };
}

export function deleteWeightEntry(data: AppData, date: DateKey): AppData {
  const weightLog = data.weightLog.filter((e) => e.date !== date);
  const next: AppData = { ...data, weightLog };
  const last = weightLog[weightLog.length - 1];
  if (last) next.bodyWeight = last.kg;
  else delete next.bodyWeight;
  return next;
}
