import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, View } from 'react-native';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/data/store/appStore';
import { fmtClock } from '@/domain/format/numbers';
import { playGo, playTick, vibrate } from '@/services/feedback';
import { remainingSeconds, useTimerStore } from '@/services/timerStore';
import { useTheme } from '@/theme/ThemeProvider';
import { Icon } from '@/ui/Icon';
import { Text } from '@/ui/Text';

const KEEP_AWAKE_TAG = 'rest-timer';
const URGENT_SECONDS = 10;

/** Minuteur de repos flottant, visible sur tous les onglets. */
export function TimerWidget() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const endAt = useTimerStore((s) => s.endAt);
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
    Animated.spring(slide, { toValue: endAt === null ? 200 : 0, useNativeDriver: true, bounciness: 6 }).start();
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
  // Avant le premier tick, on calcule tout de suite le temps restant (évite un flash « 0:00 » rouge).
  const shown = endAt !== null && remaining === 0 ? remainingSeconds(endAt) : remaining;
  const urgent = shown <= URGENT_SECONDS;
  const bg = urgent ? colors.cRed : colors.cBlue;

  return (
    <View
      pointerEvents={visible ? 'box-none' : 'none'}
      style={{ position: 'absolute', left: 12, right: 12, bottom: 98 + insets.bottom, alignItems: 'center', zIndex: 200 }}
    >
      <Animated.View
        accessibilityLiveRegion="none"
        style={{
          transform: [{ translateY: slide }],
          backgroundColor: bg,
          borderRadius: 99,
          paddingVertical: 10,
          paddingLeft: 22,
          paddingRight: 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
          maxWidth: '100%',
        }}
      >
        <Text
          display
          size={36}
          color="#FFFFFF"
          accessibilityLabel={`Repos, ${shown} secondes restantes`}
          style={{ minWidth: 76, textAlign: 'center', lineHeight: 40 }}
        >
          {fmtClock(shown)}
        </Text>
        <View style={{ flexShrink: 1 }}>
          <Text size={11} color="rgba(255,255,255,0.8)">
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
            style={{ minHeight: 40, minWidth: 44, borderRadius: 99, paddingHorizontal: 14, backgroundColor: 'rgba(0,0,0,0.22)', alignItems: 'center', justifyContent: 'center' }}
          >
            <Text size={13} weight={700} color="#FFFFFF">
              +30s
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Fermer le minuteur"
            onPress={dismiss}
            style={{ minHeight: 40, minWidth: 44, borderRadius: 99, backgroundColor: 'rgba(0,0,0,0.22)', alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name="close" size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}
