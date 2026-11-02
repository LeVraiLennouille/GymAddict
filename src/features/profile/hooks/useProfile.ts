import { useMemo } from 'react';
import { useAppStore } from '@/data/store/appStore';
import { useTodayKey } from '@/data/store/useTodayKey';
import { resetAllData, saveAge, saveBodyWeightEntry } from '@/domain/actions/profile';
import { saveProfile, setPref } from '@/domain/actions/workout';
import { getBodyWeight } from '@/domain/rules/profile';
import { buildProfileStats, type ProfileStats } from '@/domain/rules/profileStats';
import { getAge } from '@/domain/rules/zones';
import type { AvatarKey, Prefs, Profile } from '@/domain/types';
import { testAlert } from '@/services/feedback';
import { useTimerStore } from '@/services/timerStore';
import { showToast } from '@/ui/feedbackStore';

export interface ProfileModel {
  profile: Profile;
  stats: ProfileStats;
  bodyWeight: number;
  age: number;
  prefs: Prefs;
  actions: {
    setPseudo: (pseudo: string) => void;
    setAvatar: (avatar: AvatarKey) => void;
    saveBodyWeight: (raw: string) => void;
    saveAge: (raw: string) => void;
    setPref: (key: 'sound' | 'vibrate', value: boolean) => void;
    testAlert: () => void;
    resetAll: () => void;
  };
}

/** Modèle de l'onglet Profil : identité, statistiques globales, données personnelles, préférences. */
export function useProfile(): ProfileModel {
  const data = useAppStore((s) => s.data);
  const update = useAppStore((s) => s.update);
  const today = useTodayKey();

  const stats = useMemo(() => buildProfileStats(data), [data, today]);

  return {
    profile: data.profile,
    stats,
    bodyWeight: getBodyWeight(data),
    age: getAge(data),
    prefs: data.prefs,
    actions: {
      setPseudo: (pseudo) => update((d) => saveProfile(d, { pseudo: pseudo.trim() })),
      setAvatar: (avatar) => update((d) => saveProfile(d, { avatar })),

      saveBodyWeight: (raw) => {
        const result = saveBodyWeightEntry(useAppStore.getState().data, raw, today);
        if (!result.ok) {
          showToast('Poids invalide (20 à 300 kg)');
          return;
        }
        update(() => result.data);
        showToast('Poids de corps sauvegardé');
      },

      saveAge: (raw) => {
        update((d) => saveAge(d, parseInt(raw, 10) || 25));
        showToast('Âge sauvegardé');
      },

      setPref: (key, value) => update((d) => setPref(d, key, value)),
      testAlert: () => testAlert(useAppStore.getState().data.prefs),

      resetAll: () => {
        useTimerStore.getState().dismiss();
        update((d) => resetAllData(d, today));
        showToast('Données réinitialisées');
      },
    },
  };
}
