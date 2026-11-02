import { useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/data/store/appStore';
import { buildHistory, type SessionColor } from '@/domain/rules/history';
import { useTheme } from '@/theme/ThemeProvider';
import { MAX_WIDTH, PROGRAM_HEX } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { Text } from '@/ui/Text';

/** Liste de toutes les séances et sorties, groupées par mois. */
export function HistoryScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const data = useAppStore((s) => s.data);
  const months = useMemo(() => buildHistory(data), [data]);
  const total = months.reduce((n, m) => n + m.count, 0);

  const colorOf = (c: SessionColor): string => (c === 'run' ? colors.cBlue : PROGRAM_HEX[c]);
  const close = (): void => {
    if (router.canGoBack()) router.back();
    else router.replace('/stats');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 14, paddingTop: 16 + insets.top, paddingBottom: 40 + insets.bottom, alignItems: 'center' }}>
        <View style={{ width: '100%', maxWidth: MAX_WIDTH }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Retour"
              onPress={close}
              style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name="back" size={18} color="#FFFFFF" />
            </Pressable>
            <View>
              <Text display size={34} accessibilityRole="header">
                Historique
              </Text>
              <Text size={12} tone="dim">{`${total} séance${total > 1 ? 's' : ''}`}</Text>
            </View>
          </View>

          {months.length === 0 ? (
            <Text size={14} tone="muted" align="center" style={{ paddingVertical: 60, lineHeight: 22 }}>
              {'Aucune séance enregistrée.\nValide ta première série pour la voir ici !'}
            </Text>
          ) : null}

          {months.map((month) => (
            <View key={month.key} style={{ marginBottom: 22 }}>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8, marginHorizontal: 2 }}>
                <Text display size={22} style={{ textTransform: 'capitalize' }}>
                  {month.label}
                </Text>
                <Text size={12} tone="dim">{`${month.count} séance${month.count > 1 ? 's' : ''}`}</Text>
              </View>
              {month.rows.map((row) => (
                <Pressable
                  key={row.date}
                  accessibilityRole="button"
                  accessibilityLabel={`${row.title}, ${row.weekday} ${row.day}`}
                  onPress={() => router.push(`/history/${row.date}`)}
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    backgroundColor: colors.card,
                    borderRadius: 20,
                    paddingVertical: 12,
                    paddingHorizontal: 14,
                    marginBottom: 8,
                    opacity: pressed ? 0.85 : 1,
                  })}
                >
                  <View style={{ alignItems: 'center', width: 38 }}>
                    <Text display size={24} color="#FFFFFF" style={{ lineHeight: 26 }}>
                      {String(row.day)}
                    </Text>
                    <Text size={10} tone="muted" uppercase>
                      {row.weekday.replace('.', '')}
                    </Text>
                  </View>
                  <View style={{ width: 5, alignSelf: 'stretch', borderRadius: 3, backgroundColor: colorOf(row.color) }} />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text weight={700} size={15} color="#FFFFFF" numberOfLines={1}>
                      {row.title}
                    </Text>
                    <Text size={12} tone="dim" style={{ marginTop: 2 }} numberOfLines={2}>
                      {row.meta}
                    </Text>
                  </View>
                  <Icon name="chev" size={18} color="#7C8391" />
                </Pressable>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
