import type { Unit } from '../types';

/** Les charges sont toujours enregistrées en kilogrammes ; seule leur présentation change. */
export const KG_PER_LB = 0.45359237;

export const kgToLb = (kg: number): number => kg / KG_PER_LB;
export const lbToKg = (lb: number): number => lb * KG_PER_LB;

/** Valeur dans l'unité choisie, arrondie à 2 décimales (kg) ou 1 décimale (lb). */
export function toUnit(kg: number, unit: Unit): number {
  return unit === 'kg' ? Math.round(kg * 100) / 100 : Math.round(kgToLb(kg) * 10) / 10;
}

/** Kilogrammes (3 décimales) à partir d'une valeur saisie dans l'unité choisie. */
export function fromUnit(value: number, unit: Unit): number {
  return Math.round((unit === 'kg' ? value : lbToKg(value)) * 1000) / 1000;
}

const comma = (n: number): string => String(n).replace('.', ',');

/** `62,5` : nombre seul, dans l'unité choisie. */
export const fmtMass = (kg: number, unit: Unit): string => comma(toUnit(kg, unit));

/** `62,5 kg` ou `137,5 lb`. */
export const fmtMassUnit = (kg: number, unit: Unit): string => `${fmtMass(kg, unit)} ${unit}`;

/** Tonnage : `850 kg`, `1,2 t` ; en livres, `1 874 lb`. */
export function fmtTonnageIn(kg: number, unit: Unit): string {
  if (unit === 'lb') return `${Math.round(kgToLb(kg)).toLocaleString('fr-FR')} lb`;
  return kg >= 1000 ? `${(Math.round(kg / 100) / 10).toLocaleString('fr-FR')} t` : `${Math.round(kg).toLocaleString('fr-FR')} kg`;
}

/** Tonnage sans « t » (pour les grands chiffres des cartes) : `12 450`. */
export const fmtTonnageValue = (kg: number, unit: Unit): string =>
  Math.round(unit === 'kg' ? kg : kgToLb(kg)).toLocaleString('fr-FR');

/**
 * Texte saisi par l'utilisateur (dans son unité) -> chaîne en kilogrammes, telle qu'enregistrée.
 * Texte vide ou illisible -> `''`.
 */
export function parseMassInput(text: string, unit: Unit): string {
  const n = parseFloat(String(text).replace(',', '.'));
  if (!Number.isFinite(n) || n < 0) return '';
  return String(fromUnit(n, unit));
}

/** Chaîne enregistrée en kilogrammes -> texte affiché dans l'unité choisie (`''` reste vide). */
export function displayMassInput(kgText: string, unit: Unit): string {
  const n = parseFloat(String(kgText).replace(',', '.'));
  if (!Number.isFinite(n)) return '';
  const v = toUnit(n, unit);
  return v === 0 && n !== 0 ? String(n) : comma(v);
}

export const UNITS: readonly Unit[] = ['kg', 'lb'];
