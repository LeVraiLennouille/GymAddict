/** Chronomètre d'une série chronométrée (planche, gainage…) : fonctions pures, le temps est passé en paramètre. */
export interface StopwatchState {
  /** Instant du dernier démarrage (ms) ; `null` si en pause ou pas commencé. */
  startedAt: number | null;
  /** Temps déjà écoulé avant le dernier démarrage (ms). */
  accumulatedMs: number;
}

export const stopwatchInitial = (): StopwatchState => ({ startedAt: null, accumulatedMs: 0 });

export const stopwatchStart = (s: StopwatchState, now: number): StopwatchState =>
  s.startedAt === null ? { ...s, startedAt: now } : s;

export const stopwatchPause = (s: StopwatchState, now: number): StopwatchState =>
  s.startedAt === null ? s : { startedAt: null, accumulatedMs: s.accumulatedMs + Math.max(0, now - s.startedAt) };

export const stopwatchElapsedMs = (s: StopwatchState, now: number): number =>
  s.accumulatedMs + (s.startedAt === null ? 0 : Math.max(0, now - s.startedAt));

export const stopwatchRunning = (s: StopwatchState): boolean => s.startedAt !== null;

/** Secondes écoulées (arrondi inférieur). */
export const elapsedSeconds = (s: StopwatchState, now: number): number => Math.floor(stopwatchElapsedMs(s, now) / 1000);

/** Secondes restantes avant la cible (arrondi supérieur) ; `0` une fois la cible atteinte. */
export const remainingToTarget = (s: StopwatchState, now: number, targetSec: number): number =>
  Math.max(0, Math.ceil(targetSec - stopwatchElapsedMs(s, now) / 1000));

/** Part accomplie de la cible, entre 0 et 1. */
export const progressToTarget = (s: StopwatchState, now: number, targetSec: number): number =>
  targetSec > 0 ? Math.min(1, stopwatchElapsedMs(s, now) / (targetSec * 1000)) : 0;
