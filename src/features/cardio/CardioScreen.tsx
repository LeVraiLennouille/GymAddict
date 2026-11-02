import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { DAY_LABELS } from '@/domain/defaults/constants';
import { fmtDateShort, isDateKey } from '@/domain/format/dates';
import { fmtKm, fmtPace } from '@/domain/format/numbers';
import type { RunCardView } from '@/domain/rules/runs';
import { useTheme } from '@/theme/ThemeProvider';
import { MAX_WIDTH } from '@/theme/tokens';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { Chip } from '@/ui/Chip';
import { CommitInput } from '@/ui/CommitInput';
import { Icon } from '@/ui/Icon';
import { SectionTitle } from '@/ui/SectionTitle';
import { Text } from '@/ui/Text';
import { useCardio, type CardioModel } from './hooks/useCardio';

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={{ flex: 1, gap: 3 }}>
      <Text size={10} weight={600} tone="muted" align="center">
        {label}
      </Text>
      {children}
    </View>
  );
}

function RunCard({
  card,
  actions,
  onLayout,
}: {
  card: RunCardView;
  actions: CardioModel['actions'];
  onLayout: (y: number) => void;
}) {
  const { colors } = useTheme();
  const { run, log, date, goal, paceSec } = card;
  return (
    <Card accent={colors.cBlue} onLayout={(e) => onLayout(e.nativeEvent.layout.y)} style={{ marginBottom: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
        <Text display size={23} style={{ flex: 1 }}>
          {`${DAY_LABELS[card.day]} — ${run.name}`}
        </Text>
        <Text size={11} tone="muted">
          {fmtDateShort(date)}
        </Text>
      </View>
      {run.desc ? (
        <Text size={14} tone="dim" style={{ marginBottom: 6, lineHeight: 20 }}>
          {run.desc}
        </Text>
      ) : null}
      {run.detail ? (
        <Text size={14} tone="dim" italic style={{ lineHeight: 20 }}>
          {run.detail}
        </Text>
      ) : null}

      <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
        <Field label="DURÉE (min)">
          <CommitInput
            integer
            value={log.duration}
            placeholder={run.targetDuration ? String(run.targetDuration) : '—'}
            accessibilityLabel={`Durée de ${run.name}, en minutes`}
            commitDelayMs={400}
            onCommit={(t) => actions.setText(date, 'duration', t)}
          />
        </Field>
        <Field label="DIST (km)">
          <CommitInput
            numeric
            value={log.distance}
            placeholder={run.targetDistance ? fmtKm(run.targetDistance) : '—'}
            accessibilityLabel={`Distance de ${run.name}, en kilomètres`}
            commitDelayMs={400}
            onCommit={(t) => actions.setText(date, 'distance', t)}
          />
        </Field>
        <Field label="RPE (1-10)">
          <CommitInput
            integer
            maxLength={2}
            value={log.rpe}
            placeholder="7"
            accessibilityLabel={`RPE de ${run.name}`}
            commitDelayMs={400}
            onCommit={(t) => actions.setText(date, 'rpe', t)}
          />
        </Field>
      </View>

      {goal ? (
        <Text size={12} tone="dim" style={{ marginTop: 12, lineHeight: 18 }}>
          {'Objectif : '}
          <Text size={12} weight={700} color="#FFFFFF">
            {goal.targets}
          </Text>
          {goal.progress.length ? ` — ${goal.progress.join(' · ')}` : ''}
        </Text>
      ) : null}

      <Text size={12} tone="dim" style={{ marginTop: 8 }}>
        {paceSec > 0 ? (
          <>
            {'Allure moyenne : '}
            <Text size={12} weight={700} color="#FFFFFF">
              {fmtPace(paceSec)}
            </Text>
            {' /km'}
          </>
        ) : (
          'Allure moyenne : renseigne la durée et la distance'
        )}
      </Text>

      <Button
        label={log.done ? 'Séance terminée' : 'Marquer comme faite'}
        variant={log.done ? 'green' : 'solid'}
        fullWidth
        style={{ marginTop: 12 }}
        onPress={() => actions.toggleDone(date, !log.done)}
      />
    </Card>
  );
}

/** Onglet « Cardio » : zones de fréquence cardiaque et sorties running de la semaine. */
export function CardioScreen() {
  const { colors } = useTheme();
  const model = useCardio();
  const router = useRouter();
  const { run: runParam } = useLocalSearchParams<{ run: string }>();

  const scrollRef = useRef<ScrollView>(null);
  const layout = useRef({ card: 0, section: 0, runs: {} as Record<string, number> });
  const [expanded, setExpanded] = useState(false);
  const [ageDraft, setAgeDraft] = useState<string | null>(null);

  // Arrivée depuis la semaine : on ouvre la section et on défile jusqu'à la sortie demandée.
  useEffect(() => {
    if (!runParam || !isDateKey(runParam)) return;
    setExpanded(true);
    const id = setTimeout(() => {
      const y = layout.current.runs[runParam];
      if (y !== undefined) {
        scrollRef.current?.scrollTo({ y: Math.max(0, layout.current.card + layout.current.section + y - 100), animated: true });
      }
    }, 250);
    return () => clearTimeout(id);
  }, [runParam]);

  return (
    <ScrollView
      ref={scrollRef}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
      contentContainerStyle={{ paddingHorizontal: 14, paddingTop: 6, paddingBottom: 160, alignItems: 'center' }}
    >
      <View style={{ width: '100%', maxWidth: MAX_WIDTH }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
          <Chip label="Cardio & running" style={{ marginBottom: 0 }} />
          <Button small label="Planifier" icon="edit" onPress={() => router.push('/editor')} />
        </View>

        <Card>
          <SectionTitle flush>Zones cardio</SectionTitle>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
            <View>
              <Text size={12} tone="dim" style={{ marginBottom: 6 }}>
                Ton âge
              </Text>
              <CommitInput
                variant="big"
                integer
                maxLength={2}
                value={String(model.age)}
                onCommit={setAgeDraft}
                onLiveChange={setAgeDraft}
                accessibilityLabel="Ton âge"
              />
            </View>
            <Button label="Calculer" variant="solid" onPress={() => {
                model.actions.saveAge(parseInt(ageDraft ?? String(model.age), 10) || 25);
                setAgeDraft(null);
              }} />
            <View>
              <Text size={11} tone="dim">
                FC max :
              </Text>
              <Text size={11} tone="dim">
                <Text display size={20} color="#FFFFFF">
                  {String(model.fcMax)}
                </Text>
                {' BPM'}
              </Text>
            </View>
          </View>

          {model.zones.map((z, i) => (
            <View
              key={z.name}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11, borderTopWidth: i === 0 ? 0 : 1, borderTopColor: colors.border }}
            >
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: z.color }} />
              <View style={{ flex: 1 }}>
                <Text display size={20} color={z.color}>
                  {z.name}
                </Text>
                <Text size={10} tone="muted">
                  {z.label}
                </Text>
              </View>
              <Text display size={22} color={z.color}>
                {`${z.min}–${z.max}`}
              </Text>
            </View>
          ))}
        </Card>

        <Card onLayout={(e) => (layout.current.card = e.nativeEvent.layout.y)}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded }}
            accessibilityLabel="Séances running"
            onPress={() => setExpanded((v) => !v)}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 44 }}
          >
            <SectionTitle flush>Séances running</SectionTitle>
            <View style={{ transform: [{ rotate: expanded ? '90deg' : '0deg' }], marginBottom: 12 }}>
              <Icon name="chev" size={20} color={colors.onCard.dim} />
            </View>
          </Pressable>

          {expanded ? (
            <View onLayout={(e) => (layout.current.section = e.nativeEvent.layout.y)} style={{ marginTop: 4 }}>
              {model.runs.length === 0 ? (
                <View style={{ alignItems: 'center', gap: 12, paddingVertical: 20 }}>
                  <Text size={14} tone="muted" align="center">
                    Aucune sortie planifiée.
                  </Text>
                  <Button label="Planifier mes sorties" variant="solid" onPress={() => router.push('/editor')} />
                </View>
              ) : (
                model.runs.map((card) => (
                  <RunCard
                    key={card.date}
                    card={card}
                    actions={model.actions}
                    onLayout={(y) => (layout.current.runs[card.date] = y)}
                  />
                ))
              )}
            </View>
          ) : null}
        </Card>
      </View>
    </ScrollView>
  );
}
