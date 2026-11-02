import { useState } from 'react';
import { View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { PROGRAM_COLORS } from '@/domain/defaults/constants';
import type { ProgramId } from '@/domain/types';
import { useTheme } from '@/theme/ThemeProvider';
import { PROGRAM_HEX } from '@/theme/tokens';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { CommitInput } from '@/ui/CommitInput';
import { SectionTitle } from '@/ui/SectionTitle';
import { Sheet } from '@/ui/Sheet';
import { Text } from '@/ui/Text';
import { Pressable } from 'react-native';
import { EditorShell } from './components/EditorShell';
import { ExerciseEditor } from './components/ExerciseEditor';
import { useProgramEditor } from './hooks/useProgramEditor';

const COLOR_NAMES: Record<string, string> = { red: 'Rouge', blue: 'Bleu', yellow: 'Jaune', green: 'Vert', grey: 'Gris' };

/** Édition d'une séance : noms, couleur, liste d'exercices. */
export function ProgramEditorScreen({ id }: { id: ProgramId }) {
  const { colors } = useTheme();
  const router = useRouter();
  const { config, actions } = useProgramEditor();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const prog = config.programs[id];

  if (!prog || prog.type === 'rest') return <Redirect href="/editor" />;

  return (
    <EditorShell title={prog.fullName} subtitle={`${prog.exercises.length} exercice${prog.exercises.length > 1 ? 's' : ''}`} fallback="/editor">
      <Card accent={PROGRAM_HEX[prog.color]}>
        <Text size={10} weight={600} tone="muted" style={{ marginBottom: 6 }}>
          NOM COMPLET
        </Text>
        <CommitInput variant="note" value={prog.fullName} maxLength={60} accessibilityLabel="Nom complet de la séance" onCommit={(t) => actions.renameProgram(id, 'fullName', t)} />
        <Text size={10} weight={600} tone="muted" style={{ marginBottom: 6, marginTop: 14 }}>
          NOM COURT
        </Text>
        <CommitInput variant="note" value={prog.label} maxLength={24} accessibilityLabel="Nom court de la séance" onCommit={(t) => actions.renameProgram(id, 'label', t)} />

        <Text size={10} weight={600} tone="muted" style={{ marginBottom: 8, marginTop: 14 }}>
          COULEUR
        </Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {PROGRAM_COLORS.map((c) => (
            <Pressable
              key={c}
              accessibilityRole="radio"
              accessibilityState={{ checked: prog.color === c }}
              accessibilityLabel={COLOR_NAMES[c] ?? c}
              onPress={() => actions.colorProgram(id, c)}
              style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: PROGRAM_HEX[c], borderWidth: 3, borderColor: prog.color === c ? '#FFFFFF' : 'transparent' }}
            />
          ))}
        </View>
      </Card>

      <SectionTitle>Exercices</SectionTitle>
      {prog.exercises.length === 0 ? (
        <Text size={13} tone="muted" align="center" style={{ paddingVertical: 24 }}>
          Aucun exercice : ajoute le premier.
        </Text>
      ) : null}
      {prog.exercises.map((ex, i) => (
        <ExerciseEditor
          key={ex.id}
          exercise={ex}
          isFirst={i === 0}
          isLast={i === prog.exercises.length - 1}
          onPatch={(patch) => actions.updateExercise(id, ex.id, patch)}
          onMove={(dir) => actions.moveExercise(id, ex.id, dir)}
          onDelete={() => actions.deleteExercise(id, ex.id)}
        />
      ))}
      <Button label="Ajouter un exercice" icon="plus" variant="solid" fullWidth onPress={() => actions.addExercise(id)} style={{ marginBottom: 24 }} />

      <Button label="Supprimer cette séance" variant="danger" fullWidth onPress={() => setConfirmDelete(true)} />

      <Sheet visible={confirmDelete} onClose={() => setConfirmDelete(false)} title="Supprimer la séance ?" accent={colors.cRed}>
        <Text size={13} tone="dim" style={{ lineHeight: 21, marginBottom: 20 }}>
          {`« ${prog.fullName} » disparaît du planning (les jours concernés passent en repos). Les séances déjà faites restent dans l'historique.`}
        </Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button label="Annuler" variant="ghost" style={{ flex: 1, alignSelf: 'stretch' }} onPress={() => setConfirmDelete(false)} />
          <Button
            label="Supprimer"
            variant="danger"
            style={{ flex: 1, alignSelf: 'stretch' }}
            onPress={() => {
              setConfirmDelete(false);
              if (actions.deleteProgram(id)) router.replace('/editor');
            }}
          />
        </View>
      </Sheet>
    </EditorShell>
  );
}
