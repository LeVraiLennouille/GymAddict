import type {
  AppData,
  AvatarKey,
  DateKey,
  ExDef,
  ExNote,
  Exercise,
  Goal,
  MuscleKey,
  Prefs,
  PersonalRecord,
  Readiness,
  ReminderPrefs,
  RunLog,
  SessionMeta,
  SessionPR,
  SetLog,
  VolumeTargets,
  WeightEntry,
} from '../types';
import { ALL_MUSCLE_KEYS, AVATARS, EXERCISE_TYPES } from '../defaults/constants';
import { isDateKey } from '../format/dates';
import { rememberExNames, sanitizeExercise, sanitizeProgramConfig } from './program';
import { computeReadinessScore } from './readiness';
import { asFiniteNumber, asId, asName, asString, boundedFloat, boundedInt, isRecord } from './sanitize';

/** Clés connues : tout le reste est conservé dans `extras`. */
const KNOWN_KEYS = [
  'schemaVersion',
  'workouts',
  'runLogs',
  'prs',
  'activeDays',
  'age',
  'bodyWeight',
  'weightLog',
  'exNotes',
  'dayProgram',
  'dayOrder',
  'skipped',
  'swaps',
  'sessionMeta',
  'readiness',
  'exNames',
  'exDefs',
  'goals',
  'prefs',
  'profile',
  'program',
  'lastBackup',
] as const;

export const emptySet = (): SetLog => ({ done: false, weight: '', reps: '' });

export function emptyAppData(today: DateKey): AppData {
  return {
    schemaVersion: 1,
    workouts: {},
    runLogs: {},
    prs: {},
    activeDays: [],
    weightLog: [],
    exNotes: {},
    dayProgram: {},
    dayOrder: {},
    skipped: {},
    swaps: {},
    sessionMeta: {},
    readiness: {},
    exNames: {},
    exDefs: {},
    goals: [],
    prefs: { sound: true, vibrate: true },
    profile: { pseudo: '', avatar: 'red', since: today },
    extras: {},
  };
}

/* ------------------------------------------------------------------ */
/* Helpers de lecture tolérante                                        */
/* ------------------------------------------------------------------ */

/** Table `date -> valeur`, en ignorant les clés qui ne sont pas des dates. */
function byDate<T>(raw: unknown, read: (v: unknown, date: DateKey) => T | null): Record<DateKey, T> {
  const out: Record<DateKey, T> = {};
  if (!isRecord(raw)) return out;
  for (const [k, v] of Object.entries(raw)) {
    if (!isDateKey(k)) continue;
    const parsed = read(v, k);
    if (parsed !== null) out[k] = parsed;
  }
  return out;
}

function byId<T>(raw: unknown, read: (v: unknown, id: string) => T | null): Record<string, T> {
  const out: Record<string, T> = {};
  if (!isRecord(raw)) return out;
  for (const [k, v] of Object.entries(raw)) {
    const parsed = read(v, k);
    if (parsed !== null) out[k] = parsed;
  }
  return out;
}

const stringList = (v: unknown): string[] => (Array.isArray(v) ? v.map(String) : []);

const readSet = (v: unknown): SetLog =>
  isRecord(v)
    ? { done: Boolean(v['done']), weight: asString(v['weight']), reps: asString(v['reps']) }
    : emptySet();

function readRunLog(v: unknown): RunLog | null {
  if (!isRecord(v)) return null;
  const log: RunLog = {
    done: Boolean(v['done']),
    duration: asString(v['duration']),
    distance: asString(v['distance']),
    rpe: asString(v['rpe']),
  };
  if ('pace' in v) {
    const pace = asFiniteNumber(v['pace']);
    log.pace = pace !== undefined && pace > 0 ? pace : '';
  }
  return log;
}

function readPR(v: unknown, today: DateKey): PersonalRecord | null {
  if (!isRecord(v)) return null;
  const weight = boundedFloat(v['weight'], 0, 10000, Number.NaN);
  if (!Number.isFinite(weight)) return null;
  return {
    weight,
    reps: boundedInt(v['reps'], 0, 9999, 0),
    date: isDateKey(v['date']) ? v['date'] : today,
  };
}

const readNote = (v: unknown): ExNote | null =>
  isRecord(v) ? { settings: asString(v['settings']), rpe: asString(v['rpe']) } : null;

