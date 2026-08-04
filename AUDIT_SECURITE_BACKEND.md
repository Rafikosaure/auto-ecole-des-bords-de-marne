# Audit de sécurité — Backend (Auto-école des bords de Marne)

Date de l'audit initial : **2026-08-04**
Date de correction complète : **2026-08-04**
Statut : **toutes les failles identifiées ont été corrigées et vérifiées.**

Méthode : revue de code manuelle exhaustive (toutes les routes, tous les contrôleurs, tous les middlewares), vérifications live sur le serveur en cours d'exécution, `npm audit`. Chaque correctif a été suivi d'un redémarrage du serveur et d'un parcours fonctionnel complet (frontend + backend) avant de passer au suivant.

---

## 🟠 Absence de limitation de débit (CORRIGÉ)

**Correction** : ajout d'`express-rate-limit` (`middlewares/rateLimit.js`), appliqué sur :
- `POST /admin/login` : 10 tentatives / 15 minutes / IP.
- `POST /admin/password/forgot` : 5 demandes / 15 minutes / IP.

**Vérification** : testé en direct — 10 tentatives de connexion acceptées (traitées normalement, refusées pour mauvais mot de passe), la 11ᵉ et au-delà renvoient `429 Too Many Requests`. Une connexion légitime continue de fonctionner normalement tant que le seuil n'est pas atteint.

---

## 🟠 Assignation de masse (CORRIGÉ)

**Correction** : remplacement de tous les `{ ...req.body }` par des listes blanches explicites de champs modifiables :
- `utils/normalizeDates.js` (`student.controller.js`) : `STUDENT_WRITABLE_FIELDS`.
- `controllers/instructor.controller.js` : `INSTRUCTOR_WRITABLE_FIELDS`, et `updateDocument` restreint désormais au seul champ `type`.
- `controllers/admin.controller.js` : `ADMIN_WRITABLE_FIELDS` (`username`, `email` — le mot de passe reste géré séparément).

**Vérification** : parcours complet de création/modification/suppression d'étudiants, moniteurs et administrateurs rejoué après coup — tout fonctionne à l'identique.

---

## 🟡 Énumération des comptes admin via « mot de passe oublié » (CORRIGÉ)

**Correction** : `forgotPassword` renvoie désormais systématiquement la même réponse (`"If this email is registered, a reset link has been sent."`, statut 200), que l'email corresponde à un compte ou non — y compris si l'envoi d'email échoue techniquement (ce qui est arrivé dans cet environnement de dev, dont le SMTP est factice ; l'échec est journalisé côté serveur uniquement, jamais renvoyé au client).

**Vérification, testée en direct** :
```
email inexistant → 200 {"message":"If this email is registered, a reset link has been sent."}
email existant    → 200 {"message":"If this email is registered, a reset link has been sent."}
```
Réponses désormais strictement identiques dans les deux cas.

---

## 🟡 Génération de PDF via un vrai navigateur (CORRIGÉ)

**Corrections apportées dans `middlewares/generatePDF.js`** :
1. Seule la variable `COMPLETE_IMAGES_SIGNATURES_PATH` (la seule effectivement utilisée par les templates) est désormais transmise au contexte de rendu EJS, au lieu de l'intégralité de `ENV` (qui contenait les secrets JWT, les identifiants de base de données et d'email).
2. La page Playwright utilisée pour générer le PDF a désormais un accès réseau restreint via `page.route()` : seules les requêtes vers l'origine du serveur lui-même (nécessaires pour charger les images de signature) sont autorisées, tout le reste est bloqué — élimine le risque de SSRF vers un hôte interne ou externe arbitraire.

**Vérification** : le flux complet (upload des 3 signatures → génération → téléchargement du PDF) a été rejoué de bout en bout ; le PDF généré est valide (`PDF document, version 1.4, 5 page(s)`, ~180 Ko), avec les images de signature correctement chargées malgré la restriction réseau.

---

## 🟢 Traversée de répertoire sur l'upload de documents instructeur

Confirmé non exploitable lors de l'audit initial (protection déjà assurée par `busboy`/`multer`) — aucune correction nécessaire ici.

---

## 🟡 Contenu d'email construit à partir de données non revérifiées (CORRIGÉ)

**Correction** : `email.controller.js` relit désormais l'étudiant réel depuis la base de données via le `studentId` de l'URL (avec validation de l'identifiant), et **remplace systématiquement** l'email et le nom affiché par les valeurs authentiques de la base avant de construire le sujet, le corps et le destinataire de l'email — quelles que soient les valeurs fournies dans le corps de la requête.

**Vérification, testée en direct** : un appel authentifié avec des données volontairement falsifiées dans le corps de la requête (`studentEmail: "attaquant@evil.com"`, `studentFirstName: "Usurpé"`) a bien abouti à l'utilisation des **vraies** valeurs de la base (`to=rafikbensadi@live.fr`, `subject=Relance - Rafik Ben Sadi`) — les données falsifiées ont été entièrement ignorées.

---

## 🔵 Corrections mineures / defense in depth (CORRIGÉES)

- **Algorithme JWT épinglé explicitement** (`algorithms: ['HS256']`) sur tous les appels `jwt.sign`/`jwt.verify` (`verifyToken.js`, connexion, réinitialisation de mot de passe).
- **Jeton de réinitialisation de mot de passe désormais à usage unique** : le jeton inclut un `pwdVersion` lié à `updatedAt` de l'administrateur ; une fois le mot de passe changé, `updatedAt` change et tout rejeu du même jeton est rejeté. **Vérifié en direct** : une première utilisation réussit, une seconde utilisation du même jeton est explicitement refusée (`InvalidToken`), et la connexion avec le nouveau mot de passe fonctionne.
- **`helmet` ajouté** : `X-Powered-By: Express` a disparu des réponses, en-têtes de sécurité standards ajoutés (`X-Content-Type-Options`, `X-Frame-Options`, etc.). La politique de ressources cross-origin a été explicitement configurée en `cross-origin` (et la CSP désactivée) pour ne pas casser le chargement des images par le frontend — vérifié en direct, les images continuent de se charger normalement depuis l'origine du frontend.

---

## Audit fonctionnel global (après corrections)

Serveurs redémarrés à froid (frontend + backend + base de données), parcours complet rejoué :

| Parcours testé | Résultat |
|---|---|
| Connexion (avec rate limiting actif) | OK |
| CRUD étudiants (recherche, ajout, suppression) | OK |
| CRUD moniteurs + upload de document | OK |
| Création admin (mot de passe faible rejeté / robuste accepté) | OK |
| Suppression admin (protégé vs non protégé) | OK |
| Flux complet signature (x3) → contrat (5 pages) → téléchargement PDF | OK |
| Envoi d'email (avec relecture anti-usurpation) | OK |
| Mot de passe oublié → réinitialisation → nouvelle connexion | OK |
| Rejeu d'un jeton de réinitialisation déjà utilisé | Refusé comme attendu |
| `npm run build` / `npm run lint` (frontend) | 0 erreur |
| `npm audit` (backend) | 0 vulnérabilité |
| Erreurs 401 inattendues / erreurs JS non interceptées | Aucune |

## Bilan

Toutes les failles remontées par l'audit initial ont été corrigées et vérifiées individuellement, puis retestées ensemble lors d'un parcours complet à froid. Aucune régression fonctionnelle constatée. Aucune faille connue ne subsiste dans le périmètre audité à ce jour.
