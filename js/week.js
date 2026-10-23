/* GymAddict — module « week » (chargé à la demande) */
function renderWeek(){
  const todayName=getDayName();
  const el=document.getElementById('week-content');
  let html=`<div class="week-top"><div class="chip">Programme de la semaine</div><button class="prog-switch-btn ed-open" onclick="openProgramEditor()">${ic('edit')} Modifier</button></div>`;
  const WK=weekDateKeys();
  html+=weekCardioHtml(WK);
  DAYS_ORDER.forEach(dayName=>{
    const sugKey=WEEKLY_SUGGESTIONS[dayName]||'repos';
    const prog=PROGRAM[sugKey];
    const isToday=dayName===todayName;
    const dateKey=WK[dayName];
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
        ${weekRunLineHtml(dayName,dateKey)}
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
function openDayDrawer(dayName,dateKey){
  const {key:pKey,prog}=getEffectiveDayProgram(dateKey);
  if(!prog||prog.type==='rest')return;
  _drawerCtx={dayName,dateKey};
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
    orderedExercises(dateKey,prog).forEach(ex=>{html+=renderExBlock(ex,dateKey);});
    html+=`</div>`;
  }

  html+=sessionNoteCardHtml(dateKey);
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
function weekRunLineHtml(dayName,dateKey){
  const run=runForDay(dayName);if(!run)return '';
  const rl=getRunLog(dateKey),pace=runPaceSec(rl);
  const stats=[rl.distance?rl.distance+' km':'',rl.duration?rl.duration+' min':'',pace?fmtPace(pace)+' /km':''].filter(Boolean).join(' · ');
  const tgt=[run.targetDistance?fmtKm(run.targetDistance)+' km':'',run.targetDuration?run.targetDuration+' min':'',run.targetPace?fmtPace(run.targetPace)+' /km':''].filter(Boolean).join(' · ');
  return `<div class="wrun${rl.done?' done':''}" onclick="event.stopPropagation();openRun('${dateKey}')" role="button" tabindex="0">${ic(rl.done?'check':'pulse')}<span><b>${escA(run.name)}</b>${rl.done?(stats?' · '+stats:' · faite'):(tgt?' · '+tgt:' · à faire')}</span></div>`;
}
function weekCardioHtml(WK){
  const plan=runPlanList();
  if(!plan.length&&!WEEKLY_KM)return '';
  let done=0,km=0,min=0,paceDur=0,paceDist=0;
  plan.forEach(({day})=>{
    const rl=getRunLog(WK[day]);
    if(rl.done)done++;
    const dur=parseFloat(rl.duration)||0,dist=parseFloat(String(rl.distance||'').replace(',','.'))||0;
    km+=dist;min+=dur;
    if(dur>0&&dist>0){paceDur+=dur;paceDist+=dist;}
  });
  const pace=paceDist>0?fmtPace(paceDur*60/paceDist):'—';
  const cells=[['Sorties',done+'/'+plan.length],['Distance',km>0?fmtKm(km)+' km':'—'],['Durée',min>0?fmtDuration(min):'—'],['Allure /km',pace]];
  const kmBar=WEEKLY_KM>0?`<div class="wk-km"><div class="goal-meta"><span>Objectif distance</span><span>${fmtKm(km)} / ${fmtKm(WEEKLY_KM)} km</span></div><div class="goal-bar"><i style="width:${Math.min(100,Math.round(km/WEEKLY_KM*100))}%"></i></div></div>`:'';
  return `<div class="card wk-cardio"><div class="stitle">Cardio de la semaine</div>
    <div class="sum-grid wk-grid">${cells.map(([l,v])=>`<div class="sum-cell"><div class="sum-v">${v}</div><div class="sum-l">${l}</div></div>`).join('')}</div>${kmBar}</div>`;
}
function openRun(k){
  return switchTab('cardio').then(()=>{
    const sec=document.getElementById('runSection');
    if(sec&&sec.style.display==='none')toggleRunSection();
    setTimeout(()=>{const c=document.getElementById('crun-'+k);if(c)c.scrollIntoView({behavior:'smooth',block:'center'});},120);
  });
}