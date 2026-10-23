# Écrans — inZOI Tracker V1

> Livrable UX · v1.0 · 2026-10-23
> Fenêtre 1280 × 800 par défaut, minimum 1024 × 700. Grille, routes, raccourcis : `architecture.md`. Composants cités en *italique* : `composants.md`. Champs et types : `modele-donnees.md`.

## 0. Lire ce document

Chaque écran est décrit ainsi : **Objectif · Maquette · Contenu · Actions · États vides · Erreurs · Accessibilité**.

Notation des sources :
- `ref:traits` = référentiel `data/referentiels/traits.json` (élément référencé par son `id`). Tout champ `ref:` utilise le *Sélecteur de référentiel* avec recherche, icône et saisie libre « Ajouter « … » à la liste ».
- `zoi.carriere.salaire` = champ du modèle de la joueuse.
- `fixe` = liste propre à l'app (pas une donnée du jeu), définie dans le code.

Règles communes à tous les écrans :
- Enregistrement automatique (voir `architecture.md` §7). Pas de bouton « Enregistrer », sauf dans les modales de **création** (« Créer le foyer », « Ajouter le lien »…).
- Un champ vide s'affiche « — » en lecture ; un champ obligatoire vidé reste en erreur et **n'est pas enregistré** (la dernière valeur valide est conservée en base).
- Les maquettes ASCII donnent la structure et les proportions, pas le style (le style vient des tokens du DA).

---

## 1. Coquille de l'application

**Objectif.** Cadre commun : se repérer, changer de section, chercher, savoir que c'est enregistré.

```
┌──────────────────┬─────────────────────────────────────────────────────────────────────────┐
│  Zoi Tracker     │ Foyers › Foyer Clark › Marina Takahashi   [ Rechercher…  Ctrl K ]  ✓ Enregistré │
│                  ├─────────────────────────────────────────────────────────────────────────┤
│  [ic] Accueil    │                                                                         │
│  [ic] Foyers   3 │                                                                         │
│  [ic] Zois    12 │                     Zone de contenu (défile)                            │
│  [ic] Relations  │                     max 1120 px, centrée                                │
│  [ic] Référentiels│                                                                        │
│                  │                                                                         │
│  [ic] Réglages   │                                                                         │
│  « Réduire       │                                                                         │
└──────────────────┴─────────────────────────────────────────────────────────────────────────┘
   240 px (72 réduite)                          56 px de haut pour la barre supérieure
```

| Élément | Contenu | Règles |
|---|---|---|
| Logotype | « Zoi Tracker » (asset DA) | Clic → Accueil |
| Entrées | Accueil, Foyers (compteur), Zois (compteur), Relations, Référentiels, Réglages | `aria-current="page"` sur l'entrée active ; réduite : icône seule + infobulle avec le raccourci |
| Fil d'Ariane | Section › objet › sous-objet | Chaque segment est un lien sauf le dernier |
| Recherche | Faux champ « Rechercher… » + rappel « Ctrl K » / « ⌘ K » | Ouvre la *Palette de recherche* |
| Indicateur | *Indicateur d'enregistrement* | « Enregistré » s'efface après 2 s |

**Erreurs.** Échec d'écriture : indicateur « Échec de l'enregistrement · Réessayer » + toast persistant. Base de données illisible au démarrage : écran plein « Impossible d'ouvrir vos données. » avec [Restaurer la dernière copie de sécurité] [Ouvrir le dossier des données].

**Accessibilité.** Repères `nav` (barre latérale), `header` (barre supérieure), `main` (contenu). Le titre de la fenêtre suit l'écran (« Marina Takahashi · Profil — Zoi Tracker »).

---

## 2. Accueil `#/accueil`

**Objectif.** Arriver sur la plateforme et repartir en un clic : reprendre un Zoi, ouvrir un foyer, voir ce qui est en cours.

```
 Accueil
 [ + Nouveau foyer ]  [ + Nouveau Zoi ]                          [ Rechercher…  Ctrl K ]

 Reprendre
 ( av )  ( av )  ( av )  ( av )  ( av )  ( av )
 Marina   Leo     Hiro    Yumi    Léa     Ren
 Profil   Souven. Ambit.  …

 Vos foyers                                                              Tous les foyers (3) ›
 ┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────────────┐
 │ bannière 4:1          │ │ bannière 4:1          │ │ bannière 4:1          │
 │ Foyer Clark           │ │ Foyer Takahashi       │ │ Foyer Park            │
 │ Bliss Bay · (av)(av)+2│ │ Dowon · (av)(av)      │ │ Cahaya · (av)         │
 └───────────────────────┘ └───────────────────────┘ └───────────────────────┘

 Projets en cours                                   Ambitions en cours
 (av) Ouvrir un café avec Leo · Marina · Avant…     (av) Marina · Maître de la préparation… Niv. 1/3 · 0/2
 (av) Mariage sur la plage · Thomas                 (av) Leo · …
```

**Contenu.**

| Bloc | Contenu | Source | Règles |
|---|---|---|---|
| Actions rapides | « Nouveau foyer », « Nouveau Zoi », déclencheur de recherche | — | Ouvrent les modales §11 |
| Reprendre | 6 derniers Zois consultés : *Avatar* lg, prénom, dernier onglet | historique de navigation local | Masqué s'il est vide. Clic → fiche sur cet onglet |
| Vos foyers | 6 *Cartes foyer* max, triées par dernière modification | `Foyer` | « Tous les foyers (n) › » → `#/foyers` |
| Projets en cours | 5 lignes max : avatar xs, titre, Zoi, échéance | `Projet` statut `en_cours`, tri `modifie_le` décroissant | Clic → fiche, onglet Futur, projet déplié |
| Ambitions en cours | 5 lignes max : avatar xs, Zoi, ambition, « Niv. n/3 », objectifs faits / total de l'étape | `AmbitionZoi` statut `en_cours` | Clic → fiche, onglet Ambitions |

**États vides.**
- **Premier lancement** (0 foyer et 0 Zoi), le reste de la page est remplacé par :
  - Titre : « Bienvenue dans votre carnet inZOI »
  - Texte : « Créez votre premier foyer, puis ajoutez-y vos Zois. Les listes du jeu (traits, carrières, Vies désirées…) sont déjà chargées : vous pourrez les compléter dans Référentiels. »
  - [Créer mon premier foyer] (primaire, focus initial) · [Importer une sauvegarde] (secondaire) · lien « Ajouter un Zoi sans foyer »
- Projets : « Aucun projet en cours. Notez vos idées d'histoire dans l'onglet Futur d'un Zoi. »
- Ambitions : « Aucune ambition en cours. »

**Accessibilité.** Chaque bloc est une `section` titrée (`h2`). L'ordre de tabulation suit l'ordre visuel.

---

## 3. Foyers › onglet Foyers `#/foyers`

**Objectif.** Voir tous les foyers, en créer, en ouvrir, en supprimer.

```
 Foyers                                                               [ + Nouveau foyer ]
 [ Foyers | Familles ]
 [ Filtrer les foyers…  Ctrl F ] [ Ville ▾ ] [ Tri : Nom A→Z ▾ ]  [ ] Regrouper par famille
 ┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────────────┐
 │ bannière 4:1          │ │                       │ │                       │
 │ Foyer Clark       [⋯] │ │ …                     │ │ …                     │
 │ Bliss Bay             │ │                       │ │                       │
 │ (av)(av)(av)(av) 4 Zois│ │                       │ │                       │
 │ Ɱ 12 500              │ │                       │ │                       │
 └───────────────────────┘ └───────────────────────┘ └───────────────────────┘
```

**Contenu.** Contrôle segmenté « Foyers | Familles » (bascule de route `#/foyers` ↔ `#/familles`). Grille de *Cartes foyer* : 3 colonnes si la zone de contenu fait ≥ 1000 px, sinon 2.

| Contrôle | Type | Source |
|---|---|---|
| Filtrer | texte, sans accents ni casse, sur nom du foyer, famille, prénoms des membres | — |
| Ville | sélecteur simple avec « Toutes les villes » | `ref:villes` |
| Tri | Nom A→Z · Modifié récemment · Nombre de Zois | `fixe` |
| Regrouper par famille | case ; groupes titrés par famille principale, puis « Sans famille » | `Famille` |

**Actions.** Nouveau foyer (§11.2) · Ouvrir (clic ou Entrée sur la carte) · menu ⋯ de carte : Ouvrir, Supprimer le foyer… (§5, modale).

**États vides.**
- Aucun foyer : « Aucun foyer pour l'instant. » / « Un foyer réunit les Zois qui vivent sous le même toit. » [Créer un foyer]
- Filtre sans résultat : « Aucun foyer ne correspond à « {saisie} ». » [Effacer le filtre]

**Accessibilité.** Grille = liste (`ul`) de cartes ; chaque carte a un seul lien principal (le nom), le menu ⋯ est un bouton distinct.

---

## 4. Foyers › onglet Familles `#/familles` et détail `#/familles/:id`

**Objectif.** Gérer les familles (lignées = « Nom de famille » du jeu), qui peuvent s'étendre sur plusieurs foyers.

```
 Foyers                                                              [ + Nouvelle famille ]
 [ Foyers | Familles ]
 [ Filtrer les familles… ]
 ┌────────────────────────────────────────────────────────────────────────────────┐
 │ [emb] Clark          2 foyers · 7 Zois    (av)(av)(av)(av)+3              [⋯]  │
 │ [emb] Takahashi      1 foyer  · 3 Zois    (av)(av)(av)                    [⋯]  │
 └────────────────────────────────────────────────────────────────────────────────┘
```