function readSessionMeta(v: unknown): SessionMeta | null {
  if (!isRecord(v)) return null;
  const meta: SessionMeta = {};
  const start = asFiniteNumber(v['start']);
  const last = asFiniteNumber(v['last']);
  const ms = asFiniteNumber(v['ms']);
  if (start !== undefined) meta.start = start;
  if (last !== undefined) meta.last = last;
  if (ms !== undefined) meta.ms = ms;
  const prog = v['prog'];
  const progKey = isRecord(prog) ? asId(prog['key']) : null;
  if (isRecord(prog) && progKey) meta.prog = { key: progKey, name: asString(prog['name']) };
  if (Array.isArray(v['prs'])) {
    meta.prs = v['prs'].flatMap((p): SessionPR[] => {
      const id = isRecord(p) ? asId(p['id']) : null;
      if (!isRecord(p) || !id) return [];
      return [{ id, name: asString(p['name']), w: boundedFloat(p['w'], 0, 10000, 0), r: boundedInt(p['r'], 0, 9999, 0) }];
    });
  }
  if (v['summaryShown']) meta.summaryShown = true;
  if (typeof v['note'] === 'string' && v['note'].trim()) meta.note = v['note'];
  return meta;
}

function readReadiness(v: unknown): Readiness | null {
  if (!isRecord(v)) return null;
  const n = (x: unknown): number => boundedInt(x, 1, 5, 3);
  const base = { sleep: n(v['sleep']), stress: n(v['stress']), soreness: n(v['soreness']) };
  const score = asFiniteNumber(v['score']) ?? computeReadinessScore(base);
  return { ...base, score };
}

function readExDef(v: unknown, id: string): ExDef | null {
  const name = isRecord(v) ? asName(v['name']) : null;
  if (!isRecord(v) || !name) return null;
  const type = (EXERCISE_TYPES as readonly string[]).includes(String(v['type']))
    ? (v['type'] as ExDef['type'])
    : 'isolation';
  const muscles = Array.isArray(v['muscles'])
    ? v['muscles'].map(String).filter((m): m is MuscleKey => (ALL_MUSCLE_KEYS as readonly string[]).includes(m))
    : [];
  return { id: asId(v['id']) ?? id, name, type, muscles, isTime: Boolean(v['isTime']) };
}

function readGoal(v: unknown, today: DateKey): Goal | null {
  const id = isRecord(v) ? asId(v['id']) : null;
  if (!isRecord(v) || !id) return null;
  const type = v['type'] === 'lift' ? 'lift' : v['type'] === 'weight' ? 'weight' : null;
  const target = boundedFloat(v['target'], 0, 100000, 0);
  if (!type || !(target > 0)) return null;
  const goal: Goal = {
    id,
    type,
    target,
    startDate: isDateKey(v['startDate']) ? v['startDate'] : today,
    start: boundedFloat(v['start'], 0, 100000, 0),
  };
  const exId = asId(v['exId']);
  if (type === 'lift' && exId) goal.exId = exId;
  if (isDateKey(v['achievedAt'])) goal.achievedAt = v['achievedAt'];
  return goal;
}

function readReminder(v: unknown): ReminderPrefs | undefined {
  if (!isRecord(v)) return undefined;
  return {
    enabled: Boolean(v['enabled']),
    time: /^\d{1,2}:\d{2}$/.test(String(v['time'])) ? String(v['time']) : '18:00',
    days: Array.isArray(v['days'])
      ? v['days'].map((d) => parseInt(String(d), 10)).filter((d) => d >= 0 && d <= 6)
      : [],
  };
}

function readVolTargets(v: unknown): VolumeTargets | undefined {
  if (!isRecord(v)) return undefined;
  const out: VolumeTargets = {};
  for (const m of ALL_MUSCLE_KEYS) {
    const pair = v[m];
    if (Array.isArray(pair) && pair.length === 2) {
      const lo = Number(pair[0]);
      const hi = Number(pair[1]);
      if (lo >= 0 && hi >= lo) out[m] = [lo, hi];
    }
  }
  return out;
}

function readPrefs(v: unknown): Prefs {
  const src = isRecord(v) ? v : {};
  const prefs: Prefs = {
    sound: src['sound'] === undefined ? true : Boolean(src['sound']),
    vibrate: src['vibrate'] === undefined ? true : Boolean(src['vibrate']),
  };
  const reminder = readReminder(src['reminder']);
  if (reminder) prefs.reminder = reminder;
  const snooze = asFiniteNumber(src['backupSnooze']);
  if (snooze !== undefined) prefs.backupSnooze = snooze;
  if (src['persistAsked']) prefs.persistAsked = true;
  const vol = readVolTargets(src['volTargets']);
  if (vol) prefs.volTargets = vol;
  return prefs;
}

