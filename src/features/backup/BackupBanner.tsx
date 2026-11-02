import { View } from 'react-native';
import { MAX_WIDTH } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeProvider';
import { Button } from '@/ui/Button';
import { Icon } from '@/ui/Icon';
import { SurfaceProvider } from '@/ui/Surface';
import { Text } from '@/ui/Text';
import { useBackup } from './useBackup';

/** Bandeau de rappel : sauvegarde conseillée (dès 3 jours d'entraînement, puis tous les 14 jours). */
export function BackupBanner() {
  const { colors } = useTheme();
  const backup = useBackup();
  if (!backup.status.due) return null;

  const { daysSince } = backup.status;
  return (
    <SurfaceProvider value="card">
      <View style={{ paddingHorizontal: 14, paddingBottom: 6, alignItems: 'center', backgroundColor: colors.bg }}>
        <View style={{ width: '100%', maxWidth: MAX_WIDTH, backgroundColor: colors.card, borderRadius: 20, padding: 14, borderLeftWidth: 5, borderLeftColor: colors.cYellow }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Icon name="refresh" size={18} color={colors.cYellow} />
            <View style={{ flex: 1 }}>
              <Text weight={700} size={14}>
                Pense à sauvegarder tes données
              </Text>
              <Text size={12} tone="dim" style={{ marginTop: 2 }}>
                {daysSince === null ? "Tu n'as encore jamais exporté de sauvegarde." : `Dernière sauvegarde il y a ${daysSince} jours.`}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
            <Button small variant="solid" label="Sauvegarder" disabled={backup.busy} onPress={() => void backup.exportBackup()} />
            <Button small variant="ghost" label="Plus tard" onPress={backup.snooze} />
          </View>
        </View>
      </View>
    </SurfaceProvider>
  );
}
