import { useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { toNumber } from '@/domain/format/numbers';
import type { ExerciseView, SetView } from '@/domain/rules/todayView';
import type { Exercise } from '@/domain/types';
import { PlateCalculatorSheet } from '@/features/plates/PlateCalculatorSheet';
import { Button } from '@/ui/Button';
import { PROGRAM_HEX } from '@/theme/tokens';
import { SectionTitle } from '@/ui/SectionTitle';
import type { DaySession } from '../hooks/useTodaySession';
import { AddExerciseSheet } from './AddExerciseSheet';
import { ExerciseCard } from './ExerciseCard';
import { SetTimerSheet } from './SetTimerSheet';
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
  const [platesFor, setPlatesFor] = useState<ExerciseView | null>(null);
  const [timerFor, setTimerFor] = useState<{ item: ExerciseView; set: SetView } | null>(null);
  const [addOpen, setAddOpen] = useState(false);

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
          onOpenPlates={() => setPlatesFor(item)}
          onOpenSetTimer={(set) => setTimerFor({ item, set })}
          onRemove={() => actions.removeAdded(item.exercise)}
          onLayout={onCardLayout(item.exercise.id)}
        />
      ))}

      <Button label="Ajouter un exercice" icon="plus" variant="soft" fullWidth style={{ marginBottom: 12 }} onPress={() => setAddOpen(true)} />

      <AddExerciseSheet
        visible={addOpen}
        onClose={() => setAddOpen(false)}
        library={addOpen ? actions.library() : []}
        onPickKnown={actions.addKnown}
        onCreate={actions.addCustom}
      />
      <PlateCalculatorSheet
        visible={platesFor !== null}
        onClose={() => setPlatesFor(null)}
        exerciseName={platesFor?.exercise.name ?? ''}
        initialKg={toNumber((platesFor?.sets.find((s) => !s.done) ?? platesFor?.sets[0])?.weight)}
      />
      <SetTimerSheet
        visible={timerFor !== null}
        onClose={() => setTimerFor(null)}
        exerciseName={timerFor?.item.exercise.name ?? ''}
        setNumber={(timerFor?.set.index ?? 0) + 1}
        targetSec={timerFor ? toNumber(timerFor.set.reps) || timerFor.item.exercise.defaultReps : 0}
        onValidate={(seconds) => {
          if (timerFor) actions.completeTimedSet(timerFor.item.exercise, timerFor.set, seconds);
        }}
      />
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
