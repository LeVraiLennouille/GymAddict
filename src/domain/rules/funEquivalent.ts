import type { FunEquivalent } from '../types';

const FUN_EQ = [
  { w: 4, name: 'chat', names: 'chats' },
  { w: 80, name: 'adulte', names: 'adultes' },
  { w: 200, name: 'moto', names: 'motos' },
  { w: 600, name: 'vache', names: 'vaches' },
  { w: 1500, name: 'voiture', names: 'voitures' },
  { w: 6000, name: "éléphant d'Afrique", names: "éléphants d'Afrique" },
  { w: 12000, name: 'bus', names: 'bus' },
] as const;

/** « Soit 2,3 voitures » : équivalent ludique d'un tonnage. */
export function getFunEquivalent(kg: number): FunEquivalent | null {
  if (kg <= 0) return null;
  for (let i = FUN_EQ.length - 1; i >= 0; i--) {
    const eq = FUN_EQ[i];
    if (!eq) continue;
    const ratio = kg / eq.w;
    if (ratio >= 0.7) {
      const count = Math.round(ratio * 10) / 10;
      return { count, name: count > 1.4 ? eq.names : eq.name };
    }
  }
  const cat = FUN_EQ[0];
  return { count: Math.round(kg / cat.w), name: cat.names };
}
