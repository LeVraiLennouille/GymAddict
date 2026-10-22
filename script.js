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


function getSet(dateKey,exId,idx){
  const d=gs();
  return (d.workouts&&d.workouts[dateKey]&&d.workouts[dateKey][exId]&&d.workouts[dateKey][exId][idx])||{done:false,weight:'',reps:''};
}

function saveSet(dateKey,exId,idx,field,val){
  const d=gs();
  if(!d.workouts)d.workouts={};
  if(!d.workouts[dateKey])d.workouts[dateKey]={};
  if(!d.workouts[dateKey][exId])d.workouts[dateKey][exId]=[];
  if(!d.workouts[dateKey][exId][idx])d.workouts[dateKey][exId][idx]={done:false,weight:'',reps:''};
  d.workouts[dateKey][exId][idx][field]=val;
  ss(d); triggerSave();
  if(field==='done'&&val){markDayActive(dateKey);touchSession(dateKey);}
}

function getRunLog(dateKey){
  const d=gs();
  return (d.runLogs&&d.runLogs[dateKey])||{done:false,duration:'',distance:'',rpe:''};
}

function saveRunLog(dateKey,field,val){
  const d=gs();
  if(!d.runLogs)d.runLogs={};
  if(!d.runLogs[dateKey])d.runLogs[dateKey]={done:false,duration:'',distance:'',rpe:''};
  d.runLogs[dateKey][field]=val;
  if(field==='duration'||field==='distance')d.runLogs[dateKey].pace=runPaceSec(d.runLogs[dateKey])||'';
  ss(d); triggerSave();
  if(field==='done'&&val)markDayActive(dateKey);
  updateRunPaceUI(dateKey);
  if(field==='done')scheduleReminderSync();
}

function getPRs(){const d=gs();return d.prs||{};}

function savePR(exId,weight,reps,date){
  const d=gs();
  if(!d.prs)d.prs={};
  d.prs[exId]={weight:parseFloat(weight),reps:parseInt(reps)||0,date};
  ss(d);
}

function markDayActive(dateKey){
  const d=gs();
  if(!d.activeDays)d.activeDays=[];
  if(!d.activeDays.includes(dateKey)){d.activeDays.push(dateKey);ss(d);}
  updateStreak();updateReg();
}

function getActiveDays(){const d=gs();return d.activeDays||[];}
function getAge(){const d=gs();return d.age||25;}
function saveAge(a){const d=gs();d.age=a;ss(d);}

function getBodyWeight(){const d=gs();return d.bodyWeight||75;}
function saveBodyWeight(w,dateKey){
  const kg=Math.round(parseFloat(String(w).replace(',','.'))*10)/10;
  if(!(kg>=20&&kg<=300))return false;
  const d=gs(),k=dateKey||todayKey();
  const log=(d.weightLog||[]).filter(e=>e&&e.date!==k);
  log.push({date:k,kg});
  log.sort((a,b)=>a.date<b.date?-1:1);
  d.weightLog=log;
  d.bodyWeight=log[log.length-1].kg;
  ss(d);triggerSave();
  setTimeout(checkGoalsAchieved,300);
  return true;
}

function getExNote(dateKey,exId){
  const d=gs();
  return (d.exNotes&&d.exNotes[dateKey]&&d.exNotes[dateKey][exId])||{settings:'',rpe:''};
}
function saveExNote(dateKey,exId,field,val){
  const d=gs();
  if(!d.exNotes)d.exNotes={};
  if(!d.exNotes[dateKey])d.exNotes[dateKey]={};
  if(!d.exNotes[dateKey][exId])d.exNotes[dateKey][exId]={settings:'',rpe:''};
  d.exNotes[dateKey][exId][field]=val;
  ss(d);triggerSave();
}

function getDayProgramOverride(dateKey){
  const d=gs();return (d.dayProgram&&d.dayProgram[dateKey])||null;
}
function saveDayProgramOverride(dateKey,progKey){
  const d=gs();
  if(!d.dayProgram)d.dayProgram={};
  if(progKey===null){delete d.dayProgram[dateKey];}
  else{d.dayProgram[dateKey]=progKey;}
  ss(d);triggerSave();
}
function getEffectiveDayProgram(dateKey){
  const override=getDayProgramOverride(dateKey);
  if(override&&PROGRAM[override])return{key:override,prog:PROGRAM[override],isSuggestion:false};
  const dt=new Date(dateKey+'T12:00:00');
  const dayName=DAY_JS_MAP[dt.getDay()];
  const sugKey=WEEKLY_SUGGESTIONS[dayName]||'repos';
  return{key:sugKey,prog:PROGRAM[sugKey],dayName,isSuggestion:true};
}

function showProgramPicker(dateKey){
  const current=getDayProgramOverride(dateKey);
  const dt=new Date(dateKey+'T12:00:00');
  const dayName=DAY_JS_MAP[dt.getDay()];
  const defaultKey=WEEKLY_SUGGESTIONS[dayName]||'repos';
  let opts='';
  PROGRAM_PICKER_KEYS.forEach(key=>{
    const p=PROGRAM[key];
    const isSelected=current?current===key:key===defaultKey;
    const isDefault=key===defaultKey;
    const typeLabel=p.type==='rest'?'Repos':p.type==='run'?'Running':'Salle';
    opts+=`<div class="prog-pick-item${isSelected?' selected':''}" onclick="selectDayProgram('${dateKey}','${key}')">
      <span class="prog-pick-icon" style="--c:${progColor(key)}"></span>
      <div class="prog-pick-info">
        <div class="prog-pick-name">${p.fullName}</div>
        <div class="prog-pick-meta">${typeLabel}${p.exercises.length?` · ${p.exercises.length} exercices`:''}${isDefault?' · <span style="color:var(--green)">Suggéré</span>':''}</div>
      </div>
      ${isSelected?'<span class="prog-pick-check">'+ic('check')+'</span>':''}
    </div>`;
  });
  const html=`<div class="modal-overlay" id="progPickerModal" onclick="if(event.target.id==='progPickerModal')closeProgramPicker()">
    <div class="modal-box prog-pick-box">
      <div class="modal-hdr">
        <div class="modal-title">Choisir un programme</div>
        <button class="drawer-close" onclick="closeProgramPicker()">${ic('close')}</button>
      </div>
      <div class="prog-pick-hint">Le programme suggéré est mis en avant. Tu peux choisir n'importe quelle séance.</div>
      <div class="prog-pick-list">${opts}</div>
      ${current?`<button class="prog-pick-reset" onclick="resetDayProgram('${dateKey}')">${ic('undo')} Revenir au programme suggéré</button>`:''}
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend',html);
}
function closeProgramPicker(){const m=document.getElementById('progPickerModal');if(m)m.remove();}
function selectDayProgram(dateKey,progKey){
  saveDayProgramOverride(dateKey,progKey);
  closeProgramPicker();
  renderToday();
  showToast('Programme : '+PROGRAM[progKey].fullName);
}
function resetDayProgram(dateKey){
  saveDayProgramOverride(dateKey,null);
  closeProgramPicker();
  renderToday();
  showToast('Programme par défaut rétabli');
}

function calc1RM(weight,reps){
  if(!weight||!reps||reps<=0)return 0;
  const w=parseFloat(weight),r=parseInt(reps);
  if(r===1)return w;
  if(r>36)return Math.round(w*0.5*10)/10;
  return Math.round(w*(36/(37-r))*10)/10;
}

function getWarmupSets(workingWeight){
  const w=parseFloat(workingWeight)||0;
  if(!w)return[];
  return [
    {pct:40,reps:12,label:'Activation'},
    {pct:60,reps:8,label:'Préparation'},
    {pct:75,reps:5,label:'Mise en route'},
    {pct:85,reps:3,label:'Approche'},
    {pct:95,reps:1,label:'Activation neuro'},
  ].map(s=>({...s,weight:Math.round(w*s.pct/100*2)/2}));
}

const FUN_EQ=[
  {w:4,emoji:'',name:'chat',names:'chats'},
  {w:80,emoji:'',name:'adulte',names:'adultes'},
  {w:200,emoji:'',name:'moto',names:'motos'},
  {w:600,emoji:'',name:'vache',names:'vaches'},
  {w:1500,emoji:'',name:'voiture',names:'voitures'},
  {w:6000,emoji:'',name:"éléphant d'Afrique",names:"éléphants d'Afrique"},
  {w:12000,emoji:'',name:'bus',names:'bus'},
];
function getFunEquivalent(kg){
  if(kg<=0)return null;
  for(let i=FUN_EQ.length-1;i>=0;i--){
    const count=kg/FUN_EQ[i].w;
    if(count>=0.7){
      const c=Math.round(count*10)/10;
      return{emoji:FUN_EQ[i].emoji,count:c,name:c>1.4?FUN_EQ[i].names:FUN_EQ[i].name};
    }
  }
  const c=Math.round(kg/FUN_EQ[0].w);
  return{emoji:FUN_EQ[0].emoji,count:c,name:FUN_EQ[0].names};
}

function getReadiness(dateKey){const d=gs();return (d.readiness&&d.readiness[dateKey])||null;}
function saveReadiness(dateKey,data){const d=gs();if(!d.readiness)d.readiness={};d.readiness[dateKey]=data;ss(d);}
function computeReadinessScore(r){
  if(!r)return null;
  return Math.round(((parseInt(r.sleep||3))+(parseInt(r.stress||3))+(parseInt(r.soreness||3)))/3*10)/10;
}

function getTodayTonnage(){
  const dateKey=todayKey();
  const {prog}=getEffectiveDayProgram(dateKey);const d=gs();
  if(!prog||!d.workouts||!d.workouts[dateKey])return 0;
  let total=0;
  dayExercises(dateKey,prog).forEach(ex=>{
    if(ex.isTime)return;
    (d.workouts[dateKey][ex.id]||[]).forEach(s=>{
      if(s&&s.done)total+=(parseFloat(s.weight)||0)*(parseFloat(s.reps)||ex.defaultReps||10);
    });
  });
  return Math.round(total);
}

function getWeeklyTonnageHistory(exId){
  const d=gs();if(!d.workouts)return[];
  const weekMap={};
  Object.keys(d.workouts).sort().forEach(dateKey=>{
    const sets=(d.workouts[dateKey][exId]||[]).filter(s=>s&&s.done&&parseFloat(s.weight)>0);
    if(!sets.length)return;
    const dt=new Date(dateKey+'T12:00:00');
    const dow=dt.getDay();
    const monDt=new Date(dt);monDt.setDate(dt.getDate()-(dow===0?6:dow-1));
    const wk=dateToKey(monDt);
    if(!weekMap[wk])weekMap[wk]=0;
    sets.forEach(s=>{weekMap[wk]+=(parseFloat(s.weight)||0)*(parseFloat(s.reps)||10);});
  });
  return Object.keys(weekMap).sort().map(wk=>({week:wk,tonnage:Math.round(weekMap[wk])}));
}

function renderHeatmap(){
  const active=getActiveDays();const d=gs();
  const dayTonnage={};
  if(d.workouts){
    Object.keys(d.workouts).forEach(dateKey=>{
      let t=0;
      Object.values(d.workouts[dateKey]).forEach(sets=>{
        (sets||[]).forEach(s=>{if(s&&s.done)t+=((parseFloat(s.weight)||20)*(parseFloat(s.reps)||10));});
      });
      if(t>0)dayTonnage[dateKey]=t;
    });
  }
  if(d.runLogs){
    Object.keys(d.runLogs).forEach(dateKey=>{
      if(d.runLogs[dateKey]&&d.runLogs[dateKey].done&&!dayTonnage[dateKey])dayTonnage[dateKey]=500;
    });
  }
  const today=new Date();today.setHours(0,0,0,0);
  const weeks=16;
  const todayDow=today.getDay();
  const daysFromMon=todayDow===0?6:todayDow-1;
  const thisMonday=new Date(today);thisMonday.setDate(today.getDate()-daysFromMon);
  const startDate=new Date(thisMonday);startDate.setDate(thisMonday.getDate()-((weeks-1)*7));
  const tonnageVals=Object.values(dayTonnage).filter(v=>v>0);
  const maxT=tonnageVals.length?Math.max(...tonnageVals):1;
  const todayStr=todayKey();
  let html='<div class="heatmap-wrap"><div class="heatmap-grid">';
  html+='<div class="heatmap-labels"><div class="hm-day-label"></div>';
  ['L','M','M','J','V','S','D'].forEach(l=>html+=`<div class="hm-day-label">${l}</div>`);
  html+='</div>';
  for(let w=0;w<weeks;w++){
    const weekDate=new Date(startDate);weekDate.setDate(startDate.getDate()+w*7);
    const monthLabel=weekDate.getDate()<=7?weekDate.toLocaleDateString('fr-FR',{month:'short'}):'';
    html+=`<div class="heatmap-week"><div class="hm-month-lbl">${monthLabel}</div>`;
    for(let dw=0;dw<7;dw++){
      const dt=new Date(startDate);dt.setDate(startDate.getDate()+w*7+dw);
      const key=dateToKey(dt);
      const isFuture=dt>today;
      const t=dayTonnage[key]||0;
      const isActive=active.includes(key);
      let lvl=0;
      if(!isFuture&&(isActive||t>0)){
        if(t>0)lvl=Math.min(4,Math.max(1,Math.ceil((t/maxT)*4)));
        else lvl=1;
      }
      const isToday=key===todayStr;
      const clickable=!isFuture&&(t>0||isActive);
      html+=`<div class="hm-cell lvl${lvl}${isFuture?' future':''}${isToday?' hm-today':''}${clickable?' hm-click':''}" title="${key}${t?' · '+Math.round(t)+'kg':''}"${clickable?` onclick="openSessionDetail('${key}')" role="button"`:''}></div>`;
    }
    html+='</div>';
  }
  html+='</div><div class="hm-legend"><span class="hm-leg-txt">Moins</span>';
  for(let i=0;i<=4;i++)html+=`<div class="hm-cell lvl${i}"></div>`;
  html+='<span class="hm-leg-txt">Plus</span></div></div>';
  return html;
}

let _readinessVals={sleep:3,stress:3,soreness:3};

function showWarmupModal(exId,exName){
  const pr=getPRs()[exId];
  const w=pr?pr.weight:0;
  const sets=getWarmupSets(w);
  const oneRM=pr&&pr.reps?calc1RM(pr.weight,pr.reps):0;
  const html=`<div class="modal-overlay" id="warmupModal" onclick="if(event.target.id==='warmupModal')closeModal()">
    <div class="modal-box">
      <div class="modal-hdr">
        <div class="modal-title">Échauffement</div>
        <button class="drawer-close" onclick="closeModal()">${ic('close')}</button>
      </div>
      <div style="font-size:13px;color:var(--dim);margin-bottom:4px">${exName}</div>
      ${oneRM?`<div style="font-size:11px;color:var(--muted);margin-bottom:12px">1RM estimé: <b style="color:var(--orange)">${oneRM}kg</b></div>`:''}
      <div class="warmup-inp-row" style="margin-bottom:14px">
        <div><div style="font-size:11px;color:var(--dim);margin-bottom:4px">Charge de travail (kg)</div>
        <input class="big-inp" type="number" id="warmupWtInp" value="${w||''}" placeholder="kg" inputmode="decimal" style="width:90px"></div>
        <button class="btn-calc" onclick="refreshWarmup()">${ic('refresh')} Calculer</button>
      </div>
      <div id="warmupSets">${w?renderWarmupSets(sets):'<div style="text-align:center;color:var(--muted);font-size:13px;padding:20px 0">Entre ton poids de travail ci-dessus</div>'}</div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend',html);
}

function renderWarmupSets(sets){
  if(!sets||!sets.length)return`<div style="text-align:center;color:var(--muted);font-size:13px;padding:20px 0">Aucune donnée</div>`;
  return sets.map((s,i)=>`<div class="warmup-row">
    <div class="warmup-num">${i+1}</div>
    <div><div class="warmup-label">${s.label}</div><div class="warmup-reps">${s.reps} répétitions</div></div>
    <div class="warmup-weight">${s.weight}<span style="font-size:12px;color:var(--muted);margin-left:3px">kg</span></div>
    <div class="warmup-pct">${s.pct}%</div>
  </div>`).join('');
}

function refreshWarmup(){
  const inp=document.getElementById('warmupWtInp');
  const w=parseFloat(inp?inp.value:0)||0;
  const el=document.getElementById('warmupSets');
  if(el)el.innerHTML=renderWarmupSets(getWarmupSets(w));
}

function closeModal(){
  ['warmupModal','readinessModal','resetModal','edConfirmModal','summaryModal','swapModal','goalModal','volModal','importModal','diagModal'].forEach(id=>{
    const m=document.getElementById(id);if(m)m.remove();
  });
}

