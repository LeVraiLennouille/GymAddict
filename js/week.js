function renderWeek(){const v=getDayName(),p=document.getElementById("week-content");let r=`<div class="week-top"><div class="chip">Programme de la semaine</div><button class="prog-switch-btn ed-open" onclick="openProgramEditor()">${ic("edit")} Modifier</button></div>`;const a=weekDateKeys();r+=weekCardioHtml(a),DAYS_ORDER.forEach(e=>{const c=WEEKLY_SUGGESTIONS[e]||"repos",g=PROGRAM[c],l=e===v,s=a[e],t=getDayProgramOverride(s),o=t&&PROGRAM[t]?PROGRAM[t]:g,y=t&&PROGRAM[t]?t:c,i=getDayProgress(s,e);let d="";o.type==="rest"?d='<span style="color:var(--muted);font-size:11px">Repos</span>':d='<span style="color:var(--dim);font-size:11px">Salle</span>';const n=o.type!=="rest",$=t?'<span style="font-size:10px;color:var(--orange)">modifié</span>':"";r+=`<div class="wday${l?" today":""}" ${n?`onclick="openDayDrawer('${e}','${s}')"`:""}
      style="--c:${progColor(y)};${n?"":"cursor:default"}">
      ${l?`<div class="today-tag">AUJOURD'HUI</div>`:""}
      <div class="wicon">${DAY_LABELS[e].slice(0,3)}</div>
      <div style="flex:1;min-width:0">
        <div class="wname">${DAY_LABELS[e]} ${$}</div>
        <div class="wsub">${o.fullName}</div>
        <div style="margin-top:4px">${d}</div>
        ${weekRunLineHtml(e,s)}
      </div>
      <div style="margin-left:auto;text-align:right;display:flex;align-items:center;gap:8px">
        <div>
          ${o.type!=="rest"&&i.total>0?`
            <div class="wprog${i.pct===0?" zero":""}">${i.pct}%</div>
            <div style="font-size:10px;color:var(--muted)">${i.done}/${i.total}</div>
            <div style="width:60px;height:4px;background:rgba(255,255,255,.06);border-radius:2px;margin-top:4px;margin-left:auto">
              <div style="width:${i.pct}%;height:100%;background:var(--green);border-radius:2px"></div></div>
          `:o.type!=="rest"?'<div class="wprog zero">0%</div>':'<div class="wprog zero">—</div>'}
        </div>
        ${n?'<div class="wday-chevron">'+ic("chev")+"</div>":""}
      </div>
    </div>`}),p.innerHTML=r}
function openDayDrawer(s,e){const{key:n,prog:r}=getEffectiveDayProgram(e);if(!r||r.type==="rest")return;_drawerCtx={dayName:s,dateKey:e},document.getElementById("drawerTitle").textContent=r.fullName;const o=getDayProgress(e,s);let t=`
  <div class="card hero" style="margin-bottom:12px;--c:${progColor(n)}">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
      <span style="font-size:12px;color:var(--dim)">${new Date(e+"T12:00:00").toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})}</span>
      <span style="font-family:var(--fm);font-size:13px;color:var(--green);font-weight:700">${o.pct}%</span>
    </div>
    <div class="prog-wrap"><div class="prog-fill" id="prog-${e}" style="width:${o.pct}%"></div></div>
    <div class="prog-txt" id="progtxt-${e}">${o.done}/${o.total} séries</div>
  </div>`;r.exercises.length>0&&(t+='<div class="stitle">Exercices</div><div class="card">',orderedExercises(e,r).forEach(i=>{t+=renderExBlock(i,e)}),t+="</div>"),t+=sessionNoteCardHtml(e),t+=`<div style="text-align:center;padding:8px 0 4px">
    <button class="prog-switch-btn" style="font-size:12px" onclick="closeDrawer();showProgramPicker('${e}')">Changer ce programme</button>
  </div>`,document.getElementById("drawerBody").innerHTML=t,document.getElementById("drawerOverlay").classList.add("open"),document.getElementById("dayDrawer").classList.add("open"),document.body.style.overflow="hidden"}
function closeDrawer(){document.getElementById("drawerOverlay").classList.remove("open"),document.getElementById("dayDrawer").classList.remove("open"),document.body.style.overflow="",renderWeek()}
function weekRunLineHtml(r,e){const t=runForDay(r);if(!t)return"";const n=getRunLog(e),a=runPaceSec(n),o=[n.distance?n.distance+" km":"",n.duration?n.duration+" min":"",a?fmtPace(a)+" /km":""].filter(Boolean).join(" · "),i=[t.targetDistance?fmtKm(t.targetDistance)+" km":"",t.targetDuration?t.targetDuration+" min":"",t.targetPace?fmtPace(t.targetPace)+" /km":""].filter(Boolean).join(" · ");return`<div class="wrun${n.done?" done":""}" onclick="event.stopPropagation();openRun('${e}')" role="button" tabindex="0">${ic(n.done?"check":"pulse")}<span><b>${escA(t.name)}</b>${n.done?o?" · "+o:" · faite":i?" · "+i:" · à faire"}</span></div>`}
function weekCardioHtml(m){const a=runPlanList();if(!a.length&&!WEEKLY_KM)return"";let c=0,i=0,t=0,r=0,d=0;a.forEach(({day:e})=>{const s=getRunLog(m[e]);s.done&&c++;const n=parseFloat(s.duration)||0,l=parseFloat(String(s.distance||"").replace(",","."))||0;i+=l,t+=n,n>0&&l>0&&(r+=n,d+=l)});const o=d>0?fmtPace(r*60/d):"—",v=[["Sorties",c+"/"+a.length],["Distance",i>0?fmtKm(i)+" km":"—"],["Durée",t>0?fmtDuration(t):"—"],["Allure /km",o]],u=WEEKLY_KM>0?`<div class="wk-km"><div class="goal-meta"><span>Objectif distance</span><span>${fmtKm(i)} / ${fmtKm(WEEKLY_KM)} km</span></div><div class="goal-bar"><i style="width:${Math.min(100,Math.round(i/WEEKLY_KM*100))}%"></i></div></div>`:"";return`<div class="card wk-cardio"><div class="stitle">Cardio de la semaine</div>
    <div class="sum-grid wk-grid">${v.map(([e,s])=>`<div class="sum-cell"><div class="sum-v">${s}</div><div class="sum-l">${e}</div></div>`).join("")}</div>${u}</div>`}
function openRun(t){return switchTab("cardio").then(()=>{const e=document.getElementById("runSection");e&&e.style.display==="none"&&toggleRunSection(),setTimeout(()=>{const n=document.getElementById("crun-"+t);n&&n.scrollIntoView({behavior:"smooth",block:"center"})},120)})}