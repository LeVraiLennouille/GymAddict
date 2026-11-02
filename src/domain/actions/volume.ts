import type { AppData, MuscleKey } from '../types';
import { MUSCLE_KEYS } from '../defaults/constants';

/** Enregistre les fourchettes de volume ; `null` si un minimum dépasse son maximum. */
export function saveVolumeTargets(
  data: AppData,
  targets: Record<MuscleKey, [number, number]>,
): AppData | null {
  const out: Partial<Record<MuscleKey, [number, number]>> = {};
  for (const m of MUSCLE_KEYS) {
    const pair = targets[m];
    if (!(pair[0] >= 0 && pair[1] >= pair[0])) return null;
    out[m] = [pair[0], pair[1]];
  }
  return { ...data, prefs: { ...data.prefs, volTargets: out } };
}

export function resetVolumeTargets(data: AppData): AppData {
  const prefs = { ...data.prefs };
  delete prefs.volTargets;
  return { ...data, prefs };
}
