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

const PROGRAM = {
  pecs_tri: {label:"Pecs & Triceps", icon:"💪", fullName:"Pectoraux & Triceps",    type:"gym", exercises: EX_LUNDI},
  dos_ep:   {label:"Dos & Épaules",  icon:"🏋️", fullName:"Dos & Épaules",          type:"gym", exercises: EX_MARDI},
  abdos:    {label:"Abdos",          icon:"🎯", fullName:"Abdominaux & Core",      type:"gym", exercises: EX_ABDOS},
  jambes:   {label:"Jambes",         icon:"🦵", fullName:"Jambes & Mollets",       type:"gym", exercises: EX_MERCREDI},
  epaules:  {label:"Épaules",        icon:"🔥", fullName:"Épaules & Trapèzes",    type:"gym", exercises: EX_JEUDI},
  rappel:   {label:"Rappel",         icon:"💥", fullName:"Rappel Haut du Corps",  type:"gym", exercises: EX_VENDREDI},
  repos:    {label:"Repos",          icon:"😴", fullName:"Repos Total",            type:"rest",exercises:[]},

  lundi:    {label:"Pecs & Triceps", icon:"💪", fullName:"Pectoraux & Triceps",    type:"gym", exercises: EX_LUNDI},
  mardi:    {label:"Dos & Épaules",  icon:"🏋️", fullName:"Dos & Épaules",          type:"gym", exercises: EX_MARDI},
  mercredi: {label:"Jambes",         icon:"🦵", fullName:"Jambes & Mollets",       type:"gym", exercises: EX_MERCREDI},
  jeudi:    {label:"Épaules",        icon:"🔥", fullName:"Épaules & Trapèzes",    type:"gym", exercises: EX_JEUDI},
  vendredi: {label:"Rappel",         icon:"💥", fullName:"Rappel Haut du Corps",  type:"gym", exercises: EX_VENDREDI},
  samedi:   {label:"Repos",          icon:"😴", fullName:"Repos Total",            type:"rest",exercises:[]},
  dimanche: {label:"Repos",          icon:"😴", fullName:"Repos Total",            type:"rest",exercises:[]},
};

const PROGRAM_PICKER_KEYS = ['pecs_tri','dos_ep','abdos','jambes','epaules','rappel','repos'];
const WEEKLY_SUGGESTIONS = {
  lundi:    'pecs_tri',
  mardi:    'dos_ep',
  mercredi: 'abdos',
  jeudi:    'pecs_tri',
  vendredi: 'dos_ep',
  samedi:   'repos',
  dimanche: 'repos',
};

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

