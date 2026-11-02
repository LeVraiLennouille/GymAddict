/** 1RM estimé (formule de Brzycki). */
export function calc1RM(weight: number | string, reps: number | string): number {
  const w = parseFloat(String(weight));
  const r = parseInt(String(reps), 10);
  if (!(w > 0) || !(r > 0)) return 0;
  if (r === 1) return w;
  if (r > 36) return Math.round(w * 0.5 * 10) / 10;
  return Math.round(w * (36 / (37 - r)) * 10) / 10;
}

/** Pourcentages du 1RM affichés dans la fenêtre de record. */
export const ONE_RM_PERCENTS = [100, 95, 90, 85, 80, 75, 70] as const;

export function percentTable(oneRm: number): { pct: number; weight: number }[] {
  return ONE_RM_PERCENTS.map((pct) => ({ pct, weight: Math.round(((oneRm * pct) / 100) * 2) / 2 }));
}
