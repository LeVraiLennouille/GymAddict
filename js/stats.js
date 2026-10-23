/* GymAddict — module « stats » (chargé à la demande) */
function getWeeklyTonnageHistory(exId){
  const d=gs();if(!d.workouts)return[];
  const weekMap={};
  Object.keys(d.workouts).sort().forEach(dateKey=>{
    const sets=(d.workouts[dateKey][exId]||[]).filter(s=>s&&s.done&&parseFloat(s.weight)>0);
    if(!sets.length)return;
    const dt=new Date(dateKey+'T12:00:00');
    const dow=dt.getDay();
    const monDt=new Date(dt);monDt.setDate(dt.getDate()-(dow===0?6:dow-1));
    const wk=dateToKey(monDt);
    if(!weekMap[wk])weekMap[wk]=0;
    sets.forEach(s=>{weekMap[wk]+=(parseFloat(s.weight)||0)*(parseFloat(s.reps)||10);});
  });
  return Object.keys(weekMap).sort().map(wk=>({week:wk,tonnage:Math.round(weekMap[wk])}));
}
function renderHeatmap(){
  const active=getActiveDays();const d=gs();
  const dayTonnage={};
  if(d.workouts){
    Object.keys(d.workouts).forEach(dateKey=>{
      let t=0;
      Object.values(d.workouts[dateKey]).forEach(sets=>{
        (sets||[]).forEach(s=>{if(s&&s.done)t+=((parseFloat(s.weight)||20)*(parseFloat(s.reps)||10));});
      });
      if(t>0)dayTonnage[dateKey]=t;
    });
  }
  if(d.runLogs){
    Object.keys(d.runLogs).forEach(dateKey=>{
      if(d.runLogs[dateKey]&&d.runLogs[dateKey].done&&!dayTonnage[dateKey])dayTonnage[dateKey]=500;
    });
  }
  const today=new Date();today.setHours(0,0,0,0);
  const weeks=16;
  const todayDow=today.getDay();
  const daysFromMon=todayDow===0?6:todayDow-1;
  const thisMonday=new Date(today);thisMonday.setDate(today.getDate()-daysFromMon);
  const startDate=new Date(thisMonday);startDate.setDate(thisMonday.getDate()-((weeks-1)*7));
  const tonnageVals=Object.values(dayTonnage).filter(v=>v>0);
  const maxT=tonnageVals.length?Math.max(...tonnageVals):1;
  const todayStr=todayKey();
  let html='<div class="heatmap-wrap"><div class="heatmap-grid">';
  html+='<div class="heatmap-labels"><div class="hm-day-label"></div>';
  ['L','M','M','J','V','S','D'].forEach(l=>html+=`<div class="hm-day-label">${l}</div>`);
  html+='</div>';
  for(let w=0;w<weeks;w++){
    const weekDate=new Date(startDate);weekDate.setDate(startDate.getDate()+w*7);
    const monthLabel=weekDate.getDate()<=7?weekDate.toLocaleDateString('fr-FR',{month:'short'}):'';
    html+=`<div class="heatmap-week"><div class="hm-month-lbl">${monthLabel}</div>`;
    for(let dw=0;dw<7;dw++){
      const dt=new Date(startDate);dt.setDate(startDate.getDate()+w*7+dw);
      const key=dateToKey(dt);
      const isFuture=dt>today;
      const t=dayTonnage[key]||0;
      const isActive=active.includes(key);
      let lvl=0;
      if(!isFuture&&(isActive||t>0)){
        if(t>0)lvl=Math.min(4,Math.max(1,Math.ceil((t/maxT)*4)));
        else lvl=1;
      }
      const isToday=key===todayStr;
      const clickable=!isFuture&&(t>0||isActive);
      html+=`<div class="hm-cell lvl${lvl}${isFuture?' future':''}${isToday?' hm-today':''}${clickable?' hm-click':''}" title="${key}${t?' · '+Math.round(t)+'kg':''}"${clickable?` onclick="openSessionDetail('${key}')" role="button"`:''}></div>`;
    }
    html+='</div>';
  }
  html+='</div><div class="hm-legend"><span class="hm-leg-txt">Moins</span>';
  for(let i=0;i<=4;i++)html+=`<div class="hm-cell lvl${i}"></div>`;
  html+='<span class="hm-leg-txt">Plus</span></div></div>';
  return html;
}
/* Radar : tonnage (kg × reps) des 7 derniers jours par muscle, d'après les exercices réellement faits */
function getMuscleVolumes(){
  const vols={};MUSCLE_KEYS.forEach(k=>{vols[k]=0;});
  const d=gs();
  if(!d.workouts)return MUSCLE_KEYS.map(()=>0);
  for(let i=0;i<7;i++){
    const dt=new Date();dt.setDate(dt.getDate()-i);
    const day=d.workouts[dateToKey(dt)];
    if(!day)continue;
    Object.keys(day).forEach(id=>{
      const def=findExDef(id);
      if(!def||def.type==='echauffement')return;
      (day[id]||[]).forEach(x=>{
        if(!x||!x.done)return;
        const w=parseFloat(x.weight)||20,r=parseFloat(x.reps)||10;
        (def.muscles||[]).forEach(m=>{if(vols[m]!==undefined)vols[m]+=w*r;});
      });
    });
  }
  return MUSCLE_KEYS.map(k=>vols[k]);
}
function getWeightHistory(exId){
  const d=gs();
  if(!d.workouts)return[];
  return Object.keys(d.workouts).sort().reduce((acc,dateKey)=>{
    const sets=(d.workouts[dateKey][exId]||[]).filter(s=>s&&s.done&&parseFloat(s.weight)>0);
    if(sets.length){
      const ws=sets.map(s=>parseFloat(s.weight));
      acc.push({date:dateKey,max:Math.max(...ws),avg:Math.round(ws.reduce((a,b)=>a+b,0)/ws.length*10)/10});
    }
    return acc;
  },[]);
}
function getAllExercises(){
  const seen=new Set(),list=[];
  Object.values(PROGRAM).forEach(day=>day.exercises.forEach(ex=>{
    if(!seen.has(ex.id)){seen.add(ex.id);list.push({id:ex.id,name:ex.name});}
  }));
  /* exercices retirés du programme mais qui ont encore un historique */
  const d=gs(),names=d.exNames||{},hist=new Set();
  Object.values(d.workouts||{}).forEach(day=>Object.keys(day||{}).forEach(id=>hist.add(id)));
  hist.forEach(id=>{ if(!seen.has(id)&&names[id]){seen.add(id);list.push({id,name:names[id]});} });
  return list.sort((a,b)=>a.name.localeCompare(b.name));
}
let _chartMode='max',_chartPts=[];
function renderStats(){
  const prs=getPRs();
  const bw=getBodyWeight();
  const prEntries=Object.entries(prs).sort((a,b)=>b[1].weight-a[1].weight);
  let prHtml='';
  if(!prEntries.length){
    prHtml=`<div class="empty">Aucun record enregistré.<br>Entre tes charges pour les voir ici !</div>`;
  } else {
    prEntries.slice(0,20).forEach(([id,pr])=>{
      const ratio=Math.round(pr.weight/bw*100)/100;
      const oneRM=pr.reps>1?calc1RM(pr.weight,pr.reps):pr.weight;
      prHtml+=`<div class="pr-item">
        <div><div class="pr-item-name">${findExName(id)||id}</div>
        <div class="pr-item-day">${pr.date||'—'}${pr.reps?' · '+pr.reps+' reps':''} · 1RM~${oneRM}kg</div></div>
        <div style="text-align:right">
          <div class="pr-item-w">${pr.weight} kg</div>
          <div style="font-family:var(--fm);font-size:10px;color:var(--blue)">${ratio}× BW</div>
        </div>
      </div>`;
    });
  }
  const allEx=getAllExercises();
  const exOptions=allEx.map(e=>`<option value="${e.id}">${e.name}</option>`).join('');
  document.getElementById('stats-content').innerHTML=`
  <div class="chip">Statistiques</div>
  <div class="stats-grid">
    <div class="stat-card k-yellow"><div class="stat-v">${computeStreak()}</div><div class="stat-l">Jours de streak</div></div>
    <div class="stat-card k-green"><div class="stat-v">${computeReg()}%</div><div class="stat-l">Régularité 7j</div></div>
  </div>
  <button class="hist-open" onclick="openHistory()">
    <div class="hist-open-ic">${ic('clock')}</div>
    <div class="hist-open-tx"><b>Historique des séances</b><span>${getSessionDates().length} séance${getSessionDates().length>1?'s':''} enregistrée${getSessionDates().length>1?'s':''} · relire et dupliquer</span></div>
    ${ic('chev')}
  </button>
  <div class="card" id="goalsCard" style="margin-bottom:12px">${goalsCardHtml()}</div>
  <div class="card" style="margin-bottom:12px">
    <div class="stitle">Calendrier d'activité</div>
    ${renderHeatmap()}
  </div>
  <div class="card" style="margin-bottom:12px">
    <div class="stitle">Évolution des charges</div>
    <div style="display:flex;gap:8px;margin-bottom:14px;align-items:center;flex-wrap:wrap">
      <select id="exSelect" class="si" style="flex:1;text-align:left;font-size:12px;padding:8px" onchange="renderWeightChart()">
        ${exOptions}
      </select>
      <div style="display:flex;gap:5px;flex-wrap:wrap">
        <button id="chartMaxBtn" onclick="setChartMode('max')" class="badge ${_chartMode==='max'?'b-compound':'b-rest'}" style="cursor:pointer;padding:6px 8px;font-size:10px">Max</button>
        <button id="chartAvgBtn" onclick="setChartMode('avg')" class="badge ${_chartMode==='avg'?'b-isolation':'b-rest'}" style="cursor:pointer;padding:6px 8px;font-size:10px">Moy</button>
        <button id="chartTonBtn" onclick="setChartMode('tonnage')" class="badge ${_chartMode==='tonnage'?'b-superset':'b-rest'}" style="cursor:pointer;padding:6px 8px;font-size:10px">Tonnage</button>
      </div>
    </div>
    <div id="weightChartBox"></div>
  </div>
  <div class="radar-wrap">
    <div class="stitle">Repartition Musculaire <span style="font-size:10px;color:var(--dim)">(7 derniers jours)</span></div>
    <div id="radarBox"></div>
  </div>
  <div class="card" id="volumeCard" style="margin-bottom:12px">${volumeCardHtml()}</div>
  <div class="card" id="weightCard" style="margin-bottom:12px">${weightCardHtml()}</div>
  <div class="card" style="margin-bottom:12px">
    <div class="stitle">Records personnels</div>
    <div class="bw-row">
      <div class="bw-lbl">Poids de corps</div>
      <input class="big-inp" type="number" id="bwInp" value="${bw}" min="30" max="200" inputmode="decimal" style="width:75px">
      <span class="bw-lbl">kg</span>
      <button class="btn-calc" onclick="saveBWAndRefresh()" style="padding:8px 12px;font-size:13px">${ic('check')}</button>
    </div>
    ${prHtml}
  </div>`;
  setTimeout(()=>{ drawRadar(); renderWeightChart(); },80);
}
function saveBWAndRefresh(){
  const inp=document.getElementById('bwInp');
  if(inp&&!saveBodyWeight(inp.value))showToast('Poids invalide (20 à 300 kg)');
  renderStats();
}
function setChartMode(mode){
  _chartMode=mode;
  const mb=document.getElementById('chartMaxBtn'), ab=document.getElementById('chartAvgBtn'), tb=document.getElementById('chartTonBtn');
  if(mb)mb.className='badge '+(mode==='max'?'b-compound':'b-rest');
  if(ab)ab.className='badge '+(mode==='avg'?'b-isolation':'b-rest');
  if(tb)tb.className='badge '+(mode==='tonnage'?'b-superset':'b-rest');
  renderWeightChart();
}
const fmtDM=k=>k.slice(8,10)+'/'+k.slice(5,7);
function chartTicks(n){
  if(n<=5)return Array.from({length:n},(_,i)=>i);
  const out=new Set([0,n-1]);[0.25,0.5,0.75].forEach(f=>out.add(Math.round((n-1)*f)));
  return Array.from(out).sort((a,b)=>a-b);
}
function chartRead(i){
  const p=_chartPts[i],el=document.getElementById('chartRead');
  if(p&&el)el.innerHTML=p.t;
}
function chartEmptyHtml(){return `<div class="empty">Aucune donnée pour cet exercice.<br>Lance ta première séance !</div>`;}
/* Courbe : pts = [{k:'AAAA-MM-JJ', v:nombre, t:'texte au toucher'}] */
function lineChartSvg(pts){
  const W=320,H=190,L=42,R=12,T=14,B=26,n=pts.length;
  const vs=pts.map(p=>p.v);
  let lo=Math.min(...vs),hi=Math.max(...vs);
  const pad=Math.max(1,(hi-lo)*0.15);
  lo=Math.max(0,Math.floor((lo-pad)/2.5)*2.5);hi=Math.ceil((hi+pad)/2.5)*2.5;if(hi-lo<2.5)hi=lo+2.5;
  const X=i=>n===1?L+(W-L-R)/2:L+i/(n-1)*(W-L-R),Y=v=>T+(1-(v-lo)/(hi-lo))*(H-T-B);
  const line=pts.map((p,i)=>(i?'L':'M')+X(i).toFixed(1)+' '+Y(p.v).toFixed(1)).join(' ');
  const area=n>1?line+` L${X(n-1).toFixed(1)} ${H-B} L${X(0).toFixed(1)} ${H-B} Z`:'';
  const grid=[lo,(lo+hi)/2,hi].map(g=>`<line class="w-grid" x1="${L}" x2="${W-R}" y1="${Y(g).toFixed(1)}" y2="${Y(g).toFixed(1)}"/><text class="w-lbl" x="${L-6}" y="${(Y(g)+3.5).toFixed(1)}" text-anchor="end">${fmtKg(g)}</text>`).join('');
  const ticks=chartTicks(n).map(i=>`<text class="w-lbl" x="${X(i).toFixed(1)}" y="${H-6}" text-anchor="${i===0&&n>1?'start':(i===n-1&&n>1?'end':'middle')}">${fmtDM(pts[i].k)}</text>`).join('');
  const dots=pts.map((p,i)=>`<circle class="w-dot y" cx="${X(i).toFixed(1)}" cy="${Y(p.v).toFixed(1)}" r="${n>40?2:3.5}"/><circle class="w-hit" cx="${X(i).toFixed(1)}" cy="${Y(p.v).toFixed(1)}" r="14" onclick="chartRead(${i})"/>`).join('');
  return `<svg class="w-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Évolution de la charge">${grid}${n>1?`<path class="w-area y" d="${area}"/><path class="w-line y" d="${line}"/>`:''}${dots}${ticks}</svg>`;
}
/* Barres : tonnage hebdomadaire */
function barChartSvg(pts){
  const W=320,H=190,L=42,R=12,T=14,B=26,n=pts.length;
  const hi=Math.max(...pts.map(p=>p.v),1)*1.1,Y=v=>T+(1-v/hi)*(H-T-B);
  const slot=(W-L-R)/n,bw=Math.max(4,Math.min(28,slot*0.62));
  const cx=i=>L+slot*i+slot/2;
  const fmtT=v=>v>=1000?(Math.round(v/100)/10).toLocaleString('fr-FR')+' t':Math.round(v)+'';
  const grid=[0,hi/2,hi].map(g=>`<line class="w-grid" x1="${L}" x2="${W-R}" y1="${Y(g).toFixed(1)}" y2="${Y(g).toFixed(1)}"/><text class="w-lbl" x="${L-6}" y="${(Y(g)+3.5).toFixed(1)}" text-anchor="end">${fmtT(g)}</text>`).join('');
  const bars=pts.map((p,i)=>`<rect class="w-bar" x="${(cx(i)-bw/2).toFixed(1)}" y="${Y(p.v).toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(1,H-B-Y(p.v)).toFixed(1)}" rx="3"/><rect class="w-hit" x="${(cx(i)-slot/2).toFixed(1)}" y="${T}" width="${slot.toFixed(1)}" height="${H-T-B}" onclick="chartRead(${i})"/>`).join('');
  const ticks=chartTicks(n).map(i=>`<text class="w-lbl" x="${cx(i).toFixed(1)}" y="${H-6}" text-anchor="middle">${fmtDM(pts[i].k)}</text>`).join('');
  return `<svg class="w-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Tonnage hebdomadaire">${grid}${bars}${ticks}</svg>`;
}
function renderWeightChart(){
  const sel=document.getElementById('exSelect'),box=document.getElementById('weightChartBox');
  if(!sel||!box)return;
  const exId=sel.value;
  const read=`<div class="w-read" id="chartRead">Touche un point pour voir la valeur</div>`;
  if(_chartMode==='tonnage'){
    const hist=getWeeklyTonnageHistory(exId);
    if(!hist.length){box.innerHTML=chartEmptyHtml();return;}
    _chartPts=hist.map(h=>({k:h.week,v:h.tonnage,t:`<b>${Math.round(h.tonnage).toLocaleString('fr-FR')} kg·reps</b> · semaine du ${fmtDateShort(h.week)}`}));
    box.innerHTML=barChartSvg(_chartPts)+read;return;
  }
  const hist=getWeightHistory(exId);
  if(!hist.length){box.innerHTML=chartEmptyHtml();return;}
  _chartPts=hist.map(h=>{const v=_chartMode==='max'?h.max:h.avg;return{k:h.date,v,t:`<b>${fmtKg(v)} kg</b> · ${fmtDateShort(h.date)}`};});
  box.innerHTML=lineChartSvg(_chartPts)+read;
}
/* Radar : répartition des 7 derniers jours */
function drawRadar(){
  const box=document.getElementById('radarBox');if(!box)return;
  const vals=getMuscleVolumes(),n=vals.length,max=Math.max(...vals,1);
  const W=320,H=290,cx=160,cy=145,R=92;
  const pt=(i,r)=>{const a=-Math.PI/2+i*2*Math.PI/n;return[cx+r*Math.cos(a),cy+r*Math.sin(a)];};
  const poly=r=>Array.from({length:n},(_,i)=>pt(i,r).map(x=>x.toFixed(1)).join(',')).join(' ');
  const rings=[0.25,0.5,0.75,1].map(f=>`<polygon class="rd-grid" points="${poly(R*f)}"/>`).join('');
  const axes=Array.from({length:n},(_,i)=>{const [x,y]=pt(i,R);return `<line class="rd-grid" x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>`;}).join('');
  const data=vals.map((v,i)=>pt(i,R*v/max));
  const shape=data.map(q=>q.map(x=>x.toFixed(1)).join(',')).join(' ');
  const dots=data.map(q=>`<circle class="rd-dot" cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="4"/>`).join('');
  const labels=MUSCLE_LABELS.map((l,i)=>{const [x,y]=pt(i,R+18);const c=Math.cos(-Math.PI/2+i*2*Math.PI/n);return `<text class="rd-lbl" x="${x.toFixed(1)}" y="${(y+4).toFixed(1)}" text-anchor="${c>0.3?'start':(c<-0.3?'end':'middle')}">${l}</text>`;}).join('');
  const total=vals.reduce((a,b)=>a+b,0);
  box.innerHTML=`<svg class="rd-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Répartition musculaire des 7 derniers jours">${rings}${axes}${total>0?`<polygon class="rd-area" points="${shape}"/>${dots}`:''}${labels}</svg>${total>0?'':'<div class="w-read">Aucune série validée sur les 7 derniers jours</div>'}`;
}
/* ============================================================
   POIDS DE CORPS : journal et courbe (SVG, sans dépendance)
   ============================================================ */
