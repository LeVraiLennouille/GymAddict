/* GymAddict — module « core » (chargé au démarrage) */
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
function findExName(id){
  for(const day of Object.values(PROGRAM)){
    const ex=day.exercises.find(e=>e.id===id);
    if(ex)return ex.name;
  }
  return (gs().exNames||{})[id]||id;
}
const AVATARS=['red','blue','yellow','green','grey','white'];
const avatarKey=a=>AVATARS.includes(a)?a:'red';
function avatarHtml(a,pseudo){const ch=(pseudo||'').trim().charAt(0).toUpperCase();return `<span class="av av-${avatarKey(a)}">${ch||ic('dumbbell')}</span>`;}
function refreshAvatar(){const d=document.getElementById('avatarDisplay');if(d){const p=getProfile();d.innerHTML=avatarHtml(p.avatar,p.pseudo);}}
function getProfile(){const d=gs();return d.profile||{pseudo:'',avatar:'red',since:todayKey()};}
function saveProfile(p){const d=gs();d.profile={...getProfile(),...p};ss(d);triggerSave();}
function updateHeaderGreeting(){}
function closeModal(){
  ['warmupModal','readinessModal','resetModal','edConfirmModal','summaryModal','swapModal','goalModal','volModal','importModal','diagModal'].forEach(id=>{
    const m=document.getElementById(id);if(m)m.remove();
  });
}
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
function getWeightLog(){return (gs().weightLog||[]).filter(e=>e&&e.date&&e.kg>0).sort((a,b)=>a.date<b.date?-1:1);}
function migrateWeightLog(){
  const d=gs();
  if(!d.weightLog&&d.bodyWeight>0){d.weightLog=[{date:todayKey(),kg:d.bodyWeight}];ss(d);}
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
/* Raccourcis PWA / notifications : index.html#today | #week | #stats | #cardio | #profile */
function handleHash(){
  const h=(location.hash||'').replace('#','');
  if(!h||!TABS.includes(h))return;
  switchTab(h);
  try{history.replaceState(null,'',location.pathname+location.search);}catch(e){}
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
const dayNum=iso=>Math.round(new Date(iso+'T12:00:00').getTime()/86400000);
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
/* navigator.serviceWorker.ready ne se résout jamais si le service worker n'a pas pu s'enregistrer : on limite l'attente */
const swReady=(ms=2500)=>Promise.race([navigator.serviceWorker.ready,new Promise(r=>setTimeout(()=>r(null),ms))]);