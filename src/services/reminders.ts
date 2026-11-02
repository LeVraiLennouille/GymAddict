import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import type { PlannedReminder } from '@/domain/rules/reminders';

/** Les notifications locales programmées existent sur iOS et Android, pas dans le navigateur. */
export const remindersSupported: boolean = Platform.OS !== 'web';

const CHANNEL_ID = 'reminders';

/** À appeler une fois au démarrage : affichage des notifications au premier plan et canal Android. */
export function configureNotifications(): void {
  if (!remindersSupported) return;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
  if (Platform.OS === 'android') {
    void Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: "Rappels d'entraînement",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}

export type PermissionState = 'granted' | 'denied' | 'unsupported';

export async function getPermission(): Promise<PermissionState> {
  if (!remindersSupported) return 'unsupported';
  try {
    return (await Notifications.getPermissionsAsync()).granted ? 'granted' : 'denied';
  } catch {
    return 'denied';
  }
}

export async function requestPermission(): Promise<PermissionState> {
  if (!remindersSupported) return 'unsupported';
  try {
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return 'granted';
    return (await Notifications.requestPermissionsAsync()).granted ? 'granted' : 'denied';
  } catch {
    return 'denied';
  }
}

/** Remplace toutes les notifications programmées par le plan donné (un plan vide les supprime). */
export async function scheduleReminders(plan: readonly PlannedReminder[]): Promise<void> {
  if (!remindersSupported) return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    for (const reminder of plan) {
      await Notifications.scheduleNotificationAsync({
        content: { title: reminder.title, body: reminder.body, data: { url: '/' } },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: reminder.at, channelId: CHANNEL_ID },
      });
    }
  } catch {
    /* un rappel manqué ne doit jamais bloquer l'appli */
  }
}

export async function sendTestNotification(): Promise<boolean> {
  if (!remindersSupported) return false;
  try {
    await Notifications.scheduleNotificationAsync({
      content: { title: 'GymAddict', body: 'Rappel de test : tout fonctionne.' },
      trigger: null,
    });
    return true;
  } catch {
    return false;
  }
}
