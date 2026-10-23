/* GymAddict — module « app » (chargé au démarrage) */
const TABS=['today','week','stats','cardio','profile'];
function switchTab(name){
  TABS.forEach(t=>{
    document.getElementById('tab-'+t).classList.toggle('active',t===name);
    document.getElementById('nav-'+t).classList.toggle('on',t===name);
  });
  window.scrollTo({top:0,behavior:'smooth'});
  /* Les onglets autres que « Séance » sont des modules chargés à la demande : on renvoie une promesse */
  const render={stats:renderStats,week:renderWeek,cardio:renderCardio,profile:renderProfile}[name];
  const done=Promise.resolve(render?render():undefined);
  return name==='profile'?done.then(()=>updateReminderStatus()):done;
}
function init(){
  const d=gs();
  if(!d.profile||!d.profile.since){
    const prof=getProfile();
    if(!prof.since)saveProfile({since:todayKey()});
  }
  migrateWeightLog();
  renderToday();
  updateStreak();
  updateReg();
  restoreTimer();
  handleHash();
  window.addEventListener('hashchange',handleHash);
  renderBackupBanner();
  setTimeout(maybeRequestPersist,3000);
  startReminderLoop();

  document.addEventListener('pointerdown',function(e){
    const pop=document.getElementById('prPopup');
    if(pop&&pop.classList.contains('show')&&!pop.contains(e.target)){
      pop.classList.remove('show');
      clearTimeout(_prTimer);
    }
  });
}
init();