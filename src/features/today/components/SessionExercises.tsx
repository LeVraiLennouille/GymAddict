import { useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import type { Exercise } from '@/domain/types';
import { PROGRAM_HEX } from '@/theme/tokens';
import { SectionTitle } from '@/ui/SectionTitle';
import type { DaySession } from '../hooks/useTodaySession';
import { ExerciseCard } from './ExerciseCard';
import { SwapSheet } from './SwapSheet';
import { WarmupSheet } from './WarmupSheet';

interface Props {
  session: DaySession;
  onCardLayout: (exerciseId: string) => (event: LayoutChangeEvent) => void;
}

/** Liste des exercices d'une journée, avec les fenêtres d'échauffement et de remplacement. */
export function SessionExercises({ session, onCardLayout }: Props) {
  const { view, actions } = session;
  const [opened, setOpened] = useState<Record<string, boolean>>({});
  const [warmupFor, setWarmupFor] = useState<Exercise | null>(null);
  const [swapFor, setSwapFor] = useState<Exercise | null>(null);

  const color = PROGRAM_HEX[view.program.color];
  const warmupRecord = warmupFor ? view.exercises.find((e) => e.exercise.id === warmupFor.id)?.record : undefined;
  const candidates = swapFor ? actions.candidatesFor(swapFor) : [];

  return (
    <>
      {view.exercises.length > 0 ? <SectionTitle>Exercices</SectionTitle> : null}
      {view.exercises.map((item) => (
        <ExerciseCard
          key={item.exercise.id}
          item={item}
          color={color}
          open={Boolean(opened[item.exercise.id])}
          actions={actions}
          onToggleOpen={() => setOpened((o) => ({ ...o, [item.exercise.id]: !o[item.exercise.id] }))}
          onOpenWarmup={() => setWarmupFor(item.exercise)}
          onOpenSwap={() => setSwapFor(item.exercise)}
          onLayout={onCardLayout(item.exercise.id)}
        />
      ))}

      <WarmupSheet exercise={warmupFor} record={warmupRecord} onClose={() => setWarmupFor(null)} />
      <SwapSheet
        exercise={swapFor}
        candidates={candidates}
        onClose={() => setSwapFor(null)}
        onPick={(target) => {
          if (swapFor) actions.swapTo(swapFor, target);
          setSwapFor(null);
        }}
        onCustom={(name) => {
          const ok = swapFor ? actions.swapToCustom(swapFor, name) : false;
          if (ok) setSwapFor(null);
          return ok;
        }}
      />
    </>
  );
}
