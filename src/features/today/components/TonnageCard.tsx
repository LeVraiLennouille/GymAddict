import { View } from 'react-native';
import { fmtInt } from '@/domain/format/numbers';
import type { FunEquivalent } from '@/domain/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Card } from '@/ui/Card';
import { Icon } from '@/ui/Icon';
import { Text } from '@/ui/Text';

export function TonnageCard({ tonnage, equivalent }: { tonnage: number; equivalent: FunEquivalent | null }) {
  const { colors } = useTheme();
  if (tonnage <= 0) return null;
  return (
    <Card accent={colors.cRed}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <Icon name="dumbbell" size={38} color={colors.cYellow} />
        <View>
          <Text size={12} weight={600} tone="dim" uppercase>
            Tonnage d'aujourd'hui
          </Text>
          <Text display size={42} color={colors.red} style={{ lineHeight: 46, marginVertical: 4 }}>
            {`${fmtInt(tonnage)} kg`}
          </Text>
          {equivalent ? (
            <Text size={12} tone="dim">
              {`soit ${equivalent.count.toLocaleString('fr-FR')} ${equivalent.name}`}
            </Text>
          ) : null}
        </View>
      </View>
    </Card>
  );
}
