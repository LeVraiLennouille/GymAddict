function getSet(s,t,r){const o=gs();return o.workouts&&o.workouts[s]&&o.workouts[s][t]&&o.workouts[s][t][r]||{done:!1,weight:"",reps:""}}
function saveSet(s,r,u,k,w){const o=gs();o.workouts||(o.workouts={}),o.workouts[s]||(o.workouts[s]={}),o.workouts[s][r]||(o.workouts[s][r]=[]),o.workouts[s][r][u]||(o.workouts[s][r][u]={done:!1,weight:"",reps:""}),o.workouts[s][r][u][k]=w,ss(o),triggerSave(),k==="done"&&w&&(markDayActive(s),touchSession(s))}
function getRunLog(o){const n=gs();return n.runLogs&&n.runLogs[o]||{done:!1,duration:"",distance:"",rpe:""}}
function saveRunLog(s,o,r){const n=gs();n.runLogs||(n.runLogs={}),n.runLogs[s]||(n.runLogs[s]={done:!1,duration:"",distance:"",rpe:""}),n.runLogs[s][o]=r,(o==="duration"||o==="distance")&&(n.runLogs[s].pace=runPaceSec(n.runLogs[s])||""),ss(n),triggerSave(),o==="done"&&r&&markDayActive(s),updateRunPaceUI(s),o==="done"&&scheduleReminderSync()}
function getPRs(){return gs().prs||{}}
function savePR(p,r,e,t){const s=gs();s.prs||(s.prs={}),s.prs[p]={weight:parseFloat(r),reps:parseInt(e)||0,date:t},ss(s)}
function markDayActive(s){const a=gs();a.activeDays||(a.activeDays=[]),a.activeDays.includes(s)||(a.activeDays.push(s),ss(a)),updateStreak(),updateReg()}
function getActiveDays(){return gs().activeDays||[]}
function getAge(){return gs().age||25}
function saveAge(e){const s=gs();s.age=e,ss(s)}
function getBodyWeight(){return gs().bodyWeight||75}
function saveBodyWeight(r,s){const g=Math.round(parseFloat(String(r).replace(",","."))*10)/10;if(!(g>=20&&g<=300))return!1;const t=gs(),a=s||todayKey(),e=(t.weightLog||[]).filter(o=>o&&o.date!==a);return e.push({date:a,kg:g}),e.sort((o,i)=>o.date<i.date?-1:1),t.weightLog=e,t.bodyWeight=e[e.length-1].kg,ss(t),triggerSave(),setTimeout(checkGoalsAchieved,300),!0}
function getExNote(t,s){const e=gs();return e.exNotes&&e.exNotes[t]&&e.exNotes[t][s]||{settings:"",rpe:""}}
function saveExNote(e,o,t,N){const s=gs();s.exNotes||(s.exNotes={}),s.exNotes[e]||(s.exNotes[e]={}),s.exNotes[e][o]||(s.exNotes[e][o]={settings:"",rpe:""}),s.exNotes[e][o][t]=N,ss(s),triggerSave()}
function getDayProgramOverride(a){const r=gs();return r.dayProgram&&r.dayProgram[a]||null}
function saveDayProgramOverride(a,e){const r=gs();r.dayProgram||(r.dayProgram={}),e===null?delete r.dayProgram[a]:r.dayProgram[a]=e,ss(r),triggerSave()}
function getEffectiveDayProgram(r){const e=getDayProgramOverride(r);if(e&&PROGRAM[e])return{key:e,prog:PROGRAM[e],isSuggestion:!1};const g=new Date(r+"T12:00:00"),t=DAY_JS_MAP[g.getDay()],o=WEEKLY_SUGGESTIONS[t]||"repos";return{key:o,prog:PROGRAM[o],dayName:t,isSuggestion:!0}}
function showProgramPicker(s){const o=getDayProgramOverride(s),t=new Date(s+"T12:00:00"),l=DAY_JS_MAP[t.getDay()],i=WEEKLY_SUGGESTIONS[l]||"repos";let r="";PROGRAM_PICKER_KEYS.forEach(e=>{const c=PROGRAM[e],a=o?o===e:e===i,p=e===i,d=c.type==="rest"?"Repos":c.type==="run"?"Running":"Salle";r+=`<div class="prog-pick-item${a?" selected":""}" onclick="selectDayProgram('${s}','${e}')">
      <span class="prog-pick-icon" style="--c:${progColor(e)}"></span>
      <div class="prog-pick-info">
        <div class="prog-pick-name">${c.fullName}</div>
        <div class="prog-pick-meta">${d}${c.exercises.length?` · ${c.exercises.length} exercices`:""}${p?' · <span style="color:var(--green)">Suggéré</span>':""}</div>
      </div>
      ${a?'<span class="prog-pick-check">'+ic("check")+"</span>":""}
    </div>`});const n=`<div class="modal-overlay" id="progPickerModal" onclick="if(event.target.id==='progPickerModal')closeProgramPicker()">
    <div class="modal-box prog-pick-box">
      <div class="modal-hdr">
        <div class="modal-title">Choisir un programme</div>
        <button class="drawer-close" onclick="closeProgramPicker()">${ic("close")}</button>
      </div>
      <div class="prog-pick-hint">Le programme suggéré est mis en avant. Tu peux choisir n'importe quelle séance.</div>
      <div class="prog-pick-list">${r}</div>
      ${o?`<button class="prog-pick-reset" onclick="resetDayProgram('${s}')">${ic("undo")} Revenir au programme suggéré</button>`:""}
    </div>
  </div>`;document.body.insertAdjacentHTML("beforeend",n)}
