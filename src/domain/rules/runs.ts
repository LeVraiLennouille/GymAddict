import type { AppData, DateKey, DayName, ProgramConfig, RunDef, RunId, RunLog } from '../types';
import { DAYS_ORDER } from '../defaults/constants';
import { fmtKm, fmtPace, toNumber } from '../format/numbers';
import { getProgramConfig } from './program';

export type PlannedRun = RunDef & { id: RunId };

export interface RunPlanItem {
  day: DayName;
  run: PlannedRun;
}

export const emptyRunLog = (): RunLog => ({ done: false, duration: '', distance: '', rpe: '' });

export const getRunLog = (data: AppData, date: DateKey): RunLog => data.runLogs[date] ?? emptyRunLog();

/** Sortie prévue un jour de la semaine, s'il y en a une. */
export function runForDay(cfg: ProgramConfig, day: DayName): PlannedRun | null {
  const id = cfg.runWeekly[day];
  const run = id ? cfg.runs[id] : undefined;
  return id && run ? { ...run, id } : null;
}

/** Toutes les sorties planifiées, dans l'ordre de la semaine. */
export function runPlanList(cfg: ProgramConfig): RunPlanItem[] {
  return DAYS_ORDER.flatMap((day): RunPlanItem[] => {
    const run = runForDay(cfg, day);
    return run ? [{ day, run }] : [];
  });
}

/** Allure moyenne en secondes par km ; `0` si durée ou distance manquante. */
export function runPaceSec(log: Pick<RunLog, 'duration' | 'distance'>): number {
  const minutes = parseFloat(log.duration);
  const km = parseFloat(String(log.distance || '').replace(',', '.'));
  return minutes > 0 && km > 0 ? Math.round((minutes * 60) / km) : 0;
}

export interface RunGoalSummary {
  /** « 5 km · 30 min · 6:00 /km » */
  targets: string;
  /** « −1,2 km », « durée atteinte », « allure tenue (−5 s/km) »… */
  progress: string[];
}

/** Objectif d'une sortie et écart avec ce qui a été saisi ; `null` si aucun objectif défini. */
export function runGoalSummary(run: RunDef, log: RunLog): RunGoalSummary | null {
  const targets: string[] = [];
  if (run.targetDistance) targets.push(`${fmtKm(run.targetDistance)} km`);
  if (run.targetDuration) targets.push(`${run.targetDuration} min`);
  if (run.targetPace) targets.push(`${fmtPace(run.targetPace)} /km`);
  if (!targets.length) return null;

  const progress: string[] = [];
  const km = toNumber(log.distance);
  const minutes = parseFloat(log.duration);
  const pace = runPaceSec(log);

  if (run.targetDistance && km > 0) {
    progress.push(km >= run.targetDistance ? 'distance atteinte' : `−${fmtKm(run.targetDistance - km)} km`);
  }
  if (run.targetDuration && minutes > 0) {
    progress.push(minutes >= run.targetDuration ? 'durée atteinte' : `−${Math.round(run.targetDuration - minutes)} min`);
  }
  if (run.targetPace && pace > 0) {
    const gap = pace - run.targetPace;
    progress.push(
      gap <= 0 ? `allure tenue (${gap < 0 ? `−${Math.abs(gap)} s/km` : 'pile'})` : `+${gap} s/km`,
    );
  }
  return { targets: targets.join(' · '), progress };
}

/** Résumé d'une ligne pour la liste de la semaine : réalisé si fait, sinon objectif. */
export function runLineDetail(run: RunDef, log: RunLog): string {
  if (log.done) {
    const pace = runPaceSec(log);
    const actual = [
      log.distance ? `${log.distance} km` : '',
      log.duration ? `${log.duration} min` : '',
      pace ? `${fmtPace(pace)} /km` : '',
    ].filter(Boolean);
    return actual.length ? actual.join(' · ') : 'faite';
  }
  const planned = [
    run.targetDistance ? `${fmtKm(run.targetDistance)} km` : '',
    run.targetDuration ? `${run.targetDuration} min` : '',
    run.targetPace ? `${fmtPace(run.targetPace)} /km` : '',
  ].filter(Boolean);
  return planned.length ? planned.join(' · ') : 'à faire';
}

export interface WeekCardio {
  done: number;
  planned: number;
  distanceKm: number;
  durationMin: number;
  /** Allure moyenne (s/km) sur les sorties où durée et distance sont renseignées ; `0` sinon. */
  paceSec: number;
  weeklyKm: number;
}

/** Bilan cardio de la semaine ; `null` s'il n'y a ni sortie planifiée ni objectif de distance. */
export function weekCardioSummary(data: AppData, week: Record<DayName, DateKey>): WeekCardio | null {
  const cfg = getProgramConfig(data);
  const plan = runPlanList(cfg);
  if (!plan.length && !cfg.weeklyKm) return null;

  let done = 0;
  let distanceKm = 0;
  let durationMin = 0;
  let paceMinutes = 0;
  let paceKm = 0;
  for (const { day } of plan) {
    const log = getRunLog(data, week[day]);
    if (log.done) done++;
    const minutes = parseFloat(log.duration) || 0;
    const km = parseFloat(String(log.distance || '').replace(',', '.')) || 0;
    distanceKm += km;
    durationMin += minutes;
    if (minutes > 0 && km > 0) {
      paceMinutes += minutes;
      paceKm += km;
    }
  }
  return {
    done,
    planned: plan.length,
    distanceKm,
    durationMin,
    paceSec: paceKm > 0 ? (paceMinutes * 60) / paceKm : 0,
    weeklyKm: cfg.weeklyKm,
  };
}

export interface RunCardView {
  day: DayName;
  date: DateKey;
  run: PlannedRun;
  log: RunLog;
  goal: RunGoalSummary | null;
  paceSec: number;
}

/** Une carte par sortie planifiée, avec les dates de la semaine en cours. */
export function buildRunCards(data: AppData, week: Record<DayName, DateKey>): RunCardView[] {
  return runPlanList(getProgramConfig(data)).map(({ day, run }) => {
    const date = week[day];
    const log = getRunLog(data, date);
    return { day, date, run, log, goal: runGoalSummary(run, log), paceSec: runPaceSec(log) };
  });
}
