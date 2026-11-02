import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { toNumber } from '@/domain/format/numbers';
import type { SetView } from '@/domain/rules/todayView';
import type { Exercise, PersonalRecord } from '@/domain/types';
import { useTheme } from '@/theme/ThemeProvider';
import { CommitInput } from '@/ui/CommitInput';
import { Icon } from '@/ui/Icon';
import { Text } from '@/ui/Text';

interface SetRowProps {
  exercise: Exercise;
  set: SetView;
  record: PersonalRecord | undefined;
  showLabels: boolean;
  onToggle: () => void;
  onCommitWeight: (text: string) => void;
  onCommitReps: (text: string) => void;
}

export function SetRow({ exercise, set, record, showLabels, onToggle, onCommitWeight, onCommitReps }: SetRowProps) {
  const { colors } = useTheme();
  // Pendant la saisie, le drapeau PR réagit tout de suite à la charge tapée.
  const [liveWeight, setLiveWeight] = useState<string | null>(null);
  const flagged = liveWeight !== null ? Boolean(record) && toNumber(liveWeight) > (record?.weight ?? Infinity) : set.atRecord;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: set.done }}
        accessibilityLabel={`Série ${set.index + 1}`}
        onPress={onToggle}
        style={({ pressed }) => ({
          width: 34,
          height: 34,
          borderRadius: 17,
          borderWidth: 2,
          borderColor: set.done ? colors.cGreen : '#3A3E48',
          backgroundColor: set.done ? colors.cGreen : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 4,
          transform: [{ scale: pressed ? 0.9 : 1 }],
        })}
      >
        {set.done ? <Icon name="check" size={18} color="#FFFFFF" strokeWidth={3} /> : null}
      </Pressable>

      <View style={{ flex: 1, gap: 3 }}>
        {showLabels ? (
          <Text size={10} weight={600} tone="muted" align="center">
            KG
          </Text>
        ) : null}
        <CommitInput
          numeric
          value={set.weight}
          placeholder="kg"
          accessibilityLabel={`Charge de la série ${set.index + 1}, en kilos`}
          highlight={flagged ? colors.cYellow : undefined}
          onLiveChange={setLiveWeight}
          onEnd={() => setLiveWeight(null)}
          onCommit={(text) => {
            setLiveWeight(null);
            onCommitWeight(text);
          }}
        />
      </View>

      <View style={{ flex: 1, gap: 3 }}>
        {showLabels ? (
          <Text size={10} weight={600} tone="muted" align="center">
            {exercise.isTime ? 'SEC' : 'REPS'}
          </Text>
        ) : null}
        <CommitInput
          integer
          value={set.reps}
          placeholder={exercise.isTime ? 'sec' : 'reps'}
          accessibilityLabel={`${exercise.isTime ? 'Secondes' : 'Répétitions'} de la série ${set.index + 1}`}
          onCommit={onCommitReps}
        />
      </View>

      <View style={{ width: 34, marginBottom: 12, alignItems: 'center' }}>
        {flagged ? (
          <View style={{ backgroundColor: colors.cYellow, borderRadius: 99, paddingVertical: 3, paddingHorizontal: 8 }}>
            <Text size={10} weight={800} color="#14161B">
              PR
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
