import { Pressable } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from './Text';

interface ChoiceChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
}

/** Pastille à choix (ancien `.ed-chip`). */
export function ChoiceChip({ label, selected, onPress, disabled = false }: ChoiceChipProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 36,
        justifyContent: 'center',
        paddingHorizontal: 14,
        borderRadius: 99,
        backgroundColor: selected ? '#FFFFFF' : colors.card2,
        opacity: disabled ? 0.4 : pressed ? 0.75 : 1,
      })}
    >
      <Text size={12} weight={700} color={selected ? '#14161B' : colors.onCard.dim}>
        {label}
      </Text>
    </Pressable>
  );
}
