# Gestionnaire d'auto-école - ADB Manager

## Description

ADB Manager est une application web conçue spécifiquement pour optimiser la gestion administrative de l'auto-école des Bords de Marne, un établissement situé dans l'est de la Région parisienne.  
➡️ **Site officiel de l'auto-école** : [https://autoecole-bordsdemarne.fr/](https://autoecole-bordsdemarne.fr/)  
⚙️ **Ce projet** : une solution interne développée pour répondre aux besoins de gestion de cet établissement.

## Fonctionnalités principales

- **Gestion des étudiants** : Ajout, modification et suppression des profils étudiants.  
- **Système de communication automatisée** : Envoi automatique d'emails entre l'auto-école et les étudiants pour les informer de leur progression ou de tout changement important.  
- **Génération de contrats PDF** : Création automatique du contrat de formation de chaque étudiant, au format PDF, incluant toutes les informations nécessaires.  
- **Interface utilisateur ergonomique** : Navigation fluide grâce à une application en single-page (SPA) développée avec React.  
- **Backend robuste** : Serveur Node.js utilisant Express pour gérer les API et les données.  

## Technologies utilisées

- **Frontend** :  
  - React  
  - React Router  
  - Bootstrap (styles par défaut pour un design responsive)  

- **Backend** :  
  - Node.js  
  - Express.js  
  - Sequelize (ORM)  
  - MySQL (base de données relationnelle)  

- **Autres outils** :  
  - cPanel pour le déploiement.  
  - Variables d'environnement pour sécuriser les données sensibles.  
  - Outils de génération de PDF côté serveur.  

## Déploiement

L'application est hébergée sur un serveur web sécurisé. Elle est divisée en deux parties :  
- Une application frontend, accessible via un nom de domaine principal.  
- Un backend dédié, gérant les API et les traitements métier.  

## Auteurs

Le projet a été réalisé par une équipe de quatre développeurs dans le cadre d’un stage. Il répond à un besoin métier spécifique et illustre une démarche de développement rigoureuse, de la conception à la mise en production.
