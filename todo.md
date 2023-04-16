# Todo Cards app

## App & Webapp  
- [ ] find a suitable name

## ***refacto***
- [ ] 1
1. Analyser l'architecture actuelle et identifier les points à améliorer selon les principes S.O.L.I.D et l'architecture CLEAN.  
1.1. Passer en revue les contrôleurs, services, modèles et middleware.  
1.2. Identifier les dépendances externes à implémenter selon le principe de l'inversion de dépendances (D de SOLID).

- [ ] 2
2. Appliquer le principe de l'inversion de dépendances (D de SOLID) pour les librairies externes.  
2.1. Créer des interfaces pour les librairies externes utilisées (Express, JWT, PassportInterface, etc.).  
2.2. Mettre à jour les classes existantes pour utiliser ces interfaces plutôt que les dépendances directes.  
2.3. Implémenter les classes concrètes pour ces interfaces, encapsulant les librairies externes.  

- [ ] 3
3. Créer un système de décorateurs personnalisés pour les contrôleurs afin de générer la documentation Swagger sans utiliser de librairies externes.  
3.1. Créer des décorateurs pour définir les informations de base de la classe (usage principal, route de base, etc.).  
3.2. Créer des décorateurs pour définir les routes et méthodes HTTP pour chaque action du contrôleur.  
3.3. Créer une fonction pour analyser les décorateurs et générer la documentation Swagger.  

- [ ] 4
4. Retirer TSOA de votre projet. 
4.1. Supprimer les dépendances de TSOA du package.json.  
4.2. Supprimer les fichiers de configuration et les fichiers liés à TSOA.  

- [ ] 5
5. Refactorer les contrôleurs en utilisant les décorateurs personnalisés pour définir les routes et méthodes HTTP.  
5.1. Appliquer les décorateurs personnalisés aux classes et méthodes des contrôleurs.  
5.2. Retirer toute configuration et code lié à TSOA.  

- [ ] 6
6. Refactorer les services, modèles et middleware pour qu'ils respectent les principes S.O.L.I.D et l'architecture CLEAN.  
6.1. Identifier les responsabilités uniques pour chaque classe et les séparer si nécessaire.   
6.2. Appliquer les principes d'ouverture/fermeture et de substitution de Liskov.  
6.3. Utiliser l'injection de dépendances pour les dépendances entre les classes.  

- [ ] 7
7. Mettre à jour la configuration de Swagger pour utiliser la documentation générée automatiquement.  
7.1. Configurer le projet pour utiliser la fonction de génération de documentation Swagger.  
7.2. Mettre à jour la configuration de Swagger pour pointer vers la documentation générée.  

- [ ] 8
8. Optimiser et nettoyer le code existant pour améliorer la lisibilité, la maintenabilité et les performances.  
8.1. Supprimer le code inutilisé ou obsolète.  
8.2. Réorganiser le code pour une meilleure lisibilité et cohérence.  
8.3. Appliquer des bonnes pratiques de programmation, comme la gestion des erreurs et le nommage des variables et fonctions.  

- [ ] 9
9. S'assurer que toutes les fonctionnalités fonctionnent correctement après le refactorisation et l'optimisation.  
9.1. Tester chaque route et fonctionnalité pour vérifier qu'elles fonctionnent comme prévu.  
9.2. Valider que la documentation Swagger générée est correcte et complète.  
9.3. Corriger les problèmes identifiés lors des tests et de la validation.