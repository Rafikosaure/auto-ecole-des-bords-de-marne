# Plan de migration architecturale — Frontend ADB Manager

## Objet de ce document

Ce fichier est une référence autonome destinée à guider une IA (ou un développeur) dans
la réécriture architecturale du frontend du projet **ADB Manager** (gestionnaire
d'auto-école). Il a été produit après un audit complet du code existant (scan
axios → fetch déjà réalisé, puis audit ESLint) qui a révélé des anomalies de
conception concentrées sur deux zones : les formulaires de génération de documents
PDF/email, et les pages CRUD (étudiants/moniteurs/administrateurs).

**Mode d'emploi pour l'IA qui exécute ce plan :**
1. Lire ce document en entier avant de modifier quoi que ce soit.
2. Vérifier l'état actuel du projet (`git status`, structure de `src/`) — le plan a
   été écrit à partir d'un état précis du code ; si des fichiers ont changé depuis,
   signaler les écarts avant de continuer plutôt que de les ignorer.
3. Exécuter les phases **dans l'ordre** (0 → 1 → 2 → 3), sans sauter les critères
   de validation de fin de phase.
4. Ne jamais improviser une décision marquée « à trancher avec l'équipe » sans
   poser la question explicitement.
5. Ne jamais toucher au backend (voir Invariants ci-dessous).

---

## Contexte métier

Projet interne développé pour l'auto-école des Bords de Marne (Bry-sur-Marne).
Fonctionnalités principales :
- Gestion des étudiants (CRUD).
- Gestion des moniteurs/instructeurs (CRUD).
- Gestion des comptes administrateurs (CRUD).
- Envoi d'emails automatisés vers les étudiants (convocation formation, relance,
  convocation examen).
- Génération de contrats de formation au format PDF (document multi-pages avec
  signatures électroniques).

Stack :
- **Frontend** : React 19 + React Router 7, Vite, Bootstrap/react-bootstrap.
- **Backend** (hors périmètre de ce plan) : Node.js + Express, Prisma (ORM),
  génération de PDF via templates EJS rendus en HTML puis convertis par Playwright
  (Chromium headless).

---

## Diagnostic — pourquoi cette migration

### 1. Génération de documents : state monolithique 1-pour-1 avec un JSON imbriqué

Le backend (`backend/middlewares/generatePDF.js`) injecte `req.body` tel quel dans
un template EJS (`backend/models/files/<documentType>.ejs`) rendu en PDF par
Playwright. Le frontend doit donc produire, pour chaque type de document, un JSON
dont la forme est un **contrat imposé** avec le template EJS.

Au lieu de gérer ce JSON comme un seul objet validé, le composant
`src/components/StudentContract/PrintContractViewerWindow.jsx` déclare **environ 90
`useState` individuels**, un par feuille de l'arbre JSON, et les distribue en props
à ses 5 sous-composants (`StudentContractPage1.jsx` à `StudentContractPage5.jsx`).
Exemple concret : `StudentContractPage2.jsx` reçoit à elle seule **~80 props
setters individuels** dans sa signature.

Conséquences observées :
- `/* eslint-disable react-hooks/exhaustive-deps */` en tête de fichier de
  `PrintContractViewerWindow.jsx` — la liste de dépendances est devenue impossible
  à maintenir honnêtement.
- Dans `PrintContractViewerWindow.jsx` : `codeExamDateObject`, `examOptionsDate`,
  `examOptionsTime` sont calculés puis jamais utilisés — la date d'examen est
  hardcodée à `""` avec un commentaire `// Mettre en forme la date d'examen avant
  la validation !` (TODO jamais fait). `evalPrealable` n'est jamais lu : son
  libellé `"Évaluation Préalable"` est réécrit en dur ailleurs dans l'objet
  envoyé, créant une divergence silencieuse possible avec les données source.
  `setDocumentType`, `setFormationStartDate`, `setEndingDesiredDate` ne sont
  jamais appelés : ces champs sont en pratique en lecture seule malgré leur state.
- Dans `src/components/StudentCom/ConvocFormation/ConvocationFormation.jsx` : 9
  setters day/month/year (`setFormationStartDay`, etc.) sont morts — le code qui
  devait les appeler est **encore présent en commentaire** (lignes ~101, 103, 105),
  preuve d'un refactor abandonné en cours de route. Un bloc `if` de validation de
  dates (lignes ~68-69) calcule un résultat puis ne fait **rien** avec — aucune
  validation n'est réellement appliquée avant envoi.
