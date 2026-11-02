import type { AppData, DateKey } from '../types';
import { dayNum, todayKey } from '../format/dates';
import { toNumber } from '../format/numbers';
import { computeRegularity, computeStreak } from './streak';
import { getFunEquivalent } from './funEquivalent';
import type { FunEquivalent } from '../types';

/** Tonnage cumulé de toutes les séries validées (toutes dates, tous exercices). */
export function totalTonnageAllTime(data: AppData): number {
  let total = 0;
  for (const day of Object.values(data.workouts)) {
    for (const sets of Object.values(day)) {
      for (const s of sets) {
        if (s.done && !Number.isNaN(parseFloat(s.weight))) {
          total += toNumber(s.weight) * (toNumber(s.reps) || 10);
        }
      }
    }
  }
  return Math.round(total);
}

export interface ProfileStats {
  streak: number;
  sessions: number;
  regularity: number;
  tonnage: number;
  equivalent: FunEquivalent | null;
  memberSince: DateKey;
  memberDays: number;
}

export function buildProfileStats(data: AppData, now: Date = new Date()): ProfileStats {
  const tonnage = totalTonnageAllTime(data);
  const since = data.profile.since;
  return {
    streak: computeStreak(data, now),
    sessions: data.activeDays.length,
    regularity: computeRegularity(data, now),
    tonnage,
    equivalent: tonnage > 0 ? getFunEquivalent(tonnage) : null,
    memberSince: since,
    memberDays: Math.max(0, dayNum(todayKey(now)) - dayNum(since)),
  };
}
