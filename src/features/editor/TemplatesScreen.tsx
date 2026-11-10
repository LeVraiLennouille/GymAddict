import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/data/store/appStore';
import { applyTemplate, type TemplateMode } from '@/domain/actions/templates';
import { DAYS_ORDER, DAY_LABELS } from '@/domain/defaults/constants';
import { PROGRAM_TEMPLATES, type ProgramTemplate } from '@/domain/defaults/templates';
import { getProgramConfig } from '@/domain/rules/program';
import { useTheme } from '@/theme/ThemeProvider';
import { PROGRAM_HEX } from '@/theme/tokens';
import { Badge } from '@/ui/Badge';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { Sheet } from '@/ui/Sheet';
import { Text } from '@/ui/Text';
import { showToast } from '@/ui/feedbackStore';
import { EditorShell } from './components/EditorShell';

function TemplateCard({
  template,
  onApply,
}: {
  template: ProgramTemplate;
  onApply: (template: ProgramTemplate, mode: TemplateMode) => void;
}) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <Text display size={24} style={{ flex: 1 }} accessibilityRole="header">
          {template.name}
        </Text>
        <Badge kind="isolation" label={`${template.daysPerWeek} j/sem.`} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6, marginBottom: 8 }}>
        <Badge kind={template.level === 'Débutant' ? 'suggestion' : template.level === 'Intermédiaire' ? 'override' : 'neutral'} label={template.level} />
      </View>
      <Text size={13} tone="dim" style={{ lineHeight: 20 }}>
        {template.tagline}
      </Text>
      {template.note ? (
        <Text size={12} color={colors.orange} style={{ marginTop: 8, lineHeight: 18 }}>
          {template.note}
        </Text>
      ) : null}

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
        {DAYS_ORDER.map((day) => {
          const id = template.weekly[day];
          const prog = id ? template.programs[id] : undefined;
          return (
            <View key={day} style={{ backgroundColor: colors.card2, borderRadius: 10, paddingVertical: 6, paddingHorizontal: 9, minWidth: 64, borderTopWidth: 3, borderTopColor: prog ? PROGRAM_HEX[prog.color] : 'transparent' }}>
              <Text size={10} weight={700} tone="muted">
                {DAY_LABELS[day].slice(0, 3).toUpperCase()}
              </Text>
              <Text size={11} weight={600} color={prog ? '#FFFFFF' : '#7C8391'}>
                {prog ? prog.label : 'Repos'}
              </Text>
            </View>
          );
        })}
      </View>

      <Button small variant="ghost" label={open ? 'Masquer le détail' : 'Voir les exercices'} onPress={() => setOpen((v) => !v)} style={{ marginTop: 10 }} />
      {open ? (
        <View style={{ marginTop: 4 }}>
          {template.order.map((key) => {
            const prog = template.programs[key];
            if (!prog) return null;
            return (
              <View key={key} style={{ marginBottom: 10 }}>
                <Text weight={700} size={13} color={PROGRAM_HEX[prog.color]}>
                  {prog.fullName}
                </Text>
                {prog.exercises.map((ex) => (
                  <Text key={ex.id} size={12} tone="dim" style={{ marginTop: 2 }}>
                    {`${ex.sets} × ${ex.repsLabel.replace(' reps', '')} · ${ex.name}`}
                  </Text>
                ))}
              </View>
            );
          })}
        </View>
      ) : null}

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
        <Button label="Ajouter" variant="soft" style={{ flex: 1, alignSelf: 'stretch' }} onPress={() => onApply(template, 'add')} />
        <Button label="Remplacer mon planning" variant="solid" style={{ flex: 2, alignSelf: 'stretch' }} onPress={() => onApply(template, 'replace')} />
      </View>
    </Card>
  );
}

/** Bibliothèque de programmes prêts à l'emploi, importables en un clic. */
export function TemplatesScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const update = useAppStore((s) => s.update);
  const myPrograms = useAppStore((s) => Object.values(getProgramConfig(s.data).programs).filter((p) => p.type !== 'rest').length);
  const [pending, setPending] = useState<ProgramTemplate | null>(null);

  const run = (template: ProgramTemplate, mode: TemplateMode): void => {
    const count = Object.keys(template.programs).length;
    update((d) => applyTemplate(d, template, mode).data);
    showToast(mode === 'add' ? `${count} séances ajoutées à ton programme` : `Planning remplacé par « ${template.name} »`);
    if (mode === 'replace') router.replace('/week');
  };

  return (
    <EditorShell title="Programmes prêts à l'emploi" subtitle="Importe un programme en un clic, puis modifie-le comme tu veux" fallback="/editor">
      {PROGRAM_TEMPLATES.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onApply={(t, mode) => {
            if (mode === 'replace') setPending(t);
            else run(t, mode);
          }}
        />
      ))}

      <Sheet visible={pending !== null} onClose={() => setPending(null)} title="Remplacer le planning ?" accent={colors.cYellow}>
        <Text size={13} tone="dim" style={{ lineHeight: 21, marginBottom: 16 }}>
          {`« ${pending?.name ?? ''} » remplace tes ${myPrograms} séance${myPrograms > 1 ? 's' : ''} et ton planning de la semaine.`}
        </Text>
        <Text size={12} tone="muted" style={{ lineHeight: 19, marginBottom: 20 }}>
          Ton historique, tes records et tes sorties running ne sont pas touchés. Pour garder tes séances actuelles, choisis plutôt « Ajouter ».
        </Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button label="Annuler" variant="ghost" style={{ flex: 1, alignSelf: 'stretch' }} onPress={() => setPending(null)} />
          <Button
            label="Remplacer"
            variant="solid"
            style={{ flex: 1, alignSelf: 'stretch' }}
            onPress={() => {
              const t = pending;
              setPending(null);
              if (t) run(t, 'replace');
            }}
          />
        </View>
      </Sheet>
    </EditorShell>
  );
}
