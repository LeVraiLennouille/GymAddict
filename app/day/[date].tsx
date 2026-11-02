import { Redirect, useLocalSearchParams } from 'expo-router';
import { DayScreen } from '@/features/week/DayScreen';
import { isDateKey } from '@/domain/format/dates';

export default function DayRoute() {
  const { date } = useLocalSearchParams<{ date: string }>();
  if (!isDateKey(date)) return <Redirect href="/week" />;
  return <DayScreen date={date} />;
}
