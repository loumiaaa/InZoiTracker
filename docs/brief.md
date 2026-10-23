# Brief produit — inZOI Tracker (v0, à valider ensemble)

## Vision
Le carnet de bord de mes Zois : ouvrir l'app à côté du jeu, retrouver en 2 secondes qui est qui, où en est chaque Zoi et ce que je veux lui faire vivre.

## Ce qu'on suit (modèle de données, brouillon)

> ⚠️ Données de jeu à vérifier en jeu : inZOI évolue beaucoup (refonte du travail en v0.8.0, avril 2026 ; ville de Cahaya ajoutée avec le DLC Island Getaway). Tout reste éditable dans l'app.

### Famille / Foyer
- Nom de famille, ville (Dowon, Bliss Bay, Cahaya, autre), adresse / lot, budget (Meow), image de bannière (capture du jeu)
- Membres (Zois), animaux de compagnie
- Génération (pour les legacy), notes d'histoire

### Zoi — fiche
- **Identité** : prénom, nom, portrait (capture), genre, date / jour de naissance en jeu, étape de vie (Bébé, Enfant en bas âge, Enfant, Ado, Jeune adulte, Adulte, Âge mûr, Senior — à confirmer)
- **Personnalité** : trait (18 traits en 6 catégories), valeurs (0–100, 4 de départ selon le trait)
- **Vie désirée** (16 au choix, à partir de Jeune adulte) et ambitions / objectifs en cours
- **Goûts** : aime / n'aime pas (couleurs, musique, nourriture, activités, style…)
- **Carrière** (Jeune adulte → Âge mûr) : employeur, ville, poste, niveau, salaire, horaires, télétravail, projets ; retraite pour les Seniors
- **École** (enfants, ados, université) : établissement, niveau, notes / résultats
- **Compétences** : niveaux
- **Relations** : avec un autre Zoi, type (famille, amitié, romance, ennemi…), niveau / jauge, statut (couple, marié·e, ex…), notes
- **Karma** et état émotionnel (si suivi)
- **Journal** : événements marquants datés (naissance, mariage, promotion, décès…)

### Vues
- Tableau de bord (familles, anniversaires / étapes de vie à venir, ambitions en cours)
- Arbre généalogique
- Carte des relations
- Recherche globale (Ctrl/Cmd+K)

## Décisions
- **Saisie manuelle d'abord.** La liaison avec le jeu (portraits du dossier SaveGames, lecture des sauvegardes, mod Lua d'export) est reportée ; le modèle de données reste compatible avec un futur module « Import depuis le jeu ».
- Les référentiels du jeu seront remplis à partir des informations collectées par la joueuse en jeu.

## MVP proposé
1. Créer / modifier familles et Zois avec portrait (import de capture)
2. Fiche Zoi complète (identité, trait, Vie désirée, goûts, carrière / école)
3. Relations entre Zois
4. Sauvegarde locale + export / import JSON
5. Installateurs Windows et macOS

**Plus tard** : arbre généalogique visuel, carte des relations, timeline, statistiques, mode legacy / générations, thème sombre.
