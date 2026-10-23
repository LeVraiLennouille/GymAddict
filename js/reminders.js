/* GymAddict — module « reminders » (chargé à la demande) */
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
    const reg=await swReady();
    if(reg&&'periodicSync' in reg){
      const tags=await reg.periodicSync.getTags();
      bg=tags.includes('ga-reminder');
    }
  }catch(e){}
  el.textContent=bg
    ?'Rappel actif, même appli fermée (selon la gestion de la batterie de ton appareil).'
    :"Ton navigateur n'autorise pas l'envoi appli fermée : le rappel arrive tant que l'appli est ouverte, même en arrière-plan.";
}