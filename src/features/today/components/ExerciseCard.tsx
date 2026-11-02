import { Pressable, View, type LayoutChangeEvent } from 'react-native';
import { fmtWeekdayShort } from '@/domain/format/dates';
import { fmtKg, fmtRest } from '@/domain/format/numbers';
import type { ExerciseView } from '@/domain/rules/todayView';
import { useTheme } from '@/theme/ThemeProvider';
import { Badge } from '@/ui/Badge';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { CommitInput } from '@/ui/CommitInput';
import { Icon } from '@/ui/Icon';
import { Text } from '@/ui/Text';
import type { TodayActions } from '../hooks/useTodaySession';
import { ProgressionHint } from './ProgressionHint';
import { SetRow } from './SetRow';

interface Props {
  item: ExerciseView;
  /** Couleur du programme (liseré de l'exercice actif). */
  color: string;
  /** Carte terminée dépliée par l'utilisateur. */
  open: boolean;
  actions: TodayActions;
  onToggleOpen: () => void;
  onOpenWarmup: () => void;
  onOpenSwap: () => void;
  onLayout: (event: LayoutChangeEvent) => void;
}

function ExerciseBadges({ item }: { item: ExerciseView }) {
  const ex = item.exercise;
  const rest = fmtRest(ex.restSec);
  return (
    <>
      {ex.superset ? (
        <Badge kind="superset" label={`Superset ${ex.superset}`} />
      ) : ex.type === 'compound' ? (
        <Badge kind="compound" label={`Compound · ${rest}`} />
      ) : ex.type === 'echauffement' ? (
        <Badge kind="neutral" label={`Échauffement · ${rest}`} />
      ) : (
        <Badge kind="isolation" label={`Isolation · ${rest}`} />
      )}
      {ex.optional ? <Badge kind="neutral" label="Optionnel" /> : null}
    </>
  );
}

