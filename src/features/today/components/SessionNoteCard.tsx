import { Card } from '@/ui/Card';
import { CommitInput } from '@/ui/CommitInput';
import { Text } from '@/ui/Text';

export function SessionNoteCard({ note, onCommit }: { note: string; onCommit: (text: string) => void }) {
  return (
    <Card>
      <Text size={10} weight={600} tone="muted" style={{ marginBottom: 6 }}>
        NOTES DE LA SÉANCE
      </Text>
      <CommitInput
        variant="note"
        multiline
        maxLength={600}
        value={note}
        placeholder="Sensations, fatigue, idées pour la prochaine fois…"
        accessibilityLabel="Notes de la séance"
        commitDelayMs={700}
        onCommit={onCommit}
        style={{ minHeight: 84, textAlignVertical: 'top' }}
      />
    </Card>
  );
}
