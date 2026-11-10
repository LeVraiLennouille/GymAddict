import { useEffect, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { EXERCISE_TYPE_LABELS, MUSCLE_KEYS, MUSCLE_LABELS } from '@/domain/defaults/constants';
import { normName } from '@/domain/rules/sanitize';
import type { LibraryItem } from '@/domain/rules/swap';
import type { ExerciseType, MuscleKey } from '@/domain/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Button } from '@/ui/Button';
import { ChoiceChip } from '@/ui/ChoiceChip';
import { CommitInput } from '@/ui/CommitInput';
import { Sheet } from '@/ui/Sheet';
import { Text } from '@/ui/Text';

interface Props {
  visible: boolean;
  onClose: () => void;
  library: LibraryItem[];
  /** Ajoute un exercice connu ; renvoie `true` si l'ajout a réussi. */
  onPickKnown: (id: string) => boolean;
  onCreate: (name: string, muscle: MuscleKey, type: ExerciseType) => boolean;
}

const MAX_RESULTS = 30;
const TYPES: readonly ExerciseType[] = ['compound', 'isolation'];

/** Ajoute un exercice à la séance du jour : parmi ceux déjà connus, ou un nouveau. */
export function AddExerciseSheet({ visible, onClose, library, onPickKnown, onCreate }: Props) {
  const { colors } = useTheme();
  const [query, setQuery] = useState('');
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [muscle, setMuscle] = useState<MuscleKey>('pecs');
  const [type, setType] = useState<ExerciseType>('isolation');

  useEffect(() => {
    if (visible) {
      setQuery('');
      setName('');
      setCreating(false);
    }
  }, [visible]);

  const results = useMemo(() => {
    const q = normName(query);
    return library.filter((item) => !q || normName(item.name).includes(q));
  }, [library, query]);

  return (
    <Sheet visible={visible} onClose={onClose} title="Ajouter un exercice" accent={colors.cGreen}>
      <Text size={13} tone="dim" style={{ marginBottom: 14, lineHeight: 20 }}>
        {"S'ajoute à la séance d'aujourd'hui seulement : ton programme ne change pas."}
      </Text>

      <View style={{ flexDirection: 'row', gap: 6, marginBottom: 14 }}>
        <ChoiceChip label="Exercice connu" selected={!creating} onPress={() => setCreating(false)} />
        <ChoiceChip label="Nouvel exercice" selected={creating} onPress={() => setCreating(true)} />
      </View>

      {creating ? (
        <View>
          <Text size={10} weight={600} tone="muted" style={{ marginBottom: 6 }}>
            NOM
          </Text>
          <CommitInput variant="note" value={name} maxLength={60} placeholder="Ex. : Curl au pupitre" accessibilityLabel="Nom du nouvel exercice" onCommit={setName} onLiveChange={setName} />

          <Text size={10} weight={600} tone="muted" style={{ marginTop: 14, marginBottom: 8 }}>
            MUSCLE PRINCIPAL
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {MUSCLE_KEYS.map((m) => (
              <ChoiceChip key={m} label={MUSCLE_LABELS[m]} selected={muscle === m} onPress={() => setMuscle(m)} />
            ))}
          </View>

          <Text size={10} weight={600} tone="muted" style={{ marginTop: 14, marginBottom: 8 }}>
            TYPE
          </Text>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {TYPES.map((t) => (
              <ChoiceChip key={t} label={EXERCISE_TYPE_LABELS[t]} selected={type === t} onPress={() => setType(t)} />
            ))}
          </View>

          <Text size={11} tone="muted" style={{ marginTop: 12, lineHeight: 16 }}>
            3 séries de 8 à 12 répétitions par défaut ; tu pourras modifier les valeurs dans l'éditeur de programme.
          </Text>
          <Button
            label="Créer et ajouter"
            variant="green"
            fullWidth
            style={{ marginTop: 16 }}
            disabled={!name.trim()}
            onPress={() => {
              if (onCreate(name, muscle, type)) onClose();
            }}
          />
        </View>
      ) : (
        <View>
          <CommitInput variant="note" value={query} placeholder="Rechercher un exercice…" accessibilityLabel="Rechercher un exercice" onCommit={setQuery} onLiveChange={setQuery} />
          <View style={{ gap: 6, marginTop: 12 }}>
            {results.slice(0, MAX_RESULTS).map((item) => (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                accessibilityLabel={`Ajouter ${item.name}`}
                onPress={() => {
                  if (onPickKnown(item.id)) onClose();
                }}
                style={({ pressed }) => ({ backgroundColor: colors.card2, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 14, opacity: pressed ? 0.75 : 1 })}
              >
                <Text weight={700} size={14} color="#FFFFFF">
                  {item.name}
                </Text>
                {item.muscles.length ? (
                  <Text size={11} color="#A6ACB8" style={{ marginTop: 2 }}>
                    {item.muscles.map((m) => MUSCLE_LABELS[m]).join(' · ')}
                  </Text>
                ) : null}
              </Pressable>
            ))}
          </View>
          {results.length === 0 ? (
            <Text size={13} tone="muted" align="center" style={{ paddingVertical: 20 }}>
              Aucun exercice trouvé : crée-le avec « Nouvel exercice ».
            </Text>
          ) : null}
          {results.length > MAX_RESULTS ? (
            <Text size={11} tone="muted" align="center" style={{ marginTop: 10 }}>
              {`${results.length - MAX_RESULTS} autres : affine la recherche.`}
            </Text>
          ) : null}
        </View>
      )}
    </Sheet>
  );
}
