const ICONS={
  check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  close:'<path d="M6 6l12 12M18 6L6 18"/>',
  chev:'<path d="M9 6l6 6-6 6"/>',
  refresh:'<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>',
  undo:'<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>',
  star:'<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8 6.8 19.6l1-5.8L3.5 9.7l5.9-.8z"/>',
  dumbbell:'<path d="M6.5 7v10M17.5 7v10M3.5 9.5v5M20.5 9.5v5M6.5 12h11"/>',
  back:'<path d="M15 6l-6 6 6 6"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  up:'<path d="M6 14l6-6 6 6"/>',
  down:'<path d="M6 10l6 6 6-6"/>',
  trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12M9 7V4h6v3"/>',
  edit:'<path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17z"/><path d="M14.5 7.5l3 3"/>'
};
const ic=n=>`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]||''}</svg>`;
const EX_LUNDI = [
  {id:"dev_pec_echauff", name:"Développé couché (à vide)", sets:2, repsLabel:"15 reps", defaultReps:15, type:"echauffement", muscles:["pecs", "triceps"], restSec:60},
  {id:"tractions", name:"Tractions", sets:2, repsLabel:"Échec", defaultReps:10, type:"compound", muscles:["triceps"], restSec:120},
  {id:"dips", name:"Dips", sets:2, repsLabel:"Échec", defaultReps:10, type:"compound", muscles:["triceps"], restSec:120},
  {id:"dev_couche", name:"Développé couché", sets:4, repsLabel:"8-12 reps", defaultReps:10, type:"compound", muscles:["pecs"], restSec:120},
  {id:"pupitre_halteres", name:"Pupitre haltères", sets:4, repsLabel:"8-12 reps", defaultReps:10, type:"compound", muscles:["triceps"], restSec:120},
  {id:"bar_front", name:"Barre au front (EZ Bar)", sets:3, repsLabel:"10-12 reps", defaultReps:10, type:"isolation", muscles:["triceps"], restSec:90},
  {id:"curl_ez_bar", name:"Curl (EZ Bar)", sets:3, repsLabel:"12-15 reps", defaultReps:15, type:"isolation", muscles:["triceps"], restSec:90},
  {id:"dev_incline", name:"Développé incliné (haltères ou machine)", sets:3, repsLabel:"10-12 reps", defaultReps:10, type:"compound", muscles:["pecs"], restSec:120},
  {id:"ecarte_poulie_haute", name:"Écartés à la poulie haute", sets:3, repsLabel:"12-15 reps", defaultReps:15, type:"isolation", muscles:["pecs"], restSec:90},
  {id:"ext_triceps_poulie", name:"Extensions Triceps (Corde)", sets:3, repsLabel:"12-15 reps", defaultReps:15, type:"isolation", muscles:["triceps"], restSec:90},
  {id:"papillon_pecs", name:"Papillons Pecs", sets:3, repsLabel:"10-12 reps", defaultReps:10, type:"isolation", muscles:["pecs"], restSec:120},
  {id:"pompes", name:"Pompes", sets:3, repsLabel:"10-12 reps", defaultReps:10, type:"isolation", muscles:["pecs"], restSec:90},
];

