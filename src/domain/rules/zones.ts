import type { AppData } from '../types';

export interface HeartZone {
  name: string;
  label: string;
  /** Pourcentages de la FC max. */
  pct: readonly [number, number];
  color: string;
}

export const HEART_ZONES: readonly HeartZone[] = [
  { name: 'Zone 1', label: 'Récupération active', pct: [50, 60], color: '#5B96FF' },
  { name: 'Zone 2', label: 'Endurance / Brûle-graisses', pct: [60, 70], color: '#34D07A' },
  { name: 'Zone 3', label: 'Aérobie — Endurance', pct: [70, 80], color: '#F5B700' },
  { name: 'Zone 4', label: 'Tempo / Seuil lactique', pct: [80, 90], color: '#FF8A3D' },
  { name: 'Zone 5', label: 'VO2max / Sprint', pct: [90, 100], color: '#FF4D5A' },
];

export const DEFAULT_AGE = 25;

export const getAge = (data: AppData): number => (data.age && data.age > 0 ? data.age : DEFAULT_AGE);

/** Fréquence cardiaque maximale théorique (220 − âge). */
export const maxHeartRate = (age: number): number => 220 - age;

export interface ZoneRange extends HeartZone {
  min: number;
  max: number;
}

export function zoneRanges(age: number): ZoneRange[] {
  const fcMax = maxHeartRate(age);
  return HEART_ZONES.map((z) => ({
    ...z,
    min: Math.round((fcMax * z.pct[0]) / 100),
    max: Math.round((fcMax * z.pct[1]) / 100),
  }));
}
