import type { AppData, DateKey, PersonalRecord } from '../types';
import { dayNum } from '../format/dates';
import { serializeAppData } from './appData';
import { sessionDates } from './history';
import { isRecord } from './sanitize';

export const BACKUP_APP = 'GymAddict';
export const BACKUP_FORMAT = 1;

export interface BackupFile {
  app: string;
  format: number;
  exportedAt: string;
  data: Record<string, unknown>;
}

/** Enveloppe de sauvegarde : l'état complet, tel qu'il est enregistré, avec date d'export. */
export function buildBackupFile(data: AppData, now: Date = new Date()): BackupFile {
  return {
    app: BACKUP_APP,
    format: BACKUP_FORMAT,
    exportedAt: now.toISOString(),
    data: JSON.parse(serializeAppData(data)) as Record<string, unknown>,
  };
}

export function backupFileName(now: Date = new Date()): string {
  const p = (n: number): string => String(n).padStart(2, '0');
  return `gymaddict-sauvegarde-${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}.json`;
}

const STATE_KEYS = ['workouts', 'runLogs', 'prs', 'activeDays', 'weightLog', 'program', 'profile', 'goals', 'prefs'];

/**
 * Retrouve les données dans un fichier importé : enveloppe GymAddict, ancien export brut
 * (l'objet `fitcore` tel quel) ou objet enveloppé sous la clé `fitcore`. `null` si rien n'est reconnu.
 */
export function extractBackupPayload(parsed: unknown): Record<string, unknown> | null {
  if (!isRecord(parsed)) return null;
  const inner = parsed['data'];
  if (isRecord(inner) && ('app' in parsed || 'format' in parsed || 'exportedAt' in parsed)) return inner;
  const wrapped = parsed['fitcore'];
  if (isRecord(wrapped)) return wrapped;
  return STATE_KEYS.some((k) => k in parsed) ? parsed : null;
}

export interface BackupSummary {
  sessionDays: number;
  records: number;
  weighIns: number;
  goals: number;
  firstDay: DateKey | null;
  lastDay: DateKey | null;
}

export function summarizeBackup(data: AppData): BackupSummary {
  const days = sessionDates(data);
  return {
    sessionDays: days.length,
    records: Object.keys(data.prs).length,
    weighIns: data.weightLog.length,
    goals: data.goals.length,
    firstDay: days[days.length - 1] ?? null,
    lastDay: days[0] ?? null,
  };
}

export interface MergeStats {
  sessionDaysAdded: number;
  recordsImproved: number;
  weighInsAdded: number;
  goalsAdded: number;
}

const better = (a: PersonalRecord, b: PersonalRecord): boolean =>
  a.weight > b.weight || (a.weight === b.weight && a.reps > b.reps);

/** Garde, pour chaque date, ce qui existe déjà dans `current` et ajoute les dates manquantes. */
function fill<T>(current: Record<DateKey, T>, incoming: Record<DateKey, T>): Record<DateKey, T> {
  return { ...incoming, ...current };
}

/**
 * Fusion : rien de ce qui est déjà enregistré n'est écrasé.
 * Les jours absents sont ajoutés, les records sont comparés, les pesées et objectifs s'additionnent.
 */
export function mergeAppData(current: AppData, incoming: AppData): { data: AppData; added: MergeStats } {
  const before = new Set(sessionDates(current));
  const prs = { ...current.prs };
  let recordsImproved = 0;
  for (const [id, rec] of Object.entries(incoming.prs)) {
    const mine = prs[id];
    if (!mine || better(rec, mine)) {
      prs[id] = rec;
      recordsImproved++;
    }
  }

  const known = new Set(current.weightLog.map((e) => e.date));
  const newWeights = incoming.weightLog.filter((e) => !known.has(e.date));
  const weightLog = [...current.weightLog, ...newWeights].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

  const goalIds = new Set(current.goals.map((g) => g.id));
  const newGoals = incoming.goals.filter((g) => !goalIds.has(g.id));

  const merged: AppData = {
    ...current,
    workouts: fill(current.workouts, incoming.workouts),
    runLogs: fill(current.runLogs, incoming.runLogs),
    exNotes: fill(current.exNotes, incoming.exNotes),
    dayProgram: fill(current.dayProgram, incoming.dayProgram),
    dayOrder: fill(current.dayOrder, incoming.dayOrder),
    skipped: fill(current.skipped, incoming.skipped),
    swaps: fill(current.swaps, incoming.swaps),
    sessionMeta: fill(current.sessionMeta, incoming.sessionMeta),
    readiness: fill(current.readiness, incoming.readiness),
    prs,
    activeDays: [...new Set([...current.activeDays, ...incoming.activeDays])].sort(),
    weightLog,
    goals: [...current.goals, ...newGoals],
    exNames: { ...incoming.exNames, ...current.exNames },
    exDefs: { ...incoming.exDefs, ...current.exDefs },
    extras: { ...incoming.extras, ...current.extras },
    profile: current.profile.pseudo ? current.profile : { ...incoming.profile, since: minDate(current.profile.since, incoming.profile.since) },
  };
  if (!current.program && incoming.program) merged.program = incoming.program;
  const age = current.age ?? incoming.age;
  if (age !== undefined) merged.age = age;
  const last = weightLog[weightLog.length - 1];
  if (last) merged.bodyWeight = last.kg;

  return {
    data: merged,
    added: {
      sessionDaysAdded: sessionDates(merged).filter((d) => !before.has(d)).length,
      recordsImproved,
      weighInsAdded: newWeights.length,
      goalsAdded: newGoals.length,
    },
  };
}

const minDate = (a: DateKey, b: DateKey): DateKey => (a < b ? a : b);

/* ------------------------------------------------------------------ */
/* Rappel de sauvegarde                                                */
/* ------------------------------------------------------------------ */

export const BACKUP_MIN_SESSIONS = 3;
export const BACKUP_INTERVAL_DAYS = 14;
export const BACKUP_SNOOZE_DAYS = 7;

export interface BackupStatus {
  due: boolean;
  /** Jours depuis la dernière sauvegarde ; `null` si jamais sauvegardé. */
  daysSince: number | null;
}

/** Une sauvegarde est conseillée dès 3 jours d'entraînement, puis toutes les 2 semaines. */
export function backupStatus(data: AppData, now: Date = new Date()): BackupStatus {
  const daysSince = data.lastBackup ? Math.floor((now.getTime() - data.lastBackup) / 864e5) : null;
  const enough = sessionDates(data).length >= BACKUP_MIN_SESSIONS;
  const snoozed = data.prefs.backupSnooze !== undefined && data.prefs.backupSnooze > now.getTime();
  const due = enough && !snoozed && (daysSince === null || daysSince >= BACKUP_INTERVAL_DAYS);
  return { due, daysSince };
}

export const markBackedUp = (data: AppData, nowMs: number): AppData => {
  const prefs = { ...data.prefs };
  delete prefs.backupSnooze;
  return { ...data, lastBackup: nowMs, prefs };
};

export const snoozeBackup = (data: AppData, nowMs: number): AppData => ({
  ...data,
  prefs: { ...data.prefs, backupSnooze: nowMs + BACKUP_SNOOZE_DAYS * 864e5 },
});

/** Nombre de jours calendaires entre deux dates (aujourd'hui compris). */
export const daysBetween = (a: DateKey, b: DateKey): number => Math.abs(dayNum(b) - dayNum(a));
