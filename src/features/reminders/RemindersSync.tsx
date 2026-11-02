import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { useAppStore } from '@/data/store/appStore';
import { planReminders, reminderSignature } from '@/domain/rules/reminders';
import { getPermission, remindersSupported, scheduleReminders } from '@/services/reminders';

const SYNC_DELAY_MS = 800;

/**
 * Garde les notifications programmées à jour : à chaque changement utile (réglages, planning,
 * entraînement du jour validé) et quand l'appli revient au premier plan. Ne fait rien dans le navigateur.
 */
export function RemindersSync() {
  const hydrated = useAppStore((s) => s.hydrated);
  const data = useAppStore((s) => s.data);
  const [tick, setTick] = useState(0);
  const lastSignature = useRef<string | null>(null);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') setTick((t) => t + 1);
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (!hydrated || !remindersSupported) return;
    const id = setTimeout(() => {
      void (async () => {
        const plan = planReminders(data);
        const signature = reminderSignature(plan);
        if (signature === lastSignature.current) return;
        if (plan.length > 0 && (await getPermission()) !== 'granted') return;
        lastSignature.current = signature;
        await scheduleReminders(plan);
      })();
    }, SYNC_DELAY_MS);
    return () => clearTimeout(id);
  }, [data, hydrated, tick]);

  return null;
}
