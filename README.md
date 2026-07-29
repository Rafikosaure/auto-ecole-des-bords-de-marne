# Gestionnaire d'auto-école - ADB Manager

## Description

ADB Manager est une application web conçue spécifiquement pour optimiser la gestion administrative de l'auto-école des Bords de Marne, un établissement situé dans l'est de la Région parisienne.  
➡️ **Site officiel de l'auto-école** : [https://autoecole-bordsdemarne.fr/](https://autoecole-bordsdemarne.fr/)  
⚙️ **Ce projet** : une solution interne développée pour répondre aux besoins de gestion de cet établissement.

## Fonctionnalités principales

- **Gestion des étudiants, moniteurs et administrateurs** : ajout, modification et suppression des profils, avec pagination et recherche.
- **Communication par email** : envoi de convocations, relances et convocations d'examen aux étudiants (via Nodemailer), avec pièces jointes PDF le cas échéant.
- **Génération de contrats PDF** : création du contrat de formation de chaque étudiant au format PDF (rendu HTML via EJS, converti en PDF par Playwright/Chromium), avec signatures électroniques.
- **Gestion documentaire des moniteurs** : upload et consultation des documents administratifs (carte d'identité, permis, carte d'enseignement, contrat de travail).
- **Interface utilisateur ergonomique** : application single-page (SPA) développée avec React.
- **API REST sécurisée** : authentification par cookie JWT, backend Node.js/Express.

## Technologies utilisées

- **Frontend** :
  - React 19 + React Router
  - Vite (bundler et serveur de développement)
  - React Hook Form + Zod (formulaires et validation)
  - TanStack Query (gestion du state serveur / cache des requêtes API)
  - Bootstrap / react-bootstrap (styles et composants, design responsive)
  - Organisation du code en feature-folders (`src/features/<domaine>`) : chaque domaine métier (étudiants, moniteurs, administrateurs, authentification, documents) regroupe ses propres pages, hooks d'accès à l'API et schémas de validation.

- **Backend** :
  - Node.js + Express.js
  - Prisma (ORM)
  - PostgreSQL (base de données relationnelle)
  - Playwright (rendu de PDF côté serveur à partir de templates EJS)
  - JWT + cookies HttpOnly pour l'authentification, bcrypt pour le hachage des mots de passe

- **Autres outils** :
  - Variables d'environnement (fichiers `.env`, voir `.env.example` à la racine de `frontend/` et `backend/`) pour sécuriser et configurer les données sensibles.
  - ESLint pour le frontend.

## Installation et démarrage (environnement de développement)

Prérequis : Node.js (LTS), une instance PostgreSQL accessible.

### Backend

```bash
cd backend
npm install
cp .env.example .env   # puis renseigner les valeurs (voir ci-dessous)
npx prisma db push     # crée les tables dans la base PostgreSQL configurée
npm run dev             # démarre le serveur avec nodemon (rechargement à chaud)
```

Variables d'environnement clés à renseigner dans `backend/.env` :
- `DBHOST`, `DBPORT`, `DBNAME`, `DBUSER`, `DBPASSWORD` : connexion à la base PostgreSQL.
- `DATABASE_URL` : chaîne de connexion PostgreSQL complète, requise par le CLI Prisma (`postgresql://USER:PASSWORD@HOST:PORT/DBNAME`).
- `DEFAULTADMINUSERNAME`, `DEFAULTADMINEMAIL`, `DEFAULTADMINPASSWORD` : compte administrateur créé automatiquement au premier démarrage.
- `TOKEN`, `RESETTOKEN` : secrets de signature JWT.
- `FRONTENDROUTE`, `BACKENDROUTE` : URLs respectives du frontend et du backend (CORS, liens dans les emails).
- `EMAIL_SENDER_ADDRESS`, `GMAIL_APP_PASSWORD`, `EMAIL_HOST`, `EMAIL_PORT` : identifiants SMTP pour l'envoi d'emails.
- `COMPLETE_IMAGES_SIGNATURES_PATH` : URL de base pour la récupération des images de signature de contrat.

La génération de contrats PDF nécessite les navigateurs Playwright : `npx playwright install chromium` (à exécuter une fois après `npm install`).

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # puis renseigner VITE_API_BASE_URL et VITE_API_BASE_URL_IMAGES
npm run dev
```

## Déploiement

L'application est divisée en deux parties déployées séparément :
- Une application frontend statique (build Vite), accessible via un nom de domaine principal.
- Un backend Node.js dédié, gérant l'API et les traitements métier, connecté à une base PostgreSQL.

## Auteurs

Le projet a été réalisé par une équipe de quatre développeurs dans le cadre d'un stage. Il répond à un besoin métier spécifique et illustre une démarche de développement rigoureuse, de la conception à la mise en production.
