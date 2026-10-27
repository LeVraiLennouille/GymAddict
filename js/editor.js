const ED_MUSCLES=[["pecs","Pecs"],["dos","Dos"],["epaules","Épaules"],["biceps","Biceps"],["triceps","Triceps"],["abdos","Abdos"],["jambes","Jambes"]];
const ED_COLORS=["red","blue","yellow","green"];
const ED_COLOR_NAMES={red:"Rouge",blue:"Bleu",yellow:"Jaune",green:"Vert"};
const ED_REST_OPTS=[30,45,60,75,90,120,150,180,240,300];
const ED_TYPES=[["compound","Compound"],["isolation","Isolation"],["echauffement","Échauffement"]];
let _ed={view:"home",key:null,open:null,pendingDel:null};
function exSummary(e){return`${e.sets} × ${escA(e.repsLabel)} · repos ${fmtRest(e.restSec)}${e.superset?" · Superset "+e.superset:""}`}
const edProg=()=>_progCfg.programs[_ed.key];
const edSave=()=>saveProgramConfig();
function openProgramEditor(){closeProgramEditor(!0),_ed={view:"home",key:null,open:null,pendingDel:null};const e=document.createElement("div");e.className="ed-sheet",e.id="edSheet",e.setAttribute("role","dialog"),e.setAttribute("aria-label","Éditeur de programme"),e.innerHTML='<div class="ed-hdr"><button class="drawer-close" id="edBack" onclick="edBack()" aria-label="Retour"></button><div class="drawer-title" id="edTitle"></div></div><div class="ed-body" id="edBody"></div>',document.body.appendChild(e),document.body.style.overflow="hidden",edRender(),requestAnimationFrame(()=>e.classList.add("open"))}
function closeProgramEditor(r){const e=document.getElementById("edSheet");e&&(e.remove(),document.body.style.overflow="",r||(renderWeek(),renderToday(),renderCardio()))}
function edBack(){if(_ed.view==="run"){_ed.view="home",_ed.runKey=null,edRender();return}_ed.view==="prog"?(_ed.view="home",_ed.key=null,_ed.open=null,_ed.pendingDel=null,edRender()):closeProgramEditor()}
function edRender(){const e=document.getElementById("edBody");if(!e)return;const n=document.getElementById("edTitle"),t=document.getElementById("edBack");if(_ed.view==="prog"&&!edProg()&&(_ed.view="home"),_ed.view==="run"){const d=_progCfg.runs[_ed.runKey];if(d){n.textContent=d.name,t.innerHTML=ic("back"),e.innerHTML=edRunHtml();return}_ed.view="home"}_ed.view==="prog"?(n.textContent=edProg().fullName,t.innerHTML=ic("back"),e.innerHTML=edProgHtml()):(n.textContent="Mes séances",t.innerHTML=ic("close"),e.innerHTML=edHomeHtml())}
function edHomeHtml(){const i=_progCfg,o=e=>i.order.map(s=>`<option value="${s}"${s===e?" selected":""}>${escA(i.programs[s].fullName)}</option>`).join(""),n=DAYS_ORDER.map(e=>`<div class="ed-day"><span class="ed-day-n">${DAY_LABELS[e]}</span><select class="si ed-sel" aria-label="Séance du ${DAY_LABELS[e]}" onchange="edSetDay('${e}',this.value)">${o(i.weekly[e])}</select></div>`).join(""),d=i.order.map(e=>{const s=i.programs[e],c=s.type==="rest",a=s.exercises.length;return`<div class="prog-pick-item ed-prog${c?" ed-fixed":""}"${c?"":` onclick="edOpenProg('${e}')"`}>
      <span class="prog-pick-icon" style="--c:${progColor(e)}"></span>
      <div class="prog-pick-info"><div class="prog-pick-name">${escA(s.fullName)}</div><div class="prog-pick-meta">${c?"Jour de repos (fixe)":a+" exercice"+(a>1?"s":"")}</div></div>
      ${c?"":ic("chev")}</div>`}).join("");return`<div class="ed-hint">Choisis la séance suggérée pour chaque jour. Tu pourras toujours en changer au quotidien depuis l'écran Séance.</div>
    <div class="stitle">Semaine type</div>
    <div class="card ed-days">${n}</div>
    <div class="stitle">Séances</div>
    <div class="ed-list">${d}</div>
    <button class="btn-calc ed-add" onclick="edNewProg()">${ic("plus")} Nouvelle séance</button>
    ${edRunSectionHtml()}
    <button class="ed-reset" onclick="edConfirmReset()">${ic("undo")} Rétablir le programme d'origine</button>`}
