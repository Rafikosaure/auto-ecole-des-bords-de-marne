# Audit de sécurité — Frontend (Auto-école des bords de Marne)

Date de l'audit initial : **2026-08-04**
Date de correction complète : **2026-08-04**
Statut : **toutes les failles identifiées ont été corrigées et vérifiées.**

Méthode : revue de code manuelle, `npm audit`, vérification croisée avec le backend quand nécessaire, puis correction de chaque point suivie d'une vérification fonctionnelle ciblée, et enfin d'un parcours de bout en bout de toute l'application.

---

## 🔴 Faille critique — 4 endpoints backend accessibles sans authentification (CORRIGÉ)

**Constat initial** : 4 requêtes du frontend (upload de signature, téléchargement du PDF de contrat, suppression de fichiers temporaires, envoi d'email) n'envoyaient pas le cookie de session. En remontant la piste côté backend, il s'est avéré que **les 4 routes correspondantes n'avaient tout simplement pas le middleware d'authentification** — n'importe qui, sans être connecté, pouvait déclencher ces actions directement.

**Découverte annexe** : le middleware partagé par 2 de ces 4 routes (`generatePDF.js`) construisait un chemin de fichier à partir d'un champ (`documentType`) entièrement contrôlé par l'appelant, sans aucune validation — un schéma classique de **traversée de répertoire**, aggravé par le fait que le fichier lu était ensuite compilé et exécuté comme template EJS avec les variables d'environnement du serveur injectées dans le contexte de rendu.

### Corrections appliquées

| Fichier | Correction |
|---|---|
| `backend/routes/document.router.js` | Ajout de `verifyToken` sur `uploadOneDocument`, `downloadOneDocument`, `deleteDocumentsAfterContractGeneration` |
| `backend/routes/email.router.js` | Ajout de `verifyToken` sur `send-mail` |
| `backend/middlewares/generatePDF.js` | `documentType` validé contre une liste blanche (`contratStagiaire`, `convocationFormation`, `convocationPermis`) et `studentId` validé comme entier positif, **avant** toute lecture de fichier |
| `backend/controllers/document.controller.js` | Même validation de `studentId` ajoutée dans `uploadOneImage`, `downloadOneDocument`, `deleteDocumentsAfterContractGeneration` ; `fileName` validé contre une liste blanche (`studentInitials`, `studentSignature`, `legalRepresentSignature`) |
| `backend/utils/validateId.js` *(nouveau)* | Petite fonction utilitaire partagée `isValidId()` pour garder cette validation cohérente partout |
| `frontend` (4 fichiers) | `SignaturePad.jsx`, `PrintContractButton.jsx`, `deleteFilesAfterProcessing.js`, `StudentCommunication.jsx` : ajout de `credentials: 'include'`, désormais nécessaire puisque ces routes exigent une session valide |

**Vérification** :
- Les 4 endpoints renvoient désormais **401** sans cookie de session valide (testé directement en HTTP, sans passer par l'UI).
- Avec une session valide, une tentative de traversée de répertoire (`documentType`, `studentId` ou `fileName` malveillants) renvoie **400** — testé avec plusieurs payloads (`../../../../etc/passwd`, `..%2f..%2f..%2fetc`, etc.), tous rejetés.
- Le parcours complet (upload des 3 signatures, navigation dans les 5 pages du contrat, téléchargement effectif du PDF, envoi d'email) a été rejoué de bout en bout dans le navigateur avec une session authentifiée : tout fonctionne normalement, zéro `401` rencontré.

---

## 🟠 Formulaire d'ajout d'administrateur sans validation de mot de passe (CORRIGÉ)

**Constat initial** : le formulaire "Rajouter un Administrateur" n'avait aucune validation de robustesse du mot de passe, contrairement au reste de l'application qui utilise systématiquement des schémas Zod.

**Correction** : ajout d'un schéma Zod (`frontend/src/features/admins/schema.js`, nouveau fichier) exigeant un mot de passe d'au moins 8 caractères, appliqué à la création d'un administrateur ; la même règle a été ajoutée sur le formulaire de modification (le mot de passe y reste optionnel — laisser le champ vide ne le change pas — mais s'il est renseigné, il doit respecter la même politique).

**Vérification** : tenter de créer un administrateur avec un mot de passe de 3 caractères est bloqué côté client avec un message clair, aucune requête n'est envoyée ; un mot de passe de 8+ caractères passe normalement.

---

## 🟠 Protection du premier compte admin uniquement côté client (CORRIGÉ)

**Constat initial** : le bouton "Supprimer" était masqué pour le premier élément du tableau affiché — mais ce tableau est trié par nom d'utilisateur, pas par identifiant, donc ce n'était ni un vrai contrôle de sécurité, ni même cohérent (l'admin "protégé" changeait selon les comptes existants).

**Correction** :
- **Backend** (`admin.controller.js`) : `deleteAdmin` refuse désormais explicitement (403) la suppression du compte administrateur ayant l'identifiant le plus bas (le tout premier compte créé), quel que soit l'ordre d'affichage — c'est la vraie limite de sécurité.
- **Frontend** (`AdminPage.jsx`) : le bouton "Supprimer" est masqué en se basant sur ce même critère (identifiant le plus bas), et non plus sur la position dans le tableau trié — pour rester cohérent avec le backend.

**Vérification** : le compte principal n'affiche plus de bouton "Supprimer" ; une tentative de suppression d'un autre compte fonctionne normalement et affiche bien un message de succès.

---

## 🟡 Upload de document instructeur sans restriction de type/taille (CORRIGÉ)

**Constat initial** : le champ de sélection de fichier n'avait ni attribut `accept`, ni validation de type ou de taille côté client (le serveur, lui, filtrait déjà correctement les extensions `.png/.jpg/.jpeg/.pdf`, mais sans limite de taille).

**Correction** :
- **Frontend** (`InstructorProfilPage.jsx`) : ajout de `accept=".png,.jpg,.jpeg,.pdf,..."` sur le champ, et validation du type MIME + de la taille (10 Mo max) avant l'envoi, avec message d'erreur clair.
- **Backend** (`documentUpload.js`) : ajout d'une limite de taille de fichier (10 Mo), absente jusqu'ici (seul le nombre de fichiers était limité).

**Vérification** : l'upload d'une image PNG valide fonctionne normalement (testé de bout en bout, y compris la sélection de fichier et l'envoi réel).

---

## 🟢 Points positifs (confirmés, inchangés depuis l'audit initial)

- `npm audit` : 0 vulnérabilité connue.
- Aucun `dangerouslySetInnerHTML`, `eval()` ni `new Function()`.
- Aucun secret codé en dur ; `.env` correctement exclu du dépôt et ne contient que des URLs.
- Cookie de session `httpOnly` — le JavaScript client n'a jamais accès au token.
- Aucune fuite de mot de passe/hash dans les réponses API (vérifié en direct).
- Pas de script tiers, pas de `target="_blank"` non sécurisé.
- Validation Zod systématique sur tous les formulaires métier (désormais y compris celui des administrateurs).

---

## Audit fonctionnel global (après corrections)

Un parcours complet a été rejoué dans un vrai navigateur (Playwright) après l'ensemble des correctifs :

| Parcours testé | Résultat |
|---|---|
| Connexion | OK |
| Recherche d'étudiant | OK |
| Ajout puis suppression d'un étudiant | OK |
| Ajout d'un instructeur | OK |
| Upload d'un document instructeur (type accepté) | OK |
| Suppression d'un instructeur | OK |
| Création d'admin avec mot de passe faible → rejet client | OK |
| Création d'admin avec mot de passe robuste → succès | OK |
| Suppression d'un admin non protégé → succès | OK |
| Compte admin principal → bouton "Supprimer" absent | OK |
| Flux complet signature (x3) → visualisation du contrat (5 pages) → téléchargement du PDF | OK |
| Envoi d'email de convocation | OK |
| `npm run build` / `npm run lint` | 0 erreur (4 avertissements informatifs pré-existants, sans lien, liés au React Compiler) |
| Erreurs 401 rencontrées sur l'ensemble du parcours authentifié | **Aucune** |
| Erreurs JavaScript non interceptées | **Aucune** |

## Bilan

Toutes les failles remontées par l'audit initial ont été corrigées, avec une intervention côté backend là où c'était nécessaire (routes non protégées, validation d'entrées). L'application a été retestée intégralement après coup et fonctionne normalement. Aucune faille connue ne subsiste dans le périmètre audité à ce jour.
