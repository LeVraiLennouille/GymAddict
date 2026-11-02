import type { AppData, DateKey, ProgramConfig, ReminderPrefs } from '../types';
import { DAY_JS_MAP } from '../defaults/constants';
import { addDays, dayNameOf, parseDateKey, todayKey } from '../format/dates';
import { getEffectiveDayProgram, getProgramConfig } from './program';
import { runForDay } from './runs';

export const DEFAULT_REMINDER_TIME = '18:00';
export const REMINDER_HORIZON_DAYS = 14;

/** Jours JS (0 = dimanche) où le planning prévoit une séance ou une sortie. */
export function defaultReminderDays(cfg: ProgramConfig): number[] {
  const days: number[] = [];
  DAY_JS_MAP.forEach((day, js) => {
    const prog = cfg.programs[cfg.weekly[day]];
    if ((prog && prog.type !== 'rest') || runForDay(cfg, day)) days.push(js);
  });
  return days;
}

export function getReminder(data: AppData): ReminderPrefs {
  return data.prefs.reminder ?? { enabled: false, time: DEFAULT_REMINDER_TIME, days: defaultReminderDays(getProgramConfig(data)) };
}

export function parseReminderTime(time: string): { hours: number; minutes: number } {
  const m = time.match(/^(\d{1,2}):(\d{2})$/);
  const hours = m ? Math.min(23, Number(m[1])) : 18;
  const minutes = m ? Math.min(59, Number(m[2])) : 0;
  return { hours, minutes };
}

export const formatReminderTime = (hours: number, minutes: number): string =>
  `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

/** Décale l'heure d'un nombre de minutes, en restant dans la journée (23:45 + 15 min = 00:00). */
export function shiftReminderTime(time: string, deltaMinutes: number): string {
  const { hours, minutes } = parseReminderTime(time);
  const total = (((hours * 60 + minutes + deltaMinutes) % 1440) + 1440) % 1440;
  return formatReminderTime(Math.floor(total / 60), total % 60);
}

export function toggleReminderDay(days: readonly number[], jsDay: number): number[] {
  return days.includes(jsDay) ? days.filter((d) => d !== jsDay) : [...days, jsDay].sort((a, b) => a - b);
}

export interface PlannedReminder {
  date: DateKey;
  at: Date;
  title: string;
  body: string;
}

/** Texte du rappel d'un jour : la séance prévue, la sortie prévue, ou les deux ; `null` un jour de repos. */
export function reminderMessage(data: AppData, date: DateKey): string | null {
  const { prog } = getEffectiveDayProgram(data, date);
  const run = runForDay(getProgramConfig(data), dayNameOf(date));
  const parts: string[] = [];
  if (prog.type !== 'rest') parts.push(`Séance du jour : ${prog.fullName}`);
  if (run) parts.push(parts.length ? `+ sortie ${run.name}` : `Sortie du jour : ${run.name}`);
  return parts.length ? parts.join(' ') : null;
}

/**
 * Notifications à programmer sur les 14 prochains jours.
 * Pas de rappel pour une heure déjà passée, pour un jour de repos, ni pour aujourd'hui si l'entraînement est fait.
 */
export function planReminders(data: AppData, now: Date = new Date()): PlannedReminder[] {
  const reminder = getReminder(data);
  if (!reminder.enabled || reminder.days.length === 0) return [];
  const { hours, minutes } = parseReminderTime(reminder.time);
  const today = todayKey(now);
  const trainedToday = data.activeDays.includes(today);

  const out: PlannedReminder[] = [];
  for (let i = 0; i < REMINDER_HORIZON_DAYS; i++) {
    const date = addDays(today, i);
    if (!reminder.days.includes(parseDateKey(date).getDay())) continue;
    if (i === 0 && trainedToday) continue;
    const body = reminderMessage(data, date);
    if (!body) continue;
    const at = parseDateKey(date);
    at.setHours(hours, minutes, 0, 0);
    if (at.getTime() <= now.getTime()) continue;
    out.push({ date, at, title: 'GymAddict', body });
  }
  return out;
}

/** Empreinte d'un plan : permet de ne reprogrammer les notifications que s'il a vraiment changé. */
export const reminderSignature = (plan: readonly PlannedReminder[]): string =>
  plan.map((p) => `${p.at.getTime()}|${p.body}`).join(';');