**Liste.** Lignes : *Emplacement photo* carré 40 px (emblème, facultatif), nom, nombre de foyers (famille principale) et de Zois (`zoi.famille_id`), pile d'avatars. Menu ⋯ : Ouvrir, Supprimer la famille…

**Détail d'une famille.**

| Champ | Type | Règles |
|---|---|---|
| Emblème | *Emplacement photo* 1:1 | Facultatif |
| Nom | texte 1–60, édition en ligne | Requis |
| Notes | texte multiligne 0–5000 | « Histoire de la famille, origines, secrets… » (placeholder) |
| Foyers de cette famille | *Cartes foyer* | Foyers dont c'est la famille principale |
| Zois de cette famille | *Cartes Zoi* compactes | Bouton « Arbre généalogique » sur chaque carte (menu ⋯) |

**Actions.** Nouvelle famille (§11.3) · Renommer (édition en ligne) · Supprimer la famille… → *Modale de confirmation* :
« Supprimer la famille Clark ? » / « Les 2 foyers et les 7 Zois de cette famille sont conservés : leur nom de famille sera simplement vidé. » [Annuler] [Supprimer la famille] → toast « Famille Clark supprimée. » [Annuler].

**États vides.**
- Aucune famille : « Aucune famille pour l'instant. » / « Une famille regroupe les Zois qui portent le même nom de famille, même s'ils vivent dans des foyers différents. » [Créer une famille]
- Détail sans Zoi : « Aucun Zoi ne porte encore ce nom de famille. »

**Erreurs.** Nom vide : « Donnez un nom à la famille. » Doublon : avertissement non bloquant « Une famille porte déjà ce nom. »

---

## 5. Détail d'un foyer `#/foyers/:id`

**Objectif.** Tout savoir d'un foyer et accéder à ses Zois ; c'est le point de départ habituel d'une session de jeu.

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                            bannière 4:1 (Emplacement photo)                               │
│  Foyer Clark                                                                         [⋯] │
└──────────────────────────────────────────────────────────────────────────────────────────┘
 Bliss Bay · Quartier des Pins · Ɱ 12 500 · Génération 2

┌ Membres (4) ──────────────────────────────────────────── [ + Ajouter un Zoi ▾ ] ┐
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                                      │
│ │ (av)   │ │ (av)   │ │ (av)   │ │ (av)   │                                      │
│ │Marina  │ │Thomas  │ │Leo     │ │Mia     │                                      │
│ │Jeune a.│ │Adulte  │ │Enfant  │ │Bébé    │                                      │
│ └────────┘ └────────┘ └────────┘ └────────┘                                      │
└──────────────────────────────────────────────────────────────────────────────────┘
┌ Informations ─────────────────────────────┐ ┌ Logement ──────────────────────────────┐
│ Nom du foyer     Clark                    │ │ [ photo de la maison 16:9            ] │
│ Famille          Clark ▾                  │ │ Ville      Bliss Bay ▾                 │
│ Budget           Ɱ 12 500                 │ │ Quartier   Quartier des Pins ▾         │
│ Génération       2                        │ │ Adresse    12, allée des Pins          │
└───────────────────────────────────────────┘ └────────────────────────────────────────┘
┌ Animaux du foyer (1) ───────────── (+) ┐ ┌ Véhicules du foyer (0) ─────────── (+) ┐
│ (ph) Mochi · Chat                  [⋯] │ │ Aucun véhicule.                         │
└────────────────────────────────────────┘ └─────────────────────────────────────────┘
┌ Notes d'histoire ────────────────────────────────────────────────────────────────┐
│ Texte libre…                                                                     │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Contenu.**

