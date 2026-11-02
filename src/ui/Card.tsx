import { View, type ViewProps } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/tokens';
import { SurfaceProvider } from './Surface';

interface CardProps extends ViewProps {
  /** Couleur du liseré supérieur (programme en cours, record…). */
  accent?: string;
  accentWidth?: number;
  compact?: boolean;
}

export function Card({ accent, accentWidth = 6, compact = false, style, children, ...rest }: CardProps) {
  const { colors } = useTheme();
  return (
    <SurfaceProvider value="card">
      <View
        {...rest}
        style={[
          {
            backgroundColor: colors.card,
            borderRadius: radius.card,
            paddingVertical: compact ? 14 : 20,
            paddingHorizontal: 18,
            marginBottom: 12,
            borderTopWidth: accent ? accentWidth : 0,
            borderTopColor: accent ?? 'transparent',
          },
          style,
        ]}
      >
        {children}
      </View>
    </SurfaceProvider>
  );
}
