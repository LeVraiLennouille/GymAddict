import type { Readiness, ReadinessInput } from '../types';

export function computeReadinessScore(r: ReadinessInput): number {
  return Math.round(((r.sleep + r.stress + r.soreness) / 3) * 10) / 10;
}

export function buildReadiness(r: ReadinessInput): Readiness {
  return { ...r, score: computeReadinessScore(r) };
}

export type ReadinessTone = 'good' | 'mid' | 'low';

export const readinessTone = (score: number): ReadinessTone =>
  score >= 4 ? 'good' : score >= 3 ? 'mid' : 'low';

export function readinessMessage(score: number): string {
  if (score <= 2) return 'Forme basse détectée — réduis tes charges de 10–15%';
  if (score <= 3) return 'Forme correcte — écoute ton corps en séance';
  if (score >= 4.5) return 'Forme olympique ! Pulvérise tes records !';
  return "Bonne forme ! Tu vas assurer aujourd'hui";
}
