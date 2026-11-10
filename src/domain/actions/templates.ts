import type { AppData, DayName, ProgramId } from '../types';
import { DAYS_ORDER } from '../defaults/constants';
import type { ProgramTemplate } from '../defaults/templates';
import { getProgramConfig, rememberExNames } from '../rules/program';
import { clone, has } from '../rules/sanitize';

export type TemplateMode = 'add' | 'replace';

/**
 * Importe un programme prêt à l'emploi.
 * - `add` : ajoute ses séances à celles de l'utilisateur, sans changer le planning de la semaine.
 * - `replace` : remplace les séances et le planning (les sorties running sont conservées) ;
 *   les jours déjà faits restent dans l'historique.
 */
export function applyTemplate(
  data: AppData,
  template: ProgramTemplate,
  mode: TemplateMode,
): { data: AppData; programIds: ProgramId[] } {
  const cfg = clone(getProgramConfig(data));
  const idMap = new Map<ProgramId, ProgramId>();

  if (mode === 'replace') {
    const kept = cfg.programs['repos'];
    cfg.programs = kept ? { repos: kept } : {};
    cfg.order = kept ? ['repos'] : [];
  }

  for (const key of template.order) {
    const source = template.programs[key];
    if (!source) continue;
    let id = key;
    for (let n = 2; has(cfg.programs, id); n++) id = `${key}_${n}`;
    idMap.set(key, id);
    cfg.programs[id] = clone(source);
    cfg.order = [...cfg.order.filter((k) => k !== 'repos'), id, ...(has(cfg.programs, 'repos') ? ['repos'] : [])];
  }

  if (mode === 'replace') {
    const weekly = {} as Record<DayName, ProgramId>;
    for (const day of DAYS_ORDER) {
      const wanted = template.weekly[day];
      weekly[day] = (wanted && idMap.get(wanted)) || 'repos';
    }
    cfg.weekly = weekly;
  }

  let next: AppData = { ...data, program: cfg };
  if (mode === 'replace') {
    // Les choix manuels vers une séance supprimée n'ont plus de sens : le planning reprend la main.
    const dayProgram = { ...next.dayProgram };
    for (const [date, key] of Object.entries(dayProgram)) {
      if (!has(cfg.programs, key)) delete dayProgram[date as keyof typeof dayProgram];
    }
    next = { ...next, dayProgram };
  }
  return { data: rememberExNames(next), programIds: [...idMap.values()] };
}
