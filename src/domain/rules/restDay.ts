import type { AppData, DateKey } from '../types';
import { addDays } from '../format/dates';
import { getEffectiveDayProgram } from './program';
import { getTonnageFor } from './sets';

export interface RestDayInfo {
  next: { date: DateKey; name: string } | null;
  last: { date: DateKey; name: string; tonnage: number } | null;
}

/** Contexte d'un jour de repos : prochaine séance dans la semaine et dernière séance réalisée. */
export function restDayInfo(data: AppData, date: DateKey): RestDayInfo {
  let next: RestDayInfo['next'] = null;
  for (let i = 1; i <= 7 && !next; i++) {
    const d = addDays(date, i);
    const { prog } = getEffectiveDayProgram(data, d);
    if (prog.type !== 'rest') next = { date: d, name: prog.fullName };
  }

  const lastDate = data.activeDays.filter((d) => d < date).sort().pop();
  let last: RestDayInfo['last'] = null;
  if (lastDate) {
    const { prog } = getEffectiveDayProgram(data, lastDate);
    last = {
      date: lastDate,
      name: prog.type !== 'rest' ? prog.fullName : 'Séance',
      tonnage: getTonnageFor(data, lastDate),
    };
  }
  return { next, last };
}