function showReadinessPopup(){
  const dateKey=todayKey();
  if(getReadiness(dateKey))return;
  _readinessVals={sleep:3,stress:3,soreness:3};
  const makeStars=(group,defaultVal=3)=>[1,2,3,4,5].map(i=>
    `<button class="star-btn${i<=defaultVal?' s-active':''}" onclick="selectStar('${group}',${i})">${ic('star')}</button>`
  ).join('');
  const pseudo=getProfile().pseudo||'Athlète';
  const html=`<div class="modal-overlay" id="readinessModal">
    <div class="modal-box">
      <div class="modal-hdr"><div class="modal-title">Check-in</div><button class="drawer-close" onclick="closeModal()">${ic('close')}</button></div>
      <div style="font-size:12px;color:var(--dim);margin-bottom:20px">Salut <b style="color:var(--green)">${pseudo}</b> ! Comment tu te sens aujourd'hui ?</div>
      <div style="font-size:10px;color:var(--muted);margin-bottom:16px;text-align:center;font-family:var(--fm)">1 = Très mauvais &nbsp;·&nbsp; 5 = Parfait</div>
      <div class="ready-item">
        <div class="ready-label">Qualité du sommeil</div>
        <div class="ready-scale-labels"><span>Mauvais</span><span>Parfait</span></div>
        <div class="ready-stars" id="rs-sleep">${makeStars('sleep',3)}</div>
      </div>
      <div class="ready-item">
        <div class="ready-label">Énergie et stress</div>
        <div class="ready-scale-labels"><span>Épuisé</span><span>Plein de feu</span></div>
        <div class="ready-stars" id="rs-stress">${makeStars('stress',3)}</div>
      </div>
      <div class="ready-item">
        <div class="ready-label">État musculaire</div>
        <div class="ready-scale-labels"><span>Courbaturé</span><span>Frais</span></div>
        <div class="ready-stars" id="rs-soreness">${makeStars('soreness',3)}</div>
      </div>
      <button class="run-done-btn" style="margin-top:20px;font-size:14px;font-family:var(--fh);letter-spacing:1px" onclick="submitReadiness()">Démarrer</button>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend',html);
}

function selectStar(group,val){
  _readinessVals[group]=val;
  const c=document.getElementById('rs-'+group);
  if(!c)return;
  c.querySelectorAll('.star-btn').forEach((btn,i)=>{
    btn.classList.toggle('s-active',i<val);
  });
}

function submitReadiness(){
  const dateKey=todayKey();
  const score=computeReadinessScore(_readinessVals);
  saveReadiness(dateKey,{..._readinessVals,score});
  closeModal();
  if(score<=2)showToast('Forme basse détectée — réduis tes charges de 10–15%');
  else if(score<=3)showToast('Forme correcte — écoute ton corps en séance');
  else if(score>=4.5)showToast('Forme olympique ! Pulvérise tes records !');
  else showToast('Bonne forme ! Tu vas assurer aujourd\'hui');
  _updateReadinessBadge(score);
}

function _updateReadinessBadge(score){
  const el=document.getElementById('readinessBadge');
  if(!el)return;
  let rColor,rEmoji;
  if(score>=4){rColor='var(--green)';rEmoji='';}
  else if(score>=3){rColor='var(--yellow)';rEmoji='';}
  else{rColor='var(--red)';rEmoji='';}
  el.innerHTML=`${rEmoji} ${score}/5`;
  el.style.display='inline-flex';el.style.borderColor=rColor;el.style.color=rColor;
}

function showToast(msg){
  const el=document.createElement('div');
  el.className='toast';el.textContent=msg;
  document.body.appendChild(el);
  requestAnimationFrame(()=>el.classList.add('show'));
  setTimeout(()=>{el.classList.remove('show');setTimeout(()=>el.remove(),400);},4000);
}

function updateTonnageCard(){
  const el=document.getElementById('tonnageCard');
  if(!el)return;
  const t=getTodayTonnage();
  if(t<=0){el.style.display='none';return;}
  el.style.display='block';
  const vEl=document.getElementById('tonnageVal');
  const eEl=document.getElementById('tonnageEq');
  if(vEl)vEl.textContent=t.toLocaleString('fr-FR')+' kg';
  const eq=getFunEquivalent(t);
  if(eEl)eEl.textContent=eq?`soit ${eq.count} ${eq.name}`:'';
}

function computeStreak(){
  const active=getActiveDays();
  const today=new Date();today.setHours(0,0,0,0);
  let streak=0,cur=new Date(today);
  while(true){
    const key=dateToKey(cur);
    if(active.includes(key)){streak++;cur.setDate(cur.getDate()-1);}
    else{if(cur.getTime()===today.getTime()){cur.setDate(cur.getDate()-1);}else break;}
  }
  return streak;
}

function computeReg(){
  const active=getActiveDays();
  let count=0;
  for(let i=0;i<7;i++){
    const d=new Date();d.setDate(d.getDate()-i);d.setHours(0,0,0,0);
    if(active.includes(dateToKey(d)))count++;
  }
  return Math.round(count/7*100);
}

function updateStreak(){document.getElementById('streakVal').textContent=computeStreak()+' j';}
function updateReg(){document.getElementById('regVal').textContent=computeReg()+'%';}

let _saveTimer;
function triggerSave(){
  clearTimeout(_saveTimer);
  const el=document.getElementById('saveInd');
  el.classList.add('on');
  _saveTimer=setTimeout(()=>el.classList.remove('on'),2000);
}

const _debounce={};
function debounce(key,fn,ms=600){
  clearTimeout(_debounce[key]);
  _debounce[key]=setTimeout(fn,ms);
}

/* ============================================================
   MINUTEUR DE REPOS — basé sur l'heure réelle
   La fin est un horodatage (Date.now), pas un compteur décrémenté : le temps restant reste exact même si
   l'onglet est mis en veille ou ralenti. Alertes : bips sur les 3 dernières secondes, son + vibration à la fin.
   Le verrouillage automatique de l'écran est empêché pendant le repos (Wake Lock) quand le navigateur le permet.
   ============================================================ */
const TIMER_KEY='ga_timer';
let _timerInterval=null,_timerEnd=0,_timerName='Repos',_timerBeeped=-1,_wakeLock=null,_audioCtx=null;

function getPrefs(){return Object.assign({sound:true,vibrate:true},gs().prefs||{});}
function savePref(k,v){const d=gs();d.prefs=Object.assign({sound:true,vibrate:true},d.prefs||{});d.prefs[k]=v;ss(d);}

function _audio(){
  try{
    if(!_audioCtx){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;_audioCtx=new AC();}
    if(_audioCtx.state==='suspended')_audioCtx.resume();
    return _audioCtx;
  }catch(e){return null;}
}
function beep(freq,dur,vol){
  if(!getPrefs().sound)return;
  const c=_audio();if(!c)return;
  try{
    const t=c.currentTime,o=c.createOscillator(),g=c.createGain();
    o.type='sine';o.frequency.value=freq;
    g.gain.setValueAtTime(0.0001,t);
    g.gain.exponentialRampToValueAtTime(vol||0.35,t+0.01);
    g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+dur+0.02);
  }catch(e){}
}
function buzz(pattern){
  if(!getPrefs().vibrate||!navigator.vibrate)return;
  try{navigator.vibrate(pattern);}catch(e){}
}
async function keepAwake(on){
  try{
    if(on){
      if('wakeLock' in navigator&&!_wakeLock){
        _wakeLock=await navigator.wakeLock.request('screen');
        _wakeLock.addEventListener('release',()=>{_wakeLock=null;});
      }
    }else if(_wakeLock){const w=_wakeLock;_wakeLock=null;await w.release();}
  }catch(e){_wakeLock=null;}
}
function persistTimer(){try{localStorage.setItem(TIMER_KEY,JSON.stringify({end:_timerEnd,name:_timerName}));}catch(e){}}
function clearPersistedTimer(){try{localStorage.removeItem(TIMER_KEY);}catch(e){}}
function timerRemaining(){return Math.max(0,Math.ceil((_timerEnd-Date.now())/1000));}

function startTimer(sec,exName){
  _audio(); /* déverrouille le son pendant le geste de l'utilisateur */
  _timerEnd=Date.now()+sec*1000;
  _timerName=exName||'Repos';
  _timerBeeped=-1;
  persistTimer();
  document.getElementById('timerExName').textContent=_timerName;
  document.getElementById('timerWidget').classList.add('show');
  clearInterval(_timerInterval);
  _timerInterval=setInterval(timerTick,250);
  keepAwake(true);
  timerTick();
}
function timerTick(){
  const w=document.getElementById('timerWidget'),d=document.getElementById('timerDisplay');
  if(!w||!d)return;
  const rem=timerRemaining();
  if(rem<=0){timerFinish();return;}
  const m=Math.floor(rem/60),sc=rem%60;
  d.textContent=m+':'+(sc<10?'0':'')+sc;
  d.className='tmr-time'+(rem<=10?' urgent':'');
  w.classList.toggle('urgent',rem<=10);
  if(rem<=3&&_timerBeeped!==rem){_timerBeeped=rem;beep(660,0.12,0.25);}
}
function timerFinish(){
  const w=document.getElementById('timerWidget'),d=document.getElementById('timerDisplay');
  clearInterval(_timerInterval);_timerInterval=null;
  clearPersistedTimer();keepAwake(false);
  if(d){d.textContent='GO !';d.className='tmr-time';}
  if(w)w.classList.remove('urgent');
  buzz([300,120,300,120,500]);
  beep(880,0.45,0.45);setTimeout(()=>beep(1175,0.6,0.45),220);
  setTimeout(()=>{if(!_timerInterval&&w)w.classList.remove('show');},2500);
}
function addTime(s){
  if(!_timerInterval)return;
  _timerEnd+=s*1000;_timerBeeped=-1;
  persistTimer();timerTick();
}
function dismissTimer(){
  clearInterval(_timerInterval);_timerInterval=null;
  clearPersistedTimer();keepAwake(false);
  document.getElementById('timerWidget').classList.remove('show');
}
/* Reprise après retour dans l'appli ou rechargement : le temps écoulé est rattrapé, l'alerte part si la fin est passée */
function restoreTimer(){
  try{
    const t=JSON.parse(localStorage.getItem(TIMER_KEY)||'null');
    if(!t||!t.end)return;
    if(t.end<=Date.now()){clearPersistedTimer();return;}
    _timerEnd=t.end;_timerName=t.name||'Repos';_timerBeeped=-1;
    document.getElementById('timerExName').textContent=_timerName;
    document.getElementById('timerWidget').classList.add('show');
    clearInterval(_timerInterval);_timerInterval=setInterval(timerTick,250);
    keepAwake(true);timerTick();
  }catch(e){}
}
document.addEventListener('visibilitychange',()=>{
  if(document.hidden)return;
  if(_timerInterval){timerTick();keepAwake(true);}
});
window.addEventListener('pageshow',()=>{if(_timerInterval)timerTick();});

function testTimerAlert(){
  _audio();
  buzz([200,100,200]);
  beep(880,0.4,0.4);setTimeout(()=>beep(1175,0.5,0.4),200);
}
function togglePref(k,btn){
  const v=!getPrefs()[k];
  savePref(k,v);
  btn.classList.toggle('on',v);btn.setAttribute('aria-checked',v);
  if(v&&k==='sound')beep(880,0.2,0.35);
  if(v&&k==='vibrate')buzz(80);
}

let _prTimer;
function checkAndShowPR(exId,exName,weight,reps){
  if(!weight||parseFloat(weight)<=0)return;
  const prs=getPRs();
  const old=prs[exId];
  const w=parseFloat(weight), r=parseInt(reps)||0;
  const isNew=!old||(w>old.weight)||(w===old.weight&&r>old.reps);
  if(isNew){
    savePR(exId,weight,reps,todayKey());
    recordSessionPR(todayKey(),exId,exName,w,r);
    setTimeout(checkGoalsAchieved,700);
    clearTimeout(_prTimer);
    document.getElementById('prPopName').textContent=exName;
    document.getElementById('prPopVal').textContent=w+' kg'+(r?' × '+r+' reps':'');
    const ormEl=document.getElementById('prOnerm');
    if(ormEl&&r>1){
      const oneRM=calc1RM(w,r);
      const bw=getBodyWeight();
      const ratio=Math.round(oneRM/bw*100)/100;
      const pcts=[100,95,90,85,80,75,70].map(p=>({p,v:Math.round(oneRM*p/100*2)/2}));
      ormEl.innerHTML=`<div class="pr-1rm-line">1RM Brzycki: <b>${oneRM}kg</b> · <span style="color:var(--blue)">${ratio}× poids corps</span></div>
        <div class="pr-pcts">${pcts.map(p=>`<div class="pr-pct-item"><div class="pr-pct-pct">${p.p}%</div><div class="pr-pct-w">${p.v}kg</div></div>`).join('')}</div>`;
      ormEl.style.display='block';
    } else if(ormEl){
      ormEl.style.display='none';
    }
    const pop=document.getElementById('prPopup');
    pop.classList.add('show');
    _prTimer=setTimeout(()=>pop.classList.remove('show'),6000);
    setTimeout(()=>document.querySelectorAll('.pr-flag[data-ex="'+exId+'"]').forEach(el=>el.style.display='inline-block'),100);
  }
}

function getDayProgress(dateKey,_dayName){
  const {prog}=getEffectiveDayProgram(dateKey);
  if(!prog||prog.type==='rest'||prog.exercises.length===0)return{done:0,total:0,pct:0};
  let total=0,done=0;
  dayExercises(dateKey,prog).forEach(ex=>{
    if(isSkipped(dateKey,ex.id))return;
    for(let i=0;i<ex.sets;i++){total++;if(getSet(dateKey,ex.id,i).done)done++;}
  });
  return{done,total,pct:total>0?Math.round(done/total*100):0};
}

/* Radar : tonnage (kg × reps) des 7 derniers jours par muscle, d'après les exercices réellement faits */
function getMuscleVolumes(){
  const vols={};MUSCLE_KEYS.forEach(k=>{vols[k]=0;});
  const d=gs();
  if(!d.workouts)return MUSCLE_KEYS.map(()=>0);
  for(let i=0;i<7;i++){
    const dt=new Date();dt.setDate(dt.getDate()-i);
    const day=d.workouts[dateToKey(dt)];
    if(!day)continue;
    Object.keys(day).forEach(id=>{
      const def=findExDef(id);
      if(!def||def.type==='echauffement')return;
      (day[id]||[]).forEach(x=>{
        if(!x||!x.done)return;
        const w=parseFloat(x.weight)||20,r=parseFloat(x.reps)||10;
        (def.muscles||[]).forEach(m=>{if(vols[m]!==undefined)vols[m]+=w*r;});
      });
    });
  }
  return MUSCLE_KEYS.map(k=>vols[k]);
}

function getWeightHistory(exId){
  const d=gs();
  if(!d.workouts)return[];
  return Object.keys(d.workouts).sort().reduce((acc,dateKey)=>{
    const sets=(d.workouts[dateKey][exId]||[]).filter(s=>s&&s.done&&parseFloat(s.weight)>0);
    if(sets.length){
      const ws=sets.map(s=>parseFloat(s.weight));
      acc.push({date:dateKey,max:Math.max(...ws),avg:Math.round(ws.reduce((a,b)=>a+b,0)/ws.length*10)/10});
    }
    return acc;
  },[]);
}

function getAllExercises(){
  const seen=new Set(),list=[];
  Object.values(PROGRAM).forEach(day=>day.exercises.forEach(ex=>{
    if(!seen.has(ex.id)){seen.add(ex.id);list.push({id:ex.id,name:ex.name});}
  }));
  /* exercices retirés du programme mais qui ont encore un historique */
  const d=gs(),names=d.exNames||{},hist=new Set();
  Object.values(d.workouts||{}).forEach(day=>Object.keys(day||{}).forEach(id=>hist.add(id)));
  hist.forEach(id=>{ if(!seen.has(id)&&names[id]){seen.add(id);list.push({id,name:names[id]});} });
  return list.sort((a,b)=>a.name.localeCompare(b.name));
}

/* ============================================================
   PROGRESSION : « dernière fois » + suggestion de surcharge
   ============================================================ */
function getLastSession(exId,dateKey){
  const d=gs(); if(!d.workouts)return null;
  const keys=Object.keys(d.workouts).filter(k=>k<dateKey&&d.workouts[k]&&d.workouts[k][exId]).sort().reverse();
  for(const k of keys){
    const sets=(d.workouts[k][exId]||[]).filter(x=>x&&x.done);
    if(sets.length)return {date:k,sets};
  }
  return null;
}
function topSet(sets){
  return sets.reduce((b,x)=>{
    const w=parseFloat(x.weight)||0,r=parseFloat(x.reps)||0;
    return (!b||w>b.w||(w===b.w&&r>b.r))?{w,r}:b;
  },null);
}
function lastSessionHtml(ex,last,top){
  const dstr=new Date(last.date+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'short',day:'numeric',month:'short'});
  const unit=ex.isTime?' s':' reps';
  const val=top.w>0?`${fmtKg(top.w)} kg × ${top.r}${ex.isTime?' s':''}`:`${top.r}${unit}`;
  return `Dernière fois · ${dstr} : <b>${val}</b>${last.sets.length>1?` <span>· ${last.sets.length} séries</span>`:''}`;
}
/* up   : toutes les séries validées et la fourchette haute atteinte -> on monte la charge
   hold : toutes les séries validées mais pas encore le haut de la fourchette -> on garde et on vise plus de reps */
function getProgressionSuggestion(ex,last){
  if(!last||ex.isTime||ex.type==='echauffement')return null;
  const f=exRepFields(ex); if(f.failure)return null;
  if(last.sets.length<ex.sets)return null;
  const w=Math.max(...last.sets.map(x=>parseFloat(x.weight)||0));
  if(w<=0)return null;
  const step=ex.step>0?ex.step:2.5;
  const next=Math.round((w+step)*100)/100;
  const allTop=last.sets.every(x=>(parseFloat(x.reps)||0)>=f.max);
  return allTop?{kind:'up',from:w,weight:next,step,target:f.min}:{kind:'hold',from:w,weight:w,next,target:f.max};
}
function sets0Applied(dateKey,ex,prog){
  if(prog.kind!=='up')return false;
  for(let i=0;i<ex.sets;i++){
    const s=getSet(dateKey,ex.id,i);
    if(!s.done&&parseFloat(s.weight)>=prog.weight)return true;
  }
  return false;
}
function progressionHtml(ex,prog,dateKey,applied){
  if(prog.kind==='hold')
    return `<div class="ex-prog hold" id="exp-${ex.id}"><span>Garde <b>${fmtKg(prog.from)} kg</b> et vise <b>${prog.target} reps</b> sur chaque série pour passer à ${fmtKg(prog.next)} kg.</span></div>`;
  if(applied)
    return `<div class="ex-prog up applied" id="exp-${ex.id}"><span>${ic('check')} Charge passée à <b>${fmtKg(prog.weight)} kg</b></span></div>`;
  return `<div class="ex-prog up" id="exp-${ex.id}"><span><b>Prêt à monter !</b> Toutes les séries validées : essaie <b>${fmtKg(prog.weight)} kg</b> (+${fmtKg(prog.step)}).</span><button onclick="applyProgression('${dateKey}','${ex.id}',${prog.weight})">Appliquer</button></div>`;
}
function applyProgression(dateKey,exId,weight){
  const {prog}=getEffectiveDayProgram(dateKey);
  const ex=prog&&dayExercises(dateKey,prog).find(e=>e.id===exId); if(!ex)return;
  for(let i=0;i<ex.sets;i++){
    if(getSet(dateKey,exId,i).done)continue;
    saveSet(dateKey,exId,i,'weight',String(weight));
    const el=document.getElementById('w-'+exId+'-'+i);
    if(el){el.value=weight;onWeightInput(exId,i);}
  }
  const box=document.getElementById('exp-'+exId);
  if(box){box.classList.add('applied');box.innerHTML=`<span>${ic('check')} Charge passée à <b>${fmtKg(weight)} kg</b></span>`;}
  showToast('Nouvelle charge : '+fmtKg(weight)+' kg');
}

function renderExBlock(ex,dateKey){
  if(isSkipped(dateKey,ex.id)){
    return `<div class="ex-block">
      <div class="ex-header"><div class="ex-name">${ex.name}</div><span class="badge b-optional">Sauté</span></div>
      <div class="ex-body"><div class="ex-skipped"><span>Machine prise ou exercice passé : il ne compte pas dans la progression.</span><button onclick="skipExercise('${dateKey}','${ex.id}',false)">Reprendre</button></div></div>
    </div>`;
  }
  const prs=getPRs();
  const exPR=prs[ex.id];
  const note=getExNote(dateKey,ex.id);
  const last=getLastSession(ex.id,dateKey);
  const lastTop=last?topSet(last.sets):null;
  const prog=getProgressionSuggestion(ex,last);
  let badge='';
  if(ex.superset) badge=`<span class="badge b-superset">Superset ${ex.superset}</span>`;
  else if(ex.type==='compound') badge=`<span class="badge b-compound">Compound · ${fmtRest(ex.restSec)}</span>`;
  else if(ex.type==='echauffement') badge=`<span class="badge b-rest">Échauffement · ${fmtRest(ex.restSec)}</span>`;
  else badge=`<span class="badge b-isolation">Isolation · ${fmtRest(ex.restSec)}</span>`;
  if(ex.optional) badge+=`<span class="badge b-optional">Optionnel</span>`;

  let setRows='';
  for(let i=0;i<ex.sets;i++){
    const s=getSet(dateKey,ex.id,i);
    const dispW = s.weight!=='' ? s.weight : ((lastTop&&lastTop.w>0) ? lastTop.w : (exPR ? exPR.weight : ''));
    const dispR = s.reps!==''   ? s.reps    : (ex.defaultReps||'');
    const isPR  = exPR && dispW && parseFloat(dispW)>=exPR.weight;
    const safeName=ex.name.replace(/'/g,"\\'");
    setRows+=`
    <div class="set-row" id="setrow-${ex.id}-${i}">
      <div class="set-cb${s.done?' done':''}" id="cb-${ex.id}-${i}"
        onclick="toggleSet('${dateKey}','${ex.id}',${i},'${safeName}',${ex.restSec||90})"></div>
      <div class="input-col">
        <span class="set-lbl">KG</span>
        <input class="si${isPR?' pr-input':''}" type="number" inputmode="decimal"
          id="w-${ex.id}-${i}" value="${dispW}" placeholder="kg"
          onchange="onWeightChange('${dateKey}','${ex.id}',${i},'${safeName}',this.value)"
          oninput="onWeightInput('${ex.id}',${i})">
      </div>
      <div class="input-col">
        <span class="set-lbl">${ex.isTime?'SEC':'REPS'}</span>
        <input class="si" type="number" inputmode="numeric"
          id="r-${ex.id}-${i}" value="${dispR}" placeholder="${ex.isTime?'sec':'reps'}"
          onchange="onRepsChange('${dateKey}','${ex.id}',${i},this.value)">
      </div>
      <div id="pr-${ex.id}-${i}" class="pr-flag" data-ex="${ex.id}"
        style="display:${isPR?'inline-block':'none'}">PR</div>
    </div>`;
  }

  const safeNameDisplay=ex.name.replace(/'/g,"\\'").replace(/"/g,'&quot;');
  const noteEscaped=(note.settings||'').replace(/"/g,'&quot;');

  let doneN=0;for(let i=0;i<ex.sets;i++)if(getSet(dateKey,ex.id,i).done)doneN++;
  const lastHtml=last?`<div class="ex-last">${lastSessionHtml(ex,last,lastTop)}</div>`:'';
  const progHtml=(prog&&doneN<ex.sets)?progressionHtml(ex,prog,dateKey,sets0Applied(dateKey,ex,prog)):'';
  return `
  <div class="ex-block">
    <div class="ex-header" onclick="toggleExCard('${ex.id}')">
      <div class="ex-name">${ex.name}</div>
      ${badge}
      <span class="ex-count">${doneN}/${ex.sets}</span><span class="ex-check">${ic('check')}</span>
    </div>
    <div class="ex-body">
    ${doneN<ex.sets?`<div class="ex-actions"><button onclick="postponeExercise('${dateKey}','${ex.id}')">Passer à la fin</button>${doneN===0?`<button onclick="skipExercise('${dateKey}','${ex.id}',true)">Sauter</button><button onclick="showSwapModal('${dateKey}','${ex.id}')">Remplacer</button>`:''}</div>`:''}
    ${ex.swappedFrom?`<div class="ex-swapped">Remplace <b>${escA(ex.swappedName||'')}</b>${doneN===0?` · <button onclick="revertSwap('${dateKey}','${ex.id}')">Rétablir</button>`:''}</div>`:''}
    <div class="ex-meta">${ex.sets} séries · ${ex.repsLabel}${exPR?` · PR : <b style="color:var(--orange)">${exPR.weight}kg × ${exPR.reps}reps</b>`:''}
    </div>
    ${lastHtml}${progHtml}
    <div class="sets-wrap">${setRows}</div>
    <div class="ex-notes">
      <input class="ex-note-inp" type="text" placeholder="Réglages (ex : cran 4, prise large)"
        value="${noteEscaped}"
        onchange="debounce('ns-${ex.id}-${dateKey}',()=>{saveExNote('${dateKey}','${ex.id}','settings',this.value);},600)">
      <div class="ex-note-rpe-row">
        <div class="rpe-wrap">
          <span class="set-lbl">RPE /10</span>
          <input class="si rpe-inp" type="number" inputmode="numeric" min="1" max="10" placeholder="—"
            value="${note.rpe||''}"
            onchange="debounce('nr-${ex.id}-${dateKey}',()=>{saveExNote('${dateKey}','${ex.id}','rpe',this.value);},400)">
        </div>
        ${!ex.isTime?`<button class="warmup-btn" onclick="showWarmupModal('${ex.id}','${safeNameDisplay}')">Échauffement</button>`:''}
      </div>
    </div>
    </div>
  </div>`;
}

function toggleExCard(id){const c=document.getElementById('exc-'+id);if(c&&c.classList.contains('done'))c.classList.toggle('open');}
function refreshExCards(dateKey,scroll){
  let hasActive=false,justDone=false,activeEl=null,activeSS='';
  document.querySelectorAll('.ex-card').forEach(c=>{
    if(c.classList.contains('skipped')){c.classList.remove('active','open','done');return;}
    const id=c.dataset.ex,n=+c.dataset.sets;let d=0;
    for(let i=0;i<n;i++)if(getSet(dateKey,id,i).done)d++;
    const full=n>0&&d===n;
    if(full&&!c.classList.contains('done'))justDone=true;
    c.classList.toggle('done',full);
    if(!full)c.classList.remove('open');
    let a=false;
    if(!full){
      if(!hasActive){a=true;hasActive=true;activeEl=c;activeSS=c.dataset.ss||'';}
      else if(activeSS&&c.dataset.ss===activeSS)a=true;
    }
    c.classList.toggle('active',a);
    const k=c.querySelector('.ex-count');if(k)k.textContent=d+'/'+n;
  });
  if(scroll&&justDone&&activeEl)requestAnimationFrame(()=>activeEl.scrollIntoView({behavior:'smooth',block:'start'}));
}
function getTonnageFor(dateKey){
  const {prog}=getEffectiveDayProgram(dateKey);const d=gs();
  if(!prog||!d.workouts||!d.workouts[dateKey])return 0;
  let t=0;
  dayExercises(dateKey,prog).forEach(ex=>{if(ex.isTime)return;(d.workouts[dateKey][ex.id]||[]).forEach(s=>{if(s&&s.done)t+=(parseFloat(s.weight)||0)*(parseFloat(s.reps)||ex.defaultReps||10);});});
  return Math.round(t);
}
function restDayHtml(dateKey){
  const fmt=(k,o)=>new Date(k+'T12:00:00').toLocaleDateString('fr-FR',o);
  const t=new Date(dateKey+'T12:00:00');let next='';
  for(let i=1;i<=7&&!next;i++){
    const dk=dateToKey(new Date(t.getFullYear(),t.getMonth(),t.getDate()+i));
    const {prog}=getEffectiveDayProgram(dk);
    if(prog&&prog.type!=='rest')next=`<div class="rest-row"><span class="rest-k">Prochaine séance</span><span class="rest-v">${prog.fullName}<small>${fmt(dk,{weekday:'long',day:'numeric',month:'long'})}</small></span></div>`;
  }
  const last=getActiveDays().filter(k=>k<dateKey).sort().pop();
  let lastRow='';
  if(last){
    const {prog}=getEffectiveDayProgram(last);const tn=getTonnageFor(last);
    lastRow=`<div class="rest-row"><span class="rest-k">Dernière séance</span><span class="rest-v">${prog&&prog.type!=='rest'?prog.fullName:'Séance'}<small>${fmt(last,{weekday:'long',day:'numeric',month:'long'})}${tn?' · '+tn.toLocaleString('fr-FR')+' kg':''}</small></span></div>`;
  }
  return `<div class="rest-day">
    <div class="rest-msg">REPOS</div>
    <div class="rest-sub">La récupération, c'est aussi de l'entraînement.</div>
  </div>
  <div class="stats-grid">
    <div class="stat-card k-yellow"><div class="stat-v">${computeStreak()}</div><div class="stat-l">Jours de streak</div></div>
    <div class="stat-card k-green"><div class="stat-v">${computeReg()}%</div><div class="stat-l">Régularité 7j</div></div>
  </div>
  ${(next||lastRow)?`<div class="card">${next}${lastRow}</div>`:''}
  <button class="prog-switch-btn rest-switch" onclick="showProgramPicker('${dateKey}')">Choisir un programme</button>`;
}

function toggleSet(dateKey,exId,idx,exName,restSec){
  const s=getSet(dateKey,exId,idx);
  const newDone=!s.done;
  saveSet(dateKey,exId,idx,'done',newDone);
  const cb=document.getElementById('cb-'+exId+'-'+idx);
  if(cb)cb.classList.toggle('done',newDone);
  if(newDone){
    const ssNext=supersetNext(dateKey,exId,idx);
    if(ssNext){
      showToast('Superset : enchaîne avec '+ssNext.name);
      const nx=document.getElementById('exc-'+ssNext.id);
      if(nx)setTimeout(()=>nx.scrollIntoView({behavior:'smooth',block:'center'}),150);
    }else startTimer(supersetRest(dateKey,exId,restSec),exName);
    const wEl=document.getElementById('w-'+exId+'-'+idx);
    const rEl=document.getElementById('r-'+exId+'-'+idx);
    const wv=wEl?wEl.value:'', rv=rEl?rEl.value:'';
    const stored=getSet(dateKey,exId,idx);
    if(stored.weight===''&&wv) saveSet(dateKey,exId,idx,'weight',wv);
    if(stored.reps===''&&rv)   saveSet(dateKey,exId,idx,'reps',rv);
    if(wv) checkAndShowPR(exId,exName,wv,rv);
  }
  updateDayProgressBar(dateKey);
  updateTonnageCard();
  refreshExCards(dateKey,true);
  maybeFinishDay(dateKey,newDone);
}
/* Fin de séance : bouton « Résumé » + résumé automatique quand tout ce qui n'est pas sauté est validé */
function maybeFinishDay(dateKey,allowFinish){
  const pr=getDayProgress(dateKey);
  const fb=document.getElementById('finishBtn');
  if(fb)fb.style.display=pr.done>0?'flex':'none';
  if(allowFinish&&pr.total>0&&pr.pct===100&&!getSessionMeta(dateKey).summaryShown){
    updateSessionMeta(dateKey,m=>{m.summaryShown=true;});
    dismissTimer();buzz([120,60,120]);
    setTimeout(()=>{const pp=document.getElementById('prPopup');if(pp)pp.classList.remove('show');showSummary(dateKey);},900);
  }
}

function onWeightChange(dateKey,exId,idx,exName,val){
  debounce('w-'+exId+'-'+idx,()=>{
    saveSet(dateKey,exId,idx,'weight',val);
    const rEl=document.getElementById('r-'+exId+'-'+idx);
    if(val) checkAndShowPR(exId,exName,val,rEl?rEl.value:'');
  });
}

function onWeightInput(exId,idx){
  const el=document.getElementById('w-'+exId+'-'+idx);
  const v=parseFloat(el?el.value:0);
  const old=getPRs()[exId];
  const flag=document.getElementById('pr-'+exId+'-'+idx);
  if(flag)flag.style.display=(old&&v>old.weight)?'inline-block':'none';
}

function onRepsChange(dateKey,exId,idx,val){
  debounce('r-'+exId+'-'+idx,()=>saveSet(dateKey,exId,idx,'reps',val));
}

function updateDayProgressBar(dateKey){
  const dt=new Date(dateKey+'T12:00:00');
  const dayName=DAY_JS_MAP[dt.getDay()];
  const p=getDayProgress(dateKey,dayName);
  const bar=document.getElementById('prog-'+dateKey);
  const txt=document.getElementById('progtxt-'+dateKey);
  if(bar)bar.style.width=p.pct+'%';
  const hp=document.getElementById('heropct-'+dateKey);if(hp)hp.textContent=p.pct;
  if(txt)txt.textContent=p.done+'/'+p.total+' séries';
}

function renderToday(noPopup){
  const dateKey=todayKey();
  const {key:dayName,prog}=getEffectiveDayProgram(dateKey);
  const isOverridden=getDayProgramOverride(dateKey)!==null;
  const el=document.getElementById('today-content');
  if(!prog){el.innerHTML='<div class="empty">Programme indisponible</div>';return;}
  if(prog.type==='rest'){el.innerHTML=restDayHtml(dateKey);return;}
  const p=getDayProgress(dateKey,dayName);
  const readiness=getReadiness(dateKey);
  let rBadgeHtml='';
  if(readiness){
    const score=readiness.score||computeReadinessScore(readiness);
    let rColor,rEmoji;
    if(score>=4){rColor='var(--green)';rEmoji='';}
    else if(score>=3){rColor='var(--yellow)';rEmoji='';}
    else{rColor='var(--red)';rEmoji='';}
    rBadgeHtml=`<div id="readinessBadge" class="readiness-chip" style="border-color:${rColor};color:${rColor};display:inline-flex">${rEmoji} ${score}/5</div>`;
  } else {
    rBadgeHtml=`<div id="readinessBadge" class="readiness-chip" style="display:none"></div>`;
  }
  const tonnage=getTodayTonnage();
  const eq=getFunEquivalent(tonnage);
  const suggestionLabel=!isOverridden?`<span class="prog-suggestion-badge">Suggéré</span>`:'';
  let html=`
  <div class="chip">${new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})}</div>
  <div class="card hero" style="--c:${progColor(dayName)}">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:4px">
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <div class="card-title">${prog.fullName}</div>
          ${isOverridden?`<span class="prog-override-badge">Modifié</span>`:suggestionLabel}
        </div>
        <div class="card-sub">Salle de sport</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
        ${rBadgeHtml}
        <button class="prog-switch-btn" onclick="showProgramPicker('${dateKey}')">Changer</button>
      </div>
    </div>
    <div class="hero-pct"><span id="heropct-${dateKey}">${p.pct}</span><small>%</small><em id="progtxt-${dateKey}">${p.done}/${p.total} séries</em></div>
    <div class="prog-wrap"><div class="prog-fill" id="prog-${dateKey}" style="width:${p.pct}%"></div></div>
  </div>`;
  if(prog.exercises.length>0){
    html+=`<div class="stitle">Exercices</div>`;
    orderedExercises(dateKey,prog).forEach(ex=>{const sk=isSkipped(dateKey,ex.id);html+=`<div class="card ex-card${sk?' skipped':''}${ex.superset?' ss':''}" id="exc-${ex.id}" data-ex="${ex.id}" data-sets="${ex.sets}" data-ss="${ex.superset||''}" style="--c:${progColor(dayName)}">${renderExBlock(ex,dateKey)}</div>`;});
  }

  html+=`<div class="card tonnage-card" id="tonnageCard" style="${tonnage>0?'display:block':'display:none'}">
    <div class="tn-row">
      <div class="eq-ic">${ic('dumbbell')}</div>
      <div>
        <div class="tn-lbl">Tonnage d'aujourd'hui</div>
        <div id="tonnageVal" class="tn-val">${tonnage.toLocaleString('fr-FR')} kg</div>
        <div id="tonnageEq" class="tn-eq">${eq?`soit ${eq.count} ${eq.name}`:''}</div>
      </div>
    </div>
  </div>`;
  html+=sessionNoteCardHtml(dateKey);
  html+=`<button class="finish-btn" id="finishBtn" onclick="showSummary('${dateKey}')" style="display:${p.done>0?'flex':'none'}">${ic('check')} Résumé de la séance</button>`;
  el.innerHTML=html;
  refreshExCards(dateKey,false);
  if(!noPopup)setTimeout(()=>showReadinessPopup(),900);
}

function buildRunCard(running,dateKey,btnId,toggleFn){
  const rl=getRunLog(dateKey);
  return `<div class="stitle">Running</div>
  <div class="run-card">
    <div class="run-title">${running.name}</div>
    ${running.steps.map(s=>`<div class="run-step">${s}</div>`).join('')}
    <div class="run-log">
      <div class="input-col"><span class="set-lbl">DURÉE (min)</span>
        <input class="si" type="number" inputmode="numeric" placeholder="${running.targetDuration}"
          value="${rl.duration}" onchange="debounce('rl-d-${dateKey}',()=>{saveRunLog('${dateKey}','duration',this.value);},400)"></div>
      ${running.targetDistance?`<div class="input-col"><span class="set-lbl">DIST (km)</span>
        <input class="si" type="number" inputmode="decimal" placeholder="${running.targetDistance}"
          value="${rl.distance}" onchange="debounce('rl-s-${dateKey}',()=>{saveRunLog('${dateKey}','distance',this.value);},400)"></div>`:'<div></div>'}
      <div class="input-col"><span class="set-lbl">RPE (1-10)</span>
        <input class="si" type="number" inputmode="numeric" placeholder="7" max="10" min="1"
          value="${rl.rpe}" onchange="debounce('rl-r-${dateKey}',()=>{saveRunLog('${dateKey}','rpe',this.value);},400)"></div>
    </div>
    <button class="run-done-btn${rl.done?' done':''}" id="${btnId}-${dateKey}"
      onclick="${toggleFn}('${dateKey}','${btnId}')">
      ${rl.done?'Séance terminée':'Marquer la séance Running comme faite'}
    </button>
  </div>`;
}

function toggleRunDone(dateKey,btnId){
  const rl=getRunLog(dateKey);
  const v=!rl.done;
  saveRunLog(dateKey,'done',v);
  const btn=document.getElementById((btnId||'runBtn')+'-'+dateKey);
  if(btn){btn.className='run-done-btn'+(v?' done':'');btn.textContent=v?'Séance terminée':'Marquer la séance Running comme faite';}
}

function renderWeek(){
  const todayName=getDayName();
  const el=document.getElementById('week-content');
  let html=`<div class="week-top"><div class="chip">Programme de la semaine</div><button class="prog-switch-btn ed-open" onclick="openProgramEditor()">${ic('edit')} Modifier</button></div>`;
  const WK=weekDateKeys();
  html+=weekCardioHtml(WK);
  DAYS_ORDER.forEach(dayName=>{
    const sugKey=WEEKLY_SUGGESTIONS[dayName]||'repos';
    const prog=PROGRAM[sugKey];
    const isToday=dayName===todayName;
    const dateKey=WK[dayName];
    const override=getDayProgramOverride(dateKey);
    const effectiveProg=override&&PROGRAM[override]?PROGRAM[override]:prog;
    const effKey=override&&PROGRAM[override]?override:sugKey;
    const p=getDayProgress(dateKey,dayName);
    let typeTag='';
    if(effectiveProg.type==='rest')typeTag='<span style="color:var(--muted);font-size:11px">Repos</span>';
    else typeTag='<span style="color:var(--dim);font-size:11px">Salle</span>';
    const clickable=effectiveProg.type!=='rest';
    const overrideBadge=override?`<span style="font-size:10px;color:var(--orange)">modifié</span>`:'';
    html+=`<div class="wday${isToday?' today':''}" ${clickable?`onclick="openDayDrawer('${dayName}','${dateKey}')"`:''}
      style="--c:${progColor(effKey)};${clickable?'':'cursor:default'}">
      ${isToday?'<div class="today-tag">AUJOURD\'HUI</div>':''}
      <div class="wicon">${DAY_LABELS[dayName].slice(0,3)}</div>
      <div style="flex:1;min-width:0">
        <div class="wname">${DAY_LABELS[dayName]} ${overrideBadge}</div>
        <div class="wsub">${effectiveProg.fullName}</div>
        <div style="margin-top:4px">${typeTag}</div>
        ${weekRunLineHtml(dayName,dateKey)}
      </div>
      <div style="margin-left:auto;text-align:right;display:flex;align-items:center;gap:8px">
        <div>
          ${effectiveProg.type!=='rest'&&p.total>0?`
            <div class="wprog${p.pct===0?' zero':''}">${p.pct}%</div>
            <div style="font-size:10px;color:var(--muted)">${p.done}/${p.total}</div>
            <div style="width:60px;height:4px;background:rgba(255,255,255,.06);border-radius:2px;margin-top:4px;margin-left:auto">
              <div style="width:${p.pct}%;height:100%;background:var(--green);border-radius:2px"></div></div>
          `:effectiveProg.type!=='rest'?'<div class="wprog zero">0%</div>':'<div class="wprog zero">—</div>'}
        </div>
        ${clickable?'<div class="wday-chevron">'+ic('chev')+'</div>':''}
      </div>
    </div>`;
  });
  el.innerHTML=html;
}

let _chartMode='max',_chartPts=[];

function renderStats(){
  const prs=getPRs();
  const bw=getBodyWeight();
  const prEntries=Object.entries(prs).sort((a,b)=>b[1].weight-a[1].weight);
  let prHtml='';
  if(!prEntries.length){
    prHtml=`<div class="empty">Aucun record enregistré.<br>Entre tes charges pour les voir ici !</div>`;
  } else {
    prEntries.slice(0,20).forEach(([id,pr])=>{
      const ratio=Math.round(pr.weight/bw*100)/100;
      const oneRM=pr.reps>1?calc1RM(pr.weight,pr.reps):pr.weight;
      prHtml+=`<div class="pr-item">
        <div><div class="pr-item-name">${findExName(id)||id}</div>
        <div class="pr-item-day">${pr.date||'—'}${pr.reps?' · '+pr.reps+' reps':''} · 1RM~${oneRM}kg</div></div>
        <div style="text-align:right">
          <div class="pr-item-w">${pr.weight} kg</div>
          <div style="font-family:var(--fm);font-size:10px;color:var(--blue)">${ratio}× BW</div>
        </div>
      </div>`;
    });
  }
  const allEx=getAllExercises();
  const exOptions=allEx.map(e=>`<option value="${e.id}">${e.name}</option>`).join('');
  document.getElementById('stats-content').innerHTML=`
  <div class="chip">Statistiques</div>
  <div class="stats-grid">
    <div class="stat-card k-yellow"><div class="stat-v">${computeStreak()}</div><div class="stat-l">Jours de streak</div></div>
    <div class="stat-card k-green"><div class="stat-v">${computeReg()}%</div><div class="stat-l">Régularité 7j</div></div>
  </div>
  <button class="hist-open" onclick="openHistory()">
    <div class="hist-open-ic">${ic('clock')}</div>
    <div class="hist-open-tx"><b>Historique des séances</b><span>${getSessionDates().length} séance${getSessionDates().length>1?'s':''} enregistrée${getSessionDates().length>1?'s':''} · relire et dupliquer</span></div>
    ${ic('chev')}
  </button>
  <div class="card" id="goalsCard" style="margin-bottom:12px">${goalsCardHtml()}</div>
  <div class="card" style="margin-bottom:12px">
    <div class="stitle">Calendrier d'activité</div>
    ${renderHeatmap()}
  </div>
  <div class="card" style="margin-bottom:12px">
    <div class="stitle">Évolution des charges</div>
    <div style="display:flex;gap:8px;margin-bottom:14px;align-items:center;flex-wrap:wrap">
      <select id="exSelect" class="si" style="flex:1;text-align:left;font-size:12px;padding:8px" onchange="renderWeightChart()">
        ${exOptions}
      </select>
      <div style="display:flex;gap:5px;flex-wrap:wrap">
        <button id="chartMaxBtn" onclick="setChartMode('max')" class="badge ${_chartMode==='max'?'b-compound':'b-rest'}" style="cursor:pointer;padding:6px 8px;font-size:10px">Max</button>
        <button id="chartAvgBtn" onclick="setChartMode('avg')" class="badge ${_chartMode==='avg'?'b-isolation':'b-rest'}" style="cursor:pointer;padding:6px 8px;font-size:10px">Moy</button>
        <button id="chartTonBtn" onclick="setChartMode('tonnage')" class="badge ${_chartMode==='tonnage'?'b-superset':'b-rest'}" style="cursor:pointer;padding:6px 8px;font-size:10px">Tonnage</button>
      </div>
    </div>
    <div id="weightChartBox"></div>
  </div>
  <div class="radar-wrap">
    <div class="stitle">Repartition Musculaire <span style="font-size:10px;color:var(--dim)">(7 derniers jours)</span></div>
    <div id="radarBox"></div>
  </div>
  <div class="card" id="volumeCard" style="margin-bottom:12px">${volumeCardHtml()}</div>
  <div class="card" id="weightCard" style="margin-bottom:12px">${weightCardHtml()}</div>
  <div class="card" style="margin-bottom:12px">
    <div class="stitle">Records personnels</div>
    <div class="bw-row">
      <div class="bw-lbl">Poids de corps</div>
      <input class="big-inp" type="number" id="bwInp" value="${bw}" min="30" max="200" inputmode="decimal" style="width:75px">
      <span class="bw-lbl">kg</span>
      <button class="btn-calc" onclick="saveBWAndRefresh()" style="padding:8px 12px;font-size:13px">${ic('check')}</button>
    </div>
    ${prHtml}
  </div>`;
  setTimeout(()=>{ drawRadar(); renderWeightChart(); },80);
}

function saveBWAndRefresh(){
  const inp=document.getElementById('bwInp');
  if(inp&&!saveBodyWeight(inp.value))showToast('Poids invalide (20 à 300 kg)');
  renderStats();
}

function setChartMode(mode){
  _chartMode=mode;
  const mb=document.getElementById('chartMaxBtn'), ab=document.getElementById('chartAvgBtn'), tb=document.getElementById('chartTonBtn');
  if(mb)mb.className='badge '+(mode==='max'?'b-compound':'b-rest');
  if(ab)ab.className='badge '+(mode==='avg'?'b-isolation':'b-rest');
  if(tb)tb.className='badge '+(mode==='tonnage'?'b-superset':'b-rest');
  renderWeightChart();
}

const fmtDM=k=>k.slice(8,10)+'/'+k.slice(5,7);
function chartTicks(n){
  if(n<=5)return Array.from({length:n},(_,i)=>i);
  const out=new Set([0,n-1]);[0.25,0.5,0.75].forEach(f=>out.add(Math.round((n-1)*f)));
  return Array.from(out).sort((a,b)=>a-b);
}
function chartRead(i){
  const p=_chartPts[i],el=document.getElementById('chartRead');
  if(p&&el)el.innerHTML=p.t;
}
function chartEmptyHtml(){return `<div class="empty">Aucune donnée pour cet exercice.<br>Lance ta première séance !</div>`;}
/* Courbe : pts = [{k:'AAAA-MM-JJ', v:nombre, t:'texte au toucher'}] */
function lineChartSvg(pts){
  const W=320,H=190,L=42,R=12,T=14,B=26,n=pts.length;
  const vs=pts.map(p=>p.v);
  let lo=Math.min(...vs),hi=Math.max(...vs);
  const pad=Math.max(1,(hi-lo)*0.15);
  lo=Math.max(0,Math.floor((lo-pad)/2.5)*2.5);hi=Math.ceil((hi+pad)/2.5)*2.5;if(hi-lo<2.5)hi=lo+2.5;
  const X=i=>n===1?L+(W-L-R)/2:L+i/(n-1)*(W-L-R),Y=v=>T+(1-(v-lo)/(hi-lo))*(H-T-B);
  const line=pts.map((p,i)=>(i?'L':'M')+X(i).toFixed(1)+' '+Y(p.v).toFixed(1)).join(' ');
  const area=n>1?line+` L${X(n-1).toFixed(1)} ${H-B} L${X(0).toFixed(1)} ${H-B} Z`:'';
  const grid=[lo,(lo+hi)/2,hi].map(g=>`<line class="w-grid" x1="${L}" x2="${W-R}" y1="${Y(g).toFixed(1)}" y2="${Y(g).toFixed(1)}"/><text class="w-lbl" x="${L-6}" y="${(Y(g)+3.5).toFixed(1)}" text-anchor="end">${fmtKg(g)}</text>`).join('');
  const ticks=chartTicks(n).map(i=>`<text class="w-lbl" x="${X(i).toFixed(1)}" y="${H-6}" text-anchor="${i===0&&n>1?'start':(i===n-1&&n>1?'end':'middle')}">${fmtDM(pts[i].k)}</text>`).join('');
  const dots=pts.map((p,i)=>`<circle class="w-dot y" cx="${X(i).toFixed(1)}" cy="${Y(p.v).toFixed(1)}" r="${n>40?2:3.5}"/><circle class="w-hit" cx="${X(i).toFixed(1)}" cy="${Y(p.v).toFixed(1)}" r="14" onclick="chartRead(${i})"/>`).join('');
  return `<svg class="w-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Évolution de la charge">${grid}${n>1?`<path class="w-area y" d="${area}"/><path class="w-line y" d="${line}"/>`:''}${dots}${ticks}</svg>`;
}
/* Barres : tonnage hebdomadaire */
function barChartSvg(pts){
  const W=320,H=190,L=42,R=12,T=14,B=26,n=pts.length;
  const hi=Math.max(...pts.map(p=>p.v),1)*1.1,Y=v=>T+(1-v/hi)*(H-T-B);
  const slot=(W-L-R)/n,bw=Math.max(4,Math.min(28,slot*0.62));
  const cx=i=>L+slot*i+slot/2;
  const fmtT=v=>v>=1000?(Math.round(v/100)/10).toLocaleString('fr-FR')+' t':Math.round(v)+'';
  const grid=[0,hi/2,hi].map(g=>`<line class="w-grid" x1="${L}" x2="${W-R}" y1="${Y(g).toFixed(1)}" y2="${Y(g).toFixed(1)}"/><text class="w-lbl" x="${L-6}" y="${(Y(g)+3.5).toFixed(1)}" text-anchor="end">${fmtT(g)}</text>`).join('');
  const bars=pts.map((p,i)=>`<rect class="w-bar" x="${(cx(i)-bw/2).toFixed(1)}" y="${Y(p.v).toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(1,H-B-Y(p.v)).toFixed(1)}" rx="3"/><rect class="w-hit" x="${(cx(i)-slot/2).toFixed(1)}" y="${T}" width="${slot.toFixed(1)}" height="${H-T-B}" onclick="chartRead(${i})"/>`).join('');
  const ticks=chartTicks(n).map(i=>`<text class="w-lbl" x="${cx(i).toFixed(1)}" y="${H-6}" text-anchor="middle">${fmtDM(pts[i].k)}</text>`).join('');
  return `<svg class="w-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Tonnage hebdomadaire">${grid}${bars}${ticks}</svg>`;
}
function renderWeightChart(){
  const sel=document.getElementById('exSelect'),box=document.getElementById('weightChartBox');
  if(!sel||!box)return;
  const exId=sel.value;
  const read=`<div class="w-read" id="chartRead">Touche un point pour voir la valeur</div>`;
  if(_chartMode==='tonnage'){
    const hist=getWeeklyTonnageHistory(exId);
    if(!hist.length){box.innerHTML=chartEmptyHtml();return;}
    _chartPts=hist.map(h=>({k:h.week,v:h.tonnage,t:`<b>${Math.round(h.tonnage).toLocaleString('fr-FR')} kg·reps</b> · semaine du ${fmtDateShort(h.week)}`}));
    box.innerHTML=barChartSvg(_chartPts)+read;return;
  }
  const hist=getWeightHistory(exId);
  if(!hist.length){box.innerHTML=chartEmptyHtml();return;}
  _chartPts=hist.map(h=>{const v=_chartMode==='max'?h.max:h.avg;return{k:h.date,v,t:`<b>${fmtKg(v)} kg</b> · ${fmtDateShort(h.date)}`};});
  box.innerHTML=lineChartSvg(_chartPts)+read;
}
/* Radar : répartition des 7 derniers jours */
function drawRadar(){
  const box=document.getElementById('radarBox');if(!box)return;
  const vals=getMuscleVolumes(),n=vals.length,max=Math.max(...vals,1);
  const W=320,H=290,cx=160,cy=145,R=92;
  const pt=(i,r)=>{const a=-Math.PI/2+i*2*Math.PI/n;return[cx+r*Math.cos(a),cy+r*Math.sin(a)];};
  const poly=r=>Array.from({length:n},(_,i)=>pt(i,r).map(x=>x.toFixed(1)).join(',')).join(' ');
  const rings=[0.25,0.5,0.75,1].map(f=>`<polygon class="rd-grid" points="${poly(R*f)}"/>`).join('');
  const axes=Array.from({length:n},(_,i)=>{const [x,y]=pt(i,R);return `<line class="rd-grid" x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>`;}).join('');
  const data=vals.map((v,i)=>pt(i,R*v/max));
  const shape=data.map(q=>q.map(x=>x.toFixed(1)).join(',')).join(' ');
  const dots=data.map(q=>`<circle class="rd-dot" cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="4"/>`).join('');
  const labels=MUSCLE_LABELS.map((l,i)=>{const [x,y]=pt(i,R+18);const c=Math.cos(-Math.PI/2+i*2*Math.PI/n);return `<text class="rd-lbl" x="${x.toFixed(1)}" y="${(y+4).toFixed(1)}" text-anchor="${c>0.3?'start':(c<-0.3?'end':'middle')}">${l}</text>`;}).join('');
  const total=vals.reduce((a,b)=>a+b,0);
  box.innerHTML=`<svg class="rd-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Répartition musculaire des 7 derniers jours">${rings}${axes}${total>0?`<polygon class="rd-area" points="${shape}"/>${dots}`:''}${labels}</svg>${total>0?'':'<div class="w-read">Aucune série validée sur les 7 derniers jours</div>'}`;
}

function findExName(id){
  for(const day of Object.values(PROGRAM)){
    const ex=day.exercises.find(e=>e.id===id);
    if(ex)return ex.name;
  }
  return (gs().exNames||{})[id]||id;
}

function renderCardio(){
  const age=getAge(), hrMax=220-age;
  const zoneColors=ZONE_COLORS;
  let zonesHtml='';
  ZONE_DATA.forEach((z,i)=>{
    const lo=Math.round(hrMax*z.pct[0]/100), hi=Math.round(hrMax*z.pct[1]/100);
    zonesHtml+=`<div class="zone-row">
      <div class="zone-dot" style="background:${zoneColors[i]}"></div>
      <div><div class="zone-name" style="color:${zoneColors[i]}">${z.name}</div><div style="font-size:10px;color:var(--muted)">${z.label}</div></div>
      <div class="zone-bpm" style="color:${zoneColors[i]}">${lo}–${hi}</div>
    </div>`;
  });
  let runCardsHtml='';
  const WK=weekDateKeys(),plan=runPlanList();
  plan.forEach(({day,run})=>{
    const dateKey=WK[day],rl=getRunLog(dateKey);
    runCardsHtml+=`<div class="run-card" id="crun-${dateKey}">
      <div class="run-title">${DAY_LABELS[day]} — ${escA(run.name)}<span class="run-date">${fmtDateShort(dateKey)}</span></div>
      ${run.desc?`<div class="run-step" style="margin-bottom:6px">${escA(run.desc)}</div>`:''}
      ${run.detail?`<div class="run-step" style="font-style:italic">${escA(run.detail)}</div>`:''}
      <div class="run-log" style="margin-top:12px">
        <div class="input-col"><span class="set-lbl">DURÉE (min)</span>
          <input class="si" type="number" inputmode="numeric" placeholder="${run.targetDuration||'—'}" value="${rl.duration}"
            onchange="debounce('cr-d-${dateKey}',()=>{saveRunLog('${dateKey}','duration',this.value);},400)"></div>
        <div class="input-col"><span class="set-lbl">DIST (km)</span>
          <input class="si" type="number" inputmode="decimal" placeholder="${run.targetDistance||'—'}" value="${rl.distance}"
            onchange="debounce('cr-s-${dateKey}',()=>{saveRunLog('${dateKey}','distance',this.value);},400)"></div>
        <div class="input-col"><span class="set-lbl">RPE (1-10)</span>
          <input class="si" type="number" inputmode="numeric" placeholder="7" min="1" max="10" value="${rl.rpe}"
            onchange="debounce('cr-r-${dateKey}',()=>{saveRunLog('${dateKey}','rpe',this.value);},400)"></div>
      </div>
      <div class="run-goal" id="rgoal-${dateKey}">${runGoalHtml(run,rl)}</div>
      <div class="run-pace" id="pace-${dateKey}">${paceHtml(rl)}</div>
      <button class="run-done-btn${rl.done?' done':''}" id="crunBtn-${dateKey}"
        onclick="toggleRunDone2('${dateKey}')">
        ${rl.done?'Séance terminée':'Marquer comme faite'}
      </button>
    </div>`;
  });
  if(!plan.length)runCardsHtml=`<div class="empty">Aucune sortie planifiée.<br><button class="prog-switch-btn" style="margin-top:10px" onclick="openProgramEditor()">Planifier mes sorties</button></div>`;
  document.getElementById('cardio-content').innerHTML=`
  <div class="chip">Cardio & running</div>
  <div class="card" style="margin-bottom:12px">
    <div class="stitle">Zones cardio</div>
    <div class="age-row">
      <div>
        <div style="font-size:12px;color:var(--dim);margin-bottom:6px">Ton âge</div>
        <input class="big-inp" type="number" id="ageInp" value="${age}" min="10" max="90" inputmode="numeric">
      </div>
      <button class="btn-calc" onclick="calcZones()">Calculer</button>
      <div style="font-family:var(--fm);font-size:11px;color:var(--dim)">FC max :<br><b style="font-size:18px;color:var(--text)">${hrMax}</b> BPM</div>
    </div>
    <div id="zonesResult">${zonesHtml}</div>
  </div>
  <div class="card" style="margin-bottom:12px">
    <div style="display:flex;align-items:center;justify-content:space-between;cursor:pointer" onclick="toggleRunSection()">
      <div class="stitle" style="margin-bottom:0">Séances running</div>
      <button class="prog-switch-btn ed-open" style="margin-left:auto;margin-right:10px" onclick="event.stopPropagation();openProgramEditor()">${ic('edit')} Modifier</button><span id="runSectionChevron" style="color:var(--dim);font-size:18px;transition:transform .25s">${ic('chev')}</span>
    </div>
    <div id="runSection" style="display:none;margin-top:12px">${runCardsHtml}</div>
  </div>`;
}

function toggleRunSection(){
  const sec=document.getElementById('runSection');
  const chev=document.getElementById('runSectionChevron');
  if(!sec)return;
  const open=sec.style.display==='none';
  sec.style.display=open?'block':'none';
  if(chev)chev.style.transform=open?'rotate(90deg)':'';
}

function toggleRunDone2(dateKey){
  const rl=getRunLog(dateKey);
  const v=!rl.done;
  saveRunLog(dateKey,'done',v);
  const btn=document.getElementById('crunBtn-'+dateKey);
  if(btn){btn.className='run-done-btn'+(v?' done':'');btn.textContent=v?'Séance terminée':'Marquer comme faite';}
  markDayActive(dateKey);
  scheduleReminderSync();
}

function calcZones(){
  const inp=document.getElementById('ageInp');
  const age=parseInt(inp?inp.value:25)||25;
  saveAge(age);
  const hrMax=220-age;
  const zoneColors=ZONE_COLORS;
  let html='';
  ZONE_DATA.forEach((z,i)=>{
    const lo=Math.round(hrMax*z.pct[0]/100), hi=Math.round(hrMax*z.pct[1]/100);
    html+=`<div class="zone-row">
      <div class="zone-dot" style="background:${zoneColors[i]}"></div>
      <div><div class="zone-name" style="color:${zoneColors[i]}">${z.name}</div><div style="font-size:10px;color:var(--muted)">${z.label}</div></div>
      <div class="zone-bpm" style="color:${zoneColors[i]}">${lo}–${hi}</div>
    </div>`;
  });
  const el=document.getElementById('zonesResult');
  if(el)el.innerHTML=html;
}

function openDayDrawer(dayName,dateKey){
  const {key:pKey,prog}=getEffectiveDayProgram(dateKey);
  if(!prog||prog.type==='rest')return;
  _drawerCtx={dayName,dateKey};
  document.getElementById('drawerTitle').textContent=prog.fullName;
  const p=getDayProgress(dateKey,dayName);
  let html=`
  <div class="card hero" style="margin-bottom:12px;--c:${progColor(pKey)}">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
      <span style="font-size:12px;color:var(--dim)">${new Date(dateKey+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})}</span>
      <span style="font-family:var(--fm);font-size:13px;color:var(--green);font-weight:700">${p.pct}%</span>
    </div>
    <div class="prog-wrap"><div class="prog-fill" id="prog-${dateKey}" style="width:${p.pct}%"></div></div>
    <div class="prog-txt" id="progtxt-${dateKey}">${p.done}/${p.total} séries</div>
  </div>`;
  if(prog.exercises.length>0){
    html+=`<div class="stitle">Exercices</div><div class="card">`;
    orderedExercises(dateKey,prog).forEach(ex=>{html+=renderExBlock(ex,dateKey);});
    html+=`</div>`;
  }

  html+=sessionNoteCardHtml(dateKey);
  html+=`<div style="text-align:center;padding:8px 0 4px">
    <button class="prog-switch-btn" style="font-size:12px" onclick="closeDrawer();showProgramPicker('${dateKey}')">Changer ce programme</button>
  </div>`;
  document.getElementById('drawerBody').innerHTML=html;
  document.getElementById('drawerOverlay').classList.add('open');
  document.getElementById('dayDrawer').classList.add('open');
  document.body.style.overflow='hidden';
}

function closeDrawer(){
  document.getElementById('drawerOverlay').classList.remove('open');
  document.getElementById('dayDrawer').classList.remove('open');
  document.body.style.overflow='';
  renderWeek();
}

const AVATARS=['red','blue','yellow','green','grey','white'];
const avatarKey=a=>AVATARS.includes(a)?a:'red';
function avatarHtml(a,pseudo){const ch=(pseudo||'').trim().charAt(0).toUpperCase();return `<span class="av av-${avatarKey(a)}">${ch||ic('dumbbell')}</span>`;}
function refreshAvatar(){const d=document.getElementById('avatarDisplay');if(d){const p=getProfile();d.innerHTML=avatarHtml(p.avatar,p.pseudo);}}

function getProfile(){const d=gs();return d.profile||{pseudo:'',avatar:'red',since:todayKey()};}
function saveProfile(p){const d=gs();d.profile={...getProfile(),...p};ss(d);triggerSave();}

function getTotalSessions(){return getActiveDays().length;}
function getTotalTonnageAllTime(){
  const d=gs();if(!d.workouts)return 0;
  let total=0;
  Object.values(d.workouts).forEach(day=>{
    Object.values(day).forEach(sets=>{
      (sets||[]).forEach(s=>{if(s&&s.done&&!isNaN(parseFloat(s.weight)))total+=(parseFloat(s.weight)||0)*(parseFloat(s.reps)||10);});
    });
  });
  return Math.round(total);
}

function renderProfile(){
  const prof=getProfile();
  const pseudo=prof.pseudo||'';
  const avatar=avatarKey(prof.avatar);
  const since=prof.since||todayKey();
  const streak=computeStreak();
  const reg=computeReg();
  const sessions=getTotalSessions();
  const tonnage=getTotalTonnageAllTime();
  const eq=getFunEquivalent(tonnage);
  const bw=getBodyWeight();
  const age=getAge();
  const prefs=getPrefs();

  const sinceDate=new Date(since+'T12:00:00');
  const daysSince=Math.round((new Date()-sinceDate)/(1000*60*60*24));

  const avatarGrid=AVATARS.map(a=>`<button class="avatar-opt${a===avatar?' selected':''}" data-a="${a}" aria-label="Avatar ${a}" onclick="selectAvatar('${a}')">${avatarHtml(a,pseudo)}</button>`).join('');

  document.getElementById('profile-content').innerHTML=`
  <div class="chip">Profil</div>
  <div class="card profile-card green-glow">
    <div class="profile-top">
      <div class="avatar-display" id="avatarDisplay" onclick="toggleAvatarPicker()">${avatarHtml(avatar,pseudo)}</div>
      <div class="profile-info">
        <input class="profile-pseudo-inp" id="pseudoInp" type="text" placeholder="Ton pseudonyme…"
          value="${pseudo}" maxlength="24" autocomplete="off" spellcheck="false"
          oninput="debounce('pseudo',()=>{saveProfile({pseudo:document.getElementById('pseudoInp').value.trim()});refreshAvatar();},600)">
        <div class="profile-since">Membre depuis ${sinceDate.toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})} · <b style="color:var(--green)">${daysSince}j</b></div>
      </div>
    </div>
    <div class="avatar-picker" id="avatarPicker" style="display:none">
      <div style="font-size:10px;color:var(--muted);margin-bottom:8px;font-family:var(--fm);letter-spacing:1px">CHOISIS TON AVATAR</div>
      <div class="avatar-grid">${avatarGrid}</div>
    </div>
  </div>

  <div class="stitle">Mes statistiques</div>
  <div class="stats-grid">
    <div class="stat-card k-red"><div class="stat-v">${streak}</div><div class="stat-l">Streak</div></div>
    <div class="stat-card k-blue"><div class="stat-v">${sessions}</div><div class="stat-l">Séances totales</div></div>
    <div class="stat-card k-yellow"><div class="stat-v">${reg}%</div><div class="stat-l">Régularité 7j</div></div>
    <div class="stat-card k-green"><div class="stat-v">${tonnage>0?(tonnage/1000).toFixed(1)+'t':'—'}</div><div class="stat-l">Tonnage total</div></div>
  </div>
  ${tonnage>0&&eq?`<div class="card" style="text-align:center;padding:14px;margin-bottom:12px">
    <div class="eq-ic" style="margin:0 auto 8px">${ic('dumbbell')}</div>
    <div style="font-family:var(--fm);font-size:12px;color:var(--dim)">Tu as soulevé l'équivalent de</div>
    <div style="font-family:var(--fh);font-size:20px;font-weight:700;color:var(--text)">${eq.count} ${eq.name}</div>
    <div style="font-size:10px;color:var(--muted);margin-top:2px">au total sur tous tes entraînements</div>
  </div>`:''}

  <div class="stitle">Mes données</div>
  <div class="card" style="margin-bottom:12px">
    <div class="bw-row" style="margin-bottom:14px">
      <div class="bw-lbl">Poids de corps</div>
      <input class="big-inp" type="number" id="profBwInp" value="${bw}" min="30" max="200" inputmode="decimal" style="width:75px">
      <span class="bw-lbl">kg</span>
      <button class="btn-calc" onclick="saveProfBW()" style="padding:8px 12px;font-size:13px">${ic('check')}</button>
    </div>
    <div class="bw-row">
      <div class="bw-lbl">Âge</div>
      <input class="big-inp" type="number" id="profAgeInp" value="${age}" min="10" max="99" inputmode="numeric" style="width:75px">
      <span class="bw-lbl">ans</span>
      <button class="btn-calc" onclick="saveProfAge()" style="padding:8px 12px;font-size:13px">${ic('check')}</button>
    </div>
  </div>

  <div class="stitle">Minuteur de repos</div>
  <div class="card" style="margin-bottom:12px">
    <div class="pref-row">
      <div><div class="pref-name">Son de fin de repos</div><div class="pref-sub">Bips sur les 3 dernières secondes, puis sonnerie</div></div>
      <button class="sw${prefs.sound?' on':''}" role="switch" aria-checked="${prefs.sound}" aria-label="Son de fin de repos" onclick="togglePref('sound',this)"><i></i></button>
    </div>
    <div class="pref-row">
      <div><div class="pref-name">Vibration</div><div class="pref-sub">${('vibrate' in navigator)?'Vibre à la fin du repos':'Non prise en charge sur cet appareil (ex. Safari iPhone)'}</div></div>
      <button class="sw${prefs.vibrate?' on':''}" role="switch" aria-checked="${prefs.vibrate}" aria-label="Vibration" onclick="togglePref('vibrate',this)"><i></i></button>
    </div>
    <button class="warmup-btn pref-test" onclick="testTimerAlert()">Tester l'alerte</button>
  </div>

  ${reminderCardHtml()}
  <div class="stitle">Sauvegarde des données</div>
  <div class="card" style="margin-bottom:12px">
    <div class="pref-sub" style="margin:0 0 14px;font-size:13px;line-height:1.5">Tes données sont stockées uniquement sur cet appareil. Exporte-les pour changer de téléphone ou te protéger d'un nettoyage du navigateur.</div>
    <div class="bk-btns">
      <button class="btn-calc bk-save" onclick="exportData()">${ic('down')} Sauvegarder</button>
      <button class="btn-calc bk-restore" onclick="document.getElementById('importFile').click()">${ic('up')} Restaurer</button>
    </div>
    <input type="file" id="importFile" accept=".json,application/json" style="display:none" onchange="importFileChosen(this)">
    <div class="pref-sub bk-last" id="backupLast">${backupLabel()}</div>
  </div>

  <div class="stitle">Diagnostic</div>
  <div class="card" style="margin-bottom:12px">
    <div class="pref-sub" style="margin:0 0 14px;font-size:13px;line-height:1.5">Vérifie sur ton téléphone que l'installation, le mode hors ligne, les notifications, le son, la vibration et l'écran allumé fonctionnent.</div>
    <button class="btn-calc" style="width:100%;min-height:48px" onclick="openDiagnostic()">Vérifier mon appareil</button>
  </div>

  <div class="stitle">Zone danger</div>
  <div class="card danger-card">
    <div style="font-size:13px;color:var(--dim);margin-bottom:14px;line-height:1.5">
      Réinitialise <b>TOUTES</b> tes données : séances, records, tonnage, streak, check-ins.<br>
      <span style="color:var(--red);font-size:11px">Cette action est irréversible.</span>
    </div>
    <button class="btn-danger" onclick="confirmReset()">Réinitialiser toutes les données</button>
  </div>`;
}

function updateHeaderGreeting(){}

function toggleAvatarPicker(){
  const el=document.getElementById('avatarPicker');
  if(el)el.style.display=el.style.display==='none'?'block':'none';
}

function selectAvatar(a){
  saveProfile({avatar:a});
  refreshAvatar();
  document.querySelectorAll('.avatar-opt').forEach(btn=>{
    btn.classList.toggle('selected',btn.dataset.a===a);
  });
  const picker=document.getElementById('avatarPicker');
  if(picker)picker.style.display='none';
}

function saveProfBW(){
  const inp=document.getElementById('profBwInp');
  if(inp){if(saveBodyWeight(inp.value))showToast('Poids de corps sauvegardé');else showToast('Poids invalide (20 à 300 kg)');}
}

function saveProfAge(){
  const inp=document.getElementById('profAgeInp');
  if(inp){saveAge(parseInt(inp.value)||25);showToast('Âge sauvegardé');}
}

function confirmReset(){
  const html=`<div class="modal-overlay" id="resetModal" onclick="if(event.target.id==='resetModal')closeModal()">
    <div class="modal-box" style="max-width:360px">
      <div class="modal-hdr"><div class="modal-title" style="color:var(--red)">Tout effacer ?</div></div>
      <div style="font-size:13px;color:var(--dim);margin:12px 0 20px;line-height:1.6">
        Tu es sur le point de supprimer <b style="color:var(--text)">toutes tes données</b> définitivement.<br><br>
        Séances · Records · Tonnage · Streak · Check-ins.<br>Ton programme personnalisé et tes préférences sont conservés.
      </div>
      <div style="display:flex;gap:10px">
        <button class="run-done-btn" style="flex:1;background:none;border-color:var(--border);color:var(--muted)" onclick="closeModal()">Annuler</button>
        <button class="btn-danger" style="flex:1" onclick="executeReset()">Oui, tout effacer</button>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend',html);
}

