function getWeeklyTonnageHistory(g){const n=gs();if(!n.workouts)return[];const e={};return Object.keys(n.workouts).sort().forEach(o=>{const a=(n.workouts[o][g]||[]).filter(t=>t&&t.done&&parseFloat(t.weight)>0);if(!a.length)return;const r=new Date(o+"T12:00:00"),c=r.getDay(),w=new Date(r);w.setDate(r.getDate()-(c===0?6:c-1));const s=dateToKey(w);e[s]||(e[s]=0),a.forEach(t=>{e[s]+=(parseFloat(t.weight)||0)*(parseFloat(t.reps)||10)})}),Object.keys(e).sort().map(o=>({week:o,tonnage:Math.round(e[o])}))}
function renderHeatmap(){const y=getActiveDays(),s=gs(),n={};s.workouts&&Object.keys(s.workouts).forEach(t=>{let o=0;Object.values(s.workouts[t]).forEach(h=>{(h||[]).forEach(a=>{a&&a.done&&(o+=(parseFloat(a.weight)||20)*(parseFloat(a.reps)||10))})}),o>0&&(n[t]=o)}),s.runLogs&&Object.keys(s.runLogs).forEach(t=>{s.runLogs[t]&&s.runLogs[t].done&&!n[t]&&(n[t]=500)});const c=new Date;c.setHours(0,0,0,0);const D=16,u=c.getDay(),k=u===0?6:u-1,r=new Date(c);r.setDate(c.getDate()-k);const i=new Date(r);i.setDate(r.getDate()-(D-1)*7);const f=Object.values(n).filter(t=>t>0),b=f.length?Math.max(...f):1,$=todayKey();let e='<div class="heatmap-wrap"><div class="heatmap-grid">';e+='<div class="heatmap-labels"><div class="hm-day-label"></div>',["L","M","M","J","V","S","D"].forEach(t=>e+=`<div class="hm-day-label">${t}</div>`),e+="</div>";for(let t=0;t<D;t++){const o=new Date(i);o.setDate(i.getDate()+t*7);const h=o.getDate()<=7?o.toLocaleDateString("fr-FR",{month:"short"}):"";e+=`<div class="heatmap-week"><div class="hm-month-lbl">${h}</div>`;for(let a=0;a<7;a++){const v=new Date(i);v.setDate(i.getDate()+t*7+a);const d=dateToKey(v),m=v>c,l=n[d]||0,w=y.includes(d);let g=0;!m&&(w||l>0)&&(l>0?g=Math.min(4,Math.max(1,Math.ceil(l/b*4))):g=1);const M=d===$,p=!m&&(l>0||w);e+=`<div class="hm-cell lvl${g}${m?" future":""}${M?" hm-today":""}${p?" hm-click":""}" title="${d}${l?" · "+Math.round(l)+"kg":""}"${p?` onclick="openSessionDetail('${d}')" role="button"`:""}></div>`}e+="</div>"}e+='</div><div class="hm-legend"><span class="hm-leg-txt">Moins</span>';for(let t=0;t<=4;t++)e+=`<div class="hm-cell lvl${t}"></div>`;return e+='<span class="hm-leg-txt">Plus</span></div></div>',e}
function getMuscleVolumes(){const t={};MUSCLE_KEYS.forEach(e=>{t[e]=0});const f=gs();if(!f.workouts)return MUSCLE_KEYS.map(()=>0);for(let e=0;e<7;e++){const n=new Date;n.setDate(n.getDate()-e);const r=f.workouts[dateToKey(n)];r&&Object.keys(r).forEach(a=>{const s=findExDef(a);!s||s.type==="echauffement"||(r[a]||[]).forEach(o=>{if(!o||!o.done)return;const u=parseFloat(o.weight)||20,E=parseFloat(o.reps)||10;(s.muscles||[]).forEach(c=>{t[c]!==void 0&&(t[c]+=u*E)})})})}return MUSCLE_KEYS.map(e=>t[e])}
function getWeightHistory(u){const e=gs();return e.workouts?Object.keys(e.workouts).sort().reduce((o,s)=>{const n=(e.workouts[s][u]||[]).filter(t=>t&&t.done&&parseFloat(t.weight)>0);if(n.length){const t=n.map(r=>parseFloat(r.weight));o.push({date:s,max:Math.max(...t),avg:Math.round(t.reduce((r,a)=>r+a,0)/t.length*10)/10})}return o},[]):[]}
function getAllExercises(){const s=new Set,c=[];Object.values(PROGRAM).forEach(e=>e.exercises.forEach(a=>{s.has(a.id)||(s.add(a.id),c.push({id:a.id,name:a.name}))}));const n=gs(),t=n.exNames||{},o=new Set;return Object.values(n.workouts||{}).forEach(e=>Object.keys(e||{}).forEach(a=>o.add(a))),o.forEach(e=>{!s.has(e)&&t[e]&&(s.add(e),c.push({id:e,name:t[e]}))}),c.sort((e,a)=>e.name.localeCompare(a.name))}
let _chartMode="max",_chartPts=[];
function renderStats(){const d=getPRs(),i=getBodyWeight(),a=Object.entries(d).sort((s,t)=>t[1].weight-s[1].weight);let e="";a.length?a.slice(0,20).forEach(([s,t])=>{const n=Math.round(t.weight/i*100)/100,r=t.reps>1?calc1RM(t.weight,t.reps):t.weight;e+=`<div class="pr-item">
        <div><div class="pr-item-name">${findExName(s)||s}</div>
        <div class="pr-item-day">${t.date||"—"}${t.reps?" · "+t.reps+" reps":""} · 1RM~${r}kg</div></div>
        <div style="text-align:right">
          <div class="pr-item-w">${t.weight} kg</div>
          <div style="font-family:var(--fm);font-size:10px;color:var(--blue)">${n}× BW</div>
        </div>
      </div>`}):e='<div class="empty">Aucun record enregistré.<br>Entre tes charges pour les voir ici !</div>';const l=getAllExercises().map(s=>`<option value="${s.id}">${s.name}</option>`).join("");document.getElementById("stats-content").innerHTML=`
  <div class="chip">Statistiques</div>
  <div class="stats-grid">
    <div class="stat-card k-yellow"><div class="stat-v">${computeStreak()}</div><div class="stat-l">Jours de streak</div></div>
    <div class="stat-card k-green"><div class="stat-v">${computeReg()}%</div><div class="stat-l">Régularité 7j</div></div>
  </div>
  <button class="hist-open" onclick="openHistory()">
    <div class="hist-open-ic">${ic("clock")}</div>
    <div class="hist-open-tx"><b>Historique des séances</b><span>${getSessionDates().length} séance${getSessionDates().length>1?"s":""} enregistrée${getSessionDates().length>1?"s":""} · relire et dupliquer</span></div>
    ${ic("chev")}
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
        ${l}
      </select>
      <div style="display:flex;gap:5px;flex-wrap:wrap">
        <button id="chartMaxBtn" onclick="setChartMode('max')" class="badge ${_chartMode==="max"?"b-compound":"b-rest"}" style="cursor:pointer;padding:6px 8px;font-size:10px">Max</button>
        <button id="chartAvgBtn" onclick="setChartMode('avg')" class="badge ${_chartMode==="avg"?"b-isolation":"b-rest"}" style="cursor:pointer;padding:6px 8px;font-size:10px">Moy</button>
        <button id="chartTonBtn" onclick="setChartMode('tonnage')" class="badge ${_chartMode==="tonnage"?"b-superset":"b-rest"}" style="cursor:pointer;padding:6px 8px;font-size:10px">Tonnage</button>
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
      <input class="big-inp" type="number" id="bwInp" value="${i}" min="30" max="200" inputmode="decimal" style="width:75px">
      <span class="bw-lbl">kg</span>
      <button class="btn-calc" onclick="saveBWAndRefresh()" style="padding:8px 12px;font-size:13px">${ic("check")}</button>
    </div>
    ${e}
  </div>`,setTimeout(()=>{drawRadar(),renderWeightChart()},80)}
