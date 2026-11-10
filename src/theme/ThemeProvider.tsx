import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { useAppStore } from '@/data/store/appStore';
import { darkColors, lightColors, type Colors } from './tokens';

interface Theme {
  scheme: 'light' | 'dark';
  colors: Colors;
}

const ThemeContext = createContext<Theme>({ scheme: 'light', colors: lightColors });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const mode = useAppStore((s) => s.data.prefs.theme ?? 'system');
  const scheme = mode === 'system' ? (system === 'dark' ? 'dark' : 'light') : mode;
  const value = useMemo<Theme>(
    () => ({ scheme, colors: scheme === 'dark' ? darkColors : lightColors }),
    [scheme],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = (): Theme => useContext(ThemeContext);