/* ------------------------------------------------------------------ */
/* Normalisation / sérialisation                                       */
/* ------------------------------------------------------------------ */

/**
 * Transforme n'importe quelle valeur (JSON stocké, ancienne sauvegarde…) en `AppData` valide.
 * Ne lève jamais d'erreur : ce qui est inutilisable est ignoré ou remplacé par une valeur par défaut.
 */
export function normalizeAppData(raw: unknown, today: DateKey): AppData {
  const src: Record<string, unknown> = isRecord(raw) ? raw : {};

  const workouts = byDate(src['workouts'], (day) =>
    isRecord(day)
      ? byId(day, (sets) => (Array.isArray(sets) ? sets.map(readSet) : null))
      : null,
  );

  const age = asFiniteNumber(src['age']);
  const bodyWeight = asFiniteNumber(src['bodyWeight']);

  let weightLog: WeightEntry[] = Array.isArray(src['weightLog'])
    ? src['weightLog'].flatMap((e): WeightEntry[] => {
        if (!isRecord(e) || !isDateKey(e['date'])) return [];
        const kg = parseFloat(String(e['kg']));
        return kg > 0 ? [{ date: e['date'], kg }] : [];
      })
    : [];
  if (!Array.isArray(src['weightLog']) && bodyWeight !== undefined && bodyWeight > 0) {
    weightLog = [{ date: today, kg: bodyWeight }];
  }
  weightLog.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

  const profileSrc = isRecord(src['profile']) ? src['profile'] : {};
  const avatar = AVATARS.find((a): a is AvatarKey => a === profileSrc['avatar']) ?? 'red';

  const program = sanitizeProgramConfig(src['program']);

  const extras: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(src)) {
    if (!(KNOWN_KEYS as readonly string[]).includes(k)) extras[k] = v;
  }

  const data: AppData = {
    schemaVersion: 1,
    workouts,
    runLogs: byDate(src['runLogs'], readRunLog),
    prs: byId(src['prs'], (v) => readPR(v, today)),
    activeDays: Array.isArray(src['activeDays'])
      ? [...new Set(src['activeDays'].filter(isDateKey))]
      : [],
    weightLog,
    exNotes: byDate(src['exNotes'], (day) => (isRecord(day) ? byId(day, readNote) : null)),
    dayProgram: byDate(src['dayProgram'], (v) => (typeof v === 'string' && v ? v : null)),
    dayOrder: byDate(src['dayOrder'], (v) => (Array.isArray(v) ? stringList(v) : null)),
    skipped: byDate(src['skipped'], (v) => (Array.isArray(v) ? stringList(v) : null)),
    swaps: byDate(src['swaps'], (day) =>
      isRecord(day) ? byId<Exercise>(day, (ex) => sanitizeExercise(ex)) : null,
    ),
    sessionMeta: byDate(src['sessionMeta'], readSessionMeta),
    readiness: byDate(src['readiness'], readReadiness),
    exNames: byId(src['exNames'], (v) => (typeof v === 'string' ? v : null)),
    exDefs: byId(src['exDefs'], readExDef),
    goals: Array.isArray(src['goals'])
      ? src['goals'].flatMap((g): Goal[] => {
          const goal = readGoal(g, today);
          return goal ? [goal] : [];
        })
      : [],
    prefs: readPrefs(src['prefs']),
    profile: {
      pseudo: asString(profileSrc['pseudo']),
      avatar,
      since: isDateKey(profileSrc['since']) ? profileSrc['since'] : today,
    },
    extras,
  };
  if (age !== undefined) data.age = age;
  if (bodyWeight !== undefined) data.bodyWeight = bodyWeight;
  if (program) data.program = program;
  const lastBackup = asFiniteNumber(src['lastBackup']);
  if (lastBackup !== undefined) data.lastBackup = lastBackup;

  return rememberExNames(data);
}

/** JSON enregistré : même forme que l'ancienne clé `fitcore`, plus `schemaVersion`. */
export function serializeAppData(data: AppData): string {
  const { extras, ...rest } = data;
  return JSON.stringify({ ...extras, ...rest });
}
