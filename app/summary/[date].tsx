import { Redirect, useLocalSearchParams } from 'expo-router';
import { SummaryScreen } from '@/features/summary/SummaryScreen';
import { isDateKey } from '@/domain/format/dates';

export default function SummaryRoute() {
  const { date } = useLocalSearchParams<{ date: string }>();
  if (!isDateKey(date)) return <Redirect href="/" />;
  return <SummaryScreen date={date} mode="summary" />;
}
