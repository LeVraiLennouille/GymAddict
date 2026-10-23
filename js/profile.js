/* GymAddict — module « profile » (chargé à la demande) */
function getTotalSessions(){return getActiveDays().length;}
function getTotalTonnageAllTime(){
  const d=gs();if(!d.workouts)return 0;
  let total=0;
  Object.values(d.workouts).forEach(day=>{
    Object.values(day).forEach(sets=>{
      (sets||[]).forEach(s=>{if(s&&s.done&&!isNaN(parseFloat(s.weight)))total+=(parseFloat(s.weight)||0)*(parseFloat(s.reps)||10);});
    });
  });
  return Math.round(total);
}
function renderProfile(){
  const prof=getProfile();
  const pseudo=prof.pseudo||'';
  const avatar=avatarKey(prof.avatar);
  const since=prof.since||todayKey();
  const streak=computeStreak();
  const reg=computeReg();
  const sessions=getTotalSessions();
  const tonnage=getTotalTonnageAllTime();
  const eq=getFunEquivalent(tonnage);
  const bw=getBodyWeight();
  const age=getAge();
  const prefs=getPrefs();

  const sinceDate=new Date(since+'T12:00:00');
  const daysSince=Math.round((new Date()-sinceDate)/(1000*60*60*24));

  const avatarGrid=AVATARS.map(a=>`<button class="avatar-opt${a===avatar?' selected':''}" data-a="${a}" aria-label="Avatar ${a}" onclick="selectAvatar('${a}')">${avatarHtml(a,pseudo)}</button>`).join('');

  document.getElementById('profile-content').innerHTML=`
  <div class="chip">Profil</div>
  <div class="card profile-card green-glow">
    <div class="profile-top">
      <div class="avatar-display" id="avatarDisplay" onclick="toggleAvatarPicker()">${avatarHtml(avatar,pseudo)}</div>
      <div class="profile-info">
        <input class="profile-pseudo-inp" id="pseudoInp" type="text" placeholder="Ton pseudonyme…"
          value="${pseudo}" maxlength="24" autocomplete="off" spellcheck="false"
          oninput="debounce('pseudo',()=>{saveProfile({pseudo:document.getElementById('pseudoInp').value.trim()});refreshAvatar();},600)">
        <div class="profile-since">Membre depuis ${sinceDate.toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})} · <b style="color:var(--green)">${daysSince}j</b></div>
      </div>
    </div>
    <div class="avatar-picker" id="avatarPicker" style="display:none">
      <div style="font-size:10px;color:var(--muted);margin-bottom:8px;font-family:var(--fm);letter-spacing:1px">CHOISIS TON AVATAR</div>
      <div class="avatar-grid">${avatarGrid}</div>
    </div>
  </div>

  <div class="stitle">Mes statistiques</div>
  <div class="stats-grid">
    <div class="stat-card k-red"><div class="stat-v">${streak}</div><div class="stat-l">Streak</div></div>
    <div class="stat-card k-blue"><div class="stat-v">${sessions}</div><div class="stat-l">Séances totales</div></div>
    <div class="stat-card k-yellow"><div class="stat-v">${reg}%</div><div class="stat-l">Régularité 7j</div></div>
    <div class="stat-card k-green"><div class="stat-v">${tonnage>0?(tonnage/1000).toFixed(1)+'t':'—'}</div><div class="stat-l">Tonnage total</div></div>
  </div>
  ${tonnage>0&&eq?`<div class="card" style="text-align:center;padding:14px;margin-bottom:12px">
    <div class="eq-ic" style="margin:0 auto 8px">${ic('dumbbell')}</div>
    <div style="font-family:var(--fm);font-size:12px;color:var(--dim)">Tu as soulevé l'équivalent de</div>
    <div style="font-family:var(--fh);font-size:20px;font-weight:700;color:var(--text)">${eq.count} ${eq.name}</div>
    <div style="font-size:10px;color:var(--muted);margin-top:2px">au total sur tous tes entraînements</div>
  </div>`:''}

  <div class="stitle">Mes données</div>
  <div class="card" style="margin-bottom:12px">
    <div class="bw-row" style="margin-bottom:14px">
      <div class="bw-lbl">Poids de corps</div>
      <input class="big-inp" type="number" id="profBwInp" value="${bw}" min="30" max="200" inputmode="decimal" style="width:75px">
      <span class="bw-lbl">kg</span>
      <button class="btn-calc" onclick="saveProfBW()" style="padding:8px 12px;font-size:13px">${ic('check')}</button>
    </div>
    <div class="bw-row">
      <div class="bw-lbl">Âge</div>
      <input class="big-inp" type="number" id="profAgeInp" value="${age}" min="10" max="99" inputmode="numeric" style="width:75px">
      <span class="bw-lbl">ans</span>
      <button class="btn-calc" onclick="saveProfAge()" style="padding:8px 12px;font-size:13px">${ic('check')}</button>
    </div>
  </div>

  <div class="stitle">Minuteur de repos</div>
  <div class="card" style="margin-bottom:12px">
    <div class="pref-row">
      <div><div class="pref-name">Son de fin de repos</div><div class="pref-sub">Bips sur les 3 dernières secondes, puis sonnerie</div></div>
      <button class="sw${prefs.sound?' on':''}" role="switch" aria-checked="${prefs.sound}" aria-label="Son de fin de repos" onclick="togglePref('sound',this)"><i></i></button>
    </div>
    <div class="pref-row">
      <div><div class="pref-name">Vibration</div><div class="pref-sub">${('vibrate' in navigator)?'Vibre à la fin du repos':'Non prise en charge sur cet appareil (ex. Safari iPhone)'}</div></div>
      <button class="sw${prefs.vibrate?' on':''}" role="switch" aria-checked="${prefs.vibrate}" aria-label="Vibration" onclick="togglePref('vibrate',this)"><i></i></button>
    </div>
    <button class="warmup-btn pref-test" onclick="testTimerAlert()">Tester l'alerte</button>
  </div>

  ${reminderCardHtml()}
  <div class="stitle">Sauvegarde des données</div>
  <div class="card" style="margin-bottom:12px">
    <div class="pref-sub" style="margin:0 0 14px;font-size:13px;line-height:1.5">Tes données sont stockées uniquement sur cet appareil. Exporte-les pour changer de téléphone ou te protéger d'un nettoyage du navigateur.</div>
    <div class="bk-btns">
      <button class="btn-calc bk-save" onclick="exportData()">${ic('down')} Sauvegarder</button>
      <button class="btn-calc bk-restore" onclick="document.getElementById('importFile').click()">${ic('up')} Restaurer</button>
    </div>
    <input type="file" id="importFile" accept=".json,application/json" style="display:none" onchange="importFileChosen(this)">
    <div class="pref-sub bk-last" id="backupLast">${backupLabel()}</div>
  </div>

  <div class="stitle">Diagnostic</div>
  <div class="card" style="margin-bottom:12px">
    <div class="pref-sub" style="margin:0 0 14px;font-size:13px;line-height:1.5">Vérifie sur ton téléphone que l'installation, le mode hors ligne, les notifications, le son, la vibration et l'écran allumé fonctionnent.</div>
    <button class="btn-calc" style="width:100%;min-height:48px" onclick="openDiagnostic()">Vérifier mon appareil</button>
  </div>

  <div class="stitle">Zone danger</div>
  <div class="card danger-card">
    <div style="font-size:13px;color:var(--dim);margin-bottom:14px;line-height:1.5">
      Réinitialise <b>TOUTES</b> tes données : séances, records, tonnage, streak, check-ins.<br>
      <span style="color:var(--red);font-size:11px">Cette action est irréversible.</span>
    </div>
    <button class="btn-danger" onclick="confirmReset()">Réinitialiser toutes les données</button>
  </div>`;
}
function toggleAvatarPicker(){
  const el=document.getElementById('avatarPicker');
  if(el)el.style.display=el.style.display==='none'?'block':'none';
}
function selectAvatar(a){
  saveProfile({avatar:a});
  refreshAvatar();
  document.querySelectorAll('.avatar-opt').forEach(btn=>{
    btn.classList.toggle('selected',btn.dataset.a===a);
  });
  const picker=document.getElementById('avatarPicker');
  if(picker)picker.style.display='none';
}
function saveProfBW(){
  const inp=document.getElementById('profBwInp');
  if(inp){if(saveBodyWeight(inp.value))showToast('Poids de corps sauvegardé');else showToast('Poids invalide (20 à 300 kg)');}
}
function saveProfAge(){
  const inp=document.getElementById('profAgeInp');
  if(inp){saveAge(parseInt(inp.value)||25);showToast('Âge sauvegardé');}
}
function confirmReset(){
  const html=`<div class="modal-overlay" id="resetModal" onclick="if(event.target.id==='resetModal')closeModal()">
    <div class="modal-box" style="max-width:360px">
      <div class="modal-hdr"><div class="modal-title" style="color:var(--red)">Tout effacer ?</div></div>
      <div style="font-size:13px;color:var(--dim);margin:12px 0 20px;line-height:1.6">
        Tu es sur le point de supprimer <b style="color:var(--text)">toutes tes données</b> définitivement.<br><br>
        Séances · Records · Tonnage · Streak · Check-ins.<br>Ton programme personnalisé et tes préférences sont conservés.
      </div>
      <div style="display:flex;gap:10px">
        <button class="run-done-btn" style="flex:1;background:none;border-color:var(--border);color:var(--muted)" onclick="closeModal()">Annuler</button>
        <button class="btn-danger" style="flex:1" onclick="executeReset()">Oui, tout effacer</button>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend',html);
}
function executeReset(){
  const prof=getProfile();
  const old=gs();
  localStorage.removeItem('fitcore');
  localStorage.removeItem(TIMER_KEY);
  const keep=gs();
  if(old.program)keep.program=old.program;
  if(old.exNames)keep.exNames=old.exNames;
  if(old.prefs)keep.prefs=old.prefs;
  ss(keep);
  saveProfile({...prof,since:todayKey()});
  closeModal();
  showToast('Données réinitialisées');
  updateStreak();updateReg();
  renderProfile();
}