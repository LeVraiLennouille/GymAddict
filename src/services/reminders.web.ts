/**
 * Version navigateur : aucune notification ne peut être programmée quand l'appli est fermée.
 * Même interface que `reminders.ts`, mais sans charger `expo-notifications` (qui affiche des avertissements sur le web).
 */
import type { PlannedReminder } from '@/domain/rules/reminders';

export const remindersSupported: boolean = false;

export function configureNotifications(): void {
  /* rien à configurer */
}

export type PermissionState = 'granted' | 'denied' | 'unsupported';

export async function getPermission(): Promise<PermissionState> {
  return 'unsupported';
}

export async function requestPermission(): Promise<PermissionState> {
  return 'unsupported';
}

export async function scheduleReminders(_plan: readonly PlannedReminder[]): Promise<void> {
  /* non pris en charge sur le web */
}

export async function sendTestNotification(): Promise<boolean> {
  return false;
}