function closeProgramPicker(){const e=document.getElementById("progPickerModal");e&&e.remove()}
function selectDayProgram(a,r){saveDayProgramOverride(a,r),closeProgramPicker(),renderToday(),showToast("Programme : "+PROGRAM[r].fullName)}
function resetDayProgram(r){saveDayProgramOverride(r,null),closeProgramPicker(),renderToday(),showToast("Programme par défaut rétabli")}
function calc1RM(u,r){if(!u||!r||r<=0)return 0;const n=parseFloat(u),t=parseInt(r);return t===1?n:t>36?Math.round(n*.5*10)/10:Math.round(n*(36/(37-t))*10)/10}
function getWarmupSets(p){const e=parseFloat(p)||0;return e?[{pct:40,reps:12,label:"Activation"},{pct:60,reps:8,label:"Préparation"},{pct:75,reps:5,label:"Mise en route"},{pct:85,reps:3,label:"Approche"},{pct:95,reps:1,label:"Activation neuro"}].map(t=>({...t,weight:Math.round(e*t.pct/100*2)/2})):[]}
const FUN_EQ=[{w:4,emoji:"",name:"chat",names:"chats"},{w:80,emoji:"",name:"adulte",names:"adultes"},{w:200,emoji:"",name:"moto",names:"motos"},{w:600,emoji:"",name:"vache",names:"vaches"},{w:1500,emoji:"",name:"voiture",names:"voitures"},{w:6e3,emoji:"",name:"éléphant d'Afrique",names:"éléphants d'Afrique"},{w:12e3,emoji:"",name:"bus",names:"bus"}];
function getFunEquivalent(e){if(e<=0)return null;for(let n=FUN_EQ.length-1;n>=0;n--){const t=e/FUN_EQ[n].w;if(t>=.7){const o=Math.round(t*10)/10;return{emoji:FUN_EQ[n].emoji,count:o,name:o>1.4?FUN_EQ[n].names:FUN_EQ[n].name}}}const u=Math.round(e/FUN_EQ[0].w);return{emoji:FUN_EQ[0].emoji,count:u,name:FUN_EQ[0].names}}
function getReadiness(n){const e=gs();return e.readiness&&e.readiness[n]||null}
function saveReadiness(e,n){const s=gs();s.readiness||(s.readiness={}),s.readiness[e]=n,ss(s)}
function computeReadinessScore(e){return e?Math.round((parseInt(e.sleep||3)+parseInt(e.stress||3)+parseInt(e.soreness||3))/3*10)/10:null}
function getTodayTonnage(){const t=todayKey(),{prog:a}=getEffectiveDayProgram(t),e=gs();if(!a||!e.workouts||!e.workouts[t])return 0;let n=0;return dayExercises(t,a).forEach(r=>{r.isTime||(e.workouts[t][r.id]||[]).forEach(o=>{o&&o.done&&(n+=(parseFloat(o.weight)||0)*(parseFloat(o.reps)||r.defaultReps||10))})}),Math.round(n)}
let _readinessVals={sleep:3,stress:3,soreness:3};
function showWarmupModal(o,d){const t=getPRs()[o],e=t?t.weight:0,a=getWarmupSets(e),i=t&&t.reps?calc1RM(t.weight,t.reps):0,s=`<div class="modal-overlay" id="warmupModal" onclick="if(event.target.id==='warmupModal')closeModal()">
    <div class="modal-box">
      <div class="modal-hdr">
        <div class="modal-title">Échauffement</div>
        <button class="drawer-close" onclick="closeModal()">${ic("close")}</button>
      </div>
      <div style="font-size:13px;color:var(--dim);margin-bottom:4px">${d}</div>
      ${i?`<div style="font-size:11px;color:var(--muted);margin-bottom:12px">1RM estimé: <b style="color:var(--orange)">${i}kg</b></div>`:""}
      <div class="warmup-inp-row" style="margin-bottom:14px">
        <div><div style="font-size:11px;color:var(--dim);margin-bottom:4px">Charge de travail (kg)</div>
        <input class="big-inp" type="number" id="warmupWtInp" value="${e||""}" placeholder="kg" inputmode="decimal" style="width:90px"></div>
        <button class="btn-calc" onclick="refreshWarmup()">${ic("refresh")} Calculer</button>
      </div>
      <div id="warmupSets">${e?renderWarmupSets(a):'<div style="text-align:center;color:var(--muted);font-size:13px;padding:20px 0">Entre ton poids de travail ci-dessus</div>'}</div>
    </div>
  </div>`;document.body.insertAdjacentHTML("beforeend",s)}
function renderWarmupSets(a){return!a||!a.length?'<div style="text-align:center;color:var(--muted);font-size:13px;padding:20px 0">Aucune donnée</div>':a.map((i,r)=>`<div class="warmup-row">
    <div class="warmup-num">${r+1}</div>
    <div><div class="warmup-label">${i.label}</div><div class="warmup-reps">${i.reps} répétitions</div></div>
    <div class="warmup-weight">${i.weight}<span style="font-size:12px;color:var(--muted);margin-left:3px">kg</span></div>
    <div class="warmup-pct">${i.pct}%</div>
  </div>`).join("")}
function refreshWarmup(){const e=document.getElementById("warmupWtInp"),n=parseFloat(e?e.value:0)||0,t=document.getElementById("warmupSets");t&&(t.innerHTML=renderWarmupSets(getWarmupSets(n)))}
function showReadinessPopup(){const e=todayKey();if(getReadiness(e))return;_readinessVals={sleep:3,stress:3,soreness:3};const s=(d,l=3)=>[1,2,3,4,5].map(a=>`<button class="star-btn${a<=l?" s-active":""}" onclick="selectStar('${d}',${a})">${ic("star")}</button>`).join(""),i=getProfile().pseudo||"Athlète",t=`<div class="modal-overlay" id="readinessModal">
    <div class="modal-box">
      <div class="modal-hdr"><div class="modal-title">Check-in</div><button class="drawer-close" onclick="closeModal()">${ic("close")}</button></div>
      <div style="font-size:12px;color:var(--dim);margin-bottom:20px">Salut <b style="color:var(--green)">${i}</b> ! Comment tu te sens aujourd'hui ?</div>
      <div style="font-size:10px;color:var(--muted);margin-bottom:16px;text-align:center;font-family:var(--fm)">1 = Très mauvais &nbsp;·&nbsp; 5 = Parfait</div>
      <div class="ready-item">
        <div class="ready-label">Qualité du sommeil</div>
        <div class="ready-scale-labels"><span>Mauvais</span><span>Parfait</span></div>
        <div class="ready-stars" id="rs-sleep">${s("sleep",3)}</div>
      </div>
      <div class="ready-item">
        <div class="ready-label">Énergie et stress</div>
        <div class="ready-scale-labels"><span>Épuisé</span><span>Plein de feu</span></div>
        <div class="ready-stars" id="rs-stress">${s("stress",3)}</div>
      </div>
      <div class="ready-item">
        <div class="ready-label">État musculaire</div>
        <div class="ready-scale-labels"><span>Courbaturé</span><span>Frais</span></div>
        <div class="ready-stars" id="rs-soreness">${s("soreness",3)}</div>
      </div>
      <button class="run-done-btn" style="margin-top:20px;font-size:14px;font-family:var(--fh);letter-spacing:1px" onclick="submitReadiness()">Démarrer</button>
    </div>
  </div>`;document.body.insertAdjacentHTML("beforeend",t)}