- `src/redux/slices/printFileDataSlice.js` (Redux) n'existe que pour faire
  transiter ce blob JSON entre `PrintContractViewerWindow.jsx` (qui le construit)
  et `PrintContractButton.jsx` (qui l'envoie) — deux composants frères sous
  `PrintContractView.jsx`. C'est le **seul** usage de Redux dans tout le projet
  (`src/redux/store.js` ne déclare que ce reducer).

### 2. Pages CRUD : copier-coller avec dérive

- `reloadPage` existe en double, mort dans les deux cas :
  `src/pages/StudentsPage/StudentsPage.jsx` (ligne ~128) et
  `src/pages/InstructorsPage/InstructorsPage.jsx` (ligne ~148).
- `isSearchActive` est correctement branché dans `StudentsPage.jsx` (masque la
  pagination pendant une recherche) mais mort dans `InstructorsPage.jsx` (ligne
  ~23) — le state existe, le branchement JSX correspondant n'a jamais été copié.
- Chaque page CRUD (`StudentsPage`, `InstructorsPage`, `AdminPage`, `OneStudent`)
  réimplémente à la main : fetch, `useState` de chargement/erreur, `try/catch`,
  rappel manuel de la fonction de fetch après chaque mutation, et pour certaines,
  une vérification dupliquée `if (error.response.status === 401 || 403)
  navigate('/connexion')`.
- `src/pages/AdminPage/AdminPage.jsx` (ligne ~23) contient un `eslint-disable`
  pour `react-hooks/exhaustive-deps` qui ne sert plus à rien — la fonction visée a
  dû être stabilisée depuis sans que le commentaire soit retiré.

### 3. Conclusion du diagnostic

Trois traitements différents de la même règle `exhaustive-deps` dans trois
fichiers différents (warning simple / eslint-disable orphelin / eslint-disable
fichier entier) : aucun standard commun. Le state serveur et le state formulaire
sont gérés à la main partout, sans bibliothèque dédiée, alors que
`react-hook-form` est déjà une dépendance du projet (utilisée uniquement dans
`StudentCommunication.jsx`) et donc largement sous-exploitée.

---

## Invariants non négociables (à respecter à chaque phase)

1. **Le backend n'est pas modifié.** Ni les routes Express, ni les contrôleurs, ni
   les templates `.ejs` (`backend/models/files/*.ejs`), ni le pipeline Playwright
   (`backend/middlewares/generatePDF.js`). Le contrat de données (forme exacte du
   JSON attendu par `generatePDFfromHTML` / `sendMail`) doit rester identique bit
   à bit.
2. **La conversion booléen → `"checked"`/`""`** (fonction `fromCheckedToTrue` dans
   `PrintContractViewerWindow.jsx`) doit être préservée telle quelle dans le
   nouveau code — c'est un contrat avec le template EJS (probablement un attribut
   HTML `checked` littéral attendu comme chaîne), pas une bizarrerie à corriger.
3. **`src/api/apiClient.js` (basé sur `fetch`) ne change pas.** Il expose déjà une
   interface `{data, status, headers}` + une redirection centralisée vers
   `/connexion` sur 401/403. Tout le reste (React Query, formulaires) s'appuie
   dessus sans le retoucher.
4. Chaque phase doit laisser le projet **buildable et lint-clean** avant de passer
   à la suivante : `npm run build` puis `npm run lint` doivent réussir sans
   erreur (les warnings restants doivent être justifiés explicitement).
5. Avant d'écrire le schéma Zod du contrat (Phase 2.2), **lire le template EJS
   réel** (`backend/models/files/contratStagiaire.ejs`, et l'équivalent pour les
   emails de convocation) pour vérifier que le schéma Zod correspond exactement
   aux champs réellement interpolés — ce document n'a pas eu accès au contenu de
   ces templates, donc toute divergence doit être vérifiée à ce moment-là, pas
   supposée.

---

## Cartographie des fichiers concernés (état au moment de l'audit)

