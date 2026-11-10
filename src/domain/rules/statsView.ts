import type { AppData, DateKey, ExerciseId, PersonalRecord } from '../types';
import { MUSCLE_KEYS } from '../defaults/constants';
import { addDays, dateToKey, todayKey } from '../format/dates';
import { toNumber } from '../format/numbers';
import { calc1RM } from './oneRepMax';
import { findExDef, findExName, getProgramConfig } from './program';
import { getBodyWeight } from './profile';

/* ------------------------------------------------------------------ */
/* Évolution des charges                                               */
/* ------------------------------------------------------------------ */

export interface WeeklyTonnage {
  /** Lundi de la semaine. */
  week: DateKey;
  tonnage: number;
}

/** Tonnage (charge × répétitions) d'un exercice, regroupé par semaine. */
export function weeklyTonnageHistory(data: AppData, exId: ExerciseId): WeeklyTonnage[] {
  const byWeek = new Map<DateKey, number>();
  for (const date of Object.keys(data.workouts).sort() as DateKey[]) {
    const done = (data.workouts[date]?.[exId] ?? []).filter((s) => s.done && toNumber(s.weight) > 0);
    if (!done.length) continue;
    const d = new Date(`${date}T12:00:00`);
    const monday = new Date(d);
    monday.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    const key = dateToKey(monday);
    let sum = byWeek.get(key) ?? 0;
    for (const s of done) sum += toNumber(s.weight) * (toNumber(s.reps) || 10);
    byWeek.set(key, sum);
  }
  return [...byWeek.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([week, tonnage]) => ({ week, tonnage: Math.round(tonnage) }));
}

export interface LiftPoint {
  date: DateKey;
  max: number;
  avg: number;
  /** 1RM estimé (Brzycki) : la meilleure série de la séance. */
  oneRm: number;
}

/** Charge maximale et moyenne par séance pour un exercice. */
export function liftHistory(data: AppData, exId: ExerciseId): LiftPoint[] {
  const out: LiftPoint[] = [];
  for (const date of Object.keys(data.workouts).sort() as DateKey[]) {
    const sets = (data.workouts[date]?.[exId] ?? []).filter((s) => s.done && toNumber(s.weight) > 0);
    const weights = sets.map((s) => toNumber(s.weight));
    if (weights.length) {
      out.push({
        date,
        max: Math.max(...weights),
        avg: Math.round((weights.reduce((a, b) => a + b, 0) / weights.length) * 10) / 10,
        oneRm: Math.max(...sets.map((s) => calc1RM(s.weight, toNumber(s.reps) || 10))),
      });
    }
  }
  return out;
}