function gs(){try{return JSON.parse(localStorage.getItem('fitcore')||'{}')}catch{return {}}}
function ss(d){localStorage.setItem('fitcore',JSON.stringify(d))}
function dateToKey(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function todayKey(){return dateToKey(new Date());}
function getDayName(){return DAY_JS_MAP[new Date().getDay()]}

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
    const typeLabel=p.type==='rest'?'😴 Repos':p.type==='run'?'🏃 Running':'🏋️ Salle';
    opts+=`<div class="prog-pick-item${isSelected?' selected':''}" onclick="selectDayProgram('${dateKey}','${key}')">
      <span class="prog-pick-icon">${p.icon}</span>
      <div class="prog-pick-info">
        <div class="prog-pick-name">${p.fullName}</div>
        <div class="prog-pick-meta">${typeLabel}${p.exercises.length?` · ${p.exercises.length} exercices`:''}${isDefault?' · <span style="color:var(--green)">Suggéré</span>':''}</div>
      </div>
      ${isSelected?'<span class="prog-pick-check">✓</span>':''}
    </div>`;
  });
  const html=`<div class="modal-overlay" id="progPickerModal" onclick="if(event.target.id==='progPickerModal')closeProgramPicker()">
    <div class="modal-box prog-pick-box">
      <div class="modal-hdr">
        <div class="modal-title">🗓️ Choisir un programme</div>
        <button class="drawer-close" onclick="closeProgramPicker()">✕</button>
      </div>
      <div class="prog-pick-hint">Le programme suggéré est mis en avant. Tu peux choisir n'importe quelle séance.</div>
      <div class="prog-pick-list">${opts}</div>
      ${current?`<button class="prog-pick-reset" onclick="resetDayProgram('${dateKey}')">↩️ Revenir au programme suggéré</button>`:''}
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend',html);
}
function closeProgramPicker(){const m=document.getElementById('progPickerModal');if(m)m.remove();}
function selectDayProgram(dateKey,progKey){
  saveDayProgramOverride(dateKey,progKey);
  closeProgramPicker();
  renderToday();
  showToast('📋 Programme : '+PROGRAM[progKey].fullName);
}
function resetDayProgram(dateKey){
  saveDayProgramOverride(dateKey,null);
  closeProgramPicker();
  renderToday();
  showToast('↩️ Programme par défaut rétabli');
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
  {w:4,emoji:'🐱',name:'chat',names:'chats'},
  {w:80,emoji:'🧑',name:'adulte',names:'adultes'},
  {w:200,emoji:'🏍️',name:'moto',names:'motos'},
  {w:600,emoji:'🐄',name:'vache',names:'vaches'},
  {w:1500,emoji:'🚗',name:'voiture',names:'voitures'},
  {w:6000,emoji:'🐘',name:"éléphant d'Afrique",names:"éléphants d'Afrique"},
  {w:12000,emoji:'🚌',name:'bus',names:'bus'},
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
        <div class="modal-title">🔥 Plan d'Échauffement</div>
        <button class="drawer-close" onclick="closeModal()">✕</button>
      </div>
      <div style="font-size:13px;color:var(--dim);margin-bottom:4px">${exName}</div>
      ${oneRM?`<div style="font-size:11px;color:var(--muted);margin-bottom:12px">1RM estimé: <b style="color:var(--orange)">${oneRM}kg</b></div>`:''}
      <div class="warmup-inp-row" style="margin-bottom:14px">
        <div><div style="font-size:11px;color:var(--dim);margin-bottom:4px">Charge de travail (kg)</div>
        <input class="big-inp" type="number" id="warmupWtInp" value="${w||''}" placeholder="kg" inputmode="decimal" style="width:90px"></div>
        <button class="btn-calc" onclick="refreshWarmup()">↻ Calc</button>
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
  ['warmupModal','readinessModal','resetModal'].forEach(id=>{
    const m=document.getElementById(id);if(m)m.remove();
  });
}

function showReadinessPopup(){
  const dateKey=todayKey();
  if(getReadiness(dateKey))return;
  _readinessVals={sleep:3,stress:3,soreness:3};
  const makeStars=(group,defaultVal=3)=>[1,2,3,4,5].map(i=>
    `<button class="star-btn${i<=defaultVal?' s-active':''}" onclick="selectStar('${group}',${i})">${i<=defaultVal?'⭐':'☆'}</button>`
  ).join('');
  const pseudo=getProfile().pseudo||'Athlète';
  const html=`<div class="modal-overlay" id="readinessModal">
    <div class="modal-box">
      <div class="modal-hdr"><div class="modal-title">💪 Check-in Seance</div><button class="drawer-close" onclick="closeModal()">✕</button></div>
      <div style="font-size:12px;color:var(--dim);margin-bottom:20px">Salut <b style="color:var(--green)">${pseudo}</b> ! Comment tu te sens aujourd'hui ?</div>
      <div style="font-size:10px;color:var(--muted);margin-bottom:16px;text-align:center;font-family:var(--fm)">1 = Très mauvais &nbsp;·&nbsp; 5 = Parfait</div>
      <div class="ready-item">
        <div class="ready-label">😴 Qualité du sommeil</div>
        <div class="ready-scale-labels"><span>😩</span><span>😐</span><span>😄</span></div>
        <div class="ready-stars" id="rs-sleep">${makeStars('sleep',3)}</div>
      </div>
      <div class="ready-item">
        <div class="ready-label">🧘 Niveau d'énergie / Stress</div>
        <div class="ready-scale-labels"><span>😩 Épuisé</span><span>💪 Plein de feu</span></div>
        <div class="ready-stars" id="rs-stress">${makeStars('stress',3)}</div>
      </div>
      <div class="ready-item">
        <div class="ready-label">💪 État musculaire</div>
        <div class="ready-scale-labels"><span>😩 Courbaturé</span><span>✅ Frais</span></div>
        <div class="ready-stars" id="rs-soreness">${makeStars('soreness',3)}</div>
      </div>
      <button class="run-done-btn" style="margin-top:20px;font-size:14px;font-family:var(--fh);letter-spacing:1px" onclick="submitReadiness()">Demarrer 🚀</button>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend',html);
}

