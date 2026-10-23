/* GymAddict — module « cardio » (chargé à la demande) */
function renderCardio(){
  const age=getAge(), hrMax=220-age;
  const zoneColors=ZONE_COLORS;
  let zonesHtml='';
  ZONE_DATA.forEach((z,i)=>{
    const lo=Math.round(hrMax*z.pct[0]/100), hi=Math.round(hrMax*z.pct[1]/100);
    zonesHtml+=`<div class="zone-row">
      <div class="zone-dot" style="background:${zoneColors[i]}"></div>
      <div><div class="zone-name" style="color:${zoneColors[i]}">${z.name}</div><div style="font-size:10px;color:var(--muted)">${z.label}</div></div>
      <div class="zone-bpm" style="color:${zoneColors[i]}">${lo}–${hi}</div>
    </div>`;
  });
  let runCardsHtml='';
  const WK=weekDateKeys(),plan=runPlanList();
  plan.forEach(({day,run})=>{
    const dateKey=WK[day],rl=getRunLog(dateKey);
    runCardsHtml+=`<div class="run-card" id="crun-${dateKey}">
      <div class="run-title">${DAY_LABELS[day]} — ${escA(run.name)}<span class="run-date">${fmtDateShort(dateKey)}</span></div>
      ${run.desc?`<div class="run-step" style="margin-bottom:6px">${escA(run.desc)}</div>`:''}
      ${run.detail?`<div class="run-step" style="font-style:italic">${escA(run.detail)}</div>`:''}
      <div class="run-log" style="margin-top:12px">
        <div class="input-col"><span class="set-lbl">DURÉE (min)</span>
          <input class="si" type="number" inputmode="numeric" placeholder="${run.targetDuration||'—'}" value="${rl.duration}"
            onchange="debounce('cr-d-${dateKey}',()=>{saveRunLog('${dateKey}','duration',this.value);},400)"></div>
        <div class="input-col"><span class="set-lbl">DIST (km)</span>
          <input class="si" type="number" inputmode="decimal" placeholder="${run.targetDistance||'—'}" value="${rl.distance}"
            onchange="debounce('cr-s-${dateKey}',()=>{saveRunLog('${dateKey}','distance',this.value);},400)"></div>
        <div class="input-col"><span class="set-lbl">RPE (1-10)</span>
          <input class="si" type="number" inputmode="numeric" placeholder="7" min="1" max="10" value="${rl.rpe}"
            onchange="debounce('cr-r-${dateKey}',()=>{saveRunLog('${dateKey}','rpe',this.value);},400)"></div>
      </div>
      <div class="run-goal" id="rgoal-${dateKey}">${runGoalHtml(run,rl)}</div>
      <div class="run-pace" id="pace-${dateKey}">${paceHtml(rl)}</div>
      <button class="run-done-btn${rl.done?' done':''}" id="crunBtn-${dateKey}"
        onclick="toggleRunDone2('${dateKey}')">
        ${rl.done?'Séance terminée':'Marquer comme faite'}
      </button>
    </div>`;
  });
  if(!plan.length)runCardsHtml=`<div class="empty">Aucune sortie planifiée.<br><button class="prog-switch-btn" style="margin-top:10px" onclick="openProgramEditor()">Planifier mes sorties</button></div>`;
  document.getElementById('cardio-content').innerHTML=`
  <div class="chip">Cardio & running</div>
  <div class="card" style="margin-bottom:12px">
    <div class="stitle">Zones cardio</div>
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
      <div class="stitle" style="margin-bottom:0">Séances running</div>
      <button class="prog-switch-btn ed-open" style="margin-left:auto;margin-right:10px" onclick="event.stopPropagation();openProgramEditor()">${ic('edit')} Modifier</button><span id="runSectionChevron" style="color:var(--dim);font-size:18px;transition:transform .25s">${ic('chev')}</span>
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
  if(btn){btn.className='run-done-btn'+(v?' done':'');btn.textContent=v?'Séance terminée':'Marquer comme faite';}
  markDayActive(dateKey);
  scheduleReminderSync();
}
function calcZones(){
  const inp=document.getElementById('ageInp');
  const age=parseInt(inp?inp.value:25)||25;
  saveAge(age);
  const hrMax=220-age;
  const zoneColors=ZONE_COLORS;
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