```
src/
├── api/
│   ├── apiClient.js                     # NE CHANGE PAS (fetch, interface axios-like préservée)
│   └── routes.js
├── redux/
│   ├── store.js                          # sera supprimé en Phase 3
│   └── slices/printFileDataSlice.js      # seul slice du projet, sera supprimé en Phase 3
├── pages/
│   ├── StudentsPage/StudentsPage.jsx     # → features/students/
│   ├── InstructorsPage/InstructorsPage.jsx  # → features/instructors/
│   ├── AdminPage/AdminPage.jsx            # → features/admins/
│   ├── ConnexionPage/ConnexionPage.jsx    # → features/auth/
│   ├── InstructorProfilPage/InstructorProfilPage.jsx  # → features/instructors/
│   └── OneStudentPage/OneStudentPage.jsx  # wrapper fin, fusionné dans features/students/ en Phase 3
├── components/
│   ├── Students/OneStudent.jsx            # → features/students/
│   ├── Students/StudentCard.jsx           # → features/students/
│   ├── StudentsAdmin/AddStudentForm.jsx   # → features/students/ (réécrit RHF+Zod)
│   ├── StudentsAdmin/UpdateStudent.jsx    # → features/students/ (réécrit RHF+Zod)
│   ├── StudentCom/StudentCommunication.jsx        # → features/documents/convocation/
│   ├── StudentCom/ConvocFormation/ConvocationFormation.jsx  # → features/documents/convocation/ (réécrit RHF+Zod)
│   ├── StudentContract/PrintContractView.jsx       # → features/documents/contract/
│   ├── StudentContract/PrintContractViewerWindow.jsx  # → features/documents/contract/ (réécrit, FormProvider)
│   ├── StudentContract/PrintContractButton.jsx     # → features/documents/contract/ (réécrit, lit useFormContext)
│   ├── StudentContract/deleteFilesAfterProcessing.js  # inchangé (déjà fetch), déplacé avec le reste
│   ├── StudentContract/StudentContractPages/StudentContractPage1.jsx à 5.jsx  # → features/documents/contract/ (réécrits, useFormContext)
│   ├── StudentContract/StudentContractPages/temporaryData.js  # → defaultContractData.js
│   ├── SignaturePad/SignaturePad.jsx       # reste partagé, hors features/ (déjà fetch, ne change pas)
│   ├── SearchForm/SearchForm.jsx           # reste partagé, hors features/
│   └── Template/                           # reste partagé, hors features/ (layout)
└── utils/phoneUtils.js                     # reste partagé, ne change pas
```

Dépendances actuelles (`package.json`) :
```
react, react-dom, react-router-dom, react-bootstrap, bootstrap,
react-hook-form (sous-utilisé), react-icons, react-toastify, date-fns,
@reduxjs/toolkit, react-redux   ← seront retirés en Phase 3
```

---

## Phase 0 — Fondations

**Priorité : P0 (bloquant pour tout le reste). Risque : nul, aucun changement de comportement.**

| Fichier | Action |
|---|---|
| `package.json` | Ajouter `zod`, `@hookform/resolvers`, `@tanstack/react-query` (dependencies) et `@tanstack/react-query-devtools` (devDependency) |
| `src/api/queryClient.js` *(nouveau)* | Instancier un `QueryClient` (retry raisonnable, `staleTime` par défaut cohérent avec la fréquence de rafraîchissement des données métier) |
| `src/main.jsx` | Envelopper `<App />` avec `<QueryClientProvider client={queryClient}>`. Garder `<Provider store={store}>` (Redux) tel quel pour l'instant — il sera retiré en Phase 3 |

**Validation de fin de phase :** `npm install` puis `npm run build` réussissent, aucune régression visuelle (rien n'a encore changé fonctionnellement).

---

## Phase 1 — State serveur : CRUD vers TanStack Query

**Priorité : P1 (haute valeur, risque faible — la forme des données ne change pas, seule la mécanique de fetch/cache change).**

Convention de dossier cible : `src/features/<domaine>/`. Migrer un domaine à la
fois, dans l'ordre ci-dessous (du plus simple au plus interconnecté), en
validant build+lint après chaque domaine.

### 1.1 `features/students/`
- `api.js` *(nouveau)* : `useStudents()`, `useAllStudents()`, `useStudent(id)`,
  `useAddStudent()`, `useUpdateStudent()`, `useDeleteStudent()` — wrappent les
  fonctions déjà exportées par `src/api/apiClient.js` (`getStudents`,
  `getAllStudents`, `getStudentById`, `addStudent`, `updateStudent`,
  `deleteStudent`, inchangées). Les mutations invalident la query `['students']`
  après succès.
- `schema.js` *(nouveau)* : `studentSchema` Zod, reprenant les champs déjà
  validés à la main dans `AddStudentForm.jsx`/`UpdateStudent.jsx` (lastName,
  firstName, email, phoneNumber, birthdate, formationStart,
  formationDesiredEnd, formationMaxEndingDate, formationMaxDuration).
- `StudentsPage.jsx` *(déplacé de `pages/StudentsPage/`)* : remplace
  `fetchStudents`/`fetchAllStudents` et leurs `useState` associés par
  `useAllStudents()`/`useStudents(page, limit)`. **Supprimer la fonction
  `reloadPage` morte.**
- `StudentCard.jsx` + `StudentCard.css` *(déplacés de `components/Students/`)*,
  inchangés.
- `OneStudent.jsx` *(déplacé de `components/Students/`)* : `useStudent(id)`
  remplace le `fetchStudent`/`getStudentById` manuel dans un `useEffect` — corrige
  au passage l'avertissement `exhaustive-deps` (la clé de query gère la
  dépendance sur `id` nativement).