function selectStar(e,t){_readinessVals[e]=t;const s=document.getElementById("rs-"+e);s&&s.querySelectorAll(".star-btn").forEach((c,n)=>{c.classList.toggle("s-active",n<t)})}
function submitReadiness(){const s=todayKey(),e=computeReadinessScore(_readinessVals);saveReadiness(s,{..._readinessVals,score:e}),closeModal(),e<=2?showToast("Forme basse détectée — réduis tes charges de 10–15%"):e<=3?showToast("Forme correcte — écoute ton corps en séance"):e>=4.5?showToast("Forme olympique ! Pulvérise tes records !"):showToast("Bonne forme ! Tu vas assurer aujourd'hui"),_updateReadinessBadge(e)}
function _updateReadinessBadge(n){const e=document.getElementById("readinessBadge");if(!e)return;let l,r;n>=4?(l="var(--green)",r=""):n>=3?(l="var(--yellow)",r=""):(l="var(--red)",r=""),e.innerHTML=`${r} ${n}/5`,e.style.display="inline-flex",e.style.borderColor=l,e.style.color=l}
function showToast(t){const e=document.createElement("div");e.className="toast",e.textContent=t,document.body.appendChild(e),requestAnimationFrame(()=>e.classList.add("show")),setTimeout(()=>{e.classList.remove("show"),setTimeout(()=>e.remove(),400)},4e3)}
function updateTonnageCard(){const t=document.getElementById("tonnageCard");if(!t)return;const n=getTodayTonnage();if(n<=0){t.style.display="none";return}t.style.display="block";const o=document.getElementById("tonnageVal"),a=document.getElementById("tonnageEq");o&&(o.textContent=n.toLocaleString("fr-FR")+" kg");const e=getFunEquivalent(n);a&&(a.textContent=e?`soit ${e.count} ${e.name}`:"")}
function computeStreak(){const s=getActiveDays(),t=new Date;t.setHours(0,0,0,0);let a=0,e=new Date(t);for(;;){const c=dateToKey(e);if(s.includes(c))a++,e.setDate(e.getDate()-1);else if(e.getTime()===t.getTime())e.setDate(e.getDate()-1);else break}return a}
function computeReg(){const o=getActiveDays();let n=0;for(let e=0;e<7;e++){const t=new Date;t.setDate(t.getDate()-e),t.setHours(0,0,0,0),o.includes(dateToKey(t))&&n++}return Math.round(n/7*100)}
function updateStreak(){document.getElementById("streakVal").textContent=computeStreak()+" j"}
function updateReg(){document.getElementById("regVal").textContent=computeReg()+"%"}
let _saveTimer;
function triggerSave(){clearTimeout(_saveTimer);const e=document.getElementById("saveInd");e.classList.add("on"),_saveTimer=setTimeout(()=>e.classList.remove("on"),2e3)}
const _debounce={};
function debounce(e,o,u=600){clearTimeout(_debounce[e]),_debounce[e]=setTimeout(o,u)}
const TIMER_KEY="ga_timer";
let _timerInterval=null,_timerEnd=0,_timerName="Repos",_timerBeeped=-1,_wakeLock=null,_audioCtx=null;
function getPrefs(){return Object.assign({sound:!0,vibrate:!0},gs().prefs||{})}
function savePref(e,r){const s=gs();s.prefs=Object.assign({sound:!0,vibrate:!0},s.prefs||{}),s.prefs[e]=r,ss(s)}
function _audio(){try{if(!_audioCtx){const t=window.AudioContext||window.webkitAudioContext;if(!t)return null;_audioCtx=new t}return _audioCtx.state==="suspended"&&_audioCtx.resume(),_audioCtx}catch{return null}}
function beep(c,i,o){if(!getPrefs().sound)return;const t=_audio();if(t)try{const e=t.currentTime,n=t.createOscillator(),a=t.createGain();n.type="sine",n.frequency.value=c,a.gain.setValueAtTime(1e-4,e),a.gain.exponentialRampToValueAtTime(o||.35,e+.01),a.gain.exponentialRampToValueAtTime(1e-4,e+i),n.connect(a),a.connect(t.destination),n.start(e),n.stop(e+i+.02)}catch{}}
function buzz(t){if(!(!getPrefs().vibrate||!navigator.vibrate))try{navigator.vibrate(t)}catch{}}
async function keepAwake(a){try{if(a)"wakeLock"in navigator&&!_wakeLock&&(_wakeLock=await navigator.wakeLock.request("screen"),_wakeLock.addEventListener("release",()=>{_wakeLock=null}));else if(_wakeLock){const e=_wakeLock;_wakeLock=null,await e.release()}}catch{_wakeLock=null}}
function persistTimer(){try{localStorage.setItem(TIMER_KEY,JSON.stringify({end:_timerEnd,name:_timerName}))}catch{}}
function clearPersistedTimer(){try{localStorage.removeItem(TIMER_KEY)}catch{}}
function timerRemaining(){return Math.max(0,Math.ceil((_timerEnd-Date.now())/1e3))}
function startTimer(e,t){_audio(),_timerEnd=Date.now()+e*1e3,_timerName=t||"Repos",_timerBeeped=-1,persistTimer(),document.getElementById("timerExName").textContent=_timerName,document.getElementById("timerWidget").classList.add("show"),clearInterval(_timerInterval),_timerInterval=setInterval(timerTick,250),keepAwake(!0),timerTick()}
function timerTick(){const i=document.getElementById("timerWidget"),t=document.getElementById("timerDisplay");if(!i||!t)return;const e=timerRemaining();if(e<=0){timerFinish();return}const m=Math.floor(e/60),n=e%60;t.textContent=m+":"+(n<10?"0":"")+n,t.className="tmr-time"+(e<=10?" urgent":""),i.classList.toggle("urgent",e<=10),e<=3&&_timerBeeped!==e&&(_timerBeeped=e,beep(660,.12,.25))}
function timerFinish(){const e=document.getElementById("timerWidget"),t=document.getElementById("timerDisplay");clearInterval(_timerInterval),_timerInterval=null,clearPersistedTimer(),keepAwake(!1),t&&(t.textContent="GO !",t.className="tmr-time"),e&&e.classList.remove("urgent"),buzz([300,120,300,120,500]),beep(880,.45,.45),setTimeout(()=>beep(1175,.6,.45),220),setTimeout(()=>{!_timerInterval&&e&&e.classList.remove("show")},2500)}
function addTime(e){_timerInterval&&(_timerEnd+=e*1e3,_timerBeeped=-1,persistTimer(),timerTick())}
function dismissTimer(){clearInterval(_timerInterval),_timerInterval=null,clearPersistedTimer(),keepAwake(!1),document.getElementById("timerWidget").classList.remove("show")}
function restoreTimer(){try{const e=JSON.parse(localStorage.getItem(TIMER_KEY)||"null");if(!e||!e.end)return;if(e.end<=Date.now()){clearPersistedTimer();return}_timerEnd=e.end,_timerName=e.name||"Repos",_timerBeeped=-1,document.getElementById("timerExName").textContent=_timerName,document.getElementById("timerWidget").classList.add("show"),clearInterval(_timerInterval),_timerInterval=setInterval(timerTick,250),keepAwake(!0),timerTick()}catch{}}
document.addEventListener("visibilitychange",()=>{document.hidden||_timerInterval&&(timerTick(),keepAwake(!0))});
window.addEventListener("pageshow",()=>{_timerInterval&&timerTick()});
function testTimerAlert(){_audio(),buzz([200,100,200]),beep(880,.4,.4),setTimeout(()=>beep(1175,.5,.4),200)}
function togglePref(t,s){const e=!getPrefs()[t];savePref(t,e),s.classList.toggle("on",e),s.setAttribute("aria-checked",e),e&&t==="sound"&&beep(880,.2,.35),e&&t==="vibrate"&&buzz(80)}
let _prTimer;
function checkAndShowPR(n,p,r,l){if(!r||parseFloat(r)<=0)return;const i=getPRs()[n],t=parseFloat(r),e=parseInt(l)||0;if(!i||t>i.weight||t===i.weight&&e>i.reps){savePR(n,r,l,todayKey()),recordSessionPR(todayKey(),n,p,t,e),setTimeout(checkGoalsAchieved,700),clearTimeout(_prTimer),document.getElementById("prPopName").textContent=p,document.getElementById("prPopVal").textContent=t+" kg"+(e?" × "+e+" reps":"");const s=document.getElementById("prOnerm");if(s&&e>1){const o=calc1RM(t,e),d=getBodyWeight(),m=Math.round(o/d*100)/100,y=[100,95,90,85,80,75,70].map(c=>({p:c,v:Math.round(o*c/100*2)/2}));s.innerHTML=`<div class="pr-1rm-line">1RM Brzycki: <b>${o}kg</b> · <span style="color:var(--blue)">${m}× poids corps</span></div>
        <div class="pr-pcts">${y.map(c=>`<div class="pr-pct-item"><div class="pr-pct-pct">${c.p}%</div><div class="pr-pct-w">${c.v}kg</div></div>`).join("")}</div>`,s.style.display="block"}else s&&(s.style.display="none");const a=document.getElementById("prPopup");a.classList.add("show"),_prTimer=setTimeout(()=>a.classList.remove("show"),6e3),setTimeout(()=>document.querySelectorAll('.pr-flag[data-ex="'+n+'"]').forEach(o=>o.style.display="inline-block"),100)}}
