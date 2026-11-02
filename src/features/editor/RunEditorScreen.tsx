import { useState } from 'react';
import { View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { fmtKm, fmtPace, parsePace } from '@/domain/format/numbers';
import type { RunId } from '@/domain/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { CommitInput } from '@/ui/CommitInput';
import { Sheet } from '@/ui/Sheet';
import { Text } from '@/ui/Text';
import { EditorShell } from './components/EditorShell';
import { useProgramEditor } from './hooks/useProgramEditor';

function Label({ children }: { children: string }) {
  return (
    <Text size={10} weight={600} tone="muted" style={{ marginBottom: 6, marginTop: 14 }}>
      {children}
    </Text>
  );
}

/** Édition d'une sortie running : nom, description, objectifs de distance, durée et allure. */
export function RunEditorScreen({ id }: { id: RunId }) {
  const { colors } = useTheme();
  const router = useRouter();
  const { config, actions } = useProgramEditor();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const run = config.runs[id];

  if (!run) return <Redirect href="/editor" />;

  return (
    <EditorShell title={run.name} subtitle="Sortie running" fallback="/editor">
      <Card accent={colors.cBlue}>
        <Label>NOM</Label>
        <CommitInput variant="note" value={run.name} maxLength={40} accessibilityLabel="Nom de la sortie" onCommit={(t) => actions.setRunField(id, 'name', t)} />

        <Label>DESCRIPTION</Label>
        <CommitInput variant="note" multiline value={run.desc} maxLength={240} style={{ minHeight: 70, textAlignVertical: 'top' }} accessibilityLabel="Description" onCommit={(t) => actions.setRunField(id, 'desc', t)} />

        <Label>DÉTAIL (ÉCHAUFFEMENT, SÉRIES, RETOUR AU CALME…)</Label>
        <CommitInput variant="note" multiline value={run.detail} maxLength={240} style={{ minHeight: 70, textAlignVertical: 'top' }} accessibilityLabel="Détail" onCommit={(t) => actions.setRunField(id, 'detail', t)} />

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Label>DISTANCE (KM)</Label>
            <CommitInput numeric value={run.targetDistance ? fmtKm(run.targetDistance) : ''} placeholder="—" accessibilityLabel="Distance cible en kilomètres" onCommit={(t) => actions.setRunField(id, 'targetDistance', t)} />
          </View>
          <View style={{ flex: 1 }}>
            <Label>DURÉE (MIN)</Label>
            <CommitInput integer value={run.targetDuration ? String(run.targetDuration) : ''} placeholder="—" accessibilityLabel="Durée cible en minutes" onCommit={(t) => actions.setRunField(id, 'targetDuration', t)} />
          </View>
          <View style={{ flex: 1 }}>
            <Label>ALLURE (M:SS)</Label>
            <CommitInput
              value={run.targetPace ? fmtPace(run.targetPace) : ''}
              placeholder="5:30"
              maxLength={5}
              keyboardType="numbers-and-punctuation"
              accessibilityLabel="Allure cible par kilomètre"
              onCommit={(t) => actions.setRunField(id, 'targetPace', String(t.trim() ? parsePace(t) : 0))}
            />
          </View>
        </View>
      </Card>

      <Button label="Supprimer cette sortie" variant="danger" fullWidth onPress={() => setConfirmDelete(true)} />

      <Sheet visible={confirmDelete} onClose={() => setConfirmDelete(false)} title="Supprimer la sortie ?" accent={colors.cRed}>
        <Text size={13} tone="dim" style={{ lineHeight: 21, marginBottom: 20 }}>
          {`« ${run.name} » est retirée de la semaine. Les sorties déjà enregistrées restent dans l'historique.`}
        </Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button label="Annuler" variant="ghost" style={{ flex: 1, alignSelf: 'stretch' }} onPress={() => setConfirmDelete(false)} />
          <Button
            label="Supprimer"
            variant="danger"
            style={{ flex: 1, alignSelf: 'stretch' }}
            onPress={() => {
              setConfirmDelete(false);
              actions.deleteRun(id);
              router.replace('/editor');
            }}
          />
        </View>
      </Sheet>
    </EditorShell>
  );
}