const EX_MARDI = [
  {id:"tractions", name:"Tractions", sets:2, repsLabel:"Échec", defaultReps:10, type:"compound", muscles:["triceps"], restSec:120},
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
  {id:"tractions", name:"Tractions", sets:2, repsLabel:"Échec", defaultReps:10, type:"compound", muscles:["triceps"], restSec:120},
  {id:"dips", name:"Dips", sets:2, repsLabel:"Échec", defaultReps:10, type:"compound", muscles:["triceps"], restSec:120},
  {id:"dev_couche", name:"Développé couché", sets:4, repsLabel:"8-12 reps", defaultReps:10, type:"compound", muscles:["pecs"], restSec:120},
  {id:"pupitre_halteres", name:"Pupitre haltères", sets:4, repsLabel:"8-12 reps", defaultReps:10, type:"compound", muscles:["triceps"], restSec:120},
  {id:"bar_front", name:"Barre au front (EZ Bar)", sets:3, repsLabel:"10-12 reps", defaultReps:10, type:"isolation", muscles:["triceps"], restSec:90},
  {id:"curl_ez_bar", name:"Curl (EZ Bar)", sets:3, repsLabel:"12-15 reps", defaultReps:15, type:"isolation", muscles:["triceps"], restSec:90},
  {id:"dev_incline", name:"Développé incliné (haltères ou machine)", sets:3, repsLabel:"10-12 reps", defaultReps:10, type:"compound", muscles:["pecs"], restSec:120},
  {id:"ecarte_poulie_haute", name:"Écartés à la poulie haute", sets:3, repsLabel:"12-15 reps", defaultReps:15, type:"isolation", muscles:["pecs"], restSec:90},
  {id:"ext_triceps_poulie", name:"Extensions Triceps (Corde)", sets:3, repsLabel:"12-15 reps", defaultReps:15, type:"isolation", muscles:["triceps"], restSec:90},
  {id:"papillon_pecs", name:"Papillons Pecs", sets:3, repsLabel:"10-12 reps", defaultReps:10, type:"isolation", muscles:["pecs"], restSec:120},
  {id:"pompes", name:"Pompes", sets:3, repsLabel:"10-12 reps", defaultReps:10, type:"isolation", muscles:["pecs"], restSec:90},
];

const EX_VENDREDI = [
  {id:"tractions", name:"Tractions", sets:2, repsLabel:"Échec", defaultReps:10, type:"compound", muscles:["triceps"], restSec:120},
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
const DEFAULT_ORDER = ['pecs_tri','dos_ep','abdos','jambes','epaules','rappel','repos'];
const DEFAULT_WEEKLY = {lundi:'pecs_tri', mardi:'dos_ep', mercredi:'abdos', jeudi:'pecs_tri', vendredi:'dos_ep', samedi:'repos', dimanche:'repos'};

/* Objets « vivants » : remplis par applyProgram() */
const PROGRAM = {};
const PROGRAM_PICKER_KEYS = [];
const WEEKLY_SUGGESTIONS = {};

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
  return {v:1, programs:cloneJSON(DEFAULT_PROGRAMS), order:DEFAULT_ORDER.slice(), weekly:Object.assign({},DEFAULT_WEEKLY)};
}
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
}

/* Registre id -> nom : conserve le nom des exercices même retirés du programme (l'historique reste lisible) */
function rememberExNames(){
  const d = gs(); const names = d.exNames || {}; let changed = false;
  Object.values(PROGRAM).forEach(p => p.exercises.forEach(e => { if(names[e.id] !== e.name){ names[e.id] = e.name; changed = true; } }));
  if(changed){ d.exNames = names; ss(d); }
}

