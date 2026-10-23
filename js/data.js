/* GymAddict — module « data » (chargé au démarrage) */
const ICONS={
  check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  close:'<path d="M6 6l12 12M18 6L6 18"/>',
  chev:'<path d="M9 6l6 6-6 6"/>',
  refresh:'<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>',
  undo:'<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>',
  star:'<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8 6.8 19.6l1-5.8L3.5 9.7l5.9-.8z"/>',
  dumbbell:'<path d="M6.5 7v10M17.5 7v10M3.5 9.5v5M20.5 9.5v5M6.5 12h11"/>',
  back:'<path d="M15 6l-6 6 6 6"/>',
  pulse:'<path d="M3 12h4l3-7 4 14 3-7h4"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  up:'<path d="M6 14l6-6 6 6"/>',
  down:'<path d="M6 10l6 6 6-6"/>',
  trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12M9 7V4h6v3"/>',
  edit:'<path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17z"/><path d="M14.5 7.5l3 3"/>'
};
const ic=n=>`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]||''}</svg>`;
const EX_LUNDI = [
  {id:"dev_pec_echauff", name:"Développé couché (à vide)", sets:2, repsLabel:"15 reps", defaultReps:15, type:"echauffement", muscles:["pecs", "triceps"], restSec:60},
  {id:"tractions", name:"Tractions", sets:2, repsLabel:"Échec", defaultReps:10, type:"compound", muscles:["dos", "biceps"], restSec:120},
  {id:"dips", name:"Dips", sets:2, repsLabel:"Échec", defaultReps:10, type:"compound", muscles:["triceps"], restSec:120},
  {id:"dev_couche", name:"Développé couché", sets:4, repsLabel:"8-12 reps", defaultReps:10, type:"compound", muscles:["pecs"], restSec:120},
  {id:"pupitre_halteres", name:"Pupitre haltères", sets:4, repsLabel:"8-12 reps", defaultReps:10, type:"compound", muscles:["biceps"], restSec:120},
  {id:"bar_front", name:"Barre au front (EZ Bar)", sets:3, repsLabel:"10-12 reps", defaultReps:10, type:"isolation", muscles:["triceps"], restSec:90},
  {id:"curl_ez_bar", name:"Curl (EZ Bar)", sets:3, repsLabel:"12-15 reps", defaultReps:15, type:"isolation", muscles:["biceps"], restSec:90},
  {id:"dev_incline", name:"Développé incliné (haltères ou machine)", sets:3, repsLabel:"10-12 reps", defaultReps:10, type:"compound", muscles:["pecs"], restSec:120},
  {id:"ecarte_poulie_haute", name:"Écartés à la poulie haute", sets:3, repsLabel:"12-15 reps", defaultReps:15, type:"isolation", muscles:["pecs"], restSec:90},
  {id:"ext_triceps_poulie", name:"Extensions Triceps (Corde)", sets:3, repsLabel:"12-15 reps", defaultReps:15, type:"isolation", muscles:["triceps"], restSec:90},
  {id:"papillon_pecs", name:"Papillons Pecs", sets:3, repsLabel:"10-12 reps", defaultReps:10, type:"isolation", muscles:["pecs"], restSec:120},
  {id:"pompes", name:"Pompes", sets:3, repsLabel:"10-12 reps", defaultReps:10, type:"isolation", muscles:["pecs"], restSec:90},
];
const EX_MARDI = [
  {id:"tractions", name:"Tractions", sets:2, repsLabel:"Échec", defaultReps:10, type:"compound", muscles:["dos", "biceps"], restSec:120},
  {id:"tirage_vertical", name:"Tirage Vertical (Poulie Haute)", sets:3, repsLabel:"10-12 reps", defaultReps:11, type:"compound", muscles:["dos"], restSec:120},
  {id:"papillon_dos", name:"Papillons Dorsaux", sets:3, repsLabel:"10-12 reps", defaultReps:10, type:"isolation", muscles:["dos"], restSec:120},
  {id:"tirage_horizontal", name:"Tirage Horizontal", sets:4, repsLabel:"8-12 reps", defaultReps:10, type:"compound", muscles:["dos"], restSec:120},
  {id:"pull_over_poulie", name:"Pull-over à la poulie haute", sets:3, repsLabel:"12-15 reps", defaultReps:15, type:"isolation", muscles:["dos"], restSec:90},

  {id:"dev_militaire", name:"Développé Militaire Assis", sets:4, repsLabel:"8-12 reps", defaultReps:10, type:"compound", muscles:["epaules"], restSec:120},
  {id:"elevations_laterales", name:"Élévations Latérales", sets:4, repsLabel:"12-15 reps", defaultReps:15, type:"isolation", muscles:["epaules"], restSec:90},
  {id:"oiseau_poulie", name:"Oiseau à la Poulie Haute", sets:3, repsLabel:"15-20 reps", defaultReps:18, type:"isolation", muscles:["epaules"], restSec:90},
  {id:"tirage_menton", name:"Tirage Menton", sets:3, repsLabel:"10-12 reps", defaultReps:11, type:"compound", muscles:["epaules", "trapezes"], restSec:120},
  {id:"shrugs", name:"Shrugs", sets:3, repsLabel:"12-15 reps", defaultReps:15, type:"isolation", muscles:["trapezes"], restSec:90},
];
const EX_MERCREDI = [
  {id:"squat", name:"Squat (Barre)", sets:4, repsLabel:"6-10 reps", defaultReps:8, type:"compound", muscles:["jambes"], restSec:120},
  {id:"leg_press", name:"Presse à Cuisses", sets:3, repsLabel:"10-12 reps", defaultReps:11, type:"compound", muscles:["jambes"], restSec:120},
  {id:"fentes_marchees", name:"Fentes Marchées (Haltères)", sets:3, repsLabel:"10-12 reps / jambe", defaultReps:11, type:"compound", muscles:["jambes"], restSec:120},
  {id:"leg_extension", name:"Leg Extension", sets:3, repsLabel:"12-15 reps", defaultReps:15, type:"isolation", muscles:["jambes"], restSec:90},
  {id:"leg_curl", name:"Leg Curl", sets:3, repsLabel:"12-15 reps", defaultReps:15, type:"isolation", muscles:["jambes"], restSec:90},
  {id:"mollets", name:"Mollets Debout Machine", sets:4, repsLabel:"15-20 reps", defaultReps:18, type:"isolation", muscles:["mollets"], restSec:90},
];
const EX_JEUDI = [
  {id:"dev_pec_echauff", name:"Développé couché (à vide)", sets:2, repsLabel:"15 reps", defaultReps:15, type:"echauffement", muscles:["pecs", "triceps"], restSec:60},
  {id:"tractions", name:"Tractions", sets:2, repsLabel:"Échec", defaultReps:10, type:"compound", muscles:["dos", "biceps"], restSec:120},
  {id:"dips", name:"Dips", sets:2, repsLabel:"Échec", defaultReps:10, type:"compound", muscles:["triceps"], restSec:120},
  {id:"dev_couche", name:"Développé couché", sets:4, repsLabel:"8-12 reps", defaultReps:10, type:"compound", muscles:["pecs"], restSec:120},
  {id:"pupitre_halteres", name:"Pupitre haltères", sets:4, repsLabel:"8-12 reps", defaultReps:10, type:"compound", muscles:["biceps"], restSec:120},
  {id:"bar_front", name:"Barre au front (EZ Bar)", sets:3, repsLabel:"10-12 reps", defaultReps:10, type:"isolation", muscles:["triceps"], restSec:90},
  {id:"curl_ez_bar", name:"Curl (EZ Bar)", sets:3, repsLabel:"12-15 reps", defaultReps:15, type:"isolation", muscles:["biceps"], restSec:90},
  {id:"dev_incline", name:"Développé incliné (haltères ou machine)", sets:3, repsLabel:"10-12 reps", defaultReps:10, type:"compound", muscles:["pecs"], restSec:120},
  {id:"ecarte_poulie_haute", name:"Écartés à la poulie haute", sets:3, repsLabel:"12-15 reps", defaultReps:15, type:"isolation", muscles:["pecs"], restSec:90},
  {id:"ext_triceps_poulie", name:"Extensions Triceps (Corde)", sets:3, repsLabel:"12-15 reps", defaultReps:15, type:"isolation", muscles:["triceps"], restSec:90},
  {id:"papillon_pecs", name:"Papillons Pecs", sets:3, repsLabel:"10-12 reps", defaultReps:10, type:"isolation", muscles:["pecs"], restSec:120},
  {id:"pompes", name:"Pompes", sets:3, repsLabel:"10-12 reps", defaultReps:10, type:"isolation", muscles:["pecs"], restSec:90},
];
const EX_VENDREDI = [
  {id:"tractions", name:"Tractions", sets:2, repsLabel:"Échec", defaultReps:10, type:"compound", muscles:["dos", "biceps"], restSec:120},
  {id:"tirage_vertical", name:"Tirage Vertical (Poulie Haute)", sets:3, repsLabel:"10-12 reps", defaultReps:11, type:"compound", muscles:["dos"], restSec:120},
  {id:"papillon_dos", name:"Papillons Dorsaux", sets:3, repsLabel:"10-12 reps", defaultReps:10, type:"isolation", muscles:["dos"], restSec:120},
  {id:"tirage_horizontal", name:"Tirage Horizontal", sets:4, repsLabel:"8-12 reps", defaultReps:10, type:"compound", muscles:["dos"], restSec:120},
  {id:"pull_over_poulie", name:"Pull-over à la poulie haute", sets:3, repsLabel:"12-15 reps", defaultReps:15, type:"isolation", muscles:["dos"], restSec:90},

  {id:"dev_militaire", name:"Développé Militaire Assis", sets:4, repsLabel:"8-12 reps", defaultReps:10, type:"compound", muscles:["epaules"], restSec:120},
  {id:"elevations_laterales", name:"Élévations Latérales", sets:4, repsLabel:"12-15 reps", defaultReps:15, type:"isolation", muscles:["epaules"], restSec:90},
  {id:"oiseau_poulie", name:"Oiseau à la Poulie Haute", sets:3, repsLabel:"15-20 reps", defaultReps:18, type:"isolation", muscles:["epaules"], restSec:90},
  {id:"tirage_menton", name:"Tirage Menton", sets:3, repsLabel:"10-12 reps", defaultReps:11, type:"compound", muscles:["epaules", "trapezes"], restSec:120},
  {id:"shrugs", name:"Shrugs", sets:3, repsLabel:"12-15 reps", defaultReps:15, type:"isolation", muscles:["trapezes"], restSec:90},
];
const EX_ABDOS = [
  {id:"planche_ab",      name:"Planche",                  sets:4, repsLabel:"30–60 sec",      defaultReps:45, type:"isolation", muscles:["abdos"], restSec:60, isTime:true},
  {id:"crunchs",         name:"Crunchs",                  sets:4, repsLabel:"20–25 reps",     defaultReps:20, type:"isolation", muscles:["abdos"], restSec:60},
  {id:"crunchs_obliques",name:"Crunchs Obliques",         sets:3, repsLabel:"15–20 reps / côté",defaultReps:15,type:"isolation", muscles:["abdos"], restSec:60},
  {id:"relevés_jambes",  name:"Relevés de Jambes",        sets:3, repsLabel:"15–20 reps",     defaultReps:15, type:"compound",  muscles:["abdos"], restSec:75},
  {id:"mountain_climbers",name:"Mountain Climbers",       sets:3, repsLabel:"30 sec",         defaultReps:30, type:"isolation", muscles:["abdos"], restSec:60, isTime:true},
  {id:"russian_twists",  name:"Russian Twists (lest)",    sets:3, repsLabel:"20 reps",        defaultReps:20, type:"isolation", muscles:["abdos"], restSec:60},
  {id:"ab_wheel",        name:"Roue Abdominale",          sets:3, repsLabel:"8–12 reps",      defaultReps:10, type:"compound",  muscles:["abdos"], restSec:90},
];
/* Programmes par défaut. L'utilisateur peut les modifier depuis l'éditeur (Programme > Modifier mes séances) ;
   sa version personnalisée est stockée dans localStorage (fitcore.program) et appliquée au démarrage. */
