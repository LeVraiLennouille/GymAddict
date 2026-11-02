import type { AppData, DateKey, DayName, DayProgress, Program, ProgramId, RunId } from '../types';
import { DAYS_ORDER } from '../defaults/constants';
import { todayKey, weekDateKeys } from '../format/dates';
import { getEffectiveDayProgram, getProgramConfig } from './program';
import { getRunLog, runForDay, runLineDetail, weekCardioSummary, type WeekCardio } from './runs';
import { getDayProgress } from './sets';

export interface WeekDayRun {
  id: RunId;
  name: string;
  done: boolean;
  detail: string;
}

export interface WeekDayView {
  day: DayName;
  date: DateKey;
  isToday: boolean;
  programKey: ProgramId;
  program: Program;
  isOverride: boolean;
  isRest: boolean;
  progress: DayProgress;
  run: WeekDayRun | null;
}

export interface WeekView {
  days: WeekDayView[];
  cardio: WeekCardio | null;
}

/** Les 7 jours de la semaine en cours (lundi → dimanche) avec programme, avancement et sortie. */
export function buildWeekView(data: AppData, now: Date = new Date()): WeekView {
  const dates = weekDateKeys(now);
  const today = todayKey(now);
  const cfg = getProgramConfig(data);

  const days = DAYS_ORDER.map((day): WeekDayView => {
    const date = dates[day];
    const effective = getEffectiveDayProgram(data, date);
    const plannedRun = runForDay(cfg, day);
    const log = plannedRun ? getRunLog(data, date) : null;
    return {
      day,
      date,
      isToday: date === today,
      programKey: effective.key,
      program: effective.prog,
      isOverride: !effective.isSuggestion,
      isRest: effective.prog.type === 'rest',
      progress: getDayProgress(data, date),
      run:
        plannedRun && log
          ? { id: plannedRun.id, name: plannedRun.name, done: log.done, detail: runLineDetail(plannedRun, log) }
          : null,
    };
  });

  return { days, cardio: weekCardioSummary(data, dates) };
}