let _progCfg = null;
function initProgram(){ _progCfg = loadProgramConfig(); applyProgram(_progCfg); rememberExNames(); }
function saveProgramConfig(){
  const d = gs(); d.program = _progCfg; ss(d);
  applyProgram(_progCfg); rememberExNames(); triggerSave();
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
  if(field==='done'&&val)markDayActive(dateKey);
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
  ss(d); triggerSave();
  if(field==='done'&&val)markDayActive(dateKey);
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
function saveBodyWeight(w){const d=gs();d.bodyWeight=parseFloat(w)||75;ss(d);}

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
  prog.exercises.forEach(ex=>{
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
      html+=`<div class="hm-cell lvl${lvl}${isFuture?' future':''}${isToday?' hm-today':''}" title="${key}${t?' · '+Math.round(t)+'kg':''}"></div>`;
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
  ['warmupModal','readinessModal','resetModal','edConfirmModal'].forEach(id=>{
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
  prog.exercises.forEach(ex=>{
    for(let i=0;i<ex.sets;i++){total++;if(getSet(dateKey,ex.id,i).done)done++;}
  });
  return{done,total,pct:total>0?Math.round(done/total*100):0};
}

function getMuscleVolumes(){
  const vols={pecs:0,dos:0,epaules:0,biceps:0,triceps:0,abdos:0,jambes:0};
  const d=gs();
  if(!d.workouts)return MUSCLE_KEYS.map(()=>0);
  for(let i=0;i<7;i++){
    const dt=new Date();dt.setDate(dt.getDate()-i);
    const key=dateToKey(dt);
    const dayName=DAY_JS_MAP[dt.getDay()];
    const sugKey=(d.dayProgram&&d.dayProgram[key])||WEEKLY_SUGGESTIONS[dayName]||'repos';
    const prog=PROGRAM[sugKey];
    if(!prog||!d.workouts[key])continue;
    prog.exercises.forEach(ex=>{
      (d.workouts[key][ex.id]||[]).forEach(s=>{
        if(s&&s.done){
          const w=parseFloat(s.weight)||20, r=parseFloat(s.reps)||10;
          ex.muscles.forEach(m=>{if(vols[m]!==undefined)vols[m]+=w*r;});
        }
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
  const ex=prog&&prog.exercises.find(e=>e.id===exId); if(!ex)return;
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
  let hasActive=false,justDone=false,activeEl=null;
  document.querySelectorAll('.ex-card').forEach(c=>{
    const id=c.dataset.ex,n=+c.dataset.sets;let d=0;
    for(let i=0;i<n;i++)if(getSet(dateKey,id,i).done)d++;
    const full=n>0&&d===n;
    if(full&&!c.classList.contains('done'))justDone=true;
    c.classList.toggle('done',full);
    if(!full)c.classList.remove('open');
    const a=!full&&!hasActive;if(a){hasActive=true;activeEl=c;}
    c.classList.toggle('active',a);
    const k=c.querySelector('.ex-count');if(k)k.textContent=d+'/'+n;
  });
  if(scroll&&justDone&&activeEl)requestAnimationFrame(()=>activeEl.scrollIntoView({behavior:'smooth',block:'start'}));
}
function getTonnageFor(dateKey){
  const {prog}=getEffectiveDayProgram(dateKey);const d=gs();
  if(!prog||!d.workouts||!d.workouts[dateKey])return 0;
  let t=0;
  prog.exercises.forEach(ex=>{if(ex.isTime)return;(d.workouts[dateKey][ex.id]||[]).forEach(s=>{if(s&&s.done)t+=(parseFloat(s.weight)||0)*(parseFloat(s.reps)||ex.defaultReps||10);});});
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
    startTimer(restSec||90,exName);
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

function renderToday(){
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
    prog.exercises.forEach(ex=>{html+=`<div class="card ex-card" id="exc-${ex.id}" data-ex="${ex.id}" data-sets="${ex.sets}" style="--c:${progColor(dayName)}">${renderExBlock(ex,dateKey)}</div>`;});
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
  el.innerHTML=html;
  refreshExCards(dateKey,false);
  setTimeout(()=>showReadinessPopup(),900);
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
  DAYS_ORDER.forEach(dayName=>{
    const sugKey=WEEKLY_SUGGESTIONS[dayName]||'repos';
    const prog=PROGRAM[sugKey];
    const isToday=dayName===todayName;
    const today=new Date();today.setHours(0,0,0,0);
    const jsDay=DAY_NUMBER[dayName];
    const d=new Date(today);
    let diff=jsDay-today.getDay();
    d.setDate(today.getDate()+diff);
    const dateKey=dateToKey(d);
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

let radarChart=null, weightChart=null, _chartMode='max';

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
    <div style="position:relative;height:190px"><canvas id="weightChart"></canvas></div>
    <div id="weightChartEmpty" class="empty" style="display:none">Aucune donnée pour cet exercice.<br>Lance ta première séance !</div>
  </div>
  <div class="radar-wrap">
    <div class="stitle">Repartition Musculaire <span style="font-size:10px;color:var(--dim)">(7 derniers jours)</span></div>
    <canvas id="radarChart" height="250"></canvas>
  </div>
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
  if(inp)saveBodyWeight(inp.value);
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

function renderWeightChart(){
  const sel=document.getElementById('exSelect');
  if(!sel)return;
  const exId=sel.value;
  const empty=document.getElementById('weightChartEmpty');
  const canvas=document.getElementById('weightChart');
  if(weightChart){weightChart.destroy();weightChart=null;}
  if(_chartMode==='tonnage'){
    const hist=getWeeklyTonnageHistory(exId);
    if(!hist.length){
      if(canvas)canvas.style.display='none';
      if(empty)empty.style.display='block';
      return;
    }
    if(canvas)canvas.style.display='block';
    if(empty)empty.style.display='none';
    const labels=hist.map(h=>h.week.slice(5));
    const data=hist.map(h=>h.tonnage);
    const ctx=canvas.getContext('2d');
    const grad=ctx.createLinearGradient(0,0,0,190);
    grad.addColorStop(0,'rgba(232,146,10,0.3)');grad.addColorStop(1,'rgba(232,146,10,0)');
    weightChart=new Chart(ctx,{type:'bar',data:{labels,datasets:[{label:'Tonnage (kg·reps)',data,backgroundColor:'rgba(255,90,102,0.6)',borderColor:'#FF5A66',borderWidth:2,borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>c.parsed.y.toLocaleString('fr-FR')+' kg·reps'},backgroundColor:'#14161A',titleColor:'#e8e8f5',bodyColor:'#FF5A66'}},scales:{x:{grid:{color:'rgba(128,132,145,0.16)'},ticks:{color:'#8a90a8',font:{size:10,family:'Figtree'}}},y:{grid:{color:'rgba(128,132,145,0.16)'},ticks:{color:'#8a90a8',font:{size:10,family:'Figtree'},callback:v=>v+'kg'},beginAtZero:true}}}});
    return;
  }
  const hist=getWeightHistory(exId);
  if(!hist.length){
    if(canvas)canvas.style.display='none';
    if(empty)empty.style.display='block';
    return;
  }
  if(canvas)canvas.style.display='block';
  if(empty)empty.style.display='none';
  const labels=hist.map(h=>h.date.slice(5));
  const data=hist.map(h=>_chartMode==='max'?h.max:h.avg);
  const ctx=canvas.getContext('2d');
  const grad=ctx.createLinearGradient(0,0,0,190);
  grad.addColorStop(0,'rgba(245,183,0,0.3)');
  grad.addColorStop(1,'rgba(245,183,0,0)');
  weightChart=new Chart(ctx,{
    type:'line',
    data:{labels,datasets:[{label:_chartMode==='max'?'Charge max (kg)':'Charge moy (kg)',data,fill:true,backgroundColor:grad,borderColor:'#F5B700',pointBackgroundColor:'#F5B700',pointBorderColor:'#ffffff',pointRadius:4,pointHoverRadius:6,tension:0.35,borderWidth:2}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>c.parsed.y+' kg'},backgroundColor:'#14161A',titleColor:'#e8e8f5',bodyColor:'#F5B700'}},scales:{x:{grid:{color:'rgba(128,132,145,0.16)'},ticks:{color:'#8a90a8',font:{size:10,family:'Figtree'}}},y:{grid:{color:'rgba(128,132,145,0.16)'},ticks:{color:'#8a90a8',font:{size:10,family:'Figtree'},callback:v=>v+'kg'},beginAtZero:false}}}
  });
}

function drawRadar(){
  const ctx=document.getElementById('radarChart');
  if(!ctx)return;
  if(radarChart)radarChart.destroy();
  radarChart=new Chart(ctx,{
    type:'radar',
    data:{
      labels:MUSCLE_LABELS,
      datasets:[{
        label:'Volume (kg·reps)',
        data:getMuscleVolumes(),
        fill:true,
        backgroundColor:'rgba(255,90,102,0.18)',
        borderColor:'rgba(255,90,102,0.95)',
        pointBackgroundColor:'rgba(255,90,102,1)',
        pointBorderColor:'#000',
        pointHoverBackgroundColor:'#fff',
        pointRadius:5,
      }]
    },
    options:{
      responsive:true,
      plugins:{legend:{display:false}},
      scales:{r:{
        grid:{color:'rgba(128,132,145,0.22)'},
        angleLines:{color:'rgba(128,132,145,0.16)'},
        pointLabels:{color:'#e8e8f5',font:{family:'Figtree',size:12,weight:'600'}},
        ticks:{display:false,backdropColor:'transparent'},min:0,
      }}
    }
  });
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
  const runDays=[
    {key:'mardi', icon:'',name:'Mardi — Fractionné HIIT',   desc:'Intervalles haute intensité pour brûler max de calories.',   detail:'10min éco · 10-15× (30s sprint/30s récup) · 5min retour'},
    {key:'jeudi', icon:'',name:'Jeudi — Tempo',              desc:'Allure soutenue sur 5km pour développer ton seuil lactique.',detail:'5km continu, légèrement inconfortable mais constant'},
    {key:'dimanche',icon:'',name:'Dimanche — Sortie Longue', desc:'Endurance fondamentale Zone 2 pour brûler les graisses.',    detail:'45–60min très lent, conversation possible'},
  ];
  let runCardsHtml='';
  runDays.forEach(rd=>{
    const today=new Date();today.setHours(0,0,0,0);
    const jsDay=DAY_NUMBER[rd.key];
    const d=new Date(today);d.setDate(today.getDate()+(jsDay-today.getDay()+7)%7);
    const dateKey=dateToKey(d);
    const rl=getRunLog(dateKey);
    runCardsHtml+=`<div class="run-card">
      <div class="run-title">${rd.name}</div>
      <div class="run-step" style="margin-bottom:6px">${rd.desc}</div>
      <div class="run-step" style="font-style:italic">${rd.detail}</div>
      <div class="run-log" style="margin-top:12px">
        <div class="input-col"><span class="set-lbl">DURÉE (min)</span>
          <input class="si" type="number" inputmode="numeric" placeholder="—" value="${rl.duration}"
            onchange="debounce('cr-d-${dateKey}',()=>{saveRunLog('${dateKey}','duration',this.value);},400)"></div>
        <div class="input-col"><span class="set-lbl">DIST (km)</span>
          <input class="si" type="number" inputmode="decimal" placeholder="—" value="${rl.distance}"
            onchange="debounce('cr-s-${dateKey}',()=>{saveRunLog('${dateKey}','distance',this.value);},400)"></div>
        <div class="input-col"><span class="set-lbl">RPE (1-10)</span>
          <input class="si" type="number" inputmode="numeric" placeholder="7" min="1" max="10" value="${rl.rpe}"
            onchange="debounce('cr-r-${dateKey}',()=>{saveRunLog('${dateKey}','rpe',this.value);},400)"></div>
      </div>
      <button class="run-done-btn${rl.done?' done':''}" id="crunBtn-${dateKey}"
        onclick="toggleRunDone2('${dateKey}')">
        ${rl.done?'Séance terminée':'Marquer comme faite'}
      </button>
    </div>`;
  });
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
      <span id="runSectionChevron" style="color:var(--dim);font-size:18px;transition:transform .25s">${ic('chev')}</span>
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
    prog.exercises.forEach(ex=>{html+=renderExBlock(ex,dateKey);});
    html+=`</div>`;
  }

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
  if(inp){saveBodyWeight(inp.value);showToast('Poids de corps sauvegardé');}
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
  ['warmupModal','readinessModal','resetModal','edConfirmModal'].forEach(id=>{
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
function exSummary(ex){return `${ex.sets} × ${escA(ex.repsLabel)} · repos ${fmtRest(ex.restSec)}`;}
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
  if(!silent){renderWeek();renderToday();}
}
function edBack(){
  if(_ed.view==='prog'){_ed.view='home';_ed.key=null;_ed.open=null;_ed.pendingDel=null;edRender();}
  else closeProgramEditor();
}
function edRender(){
  const body=document.getElementById('edBody');if(!body)return;
  const title=document.getElementById('edTitle'),back=document.getElementById('edBack');
  if(_ed.view==='prog'&&!edProg())_ed.view='home';
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

const TABS=['today','week','stats','cardio','profile'];
function switchTab(name){
  TABS.forEach(t=>{
    document.getElementById('tab-'+t).classList.toggle('active',t===name);
    document.getElementById('nav-'+t).classList.toggle('on',t===name);
  });
  if(name==='stats')renderStats();
  if(name==='week')renderWeek();
  if(name==='cardio')renderCardio();
  if(name==='profile')renderProfile();
  window.scrollTo({top:0,behavior:'smooth'});
}

function init(){
  const d=gs();
  if(!d.profile||!d.profile.since){
    const prof=getProfile();
    if(!prof.since)saveProfile({since:todayKey()});
  }
  renderToday();
  renderWeek();
  updateStreak();
  updateReg();
  restoreTimer();

  document.addEventListener('pointerdown',function(e){
    const pop=document.getElementById('prPopup');
    if(pop&&pop.classList.contains('show')&&!pop.contains(e.target)){
      pop.classList.remove('show');
      clearTimeout(_prTimer);
    }
  });
}

init();