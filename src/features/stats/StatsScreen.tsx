import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MAX_WIDTH } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeProvider';
import { Card } from '@/ui/Card';
import { Chip } from '@/ui/Chip';
import { Icon } from '@/ui/Icon';
import { SectionTitle } from '@/ui/SectionTitle';
import { StatCard } from '@/ui/StatCard';
import { Text } from '@/ui/Text';
import { RadarCard } from './components/RadarCard';
import { GoalsCard } from './components/GoalsCard';
import { Heatmap } from './components/Heatmap';
import { LoadsCard } from './components/LoadsCard';
import { PrCard } from './components/PrCard';
import { VolumeCard } from './components/VolumeCard';
import { WeightCard } from './components/WeightCard';
import { useStats } from './hooks/useStats';

/** Onglet « Stats » : régularité, objectifs, calendrier, progression, volume, poids et records. */
export function StatsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const stats = useStats();

  return (
    <ScrollView keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets contentContainerStyle={{ paddingHorizontal: 14, paddingTop: 6, paddingBottom: 160, alignItems: 'center' }}>
      <View style={{ width: '100%', maxWidth: MAX_WIDTH }}>
        <Chip label="Statistiques" />

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
          <StatCard value={String(stats.streak)} label="Jours de streak" color={colors.cYellow} />
          <StatCard value={`${stats.regularity}%`} label="Régularité 7j" color={colors.cGreen} />
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Historique des séances"
          onPress={() => router.push('/history')}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            backgroundColor: colors.card,
            borderRadius: 24,
            padding: 16,
            marginBottom: 12,
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: colors.card2, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="clock" size={22} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text weight={700} size={15} color="#FFFFFF">
              Historique des séances
            </Text>
            <Text size={12} color="#A6ACB8" style={{ marginTop: 2 }}>
              {`${stats.sessionCount} séance${stats.sessionCount > 1 ? 's' : ''} enregistrée${stats.sessionCount > 1 ? 's' : ''} · relire et dupliquer`}
            </Text>
          </View>
          <Icon name="chev" size={20} color="#7C8391" />
        </Pressable>

        <GoalsCard rows={stats.goals} exercises={stats.exercises} onSave={stats.actions.saveGoal} onDelete={stats.actions.deleteGoal} />

        <Card>
          <SectionTitle flush>Calendrier d'activité</SectionTitle>
          <Heatmap weeks={stats.heatmap} onOpen={(date) => router.push(`/history/${date}`)} />
        </Card>

        <LoadsCard exercises={stats.exercises} />

        <RadarCard geometry={stats.radar} />

        <VolumeCard onSave={stats.actions.saveVolumeTargets} onReset={stats.actions.resetVolumeTargets} />
        <WeightCard onAdd={stats.actions.addWeight} onDelete={stats.actions.deleteWeight} />
        <PrCard rows={stats.prs} bodyWeight={stats.bodyWeight} onSaveBodyWeight={stats.actions.saveBodyWeight} />
      </View>
    </ScrollView>
  );
}