function executeReset(){
  const prof=getProfile();
  const old=gs();
  localStorage.removeItem('fitcore');
  localStorage.removeItem(TIMER_KEY);
  const keep=gs();
  if(old.program)keep.program=old.program;
  if(old.exNames)keep.exNames=old.exNames;
  if(old.prefs)keep.prefs=old.prefs;
  ss(keep);
  saveProfile({...prof,since:todayKey()});
  closeModal();
  showToast('Données réinitialisées');
  updateStreak();updateReg();
  renderProfile();
}

function closeModal(){
  ['warmupModal','readinessModal','resetModal','edConfirmModal','summaryModal','swapModal','goalModal','volModal','importModal','diagModal'].forEach(id=>{
    const m=document.getElementById(id);if(m)m.remove();
  });
}

/* ============================================================
   ÉDITEUR DE PROGRAMME
   Semaine type · création / suppression de séances · exercices (ajout, ordre, séries, reps, repos, muscles…)
   Chaque modification est enregistrée immédiatement (saveProgramConfig).
   ============================================================ */
const ED_MUSCLES=[['pecs','Pecs'],['dos','Dos'],['epaules','Épaules'],['biceps','Biceps'],['triceps','Triceps'],['abdos','Abdos'],['jambes','Jambes']];
const ED_COLORS=['red','blue','yellow','green'];
const ED_COLOR_NAMES={red:'Rouge',blue:'Bleu',yellow:'Jaune',green:'Vert'};
const ED_REST_OPTS=[30,45,60,75,90,120,150,180,240,300];
const ED_TYPES=[['compound','Compound'],['isolation','Isolation'],['echauffement','Échauffement']];
let _ed={view:'home',key:null,open:null,pendingDel:null};

