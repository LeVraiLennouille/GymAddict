import Svg, { Circle, G, Path, Rect } from 'react-native-svg';
import { useTone } from './Surface';

type Shape =
  | { t: 'path'; d: string }
  | { t: 'circle'; cx: number; cy: number; r: number }
  | { t: 'rect'; x: number; y: number; w: number; h: number; rx: number };

const p = (d: string): Shape => ({ t: 'path', d });

const SHAPES = {
  check: [p('M5 12.5l4.5 4.5L19 7.5')],
  close: [p('M6 6l12 12M18 6L6 18')],
  chev: [p('M9 6l6 6-6 6')],
  refresh: [p('M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7')],
  undo: [p('M9 14L4 9l5-5'), p('M4 9h10a6 6 0 0 1 0 12h-3')],
  star: [p('M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8 6.8 19.6l1-5.8L3.5 9.7l5.9-.8z')],
  dumbbell: [p('M6.5 7v10M17.5 7v10M3.5 9.5v5M20.5 9.5v5M6.5 12h11')],
  back: [p('M15 6l-6 6 6 6')],
  pulse: [p('M3 12h4l3-7 4 14 3-7h4')],
  clock: [{ t: 'circle', cx: 12, cy: 12, r: 9 }, p('M12 7v5l3 2')],
  plus: [p('M12 5v14M5 12h14')],
  up: [p('M6 14l6-6 6 6')],
  down: [p('M6 10l6 6 6-6')],
  trash: [p('M4 7h16M10 11v6M14 11v6M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12M9 7V4h6v3')],
  edit: [p('M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17z'), p('M14.5 7.5l3 3')],
  flame: [p('M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.2 2-4 .2 1.2.8 2 1.8 2.2C10.5 8.5 11 5.5 12 3z')],
  circleCheck: [{ t: 'circle', cx: 12, cy: 12, r: 8 }, p('M8.5 12.5l2.5 2.5 4.5-5')],
  home: [p('M3 11l9-8 9 8'), p('M5 10v10h14V10')],
  calendar: [{ t: 'rect', x: 3, y: 5, w: 18, h: 16, rx: 3 }, p('M3 10h18M8 3v4M16 3v4')],
  bars: [p('M5 20V10M12 20V4M19 20v-7')],
  user: [{ t: 'circle', cx: 12, cy: 8, r: 4 }, p('M4 21c0-4 4-6 8-6s8 2 8 6')],
} satisfies Record<string, Shape[]>;

export type IconName = keyof typeof SHAPES;

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  /** Remplit la forme (étoile active). */
  filled?: boolean;
}

export function Icon({ name, size = 18, color, strokeWidth = 2.2, filled = false }: IconProps) {
  const tone = useTone();
  const c = color ?? tone.text;
  const shapes: Shape[] = SHAPES[name];
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <G
        fill={filled ? c : 'none'}
        stroke={c}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {shapes.map((s, i) =>
          s.t === 'path' ? (
            <Path key={i} d={s.d} />
          ) : s.t === 'circle' ? (
            <Circle key={i} cx={s.cx} cy={s.cy} r={s.r} />
          ) : (
            <Rect key={i} x={s.x} y={s.y} width={s.w} height={s.h} rx={s.rx} />
          ),
        )}
      </G>
    </Svg>
  );
}
