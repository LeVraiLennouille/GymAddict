import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { fmtKg } from '@/domain/format/numbers';
import type { GoalInput } from '@/domain/actions/goals';
import { goalCurrent, type GoalRow } from '@/domain/rules/goals';
import type { AppData, ExerciseId, Goal } from '@/domain/types';
import { useAppStore } from '@/data/store/appStore';
import { useTheme } from '@/theme/ThemeProvider';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { ChoiceChip } from '@/ui/ChoiceChip';
import { CommitInput } from '@/ui/CommitInput';
import { Icon } from '@/ui/Icon';
import { SectionTitle } from '@/ui/SectionTitle';
import { SelectField } from '@/ui/SelectField';
import { Sheet } from '@/ui/Sheet';
import { Text } from '@/ui/Text';

interface Props {
  rows: GoalRow[];
  exercises: { id: ExerciseId; name: string }[];
  onSave: (input: GoalInput) => boolean;
  onDelete: (id: string) => void;
}

interface Draft {
  id?: string;
  type: Goal['type'];
  exId: string;
  target: string;
}

const NEW_DRAFT: Draft = { type: 'lift', exId: '', target: '' };

function currentText(data: AppData, draft: Draft): string {
  if (draft.type === 'weight') {
    const cur = goalCurrent(data, { type: 'weight' });
    return cur !== null ? `Poids actuel : ${fmtKg(cur)} kg` : 'Aucune pesée enregistrée : ajoute-en une plus bas.';
  }
  return draft.exId ? `Record actuel : ${fmtKg(goalCurrent(data, { type: 'lift', exId: draft.exId }) ?? 0)} kg` : '';
}

/** Objectifs de charge et de poids, avec progression et date estimée d'arrivée. */
export function GoalsCard({ rows, exercises, onSave, onDelete }: Props) {
  const { colors } = useTheme();
  const data = useAppStore((s) => s.data);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const close = (): void => {
    setDraft(null);
    setConfirmDelete(false);
  };
  const editing = Boolean(draft?.id);

  return (
    <Card>
      <SectionTitle flush>Objectifs</SectionTitle>

      {rows.length === 0 ? (
        <Text size={13} tone="muted" align="center" style={{ paddingBottom: 16, lineHeight: 20 }}>
          {'Fixe-toi une cible (« squat 100 kg », poids de corps…)\net suis ta progression jusqu\'à l\'estimation d\'arrivée.'}
        </Text>
      ) : null}

      {rows.map((row) => (
        <Pressable
          key={row.goal.id}
          accessibilityRole="button"
          accessibilityLabel={`Objectif ${row.name}`}
          onPress={() => setDraft({ id: row.goal.id, type: row.goal.type, exId: row.goal.exId ?? '', target: String(row.goal.target) })}
          style={{ backgroundColor: colors.card2, borderRadius: 16, padding: 14, marginBottom: 10 }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
              {row.progress.done ? <Icon name="check" size={16} color={colors.green} /> : null}
              <Text weight={700} size={14} color="#FFFFFF" numberOfLines={1} style={{ flexShrink: 1 }}>
                {row.name}
              </Text>
            </View>
            <Text size={13} weight={700}>
              {`${row.progress.cur === null ? '—' : fmtKg(row.progress.cur)} → ${fmtKg(row.goal.target)} kg`}
            </Text>
          </View>
          <View style={{ height: 6, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 3, marginVertical: 10, overflow: 'hidden' }}>
            <View style={{ width: `${Math.round(row.progress.pct)}%`, height: '100%', backgroundColor: row.progress.done ? colors.green : colors.cBlue, borderRadius: 3 }} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
            <Text size={11} tone="dim">{`${Math.round(row.progress.pct)} %`}</Text>
            <Text size={11} tone="dim" align="right" style={{ flex: 1 }}>
              {row.etaText}
            </Text>
          </View>
        </Pressable>
      ))}

      <Button label="Ajouter un objectif" icon="plus" variant="solid" fullWidth onPress={() => setDraft(NEW_DRAFT)} />

      <Sheet visible={draft !== null} onClose={close} title={editing ? "Modifier l'objectif" : 'Nouvel objectif'} accent={colors.cGreen}>
        {draft ? (
          <View>
            {!editing ? (
              <View style={{ flexDirection: 'row', gap: 6, marginBottom: 14 }}>
                <ChoiceChip label="Exercice" selected={draft.type === 'lift'} onPress={() => setDraft({ ...draft, type: 'lift' })} />
                <ChoiceChip label="Poids de corps" selected={draft.type === 'weight'} onPress={() => setDraft({ ...draft, type: 'weight' })} />
              </View>
            ) : null}

            {draft.type === 'lift' ? (
              <View style={{ marginBottom: 6 }}>
                <Text size={10} weight={600} tone="muted" style={{ marginBottom: 6 }}>
                  EXERCICE
                </Text>
                <SelectField
                  title="Exercice"
                  placeholder="Choisir…"
                  disabled={editing}
                  value={draft.exId}
                  options={exercises.map((e) => ({ value: e.id, label: e.name }))}
                  onChange={(exId) => setDraft({ ...draft, exId })}
                />
              </View>
            ) : null}

            <Text size={13} tone="dim" style={{ marginVertical: 10 }}>
              {currentText(data, draft)}
            </Text>

            <Text size={10} weight={600} tone="muted" style={{ marginBottom: 6 }}>
              CIBLE (KG)
            </Text>
            <CommitInput
              variant="big"
              numeric
              value={draft.target}
              placeholder="100"
              style={{ width: '100%' }}
              accessibilityLabel="Cible en kilos"
              onCommit={(target) => setDraft((d) => (d ? { ...d, target } : d))}
              onLiveChange={(target) => setDraft((d) => (d ? { ...d, target } : d))}
            />

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
              {editing ? (
                <Button
                  label={confirmDelete ? 'Confirmer' : 'Supprimer'}
                  variant="danger"
                  style={{ flex: 1, alignSelf: 'stretch' }}
                  onPress={() => {
                    if (!confirmDelete) {
                      setConfirmDelete(true);
                      return;
                    }
                    if (draft.id) onDelete(draft.id);
                    close();
                  }}
                />
              ) : (
                <Button label="Annuler" variant="ghost" style={{ flex: 1, alignSelf: 'stretch' }} onPress={close} />
              )}
              <Button
                label="Enregistrer"
                variant="green"
                style={{ flex: 1, alignSelf: 'stretch' }}
                onPress={() => {
                  const input: GoalInput = { type: draft.type, target: draft.target };
                  if (draft.id) input.id = draft.id;
                  if (draft.type === 'lift' && draft.exId) input.exId = draft.exId;
                  if (onSave(input)) close();
                }}
              />
            </View>
          </View>
        ) : null}
      </Sheet>
    </Card>
  );
}
