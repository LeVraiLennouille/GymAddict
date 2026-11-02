import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import type { ReadinessInput } from '@/domain/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Button } from '@/ui/Button';
import { Icon } from '@/ui/Icon';
import { Sheet } from '@/ui/Sheet';
import { Text } from '@/ui/Text';

type Field = keyof ReadinessInput;

const ITEMS: { field: Field; label: string; low: string; high: string }[] = [
  { field: 'sleep', label: 'Qualité du sommeil', low: 'Mauvais', high: 'Parfait' },
  { field: 'stress', label: 'Énergie et stress', low: 'Épuisé', high: 'Plein de feu' },
  { field: 'soreness', label: 'État musculaire', low: 'Courbaturé', high: 'Frais' },
];

interface Props {
  visible: boolean;
  pseudo: string;
  onClose: () => void;
  onSubmit: (input: ReadinessInput) => void;
}

export function ReadinessSheet({ visible, pseudo, onClose, onSubmit }: Props) {
  const { colors } = useTheme();
  const [values, setValues] = useState<ReadinessInput>({ sleep: 3, stress: 3, soreness: 3 });

  useEffect(() => {
    if (visible) setValues({ sleep: 3, stress: 3, soreness: 3 });
  }, [visible]);

  return (
    <Sheet visible={visible} onClose={onClose} title="Check-in">
      <Text size={12} tone="dim" style={{ marginBottom: 20 }}>
        {'Salut '}
        <Text size={12} weight={700} color={colors.green}>
          {pseudo || 'Athlète'}
        </Text>
        {" ! Comment tu te sens aujourd'hui ?"}
      </Text>
      <Text size={10} tone="muted" align="center" style={{ marginBottom: 16 }}>
        1 = Très mauvais · 5 = Parfait
      </Text>

      {ITEMS.map((item) => (
        <View key={item.field} style={{ marginBottom: 22 }}>
          <Text weight={600} size={14} style={{ marginBottom: 10 }}>
            {item.label}
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text size={11} tone="muted">{item.low}</Text>
            <Text size={11} tone="muted">{item.high}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 6 }} accessibilityRole="radiogroup">
            {[1, 2, 3, 4, 5].map((n) => {
              const active = n <= values[item.field];
              return (
                <Pressable
                  key={n}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: values[item.field] === n }}
                  accessibilityLabel={`${item.label} : ${n} sur 5`}
                  onPress={() => setValues((v) => ({ ...v, [item.field]: n }))}
                  style={{ padding: 4, borderRadius: 8, opacity: active ? 1 : 0.25, transform: [{ scale: active ? 1.06 : 1 }] }}
                >
                  <Icon name="star" size={30} color={colors.cYellow} filled={active} />
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}

      <Button label="Démarrer" variant="solid" fullWidth onPress={() => onSubmit(values)} style={{ marginTop: 8 }} />
    </Sheet>
  );
}