const DEFAULT_PROGRAMS = {
  pecs_tri: {label:"Pecs & Triceps", fullName:"Pectoraux & Triceps",   type:"gym",  color:"red",    exercises: EX_LUNDI},
  dos_ep:   {label:"Dos & Épaules",  fullName:"Dos & Épaules",         type:"gym",  color:"blue",   exercises: EX_MARDI},
  abdos:    {label:"Abdos",          fullName:"Abdominaux & Core",     type:"gym",  color:"green",  exercises: EX_ABDOS},
  jambes:   {label:"Jambes",         fullName:"Jambes & Mollets",      type:"gym",  color:"yellow", exercises: EX_MERCREDI},
  epaules:  {label:"Épaules",        fullName:"Épaules & Trapèzes",    type:"gym",  color:"blue",   exercises: EX_JEUDI},
  rappel:   {label:"Rappel",         fullName:"Rappel Haut du Corps",  type:"gym",  color:"red",    exercises: EX_VENDREDI},
  repos:    {label:"Repos",          fullName:"Repos Total",           type:"rest", color:"grey",   exercises: []}
};
/* Corrections d'étiquettes de muscles des exercices par défaut (appliquées aux programmes déjà enregistrés
   seulement si l'ancienne valeur par défaut est encore en place : un réglage manuel n'est jamais écrasé). */
