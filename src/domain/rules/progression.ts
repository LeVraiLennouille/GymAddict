import type { Exercise, LastSession, ProgressionSuggestion, RepFields, Unit } from '../types';
import { toNumber } from '../format/numbers';
import { fromUnit, kgToLb } from '../format/units';

/** Fourchette de répétitions lue dans le libellé (« 8-12 reps », « Échec »…). */
export function exRepFields(ex: Exercise): RepFields {
  const label = ex.repsLabel || '';
  if (/[eé]chec/i.test(label)) {
    const n = ex.defaultReps || 10;
    return { failure: true, min: n, max: n };
  }
  const m = label.match(/(\d+)\s*(?:[–-]\s*(\d+))?/);
  if (m && m[1]) {
    const min = Number(m[1]);
    const max = m[2] ? Number(m[2]) : min;
    return { failure: false, min, max: Math.max(min, max) };
  }
  const n = ex.defaultReps || 10;
  return { failure: false, min: n, max: n };
}

/** Reconstruit un libellé de répétitions en conservant le suffixe (« / jambe »…). */
export function buildRepsLabel(ex: Exercise, min: number, max: number): string {
  const old = ex.repsLabel || '';
  const suffix = /[eé]chec/i.test(old) ? '' : old.replace(/^[\s\d–-]*(reps|sec)?/i, '');
  return (min === max ? `${min}` : `${min}-${max}`) + (ex.isTime ? ' sec' : ' reps') + suffix;
}

/**
 * Double progression : si toutes les séries de la dernière séance ont atteint le haut de la
 * fourchette, on propose d'augmenter la charge ; sinon on garde la charge et on vise le haut.
 */
export function getProgressionSuggestion(
  ex: Exercise,
  last: LastSession | null,
  unit: Unit = 'kg',
): ProgressionSuggestion | null {
  if (!last || ex.isTime || ex.type === 'echauffement') return null;
  const reps = exRepFields(ex);
  if (reps.failure || last.sets.length < ex.sets) return null;

  const from = Math.max(...last.sets.map((s) => toNumber(s.weight)));
  if (from <= 0) return null;

  // Le palier est calculé dans l'unité de l'utilisateur (5 lb plutôt que 2,5 kg ≈ 5,5 lb), puis converti en kg.
  let next: number;
  if (unit === 'lb') {
    const fromLb = Math.round(kgToLb(from) * 2) / 2;
    const stepLb = ex.step && ex.step > 0 ? Math.max(2.5, Math.round(kgToLb(ex.step) * 2) / 2) : 5;
    next = fromUnit(fromLb + stepLb, 'lb');
  } else {
    next = Math.round((from + (ex.step && ex.step > 0 ? ex.step : 2.5)) * 100) / 100;
  }
  const step = Math.round((next - from) * 1000) / 1000;
  const allAtTop = last.sets.every((s) => toNumber(s.reps) >= reps.max);

  return allAtTop
    ? { kind: 'up', from, weight: next, step, target: reps.min }
    : { kind: 'hold', from, weight: from, next, target: reps.max };
}
