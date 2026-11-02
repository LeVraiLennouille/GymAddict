import { Platform } from 'react-native';
import { isAvailableAsync as keepAwakeAvailable } from 'expo-keep-awake';
import { readKey, removeKey, writeKey } from '@/data/storage/storage';
import { getPermission, remindersSupported } from './reminders';

export type DiagStatus = 'ok' | 'warn' | 'fail';

export interface DiagItem {
  id: string;
  label: string;
  status: DiagStatus;
  detail: string;
}

export interface DiagInput {
  sessionDays: number;
  /** Taille des données enregistrées, en octets. */
  dataBytes: number;
  lastBackup: number | undefined;
  sound: boolean;
  vibrate: boolean;
  remindersEnabled: boolean;
}

interface WebNavigator {
  storage?: { persisted?: () => Promise<boolean> };
  serviceWorker?: { controller?: unknown };
  vibrate?: unknown;
  standalone?: boolean;
}

const item = (id: string, label: string, status: DiagStatus, detail: string): DiagItem => ({ id, label, status, detail });

const formatSize = (bytes: number): string =>
  bytes < 1024 ? `${bytes} o` : bytes < 1048576 ? `${Math.round(bytes / 102.4) / 10} Ko` : `${Math.round(bytes / 104857.6) / 10} Mo`;

/** Contrôle ce dont l'appli dépend : stockage, notifications, retour sensoriel, et sur le web l'installation. */
export async function runDiagnostic(input: DiagInput): Promise<DiagItem[]> {
  const out: DiagItem[] = [];

  // Stockage : écriture puis relecture d'une valeur témoin.
  const probe = `diag-${Date.now()}`;
  await writeKey('fitcore.diag', probe);
  const back = await readKey('fitcore.diag');
  await removeKey('fitcore.diag');
  out.push(
    back === probe
      ? item('storage', 'Stockage', 'ok', 'Lecture et écriture fonctionnent.')
      : item('storage', 'Stockage', 'fail', "Impossible d'écrire sur l'appareil : tes données ne seraient pas conservées."),
  );

  out.push(item('data', 'Données', input.sessionDays > 0 ? 'ok' : 'warn', `${input.sessionDays} jour${input.sessionDays > 1 ? 's' : ''} de séances · ${formatSize(input.dataBytes)}`));

  const days = input.lastBackup ? Math.floor((Date.now() - input.lastBackup) / 864e5) : null;
  out.push(
    days === null
      ? item('backup', 'Sauvegarde', input.sessionDays >= 3 ? 'warn' : 'ok', "Aucune sauvegarde exportée : pense à en faire une dans l'onglet Profil.")
      : item('backup', 'Sauvegarde', days >= 14 ? 'warn' : 'ok', days === 0 ? "Sauvegarde exportée aujourd'hui." : `Dernière sauvegarde il y a ${days} jour${days > 1 ? 's' : ''}.`),
  );

  if (remindersSupported) {
    const permission = await getPermission();
    out.push(
      permission === 'granted'
        ? item('notifications', 'Notifications', 'ok', input.remindersEnabled ? 'Autorisées, rappels actifs.' : 'Autorisées (rappels désactivés).')
        : item('notifications', 'Notifications', input.remindersEnabled ? 'fail' : 'warn', 'Non autorisées : active-les dans les réglages du téléphone pour recevoir les rappels.'),
    );
  } else {
    out.push(item('notifications', 'Notifications', 'warn', "Non disponibles dans le navigateur : utilise l'application mobile pour les rappels."));
  }

  out.push(item('sound', 'Son', input.sound ? 'ok' : 'warn', input.sound ? 'Activé : bips sur les 3 dernières secondes, puis sonnerie.' : 'Désactivé dans le profil.'));

  const nav = (typeof navigator === 'undefined' ? {} : navigator) as WebNavigator;
  const vibrationOk = Platform.OS !== 'web' || typeof nav.vibrate === 'function';
  out.push(
    !vibrationOk
      ? item('vibration', 'Vibration', 'warn', 'Non prise en charge par ce navigateur (ex. Safari sur iPhone).')
      : item('vibration', 'Vibration', input.vibrate ? 'ok' : 'warn', input.vibrate ? 'Activée à la fin du repos.' : 'Désactivée dans le profil.'),
  );

  let awake = false;
  try {
    awake = await keepAwakeAvailable();
  } catch {
    awake = false;
  }
  out.push(item('awake', 'Écran allumé pendant le repos', awake ? 'ok' : 'warn', awake ? 'Disponible : l\'écran reste allumé pendant le minuteur.' : "Indisponible : l'écran peut se mettre en veille pendant le repos."));

  if (Platform.OS === 'web') {
    let persisted: boolean | null = null;
    try {
      persisted = (await nav.storage?.persisted?.()) ?? null;
    } catch {
      persisted = null;
    }
    out.push(
      persisted === true
        ? item('persist', 'Stockage persistant', 'ok', "Le navigateur ne supprimera pas tes données pour libérer de l'espace.")
        : item('persist', 'Stockage persistant', 'warn', 'Non garanti : le navigateur peut effacer les données du site. Installe l\'appli et exporte des sauvegardes.'),
    );
    const standalone = typeof window !== 'undefined' && (window.matchMedia?.('(display-mode: standalone)').matches || nav.standalone === true);
    out.push(item('installed', 'Appli installée', standalone ? 'ok' : 'warn', standalone ? 'Ouverte comme une application.' : 'Ouverte dans le navigateur : ajoute-la à l\'écran d\'accueil.'));
    const secure = typeof window !== 'undefined' && window.isSecureContext;
    out.push(item('secure', 'Connexion sécurisée', secure ? 'ok' : 'fail', secure ? 'HTTPS (ou localhost).' : "Page non sécurisée : l'installation et le stockage persistant sont indisponibles."));
    out.push(item('worker', 'Mode hors ligne', nav.serviceWorker?.controller ? 'ok' : 'warn', nav.serviceWorker?.controller ? "Le service worker est actif : l'appli fonctionne sans connexion." : 'Pas encore actif : recharge la page une fois.'));
  }

  return out;
}
