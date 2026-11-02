import type { AppData, DateKey, Goal, GoalType } from '../types';
import { goalCurrent, goalProgress } from '../rules/goals';

export interface GoalInput {
  /** Présent pour modifier un objectif existant. */
  id?: string;
  type: GoalType;
  exId?: string;
  /** Cible saisie (virgule acceptée). */
  target: string;
}

export type GoalError =
  | 'invalid-target'
  | 'choose-exercise'
  | 'exists'
  | 'add-weight'
  | 'already-reached'
  | 'already-there';

export type GoalSaveResult = { ok: true; data: AppData } | { ok: false; error: GoalError };

export const GOAL_ERROR_MESSAGES: Record<GoalError, string> = {
  'invalid-target': 'Cible invalide',
  'choose-exercise': 'Choisis un exercice',
  exists: 'Un objectif existe déjà : modifie-le',
  'add-weight': "Ajoute d'abord une pesée",
  'already-reached': 'Déjà atteint : choisis une cible plus haute',
  'already-there': 'Tu y es déjà !',
};

/** Crée ou modifie un objectif. Un seul objectif en cours par exercice (ou pour le poids de corps). */
export function saveGoal(data: AppData, input: GoalInput, today: DateKey, nowMs: number): GoalSaveResult {
  const target = Math.round(parseFloat(String(input.target).replace(',', '.')) * 10) / 10;
  if (!(target > 0 && target <= 1000)) return { ok: false, error: 'invalid-target' };

  if (input.id) {
    const goals = data.goals.map((g): Goal => {
      if (g.id !== input.id) return g;
      const updated: Goal = { ...g, target };
      delete updated.achievedAt;
      if (goalProgress(data, updated).done) updated.achievedAt = today;
      return updated;
    });
    return { ok: true, data: { ...data, goals } };
  }

  if (input.type === 'lift' && !input.exId) return { ok: false, error: 'choose-exercise' };
  const clash = data.goals.some(
    (g) => !g.achievedAt && g.type === input.type && (g.type === 'weight' || g.exId === input.exId),
  );
  if (clash) return { ok: false, error: 'exists' };

  const goal: Goal = {
    id: `g_${nowMs.toString(36)}`,
    type: input.type,
    target,
    startDate: today,
    start: 0,
  };
  if (input.type === 'lift' && input.exId) goal.exId = input.exId;

  const current = goalCurrent(data, goal);
  if (goal.type === 'weight' && current === null) return { ok: false, error: 'add-weight' };
  goal.start = current ?? 0;
  if (goal.type === 'lift' && (current ?? 0) >= target) return { ok: false, error: 'already-reached' };
  if (goal.type === 'weight' && current === target) return { ok: false, error: 'already-there' };

  return { ok: true, data: { ...data, goals: [...data.goals, goal] } };
}

export const deleteGoal = (data: AppData, id: string): AppData => ({
  ...data,
  goals: data.goals.filter((g) => g.id !== id),
});

/** Marque les objectifs atteints (une seule fois) ; renvoie ceux qui viennent de l'être. */
export function checkGoalsAchieved(data: AppData, today: DateKey): { data: AppData; achieved: Goal[] } {
  const achieved: Goal[] = [];
  const goals = data.goals.map((g): Goal => {
    if (g.achievedAt || !goalProgress(data, g).done) return g;
    const done: Goal = { ...g, achievedAt: today };
    achieved.push(done);
    return done;
  });
  return achieved.length ? { data: { ...data, goals }, achieved } : { data, achieved };
}