function getDayProgress(t,s){const{prog:e}=getEffectiveDayProgram(t);if(!e||e.type==="rest"||e.exercises.length===0)return{done:0,total:0,pct:0};let r=0,o=0;return dayExercises(t,e).forEach(i=>{if(!isSkipped(t,i.id))for(let n=0;n<i.sets;n++)r++,getSet(t,i.id,n).done&&o++}),{done:o,total:r,pct:r>0?Math.round(o/r*100):0}}
function getLastSession(s,n){const o=gs();if(!o.workouts)return null;const u=Object.keys(o.workouts).filter(t=>t<n&&o.workouts[t]&&o.workouts[t][s]).sort().reverse();for(const t of u){const r=(o.workouts[t][s]||[]).filter(e=>e&&e.done);if(r.length)return{date:t,sets:r}}return null}
function topSet(o){return o.reduce((r,t)=>{const e=parseFloat(t.weight)||0,n=parseFloat(t.reps)||0;return!r||e>r.w||e===r.w&&n>r.r?{w:e,r:n}:r},null)}
function lastSessionHtml(n,e,s){const t=new Date(e.date+"T12:00:00").toLocaleDateString("fr-FR",{weekday:"short",day:"numeric",month:"short"}),r=n.isTime?" s":" reps",i=s.w>0?`${fmtKg(s.w)} kg × ${s.r}${n.isTime?" s":""}`:`${s.r}${r}`;return`Dernière fois · ${t} : <b>${i}</b>${e.sets.length>1?` <span>· ${e.sets.length} séries</span>`:""}`}
function getProgressionSuggestion(t,n){if(!n||t.isTime||t.type==="echauffement")return null;const r=exRepFields(t);if(r.failure||n.sets.length<t.sets)return null;const e=Math.max(...n.sets.map(s=>parseFloat(s.weight)||0));if(e<=0)return null;const i=t.step>0?t.step:2.5,o=Math.round((e+i)*100)/100;return n.sets.every(s=>(parseFloat(s.reps)||0)>=r.max)?{kind:"up",from:e,weight:o,step:i,target:r.min}:{kind:"hold",from:e,weight:e,next:o,target:r.max}}
function sets0Applied(n,t,i){if(i.kind!=="up")return!1;for(let e=0;e<t.sets;e++){const s=getSet(n,t.id,e);if(!s.done&&parseFloat(s.weight)>=i.weight)return!0}return!1}
function progressionHtml(s,e,i,t){return e.kind==="hold"?`<div class="ex-prog hold" id="exp-${s.id}"><span>Garde <b>${fmtKg(e.from)} kg</b> et vise <b>${e.target} reps</b> sur chaque série pour passer à ${fmtKg(e.next)} kg.</span></div>`:t?`<div class="ex-prog up applied" id="exp-${s.id}"><span>${ic("check")} Charge passée à <b>${fmtKg(e.weight)} kg</b></span></div>`:`<div class="ex-prog up" id="exp-${s.id}"><span><b>Prêt à monter !</b> Toutes les séries validées : essaie <b>${fmtKg(e.weight)} kg</b> (+${fmtKg(e.step)}).</span><button onclick="applyProgression('${i}','${s.id}',${e.weight})">Appliquer</button></div>`}
function applyProgression(t,n,s){const{prog:i}=getEffectiveDayProgram(t),c=i&&dayExercises(t,i).find(e=>e.id===n);if(!c)return;for(let e=0;e<c.sets;e++){if(getSet(t,n,e).done)continue;saveSet(t,n,e,"weight",String(s));const g=document.getElementById("w-"+n+"-"+e);g&&(g.value=s,onWeightInput(n,e))}const o=document.getElementById("exp-"+n);o&&(o.classList.add("applied"),o.innerHTML=`<span>${ic("check")} Charge passée à <b>${fmtKg(s)} kg</b></span>`),showToast("Nouvelle charge : "+fmtKg(s)+" kg")}
function renderExBlock(s,i){if(isSkipped(i,s.id))return`<div class="ex-block">
      <div class="ex-header"><div class="ex-name">${s.name}</div><span class="badge b-optional">Sauté</span></div>
      <div class="ex-body"><div class="ex-skipped"><span>Machine prise ou exercice passé : il ne compte pas dans la progression.</span><button onclick="skipExercise('${i}','${s.id}',false)">Reprendre</button></div></div>
    </div>`;const n=getPRs()[s.id],r=getExNote(i,s.id),o=getLastSession(s.id,i),c=o?topSet(o.sets):null,p=getProgressionSuggestion(s,o);let t="";s.superset?t=`<span class="badge b-superset">Superset ${s.superset}</span>`:s.type==="compound"?t=`<span class="badge b-compound">Compound · ${fmtRest(s.restSec)}</span>`:s.type==="echauffement"?t=`<span class="badge b-rest">Échauffement · ${fmtRest(s.restSec)}</span>`:t=`<span class="badge b-isolation">Isolation · ${fmtRest(s.restSec)}</span>`,s.optional&&(t+='<span class="badge b-optional">Optionnel</span>');let $="";for(let e=0;e<s.sets;e++){const l=getSet(i,s.id,e),d=l.weight!==""?l.weight:c&&c.w>0?c.w:n?n.weight:"",f=l.reps!==""?l.reps:s.defaultReps||"",u=n&&d&&parseFloat(d)>=n.weight,v=s.name.replace(/'/g,"\\'");$+=`
    <div class="set-row" id="setrow-${s.id}-${e}">
      <div class="set-cb${l.done?" done":""}" id="cb-${s.id}-${e}"
        onclick="toggleSet('${i}','${s.id}',${e},'${v}',${s.restSec||90})"></div>
      <div class="input-col">
        <span class="set-lbl">KG</span>
        <input class="si${u?" pr-input":""}" type="number" inputmode="decimal"
          id="w-${s.id}-${e}" value="${d}" placeholder="kg"
          onchange="onWeightChange('${i}','${s.id}',${e},'${v}',this.value)"
          oninput="onWeightInput('${s.id}',${e})">
      </div>
      <div class="input-col">
        <span class="set-lbl">${s.isTime?"SEC":"REPS"}</span>
        <input class="si" type="number" inputmode="numeric"
          id="r-${s.id}-${e}" value="${f}" placeholder="${s.isTime?"sec":"reps"}"
          onchange="onRepsChange('${i}','${s.id}',${e},this.value)">
      </div>
      <div id="pr-${s.id}-${e}" class="pr-flag" data-ex="${s.id}"
        style="display:${u?"inline-block":"none"}">PR</div>
    </div>`}const g=s.name.replace(/'/g,"\\'").replace(/"/g,"&quot;"),b=(r.settings||"").replace(/"/g,"&quot;");let a=0;for(let e=0;e<s.sets;e++)getSet(i,s.id,e).done&&a++;const m=o?`<div class="ex-last">${lastSessionHtml(s,o,c)}</div>`:"",h=p&&a<s.sets?progressionHtml(s,p,i,sets0Applied(i,s,p)):"";return`
  <div class="ex-block">
    <div class="ex-header" onclick="toggleExCard('${s.id}')">
      <div class="ex-name">${s.name}</div>
      ${t}
      <span class="ex-count">${a}/${s.sets}</span><span class="ex-check">${ic("check")}</span>
    </div>
    <div class="ex-body">
    ${a<s.sets?`<div class="ex-actions"><button onclick="postponeExercise('${i}','${s.id}')">Passer à la fin</button>${a===0?`<button onclick="skipExercise('${i}','${s.id}',true)">Sauter</button><button onclick="showSwapModal('${i}','${s.id}')">Remplacer</button>`:""}</div>`:""}
    ${s.swappedFrom?`<div class="ex-swapped">Remplace <b>${escA(s.swappedName||"")}</b>${a===0?` · <button onclick="revertSwap('${i}','${s.id}')">Rétablir</button>`:""}</div>`:""}
    <div class="ex-meta">${s.sets} séries · ${s.repsLabel}${n?` · PR : <b style="color:var(--orange)">${n.weight}kg × ${n.reps}reps</b>`:""}
    </div>
    ${m}${h}
    <div class="sets-wrap">${$}</div>
    <div class="ex-notes">
      <input class="ex-note-inp" type="text" placeholder="Réglages (ex : cran 4, prise large)"
        value="${b}"
        onchange="debounce('ns-${s.id}-${i}',()=>{saveExNote('${i}','${s.id}','settings',this.value);},600)">
      <div class="ex-note-rpe-row">
        <div class="rpe-wrap">
          <span class="set-lbl">RPE /10</span>
          <input class="si rpe-inp" type="number" inputmode="numeric" min="1" max="10" placeholder="—"
            value="${r.rpe||""}"
            onchange="debounce('nr-${s.id}-${i}',()=>{saveExNote('${i}','${s.id}','rpe',this.value);},400)">
        </div>
        ${s.isTime?"":`<button class="warmup-btn" onclick="showWarmupModal('${s.id}','${g}')">Échauffement</button>`}
      </div>
    </div>
    </div>
  </div>`}
function toggleExCard(e){const t=document.getElementById("exc-"+e);t&&t.classList.contains("done")&&t.classList.toggle("open")}
function refreshExCards(d,u){let r=!1,f=!1,a=null,o="";document.querySelectorAll(".ex-card").forEach(e=>{if(e.classList.contains("skipped")){e.classList.remove("active","open","done");return}const v=e.dataset.ex,t=+e.dataset.sets;let i=0;for(let n=0;n<t;n++)getSet(d,v,n).done&&i++;const s=t>0&&i===t;s&&!e.classList.contains("done")&&(f=!0),e.classList.toggle("done",s),s||e.classList.remove("open");let l=!1;s||(r?o&&e.dataset.ss===o&&(l=!0):(l=!0,r=!0,a=e,o=e.dataset.ss||"")),e.classList.toggle("active",l);const c=e.querySelector(".ex-count");c&&(c.textContent=i+"/"+t)}),u&&f&&a&&requestAnimationFrame(()=>a.scrollIntoView({behavior:"smooth",block:"start"}))}
function getTonnageFor(r){const{prog:n}=getEffectiveDayProgram(r),t=gs();if(!n||!t.workouts||!t.workouts[r])return 0;let i=0;return dayExercises(r,n).forEach(e=>{e.isTime||(t.workouts[r][e.id]||[]).forEach(o=>{o&&o.done&&(i+=(parseFloat(o.weight)||0)*(parseFloat(o.reps)||e.defaultReps||10))})}),Math.round(i)}
function restDayHtml(r){const c=(s,t)=>new Date(s+"T12:00:00").toLocaleDateString("fr-FR",t),l=new Date(r+"T12:00:00");let a="";for(let s=1;s<=7&&!a;s++){const t=dateToKey(new Date(l.getFullYear(),l.getMonth(),l.getDate()+s)),{prog:i}=getEffectiveDayProgram(t);i&&i.type!=="rest"&&(a=`<div class="rest-row"><span class="rest-k">Prochaine séance</span><span class="rest-v">${i.fullName}<small>${c(t,{weekday:"long",day:"numeric",month:"long"})}</small></span></div>`)}const e=getActiveDays().filter(s=>s<r).sort().pop();let n="";if(e){const{prog:s}=getEffectiveDayProgram(e),t=getTonnageFor(e);n=`<div class="rest-row"><span class="rest-k">Dernière séance</span><span class="rest-v">${s&&s.type!=="rest"?s.fullName:"Séance"}<small>${c(e,{weekday:"long",day:"numeric",month:"long"})}${t?" · "+t.toLocaleString("fr-FR")+" kg":""}</small></span></div>`}return`<div class="rest-day">
    <div class="rest-msg">REPOS</div>
    <div class="rest-sub">La récupération, c'est aussi de l'entraînement.</div>
  </div>
  <div class="stats-grid">
    <div class="stat-card k-yellow"><div class="stat-v">${computeStreak()}</div><div class="stat-l">Jours de streak</div></div>
    <div class="stat-card k-green"><div class="stat-v">${computeReg()}%</div><div class="stat-l">Régularité 7j</div></div>
  </div>
  ${a||n?`<div class="card">${a}${n}</div>`:""}
  <button class="prog-switch-btn rest-switch" onclick="showProgramPicker('${r}')">Choisir un programme</button>`}
function toggleSet(e,t,s,l,i){const n=!getSet(e,t,s).done;saveSet(e,t,s,"done",n);const g=document.getElementById("cb-"+t+"-"+s);if(g&&g.classList.toggle("done",n),n){const c=supersetNext(e,t,s);if(c){showToast("Superset : enchaîne avec "+c.name);const h=document.getElementById("exc-"+c.id);h&&setTimeout(()=>h.scrollIntoView({behavior:"smooth",block:"center"}),150)}else startTimer(supersetRest(e,t,i),l);const u=document.getElementById("w-"+t+"-"+s),m=document.getElementById("r-"+t+"-"+s),o=u?u.value:"",r=m?m.value:"",a=getSet(e,t,s);a.weight===""&&o&&saveSet(e,t,s,"weight",o),a.reps===""&&r&&saveSet(e,t,s,"reps",r),o&&checkAndShowPR(t,l,o,r)}updateDayProgressBar(e),updateTonnageCard(),refreshExCards(e,!0),maybeFinishDay(e,n)}
function maybeFinishDay(s,o){const t=getDayProgress(s),n=document.getElementById("finishBtn");n&&(n.style.display=t.done>0?"flex":"none"),o&&t.total>0&&t.pct===100&&!getSessionMeta(s).summaryShown&&(updateSessionMeta(s,e=>{e.summaryShown=!0}),dismissTimer(),buzz([120,60,120]),setTimeout(()=>{const e=document.getElementById("prPopup");e&&e.classList.remove("show"),showSummary(s)},900))}
function onWeightChange(o,e,n,h,t){debounce("w-"+e+"-"+n,()=>{saveSet(o,e,n,"weight",t);const c=document.getElementById("r-"+e+"-"+n);t&&checkAndShowPR(e,h,t,c?c.value:"")})}
function onWeightInput(t,n){const e=document.getElementById("w-"+t+"-"+n),c=parseFloat(e?e.value:0),o=getPRs()[t],l=document.getElementById("pr-"+t+"-"+n);l&&(l.style.display=o&&c>o.weight?"inline-block":"none")}
function onRepsChange(o,e,n,s){debounce("r-"+e+"-"+n,()=>saveSet(o,e,n,"reps",s))}
function updateDayProgressBar(t){const s=new Date(t+"T12:00:00"),r=DAY_JS_MAP[s.getDay()],e=getDayProgress(t,r),n=document.getElementById("prog-"+t),o=document.getElementById("progtxt-"+t);n&&(n.style.width=e.pct+"%");const c=document.getElementById("heropct-"+t);c&&(c.textContent=e.pct),o&&(o.textContent=e.done+"/"+e.total+" séries")}
function renderToday(y){const e=todayKey(),{key:l,prog:a}=getEffectiveDayProgram(e),v=getDayProgramOverride(e)!==null,r=document.getElementById("today-content");if(!a){r.innerHTML='<div class="empty">Programme indisponible</div>';return}if(a.type==="rest"){r.innerHTML=restDayHtml(e);return}const t=getDayProgress(e,l),o=getReadiness(e);let c="";if(o){const s=o.score||computeReadinessScore(o);let i,n;s>=4?(i="var(--green)",n=""):s>=3?(i="var(--yellow)",n=""):(i="var(--red)",n=""),c=`<div id="readinessBadge" class="readiness-chip" style="border-color:${i};color:${i};display:inline-flex">${n} ${s}/5</div>`}else c='<div id="readinessBadge" class="readiness-chip" style="display:none"></div>';const p=getTodayTonnage(),g=getFunEquivalent(p),m=v?"":'<span class="prog-suggestion-badge">Suggéré</span>';let d=`
  <div class="chip">${new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})}</div>
  <div class="card hero" style="--c:${progColor(l)}">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:4px">
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <div class="card-title">${a.fullName}</div>
          ${v?'<span class="prog-override-badge">Modifié</span>':m}
        </div>
        <div class="card-sub">Salle de sport</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
        ${c}
        <button class="prog-switch-btn" onclick="showProgramPicker('${e}')">Changer</button>
      </div>
    </div>
    <div class="hero-pct"><span id="heropct-${e}">${t.pct}</span><small>%</small><em id="progtxt-${e}">${t.done}/${t.total} séries</em></div>
    <div class="prog-wrap"><div class="prog-fill" id="prog-${e}" style="width:${t.pct}%"></div></div>
  </div>`;a.exercises.length>0&&(d+='<div class="stitle">Exercices</div>',orderedExercises(e,a).forEach(s=>{const i=isSkipped(e,s.id);d+=`<div class="card ex-card${i?" skipped":""}${s.superset?" ss":""}" id="exc-${s.id}" data-ex="${s.id}" data-sets="${s.sets}" data-ss="${s.superset||""}" style="--c:${progColor(l)}">${renderExBlock(s,e)}</div>`})),d+=`<div class="card tonnage-card" id="tonnageCard" style="${p>0?"display:block":"display:none"}">
    <div class="tn-row">
      <div class="eq-ic">${ic("dumbbell")}</div>
      <div>
        <div class="tn-lbl">Tonnage d'aujourd'hui</div>
        <div id="tonnageVal" class="tn-val">${p.toLocaleString("fr-FR")} kg</div>
        <div id="tonnageEq" class="tn-eq">${g?`soit ${g.count} ${g.name}`:""}</div>
      </div>
    </div>
  </div>`,d+=sessionNoteCardHtml(e),d+=`<button class="finish-btn" id="finishBtn" onclick="showSummary('${e}')" style="display:${t.done>0?"flex":"none"}">${ic("check")} Résumé de la séance</button>`,r.innerHTML=d,refreshExCards(e,!1),y||setTimeout(()=>showReadinessPopup(),900)}
function findExName(e){for(const s of Object.values(PROGRAM)){const n=s.exercises.find(f=>f.id===e);if(n)return n.name}return(gs().exNames||{})[e]||e}
const AVATARS=["red","blue","yellow","green","grey","white"];
const avatarKey=e=>AVATARS.includes(e)?e:"red";
function avatarHtml(a,t){const r=(t||"").trim().charAt(0).toUpperCase();return`<span class="av av-${avatarKey(a)}">${r||ic("dumbbell")}</span>`}
function refreshAvatar(){const a=document.getElementById("avatarDisplay");if(a){const t=getProfile();a.innerHTML=avatarHtml(t.avatar,t.pseudo)}}
function getProfile(){return gs().profile||{pseudo:"",avatar:"red",since:todayKey()}}
function saveProfile(i){const e=gs();e.profile={...getProfile(),...i},ss(e),triggerSave()}
function updateHeaderGreeting(){}
function closeModal(){["warmupModal","readinessModal","resetModal","edConfirmModal","summaryModal","swapModal","goalModal","volModal","importModal","diagModal"].forEach(a=>{const o=document.getElementById(a);o&&o.remove()})}
const escA=e=>String(e??"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const cleanName=e=>String(e||"").replace(/[<>"\\`]/g,"").replace(/\s+/g," ").trim().slice(0,60);
const normName=e=>cleanName(e).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
function knownExercises(){const a={},c=gs().exNames||{};return Object.keys(c).forEach(e=>{a[e]=c[e]}),Object.values(PROGRAM).forEach(e=>e.exercises.forEach(s=>{a[s.id]=s.name})),Object.keys(a).map(e=>({id:e,name:a[e]})).sort((e,s)=>e.name.localeCompare(s.name))}
const SESSION_GAP=27e5;
const fmtTonnage=t=>t>=1e3?(Math.round(t/100)/10).toLocaleString("fr-FR")+" t":Math.round(t).toLocaleString("fr-FR")+" kg";
function getSessionMeta(e){const s=gs();return s.sessionMeta&&s.sessionMeta[e]||{}}
function updateSessionMeta(e,t){const s=gs();s.sessionMeta||(s.sessionMeta={});const n=s.sessionMeta[e]||{};t(n),s.sessionMeta[e]=n,ss(s)}
function touchSession(o){const t=Date.now();updateSessionMeta(o,e=>{if(e.start?e.last&&t-e.last<=SESSION_GAP&&(e.ms=(e.ms||0)+(t-e.last)):(e.start=t,e.ms=0),e.last=t,scheduleReminderSync(),!e.prog){const s=getEffectiveDayProgram(o);s.prog&&s.prog.type!=="rest"&&(e.prog={key:s.key,name:s.prog.fullName})}})}
function recordSessionPR(r,e,p,i,n){updateSessionMeta(r,s=>{s.prs=(s.prs||[]).filter(o=>o.id!==e),s.prs.push({id:e,name:p,w:i,r:n})})}
function findExDef(e){for(const f of Object.values(PROGRAM)){const n=f.exercises.find(s=>s.id===e);if(n)return n}return(gs().exDefs||{})[e]||null}
function inferProgram(s,l){const e=getSessionMeta(s);if(e.prog)return{key:PROGRAM[e.prog.key]?e.prog.key:null,name:e.prog.name||"Séance"};const a=getEffectiveDayProgram(s).key;let n=null,r=0;return Object.keys(PROGRAM).forEach(o=>{const f=PROGRAM[o];if(f.type==="rest")return;const t=f.exercises.filter(c=>l.includes(c.id)).length;(t>r||t===r&&t>0&&o===a)&&(n=o,r=t)}),n?{key:n,name:PROGRAM[n].fullName}:null}
function sessionStats(t){const s=gs(),f=s.workouts&&s.workouts[t]||{},h=s.exNotes&&s.exNotes[t]||{},a=s.sessionMeta&&s.sessionMeta[t]||{},o=[],l=[];let g=0,c=0;Object.keys(f).forEach(e=>{const n=(f[e]||[]).filter(u=>u&&u.done);if(!n.length)return;const i=findExDef(e),r=h[e]||{};c+=n.length,i&&i.isTime||n.forEach(u=>{g+=(parseFloat(u.weight)||0)*(parseFloat(u.reps)||10)});const p=parseFloat(r.rpe);p>0&&l.push(p),o.push({id:e,name:findExName(e),def:i,sets:n,note:r.settings||"",rpe:r.rpe||""})});const d=o.length?inferProgram(t,o.map(e=>e.id)):null;if(d&&d.key){const e=PROGRAM[d.key].exercises.map(n=>n.id);o.sort((n,i)=>{const r=e.indexOf(n.id),p=e.indexOf(i.id);return(r<0?99:r)-(p<0?99:p)})}const m=s.runLogs&&s.runLogs[t]&&s.runLogs[t].done?s.runLogs[t]:null;return{date:t,exs:o,prog:d,run:m,sets:c,tonnage:Math.round(g),rpe:l.length?Math.round(l.reduce((e,n)=>e+n,0)/l.length*10)/10:null,minutes:a.ms>0?Math.max(1,Math.round(a.ms/6e4)):null,start:a.start||null,prs:a.prs||[],note:a.note||"",skipped:(s.skipped&&s.skipped[t]||[]).filter(e=>!o.some(n=>n.id===e)).map(e=>findExName(e))}}
function getSessionDates(){const o=gs(),s=new Set;return Object.keys(o.workouts||{}).forEach(e=>{Object.values(o.workouts[e]||{}).some(t=>(t||[]).some(r=>r&&r.done))&&s.add(e)}),Object.keys(o.runLogs||{}).forEach(e=>{o.runLogs[e]&&o.runLogs[e].done&&s.add(e)}),Array.from(s).sort().reverse()}
const stColor=o=>o.prog&&o.prog.key?progColor(o.prog.key):o.exs.length?"#3A3E48":"var(--c-blue)";
const stName=e=>e.prog?e.prog.name:e.exs.length?"Séance":"Course";
const fmtDateLong=e=>new Date(e+"T12:00:00").toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
const fmtDateShort=t=>new Date(t+"T12:00:00").toLocaleDateString("fr-FR",{day:"numeric",month:"short"});
const runLine=e=>[e.distance?e.distance+" km":"",e.duration?e.duration+" min":"",runPaceSec(e)?fmtPace(runPaceSec(e))+" /km":"",e.rpe?"RPE "+e.rpe:""].filter(Boolean).join(" · ");
function getWeightLog(){return(gs().weightLog||[]).filter(t=>t&&t.date&&t.kg>0).sort((t,g)=>t.date<g.date?-1:1)}
function migrateWeightLog(){const g=gs();!g.weightLog&&g.bodyWeight>0&&(g.weightLog=[{date:todayKey(),kg:g.bodyWeight}],ss(g))}
let _drawerCtx=null;
function saveSessionNote(i,e){const t=String(e??"").slice(0,600);updateSessionMeta(i,n=>{t.trim()?n.note=t:delete n.note}),triggerSave()}
function sessionNoteCardHtml(e){const s=getSessionMeta(e).note||"";return`<div class="card note-card"><span class="set-lbl ed-lbl">NOTES DE LA SÉANCE</span>
    <textarea class="ex-note-inp note-ta" rows="3" maxlength="600" placeholder="Forme du jour, sensations, douleurs, ce qu'il faut améliorer…"
      oninput="debounce('sn-${e}',()=>saveSessionNote('${e}',this.value),700)" onchange="saveSessionNote('${e}',this.value)">${escA(s)}</textarea></div>`}
