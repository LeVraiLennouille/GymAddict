import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useAppStore } from '@/data/store/appStore';
import { fmtDateShort } from '@/domain/format/dates';
import { fmtKg } from '@/domain/format/numbers';
import { barChartGeometry, lineChartGeometry } from '@/domain/rules/charts';
import { liftHistory, weeklyTonnageHistory } from '@/domain/rules/statsView';
import type { ExerciseId } from '@/domain/types';
import { Card } from '@/ui/Card';
import { ChoiceChip } from '@/ui/ChoiceChip';
import { SectionTitle } from '@/ui/SectionTitle';
import { SelectField } from '@/ui/SelectField';
import { Text } from '@/ui/Text';
import { BarChart, LineChart } from './Charts';

type Mode = 'max' | 'avg' | 'tonnage';

const MODES: readonly { mode: Mode; label: string }[] = [
  { mode: 'max', label: 'Max' },
  { mode: 'avg', label: 'Moy' },
  { mode: 'tonnage', label: 'Tonnage' },
];

/** Évolution d'un exercice : charge max, charge moyenne ou tonnage hebdomadaire. */
export function LoadsCard({ exercises }: { exercises: { id: ExerciseId; name: string }[] }) {
  const data = useAppStore((s) => s.data);
  const [mode, setMode] = useState<Mode>('max');
  const [picked, setPicked] = useState<ExerciseId | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  // Par défaut : le premier exercice qui a déjà un historique.
  const exId = picked ?? exercises.find((e) => liftHistory(data, e.id).length > 0)?.id ?? exercises[0]?.id ?? '';

  const view = useMemo(() => {
    if (mode === 'tonnage') {
      const weeks = weeklyTonnageHistory(data, exId);
      return {
        kind: 'bar' as const,
        series: weeks.map((w) => ({ key: w.week, value: w.tonnage })),
        reads: weeks.map((w) => `${Math.round(w.tonnage).toLocaleString('fr-FR')} kg·reps · semaine du ${fmtDateShort(w.week)}`),
      };
    }
    const points = liftHistory(data, exId);
    return {
      kind: 'line' as const,
      series: points.map((p) => ({ key: p.date, value: mode === 'max' ? p.max : p.avg })),
      reads: points.map((p) => `${fmtKg(mode === 'max' ? p.max : p.avg)} kg · ${fmtDateShort(p.date)}`),
    };
  }, [data, exId, mode]);

  const select = (i: number): void => setSelected(i);
  const reading = selected !== null ? view.reads[selected] : undefined;

  return (
    <Card>
      <SectionTitle flush>Évolution des charges</SectionTitle>
      <View style={{ gap: 10, marginBottom: 14 }}>
        <SelectField
          title="Exercice"
          value={exId}
          options={exercises.map((e) => ({ value: e.id, label: e.name }))}
          onChange={(id) => {
            setPicked(id);
            setSelected(null);
          }}
        />
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {MODES.map((m) => (
            <ChoiceChip
              key={m.mode}
              label={m.label}
              selected={mode === m.mode}
              onPress={() => {
                setMode(m.mode);
                setSelected(null);
              }}
            />
          ))}
        </View>
      </View>

      {view.series.length === 0 ? (
        <Text size={13} tone="muted" align="center" style={{ paddingVertical: 28, lineHeight: 20 }}>
          {'Aucune donnée pour cet exercice.\nLance ta première séance !'}
        </Text>
      ) : (
        <>
          {view.kind === 'bar' ? (
            <BarChart geometry={barChartGeometry(view.series)} onSelect={select} label="Tonnage hebdomadaire" />
          ) : (
            <LineChart geometry={lineChartGeometry(view.series)} onSelect={select} label="Évolution de la charge" />
          )}
          <Text size={12} tone="dim" align="center" style={{ marginTop: 6, minHeight: 18 }}>
            {reading ?? 'Touche un point pour voir la valeur'}
          </Text>
        </>
      )}
    </Card>
  );
}
