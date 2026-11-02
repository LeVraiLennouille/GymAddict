import type { AppData, DateKey } from '../types';
import { emptyAppData } from '../rules/appData';
import { rememberExNames } from '../rules/program';

export function saveAge(data: AppData, age: number): AppData {
  return { ...data, age };
}

export const MIN_BODY_WEIGHT = 20;
export const MAX_BODY_WEIGHT = 300;

/** Enregistre une pesée (une par jour). `ok` est faux si la valeur est hors de 20-300 kg. */
export function saveBodyWeightEntry(
  data: AppData,
  raw: string,
  date: DateKey,
): { data: AppData; ok: boolean } {
  const kg = Math.round(parseFloat(String(raw).replace(',', '.')) * 10) / 10;
  if (!(kg >= MIN_BODY_WEIGHT && kg <= MAX_BODY_WEIGHT)) return { data, ok: false };
  const log = data.weightLog.filter((e) => e.date !== date);
  log.push({ date, kg });
  log.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  return { data: { ...data, weightLog: log, bodyWeight: log[log.length - 1]?.kg ?? kg }, ok: true };
}

/**
 * Efface séances, records, tonnage, streak et check-ins.
 * Le programme, les noms d'exercices, les préférences et le profil (pseudo, avatar) sont conservés ;
 * la date « membre depuis » repart d'aujourd'hui.
 */
export function resetAllData(data: AppData, today: DateKey): AppData {
  const fresh = emptyAppData(today);
  const kept: AppData = {
    ...fresh,
    exNames: data.exNames,
    prefs: data.prefs,
    profile: { ...data.profile, since: today },
    extras: data.extras,
    ...(data.program ? { program: data.program } : {}),
  };
  return rememberExNames(kept);
}

/** Retient que la demande de stockage persistant a déjà été faite (on ne la répète pas). */
export const markPersistAsked = (data: AppData): AppData => ({
  ...data,
  prefs: { ...data.prefs, persistAsked: true },
});