const getSkipped=e=>{const p=gs();return p.skipped&&p.skipped[e]||[]};
const isSkipped=(e,i)=>getSkipped(e).includes(i);
const baseId=d=>d.swappedFrom||d.id;
function orderedExercises(t,n){const r=dayExercises(t,n),o=(gs().dayOrder||{})[t];let s=r;if(o&&o.length){const c={};r.forEach(e=>{c[baseId(e)]=e}),s=o.map(e=>c[e]).filter(Boolean),r.forEach(e=>{s.includes(e)||s.push(e)})}return groupSupersets(s)}
function groupSupersets(t){const e=[],u=new Set;return t.forEach(s=>{u.has(s)||(e.push(s),u.add(s),s.superset&&t.forEach(r=>{!u.has(r)&&r.superset===s.superset&&(e.push(r),u.add(r))}))}),e}
function rerenderDay(t,r){const o=document.getElementById("dayDrawer");if(t===todayKey()&&renderToday(!0),o&&o.classList.contains("open")&&_drawerCtx&&_drawerCtx.dateKey===t){const e=document.getElementById("drawerBody"),a=e.scrollTop;openDayDrawer(_drawerCtx.dayName,t),e.scrollTop=a}if(r&&t===todayKey()){const e=document.querySelector("#today-content .ex-card.active");e&&requestAnimationFrame(()=>e.scrollIntoView({behavior:"smooth",block:"start"}))}}
function skipExercise(s,r,i){const e=gs();e.skipped||(e.skipped={});const p=(e.skipped[s]||[]).filter(t=>t!==r);i&&p.push(r),p.length?e.skipped[s]=p:delete e.skipped[s],ss(e),triggerSave(),rerenderDay(s,i),showToast(i?"Exercice sauté":"Exercice repris"),i&&maybeFinishDay(s,!0)}
function postponeExercise(e,s){const{prog:n}=getEffectiveDayProgram(e);if(!n)return;const r=orderedExercises(e,n),a=r.find(d=>d.id===s);if(!a)return;if(r[r.length-1].id===s){showToast("C'est déjà le dernier exercice");return}const t=gs();t.dayOrder||(t.dayOrder={}),t.dayOrder[e]=r.filter(d=>d.id!==s).map(baseId).concat(baseId(a)),ss(t),triggerSave(),rerenderDay(e,!0),showToast("Reporté à la fin de la séance")}
function runForDay(r){const n=RUN_WEEKLY[r];return n&&RUNS[n]?Object.assign({id:n},RUNS[n]):null}
function runPlanList(){return DAYS_ORDER.map(n=>({day:n,run:runForDay(n)})).filter(n=>n.run)}
const fmtKm=t=>String(Math.round(t*10)/10).replace(".",",");
function parsePace(a){const t=String(a??"").trim().replace(",",".");if(!t)return 0;const n=t.match(/^(\d{1,2}):(\d{1,2})$/);if(n)return+n[1]*60+Math.min(59,+n[2]);const r=parseFloat(t);return r>0&&r<30?Math.round(r*60):0}
function runGoalHtml(t,s){const e=[];if(t.targetDistance&&e.push(fmtKm(t.targetDistance)+" km"),t.targetDuration&&e.push(t.targetDuration+" min"),t.targetPace&&e.push(fmtPace(t.targetPace)+" /km"),!e.length)return"";const a=[],c=parseFloat(String(s.distance||"").replace(",",".")),r=parseFloat(s.duration),n=runPaceSec(s);if(t.targetDistance&&c>0&&a.push(c>=t.targetDistance?"distance atteinte":"−"+fmtKm(t.targetDistance-c)+" km"),t.targetDuration&&r>0&&a.push(r>=t.targetDuration?"durée atteinte":"−"+Math.round(t.targetDuration-r)+" min"),t.targetPace&&n>0){const i=n-t.targetPace;a.push(i<=0?"allure tenue ("+(i<0?"−"+Math.abs(i)+" s/km":"pile")+")":"+"+i+" s/km")}return`Objectif : <b>${e.join(" · ")}</b>${a.length?` — ${a.join(" · ")}`:""}`}
function weekDateKeys(){const e=new Date;e.setHours(0,0,0,0);const t=new Date(e);t.setDate(e.getDate()-(e.getDay()+6)%7);const a={};return DAYS_ORDER.forEach((D,o)=>{const n=new Date(t);n.setDate(t.getDate()+o),a[D]=dateToKey(n)}),a}
function runPaceSec(t){const a=parseFloat(t&&t.duration),n=parseFloat(String(t&&t.distance||"").replace(",","."));return a>0&&n>0?Math.round(a*60/n):0}
function fmtPace(t){if(!t)return"";const r=Math.round(t);return Math.floor(r/60)+":"+String(r%60).padStart(2,"0")}
function paceHtml(n){const e=runPaceSec(n);return e?`Allure moyenne : <b>${fmtPace(e)}</b> /km`:"Allure moyenne : renseigne la durée et la distance"}
function updateRunPaceUI(e){const n=document.getElementById("pace-"+e);n&&(n.innerHTML=paceHtml(getRunLog(e)));const t=document.getElementById("rgoal-"+e);if(t){const o=runForDay(DAY_JS_MAP[new Date(e+"T12:00:00").getDay()]);t.innerHTML=o?runGoalHtml(o,getRunLog(e)):""}}
function fmtDuration(n){const t=Math.round(n);return t>=60?Math.floor(t/60)+"h"+String(t%60).padStart(2,"0"):t+" min"}
function handleHash(){const a=(location.hash||"").replace("#","");if(!(!a||!TABS.includes(a))){switchTab(a);try{history.replaceState(null,"",location.pathname+location.search)}catch{}}}
function dayExercises(r,s){if(!s)return[];const e=(gs().swaps||{})[r];return e?s.exercises.map(i=>e[i.id]||i):s.exercises}
function supersetNext(t,l,s){const{prog:i}=getEffectiveDayProgram(t);if(!i)return null;const u=orderedExercises(t,i).filter(e=>!isSkipped(t,e.id)),r=u.find(e=>e.id===l);if(!r||!r.superset)return null;const n=u.filter(e=>e.superset===r.superset);return n.length<2?null:n.slice(n.indexOf(r)+1).find(e=>s<e.sets&&!getSet(t,e.id,s).done)||null}
function supersetRest(r,p,s){const{prog:i}=getEffectiveDayProgram(r);if(!i)return s||90;const n=orderedExercises(r,i).filter(e=>!isSkipped(r,e.id)),t=n.find(e=>e.id===p);return!t||!t.superset?s||90:Math.max(...n.filter(e=>e.superset===t.superset).map(e=>e.restSec||90))}
const dayNum=e=>Math.round(new Date(e+"T12:00:00").getTime()/864e5);
function backupDue(){const n=gs(),e=getSessionDates();if(e.length<3||Date.now()<((n.prefs||{}).backupSnooze||0))return null;if(n.lastBackup){const t=Math.floor((Date.now()-n.lastBackup)/864e5);return t>=30?{days:t}:null}return dayNum(todayKey())-dayNum(e[e.length-1])>=7?{days:null}:null}
function renderBackupBanner(){let e=document.getElementById("backupBanner");if(!e){e=document.createElement("div"),e.id="backupBanner";const n=document.querySelector(".hdr");n&&n.parentNode?n.parentNode.insertBefore(e,n.nextSibling):document.body.prepend(e)}const a=backupDue();if(!a){e.innerHTML="",e.className="";return}e.className="bk-banner",e.innerHTML=`<div class="bk-banner-tx"><b>Pense à sauvegarder tes données</b><span>${a.days!=null?`Dernière sauvegarde il y a ${a.days} jours. `:"Tu n'as encore jamais sauvegardé. "}Elles ne sont que sur cet appareil.</span></div>
    <button class="bk-banner-btn" onclick="exportData()">Sauvegarder</button>
    <button class="bk-banner-x" onclick="snoozeBackup()" aria-label="Me le rappeler plus tard">${ic("close")}</button>`}
function snoozeBackup(){const s=gs();s.prefs=Object.assign({},s.prefs||{}),s.prefs.backupSnooze=Date.now()+7*864e5,ss(s),renderBackupBanner(),showToast("Rappel repoussé de 7 jours")}
function maybeRequestPersist(){try{if(!navigator.storage||!navigator.storage.persist||getSessionDates().length<3)return;const s=gs();if((s.prefs||{}).persistAsked)return;s.prefs=Object.assign({},s.prefs||{}),s.prefs.persistAsked=!0,ss(s),navigator.storage.persisted().then(e=>{e||navigator.storage.persist()}).catch(()=>{})}catch{}}
const swReady=(e=2500)=>Promise.race([navigator.serviceWorker.ready,new Promise(r=>setTimeout(()=>r(null),e))]);