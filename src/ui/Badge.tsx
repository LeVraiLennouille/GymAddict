import { View } from 'react-native';
import { alpha } from '@/theme/color';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from './Text';

export type BadgeKind = 'compound' | 'isolation' | 'neutral' | 'superset' | 'override' | 'suggestion';

export function Badge({ label, kind }: { label: string; kind: BadgeKind }) {
  const { colors } = useTheme();
  const palette: Record<BadgeKind, { bg: string; fg: string }> = {
    compound: { bg: alpha(colors.purple, 0.16), fg: colors.purple },
    isolation: { bg: colors.blueDim, fg: colors.blue },
    neutral: { bg: colors.card2, fg: colors.onCard.muted },
    superset: { bg: colors.orangeDim, fg: colors.orange },
    override: { bg: colors.orangeDim, fg: colors.orange },
    suggestion: { bg: alpha(colors.green, 0.14), fg: colors.green },
  };
  const { bg, fg } = palette[kind];
  return (
    <View style={{ backgroundColor: bg, borderRadius: 99, paddingVertical: 3, paddingHorizontal: 9 }}>
      <Text weight={700} size={10} color={fg}>
        {label}
      </Text>
    </View>
  );
}
