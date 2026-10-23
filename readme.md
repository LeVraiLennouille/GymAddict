# GymAddict — Hybrid Tracker

**GymAddict** est une application web progressive (PWA) de suivi d'entraînement pensée pour les pratiquants qui combinent **musculation** et **course à pied**. Saisie rapide des séries, détection automatique des records, minuteur de repos, statistiques visuelles : tout fonctionne **hors ligne**, sans compte et sans serveur.

> HTML5 · CSS3 · JavaScript pur (découpé en modules chargés à la demande) · graphiques SVG · Service Worker · données stockées localement

---

## Sommaire

1. [Aperçu](#aperçu)
2. [Navigation](#navigation)
3. [Fonctionnalités](#fonctionnalités)
4. [Programme d'entraînement](#programme-dentraînement)
5. [PWA et mode hors ligne](#pwa-et-mode-hors-ligne)
6. [Données et confidentialité](#données-et-confidentialité)
7. [Installation](#installation)
8. [Structure du projet](#structure-du-projet)
9. [Technologies](#technologies)

---

## Aperçu

- **Interface mobile-first**, installable sur l'écran d'accueil, en mode plein écran (`standalone`, orientation portrait).
- **Thème clair / sombre automatique** selon les réglages du système (`prefers-color-scheme`), y compris la couleur de la barre d'état.
- **Direction artistique « scoreboard »** : fond gris clair (ou noir en mode sombre), cartes sombres à bandeau de couleur par type de séance, gros chiffres condensés (police Anton) et texte en Figtree. Les icônes sont des SVG intégrés.
- **Sauvegarde automatique** : un indicateur « Enregistré » s'affiche dans l'en-tête à chaque modification.
- **En-tête permanent** avec le streak (jours consécutifs) et la régularité sur 7 jours.

## Navigation

Cinq onglets en barre de navigation basse :

| Onglet | Rôle |
|---|---|
| **Séance** | La séance du jour : exercices, séries, minuteur, tonnage |
| **Programme** | La semaine type, avec accès à chaque séance et à l'**éditeur de programme** |
| **Stats** | Calendrier d'activité, courbes de progression, radar musculaire, records |
| **Cardio** | Zones de fréquence cardiaque et séances de running |
| **Profil** | Pseudo, avatar, statistiques globales, données personnelles, réinitialisation |

---

## Fonctionnalités

### Séance du jour

- **Séance suggérée automatiquement** selon le jour de la semaine, avec un badge « Suggéré ». Le bouton **Changer** permet de choisir n'importe quel autre programme (badge « Modifié ») et de **revenir au programme suggéré** en un clic.
- **Carte d'en-tête** avec le nom de la séance, le pourcentage d'avancement et le nombre de séries validées (`x/y séries`), accompagnés d'une barre de progression en temps réel.
- **Saisie des séries** : pour chaque série, une case à cocher, la charge (kg) et les répétitions (ou les secondes pour les exercices chronométrés comme la planche ou les mountain climbers).
- **Préremplissage intelligent** : la charge proposée est celle de votre dernière séance sur l'exercice (à défaut, votre record), et les répétitions sont celles de la cible du programme.
- **« Dernière fois »** : sous chaque exercice, votre meilleure série de la séance précédente (ex. *Dernière fois · lun. 12 oct. : 60 kg × 10 · 4 séries*).
- **Suggestion de progression (surcharge progressive)** : quand toutes les séries prévues ont été validées à la séance précédente, l'appli le signale.
  - Si chaque série a atteint le haut de la fourchette de répétitions, elle propose d'**augmenter la charge** (+2,5 kg par défaut, réglable par exercice) avec un bouton **Appliquer** qui met à jour les séries restantes.
  - Sinon, elle conseille de **garder la charge** et de viser le haut de la fourchette avant de monter.
  - Aucune suggestion pour les exercices à l'échec, chronométrés ou d'échauffement.
- **Cartes d'exercice en accordéon** : l'exercice en cours est mis en avant, un exercice terminé se replie automatiquement (réouvrable d'un tap) et l'écran défile vers le suivant.
- **Badges d'exercice** : compound ou isolation (avec temps de repos indicatif), superset et optionnel pris en charge par le système de badges.
- **Mémos par exercice** : un champ « Réglages » (ex. *cran 4, prise large*) et un **RPE /10** enregistrés pour chaque exercice et chaque jour.
- **Minuteur de repos fiable** : se lance automatiquement à chaque série validée, avec la durée de repos propre à l'exercice, un bouton **+30 s** et une fermeture manuelle.
  - Le décompte repose sur l'**heure réelle** (et non sur un compteur) : il reste exact même si l'écran se verrouille ou si l'appli passe en arrière-plan, et il est rattrapé au retour. Il est aussi **restauré après un rechargement** de la page.
  - **Alertes** : alerte visuelle sur les 10 dernières secondes, bips sur les 3 dernières, puis **sonnerie + vibration** et message « GO ! » à la fin (vibration non disponible sur Safari iPhone).
  - L'**écran reste allumé** pendant le repos (Wake Lock) sur les navigateurs compatibles.
  - Son et vibration se règlent dans **Profil > Minuteur de repos**, avec un bouton de test.
- **Calculateur d'échauffement** : à partir de votre charge de travail (ou de votre record), génère 5 séries progressives — 40 % × 12, 60 % × 8, 75 % × 5, 85 % × 3, 95 % × 1 — arrondies au 0,5 kg.
- **Check-in de forme (Readiness)** : au premier affichage d'une séance de salle, un questionnaire à 3 critères sur 5 étoiles (sommeil, énergie et stress, état musculaire). La moyenne donne un score affiché en pastille colorée (vert, jaune, rouge) et un message adapté, avec une suggestion de baisser les charges de 10 à 15 % si la forme est basse.
- **Résumé de fin de séance** : s'affiche automatiquement quand toutes les séries sont validées (le minuteur est alors coupé), ou à la demande avec le bouton **Résumé de la séance**. Il présente le tonnage (et son équivalence ludique), le nombre de séries, la **durée**, le **RPE moyen**, les **records battus** pendant la séance et l'évolution du tonnage par rapport à la dernière séance identique.
  - La durée cumule le temps entre les séries validées ; les pauses de plus de 45 min ne sont pas comptées.
- **Supersets** : deux exercices (ou plus) qui portent la même lettre (A à D, réglable dans l'éditeur) sont placés côte à côte et s'ouvrent ensemble. Après la série du premier, aucun repos : l'appli te dit d'enchaîner avec le suivant ; le minuteur ne démarre qu'après le dernier exercice du superset, avec le repos le plus long du groupe.
- **Exercice de remplacement** (bouton **Remplacer**, tant qu'aucune série n'est validée) : l'appli propose des exercices connus qui travaillent le même muscle et ne sont pas déjà dans la séance (par ressemblance de muscle, de type et de mode), ou tu saisis un autre nom. Le remplaçant reprend les séries et répétitions de l'original, pour aujourd'hui seulement ; **Rétablir** annule tant qu'aucune de ses séries n'est validée. Ses séries comptent dans le tonnage, les records et le volume musculaire, et l'historique garde son nom.
- **Machine prise ? Sauter ou reporter un exercice** : sous chaque exercice non terminé, **Passer à la fin** le déplace en dernière position de la séance du jour, et **Sauter** (tant qu'aucune série n'est validée) le met de côté avec un bouton **Reprendre**. Un exercice sauté ne compte pas dans la progression : la séance est complète, et son résumé s'affiche, quand tout le reste est validé. Les exercices sautés apparaissent dans le résumé et dans l'historique.
- **Notes de séance** : un champ libre sous les exercices (forme du jour, douleurs, points à améliorer), enregistré automatiquement, modifiable aussi depuis le résumé de fin de séance, le tiroir d'un jour du Programme et le détail de l'historique.
- **Tonnage du jour** : volume total soulevé, converti en équivalence ludique (chats, adultes, motos, vaches, voitures, éléphants d'Afrique, bus…).
- **Jour de repos** : écran dédié avec streak, régularité, dernière séance effectuée, prochaine séance prévue et accès au choix d'un programme.

### Records et force

- **Détection automatique des records (PR)** : toute charge ou répétition supérieure à votre meilleure performance déclenche une fenêtre « Nouveau record ! » (fermable d'un tap, sinon masquée après 6 s) et un marqueur **PR** sur la série.
- **1RM estimé** (formule de Brzycki) avec le tableau des pourcentages 100 / 95 / 90 / 85 / 80 / 75 / 70 %.
- **Force relative** : ratio charge / poids de corps (ex. « 1,5× BW »), affiché dans les records.

### Éditeur de programme

Depuis l'onglet **Programme** (bouton **Modifier**), le programme n'est plus figé dans le code :

- **Semaine type** : choisissez la séance suggérée pour chacun des 7 jours.
- **Séances** : créer une nouvelle séance, la renommer, choisir sa couleur (rouge, bleu, jaune, vert) ou la supprimer. Les jours qui l'utilisaient repassent en repos.
- **Exercices** : ajouter, supprimer (confirmation en deux temps), **réordonner** (flèches haut / bas) et modifier chaque exercice :
  - nom (avec suggestions des exercices déjà connus : réutiliser un nom existant conserve son historique et ses records) ;
  - nombre de **séries** et **répétitions** (min / max, ou *à l'échec*) ; mode **au temps** en secondes ;
  - **temps de repos**, type (compound, isolation, échauffement) et **pas de progression** en kg ;
  - **muscles travaillés**, utilisés pour le radar.
- **Superset** (A à D) : deux exercices avec la même lettre sont enchaînés avec un seul repos.
- **Course à pied** : choisis pour chaque jour une sortie running (ou aucune), crée tes propres types de sorties (nom, description, déroulé) avec des **objectifs de distance, de durée et d'allure**, et fixe un **objectif de distance par semaine**. Les objectifs s'affichent sur la carte de la sortie et dans le planning, et sont comparés à ton résultat (« distance atteinte », « allure tenue », « +30 s/km »). Supprimer un type de sortie ne supprime pas les sorties déjà enregistrées.
- **Rétablir le programme d'origine** en un clic (séances, semaine type et sorties running).
- Chaque modification est **enregistrée immédiatement** et prise en compte dans l'écran Séance, le calendrier et les statistiques. Retirer un exercice ne supprime jamais son historique, qui reste consultable dans les graphiques.

### Statistiques

- **Streak et régularité sur 7 jours**.
- **Calendrier d'activité** sur 16 semaines, façon GitHub, avec 5 niveaux d'intensité selon le tonnage du jour (les sorties running comptent aussi).
- **Évolution des charges** : sélection de n'importe quel exercice et trois modes de graphique — **Max** (charge maximale), **Moy** (charge moyenne) et **Tonnage** (volume hebdomadaire, pour suivre la surcharge progressive).
- **Radar de répartition musculaire** sur les 7 derniers jours : pecs, dos, épaules, biceps, triceps, abdos, jambes.
- **Records personnels** : les 20 meilleures charges avec date, répétitions, 1RM estimé et ratio au poids de corps.
- **Historique des séances** : bouton en haut de l'onglet (ou tap sur une case du calendrier d'activité). La liste est classée par mois ; chaque séance ouvre un détail complet : tonnage, séries, durée, RPE moyen, records, séries par exercice, réglages machine et RPE notés, course éventuelle.
  - **Dupliquer cette séance** : préremplit la séance d'aujourd'hui avec les mêmes charges, répétitions et réglages (rien n'est validé). Impossible si des séries sont déjà validées aujourd'hui.
- **Objectifs de force et de poids** : une cible par exercice (« développé couché 100 kg ») ou pour le poids de corps. Chaque objectif affiche le chemin parcouru depuis sa création (barre de progression) et une **estimation de la date d'arrivée**, calculée par régression linéaire sur tes charges maximales des 120 derniers jours (au moins 3 séances sur 14 jours) ou sur tes pesées des 90 derniers jours (au moins 2 sur 7 jours). Sans assez de données, avec une progression à l'arrêt ou une tendance opposée, l'appli le dit plutôt que d'inventer une date. Un toast signale l'objectif atteint.
- **Volume hebdomadaire par muscle** : nombre de séries de travail par muscle sur la semaine (lundi à dimanche), comparé à une zone cible (10 à 20 séries par défaut, réglable muscle par muscle). La barre montre le fait, plus un segment hachuré pour ce qui reste **prévu au programme** jusqu'à dimanche, et une phrase indique quels muscles resteront sous leur minimum. Flèches pour revoir les semaines passées. Règles de comptage : l'échauffement n'est pas compté ; le premier muscle d'un exercice compte une série entière, les suivants une demi-série (les muscles se règlent dans l'éditeur).
- **Courbe du poids de corps** : journal de pesées (une par jour, date modifiable), courbe sur 30 jours, 90 jours ou tout l'historique, variation sur la période, valeur d'un point au toucher, suppression d'une pesée. La dernière pesée alimente les ratios de force et les zones cardio ; saisir le poids depuis le Profil ou les Records ajoute aussi une pesée.

### Cardio et running

- **Zones de fréquence cardiaque** calculées avec la FC max théorique (220 − âge), en 5 zones : récupération active, endurance, aérobie, tempo / seuil lactique, VO2max / sprint. Chaque zone affiche sa fourchette en BPM.
- **Trois séances de running** type, repliables :
  - Mardi — **Fractionné HIIT** : 10 min d'échauffement, 10 à 15 × (30 s sprint / 30 s récupération), 5 min de retour au calme.
  - Jeudi — **Tempo** : 5 km continus à allure soutenue.
  - Dimanche — **Sortie longue** : 45 à 60 min en endurance fondamentale (zone 2).
- **Journal de course** : durée, distance, RPE (1-10) et bouton « Marquer comme faite ». L'**allure moyenne** (min/km) est calculée dès que la durée et la distance sont saisies, affichée sur la carte et **enregistrée** avec la sortie (champ `pace`, en secondes par km). Elle apparaît aussi dans l'historique et le planning.
- Les cartes affichent les sorties de la **semaine en cours** (lundi à dimanche), avec leur date, pour retrouver une sortie déjà faite. Une séance terminée compte dans le streak, la régularité et le calendrier d'activité.

### Profil

- **Pseudo** personnalisable et **avatar** à choisir parmi 6 couleurs (rouge, bleu, jaune, vert, gris, blanc), avec l'initiale du pseudo.
- **Ancienneté** : date d'inscription et nombre de jours depuis.
- **Statistiques globales** : streak, séances totales, régularité 7 jours, tonnage total cumulé en tonnes, et équivalence ludique sur l'ensemble de vos entraînements.
- **Données personnelles** : poids de corps et âge (utilisés pour les ratios de force et les zones cardio).
- **Minuteur de repos** : interrupteurs pour le son et la vibration, et bouton pour tester l'alerte.
- **Rappels d'entraînement** : activation par interrupteur (la permission de notification est demandée à ce moment), heure du rappel et jours choisis (par défaut, les jours d'entraînement de ton programme, running compris), bouton **Tester la notification**. Le texte indique la séance du jour, par exemple « Dos & Épaules + Fractionné HIIT ».
  - Aucun rappel si la séance ou la sortie du jour est déjà faite, ni plus d'un rappel par jour ; il part au plus tard 3 h après l'heure choisie.
  - **HTTPS obligatoire** (ou localhost). Sur Chrome / Edge Android avec l'appli installée, le rappel peut partir **appli fermée** (Periodic Background Sync, selon l'engagement et la gestion de la batterie). Ailleurs (Firefox, Safari / iPhone), il n'est envoyé que tant que l'appli est ouverte, même en arrière-plan. Sans serveur de notifications push, un envoi à heure fixe appli fermée ne peut pas être garanti sur tous les navigateurs.
- **Sauvegarde des données** : **Sauvegarder** exporte tout (séances, records, programme, poids, objectifs, préférences…) dans un fichier JSON daté ; sur iPhone / iPad, l'export passe par la feuille de partage (Enregistrer dans Fichiers). **Restaurer** lit un fichier de sauvegarde et propose deux modes :
  - **Fusionner** (recommandé) : ajoute à l'appareil les séances, records, sorties, pesées et objectifs du fichier, sans rien supprimer. Pour un même jour, la version la plus complète est gardée ; le meilleur record l'emporte ; programme, profil et réglages de l'appareil sont conservés. Un aperçu indique le nombre d'éléments ajoutés.
  - **Remplacer** : efface l'appareil et reprend le fichier.
  - Avant toute restauration, l'état précédent est copié dans la clé de secours `fitcore_before_import`.
- **Bandeau de sauvegarde** : un bandeau discret en haut de l'appli apparaît (à partir de 3 séances) si tu n'as jamais sauvegardé depuis plus d'une semaine, ou si la dernière sauvegarde date de 30 jours ou plus ; il propose **Sauvegarder** ou de repousser le rappel de 7 jours. L'appli demande aussi au navigateur de **protéger le stockage** contre l'effacement automatique une fois l'appli utilisée.
- **Diagnostic de l'appareil** : le bouton **Vérifier mon appareil** contrôle sur ton téléphone le HTTPS, l'installation, le service worker, le mode hors ligne, la protection du stockage et l'espace utilisé, les notifications, les rappels en arrière-plan, le maintien de l'écran allumé, le son, la vibration et le partage de fichier, avec des boutons de test.
- **Zone danger** : réinitialisation complète des données, avec confirmation. Le pseudo, l'avatar, le **programme personnalisé** et les préférences sont conservés ; l'ancienneté repart de zéro.

---

## Programme d'entraînement

Planning hebdomadaire suggéré (modifiable jour par jour depuis l'écran Séance) :

| Jour | Séance suggérée | Exercices |
|---|---|---|
| Lundi | Pectoraux & Triceps | 12 |
| Mardi | Dos & Épaules | 10 |
| Mercredi | Abdominaux & Core | 7 |
| Jeudi | Pectoraux & Triceps | 12 |
| Vendredi | Dos & Épaules | 10 |
| Samedi | Repos | — |
| Dimanche | Repos | — |

Ce planning est le programme **par défaut** : il peut être entièrement personnalisé avec l'éditeur ci-dessus. Le sélecteur de programme propose aussi **Jambes & Mollets** (6 exercices), **Épaules & Trapèzes**, **Rappel haut du corps** et **Repos total**. Chaque séance est repérée par une couleur : rouge (pecs / triceps, rappel), bleu (dos / épaules), vert (abdos), jaune (jambes).

La vue **Programme** affiche la semaine en cours, du lundi au dimanche. Un encart **Cardio de la semaine** résume les sorties running prévues (sorties faites, distance avec barre vers l'objectif hebdomadaire, durée, allure moyenne), et chaque jour de running du planning (par défaut mardi, jeudi, dimanche ; modifiable) affiche sa sortie (par défaut *Fractionné HIIT*, *Tempo*, *Sortie longue*) avec son objectif : à faire, ou faite avec distance, durée et allure ; un tap ouvre la carte correspondante dans l'onglet Cardio. La vue liste aussi les 7 jours avec leur avancement ; un tap sur un jour ouvre un tiroir (*drawer*) qui permet de saisir ou consulter la séance, ou de changer de programme.

---

## PWA et mode hors ligne

- **Manifeste** (`manifest.json`) : nom « Gym Addict », affichage `standalone`, orientation portrait, catégories santé / fitness / sport, icônes 192 et 512 px (dont une version *maskable*) et icône Apple Touch.
- **Raccourcis d'application** (appui long sur l'icône) : « Aujourd'hui », « Programme », « Cardio » et « Statistiques ». L'appli lit l'ancre de l'URL (`#today`, `#week`, `#stats`, `#cardio`, `#profile`) au démarrage et quand l'URL change, puis la nettoie : elle s'ouvre directement sur le bon onglet.
- **Service Worker** (`sw.js`, cache `ga-v2.8.6`) :
  - **pré-cache** de l'application (HTML, CSS, JS, manifeste, icônes) à l'installation ;
  - stratégie **cache-first** pour les fichiers de l'appli et les polices Google Fonts ;
  - stratégie **network-first** avec repli sur le cache pour les autres requêtes ;
  - **nettoyage automatique** des anciens caches à l'activation, avec prise de contrôle immédiate des pages ouvertes ;
  - message de repli « Hors ligne » quand une ressource est indisponible ;
  - gestionnaire de synchronisation en arrière-plan (`sync-workouts`) réservé pour une future synchronisation ;
  - **rappels d'entraînement** : lecture de la configuration (cache `ga-config`, conservé lors des mises à jour), affichage de la notification et ouverture de l'appli au tap (`notificationclick`).
- **Compatibilité iOS** : mode plein écran, barre d'état translucide, gestion des zones sûres (`viewport-fit=cover`).

> Pour publier une nouvelle version, incrémentez `CACHE_VERSION` dans `sw.js` afin que les appareils récupèrent les fichiers à jour.

---

## Données et confidentialité

Toutes les données restent **sur votre appareil**, dans le `localStorage` du navigateur (clé `fitcore`) : séances, charges, répétitions, notes, RPE, records, jours actifs, journaux de course, check-ins, profil, poids de corps, âge, **programme personnalisé** et préférences du minuteur. L'état du minuteur en cours est conservé séparément (clé `ga_timer`). La base contient aussi les exercices sautés, remplacés et l'ordre du jour (`skipped`, `swaps`, `dayOrder`), les objectifs (`goals`), les noms et muscles des exercices (`exNames`, `exDefs`), les réglages de rappel (`prefs.reminder`), le journal de poids (`weightLog`) et les métadonnées de séance (`sessionMeta` : durée, séance, records battus, note de séance). Aucune donnée n'est envoyée à un serveur et aucun compte n'est nécessaire.

Conséquences à connaître : les données sont propres à chaque navigateur et chaque appareil, et vider les données du site ou désinstaller l'appli les supprime. La synchronisation automatique entre appareils n'existe pas : utilisez l'export / import JSON (Profil > Sauvegarde des données).

---

## Installation

L'application ne nécessite ni build ni dépendance à installer.

1. Placez les fichiers `index.html`, `style.css`, `manifest.json` et `sw.js` à la racine, avec le dossier `js/` (tous les fichiers sont nécessaires : le service worker les met en cache à l'installation) et le dossier `assets/` contenant les icônes (`icon-192.png`, `icon-512.png`, `icon-512-maskable.png`, `apple-touch-icon.png`).
2. Servez le dossier en **HTTPS** (GitHub Pages, Netlify, Vercel…) ou en local, par exemple avec `npx serve` ou `python -m http.server`. Le service worker et l'installation PWA ne fonctionnent pas en ouvrant directement le fichier (`file://`).
3. Ouvrez l'adresse dans un navigateur moderne, puis :
   - **Android / Chrome** : menu → *Installer l'application* ;
   - **iOS / Safari** : Partager → *Sur l'écran d'accueil*.

Une connexion est utile au premier chargement pour récupérer les polices (l'appli reste utilisable avec les polices du système sinon) ; ensuite, tout est mis en cache et l'appli fonctionne hors ligne, graphiques compris.

---

## Structure du projet

```
├── index.html        Structure, onglets, minuteur, fenêtre de record, tiroir, navigation
├── style.css         Thème clair / sombre, composants, animations
├── manifest.json     Métadonnées PWA, icônes, raccourcis
├── sw.js             Service Worker (cache, mode hors ligne, rappels)
├── readme.md         Ce fichier
├── assets/           Icônes de l'application
└── js/
    ├── loader.js     Chargeur de modules à la demande
    ├── data.js       Programme par défaut, configuration, stockage, calculs de base           ┐
    ├── core.js       Écran Séance, minuteur, séries, records, supersets, sauter / reporter    ├ chargés
    ├── stubs.js      Points d'entrée des modules à la demande (générés)                       │ au démarrage
    ├── app.js        Navigation par onglets et démarrage                                      ┘
    ├── stats.js      Onglet Stats : graphiques SVG, calendrier, objectifs, volume, poids      ┐
    ├── week.js       Onglet Programme : planning, cardio de la semaine, tiroir d'un jour      │
    ├── cardio.js     Onglet Cardio : zones et sorties running                                 │
    ├── profile.js    Onglet Profil : avatar, données, minuteur, réinitialisation              │ chargés à la
    ├── editor.js     Éditeur de programme et de sorties running                               │ demande
    ├── history.js    Historique, duplication d'une séance, résumé de fin de séance            │
    ├── backup.js     Sauvegarde, import / fusion, diagnostic de l'appareil                    │
    ├── reminders.js  Rappels d'entraînement (notifications)                                   │
    └── swap.js       Remplacement d'un exercice                                               ┘
```

### Chargement

Au démarrage, seul le **noyau** (`loader`, `data`, `core`, `stubs`, `app`, environ 86 Ko au lieu de 200 Ko, soit 26 Ko au lieu de 57 Ko une fois compressés) est chargé : il suffit à afficher l'écran Séance, lancer le minuteur et valider des séries. Les autres modules sont chargés à la **première utilisation** (ouverture d'un onglet, d'un éditeur, d'une fenêtre…) ; ils sont aussi préchargés à basse priorité par le navigateur et mis en cache par le service worker, donc ils restent disponibles hors ligne et s'ouvrent instantanément ensuite. Si un module ne peut pas être chargé (hors ligne, jamais mis en cache), un message l'indique.

### Développement

- Les scripts sont des scripts classiques (pas de modules ES) partageant le même espace global : les gestionnaires `onclick="…"` du HTML continuent de fonctionner.
- Une fonction d'un module à la demande appelée **depuis un autre fichier ou depuis du HTML** doit avoir son point d'entrée dans `stubs.js` (elle charge le module puis s'exécute). Une fonction appelée pour sa **valeur de retour**, ou une constante, doit rester dans le noyau, ou son module doit être déclaré en dépendance dans `loader.js`.
- Tout nouveau fichier est à ajouter à la liste `STATIC_ASSETS` de `sw.js`, et la version `CACHE_VERSION` est à incrémenter à chaque publication.

## Technologies

- **HTML5 / CSS3** : variables CSS, Flexbox, Grid, `prefers-color-scheme`
- **JavaScript** vanilla (ES6+), sans framework
- **Google Fonts** : Anton (titres et chiffres), Figtree (texte)
- **Service Worker** et **Web App Manifest**
- **Web Audio**, **Vibration** et **Screen Wake Lock** (minuteur de repos)
- **SVG** inline pour tous les graphiques (courbe de charges, tonnage, radar, poids), sans bibliothèque ni CDN ; **File API / Web Share** pour l'export et l'import