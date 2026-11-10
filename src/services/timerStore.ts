import { create } from 'zustand';
import { readKey, removeKey, writeKey } from '@/data/storage/storage';

const TIMER_KEY = 'fitcore.timer';

interface TimerState {
  /** Fin du repos (timestamp ms) ; `null` si aucun minuteur. */
  endAt: number | null;
  /** Durée totale du repos en cours, rallonges comprises (secondes) : sert à dessiner l'anneau. */
  totalSec: number;
  label: string;
  start: (seconds: number, label: string) => void;
  add: (seconds: number) => void;
  dismiss: () => void;
  /** Reprend un minuteur en cours après un rechargement. */
  restore: () => Promise<void>;
}

const persist = (endAt: number, label: string, total: number): void => {
  void writeKey(TIMER_KEY, JSON.stringify({ end: endAt, name: label, total }));
};

export const useTimerStore = create<TimerState>((set, get) => ({
  endAt: null,
  totalSec: 0,
  label: 'Repos',

  start: (seconds, label) => {
    const endAt = Date.now() + seconds * 1000;
    const name = label || 'Repos';
    set({ endAt, label: name, totalSec: seconds });
    persist(endAt, name, seconds);
  },

  add: (seconds) => {
    const { endAt, label, totalSec } = get();
    if (endAt === null) return;
    const next = endAt + seconds * 1000;
    set({ endAt: next, totalSec: totalSec + seconds });
    persist(next, label, totalSec + seconds);
  },

  dismiss: () => {
    set({ endAt: null });
    void removeKey(TIMER_KEY);
  },

  restore: async () => {
    const raw = await readKey(TIMER_KEY);
    if (!raw) return;
    try {
      const saved = JSON.parse(raw) as { end?: unknown; name?: unknown; total?: unknown };
      const end = typeof saved.end === 'number' ? saved.end : 0;
      if (end <= Date.now()) {
        await removeKey(TIMER_KEY);
        return;
      }
      const left = remainingSeconds(end);
      const total = typeof saved.total === 'number' && saved.total >= left ? saved.total : left;
      set({ endAt: end, totalSec: total, label: typeof saved.name === 'string' && saved.name ? saved.name : 'Repos' });
    } catch {
      await removeKey(TIMER_KEY);
    }
  },
}));

/** Secondes restantes (arrondi au supérieur) ; `0` si le temps est écoulé. */
export const remainingSeconds = (endAt: number, now: number = Date.now()): number =>
  Math.max(0, Math.ceil((endAt - now) / 1000));
