import type { AppData, DateKey } from '../types';
import { dateToKey, dayNum, todayKey } from '../format/dates';

/** Jours consécutifs avec activité, en comptant aujourd'hui seulement s'il est déjà validé. */
export function computeStreak(data: AppData, now: Date = new Date()): number {
  const active = new Set<DateKey>(data.activeDays);
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  let streak = 0;
  const cursor = new Date(today);
  for (;;) {
    if (active.has(dateToKey(cursor))) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else if (cursor.getTime() === today.getTime()) {
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

/** Régularité : pourcentage de jours actifs sur les 7 derniers jours. */
export function computeRegularity(data: AppData, now: Date = new Date()): number {
  const active = new Set<DateKey>(data.activeDays);
  let n = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    if (active.has(dateToKey(d))) n++;
  }
  return Math.round((n / 7) * 100);
}

/** Jours écoulés depuis une date (≥ 0). */
export const daysSince = (date: DateKey, now: Date = new Date()): number =>
  dayNum(todayKey(now)) - dayNum(date);