- `AddStudentForm.jsx` *(déplacé de `components/StudentsAdmin/`)* : réécrit avec
  `useForm({resolver: zodResolver(studentSchema)})` + `useAddStudent()`. Conserve
  `formatPhoneDisplay`/`normalizePhone` de `src/utils/phoneUtils.js` (inchangé).
- `UpdateStudent.jsx` *(déplacé de `components/StudentsAdmin/`)* : même
  traitement, `useForm` + `useUpdateStudent()`.
- Mettre à jour les imports dans `pages/OneStudentPage/OneStudentPage.jsx` (ou
  fusionner directement ce wrapper dans `features/students/` — la fusion
  définitive de l'arborescence de routes se fait en Phase 3).

### 1.2 `features/instructors/`
- `api.js`, `schema.js` *(nouveaux)*, même pattern que 1.1.
- `InstructorsPage.jsx` *(déplacé de `pages/InstructorsPage/`)* : remplace
  `fetchInstructors` manuel par `useInstructors()`. **Supprimer `isSearchActive`
  mort et `reloadPage` mort** — ou, si l'intention initiale (masquer la
  pagination pendant une recherche, comme dans `StudentsPage`) doit être
  conservée, la brancher correctement cette fois en s'alignant sur le pattern de
  `StudentsPage.jsx`. **Décision à confirmer avec l'utilisateur avant d'écrire le
  code : supprimer ou finaliser cette fonctionnalité de masquage.**
- `InstructorProfilPage.jsx` *(déplacé de `pages/InstructorProfilPage/`)* :
  `useInstructor(id)` + `useUploadInstructorDocument()` (mutation — le
  `FormData` multipart doit être passé tel quel, `apiClient.post` le gère déjà
  nativement sans `Content-Type` forcé) + `useDeleteInstructorDocument()`.

### 1.3 `features/admins/`
- `api.js` *(nouveau)*.
- `AdminPage.jsx` *(déplacé de `pages/AdminPage/`)* : `useAdmins()`,
  `useAddAdmin()`, `useUpdateAdmin()`, `useDeleteAdmin()`. **Supprimer
  l'`eslint-disable` orphelin.**

### 1.4 `features/auth/`
- `ConnexionPage.jsx` *(déplacé de `pages/ConnexionPage/`)* : `useLogin()`
  (mutation). **Corriger au passage un bug préexistant** : l'appel actuel
  `apiClient.post('/admin/login', {username, password, headers: {...}})` injecte
  un champ `headers` à l'intérieur du corps JSON envoyé au lieu de le passer en
  option de requête — à corriger en ne passant que `{username, password}` comme
  corps (le `Content-Type: application/json` est déjà géré automatiquement par
  `apiClient.post`).

**Validation de fin de phase :** `npm run lint` ne doit plus remonter aucune des
erreurs `no-unused-vars` / `react-hooks/exhaustive-deps` listées dans le
diagnostic pour ces fichiers. `npm run build` réussit. Test manuel de chaque
page CRUD (liste, ajout, modification, suppression) pour confirmer l'absence de
régression fonctionnelle.

---

## Phase 2 — Formulaires de génération de documents

**Priorité : P2 (le plus de valeur, mais le plus risqué). Ne pas commencer avant
que le pattern RHF+Zod soit validé et fonctionnel sur au moins un formulaire
simple de la Phase 1.**

