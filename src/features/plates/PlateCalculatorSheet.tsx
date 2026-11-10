import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useAppStore } from '@/data/store/appStore';
import { describePlates, getEquipment, platesFor } from '@/domain/rules/plates';
import { useUnit } from '@/features/shared/useUnit';
import { useTheme } from '@/theme/ThemeProvider';
import { Button } from '@/ui/Button';
import { CommitInput } from '@/ui/CommitInput';
import { PlateBar } from '@/ui/PlateBar';
import { Sheet } from '@/ui/Sheet';
import { Text } from '@/ui/Text';

interface Props {
  visible: boolean;
  onClose: () => void;
  exerciseName: string;
  /** Charge de départ, en kilogrammes (celle de la prochaine série). */
  initialKg: number;
}

/** Calculatrice de disques : quelle combinaison charger de chaque côté de la barre. */
export function PlateCalculatorSheet({ visible, onClose, exerciseName, initialKg }: Props) {
  const { colors } = useTheme();
  const u = useUnit();
  const equipment = useAppStore((s) => getEquipment(s.data, u.unit));
  const [text, setText] = useState('');

  useEffect(() => {
    if (visible) setText(initialKg > 0 ? u.num(initialKg) : '');
    // à chaque ouverture, on repart de la charge de la série
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const total = parseFloat(text.replace(',', '.')) || 0;
  const load = platesFor(total, equipment);
  const nudge = (delta: number): void => {
    const next = Math.max(0, Math.round((total + delta) * 100) / 100);
    setText(String(next).replace('.', ','));
  };
  const steps = u.unit === 'kg' ? [-5, -2.5, 2.5, 5] : [-10, -5, 5, 10];
  const fmt = (n: number): string => String(n).replace('.', ',');

  return (
    <Sheet visible={visible} onClose={onClose} title="Disques" accent={colors.cYellow}>
      <Text size={13} weight={700} color="#FFFFFF" style={{ marginBottom: 12 }}>
        {exerciseName}
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <CommitInput
          variant="big"
          numeric
          value={text}
          placeholder="0"
          accessibilityLabel={`Charge totale en ${u.unit === 'kg' ? 'kilos' : 'livres'}`}
          style={{ width: 110 }}
          onCommit={setText}
          onLiveChange={setText}
        />
        <Text size={14} tone="dim">
          {u.unit}
        </Text>
        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'flex-end' }}>
          {steps.map((d) => (
            <Button key={d} small label={`${d > 0 ? '+' : '−'}${fmt(Math.abs(d))}`} onPress={() => nudge(d)} />
          ))}
        </View>
      </View>

      <View style={{ backgroundColor: colors.card2, borderRadius: 16, paddingVertical: 10, paddingHorizontal: 8, marginBottom: 14 }}>
        <PlateBar
          unit={u.unit}
          plates={load.perSide.map((size) => ({ size }))}
          label={`Barre chargée : ${describePlates(load)} de chaque côté`}
        />
      </View>

      {load.belowBar ? (
        <Text size={14} color={colors.orange} weight={700}>
          {`Moins lourd que la barre seule (${fmt(equipment.bar)} ${u.unit}).`}
        </Text>
      ) : (
        <>
          <Text size={10} weight={600} tone="muted" uppercase>
            De chaque côté
          </Text>
          <Text display size={30} color="#FFFFFF" style={{ marginTop: 4, marginBottom: 8 }}>
            {describePlates(load)}
          </Text>
          <Text size={13} tone="dim">
            {`Barre ${fmt(equipment.bar)} ${u.unit} · total chargé ${fmt(load.achieved)} ${u.unit}`}
          </Text>
          {load.exact ? null : (
            <Text size={12} color={colors.orange} style={{ marginTop: 6, lineHeight: 18 }}>
              {`Pas réalisable exactement avec tes disques : ${fmt(load.achieved)} ${u.unit} est la charge la plus proche en dessous.`}
            </Text>
          )}
        </>
      )}
      <Text size={11} tone="muted" style={{ marginTop: 16, lineHeight: 16 }}>
        La barre et les disques se règlent dans Profil › Matériel.
      </Text>
    </Sheet>
  );
}
