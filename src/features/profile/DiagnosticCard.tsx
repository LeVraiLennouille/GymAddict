import { useState } from 'react';
import { View } from 'react-native';
import { useAppStore } from '@/data/store/appStore';
import { serializeAppData } from '@/domain/rules/appData';
import { sessionDates } from '@/domain/rules/history';
import { runDiagnostic, type DiagItem, type DiagStatus } from '@/services/diagnostic';
import { useTheme } from '@/theme/ThemeProvider';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { Icon } from '@/ui/Icon';
import { Sheet } from '@/ui/Sheet';
import { Text } from '@/ui/Text';

const STATUS_LABEL: Record<DiagStatus, string> = { ok: 'OK', warn: 'À vérifier', fail: 'Problème' };

/** Diagnostic de l'appareil : vérifie le stockage, les notifications, le retour sensoriel et l'installation. */
export function DiagnosticCard() {
  const { colors } = useTheme();
  const [items, setItems] = useState<DiagItem[] | null>(null);
  const [running, setRunning] = useState(false);

  const colorOf: Record<DiagStatus, string> = { ok: colors.green, warn: colors.orange, fail: colors.red };

  const run = async (): Promise<void> => {
    setRunning(true);
    try {
      const { data } = useAppStore.getState();
      setItems(
        await runDiagnostic({
          sessionDays: sessionDates(data).length,
          dataBytes: serializeAppData(data).length,
          lastBackup: data.lastBackup,
          sound: data.prefs.sound,
          vibrate: data.prefs.vibrate,
          remindersEnabled: Boolean(data.prefs.reminder?.enabled),
        }),
      );
    } finally {
      setRunning(false);
    }
  };

  const problems = items?.filter((i) => i.status !== 'ok').length ?? 0;

  return (
    <>
      <Card>
        <Text size={13} tone="dim" style={{ lineHeight: 20, marginBottom: 12 }}>
          Un problème de sauvegarde, de son ou de notification ? Le diagnostic vérifie ce qui fonctionne sur cet appareil.
        </Text>
        <Button label="Lancer le diagnostic" variant="soft" disabled={running} onPress={() => void run()} />
      </Card>

      <Sheet visible={items !== null} onClose={() => setItems(null)} title="Diagnostic" accent={problems ? colors.cYellow : colors.cGreen}>
        <Text size={13} tone="dim" style={{ marginBottom: 14 }}>
          {problems === 0 ? 'Tout est en ordre.' : `${problems} point${problems > 1 ? 's' : ''} à vérifier.`}
        </Text>
        <View style={{ gap: 8 }}>
          {(items ?? []).map((i) => (
            <View key={i.id} accessible accessibilityLabel={`${i.label} : ${STATUS_LABEL[i.status]}. ${i.detail}`} style={{ backgroundColor: colors.card2, borderRadius: 14, padding: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Icon name={i.status === 'ok' ? 'check' : 'close'} size={16} color={colorOf[i.status]} />
                <Text weight={700} size={14} style={{ flex: 1 }}>
                  {i.label}
                </Text>
                <Text size={11} weight={700} color={colorOf[i.status]}>
                  {STATUS_LABEL[i.status]}
                </Text>
              </View>
              <Text size={12} tone="dim" style={{ marginTop: 4, lineHeight: 17 }}>
                {i.detail}
              </Text>
            </View>
          ))}
        </View>
        <Button label="Relancer" variant="solid" fullWidth style={{ marginTop: 16 }} disabled={running} onPress={() => void run()} />
      </Sheet>
    </>
  );
}
