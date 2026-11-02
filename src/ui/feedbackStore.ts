import { create } from 'zustand';

export interface PrInfo {
  id: number;
  name: string;
  weight: number;
  reps: number;
  /** 1RM estimé (Brzycki), seulement pour plus d'une répétition. */
  oneRm: number | null;
  /** 1RM divisé par le poids de corps. */
  bodyRatio: number | null;
  table: { pct: number; weight: number }[];
}

interface FeedbackState {
  toast: { id: number; message: string } | null;
  prPopup: PrInfo | null;
  showToast: (message: string) => void;
  hideToast: () => void;
  showPr: (info: Omit<PrInfo, 'id'>) => void;
  hidePr: () => void;
}

let counter = 0;

export const useFeedbackStore = create<FeedbackState>((set) => ({
  toast: null,
  prPopup: null,
  showToast: (message) => set({ toast: { id: ++counter, message } }),
  hideToast: () => set({ toast: null }),
  showPr: (info) => set({ prPopup: { ...info, id: ++counter } }),
  hidePr: () => set({ prPopup: null }),
}));

/** Raccourci utilisable hors composants (hooks de feature, actions). */
export const showToast = (message: string): void => useFeedbackStore.getState().showToast(message);
