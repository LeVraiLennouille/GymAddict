import type { AppData, DateKey, ExDef, Exercise, MuscleKey } from '../types';
import { MUSCLE_KEYS, MUSCLE_LABELS } from '../defaults/constants';
import { addDays, dateToKey, todayKey } from '../format/dates';
import { dayExercises, findExDef, getEffectiveDayProgram } from './program';
import { getSet, isSkipped } from './sets';

export const VOLUME_DEFAULT: readonly [number, number] = [10, 20];

/** Fourchette cible (séries/semaine) par muscle suivi, avec valeurs par défaut. */
export function volumeTargets(data: AppData): Record<MuscleKey, [number, number]> {
  const saved = data.prefs.volTargets ?? {};
  const out = {} as Record<MuscleKey, [number, number]>;
  for (const m of MUSCLE_KEYS) {
    const pair = saved[m];
    out[m] = pair && pair[0] >= 0 && pair[1] >= pair[0] ? [pair[0], pair[1]] : [VOLUME_DEFAULT[0], VOLUME_DEFAULT[1]];
  }
  return out;
}

/** Lundi de la semaine décalée de `offset` semaines (0 = en cours, −1 = précédente). */
export function weekMonday(offset: number, now: Date = new Date()): Date {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + offset * 7);
  return d;
}

type Tally = Record<MuscleKey, number>;

const emptyTally = (): Tally => {
  const t = {} as Tally;
  for (const m of MUSCLE_KEYS) t[m] = 0;
  return t;
};

/** Le muscle principal compte pour 1 série, les muscles secondaires pour 0,5. */
function addSets(tally: Tally, def: Pick<ExDef, 'type' | 'muscles'> | Exercise | undefined, sets: number): void {
  if (!def || def.type === 'echauffement' || sets <= 0) return;
  def.muscles.forEach((m, i) => {
    if ((MUSCLE_KEYS as readonly string[]).includes(m)) tally[m] += sets * (i === 0 ? 1 : 0.5);
  });
}

export interface WeekVolume {
  actual: Tally;
  /** Séries encore prévues au programme (semaine en cours, aujourd'hui compris). */
  planned: Tally;
  monday: Date;
}

export function weekVolume(data: AppData, offset: number, now: Date = new Date()): WeekVolume {
  const monday = weekMonday(offset, now);
  const today = todayKey(now);
  const actual = emptyTally();
  const planned = emptyTally();
  const mondayKey = dateToKey(monday);

  for (let i = 0; i < 7; i++) {
    const date: DateKey = addDays(mondayKey, i);
    const day = data.workouts[date] ?? {};
    for (const [id, sets] of Object.entries(day)) {
      addSets(actual, findExDef(data, id), sets.filter((s) => s.done).length);
    }
    if (offset === 0 && date >= today) {
      const { prog } = getEffectiveDayProgram(data, date);
      if (prog.type !== 'rest') {
        for (const ex of dayExercises(data, date, prog)) {
          if (isSkipped(data, date, ex.id)) continue;
          let remaining = 0;
          for (let s = 0; s < ex.sets; s++) if (!getSet(data, date, ex.id, s).done) remaining++;
          addSets(planned, ex, remaining);
        }
      }
    }
  }
  return { actual, planned, monday };
}

export type VolumeState = 'under' | 'in' | 'over';

export interface VolumeRow {
  muscle: MuscleKey;
  label: string;
  actual: number;
  planned: number;
  min: number;
  max: number;
  state: VolumeState;
}

export interface VolumeView {
  rows: VolumeRow[];
  /** Valeur maximale de l'échelle des barres. */
  scale: number;
  note: string;
  monday: Date;
}

export const fmtSets = (n: number): string =>
  (Math.round(n * 2) / 2).toLocaleString('fr-FR', { maximumFractionDigits: 1 });

export function buildVolumeView(data: AppData, offset: number, now: Date = new Date()): VolumeView {
  const { actual, planned, monday } = weekVolume(data, offset, now);
  const targets = volumeTargets(data);

  const rows = MUSCLE_KEYS.map((muscle): VolumeRow => {
    const [min, max] = targets[muscle];
    const a = actual[muscle];
    return {
      muscle,
      label: MUSCLE_LABELS[muscle],
      actual: a,
      planned: planned[muscle],
      min,
      max,
      state: a < min ? 'under' : a > max ? 'over' : 'in',
    };
  });
  const scale = Math.max(1, ...rows.map((r) => Math.max(r.max * 1.25, r.actual + r.planned)));

  let note: string;
  if (offset === 0) {
    const low = rows.filter((r) => r.actual + r.planned < r.min).map((r) => r.label);
    note = low.length
      ? `Avec les séances prévues, ${low.join(', ')} resteront sous l'objectif minimum.`
      : 'Avec les séances prévues, tous les muscles atteindront leur objectif minimum.';
  } else {
    const inZone = rows.filter((r) => r.state === 'in').length;
    note = `${inZone} muscle${inZone > 1 ? 's' : ''} sur 7 dans la zone cible cette semaine-là.`;
  }
  return { rows, scale, note, monday };
}
