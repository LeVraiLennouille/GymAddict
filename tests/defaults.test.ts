import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { DEFAULT_PROGRAMS, DEFAULT_RUNS, defaultProgramConfig } from '../src/domain/defaults/programs';
import { buildRepsLabel, exRepFields } from '../src/domain/rules/progression';
import { sanitizeExercise, sanitizeProgramConfig } from '../src/domain/rules/program';
import { applyExercisePatch } from '../src/domain/actions/program';
import { ALL_MUSCLE_KEYS } from '../src/domain/defaults/constants';

const allExercises = Object.entries(DEFAULT_PROGRAMS).flatMap(([key, p]) => p.exercises.map((ex) => ({ key, ex })));

describe('programmes par défaut : cohérence des données', () => {
  it('il y a des exercices à vérifier', () => {
    assert.ok(allExercises.length >= 20);
  });

  it('chaque exercice traverse le nettoyage sans changer', () => {
    for (const { key, ex } of allExercises) {
      assert.deepEqual(sanitizeExercise(ex), ex, `${key}/${ex.id}`);
    }
  });

  it('la configuration par défaut est un point fixe du nettoyage (hors couleurs/ordre déjà valides)', () => {
    const cfg = defaultProgramConfig();
    assert.deepEqual(sanitizeProgramConfig(cfg), cfg);
  });

  it('identifiants uniques dans une même séance, muscles connus, valeurs raisonnables', () => {
    for (const [key, p] of Object.entries(DEFAULT_PROGRAMS)) {
      const ids = p.exercises.map((e) => e.id);
      assert.equal(new Set(ids).size, ids.length, `identifiants en double dans ${key}`);
      for (const ex of p.exercises) {
        assert.ok(ex.muscles.every((m) => (ALL_MUSCLE_KEYS as readonly string[]).includes(m)), `${key}/${ex.id} : muscle inconnu`);
        assert.ok(ex.sets >= 1 && ex.sets <= 12, `${key}/${ex.id} : séries`);
        assert.ok(ex.restSec >= 10 && ex.restSec <= 600, `${key}/${ex.id} : repos`);
        assert.ok(ex.defaultReps >= 1, `${key}/${ex.id} : répétitions`);
        if (ex.superset) assert.ok(p.exercises.filter((e) => e.superset === ex.superset).length >= 2, `${key}/${ex.id} : superset seul`);
      }
    }
  });

  it('libellés de répétitions : lus puis reconstruits à l\'identique', () => {
    for (const { key, ex } of allExercises) {
      const f = exRepFields(ex);
      assert.ok(f.min >= 1 && f.max >= f.min, `${key}/${ex.id} : fourchette « ${ex.repsLabel} »`);
      if (f.failure) continue;
      const rebuilt = buildRepsLabel(ex, f.min, f.max);
      assert.deepEqual(exRepFields({ ...ex, repsLabel: rebuilt }), f, `${key}/${ex.id} : « ${ex.repsLabel} » -> « ${rebuilt} »`);
    }
  });

  it('édition sans changement : l\'exercice reste identique', () => {
    for (const { key, ex } of allExercises) {
      const f = exRepFields(ex);
      if (!f.failure) {
        const same = applyExercisePatch(ex, { reps: { min: f.min, max: f.max } });
        assert.equal(same.repsLabel, ex.repsLabel, `${key}/${ex.id} : le libellé change à la moindre modification`);
      }
      assert.deepEqual(applyExercisePatch(ex, { sets: ex.sets, restSec: ex.restSec }), ex, `${key}/${ex.id}`);
    }
  });

  it('sorties par défaut : objectifs cohérents', () => {
    for (const [id, run] of Object.entries(DEFAULT_RUNS)) {
      assert.ok(run.name.length > 0, id);
      if (run.targetDistance && run.targetDuration && run.targetPace) {
        const pace = (run.targetDuration * 60) / run.targetDistance;
        assert.ok(Math.abs(pace - run.targetPace) <= 60, `${id} : allure ${run.targetPace} s/km incohérente avec ${run.targetDistance} km en ${run.targetDuration} min`);
      }
    }
  });
});
