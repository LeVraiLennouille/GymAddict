import { View } from 'react-native';
import { fmtKg } from '@/domain/format/numbers';
import type { PrRow } from '@/domain/rules/statsView';
import { useTheme } from '@/theme/ThemeProvider';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { CommitInput } from '@/ui/CommitInput';
import { SectionTitle } from '@/ui/SectionTitle';
import { Text } from '@/ui/Text';
import { useState } from 'react';

interface Props {
  rows: PrRow[];
  bodyWeight: number;
  onSaveBodyWeight: (raw: string) => void;
}

/** Records personnels, avec le ratio charge / poids de corps. */
export function PrCard({ rows, bodyWeight, onSaveBodyWeight }: Props) {
  const { colors } = useTheme();
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <Card>
      <SectionTitle flush>Records personnels</SectionTitle>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <Text size={13} tone="dim" style={{ flex: 1 }}>
          Poids de corps
        </Text>
        <CommitInput variant="big" numeric value={String(bodyWeight)} style={{ width: 84 }} accessibilityLabel="Poids de corps en kilos" onCommit={setDraft} onLiveChange={setDraft} />
        <Text size={13} tone="dim">
          kg
        </Text>
        <Button label="OK" icon="check" variant="solid" small onPress={() => {
            onSaveBodyWeight(draft ?? String(bodyWeight));
            setDraft(null);
          }} />
      </View>

      {rows.length === 0 ? (
        <Text size={13} tone="muted" align="center" style={{ paddingVertical: 16, lineHeight: 20 }}>
          {'Aucun record enregistré.\nEntre tes charges pour les voir ici !'}
        </Text>
      ) : (
        rows.map((row, i) => (
          <View
            key={row.id}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingVertical: 11, borderTopWidth: i === 0 ? 0 : 1, borderTopColor: colors.border }}
          >
            <View style={{ flex: 1 }}>
              <Text weight={700} size={14} numberOfLines={1}>
                {row.name}
              </Text>
              <Text size={11} tone="muted" style={{ marginTop: 2 }}>
                {`${row.record.date}${row.record.reps ? ` · ${row.record.reps} reps` : ''} · 1RM ~${fmtKg(row.oneRm)} kg`}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text display size={22} color={colors.cYellow}>{`${fmtKg(row.record.weight)} kg`}</Text>
              <Text size={10} color={colors.blue}>{`${fmtKg(row.bodyRatio)}× BW`}</Text>
            </View>
          </View>
        ))
      )}
    </Card>
  );
}
