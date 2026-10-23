/* GymAddict — module « editor » (chargé à la demande) */
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