function edSetDay(r,e){_progCfg.programs[e]&&(_progCfg.weekly[r]=e,edSave())}
function edOpenProg(e){if(!_progCfg.programs[e]||_progCfg.programs[e].type==="rest")return;_ed.view="prog",_ed.key=e,_ed.open=null,_ed.pendingDel=null,edRender();const o=document.getElementById("edBody");o&&(o.scrollTop=0)}
function edNewProg(){const e="p_"+Date.now().toString(36);_progCfg.programs[e]={label:"Nouvelle séance",fullName:"Nouvelle séance",type:"gym",color:"green",exercises:[]},_progCfg.order.push(e),edSave(),edOpenProg(e);const o=document.getElementById("edProgName");o&&(o.focus(),o.select())}
function edProgHtml(){const s=edProg(),n=ED_COLORS.map(e=>`<button class="ed-sw${s.color===e?" on":""}" style="--c:${COLOR_MAP[e]}" onclick="edSetColor('${e}')" aria-label="${ED_COLOR_NAMES[e]}" aria-pressed="${s.color===e}"></button>`).join(""),t=s.exercises.length,l=t?s.exercises.map((e,o)=>edExHtml(e,o,t)).join(""):`<div class="empty">Aucun exercice pour l'instant.<br>Ajoute le premier ci-dessous.</div>`,a=knownExercises().map(e=>`<option value="${escA(e.name)}"></option>`).join("");return`<div class="card ed-card">
      <span class="set-lbl ed-lbl">NOM DE LA SÉANCE</span>
      <input class="ex-note-inp" id="edProgName" type="text" maxlength="40" value="${escA(s.fullName)}" onchange="edRenameProg(this.value)" autocomplete="off">
      <span class="set-lbl ed-lbl">COULEUR</span>
      <div class="ed-sws">${n}</div>
    </div>
    <div class="stitle">Exercices <span>${t}</span></div>
    ${l}
    <button class="btn-calc ed-add" onclick="edAddEx()">${ic("plus")} Ajouter un exercice</button>
    <button class="btn-danger ed-delprog" onclick="edConfirmDelProg()">Supprimer cette séance</button>
    <datalist id="edExNames">${a}</datalist>`}
function edRenameProg(a){const t=edProg(),e=cleanName(a);if(!e){const o=document.getElementById("edProgName");o&&(o.value=t.fullName),showToast("Le nom ne peut pas être vide");return}t.fullName=e,t.label=e,edSave();const n=document.getElementById("edTitle");n&&(n.textContent=e)}
function edSetColor(t){edProg().color=t,edSave(),document.querySelectorAll(".ed-sw").forEach(e=>{const o=e.getAttribute("aria-label")===ED_COLOR_NAMES[t];e.classList.toggle("on",o),e.setAttribute("aria-pressed",o)})}
function edExHtml(d,e,c){const n=_ed.open===e,a=_ed.pendingDel===e;return`<div class="card ed-ex${n?" open":""}">
    <div class="ed-ex-row">
      <div class="ed-ex-info" onclick="edToggleEx(${e})" role="button" tabindex="0" aria-expanded="${n}">
        <div class="ed-ex-name" id="ednm-${e}">${escA(d.name)}</div>
        <div class="ed-ex-sum" id="edsum-${e}">${exSummary(d)}</div>
      </div>
      <div class="ed-ex-btns">
        <button class="ed-ib" ${e===0?"disabled":""} onclick="edMoveEx(${e},-1)" aria-label="Monter">${ic("up")}</button>
        <button class="ed-ib" ${e===c-1?"disabled":""} onclick="edMoveEx(${e},1)" aria-label="Descendre">${ic("down")}</button>
        <button class="ed-ib${a?" warn":""}" onclick="edDelEx(${e})" aria-label="Supprimer l'exercice">${a?"Sûr ?":ic("trash")}</button>
      </div>
    </div>
    ${n?edExForm(d,e):""}
  </div>`}
