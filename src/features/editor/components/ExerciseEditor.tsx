import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { ALL_MUSCLE_KEYS, EXERCISE_TYPES, EXERCISE_TYPE_LABELS, MUSCLE_LABELS } from '@/domain/defaults/constants';
import type { ExercisePatch } from '@/domain/actions/program';
import { exRepFields } from '@/domain/rules/progression';
import type { Exercise, SupersetGroup } from '@/domain/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { ChoiceChip } from '@/ui/ChoiceChip';
import { CommitInput } from '@/ui/CommitInput';
import { Icon } from '@/ui/Icon';
import { Text } from '@/ui/Text';

const SUPERSETS: readonly (SupersetGroup | null)[] = [null, 'A', 'B', 'C', 'D'];

interface Props {
  exercise: Exercise;
  isFirst: boolean;
  isLast: boolean;
  onPatch: (patch: ExercisePatch) => void;
  onMove: (dir: -1 | 1) => void;
  onDelete: () => void;
}

function Label({ children }: { children: string }) {
  return (
    <Text size={10} weight={600} tone="muted" style={{ marginBottom: 6, marginTop: 14 }}>
      {children}
    </Text>
  );
}

function RoundButton({ icon, label, onPress, disabled }: { icon: 'up' | 'down' | 'trash' | 'plus'; label: string; onPress: () => void; disabled?: boolean }) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card2, alignItems: 'center', justifyContent: 'center', opacity: disabled ? 0.35 : 1 }}
    >
      <Icon name={icon} size={16} color="#FFFFFF" />
    </Pressable>
  );
}

/** Édition complète d'un exercice du programme. */
export function ExerciseEditor({ exercise: ex, isFirst, isLast, onPatch, onMove, onDelete }: Props) {
  const { colors } = useTheme();
  const reps = exRepFields(ex);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <Card compact>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={`${ex.name}, ${open ? 'replier' : 'modifier'}`}
        onPress={() => setOpen((v) => !v)}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 44 }}
      >
        <View style={{ flex: 1 }}>
          <Text display size={20} numberOfLines={1}>
            {ex.name}
          </Text>
          <Text size={12} tone="dim" style={{ marginTop: 2 }}>
            {`${ex.sets} séries · ${ex.repsLabel} · ${EXERCISE_TYPE_LABELS[ex.type]}${ex.superset ? ` · superset ${ex.superset}` : ''}`}
          </Text>
        </View>
        <View style={{ transform: [{ rotate: open ? '90deg' : '0deg' }] }}>
          <Icon name="chev" size={18} color={colors.onCard.dim} />
        </View>
      </Pressable>

      {open ? (
        <View>
          <Label>NOM</Label>
          <CommitInput variant="note" value={ex.name} maxLength={60} accessibilityLabel="Nom de l'exercice" onCommit={(name) => onPatch({ name })} />

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Label>SÉRIES</Label>
              <CommitInput integer maxLength={2} value={String(ex.sets)} accessibilityLabel="Nombre de séries" onCommit={(t) => onPatch({ sets: parseInt(t, 10) || 1 })} />
            </View>
            <View style={{ flex: 1 }}>
              <Label>REPOS (SEC)</Label>
              <CommitInput integer maxLength={3} value={String(ex.restSec)} accessibilityLabel="Repos en secondes" onCommit={(t) => onPatch({ restSec: parseInt(t, 10) || 90 })} />
            </View>
          </View>

          <Label>{ex.isTime ? 'SECONDES (MIN – MAX)' : 'RÉPÉTITIONS (MIN – MAX)'}</Label>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, opacity: reps.failure ? 0.4 : 1 }}>
            <View style={{ flex: 1 }}>
              <CommitInput
                integer
                maxLength={3}
                editable={!reps.failure}
                value={String(reps.min)}
                accessibilityLabel="Minimum"
                onCommit={(t) => onPatch({ reps: { min: parseInt(t, 10) || 1, max: reps.max } })}
              />
            </View>
            <Text size={14} tone="muted">
              –
            </Text>
            <View style={{ flex: 1 }}>
              <CommitInput
                integer
                maxLength={3}
                editable={!reps.failure}
                value={String(reps.max)}
                accessibilityLabel="Maximum"
                onCommit={(t) => onPatch({ reps: { min: reps.min, max: parseInt(t, 10) || reps.min } })}
              />
            </View>
          </View>

          <Label>OPTIONS</Label>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            <ChoiceChip label="Jusqu'à l'échec" selected={reps.failure} onPress={() => onPatch({ failure: !reps.failure })} />
            <ChoiceChip label="Chronométré" selected={Boolean(ex.isTime)} onPress={() => onPatch({ isTime: !ex.isTime })} />
            <ChoiceChip label="Optionnel" selected={Boolean(ex.optional)} onPress={() => onPatch({ optional: !ex.optional })} />
          </View>

          <Label>TYPE</Label>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {EXERCISE_TYPES.map((t) => (
              <ChoiceChip key={t} label={EXERCISE_TYPE_LABELS[t]} selected={ex.type === t} onPress={() => onPatch({ type: t })} />
            ))}
          </View>

          <Label>SUPERSET</Label>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {SUPERSETS.map((g) => (
              <ChoiceChip key={g ?? 'none'} label={g ?? 'Aucun'} selected={(ex.superset ?? null) === g} onPress={() => onPatch({ superset: g })} />
            ))}
          </View>

          <Label>MUSCLES (LE PREMIER EST LE PRINCIPAL)</Label>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {ALL_MUSCLE_KEYS.map((m) => (
              <ChoiceChip key={m} label={MUSCLE_LABELS[m]} selected={ex.muscles.includes(m)} onPress={() => onPatch({ toggleMuscle: m })} />
            ))}
          </View>

          <Label>INCRÉMENT DE CHARGE (KG, VIDE = 2,5)</Label>
          <CommitInput
            numeric
            value={ex.step ? String(ex.step).replace('.', ',') : ''}
            placeholder="2,5"
            style={{ width: 110 }}
            accessibilityLabel="Incrément de charge"
            onCommit={(t) => onPatch({ step: parseFloat(t.replace(',', '.')) || null })}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 20 }}>
            <RoundButton icon="up" label="Monter" disabled={isFirst} onPress={() => onMove(-1)} />
            <RoundButton icon="down" label="Descendre" disabled={isLast} onPress={() => onMove(1)} />
            <View style={{ flex: 1 }} />
            <Button
              small
              variant="danger"
              label={confirmDelete ? 'Confirmer' : 'Supprimer'}
              onPress={() => {
                if (!confirmDelete) setConfirmDelete(true);
                else onDelete();
              }}
            />
          </View>
        </View>
      ) : null}
    </Card>
  );
}
