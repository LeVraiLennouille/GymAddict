import { createContext, useContext } from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import type { Tone } from '@/theme/tokens';

/** Les cartes sont sombres même en thème clair : le texte change selon la surface. */
export type Surface = 'page' | 'card';

const SurfaceContext = createContext<Surface>('page');
export const SurfaceProvider = SurfaceContext.Provider;

export function useTone(): Tone {
  const surface = useContext(SurfaceContext);
  const { colors } = useTheme();
  return surface === 'card' ? colors.onCard : colors.page;
}