const MUSCLE_FIXES = {
  tractions:        {from:['triceps'], to:['dos','biceps']},
  pupitre_halteres: {from:['triceps'], to:['biceps']},
  curl_ez_bar:      {from:['triceps'], to:['biceps']}
};
const DEFAULT_ORDER = ['pecs_tri','dos_ep','abdos','jambes','epaules','rappel','repos'];
const DEFAULT_WEEKLY = {lundi:'pecs_tri', mardi:'dos_ep', mercredi:'abdos', jeudi:'pecs_tri', vendredi:'dos_ep', samedi:'repos', dimanche:'repos'};
/* Sorties running : types + jours (personnalisables dans l'éditeur) */
const DEFAULT_RUNS = {
  hiit:   {name:'Fractionné HIIT', desc:'Intervalles haute intensité pour brûler max de calories.',    detail:'10min éco · 10-15× (30s sprint/30s récup) · 5min retour', targetDistance:0, targetDuration:35, targetPace:0},
  tempo:  {name:'Tempo',           desc:'Allure soutenue sur 5km pour développer ton seuil lactique.', detail:'5km continu, légèrement inconfortable mais constant',    targetDistance:5, targetDuration:0,  targetPace:0},
  longue: {name:'Sortie longue',   desc:'Endurance fondamentale Zone 2 pour brûler les graisses.',     detail:'45–60min très lent, conversation possible',               targetDistance:0, targetDuration:50, targetPace:0}
};
const DEFAULT_RUN_ORDER = ['hiit','tempo','longue'];
const DEFAULT_RUN_WEEKLY = {lundi:'', mardi:'hiit', mercredi:'', jeudi:'tempo', vendredi:'', samedi:'', dimanche:'longue'};
/* Objets « vivants » : remplis par applyProgram() */
const PROGRAM = {};
const PROGRAM_PICKER_KEYS = [];
const WEEKLY_SUGGESTIONS = {};
const RUNS = {};
const RUN_ORDER = [];
const RUN_WEEKLY = {};
let WEEKLY_KM = 0;
const COLOR_MAP = {red:'var(--c-red)', blue:'var(--c-blue)', yellow:'var(--c-yellow)', green:'var(--c-green)', grey:'#3A3E48'};
const progColor = k => { const p = PROGRAM[k]; return (p && COLOR_MAP[p.color]) || 'var(--c-green)'; };
const DAY_LABELS = {
  lundi:'Lundi', mardi:'Mardi', mercredi:'Mercredi',
  jeudi:'Jeudi', vendredi:'Vendredi', samedi:'Samedi', dimanche:'Dimanche'
};
const DAY_NUMBER = {lundi:1, mardi:2, mercredi:3, jeudi:4, vendredi:5, samedi:6, dimanche:0};
const DAYS_ORDER = ['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'];
const DAY_JS_MAP  = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
const MUSCLE_LABELS = ['Pecs','Dos','Épaules','Biceps','Triceps','Abdos','Jambes'];
const MUSCLE_KEYS   = ['pecs','dos','epaules','biceps','triceps','abdos','jambes'];
const ZONE_DATA = [
  {name:'Zone 1',label:'Récupération active',pct:[50,60]},
  {name:'Zone 2',label:'Endurance / Brûle-graisses',pct:[60,70]},
  {name:'Zone 3',label:'Aérobie — Endurance',pct:[70,80]},
  {name:'Zone 4',label:'Tempo / Seuil lactique',pct:[80,90]},
  {name:'Zone 5',label:'VO2max / Sprint',pct:[90,100]},
];
// Échelle de chaleur : bleu (calme) → vert → jaune → orange → rouge (max)
const ZONE_COLORS=['#5B96FF','#34D07A','#F5B700','#FF8A3D','#FF4D5A'];
function gs(){try{return JSON.parse(localStorage.getItem('fitcore')||'{}')}catch{return {}}}
function ss(d){localStorage.setItem('fitcore',JSON.stringify(d))}
function dateToKey(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function todayKey(){return dateToKey(new Date());}
function getDayName(){return DAY_JS_MAP[new Date().getDay()]}
/* ============================================================
   CONFIGURATION DU PROGRAMME (données éditables)
   ============================================================ */
const cloneJSON = o => JSON.parse(JSON.stringify(o));
const EX_TYPES = ['compound','isolation','echauffement'];
function defaultProgramConfig(){
  return {v:1, programs:cloneJSON(DEFAULT_PROGRAMS), order:DEFAULT_ORDER.slice(), weekly:Object.assign({},DEFAULT_WEEKLY),
    runs:cloneJSON(DEFAULT_RUNS), runOrder:DEFAULT_RUN_ORDER.slice(), runWeekly:Object.assign({},DEFAULT_RUN_WEEKLY), weeklyKm:0};
}
function txtClean(s, max){ return String(s == null ? '' : s).replace(/[<>"\\`]/g, '').replace(/\s+/g, ' ').trim().slice(0, max); }
function numIn(v, min, max){ const n = parseFloat(String(v == null ? '' : v).replace(',', '.')); return (n >= min && n <= max) ? Math.round(n * 100) / 100 : 0; }
function sanitizeEx(e){
  const o = Object.assign({}, e);
  o.id = String(e.id); o.name = String(e.name);
  o.sets = Math.min(12, Math.max(1, parseInt(e.sets) || 3));
  o.defaultReps = Math.max(1, parseInt(e.defaultReps) || 10);
  o.restSec = Math.min(600, Math.max(10, parseInt(e.restSec) || 90));
  o.type = EX_TYPES.includes(e.type) ? e.type : 'isolation';
  o.muscles = Array.isArray(e.muscles) ? e.muscles.map(String) : [];
  o.repsLabel = String(e.repsLabel || (o.defaultReps + (e.isTime ? ' sec' : ' reps')));
  if(e.isTime) o.isTime = true; else delete o.isTime;
  const st = parseFloat(e.step); if(st > 0) o.step = st; else delete o.step;
  if(/^[A-D]$/.test(String(e.superset || ''))) o.superset = String(e.superset); else delete o.superset;
  const fix = MUSCLE_FIXES[o.id];
  if(fix && JSON.stringify(o.muscles) === JSON.stringify(fix.from)) o.muscles = fix.to.slice();
  return o;
}
function sanitizeProgramConfig(c){
  if(!c || typeof c !== 'object' || !c.programs || typeof c.programs !== 'object') return null;
  const out = {v:1, programs:{}, order:[], weekly:{}};
  Object.keys(c.programs).forEach(k => {
    const p = c.programs[k]; if(!p || typeof p !== 'object') return;
    const type = p.type === 'rest' ? 'rest' : 'gym';
    out.programs[k] = {
      label: String(p.label || p.fullName || 'Séance'),
      fullName: String(p.fullName || p.label || 'Séance'),
      type,
      color: COLOR_MAP[p.color] ? p.color : (type === 'rest' ? 'grey' : 'green'),
      exercises: type === 'rest' ? [] : (Array.isArray(p.exercises) ? p.exercises.filter(e => e && e.id && e.name).map(sanitizeEx) : [])
    };
  });
  if(!out.programs.repos) out.programs.repos = cloneJSON(DEFAULT_PROGRAMS.repos);
  out.order = (Array.isArray(c.order) ? c.order : Object.keys(out.programs)).filter(k => out.programs[k]);
  Object.keys(out.programs).forEach(k => { if(!out.order.includes(k)) out.order.push(k); });
  DAYS_ORDER.forEach(d => { const k = c.weekly && c.weekly[d]; out.weekly[d] = out.programs[k] ? k : 'repos'; });
  /* sorties running */
  const hasRuns = !!(c.runs && typeof c.runs === 'object');
  const srcRuns = hasRuns ? c.runs : cloneJSON(DEFAULT_RUNS);
  out.runs = {};
  Object.keys(srcRuns).forEach(k => {
    const r = srcRuns[k]; if(!r || typeof r !== 'object') return;
    out.runs[k] = {name:txtClean(r.name, 40) || 'Sortie', desc:txtClean(r.desc, 240), detail:txtClean(r.detail, 240),
      targetDistance:numIn(r.targetDistance, 0, 200), targetDuration:numIn(r.targetDuration, 0, 600), targetPace:numIn(r.targetPace, 0, 1800)};
  });
  out.runOrder = (hasRuns ? (Array.isArray(c.runOrder) ? c.runOrder : Object.keys(out.runs)) : DEFAULT_RUN_ORDER).filter(k => out.runs[k]);
  Object.keys(out.runs).forEach(k => { if(!out.runOrder.includes(k)) out.runOrder.push(k); });
  const srcWeekly = hasRuns ? ((c.runWeekly && typeof c.runWeekly === 'object') ? c.runWeekly : {}) : DEFAULT_RUN_WEEKLY;
  out.runWeekly = {};
  DAYS_ORDER.forEach(d => { const k = srcWeekly[d]; out.runWeekly[d] = out.runs[k] ? k : ''; });
  out.weeklyKm = numIn(c.weeklyKm, 0, 500);
  return out;
}
function loadProgramConfig(){ return sanitizeProgramConfig(gs().program) || defaultProgramConfig(); }
function applyProgram(cfg){
  Object.keys(PROGRAM).forEach(k => delete PROGRAM[k]);
  Object.keys(cfg.programs).forEach(k => { PROGRAM[k] = cfg.programs[k]; });
  PROGRAM_PICKER_KEYS.length = 0;
  cfg.order.forEach(k => { if(PROGRAM[k]) PROGRAM_PICKER_KEYS.push(k); });
  Object.keys(WEEKLY_SUGGESTIONS).forEach(k => delete WEEKLY_SUGGESTIONS[k]);
  DAYS_ORDER.forEach(d => { WEEKLY_SUGGESTIONS[d] = PROGRAM[cfg.weekly[d]] ? cfg.weekly[d] : 'repos'; });
  Object.keys(RUNS).forEach(k => delete RUNS[k]);
  Object.keys(cfg.runs).forEach(k => { RUNS[k] = cfg.runs[k]; });
  RUN_ORDER.length = 0; cfg.runOrder.forEach(k => { if(RUNS[k]) RUN_ORDER.push(k); });
  Object.keys(RUN_WEEKLY).forEach(k => delete RUN_WEEKLY[k]);
  DAYS_ORDER.forEach(d => { RUN_WEEKLY[d] = RUNS[cfg.runWeekly[d]] ? cfg.runWeekly[d] : ''; });
  WEEKLY_KM = cfg.weeklyKm || 0;
}
/* Registre id -> nom : conserve le nom des exercices même retirés du programme (l'historique reste lisible) */
function rememberExNames(){
  const d = gs(); const names = d.exNames || {}; const defs = d.exDefs || {}; let changed = false;
  Object.values(PROGRAM).forEach(p => p.exercises.forEach(e => {
    if(names[e.id] !== e.name){ names[e.id] = e.name; changed = true; }
    const mini = {id:e.id, name:e.name, type:e.type, muscles:e.muscles, isTime:!!e.isTime};
    if(JSON.stringify(defs[e.id]) !== JSON.stringify(mini)){ defs[e.id] = mini; changed = true; }
  }));
  if(changed){ d.exNames = names; d.exDefs = defs; ss(d); }
}
let _progCfg = null;
function initProgram(){ _progCfg = loadProgramConfig(); applyProgram(_progCfg); rememberExNames(); }
function saveProgramConfig(){
  const d = gs(); d.program = _progCfg; ss(d);
  applyProgram(_progCfg); rememberExNames(); triggerSave();
  scheduleReminderSync();
}
/* Répétitions : lecture / reconstruction du libellé (« 8-12 reps », « Échec », « 30–60 sec ») */
function exRepFields(ex){
  const lab = ex.repsLabel || '';
  if(/[eé]chec/i.test(lab)) return {failure:true, min:ex.defaultReps||10, max:ex.defaultReps||10};
  const m = lab.match(/(\d+)\s*(?:[–-]\s*(\d+))?/);
  if(m){ const a = +m[1], b = m[2] ? +m[2] : a; return {failure:false, min:a, max:Math.max(a,b)}; }
  return {failure:false, min:ex.defaultReps||10, max:ex.defaultReps||10};
}
function buildRepsLabel(ex, min, max){
  const lab = ex.repsLabel || '';
  const tail = /[eé]chec/i.test(lab) ? '' : lab.replace(/^[\s\d–-]*(reps|sec)?/i, '');
  return (min === max ? ''+min : min+'-'+max) + (ex.isTime ? ' sec' : ' reps') + tail;
}
function fmtRest(s){
  s = +s || 0; if(s < 60) return s + 's';
  const m = Math.floor(s/60), r = s % 60;
  return r ? m + 'm' + String(r).padStart(2,'0') : m + 'min';
}
const fmtKg = n => String(Math.round(n*100)/100).replace('.', ',');
initProgram();