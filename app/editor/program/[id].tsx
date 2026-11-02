import { Redirect, useLocalSearchParams } from 'expo-router';
import { ProgramEditorScreen } from '@/features/editor/ProgramEditorScreen';

export default function ProgramEditorRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  if (!id) return <Redirect href="/editor" />;
  return <ProgramEditorScreen id={id} />;
}