const escA=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const cleanName=s=>String(s||'').replace(/[<>"\\`]/g,'').replace(/\s+/g,' ').trim().slice(0,60);
const normName=s=>cleanName(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');

function knownExercises(){
  const map={};
  const names=gs().exNames||{};
  Object.keys(names).forEach(id=>{map[id]=names[id];});
  Object.values(PROGRAM).forEach(p=>p.exercises.forEach(e=>{map[e.id]=e.name;}));
  return Object.keys(map).map(id=>({id,name:map[id]})).sort((a,b)=>a.name.localeCompare(b.name));
}
function exSummary(ex){return `${ex.sets} × ${escA(ex.repsLabel)} · repos ${fmtRest(ex.restSec)}${ex.superset?' · Superset '+ex.superset:''}`;}
const edProg=()=>_progCfg.programs[_ed.key];
const edSave=()=>saveProgramConfig();

function openProgramEditor(){
  closeProgramEditor(true);
  _ed={view:'home',key:null,open:null,pendingDel:null};
  const el=document.createElement('div');
  el.className='ed-sheet';el.id='edSheet';
  el.setAttribute('role','dialog');el.setAttribute('aria-label','Éditeur de programme');
  el.innerHTML=`<div class="ed-hdr"><button class="drawer-close" id="edBack" onclick="edBack()" aria-label="Retour"></button><div class="drawer-title" id="edTitle"></div></div><div class="ed-body" id="edBody"></div>`;
  document.body.appendChild(el);
  document.body.style.overflow='hidden';
  edRender();
  requestAnimationFrame(()=>el.classList.add('open'));
}
function closeProgramEditor(silent){
  const el=document.getElementById('edSheet');
  if(!el)return;
  el.remove();
  document.body.style.overflow='';
  if(!silent){renderWeek();renderToday();renderCardio();}
}
function edBack(){
  if(_ed.view==='run'){_ed.view='home';_ed.runKey=null;edRender();return;}
  if(_ed.view==='prog'){_ed.view='home';_ed.key=null;_ed.open=null;_ed.pendingDel=null;edRender();}
  else closeProgramEditor();
}
function edRender(){
  const body=document.getElementById('edBody');if(!body)return;
  const title=document.getElementById('edTitle'),back=document.getElementById('edBack');
  if(_ed.view==='prog'&&!edProg())_ed.view='home';
  if(_ed.view==='run'){
    const r=_progCfg.runs[_ed.runKey];
    if(r){title.textContent=r.name;back.innerHTML=ic('back');body.innerHTML=edRunHtml();return;}
    _ed.view='home';
  }
  if(_ed.view==='prog'){
    title.textContent=edProg().fullName;
    back.innerHTML=ic('back');
    body.innerHTML=edProgHtml();
  }else{
    title.textContent='Mes séances';
    back.innerHTML=ic('close');
    body.innerHTML=edHomeHtml();
  }
}

/* ---------- Vue d'accueil : semaine type + liste des séances ---------- */
function edHomeHtml(){
  const cfg=_progCfg;
  const opts=sel=>cfg.order.map(o=>`<option value="${o}"${o===sel?' selected':''}>${escA(cfg.programs[o].fullName)}</option>`).join('');
  const days=DAYS_ORDER.map(d=>`<div class="ed-day"><span class="ed-day-n">${DAY_LABELS[d]}</span><select class="si ed-sel" aria-label="Séance du ${DAY_LABELS[d]}" onchange="edSetDay('${d}',this.value)">${opts(cfg.weekly[d])}</select></div>`).join('');
  const list=cfg.order.map(k=>{
    const p=cfg.programs[k],rest=p.type==='rest',n=p.exercises.length;
    return `<div class="prog-pick-item ed-prog${rest?' ed-fixed':''}"${rest?'':` onclick="edOpenProg('${k}')"`}>
      <span class="prog-pick-icon" style="--c:${progColor(k)}"></span>
      <div class="prog-pick-info"><div class="prog-pick-name">${escA(p.fullName)}</div><div class="prog-pick-meta">${rest?'Jour de repos (fixe)':n+' exercice'+(n>1?'s':'')}</div></div>
      ${rest?'':ic('chev')}</div>`;
  }).join('');
  return `<div class="ed-hint">Choisis la séance suggérée pour chaque jour. Tu pourras toujours en changer au quotidien depuis l'écran Séance.</div>
    <div class="stitle">Semaine type</div>
    <div class="card ed-days">${days}</div>
    <div class="stitle">Séances</div>
    <div class="ed-list">${list}</div>
    <button class="btn-calc ed-add" onclick="edNewProg()">${ic('plus')} Nouvelle séance</button>
    ${edRunSectionHtml()}
    <button class="ed-reset" onclick="edConfirmReset()">${ic('undo')} Rétablir le programme d'origine</button>`;
}
function edSetDay(d,k){
  if(!_progCfg.programs[k])return;
  _progCfg.weekly[d]=k;edSave();
}
function edOpenProg(k){
  if(!_progCfg.programs[k]||_progCfg.programs[k].type==='rest')return;
  _ed.view='prog';_ed.key=k;_ed.open=null;_ed.pendingDel=null;
  edRender();
  const body=document.getElementById('edBody');if(body)body.scrollTop=0;
}
function edNewProg(){
  const key='p_'+Date.now().toString(36);
  _progCfg.programs[key]={label:'Nouvelle séance',fullName:'Nouvelle séance',type:'gym',color:'green',exercises:[]};
  _progCfg.order.push(key);
  edSave();
  edOpenProg(key);
  const inp=document.getElementById('edProgName');if(inp){inp.focus();inp.select();}
}

/* ---------- Vue séance : nom, couleur, exercices ---------- */
function edProgHtml(){
  const p=edProg();
  const sw=ED_COLORS.map(c=>`<button class="ed-sw${p.color===c?' on':''}" style="--c:${COLOR_MAP[c]}" onclick="edSetColor('${c}')" aria-label="${ED_COLOR_NAMES[c]}" aria-pressed="${p.color===c}"></button>`).join('');
  const n=p.exercises.length;
  const exs=n?p.exercises.map((ex,i)=>edExHtml(ex,i,n)).join(''):`<div class="empty">Aucun exercice pour l'instant.<br>Ajoute le premier ci-dessous.</div>`;
  const dl=knownExercises().map(e=>`<option value="${escA(e.name)}"></option>`).join('');
  return `<div class="card ed-card">
      <span class="set-lbl ed-lbl">NOM DE LA SÉANCE</span>
      <input class="ex-note-inp" id="edProgName" type="text" maxlength="40" value="${escA(p.fullName)}" onchange="edRenameProg(this.value)" autocomplete="off">
      <span class="set-lbl ed-lbl">COULEUR</span>
      <div class="ed-sws">${sw}</div>
    </div>
    <div class="stitle">Exercices <span>${n}</span></div>
    ${exs}
    <button class="btn-calc ed-add" onclick="edAddEx()">${ic('plus')} Ajouter un exercice</button>
    <button class="btn-danger ed-delprog" onclick="edConfirmDelProg()">Supprimer cette séance</button>
    <datalist id="edExNames">${dl}</datalist>`;
}
function edRenameProg(v){
  const p=edProg();const name=cleanName(v);
  if(!name){const i=document.getElementById('edProgName');if(i)i.value=p.fullName;showToast('Le nom ne peut pas être vide');return;}
  p.fullName=name;p.label=name;edSave();
  const t=document.getElementById('edTitle');if(t)t.textContent=name;
}
function edSetColor(c){
  edProg().color=c;edSave();
  document.querySelectorAll('.ed-sw').forEach(b=>{const on=b.getAttribute('aria-label')===ED_COLOR_NAMES[c];b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);});
}

function edExHtml(ex,i,n){
  const open=_ed.open===i,pd=_ed.pendingDel===i;
  return `<div class="card ed-ex${open?' open':''}">
    <div class="ed-ex-row">
      <div class="ed-ex-info" onclick="edToggleEx(${i})" role="button" tabindex="0" aria-expanded="${open}">
        <div class="ed-ex-name" id="ednm-${i}">${escA(ex.name)}</div>
        <div class="ed-ex-sum" id="edsum-${i}">${exSummary(ex)}</div>
      </div>
      <div class="ed-ex-btns">
        <button class="ed-ib" ${i===0?'disabled':''} onclick="edMoveEx(${i},-1)" aria-label="Monter">${ic('up')}</button>
        <button class="ed-ib" ${i===n-1?'disabled':''} onclick="edMoveEx(${i},1)" aria-label="Descendre">${ic('down')}</button>
        <button class="ed-ib${pd?' warn':''}" onclick="edDelEx(${i})" aria-label="Supprimer l'exercice">${pd?'Sûr ?':ic('trash')}</button>
      </div>
    </div>
    ${open?edExForm(ex,i):''}
  </div>`;
}
function edExForm(ex,i){
  const f=exRepFields(ex);
  const restOpts=(ED_REST_OPTS.includes(ex.restSec)?ED_REST_OPTS:ED_REST_OPTS.concat(ex.restSec).sort((a,b)=>a-b)).map(r=>`<option value="${r}"${r===ex.restSec?' selected':''}>${fmtRest(r)}</option>`).join('');
  const types=ED_TYPES.map(([t,l])=>`<button class="ed-chip${ex.type===t?' on':''}" onclick="edType(${i},'${t}')">${l}</button>`).join('');
  const muscles=ED_MUSCLES.map(([m,l])=>`<button class="ed-chip${ex.muscles.includes(m)?' on':''}" onclick="edMuscle(${i},'${m}')">${l}</button>`).join('');
  return `<div class="ed-form">
    <span class="set-lbl ed-lbl">NOM</span>
    <input class="ex-note-inp" id="edname-${i}" list="edExNames" type="text" maxlength="60" value="${escA(ex.name)}" onchange="edName(${i},this.value)" autocomplete="off">
    <div class="ed-grid">
      <div class="input-col"><span class="set-lbl">SÉRIES</span><input class="si" type="number" inputmode="numeric" min="1" max="12" value="${ex.sets}" onchange="edNum(${i},this)"></div>
      <div class="input-col"><span class="set-lbl">${ex.isTime?'SEC MIN':'REPS MIN'}</span><input class="si" id="edmin-${i}" type="number" inputmode="numeric" min="1" value="${f.min}" ${f.failure?'disabled':''} onchange="edReps(${i})"></div>
      <div class="input-col"><span class="set-lbl">${ex.isTime?'SEC MAX':'REPS MAX'}</span><input class="si" id="edmax-${i}" type="number" inputmode="numeric" min="1" value="${f.max}" ${f.failure?'disabled':''} onchange="edReps(${i})"></div>
    </div>
    <div class="ed-chips">
      <button class="ed-chip${f.failure?' on':''}" onclick="edToggle(${i},'failure')">À l'échec</button>
      <button class="ed-chip${ex.isTime?' on':''}" onclick="edToggle(${i},'isTime')">Au temps (sec)</button>
    </div>
    <span class="set-lbl ed-lbl">TYPE</span>
    <div class="ed-chips">${types}</div>
    <span class="set-lbl ed-lbl">SUPERSET <span style="text-transform:none;letter-spacing:0">(même lettre = enchaînés, un seul repos)</span></span>
    <div class="ed-chips">${['','A','B','C','D'].map(l=>`<button class="ed-chip${(ex.superset||'')===l?' on':''}" onclick="edSuperset(${i},'${l}')">${l||'Aucun'}</button>`).join('')}</div>
    <div class="ed-grid2">
      <div class="input-col"><span class="set-lbl">REPOS</span><select class="si" onchange="edRest(${i},this.value)">${restOpts}</select></div>
      <div class="input-col"><span class="set-lbl">PROGRESSION (+KG)</span><input class="si" type="number" inputmode="decimal" step="0.25" min="0.25" placeholder="2,5" value="${ex.step>0?ex.step:''}" onchange="edStep(${i},this.value)"></div>
    </div>
    <span class="set-lbl ed-lbl">MUSCLES TRAVAILLÉS (RADAR)</span>
    <div class="ed-chips">${muscles}</div>
  </div>`;
}
function edToggleEx(i){_ed.open=_ed.open===i?null:i;_ed.pendingDel=null;edRender();}
function edRefreshSum(i){
  const ex=edProg().exercises[i];
  const el=document.getElementById('edsum-'+i);if(el)el.innerHTML=exSummary(ex);
}
function edMoveEx(i,dir){
  const arr=edProg().exercises,j=i+dir;
  if(j<0||j>=arr.length)return;
  [arr[i],arr[j]]=[arr[j],arr[i]];
  if(_ed.open===i)_ed.open=j;else if(_ed.open===j)_ed.open=i;
  _ed.pendingDel=null;
  edSave();edRender();
}
function edDelEx(i){
  if(_ed.pendingDel===i){
    edProg().exercises.splice(i,1);
    if(_ed.open===i)_ed.open=null;else if(_ed.open>i)_ed.open--;
    _ed.pendingDel=null;
    edSave();edRender();
    showToast('Exercice retiré (historique conservé)');
    return;
  }
  _ed.pendingDel=i;edRender();
  setTimeout(()=>{if(_ed.pendingDel===i){_ed.pendingDel=null;edRender();}},3000);
}
function edAddEx(){
  const p=edProg();
  if(p.exercises.length>=30){showToast('30 exercices maximum par séance');return;}
  p.exercises.push({id:'x_'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),name:'Nouvel exercice',sets:3,repsLabel:'8-12 reps',defaultReps:10,type:'compound',muscles:[],restSec:90});
  _ed.open=p.exercises.length-1;_ed.pendingDel=null;
  edSave();edRender();
  const inp=document.getElementById('edname-'+_ed.open);
  if(inp){inp.scrollIntoView({block:'center'});inp.focus();inp.select();}
}
function edName(i,v){
  const ex=edProg().exercises[i];const name=cleanName(v);
  const inp=document.getElementById('edname-'+i);
  if(!name){if(inp)inp.value=ex.name;showToast('Le nom ne peut pas être vide');return;}
  ex.name=name;
  /* Nom déjà connu (autre séance ou historique) : on reprend son identifiant pour garder records et historique */
  if(/^x_/.test(ex.id)){
    const match=knownExercises().find(k=>k.id!==ex.id&&normName(k.name)===normName(name));
    if(match&&!edProg().exercises.some((e,j)=>j!==i&&e.id===match.id)){ex.id=match.id;ex.name=match.name;}
  }
  if(inp)inp.value=ex.name;
  const nm=document.getElementById('ednm-'+i);if(nm)nm.textContent=ex.name;
  edSave();
}
function edNum(i,input){
  const ex=edProg().exercises[i];
  ex.sets=Math.min(12,Math.max(1,parseInt(input.value)||ex.sets));
  input.value=ex.sets;
  edSave();edRefreshSum(i);
}
function edReps(i){
  const ex=edProg().exercises[i];
  const a=document.getElementById('edmin-'+i),b=document.getElementById('edmax-'+i);
  const min=Math.max(1,parseInt(a.value)||1);
  const max=Math.max(min,parseInt(b.value)||min);
  a.value=min;b.value=max;
  ex.repsLabel=buildRepsLabel(ex,min,max);
  ex.defaultReps=Math.round((min+max)/2);
  edSave();edRefreshSum(i);
}
function edToggle(i,what){
  const ex=edProg().exercises[i];
  if(what==='failure'){
    if(exRepFields(ex).failure)ex.repsLabel=buildRepsLabel(ex,ex.defaultReps,ex.defaultReps);
    else ex.repsLabel='Échec';
  }else if(what==='isTime'){
    const f=exRepFields(ex);
    if(ex.isTime)delete ex.isTime;else ex.isTime=true;
    if(!f.failure)ex.repsLabel=buildRepsLabel(ex,f.min,f.max);
  }
  edSave();edRender();
}
function edSuperset(i,l){const ex=edProg().exercises[i];if(l)ex.superset=l;else delete ex.superset;edSave();edRender();}
function edType(i,t){edProg().exercises[i].type=t;edSave();edRender();}
function edRest(i,v){edProg().exercises[i].restSec=parseInt(v)||90;edSave();edRefreshSum(i);}
function edStep(i,v){
  const ex=edProg().exercises[i],n=parseFloat(String(v).replace(',','.'));
  if(n>0)ex.step=Math.min(50,n);else delete ex.step;
  edSave();
}
function edMuscle(i,m){
  const ex=edProg().exercises[i];
  ex.muscles=ex.muscles.includes(m)?ex.muscles.filter(x=>x!==m):ex.muscles.concat(m);
  edSave();edRender();
}

/* ---------- Confirmations ---------- */
function edConfirm(title,msg,okLabel,fn){
  document.body.insertAdjacentHTML('beforeend',`<div class="modal-overlay" id="edConfirmModal" onclick="if(event.target.id==='edConfirmModal')closeModal()">
    <div class="modal-box" style="max-width:360px">
      <div class="modal-hdr"><div class="modal-title" style="color:var(--red)">${title}</div></div>
      <div style="font-size:13px;color:var(--dim);margin:12px 0 20px;line-height:1.6">${msg}</div>
      <div style="display:flex;gap:10px">
        <button class="run-done-btn" style="flex:1;margin-top:0;background:none;border:1.5px solid var(--border);color:var(--muted)" onclick="closeModal()">Annuler</button>
        <button class="btn-danger" style="flex:1" onclick="${fn}()">${okLabel}</button>
      </div>
    </div></div>`);
}
function edConfirmDelProg(){
  edConfirm('Supprimer la séance ?',`« ${escA(edProg().fullName)} » sera retirée de ton programme. Ton historique est conservé.`,'Supprimer','edDoDelProg');
}
function edDoDelProg(){
  const k=_ed.key;
  delete _progCfg.programs[k];
  _progCfg.order=_progCfg.order.filter(x=>x!==k);
  DAYS_ORDER.forEach(d=>{if(_progCfg.weekly[d]===k)_progCfg.weekly[d]='repos';});
  const d=gs();
  if(d.dayProgram){Object.keys(d.dayProgram).forEach(dk=>{if(d.dayProgram[dk]===k)delete d.dayProgram[dk];});ss(d);}
  edSave();closeModal();
  _ed.view='home';_ed.key=null;_ed.open=null;
  edRender();showToast('Séance supprimée');
}
function edConfirmReset(){
  edConfirm('Rétablir le programme ?','Tes séances et ta semaine type reviennent au programme d\'origine. Ton historique (charges, records, stats) n\'est pas touché.','Rétablir','edDoReset');
}
function edDoReset(){
  _progCfg=defaultProgramConfig();
  edSave();closeModal();
  _ed.view='home';_ed.key=null;_ed.open=null;
  edRender();showToast('Programme d\'origine rétabli');
}

/* ============================================================
   SESSIONS : méta (durée, séance, records), stats, historique, résumé, duplication
   ============================================================ */
const SESSION_GAP=45*60*1000;
const fmtTonnage=kg=>kg>=1000?(Math.round(kg/100)/10).toLocaleString('fr-FR')+' t':Math.round(kg).toLocaleString('fr-FR')+' kg';

function getSessionMeta(k){const d=gs();return (d.sessionMeta&&d.sessionMeta[k])||{};}
function updateSessionMeta(k,fn){
  const d=gs();if(!d.sessionMeta)d.sessionMeta={};
  const m=d.sessionMeta[k]||{};fn(m);d.sessionMeta[k]=m;ss(d);
}
/* Appelé à chaque série validée : la durée cumule les écarts entre séries (pauses > 45 min ignorées) */
function touchSession(k){
  const now=Date.now();
  updateSessionMeta(k,m=>{
    if(!m.start){m.start=now;m.ms=0;}
    else if(m.last&&now-m.last<=SESSION_GAP)m.ms=(m.ms||0)+(now-m.last);
    m.last=now;
    scheduleReminderSync();
    if(!m.prog){
      const e=getEffectiveDayProgram(k);
      if(e.prog&&e.prog.type!=='rest')m.prog={key:e.key,name:e.prog.fullName};
    }
  });
}
function recordSessionPR(k,id,name,w,r){
  updateSessionMeta(k,m=>{m.prs=(m.prs||[]).filter(x=>x.id!==id);m.prs.push({id,name,w,r});});
}
function findExDef(id){
  for(const p of Object.values(PROGRAM)){const e=p.exercises.find(x=>x.id===id);if(e)return e;}
  return (gs().exDefs||{})[id]||null;
}
/* Séance d'un jour : celle enregistrée à l'époque, sinon celle qui recoupe le mieux les exercices faits */
function inferProgram(k,ids){
  const meta=getSessionMeta(k);
  if(meta.prog)return{key:PROGRAM[meta.prog.key]?meta.prog.key:null,name:meta.prog.name||'Séance'};
  const eff=getEffectiveDayProgram(k).key;
  let best=null,bestN=0;
  Object.keys(PROGRAM).forEach(key=>{
    const p=PROGRAM[key];if(p.type==='rest')return;
    const n=p.exercises.filter(e=>ids.includes(e.id)).length;
    if(n>bestN||(n===bestN&&n>0&&key===eff)){best=key;bestN=n;}
  });
  return best?{key:best,name:PROGRAM[best].fullName}:null;
}
function sessionStats(k){
  const d=gs(),day=(d.workouts&&d.workouts[k])||{},notes=(d.exNotes&&d.exNotes[k])||{},meta=(d.sessionMeta&&d.sessionMeta[k])||{};
  const exs=[],rpes=[];let tonnage=0,sets=0;
  Object.keys(day).forEach(id=>{
    const done=(day[id]||[]).filter(x=>x&&x.done);
    if(!done.length)return;
    const def=findExDef(id),n=notes[id]||{};
    sets+=done.length;
    if(!(def&&def.isTime))done.forEach(x=>{tonnage+=(parseFloat(x.weight)||0)*(parseFloat(x.reps)||10);});
    const r=parseFloat(n.rpe);if(r>0)rpes.push(r);
    exs.push({id,name:findExName(id),def,sets:done,note:n.settings||'',rpe:n.rpe||''});
  });
  const prog=exs.length?inferProgram(k,exs.map(e=>e.id)):null;
  if(prog&&prog.key){
    const order=PROGRAM[prog.key].exercises.map(e=>e.id);
    exs.sort((a,b)=>{const ia=order.indexOf(a.id),ib=order.indexOf(b.id);return (ia<0?99:ia)-(ib<0?99:ib);});
  }
  const rl=d.runLogs&&d.runLogs[k]&&d.runLogs[k].done?d.runLogs[k]:null;
  return{date:k,exs,prog,run:rl,sets,tonnage:Math.round(tonnage),
    rpe:rpes.length?Math.round(rpes.reduce((a,b)=>a+b,0)/rpes.length*10)/10:null,
    minutes:meta.ms>0?Math.max(1,Math.round(meta.ms/60000)):null,start:meta.start||null,prs:meta.prs||[],
    note:meta.note||'',skipped:((d.skipped&&d.skipped[k])||[]).filter(id=>!exs.some(e=>e.id===id)).map(id=>findExName(id))};
}
function getSessionDates(){
  const d=gs(),set=new Set();
  Object.keys(d.workouts||{}).forEach(k=>{if(Object.values(d.workouts[k]||{}).some(a=>(a||[]).some(x=>x&&x.done)))set.add(k);});
  Object.keys(d.runLogs||{}).forEach(k=>{if(d.runLogs[k]&&d.runLogs[k].done)set.add(k);});
  return Array.from(set).sort().reverse();
}
const stColor=st=>st.prog&&st.prog.key?progColor(st.prog.key):(st.exs.length?'#3A3E48':'var(--c-blue)');
const stName=st=>st.prog?st.prog.name:(st.exs.length?'Séance':'Course');
const fmtDateLong=k=>new Date(k+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
const fmtDateShort=k=>new Date(k+'T12:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'short'});
const runLine=r=>[(r.distance?r.distance+' km':''),(r.duration?r.duration+' min':''),(runPaceSec(r)?fmtPace(runPaceSec(r))+' /km':''),(r.rpe?'RPE '+r.rpe:'')].filter(Boolean).join(' · ');

/* ---------- Écran Historique ---------- */
let _hist={view:'list',key:null,direct:false};
function openHistory(){closeHistory(true);_hist={view:'list',key:null,direct:false};mountHistory();}
function openSessionDetail(k){
  if(!getSessionDates().includes(k)){showToast('Aucune séance enregistrée ce jour');return;}
  closeHistory(true);_hist={view:'detail',key:k,direct:true};mountHistory();
}
function mountHistory(){
  const el=document.createElement('div');
  el.className='ed-sheet';el.id='histSheet';
  el.setAttribute('role','dialog');el.setAttribute('aria-label','Historique des séances');
  el.innerHTML=`<div class="ed-hdr"><button class="drawer-close" id="histBack" onclick="histBack()" aria-label="Retour"></button><div class="drawer-title" id="histTitle"></div></div><div class="ed-body" id="histBody"></div>`;
  document.body.appendChild(el);
  document.body.style.overflow='hidden';
  histRender();
  requestAnimationFrame(()=>el.classList.add('open'));
}
function closeHistory(silent){
  const el=document.getElementById('histSheet');if(!el)return;
  el.remove();document.body.style.overflow='';
  if(!silent&&document.getElementById('tab-stats').classList.contains('active'))renderStats();
}
function histBack(){
  if(_hist.view==='detail'&&!_hist.direct){_hist.view='list';_hist.key=null;histRender();}
  else closeHistory();
}
function histOpen(k){_hist.view='detail';_hist.key=k;_hist.direct=false;histRender();}
function histRender(){
  const body=document.getElementById('histBody'),title=document.getElementById('histTitle'),back=document.getElementById('histBack');
  if(!body)return;
  if(_hist.view==='detail'){
    title.textContent=fmtDateShort(_hist.key);back.innerHTML=ic('back');body.innerHTML=histDetailHtml(_hist.key);
  }else{
    title.textContent='Historique';back.innerHTML=ic('close');body.innerHTML=histListHtml();
  }
  body.scrollTop=0;
}
function histListHtml(){
  const dates=getSessionDates();
  if(!dates.length)return `<div class="empty">Aucune séance enregistrée.<br>Valide une série pour la retrouver ici.</div>`;
  let html='',cur='';
  dates.forEach(k=>{
    const mo=k.slice(0,7);
    if(mo!==cur){
      cur=mo;
      const n=dates.filter(x=>x.startsWith(mo)).length;
      html+=`<div class="stitle">${new Date(mo+'-01T12:00:00').toLocaleDateString('fr-FR',{month:'long',year:'numeric'})} <span>${n}</span></div>`;
    }
    const st=sessionStats(k),dt=new Date(k+'T12:00:00');
    const parts=[];
    if(st.exs.length){
      parts.push(st.exs.length+' exo'+(st.exs.length>1?'s':''),st.sets+' séries');
      if(st.tonnage>0)parts.push(fmtTonnage(st.tonnage));
      if(st.minutes)parts.push(st.minutes+' min');
      if(st.prs.length)parts.push(st.prs.length+' PR');
      if(st.note)parts.push('note');
    }
    if(st.run)parts.push((st.exs.length?'+ course ':'')+runLine(st.run));
    html+=`<div class="hist-row" style="--c:${stColor(st)}" onclick="histOpen('${k}')" role="button" tabindex="0">
      <div class="hist-date"><b>${dt.getDate()}</b><span>${dt.toLocaleDateString('fr-FR',{weekday:'short'})}</span></div>
      <div class="hist-info"><div class="hist-name">${escA(stName(st))}</div><div class="hist-meta">${escA(parts.join(' · '))}</div></div>
      ${ic('chev')}</div>`;
  });
  return html;
}
function histDetailHtml(k){
  const st=sessionStats(k);
  const time=st.start?new Date(st.start).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}):'';
  let html='';
  if(st.exs.length){
    html+=`<div class="card hist-hero" style="--c:${stColor(st)}">
      <div class="hist-hero-name">${escA(stName(st))}</div>
      <div class="hist-hero-date">${fmtDateLong(k)}${time?' · '+time:''}</div>
      ${sumGridHtml(st)}</div>`;
    if(st.prs.length)html+=`<div class="card hist-prs"><div class="set-lbl ed-lbl">RECORDS BATTUS</div>${st.prs.map(p=>`<div class="hist-pr"><span class="badge b-compound">PR</span><b>${escA(p.name)}</b><span>${fmtKg(p.w)} kg${p.r?' × '+p.r:''}</span></div>`).join('')}</div>`;
    html+=`<div class="stitle">Exercices <span>${st.exs.length}</span></div>`;
    st.exs.forEach(ex=>{
      const chips=ex.sets.map((x,i)=>{
        const w=parseFloat(x.weight)||0,r=x.reps||'—';
        const txt=w>0?`${fmtKg(w)} kg × ${r}${ex.def&&ex.def.isTime?' s':''}`:`${r}${ex.def&&ex.def.isTime?' s':' reps'}`;
        return `<span class="hist-set"><i>${i+1}</i>${txt}</span>`;
      }).join('');
      html+=`<div class="card hist-ex"><div class="hist-ex-name">${escA(ex.name)}</div><div class="hist-sets">${chips}</div>
        ${ex.note?`<div class="hist-note">${escA(ex.note)}</div>`:''}${ex.rpe?`<span class="hist-rpe">RPE ${escA(ex.rpe)}/10</span>`:''}</div>`;
    });
  }else{
    html+=`<div class="card hist-hero" style="--c:var(--c-blue)"><div class="hist-hero-name">Course</div><div class="hist-hero-date">${fmtDateLong(k)}</div></div>`;
  }
  if(st.skipped.length)html+=`<div class="hist-skipped">Exercices sautés : ${escA(st.skipped.join(', '))}</div>`;
  if(st.exs.length)html+=`<div class="card hist-note-card"><span class="set-lbl ed-lbl">NOTES DE LA SÉANCE</span><textarea class="ex-note-inp note-ta" rows="3" maxlength="600" placeholder="Ajouter une note…" onchange="saveSessionNote('${k}',this.value)">${escA(st.note)}</textarea></div>`;
  if(st.run)html+=`<div class="stitle">Course</div><div class="card hist-ex"><div class="hist-ex-name">${escA(runLine(st.run)||'Séance faite')}</div></div>`;
  if(st.exs.length&&k!==todayKey()){
    html+=`<button class="btn-calc ed-add" onclick="duplicateSession('${k}')">${ic('plus')} Dupliquer cette séance</button>
      <div class="ed-hint" style="text-align:center;margin-top:8px">Préremplit la séance d'aujourd'hui avec les mêmes charges et répétitions.</div>`;
  }
  return html;
}
function sumGridHtml(st){
  const cells=[['Tonnage',st.tonnage>0?fmtTonnage(st.tonnage):'—'],['Séries',st.sets||'—'],['Durée',st.minutes?st.minutes+' min':'—'],['RPE moyen',st.rpe!=null?st.rpe+'/10':'—']];
  return `<div class="sum-grid">${cells.map(([l,v])=>`<div class="sum-cell"><div class="sum-v">${v}</div><div class="sum-l">${l}</div></div>`).join('')}</div>`;
}

/* ---------- Dupliquer une séance passée dans « aujourd'hui » ---------- */
function duplicateSession(k){
  const t=todayKey();if(k===t)return;
  const d=gs();
  if(Object.values((d.workouts&&d.workouts[t])||{}).some(a=>(a||[]).some(x=>x&&x.done))){showToast("Tu as déjà validé des séries aujourd'hui");return;}
  const st=sessionStats(k);
  const key=st.prog&&st.prog.key&&PROGRAM[st.prog.key]?st.prog.key:null;
  if(!key||!st.exs.length){showToast('Séance introuvable dans ton programme actuel');return;}
  const d2=gs();
  if(d2.workouts)delete d2.workouts[t];
  if(d2.exNotes)delete d2.exNotes[t];
  if(d2.skipped)delete d2.skipped[t];
  if(d2.dayOrder)delete d2.dayOrder[t];
  ss(d2);
  saveDayProgramOverride(t,key);
  let copied=0;
  PROGRAM[key].exercises.forEach(ex=>{
    const src=st.exs.find(e=>e.id===ex.id);if(!src)return;
    src.sets.slice(0,ex.sets).forEach((x,i)=>{
      saveSet(t,ex.id,i,'weight',String(x.weight==null?'':x.weight));
      saveSet(t,ex.id,i,'reps',String(x.reps==null?'':x.reps));
    });
    if(src.note)saveExNote(t,ex.id,'settings',src.note);
    copied++;
  });
  closeHistory(true);
  renderToday();switchTab('today');
  showToast(`Séance dupliquée · ${copied} exercice${copied>1?'s':''} prérempli${copied>1?'s':''}`);
}

/* ---------- Résumé de séance ---------- */
function previousSimilar(k,st){
  if(!st.prog)return null;
  for(const x of getSessionDates()){
    if(x>=k)continue;
    const o=sessionStats(x);
    if(o.prog&&o.prog.name===st.prog.name&&o.tonnage>0)return o;
  }
  return null;
}
function showSummary(k){
  closeModal();
  const st=sessionStats(k);
  if(!st.exs.length&&!st.run){showToast('Valide au moins une série pour voir le résumé');return;}
  updateSessionMeta(k,m=>{m.summaryShown=true;});
  const eq=getFunEquivalent(st.tonnage);
  const prev=previousSimilar(k,st);
  let delta='';
  if(prev&&st.tonnage>0){
    const pct=Math.round((st.tonnage-prev.tonnage)/prev.tonnage*100);
    delta=`<div class="sum-delta ${pct>0?'up':pct<0?'down':''}">${pct>0?'+':''}${pct} % de tonnage vs la séance du ${fmtDateShort(prev.date)}</div>`;
  }
  const prs=st.prs.length?`<div class="sum-prs"><div class="set-lbl ed-lbl">RECORDS BATTUS</div>${st.prs.map(p=>`<div class="hist-pr"><span class="badge b-compound">PR</span><b>${escA(p.name)}</b><span>${fmtKg(p.w)} kg${p.r?' × '+p.r:''}</span></div>`).join('')}</div>`:'';
  document.body.insertAdjacentHTML('beforeend',`<div class="modal-overlay" id="summaryModal" onclick="if(event.target.id==='summaryModal')closeModal()">
    <div class="modal-box" style="--cm:${stColor(st)};border-top-color:${stColor(st)}">
      <div class="modal-hdr"><div class="modal-title">Résumé de la séance</div></div>
      <div class="sum-sub">${escA(stName(st))} · ${fmtDateShort(k)}</div>
      ${st.exs.length?sumGridHtml(st):''}
      ${eq&&st.tonnage>0?`<div class="sum-eq">soit ${eq.count} ${eq.name}</div>`:''}
      ${delta}${prs}
      ${st.skipped.length?`<div class="sum-sub" style="margin-top:12px">Sautés : ${escA(st.skipped.join(', '))}</div>`:''}
      <div class="sum-note"><span class="set-lbl ed-lbl">NOTE DE SÉANCE (OPTIONNELLE)</span><textarea class="ex-note-inp note-ta" rows="2" maxlength="600" placeholder="Sensations, douleurs, à améliorer…" onchange="saveSessionNote('${k}',this.value)">${escA(st.note)}</textarea></div>
      ${st.run?`<div class="sum-sub" style="margin-top:12px">Course : ${escA(runLine(st.run))}</div>`:''}
      <div style="display:flex;gap:10px;margin-top:20px">
        <button class="run-done-btn" style="flex:1;margin-top:0;background:none;border:1.5px solid var(--border);color:var(--muted)" onclick="closeModal();openSessionDetail('${k}')">Voir le détail</button>
        <button class="run-done-btn done" style="flex:1;margin-top:0" onclick="closeModal()">Terminer</button>
      </div>
    </div></div>`);
}

/* ============================================================
   POIDS DE CORPS : journal et courbe (SVG, sans dépendance)
   ============================================================ */
let _wRange='90',_wDel=null;
function getWeightLog(){return (gs().weightLog||[]).filter(e=>e&&e.date&&e.kg>0).sort((a,b)=>a.date<b.date?-1:1);}
function migrateWeightLog(){
  const d=gs();
  if(!d.weightLog&&d.bodyWeight>0){d.weightLog=[{date:todayKey(),kg:d.bodyWeight}];ss(d);}
}
function weightPoints(){
  const all=getWeightLog();
  if(_wRange==='all')return all;
  const lim=new Date();lim.setDate(lim.getDate()-parseInt(_wRange));
  const lk=dateToKey(lim);
  return all.filter(e=>e.date>=lk);
}
const fmtW=n=>(Math.round(n*10)/10).toLocaleString('fr-FR',{minimumFractionDigits:1,maximumFractionDigits:1});
function weightSvg(pts){
  if(pts.length<2)return `<div class="empty" style="padding:18px 0 8px">${pts.length?'Ajoute une deuxième pesée<br>pour voir la courbe.':'Aucune pesée sur cette période.'}</div>`;
  const W=320,H=170,L=38,R=12,T=14,B=26;
  const t=pts.map(p=>new Date(p.date+'T12:00:00').getTime()),v=pts.map(p=>p.kg);
  let lo=Math.min(...v),hi=Math.max(...v);
  const pad=Math.max(0.5,(hi-lo)*0.15);
  lo=Math.floor((lo-pad)*2)/2;hi=Math.ceil((hi+pad)*2)/2;if(hi-lo<1)hi=lo+1;
  const t0=t[0],t1=t[t.length-1];
  const X=x=>L+(t1===t0?0.5:(x-t0)/(t1-t0))*(W-L-R),Y=y=>T+(1-(y-lo)/(hi-lo))*(H-T-B);
  const line=pts.map((p,i)=>(i?'L':'M')+X(t[i]).toFixed(1)+' '+Y(v[i]).toFixed(1)).join(' ');
  const area=line+` L${X(t1).toFixed(1)} ${H-B} L${X(t0).toFixed(1)} ${H-B} Z`;
  const grid=[lo,(lo+hi)/2,hi].map(g=>`<line class="w-grid" x1="${L}" x2="${W-R}" y1="${Y(g).toFixed(1)}" y2="${Y(g).toFixed(1)}"/><text class="w-lbl" x="${L-6}" y="${(Y(g)+3.5).toFixed(1)}" text-anchor="end">${fmtW(g)}</text>`).join('');
  const dots=pts.map((p,i)=>`<circle class="w-dot" cx="${X(t[i]).toFixed(1)}" cy="${Y(v[i]).toFixed(1)}" r="${pts.length>40?2:3.5}"/><circle class="w-hit" cx="${X(t[i]).toFixed(1)}" cy="${Y(v[i]).toFixed(1)}" r="14" onclick="selectWeightPoint(${i})"/>`).join('');
  return `<svg class="w-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Courbe du poids de corps">
    ${grid}<path class="w-area" d="${area}"/><path class="w-line" d="${line}"/>${dots}
    <text class="w-lbl" x="${L}" y="${H-6}" text-anchor="start">${fmtDateShort(pts[0].date)}</text>
    <text class="w-lbl" x="${W-R}" y="${H-6}" text-anchor="end">${fmtDateShort(pts[pts.length-1].date)}</text></svg>`;
}
function selectWeightPoint(i){
  const p=weightPoints()[i],el=document.getElementById('wRead');
  if(p&&el)el.innerHTML=`<b>${fmtW(p.kg)} kg</b> · ${fmtDateShort(p.date)}`;
}
function weightCardHtml(){
  const all=getWeightLog(),pts=weightPoints(),today=todayKey();
  const last=all[all.length-1];
  let delta='';
  if(pts.length>=2){
    const df=pts[pts.length-1].kg-pts[0].kg;
    delta=`<span class="w-delta ${df>0?'up':df<0?'down':''}">${df>0?'+':''}${fmtW(df)} kg</span> depuis le ${fmtDateShort(pts[0].date)}`;
  }
  const chips=[['30','30 j'],['90','90 j'],['all','Tout']].map(([v,l])=>`<button class="ed-chip${_wRange===v?' on':''}" onclick="setWeightRange('${v}')">${l}</button>`).join('');
  const rows=all.slice(-6).reverse().map(e=>`<div class="w-row"><span>${fmtDateShort(e.date)}</span><b>${fmtW(e.kg)} kg</b><button class="ed-ib${_wDel===e.date?' warn':''}" onclick="deleteWeight('${e.date}')" aria-label="Supprimer la pesée">${_wDel===e.date?'Sûr ?':ic('trash')}</button></div>`).join('');
  return `<div class="stitle">Poids de corps</div>
    <div class="w-head"><div class="w-big">${last?fmtW(last.kg):'—'}<small> kg</small></div><div class="w-sub">${delta||(last?'Dernière pesée le '+fmtDateShort(last.date):'Ajoute ta première pesée')}</div></div>
    <div class="ed-chips" style="margin:12px 0 4px">${chips}</div>
    ${weightSvg(pts)}
    <div class="w-read" id="wRead">${pts.length>=2?'Touche un point pour voir la valeur':''}</div>
    <div class="w-add">
      <input class="si" id="wKg" type="number" inputmode="decimal" step="0.1" placeholder="kg" aria-label="Poids en kg">
      <input class="si" id="wDate" type="date" value="${today}" max="${today}" aria-label="Date de la pesée">
      <button class="btn-calc" onclick="addWeight()">Ajouter</button>
    </div>
    ${rows?`<div class="w-list">${rows}</div>`:''}`;
}
function refreshWeightCard(){const el=document.getElementById('weightCard');if(el)el.innerHTML=weightCardHtml();}
function setWeightRange(v){_wRange=v;_wDel=null;refreshWeightCard();}
function addWeight(){
  const kg=document.getElementById('wKg'),dt=document.getElementById('wDate');
  const date=(dt&&dt.value)||todayKey();
  if(date>todayKey()){showToast('La date ne peut pas être dans le futur');return;}
  if(!saveBodyWeight(kg?kg.value:'',date)){showToast('Poids invalide (20 à 300 kg)');return;}
  showToast('Pesée enregistrée');refreshWeightCard();
}
function deleteWeight(k){
  if(_wDel!==k){_wDel=k;refreshWeightCard();setTimeout(()=>{if(_wDel===k){_wDel=null;refreshWeightCard();}},3000);return;}
  const d=gs();
  d.weightLog=(d.weightLog||[]).filter(e=>e.date!==k);
  const log=getWeightLog();
  if(log.length)d.bodyWeight=log[log.length-1].kg;else delete d.bodyWeight;
  ss(d);_wDel=null;showToast('Pesée supprimée');refreshWeightCard();
}

/* ============================================================
   SAUVEGARDE : export / import JSON
   ============================================================ */
const isIOS=()=>/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
function backupLabel(){
  const t=gs().lastBackup;
  if(!t)return 'Aucune sauvegarde effectuée pour le moment.';
  const days=Math.floor((Date.now()-t)/864e5);
  return 'Dernière sauvegarde : '+new Date(t).toLocaleString('fr-FR',{day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'})+(days>=30?` (il y a ${days} jours)`:'');
}
async function exportData(){
  const payload={app:'GymAddict',format:1,exportedAt:new Date().toISOString(),data:gs()};
  const json=JSON.stringify(payload);
  const name='gymaddict-sauvegarde-'+todayKey()+'.json';
  const done=()=>{const d=gs();d.lastBackup=Date.now();ss(d);const el=document.getElementById('backupLast');if(el)el.textContent=backupLabel();renderBackupBanner();showToast('Sauvegarde exportée');};
  try{
    const file=new File([json],name,{type:'application/json'});
    if(isIOS()&&navigator.canShare&&navigator.canShare({files:[file]})){
      await navigator.share({files:[file],title:'Sauvegarde GymAddict'});
      done();return;
    }
  }catch(e){if(e&&e.name==='AbortError')return;}
  const url=URL.createObjectURL(new Blob([json],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),4000);
  done();
}
function extractBackup(o){
  if(!o||typeof o!=='object'||Array.isArray(o))return null;
  const data=(o.app==='GymAddict'&&o.data&&typeof o.data==='object')?o.data:o;
  if(!data||Array.isArray(data))return null;
  const known=['workouts','prs','profile','activeDays','runLogs','exNotes','readiness','dayProgram','program','weightLog','sessionMeta','bodyWeight'];
  if(!known.some(k=>k in data))return null;
  const isObj=v=>v==null||(typeof v==='object'&&!Array.isArray(v));
  if(!['workouts','prs','profile','runLogs','exNotes','readiness','dayProgram','program','sessionMeta','exNames','prefs'].every(k=>isObj(data[k])))return null;
  if(data.activeDays!=null&&!Array.isArray(data.activeDays))return null;
  if(data.weightLog!=null&&!Array.isArray(data.weightLog))return null;
  return data;
}
let _pendingImport=null;
function importFileChosen(input){
  const f=input.files&&input.files[0];input.value='';
  if(!f)return;
  if(f.size>8*1024*1024){showToast('Fichier trop volumineux');return;}
  const r=new FileReader();
  r.onload=()=>{
    try{
      const o=JSON.parse(r.result),data=extractBackup(o);
      if(!data)throw new Error('format');
      _pendingImport={data,exportedAt:o&&o.exportedAt};
      confirmImport();
    }catch(e){showToast('Fichier de sauvegarde invalide');}
  };
  r.onerror=()=>showToast('Lecture du fichier impossible');
  r.readAsText(f);
}
function confirmImport(){
  const data=_pendingImport.data;
  const merged=mergeBackup(gs(),data);
  _pendingImport.merged=merged.data;
  const st=merged.stats;
  const n=Object.keys(data.workouts||{}).filter(k=>Object.values(data.workouts[k]||{}).some(a=>Array.isArray(a)&&a.some(x=>x&&x.done))).length;
  const when=_pendingImport.exportedAt?new Date(_pendingImport.exportedAt).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'}):null;
  closeModal();
  document.body.insertAdjacentHTML('beforeend',`<div class="modal-overlay" id="importModal" onclick="if(event.target.id==='importModal')closeModal()"><div class="modal-box">
    <div class="modal-hdr"><div class="modal-title">Importer cette sauvegarde</div><button class="drawer-close" onclick="closeModal()" aria-label="Fermer">${ic('close')}</button></div>
    <div class="sum-sub" style="margin-top:6px">${when?'Sauvegarde du '+when+' · ':''}${n} séance${n>1?'s':''}${st.runs?` · ${st.runs} sortie${st.runs>1?'s':''}`:''}.</div>
    <div class="imp-opt"><b>Fusionner</b> <em>recommandé</em>
      <p>Ajoute au contenu de cet appareil : <b>${st.newSessions}</b> séance${st.newSessions>1?'s':''} nouvelle${st.newSessions>1?'s':''}, <b>${st.newWeights}</b> pesée${st.newWeights>1?'s':''}, <b>${st.newRuns}</b> sortie${st.newRuns>1?'s':''}, <b>${st.newPRs}</b> record${st.newPRs>1?'s':''} amélioré${st.newPRs>1?'s':''}${st.newGoals?`, <b>${st.newGoals}</b> objectif${st.newGoals>1?'s':''}`:''}. Rien n'est supprimé ; pour un même jour, la version la plus complète est gardée. Programme, profil et réglages de cet appareil sont conservés.</p>
      <button class="run-done-btn done" style="margin-top:6px" onclick="applyImport('merge')">Fusionner</button></div>
    <div class="imp-opt"><b>Remplacer</b>
      <p>Efface les données de cet appareil et les remplace par celles du fichier.</p>
      <button class="btn-danger" style="width:100%" onclick="applyImport('replace')">Remplacer tout</button></div>
    <button class="run-done-btn" style="margin-top:12px;background:none;border:1.5px solid var(--border);color:var(--muted)" onclick="closeModal()">Annuler</button>
  </div></div>`);
}
function applyImport(mode){
  const o=_pendingImport;if(!o)return;
  try{localStorage.setItem('fitcore_before_import',localStorage.getItem('fitcore')||'');}catch(e){}
  ss(mode==='merge'&&o.merged?o.merged:o.data);
  try{localStorage.removeItem(TIMER_KEY);}catch(e){}
  _pendingImport=null;
  closeModal();showToast(mode==='merge'?'Données fusionnées':'Données restaurées');
  setTimeout(()=>location.reload(),700);
}

/* ============================================================
   NOTES DE SÉANCE · SAUTER / REPORTER UN EXERCICE
   ============================================================ */
let _drawerCtx=null;
function saveSessionNote(k,v){
  const text=String(v==null?'':v).slice(0,600);
  updateSessionMeta(k,m=>{if(text.trim())m.note=text;else delete m.note;});
  triggerSave();
}
function sessionNoteCardHtml(k){
  const note=getSessionMeta(k).note||'';
  return `<div class="card note-card"><span class="set-lbl ed-lbl">NOTES DE LA SÉANCE</span>
    <textarea class="ex-note-inp note-ta" rows="3" maxlength="600" placeholder="Forme du jour, sensations, douleurs, ce qu'il faut améliorer…"
      oninput="debounce('sn-${k}',()=>saveSessionNote('${k}',this.value),700)" onchange="saveSessionNote('${k}',this.value)">${escA(note)}</textarea></div>`;
}
const getSkipped=k=>{const d=gs();return (d.skipped&&d.skipped[k])||[];};
const isSkipped=(k,id)=>getSkipped(k).includes(id);
const baseId=e=>e.swappedFrom||e.id;
/* Ordre du jour : remplacements appliqués, exercices reportés à la fin, exercices d'un même superset côte à côte */
function orderedExercises(k,prog){
  const base=dayExercises(k,prog);
  const ord=(gs().dayOrder||{})[k];
  let list=base;
  if(ord&&ord.length){
    const byKey={};base.forEach(e=>{byKey[baseId(e)]=e;});
    list=ord.map(id=>byKey[id]).filter(Boolean);
    base.forEach(e=>{if(!list.includes(e))list.push(e);});
  }
  return groupSupersets(list);
}
function groupSupersets(list){
  const out=[],used=new Set();
  list.forEach(e=>{
    if(used.has(e))return;
    out.push(e);used.add(e);
    if(e.superset)list.forEach(o=>{if(!used.has(o)&&o.superset===e.superset){out.push(o);used.add(o);}});
  });
  return out;
}
function rerenderDay(k,scroll){
  const drawer=document.getElementById('dayDrawer');
  if(k===todayKey())renderToday(true);
  if(drawer&&drawer.classList.contains('open')&&_drawerCtx&&_drawerCtx.dateKey===k){
    const body=document.getElementById('drawerBody'),top=body.scrollTop;
    openDayDrawer(_drawerCtx.dayName,k);body.scrollTop=top;
  }
  if(scroll&&k===todayKey()){
    const a=document.querySelector('#today-content .ex-card.active');
    if(a)requestAnimationFrame(()=>a.scrollIntoView({behavior:'smooth',block:'start'}));
  }
}
function skipExercise(k,id,on){
  const d=gs();if(!d.skipped)d.skipped={};
  const a=(d.skipped[k]||[]).filter(x=>x!==id);
  if(on)a.push(id);
  if(a.length)d.skipped[k]=a;else delete d.skipped[k];
  ss(d);triggerSave();
  rerenderDay(k,on);
  showToast(on?'Exercice sauté':'Exercice repris');
  if(on)maybeFinishDay(k,true);
}
function postponeExercise(k,id){
  const {prog}=getEffectiveDayProgram(k);if(!prog)return;
  const list=orderedExercises(k,prog);
  const cur=list.find(e=>e.id===id);if(!cur)return;
  if(list[list.length-1].id===id){showToast("C'est déjà le dernier exercice");return;}
  const d=gs();if(!d.dayOrder)d.dayOrder={};
  d.dayOrder[k]=list.filter(e=>e.id!==id).map(baseId).concat(baseId(cur));
  ss(d);triggerSave();
  rerenderDay(k,true);
  showToast('Reporté à la fin de la séance');
}

/* ============================================================
   SEMAINE ISO · RUNNING · ALLURE · ROUTAGE PAR L'URL
   ============================================================ */
function runForDay(dayName){const id=RUN_WEEKLY[dayName];return id&&RUNS[id]?Object.assign({id},RUNS[id]):null;}
function runPlanList(){return DAYS_ORDER.map(d=>({day:d,run:runForDay(d)})).filter(x=>x.run);}
const fmtKm=n=>String(Math.round(n*10)/10).replace('.',',');
function parsePace(v){
  const t=String(v==null?'':v).trim().replace(',','.');if(!t)return 0;
  const m=t.match(/^(\d{1,2}):(\d{1,2})$/);
  if(m)return (+m[1])*60+Math.min(59,+m[2]);
  const n=parseFloat(t);return n>0&&n<30?Math.round(n*60):0;
}
/* Objectif de la sortie vs résultat saisi */
function runGoalHtml(run,rl){
  const parts=[];
  if(run.targetDistance)parts.push(fmtKm(run.targetDistance)+' km');
  if(run.targetDuration)parts.push(run.targetDuration+' min');
  if(run.targetPace)parts.push(fmtPace(run.targetPace)+' /km');
  if(!parts.length)return '';
  const res=[],dist=parseFloat(String(rl.distance||'').replace(',','.')),dur=parseFloat(rl.duration),pace=runPaceSec(rl);
  if(run.targetDistance&&dist>0)res.push(dist>=run.targetDistance?'distance atteinte':'−'+fmtKm(run.targetDistance-dist)+' km');
  if(run.targetDuration&&dur>0)res.push(dur>=run.targetDuration?'durée atteinte':'−'+Math.round(run.targetDuration-dur)+' min');
  if(run.targetPace&&pace>0){const df=pace-run.targetPace;res.push(df<=0?'allure tenue ('+(df<0?'−'+Math.abs(df)+' s/km':'pile')+')':'+'+df+' s/km');}
  return `Objectif : <b>${parts.join(' · ')}</b>${res.length?` — ${res.join(' · ')}`:''}`;
}

/* Semaine du lundi au dimanche contenant aujourd'hui : { lundi:'AAAA-MM-JJ', … } */
function weekDateKeys(){
  const t=new Date();t.setHours(0,0,0,0);
  const mon=new Date(t);mon.setDate(t.getDate()-((t.getDay()+6)%7));
  const out={};
  DAYS_ORDER.forEach((n,i)=>{const d=new Date(mon);d.setDate(mon.getDate()+i);out[n]=dateToKey(d);});
  return out;
}
function runPaceSec(rl){
  const dur=parseFloat(rl&&rl.duration),dist=parseFloat(String((rl&&rl.distance)||'').replace(',','.'));
  return dur>0&&dist>0?Math.round(dur*60/dist):0;
}
function fmtPace(sec){if(!sec)return '';const s=Math.round(sec);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}
function paceHtml(rl){
  const p=runPaceSec(rl);
  return p?`Allure moyenne : <b>${fmtPace(p)}</b> /km`:'Allure moyenne : renseigne la durée et la distance';
}
function updateRunPaceUI(k){
  const el=document.getElementById('pace-'+k);if(el)el.innerHTML=paceHtml(getRunLog(k));
  const g=document.getElementById('rgoal-'+k);
  if(g){const run=runForDay(DAY_JS_MAP[new Date(k+'T12:00:00').getDay()]);g.innerHTML=run?runGoalHtml(run,getRunLog(k)):'';}
}
function fmtDuration(min){const m=Math.round(min);return m>=60?Math.floor(m/60)+'h'+String(m%60).padStart(2,'0'):m+' min';}

function weekRunLineHtml(dayName,dateKey){
  const run=runForDay(dayName);if(!run)return '';
  const rl=getRunLog(dateKey),pace=runPaceSec(rl);
  const stats=[rl.distance?rl.distance+' km':'',rl.duration?rl.duration+' min':'',pace?fmtPace(pace)+' /km':''].filter(Boolean).join(' · ');
  const tgt=[run.targetDistance?fmtKm(run.targetDistance)+' km':'',run.targetDuration?run.targetDuration+' min':'',run.targetPace?fmtPace(run.targetPace)+' /km':''].filter(Boolean).join(' · ');
  return `<div class="wrun${rl.done?' done':''}" onclick="event.stopPropagation();openRun('${dateKey}')" role="button" tabindex="0">${ic(rl.done?'check':'pulse')}<span><b>${escA(run.name)}</b>${rl.done?(stats?' · '+stats:' · faite'):(tgt?' · '+tgt:' · à faire')}</span></div>`;
}
function weekCardioHtml(WK){
  const plan=runPlanList();
  if(!plan.length&&!WEEKLY_KM)return '';
  let done=0,km=0,min=0,paceDur=0,paceDist=0;
  plan.forEach(({day})=>{
    const rl=getRunLog(WK[day]);
    if(rl.done)done++;
    const dur=parseFloat(rl.duration)||0,dist=parseFloat(String(rl.distance||'').replace(',','.'))||0;
    km+=dist;min+=dur;
    if(dur>0&&dist>0){paceDur+=dur;paceDist+=dist;}
  });
  const pace=paceDist>0?fmtPace(paceDur*60/paceDist):'—';
  const cells=[['Sorties',done+'/'+plan.length],['Distance',km>0?fmtKm(km)+' km':'—'],['Durée',min>0?fmtDuration(min):'—'],['Allure /km',pace]];
  const kmBar=WEEKLY_KM>0?`<div class="wk-km"><div class="goal-meta"><span>Objectif distance</span><span>${fmtKm(km)} / ${fmtKm(WEEKLY_KM)} km</span></div><div class="goal-bar"><i style="width:${Math.min(100,Math.round(km/WEEKLY_KM*100))}%"></i></div></div>`:'';
  return `<div class="card wk-cardio"><div class="stitle">Cardio de la semaine</div>
    <div class="sum-grid wk-grid">${cells.map(([l,v])=>`<div class="sum-cell"><div class="sum-v">${v}</div><div class="sum-l">${l}</div></div>`).join('')}</div>${kmBar}</div>`;
}
function openRun(k){
  switchTab('cardio');
  const sec=document.getElementById('runSection');
  if(sec&&sec.style.display==='none')toggleRunSection();
  setTimeout(()=>{const c=document.getElementById('crun-'+k);if(c)c.scrollIntoView({behavior:'smooth',block:'center'});},120);
}
/* Raccourcis PWA / notifications : index.html#today | #week | #stats | #cardio | #profile */
function handleHash(){
  const h=(location.hash||'').replace('#','');
  if(!h||!TABS.includes(h))return;
  switchTab(h);
  try{history.replaceState(null,'',location.pathname+location.search);}catch(e){}
}

/* ============================================================
   RAPPELS D'ENTRAÎNEMENT (notifications)
   - Réglages : prefs.reminder = { enabled, time:'HH:MM', days:[0-6] }  (0 = dimanche)
   - Le service worker lit une copie de la config (cache « ga-config ») et affiche la notification à l'heure dite :
       · via Periodic Background Sync (Chrome / Edge Android, appli installée) même appli fermée ;
       · sinon, tant que l'appli est ouverte (contrôle chaque minute).
   - Pas de rappel si la séance du jour est déjà faite, ni si un rappel a déjà été envoyé aujourd'hui.
   - Nécessite HTTPS (ou localhost).
   ============================================================ */
const REM_DAYS=[[1,'Lun'],[2,'Mar'],[3,'Mer'],[4,'Jeu'],[5,'Ven'],[6,'Sam'],[0,'Dim']];
const reminderSupported=()=>'Notification' in window&&'serviceWorker' in navigator&&window.isSecureContext;
function getReminder(){return Object.assign({enabled:false,time:'18:00',days:[]},(gs().prefs||{}).reminder||{});}
function saveReminder(patch){
  const d=gs();d.prefs=Object.assign({},d.prefs||{});
  d.prefs.reminder=Object.assign(getReminder(),patch);
  ss(d);scheduleReminderSync();
}
function isTrainedOn(k){
  const d=gs();
  if(Object.values((d.workouts&&d.workouts[k])||{}).some(a=>(a||[]).some(x=>x&&x.done)))return true;
  return !!(d.runLogs&&d.runLogs[k]&&d.runLogs[k].done);
}
/* Texte de la notification par jour de la semaine (index JS 0-6) */
function reminderLabels(){
  const out={};
  DAY_JS_MAP.forEach((name,i)=>{
    const parts=[],p=PROGRAM[WEEKLY_SUGGESTIONS[name]];
    if(p&&p.type!=='rest')parts.push(p.fullName);
    const run=runForDay(name);
    if(run)parts.push(run.name);
    if(parts.length)out[i]=parts.join(' + ');
  });
  return out;
}
function defaultReminderDays(){return Object.keys(reminderLabels()).map(Number);}
const remConfigUrl=()=>new URL('./__ga-reminder-config',document.baseURI).href;
async function syncReminderConfig(){
  if(!('caches' in window))return;
  try{
    const r=getReminder(),c=await caches.open('ga-config'),old=await c.match(remConfigUrl());
    const prev=old?await old.json():{};
    const cfg={
      enabled:!!r.enabled&&typeof Notification!=='undefined'&&Notification.permission==='granted',
      time:r.time,days:r.days,labels:reminderLabels(),
      trainedDate:isTrainedOn(todayKey())?todayKey():'',
      lastNotified:prev.lastNotified||''
    };
    await c.put(remConfigUrl(),new Response(JSON.stringify(cfg),{headers:{'Content-Type':'application/json'}}));
  }catch(e){}
}
function scheduleReminderSync(){debounce('rem-sync',syncReminderConfig,400);}
async function postToSW(msg){
  try{const reg=await navigator.serviceWorker.ready;if(reg.active)reg.active.postMessage(msg);}catch(e){}
}
let _remTimer=null;
function startReminderLoop(){
  clearInterval(_remTimer);_remTimer=null;
  if(!reminderSupported()||!getReminder().enabled)return;
  syncReminderConfig().then(()=>postToSW({type:'check-reminder'}));
  _remTimer=setInterval(()=>postToSW({type:'check-reminder'}),60000);
  registerPeriodicReminder();
}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&_remTimer)postToSW({type:'check-reminder'});});
async function registerPeriodicReminder(){
  try{
    const reg=await navigator.serviceWorker.ready;
    if(!('periodicSync' in reg))return false;
    const st=await navigator.permissions.query({name:'periodic-background-sync'});
    if(st.state!=='granted')return false;
    await reg.periodicSync.register('ga-reminder',{minInterval:30*60*1000});
    return true;
  }catch(e){return false;}
}
async function toggleReminder(){
  const r=getReminder();
  if(r.enabled){saveReminder({enabled:false});startReminderLoop();renderProfile();updateReminderStatus();return;}
  if(!reminderSupported()){showToast('Rappels indisponibles (HTTPS requis)');return;}
  let perm=Notification.permission;
  if(perm==='default')perm=await Notification.requestPermission();
  if(perm!=='granted'){showToast('Notifications bloquées dans le navigateur');renderProfile();updateReminderStatus();return;}
  saveReminder({enabled:true,days:(r.days&&r.days.length)?r.days:defaultReminderDays()});
  startReminderLoop();renderProfile();updateReminderStatus();
  showToast('Rappels activés');
}
function setReminderTime(v){if(/^\d{2}:\d{2}$/.test(v)){saveReminder({time:v});startReminderLoop();}}
function toggleReminderDay(n){
  const r=getReminder();
  const days=r.days.includes(n)?r.days.filter(x=>x!==n):r.days.concat(n);
  saveReminder({days});renderProfile();updateReminderStatus();
}
async function testReminder(){
  if(!reminderSupported()||Notification.permission!=='granted'){showToast("Active d'abord les rappels");return;}
  try{
    const reg=await navigator.serviceWorker.ready;
    const icon=new URL('assets/icon-192.png',document.baseURI).href;
    await reg.showNotification('GymAddict · Test',{body:'Les rappels fonctionnent. Bonne séance !',tag:'ga-test',icon,badge:icon,data:{url:'./index.html#today'}});
  }catch(e){showToast("Impossible d'afficher la notification");}
}
function reminderCardHtml(){
  const head='<div class="stitle">Rappels d\'entraînement</div>';
  if(!('Notification' in window)||!('serviceWorker' in navigator))
    return `${head}<div class="card" style="margin-bottom:12px"><div class="pref-sub" style="margin:0;font-size:13px;line-height:1.5">Les notifications ne sont pas prises en charge par ce navigateur.</div></div>`;
  if(!window.isSecureContext)
    return `${head}<div class="card" style="margin-bottom:12px"><div class="pref-sub" style="margin:0;font-size:13px;line-height:1.5">Les rappels nécessitent que l'appli soit servie en <b>HTTPS</b>.</div></div>`;
  const r=getReminder(),denied=Notification.permission==='denied',on=r.enabled&&Notification.permission==='granted';
  const body=on?`
    <div class="rem-time"><span class="pref-name">Heure du rappel</span>
      <input class="si" type="time" value="${escA(r.time)}" onchange="setReminderTime(this.value)" aria-label="Heure du rappel"></div>
    <div class="rem-days" role="group" aria-label="Jours de rappel">${REM_DAYS.map(([n,l])=>`<button class="ed-chip${r.days.includes(n)?' on':''}" onclick="toggleReminderDay(${n})" aria-pressed="${r.days.includes(n)}">${l}</button>`).join('')}</div>
    <button class="warmup-btn pref-test" onclick="testReminder()">Tester la notification</button>`:'';
  return `${head}<div class="card" style="margin-bottom:12px">
    <div class="pref-row" style="${on?'':'border-bottom:none;padding-bottom:0'}">
      <div><div class="pref-name">Me rappeler de m'entraîner</div>
      <div class="pref-sub">${denied?'Notifications bloquées : autorise-les dans les réglages du navigateur ou du site.':'Notification les jours d\'entraînement, sauf si la séance est déjà faite'}</div></div>
      <button class="sw${on?' on':''}" role="switch" aria-checked="${on}" aria-label="Rappels d'entraînement" onclick="toggleReminder()"><i></i></button>
    </div>${body}
    <div class="pref-sub rem-status" id="remStatus"></div>
  </div>`;
}
async function updateReminderStatus(){
  const el=document.getElementById('remStatus');if(!el)return;
  const r=getReminder();
  if(!(r.enabled&&Notification.permission==='granted')){el.textContent='';return;}
  let bg=false;
  try{
    const reg=await navigator.serviceWorker.ready;
    if('periodicSync' in reg){
      const tags=await reg.periodicSync.getTags();
      bg=tags.includes('ga-reminder');
    }
  }catch(e){}
  el.textContent=bg
    ?'Rappel actif, même appli fermée (selon la gestion de la batterie de ton appareil).'
    :"Ton navigateur n'autorise pas l'envoi appli fermée : le rappel arrive tant que l'appli est ouverte, même en arrière-plan.";
}

