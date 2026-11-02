import { useEffect, useRef } from 'react';
import { Animated, View, useWindowDimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { alpha } from '@/theme/color';
import { useTheme } from '@/theme/ThemeProvider';
import { MAX_WIDTH } from '@/theme/tokens';
import { Icon } from './Icon';
import { Logo } from './Logo';
import { Text } from './Text';
import { USE_NATIVE_DRIVER } from './animation';

interface AppHeaderProps {
  streak: number;
  regularity: number;
  /** Change à chaque enregistrement réussi : déclenche l'indicateur « Enregistré ». */
  savedAt: number;
}

export function AppHeader({ streak, regularity, savedAt }: AppHeaderProps) {
  const { colors, scheme } = useTheme();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const saved = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!savedAt) return;
    Animated.sequence([
      Animated.timing(saved, { toValue: 1, duration: 200, useNativeDriver: USE_NATIVE_DRIVER }),
      Animated.delay(1500),
      Animated.timing(saved, { toValue: 0, duration: 400, useNativeDriver: USE_NATIVE_DRIVER }),
    ]).start();
  }, [savedAt, saved]);

  return (
    <BlurView
      intensity={40}
      tint={scheme}
      style={{ backgroundColor: alpha(colors.bg, 0.86), paddingTop: 12 + insets.top, paddingBottom: 12, paddingHorizontal: 18 }}
    >
      <View style={{ width: '100%', maxWidth: MAX_WIDTH, alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, minWidth: 0, flexShrink: 1 }}>
          <Logo size={40} />
          <View>
            <Text display size={29} tone="text" style={{ lineHeight: 30 }}>
              GymAddict
            </Text>
            <Text size={11} weight={500} tone="muted" style={{ marginTop: 2 }}>
              Hybrid tracker
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Animated.View style={{ opacity: saved, flexDirection: 'row', alignItems: 'center', gap: 4 }} accessibilityLiveRegion="polite">
            <Icon name="check" size={12} color={colors.page.muted} />
            {width >= 400 ? (
              <Text size={11} weight={500} tone="muted">
                Enregistré
              </Text>
            ) : null}
          </Animated.View>
          <Pill accessibilityLabel={`${streak} jours consécutifs`} icon="flame" color={colors.cYellow} label={`${streak} j`} />
          <Pill accessibilityLabel={`Régularité ${regularity} pour cent sur 7 jours`} icon="circleCheck" color="#FFFFFF" label={`${regularity}%`} />
        </View>
      </View>
    </BlurView>
  );
}

function Pill({
  icon,
  color,
  label,
  accessibilityLabel,
}: {
  icon: 'flame' | 'circleCheck';
  color: string;
  label: string;
  accessibilityLabel: string;
}) {
  const { colors } = useTheme();
  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      style={{ backgroundColor: colors.card, borderRadius: 99, paddingVertical: 6, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 5 }}
    >
      <Icon name={icon} size={15} color={color} />
      <Text display size={15} color={color}>
        {label}
      </Text>
    </View>
  );
}