function edExForm(e,n){const l=exRepFields(e),c=(ED_REST_OPTS.includes(e.restSec)?ED_REST_OPTS:ED_REST_OPTS.concat(e.restSec).sort((s,t)=>s-t)).map(s=>`<option value="${s}"${s===e.restSec?" selected":""}>${fmtRest(s)}</option>`).join(""),a=ED_TYPES.map(([s,t])=>`<button class="ed-chip${e.type===s?" on":""}" onclick="edType(${n},'${s}')">${t}</button>`).join(""),i=ED_MUSCLES.map(([s,t])=>`<button class="ed-chip${e.muscles.includes(s)?" on":""}" onclick="edMuscle(${n},'${s}')">${t}</button>`).join("");return`<div class="ed-form">
    <span class="set-lbl ed-lbl">NOM</span>
    <input class="ex-note-inp" id="edname-${n}" list="edExNames" type="text" maxlength="60" value="${escA(e.name)}" onchange="edName(${n},this.value)" autocomplete="off">
    <div class="ed-grid">
      <div class="input-col"><span class="set-lbl">SÉRIES</span><input class="si" type="number" inputmode="numeric" min="1" max="12" value="${e.sets}" onchange="edNum(${n},this)"></div>
      <div class="input-col"><span class="set-lbl">${e.isTime?"SEC MIN":"REPS MIN"}</span><input class="si" id="edmin-${n}" type="number" inputmode="numeric" min="1" value="${l.min}" ${l.failure?"disabled":""} onchange="edReps(${n})"></div>
      <div class="input-col"><span class="set-lbl">${e.isTime?"SEC MAX":"REPS MAX"}</span><input class="si" id="edmax-${n}" type="number" inputmode="numeric" min="1" value="${l.max}" ${l.failure?"disabled":""} onchange="edReps(${n})"></div>
    </div>
    <div class="ed-chips">
      <button class="ed-chip${l.failure?" on":""}" onclick="edToggle(${n},'failure')">À l'échec</button>
      <button class="ed-chip${e.isTime?" on":""}" onclick="edToggle(${n},'isTime')">Au temps (sec)</button>
    </div>
    <span class="set-lbl ed-lbl">TYPE</span>
    <div class="ed-chips">${a}</div>
    <span class="set-lbl ed-lbl">SUPERSET <span style="text-transform:none;letter-spacing:0">(même lettre = enchaînés, un seul repos)</span></span>
    <div class="ed-chips">${["","A","B","C","D"].map(s=>`<button class="ed-chip${(e.superset||"")===s?" on":""}" onclick="edSuperset(${n},'${s}')">${s||"Aucun"}</button>`).join("")}</div>
    <div class="ed-grid2">
      <div class="input-col"><span class="set-lbl">REPOS</span><select class="si" onchange="edRest(${n},this.value)">${c}</select></div>
      <div class="input-col"><span class="set-lbl">PROGRESSION (+KG)</span><input class="si" type="number" inputmode="decimal" step="0.25" min="0.25" placeholder="2,5" value="${e.step>0?e.step:""}" onchange="edStep(${n},this.value)"></div>
    </div>
    <span class="set-lbl ed-lbl">MUSCLES TRAVAILLÉS (RADAR)</span>
    <div class="ed-chips">${i}</div>
  </div>`}
