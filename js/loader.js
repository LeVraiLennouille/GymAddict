/* GymAddict — chargeur de modules à la demande
   Les écrans et fonctions rarement utilisés (statistiques, planning, cardio, profil, éditeur, historique…)
   sont dans des fichiers séparés, chargés à la première utilisation. Les points d'entrée sont déclarés dans stubs.js. */
const LAZY_MODULES={
  backup:{deps:[]},
  cardio:{deps:[]},
  editor:{deps:[]},
  history:{deps:[]},
  profile:{deps:["reminders","backup"]},
  reminders:{deps:[]},
  stats:{deps:[]},
  swap:{deps:[]},
  week:{deps:[]}
};
function _lazyOrder(id,seen,out){
  if(seen.has(id))return;seen.add(id);
  (LAZY_MODULES[id].deps||[]).forEach(d=>_lazyOrder(d,seen,out));
  out.push(id);
}
function _lazyScript(id){
  const m=LAZY_MODULES[id];
  if(m.p)return m.p;
  m.p=new Promise((resolve,reject)=>{
    const s=document.createElement('script');
    s.src='js/'+id+'.js';s.async=false;   /* async=false : exécution dans l'ordre d'insertion (dépendances d'abord) */
    s.onload=resolve;
    s.onerror=()=>{m.p=null;reject(new Error('Module indisponible : '+id));};
    document.head.appendChild(s);
  });
  return m.p;
}
function loadModule(id){
  if(!LAZY_MODULES[id])return Promise.reject(new Error('Module inconnu : '+id));
  const order=[];_lazyOrder(id,new Set(),order);
  return Promise.all(order.map(_lazyScript)).then(()=>{});
}
function _lazyFail(e){
  console.error(e);
  if(typeof showToast==='function')showToast('Chargement impossible : réessaie avec du réseau');
}