/** Tous les exercices connus (programme + historique), triés par nom. */
export function allExercises(data: AppData): { id: ExerciseId; name: string }[] {
  const seen = new Set<string>();
  const out: { id: ExerciseId; name: string }[] = [];
  for (const prog of Object.values(getProgramConfig(data).programs)) {
    for (const ex of prog.exercises) {
      if (!seen.has(ex.id)) {
        seen.add(ex.id);
        out.push({ id: ex.id, name: ex.name });
      }
    }
  }
  const logged = new Set<string>();
  for (const day of Object.values(data.workouts)) for (const id of Object.keys(day)) logged.add(id);
  for (const id of logged) {
    const name = data.exNames[id];
    if (!seen.has(id) && name) {
      seen.add(id);
      out.push({ id, name });
    }
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

/* ------------------------------------------------------------------ */
/* Calendrier d'activité                                               */
/* ------------------------------------------------------------------ */

export interface HeatCell {
  date: DateKey;
  level: 0 | 1 | 2 | 3 | 4;
  future: boolean;
  today: boolean;
  /** Une séance ou une sortie existe ce jour-là : la cellule ouvre son détail. */
  clickable: boolean;
  load: number;
}

export interface HeatWeek {
  /** Nom du mois affiché au-dessus de la colonne (première semaine du mois seulement). */
  monthLabel: string;
  cells: HeatCell[];
}

/** Charge du jour : séries validées (charge par défaut 20 kg, 10 reps), ou 500 pour une sortie seule. */
function dayLoads(data: AppData): Map<DateKey, number> {
  const loads = new Map<DateKey, number>();
  for (const date of Object.keys(data.workouts) as DateKey[]) {
    let load = 0;
    for (const sets of Object.values(data.workouts[date] ?? {})) {
      for (const s of sets) if (s.done) load += (parseFloat(s.weight) || 20) * (parseFloat(s.reps) || 10);
    }
    if (load > 0) loads.set(date, load);
  }
  for (const date of Object.keys(data.runLogs) as DateKey[]) {
    if (data.runLogs[date]?.done && !loads.has(date)) loads.set(date, 500);
  }
  return loads;
}

/** Grille de 16 semaines (lundi → dimanche) se terminant par la semaine en cours. */
export function buildHeatmap(data: AppData, now: Date = new Date(), weeks = 16): HeatWeek[] {
  const loads = dayLoads(data);
  const active = new Set<DateKey>(data.activeDays);
  const maxLoad = Math.max(1, ...loads.values());
  const today = todayKey(now);

  const start = new Date(now);
  start.setHours(12, 0, 0, 0);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7) - (weeks - 1) * 7);

  const out: HeatWeek[] = [];
  for (let w = 0; w < weeks; w++) {
    const first = new Date(start);
    first.setDate(start.getDate() + w * 7);
    const monthLabel = first.getDate() <= 7 ? first.toLocaleDateString('fr-FR', { month: 'short' }) : '';
    const cells: HeatCell[] = [];
    for (let d = 0; d < 7; d++) {
      const day = new Date(start);
      day.setDate(start.getDate() + w * 7 + d);
      const date = dateToKey(day);
      const future = date > today;
      const load = loads.get(date) ?? 0;
      const isActive = active.has(date);
      let level: HeatCell['level'] = 0;
      if (!future && (isActive || load > 0)) {
        level = load > 0 ? (Math.min(4, Math.max(1, Math.ceil((load / maxLoad) * 4))) as HeatCell['level']) : 1;
      }
      cells.push({ date, level, future, today: date === today, clickable: !future && (load > 0 || isActive), load });
    }
    out.push({ monthLabel, cells });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Répartition musculaire                                              */
/* ------------------------------------------------------------------ */

/** Volume (charge × répétitions) par muscle sur les 7 derniers jours, dans l'ordre de `MUSCLE_KEYS`. */
export function muscleVolumes(data: AppData, now: Date = new Date()): number[] {
  const totals: Record<string, number> = {};
  for (const m of MUSCLE_KEYS) totals[m] = 0;
  const base = todayKey(now);
  for (let i = 0; i < 7; i++) {
    const day = data.workouts[addDays(base, -i)];
    if (!day) continue;
    for (const [id, sets] of Object.entries(day)) {
      const def = findExDef(data, id);
      if (!def || def.type === 'echauffement') continue;
      for (const s of sets) {
        if (!s.done) continue;
        const load = (parseFloat(s.weight) || 20) * (parseFloat(s.reps) || 10);
        for (const m of def.muscles) if (m in totals) totals[m] = (totals[m] ?? 0) + load;
      }
    }
  }
  return MUSCLE_KEYS.map((m) => totals[m] ?? 0);
}

/* ------------------------------------------------------------------ */
/* Records                                                             */
/* ------------------------------------------------------------------ */

export interface PrRow {
  id: ExerciseId;
  name: string;
  record: PersonalRecord;
  oneRm: number;
  /** Charge ÷ poids de corps. */
  bodyRatio: number;
}

/** Les 20 meilleurs records, par charge décroissante. */
export function buildPrList(data: AppData): PrRow[] {
  const bw = getBodyWeight(data);
  return Object.entries(data.prs)
    .sort((a, b) => b[1].weight - a[1].weight)
    .slice(0, 20)
    .map(([id, record]) => ({
      id,
      name: findExName(data, id) || id,
      record,
      oneRm: record.reps > 1 ? calc1RM(record.weight, record.reps) : record.weight,
      bodyRatio: Math.round((record.weight / bw) * 100) / 100,
    }));
}

/* ------------------------------------------------------------------ */
/* Poids de corps                                                      */
/* ------------------------------------------------------------------ */

export type WeightRange = '30' | '90' | 'all';

export function weightPoints(data: AppData, range: WeightRange, now: Date = new Date()) {
  if (range === 'all') return data.weightLog;
  const from = addDays(todayKey(now), -parseInt(range, 10));
  return data.weightLog.filter((e) => e.date >= from);
}

/* ------------------------------------------------------------------ */
/* Frise des records                                                   */
/* ------------------------------------------------------------------ */

export interface PrEvent {
  date: DateKey;
  id: ExerciseId;
  name: string;
  weight: number;
  reps: number;
  oneRm: number;
}

export interface PrMonth {
  /** `AAAA-MM` */
  key: string;
  label: string;
  events: PrEvent[];
}

/** Records battus au fil des séances (les plus récents d'abord), regroupés par mois. */
export function buildPrTimeline(data: AppData, limit = 60): PrMonth[] {
  const events: PrEvent[] = [];
  for (const date of Object.keys(data.sessionMeta) as DateKey[]) {
    for (const pr of data.sessionMeta[date]?.prs ?? []) {
      events.push({
        date,
        id: pr.id,
        name: pr.name || findExName(data, pr.id),
        weight: pr.w,
        reps: pr.r,
        oneRm: pr.r > 1 ? calc1RM(pr.w, pr.r) : pr.w,
      });
    }
  }
  events.sort((a, b) => (a.date === b.date ? b.weight - a.weight : a.date < b.date ? 1 : -1));

  const months: PrMonth[] = [];
  for (const event of events.slice(0, limit)) {
    const key = event.date.slice(0, 7);
    let month = months[months.length - 1];
    if (!month || month.key !== key) {
      month = { key, label: new Date(`${key}-01T12:00:00`).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }), events: [] };
      months.push(month);
    }
    month.events.push(event);
  }
  return months;
}
