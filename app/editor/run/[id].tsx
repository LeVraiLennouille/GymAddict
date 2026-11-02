import { Redirect, useLocalSearchParams } from 'expo-router';
import { RunEditorScreen } from '@/features/editor/RunEditorScreen';

export default function RunEditorRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  if (!id) return <Redirect href="/editor" />;
  return <RunEditorScreen id={id} />;
}
