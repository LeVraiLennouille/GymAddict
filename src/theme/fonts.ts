import type { FontSource } from 'expo-font';

/** Toutes les polices sont des fichiers statiques : une famille par graisse (pas de police variable). */
export const FONT_SOURCES: Record<string, FontSource> = {
  'Anton-Regular': require('../../assets/fonts/Anton-Regular.ttf') as number,
  'Figtree-Black': require('../../assets/fonts/Figtree-Black.ttf') as number,
  'Figtree-BlackItalic': require('../../assets/fonts/Figtree-BlackItalic.ttf') as number,
  'Figtree-Bold': require('../../assets/fonts/Figtree-Bold.ttf') as number,
  'Figtree-BoldItalic': require('../../assets/fonts/Figtree-BoldItalic.ttf') as number,
  'Figtree-ExtraBold': require('../../assets/fonts/Figtree-ExtraBold.ttf') as number,
  'Figtree-ExtraBoldItalic': require('../../assets/fonts/Figtree-ExtraBoldItalic.ttf') as number,
  'Figtree-Italic': require('../../assets/fonts/Figtree-Italic.ttf') as number,
  'Figtree-Light': require('../../assets/fonts/Figtree-Light.ttf') as number,
  'Figtree-LightItalic': require('../../assets/fonts/Figtree-LightItalic.ttf') as number,
  'Figtree-Medium': require('../../assets/fonts/Figtree-Medium.ttf') as number,
  'Figtree-MediumItalic': require('../../assets/fonts/Figtree-MediumItalic.ttf') as number,
  'Figtree-Regular': require('../../assets/fonts/Figtree-Regular.ttf') as number,
  'Figtree-SemiBold': require('../../assets/fonts/Figtree-SemiBold.ttf') as number,
  'Figtree-SemiBoldItalic': require('../../assets/fonts/Figtree-SemiBoldItalic.ttf') as number,
};

export type FontWeight = 300 | 400 | 500 | 600 | 700 | 800 | 900;

const FAMILY: Record<FontWeight, string> = {
  300: 'Figtree-Light',
  400: 'Figtree-Regular',
  500: 'Figtree-Medium',
  600: 'Figtree-SemiBold',
  700: 'Figtree-Bold',
  800: 'Figtree-ExtraBold',
  900: 'Figtree-Black',
};

/** Titres et gros chiffres. */
export const DISPLAY_FONT = 'Anton-Regular';

/** Nom de famille Figtree pour une graisse. */
export function figtree(weight: FontWeight = 400, italic = false): string {
  const base = FAMILY[weight];
  if (!italic) return base;
  return weight === 400 ? 'Figtree-Italic' : `${base}Italic`;
}