### 2.1 `features/documents/convocation/` (à traiter en premier — plus petit périmètre)
- **Avant d'écrire le schéma**, lire le(s) template(s) EJS d'email concernés
  (rechercher dans `backend/models/files/` ou équivalent, selon la valeur de
  `req.body.emailType` gérée par `backend/controllers/email.controller.js`) pour
  confirmer la forme exacte attendue.
- `schema.js` *(nouveau)* : `convocationSchema` Zod — reprend la forme construite
  aujourd'hui dans `manageFetchData` de `StudentCommunication.jsx` (`formationData`,
  `emailType`, `studentData`, `schoolData`, `fileData` optionnel selon
  `showDocumentOption`). Inclut un `.refine()` sur la validité des dates
  (jour/mois/année) — remplace le bloc `if` vide actuellement mort dans
  `ConvocationFormation.jsx`.
- `ConvocationForm.jsx` *(remplace `components/StudentCom/ConvocFormation/ConvocationFormation.jsx`)* :
  un seul `useForm({resolver: zodResolver(convocationSchema), defaultValues})`.
  **Supprimer les 9 states day/month/year morts** (`formationStartDay/Month/Year`,
  `formationEndingDesiredDay/Month/Year`, `formationMaxEndingDay/Month/Year`) —
  la dérivation jour/mois/année depuis le champ date composite se fait via un
  `.transform()` Zod au moment de la soumission, plutôt que par des setters
  jamais appelés.
