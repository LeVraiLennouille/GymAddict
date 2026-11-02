import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Platform } from 'react-native';
import { fmtDateLong } from '@/domain/format/dates';
import { AVATARS } from '@/domain/defaults/constants';
import { useTheme } from '@/theme/ThemeProvider';
import { MAX_WIDTH } from '@/theme/tokens';
import { Avatar } from '@/ui/Avatar';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { Chip } from '@/ui/Chip';
import { CommitInput } from '@/ui/CommitInput';
import { Icon } from '@/ui/Icon';
import { SectionTitle } from '@/ui/SectionTitle';
import { Sheet } from '@/ui/Sheet';
import { StatCard } from '@/ui/StatCard';
import { Switch } from '@/ui/Switch';
import { Text } from '@/ui/Text';
import { BackupCard } from '@/features/backup/BackupCard';
import { RemindersCard } from '@/features/reminders/RemindersCard';
import { DiagnosticCard } from './DiagnosticCard';
import { useProfile } from './hooks/useProfile';

function PrefRow({
  name,
  sub,
  value,
  onChange,
  last,
}: {
  name: string;
  sub: string;
  value: boolean;
  onChange: (v: boolean) => void;
  last?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 14,
        paddingVertical: 12,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: colors.border,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text size={15} weight={700}>
          {name}
        </Text>
        <Text size={12} tone="muted" style={{ marginTop: 2, lineHeight: 17 }}>
          {sub}
        </Text>
      </View>
      <Switch value={value} onChange={onChange} label={name} />
    </View>
  );
}

function ValueRow({
  label,
  unit,
  value,
  onSave,
  integer,
}: {
  label: string;
  unit: string;
  value: string;
  onSave: (raw: string) => void;
  integer?: boolean;
}) {
  // `null` : l'utilisateur n'a rien tapé, on enregistre la valeur affichée (jamais un brouillon périmé).
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <Text size={13} tone="dim" style={{ minWidth: 100 }}>
        {label}
      </Text>
      <CommitInput
        variant="big"
        numeric={!integer}
        integer={integer}
        value={value}
        onCommit={setDraft}
        onLiveChange={setDraft}
        style={{ width: 80 }}
        accessibilityLabel={`${label} (${unit})`}
      />
      <Text size={13} tone="dim">
        {unit}
      </Text>
      <Button label="Enregistrer" icon="check" variant="solid" small onPress={() => {
          onSave(draft ?? value);
          setDraft(null);
        }} />
    </View>
  );
}

