import { Pressable, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

interface SwitchProps {
  value: boolean;
  onChange: (value: boolean) => void;
  label: string;
}

/** Interrupteur (ancien `.sw`). */
export function Switch({ value, onChange, label }: SwitchProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={label}
      onPress={() => onChange(!value)}
      hitSlop={8}
      style={{ width: 52, height: 30, borderRadius: 99, backgroundColor: value ? colors.cGreen : colors.card2, justifyContent: 'center' }}
    >
      <View
        style={{
          position: 'absolute',
          top: 3,
          left: value ? 25 : 3,
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: '#FFFFFF',
        }}
      />
    </Pressable>
  );
}
