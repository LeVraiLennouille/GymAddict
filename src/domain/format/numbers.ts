/** Convertit une saisie libre (virgule ou point) en nombre ; `0` si invalide. */
export function toNumber(v: unknown): number {
  const n = parseFloat(String(v ?? '').replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

/** `62.5` -> `62,5` */
export const fmtKg = (n: number): string => String(Math.round(n * 100) / 100).replace('.', ',');
export const fmtKm = (n: number): string => String(Math.round(n * 10) / 10).replace('.', ',');

/** Temps de repos : `45s`, `2min`, `1m30`. */
export function fmtRest(sec: number): string {
  const t = Number(sec) || 0;
  if (t < 60) return `${t}s`;
  const m = Math.floor(t / 60);
  const s = t % 60;
  return s ? `${m}m${String(s).padStart(2, '0')}` : `${m}min`;
}

/** Allure en secondes/km -> `5:30`. */
export function fmtPace(sec: number): string {
  if (!sec) return '';
  const r = Math.round(sec);
  return `${Math.floor(r / 60)}:${String(r % 60).padStart(2, '0')}`;
}

/** Durée en minutes -> `1h05` ou `42 min`. */
export function fmtDuration(min: number): string {
  const t = Math.round(min);
  return t >= 60 ? `${Math.floor(t / 60)}h${String(t % 60).padStart(2, '0')}` : `${t} min`;
}

export const fmtInt = (n: number): string => Math.round(n).toLocaleString('fr-FR');

/** Tonnage : `850 kg` ou `1,2 t`. */
export const fmtTonnage = (kg: number): string =>
  kg >= 1000 ? `${(Math.round(kg / 100) / 10).toLocaleString('fr-FR')} t` : `${fmtInt(kg)} kg`;

/** Mise à jour d'un compte à rebours -> `2:05`. */
export function fmtClock(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

/** Saisie d'allure (« 5:30 », « 5'30 », « 5 ») -> secondes par km ; `0` si illisible. */
export function parsePace(text: string): number {
  const t = String(text ?? '').trim();
  const mmss = t.match(/^(\d{1,2})\s*[:'.,]\s*(\d{1,2})$/);
  if (mmss) {
    const s = Number(mmss[2]);
    return s < 60 ? Number(mmss[1]) * 60 + s : 0;
  }
  const minutes = t.match(/^(\d{1,2})$/);
  return minutes ? Number(minutes[1]) * 60 : 0;
}
