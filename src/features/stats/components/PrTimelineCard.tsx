import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/data/store/appStore';
import { fmtDateShort } from '@/domain/format/dates';
import { buildPrTimeline } from '@/domain/rules/statsView';
import { useUnit } from '@/features/shared/useUnit';
import { useTheme } from '@/theme/ThemeProvider';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { SectionTitle } from '@/ui/SectionTitle';
import { Text } from '@/ui/Text';

const COLLAPSED_COUNT = 10;

/** Frise des records battus, du plus récent au plus ancien : touche une ligne pour relire la séance. */
export function PrTimelineCard() {
  const { colors } = useTheme();
  const router = useRouter();
  const u = useUnit();
  const data = useAppStore((s) => s.data);
  const [expanded, setExpanded] = useState(false);
  const months = useMemo(() => buildPrTimeline(data), [data]);
  const total = months.reduce((n, m) => n + m.events.length, 0);

  // On n'affiche d'abord que les plus récents.
  let remaining = expanded ? Infinity : COLLAPSED_COUNT;
  const visible = months
    .map((month) => {
      const events = month.events.slice(0, Math.max(0, remaining));
      remaining -= events.length;
      return { ...month, events };
    })
    .filter((month) => month.events.length > 0);

  return (
    <Card>
      <SectionTitle flush>Records battus</SectionTitle>
      {total === 0 ? (
        <Text size={13} tone="muted" align="center" style={{ paddingVertical: 16, lineHeight: 20 }}>
          {'Pas encore de record battu.\nChaque charge qui dépasse ton record apparaît ici.'}
        </Text>
      ) : (
        <View>
          {visible.map((month) => (
            <View key={month.key} style={{ marginBottom: 6 }}>
              <Text size={11} weight={700} tone="muted" uppercase style={{ marginBottom: 8 }}>
                {month.label}
              </Text>
              {month.events.map((event, i) => (
                <Pressable
                  key={`${event.date}-${event.id}`}
                  accessibilityRole="button"
                  accessibilityLabel={`${event.name}, ${u.withUnit(event.weight)} pour ${event.reps} répétitions, le ${fmtDateShort(event.date)}`}
                  onPress={() => router.push(`/history/${event.date}`)}
                  style={({ pressed }) => ({ flexDirection: 'row', gap: 12, opacity: pressed ? 0.75 : 1 })}
                >
                  <View style={{ alignItems: 'center', width: 14 }}>
                    <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: colors.cYellow, marginTop: 4 }} />
                    <View style={{ flex: 1, width: 2, backgroundColor: colors.border, marginTop: 2, opacity: i === month.events.length - 1 ? 0 : 1 }} />
                  </View>
                  <View style={{ flex: 1, paddingBottom: 14 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                      <Text weight={700} size={14} numberOfLines={1} style={{ flex: 1 }}>
                        {event.name}
                      </Text>
                      <Text size={11} tone="muted">
                        {fmtDateShort(event.date)}
                      </Text>
                    </View>
                    <Text size={12} tone="dim" style={{ marginTop: 2 }}>
                      <Text size={13} weight={700} color={colors.cYellow}>
                        {`${u.withUnit(event.weight)} × ${event.reps}`}
                      </Text>
                      {event.reps > 1 ? `  ·  1RM ~${u.withUnit(event.oneRm)}` : ''}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          ))}
          {total > COLLAPSED_COUNT ? (
            <Button small variant="soft" label={expanded ? 'Réduire' : `Afficher les ${total} records`} onPress={() => setExpanded((v) => !v)} />
          ) : null}
        </View>
      )}
    </Card>
  );
}
