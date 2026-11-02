import type { AppData } from '../types';

export const DEFAULT_BODY_WEIGHT_KG = 75;

/** Poids de corps actuel : dernière pesée, sinon poids saisi, sinon 75 kg. */
export function getBodyWeight(data: AppData): number {
  const last = data.weightLog[data.weightLog.length - 1];
  return last?.kg ?? (data.bodyWeight && data.bodyWeight > 0 ? data.bodyWeight : DEFAULT_BODY_WEIGHT_KG);
}
