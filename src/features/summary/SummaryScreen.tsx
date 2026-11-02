import { useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/data/store/appStore';
import { duplicateSession, type DuplicateError } from '@/domain/actions/history';
import { saveSessionNote } from '@/domain/actions/workout';
import { fmtDateLong, todayKey } from '@/domain/format/dates';
import { fmtDuration, fmtInt, fmtKg } from '@/domain/format/numbers';
import { getFunEquivalent } from '@/domain/rules/funEquivalent';
import { fmtSetLine, runLogLine, tonnageDelta } from '@/domain/rules/history';
import { sessionSummary } from '@/domain/rules/summary';
import type { DateKey } from '@/domain/types';
import { useTheme } from '@/theme/ThemeProvider';
import { MAX_WIDTH } from '@/theme/tokens';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { CommitInput } from '@/ui/CommitInput';
import { Icon } from '@/ui/Icon';
import { SectionTitle } from '@/ui/SectionTitle';
import { StatCard } from '@/ui/StatCard';
import { Text } from '@/ui/Text';
import { showToast } from '@/ui/feedbackStore';

const DUPLICATE_ERRORS: Record<DuplicateError, string> = {
  today: "C'est déjà la séance d'aujourd'hui",
  'has-sets': "Aujourd'hui a déjà des séries validées",
  'not-found': 'Programme introuvable : impossible de dupliquer',
};

interface Props {
  date: DateKey;
  /** `summary` : écran de fin de séance · `history` : relecture d'une séance passée. */
  mode: 'summary' | 'history';
}

/** Détail d'une séance : volume, records, exercices, notes, comparaison et duplication. */
export function SummaryScreen({ date, mode }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const data = useAppStore((s) => s.data);
  const update = useAppStore((s) => s.update);
  const summary = useMemo(() => sessionSummary(data, date), [data, date]);
  const delta = useMemo(() => tonnageDelta(data, date, summary), [data, date, summary]);
  const equivalent = getFunEquivalent(summary.tonnage);
  const isToday = date === todayKey();

  const close = (): void => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  const duplicate = (): void => {
    const result = duplicateSession(useAppStore.getState().data, date, todayKey());
    if (!result.ok) {
      showToast(DUPLICATE_ERRORS[result.error]);
      return;
    }
    update(() => result.data);
    showToast(`Séance dupliquée : ${result.count} exercice${result.count > 1 ? 's' : ''} prérempli${result.count > 1 ? 's' : ''}`);
    router.replace('/');
  };

  const startTime = summary.start
    ? new Date(summary.start).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    : null;
  const title = summary.program?.name ?? (summary.exercises.length ? 'Séance' : summary.run ? 'Course' : 'Séance');

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{ paddingHorizontal: 14, paddingTop: 18 + insets.top, paddingBottom: 40 + insets.bottom, alignItems: 'center' }}
      >
        <View style={{ width: '100%', maxWidth: MAX_WIDTH }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text display size={40} accessibilityRole="header">
                {title}
              </Text>
              <Text size={13} tone="dim" style={{ marginTop: 4, marginBottom: 16, textTransform: 'capitalize' }}>
                {fmtDateLong(date)}
                {startTime ? ` · ${startTime}` : ''}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Fermer"
              onPress={close}
              style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name="close" size={18} color="#FFFFFF" />
            </Pressable>
          </View>

          {summary.exercises.length ? (
            <>
              <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
                <StatCard value={String(summary.sets)} label="Séries" color={colors.cBlue} />
                <StatCard value={summary.tonnage ? fmtInt(summary.tonnage) : '0'} label="Kg soulevés" color={colors.cRed} />
              </View>
              <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
                <StatCard value={summary.minutes ? fmtDuration(summary.minutes) : '—'} label="Durée active" color={colors.cGreen} />
                <StatCard value={summary.rpe !== null ? String(summary.rpe) : '—'} label="RPE moyen" color={colors.cYellow} />
              </View>
              {equivalent ? (
                <Text size={13} tone="dim" align="center" style={{ marginBottom: 6 }}>
                  {`Soit ${equivalent.count.toLocaleString('fr-FR')} ${equivalent.name}`}
                </Text>
              ) : null}
              {delta ? (
                <Text size={13} align="center" color={delta.pct >= 0 ? colors.green : colors.red} weight={700} style={{ marginBottom: 6 }}>
                  {`${delta.pct > 0 ? '+' : ''}${delta.pct} % de tonnage vs la séance précédente`}
                </Text>
              ) : null}
            </>
          ) : null}

          {summary.prs.length ? (
            <>
              <SectionTitle>Records</SectionTitle>
              <Card accent={colors.cYellow}>
                {summary.prs.map((pr) => (
                  <View key={pr.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 }}>
                    <Icon name="star" size={16} color={colors.cYellow} filled />
                    <Text weight={700} size={14} style={{ flex: 1 }}>
                      {pr.name}
                    </Text>
                    <Text display size={18}>{`${fmtKg(pr.w)} kg × ${pr.r}`}</Text>
                  </View>
                ))}
              </Card>
            </>
          ) : null}

          {summary.run ? (
            <Card accent={colors.cBlue}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Icon name="pulse" size={20} color={colors.blue} />
                <View style={{ flex: 1 }}>
                  <Text weight={700} size={14}>
                    Course
                  </Text>
                  <Text size={13} tone="dim" style={{ marginTop: 2 }}>
                    {runLogLine(summary.run) || 'faite'}
                    {summary.run.rpe ? ` · RPE ${summary.run.rpe}` : ''}
                  </Text>
                </View>
              </View>
            </Card>
          ) : null}

          {summary.exercises.length ? <SectionTitle>Exercices</SectionTitle> : null}
          {summary.exercises.map((ex) => (
            <Card key={ex.id} compact>
              <Text display size={20}>
                {ex.name}
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                {ex.sets.map((s, i) => (
                  <View key={i} style={{ backgroundColor: colors.card2, borderRadius: 10, paddingVertical: 6, paddingHorizontal: 10 }}>
                    <Text size={12} weight={600}>
                      {fmtSetLine(s.weight, s.reps, Boolean(ex.def?.isTime))}
                    </Text>
                  </View>
                ))}
              </View>
              {ex.settings || ex.rpe ? (
                <Text size={12} tone="dim" style={{ marginTop: 10 }}>
                  {[ex.settings, ex.rpe ? `RPE ${ex.rpe}` : ''].filter(Boolean).join(' · ')}
                </Text>
              ) : null}
            </Card>
          ))}

          {summary.skipped.length ? (
            <Text size={12} tone="dim" style={{ marginBottom: 12 }}>
              {`Passés : ${summary.skipped.join(', ')}`}
            </Text>
          ) : null}

          {summary.exercises.length || summary.note ? (
            <Card>
              <Text size={10} weight={600} tone="muted" style={{ marginBottom: 6 }}>
                NOTES DE LA SÉANCE
              </Text>
              <CommitInput
                variant="note"
                multiline
                maxLength={600}
                value={summary.note}
                placeholder="Sensations, fatigue, idées pour la prochaine fois…"
                accessibilityLabel="Notes de la séance"
                commitDelayMs={700}
                onCommit={(text) => update((d) => saveSessionNote(d, date, text))}
                style={{ minHeight: 84, textAlignVertical: 'top' }}
              />
            </Card>
          ) : null}

          {summary.exercises.length === 0 && !summary.run ? (
            <Text size={14} tone="dim" align="center" style={{ marginVertical: 24 }}>
              Aucune série validée pour cette séance.
            </Text>
          ) : null}

          <View style={{ gap: 10, marginTop: 12 }}>
            {mode === 'history' && !isToday && summary.exercises.length ? (
              <Button label="Dupliquer cette séance" icon="refresh" variant="accent" fullWidth onPress={duplicate} />
            ) : null}
            {mode === 'summary' ? (
              <Button label="Voir l'historique" variant="soft" fullWidth onPress={() => router.replace('/history')} />
            ) : null}
            <Button label={mode === 'summary' ? 'Terminer' : 'Fermer'} variant="solid" fullWidth onPress={close} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