/* ============================================================
   SUPERSETS · EXERCICES DE REMPLACEMENT
   ============================================================ */
function dayExercises(k,prog){
  if(!prog)return [];
  const sw=(gs().swaps||{})[k];
  if(!sw)return prog.exercises;
  return prog.exercises.map(e=>sw[e.id]||e);
}
/* Exercice du même superset à enchaîner juste après (même numéro de série), ou null quand il faut se reposer */
function supersetNext(k,exId,idx){
  const {prog}=getEffectiveDayProgram(k);if(!prog)return null;
  const list=orderedExercises(k,prog).filter(e=>!isSkipped(k,e.id));
  const ex=list.find(e=>e.id===exId);
  if(!ex||!ex.superset)return null;
  const group=list.filter(e=>e.superset===ex.superset);
  if(group.length<2)return null;
  return group.slice(group.indexOf(ex)+1).find(e=>idx<e.sets&&!getSet(k,e.id,idx).done)||null;
}
function supersetRest(k,exId,fallback){
  const {prog}=getEffectiveDayProgram(k);if(!prog)return fallback||90;
  const list=orderedExercises(k,prog).filter(e=>!isSkipped(k,e.id));
  const ex=list.find(e=>e.id===exId);
  if(!ex||!ex.superset)return fallback||90;
  return Math.max(...list.filter(e=>e.superset===ex.superset).map(e=>e.restSec||90));
}
/* Candidats : exercices connus qui travaillent le même muscle et ne sont pas déjà dans la séance du jour */
function swapCandidates(ex,k){
  const {prog}=getEffectiveDayProgram(k);
  const present=new Set(dayExercises(k,prog).map(e=>e.id));
  const pool={};
  const d=gs();
  Object.values(d.exDefs||{}).forEach(e=>{pool[e.id]=e;});
  Object.values(PROGRAM).forEach(p=>p.exercises.forEach(e=>{pool[e.id]=e;}));
  const main=(ex.muscles||[])[0];
  return Object.values(pool).filter(c=>!present.has(c.id)&&c.type!=='echauffement'&&(c.muscles||[]).some(m=>(ex.muscles||[]).includes(m))).map(c=>{
    let score=0;
    if((c.muscles||[])[0]===main)score+=3;
    if(c.type===ex.type)score+=1;
    if(!!c.isTime===!!ex.isTime)score+=1;
    return {c,score};
  }).sort((a,b)=>b.score-a.score||a.c.name.localeCompare(b.c.name)).slice(0,8).map(x=>x.c);
}
function buildSwapDef(orig,cand,k){
  const base=orig.swappedFrom||orig.id;
  const timeMismatch=!!cand.isTime!==!!orig.isTime;
  const def=Object.assign({},orig,{
    id:cand.id,name:cand.name,type:cand.type||orig.type,muscles:(cand.muscles&&cand.muscles.length)?cand.muscles.slice():(orig.muscles||[]).slice(),
    restSec:cand.restSec||orig.restSec,swappedFrom:base,swappedName:orig.swappedName||orig.name
  });
  if(cand.isTime)def.isTime=true;else delete def.isTime;
  if(timeMismatch){def.repsLabel=cand.repsLabel||(cand.isTime?'30-60 sec':'8-12 reps');def.defaultReps=cand.defaultReps||(cand.isTime?45:10);}
  delete def.step;if(cand.step>0)def.step=cand.step;
  return def;
}
function showSwapModal(k,exId){
  closeModal();
  const {prog}=getEffectiveDayProgram(k);if(!prog)return;
  const ex=dayExercises(k,prog).find(e=>e.id===exId);if(!ex)return;
  const cands=swapCandidates(ex,k);
  const list=cands.length?cands.map(c=>`<button class="swap-item" onclick="doSwap('${k}','${exId}','${c.id}')"><b>${escA(c.name)}</b><span>${escA(({compound:'Compound',isolation:'Isolation',echauffement:'Échauffement'})[c.type]||'')}${(c.muscles||[]).length?' · '+escA(c.muscles.join(', ')):''}</span></button>`).join(''):`<div class="ed-hint" style="margin:6px 0 12px">Aucune suggestion : indique l'exercice que tu fais à la place.</div>`;
  document.body.insertAdjacentHTML('beforeend',`<div class="modal-overlay" id="swapModal" onclick="if(event.target.id==='swapModal')closeModal()">
    <div class="modal-box">
      <div class="modal-hdr"><div class="modal-title">Remplacer l'exercice</div><button class="drawer-close" onclick="closeModal()" aria-label="Fermer">${ic('close')}</button></div>
      <div class="sum-sub" style="margin-top:6px">${escA(ex.name)} · même volume (${ex.sets} × ${escA(ex.repsLabel)}), pour aujourd'hui seulement.</div>
      <div class="swap-list">${list}</div>
      <span class="set-lbl ed-lbl" style="margin-top:14px">AUTRE EXERCICE</span>
      <div class="swap-free"><input class="ex-note-inp" id="swapFree" list="swapNames" maxlength="60" placeholder="Nom de l'exercice" autocomplete="off">
      <datalist id="swapNames">${knownExercises().map(e=>`<option value="${escA(e.name)}"></option>`).join('')}</datalist>
      <button class="btn-calc" onclick="doSwapFree('${k}','${exId}')">Utiliser</button></div>
    </div></div>`);
}
function applySwap(k,orig,def){
  const d=gs();
  if(!d.swaps)d.swaps={};
  if(!d.swaps[k])d.swaps[k]={};
  d.swaps[k][def.swappedFrom]=def;
  d.exNames=Object.assign({},d.exNames||{});d.exNames[def.id]=def.name;
  d.exDefs=Object.assign({},d.exDefs||{});d.exDefs[def.id]={id:def.id,name:def.name,type:def.type,muscles:def.muscles,isTime:!!def.isTime};
  if(d.skipped&&d.skipped[k])d.skipped[k]=d.skipped[k].filter(x=>x!==orig.id);
  ss(d);triggerSave();
  closeModal();
  rerenderDay(k,true);
  showToast('Remplacé par '+def.name);
}
function doSwap(k,exId,candId){
  const {prog}=getEffectiveDayProgram(k);if(!prog)return;
  const ex=dayExercises(k,prog).find(e=>e.id===exId);
  const cand=swapCandidates(ex,k).find(c=>c.id===candId);
  if(!ex||!cand)return;
  applySwap(k,ex,buildSwapDef(ex,cand,k));
}
function doSwapFree(k,exId){
  const inp=document.getElementById('swapFree');
  const name=cleanName(inp?inp.value:'');
  if(!name){showToast("Indique le nom de l'exercice");return;}
  const {prog}=getEffectiveDayProgram(k);if(!prog)return;
  const ex=dayExercises(k,prog).find(e=>e.id===exId);if(!ex)return;
  const known=knownExercises().find(e=>normName(e.name)===normName(name));
  const id=known?known.id:'x_'+Date.now().toString(36)+Math.random().toString(36).slice(2,5);
  const defs=(gs().exDefs||{})[id];
  applySwap(k,ex,buildSwapDef(ex,Object.assign({muscles:ex.muscles,type:ex.type},defs||{},{id,name:known?known.name:name}),k));
}
function revertSwap(k,exId){
  const {prog}=getEffectiveDayProgram(k);if(!prog)return;
  const ex=dayExercises(k,prog).find(e=>e.id===exId);if(!ex||!ex.swappedFrom)return;
  for(let i=0;i<ex.sets;i++)if(getSet(k,exId,i).done){showToast('Impossible : des séries sont déjà validées');return;}
  const d=gs();
  if(d.swaps&&d.swaps[k]){delete d.swaps[k][ex.swappedFrom];if(!Object.keys(d.swaps[k]).length)delete d.swaps[k];}
  if(d.workouts&&d.workouts[k])delete d.workouts[k][exId];
  ss(d);triggerSave();
  rerenderDay(k,true);
  showToast('Exercice d\'origine rétabli');
}

