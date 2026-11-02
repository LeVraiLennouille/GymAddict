import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import type { SwapTarget } from '@/domain/rules/swap';
import { MUSCLE_LABELS } from '@/domain/defaults/constants';
import type { Exercise } from '@/domain/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Button } from '@/ui/Button';
import { CommitInput } from '@/ui/CommitInput';
import { Sheet } from '@/ui/Sheet';
import { Text } from '@/ui/Text';

interface Props {
  exercise: Exercise | null;
  candidates: SwapTarget[];
  onClose: () => void;
  onPick: (target: SwapTarget) => void;
  /** Renvoie `false` si le nom est vide. */
  onCustom: (name: string) => boolean;
}

/** Remplace un exercice pour cette séance seulement (machine prise, douleur…). */
export function SwapSheet({ exercise, candidates, onClose, onPick, onCustom }: Props) {
  const { colors } = useTheme();
  const [custom, setCustom] = useState('');

  useEffect(() => {
    if (exercise) setCustom('');
  }, [exercise]);

  return (
    <Sheet visible={exercise !== null} onClose={onClose} title="Remplacer" accent={colors.cBlue}>
      <Text size={13} tone="dim" style={{ marginBottom: 14, lineHeight: 20 }}>
        {'Remplace '}
        <Text size={13} weight={700} color="#FFFFFF">
          {exercise?.name ?? ''}
        </Text>
        {' pour aujourd\'hui. Les séries et les répétitions restent les mêmes.'}
      </Text>

      {candidates.length ? (
        <View style={{ gap: 8, marginBottom: 18 }}>
          {candidates.map((c) => (
            <Pressable
              key={c.id}
              accessibilityRole="button"
              accessibilityLabel={`Remplacer par ${c.name}`}
              onPress={() => onPick(c)}
              style={({ pressed }) => ({ backgroundColor: colors.card2, borderRadius: 16, paddingVertical: 13, paddingHorizontal: 14, opacity: pressed ? 0.75 : 1 })}
            >
              <Text weight={700} size={15} color="#FFFFFF">
                {c.name}
              </Text>
              <Text size={12} color="#A6ACB8" style={{ marginTop: 2 }}>
                {c.muscles.map((m) => MUSCLE_LABELS[m]).join(' · ')}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : (
        <Text size={13} tone="muted" style={{ marginBottom: 18 }}>
          Aucune suggestion : tous les exercices de ce muscle sont déjà au programme.
        </Text>
      )}

      <Text size={10} weight={600} tone="muted" style={{ marginBottom: 6 }}>
        AUTRE EXERCICE
      </Text>
      <CommitInput variant="note" value={custom} onCommit={setCustom} onLiveChange={setCustom} placeholder="Nom de l'exercice" accessibilityLabel="Nom de l'exercice de remplacement" />
      <Button label="Utiliser cet exercice" variant="accent" fullWidth style={{ marginTop: 10 }} onPress={() => onCustom(custom)} disabled={!custom.trim()} />
    </Sheet>
  );
}
