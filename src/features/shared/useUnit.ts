import { useMemo } from 'react';
import { useAppStore } from '@/data/store/appStore';
import {
  displayMassInput,
  fmtMass,
  fmtMassUnit,
  fmtTonnageIn,
  fmtTonnageValue,
  fromUnit,
  parseMassInput,
  toUnit,
} from '@/domain/format/units';
import { getUnit } from '@/domain/rules/plates';
import type { Unit } from '@/domain/types';

export interface UnitFormatter {
  unit: Unit;
  /** `62,5` (nombre seul). */
  num: (kg: number) => string;
  /** `62,5 kg` ou `137,5 lb`. */
  withUnit: (kg: number) => string;
  /** `850 kg`, `1,2 t` ou `2 205 lb`. */
  tonnage: (kg: number) => string;
  /** `12 450` (grand chiffre, sans unité). */
  tonnageValue: (kg: number) => string;
  /** Charge enregistrée (kg) -> nombre dans l'unité choisie. */
  convert: (kg: number) => number;
  /** Nombre saisi dans l'unité choisie -> kilogrammes. */
  toKg: (value: number) => number;
  /** Chaîne enregistrée en kg -> texte à afficher dans un champ. */
  toInput: (kgText: string) => string;
  /** Texte saisi dans l'unité choisie -> chaîne en kg à enregistrer. */
  fromInput: (text: string) => string;
}

/** Fonctions de présentation des charges dans l'unité choisie par l'utilisateur (les données restent en kg). */
export function useUnit(): UnitFormatter {
  const unit = useAppStore((s) => getUnit(s.data));
  return useMemo<UnitFormatter>(
    () => ({
      unit,
      num: (kg) => fmtMass(kg, unit),
      withUnit: (kg) => fmtMassUnit(kg, unit),
      tonnage: (kg) => fmtTonnageIn(kg, unit),
      tonnageValue: (kg) => fmtTonnageValue(kg, unit),
      convert: (kg) => toUnit(kg, unit),
      toKg: (value) => fromUnit(value, unit),
      toInput: (kgText) => displayMassInput(kgText, unit),
      fromInput: (text) => parseMassInput(text, unit),
    }),
    [unit],
  );
}