/* ============================================================
   OBJECTIFS DE FORCE ET DE POIDS
   goals = [{ id, type:'lift'|'weight', exId?, target, start, startDate, achievedAt? }]
   ============================================================ */
const getGoals=()=>(gs().goals||[]).filter(g=>g&&g.id);
function saveGoals(list){const d=gs();d.goals=list;ss(d);triggerSave();}
const dayNum=iso=>Math.round(new Date(iso+'T12:00:00').getTime()/86400000);
function linSlope(pts){
  const n=pts.length;if(n<2)return 0;
  const mx=pts.reduce((a,p)=>a+p.x,0)/n,my=pts.reduce((a,p)=>a+p.y,0)/n;
  let num=0,den=0;pts.forEach(p=>{num+=(p.x-mx)*(p.y-my);den+=(p.x-mx)*(p.x-mx);});
  return den?num/den:0;
}
/* charge max par séance pour un exercice : [{date,w}] */
function liftSeries(exId){
  const d=gs(),pts=[];
  Object.keys(d.workouts||{}).sort().forEach(k=>{
    let m=0;((d.workouts[k]&&d.workouts[k][exId])||[]).forEach(x=>{if(x&&x.done){const w=parseFloat(x.weight)||0;if(w>m)m=w;}});
    if(m>0)pts.push({date:k,w:m});
  });
  return pts;
}
function goalCurrent(g){
  if(g.type==='weight'){const log=getWeightLog();return log.length?log[log.length-1].kg:null;}
  const pr=getPRs()[g.exId];
  return Math.max(pr?pr.weight:0,...liftSeries(g.exId).map(p=>p.w),0);
}
function goalProgress(g){
  const cur=goalCurrent(g);
  if(cur==null)return{cur:null,pct:0,done:false};
  const start=g.start,tgt=g.target;
  if(g.type==='weight'){
    const dir=tgt<start?-1:1,done=dir<0?cur<=tgt:cur>=tgt,span=Math.abs(tgt-start)||1;
    return{cur,dir,done,pct:done?100:Math.max(0,Math.min(100,(dir<0?start-cur:cur-start)/span*100))};
  }
  const done=cur>=tgt,span=tgt-start;
  return{cur,done,pct:done?100:(span>0?Math.max(0,Math.min(100,(cur-start)/span*100)):0)};
}
/* estimation de la date d'arrivée par régression linéaire sur les mesures récentes */
function goalEta(g,pr){
  if(pr.done)return{kind:'done'};
  const today=dayNum(todayKey());
  let pts=[],minSpan=14;
  if(g.type==='weight'){
    pts=getWeightLog().filter(e=>dayNum(e.date)>=today-90).map(e=>({x:dayNum(e.date),y:e.kg}));minSpan=7;
  }else{
    let run=0;
    pts=liftSeries(g.exId).filter(p=>dayNum(p.date)>=today-120).map(p=>{run=Math.max(run,p.w);return{x:dayNum(p.date),y:run};});
  }
  if(pts.length<(g.type==='weight'?2:3)||pts[pts.length-1].x-pts[0].x<minSpan)return{kind:'nodata'};
  const slope=linSlope(pts);
  if(g.type==='weight'){
    if(pr.dir<0?slope>=-0.005:slope<=0.005)return{kind:slope===0?'stalled':'wrong'};
  }else if(slope<=0.01)return{kind:'stalled'};
  const days=(g.target-pr.cur)/slope;
  if(!(days>0))return{kind:'stalled'};
  if(days>730)return{kind:'far'};
  const dt=new Date();dt.setHours(12,0,0,0);dt.setDate(dt.getDate()+Math.ceil(days));
  return{kind:'date',date:dateToKey(dt),days:Math.ceil(days),rate:slope*7};
}
function etaText(g,pr,eta){
  const dfmt=k=>new Date(k+'T12:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'short',year:'numeric'});
  switch(eta.kind){
    case 'done':return 'Atteint le '+dfmt(g.achievedAt||todayKey());
    case 'date':{
      const when=eta.days<14?`dans ${eta.days} j`:`dans ${Math.round(eta.days/7)} sem.`;
      return `≈ ${dfmt(eta.date)} · ${when} · ${eta.rate>0?'+':'−'}${fmtKg(Math.abs(eta.rate))} kg/sem.`;
    }
    case 'far':return 'Au rythme actuel : plus de 2 ans';
    case 'stalled':return 'Progression à l\'arrêt : pas d\'estimation';
    case 'wrong':return 'Tendance opposée à l\'objectif';
    default:return g.type==='weight'?'Ajoute des pesées pour estimer la date':'Pas assez de séances pour estimer la date';
  }
}
function goalName(g){return g.type==='weight'?'Poids de corps':findExName(g.exId);}
function goalsCardHtml(){
  const goals=getGoals();
  const rows=goals.map(g=>{
    const pr=goalProgress(g),eta=goalEta(g,pr);
    const cur=pr.cur==null?'—':fmtKg(pr.cur);
    return `<div class="goal-row${pr.done?' done':''}" onclick="openGoalModal('${g.id}')" role="button" tabindex="0">
      <div class="goal-top"><span class="goal-name">${pr.done?ic('check'):''}${escA(goalName(g))}</span><span class="goal-val">${cur} <i>→</i> ${fmtKg(g.target)} kg</span></div>
      <div class="goal-bar"><i style="width:${Math.round(pr.pct)}%"></i></div>
      <div class="goal-meta"><span>${Math.round(pr.pct)} %</span><span>${escA(etaText(g,pr,eta))}</span></div></div>`;
  }).join('');
  return `<div class="stitle">Objectifs</div>
    ${rows||`<div class="empty" style="padding:10px 0 16px">Fixe-toi une cible (« squat 100 kg », poids de corps…)<br>et suis ta progression jusqu'à l'estimation d'arrivée.</div>`}
    <button class="btn-calc goal-add" onclick="openGoalModal()">${ic('plus')} Ajouter un objectif</button>`;
}
function refreshGoalsCard(){const el=document.getElementById('goalsCard');if(el)el.innerHTML=goalsCardHtml();}
function checkGoalsAchieved(){
  const goals=getGoals();let changed=false;
  goals.forEach(g=>{
    if(g.achievedAt)return;
    if(goalProgress(g).done){g.achievedAt=todayKey();changed=true;showToast('Objectif atteint : '+goalName(g)+' '+fmtKg(g.target)+' kg !');}
  });
  if(changed){saveGoals(goals);refreshGoalsCard();}
}
let _goal={id:null,type:'lift',exId:'',target:''},_goalDel=false;
function openGoalModal(id){
  closeModal();
  const g=id?getGoals().find(x=>x.id===id):null;
  _goal=g?{id:g.id,type:g.type,exId:g.exId||'',target:String(g.target)}:{id:null,type:'lift',exId:'',target:''};
  _goalDel=false;
  document.body.insertAdjacentHTML('beforeend',`<div class="modal-overlay" id="goalModal" onclick="if(event.target.id==='goalModal')closeModal()"><div class="modal-box" id="goalBox"></div></div>`);
  renderGoalModal();
}
function renderGoalModal(){
  const box=document.getElementById('goalBox');if(!box)return;
  const edit=!!_goal.id;
  const exOpts=getAllExercises().map(e=>`<option value="${e.id}"${e.id===_goal.exId?' selected':''}>${escA(e.name)}</option>`).join('');
  const typeChips=edit?'':`<div class="ed-chips"><button class="ed-chip${_goal.type==='lift'?' on':''}" onclick="goalType('lift')">Exercice</button><button class="ed-chip${_goal.type==='weight'?' on':''}" onclick="goalType('weight')">Poids de corps</button></div>`;
  let cur='';
  if(_goal.type==='weight'){const c=goalCurrent({type:'weight'});cur=c!=null?`Poids actuel : <b>${fmtKg(c)} kg</b>`:'Aucune pesée enregistrée : ajoute-en une dans Stats.';}
  else if(_goal.exId){cur=`Record actuel : <b>${fmtKg(goalCurrent({type:'lift',exId:_goal.exId}))} kg</b>`;}
  box.innerHTML=`<div class="modal-hdr"><div class="modal-title">${edit?'Modifier l\'objectif':'Nouvel objectif'}</div><button class="drawer-close" onclick="closeModal()" aria-label="Fermer">${ic('close')}</button></div>
    ${typeChips}
    ${_goal.type==='lift'?`<span class="set-lbl ed-lbl">EXERCICE</span><select class="si goal-sel" ${edit?'disabled':''} onchange="goalEx(this.value)"><option value="">Choisir…</option>${exOpts}</select>`:''}
    <div class="sum-sub" id="goalCur" style="margin:10px 0">${cur}</div>
    <span class="set-lbl ed-lbl">CIBLE (KG)</span>
    <input class="si goal-inp" id="goalTarget" type="number" inputmode="decimal" step="0.5" min="1" value="${escA(_goal.target)}" placeholder="100" oninput="_goal.target=this.value">
    <div style="display:flex;gap:10px;margin-top:20px">
      ${edit?`<button class="btn-danger" style="flex:1" onclick="goalDelete()">${_goalDel?'Confirmer':'Supprimer'}</button>`:`<button class="run-done-btn" style="flex:1;margin-top:0;background:none;border:1.5px solid var(--border);color:var(--muted)" onclick="closeModal()">Annuler</button>`}
      <button class="run-done-btn done" style="flex:1;margin-top:0" onclick="goalSave()">Enregistrer</button>
    </div>`;
}
function goalType(t){_goal.type=t;renderGoalModal();}
function goalEx(v){_goal.exId=v;const c=document.getElementById('goalCur');if(c)c.innerHTML=v?`Record actuel : <b>${fmtKg(goalCurrent({type:'lift',exId:v}))} kg</b>`:'';}
function goalSave(){
  const target=Math.round(parseFloat(String(_goal.target).replace(',','.'))*10)/10;
  if(!(target>0&&target<=1000)){showToast('Cible invalide');return;}
  const goals=getGoals();
  if(_goal.id){
    const g=goals.find(x=>x.id===_goal.id);
    if(g){g.target=target;delete g.achievedAt;if(goalProgress(g).done)g.achievedAt=todayKey();}
  }else{
    if(_goal.type==='lift'&&!_goal.exId){showToast('Choisis un exercice');return;}
    if(goals.some(g=>!g.achievedAt&&g.type===_goal.type&&(g.type==='weight'||g.exId===_goal.exId))){showToast('Un objectif existe déjà : modifie-le');return;}
    const g={id:'g_'+Date.now().toString(36),type:_goal.type,exId:_goal.type==='lift'?_goal.exId:undefined,target,startDate:todayKey()};
    const cur=goalCurrent(g);
    if(g.type==='weight'&&cur==null){showToast("Ajoute d'abord une pesée");return;}
    g.start=cur||0;
    if(g.type==='lift'&&cur>=target){showToast('Déjà atteint : choisis une cible plus haute');return;}
    if(g.type==='weight'&&cur===target){showToast('Tu y es déjà !');return;}
    goals.push(g);
  }
  saveGoals(goals);closeModal();refreshGoalsCard();showToast('Objectif enregistré');
}
function goalDelete(){
  if(!_goalDel){_goalDel=true;renderGoalModal();return;}
  saveGoals(getGoals().filter(g=>g.id!==_goal.id));
  closeModal();refreshGoalsCard();showToast('Objectif supprimé');
}

/* ============================================================
   VOLUME HEBDOMADAIRE PAR MUSCLE (séries de travail / semaine)
   Le 1er muscle d'un exercice compte une série entière, les suivants une demi-série ; l'échauffement n'est pas compté.
   « Prévu » = séries restantes du programme jusqu'à dimanche.
   ============================================================ */
const VOL_DEFAULT=[10,20];
const fmtSets=n=>(Math.round(n*2)/2).toLocaleString('fr-FR',{maximumFractionDigits:1});
function getVolTargets(){
  const t=(gs().prefs||{}).volTargets||{},out={};
  MUSCLE_KEYS.forEach(k=>{const v=t[k];out[k]=(Array.isArray(v)&&v.length===2&&v[0]>=0&&v[1]>=v[0])?[+v[0],+v[1]]:VOL_DEFAULT.slice();});
  return out;
}
function weekMonday(off){
  const t=new Date();t.setHours(0,0,0,0);
  t.setDate(t.getDate()-((t.getDay()+6)%7)+off*7);
  return t;
}
function weekVolume(off){
  const mon=weekMonday(off),today=todayKey(),d=gs();
  const actual={},planned={};MUSCLE_KEYS.forEach(k=>{actual[k]=0;planned[k]=0;});
  const add=(obj,def,n)=>{
    if(!def||def.type==='echauffement'||n<=0)return;
    (def.muscles||[]).forEach((m,i)=>{if(MUSCLE_KEYS.includes(m))obj[m]+=n*(i===0?1:0.5);});
  };
  for(let i=0;i<7;i++){
    const dt=new Date(mon);dt.setDate(mon.getDate()+i);
    const k=dateToKey(dt),day=(d.workouts&&d.workouts[k])||{};
    Object.keys(day).forEach(id=>add(actual,findExDef(id),(day[id]||[]).filter(x=>x&&x.done).length));
    if(off===0&&k>=today){
      const {prog}=getEffectiveDayProgram(k);
      if(prog&&prog.type!=='rest')dayExercises(k,prog).forEach(ex=>{
        if(isSkipped(k,ex.id))return;
        let rem=0;for(let n=0;n<ex.sets;n++)if(!getSet(k,ex.id,n).done)rem++;
        add(planned,ex,rem);
      });
    }
  }
  return{actual,planned,mon};
}
let _volOff=0;
function volumeCardHtml(){
  const {actual,planned,mon}=weekVolume(_volOff),T=getVolTargets();
  const proj=k=>actual[k]+planned[k];
  const scale=Math.max(...MUSCLE_KEYS.map(k=>Math.max(T[k][1]*1.25,proj(k))),1);
  const pc=v=>Math.min(100,v/scale*100);
  const rows=MUSCLE_KEYS.map((k,i)=>{
    const [lo,hi]=T[k],a=actual[k],pl=planned[k];
    const cls=a<lo?'under':(a>hi?'over':'in');
    return `<div class="vol-row"><span class="vol-name">${MUSCLE_LABELS[i]}</span>
      <div class="vol-bar"><div class="vol-zone" style="left:${pc(lo)}%;width:${pc(hi)-pc(lo)}%"></div><div class="vol-fill ${cls}" style="width:${pc(a)}%"></div>${pl>0?`<div class="vol-plan" style="left:${pc(a)}%;width:${Math.min(pc(a+pl),100)-pc(a)}%"></div>`:''}</div>
      <span class="vol-val"><b>${fmtSets(a)}</b>${pl>0?`<em>+${fmtSets(pl)}</em>`:''}<small>/ ${lo}–${hi}</small></span></div>`;
  }).join('');
  let note;
  if(_volOff===0){
    const low=MUSCLE_KEYS.map((k,i)=>({k,n:MUSCLE_LABELS[i]})).filter(x=>proj(x.k)<T[x.k][0]);
    note=low.length?`Avec les séances prévues, <b>${low.map(x=>x.n).join(', ')}</b> resteront sous l'objectif minimum.`:'Avec les séances prévues, tous les muscles atteindront leur objectif minimum.';
  }else{
    const ok=MUSCLE_KEYS.filter(k=>actual[k]>=T[k][0]&&actual[k]<=T[k][1]).length;
    note=`${ok} muscle${ok>1?'s':''} sur 7 dans la zone cible cette semaine-là.`;
  }
  const title=_volOff===0?'Cette semaine':'Semaine du '+fmtDateShort(dateToKey(mon));
  return `<div class="vol-head"><div class="stitle" style="margin:0">Volume hebdo</div>
      <div class="vol-nav"><button onclick="volWeek(-1)" aria-label="Semaine précédente">${ic('back')}</button><span>${title}</span><button onclick="volWeek(1)" aria-label="Semaine suivante" ${_volOff>=0?'disabled':''}>${ic('chev')}</button></div></div>
    <div class="vol-rows">${rows}</div>
    <div class="vol-note">${note}</div>
    <div class="vol-legend"><span class="vol-zone-key"></span> zone cible (séries / semaine) · <span class="vol-plan-key"></span> prévu au programme
      <button class="vol-edit" onclick="openVolModal()">Régler les objectifs</button></div>`;
}
function refreshVolumeCard(){const el=document.getElementById('volumeCard');if(el)el.innerHTML=volumeCardHtml();}
function volWeek(dir){_volOff=Math.min(0,Math.max(-26,_volOff+dir));refreshVolumeCard();}
function openVolModal(){
  closeModal();
  const T=getVolTargets();
  document.body.insertAdjacentHTML('beforeend',`<div class="modal-overlay" id="volModal" onclick="if(event.target.id==='volModal')closeModal()"><div class="modal-box">
    <div class="modal-hdr"><div class="modal-title">Objectifs de volume</div><button class="drawer-close" onclick="closeModal()" aria-label="Fermer">${ic('close')}</button></div>
    <div class="sum-sub" style="margin-top:6px">Séries de travail par semaine et par muscle (10 à 20 est une fourchette courante pour progresser).</div>
    <div class="vol-edit-rows">${MUSCLE_KEYS.map((k,i)=>`<div class="vol-edit-row"><span>${MUSCLE_LABELS[i]}</span>
      <input class="si" id="vmin-${k}" type="number" inputmode="numeric" min="0" max="60" value="${T[k][0]}" aria-label="${MUSCLE_LABELS[i]} minimum"><em>à</em>
      <input class="si" id="vmax-${k}" type="number" inputmode="numeric" min="0" max="80" value="${T[k][1]}" aria-label="${MUSCLE_LABELS[i]} maximum"></div>`).join('')}</div>
    <div style="display:flex;gap:10px;margin-top:18px">
      <button class="run-done-btn" style="flex:1;margin-top:0;background:none;border:1.5px solid var(--border);color:var(--muted)" onclick="resetVolTargets()">Par défaut</button>
      <button class="run-done-btn done" style="flex:1;margin-top:0" onclick="saveVolTargets()">Enregistrer</button>
    </div></div></div>`);
}
function saveVolTargets(){
  const t={};
  for(const k of MUSCLE_KEYS){
    const lo=parseInt(document.getElementById('vmin-'+k).value),hi=parseInt(document.getElementById('vmax-'+k).value);
    if(!(lo>=0&&hi>=lo)){showToast('Minimum ≤ maximum pour chaque muscle');return;}
    t[k]=[lo,hi];
  }
  const d=gs();d.prefs=Object.assign({},d.prefs||{});d.prefs.volTargets=t;ss(d);triggerSave();
  closeModal();refreshVolumeCard();showToast('Objectifs de volume enregistrés');
}
function resetVolTargets(){
  const d=gs();d.prefs=Object.assign({},d.prefs||{});delete d.prefs.volTargets;ss(d);
  closeModal();refreshVolumeCard();showToast('Objectifs par défaut rétablis');
}

