import type { AppData, DateKey, Goal, GoalType } from '../types';
import { dateToKey, dayNum, todayKey } from '../format/dates';
import { fmtKg } from '../format/numbers';
import { findExName } from './program';

export interface Point {
  x: number;
  y: number;
}

/** Pente d'une régression linéaire (moindres carrés) ; `0` avec moins de deux points. */
export function linSlope(points: Point[]): number {
  const n = points.length;
  if (n < 2) return 0;
  const mx = points.reduce((s, p) => s + p.x, 0) / n;
  const my = points.reduce((s, p) => s + p.y, 0) / n;
  let num = 0;
  let den = 0;
  for (const p of points) {
    num += (p.x - mx) * (p.y - my);
    den += (p.x - mx) * (p.x - mx);
  }
  return den ? num / den : 0;
}

/** Charge maximale validée par séance pour un exercice. */
export function liftSeries(data: AppData, exId: string): { date: DateKey; w: number }[] {
  const out: { date: DateKey; w: number }[] = [];
  for (const date of Object.keys(data.workouts).sort() as DateKey[]) {
    let best = 0;
    for (const s of data.workouts[date]?.[exId] ?? []) {
      if (s.done) best = Math.max(best, parseFloat(s.weight) || 0);
    }
    if (best > 0) out.push({ date, w: best });
  }
  return out;
}

type GoalRef = Pick<Goal, 'type'> & { exId?: string | undefined };

/** Valeur actuelle : dernier poids de corps, ou meilleure charge de l'exercice. */
export function goalCurrent(data: AppData, goal: GoalRef): number | null {
  if (goal.type === 'weight') {
    const last = data.weightLog[data.weightLog.length - 1];
    return last ? last.kg : null;
  }
  const pr = goal.exId ? data.prs[goal.exId] : undefined;
  const best = goal.exId ? liftSeries(data, goal.exId).map((p) => p.w) : [];
  return Math.max(pr ? pr.weight : 0, ...best, 0);
}

export interface GoalProgress {
  cur: number | null;
  pct: number;
  done: boolean;
  /** Sens du poids de corps : −1 pour maigrir, +1 pour prendre. */
  dir?: -1 | 1;
}

export function goalProgress(data: AppData, goal: Goal): GoalProgress {
  const cur = goalCurrent(data, goal);
  if (cur === null) return { cur: null, pct: 0, done: false };
  const { start, target } = goal;
  const clamp = (v: number): number => Math.max(0, Math.min(100, v));

  if (goal.type === 'weight') {
    const dir: -1 | 1 = target < start ? -1 : 1;
    const done = dir < 0 ? cur <= target : cur >= target;
    const span = Math.abs(target - start) || 1;
    return { cur, dir, done, pct: done ? 100 : clamp(((dir < 0 ? start - cur : cur - start) / span) * 100) };
  }
  const done = cur >= target;
  const span = target - start;
  return { cur, done, pct: done ? 100 : span > 0 ? clamp(((cur - start) / span) * 100) : 0 };
}

export type GoalEta =
  | { kind: 'done' }
  | { kind: 'nodata' }
  | { kind: 'stalled' }
  | { kind: 'wrong' }
  | { kind: 'far' }
  | { kind: 'date'; date: DateKey; days: number; rate: number };

/** Estimation de la date d'arrivée, d'après la tendance des 90 derniers jours (poids) ou 120 (charge). */
export function goalEta(data: AppData, goal: Goal, progress: GoalProgress, now: Date = new Date()): GoalEta {
  if (progress.done) return { kind: 'done' };
  if (progress.cur === null) return { kind: 'nodata' };
  const today = dayNum(todayKey(now));

  let points: Point[];
  let minSpanDays: number;
  if (goal.type === 'weight') {
    points = data.weightLog.filter((e) => dayNum(e.date) >= today - 90).map((e) => ({ x: dayNum(e.date), y: e.kg }));
    minSpanDays = 7;
  } else {
    let best = 0;
    points = liftSeries(data, goal.exId ?? '')
      .filter((p) => dayNum(p.date) >= today - 120)
      .map((p) => {
        best = Math.max(best, p.w);
        return { x: dayNum(p.date), y: best };
      });
    minSpanDays = 14;
  }

  const first = points[0];
  const last = points[points.length - 1];
  if (!first || !last || points.length < (goal.type === 'weight' ? 2 : 3) || last.x - first.x < minSpanDays) {
    return { kind: 'nodata' };
  }

  const slope = linSlope(points);
  if (goal.type === 'weight') {
    const dir = progress.dir ?? 1;
    if (dir < 0 ? slope >= -0.005 : slope <= 0.005) return { kind: slope === 0 ? 'stalled' : 'wrong' };
  } else if (slope <= 0.01) {
    return { kind: 'stalled' };
  }

  const days = (goal.target - progress.cur) / slope;
  if (!(days > 0)) return { kind: 'stalled' };
  if (days > 730) return { kind: 'far' };
  const when = dateToKey(new Date(addDaysFromNow(now, Math.ceil(days))));
  return { kind: 'date', date: when, days: Math.ceil(days), rate: slope * 7 };
}

function addDaysFromNow(now: Date, days: number): number {
  const d = new Date(now);
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d.getTime();
}

const fmtDateFull = (d: DateKey): string =>
  new Date(`${d}T12:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

export function etaText(goal: Goal, eta: GoalEta, now: Date = new Date()): string {
  switch (eta.kind) {
    case 'done':
      return `Atteint le ${fmtDateFull(goal.achievedAt ?? todayKey(now))}`;
    case 'date': {
      const delay = eta.days < 14 ? `dans ${eta.days} j` : `dans ${Math.round(eta.days / 7)} sem.`;
      return `≈ ${fmtDateFull(eta.date)} · ${delay} · ${eta.rate > 0 ? '+' : '−'}${fmtKg(Math.abs(eta.rate))} kg/sem.`;
    }
    case 'far':
      return 'Au rythme actuel : plus de 2 ans';
    case 'stalled':
      return "Progression à l'arrêt : pas d'estimation";
    case 'wrong':
      return "Tendance opposée à l'objectif";
    default:
      return goal.type === 'weight'
        ? 'Ajoute des pesées pour estimer la date'
        : 'Pas assez de séances pour estimer la date';
  }
}

export const goalName = (data: AppData, goal: Goal): string =>
  goal.type === 'weight' ? 'Poids de corps' : findExName(data, goal.exId ?? '');

export interface GoalRow {
  goal: Goal;
  name: string;
  progress: GoalProgress;
  eta: GoalEta;
  etaText: string;
}

export function buildGoalRows(data: AppData, now: Date = new Date()): GoalRow[] {
  return data.goals.map((goal) => {
    const progress = goalProgress(data, goal);
    const eta = goalEta(data, goal, progress, now);
    return { goal, name: goalName(data, goal), progress, eta, etaText: etaText(goal, eta, now) };
  });
}

export const GOAL_TYPES: readonly GoalType[] = ['lift', 'weight'];
