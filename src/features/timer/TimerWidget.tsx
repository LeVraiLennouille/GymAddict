import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/data/store/appStore';
import { fmtClock } from '@/domain/format/numbers';
import { playGo, playTick, vibrate } from '@/services/feedback';
import { remainingSeconds, useTimerStore } from '@/services/timerStore';
import { useTheme } from '@/theme/ThemeProvider';
import { USE_NATIVE_DRIVER } from '@/ui/animation';
import { Icon } from '@/ui/Icon';
import { Text } from '@/ui/Text';

const KEEP_AWAKE_TAG = 'rest-timer';
const URGENT_SECONDS = 10;
const RING = 58;
const RING_RADIUS = 24;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

/** Minuteur de repos flottant : capsule sombre avec un anneau qui se vide, visible sur tous les onglets. */
export function TimerWidget() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const endAt = useTimerStore((s) => s.endAt);
  const totalSec = useTimerStore((s) => s.totalSec);
  const label = useTimerStore((s) => s.label);
  const add = useTimerStore((s) => s.add);
  const dismiss = useTimerStore((s) => s.dismiss);
  const prefs = useAppStore((s) => s.data.prefs);
  const prefsRef = useRef(prefs);
  prefsRef.current = prefs;

  const [remaining, setRemaining] = useState(0);
  const slide = useRef(new Animated.Value(200)).current;
  const lastBeep = useRef(-1);

  useEffect(() => {
    Animated.spring(slide, { toValue: endAt === null ? 200 : 0, useNativeDriver: USE_NATIVE_DRIVER, bounciness: 6 }).start();
  }, [endAt, slide]);

  useEffect(() => {
    if (endAt === null) return;
    lastBeep.current = -1;
    void Promise.resolve(activateKeepAwakeAsync(KEEP_AWAKE_TAG)).catch(() => undefined);

    const tick = (): void => {
      const left = remainingSeconds(endAt);
      if (left <= 0) {
        playGo(prefsRef.current);
        vibrate(prefsRef.current, 'success');
        useTimerStore.getState().dismiss();
        return;
      }
      setRemaining(left);
      if (left <= 3 && lastBeep.current !== left) {
        lastBeep.current = left;
        playTick(prefsRef.current);
      }
    };
    tick();
    const id = setInterval(tick, 250);
    return () => {
      clearInterval(id);
      void Promise.resolve(deactivateKeepAwake(KEEP_AWAKE_TAG)).catch(() => undefined);
    };
  }, [endAt]);

  const visible = endAt !== null;
  // Avant le premier tick, on calcule tout de suite le temps restant (évite un flash « 0:00 »).
  const shown = endAt !== null && remaining === 0 ? remainingSeconds(endAt) : remaining;
  const urgent = shown <= URGENT_SECONDS;
  const ringColor = urgent ? colors.red : colors.cBlue;
  const share = totalSec > 0 ? Math.max(0, Math.min(1, shown / totalSec)) : 0;

  return (
    <View
      style={{ position: 'absolute', left: 12, right: 12, bottom: 98 + insets.bottom, alignItems: 'center', zIndex: 200, pointerEvents: visible ? 'box-none' : 'none' }}
    >
      <Animated.View
        accessibilityLiveRegion="none"
        style={{
          transform: [{ translateY: slide }],
          backgroundColor: colors.navBg,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.1)',
          borderRadius: 99,
          paddingVertical: 8,
          paddingLeft: 8,
          paddingRight: 10,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          maxWidth: '100%',
        }}
      >
        <View style={{ width: RING, height: RING, alignItems: 'center', justifyContent: 'center' }} accessible accessibilityLabel={`Repos, ${shown} secondes restantes`}>
          <Svg width={RING} height={RING} viewBox={`0 0 ${RING} ${RING}`} style={{ position: 'absolute' }}>
            <Circle cx={RING / 2} cy={RING / 2} r={RING_RADIUS} stroke="rgba(255,255,255,0.12)" strokeWidth={5} fill="none" />
            <Circle
              cx={RING / 2}
              cy={RING / 2}
              r={RING_RADIUS}
              stroke={ringColor}
              strokeWidth={5}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${RING_LENGTH}`}
              strokeDashoffset={RING_LENGTH * (1 - share)}
              transform={`rotate(-90 ${RING / 2} ${RING / 2})`}
            />
          </Svg>
          <Text display size={17} color="#FFFFFF">
            {fmtClock(shown)}
          </Text>
        </View>

        <View style={{ flexShrink: 1, minWidth: 70 }}>
          <Text size={11} color="#8C93A1">
            Temps de repos
          </Text>
          <Text size={13} weight={700} color="#FFFFFF" numberOfLines={1}>
            {label}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 6 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ajouter 30 secondes"
            onPress={() => add(30)}
            style={{ minHeight: 40, minWidth: 48, borderRadius: 99, paddingHorizontal: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' }}
          >
            <Text size={13} weight={700} color="#FFFFFF">
              +30s
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Fermer le minuteur"
            onPress={dismiss}
            style={{ minHeight: 40, minWidth: 44, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name="close" size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}
