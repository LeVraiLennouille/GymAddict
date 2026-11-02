import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useAppStore } from '@/data/store/appStore';
import { useTodayKey } from '@/data/store/useTodayKey';
import { fmtDateShort, isDateKey } from '@/domain/format/dates';
import { fmtWeight, weightChartGeometry } from '@/domain/rules/charts';
import { weightPoints, type WeightRange } from '@/domain/rules/statsView';
import type { DateKey } from '@/domain/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { ChoiceChip } from '@/ui/ChoiceChip';
import { CommitInput } from '@/ui/CommitInput';
import { Icon } from '@/ui/Icon';
import { SectionTitle } from '@/ui/SectionTitle';
import { Text } from '@/ui/Text';
import { showToast } from '@/ui/feedbackStore';
import { WeightChart } from './Charts';

const RANGES: readonly { value: WeightRange; label: string }[] = [
  { value: '30', label: '30 j' },
  { value: '90', label: '90 j' },
  { value: 'all', label: 'Tout' },
];

interface Props {
  onAdd: (raw: string, date: DateKey) => boolean;
  onDelete: (date: DateKey) => void;
}

/** Courbe et journal du poids de corps. */
export function WeightCard({ onAdd, onDelete }: Props) {
  const { colors } = useTheme();
  const data = useAppStore((s) => s.data);
  const today = useTodayKey();
  const [range, setRange] = useState<WeightRange>('90');
  const [selected, setSelected] = useState<number | null>(null);
  const [kg, setKg] = useState('');
  const [date, setDate] = useState<string>(today);
  const [pendingDelete, setPendingDelete] = useState<DateKey | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  const points = useMemo(() => weightPoints(data, range), [data, range]);
  const geometry = useMemo(() => weightChartGeometry(points), [points]);
  const last = data.weightLog[data.weightLog.length - 1];
  const first = points[0];
  const lastPoint = points[points.length - 1];
  const delta = points.length >= 2 && first && lastPoint ? lastPoint.kg - first.kg : null;
  const picked = selected !== null ? points[selected] : undefined;

  const askDelete = (d: DateKey): void => {
    if (pendingDelete !== d) {
      setPendingDelete(d);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setPendingDelete(null), 3000);
      return;
    }
    setPendingDelete(null);
    onDelete(d);
  };

  return (
    <Card>
      <SectionTitle flush>Poids de corps</SectionTitle>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <Text display size={42} color="#FFFFFF" style={{ lineHeight: 46 }}>
          {last ? fmtWeight(last.kg) : '—'}
          <Text size={14} tone="dim">
            {' kg'}
          </Text>
        </Text>
        <Text size={12} tone="dim" style={{ flex: 1 }}>
          {delta !== null && first ? (
            <>
              <Text size={12} weight={700} color={delta > 0 ? colors.red : delta < 0 ? colors.green : colors.onCard.dim}>
                {`${delta > 0 ? '+' : ''}${fmtWeight(delta)} kg`}
              </Text>
              {` depuis le ${fmtDateShort(first.date)}`}
            </>
          ) : last ? (
            `Dernière pesée le ${fmtDateShort(last.date)}`
          ) : (
            'Ajoute ta première pesée'
          )}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 6, marginVertical: 12 }}>
        {RANGES.map((r) => (
          <ChoiceChip
            key={r.value}
            label={r.label}
            selected={range === r.value}
            onPress={() => {
              setRange(r.value);
              setSelected(null);
            }}
          />
        ))}
      </View>

      {geometry ? (
        <WeightChart geometry={geometry} onSelect={setSelected} />
      ) : (
        <Text size={13} tone="muted" align="center" style={{ paddingVertical: 20, lineHeight: 20 }}>
          {points.length ? 'Ajoute une deuxième pesée\npour voir la courbe.' : 'Aucune pesée sur cette période.'}
        </Text>
      )}
      <Text size={12} tone="dim" align="center" style={{ minHeight: 18, marginTop: 4 }}>
        {picked ? `${fmtWeight(picked.kg)} kg · ${fmtDateShort(picked.date)}` : points.length >= 2 ? 'Touche un point pour voir la valeur' : ''}
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginTop: 14 }}>
        <View style={{ flex: 1, gap: 3 }}>
          <Text size={10} weight={600} tone="muted" align="center">
            KG
          </Text>
          <CommitInput numeric value={kg} placeholder="kg" accessibilityLabel="Poids en kilos" onCommit={setKg} onLiveChange={setKg} />
        </View>
        <View style={{ flex: 1.6, gap: 3 }}>
          <Text size={10} weight={600} tone="muted" align="center">
            DATE (AAAA-MM-JJ)
          </Text>
          <CommitInput value={date} keyboardType="numbers-and-punctuation" maxLength={10} accessibilityLabel="Date de la pesée" onCommit={setDate} onLiveChange={setDate} />
        </View>
        <Button
          label="Ajouter"
          variant="solid"
          style={{ marginBottom: 0 }}
          onPress={() => {
            if (!isDateKey(date)) {
              showToast('Date invalide (AAAA-MM-JJ)');
              return;
            }
            if (onAdd(kg, date)) {
              setKg('');
              setDate(today);
            }
          }}
        />
      </View>

      {data.weightLog.length ? (
        <View style={{ marginTop: 14 }}>
          {data.weightLog
            .slice(-6)
            .reverse()
            .map((e) => (
              <View key={e.date} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderTopWidth: 1, borderTopColor: colors.border }}>
                <Text size={13} tone="dim" style={{ flex: 1 }}>
                  {fmtDateShort(e.date)}
                </Text>
                <Text size={14} weight={700} style={{ marginRight: 12 }}>{`${fmtWeight(e.kg)} kg`}</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Supprimer la pesée"
                  onPress={() => askDelete(e.date)}
                  style={{ minWidth: 44, minHeight: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: pendingDelete === e.date ? colors.red : colors.card2, paddingHorizontal: 8 }}
                >
                  {pendingDelete === e.date ? (
                    <Text size={11} weight={800} color="#FFFFFF">
                      Sûr ?
                    </Text>
                  ) : (
                    <Icon name="trash" size={16} color={colors.onCard.dim} />
                  )}
                </Pressable>
              </View>
            ))}
        </View>
      ) : null}
    </Card>
  );
}
