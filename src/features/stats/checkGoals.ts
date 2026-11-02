import { useAppStore } from '@/data/store/appStore';
import { checkGoalsAchieved } from '@/domain/actions/goals';
import { todayKey } from '@/domain/format/dates';
import { fmtKg } from '@/domain/format/numbers';
import { goalName } from '@/domain/rules/goals';
import { showToast } from '@/ui/feedbackStore';

/** À appeler après un record ou une pesée : félicite et marque les objectifs qui viennent d'être atteints. */
export function checkGoals(): void {
  const { data, update } = useAppStore.getState();
  const result = checkGoalsAchieved(data, todayKey());
  if (!result.achieved.length) return;
  update(() => result.data);
  for (const goal of result.achieved) {
    showToast(`Objectif atteint : ${goalName(data, goal)} ${fmtKg(goal.target)} kg !`);
  }
}
