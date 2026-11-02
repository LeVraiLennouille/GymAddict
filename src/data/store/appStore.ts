import { create } from 'zustand';
import type { AppData } from '@/domain/types';
import { emptyAppData, normalizeAppData, serializeAppData } from '@/domain/rules/appData';
import { todayKey } from '@/domain/format/dates';
import { loadStoredData, saveStoredData } from '../storage/storage';

const SAVE_DELAY_MS = 350;

interface AppState {
  data: AppData;
  hydrated: boolean;
  /** Horodatage de la dernière écriture réussie (sert à l'indicateur « Enregistré »). */
  lastSavedAt: number;
  hydrate: () => Promise<void>;
  /** Applique une action pure du domaine et programme l'enregistrement. */
  update: (recipe: (data: AppData) => AppData) => void;
  /** Remplace toutes les données (import de sauvegarde). */
  replace: (data: AppData) => void;
  /** Écrit immédiatement (appli passée en arrière-plan). */
  flush: () => Promise<void>;
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;

export const useAppStore = create<AppState>((set, get) => {
  const persist = async (): Promise<void> => {
    saveTimer = null;
    const ok = await saveStoredData(serializeAppData(get().data));
    if (ok) set({ lastSavedAt: Date.now() });
  };

  const schedule = (): void => {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => void persist(), SAVE_DELAY_MS);
  };

  return {
    data: emptyAppData(todayKey()),
    hydrated: false,
    lastSavedAt: 0,

    hydrate: async () => {
      if (get().hydrated) return;
      const raw = await loadStoredData();
      set({ data: normalizeAppData(raw, todayKey()), hydrated: true });
    },

    update: (recipe) => {
      if (!get().hydrated) return;
      const next = recipe(get().data);
      if (next === get().data) return;
      set({ data: next });
      schedule();
    },

    replace: (data) => {
      set({ data, hydrated: true });
      schedule();
    },

    flush: async () => {
      if (!saveTimer) return;
      clearTimeout(saveTimer);
      await persist();
    },
  };
});