function edToggleEx(e){_ed.open=_ed.open===e?null:e,_ed.pendingDel=null,edRender()}
function edRefreshSum(e){const m=edProg().exercises[e],n=document.getElementById("edsum-"+e);n&&(n.innerHTML=exSummary(m))}
function edMoveEx(n,o){const d=edProg().exercises,e=n+o;e<0||e>=d.length||([d[n],d[e]]=[d[e],d[n]],_ed.open===n?_ed.open=e:_ed.open===e&&(_ed.open=n),_ed.pendingDel=null,edSave(),edRender())}
function edDelEx(e){if(_ed.pendingDel===e){edProg().exercises.splice(e,1),_ed.open===e?_ed.open=null:_ed.open>e&&_ed.open--,_ed.pendingDel=null,edSave(),edRender(),showToast("Exercice retiré (historique conservé)");return}_ed.pendingDel=e,edRender(),setTimeout(()=>{_ed.pendingDel===e&&(_ed.pendingDel=null,edRender())},3e3)}
function edAddEx(){const n=edProg();if(n.exercises.length>=30){showToast("30 exercices maximum par séance");return}n.exercises.push({id:"x_"+Date.now().toString(36)+Math.random().toString(36).slice(2,5),name:"Nouvel exercice",sets:3,repsLabel:"8-12 reps",defaultReps:10,type:"compound",muscles:[],restSec:90}),_ed.open=n.exercises.length-1,_ed.pendingDel=null,edSave(),edRender();const e=document.getElementById("edname-"+_ed.open);e&&(e.scrollIntoView({block:"center"}),e.focus(),e.select())}
function edName(n,i){const e=edProg().exercises[n],d=cleanName(i),m=document.getElementById("edname-"+n);if(!d){m&&(m.value=e.name),showToast("Le nom ne peut pas être vide");return}if(e.name=d,/^x_/.test(e.id)){const t=knownExercises().find(a=>a.id!==e.id&&normName(a.name)===normName(d));t&&!edProg().exercises.some((a,s)=>s!==n&&a.id===t.id)&&(e.id=t.id,e.name=t.name)}m&&(m.value=e.name);const o=document.getElementById("ednm-"+n);o&&(o.textContent=e.name),edSave()}
function edNum(s,a){const e=edProg().exercises[s];e.sets=Math.min(12,Math.max(1,parseInt(a.value)||e.sets)),a.value=e.sets,edSave(),edRefreshSum(s)}
function edReps(a){const t=edProg().exercises[a],d=document.getElementById("edmin-"+a),s=document.getElementById("edmax-"+a),e=Math.max(1,parseInt(d.value)||1),n=Math.max(e,parseInt(s.value)||e);d.value=e,s.value=n,t.repsLabel=buildRepsLabel(t,e,n),t.defaultReps=Math.round((e+n)/2),edSave(),edRefreshSum(a)}
function edToggle(l,s){const e=edProg().exercises[l];if(s==="failure")exRepFields(e).failure?e.repsLabel=buildRepsLabel(e,e.defaultReps,e.defaultReps):e.repsLabel="Échec";else if(s==="isTime"){const i=exRepFields(e);e.isTime?delete e.isTime:e.isTime=!0,i.failure||(e.repsLabel=buildRepsLabel(e,i.min,i.max))}edSave(),edRender()}
function edSuperset(d,e){const s=edProg().exercises[d];e?s.superset=e:delete s.superset,edSave(),edRender()}
function edType(e,d){edProg().exercises[e].type=d,edSave(),edRender()}
function edRest(e,s){edProg().exercises[e].restSec=parseInt(s)||90,edSave(),edRefreshSum(e)}
function edStep(s,n){const e=edProg().exercises[s],t=parseFloat(String(n).replace(",","."));t>0?e.step=Math.min(50,t):delete e.step,edSave()}
function edMuscle(c,s){const e=edProg().exercises[c];e.muscles=e.muscles.includes(s)?e.muscles.filter(l=>l!==s):e.muscles.concat(s),edSave(),edRender()}
function edConfirm(d,o,l,e){document.body.insertAdjacentHTML("beforeend",`<div class="modal-overlay" id="edConfirmModal" onclick="if(event.target.id==='edConfirmModal')closeModal()">
    <div class="modal-box" style="max-width:360px">
      <div class="modal-hdr"><div class="modal-title" style="color:var(--red)">${d}</div></div>
      <div style="font-size:13px;color:var(--dim);margin:12px 0 20px;line-height:1.6">${o}</div>
      <div style="display:flex;gap:10px">
        <button class="run-done-btn" style="flex:1;margin-top:0;background:none;border:1.5px solid var(--border);color:var(--muted)" onclick="closeModal()">Annuler</button>
        <button class="btn-danger" style="flex:1" onclick="${e}()">${l}</button>
      </div>
    </div></div>`)}
