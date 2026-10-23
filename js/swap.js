/* GymAddict — module « swap » (chargé à la demande) */
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