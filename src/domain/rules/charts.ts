/**
 * Géométrie des graphiques (SVG) : calculs purs, sans aucun rendu.
 * Les formules reprennent celles de l'ancienne appli : viewBox 320 × 190.
 */
import type { DateKey } from '../types';
import { fmtKg } from '../format/numbers';

export const CHART_WIDTH = 320;
export const CHART_HEIGHT = 190;

const LEFT = 42;
const PLOT_WIDTH = 266;
const TOP = 14;
const PLOT_HEIGHT = 150;
const BASELINE = TOP + PLOT_HEIGHT;
const LABEL_Y = 184;

const n1 = (v: number): string => v.toFixed(1);

/** `2026-10-28` -> `28/10` */
export const fmtDayMonth = (k: DateKey): string => `${k.slice(8, 10)}/${k.slice(5, 7)}`;

/** Indices des graduations affichées sous l'axe : toutes si ≤ 5, sinon début, quarts et fin. */
export function chartTicks(count: number): number[] {
  if (count <= 5) return Array.from({ length: count }, (_, i) => i);
  const set = new Set<number>([0, count - 1]);
  for (const f of [0.25, 0.5, 0.75]) set.add(Math.round((count - 1) * f));
  return [...set].sort((a, b) => a - b);
}

export type Anchor = 'start' | 'middle' | 'end';

export interface SeriesPoint {
  key: DateKey;
  value: number;
}

export interface Tick {
  x: number;
  y: number;
  label: string;
  anchor: Anchor;
}

export interface LineChartGeometry {
  yTicks: { y: number; label: string }[];
  points: { x: number; y: number }[];
  line: string;
  area: string;
  xTicks: Tick[];
  dotRadius: number;
}

export function lineChartGeometry(series: SeriesPoint[]): LineChartGeometry {
  const n = series.length;
  const values = series.map((p) => p.value);
  let lo = Math.min(...values);
  let hi = Math.max(...values);
  const pad = Math.max(1, (hi - lo) * 0.15);
  lo = Math.max(0, Math.floor((lo - pad) / 2.5) * 2.5);
  hi = Math.ceil((hi + pad) / 2.5) * 2.5;
  if (hi - lo < 2.5) hi = lo + 2.5;

  const x = (i: number): number => (n === 1 ? LEFT + PLOT_WIDTH / 2 : LEFT + (i / (n - 1)) * PLOT_WIDTH);
  const y = (v: number): number => TOP + (1 - (v - lo) / (hi - lo)) * PLOT_HEIGHT;

  const points = series.map((p, i) => ({ x: x(i), y: y(p.value) }));
  const line = points.map((p, i) => `${i ? 'L' : 'M'}${n1(p.x)} ${n1(p.y)}`).join(' ');
  const area = n > 1 ? `${line} L${n1(x(n - 1))} ${BASELINE} L${n1(x(0))} ${BASELINE} Z` : '';

  return {
    yTicks: [lo, (lo + hi) / 2, hi].map((v) => ({ y: y(v), label: fmtKg(v) })),
    points,
    line,
    area,
    xTicks: chartTicks(n).map((i) => ({
      x: x(i),
      y: LABEL_Y,
      label: fmtDayMonth(series[i]?.key ?? ('0000-00-00' as DateKey)),
      anchor: i === 0 && n > 1 ? 'start' : i === n - 1 && n > 1 ? 'end' : 'middle',
    })),
    dotRadius: n > 40 ? 2 : 3.5,
  };
}

export interface BarChartGeometry {
  yTicks: { y: number; label: string }[];
  bars: { x: number; y: number; width: number; height: number; hitX: number; hitWidth: number }[];
  xTicks: Tick[];
}

export const fmtBarValue = (t: number): string =>
  t >= 1000 ? `${(Math.round(t / 100) / 10).toLocaleString('fr-FR')} t` : String(Math.round(t));

export function barChartGeometry(series: SeriesPoint[]): BarChartGeometry {
  const n = series.length;
  const top = Math.max(...series.map((p) => p.value), 1) * 1.1;
  const y = (v: number): number => TOP + (1 - v / top) * PLOT_HEIGHT;
  const slot = PLOT_WIDTH / n;
  const barWidth = Math.max(4, Math.min(28, slot * 0.62));
  const cx = (i: number): number => LEFT + slot * i + slot / 2;

  return {
    yTicks: [0, top / 2, top].map((v) => ({ y: y(v), label: fmtBarValue(v) })),
    bars: series.map((p, i) => ({
      x: cx(i) - barWidth / 2,
      y: y(p.value),
      width: barWidth,
      height: Math.max(1, BASELINE - y(p.value)),
      hitX: cx(i) - slot / 2,
      hitWidth: slot,
    })),
    xTicks: chartTicks(n).map((i) => ({
      x: cx(i),
      y: LABEL_Y,
      label: fmtDayMonth(series[i]?.key ?? ('0000-00-00' as DateKey)),
      anchor: 'middle' as const,
    })),
  };
}

