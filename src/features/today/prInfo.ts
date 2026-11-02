import type { AppData } from '@/domain/types';
import { calc1RM, percentTable } from '@/domain/rules/oneRepMax';
import { getBodyWeight } from '@/domain/rules/profile';
import type { PrInfo } from '@/ui/feedbackStore';

/** Contenu de la fenêtre « Nouveau record » : 1RM estimé, ratio au poids de corps, tableau de charges. */
export function buildPrInfo(data: AppData, name: string, weight: number, reps: number): Omit<PrInfo, 'id'> {
  const oneRm = reps > 1 ? calc1RM(weight, reps) : 0;
  const known = oneRm > 0;
  return {
    name,
    weight,
    reps,
    oneRm: known ? oneRm : null,
    bodyRatio: known ? Math.round((oneRm / getBodyWeight(data)) * 100) / 100 : null,
    table: known ? percentTable(oneRm) : [],
  };
}
