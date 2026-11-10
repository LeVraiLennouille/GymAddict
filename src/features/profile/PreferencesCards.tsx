import { View } from 'react-native';
import { BAR_CHOICES, PLATE_CHOICES } from '@/domain/rules/plates';
import type { ThemeMode } from '@/domain/types';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { ChoiceChip } from '@/ui/ChoiceChip';
import { PlateBar } from '@/ui/PlateBar';
import { Text } from '@/ui/Text';
import { useSettings } from './hooks/useSettings';

const THEMES: readonly { mode: ThemeMode; label: string }[] = [
  { mode: 'system', label: 'Auto' },
  { mode: 'light', label: 'Clair' },
  { mode: 'dark', label: 'Sombre' },
];

const fmt = (n: number): string => String(n).replace('.', ',');

function Label({ children }: { children: string }) {
  return (
    <Text size={10} weight={600} tone="muted" style={{ marginBottom: 8 }}>
      {children}
    </Text>
  );
}

/** Apparence (clair / sombre / automatique) et unité des charges. */
export function AppearanceCard() {
  const s = useSettings();
  return (
    <Card>
      <Label>THÈME</Label>
      <View style={{ flexDirection: 'row', gap: 6, marginBottom: 16 }}>
        {THEMES.map((t) => (
          <ChoiceChip key={t.mode} label={t.label} selected={s.theme === t.mode} onPress={() => s.actions.setTheme(t.mode)} />
        ))}
      </View>
      <Label>UNITÉ DES CHARGES</Label>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        <ChoiceChip label="Kilogrammes (kg)" selected={s.unit === 'kg'} onPress={() => s.actions.setUnit('kg')} />
        <ChoiceChip label="Livres (lb)" selected={s.unit === 'lb'} onPress={() => s.actions.setUnit('lb')} />
      </View>
      <Text size={11} tone="muted" style={{ marginTop: 10, lineHeight: 16 }}>
        Tes données restent enregistrées en kilogrammes : tu peux changer d'unité à tout moment sans rien perdre.
      </Text>
    </Card>
  );
}

/** Barre et disques dont tu disposes : la calculatrice de disques s'y adapte. */
export function EquipmentCard() {
  const s = useSettings();
  const bars = BAR_CHOICES[s.unit].includes(s.equipment.bar) ? BAR_CHOICES[s.unit] : [...BAR_CHOICES[s.unit], s.equipment.bar].sort((a, b) => b - a);
  const choices = [...new Set([...PLATE_CHOICES[s.unit], ...s.equipment.plates])].sort((a, b) => b - a);

  return (
    <Card>
      <PlateBar
        unit={s.unit}
        plates={s.equipment.plates.map((size) => ({ size }))}
        label={`Disques disponibles : ${s.equipment.plates.map(fmt).join(', ') || 'aucun'}`}
      />
      <Label>POIDS DE LA BARRE</Label>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
        {bars.map((bar) => (
          <ChoiceChip key={bar} label={`${fmt(bar)} ${s.unit}`} selected={s.equipment.bar === bar} onPress={() => s.actions.setBar(bar)} />
        ))}
      </View>
      <Label>DISQUES DISPONIBLES (DE CHAQUE CÔTÉ)</Label>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
        {choices.map((size) => (
          <ChoiceChip key={size} label={fmt(size)} selected={s.equipment.plates.includes(size)} onPress={() => s.actions.togglePlate(size)} />
        ))}
      </View>
      <Button small label="Valeurs par défaut" variant="soft" onPress={s.actions.resetEquipment} />
    </Card>
  );
}
