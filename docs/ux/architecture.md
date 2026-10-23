# Architecture de l'information — inZOI Tracker V1

> Livrable UX · v1.0 · 2026-10-23
> Sources : `docs/brief.md`, `docs/contrat-donnees.md`, besoin V1 validé par la joueuse, captures du jeu `docs/references/jeu-fiche-*.png`.
> Documents liés : `ecrans.md` (détail écran par écran), `composants.md` (bibliothèque), `modele-donnees.md` (données).

---

## 1. Principes directeurs

1. **La fiche Zoi est calquée sur le jeu.** Même rangée d'avatars du foyer en haut, mêmes pastilles d'onglets dans le même ordre (Profil, Souvenirs, Ambitions, Préférences, Valeur, Carrière), mêmes cartes panneau, mêmes libellés. La joueuse ne réapprend rien. Les onglets propres au tracker (Relations, Futur, Vie & possessions) viennent **après** un séparateur vertical.
2. **Deux secondes pour retrouver un Zoi.** Ctrl/Cmd+K depuis n'importe où, 2 ou 3 lettres, Entrée : la fiche s'ouvre sur le dernier onglet consulté.
3. **Saisie rapide sans « Enregistrer ».** Tout est enregistré automatiquement (à la sortie du champ ou après 400 ms d'inactivité). Ctrl/Cmd+S affiche juste « Tout est enregistré automatiquement. »
4. **Les listes du jeu sont des données.** Chaque champ « liste » passe par le Sélecteur de référentiel (recherche + icône) et propose toujours « Ajouter « … » à la liste ». Rien n'est figé dans le code.
5. **Une seule source par donnée.** Exemple : la carrière se saisit dans l'onglet Carrière ; le Profil l'affiche en résumé avec un lien « Modifier ». Les entreprises sont saisies une fois et apparaissent dans Carrière › Affaires et dans Vie & possessions.
6. **Inconnu n'est pas zéro.** Un champ non renseigné affiche « — » ou « Non renseigné », jamais 0 par défaut.
7. **Rien n'est perdu par erreur.** Suppressions confirmées pour Zoi / foyer / famille, toast « Annuler » de 8 s pour tout ce qui se supprime.

---

## 2. Fenêtre et grille

| Paramètre | Valeur |
|---|---|
| Taille par défaut | 1280 × 800 |
| Taille minimale | 1024 × 700 (imposée par Electron `minWidth` / `minHeight`) |
| Barre latérale | 240 px déployée ; 72 px réduite (icônes + infobulles) |
| Bascule auto | Largeur de fenêtre < 1200 px : barre réduite par défaut (la joueuse peut la redéployer en superposition avec Ctrl/Cmd+B) |
| Barre supérieure | 56 px, fixe |
| Marges du contenu | 32 px (≥ 1200 px de large) ; 24 px en dessous |
| Largeur max du contenu | 1120 px, centré |
| Grille des cartes | 2 colonnes égales, gouttière 16 px, si la zone de contenu fait ≥ 880 px ; sinon 1 colonne |
| Zoom | Ctrl/Cmd + / − / 0 (zoom Electron). À 125 % sur un écran 1280 px, la largeur utile est 1024 : tout doit tenir |
| Hauteur 700 px | L'en-tête de fiche (avatars + onglets) reste collant ; la rangée d'avatars passe de 64 à 40 px dès que le contenu défile (bascule sans animation si `prefers-reduced-motion`) |

Les couleurs, typographies, rayons et ombres viennent **exclusivement** des tokens du directeur artistique (voir `composants.md` §0 pour la liste des rôles attendus).

---

## 3. Navigation

### 3.1 Barre latérale (ordre figé)

| # | Entrée | Raccourci | Destination | Badge |
|---|---|---|---|---|
| 1 | Accueil | Ctrl/Cmd+1 | `#/accueil` | — |
| 2 | Foyers | Ctrl/Cmd+2 | `#/foyers` (sous-onglets Foyers / Familles) | nombre de foyers |
| 3 | Zois | Ctrl/Cmd+3 | `#/zois` | nombre de Zois |
| 4 | Relations | Ctrl/Cmd+4 | `#/relations` | — |
| 5 | Référentiels | Ctrl/Cmd+5 | `#/referentiels` | — |
| — | (espace flexible) | | | |
| 6 | Réglages | Ctrl/Cmd+6 ou Ctrl/Cmd+, | `#/reglages` | — |
| — | Bouton « Réduire » / « Déployer » | Ctrl/Cmd+B | — | — |

En tête de barre : logotype « Zoi Tracker » (fourni par le DA, pas le logo Krafton). L'entrée active est marquée par la forme active (token accent) **et** `aria-current="page"`.

### 3.2 Barre supérieure

Gauche : fil d'Ariane cliquable (ex. `Foyers › Foyer Clark › Marina Takahashi`). Le fil suit les données, pas l'historique : un Zoi sans foyer donne `Zois › Léa Park`.
Droite : déclencheur de recherche « Rechercher…  Ctrl K » (« ⌘ K » sur macOS), puis l'indicateur d'enregistrement (« Enregistré » / « Enregistrement… » / « Échec de l'enregistrement · Réessayer »).

### 3.3 Navigation dans la fiche Zoi

- **Rangée d'avatars** (comme dans le jeu) : membres du foyer dans l'ordre du foyer, avatar actif entouré + coche, bouton « + » = nouveau Zoi dans ce foyer. Cliquer un autre avatar **garde l'onglet courant** (on passe de Profil de Marina à Profil de Leo).
- **Pastilles d'onglets** : `Profil · Souvenirs · Ambitions · Préférences · Valeur · Carrière | Relations · Futur · Vie & possessions`. Défilement horizontal avec flèches si la largeur manque (1024 px).
- **Dernier onglet mémorisé** pour la session : ouvrir une fiche depuis la recherche ou une liste rouvre le dernier onglet consulté (par défaut Profil).
- **Menu « ⋯ »** en haut à droite de la fiche : Changer de foyer…, Ouvrir l'arbre généalogique, Supprimer ce Zoi…

### 3.4 Routes (hash router, compatible Electron `file://`)

| Route | Écran |
|---|---|
| `#/accueil` | Accueil |
| `#/foyers` | Foyers › onglet Foyers |
| `#/foyers/:foyerId` | Détail d'un foyer |
| `#/familles` | Foyers › onglet Familles |
| `#/familles/:familleId` | Détail d'une famille |
| `#/zois` | Liste des Zois |
| `#/zois/:zoiId/:onglet` | Fiche Zoi ; `:onglet` ∈ `profil`, `souvenirs`, `ambitions`, `preferences`, `valeur`, `carriere`, `relations`, `futur`, `vie` |
| `#/relations` | Relations (vue globale) |
| `#/referentiels/:referentiel?` | Référentiels ; `:referentiel` = nom du fichier sans `.json` (ex. `traits`) |
| `#/reglages` | Réglages |

Les surcouches (recherche, modales, panneaux latéraux, arbre généalogique) ne changent pas la route, sauf l'arbre généalogique qui ajoute `?arbre=1` pour pouvoir y revenir avec « Retour ».

---

## 4. Arborescence

```
Zoi Tracker
├── Accueil
│   ├── Premier lancement (état vide guidé)
│   ├── Reprendre (Zois consultés récemment)
│   ├── Vos foyers
│   ├── Projets en cours            (issus des onglets Futur)
│   └── Ambitions en cours          (issues des onglets Ambitions)
│
├── Foyers
│   ├── [sous-onglet] Foyers ── grille des cartes foyer
│   │   └── Foyer (détail)
│   │       ├── Bannière, informations, budget, génération
│   │       ├── Membres ──────────────► Fiche Zoi
│   │       ├── Logement (ville, quartier, adresse, photo maison)
│   │       ├── Animaux du foyer, Véhicules du foyer
│   │       └── Notes d'histoire
│   └── [sous-onglet] Familles ── liste des familles (lignées)
│       └── Famille (détail) : emblème, notes, foyers liés, Zois portant ce nom
│
├── Zois ── liste filtrable de tous les Zois (y compris « Sans foyer »)
│   └── Fiche Zoi
│       ├── Profil
│       │   ├── Informations de base (portrait, nom, nom de famille, tranche d'âge,
│       │   │   carrière*, niveau d'études*, bouton Arbre généalogique)
│       │   ├── Vie désirée
│       │   ├── Traits de caractère et caractéristiques
│       │   ├── Désir
│       │   └── Compétences ── panneau « Toutes les compétences »
│       ├── Souvenirs (Jalons, Souvenirs récents)
│       ├── Ambitions (ambition en cours, objectifs par étape, ambitions passées)
│       ├── Préférences (10 emplacements aime / n'aime pas)
│       ├── Valeur (valeurs de personnalité 0–100)
│       ├── Carrière (École, Carrière, Affaires, Freelance)
│       ├── ─ séparateur ─
│       ├── Relations (liens avec les autres Zois, jauge, réciprocité)
│       ├── Futur (projets : objectifs, idées d'histoire, échéances)
│       └── Vie & possessions (ville et logement, véhicules, entreprises, animaux)
│       * résumés en lecture seule, saisis dans l'onglet Carrière
│
├── Relations ── tableau de tous les liens, création d'un lien entre deux Zois
│   └── Arbre généalogique (surcouche, centrée sur un Zoi)
│
├── Référentiels ── 20 listes du jeu, consultables et modifiables
│   └── Élément (panneau d'édition)
│
├── Réglages
│   ├── Sauvegarde (exporter, importer, dossier des données)
│   ├── Affichage (barre latérale, zoom)
│   ├── Raccourcis clavier
│   └── À propos et crédits
│
└── Surcouches globales
    ├── Recherche globale (Ctrl/Cmd+K) + actions rapides
    ├── Sélecteur de référentiel / Sélecteur de Zoi
    ├── Modales : Nouveau foyer, Nouvelle famille, Nouveau Zoi, Confirmation
    ├── Panneaux latéraux : Nouveau lien, Jalon, Compétences, Possession, Élément de référentiel
    ├── Aide des raccourcis (F1)
    └── Toasts
```

### Hiérarchie des objets

```
Famille (lignée, « Nom de famille » du jeu)  0..n ──── 0..n  Foyer
   │ 0..1                                                  │ 0..1
   └──────────────────────── Zoi ───────────────────────────┘
                              │
     ┌──────────┬───────────┬─┴────────┬───────────┬────────────┐
  Souvenirs   Jalons     Ambitions   Projets    Possessions   Relations (Zoi ⇄ Zoi)
```

Un Zoi appartient à **0 ou 1 foyer** (le foyer joué / le logement) et à **0 ou 1 famille** (le « Nom de famille » affiché par le jeu). Un foyer peut avoir une famille principale (pour le regroupement), sans que tous ses membres en fassent partie (couple recomposé, colocation…).

---

## 5. Parcours clés

Convention : une **action** = un clic ou une touche de validation. La frappe de texte n'est pas comptée.

### P1 — Créer un foyer (2 actions)

| # | Joueuse | App |
|---|---|---|
| 1 | Ctrl/Cmd+Maj+N (ou « Nouveau foyer » sur Accueil / Foyers) | Ouvre la modale « Nouveau foyer », focus sur « Nom du foyer ». |
| 2 | Tape « Clark » | Sous le champ, case cochée : « Créer aussi la famille « Clark » ». Si une famille « Clark » existe déjà, elle est proposée à la place : « Rattacher à la famille Clark ». |
| 3 | (optionnel) Ville via le sélecteur ; bannière via Ctrl/Cmd+V | Aperçu de la bannière. |
| 4 | Entrée | Crée foyer (+ famille), ouvre `#/foyers/:id`, toast « Foyer Clark créé. », focus sur « Ajouter un Zoi ». |
| 5 | Entrée (enchaînement) | Ouvre « Nouveau Zoi » pré-rempli avec ce foyer et cette famille (P2). |

Erreur : nom vide → « Donnez un nom au foyer. » sous le champ, focus remis dans le champ. Doublon de nom : autorisé, avertissement non bloquant « Un foyer porte déjà ce nom. »

### P2 — Ajouter un Zoi (3 actions)

| # | Joueuse | App |
|---|---|---|
| 1 | « + » de la rangée d'avatars, « Ajouter un Zoi » du foyer, ou Ctrl/Cmd+N | Modale « Nouveau Zoi ». Foyer et famille pré-remplis selon le contexte (foyer affiché ou foyer du Zoi affiché ; sinon « Sans foyer »). « Nom » pré-rempli avec le nom de la famille. Focus sur « Prénom ». |
| 2 | Tape le prénom, (optionnel) colle le portrait (Ctrl/Cmd+V), règle la tranche d'âge (← / →) | Aperçu de l'avatar ; sans photo, initiales. |
| 3 | Entrée | Crée le Zoi, ouvre sa fiche sur **Profil**, toast « Marina Takahashi ajoutée au foyer Clark. » |
| 3 bis | Case « Ajouter un autre Zoi ensuite » cochée + Entrée | Crée le Zoi, vide prénom / portrait / tranche d'âge, garde foyer et famille, focus sur « Prénom ». La case est mémorisée. |

Erreur : prénom vide → « Le prénom est obligatoire. »

### P3 — Renseigner une ambition (≈ 5 actions)

| # | Joueuse | App |
|---|---|---|
| 1 | Ctrl/Cmd+K, « mar », Entrée | Fiche de Marina. |
| 2 | Alt/Option+3 (ou clic « Ambitions ») | Onglet Ambitions. État vide : focus sur « Choisir une ambition ». |
| 3 | Entrée | Sélecteur « Ambitions » (groupé par catégorie), focus sur la recherche. |
| 4 | Tape « boiss », ↓, Entrée | Ambition posée : catégorie, nom, « Niv. 1/3 ». Les objectifs des 3 étapes sont **copiés** depuis le référentiel. Étape 1 affichée, focus sur le premier objectif. |
| 5 | Espace pour cocher ; + / − (ou ← / →) pour la progression | Progression « 0/5 » mise à jour ; un objectif coché passe à `cible/cible`. |
| 6 | Dernier objectif de l'étape coché | Bandeau dans la carte : « Étape 1 terminée. Passer à l'étape 2 ? » [Passer à l'étape 2] [Plus tard]. Valider → « Niv. 2/3 ». |

Variantes :
- **Ambition absente du référentiel** : dans le sélecteur, « Ajouter « Reine du karaoké » aux ambitions » → mini-formulaire (Catégorie, Nom) → Entrée : l'ambition est créée et sélectionnée ; la liste d'objectifs est vide avec « Ajouter un objectif ».
- **Partie déjà avancée** : le sélecteur de niveau « Niv. 1/3 » permet de passer à 2 ou 3. Les objectifs des étapes précédentes sont alors cochés automatiquement, toast « Objectifs de l'étape 1 cochés. » [Annuler].
- **Depuis la Vie désirée** : choisir une Vie désirée liée à une ambition propose « Cette Vie désirée est liée à l'ambition « Maître de la préparation de boissons ». La définir comme ambition en cours ? » [Définir] [Non merci].

### P4 — Créer un lien de parenté (≈ 5 actions)

Exemple : Leo est l'enfant de Marina.

| # | Joueuse | App |
|---|---|---|
| 1 | Fiche de Marina › Relations (Alt/Option+7) | Liste des liens groupés (Famille, Amour, Amitié, Autres). |
| 2 | « Ajouter un lien » | Panneau latéral « Nouveau lien », focus sur « Zoi ». |
| 3 | Tape « leo », Entrée | Leo sélectionné. Si Leo n'existe pas : « Créer le Zoi « Leo » » le crée dans le foyer de Marina (prénom seul) et le sélectionne. |
| 4 | Champ « Leo est … de Marina » : tape « enf », Entrée | Aperçu de la réciprocité : « Sur la fiche de Leo, Marina apparaîtra comme : **Parent**. » |
| 5 | (optionnel) cases de suggestion, décochées par défaut : « Ajouter aussi Thomas Clark comme parent de Leo » (conjoint·e de Marina) ; « Ajouter Leo comme frère / sœur de Mia » (autres enfants de Marina) ; niveau de la relation | — |
| 6 | Ctrl/Cmd+Entrée ou « Ajouter le lien » | Lien créé une seule fois, visible sur les deux fiches et dans l'arbre généalogique. Toast « Lien ajouté : Leo est Enfant de Marina. » [Annuler]. |

Erreurs (affichées sous le champ concerné, bouton désactivé) :
- même Zoi des deux côtés : « Un Zoi ne peut pas être lié à lui-même. »
- lien déjà présent : « Ce lien existe déjà. »

Avertissements (non bloquants, sous le champ « Lien ») :
- un seul lien par type entre deux Zois (voir `modele-donnees.md` §5) : « Ce lien remplacera « Ami·e » (un seul lien de type Amitié entre deux Zois). » — c'est ce qui empêche Leo d'être à la fois parent et enfant de Marina ;
- « Leo a déjà 2 parents. » (adoption, familles recomposées restent possibles).

### P5 — Supprimer un Zoi avec confirmation (3 actions)

| # | Joueuse | App |
|---|---|---|
| 1 | Fiche › « ⋯ » › « Supprimer ce Zoi… » (ou Suppr sur une carte Zoi focalisée dans une liste) | Modale de confirmation, **focus sur « Annuler »**. |
| 2 | Lit le bilan | « Supprimer Marina Takahashi ? » / « Sa fiche et tout son contenu seront supprimés : 6 jalons, 12 souvenirs, 1 ambition, 3 projets, 2 possessions. Ses 5 liens seront retirés des fiches des autres Zois, qui eux ne sont pas supprimés. » (les lignes à 0 sont omises) |
| 3 | « Supprimer le Zoi » | Retour à la page du foyer (ou à la liste Zois), toast « Fiche de Marina Takahashi supprimée. » [Annuler] pendant 8 s. |
| 4 | (optionnel) « Annuler » dans le toast ou Ctrl/Cmd+Z | Zoi restauré à l'identique, y compris ses liens. |

Même mécanique pour un foyer (choix : garder ses Zois en « Sans foyer » — par défaut — ou les supprimer aussi) et pour une famille (les Zois et foyers sont conservés, leur nom de famille est vidé).

### P6 — Consultation instantanée (2 actions)

Ctrl/Cmd+K → 2 ou 3 lettres (prénom, nom ou famille, sans tenir compte des accents ni de la casse) → Entrée → fiche sur le dernier onglet consulté. Alt/Option+↑ / ↓ fait défiler les membres du foyer sans quitter l'onglet.

### P7 — Noter un souvenir en pleine partie (4 actions)

Ctrl/Cmd+K → « mar » → Tab (actions rapides du Zoi en surbrillance) → « Noter un souvenir » → Entrée → mini-formulaire avec le champ texte focalisé → tape → Entrée. Le souvenir est ajouté en tête des Souvenirs récents de Marina (émotion, Zoi lié et date en jeu sont facultatifs et modifiables ensuite). Toast « Souvenir ajouté à Marina. » La joueuse reste sur l'écran où elle était.

---

## 6. Raccourcis clavier

Règles d'implémentation :
- Écouter `KeyboardEvent.code` (`Digit1`, `KeyK`…) et non `key`, pour fonctionner en **AZERTY** (Ctrl+& = Ctrl+Digit1).
- Gérer les raccourcis dans le renderer (pas en accélérateurs de menu Electron, peu fiables en AZERTY). Sous Windows, désactiver la barre de menu native (sinon Alt seul la focalise).
- **Aucun raccourci à touche unique** (WCAG 2.1.4) : toujours un modificateur, sauf Entrée / Échap / Espace / flèches dans un composant focalisé.
- Les raccourcis marqués « hors champ » sont ignorés quand le focus est dans un champ texte.

| Windows | macOS | Action | Contexte |
|---|---|---|---|
| Ctrl+K | ⌘K | Ouvrir la recherche globale | Partout |
| Ctrl+N | ⌘N | Nouveau Zoi (foyer du contexte) | Partout |
| Ctrl+Maj+N | ⌘⇧N | Nouveau foyer | Partout |
| Ctrl+1 … Ctrl+6 | ⌘1 … ⌘6 | Accueil, Foyers, Zois, Relations, Référentiels, Réglages | Partout |
| Ctrl+, | ⌘, | Réglages | Partout |
| Ctrl+B | ⌘B | Réduire / déployer la barre latérale | Partout |
| Alt+1 … Alt+9 | ⌥1 … ⌥9 | Onglet n° 1 à 9 de la fiche | Fiche Zoi |
| Ctrl+Tab / Ctrl+Maj+Tab | ⌃Tab / ⌃⇧Tab | Onglet suivant / précédent | Fiche Zoi |
| Alt+↑ / Alt+↓ | ⌥↑ / ⌥↓ | Zoi précédent / suivant du foyer | Fiche Zoi, hors champ |
| Alt+← / Alt+→ | ⌘[ / ⌘] | Retour / Avancer | Partout |
| Ctrl+F | ⌘F | Focus sur le filtre de la page | Listes, Référentiels |
| Ctrl+V | ⌘V | Coller une capture dans l'emplacement photo focalisé ou survolé (ou l'unique emplacement d'une modale) | Emplacements photo |
| Entrée | Entrée | Valider le champ / ouvrir l'élément focalisé | Partout |
| Ctrl+Entrée | ⌘Entrée | Valider le formulaire, même depuis une zone de texte multiligne | Modales, panneaux |
| Échap | Échap | Fermer la surcouche du dessus ; annuler une édition en ligne | Partout |
| Suppr | ⌘⌫ | Supprimer l'élément focalisé (confirmation pour Zoi / foyer / famille, toast « Annuler » pour le reste) | Listes, hors champ |
| Ctrl+Z | ⌘Z | Dans un champ : annulation native. Hors champ : annule la dernière suppression tant que son toast est visible | Partout |
| Ctrl+S | ⌘S | Toast « Tout est enregistré automatiquement. » | Partout |
| Ctrl + / − / 0 | ⌘ + / − / 0 | Zoom de l'interface | Partout |
| F1 | F1 (ou menu Aide) | Aide des raccourcis | Partout |

Ordre des onglets pour Alt+n : 1 Profil, 2 Souvenirs, 3 Ambitions, 4 Préférences, 5 Valeur, 6 Carrière, 7 Relations, 8 Futur, 9 Vie & possessions. Le numéro est rappelé dans l'infobulle de chaque pastille (« Ambitions · Alt+3 »).

---

## 7. Conventions transverses

### Enregistrement
- Champs texte : enregistrement 400 ms après la dernière frappe et à la sortie du champ.
- Sélecteurs, cases, curseurs : enregistrement immédiat (curseurs : au relâchement).
- Indicateur dans la barre supérieure. En cas d'échec : le champ garde la valeur saisie, bordure d'erreur, toast persistant « Impossible d'enregistrer. Vos données sont toujours à l'écran. » [Réessayer].

### Formats
- Nombres : séparateur de milliers espace fine insécable (`Intl.NumberFormat('fr-FR')`) → « 12 500 ».
- Monnaie : icône Meow (fournie par le DA) + nombre ; repli texte « 12 500 Meow ».
- **Date en jeu** : texte libre (« Jour 12 », « juste après le mariage »). Le jeu change ; on ne force pas de format.
- Date réelle : enregistrée automatiquement, affichée en relatif (« il y a 2 jours ») avec la date complète en infobulle.

### Ton des micro-textes
- Vouvoiement, comme le jeu.
- Vocabulaire du jeu : Zoi (masculin : « ce Zoi », « un Zoi »), foyer, Vie désirée, ambition, jalon, souvenir, désir, préférence, valeur, trait de caractère, caractéristique, Meow.
- Libellés de cartes repris tels quels du jeu : « Informations de base », « Tranche d'âge », « Niveau d'études », « Arbre généalogique », « Vie désirée », « Traits de caractère et caractéristiques », « Désir », « Compétences », « Jalons », « Souvenirs récents », « Objectifs », « Étape 1 », « Aucune préférence », « École », « Plus haut niveau d'études », « Moyenne finale », « Affaires », « Freelance », « Note », « Gains totaux », « Licences possédées », « Contrats terminés », « Sans emploi ».
- États vides : constat court + action. Le jeu dit « Vous n'avez pas de carrière. » (point de vue du Zoi) ; le tracker dit « Aucune carrière renseignée. » (point de vue de la joueuse).

### Accessibilité (socle commun)
- Tout est atteignable au clavier, ordre de tabulation = ordre visuel (barre latérale → barre supérieure → en-tête de fiche → contenu).
- Focus visible sur tout élément interactif : anneau 2 px (token `focus-ring`) décalé de 2 px, jamais supprimé.
- Contraste texte ≥ 4,5:1 (≥ 3:1 pour les icônes porteuses de sens et les contours de champs), y compris sur photos (dégradé de lisibilité sous les titres de tuiles).
- La couleur n'est jamais seule porteuse de sens : cœur plein / cœur brisé pour aime / n'aime pas, signe + / − et texte pour les jauges de relation, emoji d'émotion + libellé masqué pour les souvenirs.
- Cibles cliquables ≥ 32 × 32 px (≥ 24 px pour les icônes secondaires dans une ligne).
- Toasts dans une région `aria-live="polite"` (erreurs : `assertive`).
- Surcouches : piège du focus, Échap ferme, focus rendu à l'élément déclencheur.
- `prefers-reduced-motion` : pas d'animation de déplacement, uniquement des fondus ≤ 150 ms.

---

## 8. Hors V1 (rappel, aucune maquette fournie)

Arbre généalogique complet multi-générations (V1 : vue simple centrée sur un Zoi), carte des relations, timeline, statistiques, mode legacy / générations, thème sombre, import depuis le jeu, anniversaires / étapes de vie à venir (pas de date de naissance en V1), genre, karma, état émotionnel. Les champs du brief non repris dans la V1 validée sont listés en fin de `modele-donnees.md` (§10) pour arbitrage du CEO.
