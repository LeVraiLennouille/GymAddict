import { Pressable, View } from 'react-native';
import type { HeatCell, HeatWeek } from '@/domain/rules/statsView';
import { alpha } from '@/theme/color';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/ui/Text';

const DAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'] as const;
const CELL = 15;
const GAP = 3;

function useLevelColor() {
  const { colors } = useTheme();
  return (level: HeatCell['level']): string =>
    level === 0 ? colors.card2 : alpha(colors.green, [0, 0.3, 0.5, 0.75, 1][level] ?? 1);
}

function Cell({ cell, onOpen }: { cell: HeatCell; onOpen: (date: HeatCell['date']) => void }) {
  const { colors } = useTheme();
  const levelColor = useLevelColor();
  const style = {
    width: CELL,
    height: CELL,
    borderRadius: 4,
    backgroundColor: levelColor(cell.level),
    opacity: cell.future ? 0.35 : 1,
    borderWidth: cell.today ? 1.5 : 0,
    borderColor: colors.onCard.text,
  } as const;
  if (!cell.clickable) return <View style={style} />;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Séance du ${cell.date}`}
      hitSlop={2}
      onPress={() => onOpen(cell.date)}
      style={style}
    />
  );
}

/** Calendrier d'activité sur 16 semaines : l'intensité suit la charge soulevée ce jour-là. */
export function Heatmap({ weeks, onOpen }: { weeks: HeatWeek[]; onOpen: (date: HeatCell['date']) => void }) {
  const levelColor = useLevelColor();
  return (
    <View>
      <View style={{ flexDirection: 'row', gap: GAP }}>
        <View style={{ gap: GAP, paddingTop: 14 }}>
          {DAY_LABELS.map((l, i) => (
            <View key={i} style={{ height: CELL, justifyContent: 'center' }}>
              <Text size={9} tone="muted">
                {l}
              </Text>
            </View>
          ))}
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          {weeks.map((week, w) => (
            <View key={w} style={{ gap: GAP }}>
              <View style={{ height: 11, width: CELL }}>
                <Text size={9} tone="muted" numberOfLines={1} style={{ width: 40 }}>
                  {week.monthLabel}
                </Text>
              </View>
              {week.cells.map((cell) => (
                <Cell key={cell.date} cell={cell} onOpen={onOpen} />
              ))}
            </View>
          ))}
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 10 }}>
        <Text size={10} tone="muted">
          Moins
        </Text>
        {([0, 1, 2, 3, 4] as const).map((l) => (
          <View key={l} style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: levelColor(l) }} />
        ))}
        <Text size={10} tone="muted">
          Plus
        </Text>
      </View>
    </View>
  );
}
