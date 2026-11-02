import { useEffect, useRef } from 'react';
import { Animated, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fmtKg } from '@/domain/format/numbers';
import { useTheme } from '@/theme/ThemeProvider';
import { Icon } from './Icon';
import { SurfaceProvider } from './Surface';
import { Text } from './Text';
import { useFeedbackStore } from './feedbackStore';

const VISIBLE_MS = 5000;

export function PrPopupHost() {
  const info = useFeedbackStore((s) => s.prPopup);
  const hidePr = useFeedbackStore((s) => s.hidePr);
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const slide = useRef(new Animated.Value(-260)).current;

  useEffect(() => {
    if (!info) return;
    slide.setValue(-260);
    Animated.spring(slide, { toValue: 0, useNativeDriver: true, bounciness: 8 }).start();
    const id = setTimeout(() => {
      Animated.timing(slide, { toValue: -260, duration: 300, useNativeDriver: true }).start(({ finished }) => {
        if (finished) hidePr();
      });
    }, VISIBLE_MS);
    return () => clearTimeout(id);
  }, [info, slide, hidePr]);

  if (!info) return null;
  return (
    <View pointerEvents="box-none" style={{ position: 'absolute', top: 70 + insets.top, left: 16, right: 16, alignItems: 'center', zIndex: 300 }}>
      <Animated.View style={{ transform: [{ translateY: slide }], width: '100%', maxWidth: 440 }}>
        <SurfaceProvider value="card">
          <Pressable
            accessibilityRole="alert"
            onPress={hidePr}
            style={{ backgroundColor: colors.card, borderRadius: 24, borderTopWidth: 6, borderTopColor: colors.cYellow, padding: 22 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Icon name="star" size={18} color={colors.cYellow} filled />
              <Text weight={700} size={12} color={colors.cYellow} uppercase>
                Nouveau record
              </Text>
            </View>
            <Text display size={26} color="#FFFFFF">
              {info.name}
            </Text>
            <Text weight={700} size={18} color="#FFFFFF" style={{ marginTop: 4 }}>
              {`${fmtKg(info.weight)} kg`}
              {info.reps ? ` × ${info.reps} reps` : ''}
            </Text>
            {info.oneRm !== null ? (
              <View style={{ marginTop: 12 }}>
                <Text size={12} tone="dim" style={{ marginBottom: 8 }}>
                  {`1RM Brzycki : ${fmtKg(info.oneRm)} kg`}
                  {info.bodyRatio !== null ? ` · ${fmtKg(info.bodyRatio)}× poids du corps` : ''}
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  {info.table.map((row) => (
                    <View key={row.pct} style={{ backgroundColor: colors.card2, borderRadius: 10, paddingVertical: 5, paddingHorizontal: 9 }}>
                      <Text size={11} tone="muted">
                        {`${row.pct}% `}
                        <Text size={12} weight={700} color="#FFFFFF">{`${fmtKg(row.weight)}`}</Text>
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}
          </Pressable>
        </SurfaceProvider>
      </Animated.View>
    </View>
  );
}
