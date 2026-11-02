import { View } from 'react-native';
import { fmtKg } from '@/domain/format/numbers';
import { calc1RM } from '@/domain/rules/oneRepMax';
import { getWarmupSets } from '@/domain/rules/warmup';
import type { Exercise, PersonalRecord } from '@/domain/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Sheet } from '@/ui/Sheet';
import { Text } from '@/ui/Text';

interface Props {
  exercise: Exercise | null;
  record: PersonalRecord | undefined;
  onClose: () => void;
}

/** Montée en charge basée sur le record personnel de l'exercice. */
export function WarmupSheet({ exercise, record, onClose }: Props) {
  const { colors } = useTheme();
  const sets = getWarmupSets(record?.weight ?? 0);
  const oneRm = record && record.reps ? calc1RM(record.weight, record.reps) : 0;

  return (
    <Sheet visible={exercise !== null} onClose={onClose} title="Échauffement">
      <Text weight={700} size={15} color="#FFFFFF">
        {exercise?.name ?? ''}
      </Text>
      {record ? (
        <Text size={12} tone="dim" style={{ marginTop: 4, marginBottom: 14 }}>
          {`Record : ${fmtKg(record.weight)} kg × ${record.reps}${oneRm ? ` · 1RM estimé ${fmtKg(oneRm)} kg` : ''}`}
        </Text>
      ) : null}

      {sets.length === 0 ? (
        <Text size={13} tone="muted" align="center" style={{ paddingVertical: 20 }}>
          Aucune donnée
        </Text>
      ) : (
        sets.map((s, i) => (
          <View
            key={s.pct}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.card2, borderRadius: 12, paddingVertical: 11, paddingHorizontal: 12, marginBottom: 6 }}
          >
            <Text display size={16} color={colors.cYellow} style={{ width: 32 }}>
              {String(i + 1)}
            </Text>
            <View style={{ flex: 1 }}>
              <Text weight={700} size={14} color="#FFFFFF">
                {s.label}
              </Text>
              <Text size={12} tone="dim">{`${s.reps} reps · ${s.pct}%`}</Text>
            </View>
            <Text display size={20} color="#FFFFFF">
              {`${fmtKg(s.weight)} kg`}
            </Text>
          </View>
        ))
      )}
    </Sheet>
  );
}
