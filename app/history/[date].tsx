import { Redirect, useLocalSearchParams } from 'expo-router';
import { SummaryScreen } from '@/features/summary/SummaryScreen';
import { isDateKey } from '@/domain/format/dates';

export default function HistoryDetailRoute() {
  const { date } = useLocalSearchParams<{ date: string }>();
  if (!isDateKey(date)) return <Redirect href="/history" />;
  return <SummaryScreen date={date} mode="history" />;
}
