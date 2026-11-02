import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/data/store/appStore';
import { fmtWeekdayDayMonth } from '@/domain/format/dates';
import type { DateKey } from '@/domain/types';
import { HeroCard } from '@/features/today/components/HeroCard';
import { ProgramPickerSheet } from '@/features/today/components/ProgramPickerSheet';
import { SessionExercises } from '@/features/today/components/SessionExercises';
import { SessionNoteCard } from '@/features/today/components/SessionNoteCard';
import { useRevealOnProgress, useRevealScroll } from '@/features/today/hooks/useRevealScroll';
import { useDaySession } from '@/features/today/hooks/useTodaySession';
import { useTheme } from '@/theme/ThemeProvider';
import { MAX_WIDTH } from '@/theme/tokens';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { Chip } from '@/ui/Chip';
import { Icon } from '@/ui/Icon';
import { Text } from '@/ui/Text';

/** Détail d'un jour de la semaine : mêmes exercices et séries que l'onglet Séance, pour n'importe quelle date. */
export function DayScreen({ date }: { date: DateKey }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { scrollRef, reveal, onCardLayout } = useRevealScroll();
  const session = useDaySession(date, reveal);
  const { view, config, pickerKeys, actions } = session;
  const override = useAppStore((s) => s.data.dayProgram[date] ?? null);
  const [pickerOpen, setPickerOpen] = useState(false);

  useRevealOnProgress(view.exercises.find((e) => e.active)?.exercise.id ?? null, reveal);

  const close = (): void => {
    if (router.canGoBack()) router.back();
    else router.replace('/week');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        ref={scrollRef}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{ paddingHorizontal: 14, paddingTop: 14 + insets.top, paddingBottom: 60 + insets.bottom, alignItems: 'center' }}
      >
        <View style={{ width: '100%', maxWidth: MAX_WIDTH }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <Chip label={fmtWeekdayDayMonth(date)} style={{ marginBottom: 0 }} />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Fermer"
              onPress={close}
              style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name="close" size={18} color="#FFFFFF" />
            </Pressable>
          </View>

          {view.isRest ? (
            <Card accent={colors.rule}>
              <Text display size={27} accessibilityRole="header">
                Repos
              </Text>
              <Text size={13} tone="dim" style={{ marginVertical: 10 }}>
                Aucun exercice prévu ce jour-là.
              </Text>
              <Button label="Choisir un programme" onPress={() => setPickerOpen(true)} />
            </Card>
          ) : (
            <>
              <HeroCard view={view} onChangeProgram={() => setPickerOpen(true)} />
              <SessionExercises session={session} onCardLayout={onCardLayout} />
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
    </View>
  );
}
