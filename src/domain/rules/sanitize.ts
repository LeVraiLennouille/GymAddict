/** Utilitaires de nettoyage pour les données saisies ou importées. */

export const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

export const has = (obj: object, key: string): boolean => Object.prototype.hasOwnProperty.call(obj, key);

/** Chaîne sans balises ni caractères dangereux, espaces compactés, longueur limitée. */
export function cleanText(v: unknown, maxLen: number): string {
  return String(v ?? '')
    .replace(/[<>"\\`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen);
}

export const cleanName = (v: unknown): string => cleanText(v, 60);

/** Nom normalisé (minuscules, sans accents) pour comparer deux libellés. */
export const normName = (v: unknown): string =>
  cleanName(v)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

/** Nombre dans [min, max] arrondi à 2 décimales, sinon `0`. */
export function boundedNumber(v: unknown, min: number, max: number): number {
  const n = parseFloat(String(v ?? '').replace(',', '.'));
  return n >= min && n <= max ? Math.round(n * 100) / 100 : 0;
}

/** Texte tel quel ; nombres et booléens convertis ; tout le reste (objets, tableaux…) donne `''`. */
export const asString = (v: unknown): string =>
  typeof v === 'string' ? v : typeof v === 'number' || typeof v === 'boolean' ? String(v) : '';

/** Identifiant valide : chaîne non vide (ou nombre fini) ; sinon `null`. */
export function asId(v: unknown): string | null {
  if (typeof v === 'string') return v.trim() ? v : null;
  return typeof v === 'number' && Number.isFinite(v) ? String(v) : null;
}

/** Nom valide : texte non vide une fois nettoyé ; sinon `null`. */
export function asName(v: unknown): string | null {
  const text = typeof v === 'string' || typeof v === 'number' ? String(v).trim() : '';
  return text || null;
}

/** Entier dans [min, max] ; `fallback` si la valeur n'est pas un nombre exploitable. */
export function boundedInt(v: unknown, min: number, max: number, fallback: number): number {
  const n = typeof v === 'number' ? v : parseFloat(String(v));
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}

/** Décimal dans [min, max] ; `fallback` si la valeur n'est pas un nombre exploitable. */
export function boundedFloat(v: unknown, min: number, max: number, fallback: number): number {
  const n = typeof v === 'number' ? v : parseFloat(String(v).replace(',', '.'));
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

export const asFiniteNumber = (v: unknown): number | undefined =>
  typeof v === 'number' && Number.isFinite(v) ? v : undefined;

export const asInt = (v: unknown, fallback: number): number => {
  const n = parseInt(String(v), 10);
  return Number.isFinite(n) && n !== 0 && Math.abs(n) <= 1e9 ? n : fallback;
};

/** Copie profonde de données JSON (sans `structuredClone`, absent de certains moteurs mobiles). */
export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
