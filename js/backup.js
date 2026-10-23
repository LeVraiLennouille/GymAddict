/* GymAddict — module « backup » (chargé à la demande) */
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
  try{const reg=await swReady();if(reg&&'periodicSync' in reg){const st=await navigator.permissions.query({name:'periodic-background-sync'});bg=st.state==='granted'?'ok':'warn';bgDetail=st.state==='granted'?'Disponible : les rappels peuvent partir appli fermée.':'Pris en charge mais non accordé (installe l\'appli et utilise-la régulièrement).';}}catch(e){}
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