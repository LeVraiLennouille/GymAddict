import { Text as RNText, type TextProps, type TextStyle } from 'react-native';
import { DISPLAY_FONT, figtree, type FontWeight } from '@/theme/fonts';
import { useTone } from './Surface';

export interface AppTextProps extends TextProps {
  weight?: FontWeight;
  size?: number;
  /** Couleur sémantique selon la surface (page ou carte). */
  tone?: 'text' | 'dim' | 'muted';
  /** Couleur explicite (prioritaire sur `tone`). */
  color?: string;
  /** Police des titres et des gros chiffres (Anton). */
  display?: boolean;
  italic?: boolean;
  align?: TextStyle['textAlign'];
  uppercase?: boolean;
}

export function Text({
  weight = 400,
  size = 14,
  tone = 'text',
  color,
  display = false,
  italic = false,
  align,
  uppercase = false,
  style,
  ...rest
}: AppTextProps) {
  const palette = useTone();
  const base: TextStyle = {
    fontFamily: display ? DISPLAY_FONT : figtree(weight, italic),
    fontSize: size,
    color: color ?? palette[tone],
    fontVariant: ['tabular-nums'],
    ...(display ? { letterSpacing: size * 0.015 } : {}),
    ...(uppercase ? { textTransform: 'uppercase' as const, letterSpacing: size * 0.07 } : {}),
    ...(align ? { textAlign: align } : {}),
  };
  return <RNText {...rest} style={[base, style]} />;
}