export function ExerciseCard({ item, color, open, actions, onToggleOpen, onOpenWarmup, onOpenSwap, onLayout }: Props) {
  const { colors } = useTheme();
  const ex = item.exercise;

  if (item.skipped) {
    return (
      <Card onLayout={onLayout} accent="transparent">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Text display size={21} style={{ flex: 1, minWidth: 0 }}>
            {ex.name}
          </Text>
          <Badge kind="neutral" label="Sauté" />
        </View>
        <View style={{ marginTop: 10, gap: 10 }}>
          <Text size={13} tone="dim">
            Machine prise ou exercice passé : il ne compte pas dans la progression.
          </Text>
          <Button label="Reprendre" small onPress={() => actions.skip(ex, false)} />
        </View>
      </Card>
    );
  }

  const collapsed = item.complete && !open;
  const lastTopText = (() => {
    if (!item.last || !item.lastTop) return null;
    const t = item.lastTop;
    const value = t.w > 0 ? `${fmtKg(t.w)} kg × ${t.r}${ex.isTime ? ' s' : ''}` : `${t.r}${ex.isTime ? ' s' : ' reps'}`;
    return { when: fmtWeekdayShort(item.last.date), value, count: item.last.sets.length };
  })();

  return (
    <Card
      onLayout={onLayout}
      accent={item.complete ? undefined : item.active ? color : 'transparent'}
      compact={item.complete}
    >
      <Pressable
        disabled={!item.complete}
        onPress={onToggleOpen}
        accessibilityRole={item.complete ? 'button' : undefined}
        accessibilityLabel={item.complete ? `${ex.name}, terminé. ${open ? 'Replier' : 'Déplier'}` : undefined}
        style={{ flexDirection: 'row', alignItems: item.complete ? 'center' : 'flex-start', flexWrap: item.complete ? 'nowrap' : 'wrap', gap: 8, marginBottom: collapsed ? 0 : 6 }}
      >
        <Text display size={item.complete ? 18 : 21} tone={item.complete ? 'dim' : 'text'} style={{ flex: 1, minWidth: 0 }}>
          {ex.name}
        </Text>
        {collapsed ? null : <ExerciseBadges item={item} />}
        <Text display size={18} tone="dim" style={{ marginLeft: 'auto' }}>
          {`${item.doneSets}/${ex.sets}`}
        </Text>
        {item.complete ? <Icon name="check" size={22} color={colors.cGreen} /> : null}
      </Pressable>

      {collapsed ? null : (
        <View>
          {item.doneSets < ex.sets ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
              <Button small label="Passer à la fin" onPress={() => actions.postpone(ex)} />
              {item.doneSets === 0 ? <Button small label="Sauter" onPress={() => actions.skip(ex, true)} /> : null}
              {item.doneSets === 0 ? <Button small label="Remplacer" onPress={onOpenSwap} /> : null}
            </View>
          ) : null}

          {ex.swappedFrom ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
              <Text size={12} tone="dim">
                {'Remplace '}
                <Text size={12} weight={700} color="#FFFFFF">
                  {ex.swappedName ?? ''}
                </Text>
              </Text>
              {item.doneSets === 0 ? <Button small variant="ghost" label="Rétablir" icon="undo" onPress={() => actions.revert(ex)} /> : null}
            </View>
          ) : null}

          <Text size={12} tone="dim" style={{ marginBottom: 12 }}>
            {`${ex.sets} séries · ${ex.repsLabel}`}
            {item.record ? (
              <>
                {' · PR : '}
                <Text size={12} weight={700} color={colors.orange}>
                  {`${fmtKg(item.record.weight)}kg × ${item.record.reps}reps`}
                </Text>
              </>
            ) : null}
          </Text>

          {lastTopText ? (
            <Text size={12} tone="dim" style={{ marginTop: -4, marginBottom: 10 }}>
              {`Dernière fois · ${lastTopText.when} : `}
              <Text size={12} weight={700} color="#FFFFFF">
                {lastTopText.value}
              </Text>
              {lastTopText.count > 1 ? <Text size={12} tone="muted">{` · ${lastTopText.count} séries`}</Text> : null}
            </Text>
          ) : null}

          {item.suggestion ? (
            <ProgressionHint
              suggestion={item.suggestion}
              applied={item.suggestionApplied}
              onApply={() => item.suggestion?.kind === 'up' && actions.applyProgression(ex, item.suggestion.weight)}
            />
          ) : null}

          <View style={{ gap: 8 }}>
            {item.sets.map((set) => (
              <SetRow
                key={set.index}
                exercise={ex}
                set={set}
                record={item.record}
                showLabels={set.index === 0}
                onToggle={() => actions.toggleSet(ex, set)}
                onCommitWeight={(text) => actions.commitWeight(ex, set.index, text)}
                onCommitReps={(text) => actions.commitReps(ex, set.index, text)}
              />
            ))}
          </View>

          <View style={{ marginTop: 12, gap: 8 }}>
            <CommitInput
              variant="note"
              value={item.note.settings}
              placeholder="Réglages (ex : cran 4, prise large)"
              accessibilityLabel={`Réglages pour ${ex.name}`}
              commitDelayMs={600}
              onCommit={(text) => actions.commitSetting(ex, text)}
            />
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
              <View style={{ width: 64, gap: 3 }}>
                <Text size={10} weight={600} tone="muted" align="center">
                  RPE /10
                </Text>
                <CommitInput
                  integer
                  value={item.note.rpe}
                  placeholder="—"
                  maxLength={2}
                  accessibilityLabel={`RPE pour ${ex.name}`}
                  commitDelayMs={400}
                  onCommit={(text) => actions.commitRpe(ex, text)}
                />
              </View>
              {ex.isTime ? null : <Button small label="Échauffement" color={colors.cYellow} onPress={onOpenWarmup} />}
            </View>
          </View>
        </View>
      )}
    </Card>
  );
}