function selectStar(group,val){
  _readinessVals[group]=val;
  const c=document.getElementById('rs-'+group);
  if(!c)return;
  c.querySelectorAll('.star-btn').forEach((btn,i)=>{
    const on=i<val;btn.textContent=on?'⭐':'☆';btn.classList.toggle('s-active',on);
  });
}

function submitReadiness(){
  const dateKey=todayKey();
  const score=computeReadinessScore(_readinessVals);
  saveReadiness(dateKey,{..._readinessVals,score});
  closeModal();
  if(score<=2)showToast('😴 Forme basse détectée — réduis tes charges de 10–15%');
  else if(score<=3)showToast('💪 Forme correcte — écoute ton corps en séance');
  else if(score>=4.5)showToast('🔥 Forme olympique ! Pulvérise tes records !');
  else showToast('⚡ Bonne forme ! Tu vas assurer aujourd\'hui');
  _updateReadinessBadge(score);
}

function _updateReadinessBadge(score){
  const el=document.getElementById('readinessBadge');
  if(!el)return;
  let rColor,rEmoji;
  if(score>=4){rColor='var(--green)';rEmoji='🟢';}
  else if(score>=3){rColor='var(--yellow)';rEmoji='🟡';}
  else{rColor='var(--red)';rEmoji='🔴';}
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
  if(eEl)eEl.textContent=eq?`soit ${eq.count} ${eq.name} ${eq.emoji}`:'';
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

function updateStreak(){document.getElementById('streakBadge').textContent='🔥 '+computeStreak()+'j';}
function updateReg(){document.getElementById('regBadge').textContent=computeReg()+'%';}

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

let _timerInterval=null,_timerSec=0;
function startTimer(sec,exName){
  _timerSec=sec;
  clearInterval(_timerInterval);
  const w=document.getElementById('timerWidget');
  const d=document.getElementById('timerDisplay');
  const n=document.getElementById('timerExName');
  n.textContent=exName||'Repos';
  w.classList.add('show');
  function tick(){
    const m=Math.floor(_timerSec/60),s=_timerSec%60;
    d.textContent=m+':'+(s<10?'0':'')+s;
    d.className='tmr-time'+(_timerSec<=10?' urgent':'');
    if(_timerSec<=0){
      clearInterval(_timerInterval);_timerInterval=null;
      d.textContent='GO !';d.className='tmr-time';
      setTimeout(()=>{if(!_timerInterval)w.classList.remove('show');},2500);
    } else _timerSec--;
  }
  tick();
  _timerInterval=setInterval(tick,1000);
}

function addTime(s){_timerSec+=s;}
function dismissTimer(){
  clearInterval(_timerInterval);_timerInterval=null;
  document.getElementById('timerWidget').classList.remove('show');
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
  return list.sort((a,b)=>a.name.localeCompare(b.name));
}

function renderExBlock(ex,dateKey){
  const prs=getPRs();
  const exPR=prs[ex.id];
  const note=getExNote(dateKey,ex.id);
  let badge='';
  if(ex.superset) badge=`<span class="badge b-superset">Superset ${ex.superset}</span>`;
  else if(ex.type==='compound') badge=`<span class="badge b-compound">Compound · 3min</span>`;
  else badge=`<span class="badge b-isolation">Isolation · 1m30</span>`;
  if(ex.optional) badge+=`<span class="badge b-optional">Optionnel</span>`;

  let setRows='';
  for(let i=0;i<ex.sets;i++){
    const s=getSet(dateKey,ex.id,i);
    const dispW = s.weight!=='' ? s.weight : (exPR ? exPR.weight : '');
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
        style="display:${isPR?'inline-block':'none'}">PR 🏅</div>
    </div>`;
  }

  const safeNameDisplay=ex.name.replace(/'/g,"\\'").replace(/"/g,'&quot;');
  const noteEscaped=(note.settings||'').replace(/"/g,'&quot;');

  return `
  <div class="ex-block">
    <div class="ex-header">
      <div class="ex-name">${ex.name}</div>
      ${badge}
    </div>
    <div class="ex-meta">📊 ${ex.sets} séries · ${ex.repsLabel}${exPR?` · 🏆 PR: <b style="color:var(--orange)">${exPR.weight}kg × ${exPR.reps}reps</b>`:''}
    </div>
    <div class="sets-wrap">${setRows}</div>
    <div class="ex-notes">
      <input class="ex-note-inp" type="text" placeholder="⚙️ Réglages machine (ex: Siège cran 4, prise large...)"
        value="${noteEscaped}"
        onchange="debounce('ns-${ex.id}-${dateKey}',()=>{saveExNote('${dateKey}','${ex.id}','settings',this.value);},600)">
      <div class="ex-note-rpe-row">
        <div class="rpe-wrap">
          <span class="set-lbl">RPE /10</span>
          <input class="si rpe-inp" type="number" inputmode="numeric" min="1" max="10" placeholder="—"
            value="${note.rpe||''}"
            onchange="debounce('nr-${ex.id}-${dateKey}',()=>{saveExNote('${dateKey}','${ex.id}','rpe',this.value);},400)">
        </div>
        ${!ex.isTime?`<button class="warmup-btn" onclick="showWarmupModal('${ex.id}','${safeNameDisplay}')">🔥 Warm-up</button>`:''}
      </div>
    </div>
  </div>`;
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
  if(txt)txt.textContent=p.done+'/'+p.total+' séries · '+p.pct+'%';
}

function renderToday(){
  const dateKey=todayKey();
  const {key:dayName,prog}=getEffectiveDayProgram(dateKey);
  const isOverridden=getDayProgramOverride(dateKey)!==null;
  const el=document.getElementById('today-content');
  if(!prog){el.innerHTML='<div class="empty">Programme indisponible</div>';return;}
  if(prog.type==='rest'){
    el.innerHTML=`<div class="rest-day">
      <div class="rest-emoji">😴</div>
      <div class="rest-msg">REPOS</div>
      <div class="rest-sub">Laisse ton corps récupérer.<br>La récupération c'est aussi de l'entraînement !</div>
      <button class="prog-switch-btn" onclick="showProgramPicker('${dateKey}')">🔄 Choisir un programme</button>
    </div>`;
    return;
  }
  const p=getDayProgress(dateKey,dayName);
  const readiness=getReadiness(dateKey);
  let rBadgeHtml='';
  if(readiness){
    const score=readiness.score||computeReadinessScore(readiness);
    let rColor,rEmoji;
    if(score>=4){rColor='var(--green)';rEmoji='🟢';}
    else if(score>=3){rColor='var(--yellow)';rEmoji='🟡';}
    else{rColor='var(--red)';rEmoji='🔴';}
    rBadgeHtml=`<div id="readinessBadge" class="readiness-chip" style="border-color:${rColor};color:${rColor};display:inline-flex">${rEmoji} ${score}/5</div>`;
  } else {
    rBadgeHtml=`<div id="readinessBadge" class="readiness-chip" style="display:none"></div>`;
  }
  const tonnage=getTodayTonnage();
  const eq=getFunEquivalent(tonnage);
  const suggestionLabel=!isOverridden?`<span class="prog-suggestion-badge">💡 Suggéré</span>`:'';
  let html=`
  <div class="chip">📅 ${new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})}</div>
  <div class="card green-glow">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:4px">
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <div class="card-title">${prog.icon} ${prog.fullName}</div>
          ${isOverridden?`<span class="prog-override-badge">✏️ Modifié</span>`:suggestionLabel}
        </div>
        <div class="card-sub">🏋️ Salle de sport</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
        ${rBadgeHtml}
        <button class="prog-switch-btn" onclick="showProgramPicker('${dateKey}')">🔄 Changer</button>
      </div>
    </div>
    <div class="prog-txt" id="progtxt-${dateKey}">${p.done}/${p.total} séries · ${p.pct}%</div>
    <div class="prog-wrap"><div class="prog-fill" id="prog-${dateKey}" style="width:${p.pct}%"></div></div>
  </div>`;
  if(prog.exercises.length>0){
    html+=`<div class="stitle">Exercices</div><div class="card">`;
    prog.exercises.forEach(ex=>{html+=renderExBlock(ex,dateKey);});
    html+=`</div>`;
  }

  html+=`<div class="card tonnage-card" id="tonnageCard" style="${tonnage>0?'display:block':'display:none'}">
    <div style="display:flex;align-items:center;gap:14px">
      <div style="font-size:38px">${eq?eq.emoji:'⚡'}</div>
      <div>
        <div style="font-family:var(--fh);font-size:13px;font-weight:700;color:var(--dim);letter-spacing:1px;text-transform:uppercase">Tonnage d'aujourd'hui</div>
        <div id="tonnageVal" style="font-family:var(--fm);font-size:26px;font-weight:700;color:var(--green)">${tonnage.toLocaleString('fr-FR')} kg</div>
        <div id="tonnageEq" style="font-size:12px;color:var(--dim)">${eq?`soit ${eq.count} ${eq.name} ${eq.emoji}`:''}</div>
      </div>
    </div>
  </div>`;
  el.innerHTML=html;
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
      ${rl.done?'✅ Séance Running Terminée !':'Marquer la séance Running comme faite'}
    </button>
  </div>`;
}

