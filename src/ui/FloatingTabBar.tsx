import type { ComponentProps } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, type Tabs } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { MAX_WIDTH } from '@/theme/tokens';
import { Icon, type IconName } from './Icon';
import { Text } from './Text';

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

const TAB_META: Record<string, { label: string; icon: IconName; href: '/' | '/week' | '/stats' | '/cardio' | '/profile' }> = {
  index: { label: 'Séance', icon: 'home', href: '/' },
  week: { label: 'Programme', icon: 'calendar', href: '/week' },
  stats: { label: 'Stats', icon: 'bars', href: '/stats' },
  cardio: { label: 'Cardio', icon: 'pulse', href: '/cardio' },
  profile: { label: 'Profil', icon: 'user', href: '/profile' },
};

/**
 * Barre d'onglets flottante (ancien `.bnav`).
 * La navigation passe par le routeur plutôt que par l'objet `navigation` de React Navigation,
 * dont la forme change d'une version à l'autre.
 */
export function FloatingTabBar({ state }: TabBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  return (
    <View style={{ position: 'absolute', left: 12, right: 12, bottom: 10 + insets.bottom, alignItems: 'center', pointerEvents: 'box-none' }}>
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
                if (!focused) router.navigate(meta.href);
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
