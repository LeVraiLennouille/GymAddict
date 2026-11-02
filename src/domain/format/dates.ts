import type { DateKey, DayName } from '../types';
import { DAYS_ORDER, DAY_JS_MAP } from '../defaults/constants';

const pad = (n: number): string => String(n).padStart(2, '0');

export function dateToKey(d: Date): DateKey {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` as DateKey;
}

export const todayKey = (now: Date = new Date()): DateKey => dateToKey(now);

export const isDateKey = (v: unknown): v is DateKey =>
  typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);

/** Midi local : évite les décalages liés à l'heure d'été. */
export const parseDateKey = (k: DateKey): Date => new Date(`${k}T12:00:00`);

export const dayNameOf = (k: DateKey): DayName => DAY_JS_MAP[parseDateKey(k).getDay()] ?? 'lundi';

export function addDays(k: DateKey, n: number): DateKey {
  const d = parseDateKey(k);
  d.setDate(d.getDate() + n);
  return dateToKey(d);
}

/** Nombre de jours depuis l'époque, pour comparer deux dates. */
export const dayNum = (k: DateKey): number => Math.round(parseDateKey(k).getTime() / 864e5);

/** Dates (AAAA-MM-JJ) de la semaine en cours, lundi à dimanche. */
export function weekDateKeys(now: Date = new Date()): Record<DayName, DateKey> {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  const out = {} as Record<DayName, DateKey>;
  DAYS_ORDER.forEach((day, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    out[day] = dateToKey(d);
  });
  return out;
}

const fr = (k: DateKey, opts: Intl.DateTimeFormatOptions): string =>
  parseDateKey(k).toLocaleDateString('fr-FR', opts);

export const fmtDateLong = (k: DateKey): string =>
  fr(k, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
export const fmtDateShort = (k: DateKey): string => fr(k, { day: 'numeric', month: 'short' });
export const fmtWeekdayDayMonth = (k: DateKey): string =>
  fr(k, { weekday: 'long', day: 'numeric', month: 'long' });
export const fmtWeekdayShort = (k: DateKey): string =>
  fr(k, { weekday: 'short', day: 'numeric', month: 'short' });