function toggleRunDone(dateKey,btnId){
  const rl=getRunLog(dateKey);
  const v=!rl.done;
  saveRunLog(dateKey,'done',v);
  const btn=document.getElementById((btnId||'runBtn')+'-'+dateKey);
  if(btn){btn.className='run-done-btn'+(v?' done':'');btn.textContent=v?'✅ Séance Running Terminée !':'Marquer la séance Running comme faite';}
}

function renderWeek(){
  const todayName=getDayName();
  const el=document.getElementById('week-content');
  let html=`<div class="chip">📅 Programme de la semaine</div>
  <div class="week-suggestion-legend">
    <div class="week-sug-item"><span style="color:var(--green)">Lun + Jeu</span> — Pecs & Triceps</div>
    <div class="week-sug-item"><span style="color:var(--blue)">Mar + Ven</span> — Dos & Épaules</div>
    <div class="week-sug-item"><span style="color:var(--orange)">Mer</span> — Jambes & Abdos</div>
  </div>`;
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
    const p=getDayProgress(dateKey,dayName);
    let typeTag='';
    if(effectiveProg.type==='rest')typeTag='<span style="color:var(--muted);font-size:10px">😴 Repos</span>';
    else typeTag='<span style="color:var(--green);font-size:10px">🏋️ Salle</span>';
    const clickable=effectiveProg.type!=='rest';
    const overrideBadge=override?`<span style="font-size:9px;color:var(--orange);font-family:var(--fm)">✏️</span>`
      :`<span style="font-size:9px;color:var(--dim);font-family:var(--fm)">💡</span>`;
    html+=`<div class="wday${isToday?' today':''}" ${clickable?`onclick="openDayDrawer('${dayName}','${dateKey}')"`:''}
      style="${clickable?'':'cursor:default'}">
      ${isToday?'<div class="today-tag">AUJOURD\'HUI</div>':''}
      <div class="wicon">${effectiveProg.icon}</div>
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
        ${clickable?'<div class="wday-chevron">›</div>':''}
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
        <div class="pr-item-day">📅 ${pr.date||'—'}${pr.reps?' · '+pr.reps+' reps':''} · 1RM~${oneRM}kg</div></div>
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
  <div class="chip">📊 Coach Data</div>
  <div class="stats-grid">
    <div class="stat-card"><div class="stat-v" style="color:var(--orange)">${computeStreak()}</div><div class="stat-l">🔥 Jours de streak</div></div>
    <div class="stat-card"><div class="stat-v" style="color:var(--green)">${computeReg()}%</div><div class="stat-l">📈 Régularité 7j</div></div>
  </div>
  <div class="card" style="margin-bottom:12px">
    <div class="stitle">📅 Calendrier d'activite</div>
    ${renderHeatmap()}
  </div>
  <div class="card" style="margin-bottom:12px">
    <div class="stitle">📈 Evolution des charges et Volume</div>
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
    <div class="stitle">🏆 Records Personnels</div>
    <div class="bw-row">
      <div class="bw-lbl">⚖️ Poids de corps :</div>
      <input class="big-inp" type="number" id="bwInp" value="${bw}" min="30" max="200" inputmode="decimal" style="width:75px">
      <span class="bw-lbl">kg</span>
      <button class="btn-calc" onclick="saveBWAndRefresh()" style="padding:8px 12px;font-size:13px">✓</button>
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
    grad.addColorStop(0,'rgba(251,146,60,0.3)');grad.addColorStop(1,'rgba(251,146,60,0)');
    weightChart=new Chart(ctx,{type:'bar',data:{labels,datasets:[{label:'Tonnage (kg·reps)',data,backgroundColor:'rgba(251,146,60,0.6)',borderColor:'#fb923c',borderWidth:2,borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>c.parsed.y.toLocaleString('fr-FR')+' kg·reps'},backgroundColor:'#1a1a35',titleColor:'#e8e8f5',bodyColor:'#fb923c'}},scales:{x:{grid:{color:'rgba(255,255,255,0.05)'},ticks:{color:'#8a90a8',font:{size:10,family:'JetBrains Mono'}}},y:{grid:{color:'rgba(255,255,255,0.05)'},ticks:{color:'#8a90a8',font:{size:10,family:'JetBrains Mono'},callback:v=>v+'kg'},beginAtZero:true}}}});
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
  grad.addColorStop(0,'rgba(34,217,122,0.3)');
  grad.addColorStop(1,'rgba(34,217,122,0)');
  weightChart=new Chart(ctx,{
    type:'line',
    data:{labels,datasets:[{label:_chartMode==='max'?'Charge max (kg)':'Charge moy (kg)',data,fill:true,backgroundColor:grad,borderColor:'#22d97a',pointBackgroundColor:'#22d97a',pointBorderColor:'#060611',pointRadius:4,pointHoverRadius:6,tension:0.35,borderWidth:2}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>c.parsed.y+' kg'},backgroundColor:'#1a1a35',titleColor:'#e8e8f5',bodyColor:'#22d97a'}},scales:{x:{grid:{color:'rgba(255,255,255,0.05)'},ticks:{color:'#8a90a8',font:{size:10,family:'JetBrains Mono'}}},y:{grid:{color:'rgba(255,255,255,0.05)'},ticks:{color:'#8a90a8',font:{size:10,family:'JetBrains Mono'},callback:v=>v+'kg'},beginAtZero:false}}}
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
        backgroundColor:'rgba(34,217,122,0.15)',
        borderColor:'rgba(34,217,122,0.9)',
        pointBackgroundColor:'rgba(34,217,122,1)',
        pointBorderColor:'#000',
        pointHoverBackgroundColor:'#fff',
        pointRadius:5,
      }]
    },
    options:{
      responsive:true,
      plugins:{legend:{display:false}},
      scales:{r:{
        grid:{color:'rgba(255,255,255,0.08)'},
        angleLines:{color:'rgba(255,255,255,0.05)'},
        pointLabels:{color:'#e8e8f5',font:{family:'Rajdhani',size:12,weight:'600'}},
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
  return id;
}

function renderCardio(){
  const age=getAge(), hrMax=220-age;
  const zoneColors=['#4ade80','#38bdf8','#facc15','#fb923c','#f87171'];
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
    {key:'mardi', icon:'⚡',name:'Mardi — Fractionné HIIT',   desc:'Intervalles haute intensité pour brûler max de calories.',   detail:'10min éco · 10-15× (30s sprint/30s récup) · 5min retour'},
    {key:'jeudi', icon:'🏃',name:'Jeudi — Tempo',              desc:'Allure soutenue sur 5km pour développer ton seuil lactique.',detail:'5km continu, légèrement inconfortable mais constant'},
    {key:'dimanche',icon:'🌿',name:'Dimanche — Sortie Longue', desc:'Endurance fondamentale Zone 2 pour brûler les graisses.',    detail:'45–60min très lent, conversation possible'},
  ];
  let runCardsHtml='';
  runDays.forEach(rd=>{
    const today=new Date();today.setHours(0,0,0,0);
    const jsDay=DAY_NUMBER[rd.key];
    const d=new Date(today);d.setDate(today.getDate()+(jsDay-today.getDay()+7)%7);
    const dateKey=dateToKey(d);
    const rl=getRunLog(dateKey);
    runCardsHtml+=`<div class="run-card">
      <div class="run-title">${rd.icon} ${rd.name}</div>
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
        ${rl.done?'✅ Séance Running Terminée !':'Marquer comme faite'}
      </button>
    </div>`;
  });
  document.getElementById('cardio-content').innerHTML=`
  <div class="chip">🏃 Cardio & Running</div>
  <div class="card" style="margin-bottom:12px">
    <div class="stitle">💓 Calculateur Zones Cardio</div>
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
      <div class="stitle" style="margin-bottom:0">🏃 Séances Running</div>
      <span id="runSectionChevron" style="color:var(--dim);font-size:18px;transition:transform .25s">›</span>
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
  if(btn){btn.className='run-done-btn'+(v?' done':'');btn.textContent=v?'✅ Séance Running Terminée !':'Marquer comme faite';}
  markDayActive(dateKey);
}

