import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const sourceFiles = (dir: string): string[] =>
  readdirSync(join(ROOT, dir), { recursive: true })
    .filter((f) => /\.(ts|tsx)$/.test(f))
    .map((f) => join(dir, f));

const importsOf = (file: string): string[] => {
  const src = readFileSync(join(ROOT, file), 'utf8');
  return [...src.matchAll(/(?:from|import)\s+['"]([^'"]+)['"]/g)].map((m) => m[1] ?? '');
};

describe('architecture : sens des dépendances', () => {
  it('domain/ est du TypeScript pur (ni React, ni Expo, ni couches supérieures)', () => {
    const forbidden = /^(react|react-native|expo|zustand|@react-native|@\/(data|services|features|ui|theme)|app\/)/;
    for (const file of sourceFiles('src/domain')) {
      for (const imp of importsOf(file)) {
        assert.ok(!forbidden.test(imp), `${file} importe « ${imp} » : interdit dans domain/`);
        if (imp.startsWith('.')) {
          assert.ok(!/(data|services|features|ui|theme)\//.test(imp), `${file} remonte vers « ${imp} »`);
        }
      }
    }
  });

  it('data/ ne dépend ni de features/ ni de ui/', () => {
    for (const file of sourceFiles('src/data')) {
      for (const imp of importsOf(file)) {
        assert.ok(!/^@\/(features|ui|theme)/.test(imp), `${file} importe « ${imp} »`);
      }
    }
  });

  it('features/ n\'importe pas app/ (les écrans importent les features, pas l\'inverse)', () => {
    for (const file of sourceFiles('src/features')) {
      for (const imp of importsOf(file)) {
        assert.ok(!/(^|\/)app\//.test(imp), `${file} importe « ${imp} »`);
      }
    }
  });
});

describe('routes : les deux fichiers _layout.tsx ont chacun le bon rôle', () => {
  const read = (file: string): string => readFileSync(join(ROOT, file), 'utf8');

  it('app/_layout.tsx est le layout racine : un Stack, pas des onglets', () => {
    const root = read('app/_layout.tsx');
    assert.ok(root.includes('<Stack'), 'app/_layout.tsx doit contenir <Stack> (layout racine)');
    assert.ok(!root.includes('<Tabs'), 'app/_layout.tsx contient <Tabs> : ce fichier a été remplacé par celui de app/(tabs)/');
    assert.ok(root.includes('ThemeProvider'), 'app/_layout.tsx doit installer le thème et les fournisseurs');
  });

  it('app/(tabs)/_layout.tsx est le layout des onglets', () => {
    const tabs = read('app/(tabs)/_layout.tsx');
    assert.ok(tabs.includes('<Tabs'), 'app/(tabs)/_layout.tsx doit contenir <Tabs>');
    for (const name of ['index', 'week', 'stats', 'cardio', 'profile']) {
      assert.ok(tabs.includes(`name="${name}"`), `onglet « ${name} » non déclaré`);
    }
  });

  it('chaque onglet déclaré a son fichier de route', () => {
    const files = readdirSync(join(ROOT, 'app/(tabs)'), { recursive: true });
    for (const name of ['index', 'week', 'stats', 'cardio', 'profile']) {
      assert.ok(files.includes(`${name}.tsx`), `app/(tabs)/${name}.tsx manquant`);
    }
  });
});