function edConfirmDelProg(){edConfirm("Supprimer la séance ?",`« ${escA(edProg().fullName)} » sera retirée de ton programme. Ton historique est conservé.`,"Supprimer","edDoDelProg")}
function edDoDelProg(){const r=_ed.key;delete _progCfg.programs[r],_progCfg.order=_progCfg.order.filter(e=>e!==r),DAYS_ORDER.forEach(e=>{_progCfg.weekly[e]===r&&(_progCfg.weekly[e]="repos")});const o=gs();o.dayProgram&&(Object.keys(o.dayProgram).forEach(e=>{o.dayProgram[e]===r&&delete o.dayProgram[e]}),ss(o)),edSave(),closeModal(),_ed.view="home",_ed.key=null,_ed.open=null,edRender(),showToast("Séance supprimée")}
function edConfirmReset(){edConfirm("Rétablir le programme ?","Tes séances et ta semaine type reviennent au programme d'origine. Ton historique (charges, records, stats) n'est pas touché.","Rétablir","edDoReset")}
function edDoReset(){_progCfg=defaultProgramConfig(),edSave(),closeModal(),_ed.view="home",_ed.key=null,_ed.open=null,edRender(),showToast("Programme d'origine rétabli")}
function edRunSectionHtml(){const i=_progCfg,a=s=>'<option value="">Aucune</option>'+i.runOrder.map(e=>`<option value="${e}"${e===s?" selected":""}>${escA(i.runs[e].name)}</option>`).join(""),t=DAYS_ORDER.map(s=>`<div class="ed-day"><span class="ed-day-n">${DAY_LABELS[s]}</span><select class="si ed-sel" aria-label="Sortie du ${DAY_LABELS[s]}" onchange="edRunSetDay('${s}',this.value)">${a(i.runWeekly[s])}</select></div>`).join(""),n=i.runOrder.map(s=>{const e=i.runs[s],c=[e.targetDistance?fmtKm(e.targetDistance)+" km":"",e.targetDuration?e.targetDuration+" min":"",e.targetPace?fmtPace(e.targetPace)+" /km":""].filter(Boolean).join(" · ");return`<div class="prog-pick-item ed-prog" onclick="edOpenRun('${s}')"><span class="prog-pick-icon" style="--c:var(--c-blue)"></span>
      <div class="prog-pick-info"><div class="prog-pick-name">${escA(e.name)}</div><div class="prog-pick-meta">${c||"Sans objectif"}</div></div>${ic("chev")}</div>`}).join("");return`<div class="stitle" style="margin-top:22px">Course à pied</div>
    <div class="ed-hint">Choisis les jours de sortie (en plus de la salle) et personnalise chaque type de sortie.</div>
    <div class="card ed-days" style="margin-top:10px">${t}</div>
    <div class="card ed-card"><span class="set-lbl ed-lbl">OBJECTIF DE DISTANCE PAR SEMAINE (KM, OPTIONNEL)</span>
      <input class="si" type="number" inputmode="decimal" min="0" max="500" step="0.5" value="${i.weeklyKm||""}" placeholder="ex. 20" onchange="edWeeklyKm(this.value)" aria-label="Objectif de distance hebdomadaire"></div>
    <div class="stitle">Types de sorties</div>
    <div class="ed-list">${n||'<div class="empty">Aucun type de sortie.</div>'}</div>
    <button class="btn-calc ed-add" onclick="edNewRun()">${ic("plus")} Nouvelle sortie</button>`}
