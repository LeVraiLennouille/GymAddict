import { View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

export function ProgressBar({ pct, color }: { pct: number; color: string }) {
  const { colors } = useTheme();
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: clamped }}
      style={{ backgroundColor: colors.card2, borderRadius: 99, height: 8, overflow: 'hidden', marginTop: 10, marginBottom: 6 }}
    >
      <View style={{ width: `${clamped}%`, height: '100%', backgroundColor: color, borderRadius: 99 }} />
    </View>
  );
}
