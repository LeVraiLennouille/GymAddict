import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Même clé que l'ancienne appli web : sur le navigateur, AsyncStorage s'appuie sur `localStorage`,
 * donc les données déjà enregistrées au même endroit sont relues sans migration.
 */
export const STORAGE_KEY = 'fitcore';
const CORRUPT_KEY = 'fitcore.corrupt';

/** Lit et décode les données. En cas de JSON illisible, une copie brute est gardée avant de repartir à vide. */
export async function loadStoredData(): Promise<unknown> {
  let raw: string | null = null;
  try {
    raw = await AsyncStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
  if (!raw) return null;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    try {
      await AsyncStorage.setItem(CORRUPT_KEY, raw);
    } catch {
      /* rien de plus à tenter */
    }
    return null;
  }
}

export async function saveStoredData(json: string): Promise<boolean> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, json);
    return true;
  } catch {
    return false;
  }
}

export async function readKey(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    return null;
  }
}

export async function writeKey(key: string, value: string): Promise<void> {
  try {
    await AsyncStorage.setItem(key, value);
  } catch {
    /* le minuteur n'est pas critique */
  }
}

export async function removeKey(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    /* idem */
  }
}
