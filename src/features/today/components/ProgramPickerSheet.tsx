import { Pressable, View } from 'react-native';
import { suggestedProgramKey } from '@/domain/rules/program';
import { dayNameOf } from '@/domain/format/dates';
import type { DateKey, ProgramConfig, ProgramId } from '@/domain/types';
import { useTheme } from '@/theme/ThemeProvider';
import { PROGRAM_HEX } from '@/theme/tokens';
import { Icon } from '@/ui/Icon';
import { Sheet } from '@/ui/Sheet';
import { Text } from '@/ui/Text';

interface Props {
  visible: boolean;
  onClose: () => void;
  date: DateKey;
  config: ProgramConfig;
  keys: ProgramId[];
  /** Programme choisi à la main pour ce jour, s'il y en a un. */
  override: ProgramId | null;
  onSelect: (key: ProgramId) => void;
  onReset: () => void;
}

export function ProgramPickerSheet({ visible, onClose, date, config, keys, override, onSelect, onReset }: Props) {
  const { colors } = useTheme();
  const suggested = suggestedProgramKey(config, dayNameOf(date));

  return (
    <Sheet visible={visible} onClose={onClose} title="Programme du jour" accent={colors.cBlue}>
      <Text size={13} tone="dim" style={{ marginBottom: 14, lineHeight: 20 }}>
        Change uniquement le programme d'aujourd'hui. Le planning de la semaine ne bouge pas.
      </Text>
      <View style={{ gap: 8 }}>
        {keys.map((key) => {
          const prog = config.programs[key];
          if (!prog) return null;
          const selected = override ? override === key : key === suggested;
          return (
            <Pressable
              key={key}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`${prog.fullName}${key === suggested ? ', suggéré' : ''}`}
              onPress={() => onSelect(key)}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                backgroundColor: colors.card2,
                borderWidth: 2,
                borderColor: selected ? colors.cGreen : 'transparent',
                borderRadius: 24,
                paddingVertical: 13,
                paddingHorizontal: 14,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}
            >
              <View style={{ width: 14, height: 34, borderRadius: 99, backgroundColor: PROGRAM_HEX[prog.color] }} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text display size={20} color="#FFFFFF">
                  {prog.fullName}
                </Text>
                <Text size={12} color="#A6ACB8" style={{ marginTop: 2 }}>
                  {`${prog.type === 'rest' ? 'Repos' : 'Salle'}${key === suggested ? ' · Suggéré' : ''}`}
                </Text>
              </View>
              {selected ? <Icon name="check" size={22} color={colors.green} /> : null}
            </Pressable>
          );
        })}
      </View>
      {override ? (
        <Pressable
          accessibilityRole="button"
          onPress={onReset}
          style={{ marginTop: 12, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}
        >
          <Icon name="undo" size={16} color={colors.onCard.dim} />
          <Text size={14} tone="dim">
            Revenir au programme suggéré
          </Text>
        </Pressable>
      ) : null}
    </Sheet>
  );
}
