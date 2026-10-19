# GymAddict — Hybrid Tracker

**GymAddict** est une application web progressive (PWA) de suivi d'entraînement pensée pour les pratiquants qui combinent **musculation** et **course à pied**. Saisie rapide des séries, détection automatique des records, minuteur de repos, statistiques visuelles : tout fonctionne **hors ligne**, sans compte et sans serveur.

> HTML5 · CSS3 · JavaScript pur · Chart.js · Service Worker · données stockées localement

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
| **Programme** | La semaine type, avec accès à chaque séance |
| **Stats** | Calendrier d'activité, courbes de progression, radar musculaire, records |
| **Cardio** | Zones de fréquence cardiaque et séances de running |
| **Profil** | Pseudo, avatar, statistiques globales, données personnelles, réinitialisation |

---

## Fonctionnalités

### Séance du jour

- **Séance suggérée automatiquement** selon le jour de la semaine, avec un badge « Suggéré ». Le bouton **Changer** permet de choisir n'importe quel autre programme (badge « Modifié ») et de **revenir au programme suggéré** en un clic.
- **Carte d'en-tête** avec le nom de la séance, le pourcentage d'avancement et le nombre de séries validées (`x/y séries`), accompagnés d'une barre de progression en temps réel.
- **Saisie des séries** : pour chaque série, une case à cocher, la charge (kg) et les répétitions (ou les secondes pour les exercices chronométrés comme la planche ou les mountain climbers).
- **Préremplissage intelligent** : la charge proposée est celle de votre record sur l'exercice, et les répétitions sont celles de la cible du programme.
- **Cartes d'exercice en accordéon** : l'exercice en cours est mis en avant, un exercice terminé se replie automatiquement (réouvrable d'un tap) et l'écran défile vers le suivant.
- **Badges d'exercice** : compound ou isolation (avec temps de repos indicatif), superset et optionnel pris en charge par le système de badges.
- **Mémos par exercice** : un champ « Réglages » (ex. *cran 4, prise large*) et un **RPE /10** enregistrés pour chaque exercice et chaque jour.
- **Minuteur de repos** : se lance automatiquement à chaque série validée, avec une durée adaptée à l'exercice (60 s, 90 s, 2 min…), un bouton **+30 s**, une fermeture manuelle, un passage en alerte visuelle sur les 10 dernières secondes et un message « GO ! » en fin de décompte.
- **Calculateur d'échauffement** : à partir de votre charge de travail (ou de votre record), génère 5 séries progressives — 40 % × 12, 60 % × 8, 75 % × 5, 85 % × 3, 95 % × 1 — arrondies au 0,5 kg.
- **Check-in de forme (Readiness)** : au premier affichage d'une séance de salle, un questionnaire à 3 critères sur 5 étoiles (sommeil, énergie et stress, état musculaire). La moyenne donne un score affiché en pastille colorée (vert, jaune, rouge) et un message adapté, avec une suggestion de baisser les charges de 10 à 15 % si la forme est basse.
- **Tonnage du jour** : volume total soulevé, converti en équivalence ludique (chats, adultes, motos, vaches, voitures, éléphants d'Afrique, bus…).
- **Jour de repos** : écran dédié avec streak, régularité, dernière séance effectuée, prochaine séance prévue et accès au choix d'un programme.

### Records et force

- **Détection automatique des records (PR)** : toute charge ou répétition supérieure à votre meilleure performance déclenche une fenêtre « Nouveau record ! » (fermable d'un tap, sinon masquée après 6 s) et un marqueur **PR** sur la série.
- **1RM estimé** (formule de Brzycki) avec le tableau des pourcentages 100 / 95 / 90 / 85 / 80 / 75 / 70 %.
- **Force relative** : ratio charge / poids de corps (ex. « 1,5× BW »), affiché dans les records.

### Statistiques

- **Streak et régularité sur 7 jours**.
- **Calendrier d'activité** sur 16 semaines, façon GitHub, avec 5 niveaux d'intensité selon le tonnage du jour (les sorties running comptent aussi).
- **Évolution des charges** : sélection de n'importe quel exercice et trois modes de graphique — **Max** (charge maximale), **Moy** (charge moyenne) et **Tonnage** (volume hebdomadaire, pour suivre la surcharge progressive).
- **Radar de répartition musculaire** sur les 7 derniers jours : pecs, dos, épaules, biceps, triceps, abdos, jambes.
- **Records personnels** : les 20 meilleures charges avec date, répétitions, 1RM estimé et ratio au poids de corps.
- **Poids de corps** modifiable directement depuis cet onglet.

### Cardio et running

- **Zones de fréquence cardiaque** calculées avec la FC max théorique (220 − âge), en 5 zones : récupération active, endurance, aérobie, tempo / seuil lactique, VO2max / sprint. Chaque zone affiche sa fourchette en BPM.
- **Trois séances de running** type, repliables :
  - Mardi — **Fractionné HIIT** : 10 min d'échauffement, 10 à 15 × (30 s sprint / 30 s récupération), 5 min de retour au calme.
  - Jeudi — **Tempo** : 5 km continus à allure soutenue.
  - Dimanche — **Sortie longue** : 45 à 60 min en endurance fondamentale (zone 2).
- **Journal de course** : durée, distance, RPE (1-10) et bouton « Marquer comme faite ». Une séance terminée compte dans le streak, la régularité et le calendrier d'activité.

### Profil

- **Pseudo** personnalisable et **avatar** à choisir parmi 6 couleurs (rouge, bleu, jaune, vert, gris, blanc), avec l'initiale du pseudo.
- **Ancienneté** : date d'inscription et nombre de jours depuis.
- **Statistiques globales** : streak, séances totales, régularité 7 jours, tonnage total cumulé en tonnes, et équivalence ludique sur l'ensemble de vos entraînements.
- **Données personnelles** : poids de corps et âge (utilisés pour les ratios de force et les zones cardio).
- **Zone danger** : réinitialisation complète des données, avec confirmation. Le pseudo et l'avatar sont conservés et l'ancienneté repart de zéro.

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

Le sélecteur de programme propose aussi **Jambes & Mollets** (6 exercices), **Épaules & Trapèzes**, **Rappel haut du corps** et **Repos total**. Chaque séance est repérée par une couleur : rouge (pecs / triceps, rappel), bleu (dos / épaules), vert (abdos), jaune (jambes).

La vue **Programme** liste les 7 jours avec leur avancement ; un tap sur un jour ouvre un tiroir (*drawer*) qui permet de saisir ou consulter la séance, ou de changer de programme.

---

## PWA et mode hors ligne

- **Manifeste** (`manifest.json`) : nom « Gym Addict », affichage `standalone`, orientation portrait, catégories santé / fitness / sport, icônes 192 et 512 px (dont une version *maskable*) et icône Apple Touch.
- **Raccourcis d'application** : « Aujourd'hui » et « Programme ».
- **Service Worker** (`sw.js`, cache `ga-v2.7.1`) :
  - **pré-cache** de l'application (HTML, CSS, JS, manifeste, icônes) à l'installation ;
  - stratégie **cache-first** pour les fichiers de l'appli, les polices Google Fonts et Chart.js (CDN) ;
  - stratégie **network-first** avec repli sur le cache pour les autres requêtes ;
  - **nettoyage automatique** des anciens caches à l'activation, avec prise de contrôle immédiate des pages ouvertes ;
  - message de repli « Hors ligne » quand une ressource est indisponible ;
  - gestionnaire de synchronisation en arrière-plan (`sync-workouts`) réservé pour une future synchronisation.
- **Compatibilité iOS** : mode plein écran, barre d'état translucide, gestion des zones sûres (`viewport-fit=cover`).

> Pour publier une nouvelle version, incrémentez `CACHE_VERSION` dans `sw.js` afin que les appareils récupèrent les fichiers à jour.

---

## Données et confidentialité

Toutes les données restent **sur votre appareil**, dans le `localStorage` du navigateur (clé `fitcore`) : séances, charges, répétitions, notes, RPE, records, jours actifs, journaux de course, check-ins, profil, poids de corps et âge. Aucune donnée n'est envoyée à un serveur et aucun compte n'est nécessaire.

Conséquences à connaître : les données sont propres à chaque navigateur et chaque appareil, et vider les données du site ou désinstaller l'appli les supprime. Il n'existe pas encore d'export ni de synchronisation entre appareils.

---

## Installation

L'application ne nécessite ni build ni dépendance à installer.

1. Placez les fichiers `index.html`, `style.css`, `script.js`, `manifest.json` et `sw.js` à la racine, avec le dossier `assets/` contenant les icônes (`icon-192.png`, `icon-512.png`, `icon-512-maskable.png`, `apple-touch-icon.png`).
2. Servez le dossier en **HTTPS** (GitHub Pages, Netlify, Vercel…) ou en local, par exemple avec `npx serve` ou `python -m http.server`. Le service worker et l'installation PWA ne fonctionnent pas en ouvrant directement le fichier (`file://`).
3. Ouvrez l'adresse dans un navigateur moderne, puis :
   - **Android / Chrome** : menu → *Installer l'application* ;
   - **iOS / Safari** : Partager → *Sur l'écran d'accueil*.

Une connexion est nécessaire au premier chargement pour récupérer Chart.js et les polices ; ensuite, tout est mis en cache.

---

## Structure du projet

```
├── index.html        Structure, onglets, minuteur, fenêtre de record, tiroir, navigation
├── style.css         Thème clair / sombre, composants, animations
├── script.js         Programme, logique métier, rendu des 5 onglets, graphiques
├── manifest.json     Métadonnées PWA, icônes, raccourcis
├── sw.js             Service Worker (cache et mode hors ligne)
├── readme.md         Ce fichier
└── assets/           Icônes de l'application
```

## Technologies

- **HTML5 / CSS3** : variables CSS, Flexbox, Grid, `prefers-color-scheme`
- **JavaScript** vanilla (ES6+), sans framework
- **Chart.js 4.4.1** : courbes, barres et radar
- **Google Fonts** : Anton (titres et chiffres), Figtree (texte)
- **Service Worker** et **Web App Manifest**