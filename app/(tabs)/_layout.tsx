import { Tabs } from 'expo-router';
import { BackupBanner } from '@/features/backup/BackupBanner';
import { ConnectedHeader } from '@/features/shell/ConnectedHeader';
import { useTheme } from '@/theme/ThemeProvider';
import { FloatingTabBar } from '@/ui/FloatingTabBar';

export default function TabsLayout() {
  const { colors } = useTheme();
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        header: () => (
          <>
            <ConnectedHeader />
            <BackupBanner />
          </>
        ),
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Séance' }} />
      <Tabs.Screen name="week" options={{ title: 'Programme' }} />
      <Tabs.Screen name="stats" options={{ title: 'Stats' }} />
      <Tabs.Screen name="cardio" options={{ title: 'Cardio' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profil' }} />
    </Tabs>
  );
}
