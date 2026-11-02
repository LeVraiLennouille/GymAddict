import { useCallback, useEffect, useRef } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import type { ScrollViewHandle } from '@/ui/types';

const SCROLL_MARGIN = 84;

/** Défilement vers une carte d'exercice (superset suivant, exercice suivant après la dernière série). */
export function useRevealScroll() {
  const scrollRef = useRef<ScrollViewHandle>(null);
  const positions = useRef<Record<string, number>>({});

  const reveal = useCallback((exerciseId: string) => {
    const y = positions.current[exerciseId];
    if (y !== undefined) scrollRef.current?.scrollTo({ y: Math.max(0, y - SCROLL_MARGIN), animated: true });
  }, []);

  const onCardLayout = useCallback(
    (exerciseId: string) => (event: LayoutChangeEvent) => {
      positions.current[exerciseId] = event.nativeEvent.layout.y;
    },
    [],
  );

  return { scrollRef, reveal, onCardLayout };
}

/** Fait défiler jusqu'au nouvel exercice actif quand le précédent vient d'être terminé. */
export function useRevealOnProgress(activeId: string | null, reveal: (id: string) => void): void {
  const previous = useRef<string | null | undefined>(undefined);
  useEffect(() => {
    if (previous.current !== undefined && previous.current !== activeId && activeId) {
      const id = setTimeout(() => reveal(activeId), 120);
      previous.current = activeId;
      return () => clearTimeout(id);
    }
    previous.current = activeId;
    return undefined;
  }, [activeId, reveal]);
}