export const RADAR_WIDTH = 320;
export const RADAR_HEIGHT = 290;

export interface RadarGeometry {
  rings: string[];
  spokes: { x1: number; y1: number; x2: number; y2: number }[];
  area: string;
  dots: { x: number; y: number }[];
  labels: { x: number; y: number; text: string; anchor: Anchor }[];
  hasData: boolean;
}

export function radarGeometry(values: number[], labels: readonly string[]): RadarGeometry {
  const n = values.length;
  const max = Math.max(...values, 1);
  const cx = 160;
  const cy = 145;
  const radius = 92;
  const angle = (i: number): number => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const at = (i: number, r: number): { x: number; y: number } => ({
    x: cx + r * Math.cos(angle(i)),
    y: cy + r * Math.sin(angle(i)),
  });
  const ring = (r: number): string =>
    Array.from({ length: n }, (_, i) => at(i, r)).map((p) => `${n1(p.x)},${n1(p.y)}`).join(' ');

  const dots = values.map((v, i) => at(i, (radius * v) / max));
  return {
    rings: [0.25, 0.5, 0.75, 1].map((f) => ring(radius * f)),
    spokes: Array.from({ length: n }, (_, i) => {
      const p = at(i, radius);
      return { x1: cx, y1: cy, x2: p.x, y2: p.y };
    }),
    area: dots.map((p) => `${n1(p.x)},${n1(p.y)}`).join(' '),
    dots,
    labels: labels.map((text, i) => {
      const p = at(i, radius + 18);
      const c = Math.cos(angle(i));
      return { x: p.x, y: p.y + 4, text, anchor: c > 0.3 ? 'start' : c < -0.3 ? 'end' : 'middle' };
    }),
    hasData: values.reduce((a, b) => a + b, 0) > 0,
  };
}

export const WEIGHT_WIDTH = 320;
export const WEIGHT_HEIGHT = 170;

export interface WeightChartGeometry {
  yTicks: { y: number; label: string }[];
  points: { x: number; y: number }[];
  line: string;
  area: string;
  xFirst: { x: number; y: number; label: DateKey };
  xLast: { x: number; y: number; label: DateKey };
  dotRadius: number;
}

export const fmtWeight = (v: number): string =>
  (Math.round(v * 10) / 10).toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** Courbe du poids de corps (au moins deux pesées), échelle temporelle réelle. */
export function weightChartGeometry(entries: { date: DateKey; kg: number }[]): WeightChartGeometry | null {
  if (entries.length < 2) return null;
  const L = 38;
  const R = 12;
  const T = 14;
  const B = 26;
  const times = entries.map((e) => new Date(`${e.date}T12:00:00`).getTime());
  const kgs = entries.map((e) => e.kg);
  let lo = Math.min(...kgs);
  let hi = Math.max(...kgs);
  const pad = Math.max(0.5, (hi - lo) * 0.15);
  lo = Math.floor((lo - pad) * 2) / 2;
  hi = Math.ceil((hi + pad) * 2) / 2;
  if (hi - lo < 1) hi = lo + 1;

  const t0 = times[0] ?? 0;
  const t1 = times[times.length - 1] ?? 0;
  const x = (t: number): number => L + (t1 === t0 ? 0.5 : (t - t0) / (t1 - t0)) * (WEIGHT_WIDTH - L - R);
  const y = (v: number): number => T + (1 - (v - lo) / (hi - lo)) * (WEIGHT_HEIGHT - T - B);

  const points = entries.map((_, i) => ({ x: x(times[i] ?? 0), y: y(kgs[i] ?? 0) }));
  const line = points.map((p, i) => `${i ? 'L' : 'M'}${n1(p.x)} ${n1(p.y)}`).join(' ');
  const baseline = WEIGHT_HEIGHT - B;
  const first = entries[0];
  const last = entries[entries.length - 1];
  if (!first || !last) return null;

  return {
    yTicks: [lo, (lo + hi) / 2, hi].map((v) => ({ y: y(v), label: fmtWeight(v) })),
    points,
    line,
    area: `${line} L${n1(x(t1))} ${baseline} L${n1(x(t0))} ${baseline} Z`,
    xFirst: { x: L, y: WEIGHT_HEIGHT - 6, label: first.date },
    xLast: { x: WEIGHT_WIDTH - R, y: WEIGHT_HEIGHT - 6, label: last.date },
    dotRadius: entries.length > 40 ? 2 : 3.5,
  };
}
