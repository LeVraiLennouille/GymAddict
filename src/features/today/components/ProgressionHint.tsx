import { View } from 'react-native';
import { fmtKg } from '@/domain/format/numbers';
import type { ProgressionSuggestion } from '@/domain/types';
import { alpha } from '@/theme/color';
import { useTheme } from '@/theme/ThemeProvider';
import { Button } from '@/ui/Button';
import { Icon } from '@/ui/Icon';
import { Text } from '@/ui/Text';

interface Props {
  suggestion: ProgressionSuggestion;
  applied: boolean;
  onApply: () => void;
}

const B = ({ children }: { children: string }) => (
  <Text weight={700} color="#FFFFFF">
    {children}
  </Text>
);

/** Double progression : garder la charge ou la monter. */
export function ProgressionHint({ suggestion, applied, onApply }: Props) {
  const { colors } = useTheme();

  if (suggestion.kind === 'hold') {
    return (
      <View style={{ backgroundColor: colors.card2, borderRadius: 12, padding: 12, marginBottom: 12 }}>
        <Text size={12} tone="dim" style={{ lineHeight: 18 }}>
          {'Garde '}
          <B>{`${fmtKg(suggestion.from)} kg`}</B>
          {' et vise '}
          <B>{`${suggestion.target} reps`}</B>
          {` sur chaque série pour passer à ${fmtKg(suggestion.next)} kg.`}
        </Text>
      </View>
    );
  }

  const tint = alpha(colors.green, 0.14);
  if (applied) {
    return (
      <View style={{ backgroundColor: tint, borderRadius: 12, padding: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Icon name="check" size={16} color={colors.green} />
        <Text size={12} tone="dim">
          {'Charge passée à '}
          <B>{`${fmtKg(suggestion.weight)} kg`}</B>
        </Text>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: tint, borderRadius: 12, padding: 12, marginBottom: 12, gap: 10 }}>
      <Text size={12} tone="dim" style={{ lineHeight: 18 }}>
        <B>Prêt à monter !</B>
        {' Toutes les séries validées : essaie '}
        <B>{`${fmtKg(suggestion.weight)} kg`}</B>
        {` (+${fmtKg(suggestion.step)}).`}
      </Text>
      <Button label="Appliquer" small variant="green" onPress={onApply} />
    </View>
  );
}
