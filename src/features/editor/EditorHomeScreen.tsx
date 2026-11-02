import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { DAYS_ORDER, DAY_LABELS } from '@/domain/defaults/constants';
import { fmtKm, fmtPace } from '@/domain/format/numbers';
import { useTheme } from '@/theme/ThemeProvider';
import { PROGRAM_HEX } from '@/theme/tokens';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { CommitInput } from '@/ui/CommitInput';
import { Icon } from '@/ui/Icon';
import { SectionTitle } from '@/ui/SectionTitle';
import { SelectField } from '@/ui/SelectField';
import { Sheet } from '@/ui/Sheet';
import { Text } from '@/ui/Text';
import { EditorShell } from './components/EditorShell';
import { useProgramEditor } from './hooks/useProgramEditor';

function ReorderButtons({ onUp, onDown, isFirst, isLast, label }: { onUp: () => void; onDown: () => void; isFirst: boolean; isLast: boolean; label: string }) {
  const { colors } = useTheme();
  const btn = (icon: 'up' | 'down', onPress: () => void, disabled: boolean, name: string) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${name} ${label}`}
      disabled={disabled}
      onPress={onPress}
      style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.card2, alignItems: 'center', justifyContent: 'center', opacity: disabled ? 0.3 : 1 }}
    >
      <Icon name={icon} size={14} color="#FFFFFF" />
    </Pressable>
  );
  return (
    <View style={{ flexDirection: 'row', gap: 6 }}>
      {btn('up', onUp, isFirst, 'Monter')}
      {btn('down', onDown, isLast, 'Descendre')}
    </View>
  );
}

/** Accueil de l'éditeur : planning de la semaine, séances, sorties running. */
export function EditorHomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { config, programKeys, customized, actions } = useProgramEditor();
  const [confirmReset, setConfirmReset] = useState(false);

  const programOptions = programKeys.map((k) => ({ value: k, label: config.programs[k]?.fullName ?? k }));
  const runOptions = [{ value: '', label: 'Pas de sortie' }, ...config.runOrder.map((id) => ({ value: id, label: config.runs[id]?.name ?? id }))];

  return (
    <EditorShell title="Mon programme" subtitle={customized ? 'Personnalisé' : 'Programme par défaut'} fallback="/week">
      <Card>
        <SectionTitle flush>Semaine type</SectionTitle>
        <Text size={12} tone="dim" style={{ marginTop: -4, marginBottom: 12, lineHeight: 18 }}>
          Quelle séance et quelle sortie chaque jour. Les jours déjà modifiés à la main ne changent pas.
        </Text>
        {DAYS_ORDER.map((day) => (
          <View key={day} style={{ marginBottom: 12 }}>
            <Text size={13} weight={700} style={{ marginBottom: 6 }}>
              {DAY_LABELS[day]}
            </Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View style={{ flex: 1 }}>
                <SelectField
                  title={`${DAY_LABELS[day]} : séance`}
                  value={config.weekly[day]}
                  options={programOptions}
                  onChange={(id) => actions.setWeekly(day, id)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <SelectField
                  title={`${DAY_LABELS[day]} : sortie`}
                  value={config.runWeekly[day]}
                  options={runOptions}
                  onChange={(id) => actions.setRunDay(day, id)}
                />
              </View>
            </View>
          </View>
        ))}
      </Card>

      <Card>
        <SectionTitle flush>Séances</SectionTitle>
        {programKeys.map((key, i) => {
          const prog = config.programs[key];
          if (!prog) return null;
          return (
            <View key={key} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderTopWidth: i === 0 ? 0 : 1, borderTopColor: colors.border }}>
              <View style={{ width: 8, height: 38, borderRadius: 4, backgroundColor: PROGRAM_HEX[prog.color] }} />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Modifier ${prog.fullName}`}
                disabled={prog.type === 'rest'}
                onPress={() => router.push(`/editor/program/${key}`)}
                style={{ flex: 1, minWidth: 0 }}
              >
                <Text display size={20} numberOfLines={1}>
                  {prog.fullName}
                </Text>
                <Text size={11} tone="dim" style={{ marginTop: 2 }}>
                  {prog.type === 'rest' ? 'Repos' : `${prog.exercises.length} exercice${prog.exercises.length > 1 ? 's' : ''} · toucher pour modifier`}
                </Text>
              </Pressable>
              <ReorderButtons
                label={prog.fullName}
                isFirst={i === 0}
                isLast={i === programKeys.length - 1}
                onUp={() => actions.moveProgram(key, -1)}
                onDown={() => actions.moveProgram(key, 1)}
              />
            </View>
          );
        })}
        <Button
          label="Nouvelle séance"
          icon="plus"
          variant="solid"
          fullWidth
          style={{ marginTop: 12 }}
          onPress={() => router.push(`/editor/program/${actions.addProgram()}`)}
        />
      </Card>

      <Card>
        <SectionTitle flush>Sorties running</SectionTitle>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Text size={13} tone="dim" style={{ flex: 1 }}>
            Objectif de distance par semaine
          </Text>
          <CommitInput variant="big" numeric value={config.weeklyKm ? fmtKm(config.weeklyKm) : ''} placeholder="0" style={{ width: 84 }} accessibilityLabel="Objectif de distance hebdomadaire en kilomètres" onCommit={actions.setWeeklyKm} />
          <Text size={13} tone="dim">
            km
          </Text>
        </View>
        {config.runOrder.map((id, i) => {
          const run = config.runs[id];
          if (!run) return null;
          const meta = [run.targetDistance ? `${fmtKm(run.targetDistance)} km` : '', run.targetDuration ? `${run.targetDuration} min` : '', run.targetPace ? `${fmtPace(run.targetPace)} /km` : ''].filter(Boolean).join(' · ');
          return (
            <View key={id} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border }}>
              <Pressable accessibilityRole="button" accessibilityLabel={`Modifier ${run.name}`} onPress={() => router.push(`/editor/run/${id}`)} style={{ flex: 1, minWidth: 0 }}>
                <Text display size={20} numberOfLines={1}>
                  {run.name}
                </Text>
                <Text size={11} tone="dim" style={{ marginTop: 2 }}>
                  {meta || 'Aucun objectif'}
                </Text>
              </Pressable>
              <ReorderButtons label={run.name} isFirst={i === 0} isLast={i === config.runOrder.length - 1} onUp={() => actions.moveRun(id, -1)} onDown={() => actions.moveRun(id, 1)} />
            </View>
          );
        })}
        <Button
          label="Nouvelle sortie"
          icon="plus"
          variant="solid"
          fullWidth
          style={{ marginTop: 12 }}
          onPress={() => router.push(`/editor/run/${actions.addRun()}`)}
        />
      </Card>

      {customized ? (
        <Button label="Rétablir le programme par défaut" variant="danger" fullWidth onPress={() => setConfirmReset(true)} />
      ) : null}

      <Sheet visible={confirmReset} onClose={() => setConfirmReset(false)} title="Tout rétablir ?" accent={colors.cRed}>
        <Text size={13} tone="dim" style={{ lineHeight: 21, marginBottom: 20 }}>
          Tes séances, exercices et sorties personnalisés seront remplacés par le programme d'origine. Les séances déjà
          faites et tes records ne sont pas touchés.
        </Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button label="Annuler" variant="ghost" style={{ flex: 1, alignSelf: 'stretch' }} onPress={() => setConfirmReset(false)} />
          <Button
            label="Rétablir"
            variant="danger"
            style={{ flex: 1, alignSelf: 'stretch' }}
            onPress={() => {
              actions.resetAll();
              setConfirmReset(false);
            }}
          />
        </View>
      </Sheet>
    </EditorShell>
  );
}
