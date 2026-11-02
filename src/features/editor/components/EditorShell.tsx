import type { ReactNode } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { MAX_WIDTH } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { Text } from '@/ui/Text';

interface Props {
  title: string;
  subtitle?: string;
  /** Route de repli si l'écran est ouvert directement (sans historique de navigation). */
  fallback: string;
  children: ReactNode;
}

/** Cadre commun des écrans d'édition : bouton retour, titre, zone défilante. */
export function EditorShell({ title, subtitle, fallback, children }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const back = (): void => {
    if (router.canGoBack()) router.back();
    else router.replace(fallback);
  };
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{ paddingHorizontal: 14, paddingTop: 16 + insets.top, paddingBottom: 60 + insets.bottom, alignItems: 'center' }}
      >
        <View style={{ width: '100%', maxWidth: MAX_WIDTH }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Retour"
              onPress={back}
              style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name="back" size={18} color="#FFFFFF" />
            </Pressable>
            <View style={{ flex: 1 }}>
              <Text display size={32} accessibilityRole="header" numberOfLines={1}>
                {title}
              </Text>
              {subtitle ? (
                <Text size={12} tone="dim">
                  {subtitle}
                </Text>
              ) : null}
            </View>
          </View>
          {children}
        </View>
      </ScrollView>
    </View>
  );
}
