function renderCardio(){const l=getAge(),s=220-l,a=ZONE_COLORS;let c="";ZONE_DATA.forEach((n,i)=>{const e=Math.round(s*n.pct[0]/100),t=Math.round(s*n.pct[1]/100);c+=`<div class="zone-row">
      <div class="zone-dot" style="background:${a[i]}"></div>
      <div><div class="zone-name" style="color:${a[i]}">${n.name}</div><div style="font-size:10px;color:var(--muted)">${n.label}</div></div>
      <div class="zone-bpm" style="color:${a[i]}">${e}–${t}</div>
    </div>`});let o="";const r=weekDateKeys(),d=runPlanList();d.forEach(({day:n,run:i})=>{const e=r[n],t=getRunLog(e);o+=`<div class="run-card" id="crun-${e}">
      <div class="run-title">${DAY_LABELS[n]} — ${escA(i.name)}<span class="run-date">${fmtDateShort(e)}</span></div>
      ${i.desc?`<div class="run-step" style="margin-bottom:6px">${escA(i.desc)}</div>`:""}
      ${i.detail?`<div class="run-step" style="font-style:italic">${escA(i.detail)}</div>`:""}
      <div class="run-log" style="margin-top:12px">
        <div class="input-col"><span class="set-lbl">DURÉE (min)</span>
          <input class="si" type="number" inputmode="numeric" placeholder="${i.targetDuration||"—"}" value="${t.duration}"
            onchange="debounce('cr-d-${e}',()=>{saveRunLog('${e}','duration',this.value);},400)"></div>
        <div class="input-col"><span class="set-lbl">DIST (km)</span>
          <input class="si" type="number" inputmode="decimal" placeholder="${i.targetDistance||"—"}" value="${t.distance}"
            onchange="debounce('cr-s-${e}',()=>{saveRunLog('${e}','distance',this.value);},400)"></div>
        <div class="input-col"><span class="set-lbl">RPE (1-10)</span>
          <input class="si" type="number" inputmode="numeric" placeholder="7" min="1" max="10" value="${t.rpe}"
            onchange="debounce('cr-r-${e}',()=>{saveRunLog('${e}','rpe',this.value);},400)"></div>
      </div>
      <div class="run-goal" id="rgoal-${e}">${runGoalHtml(i,t)}</div>
      <div class="run-pace" id="pace-${e}">${paceHtml(t)}</div>
      <button class="run-done-btn${t.done?" done":""}" id="crunBtn-${e}"
        onclick="toggleRunDone2('${e}')">
        ${t.done?"Séance terminée":"Marquer comme faite"}
      </button>
    </div>`}),d.length||(o='<div class="empty">Aucune sortie planifiée.<br><button class="prog-switch-btn" style="margin-top:10px" onclick="openProgramEditor()">Planifier mes sorties</button></div>'),document.getElementById("cardio-content").innerHTML=`
  <div class="chip">Cardio & running</div>
  <div class="card" style="margin-bottom:12px">
    <div class="stitle">Zones cardio</div>
    <div class="age-row">
      <div>
        <div style="font-size:12px;color:var(--dim);margin-bottom:6px">Ton âge</div>
        <input class="big-inp" type="number" id="ageInp" value="${l}" min="10" max="90" inputmode="numeric">
      </div>
      <button class="btn-calc" onclick="calcZones()">Calculer</button>
      <div style="font-family:var(--fm);font-size:11px;color:var(--dim)">FC max :<br><b style="font-size:18px;color:var(--text)">${s}</b> BPM</div>
    </div>
    <div id="zonesResult">${c}</div>
  </div>
  <div class="card" style="margin-bottom:12px">
    <div style="display:flex;align-items:center;justify-content:space-between;cursor:pointer" onclick="toggleRunSection()">
      <div class="stitle" style="margin-bottom:0">Séances running</div>
      <button class="prog-switch-btn ed-open" style="margin-left:auto;margin-right:10px" onclick="event.stopPropagation();openProgramEditor()">${ic("edit")} Modifier</button><span id="runSectionChevron" style="color:var(--dim);font-size:18px;transition:transform .25s">${ic("chev")}</span>
    </div>
    <div id="runSection" style="display:none;margin-top:12px">${o}</div>
  </div>`}
function toggleRunSection(){const e=document.getElementById("runSection"),n=document.getElementById("runSectionChevron");if(!e)return;const t=e.style.display==="none";e.style.display=t?"block":"none",n&&(n.style.transform=t?"rotate(90deg)":"")}
function toggleRunDone2(n){const e=!getRunLog(n).done;saveRunLog(n,"done",e);const t=document.getElementById("crunBtn-"+n);t&&(t.className="run-done-btn"+(e?" done":""),t.textContent=e?"Séance terminée":"Marquer comme faite"),markDayActive(n),scheduleReminderSync()}
function calcZones(){const t=document.getElementById("ageInp"),s=parseInt(t?t.value:25)||25;saveAge(s);const l=220-s,o=ZONE_COLORS;let c="";ZONE_DATA.forEach((e,n)=>{const a=Math.round(l*e.pct[0]/100),i=Math.round(l*e.pct[1]/100);c+=`<div class="zone-row">
      <div class="zone-dot" style="background:${o[n]}"></div>
      <div><div class="zone-name" style="color:${o[n]}">${e.name}</div><div style="font-size:10px;color:var(--muted)">${e.label}</div></div>
      <div class="zone-bpm" style="color:${o[n]}">${a}–${i}</div>
    </div>`});const d=document.getElementById("zonesResult");d&&(d.innerHTML=c)}