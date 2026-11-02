# GymAddict — Expo / React Native Web

Version universelle (iOS, Android, navigateur) de GymAddict : Expo, Expo Router, TypeScript strict.

## Démarrer

```bash
npm install
npx expo install --fix     # aligne toutes les dépendances sur la version d'Expo installée
npm run typecheck          # tsc --noEmit
npm test                   # 146 tests : règles métier, robustesse, sens des dépendances
npm run web                # ou: npm run ios / npm run android
```

Les rappels (notifications) et l'export de fichiers demandent un appareil ou un simulateur ;
Expo Go suffit pour les tester, sauf les notifications sur Android récent (utiliser un « development build »).

## Fonctionnalités

| Onglet / écran | Contenu |
|---|---|
| Séance | Programme du jour, séries, minuteur de repos, records, progression, échauffement, supersets, remplacement d'exercice, check-in « forme du jour », notes, tonnage |
| Programme | Semaine type, bilan cardio, détail de chaque jour (modifiable), éditeur de séances / exercices / sorties |
| Stats | Régularité, objectifs (charge, poids) avec date estimée, calendrier d'activité, évolution des charges, radar musculaire, volume hebdomadaire, poids de corps, records |
| Cardio | Zones de fréquence cardiaque, sorties de la semaine, objectif et allure |
| Profil | Identité, statistiques, poids et âge, minuteur (son, vibration), rappels, sauvegarde, diagnostic, réinitialisation |
| Historique | Toutes les séances par mois, relecture, duplication vers aujourd'hui |

## Architecture

```
app/                    Routes Expo Router : écrans fins, aucune logique
  (tabs)/               Séance · Programme · Stats · Cardio · Profil
  day/ summary/ history/ editor/   Écrans empilés (modales)
  +html.tsx             Page HTML racine du web (manifest, service worker)
public/                 manifest.webmanifest, sw.js, icônes (web)
src/
  domain/               TypeScript pur (ni React, ni Expo) — testé
    types/ defaults/ format/ rules/ actions/
  data/                 Persistance : AsyncStorage, store Zustand, fichiers de sauvegarde
  services/             Plateforme : minuteur, son, vibrations, notifications, diagnostic
  features/             UI par fonctionnalité (today, week, cardio, stats, history,
                        editor, profile, backup, reminders, summary, timer, shell)
  ui/                   Composants de base (Text, Card, Button, Sheet, SelectField, Icon…)
  theme/                Jetons de couleurs, polices, thème clair/sombre
assets/fonts            Figtree (14 fichiers statiques) + Anton
tests/                  Règles métier, données par défaut, robustesse (données corrompues,
                        opérations aléatoires), respect du sens des dépendances
```

Sens des dépendances : `app → features → data / services → domain`.
`domain/` n'importe rien d'autre ; `tests/architecture.test.ts` le vérifie.

Chaque écran passe par un hook (`useTodaySession`, `useStats`, `useProgramEditor`…) qui lit le store,
dérive une vue depuis le domaine et expose des actions typées. Les composants affichent et appellent
ces actions, sans règle métier.

## Données

- Même clé `fitcore` que l'ancienne appli : sur le web, AsyncStorage s'appuie sur `localStorage`,
  donc les données existantes sont relues telles quelles.
- `normalizeAppData` accepte n'importe quel JSON (ancien format, trous, types mélangés) et produit un
  `AppData` valide. Les clés inconnues sont conservées (`extras`).
- Un JSON illisible est copié dans `fitcore.corrupt` avant de repartir à vide.
- Toutes les modifications passent par des actions pures `(AppData, args) => AppData`.
- Sauvegarde : fichier JSON (enveloppe `GymAddict` validée avec Zod, ou ancien export brut).
  Import par **fusion** (rien d'existant n'est écrasé, meilleur record conservé) ou **remplacement** ;
  une copie de l'état précédent est gardée dans `fitcore.before-import`.
  Rappel de sauvegarde : dès 3 jours d'entraînement, puis tous les 14 jours (« plus tard » = 7 jours).

## Rappels

Notifications locales (`expo-notifications`) programmées sur les 14 prochains jours : jours et heure au
choix, texte tiré du planning (séance et/ou sortie), aucun rappel un jour de repos ni si l'entraînement
du jour est déjà fait. Le plan est recalculé à chaque changement utile et au retour au premier plan.
**Dans le navigateur, les rappels ne peuvent pas être programmés** : la carte l'indique.

## Web / PWA

`npm run build:web` produit `dist/`. À héberger en HTTPS. `public/` fournit le manifest (avec raccourcis
Aujourd'hui / Programme / Cardio / Stats) et un service worker (appli utilisable hors connexion).
Le navigateur reçoit une demande de stockage persistant une seule fois.

## Ce qui n'a pas pu être vérifié ici

Pas d'accès réseau pour installer Expo : rien n'a tourné sur appareil ni dans un navigateur.

- Vérifié : `tsc` strict sur `domain/` (0 erreur) ; 146 tests dont 1 500 jeux de données
  corrompus et 250 suites de 40 opérations aléatoires (aucune exception, enregistrement stable) ; typage de la couche UI contre des
  déclarations simplifiées de React / React Native / Expo ; résolution de tous les imports internes ;
  syntaxe de `sw.js`, `app.json`, `package.json`, `manifest.webmanifest`.
- Non exécuté : rendu des écrans, graphiques SVG, `data/backup/` (Zod, fichiers), `services/reminders.ts`,
  `services/diagnostic.ts`, `public/sw.js`, `app/+html.tsx`.
- À contrôler au premier lancement : les API des paquets Expo en version `latest`
  (`expo-file-system`, `expo-notifications`, `expo-audio`) ; que `app/+html.tsx` est bien pris en compte
  avec `web.output: "single"` (sinon, ajouter le lien du manifest autrement).
