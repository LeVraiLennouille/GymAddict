import type { RadarGeometry } from '@/domain/rules/charts';
import { Card } from '@/ui/Card';
import { SectionTitle } from '@/ui/SectionTitle';
import { Text } from '@/ui/Text';
import { RadarChart } from './Charts';

/** Répartition du volume par muscle sur les 7 derniers jours. */
export function RadarCard({ geometry }: { geometry: RadarGeometry }) {
  return (
    <Card>
      <SectionTitle flush>Répartition musculaire</SectionTitle>
      <Text size={10} tone="muted" style={{ marginTop: -6, marginBottom: 8 }}>
        7 derniers jours
      </Text>
      <RadarChart geometry={geometry} />
      {geometry.hasData ? null : (
        <Text size={12} tone="dim" align="center" style={{ marginTop: 4 }}>
          Aucune série validée sur les 7 derniers jours
        </Text>
      )}
    </Card>
  );
}