function calcZones(){
  const inp=document.getElementById('ageInp');
  const age=parseInt(inp?inp.value:25)||25;
  saveAge(age);
  const hrMax=220-age;
  const zoneColors=['#4ade80','#38bdf8','#facc15','#fb923c','#f87171'];
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
  const {prog}=getEffectiveDayProgram(dateKey);
  if(!prog||prog.type==='rest')return;
  document.getElementById('drawerTitle').textContent=prog.icon+' '+prog.fullName;
  const p=getDayProgress(dateKey,dayName);
  let html=`
  <div class="card" style="margin-bottom:12px">
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
    <button class="prog-switch-btn" style="font-size:12px" onclick="closeDrawer();showProgramPicker('${dateKey}')">🔄 Changer ce programme</button>
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

const AVATARS=['💪','🏋️','🔥','⚡','🦁','🐺','🦅','🏆','👊','🎯','🚀','🧠','🐉','⚔️','🌟'];

function getProfile(){const d=gs();return d.profile||{pseudo:'',avatar:'💪',since:todayKey()};}
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
  const avatar=prof.avatar||'💪';
  const since=prof.since||todayKey();
  const streak=computeStreak();
  const reg=computeReg();
  const sessions=getTotalSessions();
  const tonnage=getTotalTonnageAllTime();
  const eq=getFunEquivalent(tonnage);
  const bw=getBodyWeight();
  const age=getAge();

  const sinceDate=new Date(since+'T12:00:00');
  const daysSince=Math.round((new Date()-sinceDate)/(1000*60*60*24));

  const avatarGrid=AVATARS.map(a=>`<button class="avatar-opt${a===avatar?' selected':''}" onclick="selectAvatar('${a}')">${a}</button>`).join('');

  document.getElementById('profile-content').innerHTML=`
  <div class="chip">👤 Mon Profil</div>
  <div class="card profile-card green-glow">
    <div class="profile-top">
      <div class="avatar-display" id="avatarDisplay" onclick="toggleAvatarPicker()">${avatar}</div>
      <div class="profile-info">
        <input class="profile-pseudo-inp" id="pseudoInp" type="text" placeholder="Ton pseudonyme…"
          value="${pseudo}" maxlength="24" autocomplete="off" spellcheck="false"
          oninput="debounce('pseudo',()=>{saveProfile({pseudo:document.getElementById('pseudoInp').value.trim()});updateHeaderGreeting();},600)">
        <div class="profile-since">Membre depuis ${sinceDate.toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})} · <b style="color:var(--green)">${daysSince}j</b></div>
      </div>
    </div>
    <div class="avatar-picker" id="avatarPicker" style="display:none">
      <div style="font-size:10px;color:var(--muted);margin-bottom:8px;font-family:var(--fm);letter-spacing:1px">CHOISIS TON AVATAR</div>
      <div class="avatar-grid">${avatarGrid}</div>
    </div>
  </div>

  <div class="stitle">🏆 Mes Statistiques</div>
  <div class="stats-grid">
    <div class="stat-card"><div class="stat-v" style="color:var(--orange)">${streak}</div><div class="stat-l">🔥 Streak</div></div>
    <div class="stat-card"><div class="stat-v" style="color:var(--green)">${sessions}</div><div class="stat-l">💪 Séances totales</div></div>
    <div class="stat-card"><div class="stat-v" style="color:var(--blue)">${reg}%</div><div class="stat-l">📈 Régularité 7j</div></div>
    <div class="stat-card"><div class="stat-v" style="color:var(--purple);font-size:22px">${tonnage>0?(tonnage/1000).toFixed(1)+'t':'—'}</div><div class="stat-l">⚖️ Tonnage total</div></div>
  </div>
  ${tonnage>0&&eq?`<div class="card" style="text-align:center;padding:14px;margin-bottom:12px">
    <div style="font-size:32px;margin-bottom:6px">${eq.emoji}</div>
    <div style="font-family:var(--fm);font-size:12px;color:var(--dim)">Tu as soulevé l'équivalent de</div>
    <div style="font-family:var(--fh);font-size:20px;font-weight:700;color:var(--text)">${eq.count} ${eq.name}</div>
    <div style="font-size:10px;color:var(--muted);margin-top:2px">au total sur tous tes entraînements</div>
  </div>`:''}

  <div class="stitle">⚙️ Mes Donnees</div>
  <div class="card" style="margin-bottom:12px">
    <div class="bw-row" style="margin-bottom:14px">
      <div class="bw-lbl">⚖️ Poids de corps</div>
      <input class="big-inp" type="number" id="profBwInp" value="${bw}" min="30" max="200" inputmode="decimal" style="width:75px">
      <span class="bw-lbl">kg</span>
      <button class="btn-calc" onclick="saveProfBW()" style="padding:8px 12px;font-size:13px">✓</button>
    </div>
    <div class="bw-row">
      <div class="bw-lbl">🎂 Âge</div>
      <input class="big-inp" type="number" id="profAgeInp" value="${age}" min="10" max="99" inputmode="numeric" style="width:75px">
      <span class="bw-lbl">ans</span>
      <button class="btn-calc" onclick="saveProfAge()" style="padding:8px 12px;font-size:13px">✓</button>
    </div>
  </div>

  <div class="stitle">⚠️ Zone Danger</div>
  <div class="card danger-card">
    <div style="font-size:13px;color:var(--dim);margin-bottom:14px;line-height:1.5">
      Réinitialise <b>TOUTES</b> tes données : séances, records, tonnage, streak, check-ins.<br>
      <span style="color:var(--red);font-size:11px">⚠️ Cette action est irréversible.</span>
    </div>
    <button class="btn-danger" onclick="confirmReset()">🗑️ Reinitialiser toutes les données</button>
  </div>`;
}

function updateHeaderGreeting(){}

function toggleAvatarPicker(){
  const el=document.getElementById('avatarPicker');
  if(el)el.style.display=el.style.display==='none'?'block':'none';
}

function selectAvatar(a){
  saveProfile({avatar:a});
  const disp=document.getElementById('avatarDisplay');
  if(disp)disp.textContent=a;
  document.querySelectorAll('.avatar-opt').forEach(btn=>{
    btn.classList.toggle('selected',btn.textContent===a);
  });
  const picker=document.getElementById('avatarPicker');
  if(picker)picker.style.display='none';
}

function saveProfBW(){
  const inp=document.getElementById('profBwInp');
  if(inp){saveBodyWeight(inp.value);showToast('✅ Poids de corps sauvegardé');}
}

function saveProfAge(){
  const inp=document.getElementById('profAgeInp');
  if(inp){saveAge(parseInt(inp.value)||25);showToast('✅ Âge sauvegardé');}
}

function confirmReset(){
  const html=`<div class="modal-overlay" id="resetModal" onclick="if(event.target.id==='resetModal')closeModal()">
    <div class="modal-box" style="max-width:360px">
      <div class="modal-hdr"><div class="modal-title" style="color:var(--red)">⚠️ Confirmer la réinitialisation</div></div>
      <div style="font-size:13px;color:var(--dim);margin:12px 0 20px;line-height:1.6">
        Tu es sur le point de supprimer <b style="color:var(--text)">toutes tes données</b> définitivement.<br><br>
        Séances · Records · Tonnage · Streak · Check-ins · Tout.
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
  localStorage.removeItem('fitcore');
  saveProfile({...prof,since:todayKey()});
  closeModal();
  showToast('✅ Données réinitialisées');
  updateStreak();updateReg();
  renderProfile();
}

function closeModal(){
  ['warmupModal','readinessModal','resetModal'].forEach(id=>{
    const m=document.getElementById(id);if(m)m.remove();
  });
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

  document.addEventListener('pointerdown',function(e){
    const pop=document.getElementById('prPopup');
    if(pop&&pop.classList.contains('show')&&!pop.contains(e.target)){
      pop.classList.remove('show');
      clearTimeout(_prTimer);
    }
  });
}

init();