function saveBWAndRefresh(){const e=document.getElementById("bwInp");e&&!saveBodyWeight(e.value)&&showToast("Poids invalide (20 à 300 kg)"),renderStats()}
function setChartMode(t){_chartMode=t;const e=document.getElementById("chartMaxBtn"),a=document.getElementById("chartAvgBtn"),n=document.getElementById("chartTonBtn");e&&(e.className="badge "+(t==="max"?"b-compound":"b-rest")),a&&(a.className="badge "+(t==="avg"?"b-isolation":"b-rest")),n&&(n.className="badge "+(t==="tonnage"?"b-superset":"b-rest")),renderWeightChart()}
const fmtDM=c=>c.slice(8,10)+"/"+c.slice(5,7);
function chartTicks(r){if(r<=5)return Array.from({length:r},(t,o)=>o);const a=new Set([0,r-1]);return[.25,.5,.75].forEach(t=>a.add(Math.round((r-1)*t))),Array.from(a).sort((t,o)=>t-o)}
function chartRead(n){const t=_chartPts[n],e=document.getElementById("chartRead");t&&e&&(e.innerHTML=t.t)}
function chartEmptyHtml(){return'<div class="empty">Aucune donnée pour cet exercice.<br>Lance ta première séance !</div>'}
function lineChartSvg(n){const a=n.length,s=n.map(t=>t.v);let e=Math.min(...s),o=Math.max(...s);const $=Math.max(1,(o-e)*.15);e=Math.max(0,Math.floor((e-$)/2.5)*2.5),o=Math.ceil((o+$)/2.5)*2.5,o-e<2.5&&(o=e+2.5);const c=t=>a===1?42+266/2:42+t/(a-1)*266,i=t=>14+(1-(t-e)/(o-e))*150,x=n.map((t,l)=>(l?"L":"M")+c(l).toFixed(1)+" "+i(t.v).toFixed(1)).join(" "),d=a>1?x+` L${c(a-1).toFixed(1)} 164 L${c(0).toFixed(1)} 164 Z`:"",r=[e,(e+o)/2,o].map(t=>`<line class="w-grid" x1="42" x2="308" y1="${i(t).toFixed(1)}" y2="${i(t).toFixed(1)}"/><text class="w-lbl" x="36" y="${(i(t)+3.5).toFixed(1)}" text-anchor="end">${fmtKg(t)}</text>`).join(""),h=chartTicks(a).map(t=>`<text class="w-lbl" x="${c(t).toFixed(1)}" y="184" text-anchor="${t===0&&a>1?"start":t===a-1&&a>1?"end":"middle"}">${fmtDM(n[t].k)}</text>`).join(""),m=n.map((t,l)=>`<circle class="w-dot y" cx="${c(l).toFixed(1)}" cy="${i(t.v).toFixed(1)}" r="${a>40?2:3.5}"/><circle class="w-hit" cx="${c(l).toFixed(1)}" cy="${i(t.v).toFixed(1)}" r="14" onclick="chartRead(${l})"/>`).join("");return`<svg class="w-svg" viewBox="0 0 320 190" role="img" aria-label="Évolution de la charge">${r}${a>1?`<path class="w-area y" d="${d}"/><path class="w-line y" d="${x}"/>`:""}${m}${h}</svg>`}
function barChartSvg(e){const n=e.length,i=Math.max(...e.map(t=>t.v),1)*1.1,a=t=>14+(1-t/i)*150,o=266/n,s=Math.max(4,Math.min(28,o*.62)),x=t=>42+o*t+o/2,$=t=>t>=1e3?(Math.round(t/100)/10).toLocaleString("fr-FR")+" t":Math.round(t)+"",d=[0,i/2,i].map(t=>`<line class="w-grid" x1="42" x2="308" y1="${a(t).toFixed(1)}" y2="${a(t).toFixed(1)}"/><text class="w-lbl" x="36" y="${(a(t)+3.5).toFixed(1)}" text-anchor="end">${$(t)}</text>`).join(""),r=e.map((t,c)=>`<rect class="w-bar" x="${(x(c)-s/2).toFixed(1)}" y="${a(t.v).toFixed(1)}" width="${s.toFixed(1)}" height="${Math.max(1,164-a(t.v)).toFixed(1)}" rx="3"/><rect class="w-hit" x="${(x(c)-o/2).toFixed(1)}" y="14" width="${o.toFixed(1)}" height="150" onclick="chartRead(${c})"/>`).join(""),h=chartTicks(n).map(t=>`<text class="w-lbl" x="${x(t).toFixed(1)}" y="184" text-anchor="middle">${fmtDM(e[t].k)}</text>`).join("");return`<svg class="w-svg" viewBox="0 0 320 190" role="img" aria-label="Tonnage hebdomadaire">${d}${r}${h}</svg>`}
function renderWeightChart(){const n=document.getElementById("exSelect"),r=document.getElementById("weightChartBox");if(!n||!r)return;const a=n.value,o='<div class="w-read" id="chartRead">Touche un point pour voir la valeur</div>';if(_chartMode==="tonnage"){const t=getWeeklyTonnageHistory(a);if(!t.length){r.innerHTML=chartEmptyHtml();return}_chartPts=t.map(e=>({k:e.week,v:e.tonnage,t:`<b>${Math.round(e.tonnage).toLocaleString("fr-FR")} kg·reps</b> · semaine du ${fmtDateShort(e.week)}`})),r.innerHTML=barChartSvg(_chartPts)+o;return}const i=getWeightHistory(a);if(!i.length){r.innerHTML=chartEmptyHtml();return}_chartPts=i.map(t=>{const e=_chartMode==="max"?t.max:t.avg;return{k:t.date,v:e,t:`<b>${fmtKg(e)} kg</b> · ${fmtDateShort(t.date)}`}}),r.innerHTML=lineChartSvg(_chartPts)+o}
function drawRadar(){const i=document.getElementById("radarBox");if(!i)return;const a=getMuscleVolumes(),e=a.length,u=Math.max(...a,1),p=320,g=290,d=160,l=145,r=92,c=(t,o)=>{const s=-Math.PI/2+t*2*Math.PI/e;return[d+o*Math.cos(s),l+o*Math.sin(s)]},h=t=>Array.from({length:e},(o,s)=>c(s,t).map(n=>n.toFixed(1)).join(",")).join(" "),y=[.25,.5,.75,1].map(t=>`<polygon class="rd-grid" points="${h(r*t)}"/>`).join(""),M=Array.from({length:e},(t,o)=>{const[s,n]=c(o,r);return`<line class="rd-grid" x1="${d}" y1="${l}" x2="${s.toFixed(1)}" y2="${n.toFixed(1)}"/>`}).join(""),x=a.map((t,o)=>c(o,r*t/u)),j=x.map(t=>t.map(o=>o.toFixed(1)).join(",")).join(" "),v=x.map(t=>`<circle class="rd-dot" cx="${t[0].toFixed(1)}" cy="${t[1].toFixed(1)}" r="4"/>`).join(""),F=MUSCLE_LABELS.map((t,o)=>{const[s,n]=c(o,r+18),m=Math.cos(-Math.PI/2+o*2*Math.PI/e);return`<text class="rd-lbl" x="${s.toFixed(1)}" y="${(n+4).toFixed(1)}" text-anchor="${m>.3?"start":m<-.3?"end":"middle"}">${t}</text>`}).join(""),$=a.reduce((t,o)=>t+o,0);i.innerHTML=`<svg class="rd-svg" viewBox="0 0 ${p} ${g}" role="img" aria-label="Répartition musculaire des 7 derniers jours">${y}${M}${$>0?`<polygon class="rd-area" points="${j}"/>${v}`:""}${F}</svg>${$>0?"":'<div class="w-read">Aucune série validée sur les 7 derniers jours</div>'}`}
let _wRange="90",_wDel=null;
function weightPoints(){const e=getWeightLog();if(_wRange==="all")return e;const t=new Date;t.setDate(t.getDate()-parseInt(_wRange));const n=dateToKey(t);return e.filter(a=>a.date>=n)}
const fmtW=i=>(Math.round(i*10)/10).toLocaleString("fr-FR",{minimumFractionDigits:1,maximumFractionDigits:1});
function weightSvg(e){if(e.length<2)return`<div class="empty" style="padding:18px 0 8px">${e.length?"Ajoute une deuxième pesée<br>pour voir la courbe.":"Aucune pesée sur cette période."}</div>`;const $=320,i=170,x=38,h=12,u=14,m=26,l=e.map(t=>new Date(t.date+"T12:00:00").getTime()),d=e.map(t=>t.kg);let o=Math.min(...d),c=Math.max(...d);const w=Math.max(.5,(c-o)*.15);o=Math.floor((o-w)*2)/2,c=Math.ceil((c+w)*2)/2,c-o<1&&(c=o+1);const r=l[0],g=l[l.length-1],s=t=>x+(g===r?.5:(t-r)/(g-r))*($-x-h),n=t=>u+(1-(t-o)/(c-o))*(i-u-m),p=e.map((t,a)=>(a?"L":"M")+s(l[a]).toFixed(1)+" "+n(d[a]).toFixed(1)).join(" "),F=p+` L${s(g).toFixed(1)} ${i-m} L${s(r).toFixed(1)} ${i-m} Z`,v=[o,(o+c)/2,c].map(t=>`<line class="w-grid" x1="${x}" x2="${$-h}" y1="${n(t).toFixed(1)}" y2="${n(t).toFixed(1)}"/><text class="w-lbl" x="${x-6}" y="${(n(t)+3.5).toFixed(1)}" text-anchor="end">${fmtW(t)}</text>`).join(""),y=e.map((t,a)=>`<circle class="w-dot" cx="${s(l[a]).toFixed(1)}" cy="${n(d[a]).toFixed(1)}" r="${e.length>40?2:3.5}"/><circle class="w-hit" cx="${s(l[a]).toFixed(1)}" cy="${n(d[a]).toFixed(1)}" r="14" onclick="selectWeightPoint(${a})"/>`).join("");return`<svg class="w-svg" viewBox="0 0 ${$} ${i}" role="img" aria-label="Courbe du poids de corps">
    ${v}<path class="w-area" d="${F}"/><path class="w-line" d="${p}"/>${y}
    <text class="w-lbl" x="${x}" y="${i-6}" text-anchor="start">${fmtDateShort(e[0].date)}</text>
    <text class="w-lbl" x="${$-h}" y="${i-6}" text-anchor="end">${fmtDateShort(e[e.length-1].date)}</text></svg>`}
