import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const tsxFiles = (dir: string): string[] =>
  readdirSync(join(ROOT, dir), { recursive: true })
    .filter((f) => f.endsWith('.tsx'))
    .map((f) => join(dir, f));

/** Composants qui produisent un bouton (`<button>`) dans le navigateur. */
const BUTTONS = new Set(['Pressable', 'Button', 'ChoiceChip', 'Switch']);

/** Retourne « fichier:ligne <A> dans <B> » pour chaque bouton placé dans un autre bouton. */
function nestedButtonsIn(file: string, text: string): string[] {
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TSX);
  const found: string[] = [];
  const visit = (node: ts.Node, parent: string | null): void => {
    let current = parent;
    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = (ts.isJsxElement(node) ? node.openingElement.tagName : node.tagName).getText();
      if (BUTTONS.has(tag)) {
        if (parent) found.push(`${file}:${source.getLineAndCharacterOfPosition(node.getStart()).line + 1} <${tag}> dans <${parent}>`);
        current = parent ?? tag;
      }
    }
    ts.forEachChild(node, (child) => visit(child, current));
  };
  visit(source, null);
  return found;
}

const nestedButtons = (file: string): string[] => nestedButtonsIn(file, readFileSync(join(ROOT, file), 'utf8'));

describe('interface : règles pour le navigateur', () => {
  it("aucun bouton n'est placé dans un autre bouton (invalide en HTML, erreur dans la console)", () => {
    const problems = [...tsxFiles('src'), ...tsxFiles('app')].flatMap(nestedButtons);
    assert.deepEqual(problems, []);
  });

  it("le détecteur reconnaît bien un bouton imbriqué", () => {
    assert.deepEqual(nestedButtonsIn('x.tsx', '<Pressable><View><Button /></View></Pressable>'), ['x.tsx:1 <Button> dans <Pressable>']);
    assert.deepEqual(nestedButtonsIn('x.tsx', '<View><Pressable /><Button /></View>'), []); // boutons voisins : valide
    assert.deepEqual(nestedButtonsIn('x.tsx', '<Pressable><Text>ok</Text></Pressable>'), []);
  });
});
