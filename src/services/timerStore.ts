import { create } from 'zustand';
import { readKey, removeKey, writeKey } from '@/data/storage/storage';

const TIMER_KEY = 'fitcore.timer';

interface TimerState {
  /** Fin du repos (timestamp ms) ; `null` si aucun minuteur. */
  endAt: number | null;
  label: string;
  start: (seconds: number, label: string) => void;
  add: (seconds: number) => void;
  dismiss: () => void;
  /** Reprend un minuteur en cours après un rechargement. */
  restore: () => Promise<void>;
}

const persist = (endAt: number, label: string): void => {
  void writeKey(TIMER_KEY, JSON.stringify({ end: endAt, name: label }));
};

export const useTimerStore = create<TimerState>((set, get) => ({
  endAt: null,
  label: 'Repos',

  start: (seconds, label) => {
    const endAt = Date.now() + seconds * 1000;
    const name = label || 'Repos';
    set({ endAt, label: name });
    persist(endAt, name);
  },

  add: (seconds) => {
    const { endAt, label } = get();
    if (endAt === null) return;
    const next = endAt + seconds * 1000;
    set({ endAt: next });
    persist(next, label);
  },

  dismiss: () => {
    set({ endAt: null });
    void removeKey(TIMER_KEY);
  },

  restore: async () => {
    const raw = await readKey(TIMER_KEY);
    if (!raw) return;
    try {
      const saved = JSON.parse(raw) as { end?: unknown; name?: unknown };
      const end = typeof saved.end === 'number' ? saved.end : 0;
      if (end <= Date.now()) {
        await removeKey(TIMER_KEY);
        return;
      }
      set({ endAt: end, label: typeof saved.name === 'string' && saved.name ? saved.name : 'Repos' });
    } catch {
      await removeKey(TIMER_KEY);
    }
  },
}));

/** Secondes restantes (arrondi au supérieur) ; `0` si le temps est écoulé. */
export const remainingSeconds = (endAt: number, now: number = Date.now()): number =>
  Math.max(0, Math.ceil((endAt - now) / 1000));
