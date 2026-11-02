import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Icon, type IconName } from './Icon';
import { Text } from './Text';

type Variant = 'soft' | 'accent' | 'solid' | 'green' | 'ghost' | 'danger';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  icon?: IconName;
  /** Couleur du texte pour la variante `soft` (ex. jaune de l'échauffement). */
  color?: string;
  small?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export function Button({
  label,
  onPress,
  variant = 'soft',
  icon,
  color,
  small = false,
  fullWidth = false,
  disabled = false,
  style,
  accessibilityLabel,
}: ButtonProps) {
  const { colors } = useTheme();
  const look: Record<Variant, { bg: string; fg: string }> = {
    soft: { bg: colors.card2, fg: color ?? '#FFFFFF' },
    accent: { bg: colors.cBlue, fg: '#FFFFFF' },
    solid: { bg: '#FFFFFF', fg: '#14161B' },
    green: { bg: colors.cGreen, fg: '#FFFFFF' },
    ghost: { bg: 'transparent', fg: colors.onCard.dim },
    danger: { bg: 'transparent', fg: colors.red },
  };
  const { bg, fg } = look[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: bg,
          borderRadius: 99,
          paddingVertical: small ? 8 : 13,
          paddingHorizontal: small ? 14 : 24,
          minHeight: small ? 34 : 48,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          borderWidth: variant === 'danger' ? 1.5 : 0,
          borderColor: colors.red,
          opacity: disabled ? 0.45 : pressed ? 0.7 : 1,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {icon ? <Icon name={icon} size={small ? 14 : 18} color={fg} /> : null}
        <Text weight={700} size={small ? 12 : 15} color={fg}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
