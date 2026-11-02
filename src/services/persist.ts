import { Platform } from 'react-native';

interface StorageManagerLike {
  persist?: () => Promise<boolean>;
  persisted?: () => Promise<boolean>;
}

/**
 * Navigateur : demande que les données du site ne soient pas supprimées automatiquement.
 * Sans effet sur iOS et Android (les données de l'appli y sont déjà durables).
 */
export async function requestPersistentStorage(): Promise<'granted' | 'denied' | 'unsupported'> {
  if (Platform.OS !== 'web' || typeof navigator === 'undefined') return 'unsupported';
  const manager = (navigator as { storage?: StorageManagerLike }).storage;
  if (!manager?.persist) return 'unsupported';
  try {
    if (manager.persisted && (await manager.persisted())) return 'granted';
    return (await manager.persist()) ? 'granted' : 'denied';
  } catch {
    return 'denied';
  }
}