/** Onglet « Profil » : identité, statistiques globales, données personnelles, minuteur, réinitialisation. */
export function ProfileScreen() {
  const { colors } = useTheme();
  const { profile, stats, bodyWeight, age, prefs, actions } = useProfile();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const vibrationSupported =
    Platform.OS !== 'web' || (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function');

  return (
    <>
      <ScrollView keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets contentContainerStyle={{ paddingHorizontal: 14, paddingTop: 6, paddingBottom: 160, alignItems: 'center' }}>
        <View style={{ width: '100%', maxWidth: MAX_WIDTH }}>
          <Chip label="Profil" />

          <Card accent={colors.cGreen} style={{ paddingVertical: 22 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Choisir un avatar"
                accessibilityState={{ expanded: pickerOpen }}
                onPress={() => setPickerOpen((v) => !v)}
              >
                <Avatar avatar={profile.avatar} size={68} radius={22} />
              </Pressable>
              <View style={{ flex: 1, minWidth: 0 }}>
                <CommitInput
                  variant="title"
                  value={profile.pseudo}
                  placeholder="Ton pseudonyme…"
                  maxLength={24}
                  autoCorrect={false}
                  autoCapitalize="none"
                  accessibilityLabel="Pseudonyme"
                  commitDelayMs={600}
                  onCommit={actions.setPseudo}
                />
                <Text size={12} tone="dim" style={{ marginTop: 8 }}>
                  {`Membre depuis ${fmtDateLong(stats.memberSince).split(' ').slice(1).join(' ')} · `}
                  <Text size={12} weight={700} color={colors.green}>{`${stats.memberDays}j`}</Text>
                </Text>
              </View>
            </View>

            {pickerOpen ? (
              <View style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border }}>
                <Text size={10} tone="muted" uppercase style={{ marginBottom: 8 }}>
                  Choisis ton avatar
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {AVATARS.map((key) => (
                    <Pressable
                      key={key}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: key === profile.avatar }}
                      accessibilityLabel={`Avatar ${key}`}
                      onPress={() => {
                        actions.setAvatar(key);
                        setPickerOpen(false);
                      }}
                      style={{ width: 48, height: 48, borderRadius: 14, padding: 3, backgroundColor: colors.card2, borderWidth: 2, borderColor: key === profile.avatar ? colors.cGreen : 'transparent' }}
                    >
                      <Avatar avatar={key} size={38} radius={10} />
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : null}
          </Card>

          <SectionTitle>Mes statistiques</SectionTitle>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
            <StatCard value={String(stats.streak)} label="Streak" color={colors.cRed} />
            <StatCard value={String(stats.sessions)} label="Séances totales" color={colors.cBlue} />
          </View>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
            <StatCard value={`${stats.regularity}%`} label="Régularité 7j" color={colors.cYellow} />
            <StatCard
              value={stats.tonnage > 0 ? `${(stats.tonnage / 1000).toFixed(1).replace('.', ',')}t` : '—'}
              label="Tonnage total"
              color={colors.cGreen}
            />
          </View>
          {stats.equivalent ? (
            <Card compact style={{ alignItems: 'center' }}>
              <Icon name="dumbbell" size={30} color={colors.cYellow} />
              <Text size={12} tone="dim" style={{ marginTop: 8 }}>
                Tu as soulevé l'équivalent de
              </Text>
              <Text display size={22}>
                {`${stats.equivalent.count.toLocaleString('fr-FR')} ${stats.equivalent.name}`}
              </Text>
              <Text size={10} tone="muted" style={{ marginTop: 2 }}>
                au total sur tous tes entraînements
              </Text>
            </Card>
          ) : null}

          <SectionTitle>Mes données</SectionTitle>
          <Card>
            <ValueRow label="Poids de corps" unit="kg" value={String(bodyWeight)} onSave={actions.saveBodyWeight} />
            <ValueRow label="Âge" unit="ans" integer value={String(age)} onSave={actions.saveAge} />
          </Card>

          <SectionTitle>Minuteur de repos</SectionTitle>
          <Card>
            <PrefRow
              name="Son de fin de repos"
              sub="Bips sur les 3 dernières secondes, puis sonnerie"
              value={prefs.sound}
              onChange={(v) => actions.setPref('sound', v)}
            />
            <PrefRow
              name="Vibration"
              sub={vibrationSupported ? 'Vibre à la fin du repos' : 'Non prise en charge sur cet appareil (ex. Safari iPhone)'}
              value={prefs.vibrate}
              onChange={(v) => actions.setPref('vibrate', v)}
              last
            />
            <Button label="Tester l'alerte" color={colors.cYellow} onPress={actions.testAlert} style={{ marginTop: 12 }} />
          </Card>

          <SectionTitle>Rappels</SectionTitle>
          <RemindersCard />

          <SectionTitle>Sauvegarde</SectionTitle>
          <BackupCard />

          <SectionTitle>Diagnostic</SectionTitle>
          <DiagnosticCard />

          <SectionTitle>Zone danger</SectionTitle>
          <Card accent={colors.cRed}>
            <Text size={13} tone="dim" style={{ lineHeight: 20, marginBottom: 14 }}>
              {'Réinitialise '}
              <Text size={13} weight={700} color="#FFFFFF">
                TOUTES
              </Text>
              {' tes données : séances, records, tonnage, streak, check-ins.\n'}
              <Text size={11} color={colors.red}>
                Cette action est irréversible.
              </Text>
            </Text>
            <Button label="Réinitialiser toutes les données" variant="danger" fullWidth onPress={() => setConfirmOpen(true)} />
          </Card>
        </View>
      </ScrollView>

      <Sheet visible={confirmOpen} onClose={() => setConfirmOpen(false)} title="Tout effacer ?" accent={colors.cRed}>
        <Text size={13} tone="dim" style={{ lineHeight: 21, marginBottom: 20 }}>
          {'Tu es sur le point de supprimer '}
          <Text size={13} weight={700} color="#FFFFFF">
            toutes tes données
          </Text>
          {' définitivement.\n\nSéances · Records · Tonnage · Streak · Check-ins.\nTon programme personnalisé et tes préférences sont conservés.'}
        </Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button label="Annuler" variant="ghost" onPress={() => setConfirmOpen(false)} style={{ flex: 1, alignSelf: 'stretch' }} />
          <Button
            label="Oui, tout effacer"
            variant="danger"
            onPress={() => {
              actions.resetAll();
              setConfirmOpen(false);
            }}
            style={{ flex: 1, alignSelf: 'stretch' }}
          />
        </View>
      </Sheet>
    </>
  );
}
