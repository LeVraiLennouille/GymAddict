/* GymAddict — module « history » (chargé à la demande) */
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