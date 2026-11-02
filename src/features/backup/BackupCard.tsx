import { View } from 'react-native';
import { fmtDateLong, dateToKey } from '@/domain/format/dates';
import type { BackupSummary } from '@/domain/rules/backup';
import { useTheme } from '@/theme/ThemeProvider';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { Sheet } from '@/ui/Sheet';
import { Text } from '@/ui/Text';
import { useBackup } from './useBackup';

function SummaryLines({ title, s }: { title: string; s: BackupSummary }) {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.card2, borderRadius: 14, padding: 12 }}>
      <Text size={10} weight={600} tone="muted" uppercase style={{ marginBottom: 6 }}>
        {title}
      </Text>
      <Text size={13} weight={700}>{`${s.sessionDays} jour${s.sessionDays > 1 ? 's' : ''} de séances`}</Text>
      <Text size={12} tone="dim" style={{ marginTop: 2 }}>{`${s.records} records · ${s.weighIns} pesées`}</Text>
      {s.lastDay ? (
        <Text size={11} tone="muted" style={{ marginTop: 2 }}>
          {`jusqu'au ${fmtDateLong(s.lastDay).split(' ').slice(1, 3).join(' ')}`}
        </Text>
      ) : null}
    </View>
  );
}

/** Carte « Sauvegarde » du profil : export, import (fusion ou remplacement), date de la dernière sauvegarde. */
export function BackupCard() {
  const { colors } = useTheme();
  const backup = useBackup();
  const { pending } = backup;

  const lastText = backup.lastBackup
    ? `Dernière sauvegarde : ${fmtDateLong(dateToKey(new Date(backup.lastBackup)))}`
    : 'Aucune sauvegarde exportée pour le moment';

  return (
    <>
      <Card accent={colors.cBlue}>
        <Text size={13} tone="dim" style={{ lineHeight: 20 }}>
          {'Tes données restent sur cet appareil. Exporte-les régulièrement dans un fichier pour les garder en sécurité ou les retrouver sur un autre appareil.'}
        </Text>
        <Text size={12} weight={600} color={backup.status.due ? colors.orange : colors.onCard.muted} style={{ marginTop: 10, marginBottom: 14 }}>
          {lastText}
        </Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button label="Exporter" icon="up" variant="solid" disabled={backup.busy} style={{ flex: 1, alignSelf: 'stretch' }} onPress={() => void backup.exportBackup()} />
          <Button label="Importer" icon="down" variant="soft" disabled={backup.busy} style={{ flex: 1, alignSelf: 'stretch' }} onPress={() => void backup.chooseFile()} />
        </View>
      </Card>

      <Sheet visible={pending !== null} onClose={backup.cancelImport} title="Importer une sauvegarde" accent={colors.cBlue}>
        {pending ? (
          <View>
            <Text size={12} tone="dim" style={{ marginBottom: 14 }}>
              {`${pending.fileName}${pending.exportedAt ? ` · exportée le ${fmtDateLong(dateToKey(new Date(pending.exportedAt)))}` : ''}`}
            </Text>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 18 }}>
              <SummaryLines title="Sur l'appareil" s={pending.current} />
              <SummaryLines title="Dans le fichier" s={pending.summary} />
            </View>

            <Button label="Fusionner (recommandé)" variant="green" fullWidth onPress={() => void backup.applyImport('merge')} />
            <Text size={11} tone="muted" style={{ marginTop: 6, marginBottom: 16, lineHeight: 16 }}>
              Ajoute ce qui manque (jours, pesées, objectifs) et garde le meilleur record. Rien de ce que tu as déjà n'est écrasé.
            </Text>

            <Button label="Remplacer toutes les données" variant="danger" fullWidth onPress={() => void backup.applyImport('replace')} />
            <Text size={11} tone="muted" style={{ marginTop: 6, marginBottom: 16, lineHeight: 16 }}>
              Efface les données actuelles au profit du fichier. Une copie de l'état actuel est conservée sur l'appareil.
            </Text>

            <Button label="Annuler" variant="ghost" fullWidth onPress={backup.cancelImport} />
          </View>
        ) : null}
      </Sheet>
    </>
  );
}