function selectWeightPoint(n){const t=weightPoints()[n],e=document.getElementById("wRead");t&&e&&(e.innerHTML=`<b>${fmtW(t.kg)} kg</b> · ${fmtDateShort(t.date)}`)}
function weightCardHtml(){const s=getWeightLog(),t=weightPoints(),i=todayKey(),a=s[s.length-1];let l="";if(t.length>=2){const e=t[t.length-1].kg-t[0].kg;l=`<span class="w-delta ${e>0?"up":e<0?"down":""}">${e>0?"+":""}${fmtW(e)} kg</span> depuis le ${fmtDateShort(t[0].date)}`}const n=[["30","30 j"],["90","90 j"],["all","Tout"]].map(([e,o])=>`<button class="ed-chip${_wRange===e?" on":""}" onclick="setWeightRange('${e}')">${o}</button>`).join(""),d=s.slice(-6).reverse().map(e=>`<div class="w-row"><span>${fmtDateShort(e.date)}</span><b>${fmtW(e.kg)} kg</b><button class="ed-ib${_wDel===e.date?" warn":""}" onclick="deleteWeight('${e.date}')" aria-label="Supprimer la pesée">${_wDel===e.date?"Sûr ?":ic("trash")}</button></div>`).join("");return`<div class="stitle">Poids de corps</div>
    <div class="w-head"><div class="w-big">${a?fmtW(a.kg):"—"}<small> kg</small></div><div class="w-sub">${l||(a?"Dernière pesée le "+fmtDateShort(a.date):"Ajoute ta première pesée")}</div></div>
    <div class="ed-chips" style="margin:12px 0 4px">${n}</div>
    ${weightSvg(t)}
    <div class="w-read" id="wRead">${t.length>=2?"Touche un point pour voir la valeur":""}</div>
    <div class="w-add">
      <input class="si" id="wKg" type="number" inputmode="decimal" step="0.1" placeholder="kg" aria-label="Poids en kg">
      <input class="si" id="wDate" type="date" value="${i}" max="${i}" aria-label="Date de la pesée">
      <button class="btn-calc" onclick="addWeight()">Ajouter</button>
    </div>
    ${d?`<div class="w-list">${d}</div>`:""}`}
