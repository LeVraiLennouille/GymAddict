import { useMemo } from 'react';
import { useAppStore } from '@/data/store/appStore';
import { computeRegularity, computeStreak } from '@/domain/rules/streak';
import { AppHeader } from '@/ui/AppHeader';

/** En-tête de l'appli branché sur le store : série en cours, régularité, indicateur « Enregistré ». */
export function ConnectedHeader() {
  const activeDays = useAppStore((s) => s.data.activeDays);
  const savedAt = useAppStore((s) => s.lastSavedAt);
  const { streak, regularity } = useMemo(() => {
    const data = useAppStore.getState().data;
    return { streak: computeStreak(data), regularity: computeRegularity(data) };
    // activeDays est la seule donnée dont ces calculs dépendent.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDays]);
  return <AppHeader streak={streak} regularity={regularity} savedAt={savedAt} />;
}
