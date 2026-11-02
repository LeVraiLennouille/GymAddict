/**
 * Lecture et écriture de fichiers texte — version iOS / Android.
 * La version navigateur est dans `files.web.ts` (même interface).
 */
import { File, Paths } from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';

export type SaveResult = 'saved' | 'unavailable';

/** Écrit le fichier dans le cache puis ouvre la feuille de partage (Enregistrer dans Fichiers, Drive, mail…). */
export async function saveTextFile(name: string, text: string, mime = 'application/json'): Promise<SaveResult> {
  const file = new File(Paths.cache, name);
  if (file.exists) file.delete();
  file.create();
  file.write(text);
  if (!(await Sharing.isAvailableAsync())) return 'unavailable';
  await Sharing.shareAsync(file.uri, { mimeType: mime, dialogTitle: 'Sauvegarde GymAddict', UTI: 'public.json' });
  return 'saved';
}

export interface PickedFile {
  name: string;
  text: string;
}

/** Ouvre le sélecteur de fichiers ; `null` si l'utilisateur annule. */
export async function pickTextFile(): Promise<PickedFile | null> {
  const result = await DocumentPicker.getDocumentAsync({ type: ['application/json', 'text/plain', '*/*'], copyToCacheDirectory: true, multiple: false });
  if (result.canceled) return null;
  const asset = result.assets[0];
  if (!asset) return null;
  return { name: asset.name, text: await new File(asset.uri).text() };
}
