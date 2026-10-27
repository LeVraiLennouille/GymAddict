function getTotalSessions(){return getActiveDays().length}
function getTotalTonnageAllTime(){const e=gs();if(!e.workouts)return 0;let o=0;return Object.values(e.workouts).forEach(a=>{Object.values(a).forEach(r=>{(r||[]).forEach(t=>{t&&t.done&&!isNaN(parseFloat(t.weight))&&(o+=(parseFloat(t.weight)||0)*(parseFloat(t.reps)||10))})})}),Math.round(o)}
function renderProfile(){const s=getProfile(),a=s.pseudo||"",l=avatarKey(s.avatar),d=s.since||todayKey(),r=computeStreak(),c=computeReg(),v=getTotalSessions(),t=getTotalTonnageAllTime(),n=getFunEquivalent(t),p=getBodyWeight(),u=getAge(),i=getPrefs(),o=new Date(d+"T12:00:00"),b=Math.round((new Date-o)/(1e3*60*60*24)),g=AVATARS.map(e=>`<button class="avatar-opt${e===l?" selected":""}" data-a="${e}" aria-label="Avatar ${e}" onclick="selectAvatar('${e}')">${avatarHtml(e,a)}</button>`).join("");document.getElementById("profile-content").innerHTML=`
  <div class="chip">Profil</div>
  <div class="card profile-card green-glow">
    <div class="profile-top">
      <div class="avatar-display" id="avatarDisplay" onclick="toggleAvatarPicker()">${avatarHtml(l,a)}</div>
      <div class="profile-info">
        <input class="profile-pseudo-inp" id="pseudoInp" type="text" placeholder="Ton pseudonyme…"
          value="${a}" maxlength="24" autocomplete="off" spellcheck="false"
          oninput="debounce('pseudo',()=>{saveProfile({pseudo:document.getElementById('pseudoInp').value.trim()});refreshAvatar();},600)">
        <div class="profile-since">Membre depuis ${o.toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})} · <b style="color:var(--green)">${b}j</b></div>
      </div>
    </div>
    <div class="avatar-picker" id="avatarPicker" style="display:none">
      <div style="font-size:10px;color:var(--muted);margin-bottom:8px;font-family:var(--fm);letter-spacing:1px">CHOISIS TON AVATAR</div>
      <div class="avatar-grid">${g}</div>
    </div>
  </div>

  <div class="stitle">Mes statistiques</div>
  <div class="stats-grid">
    <div class="stat-card k-red"><div class="stat-v">${r}</div><div class="stat-l">Streak</div></div>
    <div class="stat-card k-blue"><div class="stat-v">${v}</div><div class="stat-l">Séances totales</div></div>
    <div class="stat-card k-yellow"><div class="stat-v">${c}%</div><div class="stat-l">Régularité 7j</div></div>
    <div class="stat-card k-green"><div class="stat-v">${t>0?(t/1e3).toFixed(1)+"t":"—"}</div><div class="stat-l">Tonnage total</div></div>
  </div>
  ${t>0&&n?`<div class="card" style="text-align:center;padding:14px;margin-bottom:12px">
    <div class="eq-ic" style="margin:0 auto 8px">${ic("dumbbell")}</div>
    <div style="font-family:var(--fm);font-size:12px;color:var(--dim)">Tu as soulevé l'équivalent de</div>
    <div style="font-family:var(--fh);font-size:20px;font-weight:700;color:var(--text)">${n.count} ${n.name}</div>
    <div style="font-size:10px;color:var(--muted);margin-top:2px">au total sur tous tes entraînements</div>
  </div>`:""}

  <div class="stitle">Mes données</div>
  <div class="card" style="margin-bottom:12px">
    <div class="bw-row" style="margin-bottom:14px">
      <div class="bw-lbl">Poids de corps</div>
      <input class="big-inp" type="number" id="profBwInp" value="${p}" min="30" max="200" inputmode="decimal" style="width:75px">
      <span class="bw-lbl">kg</span>
      <button class="btn-calc" onclick="saveProfBW()" style="padding:8px 12px;font-size:13px">${ic("check")}</button>
    </div>
    <div class="bw-row">
      <div class="bw-lbl">Âge</div>
      <input class="big-inp" type="number" id="profAgeInp" value="${u}" min="10" max="99" inputmode="numeric" style="width:75px">
      <span class="bw-lbl">ans</span>
      <button class="btn-calc" onclick="saveProfAge()" style="padding:8px 12px;font-size:13px">${ic("check")}</button>
    </div>
  </div>

  <div class="stitle">Minuteur de repos</div>
  <div class="card" style="margin-bottom:12px">
    <div class="pref-row">
      <div><div class="pref-name">Son de fin de repos</div><div class="pref-sub">Bips sur les 3 dernières secondes, puis sonnerie</div></div>
      <button class="sw${i.sound?" on":""}" role="switch" aria-checked="${i.sound}" aria-label="Son de fin de repos" onclick="togglePref('sound',this)"><i></i></button>
    </div>
    <div class="pref-row">
      <div><div class="pref-name">Vibration</div><div class="pref-sub">${"vibrate"in navigator?"Vibre à la fin du repos":"Non prise en charge sur cet appareil (ex. Safari iPhone)"}</div></div>
      <button class="sw${i.vibrate?" on":""}" role="switch" aria-checked="${i.vibrate}" aria-label="Vibration" onclick="togglePref('vibrate',this)"><i></i></button>
    </div>
    <button class="warmup-btn pref-test" onclick="testTimerAlert()">Tester l'alerte</button>
  </div>

  ${reminderCardHtml()}
  <div class="stitle">Sauvegarde des données</div>
  <div class="card" style="margin-bottom:12px">
    <div class="pref-sub" style="margin:0 0 14px;font-size:13px;line-height:1.5">Tes données sont stockées uniquement sur cet appareil. Exporte-les pour changer de téléphone ou te protéger d'un nettoyage du navigateur.</div>
    <div class="bk-btns">
      <button class="btn-calc bk-save" onclick="exportData()">${ic("down")} Sauvegarder</button>
      <button class="btn-calc bk-restore" onclick="document.getElementById('importFile').click()">${ic("up")} Restaurer</button>
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
  </div>`}
function toggleAvatarPicker(){const e=document.getElementById("avatarPicker");e&&(e.style.display=e.style.display==="none"?"block":"none")}
function selectAvatar(e){saveProfile({avatar:e}),refreshAvatar(),document.querySelectorAll(".avatar-opt").forEach(t=>{t.classList.toggle("selected",t.dataset.a===e)});const a=document.getElementById("avatarPicker");a&&(a.style.display="none")}
function saveProfBW(){const e=document.getElementById("profBwInp");e&&(saveBodyWeight(e.value)?showToast("Poids de corps sauvegardé"):showToast("Poids invalide (20 à 300 kg)"))}
function saveProfAge(){const e=document.getElementById("profAgeInp");e&&(saveAge(parseInt(e.value)||25),showToast("Âge sauvegardé"))}
function confirmReset(){document.body.insertAdjacentHTML("beforeend",`<div class="modal-overlay" id="resetModal" onclick="if(event.target.id==='resetModal')closeModal()">
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
  </div>`)}
function executeReset(){const r=getProfile(),e=gs();localStorage.removeItem("fitcore"),localStorage.removeItem(TIMER_KEY);const o=gs();e.program&&(o.program=e.program),e.exNames&&(o.exNames=e.exNames),e.prefs&&(o.prefs=e.prefs),ss(o),saveProfile({...r,since:todayKey()}),closeModal(),showToast("Données réinitialisées"),updateStreak(),updateReg(),renderProfile()}