| Champ | Type | Source | Règles |
|---|---|---|---|
| Bannière | *Emplacement photo* 4:1 | — | Titre du foyer superposé en bas à gauche, voile de lisibilité (token DA) |
| Nom du foyer | texte 1–60 | — | Requis |
| Famille | sélecteur de famille avec recherche + « Créer la famille « … » » + « Aucune » | `Famille` | Famille principale, sert au regroupement et au pré-remplissage des nouveaux Zois |
| Budget | *Champ Meow*, entier ≥ 0 | — | Facultatif |
| Génération | entier 1–99 (stepper) | — | Facultatif, pour les parties legacy |
| Photo de la maison | *Emplacement photo* 16:9 | — | |
| Ville | sélecteur | `ref:villes` | |
| Quartier | combobox : quartiers de la ville + saisie libre | `ref:villes` › `details.quartiers` | Sans ville : saisie libre seule. Ajouter un quartier inconnu propose « Ajouter « … » aux quartiers de Bliss Bay » |
| Adresse / lot | texte 0–120 | — | Placeholder « Adresse ou numéro de lot » |
| Membres | *Cartes Zoi* (portrait, prénom, tranche d'âge) | `Zoi` où `foyer_id` = ce foyer, triés par `ordre_foyer` | L'ordre est celui de la rangée d'avatars de la fiche |
| Animaux du foyer | lignes possession | `Possession` catégorie `animal`, propriétaire = foyer | |
| Véhicules du foyer | lignes possession | `Possession` catégorie `vehicule`, propriétaire = foyer | |
| Notes d'histoire | texte multiligne 0–5000 | — | |

**Actions.**
- « Ajouter un Zoi » (bouton fractionné) : « Nouveau Zoi » (§11.4, foyer pré-rempli) · « Ajouter un Zoi existant… » (*Sélecteur de Zoi* ; si le Zoi a déjà un foyer : « Leo quittera le foyer Park. » [Annuler] [Déplacer]).
- Réordonner les membres : glisser-déposer, ou menu ⋯ de la carte « Déplacer vers la gauche / la droite ».
- Menu ⋯ d'une carte membre : Ouvrir la fiche, Retirer du foyer (le Zoi passe « Sans foyer », toast [Annuler]), Supprimer ce Zoi…
- (+) Animaux / Véhicules : panneau latéral *Possession* (§7.9).
- Menu ⋯ de l'en-tête : Supprimer le foyer… → *Modale de confirmation* avec choix :
  - Titre : « Supprimer le foyer Clark ? »
  - (•) « Garder ses 4 Zois (ils passeront en « Sans foyer ») » — par défaut
  - ( ) « Supprimer aussi ses 4 Zois et tout leur contenu »
  - Texte : « 1 animal et 0 véhicule du foyer seront supprimés. » (lignes à 0 omises)
  - [Annuler] (focus) · [Supprimer le foyer] (devient « Supprimer le foyer et ses Zois » si la 2e option est cochée)
  - Toast : « Foyer Clark supprimé. » [Annuler]

**États vides.** Membres : « Ce foyer n'a pas encore de Zoi. » [Ajouter un Zoi] (focus après création du foyer) · Animaux : « Aucun animal. » · Véhicules : « Aucun véhicule. »

**Erreurs.** Nom vide : « Donnez un nom au foyer. » · Budget négatif ou non numérique : « Le budget est un nombre positif. »

**Accessibilité.** La bannière a un texte alternatif généré (« Bannière du foyer Clark ») ; si elle est vide, l'emplacement est un bouton « Ajouter une bannière ».

---

## 6. Zois `#/zois`

**Objectif.** Retrouver n'importe quel Zoi, y compris ceux sans foyer (voisins, collègues, amours…).

```
 Zois                                                                    [ + Nouveau Zoi ]
 [ Filtrer les Zois…  Ctrl F ] [ Foyer ▾ ] [ Famille ▾ ] [ Tranche d'âge ▾ ] [ Tri ▾ ]  [▦|☰]
 ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
 │  (av)    │ │  (av)    │ │  (av)    │ │  (av)    │ │  (av)    │ │  (av)    │
 │ Marina T.│ │ Thomas C.│ │ …        │ │          │ │          │ │          │
 │ Jeune ad.│ │ Adulte   │ │          │ │          │ │          │ │          │
 │ F. Clark │ │ F. Clark │ │          │ │          │ │          │ │          │
 └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
```

| Contrôle | Type | Source |
|---|---|---|
| Filtrer | texte (prénom, nom, famille, foyer) | — |
| Foyer | multi-sélection, inclut « Sans foyer » | `Foyer` |
| Famille | multi-sélection, inclut « Sans famille » | `Famille` |
| Tranche d'âge | multi-sélection, avec icônes | `ref:etapes-de-vie` |
| Tri | Prénom A→Z · Nom A→Z · Modifiés récemment · Tranche d'âge | `fixe` |
| Vue | Grille (*Carte Zoi*) · Liste compacte (avatar sm, nom, foyer, tranche d'âge, carrière résumée, icône de Vie désirée) | mémorisée |

**Actions.** Nouveau Zoi (foyer = « Sans foyer » par défaut, modifiable) · Ouvrir (clic / Entrée) · Suppr sur une carte focalisée → confirmation (P5).

**États vides.** Aucun Zoi : « Aucun Zoi pour l'instant. » [Ajouter un Zoi] · Filtres sans résultat : « Aucun Zoi ne correspond à ces filtres. » [Réinitialiser les filtres]

---

## 7. Fiche Zoi `#/zois/:id/:onglet`

### 7.0 En-tête commun (calqué sur le jeu)

```
 ( av )( av )( av )(( AV ✓ ))( + )                                                     [⋯]
 [Profil] [Souvenirs] [Ambitions] [Préférences] [Valeur] [Carrière] │ [Relations] [Futur] [Vie & possessions]
 ════════════════════════════════════════════════════════════════════════════════════════
```

| Élément | Règles |
|---|---|
| Rangée d'avatars | *Avatar* lg (64 px) des membres du foyer, ordre `ordre_foyer`. Actif : anneau accent + pastille coche (comme le jeu). Infobulle « Prénom Nom · Tranche d'âge ». Clic = change de Zoi en gardant l'onglet. ← / → déplacent le focus, Entrée ouvre |
| Bouton « + » | *Avatar* variante ajout. `aria-label` « Ajouter un Zoi au foyer Clark » → §11.4 |
| Zoi sans foyer | La rangée ne montre que lui, suivie du bouton texte « Ajouter à un foyer… » (§11.5) |
| Onglets | *Pastilles d'onglet*, ordre fixe, séparateur vertical avant Relations. Défilement horizontal avec flèches et fondu si la largeur manque |
| Menu ⋯ | Changer de foyer… (§11.5) · Arbre généalogique · Supprimer ce Zoi… (P5) |
| Collant | Avatars + onglets restent visibles au défilement ; avatars réduits à 40 px une fois le contenu défilé |

**Erreur.** Route vers un Zoi supprimé : « Ce Zoi n'existe plus. » [Retour aux Zois].

**Accessibilité.** Avatars : `nav aria-label="Membres du foyer Clark"`, l'actif porte `aria-current="page"`. Onglets : `role="tablist"`, activation manuelle (flèches pour se déplacer, Entrée / Espace pour activer), infobulle avec le raccourci Alt+n.

### 7.1 Onglet Profil

**Objectif.** L'identité du Zoi d'un coup d'œil, comme dans le jeu.

```
┌ Informations de base ─────────────────────────────────────────────────────────────────────┐
│ ┌──────────┐  Nom              [ Marina           ] [ Takahashi         ]                   │
│ │ portrait │  Nom de famille   [ Clark                              ▾ ]                    │
│ │   1:1    │  Tranche d'âge    (ic)──○──○──○──○──●──○──○──○──(ic)   Jeune adulte           │
│ │ (rond)   │  Carrière         Sans emploi                              Modifier ›         │
│ └──────────┘  Niveau d'études  Lycée Diplôme obtenu                     Modifier ›         │
│                                                         [ (ic) Arbre généalogique ]        │
└───────────────────────────────────────────────────────────────────────────────────────────┘
┌ Vie désirée (i) ───────────────────── (Q) ┐ ┌ Traits de caractère et caractéristiques (i) (Q) ┐
│ ┌───────┐                                 │ │ ┌───────┐  Adepte des mondanités              │
│ │ image │  Vie de simplicité              │ │ │ carte │  [ic Sociable] [ic Génie] [+]       │
│ │  3:4  │                                 │ │ │  3:4  │                                     │
│ └───────┘                                 │ │ └───────┘                                     │
└───────────────────────────────────────────┘ └───────────────────────────────────────────────┘
┌ Désir (i) ────────────────────────────────┐ ┌ Compétences (i) ─────────────── (+)  Tout voir (8) ┐
│   (ic)⊙      (ic)⊙      (ic)⊙     ( ? )   │ │ ( 1 ) Cuisine            ( 1 ) Tâches ménagères    │
│   Chanter    Dormir     Café              │ │ ( 6 ) Rhétorique         ( 1 ) Pensée critique     │
│                                           │ │ ( 3 ) …                  ( 2 ) …                   │
└───────────────────────────────────────────┘ └────────────────────────────────────────────────────┘
```

**Carte « Informations de base »** (pleine largeur).

| Champ (libellé du jeu) | Type | Source | Règles |
|---|---|---|---|
| Portrait | *Emplacement photo* 1:1, affiché rond, 120 px | — | Ctrl/Cmd+V, glisser-déposer ou clic. Sert aussi à la rangée d'avatars |
| Nom | 2 champs : « Prénom » (texte 1–40, requis) + « Nom » (texte 0–40) | — | Le jeu affiche le nom complet sur une ligne ; on sépare pour trier |
| Nom de famille | sélecteur de famille avec recherche, « Créer la famille « … » », « Aucune » | `Famille` | Infobulle ⓘ : « Dans le jeu, le nom de famille est celui de la famille du Zoi ; il peut différer de son nom. » |
| Tranche d'âge | *Curseur d'étape de vie* | `ref:etapes-de-vie`, tri `details.ordre` | Valeur nulle autorisée : « Non renseignée », curseur sans poignée |
| Carrière | résumé en lecture seule + lien « Modifier › » → onglet Carrière, focus sur la carte Carrière | `zoi.carriere` | Voir tableau ci-dessous |
| Niveau d'études | résumé en lecture seule + « Modifier › » → onglet Carrière, focus sur la carte École | `ref:niveaux-etudes` via `zoi.ecole.niveau_etudes_id` | « Non renseigné » si vide. Même libellé que dans Carrière (le jeu écrit « Lycée Diplôme obtenu » ici et « Diplôme obtenu » là-bas : on garde un seul libellé, celui du référentiel) |
| Arbre généalogique | bouton (style du jeu : pilule blanche, icône à gauche) | — | Ouvre §7.1.b |

Affichage du résumé « Carrière » :

| Situation | Affichage |
|---|---|
| `statut = en_poste` | « {poste} · {employeur} » (employeur = `details.employeur` de la carrière, sinon nom de la carrière) |
| `statut = sans_emploi` | « Sans emploi » (libellé du jeu) |
| `statut = retraite` | « Retraité·e » |
| Pas de statut et étape de vie avec `peut_travailler = false` | « — » + infobulle « Ce Zoi n'est pas encore en âge de travailler. » |
| Pas de statut | « Non renseignée » |

**Carte « Vie désirée »** (colonne gauche).

| Élément | Type | Source | Règles |
|---|---|---|---|
| Image | *Vignette de référentiel* 3:4 | image de la joueuse > icône embarquée > emoji `icone` | |
| Nom | texte | `ref:vies-desirees` | 1 seule Vie désirée |
| ⓘ | infobulle | `description` | |
| (Q) | bouton icône rond | — | *Sélecteur de référentiel*, variante grande grille 3:4. Pied du sélecteur : « Retirer la Vie désirée » si une est choisie |
| Conseil | texte atténué sous le nom | `ref:etapes-de-vie` | Si l'étape de vie est avant « Jeune adulte » : « Dans le jeu, la Vie désirée se choisit à partir de Jeune adulte. » (non bloquant) |
| Proposition | bandeau dans la carte | `details.ambition` | Si la Vie désirée a une ambition liée et que le Zoi n'a pas d'ambition en cours : « Cette Vie désirée est liée à l'ambition « {nom} ». La définir comme ambition en cours ? » [Définir] [Non merci] |

État vide : vignette en pointillés + « Aucune Vie désirée choisie. » [Choisir une Vie désirée].

**Carte « Traits de caractère et caractéristiques »** (colonne droite).

| Élément | Type | Source | Règles |
|---|---|---|---|
| Carte du trait | *Vignette de référentiel* 3:4 | `ref:traits` | |
| Trait | texte | `ref:traits` | 1 seul trait |
| Caractéristiques | *Puces* icône + nom ; « + » ouvre le sélecteur en mode multiple ; × sur la puce (visible au survol et au focus) pour retirer | `ref:caracteristiques` | Pas de maximum imposé (le jeu en montre 2) |
| (Q) | bouton icône rond | — | Sélecteur variante grande grille, groupé par catégorie (6 catégories) |

Au choix d'un trait :
- caractéristiques vides → remplies avec `details.caracteristiques` du trait ;
- caractéristiques déjà remplies et différentes → bandeau « Remplacer les caractéristiques par celles de ce trait (Sociable, Génie) ? » [Remplacer] [Garder les miennes] ;
- valeurs du Zoi vides et `details.valeurs` non vide → les valeurs de départ sont ajoutées (score non renseigné), toast « 4 valeurs de départ ajoutées dans l'onglet Valeur. » [Annuler].

État vide : « Aucun trait choisi. » [Choisir un trait].

**Carte « Désir »** (colonne gauche).

| Élément | Type | Source | Règles |
|---|---|---|---|
| Emplacements | 4 *Emplacements de désir* (le jeu en montre 3 remplis + 1 « ? » ; maximum à vérifier en jeu) | `ref:desirs` | Icône ronde 56 px, libellé court sous l'icône (ajout du tracker pour la lisibilité) |
| Épingle | bouton bascule sur chaque désir | — | `aria-pressed`, libellé « Épingler ce désir » / « Désépingler ce désir » |
| « ? » | emplacement vide | — | Ouvre le sélecteur ; désirs déjà présents désactivés (« Déjà ajouté ») |
| Menu d'un désir | Remplacer… · Épingler / Désépingler · Retirer | — | Retirer : toast [Annuler] |

Pas de minuteur : le tracker ne suit pas le temps du jeu. État vide : les 4 emplacements « ? » + « Notez les désirs du moment. »

**Carte « Compétences »** (colonne droite).

| Élément | Type | Source | Règles |
|---|---|---|---|
| Aperçu | jusqu'à 6 compétences en 2 colonnes : *Jauge de compétence* sm + nom + « Niv. n » | `zoi.competences` × `ref:competences` | Tri niveau décroissant puis nom |
| (+) | bouton icône | — | Sélecteur multiple ; compétences déjà présentes désactivées ; ajoutées au niveau 1 |
| Tout voir (n) | lien | — | Ouvre le *Panneau latéral* « Compétences de Marina » |
| Clic sur une compétence | — | — | Ouvre le panneau, ligne correspondante focalisée |

Panneau « Compétences de Marina » : une ligne par compétence — jauge md, nom, *Stepper* « Niveau » 1 → `details.niveau_max` (sans maximum si absent), *Curseur 0–100* « Progression vers le niveau suivant » (facultatif, en %), bouton « Retirer » ; en tête, champ « Ajouter une compétence… » (combobox du référentiel).

État vide : « Aucune compétence renseignée. » [Ajouter une compétence].

**Erreurs (onglet Profil).** Prénom vide : « Le prénom est obligatoire. » · Photo refusée : voir *Emplacement photo* · Niveau de compétence hors bornes : ramené à la borne, message « Niveau entre 1 et 10. » (borne réelle du référentiel).

**Accessibilité.** Le libellé de chaque ligne d'information est un vrai `label`. Les cartes sont des `section` avec titre `h2`. Les boutons icône (loupe, +) ont un `aria-label` explicite : « Changer la Vie désirée », « Changer le trait de caractère », « Ajouter une compétence ».

### 7.1.b Arbre généalogique (surcouche)

**Objectif.** Répondre à « qui est le parent de qui ? » sans quitter la fiche. V1 = vue simple centrée sur un Zoi (l'arbre complet est hors V1).

```
┌ Arbre généalogique · Marina Takahashi ────────────────────────────── [Afficher en liste] [×] ┐
│ Grands-parents     [Ana]  [Bo]                      [Chen]  [Dae]                            │
│                        └──┬──┘                           └──┬──┘                             │
│ Parents             [Hiro Takahashi] ════ [Yumi Takahashi]                                   │
│                                  ┌──────────┴──────────┐                                     │
│ Fratrie / couple   [Ren]   [[ MARINA ✓ ]] ════ [Thomas Clark]   ╌╌╌ [Kai] (ex)               │
│                                        ┌──────┴──────┐                                       │
│ Enfants                              [Leo]         [Mia]                                     │
│ Petits-enfants                         —                                                     │
│                                                                    [ Ajouter un lien familial ] │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

| Règle | Détail |
|---|---|
| Données | Liens dont le type de relation a un `details.role_arbre` : `parent`, `enfant`, `conjoint`, `ex_conjoint`, `fratrie` (voir `modele-donnees.md` §5) |
| Portée | 2 générations au-dessus, 2 en dessous ; fratrie, conjoint·e·s et ex du Zoi central |
| Nœud | *Avatar* md + prénom ; Zoi central agrandi et marqué |
| Traits | Conjoint : double trait plein · Ex : pointillés · Filiation : trait simple |
| Clic / Entrée sur un nœud | Recentre l'arbre sur ce Zoi |
| Double-clic / Ctrl+Entrée | Ouvre sa fiche (ferme la surcouche) |
| Taille | min(1100 px, 92 % de la fenêtre) × min(720 px, 88 %), défilement interne |

**État vide.** « Aucun lien familial pour Marina. Ajoutez un parent, un enfant, un·e conjoint·e ou un frère / une sœur. » [Ajouter un lien familial] (ouvre « Nouveau lien », §7.7, filtré sur le type Famille).

**Accessibilité.** Flèches = déplacement spatial entre nœuds. « Afficher en liste » bascule vers une liste imbriquée équivalente (`role="tree"`), lisible au lecteur d'écran.

### 7.2 Onglet Souvenirs

**Objectif.** Garder l'histoire du Zoi : les grandes étapes (jalons) et les petits moments (souvenirs, notes datées).

```
┌ Jalons (i) ────────────────────────────────────────────── [Toutes les étapes ▾]  (+) ⁶ ┐
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                        │
│ │   image     │ │   image     │ │   image     │ │   image     │                        │
│ │ Première    │ │ Fiançailles │ │ Premier     │ │ Diplôme de  │                        │
│ │ grossesse   │ │ Jour 40     │ │ emploi      │ │ lycée       │                        │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘                        │
│ ┌─────────────┐ ┌─────────────┐ ┌ ─ ─ ─ ─ ─ ─ ┐                                        │
│ │ Partenaire  │ │ Premier     │   + Ajouter                                            │
│ │ de prom     │ │ amour       │   un jalon                                             │
│ └─────────────┘ └─────────────┘ └ ─ ─ ─ ─ ─ ─ ┘                                        │
└─────────────────────────────────────────────────────────────────────────────────────────┘
┌ Souvenirs récents (i) ──────────────────────────────────────── [ Rechercher… ]  ² ┐
│ [ Noter un souvenir…                                     ] [émotion] [Zoi] [Ajouter] │
│ ┌──────────────────────────────────────────┐ ┌──────────────────────────────────────┐│
│ │(av)(☺) Je lui ai annoncé ma grossesse, et │ │(av)(☹) J'ai présenté mes excuses,    ││
│ │ la nouvelle lui a fait plaisir.           │ │ mais elles n'ont pas été acceptées.  ││
│ │ Jour 41 · il y a 2 jours                  │ │ Jour 39 · il y a 3 jours             ││
│ └──────────────────────────────────────────┘ └──────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────────────────────────────┘
```

**Carte « Jalons »** (pleine largeur). Grille de *Tuiles de jalon* 16:10, 4 colonnes (3 sous 880 px), dernière tuile « + Ajouter un jalon ». Pastille de compteur sur l'en-tête, comme le jeu. Ordre : ordre d'ajout (le plus ancien en premier).

| Champ (panneau « Jalon ») | Type | Source | Règles |
|---|---|---|---|
| Jalon | sélecteur | `ref:jalons` (filtre par étape de vie possible) | Requis |
| Date en jeu | texte 0–60 | — | Placeholder « ex. Jour 12, ou « juste après le mariage » » |
| Photo | *Emplacement photo* 16:10 | — | Remplace l'image du référentiel sur la tuile |
| Avec | multi *Sélecteur de Zoi* | `Zoi` | Facultatif (ex. le partenaire des fiançailles) |
| Note | texte multiligne 0–1000 | — | |

Filtre « Toutes les étapes » : *sélecteur* `ref:etapes-de-vie` (via `details.etape_de_vie` du jalon).
Création : [Annuler] [Ajouter le jalon] (Ctrl/Cmd+Entrée). Modification : enregistrement automatique, bouton « Supprimer le jalon » en pied (toast [Annuler]).
Doublon : avertissement non bloquant « Ce jalon est déjà noté pour Marina. »

**Carte « Souvenirs récents »** (pleine largeur). Contient aussi les notes datées de la joueuse.

| Élément | Type | Source | Règles |
|---|---|---|---|
| Ajout rapide | champ texte 1–500 + bouton « émotion » + bouton « Zoi » + [Ajouter] | — | Entrée = ajouter ; le champ reste focalisé et se vide |
| Émotion | sélecteur compact (grille d'emojis) | `ref:emotions` | Facultatif |
| Zoi lié | *Sélecteur de Zoi* | `Zoi` | Facultatif ; son avatar s'affiche dans la ligne |
| Tonalité | Positif / Neutre / Négatif (*Contrôle segmenté*) | `fixe` | Déduite de l'émotion si le référentiel classe les émotions en catégories `positive` / `negative`, sinon Neutre ; modifiable |
| Date en jeu | texte 0–60 | — | Modifiable dans la ligne dépliée |
| Liste | *Lignes de souvenir* en 2 colonnes, plus récent en premier | `Souvenir` | 20 affichés puis « Afficher plus » |
| Rechercher | filtre texte | — | Sans accents ni casse |

Clic sur une ligne → elle se déplie en édition (texte, date en jeu, émotion, tonalité, Zoi lié, « Supprimer »). × au survol / focus = suppression directe + toast « Souvenir supprimé. » [Annuler].

**États vides.**
- Jalons : seule la tuile d'ajout + « Aucun jalon pour l'instant. Premier amour, diplôme, mariage… notez les grandes étapes de la vie de Marina. »
- Souvenirs : « Aucun souvenir noté. Écrivez ce qui vient de se passer en jeu, en une phrase. »
- Recherche sans résultat : « Aucun souvenir ne contient « {saisie} ». »

**Erreurs.** Ajout avec texte vide : rien n'est créé, aide « Écrivez d'abord le souvenir. » · Plus de 500 caractères : compteur en erreur « 500 caractères maximum. »

**Accessibilité.** La tonalité est annoncée en texte (« Souvenir positif ») et doublée par l'emoji ; la couleur de fond n'est qu'un renfort. Titres des tuiles de jalon sur voile de lisibilité garantissant 4,5:1.

### 7.3 Onglet Ambitions

**Objectif.** Suivre l'ambition en cours, étape par étape, comme l'écran du jeu.

```
 Ambitions                                                         ⓘ À propos des ambitions
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│ ┌──────┐  Pro des astuces du quotidien                                              (Q)  │
│ │icône │  Maître de la préparation de boissons                                           │
│ └──────┘  Niv. [ 1 ▾ ]/3 · En cours                                                [⋯]   │
│ ──────────────────────────────────────────────────────────────────────────────────────── │
│ Objectifs                                                                                 │
│ [     Étape 1     ] [     Étape 2     ] [     Étape 3     ]                               │
│ ▌[ ] Acheter un distributeur de préparation de boissons                [−]  0/1  [+]      │
│ ▌[ ] Préparer 5 boissons mélangées                                      [−]  0/5  [+]      │
│  + Ajouter un objectif                                                                    │
│ ▸ Récompenses (2)                                                                         │
└───────────────────────────────────────────────────────────────────────────────────────────┘
 ▸ Ambitions passées (2)
```

Texte d'aide (replié derrière « À propos des ambitions ») : « L'ambition est le grand rêve qu'un Zoi veut réaliser. Elle peut changer à tout moment, influence ses Désirs et débloque des récompenses uniques une fois accomplie. »

| Élément | Type | Source | Règles |
|---|---|---|---|
| Icône | *Vignette de référentiel* carrée | `ref:ambitions` | |
| Catégorie | texte atténué, lecture seule | `ref:ambitions` › `categories[].nom` | Ex. « Pro des astuces du quotidien » |
| Ambition | titre | `ref:ambitions` | 1 seule ambition en cours |
| (Q) | bouton icône rond | — | Sélecteur groupé par catégorie |
| Niveau | « Niv. [n ▾]/N » ; N = nombre d'étapes du référentiel (3 par défaut) | `ambition.niveau` | Le jeu écrit « Lv. 1/3 » ; on harmonise avec « Niv. » des compétences |
| Statut | « En cours » | `fixe` | Changé via le menu ⋯ |
| Étapes | *Contrôle segmenté* Étape 1…N ; états : terminée (coche), en cours, à venir (atténuée mais cliquable) | — | L'étape affichée par défaut = niveau |
| Objectifs | *Liste d'objectifs* | `ambition.objectifs`, copiés de `details.niveaux[].objectifs` au moment du choix | Case (Espace), texte, *Stepper* de progression 0 → cible |
| + Ajouter un objectif | ligne d'ajout en place | — | Texte 1–200 + cible (entier ≥ 1, défaut 1). Objectif propre à ce Zoi |
| Récompenses | accordéon, lecture seule | `details.recompenses` | Masqué si vide |

Automatismes :
- Cocher un objectif = progression mise à `cible`. Décocher = progression à 0.
- Tous les objectifs de l'étape en cours faits → bandeau « Étape 1 terminée. Passer à l'étape 2 ? » [Passer à l'étape 2] [Plus tard].
- Toutes les étapes faites → bandeau « Toutes les étapes sont terminées. Marquer l'ambition comme accomplie ? » [Marquer comme accomplie].
- Monter le niveau à la main (ex. 1 → 3) coche les objectifs des étapes inférieures, toast « Objectifs des étapes 1 et 2 cochés. » [Annuler].

Menu ⋯ : Marquer comme accomplie · Abandonner l'ambition · Resynchroniser les objectifs avec le référentiel (ajoute les objectifs manquants, ne supprime rien) · Retirer l'ambition (suppression, toast [Annuler]).

Changer d'ambition alors qu'une est en cours → *Modale de confirmation* neutre : « Changer d'ambition ? » / « « Maître de la préparation de boissons » (Niv. 1/3) sera rangée dans Ambitions passées comme abandonnée. » [Annuler] [Changer].

**Ambitions passées** (accordéon replié, *proposition à valider par le CEO*, coût faible) : lignes icône, nom, catégorie, puce « Accomplie » ou « Abandonnée », niveau atteint, date en jeu de fin (texte libre). Menu : Reprendre cette ambition (si aucune en cours) · Supprimer.

**États vides.** « Aucune ambition en cours. » [Choisir une ambition] (focus à l'arrivée sur l'onglet) · Étape sans objectif connu : « Aucun objectif connu pour cette étape. Ajoutez-les au fil de la partie. »

**Accessibilité.** Chaque objectif : case `aria-label` = texte de l'objectif ; progression annoncée « 2 sur 5 ». Le bandeau d'étape terminée est annoncé (`aria-live="polite"`) et ses boutons reçoivent le focus.

### 7.4 Onglet Préférences

**Objectif.** Les 10 goûts du Zoi (aime / n'aime pas), exactement comme dans le jeu.

```
 Préférences                                                     ⓘ À propos des préférences
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│ 5/10                                                                                 (Q) │
│ ┌────┐ Lessive                               ┌────┐ Livres de développement personnel    │
│ └──♥─┘                                       └──♥─┘                                      │
│ ┌────┐ Prise de photos                       ┌────┐ Nettoyage                            │
│ └──♥─┘                                       └──⊘─┘                                      │
│ ┌────┐ cuisine de rue                        ┌ ─ ┐  Aucune préférence                    │
│ └──⊘─┘                                       └ ♡ ┘                                       │
│ ┌ ─ ┐  Aucune préférence                     ┌ ─ ┐  Aucune préférence                    │
│ ┌ ─ ┐  Aucune préférence                     ┌ ─ ┐  Aucune préférence                    │
└───────────────────────────────────────────────────────────────────────────────────────────┘
```

Texte d'aide (replié) : « Les préférences, ce qu'un Zoi aime ou n'aime pas, influencent la vitesse à laquelle ses compétences progressent et les émotions ressenties pendant les interactions. Elles peuvent changer au fil de la vie. »

| Élément | Type | Source | Règles |
|---|---|---|---|
| Compteur | « n/10 » | — | |
| Emplacements | 10 *Puces de préférence* en grille 2 × 5, remplissage ligne par ligne | `zoi.preferences` × `ref:preferences` | Tri : « aime » d'abord, puis « n'aime pas », puis ordre d'ajout |
| Sentiment | Aime (cœur plein) / N'aime pas (cœur brisé) | `fixe` | |
| (Q) ou emplacement vide | ouvre le sélecteur, variante Préférences | `ref:preferences` (catégories + `details.sous_categorie`) | En tête : bascule [Aime] [N'aime pas] (défaut Aime) ; multi-sélection jusqu'à 10 ; compteur « 7/10 » dans le sélecteur ; éléments présents désactivés « Déjà ajoutée » |
| Clic sur une préférence | menu : (•) Aime ( ) N'aime pas · Remplacer… · Retirer | — | Retirer : toast [Annuler] |

**États.** 10/10 : (Q) désactivé, infobulle « 10 préférences au maximum, comme dans le jeu. Retirez-en une pour en ajouter une autre. » ; plus d'emplacement vide affiché.

**État vide.** Les 10 emplacements « Aucune préférence » (libellé du jeu) + sous le compteur : « Ajoutez ce que Marina aime ou n'aime pas. »

**Accessibilité.** Chaque puce annonce « Lessive, aime » / « Nettoyage, n'aime pas » ; le cœur n'est pas le seul indice (forme différente + texte accessible).

### 7.5 Onglet Valeur

> Aucune capture de cet onglet : structure reconstituée d'après le brief et le contrat (`valeurs.json`, `traits.details.valeurs`). À vérifier en jeu avant développement définitif.

**Objectif.** Noter les valeurs de personnalité du Zoi (0–100).

```
 Valeurs                      [ Ajouter les valeurs de départ du trait ]  [ + Ajouter une valeur ]
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│ Valeurs de départ · Adepte des mondanités                                                  │
│ (ic) Valeur A    0 ●───────────────────────○────────────── 100   [  72 ]           [×]     │
│ (ic) Valeur B    0 ●──────────○─────────────────────────── 100   [  40 ]  Opposée à C [×]   │
│ Autres valeurs                                                                             │
│ (ic) Valeur C    0 ─────────────────────────────────────── 100   [  —  ]           [×]     │
└───────────────────────────────────────────────────────────────────────────────────────────┘
```

| Élément | Type | Source | Règles |
|---|---|---|---|
| Groupes | « Valeurs de départ · {trait} » puis « Autres valeurs » | `ref:traits` › `details.valeurs` | Sans trait : un seul groupe « Valeurs » |
| Ligne | icône, nom, *Curseur 0–100* + champ numérique synchronisés | `ref:valeurs` | Score nul autorisé (« — », curseur sans poignée) : inconnu ≠ 0 |
| Opposition | puce info « Opposée à {nom} » | `details.oppose` | Affichée si la valeur opposée est aussi présente |
| Retirer | × | — | Toast [Annuler] |
| Ajouter les valeurs de départ du trait | bouton | `details.valeurs` du trait | N'ajoute que les manquantes. Désactivé sans trait : « Choisissez d'abord un trait dans Profil. » |
| Ajouter une valeur | sélecteur multiple | `ref:valeurs` | Présentes désactivées |

**État vide.** « Aucune valeur renseignée. Les valeurs de personnalité vont de 0 à 100. » [Ajouter les valeurs de départ du trait] [Ajouter une valeur].

**Erreurs.** Saisie hors 0–100 : ramenée à la borne, message « Entre 0 et 100. »

**Accessibilité.** Curseurs `role="slider"`, flèches ±1, Page haut / bas ±10, Début / Fin = 0 / 100, `aria-valuetext` « 72 sur 100 ».

### 7.6 Onglet Carrière

**Objectif.** École, emploi, affaires et freelance, dans la grille 2 × 2 du jeu.

```
┌ École ───────────────────────────────────────┐ ┌ Carrière ─────────────────────────────────────┐
│ [logo] École publique de Bliss Bay       (Q) │ │ Statut [ En poste | Sans emploi | Retraité·e ] │
│ ┌ Plus haut niveau d'études ───────────────┐ │ │ [logo] Café Lumière · Restauration · Dowon (Q) │
│ │ Diplôme obtenu                         ▾ │ │ │ ┌ Poste ─────────────────┐ ┌ Niveau ───────┐  │
│ └──────────────────────────────────────────┘ │ │ │ Niv. 3 · Chef de rang ▾│ │ [−]  3  [+]   │  │
│ ┌ Moyenne finale ──────────────────────────┐ │ │ └────────────────────────┘ └───────────────┘  │
│ │ B                                        │ │ │ ┌ Salaire ───────────────────────────────────┐ │
│ └──────────────────────────────────────────┘ │ │ │ Ɱ 1 200                                    │ │
└──────────────────────────────────────────────┘ │ └────────────────────────────────────────────┘ │
┌ Affaires ─────────────────────────────── (+) ┐ │ Horaires 9 h – 17 h · Télétravail possible      │
│ [ph] Le Petit Café · Café · Dowon       [⋯]  │ └────────────────────────────────────────────────┘
│                                              │ ┌ Freelance ─────────────────────────────────────┐
└──────────────────────────────────────────────┘ │ [ic] Activité  Illustration                (Q) │
                                                 │ ┌ Note ──────┐ ┌ Gains totaux ───────────────┐ │
                                                 │ │ 4,5        │ │ Ɱ 0                         │ │
                                                 │ └────────────┘ └─────────────────────────────┘ │
                                                 │ ┌ Licences possédées ┐ ┌ Contrats terminés ──┐ │
                                                 │ │ 0                  │ │ 0                   │ │
                                                 │ └────────────────────┘ └─────────────────────┘ │
                                                 └────────────────────────────────────────────────┘
```

Les *Tuiles d'info* grises (libellé + valeur) gardent l'aspect du jeu au repos et deviennent éditables au clic ou à Entrée.

**Carte « École ».**

| Champ | Type | Source | Règles |
|---|---|---|---|
| Établissement | sélecteur (logo = icône) ; sous-titre type + ville | `ref:ecoles` | |
| Plus haut niveau d'études | sélecteur compact, tri `details.ordre` | `ref:niveaux-etudes` | Alimente « Niveau d'études » du Profil |
| Moyenne finale | texte court 0–5 caractères, suggestions A, B, C, D, F | `fixe` (échelle à vérifier en jeu) | Saisie libre acceptée |

État vide : icône école + « Aucune école renseignée. » [Renseigner l'école].

**Carte « Carrière ».**

| Champ | Type | Source | Règles |
|---|---|---|---|
| Statut | *Contrôle segmenté* En poste · Sans emploi · Retraité·e | `fixe` | Facultatif (nul = non renseigné) |
| Carrière | sélecteur : nom, employeur, secteur, ville | `ref:carrieres` | Visible si En poste ou Retraité·e (libellé alors « Dernière carrière ») |
| Poste | combobox « Niv. n · Nom » triée par niveau + saisie libre | `details.postes` de la carrière | Choisir un poste remplit Niveau et Salaire (copie : un patch du référentiel ne modifie pas la fiche) |
| Niveau | *Stepper* entier 1–99 | — | |
| Salaire | *Champ Meow* | — | |
| Horaires, Télétravail | ligne d'info en lecture seule | `details.postes[].horaires`, `details.teletravail` | Masquée si non renseignée |

États vides : statut nul → icône mallette + « Aucune carrière renseignée. » [Ajouter une carrière] (passe à En poste et ouvre le sélecteur) ; Sans emploi → « Sans emploi » + [Ajouter une carrière].

**Carte « Affaires ».** Liste des entreprises possédées par le Zoi = `Possession` catégorie `entreprise` (mêmes données que Vie & possessions › Entreprises). Ligne : vignette 16:9, nom, type, ville, menu ⋯ (Modifier, Transférer…, Supprimer). (+) → panneau *Possession* « Entreprise » (§7.9). État vide : icône boutique + « Aucune entreprise renseignée. » [Ajouter une entreprise].

**Carte « Freelance ».**

| Champ (libellé du jeu) | Type | Source | Règles |
|---|---|---|---|
| Activité | sélecteur | `ref:freelance` | Facultatif |
| Note | décimal ≥ 0, 1 décimale | — | Échelle à vérifier en jeu |
| Gains totaux | *Champ Meow* | — | |
| Licences possédées | la tuile affiche le nombre ; clic → multi-sélection | `details.licences` de l'activité + saisie libre | |
| Contrats terminés | entier ≥ 0 | — | |

État vide : tuiles à « — » + sous-titre « Aucune activité freelance renseignée. »

**Accessibilité.** Chaque tuile éditable est un bouton tant qu'elle n'est pas en édition (`aria-label` « Moyenne finale : B. Modifier »).

### 7.7 Onglet Relations (ajout du tracker)

**Objectif.** Les liens du Zoi avec les autres Zois ; la réciprocité est automatique.

```
 Relations de Marina                [ Filtrer… ]  [ Arbre généalogique ]  [ + Ajouter un lien ]
┌ Famille (3) ──────────────────────────────────────────────────────────────────────────────┐
│ (av) Hiro Takahashi  Foyer Takahashi  [Parent]           −100 ─────────|────●─ +100   72 [⋯] │
│ (av) Thomas Clark    Foyer Clark      [Conjoint·e]       −100 ─────────|──────● +100  90 [⋯] │
│ (av) Leo Clark       Foyer Clark      [Enfant]           −100 ─────────|── ●── +100   35 [⋯] │
└───────────────────────────────────────────────────────────────────────────────────────────┘
┌ Amour (0) ─ masqué si vide ┐ ┌ Amitié et inimitié (2) ───────────────────────────────────────┐
                               │ (av) Léa Park  Sans foyer  [Ami·e]   −100 ──|──●── +100  40 [⋯] │
                               │ (av) Kai Moon  Foyer Moon  [Ennemi·e] −100 ●─|───── +100 −60 [⋯]│
                               └───────────────────────────────────────────────────────────────┘
```

| Élément | Type | Source | Règles |
|---|---|---|---|
| Groupes | Famille · Amour · Amitié et inimitié · Autres | `ref:relations` › `details.type` (familial, amoureux + statut, amical, autre) | Un Zoi n'apparaît qu'une fois : dans le groupe de son premier lien selon l'ordre ci-contre. Groupes vides masqués |
| Ligne | *Ligne de relation* : avatar sm, nom (lien vers sa fiche), foyer, *Puces* des liens, *Jauge de relation*, menu ⋯ | `Relation` | Les puces affichent le **rôle de l'autre Zoi pour Marina** (Hiro est **Parent** de Marina) |
| Tri | prénom A→Z dans chaque groupe | — | |
| Filtrer | texte | — | |
| Menu ⋯ | Modifier · Ouvrir la fiche de Hiro · Supprimer la relation | — | Supprimer : toast « Relation entre Marina et Hiro supprimée. » [Annuler] |

Panneau « Relation · Marina ⇄ Hiro » (clic sur une ligne) : liens (puces + « Ajouter un lien »), Niveau (*Jauge de relation* éditable : curseur −100 → +100 + champ, nul autorisé), Depuis (date en jeu, texte 0–60), Notes (0–2000), [Supprimer la relation].

**Panneau « Nouveau lien »** (P4).

| Champ | Type | Source | Règles |
|---|---|---|---|
| Zoi | *Sélecteur de Zoi* (tous sauf Marina) + « Créer le Zoi « … » » | `Zoi` | Requis. Création rapide : prénom seul, foyer de Marina |
| « {Zoi} est … de Marina » | sélecteur groupé par type | `ref:relations` | Requis. Phrase lue de gauche à droite |
| Aperçu | texte | `details.inverse` | « Sur la fiche de Leo, Marina apparaîtra comme : Parent. » |
| Suggestions | cases décochées par défaut | `details.role_arbre` | Lien Enfant : « Ajouter aussi {conjoint·e de Marina} comme parent de Leo » ; « Ajouter Leo comme frère / sœur de {autres enfants de Marina} ». Lien Parent : « Ajouter aussi Hiro comme parent de {frères et sœurs de Marina} » |
| Niveau | *Jauge de relation* éditable | — | Facultatif |
| Notes | texte 0–2000 | — | Facultatif |
| Boutons | [Annuler] [Ajouter le lien] (Ctrl/Cmd+Entrée) | — | |

Si une relation existe déjà avec ce Zoi : « Marina et Leo sont déjà liés (Ami·e). Ce lien s'y ajoutera. » Règles de remplacement et erreurs : `architecture.md` P4.

**État vide.** « Aucun lien pour l'instant. Ajoutez la famille, les amis, les amours… de Marina : chaque lien apparaît aussi sur la fiche de l'autre Zoi. » [Ajouter un lien]. S'il n'existe aucun autre Zoi, le sélecteur propose directement « Créer le Zoi « … » ».

**Accessibilité.** La jauge annonce « Niveau de relation : plus 72, sur une échelle de moins 100 à plus 100 ». Le signe est toujours affiché en texte (« +72 », « −60 »).

### 7.8 Onglet Futur (ajout du tracker)

**Objectif.** Ce que la joueuse prévoit pour ce Zoi : objectifs, idées d'histoire, échéances.

```
 Futur et projets
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│ [ Nouveau projet pour Marina…                          ] [ Objectif ▾ ]         [Ajouter] │
│ [Tous] [Objectifs] [Idées d'histoire] [Échéances]                          [ Filtrer… ]   │
│ En cours (2)                                                                               │
│ (◐) Ouvrir un café avec Leo          Objectif          Avant Âge mûr      (av)(av)   [⋯]   │
│ (◐) Demande en mariage sur la plage  Idée d'histoire   Après le Jour 50   (av)       [⋯]   │
│ À faire (3)                                                                                │
│ (○) …                                                                                      │
│ ▸ Fait (5)                                                                                 │
├───────────────────────────────────────────────────────────────────────────────────────────┤
│ ▸ Projets d'autres Zois qui concernent Marina (1)                                          │
└───────────────────────────────────────────────────────────────────────────────────────────┘
```

| Champ | Type | Source | Règles |
|---|---|---|---|
| Titre | texte 1–120 | — | Requis |
| Type | Objectif · Idée d'histoire · Échéance | `fixe` (propre à l'app) | Défaut = dernier type utilisé |
| Statut | À faire · En cours · Fait | `fixe` | Bouton rond cyclique (○ → ◐ → ●) ; menu pour un choix direct |
| Échéance | texte 0–60 (date en jeu libre) | — | Placeholder « ex. Avant Âge mûr, Jour 50 » |
| Description | texte multiligne 0–2000 | — | |
| Zois concernés | multi *Sélecteur de Zoi* | `Zoi` | Le projet est aussi listé, en lecture, dans la section « Projets d'autres Zois qui concernent… » de leur onglet Futur |

Ajout rapide : titre + type + Entrée → statut « À faire ». Clic sur une ligne → dépliage en édition (description, échéance, Zois, type). Groupe « Fait » replié par défaut, date de fin enregistrée automatiquement.

**État vide.** « Rien de prévu pour l'instant. Notez un objectif, une idée d'histoire ou une échéance pour Marina. » · Filtre sans résultat : « Aucun projet de ce type. »

**Erreurs.** Titre vide : « Donnez un titre au projet. »

**Accessibilité.** Bouton de statut : `aria-label` « Statut : À faire. Changer le statut » ; Espace fait avancer le statut, l'annonce du nouveau statut passe par `aria-live`.

### 7.9 Onglet Vie & possessions (ajout du tracker)

**Objectif.** Où vit le Zoi et ce qu'il possède.

```
┌ Ville et logement ─────────────────── [Hérité du foyer Clark] ┐ ┌ Véhicules (1) ────────── (+) ┐
│ [ photo de la maison 16:9                                ]    │ │ [ph] Scooter rose · Scooter   │
│ Ville      Bliss Bay                                          │ │      Ɱ 3 000             [⋯]  │
│ Quartier   Quartier des Pins                                  │ └───────────────────────────────┘
│ Adresse    12, allée des Pins                                 │ ┌ Animaux (0) ───────────── (+) ┐
│ [ Modifier le logement du foyer ]  [ Personnaliser pour ce Zoi ] │ │ Aucun animal.                 │
└───────────────────────────────────────────────────────────────┘ └───────────────────────────────┘
┌ Entreprises (1) ──────────────────────────────────────────────────────────────────── (+) ┐
│ [ph] Le Petit Café · Café · Dowon                                                     [⋯] │
└──────────────────────────────────────────────────────────────────────────────────────────┘
┌ Possessions du foyer Clark ─────────────────────────────────────────── Ouvrir le foyer › ┐
│ Animaux : (ph) Mochi · Chat          Véhicules : —                                       │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

**Carte « Ville et logement ».**

| Mode | Contenu | Actions |
|---|---|---|
| Hérité (défaut si le Zoi a un foyer) | ville, quartier, adresse et photo du foyer en lecture seule, badge « Hérité du foyer Clark » | [Modifier le logement du foyer] (→ page du foyer) · [Personnaliser pour ce Zoi] (copie les valeurs du foyer et passe en mode propre) |
| Propre au Zoi (ou Zoi sans foyer) | Ville `ref:villes` · Quartier (combobox `details.quartiers` + libre) · Adresse (texte 0–120) · Photo 16:9 ; badge « Propre à Marina » | [Revenir au logement du foyer] (toast [Annuler]) |

**Cartes « Véhicules », « Entreprises », « Animaux ».** Lignes : vignette, nom, sous-titre, menu ⋯ (Modifier · Transférer à un autre Zoi ou au foyer… · Supprimer, toast [Annuler]). (+) ouvre le *Panneau latéral* « Possession » :

| Catégorie | Champs | Source |
|---|---|---|
| Véhicule | Modèle (requis) `ref:vehicules` (type et prix affichés) · Surnom (texte 0–60) · Photo 16:9 · Notes | `ref:vehicules` |
| Entreprise | Nom de l'entreprise (requis, 1–80) · Type `ref:entreprises` · Ville `ref:villes` · Adresse (texte) · Photo 16:9 · Notes | `ref:entreprises`, `ref:villes` |
| Animal | Nom (requis, 1–40) · Espèce `ref:animaux` · Photo 1:1 · Notes | `ref:animaux` |

**Carte « Possessions du foyer {nom} ».** Lecture seule, masquée si le Zoi n'a pas de foyer ou si le foyer ne possède rien.

**États vides.** « Aucun véhicule. » [Ajouter un véhicule] · « Aucune entreprise. » [Ajouter une entreprise] · « Aucun animal. » [Ajouter un animal].

**Erreurs.** Champ requis vide dans le panneau : bouton « Ajouter » désactivé + message sous le champ (« Choisissez un modèle. », « Donnez un nom à l'entreprise. », « Donnez un nom à l'animal. »).

---

## 8. Relations (vue globale) `#/relations`

**Objectif.** Voir tous les liens entre Zois et en créer sans passer par une fiche.

```
 Relations                                    [ Arbre généalogique… ]  [ + Nouveau lien ]
 [ Filtrer… ] [ Foyer ▾ ] [ Type : Tous ▾ ] [ Zoi ▾ ]
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ Zoi                    est … de          Zoi                   Niveau            │      │
│ (av) Hiro Takahashi    [Parent]          (av) Marina Takahashi   ────|──●──  +72 │ [⋯]  │
│ (av) Marina Takahashi  [Conjoint·e]      (av) Thomas Clark       ────|────● +90 │ [⋯]  │
│ (av) Léa Park          [Ami·e]           (av) Marina Takahashi   ────|─●───  +40 │ [⋯]  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

| Colonne / contrôle | Contenu | Règles |
|---|---|---|
| Zoi · est … de · Zoi | une ligne par relation, liens vus depuis le Zoi de gauche | La phrase se lit « Hiro est Parent de Marina » |
| Niveau | *Jauge de relation* mini + valeur signée | « — » si nul |
| Filtres | texte, Foyer, Type (Famille, Amour, Amitié et inimitié, Autres), Zoi | Le filtre Zoi réoriente les lignes pour que ce Zoi soit à droite |
| Nouveau lien | panneau « Nouveau lien » variante 2 Zois : « [Zoi ▾] est [lien ▾] de [Zoi ▾] » | Mêmes règles que §7.7 |
| Arbre généalogique… | *Sélecteur de Zoi* puis surcouche §7.1.b | |

**États vides.** Moins de 2 Zois : « Ajoutez au moins deux Zois pour créer un lien. » [Ajouter un Zoi] · Aucun lien : « Aucun lien entre vos Zois pour l'instant. Créez-en un ici ou depuis l'onglet Relations d'une fiche. » [Nouveau lien] · Filtres sans résultat : « Aucune relation ne correspond à ces filtres. » [Réinitialiser les filtres].

**Accessibilité.** Tableau HTML (`table`) avec en-têtes ; tri au clic sur l'en-tête (`aria-sort`).

---

## 9. Référentiels `#/referentiels/:referentiel`

**Objectif.** Consulter et compléter les listes du jeu (le jeu change à chaque patch).

```
 Référentiels
 Les listes du jeu évoluent à chaque mise à jour d'inZOI. Complétez-les ici : vos ajouts apparaissent aussitôt dans les sélecteurs.
┌ Listes ───────────────────┐ ┌ Traits de caractère ─────────────────────── v0.8+ · maj 2026-10-23 ┐
│ IDENTITÉ ET PERSONNALITÉ  │ │ ▸ Notes et sources                                                  │
│  Étapes de vie        8   │ │ [ Filtrer… Ctrl F ] [ Catégorie ▾ ] (Non vérifiés) (Ajoutés par vous) (Masqués) │
│ ▸Traits              18   │ │                                                 [ + Ajouter un élément ] │
│  Caractéristiques     …   │ │ Icône  Nom                     Nom anglais   Catégorie   Statut      Utilisé │
│  Valeurs              …   │ │ (ic)   Adepte des mondanités   Socialite     Social                 3 Zois  │
│  Désirs               …   │ │ (ic)   …                       …             …           Non vérifié  —      │
│  Émotions             …   │ │ (ic)   Reine du karaoké        —             Social      Ajouté par vous 1  │
│ VIE ET AMBITIONS          │ └─────────────────────────────────────────────────────────────────────┘
│  Vies désirées, Ambitions,│
│  Jalons, Préférences,     │
│  Compétences              │
│ ÉTUDES ET TRAVAIL         │
│  Écoles, Niveaux d'études,│
│  Carrières, Freelance,    │
│  Entreprises              │
│ MONDE                     │
│  Villes, Véhicules,       │
│  Animaux                  │
│ RELATIONS                 │
│  Types de relations       │
└───────────────────────────┘
```

**Colonne « Listes ».** 20 référentiels du contrat, groupés comme ci-dessus, avec le nombre d'éléments visibles. Libellé = `titre` du fichier. Sans paramètre de route, le premier est sélectionné.

**En-tête de liste.** `titre`, `version_jeu`, `maj` ; accordéon « Notes et sources » (`notes`, `sources` : liens ouverts dans le navigateur par défaut, seule sortie réseau, à l'initiative de la joueuse).

**Tableau.** Icône · Nom · Nom anglais · Catégorie · Statut (badges *Non vérifié* si `fr_verifie = false`, *Ajouté par vous*, *Modifié*, *Masqué*) · Utilisé par (n Zois, cliquable → liste des Zois concernés). Clic / Entrée sur une ligne → *Panneau latéral* « Élément ».

**Panneau « Élément ».**

| Champ | Type | Règles |
|---|---|---|
| Identifiant | texte en lecture seule | Généré à la création depuis le nom (slug sans accents, suffixe `-2` en cas de doublon) ; jamais modifiable ensuite |
| Nom | texte 1–80, requis | Libellé FR tel qu'affiché dans le jeu |
| Nom anglais | texte 0–80 | |
| Catégorie | sélecteur parmi `categories` du fichier + « Nouvelle catégorie… » | Masqué si le fichier n'a pas de catégories |
| Description | texte multiligne 0–1000 | |
| Icône | 1 emoji | Repli quand il n'y a pas d'image |
| Image | *Emplacement photo* (ratio selon la liste : 3:4 traits et Vies désirées, 16:10 jalons, 1:1 sinon) | Capture de la joueuse, prioritaire sur l'icône partout dans l'app |
| Libellé FR vérifié | case | Correspond à `fr_verifie` |
| Source | texte 0–300 | URL ou « En jeu » |
| Détails | formulaire propre à la liste (tableau ci-dessous) | |

| Liste | Formulaire « Détails » |
|---|---|
| Étapes de vie | Ordre (entier, requis, unique) · Durée en jours · Peut travailler (case) · Va à l'école (case) |
| Traits | Valeurs de départ (multi `ref:valeurs`, avertissement si ≠ 4) · Caractéristiques (multi `ref:caracteristiques`) |
| Valeurs | Valeur opposée (`ref:valeurs` ; la réciproque est posée automatiquement) |
| Vies désirées | Ambition liée (`ref:ambitions`) · Valeurs, Compétences, Préférences (multi) |
| Ambitions | Éditeur d'étapes : Étape 1…n, chaque étape = liste d'objectifs (texte + cible, défaut 1) · Récompenses (liste de textes) |
| Jalons | Étape de vie (`ref:etapes-de-vie`) |
| Préférences | Sous-catégorie (texte avec suggestions des valeurs existantes) |
| Compétences | Niveau max (entier) |
| Carrières | Ville (`ref:villes`) · Employeur · Secteur · Postes (tableau éditable : Niveau, Nom, Salaire, Horaires) · Télétravail (case) |
| Écoles | Type (Primaire · Collège-lycée · Université) · Ville (`ref:villes`) |
| Niveaux d'études | Ordre (entier) |
| Freelance | Licences (liste de textes) |
| Entreprises | Type (texte) |
| Villes | Quartiers (liste de textes) · DLC (texte) |
| Véhicules | Type (texte, suggestions : voiture, moto, vélo…) · Prix (*Champ Meow*) |
| Types de relations | Type (Familial · Amical · Amoureux · Statut) · Lien réciproque (`ref:relations`, vide = identique) · Rôle dans l'arbre (Parent · Enfant · Conjoint·e · Ex-conjoint·e · Fratrie · Aucun) |
| Animaux | Espèce (texte) |
| Caractéristiques, Désirs, Émotions | Pas de détails (Émotions : la catégorie `positive` / `negative` / `neutre` sert à la tonalité des souvenirs) |

**Actions.** Ajouter un élément · Masquer / Afficher (un élément masqué n'est plus proposé dans les sélecteurs mais reste affiché sur les fiches qui l'utilisent) · Rétablir l'original (éléments du seed modifiés : *Modale de confirmation* « Rétablir « … » tel que fourni avec l'app ? Vos modifications seront perdues. ») · Supprimer.

Suppression :
- élément utilisé → bouton désactivé + « Utilisé par 3 Zois. Masquez-le plutôt : il restera sur ces fiches mais ne sera plus proposé. » ;
- non utilisé → « Supprimer « {nom} » de la liste {titre} ? » [Annuler] [Supprimer], toast [Annuler].

**États vides.** Liste vide : « Cette liste est vide. Ajoutez les éléments au fur et à mesure que vous les croisez en jeu. » [Ajouter un élément] · Filtre sans résultat : « Aucun élément ne correspond à « {saisie} ». » [Ajouter « {saisie} »].

**Erreurs.** Fichier de seed illisible : « Impossible de charger la liste {titre}. Les fiches gardent leurs valeurs. » [Réessayer] · Nom vide : « Le nom est obligatoire. » · Ordre en double (étapes de vie) : « Cet ordre est déjà utilisé par « Adulte ». »

---

## 10. Réglages `#/reglages`

**Objectif.** Sauvegarder, restaurer, régler l'affichage, retrouver les raccourcis et les crédits.

| Section | Contenu | Micro-textes |
|---|---|---|
| Sauvegarde | [Exporter mes données…] (boîte native, nom par défaut `inzoi-tracker-AAAA-MM-JJ`) · [Importer une sauvegarde…] · Dossier des données (chemin + [Ouvrir le dossier]) · Copies de sécurité automatiques (5 dernières, date + [Restaurer]) | Import : *Modale de confirmation* « Remplacer vos données ? » / « Cette sauvegarde remplacera toutes vos données actuelles (12 Zois, 3 foyers). Une copie de sécurité est faite juste avant. » [Annuler] [Remplacer mes données] |
| Affichage | Barre latérale : Automatique · Toujours déployée · Toujours réduite ; Zoom : 90 % · 100 % · 110 % · 125 % | |
| Raccourcis clavier | Tableau de `architecture.md` §6 (même contenu que F1) | |
| À propos | Version, crédits (`assets/CREDITS.md`), mentions | « Projet personnel, non affilié à Krafton. Les visuels du jeu sont utilisés à titre personnel. » |

**Erreurs.** Export : « L'export a échoué : {raison}. » · Fichier non reconnu : « Ce fichier n'est pas une sauvegarde inZOI Tracker. » · Version plus récente : « Cette sauvegarde vient d'une version plus récente de l'app. Mettez l'app à jour pour l'importer. » · Image manquante dans l'archive : import réussi, toast « 3 images n'ont pas été retrouvées. »

---

## 11. Surcouches globales

### 11.1 Recherche globale (Ctrl/Cmd+K)

```
┌──────────────────────────────────────────────────────────────┐
│ [ic] [ mar                                              ]  Échap │
│ ZOIS                                                         │
│ ▸ (av) Marina Takahashi   Foyer Clark · Jeune adulte   Tab ⇥ │
│   (av) Mara Lee           Sans foyer · Ado                   │
│ FOYERS                                                       │
│   [ba] Foyer Martin       Dowon · 3 Zois                     │
│ ACTIONS                                                      │
│   + Créer le Zoi « mar »                                     │
│   + Nouveau foyer                                            │
└──────────────────────────────────────────────────────────────┘
```

| Règle | Détail |
|---|---|
| Taille | 640 px de large, en haut au tiers de la fenêtre |
| Champ vide | « Récemment consultés » (6 Zois / foyers) + actions (Nouveau Zoi, Nouveau foyer, Référentiels) |
| Recherche | Insensible aux accents et à la casse ; préfixe et sous-chaîne sur prénom, nom, famille, foyer ; groupes Zois (8 max), Foyers (4), Familles (4), Actions |
| Clavier | ↑ / ↓ parcourent tous les groupes ; Entrée ouvre ; **Tab sur un Zoi** affiche ses actions rapides : Ouvrir la fiche · Noter un souvenir · Ajouter un projet · Ajouter un lien ; Maj+Tab revient |
| « Noter un souvenir » | Remplace la palette par un mini-formulaire « Souvenir pour Marina » (champ texte focalisé, émotion, Zoi lié) ; Entrée enregistre, ferme, toast « Souvenir ajouté à Marina. » ; la joueuse reste sur son écran |
| Sans résultat | « Aucun résultat pour « {saisie} ». » + « Créer le Zoi « {saisie} » » |

**Accessibilité.** `role="combobox"` + `listbox`, `aria-activedescendant` ; chaque option annonce son groupe.

### 11.2 Modale « Nouveau foyer »

| Champ | Type | Règles |
|---|---|---|
| Nom du foyer | texte 1–60, focus initial | Requis : « Donnez un nom au foyer. » |
| Famille | case « Créer aussi la famille « {nom} » » (cochée) ; si une famille de ce nom existe : « Rattacher à la famille {nom} » (cochée) ; lien « Choisir une autre famille… » | |
| Ville | sélecteur `ref:villes` | Facultatif |
| Bannière | *Emplacement photo* 4:1 | Facultatif, Ctrl/Cmd+V |
| Boutons | [Annuler] [Créer le foyer] (Entrée) | Après création : page du foyer, focus sur « Ajouter un Zoi » |

### 11.3 Modale « Nouvelle famille »

Nom (1–60, requis) · Emblème (photo 1:1, facultatif) · Notes. [Annuler] [Créer la famille].

### 11.4 Modale « Nouveau Zoi »

| Champ | Type | Règles |
|---|---|---|
| Portrait | *Emplacement photo* 1:1 | Facultatif, Ctrl/Cmd+V |
| Prénom | texte 1–40, focus initial | Requis : « Le prénom est obligatoire. » |
| Nom | texte 0–40 | Pré-rempli avec le nom de la famille |
| Famille | sélecteur de famille | Pré-rempli selon le contexte |
| Foyer | sélecteur de foyer + « Sans foyer » | Pré-rempli selon le contexte |
| Tranche d'âge | *Curseur d'étape de vie* | Facultatif |
| Ajouter un autre Zoi ensuite | case, mémorisée | |
| Boutons | [Annuler] [Créer le Zoi] (Entrée) | Ouvre la fiche sur Profil, ou réinitialise la modale si la case est cochée |

### 11.5 Modale « Changer de foyer »

Sélecteur de foyer + « Sans foyer » ; case « Garder son logement actuel comme logement propre » (visible si le logement était hérité). [Annuler] [Déplacer]. Toast « Marina a rejoint le foyer Park. » [Annuler]. Le Zoi est placé en dernier dans l'ordre du nouveau foyer.

### 11.6 Aide des raccourcis (F1)

Modale en lecture seule reprenant `architecture.md` §6, groupée par contexte (Partout · Fiche Zoi · Listes · Formulaires). Touches rendues selon l'OS (Ctrl / ⌘, Alt / ⌥).
