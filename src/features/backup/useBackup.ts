import { useState } from 'react';
import { useAppStore } from '@/data/store/appStore';
import { BACKUP_ERROR_MESSAGES, readBackupText } from '@/data/backup/envelopeSchema';
import { pickTextFile, saveTextFile } from '@/data/backup/files';
import { writeKey } from '@/data/storage/storage';
import { todayKey } from '@/domain/format/dates';
import { normalizeAppData, serializeAppData } from '@/domain/rules/appData';
import {
  backupFileName,
  backupStatus,
  buildBackupFile,
  markBackedUp,
  mergeAppData,
  snoozeBackup,
  summarizeBackup,
  type BackupStatus,
  type BackupSummary,
} from '@/domain/rules/backup';
import type { AppData } from '@/domain/types';
import { useTimerStore } from '@/services/timerStore';
import { showToast } from '@/ui/feedbackStore';

/** Copie de l'état d'avant import, gardée au cas où l'on s'est trompé de fichier. */
const BEFORE_IMPORT_KEY = 'fitcore.before-import';

export interface PendingImport {
  fileName: string;
  exportedAt: string | null;
  incoming: AppData;
  summary: BackupSummary;
  /** Résumé de ce qui est actuellement sur l'appareil (pour comparer). */
  current: BackupSummary;
}

export interface BackupModel {
  status: BackupStatus;
  lastBackup: number | undefined;
  pending: PendingImport | null;
  busy: boolean;
  exportBackup: () => Promise<void>;
  chooseFile: () => Promise<void>;
  cancelImport: () => void;
  applyImport: (mode: 'merge' | 'replace') => Promise<void>;
  snooze: () => void;
}

/** Sauvegarde (export) et restauration (import fusion ou remplacement) des données. */
export function useBackup(): BackupModel {
  const data = useAppStore((s) => s.data);
  const update = useAppStore((s) => s.update);
  const [pending, setPending] = useState<PendingImport | null>(null);
  const [busy, setBusy] = useState(false);

  return {
    status: backupStatus(data),
    lastBackup: data.lastBackup,
    pending,
    busy,

    exportBackup: async () => {
      setBusy(true);
      try {
        const now = new Date();
        const file = buildBackupFile(useAppStore.getState().data, now);
        const result = await saveTextFile(backupFileName(now), JSON.stringify(file));
        if (result === 'unavailable') {
          showToast("Le partage de fichiers n'est pas disponible sur cet appareil");
          return;
        }
        update((d) => markBackedUp(d, now.getTime()));
        showToast('Sauvegarde exportée');
      } catch {
        showToast("Impossible d'exporter la sauvegarde");
      } finally {
        setBusy(false);
      }
    },

    chooseFile: async () => {
      setBusy(true);
      try {
        const picked = await pickTextFile();
        if (!picked) return;
        const read = readBackupText(picked.text);
        if (!read.ok) {
          showToast(BACKUP_ERROR_MESSAGES[read.reason]);
          return;
        }
        const incoming = normalizeAppData(read.payload, todayKey());
        setPending({
          fileName: picked.name,
          exportedAt: read.exportedAt,
          incoming,
          summary: summarizeBackup(incoming),
          current: summarizeBackup(useAppStore.getState().data),
        });
      } catch {
        showToast('Impossible de lire ce fichier');
      } finally {
        setBusy(false);
      }
    },

    cancelImport: () => setPending(null),

    applyImport: async (mode) => {
      if (!pending) return;
      const store = useAppStore.getState();
      // Filet de sécurité : l'état actuel est copié avant toute modification.
      await writeKey(BEFORE_IMPORT_KEY, serializeAppData(store.data));
      if (mode === 'replace') {
        store.replace(pending.incoming);
        showToast('Données remplacées par la sauvegarde');
      } else {
        const { data: merged, added } = mergeAppData(store.data, pending.incoming);
        store.replace(merged);
        const parts = [
          added.sessionDaysAdded ? `${added.sessionDaysAdded} jour${added.sessionDaysAdded > 1 ? 's' : ''} de séances` : '',
          added.recordsImproved ? `${added.recordsImproved} record${added.recordsImproved > 1 ? 's' : ''}` : '',
          added.weighInsAdded ? `${added.weighInsAdded} pesée${added.weighInsAdded > 1 ? 's' : ''}` : '',
          added.goalsAdded ? `${added.goalsAdded} objectif${added.goalsAdded > 1 ? 's' : ''}` : '',
        ].filter(Boolean);
        showToast(parts.length ? `Fusion terminée : +${parts.join(', ')}` : 'Fusion terminée : rien de nouveau');
      }
      useTimerStore.getState().dismiss();
      setPending(null);
    },

    snooze: () => update((d) => snoozeBackup(d, Date.now())),
  };
}
