import { z } from 'zod';
import { extractBackupPayload } from '@/domain/rules/backup';

/** Taille maximale acceptée pour un fichier de sauvegarde. */
export const MAX_BACKUP_CHARS = 20_000_000;

/**
 * Forme de l'enveloppe d'export. Tous les champs sont facultatifs : les anciens exports
 * (objet brut) n'ont pas d'enveloppe. Le contenu de `data` est validé ensuite par `normalizeAppData`.
 */
const envelopeSchema = z.object({
  app: z.string().optional(),
  format: z.number().optional(),
  exportedAt: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
});

export type BackupReadResult =
  | { ok: true; payload: Record<string, unknown>; exportedAt: string | null }
  | { ok: false; reason: 'too-large' | 'invalid-json' | 'unrecognized' };

/** Lit le texte d'un fichier importé et en extrait les données, sans jamais lever d'exception. */
export function readBackupText(text: string): BackupReadResult {
  if (text.length > MAX_BACKUP_CHARS) return { ok: false, reason: 'too-large' };

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, reason: 'invalid-json' };
  }

  const payload = extractBackupPayload(parsed);
  if (!payload) return { ok: false, reason: 'unrecognized' };

  const envelope = envelopeSchema.safeParse(parsed);
  const exportedAt = envelope.success && envelope.data.exportedAt ? envelope.data.exportedAt : null;
  return { ok: true, payload, exportedAt };
}

export const BACKUP_ERROR_MESSAGES: Record<Exclude<BackupReadResult, { ok: true }>['reason'], string> = {
  'too-large': 'Fichier trop volumineux',
  'invalid-json': "Ce fichier n'est pas un JSON valide",
  unrecognized: "Ce fichier n'est pas une sauvegarde GymAddict",
};
