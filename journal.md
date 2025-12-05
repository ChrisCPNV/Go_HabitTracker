# Journal de Travail – Projet GoHabit (Go)

## Informations générales
- **Projet :** GoHabit  
- **Durée totale prévue :** 45 h  
- **MVP :** CRUD des habitudes, complétions, frontend minimal, SQLite, vue calendrier, tags  
- **Extras :** Statistiques simples, authentification, thème sombre  

---

# Journal de travail

## Session 9
**Date :** 05.12.2025  
**Durée :** 1 h  

### Objectifs  
- Finaliser la vue des heures (moins prioritaire)  
- Finaliser la documentation  
- Polir le visuel de l’application  

### Tâches réalisées  
- Correction du style du calendrier lors du survol du jour courant  
- MCD et MLD version 0.2  
- Mise à jour finale de la documentation  

### Problèmes rencontrés  
- Aucun  

### Prochaines étapes  
- Aucune  

---

## Session 8
**Date :** 02.12.2025  
**Durée :** 3 h  

### Objectifs  
- Ajouter un mode sombre  
- Ajouter un footer  

### Tâches réalisées  
- Ajout du thème sombre + bouton de bascule  
- Ajout d’un footer simple et cohérent  
- Ajout d’une vue des heures de la journée sélectionnée  

### Problèmes rencontrés  
- Aucun  

### Prochaines étapes  
- Finaliser la vue des heures  
- Finaliser la documentation  
- Polir le visuel global  

---

## Session 7
**Date :** 01.12.2025  
**Durée :** 2 h  

### Objectifs  
- Fixer le calendrier  
- Permettre la modification des tâches  

### Tâches réalisées  
- Correction du bug du calendrier (lié à un style CSS)  
- Modification des tâches par double-clic (calendrier + page des tâches)  
- Avancement de la documentation  

### Problèmes rencontrés  
- Aucun  

### Prochaines étapes  
- Ajouter un mode sombre  
- Ajouter un footer  

---

## Session 6
**Date :** 26.11.2025  
**Durée :** 3 h  

### Objectifs  
- Trier les tags par couleur  
- Améliorer l’interface  
- Améliorer la complétion des tâches  
- Mettre en évidence les tâches en retard  

### Tâches réalisées  
- Attribution d’une couleur à chaque tag  
- Adaptation automatique de la couleur du texte selon la luminosité  
- Mise en évidence des tâches en retard  
- Ajout d’un filtre par tag  

### Problèmes rencontrés  
- Décalage d’un jour dans le calendrier lors de certains changements de mois  

### Prochaines étapes  
- Corriger le calendrier  
- Permettre la modification des tâches  

---

## Session 5
**Date :** 25.11.2025  
**Durée :** 3.75 h  

### Objectifs  
- Permettre la création de tags  
- Améliorer l’interface  

### Tâches réalisées  
- Gestion complète des tags (création + suppression)  
- Pages Home, Tasks et Tags créées et liées  
- Ajout de la vue calendrier  
- Mise à jour du README et de la documentation  

### Problèmes rencontrés  
- Cache navigateur conservant l’ancien CSS → résolu avec *Ctrl+Shift+R*  

### Prochaines étapes  
- Trier les tags par couleur  
- Améliorer l’interface  
- Améliorer la complétion  
- Indiquer les tâches non complétées à temps  

---

## Session 4
**Date :** 24.11.2025  
**Durée :** 2.5 h  

### Objectifs  
- Résoudre le problème de build  
- Améliorer l’interface  

### Tâches réalisées  
- Résolution du problème de compilation en clonant le projet ailleurs  
- Affichage correct des dates limites  
- Ajout de la création de tâches depuis l’interface  
- Séparation de la navbar en fichier externe  
- Amélioration de la documentation  
- Marquage des tâches comme complétées  
- Ajout d’un bouton pour afficher les tâches complétées  

### Problèmes rencontrés  
- Aucun  

### Prochaines étapes  
- Permettre la gestion des tags  
- Améliorer l’interface  

---

## Session 3
**Date :** 21.11.2025  
**Durée :** 2.5 h  

### Objectifs  
- Finaliser les routes  
- Commencer l’interface  

### Tâches réalisées  
- Liaison des tâches avec les tags  
- Création de l’interface HTML  
- Liaison HTML ↔ JavaScript  

### Problèmes rencontrés  
- Impossible de build l’exécutable (non résolu à cette étape)  

### Prochaines étapes  
- Résoudre le problème de build  
- Améliorer l’interface  

---

## Session 2
**Date :** 18.11.2025  
**Durée :** 5 h  

### Objectifs  
- Créer la base de données  

### Tâches réalisées  
- Création du MCD et MLD  
- Installation de MySQL Workbench  
- Création du script SQL  
- Implémentation SQLite en Go  
- Implémentation des routes CRUD  
- Serveur fonctionnel  
- Mise à jour du README  
- Avancement de la documentation  

### Problèmes rencontrés  
- Le serveur s’arrêtait instantanément → résolu en changeant de driver SQLite  

### Prochaines étapes  
- Tester les routes  
- Créer une première interface  
- Continuer la documentation  

---

## Session 1
**Date :** 17.11.2025  
**Durée :** 2 h  

### Objectifs  
- Mise en place du projet et de la planification  

### Tâches réalisées  
- Création du journal  
- Création de la documentation principale  
- Mise en place du plan de travail GitHub  
- Installation de Git Bash  
- Configuration de l’environnement de travail  

### Problèmes rencontrés  
- Aucun  

### Prochaines étapes  
- Commencer le développement Go  
- Initialiser le projet  

---

# Bilan final

**Durée totale effectuée :** **24.75 h**

### Fonctionnalités réalisées  
- CRUD complet des tâches  
- Gestion des tags (création, suppression, couleurs)  
- Mode sombre + bascule  
- Vue calendrier fonctionnelle  
- Affichage des tâches du jour  
- Édition des tâches via double-clic  
- Surlignage des tâches en retard  
- Pages Home, Tasks, Tags  
- Footer, navbar responsive  
- BDD SQLite (schéma final)  
- Documentation complète et README finalisé  

### Blocages rencontrés  
- Décalages dans le calendrier → corrigé  
- Problèmes de build → résolus  
- Cache CSS du navigateur  

### Améliorations possibles  
- Authentification  
- Statistiques  
- Tâches récurrentes  
- Notifications  
- Migrations DB  
- Tests plus poussés
- Vue des heures
