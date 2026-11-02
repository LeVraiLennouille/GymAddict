import type { ReactNode } from 'react';
import { View } from 'react-native';
import Svg, { Circle, G, Line, Path, Polygon, Rect, Text as SvgText } from 'react-native-svg';
import {
  CHART_HEIGHT,
  CHART_WIDTH,
  RADAR_HEIGHT,
  RADAR_WIDTH,
  WEIGHT_HEIGHT,
  WEIGHT_WIDTH,
  type BarChartGeometry,
  type LineChartGeometry,
  type RadarGeometry,
  type WeightChartGeometry,
} from '@/domain/rules/charts';
import { fmtDateShort } from '@/domain/format/dates';
import { alpha } from '@/theme/color';
import { useTheme } from '@/theme/ThemeProvider';
import { useTone } from '@/ui/Surface';
import { figtree } from '@/theme/fonts';

/** Fond du SVG : conserve le ratio du viewBox quelle que soit la largeur disponible. */
function Frame({ width, height, label, children }: { width: number; height: number; label: string; children: ReactNode }) {
  return (
    <View style={{ width: '100%', aspectRatio: width / height }} accessible accessibilityRole="image" accessibilityLabel={label}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        {children}
      </Svg>
    </View>
  );
}

const useChartColors = () => {
  const { colors } = useTheme();
  const tone = useTone();
  return { grid: 'rgba(255,255,255,0.08)', label: tone.muted, accent: colors.cYellow, blue: colors.blue, text: tone.text };
};

const labelProps = (fill: string) => ({ fill, fontSize: 9, fontFamily: figtree(500) });

export function LineChart({ geometry, onSelect, label }: { geometry: LineChartGeometry; onSelect: (index: number) => void; label: string }) {
  const c = useChartColors();
  return (
    <Frame width={CHART_WIDTH} height={CHART_HEIGHT} label={label}>
      {geometry.yTicks.map((t, i) => (
        <G key={i}>
          <Line x1={42} x2={308} y1={t.y} y2={t.y} stroke={c.grid} strokeWidth={1} />
          <SvgText x={36} y={t.y + 3.5} textAnchor="end" {...labelProps(c.label)}>
            {t.label}
          </SvgText>
        </G>
      ))}
      {geometry.area ? <Path d={geometry.area} fill={alpha(c.accent, 0.14)} /> : null}
      {geometry.line && geometry.points.length > 1 ? <Path d={geometry.line} stroke={c.accent} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
      {geometry.points.map((p, i) => (
        <G key={i}>
          <Circle cx={p.x} cy={p.y} r={geometry.dotRadius} fill={c.accent} />
          <Circle cx={p.x} cy={p.y} r={14} fill="transparent" onPress={() => onSelect(i)} />
        </G>
      ))}
      {geometry.xTicks.map((t, i) => (
        <SvgText key={i} x={t.x} y={t.y} textAnchor={t.anchor} {...labelProps(c.label)}>
          {t.label}
        </SvgText>
      ))}
    </Frame>
  );
}

export function BarChart({ geometry, onSelect, label }: { geometry: BarChartGeometry; onSelect: (index: number) => void; label: string }) {
  const c = useChartColors();
  const { colors } = useTheme();
  return (
    <Frame width={CHART_WIDTH} height={CHART_HEIGHT} label={label}>
      {geometry.yTicks.map((t, i) => (
        <G key={i}>
          <Line x1={42} x2={308} y1={t.y} y2={t.y} stroke={c.grid} strokeWidth={1} />
          <SvgText x={36} y={t.y + 3.5} textAnchor="end" {...labelProps(c.label)}>
            {t.label}
          </SvgText>
        </G>
      ))}
      {geometry.bars.map((b, i) => (
        <G key={i}>
          <Rect x={b.x} y={b.y} width={b.width} height={b.height} rx={3} fill={colors.orange} />
          <Rect x={b.hitX} y={14} width={b.hitWidth} height={150} fill="transparent" onPress={() => onSelect(i)} />
        </G>
      ))}
      {geometry.xTicks.map((t, i) => (
        <SvgText key={i} x={t.x} y={t.y} textAnchor={t.anchor} {...labelProps(c.label)}>
          {t.label}
        </SvgText>
      ))}
    </Frame>
  );
}

export function RadarChart({ geometry }: { geometry: RadarGeometry }) {
  const c = useChartColors();
  const { colors } = useTheme();
  return (
    <Frame width={RADAR_WIDTH} height={RADAR_HEIGHT} label="Répartition musculaire des 7 derniers jours">
      {geometry.rings.map((points, i) => (
        <Polygon key={i} points={points} fill="none" stroke={c.grid} strokeWidth={1} />
      ))}
      {geometry.spokes.map((s, i) => (
        <Line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={c.grid} strokeWidth={1} />
      ))}
      {geometry.hasData ? (
        <>
          <Polygon points={geometry.area} fill={alpha(colors.green, 0.22)} stroke={colors.green} strokeWidth={2} strokeLinejoin="round" />
          {geometry.dots.map((p, i) => (
            <Circle key={i} cx={p.x} cy={p.y} r={4} fill={colors.green} />
          ))}
        </>
      ) : null}
      {geometry.labels.map((l, i) => (
        <SvgText key={i} x={l.x} y={l.y} textAnchor={l.anchor} fill={c.text} fontSize={11} fontFamily={figtree(600)}>
          {l.text}
        </SvgText>
      ))}
    </Frame>
  );
}

export function WeightChart({ geometry, onSelect }: { geometry: WeightChartGeometry; onSelect: (index: number) => void }) {
  const c = useChartColors();
  const { colors } = useTheme();
  return (
    <Frame width={WEIGHT_WIDTH} height={WEIGHT_HEIGHT} label="Courbe du poids de corps">
      {geometry.yTicks.map((t, i) => (
        <G key={i}>
          <Line x1={38} x2={WEIGHT_WIDTH - 12} y1={t.y} y2={t.y} stroke={c.grid} strokeWidth={1} />
          <SvgText x={32} y={t.y + 3.5} textAnchor="end" {...labelProps(c.label)}>
            {t.label}
          </SvgText>
        </G>
      ))}
      <Path d={geometry.area} fill={alpha(colors.blue, 0.14)} />
      <Path d={geometry.line} stroke={colors.blue} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {geometry.points.map((p, i) => (
        <G key={i}>
          <Circle cx={p.x} cy={p.y} r={geometry.dotRadius} fill={colors.blue} />
          <Circle cx={p.x} cy={p.y} r={14} fill="transparent" onPress={() => onSelect(i)} />
        </G>
      ))}
      <SvgText x={geometry.xFirst.x} y={geometry.xFirst.y} textAnchor="start" {...labelProps(c.label)}>
        {fmtDateShort(geometry.xFirst.label)}
      </SvgText>
      <SvgText x={geometry.xLast.x} y={geometry.xLast.y} textAnchor="end" {...labelProps(c.label)}>
        {fmtDateShort(geometry.xLast.label)}
      </SvgText>
    </Frame>
  );
}
