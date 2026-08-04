# Audit des dépendances — Auto-école des bords de Marne

Dernière mise à jour : **2026-08-04**

Ce document sert de référence pour le travail d'audit et de mise à jour des dépendances du projet (frontend + backend). Il est mis à jour au fil des sessions.

---

## 1) Frontend

### ✅ Déjà fait cette session

- **`bootstrap` et `react-bootstrap` retirés du projet.** Remplacés par une base de styles maison (`frontend/src/styles/`), scopée strictement aux classes réellement utilisées dans le code (variables, reset, grille flexbox, utilitaires, composants). Voir le plan `polymorphic-toasting-candy.md` pour le détail de la migration.
- **8 dépendances mises à jour vers leur dernière version compatible (mineure/patch), une par une avec vérification à chaque étape (build, lint, tests fonctionnels Playwright) :**

| Paquet | Avant | Après |
|---|---|---|
| `@hookform/resolvers` | 5.5.7 | **5.7.1** |
| `date-fns` | 4.1.0 | **4.4.0** |
| `eslint-plugin-react-refresh` | 0.4.20 | **0.4.26** |
| `globals` | 16.3.0 | **16.5.0** |
| `react-hook-form` | 7.62.0 | **7.84.0** |
| `react-icons` | 5.5.0 | **5.7.0** |
| `react-toastify` | 11.0.5 | **11.1.0** |
| `vite` | 8.0.16 | **8.2.0** |

- **React et React Router mis à jour** (session précédente) : `react`/`react-dom` → `19.2.8`, `react-router-dom` → `react-router` `8.3.0`.

- **4 dépendances majeures mises à jour avec prudence, chacune recherchée (changelog/breaking changes) avant d'être bumpée, puis testée en profondeur :**

| Paquet | Avant | Après | Ce qui a été trouvé et corrigé |
|---|---|---|---|
| `@vitejs/plugin-react` | 5.2.0 | **6.0.5** | Remplace Babel par Oxc pour le Fast Refresh. Aucun correctif nécessaire — testé en direct (édition à chaud pendant que le serveur tournait), le Fast Refresh fonctionne normalement. |
| `eslint` | 9.39.5 | **10.8.0** | Déjà en flat config, donc pas de migration de format. |
| `@eslint/js` | 9.34.0 | **10.0.1** | Doit avancer avec `eslint`. Son install seule échouait tant que `eslint-plugin-react-hooks` restait bloqué sur `eslint@^9` — bumpé en même temps que lui pour lever le conflit de peer dependency. |
| `eslint-plugin-react-hooks` | 5.2.0 | **7.1.1** | Voir détails ci-dessous — c'était le paquet le plus délicat des quatre. |

