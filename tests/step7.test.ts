import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import type { AppData, DateKey } from '../src/domain/types';
import { emptyAppData, normalizeAppData } from '../src/domain/rules/appData';
import { getProgramConfig } from '../src/domain/rules/program';
import {
  defaultReminderDays,
  formatReminderTime,
  getReminder,
  parseReminderTime,
  planReminders,
  reminderMessage,
  reminderSignature,
  shiftReminderTime,
  toggleReminderDay,
} from '../src/domain/rules/reminders';
import { setReminderDays, setReminderEnabled, setReminderTime } from '../src/domain/actions/reminders';
import { completeSet, saveDayProgramOverride } from '../src/domain/actions/workout';
import { setRunDay, setWeeklyProgram } from '../src/domain/actions/program';

const TODAY = '2026-10-28' as DateKey; // mercredi
const k = (s: string): DateKey => s as DateKey;
const at = (h: number, m = 0): Date => new Date(2026, 9, 28, h, m, 0);
const fresh = (): AppData => emptyAppData(TODAY);
const enabled = (d = fresh()): AppData => setReminderEnabled(d, true);

describe('rappels : réglages', () => {
  it('jours par défaut : ceux du planning (séance ou sortie)', () => {
    const days = defaultReminderDays(getProgramConfig(fresh()));
    assert.ok(days.length >= 4);
    assert.ok(days.every((d) => d >= 0 && d <= 6));
    assert.deepEqual(days, [...days].sort((a, b) => a - b).sort((a, b) => days.indexOf(a) - days.indexOf(b)));
    // un jour de repos sans sortie n'est pas proposé
    let d = setWeeklyProgram(fresh(), 'samedi', 'repos');
    d = setRunDay(d, 'samedi', '');
    assert.ok(!defaultReminderDays(getProgramConfig(d)).includes(6));
    d = setRunDay(d, 'samedi', 'hiit');
    assert.ok(defaultReminderDays(getProgramConfig(d)).includes(6));
  });

  it('valeurs par défaut : désactivé, 18:00', () => {
    const r = getReminder(fresh());
    assert.equal(r.enabled, false);
    assert.equal(r.time, '18:00');
  });

  it('heure : lecture, formatage, décalage sur 24 h', () => {
    assert.deepEqual(parseReminderTime('7:05'), { hours: 7, minutes: 5 });
    assert.deepEqual(parseReminderTime('99:99'), { hours: 23, minutes: 59 });
    assert.deepEqual(parseReminderTime('abc'), { hours: 18, minutes: 0 });
    assert.equal(formatReminderTime(7, 5), '07:05');
    assert.equal(shiftReminderTime('18:00', 15), '18:15');
    assert.equal(shiftReminderTime('23:45', 15), '00:00');
    assert.equal(shiftReminderTime('00:00', -15), '23:45');
    assert.equal(shiftReminderTime('10:30', -1440), '10:30');
  });

  it('jours : ajout, retrait, tri', () => {
    assert.deepEqual(toggleReminderDay([1, 3], 2), [1, 2, 3]);
    assert.deepEqual(toggleReminderDay([1, 2, 3], 2), [1, 3]);
    assert.deepEqual(toggleReminderDay([], 0), [0]);
  });

  it('actions : activer, heure, jours', () => {
    let d = setReminderEnabled(fresh(), true);
    d = setReminderTime(d, '6:07');
    d = setReminderDays(d, [1, 4]);
    assert.deepEqual(d.prefs.reminder, { enabled: true, time: '06:07', days: [1, 4] });
    // survit à un aller-retour par la normalisation
    const again = normalizeAppData(JSON.parse(JSON.stringify(d)), TODAY);
    assert.deepEqual(again.prefs.reminder, { enabled: true, time: '06:07', days: [1, 4] });
  });
});

describe('rappels : planification', () => {
  const allDays = (d: AppData) => setReminderDays(d, [0, 1, 2, 3, 4, 5, 6]);

  it('rien si désactivé ou sans jour', () => {
    assert.deepEqual(planReminders(fresh(), at(9)), []);
    assert.deepEqual(planReminders(setReminderDays(enabled(), []), at(9)), []);
  });

  it('message : séance, sortie, les deux, ou rien un jour de repos', () => {
    const d = fresh();
    assert.equal(reminderMessage(d, k('2026-10-26')), 'Séance du jour : Pectoraux & Triceps'); // lundi
    assert.equal(reminderMessage(saveDayProgramOverride(d, k('2026-10-26'), 'repos'), k('2026-10-26')), null);
    const both = setRunDay(d, 'lundi', 'hiit');
    assert.ok(reminderMessage(both, k('2026-10-26'))?.includes('+ sortie'));
    const runOnly = setRunDay(saveDayProgramOverride(d, k('2026-10-26'), 'repos'), 'lundi', 'hiit');
    assert.ok(reminderMessage(runOnly, k('2026-10-26'))?.startsWith('Sortie du jour :'));
  });

  it('14 jours, heure à venir uniquement, jours de repos ignorés', () => {
    const plan = planReminders(allDays(enabled()), at(9));
    assert.ok(plan.length > 0 && plan.length <= 14);
    assert.ok(plan.every((p) => p.at.getTime() > at(9).getTime()));
    assert.ok(plan.every((p) => p.at.getHours() === 18 && p.at.getMinutes() === 0));
    assert.equal(plan[0]?.date, TODAY); // mercredi : séance prévue, 18:00 pas encore passé
    // les dates sont croissantes et sans doublon
    const dates = plan.map((p) => p.date);
    assert.deepEqual(dates, [...new Set(dates)].sort());
    // aucune date au-delà de l'horizon
    assert.ok((plan[plan.length - 1]?.date ?? '') <= '2026-11-10');
  });

  it('heure déjà passée : on commence demain', () => {
    const plan = planReminders(allDays(enabled()), at(19));
    assert.notEqual(plan[0]?.date, TODAY);
  });

  it('entraînement déjà fait aujourd\'hui : pas de rappel ce soir', () => {
    let d = allDays(enabled());
    d = completeSet(d, { date: TODAY, exId: 'x', idx: 0, done: true, weight: '10', reps: '10', now: 1 });
    const plan = planReminders(d, at(9));
    assert.ok(!plan.some((p) => p.date === TODAY));
    assert.ok(plan.length > 0);
  });

  it('seuls les jours choisis sont planifiés', () => {
    const d = setReminderDays(enabled(), [1]); // lundis
    const plan = planReminders(d, at(9));
    assert.ok(plan.every((p) => p.at.getDay() === 1));
    assert.ok(plan.length >= 1);
  });

  it('empreinte : stable, change avec l\'heure ou le contenu', () => {
    const a = planReminders(allDays(enabled()), at(9));
    const b = planReminders(allDays(enabled()), at(9));
    assert.equal(reminderSignature(a), reminderSignature(b));
    const c = planReminders(allDays(setReminderTime(enabled(), '19:30')), at(9));
    assert.notEqual(reminderSignature(a), reminderSignature(c));
    const changed = saveDayProgramOverride(allDays(enabled()), k('2026-10-29'), 'abdos');
    assert.notEqual(reminderSignature(a), reminderSignature(planReminders(changed, at(9))));
    assert.equal(reminderSignature([]), '');
  });
});
