import { View } from 'react-native';
import { fmtWeekdayDayMonth } from '@/domain/format/dates';
import { fmtInt } from '@/domain/format/numbers';
import type { RestDayInfo } from '@/domain/rules/restDay';
import { useTheme } from '@/theme/ThemeProvider';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { StatCard } from '@/ui/StatCard';
import { Text } from '@/ui/Text';

interface Props {
  info: RestDayInfo;
  streak: number;
  regularity: number;
  onChooseProgram: () => void;
}

function Row({ label, title, sub }: { label: string; title: string; sub: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
      <Text size={12} weight={600} tone="dim" uppercase>
        {label}
      </Text>
      <View style={{ alignItems: 'flex-end', flexShrink: 1 }}>
        <Text display size={20} align="right">
          {title}
        </Text>
        <Text size={12} tone="dim" style={{ marginTop: 2, textTransform: 'capitalize' }}>
          {sub}
        </Text>
      </View>
    </View>
  );
}

export function RestDayView({ info, streak, regularity, onChooseProgram }: Props) {
  const { colors } = useTheme();
  return (
    <View>
      <View style={{ alignItems: 'center', paddingTop: 28, paddingBottom: 18, paddingHorizontal: 20 }}>
        <Text display size={58} tone="text" style={{ lineHeight: 62 }} accessibilityRole="header">
          REPOS
        </Text>
        <Text size={14} tone="dim" align="center" style={{ marginTop: 10, lineHeight: 21 }}>
          La récupération, c'est aussi de l'entraînement.
        </Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
        <StatCard value={String(streak)} label="Jours de streak" color={colors.cYellow} />
        <StatCard value={`${regularity}%`} label="Régularité 7j" color={colors.cGreen} />
      </View>

      {info.next || info.last ? (
        <Card>
          {info.next ? <Row label="Prochaine séance" title={info.next.name} sub={fmtWeekdayDayMonth(info.next.date)} /> : null}
          {info.last ? (
            <Row
              label="Dernière séance"
              title={info.last.name}
              sub={`${fmtWeekdayDayMonth(info.last.date)}${info.last.tonnage ? ` · ${fmtInt(info.last.tonnage)} kg` : ''}`}
            />
          ) : null}
        </Card>
      ) : null}

      <View style={{ alignItems: 'center', marginTop: 6 }}>
        <Button label="Choisir un programme" onPress={onChooseProgram} />
      </View>
    </View>
  );
}
