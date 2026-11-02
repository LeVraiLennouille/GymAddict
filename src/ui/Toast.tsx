import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from './Text';
import { useFeedbackStore } from './feedbackStore';
import { USE_NATIVE_DRIVER } from './animation';

const VISIBLE_MS = 2800;

export function ToastHost() {
  const toast = useFeedbackStore((s) => s.toast);
  const hideToast = useFeedbackStore((s) => s.hideToast);
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const lift = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (!toast) return;
    opacity.setValue(0);
    lift.setValue(20);
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: USE_NATIVE_DRIVER }),
      Animated.timing(lift, { toValue: 0, duration: 250, useNativeDriver: USE_NATIVE_DRIVER }),
    ]).start();
    const id = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: USE_NATIVE_DRIVER }).start(({ finished }) => {
        if (finished) hideToast();
      });
    }, VISIBLE_MS);
    return () => clearTimeout(id);
  }, [toast, opacity, lift, hideToast]);

  if (!toast) return null;
  return (
    <View style={{ position: 'absolute', left: 16, right: 16, bottom: 104 + insets.bottom, alignItems: 'center', zIndex: 700, pointerEvents: 'none' }}>
      <Animated.View
        accessibilityLiveRegion="polite"
        style={{
          opacity,
          transform: [{ translateY: lift }],
          backgroundColor: '#FFFFFF',
          borderRadius: 99,
          paddingVertical: 12,
          paddingHorizontal: 20,
          maxWidth: 440,
        }}
      >
        <Text weight={700} size={14} color="#14161B" align="center">
          {toast.message}
        </Text>
      </Animated.View>
    </View>
  );
}