function edRunSetDay(n,e){_progCfg.runWeekly[n]=_progCfg.runs[e]?e:"",edSave()}
function edWeeklyKm(e){_progCfg.weeklyKm=numIn(e,0,500),edSave()}
function edNewRun(){const e="r_"+Date.now().toString(36);_progCfg.runs[e]={name:"Nouvelle sortie",desc:"",detail:"",targetDistance:0,targetDuration:0,targetPace:0},_progCfg.runOrder.push(e),edSave(),edOpenRun(e);const t=document.getElementById("edRunName");t&&(t.focus(),t.select())}
function edOpenRun(e){if(!_progCfg.runs[e])return;_ed.view="run",_ed.runKey=e,edRender();const n=document.getElementById("edBody");n&&(n.scrollTop=0)}
function edRunHtml(){const e=_progCfg.runs[_ed.runKey];return`<div class="card ed-card">
      <span class="set-lbl ed-lbl">NOM DE LA SORTIE</span>
      <input class="ex-note-inp" id="edRunName" type="text" maxlength="40" value="${escA(e.name)}" onchange="edRunField('name',this.value)" autocomplete="off">
      <span class="set-lbl ed-lbl">DESCRIPTION</span>
      <input class="ex-note-inp" type="text" maxlength="240" value="${escA(e.desc)}" placeholder="But de la sortie" onchange="edRunField('desc',this.value)">
      <span class="set-lbl ed-lbl">DÉROULÉ</span>
      <input class="ex-note-inp" type="text" maxlength="240" value="${escA(e.detail)}" placeholder="ex. 10 min échauffement · 5 × 1 km · retour au calme" onchange="edRunField('detail',this.value)">
      <span class="set-lbl ed-lbl">OBJECTIFS (OPTIONNELS)</span>
      <div class="ed-grid">
        <div class="input-col"><span class="set-lbl">DISTANCE (KM)</span><input class="si" type="number" inputmode="decimal" step="0.1" min="0" value="${e.targetDistance||""}" placeholder="—" onchange="edRunField('targetDistance',this.value)"></div>
        <div class="input-col"><span class="set-lbl">DURÉE (MIN)</span><input class="si" type="number" inputmode="numeric" min="0" value="${e.targetDuration||""}" placeholder="—" onchange="edRunField('targetDuration',this.value)"></div>
        <div class="input-col"><span class="set-lbl">ALLURE /KM</span><input class="si" type="text" inputmode="numeric" value="${e.targetPace?fmtPace(e.targetPace):""}" placeholder="5:30" onchange="edRunField('targetPace',this.value)"></div>
      </div>
    </div>
    <div class="ed-hint">Les objectifs s'affichent sur la carte de la sortie, dans le planning, et sont comparés à ton résultat.</div>
    <button class="btn-danger ed-delprog" onclick="edConfirmDelRun()">Supprimer cette sortie</button>`}
function edRunField(e,t){const n=_progCfg.runs[_ed.runKey];if(n){if(e==="name"){const a=cleanName(t);if(!a){showToast("Le nom ne peut pas être vide");const r=document.getElementById("edRunName");r&&(r.value=n.name);return}n.name=a;const d=document.getElementById("edTitle");d&&(d.textContent=a)}else if(e==="desc"||e==="detail")n[e]=txtClean(t,240);else if(e==="targetPace"){n.targetPace=numIn(parsePace(t),0,1800),edSave(),edRender();return}else n[e]=numIn(t,0,e==="targetDistance"?200:600);edSave()}}
function edConfirmDelRun(){edConfirm("Supprimer la sortie ?",`« ${escA(_progCfg.runs[_ed.runKey].name)} » sera retirée de ton planning. Tes sorties déjà enregistrées sont conservées.`,"Supprimer","edDoDelRun")}
function edDoDelRun(){const r=_ed.runKey;delete _progCfg.runs[r],_progCfg.runOrder=_progCfg.runOrder.filter(e=>e!==r),DAYS_ORDER.forEach(e=>{_progCfg.runWeekly[e]===r&&(_progCfg.runWeekly[e]="")}),edSave(),closeModal(),_ed.view="home",_ed.runKey=null,edRender(),showToast("Sortie supprimée")}