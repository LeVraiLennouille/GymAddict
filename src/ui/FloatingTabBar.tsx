import type { ComponentProps } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Tabs } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { MAX_WIDTH } from '@/theme/tokens';
import { Icon, type IconName } from './Icon';
import { Text } from './Text';

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

const TAB_META: Record<string, { label: string; icon: IconName }> = {
  index: { label: 'Séance', icon: 'home' },
  week: { label: 'Programme', icon: 'calendar' },
  stats: { label: 'Stats', icon: 'bars' },
  cardio: { label: 'Cardio', icon: 'pulse' },
  profile: { label: 'Profil', icon: 'user' },
};

/** Barre d'onglets flottante (ancien `.bnav`). */
export function FloatingTabBar({ state, navigation }: TabBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View
      pointerEvents="box-none"
      style={{ position: 'absolute', left: 12, right: 12, bottom: 10 + insets.bottom, alignItems: 'center' }}
    >
      <View
        accessibilityRole="tablist"
        style={{ width: '100%', maxWidth: MAX_WIDTH - 24, flexDirection: 'row', backgroundColor: colors.navBg, borderRadius: 28, padding: 6 }}
      >
        {state.routes.map((route, index) => {
          const meta = TAB_META[route.name];
          if (!meta) return null;
          const focused = state.index === index;
          const fg = focused ? colors.navBg : colors.navIdle;
          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={meta.label}
              onPress={() => {
                const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
              }}
              style={{
                flex: 1,
                minHeight: 52,
                borderRadius: 22,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                backgroundColor: focused ? '#FFFFFF' : 'transparent',
              }}
            >
              <Icon name={meta.icon} size={21} color={fg} strokeWidth={2} />
              <Text weight={600} size={10} color={fg}>
                {meta.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
