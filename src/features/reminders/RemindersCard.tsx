import { Pressable, View } from 'react-native';
import { parseReminderTime } from '@/domain/rules/reminders';
import { useTheme } from '@/theme/ThemeProvider';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { ChoiceChip } from '@/ui/ChoiceChip';
import { Switch } from '@/ui/Switch';
import { Text } from '@/ui/Text';
import { useReminders } from './useReminders';

/** Lundi → dimanche, avec leur numéro de jour JS (0 = dimanche). */
const WEEK: readonly { js: number; label: string; name: string }[] = [
  { js: 1, label: 'L', name: 'lundi' },
  { js: 2, label: 'M', name: 'mardi' },
  { js: 3, label: 'M', name: 'mercredi' },
  { js: 4, label: 'J', name: 'jeudi' },
  { js: 5, label: 'V', name: 'vendredi' },
  { js: 6, label: 'S', name: 'samedi' },
  { js: 0, label: 'D', name: 'dimanche' },
];

function Stepper({ label, onPress }: { label: string; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => ({ minWidth: 56, height: 44, borderRadius: 22, backgroundColor: colors.card2, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, opacity: pressed ? 0.7 : 1 })}
    >
      <Text size={13} weight={700} color="#FFFFFF">
        {label}
      </Text>
    </Pressable>
  );
}

/** Rappels d'entraînement : jours, heure, aperçu de la prochaine notification. */
export function RemindersCard() {
  const { colors } = useTheme();
  const r = useReminders();

  if (!r.supported) {
    return (
      <Card>
        <Text weight={700} size={15}>
          Rappels d'entraînement
        </Text>
        <Text size={12} tone="muted" style={{ marginTop: 6, lineHeight: 18 }}>
          Les rappels sont disponibles dans l'application iOS et Android. Dans le navigateur, ils ne peuvent pas être programmés quand l'appli est fermée.
        </Text>
      </Card>
    );
  }

  const { hours, minutes } = parseReminderTime(r.reminder.time);
  return (
    <Card>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
        <View style={{ flex: 1 }}>
          <Text weight={700} size={15}>
            Rappels d'entraînement
          </Text>
          <Text size={12} tone="muted" style={{ marginTop: 2, lineHeight: 17 }}>
            Une notification les jours choisis, sauf si tu t'es déjà entraîné.
          </Text>
        </View>
        <Switch value={r.reminder.enabled} onChange={(v) => void r.actions.setEnabled(v)} label="Rappels d'entraînement" />
      </View>

      {r.reminder.enabled ? (
        <View style={{ marginTop: 16 }}>
          <Text size={10} weight={600} tone="muted" style={{ marginBottom: 8 }}>
            HEURE
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Stepper label="−15 min" onPress={() => r.actions.shiftTime(-15)} />
            <Text display size={34} color="#FFFFFF" style={{ minWidth: 96, textAlign: 'center' }} accessibilityLabel={`${hours} heures ${minutes}`}>
              {r.reminder.time}
            </Text>
            <Stepper label="+15 min" onPress={() => r.actions.shiftTime(15)} />
          </View>

          <Text size={10} weight={600} tone="muted" style={{ marginTop: 16, marginBottom: 8 }}>
            JOURS
          </Text>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {WEEK.map((d) => (
              <ChoiceChip key={d.js} label={d.label} selected={r.reminder.days.includes(d.js)} onPress={() => r.actions.toggleDay(d.js)} />
            ))}
          </View>

          <Text size={12} color={r.next ? colors.onCard.dim : colors.orange} style={{ marginTop: 14, lineHeight: 18 }}>
            {r.next ? `Prochain rappel : ${r.next}` : 'Aucun rappel à venir (jours de repos ou entraînement déjà fait).'}
          </Text>
          <Button label="Envoyer une notification de test" variant="soft" small style={{ marginTop: 12 }} onPress={() => void r.actions.test()} />
        </View>
      ) : null}
    </Card>
  );
}
