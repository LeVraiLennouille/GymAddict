import { View } from 'react-native';
import type { TodayView } from '@/domain/rules/todayView';
import { useTheme } from '@/theme/ThemeProvider';
import { PROGRAM_HEX } from '@/theme/tokens';
import { Badge } from '@/ui/Badge';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { Icon } from '@/ui/Icon';
import { PlateBar } from '@/ui/PlateBar';
import { useUnit } from '@/features/shared/useUnit';
import { Text } from '@/ui/Text';
import { readinessTone } from '@/domain/rules/readiness';

/** Disques qui se chargent au fil de la séance : les plus lourds d'abord. */
const HERO_PLATES = { kg: [25, 20, 15, 10, 5, 2.5, 1.25], lb: [45, 35, 25, 10, 5, 2.5] } as const;

export function HeroCard({ view, onChangeProgram }: { view: TodayView; onChangeProgram: () => void }) {
  const { colors } = useTheme();
  const u = useUnit();
  const color = PROGRAM_HEX[view.program.color];
  const { pct, done, total } = view.progress;

  const readiness = view.readiness;
  const tone = readiness ? readinessTone(readiness.score) : null;
  const readinessColor = tone === 'good' ? colors.green : tone === 'mid' ? colors.yellow : colors.red;

  return (
    <Card accent={color}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 4 }}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Text display size={27} accessibilityRole="header">
              {view.program.fullName}
            </Text>
            {view.isOverride ? <Badge kind="override" label="Modifié" /> : <Badge kind="suggestion" label="Suggéré" />}
          </View>
          <Text size={13} tone="dim" style={{ marginTop: 6 }}>
            Salle de sport
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 6 }}>
          {readiness ? (
            <View
              accessible
              accessibilityLabel={`Forme du jour : ${readiness.score} sur 5`}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1.5, borderColor: readinessColor, borderRadius: 99, paddingVertical: 5, paddingHorizontal: 11 }}
            >
              <Icon name="star" size={12} color={readinessColor} filled />
              <Text size={12} weight={700} color={readinessColor}>
                {`${readiness.score}/5`}
              </Text>
            </View>
          ) : null}
          <Button small label="Changer" onPress={onChangeProgram} />
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 2, marginTop: 14 }}>
        <Text display size={76} color="#FFFFFF" style={{ lineHeight: 72 }} accessibilityLabel={`${pct} pour cent`}>
          {String(pct)}
        </Text>
        <Text display size={30} tone="dim">
          %
        </Text>
        <Text size={12} tone="dim" style={{ marginLeft: 'auto' }}>
          {`${done}/${total} séries`}
        </Text>
      </View>
      <View style={{ marginTop: 10 }}>
        <PlateBar
          compact
          unit={u.unit}
          plates={HERO_PLATES[u.unit].map((size, i, all) => ({ size, filled: pct >= 100 || i < Math.floor((pct / 100) * all.length) }))}
          label={`Progression de la séance : ${pct} pour cent`}
        />
      </View>
    </Card>
  );
}

