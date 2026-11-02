import { View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from './Text';

/** Titre de section avec filet (ancien `.stitle`). */
export function SectionTitle({ children, flush = false }: { children: string; flush?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: flush ? 0 : 26, marginBottom: 12, marginHorizontal: flush ? 0 : 2 }}>
      <Text display size={25}>
        {children}
      </Text>
      <View style={{ flex: 1, height: 3, borderRadius: 3, backgroundColor: colors.rule }} />
    </View>
  );
}
