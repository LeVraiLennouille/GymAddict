/** Lecture et écriture de fichiers texte — version navigateur (téléchargement et sélecteur natif). */

export type SaveResult = 'saved' | 'unavailable';

export async function saveTextFile(name: string, text: string, mime = 'application/json'): Promise<SaveResult> {
  const url = URL.createObjectURL(new Blob([text], { type: mime }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return 'saved';
}

export interface PickedFile {
  name: string;
  text: string;
}

export function pickTextFile(): Promise<PickedFile | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) {
        resolve(null);
        return;
      }
      file.text().then(
        (text) => resolve({ name: file.name, text }),
        () => resolve(null),
      );
    };
    input.addEventListener('cancel', () => resolve(null));
    input.click();
  });
}
