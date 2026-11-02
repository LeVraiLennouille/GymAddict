import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppStore } from '@/data/store/appStore';
import { RemindersSync } from '@/features/reminders/RemindersSync';
import { TimerWidget } from '@/features/timer/TimerWidget';
import { markPersistAsked } from '@/domain/actions/profile';
import { requestPersistentStorage } from '@/services/persist';
import { configureNotifications } from '@/services/reminders';
import { useTimerStore } from '@/services/timerStore';
import { FONT_SOURCES } from '@/theme/fonts';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { PrPopupHost } from '@/ui/PrPopup';
import { ToastHost } from '@/ui/Toast';

/** Ouvrir directement un détail (ex. /history/2026-10-20) garde les onglets en dessous, pour pouvoir revenir en arrière. */
export const unstable_settings = { anchor: '(tabs)' };

void SplashScreen.preventAutoHideAsync();
configureNotifications();

function ThemedStack() {
  const { colors, scheme } = useTheme();
  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="day/[date]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="summary/[date]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="history/index" />
        <Stack.Screen name="editor/index" />
        <Stack.Screen name="editor/program/[id]" />
        <Stack.Screen name="editor/run/[id]" />
        <Stack.Screen name="history/[date]" options={{ presentation: 'modal' }} />
      </Stack>
      <TimerWidget />
      <PrPopupHost />
      <ToastHost />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(FONT_SOURCES);
  const hydrated = useAppStore((s) => s.hydrated);

  useEffect(() => {
    void useAppStore
      .getState()
      .hydrate()
      .then(() => useTimerStore.getState().restore());
  }, []);

  // Écriture immédiate quand l'appli passe en arrière-plan : aucune série perdue.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active') void useAppStore.getState().flush();
    });
    return () => sub.remove();
  }, []);

  // Navigateur : on demande une seule fois que les données ne soient pas effacées automatiquement.
  useEffect(() => {
    if (!hydrated || Platform.OS !== 'web') return;
    const { data, update } = useAppStore.getState();
    if (data.prefs.persistAsked) return;
    void requestPersistentStorage().then(() => update((d) => markPersistAsked(d)));
  }, [hydrated]);

  const ready = (fontsLoaded || fontError !== null) && hydrated;
  useEffect(() => {
    if (ready) void SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ThemedStack />
        <RemindersSync />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}