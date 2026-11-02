import { View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from './Text';

/** Grille de chiffres clés 2 × 2 (ancien `.sum-grid`). */
export function SummaryGrid({ cells }: { cells: readonly { value: string; label: string }[] }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {cells.map((cell) => (
        <View
          key={cell.label}
          accessible
          accessibilityLabel={`${cell.label} : ${cell.value}`}
          style={{ width: '48.5%', backgroundColor: colors.card2, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 14 }}
        >
          <Text display size={26} color="#FFFFFF" style={{ lineHeight: 28 }}>
            {cell.value}
          </Text>
          <Text size={11} weight={600} tone="dim" uppercase style={{ marginTop: 4 }}>
            {cell.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