let _wRange='90',_wDel=null;
function weightPoints(){
  const all=getWeightLog();
  if(_wRange==='all')return all;
  const lim=new Date();lim.setDate(lim.getDate()-parseInt(_wRange));
  const lk=dateToKey(lim);
  return all.filter(e=>e.date>=lk);
}
const fmtW=n=>(Math.round(n*10)/10).toLocaleString('fr-FR',{minimumFractionDigits:1,maximumFractionDigits:1});
function weightSvg(pts){
  if(pts.length<2)return `<div class="empty" style="padding:18px 0 8px">${pts.length?'Ajoute une deuxième pesée<br>pour voir la courbe.':'Aucune pesée sur cette période.'}</div>`;
  const W=320,H=170,L=38,R=12,T=14,B=26;
  const t=pts.map(p=>new Date(p.date+'T12:00:00').getTime()),v=pts.map(p=>p.kg);
  let lo=Math.min(...v),hi=Math.max(...v);
  const pad=Math.max(0.5,(hi-lo)*0.15);
  lo=Math.floor((lo-pad)*2)/2;hi=Math.ceil((hi+pad)*2)/2;if(hi-lo<1)hi=lo+1;
  const t0=t[0],t1=t[t.length-1];
  const X=x=>L+(t1===t0?0.5:(x-t0)/(t1-t0))*(W-L-R),Y=y=>T+(1-(y-lo)/(hi-lo))*(H-T-B);
  const line=pts.map((p,i)=>(i?'L':'M')+X(t[i]).toFixed(1)+' '+Y(v[i]).toFixed(1)).join(' ');
  const area=line+` L${X(t1).toFixed(1)} ${H-B} L${X(t0).toFixed(1)} ${H-B} Z`;
  const grid=[lo,(lo+hi)/2,hi].map(g=>`<line class="w-grid" x1="${L}" x2="${W-R}" y1="${Y(g).toFixed(1)}" y2="${Y(g).toFixed(1)}"/><text class="w-lbl" x="${L-6}" y="${(Y(g)+3.5).toFixed(1)}" text-anchor="end">${fmtW(g)}</text>`).join('');
  const dots=pts.map((p,i)=>`<circle class="w-dot" cx="${X(t[i]).toFixed(1)}" cy="${Y(v[i]).toFixed(1)}" r="${pts.length>40?2:3.5}"/><circle class="w-hit" cx="${X(t[i]).toFixed(1)}" cy="${Y(v[i]).toFixed(1)}" r="14" onclick="selectWeightPoint(${i})"/>`).join('');
  return `<svg class="w-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Courbe du poids de corps">
    ${grid}<path class="w-area" d="${area}"/><path class="w-line" d="${line}"/>${dots}
    <text class="w-lbl" x="${L}" y="${H-6}" text-anchor="start">${fmtDateShort(pts[0].date)}</text>
    <text class="w-lbl" x="${W-R}" y="${H-6}" text-anchor="end">${fmtDateShort(pts[pts.length-1].date)}</text></svg>`;
}
function selectWeightPoint(i){
  const p=weightPoints()[i],el=document.getElementById('wRead');
  if(p&&el)el.innerHTML=`<b>${fmtW(p.kg)} kg</b> · ${fmtDateShort(p.date)}`;
}
function weightCardHtml(){
  const all=getWeightLog(),pts=weightPoints(),today=todayKey();
  const last=all[all.length-1];
  let delta='';
  if(pts.length>=2){
    const df=pts[pts.length-1].kg-pts[0].kg;
    delta=`<span class="w-delta ${df>0?'up':df<0?'down':''}">${df>0?'+':''}${fmtW(df)} kg</span> depuis le ${fmtDateShort(pts[0].date)}`;
  }
  const chips=[['30','30 j'],['90','90 j'],['all','Tout']].map(([v,l])=>`<button class="ed-chip${_wRange===v?' on':''}" onclick="setWeightRange('${v}')">${l}</button>`).join('');
  const rows=all.slice(-6).reverse().map(e=>`<div class="w-row"><span>${fmtDateShort(e.date)}</span><b>${fmtW(e.kg)} kg</b><button class="ed-ib${_wDel===e.date?' warn':''}" onclick="deleteWeight('${e.date}')" aria-label="Supprimer la pesée">${_wDel===e.date?'Sûr ?':ic('trash')}</button></div>`).join('');
  return `<div class="stitle">Poids de corps</div>
    <div class="w-head"><div class="w-big">${last?fmtW(last.kg):'—'}<small> kg</small></div><div class="w-sub">${delta||(last?'Dernière pesée le '+fmtDateShort(last.date):'Ajoute ta première pesée')}</div></div>
    <div class="ed-chips" style="margin:12px 0 4px">${chips}</div>
    ${weightSvg(pts)}
    <div class="w-read" id="wRead">${pts.length>=2?'Touche un point pour voir la valeur':''}</div>
    <div class="w-add">
      <input class="si" id="wKg" type="number" inputmode="decimal" step="0.1" placeholder="kg" aria-label="Poids en kg">
      <input class="si" id="wDate" type="date" value="${today}" max="${today}" aria-label="Date de la pesée">
      <button class="btn-calc" onclick="addWeight()">Ajouter</button>
    </div>
    ${rows?`<div class="w-list">${rows}</div>`:''}`;
}
function refreshWeightCard(){const el=document.getElementById('weightCard');if(el)el.innerHTML=weightCardHtml();}
function setWeightRange(v){_wRange=v;_wDel=null;refreshWeightCard();}
function addWeight(){
  const kg=document.getElementById('wKg'),dt=document.getElementById('wDate');
  const date=(dt&&dt.value)||todayKey();
  if(date>todayKey()){showToast('La date ne peut pas être dans le futur');return;}
  if(!saveBodyWeight(kg?kg.value:'',date)){showToast('Poids invalide (20 à 300 kg)');return;}
  showToast('Pesée enregistrée');refreshWeightCard();
}
function deleteWeight(k){
  if(_wDel!==k){_wDel=k;refreshWeightCard();setTimeout(()=>{if(_wDel===k){_wDel=null;refreshWeightCard();}},3000);return;}
  const d=gs();
  d.weightLog=(d.weightLog||[]).filter(e=>e.date!==k);
  const log=getWeightLog();
  if(log.length)d.bodyWeight=log[log.length-1].kg;else delete d.bodyWeight;
  ss(d);_wDel=null;showToast('Pesée supprimée');refreshWeightCard();
}
/* ============================================================
   OBJECTIFS DE FORCE ET DE POIDS
   goals = [{ id, type:'lift'|'weight', exId?, target, start, startDate, achievedAt? }]
   ============================================================ */
