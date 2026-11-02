import type { WarmupSet } from '../types';

const WARMUP_PLAN = [
  { pct: 40, reps: 12, label: 'Activation' },
  { pct: 60, reps: 8, label: 'Préparation' },
  { pct: 75, reps: 5, label: 'Mise en route' },
  { pct: 85, reps: 3, label: 'Approche' },
  { pct: 95, reps: 1, label: 'Activation neuro' },
] as const;

/** Séries d'échauffement pour une charge de travail donnée (arrondi au 0,5 kg). */
export function getWarmupSets(workingWeight: number): WarmupSet[] {
  if (!(workingWeight > 0)) return [];
  return WARMUP_PLAN.map((s) => ({
    ...s,
    weight: Math.round(((workingWeight * s.pct) / 100) * 2) / 2,
  }));
}
