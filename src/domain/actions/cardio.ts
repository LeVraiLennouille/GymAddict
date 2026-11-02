import type { AppData, DateKey, RunLog } from '../types';
import { getRunLog, runPaceSec } from '../rules/runs';
import { markDayActive } from './workout';

export type RunTextField = 'duration' | 'distance' | 'rpe';

const withLog = (data: AppData, date: DateKey, log: RunLog): AppData => ({
  ...data,
  runLogs: { ...data.runLogs, [date]: log },
});

/** Saisie de la durée, de la distance ou du RPE ; l'allure moyenne est recalculée. */
export function setRunText(data: AppData, date: DateKey, field: RunTextField, value: string): AppData {
  const log: RunLog = { ...getRunLog(data, date), [field]: value };
  if (field !== 'rpe') log.pace = runPaceSec(log) || '';
  return withLog(data, date, log);
}

/** Marque la sortie comme faite (et le jour comme actif) ou l'annule. */
export function setRunDone(data: AppData, date: DateKey, done: boolean): AppData {
  const next = withLog(data, date, { ...getRunLog(data, date), done });
  return done ? markDayActive(next, date) : next;
}
