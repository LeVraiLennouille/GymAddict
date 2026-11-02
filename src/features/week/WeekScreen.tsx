import { useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/data/store/appStore';
import { useTodayKey } from '@/data/store/useTodayKey';
import { DAY_LABELS } from '@/domain/defaults/constants';
import { fmtDuration, fmtKm, fmtPace } from '@/domain/format/numbers';
import { buildWeekView, type WeekDayView } from '@/domain/rules/weekView';
import type { WeekCardio } from '@/domain/rules/runs';
import { useTheme } from '@/theme/ThemeProvider';
import { MAX_WIDTH, PROGRAM_HEX } from '@/theme/tokens';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Chip } from '@/ui/Chip';
import { Icon } from '@/ui/Icon';
import { ProgressBar } from '@/ui/ProgressBar';
import { SectionTitle } from '@/ui/SectionTitle';
import { SummaryGrid } from '@/ui/SummaryGrid';
import { Text } from '@/ui/Text';

function WeekCardioCard({ cardio }: { cardio: WeekCardio }) {
  const goalPct = cardio.weeklyKm > 0 ? Math.min(100, Math.round((cardio.distanceKm / cardio.weeklyKm) * 100)) : 0;
  return (
    <Card>
      <SectionTitle flush>Cardio de la semaine</SectionTitle>
      <SummaryGrid
        cells={[
          { label: 'Sorties', value: `${cardio.done}/${cardio.planned}` },
          { label: 'Distance', value: cardio.distanceKm > 0 ? `${fmtKm(cardio.distanceKm)} km` : '—' },
          { label: 'Durée', value: cardio.durationMin > 0 ? fmtDuration(cardio.durationMin) : '—' },
          { label: 'Allure /km', value: cardio.paceSec > 0 ? fmtPace(cardio.paceSec) : '—' },
        ]}
      />
      {cardio.weeklyKm > 0 ? (
        <View style={{ marginTop: 14 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text size={12} tone="dim">
              Objectif distance
            </Text>
            <Text size={12} weight={700}>{`${fmtKm(cardio.distanceKm)} / ${fmtKm(cardio.weeklyKm)} km`}</Text>
          </View>
          <ProgressBar pct={goalPct} color="#12A150" />
        </View>
      ) : null}
    </Card>
  );
}

function DayRow({ item, onOpenDay, onOpenRun }: { item: WeekDayView; onOpenDay: () => void; onOpenRun: () => void }) {
  const { colors } = useTheme();
  const color = PROGRAM_HEX[item.program.color];
  const { pct, done, total } = item.progress;
  const openable = !item.isRest;

  return (
    <View style={{ marginBottom: 12, paddingTop: item.isToday ? 6 : 0 }}>
      <View style={{ borderWidth: 2, borderColor: item.isToday ? '#FFFFFF' : 'transparent', borderRadius: 28, padding: item.isToday ? 2 : 0 }}>
        <Pressable
          disabled={!openable}
          onPress={onOpenDay}
          accessibilityRole={openable ? 'button' : undefined}
          accessibilityLabel={`${DAY_LABELS[item.day]}, ${item.program.fullName}${item.isToday ? ", aujourd'hui" : ''}`}
          style={({ pressed }) => ({
            backgroundColor: colors.card,
            borderTopWidth: 6,
            borderTopColor: color,
            borderRadius: 24,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            transform: [{ scale: pressed ? 0.985 : 1 }],
          })}
        >
          <View style={{ width: 50, height: 50, borderRadius: 14, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
            <Text display size={20} color="#FFFFFF">
              {DAY_LABELS[item.day].slice(0, 3)}
            </Text>
          </View>

          <View style={{ flex: 1, minWidth: 0 }}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
              <Text display size={23} color="#FFFFFF">
                {DAY_LABELS[item.day]}
              </Text>
              {item.isOverride ? (
                <Text size={10} color={colors.orange}>
                  modifié
                </Text>
              ) : null}
            </View>
            <Text size={12} color="#A6ACB8" style={{ marginTop: 3 }}>
              {item.program.fullName}
            </Text>
            <Text size={11} color={item.isRest ? '#7C8391' : '#A6ACB8'} style={{ marginTop: 4 }}>
              {item.isRest ? 'Repos' : 'Salle'}
            </Text>
            {item.run ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Sortie ${item.run.name}`}
                onPress={onOpenRun}
                hitSlop={6}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}
              >
                <Icon name={item.run.done ? 'check' : 'pulse'} size={14} color={item.run.done ? colors.green : colors.blue} />
                <Text size={12} color={item.run.done ? colors.green : '#A6ACB8'} style={{ flexShrink: 1 }}>
                  <Text size={12} weight={700} color="#FFFFFF">
                    {item.run.name}
                  </Text>
                  {` · ${item.run.detail}`}
                </Text>
              </Pressable>
            ) : null}
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ alignItems: 'flex-end' }}>
              {item.isRest ? (
                <Text display size={25} color="#7C8391">
                  —
                </Text>
              ) : (
                <>
                  <Text display size={25} color={pct === 0 ? '#7C8391' : '#FFFFFF'}>
                    {`${pct}%`}
                  </Text>
                  {total > 0 ? (
                    <>
                      <Text size={10} color="#7C8391">{`${done}/${total}`}</Text>
                      <View style={{ width: 60, height: 4, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 2, marginTop: 4 }}>
                        <View style={{ width: `${pct}%`, height: '100%', backgroundColor: colors.cGreen, borderRadius: 2 }} />
                      </View>
                    </>
                  ) : null}
                </>
              )}
            </View>
            {openable ? <Icon name="chev" size={20} color="#7C8391" /> : null}
          </View>
        </Pressable>
      </View>
      {item.isToday ? (
        <View style={{ position: 'absolute', top: -8, left: 18, backgroundColor: '#FFFFFF', borderRadius: 99, paddingVertical: 3, paddingHorizontal: 10 }}>
          <Text size={10} weight={800} color="#14161B">
            AUJOURD'HUI
          </Text>
        </View>
      ) : null}
    </View>
  );
}

/** Onglet « Programme » : la semaine en un coup d'œil. */
export function WeekScreen() {
  const router = useRouter();
  const data = useAppStore((s) => s.data);
  const today = useTodayKey();
  const view = useMemo(() => buildWeekView(data), [data, today]);

  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 14, paddingTop: 6, paddingBottom: 140, alignItems: 'center' }}>
      <View style={{ width: '100%', maxWidth: MAX_WIDTH }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
          <Chip label="Programme de la semaine" style={{ marginBottom: 0 }} />
          <Button small label="Modifier" icon="edit" onPress={() => router.push('/editor')} />
        </View>
        {view.cardio ? <WeekCardioCard cardio={view.cardio} /> : null}
        {view.days.map((item) => (
          <DayRow
            key={item.day}
            item={item}
            onOpenDay={() => router.push(`/day/${item.date}`)}
            onOpenRun={() => router.push({ pathname: '/cardio', params: { run: item.date } })}
          />
        ))}
      </View>
    </ScrollView>
  );
}
