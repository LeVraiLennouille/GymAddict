import type { AppData, Equipment, Unit } from '../types';

export const DEFAULT_EQUIPMENT: Record<Unit, Equipment> = {
  kg: { bar: 20, plates: [25, 20, 15, 10, 5, 2.5, 1.25] },
  lb: { bar: 45, plates: [45, 35, 25, 10, 5, 2.5] },
};

/** Disques proposés dans les réglages (le matériel réel en possède souvent moins). */
export const PLATE_CHOICES: Record<Unit, readonly number[]> = {
  kg: [25, 20, 15, 10, 5, 2.5, 1.25, 0.5],
  lb: [55, 45, 35, 25, 10, 5, 2.5, 1.25],
};

export const BAR_CHOICES: Record<Unit, readonly number[]> = {
  kg: [20, 15, 10],
  lb: [45, 35],
};

export const getUnit = (data: AppData): Unit => data.prefs.unit ?? 'kg';

export function getEquipment(data: AppData, unit: Unit = getUnit(data)): Equipment {
  return data.prefs.equipment?.[unit] ?? DEFAULT_EQUIPMENT[unit];
}

export interface PlateLoad {
  bar: number;
  /** Disques à charger de chaque côté, du plus gros au plus petit (le plus proche de la barre d'abord). */
  perSide: number[];
  /** Charge réellement obtenue avec ces disques (barre comprise). */
  achieved: number;
  /** `true` si la charge demandée peut être faite exactement avec le matériel disponible. */
  exact: boolean;
  /** Charge demandée inférieure à la barre seule. */
  belowBar: boolean;
}

const round3 = (n: number): number => Math.round(n * 1000) / 1000;

/**
 * Combinaison de disques pour une charge totale, répartie des deux côtés de la barre.
 * Algorithme glouton : on charge les plus gros disques d'abord. Si la charge demandée n'est pas
 * réalisable, on renvoie la charge réalisable la plus proche par en dessous.
 */
export function platesFor(total: number, equipment: Equipment): PlateLoad {
  const { bar } = equipment;
  const available = [...new Set(equipment.plates.filter((p) => p > 0))].sort((a, b) => b - a);
  if (!(total > bar)) {
    return { bar, perSide: [], achieved: bar, exact: total === bar, belowBar: total < bar };
  }

  let rest = round3((total - bar) / 2);
  const perSide: number[] = [];
  for (const plate of available) {
    while (rest + 1e-9 >= plate) {
      perSide.push(plate);
      rest = round3(rest - plate);
    }
  }
  const achieved = round3(bar + 2 * perSide.reduce((a, b) => a + b, 0));
  return { bar, perSide, achieved, exact: rest < 1e-6, belowBar: false };
}

/** `20 + 2,5` ou « barre seule ». */
export function describePlates(load: PlateLoad): string {
  if (!load.perSide.length) return 'barre seule';
  const counts = new Map<number, number>();
  for (const p of load.perSide) counts.set(p, (counts.get(p) ?? 0) + 1);
  return [...counts.entries()].map(([p, n]) => `${n > 1 ? `${n} × ` : ''}${String(p).replace('.', ',')}`).join(' + ');
}

/** Couleurs des disques d'haltérophilie (norme IWF), en kilogrammes ; les livres suivent leur équivalent. */
const PLATE_COLORS: readonly { min: number; color: string }[] = [
  { min: 22, color: '#E5323F' }, // 25 kg, 55 lb
  { min: 17, color: '#1E5BD6' }, // 20 kg, 45 lb
  { min: 12, color: '#F5B700' }, // 15 kg, 35 lb
  { min: 7.5, color: '#12A150' }, // 10 kg, 25 lb
  { min: 3.5, color: '#ECEDF0' }, // 5 kg, 10 lb
  { min: 1.8, color: '#3A3E48' }, // 2,5 kg, 5 lb
  { min: 0, color: '#8C93A1' }, // petits disques
];

const LB_TO_KG_EQUIV = 0.45359237;

export function plateColor(size: number, unit: Unit): string {
  const kg = unit === 'kg' ? size : size * LB_TO_KG_EQUIV;
  return (PLATE_COLORS.find((c) => kg >= c.min) ?? PLATE_COLORS[PLATE_COLORS.length - 1])?.color ?? '#8C93A1';
}

/** Diamètre relatif (0,3 à 1) pour le dessin : un disque léger est plus petit. */
export function plateScale(size: number, unit: Unit): number {
  const kg = unit === 'kg' ? size : size * LB_TO_KG_EQUIV;
  return Math.round((0.3 + 0.7 * Math.min(1, kg / 20) ** 0.55) * 100) / 100;
}
