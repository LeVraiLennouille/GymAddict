import { View, type ViewProps } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from './Text';

export function Chip({ label, style, ...rest }: { label: string } & ViewProps) {
  const { colors } = useTheme();
  return (
    <View
      {...rest}
      style={[
        {
          alignSelf: 'flex-start',
          backgroundColor: colors.card,
          borderRadius: 99,
          paddingVertical: 6,
          paddingHorizontal: 13,
          marginTop: 4,
          marginBottom: 8,
        },
        style,
      ]}
    >
      <Text weight={600} size={12} color="#FFFFFF" style={{ textTransform: 'capitalize' }}>
        {label}
      </Text>
    </View>
  );
}
