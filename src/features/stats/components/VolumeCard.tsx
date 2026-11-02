import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useAppStore } from '@/data/store/appStore';
import { MUSCLE_KEYS, MUSCLE_LABELS } from '@/domain/defaults/constants';
import { dateToKey, fmtDateShort } from '@/domain/format/dates';
import { buildVolumeView, fmtSets, volumeTargets, type VolumeState } from '@/domain/rules/volume';
import type { MuscleKey } from '@/domain/types';
import { alpha } from '@/theme/color';
import { useTheme } from '@/theme/ThemeProvider';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { CommitInput } from '@/ui/CommitInput';
import { Icon } from '@/ui/Icon';
import { SectionTitle } from '@/ui/SectionTitle';
import { Sheet } from '@/ui/Sheet';
import { Text } from '@/ui/Text';

interface Props {
  onSave: (targets: Record<MuscleKey, [number, number]>) => boolean;
  onReset: () => void;
}

const MAX_WEEKS_BACK = 26;

/** Séries de travail par muscle et par semaine, comparées à une fourchette cible. */
export function VolumeCard({ onSave, onReset }: Props) {
  const { colors } = useTheme();
  const data = useAppStore((s) => s.data);
  const [offset, setOffset] = useState(0);
  const [editing, setEditing] = useState(false);
  const view = useMemo(() => buildVolumeView(data, offset), [data, offset]);

  const stateColor: Record<VolumeState, string> = { under: colors.orange, in: colors.green, over: colors.red };
  const pct = (v: number): number => Math.min(100, (v / view.scale) * 100);

  return (
    <Card>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <SectionTitle flush>Volume hebdo</SectionTitle>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Semaine précédente"
            disabled={offset <= -MAX_WEEKS_BACK}
            onPress={() => setOffset((o) => Math.max(-MAX_WEEKS_BACK, o - 1))}
            style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.card2, alignItems: 'center', justifyContent: 'center', opacity: offset <= -MAX_WEEKS_BACK ? 0.4 : 1 }}
          >
            <Icon name="back" size={16} color="#FFFFFF" />
          </Pressable>
          <Text size={12} weight={600} align="center" style={{ minWidth: 110 }}>
            {offset === 0 ? 'Cette semaine' : `Semaine du ${fmtDateShort(dateToKey(view.monday))}`}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Semaine suivante"
            disabled={offset >= 0}
            onPress={() => setOffset((o) => Math.min(0, o + 1))}
            style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.card2, alignItems: 'center', justifyContent: 'center', opacity: offset >= 0 ? 0.4 : 1 }}
          >
            <Icon name="chev" size={16} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>

      <View style={{ gap: 12 }}>
        {view.rows.map((row) => (
          <View key={row.muscle} accessible accessibilityLabel={`${row.label} : ${fmtSets(row.actual)} séries sur ${row.min} à ${row.max}`}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text size={12} weight={600} style={{ width: 62 }}>
                {row.label}
              </Text>
              <View style={{ flex: 1, height: 12, borderRadius: 6, backgroundColor: colors.card2, overflow: 'hidden' }}>
                <View style={{ position: 'absolute', left: `${pct(row.min)}%`, width: `${pct(row.max) - pct(row.min)}%`, top: 0, bottom: 0, backgroundColor: alpha(colors.green, 0.18) }} />
                <View style={{ width: `${pct(row.actual)}%`, height: '100%', backgroundColor: stateColor[row.state], borderRadius: 6 }} />
                {row.planned > 0 ? (
                  <View style={{ position: 'absolute', left: `${pct(row.actual)}%`, width: `${Math.max(0, Math.min(pct(row.actual + row.planned), 100) - pct(row.actual))}%`, top: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.22)' }} />
                ) : null}
              </View>
              <View style={{ width: 92, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'flex-end', gap: 3 }}>
                <Text size={13} weight={800} color="#FFFFFF">
                  {fmtSets(row.actual)}
                </Text>
                {row.planned > 0 ? (
                  <Text size={11} color={colors.blue}>{`+${fmtSets(row.planned)}`}</Text>
                ) : null}
                <Text size={10} tone="muted">{`/ ${row.min}–${row.max}`}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <Text size={12} tone="dim" style={{ marginTop: 14, lineHeight: 18 }}>
        {view.note}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
        <Text size={10} tone="muted" style={{ flex: 1 }}>
          Zone verte : cible (séries / semaine) · barre claire : prévu au programme
        </Text>
        <Button small label="Régler les objectifs" onPress={() => setEditing(true)} />
      </View>

      <TargetsSheet visible={editing} onClose={() => setEditing(false)} onSave={onSave} onReset={onReset} />
    </Card>
  );
}

function TargetsSheet({ visible, onClose, onSave, onReset }: { visible: boolean; onClose: () => void } & Props) {
  const data = useAppStore((s) => s.data);
  const [draft, setDraft] = useState<Record<MuscleKey, [string, string]> | null>(null);

  // Brouillon repris des objectifs enregistrés à chaque ouverture.
  const current = draft ?? toDraft(volumeTargets(data));
  const set = (m: MuscleKey, i: 0 | 1, v: string): void => {
    const base = draft ?? toDraft(volumeTargets(data));
    const pair: [string, string] = [...base[m]];
    pair[i] = v;
    setDraft({ ...base, [m]: pair });
  };
  const close = (): void => {
    setDraft(null);
    onClose();
  };

  return (
    <Sheet visible={visible} onClose={close} title="Objectifs de volume">
      <Text size={12} tone="dim" style={{ marginBottom: 14, lineHeight: 18 }}>
        Séries de travail par semaine et par muscle (10 à 20 est une fourchette courante pour progresser).
      </Text>
      <View style={{ gap: 8 }}>
        {MUSCLE_KEYS.map((m) => (
          <View key={m} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text size={14} weight={600} style={{ width: 82 }}>
              {MUSCLE_LABELS[m]}
            </Text>
            <View style={{ flex: 1 }}>
              <CommitInput integer maxLength={2} value={current[m][0]} accessibilityLabel={`${MUSCLE_LABELS[m]} minimum`} onCommit={(v) => set(m, 0, v)} onLiveChange={(v) => set(m, 0, v)} />
            </View>
            <Text size={12} tone="muted">
              à
            </Text>
            <View style={{ flex: 1 }}>
              <CommitInput integer maxLength={2} value={current[m][1]} accessibilityLabel={`${MUSCLE_LABELS[m]} maximum`} onCommit={(v) => set(m, 1, v)} onLiveChange={(v) => set(m, 1, v)} />
            </View>
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
        <Button
          label="Par défaut"
          variant="ghost"
          style={{ flex: 1, alignSelf: 'stretch' }}
          onPress={() => {
            onReset();
            close();
          }}
        />
        <Button
          label="Enregistrer"
          variant="green"
          style={{ flex: 1, alignSelf: 'stretch' }}
          onPress={() => {
            const targets = {} as Record<MuscleKey, [number, number]>;
            for (const m of MUSCLE_KEYS) targets[m] = [parseInt(current[m][0], 10), parseInt(current[m][1], 10)];
            if (onSave(targets)) close();
          }}
        />
      </View>
    </Sheet>
  );
}

function toDraft(targets: Record<MuscleKey, [number, number]>): Record<MuscleKey, [string, string]> {
  const out = {} as Record<MuscleKey, [string, string]>;
  for (const m of MUSCLE_KEYS) out[m] = [String(targets[m][0]), String(targets[m][1])];
  return out;
}
