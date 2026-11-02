import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { fmtWeekdayDayMonth } from '@/domain/format/dates';
import { MAX_WIDTH } from '@/theme/tokens';
import { Button } from '@/ui/Button';
import { Chip } from '@/ui/Chip';
import { HeroCard } from './components/HeroCard';
import { ProgramPickerSheet } from './components/ProgramPickerSheet';
import { ReadinessSheet } from './components/ReadinessSheet';
import { RestDayView } from './components/RestDayView';
import { SessionExercises } from './components/SessionExercises';
import { SessionNoteCard } from './components/SessionNoteCard';
import { TonnageCard } from './components/TonnageCard';
import { useTodaySession } from './hooks/useTodaySession';
import { useRevealOnProgress, useRevealScroll } from './hooks/useRevealScroll';
import { useAppStore } from '@/data/store/appStore';

/** Onglet « Séance » : programme du jour, séries à valider, tonnage, notes. */
export function TodayScreen() {
  const { scrollRef, reveal, onCardLayout } = useRevealScroll();
  const session = useTodaySession(reveal);
  const { date, view, config, pickerKeys, pseudo, rest, readinessOpen, closeReadiness, actions } = session;
  const override = useAppStore((s) => s.data.dayProgram[date] ?? null);
  const [pickerOpen, setPickerOpen] = useState(false);

  useRevealOnProgress(view.exercises.find((e) => e.active)?.exercise.id ?? null, reveal);

  return (
    <>
      <ScrollView
        ref={scrollRef}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{ paddingHorizontal: 14, paddingTop: 6, paddingBottom: 180, alignItems: 'center' }}
      >
        <View style={{ width: '100%', maxWidth: MAX_WIDTH }}>
          <Chip label={fmtWeekdayDayMonth(date)} />

          {view.isRest && rest ? (
            <RestDayView
              info={rest.info}
              streak={rest.streak}
              regularity={rest.regularity}
              onChooseProgram={() => setPickerOpen(true)}
            />
          ) : (
            <>
              <HeroCard view={view} onChangeProgram={() => setPickerOpen(true)} />
              <SessionExercises session={session} onCardLayout={onCardLayout} />
              <TonnageCard tonnage={view.tonnage} equivalent={view.funEquivalent} />
              <SessionNoteCard note={view.sessionNote} onCommit={actions.commitSessionNote} />
              {view.showSummaryButton ? (
                <Button label="Résumé de la séance" icon="check" variant="green" fullWidth onPress={actions.openSummary} />
              ) : null}
            </>
          )}
        </View>
      </ScrollView>

      <ProgramPickerSheet
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        date={date}
        config={config}
        keys={pickerKeys}
        override={override}
        onSelect={(key) => {
          actions.chooseProgram(key);
          setPickerOpen(false);
        }}
        onReset={() => {
          actions.chooseProgram(null);
          setPickerOpen(false);
        }}
      />
      <ReadinessSheet visible={readinessOpen} pseudo={pseudo} onClose={closeReadiness} onSubmit={actions.submitReadiness} />
    </>
  );
}
