import { View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/tokens';
import { SurfaceProvider } from './Surface';
import { Text } from './Text';

export function StatCard({ value, label, color }: { value: string; label: string; color: string }) {
  const { colors } = useTheme();
  return (
    <SurfaceProvider value="card">
      <View
        accessible
        accessibilityLabel={`${label} : ${value}`}
        style={{ flex: 1, backgroundColor: colors.card, borderRadius: radius.card, borderTopWidth: 7, borderTopColor: color, paddingTop: 16, paddingHorizontal: 16, paddingBottom: 18, minHeight: 112 }}
      >
        <Text display size={52} color="#FFFFFF" style={{ lineHeight: 52, marginBottom: 8 }}>
          {value}
        </Text>
        <Text size={12} weight={600} tone="dim" uppercase>
          {label}
        </Text>
      </View>
    </SurfaceProvider>
  );
}
