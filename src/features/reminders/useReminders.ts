import { useEffect, useMemo, useState } from 'react';
import { useAppStore } from '@/data/store/appStore';
import { setReminderDays, setReminderEnabled, setReminderTime } from '@/domain/actions/reminders';
import {
  getReminder,
  planReminders,
  shiftReminderTime,
  toggleReminderDay,
} from '@/domain/rules/reminders';
import type { ReminderPrefs } from '@/domain/types';
import { getPermission, remindersSupported, requestPermission, sendTestNotification, type PermissionState } from '@/services/reminders';
import { showToast } from '@/ui/feedbackStore';

export interface RemindersModel {
  supported: boolean;
  reminder: ReminderPrefs;
  permission: PermissionState;
  /** Prochaine notification prévue, en clair ; `null` s'il n'y en a pas. */
  next: string | null;
  actions: {
    setEnabled: (enabled: boolean) => Promise<void>;
    shiftTime: (deltaMinutes: number) => void;
    toggleDay: (jsDay: number) => void;
    test: () => Promise<void>;
  };
}

/** Modèle de la carte « Rappels d'entraînement » du profil. */
export function useReminders(): RemindersModel {
  const data = useAppStore((s) => s.data);
  const update = useAppStore((s) => s.update);
  const [permission, setPermission] = useState<PermissionState>(remindersSupported ? 'denied' : 'unsupported');

  useEffect(() => {
    void getPermission().then(setPermission);
  }, []);

  const reminder = getReminder(data);
  const next = useMemo(() => {
    const first = planReminders(data)[0];
    if (!first) return null;
    const day = first.at.toLocaleDateString('fr-FR', { weekday: 'long' });
    return `${day} à ${reminder.time} · ${first.body}`;
  }, [data, reminder.time]);

  return {
    supported: remindersSupported,
    reminder,
    permission,
    next,
    actions: {
      setEnabled: async (enabled) => {
        if (enabled) {
          const state = await requestPermission();
          setPermission(state);
          if (state !== 'granted') {
            showToast('Notifications refusées : autorise-les dans les réglages du téléphone');
            return;
          }
        }
        update((d) => setReminderEnabled(d, enabled));
      },
      shiftTime: (delta) => update((d) => setReminderTime(d, shiftReminderTime(getReminder(d).time, delta))),
      toggleDay: (jsDay) => update((d) => setReminderDays(d, toggleReminderDay(getReminder(d).days, jsDay))),
      test: async () => {
        const state = await requestPermission();
        setPermission(state);
        if (state !== 'granted') {
          showToast('Notifications refusées');
          return;
        }
        showToast((await sendTestNotification()) ? 'Notification envoyée' : "Impossible d'envoyer la notification");
      },
    },
  };
}