- `StudentCommunication.jsx` *(reste dans `components/StudentCom/` ou déplacé
  dans `features/documents/convocation/`, à trancher selon préférence
  d'organisation)* : au lieu de construire `fetchData` à la main dans
  `manageFetchData`, récupère les valeurs validées du formulaire enfant via le
  callback `onSubmit` de `ConvocationForm`. L'appel `fetch(...)` vers
  `/email/send-mail/:id` (déjà migré vers `fetch` précédemment) ne change pas.

### 2.2 `features/documents/contract/` (le cœur du problème — traiter en dernier, avec le plus de rigueur)
- **Avant d'écrire le schéma**, lire `backend/models/files/contratStagiaire.ejs`
  (ou équivalent) en entier pour vérifier chaque champ réellement interpolé.
  Ce document n'a pas eu accès à ce fichier — toute divergence entre le schéma
  proposé ci-dessous et le template réel doit être corrigée à ce moment précis.
- `schema.js` *(nouveau)* : schéma Zod complet mirroring l'objet `fetchData`
  actuellement construit en dur dans `PrintContractViewerWindow.jsx` — sections
  `fileData` (avec `studentContractData.initialsOptions` et `.signature`),
  `schoolData`, `evaluation`, `studentData`, `formationData` (avec
  `formationType`, `formationDuration`, `drivingTestExamDatetime`,
  `formationPrices.EvaluationPrealable/Frais_Administratifs (raw001 à raw007)/
  Theorie (raw001 à raw005)/Pratique (raw001 à raw006)/total/paymentMethod/
  paymentOptions/failOfTheDrivingSchool/priceOfCodeExam`). **Ce schéma devient la
  seule source de vérité du contrat avec le template EJS.**
- `defaultContractData.js` *(remplace `StudentContractPages/temporaryData.js`)* :
  la fonction `dataStorage(student)` devient `getDefaultValues(student)`,
  alimentant `useForm({defaultValues: getDefaultValues(student)})` — même calcul
  de dates (naissance, fin de formation désirée/max), mêmes valeurs par défaut.
- `ContractForm.jsx` *(remplace `PrintContractViewerWindow.jsx`)* : composant fin
  — un seul `useForm` + `<FormProvider {...methods}>` enveloppant `ContractPage1`
  à `5`. Supprime les ~90 `useState`. **Supprimer aussi `codeExamDateObject`/
  `examOptionsDate`/`examOptionsTime` morts** : décider si la fonctionnalité de
  date d'examen formatée doit enfin être complétée dans le schéma/transform, ou
  si elle est hors périmètre de cette migration — **à trancher explicitement avec
  l'utilisateur, ne pas décider silencieusement**.
- `ContractPage1.jsx` à `ContractPage5.jsx` *(remplacent `StudentContractPage1.jsx`
  à `StudentContractPage5.jsx`)* : chaque composant passe de « reçoit 20 à 80
  props setters individuels » à « appelle `useFormContext()` et utilise
  `<Controller name="formationData.formationPrices.Theorie.raw001.Obligatoire" .../>`
  ou `register("...")` avec des chemins pointés correspondant à la structure du
  schéma Zod ». **Réconcilier `evalPrealable`** : actuellement son libellé
  `"Évaluation Préalable"` est à la fois porté par un state mort et hardcodé en
  dur ailleurs — n'en garder qu'une seule source (valeur par défaut du schéma,
  éditable ou non selon le besoin réel).
- `PrintContractButton.jsx` : ne lit plus `useSelector(selectPrintFileData)`
  (Redux) mais reçoit les données validées via le `handleSubmit` du formulaire
  parent, ou via `useFormContext().getValues()` s'il est positionné sous le même
  `FormProvider`. L'appel `fetch(...)` de téléchargement du blob PDF ne change
  pas.
- `PrintContractView.jsx` : devient le point où `<FormProvider>` englobe à la
  fois `ContractForm` et `PrintContractButton` — résout nativement le besoin de
  state partagé entre composants frères qui justifiait Redux à l'origine.

**Validation de fin de phase :** générer un contrat de test et une convocation de
test, et comparer manuellement le JSON envoyé au backend (avant/après) pour
confirmer une forme strictement identique. Ouvrir le PDF généré pour confirmer
qu'il est visuellement identique à un contrat généré avec l'ancien code.

---

## Phase 3 — Nettoyage structurel

**Priorité : P3. À ne faire qu'une fois les Phases 1 et 2 terminées et validées.**

| Action | Détail |
|---|---|
| Suppression de Redux | `printFileDataSlice.js` n'a plus d'utilisateur après la Phase 2 → supprimer `src/redux/` entièrement, retirer `<Provider store={store}>` de `src/main.jsx`, retirer `@reduxjs/toolkit` et `react-redux` de `package.json` (même procédure que pour axios précédemment : éditer `package.json` puis lancer `npm install` pour reconcilier `package-lock.json` — vérifier ensuite qu'aucune trace d'axios/redux ne subsiste dans `package-lock.json` ni `node_modules/.package-lock.json`) |
| Réorganisation finale | Vider `src/pages/`, `src/components/StudentsAdmin/`, `src/components/Students/`, `src/components/StudentCom/`, `src/components/StudentContract/` au profit de `src/features/*` ; mettre à jour tous les imports de routes dans `src/App.jsx` |
| Fichiers génériques non déplacés | `src/components/SignaturePad/`, `src/components/SearchForm/`, `src/components/Template/`, `src/utils/phoneUtils.js` restent partagés hors `src/features/` (non liés à un domaine unique) |
| Vérification finale | `npm run lint` → 0 erreur, 0 warning non justifié ; `npm run build` → succès ; parcours manuel complet de l'application (connexion, CRUD des 3 entités, génération de convocation, génération de contrat) |

---

## Ordre de dépendance entre phases

Phase 0 → Phase 1 (les sous-étapes 1.1 à 1.4 peuvent être faites dans n'importe
quel ordre entre elles, mais chacune doit être validée avant la suivante) →
Phase 2 (nécessite que le pattern RHF+Zod soit déjà éprouvé sur au moins un
formulaire de la Phase 1) → Phase 3 (nécessite que la Phase 2 ait fait disparaître
le seul usage de Redux du projet).

## Non-objectifs explicites (pour éviter toute dérive de périmètre)

- Pas de passage à TypeScript.
- Pas de changement des templates `.ejs` ni du pipeline Playwright côté backend.
- Pas de validation dupliquée côté backend — les schémas Zod restent frontend-only
  pour cette passe de migration.
- Pas de changement du comportement métier observable (dates affichées, libellés,
  calculs de prix, contenu des emails/PDF) : uniquement la façon dont l'état est
  géré et structuré côté frontend.

---

## Annexe — commandes de référence

```bash
# Depuis le dossier frontend/
npm install zod @hookform/resolvers @tanstack/react-query
npm install -D @tanstack/react-query-devtools

npm run build   # doit réussir après chaque phase
npm run lint     # doit réussir après chaque phase

# Après suppression d'une dépendance (Phase 3) :
# 1. Retirer la ligne du package.json
# 2. npm install   (reconcilie package-lock.json)
# 3. Vérifier : grep -n "<nom-du-paquet>" package-lock.json  → doit ne rien retourner
```
