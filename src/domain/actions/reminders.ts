import type { AppData, ReminderPrefs } from '../types';
import { getReminder, parseReminderTime, formatReminderTime } from '../rules/reminders';

const withReminder = (data: AppData, reminder: ReminderPrefs): AppData => ({
  ...data,
  prefs: { ...data.prefs, reminder },
});

export const setReminderEnabled = (data: AppData, enabled: boolean): AppData =>
  withReminder(data, { ...getReminder(data), enabled });

/** Enregistre l'heure (format `HH:MM`, normalisé). */
export function setReminderTime(data: AppData, time: string): AppData {
  const { hours, minutes } = parseReminderTime(time);
  return withReminder(data, { ...getReminder(data), time: formatReminderTime(hours, minutes) });
}

export const setReminderDays = (data: AppData, days: number[]): AppData =>
  withReminder(data, { ...getReminder(data), days });
