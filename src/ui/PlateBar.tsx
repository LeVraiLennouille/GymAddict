import { View } from 'react-native';
import Svg, { G, Rect } from 'react-native-svg';
import { plateColor, plateScale } from '@/domain/rules/plates';
import type { Unit } from '@/domain/types';
import { alpha } from '@/theme/color';

export interface PlateSpec {
  size: number;
  /** `false` : emplacement vide, dessiné en pointillé (progression de la séance). */
  filled?: boolean;
}

const WIDTH = 320;
const HEIGHT = 100;
const INNER_LEFT = 92; // épaulement gauche : les disques s'empilent vers l'extérieur
const INNER_RIGHT = 228;
const GAP = 2;

interface PlateBarProps {
  /** Disques d'un côté, du plus proche de la barre au plus éloigné ; le dessin est symétrique. */
  plates: readonly PlateSpec[];
  unit: Unit;
  label: string;
  /** Version basse pour les cartes (disques moins hauts). */
  compact?: boolean;
}

/** Barre olympique chargée de disques, aux couleurs d'haltérophilie. */
export function PlateBar({ plates, unit, label, compact = false }: PlateBarProps) {
  const plateMax = compact ? 62 : 92;
  const view = compact ? { y: 17, h: 66 } : { y: 0, h: HEIGHT };
  const n = plates.length;
  const thickness = Math.max(4, Math.min(12, 78 / Math.max(1, n) - GAP));
  const step = thickness + GAP;
  const outerLeft = INNER_LEFT - n * step;
  const outerRight = INNER_RIGHT + n * step;

  return (
    <View style={{ width: '100%', aspectRatio: WIDTH / view.h }} accessible accessibilityRole="image" accessibilityLabel={label}>
      <Svg width="100%" height="100%" viewBox={`0 ${view.y} ${WIDTH} ${view.h}`}>
        {/* barre */}
        <Rect x={6} y={47} width={WIDTH - 12} height={6} rx={3} fill="#8C93A1" />
        {/* épaulements */}
        <Rect x={INNER_LEFT - 3} y={36} width={5} height={28} rx={2} fill="#C7CBD3" />
        <Rect x={INNER_RIGHT - 2} y={36} width={5} height={28} rx={2} fill="#C7CBD3" />
        {plates.map((plate, i) => {
          const h = Math.round(plateMax * plateScale(plate.size, unit));
          const y = 50 - h / 2;
          const color = plateColor(plate.size, unit);
          const filled = plate.filled !== false;
          const common = filled
            ? { fill: color }
            : { fill: alpha(color, 0.08), stroke: alpha(color, 0.45), strokeWidth: 1, strokeDasharray: '3 2' };
          return (
            <G key={i}>
              <Rect x={INNER_LEFT - (i + 1) * step + GAP} y={y} width={thickness} height={h} rx={2} {...common} />
              <Rect x={INNER_RIGHT + i * step + 1} y={y} width={thickness} height={h} rx={2} {...common} />
            </G>
          );
        })}
        {/* colliers */}
        {n > 0 ? (
          <>
            <Rect x={outerLeft - 6} y={42} width={5} height={16} rx={2} fill="#C7CBD3" />
            <Rect x={outerRight + 1} y={42} width={5} height={16} rx={2} fill="#C7CBD3" />
          </>
        ) : null}
      </Svg>
    </View>
  );
}
