import type { AppData, DateKey, ProgramColor, RunLog } from '../types';
import { fmtKg, fmtPace, fmtTonnage } from '../format/numbers';
import { runPaceSec } from './runs';
import { sessionSummary, type SessionSummary } from './summary';
import { getProgramConfig } from './program';

/** Jours avec au moins une série ou une sortie validée, du plus récent au plus ancien. */
export function sessionDates(data: AppData): DateKey[] {
  const dates = new Set<DateKey>();
  for (const date of Object.keys(data.workouts) as DateKey[]) {
    const has = Object.values(data.workouts[date] ?? {}).some((sets) => sets.some((s) => s.done));
    if (has) dates.add(date);
  }
  for (const date of Object.keys(data.runLogs) as DateKey[]) {
    if (data.runLogs[date]?.done) dates.add(date);
  }
  return [...dates].sort().reverse();
}

/** « 5 km · 28 min · 5:36 /km » à partir de ce qui a été saisi. */
export function runLogLine(log: RunLog): string {
  const pace = runPaceSec(log);
  return [
    log.distance ? `${log.distance} km` : '',
    log.duration ? `${log.duration} min` : '',
    pace ? `${fmtPace(pace)} /km` : '',
  ]
    .filter(Boolean)
    .join(' · ');
}

export type SessionColor = ProgramColor | 'run';

/** Couleur d'une séance : celle de son programme, sinon gris (salle) ou bleu (course seule). */
export function sessionColor(data: AppData, s: SessionSummary): SessionColor {
  const key = s.program?.key;
  const prog = key ? getProgramConfig(data).programs[key] : undefined;
  if (prog) return prog.color;
  return s.exercises.length ? 'grey' : 'run';
}

export const sessionTitle = (s: SessionSummary): string =>
  s.program ? s.program.name : s.exercises.length ? 'Séance' : 'Course';

export interface HistoryRow {
  date: DateKey;
  day: number;
  weekday: string;
  title: string;
  meta: string;
  color: SessionColor;
}

export interface HistoryMonth {
  /** `AAAA-MM` */
  key: string;
  label: string;
  count: number;
  rows: HistoryRow[];
}

export function buildHistory(data: AppData): HistoryMonth[] {
  const months: HistoryMonth[] = [];
  for (const date of sessionDates(data)) {
    const key = date.slice(0, 7);
    let month = months[months.length - 1];
    if (!month || month.key !== key) {
      month = {
        key,
        label: new Date(`${key}-01T12:00:00`).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
        count: 0,
        rows: [],
      };
      months.push(month);
    }
    month.count++;

    const s = sessionSummary(data, date);
    const d = new Date(`${date}T12:00:00`);
    const meta: string[] = [];
    if (s.exercises.length) {
      meta.push(`${s.exercises.length} exo${s.exercises.length > 1 ? 's' : ''}`, `${s.sets} séries`);
      if (s.tonnage > 0) meta.push(fmtTonnage(s.tonnage));
      if (s.minutes) meta.push(`${s.minutes} min`);
      if (s.prs.length) meta.push(`${s.prs.length} PR`);
      if (s.note) meta.push('note');
    }
    if (s.run) meta.push(`${s.exercises.length ? '+ course ' : ''}${runLogLine(s.run)}`);

    month.rows.push({
      date,
      day: d.getDate(),
      weekday: d.toLocaleDateString('fr-FR', { weekday: 'short' }),
      title: sessionTitle(s),
      meta: meta.join(' · '),
      color: sessionColor(data, s),
    });
  }
  return months;
}

/** Dernière séance antérieure du même programme avec du tonnage (pour comparer). */
export function previousSimilar(data: AppData, date: DateKey, s: SessionSummary): SessionSummary | null {
  if (!s.program) return null;
  for (const d of sessionDates(data)) {
    if (d >= date) continue;
    const other = sessionSummary(data, d);
    if (other.program && other.program.name === s.program.name && other.tonnage > 0) return other;
  }
  return null;
}

/** Écart de tonnage (en %) avec la séance précédente comparable ; `null` s'il n'y en a pas. */
export function tonnageDelta(data: AppData, date: DateKey, s: SessionSummary): { pct: number; since: DateKey } | null {
  if (s.tonnage <= 0) return null;
  const prev = previousSimilar(data, date, s);
  if (!prev) return null;
  return { pct: Math.round(((s.tonnage - prev.tonnage) / prev.tonnage) * 100), since: prev.date };
}

export const fmtSetLine = (weight: string, reps: string, isTime: boolean): string => {
  const w = parseFloat(weight.replace(',', '.')) || 0;
  const r = reps || '—';
  if (isTime) return w > 0 ? `${fmtKg(w)} kg × ${r} s` : `${r} s`;
  return w > 0 ? `${fmtKg(w)} kg × ${r}` : `${r} reps`;
};
