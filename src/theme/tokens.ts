import type { ProgramColor } from '@/domain/types';
import { mix } from './color';

/** Couleurs de programme (--c-red, --c-blue…). */
export const PROGRAM_HEX: Record<ProgramColor, string> = {
  red: '#E5323F',
  blue: '#1E5BD6',
  yellow: '#F5B700',
  green: '#12A150',
  grey: '#3A3E48',
};

export interface Tone {
  text: string;
  dim: string;
  muted: string;
}

export interface Colors {
  bg: string;
  rule: string;
  ink: string;
  onInk: string;
  card: string;
  card2: string;
  border: string;
  onAccent: string;
  /** Texte posé directement sur le fond de page. */
  page: Tone;
  /** Texte posé sur une carte (toujours sombre, même en thème clair). */
  onCard: Tone;
  green: string;
  greenDim: string;
  blue: string;
  blueDim: string;
  orange: string;
  orangeDim: string;
  red: string;
  purple: string;
  yellow: string;
  cRed: string;
  cBlue: string;
  cYellow: string;
  cGreen: string;
  navBg: string;
  navIdle: string;
}

const shared = {
  card2: '#23262E',
  border: 'rgba(255,255,255,0.09)',
  onAccent: '#0B0C0F',
  onCard: { text: '#F4F5F7', dim: '#A6ACB8', muted: '#7C8391' },
  green: '#34D07A',
  greenDim: 'rgba(52,208,122,0.14)',
  blue: '#5B96FF',
  blueDim: 'rgba(91,150,255,0.12)',
  orange: '#F5B700',
  orangeDim: 'rgba(245,183,0,0.14)',
  red: '#FF5A66',
  purple: '#B79CFF',
  yellow: '#F5B700',
  cRed: PROGRAM_HEX.red,
  cBlue: PROGRAM_HEX.blue,
  cYellow: PROGRAM_HEX.yellow,
  cGreen: PROGRAM_HEX.green,
  navBg: '#14161B',
  navIdle: '#8C93A1',
} as const;

function build(bg: string, ink: string, rule: string, onInk: string, card: string): Colors {
  return {
    ...shared,
    bg,
    ink,
    rule,
    onInk,
    card,
    page: { text: ink, dim: mix(ink, bg, 62), muted: mix(ink, bg, 45) },
  };
}

export const lightColors: Colors = build('#ECEDF0', '#14161B', '#B9BCC4', '#FFFFFF', '#15171C');
export const darkColors: Colors = build('#0A0B0E', '#F4F5F7', '#3A3E48', '#0A0B0E', '#1B1E25');

export const radius = { card: 24, small: 12, pill: 99 } as const;
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 } as const;
/** Largeur maximale du contenu (le web reste centré comme l'ancienne appli). */
export const MAX_WIDTH = 480;
