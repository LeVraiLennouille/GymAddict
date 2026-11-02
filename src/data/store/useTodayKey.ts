import { useEffect, useState } from 'react';
import type { DateKey } from '@/domain/types';
import { todayKey } from '@/domain/format/dates';

/** Date du jour, mise à jour automatiquement au passage de minuit. */
export function useTodayKey(): DateKey {
  const [key, setKey] = useState<DateKey>(() => todayKey());
  useEffect(() => {
    const id = setInterval(() => {
      const now = todayKey();
      setKey((prev) => (prev === now ? prev : now));
    }, 30_000);
    return () => clearInterval(id);
  }, []);
  return key;
}