const getGoals=()=>(gs().goals||[]).filter(g=>g&&g.id);
function saveGoals(list){const d=gs();d.goals=list;ss(d);triggerSave();}
function linSlope(pts){
  const n=pts.length;if(n<2)return 0;
  const mx=pts.reduce((a,p)=>a+p.x,0)/n,my=pts.reduce((a,p)=>a+p.y,0)/n;
  let num=0,den=0;pts.forEach(p=>{num+=(p.x-mx)*(p.y-my);den+=(p.x-mx)*(p.x-mx);});
  return den?num/den:0;
}
/* charge max par séance pour un exercice : [{date,w}] */
function liftSeries(exId){
  const d=gs(),pts=[];
  Object.keys(d.workouts||{}).sort().forEach(k=>{
    let m=0;((d.workouts[k]&&d.workouts[k][exId])||[]).forEach(x=>{if(x&&x.done){const w=parseFloat(x.weight)||0;if(w>m)m=w;}});
    if(m>0)pts.push({date:k,w:m});
  });
  return pts;
}
function goalCurrent(g){
  if(g.type==='weight'){const log=getWeightLog();return log.length?log[log.length-1].kg:null;}
  const pr=getPRs()[g.exId];
  return Math.max(pr?pr.weight:0,...liftSeries(g.exId).map(p=>p.w),0);
}
function goalProgress(g){
  const cur=goalCurrent(g);
  if(cur==null)return{cur:null,pct:0,done:false};
  const start=g.start,tgt=g.target;
  if(g.type==='weight'){
    const dir=tgt<start?-1:1,done=dir<0?cur<=tgt:cur>=tgt,span=Math.abs(tgt-start)||1;
    return{cur,dir,done,pct:done?100:Math.max(0,Math.min(100,(dir<0?start-cur:cur-start)/span*100))};
  }
  const done=cur>=tgt,span=tgt-start;
  return{cur,done,pct:done?100:(span>0?Math.max(0,Math.min(100,(cur-start)/span*100)):0)};
}
/* estimation de la date d'arrivée par régression linéaire sur les mesures récentes */
function goalEta(g,pr){
  if(pr.done)return{kind:'done'};
  const today=dayNum(todayKey());
  let pts=[],minSpan=14;
  if(g.type==='weight'){
    pts=getWeightLog().filter(e=>dayNum(e.date)>=today-90).map(e=>({x:dayNum(e.date),y:e.kg}));minSpan=7;
  }else{
    let run=0;
    pts=liftSeries(g.exId).filter(p=>dayNum(p.date)>=today-120).map(p=>{run=Math.max(run,p.w);return{x:dayNum(p.date),y:run};});
  }
  if(pts.length<(g.type==='weight'?2:3)||pts[pts.length-1].x-pts[0].x<minSpan)return{kind:'nodata'};
  const slope=linSlope(pts);
  if(g.type==='weight'){
    if(pr.dir<0?slope>=-0.005:slope<=0.005)return{kind:slope===0?'stalled':'wrong'};
  }else if(slope<=0.01)return{kind:'stalled'};
  const days=(g.target-pr.cur)/slope;
  if(!(days>0))return{kind:'stalled'};
  if(days>730)return{kind:'far'};
  const dt=new Date();dt.setHours(12,0,0,0);dt.setDate(dt.getDate()+Math.ceil(days));
  return{kind:'date',date:dateToKey(dt),days:Math.ceil(days),rate:slope*7};
}
function etaText(g,pr,eta){
  const dfmt=k=>new Date(k+'T12:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'short',year:'numeric'});
  switch(eta.kind){
    case 'done':return 'Atteint le '+dfmt(g.achievedAt||todayKey());
    case 'date':{
      const when=eta.days<14?`dans ${eta.days} j`:`dans ${Math.round(eta.days/7)} sem.`;
      return `≈ ${dfmt(eta.date)} · ${when} · ${eta.rate>0?'+':'−'}${fmtKg(Math.abs(eta.rate))} kg/sem.`;
    }
    case 'far':return 'Au rythme actuel : plus de 2 ans';
    case 'stalled':return 'Progression à l\'arrêt : pas d\'estimation';
    case 'wrong':return 'Tendance opposée à l\'objectif';
    default:return g.type==='weight'?'Ajoute des pesées pour estimer la date':'Pas assez de séances pour estimer la date';
  }
}
function goalName(g){return g.type==='weight'?'Poids de corps':findExName(g.exId);}
function goalsCardHtml(){
  const goals=getGoals();
  const rows=goals.map(g=>{
    const pr=goalProgress(g),eta=goalEta(g,pr);
    const cur=pr.cur==null?'—':fmtKg(pr.cur);
    return `<div class="goal-row${pr.done?' done':''}" onclick="openGoalModal('${g.id}')" role="button" tabindex="0">
      <div class="goal-top"><span class="goal-name">${pr.done?ic('check'):''}${escA(goalName(g))}</span><span class="goal-val">${cur} <i>→</i> ${fmtKg(g.target)} kg</span></div>
      <div class="goal-bar"><i style="width:${Math.round(pr.pct)}%"></i></div>
      <div class="goal-meta"><span>${Math.round(pr.pct)} %</span><span>${escA(etaText(g,pr,eta))}</span></div></div>`;
  }).join('');
  return `<div class="stitle">Objectifs</div>
    ${rows||`<div class="empty" style="padding:10px 0 16px">Fixe-toi une cible (« squat 100 kg », poids de corps…)<br>et suis ta progression jusqu'à l'estimation d'arrivée.</div>`}
    <button class="btn-calc goal-add" onclick="openGoalModal()">${ic('plus')} Ajouter un objectif</button>`;
}
function refreshGoalsCard(){const el=document.getElementById('goalsCard');if(el)el.innerHTML=goalsCardHtml();}
function checkGoalsAchieved(){
  const goals=getGoals();let changed=false;
  goals.forEach(g=>{
    if(g.achievedAt)return;
    if(goalProgress(g).done){g.achievedAt=todayKey();changed=true;showToast('Objectif atteint : '+goalName(g)+' '+fmtKg(g.target)+' kg !');}
  });
  if(changed){saveGoals(goals);refreshGoalsCard();}
}
let _goal={id:null,type:'lift',exId:'',target:''},_goalDel=false;
function openGoalModal(id){
  closeModal();
  const g=id?getGoals().find(x=>x.id===id):null;
  _goal=g?{id:g.id,type:g.type,exId:g.exId||'',target:String(g.target)}:{id:null,type:'lift',exId:'',target:''};
  _goalDel=false;
  document.body.insertAdjacentHTML('beforeend',`<div class="modal-overlay" id="goalModal" onclick="if(event.target.id==='goalModal')closeModal()"><div class="modal-box" id="goalBox"></div></div>`);
  renderGoalModal();
}
function renderGoalModal(){
  const box=document.getElementById('goalBox');if(!box)return;
  const edit=!!_goal.id;
  const exOpts=getAllExercises().map(e=>`<option value="${e.id}"${e.id===_goal.exId?' selected':''}>${escA(e.name)}</option>`).join('');
  const typeChips=edit?'':`<div class="ed-chips"><button class="ed-chip${_goal.type==='lift'?' on':''}" onclick="goalType('lift')">Exercice</button><button class="ed-chip${_goal.type==='weight'?' on':''}" onclick="goalType('weight')">Poids de corps</button></div>`;
  let cur='';
  if(_goal.type==='weight'){const c=goalCurrent({type:'weight'});cur=c!=null?`Poids actuel : <b>${fmtKg(c)} kg</b>`:'Aucune pesée enregistrée : ajoute-en une dans Stats.';}
  else if(_goal.exId){cur=`Record actuel : <b>${fmtKg(goalCurrent({type:'lift',exId:_goal.exId}))} kg</b>`;}
  box.innerHTML=`<div class="modal-hdr"><div class="modal-title">${edit?'Modifier l\'objectif':'Nouvel objectif'}</div><button class="drawer-close" onclick="closeModal()" aria-label="Fermer">${ic('close')}</button></div>
    ${typeChips}
    ${_goal.type==='lift'?`<span class="set-lbl ed-lbl">EXERCICE</span><select class="si goal-sel" ${edit?'disabled':''} onchange="goalEx(this.value)"><option value="">Choisir…</option>${exOpts}</select>`:''}
    <div class="sum-sub" id="goalCur" style="margin:10px 0">${cur}</div>
    <span class="set-lbl ed-lbl">CIBLE (KG)</span>
    <input class="si goal-inp" id="goalTarget" type="number" inputmode="decimal" step="0.5" min="1" value="${escA(_goal.target)}" placeholder="100" oninput="_goal.target=this.value">
    <div style="display:flex;gap:10px;margin-top:20px">
      ${edit?`<button class="btn-danger" style="flex:1" onclick="goalDelete()">${_goalDel?'Confirmer':'Supprimer'}</button>`:`<button class="run-done-btn" style="flex:1;margin-top:0;background:none;border:1.5px solid var(--border);color:var(--muted)" onclick="closeModal()">Annuler</button>`}
      <button class="run-done-btn done" style="flex:1;margin-top:0" onclick="goalSave()">Enregistrer</button>
    </div>`;
}
function goalType(t){_goal.type=t;renderGoalModal();}
function goalEx(v){_goal.exId=v;const c=document.getElementById('goalCur');if(c)c.innerHTML=v?`Record actuel : <b>${fmtKg(goalCurrent({type:'lift',exId:v}))} kg</b>`:'';}
function goalSave(){
  const target=Math.round(parseFloat(String(_goal.target).replace(',','.'))*10)/10;
  if(!(target>0&&target<=1000)){showToast('Cible invalide');return;}
  const goals=getGoals();
  if(_goal.id){
    const g=goals.find(x=>x.id===_goal.id);
    if(g){g.target=target;delete g.achievedAt;if(goalProgress(g).done)g.achievedAt=todayKey();}
  }else{
    if(_goal.type==='lift'&&!_goal.exId){showToast('Choisis un exercice');return;}
    if(goals.some(g=>!g.achievedAt&&g.type===_goal.type&&(g.type==='weight'||g.exId===_goal.exId))){showToast('Un objectif existe déjà : modifie-le');return;}
    const g={id:'g_'+Date.now().toString(36),type:_goal.type,exId:_goal.type==='lift'?_goal.exId:undefined,target,startDate:todayKey()};
    const cur=goalCurrent(g);
    if(g.type==='weight'&&cur==null){showToast("Ajoute d'abord une pesée");return;}
    g.start=cur||0;
    if(g.type==='lift'&&cur>=target){showToast('Déjà atteint : choisis une cible plus haute');return;}
    if(g.type==='weight'&&cur===target){showToast('Tu y es déjà !');return;}
    goals.push(g);
  }
  saveGoals(goals);closeModal();refreshGoalsCard();showToast('Objectif enregistré');
}
function goalDelete(){
  if(!_goalDel){_goalDel=true;renderGoalModal();return;}
  saveGoals(getGoals().filter(g=>g.id!==_goal.id));
  closeModal();refreshGoalsCard();showToast('Objectif supprimé');
}
/* ============================================================
   VOLUME HEBDOMADAIRE PAR MUSCLE (séries de travail / semaine)
   Le 1er muscle d'un exercice compte une série entière, les suivants une demi-série ; l'échauffement n'est pas compté.
   « Prévu » = séries restantes du programme jusqu'à dimanche.
   ============================================================ */
const VOL_DEFAULT=[10,20];
const fmtSets=n=>(Math.round(n*2)/2).toLocaleString('fr-FR',{maximumFractionDigits:1});
function getVolTargets(){
  const t=(gs().prefs||{}).volTargets||{},out={};
  MUSCLE_KEYS.forEach(k=>{const v=t[k];out[k]=(Array.isArray(v)&&v.length===2&&v[0]>=0&&v[1]>=v[0])?[+v[0],+v[1]]:VOL_DEFAULT.slice();});
  return out;
}
function weekMonday(off){
  const t=new Date();t.setHours(0,0,0,0);
  t.setDate(t.getDate()-((t.getDay()+6)%7)+off*7);
  return t;
}
function weekVolume(off){
  const mon=weekMonday(off),today=todayKey(),d=gs();
  const actual={},planned={};MUSCLE_KEYS.forEach(k=>{actual[k]=0;planned[k]=0;});
  const add=(obj,def,n)=>{
    if(!def||def.type==='echauffement'||n<=0)return;
    (def.muscles||[]).forEach((m,i)=>{if(MUSCLE_KEYS.includes(m))obj[m]+=n*(i===0?1:0.5);});
  };
  for(let i=0;i<7;i++){
    const dt=new Date(mon);dt.setDate(mon.getDate()+i);
    const k=dateToKey(dt),day=(d.workouts&&d.workouts[k])||{};
    Object.keys(day).forEach(id=>add(actual,findExDef(id),(day[id]||[]).filter(x=>x&&x.done).length));
    if(off===0&&k>=today){
      const {prog}=getEffectiveDayProgram(k);
      if(prog&&prog.type!=='rest')dayExercises(k,prog).forEach(ex=>{
        if(isSkipped(k,ex.id))return;
        let rem=0;for(let n=0;n<ex.sets;n++)if(!getSet(k,ex.id,n).done)rem++;
        add(planned,ex,rem);
      });
    }
  }
  return{actual,planned,mon};
}
let _volOff=0;
function volumeCardHtml(){
  const {actual,planned,mon}=weekVolume(_volOff),T=getVolTargets();
  const proj=k=>actual[k]+planned[k];
  const scale=Math.max(...MUSCLE_KEYS.map(k=>Math.max(T[k][1]*1.25,proj(k))),1);
  const pc=v=>Math.min(100,v/scale*100);
  const rows=MUSCLE_KEYS.map((k,i)=>{
    const [lo,hi]=T[k],a=actual[k],pl=planned[k];
    const cls=a<lo?'under':(a>hi?'over':'in');
    return `<div class="vol-row"><span class="vol-name">${MUSCLE_LABELS[i]}</span>
      <div class="vol-bar"><div class="vol-zone" style="left:${pc(lo)}%;width:${pc(hi)-pc(lo)}%"></div><div class="vol-fill ${cls}" style="width:${pc(a)}%"></div>${pl>0?`<div class="vol-plan" style="left:${pc(a)}%;width:${Math.min(pc(a+pl),100)-pc(a)}%"></div>`:''}</div>
      <span class="vol-val"><b>${fmtSets(a)}</b>${pl>0?`<em>+${fmtSets(pl)}</em>`:''}<small>/ ${lo}–${hi}</small></span></div>`;
  }).join('');
  let note;
  if(_volOff===0){
    const low=MUSCLE_KEYS.map((k,i)=>({k,n:MUSCLE_LABELS[i]})).filter(x=>proj(x.k)<T[x.k][0]);
    note=low.length?`Avec les séances prévues, <b>${low.map(x=>x.n).join(', ')}</b> resteront sous l'objectif minimum.`:'Avec les séances prévues, tous les muscles atteindront leur objectif minimum.';
  }else{
    const ok=MUSCLE_KEYS.filter(k=>actual[k]>=T[k][0]&&actual[k]<=T[k][1]).length;
    note=`${ok} muscle${ok>1?'s':''} sur 7 dans la zone cible cette semaine-là.`;
  }
  const title=_volOff===0?'Cette semaine':'Semaine du '+fmtDateShort(dateToKey(mon));
  return `<div class="vol-head"><div class="stitle" style="margin:0">Volume hebdo</div>
      <div class="vol-nav"><button onclick="volWeek(-1)" aria-label="Semaine précédente">${ic('back')}</button><span>${title}</span><button onclick="volWeek(1)" aria-label="Semaine suivante" ${_volOff>=0?'disabled':''}>${ic('chev')}</button></div></div>
    <div class="vol-rows">${rows}</div>
    <div class="vol-note">${note}</div>
    <div class="vol-legend"><span class="vol-zone-key"></span> zone cible (séries / semaine) · <span class="vol-plan-key"></span> prévu au programme
      <button class="vol-edit" onclick="openVolModal()">Régler les objectifs</button></div>`;
}
function refreshVolumeCard(){const el=document.getElementById('volumeCard');if(el)el.innerHTML=volumeCardHtml();}
function volWeek(dir){_volOff=Math.min(0,Math.max(-26,_volOff+dir));refreshVolumeCard();}
function openVolModal(){
  closeModal();
  const T=getVolTargets();
  document.body.insertAdjacentHTML('beforeend',`<div class="modal-overlay" id="volModal" onclick="if(event.target.id==='volModal')closeModal()"><div class="modal-box">
    <div class="modal-hdr"><div class="modal-title">Objectifs de volume</div><button class="drawer-close" onclick="closeModal()" aria-label="Fermer">${ic('close')}</button></div>
    <div class="sum-sub" style="margin-top:6px">Séries de travail par semaine et par muscle (10 à 20 est une fourchette courante pour progresser).</div>
    <div class="vol-edit-rows">${MUSCLE_KEYS.map((k,i)=>`<div class="vol-edit-row"><span>${MUSCLE_LABELS[i]}</span>
      <input class="si" id="vmin-${k}" type="number" inputmode="numeric" min="0" max="60" value="${T[k][0]}" aria-label="${MUSCLE_LABELS[i]} minimum"><em>à</em>
      <input class="si" id="vmax-${k}" type="number" inputmode="numeric" min="0" max="80" value="${T[k][1]}" aria-label="${MUSCLE_LABELS[i]} maximum"></div>`).join('')}</div>
    <div style="display:flex;gap:10px;margin-top:18px">
      <button class="run-done-btn" style="flex:1;margin-top:0;background:none;border:1.5px solid var(--border);color:var(--muted)" onclick="resetVolTargets()">Par défaut</button>
      <button class="run-done-btn done" style="flex:1;margin-top:0" onclick="saveVolTargets()">Enregistrer</button>
    </div></div></div>`);
}
function saveVolTargets(){
  const t={};
  for(const k of MUSCLE_KEYS){
    const lo=parseInt(document.getElementById('vmin-'+k).value),hi=parseInt(document.getElementById('vmax-'+k).value);
    if(!(lo>=0&&hi>=lo)){showToast('Minimum ≤ maximum pour chaque muscle');return;}
    t[k]=[lo,hi];
  }
  const d=gs();d.prefs=Object.assign({},d.prefs||{});d.prefs.volTargets=t;ss(d);triggerSave();
  closeModal();refreshVolumeCard();showToast('Objectifs de volume enregistrés');
}
function resetVolTargets(){
  const d=gs();d.prefs=Object.assign({},d.prefs||{});delete d.prefs.volTargets;ss(d);
  closeModal();refreshVolumeCard();showToast('Objectifs par défaut rétablis');
}