/* ---------- Éditeur : sorties running ---------- */
function edRunSectionHtml(){
  const cfg=_progCfg;
  const opts=sel=>`<option value="">Aucune</option>`+cfg.runOrder.map(o=>`<option value="${o}"${o===sel?' selected':''}>${escA(cfg.runs[o].name)}</option>`).join('');
  const days=DAYS_ORDER.map(d=>`<div class="ed-day"><span class="ed-day-n">${DAY_LABELS[d]}</span><select class="si ed-sel" aria-label="Sortie du ${DAY_LABELS[d]}" onchange="edRunSetDay('${d}',this.value)">${opts(cfg.runWeekly[d])}</select></div>`).join('');
  const list=cfg.runOrder.map(k=>{
    const r=cfg.runs[k];
    const tg=[r.targetDistance?fmtKm(r.targetDistance)+' km':'',r.targetDuration?r.targetDuration+' min':'',r.targetPace?fmtPace(r.targetPace)+' /km':''].filter(Boolean).join(' · ');
    return `<div class="prog-pick-item ed-prog" onclick="edOpenRun('${k}')"><span class="prog-pick-icon" style="--c:var(--c-blue)"></span>
      <div class="prog-pick-info"><div class="prog-pick-name">${escA(r.name)}</div><div class="prog-pick-meta">${tg||'Sans objectif'}</div></div>${ic('chev')}</div>`;
  }).join('');
  return `<div class="stitle" style="margin-top:22px">Course à pied</div>
    <div class="ed-hint">Choisis les jours de sortie (en plus de la salle) et personnalise chaque type de sortie.</div>
    <div class="card ed-days" style="margin-top:10px">${days}</div>
    <div class="card ed-card"><span class="set-lbl ed-lbl">OBJECTIF DE DISTANCE PAR SEMAINE (KM, OPTIONNEL)</span>
      <input class="si" type="number" inputmode="decimal" min="0" max="500" step="0.5" value="${cfg.weeklyKm||''}" placeholder="ex. 20" onchange="edWeeklyKm(this.value)" aria-label="Objectif de distance hebdomadaire"></div>
    <div class="stitle">Types de sorties</div>
    <div class="ed-list">${list||'<div class="empty">Aucun type de sortie.</div>'}</div>
    <button class="btn-calc ed-add" onclick="edNewRun()">${ic('plus')} Nouvelle sortie</button>`;
}
function edRunSetDay(d,id){_progCfg.runWeekly[d]=_progCfg.runs[id]?id:'';edSave();}
function edWeeklyKm(v){_progCfg.weeklyKm=numIn(v,0,500);edSave();}
function edNewRun(){
  const key='r_'+Date.now().toString(36);
  _progCfg.runs[key]={name:'Nouvelle sortie',desc:'',detail:'',targetDistance:0,targetDuration:0,targetPace:0};
  _progCfg.runOrder.push(key);
  edSave();edOpenRun(key);
  const inp=document.getElementById('edRunName');if(inp){inp.focus();inp.select();}
}
function edOpenRun(k){
  if(!_progCfg.runs[k])return;
  _ed.view='run';_ed.runKey=k;edRender();
  const body=document.getElementById('edBody');if(body)body.scrollTop=0;
}
function edRunHtml(){
  const r=_progCfg.runs[_ed.runKey];
  return `<div class="card ed-card">
      <span class="set-lbl ed-lbl">NOM DE LA SORTIE</span>
      <input class="ex-note-inp" id="edRunName" type="text" maxlength="40" value="${escA(r.name)}" onchange="edRunField('name',this.value)" autocomplete="off">
      <span class="set-lbl ed-lbl">DESCRIPTION</span>
      <input class="ex-note-inp" type="text" maxlength="240" value="${escA(r.desc)}" placeholder="But de la sortie" onchange="edRunField('desc',this.value)">
      <span class="set-lbl ed-lbl">DÉROULÉ</span>
      <input class="ex-note-inp" type="text" maxlength="240" value="${escA(r.detail)}" placeholder="ex. 10 min échauffement · 5 × 1 km · retour au calme" onchange="edRunField('detail',this.value)">
      <span class="set-lbl ed-lbl">OBJECTIFS (OPTIONNELS)</span>
      <div class="ed-grid">
        <div class="input-col"><span class="set-lbl">DISTANCE (KM)</span><input class="si" type="number" inputmode="decimal" step="0.1" min="0" value="${r.targetDistance||''}" placeholder="—" onchange="edRunField('targetDistance',this.value)"></div>
        <div class="input-col"><span class="set-lbl">DURÉE (MIN)</span><input class="si" type="number" inputmode="numeric" min="0" value="${r.targetDuration||''}" placeholder="—" onchange="edRunField('targetDuration',this.value)"></div>
        <div class="input-col"><span class="set-lbl">ALLURE /KM</span><input class="si" type="text" inputmode="numeric" value="${r.targetPace?fmtPace(r.targetPace):''}" placeholder="5:30" onchange="edRunField('targetPace',this.value)"></div>
      </div>
    </div>
    <div class="ed-hint">Les objectifs s'affichent sur la carte de la sortie, dans le planning, et sont comparés à ton résultat.</div>
    <button class="btn-danger ed-delprog" onclick="edConfirmDelRun()">Supprimer cette sortie</button>`;
}
function edRunField(f,v){
  const r=_progCfg.runs[_ed.runKey];if(!r)return;
  if(f==='name'){
    const n=cleanName(v);
    if(!n){showToast('Le nom ne peut pas être vide');const i=document.getElementById('edRunName');if(i)i.value=r.name;return;}
    r.name=n;const t=document.getElementById('edTitle');if(t)t.textContent=n;
  }else if(f==='desc'||f==='detail')r[f]=txtClean(v,240);
  else if(f==='targetPace'){r.targetPace=numIn(parsePace(v),0,1800);edSave();edRender();return;}
  else r[f]=numIn(v,0,f==='targetDistance'?200:600);
  edSave();
}
function edConfirmDelRun(){
  edConfirm('Supprimer la sortie ?',`« ${escA(_progCfg.runs[_ed.runKey].name)} » sera retirée de ton planning. Tes sorties déjà enregistrées sont conservées.`,'Supprimer','edDoDelRun');
}
function edDoDelRun(){
  const k=_ed.runKey;
  delete _progCfg.runs[k];
  _progCfg.runOrder=_progCfg.runOrder.filter(x=>x!==k);
  DAYS_ORDER.forEach(d=>{if(_progCfg.runWeekly[d]===k)_progCfg.runWeekly[d]='';});
  edSave();closeModal();
  _ed.view='home';_ed.runKey=null;edRender();showToast('Sortie supprimée');
}