function refreshWeightCard(){const e=document.getElementById("weightCard");e&&(e.innerHTML=weightCardHtml())}
function setWeightRange(e){_wRange=e,_wDel=null,refreshWeightCard()}
function addWeight(){const e=document.getElementById("wKg"),t=document.getElementById("wDate"),a=t&&t.value||todayKey();if(a>todayKey()){showToast("La date ne peut pas être dans le futur");return}if(!saveBodyWeight(e?e.value:"",a)){showToast("Poids invalide (20 à 300 kg)");return}showToast("Pesée enregistrée"),refreshWeightCard()}
function deleteWeight(t){if(_wDel!==t){_wDel=t,refreshWeightCard(),setTimeout(()=>{_wDel===t&&(_wDel=null,refreshWeightCard())},3e3);return}const e=gs();e.weightLog=(e.weightLog||[]).filter(i=>i.date!==t);const g=getWeightLog();g.length?e.bodyWeight=g[g.length-1].kg:delete e.bodyWeight,ss(e),_wDel=null,showToast("Pesée supprimée"),refreshWeightCard()}
const getGoals=()=>(gs().goals||[]).filter(s=>s&&s.id);
function saveGoals(a){const s=gs();s.goals=a,ss(s),triggerSave()}
function linSlope(e){const r=e.length;if(r<2)return 0;const c=e.reduce((n,o)=>n+o.x,0)/r,l=e.reduce((n,o)=>n+o.y,0)/r;let x=0,u=0;return e.forEach(n=>{x+=(n.x-c)*(n.y-l),u+=(n.x-c)*(n.x-c)}),u?x/u:0}
function liftSeries(i){const o=gs(),r=[];return Object.keys(o.workouts||{}).sort().forEach(s=>{let t=0;(o.workouts[s]&&o.workouts[s][i]||[]).forEach(e=>{if(e&&e.done){const f=parseFloat(e.weight)||0;f>t&&(t=f)}}),t>0&&r.push({date:s,w:t})}),r}
function goalCurrent(e){if(e.type==="weight"){const t=getWeightLog();return t.length?t[t.length-1].kg:null}const n=getPRs()[e.exId];return Math.max(n?n.weight:0,...liftSeries(e.exId).map(t=>t.w),0)}
function goalProgress(r){const t=goalCurrent(r);if(t==null)return{cur:null,pct:0,done:!1};const n=r.start,a=r.target;if(r.type==="weight"){const e=a<n?-1:1,c=e<0?t<=a:t>=a,u=Math.abs(a-n)||1;return{cur:t,dir:e,done:c,pct:c?100:Math.max(0,Math.min(100,(e<0?n-t:t-n)/u*100))}}const s=t>=a,o=a-n;return{cur:t,done:s,pct:s?100:o>0?Math.max(0,Math.min(100,(t-n)/o*100)):0}}
function goalEta(d,l){if(l.done)return{kind:"done"};const o=dayNum(todayKey());let e=[],s=14;if(d.type==="weight")e=getWeightLog().filter(t=>dayNum(t.date)>=o-90).map(t=>({x:dayNum(t.date),y:t.kg})),s=7;else{let t=0;e=liftSeries(d.exId).filter(r=>dayNum(r.date)>=o-120).map(r=>(t=Math.max(t,r.w),{x:dayNum(r.date),y:t}))}if(e.length<(d.type==="weight"?2:3)||e[e.length-1].x-e[0].x<s)return{kind:"nodata"};const a=linSlope(e);if(d.type==="weight"){if(l.dir<0?a>=-.005:a<=.005)return{kind:a===0?"stalled":"wrong"}}else if(a<=.01)return{kind:"stalled"};const n=(d.target-l.cur)/a;if(!(n>0))return{kind:"stalled"};if(n>730)return{kind:"far"};const i=new Date;return i.setHours(12,0,0,0),i.setDate(i.getDate()+Math.ceil(n)),{kind:"date",date:dateToKey(i),days:Math.ceil(n),rate:a*7}}
function etaText(a,r,e){const s=t=>new Date(t+"T12:00:00").toLocaleDateString("fr-FR",{day:"numeric",month:"short",year:"numeric"});switch(e.kind){case"done":return"Atteint le "+s(a.achievedAt||todayKey());case"date":{const t=e.days<14?`dans ${e.days} j`:`dans ${Math.round(e.days/7)} sem.`;return`≈ ${s(e.date)} · ${t} · ${e.rate>0?"+":"−"}${fmtKg(Math.abs(e.rate))} kg/sem.`}case"far":return"Au rythme actuel : plus de 2 ans";case"stalled":return"Progression à l'arrêt : pas d'estimation";case"wrong":return"Tendance opposée à l'objectif";default:return a.type==="weight"?"Ajoute des pesées pour estimer la date":"Pas assez de séances pour estimer la date"}}
function goalName(e){return e.type==="weight"?"Poids de corps":findExName(e.exId)}
function goalsCardHtml(){return`<div class="stitle">Objectifs</div>
    ${getGoals().map(s=>{const a=goalProgress(s),o=goalEta(s,a),t=a.cur==null?"—":fmtKg(a.cur);return`<div class="goal-row${a.done?" done":""}" onclick="openGoalModal('${s.id}')" role="button" tabindex="0">
      <div class="goal-top"><span class="goal-name">${a.done?ic("check"):""}${escA(goalName(s))}</span><span class="goal-val">${t} <i>→</i> ${fmtKg(s.target)} kg</span></div>
      <div class="goal-bar"><i style="width:${Math.round(a.pct)}%"></i></div>
      <div class="goal-meta"><span>${Math.round(a.pct)} %</span><span>${escA(etaText(s,a,o))}</span></div></div>`}).join("")||`<div class="empty" style="padding:10px 0 16px">Fixe-toi une cible (« squat 100 kg », poids de corps…)<br>et suis ta progression jusqu'à l'estimation d'arrivée.</div>`}
    <button class="btn-calc goal-add" onclick="openGoalModal()">${ic("plus")} Ajouter un objectif</button>`}
function refreshGoalsCard(){const e=document.getElementById("goalsCard");e&&(e.innerHTML=goalsCardHtml())}
function checkGoalsAchieved(){const a=getGoals();let t=!1;a.forEach(e=>{e.achievedAt||goalProgress(e).done&&(e.achievedAt=todayKey(),t=!0,showToast("Objectif atteint : "+goalName(e)+" "+fmtKg(e.target)+" kg !"))}),t&&(saveGoals(a),refreshGoalsCard())}
let _goal={id:null,type:"lift",exId:"",target:""},_goalDel=!1;
function openGoalModal(o){closeModal();const l=o?getGoals().find(d=>d.id===o):null;_goal=l?{id:l.id,type:l.type,exId:l.exId||"",target:String(l.target)}:{id:null,type:"lift",exId:"",target:""},_goalDel=!1,document.body.insertAdjacentHTML("beforeend",`<div class="modal-overlay" id="goalModal" onclick="if(event.target.id==='goalModal')closeModal()"><div class="modal-box" id="goalBox"></div></div>`),renderGoalModal()}
function renderGoalModal(){const o=document.getElementById("goalBox");if(!o)return;const l=!!_goal.id,a=getAllExercises().map(e=>`<option value="${e.id}"${e.id===_goal.exId?" selected":""}>${escA(e.name)}</option>`).join(""),n=l?"":`<div class="ed-chips"><button class="ed-chip${_goal.type==="lift"?" on":""}" onclick="goalType('lift')">Exercice</button><button class="ed-chip${_goal.type==="weight"?" on":""}" onclick="goalType('weight')">Poids de corps</button></div>`;let t="";if(_goal.type==="weight"){const e=goalCurrent({type:"weight"});t=e!=null?`Poids actuel : <b>${fmtKg(e)} kg</b>`:"Aucune pesée enregistrée : ajoute-en une dans Stats."}else _goal.exId&&(t=`Record actuel : <b>${fmtKg(goalCurrent({type:"lift",exId:_goal.exId}))} kg</b>`);o.innerHTML=`<div class="modal-hdr"><div class="modal-title">${l?"Modifier l'objectif":"Nouvel objectif"}</div><button class="drawer-close" onclick="closeModal()" aria-label="Fermer">${ic("close")}</button></div>
    ${n}
    ${_goal.type==="lift"?`<span class="set-lbl ed-lbl">EXERCICE</span><select class="si goal-sel" ${l?"disabled":""} onchange="goalEx(this.value)"><option value="">Choisir…</option>${a}</select>`:""}
    <div class="sum-sub" id="goalCur" style="margin:10px 0">${t}</div>
    <span class="set-lbl ed-lbl">CIBLE (KG)</span>
    <input class="si goal-inp" id="goalTarget" type="number" inputmode="decimal" step="0.5" min="1" value="${escA(_goal.target)}" placeholder="100" oninput="_goal.target=this.value">
    <div style="display:flex;gap:10px;margin-top:20px">
      ${l?`<button class="btn-danger" style="flex:1" onclick="goalDelete()">${_goalDel?"Confirmer":"Supprimer"}</button>`:'<button class="run-done-btn" style="flex:1;margin-top:0;background:none;border:1.5px solid var(--border);color:var(--muted)" onclick="closeModal()">Annuler</button>'}
      <button class="run-done-btn done" style="flex:1;margin-top:0" onclick="goalSave()">Enregistrer</button>
    </div>`}
function goalType(o){_goal.type=o,renderGoalModal()}
function goalEx(e){_goal.exId=e;const t=document.getElementById("goalCur");t&&(t.innerHTML=e?`Record actuel : <b>${fmtKg(goalCurrent({type:"lift",exId:e}))} kg</b>`:"")}
function goalSave(){const t=Math.round(parseFloat(String(_goal.target).replace(",","."))*10)/10;if(!(t>0&&t<=1e3)){showToast("Cible invalide");return}const a=getGoals();if(_goal.id){const e=a.find(o=>o.id===_goal.id);e&&(e.target=t,delete e.achievedAt,goalProgress(e).done&&(e.achievedAt=todayKey()))}else{if(_goal.type==="lift"&&!_goal.exId){showToast("Choisis un exercice");return}if(a.some(i=>!i.achievedAt&&i.type===_goal.type&&(i.type==="weight"||i.exId===_goal.exId))){showToast("Un objectif existe déjà : modifie-le");return}const e={id:"g_"+Date.now().toString(36),type:_goal.type,exId:_goal.type==="lift"?_goal.exId:void 0,target:t,startDate:todayKey()},o=goalCurrent(e);if(e.type==="weight"&&o==null){showToast("Ajoute d'abord une pesée");return}if(e.start=o||0,e.type==="lift"&&o>=t){showToast("Déjà atteint : choisis une cible plus haute");return}if(e.type==="weight"&&o===t){showToast("Tu y es déjà !");return}a.push(e)}saveGoals(a),closeModal(),refreshGoalsCard(),showToast("Objectif enregistré")}
function goalDelete(){if(!_goalDel){_goalDel=!0,renderGoalModal();return}saveGoals(getGoals().filter(e=>e.id!==_goal.id)),closeModal(),refreshGoalsCard(),showToast("Objectif supprimé")}
const VOL_DEFAULT=[10,20];
const fmtSets=t=>(Math.round(t*2)/2).toLocaleString("fr-FR",{maximumFractionDigits:1});
function getVolTargets(){const e=(gs().prefs||{}).volTargets||{},t={};return MUSCLE_KEYS.forEach(s=>{const r=e[s];t[s]=Array.isArray(r)&&r.length===2&&r[0]>=0&&r[1]>=r[0]?[+r[0],+r[1]]:VOL_DEFAULT.slice()}),t}
function weekMonday(t){const e=new Date;return e.setHours(0,0,0,0),e.setDate(e.getDate()-(e.getDay()+6)%7+t*7),e}
function weekVolume(d){const s=weekMonday(d),l=todayKey(),u=gs(),c={},f={};MUSCLE_KEYS.forEach(t=>{c[t]=0,f[t]=0});const y=(t,r,e)=>{!r||r.type==="echauffement"||e<=0||(r.muscles||[]).forEach((a,o)=>{MUSCLE_KEYS.includes(a)&&(t[a]+=e*(o===0?1:.5))})};for(let t=0;t<7;t++){const r=new Date(s);r.setDate(s.getDate()+t);const e=dateToKey(r),a=u.workouts&&u.workouts[e]||{};if(Object.keys(a).forEach(o=>y(c,findExDef(o),(a[o]||[]).filter(n=>n&&n.done).length)),d===0&&e>=l){const{prog:o}=getEffectiveDayProgram(e);o&&o.type!=="rest"&&dayExercises(e,o).forEach(n=>{if(isSkipped(e,n.id))return;let E=0;for(let i=0;i<n.sets;i++)getSet(e,n.id,i).done||E++;y(f,n,E)})}}return{actual:c,planned:f,mon:s}}
let _volOff=0;
function volumeCardHtml(){const{actual:n,planned:d,mon:r}=weekVolume(_volOff),o=getVolTargets(),m=e=>n[e]+d[e],u=Math.max(...MUSCLE_KEYS.map(e=>Math.max(o[e][1]*1.25,m(e))),1),s=e=>Math.min(100,e/u*100),p=MUSCLE_KEYS.map((e,l)=>{const[t,v]=o[e],a=n[e],i=d[e],b=a<t?"under":a>v?"over":"in";return`<div class="vol-row"><span class="vol-name">${MUSCLE_LABELS[l]}</span>
      <div class="vol-bar"><div class="vol-zone" style="left:${s(t)}%;width:${s(v)-s(t)}%"></div><div class="vol-fill ${b}" style="width:${s(a)}%"></div>${i>0?`<div class="vol-plan" style="left:${s(a)}%;width:${Math.min(s(a+i),100)-s(a)}%"></div>`:""}</div>
      <span class="vol-val"><b>${fmtSets(a)}</b>${i>0?`<em>+${fmtSets(i)}</em>`:""}<small>/ ${t}–${v}</small></span></div>`}).join("");let c;if(_volOff===0){const e=MUSCLE_KEYS.map((l,t)=>({k:l,n:MUSCLE_LABELS[t]})).filter(l=>m(l.k)<o[l.k][0]);c=e.length?`Avec les séances prévues, <b>${e.map(l=>l.n).join(", ")}</b> resteront sous l'objectif minimum.`:"Avec les séances prévues, tous les muscles atteindront leur objectif minimum."}else{const e=MUSCLE_KEYS.filter(l=>n[l]>=o[l][0]&&n[l]<=o[l][1]).length;c=`${e} muscle${e>1?"s":""} sur 7 dans la zone cible cette semaine-là.`}const $=_volOff===0?"Cette semaine":"Semaine du "+fmtDateShort(dateToKey(r));return`<div class="vol-head"><div class="stitle" style="margin:0">Volume hebdo</div>
      <div class="vol-nav"><button onclick="volWeek(-1)" aria-label="Semaine précédente">${ic("back")}</button><span>${$}</span><button onclick="volWeek(1)" aria-label="Semaine suivante" ${_volOff>=0?"disabled":""}>${ic("chev")}</button></div></div>
    <div class="vol-rows">${p}</div>
    <div class="vol-note">${c}</div>
    <div class="vol-legend"><span class="vol-zone-key"></span> zone cible (séries / semaine) · <span class="vol-plan-key"></span> prévu au programme
      <button class="vol-edit" onclick="openVolModal()">Régler les objectifs</button></div>`}
function refreshVolumeCard(){const e=document.getElementById("volumeCard");e&&(e.innerHTML=volumeCardHtml())}
function volWeek(f){_volOff=Math.min(0,Math.max(-26,_volOff+f)),refreshVolumeCard()}
function openVolModal(){closeModal();const o=getVolTargets();document.body.insertAdjacentHTML("beforeend",`<div class="modal-overlay" id="volModal" onclick="if(event.target.id==='volModal')closeModal()"><div class="modal-box">
    <div class="modal-hdr"><div class="modal-title">Objectifs de volume</div><button class="drawer-close" onclick="closeModal()" aria-label="Fermer">${ic("close")}</button></div>
    <div class="sum-sub" style="margin-top:6px">Séries de travail par semaine et par muscle (10 à 20 est une fourchette courante pour progresser).</div>
    <div class="vol-edit-rows">${MUSCLE_KEYS.map((e,a)=>`<div class="vol-edit-row"><span>${MUSCLE_LABELS[a]}</span>
      <input class="si" id="vmin-${e}" type="number" inputmode="numeric" min="0" max="60" value="${o[e][0]}" aria-label="${MUSCLE_LABELS[a]} minimum"><em>à</em>
      <input class="si" id="vmax-${e}" type="number" inputmode="numeric" min="0" max="80" value="${o[e][1]}" aria-label="${MUSCLE_LABELS[a]} maximum"></div>`).join("")}</div>
    <div style="display:flex;gap:10px;margin-top:18px">
      <button class="run-done-btn" style="flex:1;margin-top:0;background:none;border:1.5px solid var(--border);color:var(--muted)" onclick="resetVolTargets()">Par défaut</button>
      <button class="run-done-btn done" style="flex:1;margin-top:0" onclick="saveVolTargets()">Enregistrer</button>
    </div></div></div>`)}
function saveVolTargets(){const o={};for(const s of MUSCLE_KEYS){const t=parseInt(document.getElementById("vmin-"+s).value),r=parseInt(document.getElementById("vmax-"+s).value);if(!(t>=0&&r>=t)){showToast("Minimum ≤ maximum pour chaque muscle");return}o[s]=[t,r]}const e=gs();e.prefs=Object.assign({},e.prefs||{}),e.prefs.volTargets=o,ss(e),triggerSave(),closeModal(),refreshVolumeCard(),showToast("Objectifs de volume enregistrés")}
function resetVolTargets(){const s=gs();s.prefs=Object.assign({},s.prefs||{}),delete s.prefs.volTargets,ss(s),closeModal(),refreshVolumeCard(),showToast("Objectifs par défaut rétablis")}