**Détail sur `eslint-plugin-react-hooks` (le plus risqué des 4, comme anticipé)** :
- La config `recommended-latest` qu'on utilise regroupe désormais les règles expérimentales du React Compiler. On a choisi de garder ce comportement par défaut plutôt que de le désactiver.
- **Bug trouvé dans le paquet lui-même** : `reactHooks.configs['recommended-latest']` (à la racine) exporte encore l'ancien format eslintrc (`plugins: ["react-hooks"]`), incompatible avec la flat config d'ESLint 10. Le format correct existe mais est logé sous `reactHooks.configs.flat['recommended-latest']` — `eslint.config.js` a été corrigé en conséquence.
- **7 nouvelles erreurs de lint sont apparues** avec la règle `set-state-in-effect` (plus stricte dans cette version), qui a débusqué un vrai anti-pattern React (`useEffect` + `setState` pour dériver une valeur au lieu de la calculer directement pendant le rendu) dans 6 fichiers : `ContractPage1.jsx` à `ContractPage5.jsx` (affichage conditionnel des pages du contrat) et `StudentsPage.jsx` (liste affichée + réinitialisation du surlignage clavier). Les 6 fichiers ont été refactorisés selon le pattern recommandé par la documentation React elle-même (calcul direct pendant le rendu, plus besoin d'effet) — testé de bout en bout (navigation clavier, recherche, et le flux complet de signature + les 5 pages du contrat un par un) : tout fonctionne à l'identique.
- 4 avertissements informatifs restent (`react-hooks/incompatible-library`, sur les usages de `watch()` de react-hook-form) : sans impact, ce projet n'utilise pas le React Compiler.

- **2 dernières dépendances majeures mises à jour**, chacune recherchée puis vérifiée :

| Paquet | Avant | Après | Ce qui a été trouvé et corrigé |
|---|---|---|---|
| `eslint-plugin-react-refresh` | 0.4.26 | **0.5.3** | Passage à l'export nommé `reactRefresh` (l'export par défaut est déprécié) dans `eslint.config.js`. **Changement d'API trouvé en cours de route** : `reactRefresh.configs.vite` n'est plus un objet de config direct mais une fonction factory — corrigé en `reactRefresh.configs.vite()`. Testé : la règle `only-export-components` a été vérifiée pour de vrai (déclenchée volontairement sur un fichier de test), et le Fast Refresh en direct fonctionne toujours. |
| `globals` | 16.5.0 | **17.9.0** | Seul changement cassant identifié (scission d'`audioWorklet` hors de `globals.browser`) — sans impact, le projet n'utilise pas l'API AudioWorklet. |

### Déjà à jour

`react` (19.2.8), `react-dom` (19.2.8), `react-router` (8.3.0), `zod`, `@tanstack/react-query` + devtools, `@types/react`, `@types/react-dom`, `@hookform/resolvers`, `date-fns`, `eslint-plugin-react-refresh` (0.5.3), `globals` (17.9.0), `react-hook-form`, `react-icons`, `react-toastify`, `vite`, `eslint`, `@eslint/js`, `eslint-plugin-react-hooks`, `@vitejs/plugin-react`.

**Le frontend est désormais entièrement à jour** (`npm outdated` ne retourne plus rien).

### Retiré du projet

`bootstrap`, `react-bootstrap` — remplacés par du CSS/JS pur (voir plus haut).

---

## 2) Backend

### ✅ Fait cette session

**1. Dépendances inutiles désinstallées** : `env` (jamais utilisée) et `fs` (stub de sécurité anti-typosquatting, `require('fs')` résolvait déjà vers le module natif de Node).

**2. Vulnérabilité corrigée** : `npm audit` a révélé une faille *high* (`brace-expansion`, DoS via tableaux intermédiaires non bornés) dans une dépendance transitive de `nodemon` (devDependency, outil de dev uniquement) — corrigée via `npm audit fix`. Le projet est maintenant à **0 vulnérabilité connue**.

**3. Mises à jour sûres appliquées, vérifiées une par une :**

| Paquet | Avant | Après |
|---|---|---|
| `cors` | 2.8.5 | **2.8.6** |
| `nodemailer` | 9.0.1 | **9.0.4** |

**4. Changements majeurs traités avec prudence :**

| Paquet | Décision | Détail |
|---|---|---|
| `express` | **Mis à jour → 5.2.1** | Code passé au crible pour les patterns cassants connus (`app.del()`, `req.param()`, `res.send(body, status)`, routes wildcard) — aucun trouvé, migration jugée sûre. Un seul point cassant réel rencontré à l'exécution : `app.options('*', cors())` (syntaxe wildcard héritée d'Express 4) — corrigé en `app.options('/{*splat}', cors())`, syntaxe requise par `path-to-regexp` v8. **Deux vrais bugs préexistants découverts et corrigés en testant en profondeur** (indépendants d'Express, révélés par les tests poussés) : une variable mal nommée dans le `catch` de `middlewares/imageUpload.js` (`error` au lieu de `err`), et `middlewares/errorHandler.js` qui accédait à `req.body.xxx` sans vérifier que `req.body` existe (cassait la gestion d'erreur sur les requêtes GET/DELETE sans corps). |
| `@types/node` | **Mis à jour → 24.13.3** (pas 26.1.2) | Paquet de définitions de types uniquement (aucun impact runtime sur ce projet JS pur). Choix : rester aligné sur la version majeure de Node réellement utilisée (24.x) plutôt que sauter vers la 26.x, qui décrit une version de Node **pas encore LTS** (Active LTS prévue en octobre 2026) que nous ne faisons pas tourner. |
| `@prisma/client` / `prisma` | **Non mis à jour, restent en 6.19.3** | Prisma 7 est une réécriture majeure et très invasive : suppression complète du moteur Rust (remplacé par TS+WASM), adaptateur de driver désormais obligatoire (`@prisma/adapter-pg`), générateur renommé (`prisma-client` au lieu de `prisma-client-js`), sortie du client hors de `node_modules` avec changement de tous les chemins d'import dans le code, migration de la configuration vers `prisma.config.ts`, suppression du middleware `$use`. Conformément à la consigne de stabilité, cette migration lourde n'a pas été entreprise : la version 6.19.3 actuelle est stable, déjà la dernière de sa branche majeure, et ne présente aucune vulnérabilité connue. |
| `@playwright/test` | **Conservé tel quel (1.55.0), à la demande explicite** | Des tests backend seront écrits plus tard. |

**5. Dépendances non déclarées corrigées :**
- **`playwright`** : déclaré explicitement en dépendance de production (`^1.56.1`, version déjà en place et testée) — n'est plus tributaire d'être entraîné accidentellement par `@playwright/test`.
- **`body-parser`** : retiré. `app.js` fusionne désormais tout sur un seul `app.use(express.json({ limit: '50mb' }))` (au lieu de deux parseurs JSON empilés) — testé avec de gros payloads base64 (upload de signatures), fonctionne normalement.

### Déjà à jour / à jour intentionnellement

`bcrypt`, `cookie-parser`, `dotenv`, `ejs`, `jsonwebtoken`, `multer`, `sharp`, `cors`, `nodemailer`, `express`, `@types/node`, `playwright`, `nodemon`.

### Restant en attente (décisions déjà prises, hors scope "sûr")

| Paquet | Actuelle | Dernière | Raison de ne pas bumper |
|---|---|---|---|
| `@playwright/test` | 1.55.0 | 1.62.1 | Conservé volontairement pour les futurs tests |
| `@prisma/client` / `prisma` | 6.19.3 | 7.9.1 | Migration jugée trop invasive pour la stabilité actuelle (voir ci-dessus) |