/* ============================================================
   FUSION DE SAUVEGARDES · BANDEAU DE SAUVEGARDE · STOCKAGE PERSISTANT · DIAGNOSTIC
   ============================================================ */
const hasDoneSets=day=>Object.values(day||{}).some(a=>Array.isArray(a)&&a.some(x=>x&&x.done));
const doneOf=a=>(Array.isArray(a)?a:[]).filter(x=>x&&x.done).length;
const clone=o=>JSON.parse(JSON.stringify(o));
/* Fusionne deux jeux de données sans rien supprimer ; local reste prioritaire pour le programme, le profil et les réglages */
function mergeBackup(local,incoming){
  const out=clone(local||{}),src=clone(incoming||{});
  const stats={newSessions:0,newWeights:0,newRuns:0,newPRs:0,newGoals:0,runs:0};
  /* séances */
  out.workouts=out.workouts||{};
  Object.keys(src.workouts||{}).forEach(k=>{
    const sd=src.workouts[k]||{},od=out.workouts[k];
    if(!od){out.workouts[k]=sd;if(hasDoneSets(sd))stats.newSessions++;return;}
    Object.keys(sd).forEach(id=>{if(!od[id]||doneOf(sd[id])>doneOf(od[id]))od[id]=sd[id];});
  });
  /* records : le meilleur de chaque exercice */
  out.prs=out.prs||{};
  Object.keys(src.prs||{}).forEach(id=>{
    const a=out.prs[id],b=src.prs[id];
    if(!a||b.weight>a.weight||(b.weight===a.weight&&(b.reps||0)>(a.reps||0))){out.prs[id]=b;stats.newPRs++;}
  });
  out.activeDays=Array.from(new Set([...(out.activeDays||[]),...(src.activeDays||[])])).sort();
  /* sorties running */
  out.runLogs=out.runLogs||{};
  const runScore=r=>(r&&r.done?100:0)+['duration','distance','rpe'].filter(f=>r&&r[f]).length;
  Object.keys(src.runLogs||{}).forEach(k=>{
    if(src.runLogs[k]&&src.runLogs[k].done)stats.runs++;
    if(!out.runLogs[k]){out.runLogs[k]=src.runLogs[k];if(src.runLogs[k]&&src.runLogs[k].done)stats.newRuns++;}
    else if(runScore(src.runLogs[k])>runScore(out.runLogs[k]))out.runLogs[k]=src.runLogs[k];
  });
  /* notes d'exercice, forme du jour, programme du jour, sauts, ordre, remplacements : le local gagne, sinon on prend le fichier */
  ['exNotes','swaps'].forEach(key=>{
    out[key]=out[key]||{};
    Object.keys(src[key]||{}).forEach(k=>{
      if(!out[key][k])out[key][k]=src[key][k];
      else Object.keys(src[key][k]||{}).forEach(id=>{if(!out[key][k][id])out[key][k][id]=src[key][k][id];});
    });
  });
  ['readiness','dayProgram','dayOrder'].forEach(key=>{
    out[key]=out[key]||{};
    Object.keys(src[key]||{}).forEach(k=>{if(out[key][k]==null)out[key][k]=src[key][k];});
  });
  out.skipped=out.skipped||{};
  Object.keys(src.skipped||{}).forEach(k=>{out.skipped[k]=Array.from(new Set([...(out.skipped[k]||[]),...src.skipped[k]]));});
  /* métadonnées de séance */
  out.sessionMeta=out.sessionMeta||{};
  Object.keys(src.sessionMeta||{}).forEach(k=>{
    const a=out.sessionMeta[k],b=src.sessionMeta[k];
    if(!a){out.sessionMeta[k]=b;return;}
    a.ms=Math.max(a.ms||0,b.ms||0);
    if(b.start&&(!a.start||b.start<a.start))a.start=b.start;
    if(b.last&&(!a.last||b.last>a.last))a.last=b.last;
    if(!a.prog&&b.prog)a.prog=b.prog;
    if(!a.note&&b.note)a.note=b.note;
    if(b.summaryShown)a.summaryShown=true;
    const prs=Object.fromEntries((a.prs||[]).map(x=>[x.id,x]));
    (b.prs||[]).forEach(x=>{if(!prs[x.id]||x.w>prs[x.id].w)prs[x.id]=x;});
    if(Object.keys(prs).length)a.prs=Object.values(prs);
  });
  /* poids de corps */
  const wl=Object.fromEntries((out.weightLog||[]).map(e=>[e.date,e]));
  (src.weightLog||[]).forEach(e=>{if(e&&e.date&&!wl[e.date]){wl[e.date]=e;stats.newWeights++;}});
  out.weightLog=Object.values(wl).sort((a,b)=>a.date<b.date?-1:1);
  if(out.weightLog.length)out.bodyWeight=out.weightLog[out.weightLog.length-1].kg;
  /* objectifs */
  const goals=Object.fromEntries((out.goals||[]).map(g=>[g.id,g]));
  (src.goals||[]).forEach(g=>{
    if(!goals[g.id]){goals[g.id]=g;stats.newGoals++;}
    else if(g.achievedAt&&!goals[g.id].achievedAt)goals[g.id].achievedAt=g.achievedAt;
  });
  if(Object.keys(goals).length)out.goals=Object.values(goals);
  /* noms et définitions d'exercices */
  ['exNames','exDefs'].forEach(key=>{out[key]=Object.assign({},src[key]||{},out[key]||{});});
  /* profil, programme, réglages : cet appareil prime ; on reprend le fichier si l'appareil n'a rien */
  if(!out.program&&src.program)out.program=src.program;
  if(!out.prefs&&src.prefs)out.prefs=src.prefs;
  if(!out.profile&&src.profile)out.profile=src.profile;
  else if(out.profile&&src.profile&&src.profile.since&&(!out.profile.since||src.profile.since<out.profile.since))out.profile.since=src.profile.since;
  if(!out.age&&src.age)out.age=src.age;
  Object.keys(src).forEach(k=>{if(!(k in out))out[k]=src[k];});
  return{data:out,stats};
}

/* ---------- Bandeau « pense à sauvegarder » ---------- */
function backupDue(){
  const d=gs(),sessions=getSessionDates();
  if(sessions.length<3)return null;
  if(Date.now()<((d.prefs||{}).backupSnooze||0))return null;
  if(d.lastBackup){const days=Math.floor((Date.now()-d.lastBackup)/864e5);return days>=30?{days}:null;}
  return dayNum(todayKey())-dayNum(sessions[sessions.length-1])>=7?{days:null}:null;
}
function renderBackupBanner(){
  let el=document.getElementById('backupBanner');
  if(!el){
    el=document.createElement('div');el.id='backupBanner';
    const hdr=document.querySelector('.hdr');
    if(hdr&&hdr.parentNode)hdr.parentNode.insertBefore(el,hdr.nextSibling);else document.body.prepend(el);
  }
  const due=backupDue();
  if(!due){el.innerHTML='';el.className='';return;}
  el.className='bk-banner';
  el.innerHTML=`<div class="bk-banner-tx"><b>Pense à sauvegarder tes données</b><span>${due.days!=null?`Dernière sauvegarde il y a ${due.days} jours. `:'Tu n\'as encore jamais sauvegardé. '}Elles ne sont que sur cet appareil.</span></div>
    <button class="bk-banner-btn" onclick="exportData()">Sauvegarder</button>
    <button class="bk-banner-x" onclick="snoozeBackup()" aria-label="Me le rappeler plus tard">${ic('close')}</button>`;
}
function snoozeBackup(){
  const d=gs();d.prefs=Object.assign({},d.prefs||{});d.prefs.backupSnooze=Date.now()+7*864e5;ss(d);
  renderBackupBanner();showToast('Rappel repoussé de 7 jours');
}
/* Demande de stockage persistant (évite l'effacement automatique par le navigateur) une fois l'appli réellement utilisée */
function maybeRequestPersist(){
  try{
    if(!navigator.storage||!navigator.storage.persist||getSessionDates().length<3)return;
    const d=gs();if((d.prefs||{}).persistAsked)return;
    d.prefs=Object.assign({},d.prefs||{});d.prefs.persistAsked=true;ss(d);
    navigator.storage.persisted().then(p=>{if(!p)navigator.storage.persist();}).catch(()=>{});
  }catch(e){}
}

/* ---------- Diagnostic de l'appareil ---------- */
async function runDiagnostic(){
  const rows=[];
  const add=(label,status,detail,action)=>rows.push({label,status,detail,action});
  const standalone=(window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone===true;
  add('Connexion sécurisée (HTTPS)',window.isSecureContext?'ok':'ko',window.isSecureContext?'Requise pour l\'installation, le mode hors ligne et les notifications.':'Sers l\'appli en HTTPS (ou localhost) : sans cela, ni service worker ni notifications.');
  add('Appli installée',standalone?'ok':'warn',standalone?'Lancée comme une appli.':'Ouverte dans le navigateur : ajoute-la à l\'écran d\'accueil pour un affichage plein écran.');
  let swState='ko',swDetail='Service worker indisponible.';
  if('serviceWorker' in navigator){
    try{const reg=await navigator.serviceWorker.getRegistration();swState=reg&&reg.active?'ok':'warn';swDetail=reg&&reg.active?'Actif'+(navigator.serviceWorker.controller?'.':' (actif au prochain chargement).'):'Pas encore actif : recharge la page.';}catch(e){}
  }
  add('Service worker',swState,swDetail);
  let offline='warn',offDetail='Non vérifié.';
  try{if('caches' in window){const hit=await caches.match(new URL('./index.html',document.baseURI).href);offline=hit?'ok':'warn';offDetail=hit?'Les fichiers de l\'appli sont en cache : elle s\'ouvre sans réseau.':'Fichiers pas encore en cache : ouvre l\'appli une fois avec du réseau.';}else{offline='ko';offDetail='Cache indisponible (HTTPS requis).';}}catch(e){}
  add('Fonctionnement hors ligne',offline,offDetail);
  let persisted=null,est=null;
  try{if(navigator.storage&&navigator.storage.persisted)persisted=await navigator.storage.persisted();if(navigator.storage&&navigator.storage.estimate)est=await navigator.storage.estimate();}catch(e){}
  add('Stockage protégé',persisted?'ok':(persisted===false?'warn':'ko'),persisted?'Le navigateur ne supprimera pas tes données automatiquement.':(persisted===false?'Le navigateur peut effacer les données en cas de manque de place : sauvegarde régulièrement.':'Non pris en charge.'),persisted===false?{label:'Demander la protection',fn:'diagPersist()'}:null);
  if(est&&est.usage!=null)add('Espace utilisé',(est.quota&&est.usage/est.quota>0.8)?'warn':'ok',`${(est.usage/1048576).toFixed(1).replace('.',',')} Mo${est.quota?' sur '+Math.round(est.quota/1048576).toLocaleString('fr-FR')+' Mo disponibles':''}.`);
  const perm='Notification' in window?Notification.permission:'indisponible';
  add('Notifications',perm==='granted'?'ok':(perm==='denied'?'ko':'warn'),perm==='granted'?'Autorisées.':(perm==='denied'?'Bloquées : à réactiver dans les réglages du site.':(perm==='default'?'Pas encore autorisées (active les rappels dans Profil).':'Non prises en charge par ce navigateur.')),perm==='granted'?{label:'Tester',fn:'testReminder()'}:null);
  let bg='warn',bgDetail='Non pris en charge : les rappels n\'arrivent que tant que l\'appli est ouverte.';
  try{const reg=await navigator.serviceWorker.ready;if('periodicSync' in reg){const st=await navigator.permissions.query({name:'periodic-background-sync'});bg=st.state==='granted'?'ok':'warn';bgDetail=st.state==='granted'?'Disponible : les rappels peuvent partir appli fermée.':'Pris en charge mais non accordé (installe l\'appli et utilise-la régulièrement).';}}catch(e){}
  add('Rappels en arrière-plan',bg,bgDetail);
  add('Écran allumé pendant le repos','wakeLock' in navigator?'ok':'warn','wakeLock' in navigator?'Pris en charge.':'Non pris en charge : l\'écran peut se verrouiller pendant le repos.',('wakeLock' in navigator)?{label:'Tester 3 s',fn:'testWakeLock()'}:null);
  const AC=window.AudioContext||window.webkitAudioContext;
  add('Son de fin de repos',AC?'ok':'ko',AC?'Web Audio disponible (le son démarre après un premier toucher).':'Son indisponible.',AC?{label:'Tester',fn:'testTimerAlert()'}:null);
  add('Vibration',navigator.vibrate?'ok':'warn',navigator.vibrate?'Disponible.':'Non prise en charge (ex. Safari iPhone).',navigator.vibrate?{label:'Tester',fn:'testTimerAlert()'}:null);
  let share=false;try{const f=new File(['x'],'t.json',{type:'application/json'});share=!!(navigator.canShare&&navigator.canShare({files:[f]}));}catch(e){}
  add('Partage de fichier (sauvegarde)',share?'ok':'warn',share?'La sauvegarde passe par la feuille de partage.':'Téléchargement direct du fichier.');
  const due=backupDue(),last=gs().lastBackup;
  add('Sauvegarde',last&&!due?'ok':'warn',backupLabel());
  return rows;
}
async function openDiagnostic(){
  closeModal();
  document.body.insertAdjacentHTML('beforeend',`<div class="modal-overlay" id="diagModal" onclick="if(event.target.id==='diagModal')closeModal()"><div class="modal-box" id="diagBox">
    <div class="modal-hdr"><div class="modal-title">Diagnostic de l'appareil</div><button class="drawer-close" onclick="closeModal()" aria-label="Fermer">${ic('close')}</button></div>
    <div class="sum-sub" style="margin-top:6px">Vérification en cours…</div></div></div>`);
  const rows=await runDiagnostic();
  const box=document.getElementById('diagBox');if(!box)return;
  const sym={ok:ic('check'),warn:'!',ko:ic('close')};
  box.innerHTML=`<div class="modal-hdr"><div class="modal-title">Diagnostic de l'appareil</div><button class="drawer-close" onclick="closeModal()" aria-label="Fermer">${ic('close')}</button></div>
    <div class="diag-list">${rows.map(r=>`<div class="diag-row ${r.status}"><span class="diag-ic">${sym[r.status]}</span><div class="diag-tx"><b>${escA(r.label)}</b><span>${escA(r.detail)}</span></div>${r.action?`<button class="diag-btn" onclick="${r.action.fn}">${escA(r.action.label)}</button>`:''}</div>`).join('')}</div>
    <button class="run-done-btn" style="margin-top:14px;background:none;border:1.5px solid var(--border);color:var(--muted)" onclick="openDiagnostic()">Relancer</button>`;
}
async function testWakeLock(){
  try{const l=await navigator.wakeLock.request('screen');showToast('Écran maintenu allumé (3 s)');setTimeout(()=>l.release().catch(()=>{}),3000);}
  catch(e){showToast('Impossible de garder l\'écran allumé');}
}
async function diagPersist(){
  try{const ok=await navigator.storage.persist();showToast(ok?'Stockage protégé':'Le navigateur a refusé la protection');}catch(e){showToast('Non pris en charge');}
  openDiagnostic();
}

const TABS=['today','week','stats','cardio','profile'];
function switchTab(name){
  TABS.forEach(t=>{
    document.getElementById('tab-'+t).classList.toggle('active',t===name);
    document.getElementById('nav-'+t).classList.toggle('on',t===name);
  });
  if(name==='stats')renderStats();
  if(name==='week')renderWeek();
  if(name==='cardio')renderCardio();
  if(name==='profile'){renderProfile();updateReminderStatus();}
  window.scrollTo({top:0,behavior:'smooth'});
}

function init(){
  const d=gs();
  if(!d.profile||!d.profile.since){
    const prof=getProfile();
    if(!prof.since)saveProfile({since:todayKey()});
  }
  migrateWeightLog();
  renderToday();
  renderWeek();
  updateStreak();
  updateReg();
  restoreTimer();
  handleHash();
  window.addEventListener('hashchange',handleHash);
  renderBackupBanner();
  setTimeout(maybeRequestPersist,3000);
  startReminderLoop();

  document.addEventListener('pointerdown',function(e){
    const pop=document.getElementById('prPopup');
    if(pop&&pop.classList.contains('show')&&!pop.contains(e.target)){
      pop.classList.remove('show');
      clearTimeout(_prTimer);
    }
  });
}

init();