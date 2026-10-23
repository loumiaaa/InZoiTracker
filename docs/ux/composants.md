# Composants — inZOI Tracker V1

> Livrable UX · v1.0 · 2026-10-23
> Comportement, variantes, états et accessibilité. Le **style** (couleurs, typo, rayons, ombres) vient des tokens du directeur artistique ; ce document ne fixe aucune couleur.
> Les observations sur les captures du jeu sont données pour guider le DA, pas comme valeurs.

## 0. Tokens consommés

`docs/direction-artistique.md` et `src/styles/tokens.css` n'existent pas encore. Voici les **rôles** dont les composants ont besoin. Les noms sont une proposition : si le DA nomme autrement, le DA fait foi et ce tableau sera mis à jour.

| Rôle (nom proposé) | Utilisé par | Observation dans le jeu |
|---|---|---|
| `--color-bg-app` | fond de fenêtre | fond clair flouté |
| `--color-surface-panel` | *Carte panneau* | panneaux gris clair translucides (verre dépoli) |
| `--color-surface-tile` | *Tuile d'info*, emplacements vides | tuiles grises plus soutenues dans les panneaux |
| `--color-surface-raised` | modales, popovers, menus, palette | blanc |
| `--color-overlay` | voile derrière modales et panneaux | — |
| `--color-text`, `--color-text-muted`, `--color-text-on-accent`, `--color-text-on-image` | partout | titres gris anthracite, libellés gris moyen |
| `--color-accent`, `--color-accent-soft` | onglet actif, boutons icône ronds, jauges, sélection | bleu ciel (onglet actif, loupe, jauges) |
| `--color-focus-ring` | anneau de focus | — |
| `--color-like` | cœur « aime » | cœur orangé |
| `--color-dislike` | cœur brisé « n'aime pas » | cœur brisé sombre |
| `--color-positive`, `--color-positive-soft` | souvenir positif, jauge de relation > 0 | fond vert pâle |
| `--color-negative`, `--color-negative-soft` | souvenir négatif, jauge de relation < 0 | fond rose / rouge pâle |
| `--color-danger`, `--color-warning`, `--color-success` | suppression, avertissements, confirmations | — |
| `--color-avatar-1` … `--color-avatar-6` | fonds d'initiales | — |
| `--gradient-image-scrim` | voile de lisibilité sous les titres sur image | dégradé sombre en bas des tuiles de jalon |
| `--radius-pill`, `--radius-card`, `--radius-tile`, `--radius-control` | pastilles, cartes, tuiles, champs | coins très arrondis |
| `--shadow-card`, `--shadow-popover` | cartes, surcouches | ombres très douces |
| `--space-*`, `--font-*`, `--duration-*`, `--easing-*` | partout | — |

Contrastes à garantir par le DA : texte ≥ 4,5:1 (y compris `--color-text-on-accent` sur `--color-accent` et `--color-text-on-image` sur `--gradient-image-scrim`), icônes porteuses de sens et contours de champs ≥ 3:1.

## 1. États communs

Sauf mention contraire, tout composant interactif gère :

| État | Règle |
|---|---|
| Repos | — |
| Survol | changement de surface léger ; curseur main sur les éléments cliquables non textuels |
| Focus clavier | anneau `--color-focus-ring` 2 px, décalé de 2 px, visible uniquement au clavier (`:focus-visible`) |
| Actif / pressé | enfoncement ≤ 1 px ou assombrissement ; pas de mouvement si `prefers-reduced-motion` |
| Désactivé | opacité réduite + `aria-disabled` ; reste focalisable s'il a une infobulle qui explique pourquoi |
| Chargement | squelette aux dimensions finales (jamais de saut de mise en page) |
| Erreur | contour `--color-danger` + message texte sous l'élément, relié par `aria-describedby` |

---

## 2. Avatar

**Usage.** Portrait d'un Zoi partout : rangée de la fiche, cartes, lignes, puces, arbre.

**Anatomie.** Cercle image (portrait recadré au point focal) ; anneau ; pastille optionnelle en bas à droite ou en haut à droite.

| Variante | Taille | Où |
|---|---|---|
| `xs` | 24 px | puces, lignes d'accueil |
| `sm` | 32 px | lignes de relation, souvenirs |
| `md` | 48 px | cartes Zoi compactes, arbre |
| `lg` | 64 px | rangée d'avatars de la fiche (comme le jeu), Reprendre |
| `xl` | 120 px | portrait de la carte « Informations de base » (c'est alors un *Emplacement photo*) |
| `ajout` | 64 px | bouton « + » blanc de la rangée (comme le jeu) |
| `pile` | sm / xs superposés de −8 px, « +n » au-delà de 4 | cartes foyer et famille |

| État | Rendu |
|---|---|
| Repos | anneau neutre fin |
| Sélectionné | anneau `--color-accent` épais + pastille coche en haut à droite (comme le jeu) |
| Survol / focus | anneau renforcé / anneau de focus |
| Sans photo | initiales (prénom + nom, 2 lettres max) sur `--color-avatar-n`, n = hash de l'`id` modulo 6 (stable) |
| Image introuvable sur disque | même rendu que « Sans photo » + petite icône d'alerte dans les vues d'édition |

**Accessibilité.** Image décorative (`alt=""`) quand le nom est affiché à côté ; sinon `alt` = « Prénom Nom ». Variante `ajout` : `aria-label` obligatoire.

**Props.** `zoi: {id, prenom, nom, portrait}`, `taille`, `selectionne?`, `pastille?: 'coche'`, `onClick?`.

---

## 3. Pastille d'onglet

**Usage.** Onglets de la fiche Zoi (et contrôle « Foyers | Familles »).

**Anatomie.** Pilule (`--radius-pill`), libellé centré ; point de notification optionnel en haut à droite.

| Variante | Détail |
|---|---|
| Texte | cas général |
| Séparateur | trait vertical non focalisable entre « Carrière » et « Relations » |
| Avec point | point `--color-accent` en haut à droite (le jeu l'utilise sur « Souvenirs ») — **non utilisé en V1**, réservé |

| État | Rendu |
|---|---|
| Repos | surface claire, texte atténué |
| Survol | surface un peu plus soutenue |
| Actif | fond `--color-accent`, texte `--color-text-on-accent` (comme le jeu) |
| Focus | anneau de focus |

**Barre d'onglets.** Défilement horizontal si les pastilles dépassent ; flèches ‹ › aux extrémités et fondu de bord ; l'onglet actif est toujours ramené dans la zone visible.

**Accessibilité.** `role="tablist"` / `role="tab"` / `aria-selected` / `aria-controls`. Activation manuelle (flèches = focus, Entrée / Espace = activer). Infobulle avec le raccourci « Alt+3 » (« ⌥3 » sur macOS).

---

## 4. Carte panneau et Tuile d'info

**Usage.** Conteneur de toutes les sections de la fiche (« Informations de base », « Vie désirée », « École »…), calqué sur les panneaux du jeu.

**Anatomie.**
```
┌ Titre (i)                         [badge n] (bouton icône) [lien « Tout voir »] ┐
│ Corps                                                                          │
└────────────────────────────────────────────────────────────────────────────────┘
```
- Titre `h2` à gauche ; ⓘ = *Infobulle* d'aide (comme le jeu).
- À droite : *Bouton icône rond* (loupe = choisir / changer ; + = ajouter ; flèche sortante = tout voir), avec pastille de compteur optionnelle (le jeu affiche 6 sur la loupe des Jalons).

| Variante | Détail |
|---|---|
| Standard | corps libre |
| Média | vignette 3:4 à gauche + contenu à droite (Vie désirée, Trait) |
| Grille de tuiles | corps composé de *Tuiles d'info* (Carrière) |
| Pleine largeur | occupe les 2 colonnes (Informations de base, Jalons, Souvenirs récents) |

| État | Rendu |
|---|---|
| Rempli | — |
| Vide | *État vide* centré (icône, texte, bouton) — voir §28 |
| Chargement | squelette du corps |
| Erreur | message dans le corps + [Réessayer] |

**Tuile d'info.** Bloc `--color-surface-tile`, libellé atténué en haut, valeur en dessous (« Plus haut niveau d'études / Diplôme obtenu »). Variante éditable : au repos, c'est un bouton ; clic ou Entrée → le contrôle d'édition prend la place de la valeur (champ, sélecteur…) ; Entrée valide, Échap annule, sortie du champ = enregistrement.

**Accessibilité.** `section` + `aria-labelledby` vers le titre. Le bouton icône a un `aria-label` explicite (« Changer la Vie désirée »).

---

## 5. Boutons

| Variante | Usage |
|---|---|
| Primaire | une seule action principale par vue / modale (« Créer le foyer ») |
| Secondaire | actions alternatives (« Importer une sauvegarde ») |
| Tertiaire / lien | « Modifier › », « Tout voir (8) », « Afficher plus » |
| Danger | suppression définitive, uniquement dans une *Modale de confirmation* |
| Pilule blanche à icône | « Arbre généalogique » (repris du jeu) |
| Bouton icône rond | loupe, +, flèche sortante, ⋯ ; 36 px, fond `--color-accent-soft` (comme le jeu) ; infobulle + `aria-label` obligatoires |
| Bouton fractionné | « Ajouter un Zoi ▾ » (Nouveau Zoi / Ajouter un Zoi existant…) |

Libellés : verbe à l'infinitif + objet (« Ajouter un lien », jamais « OK »). États : communs (§1) + « En cours » (libellé conservé, indicateur à gauche, bouton désactivé) pour les opérations longues (import, export).

---

## 6. Sélecteur de référentiel avec recherche

**Usage.** Tout champ dont la valeur vient d'un fichier `data/referentiels/*.json`. Composant central du tracker.

**Anatomie (variante liste).**
```
┌ Traits de caractère ─────────────────────────────────────────── [×] ┐
│ [ic] [ Rechercher un trait…                                     ]   │
│ (Tous) (Social) (Créatif) (…)                       ← catégories    │
│ ┌──────────────────────────────────────────────────────────────┐    │
│ │ (ic) Adepte des mondanités            Social         ✓ actuel │    │
│ │ (ic) …                                …                       │    │
│ │ (ic) Reine du karaoké                 Social   Ajouté par vous│    │
│ │ (ic) …                                …        Non vérifié    │    │
│ └──────────────────────────────────────────────────────────────┘    │
│ + Ajouter « adepte du » à la liste Traits de caractère              │
│ ─────────────────────────────────────────────────────────────────── │
│ Retirer le trait actuel                                             │
└─────────────────────────────────────────────────────────────────────┘
```

| Variante | Présentation | Utilisée pour |
|---|---|---|
| `combobox` | champ + liste déroulante sous le champ (8 lignes visibles) | poste, quartier, niveau d'études, moyenne, ville, activité freelance, type de relation, émotion |
| `liste` | popover 480 × 560 px max, lignes icône + nom + catégorie | caractéristiques, désirs, compétences, valeurs, jalons, véhicules, animaux, entreprises, écoles, carrières, ambitions |
| `grande-grille` | modale 880 × 640 px, cartes 3:4 avec image et nom | Vie désirée, trait |
| `preferences` | `liste` en grille de tuiles icône + bascule [Aime] [N'aime pas] en tête + compteur « n/10 » | préférences |

| Mode | Règles |
|---|---|
| Simple | Entrée / clic sélectionne et ferme. Pied : « Retirer {élément} » si une valeur est posée |
| Multiple | cases à cocher, compteur, bouton [Valider] (Ctrl/Cmd+Entrée) ; maximum optionnel (préférences : 10) |

**Recherche.** Insensible aux accents et à la casse ; porte sur `nom`, `nom_en`, nom de catégorie et `details.sous_categorie` ; résultats commençant par la saisie en premier. Filtre par catégorie via puces (si le fichier a des `categories`), sinon pas de puces. Les éléments `masque = true` sont exclus, sauf la valeur actuelle.

**Saisie libre.** Si aucun résultat n'a exactement le nom saisi, dernière ligne : « + Ajouter « {saisie} » à la liste {titre} ». Entrée sur cette ligne → mini-formulaire en place :
- Nom (pré-rempli, requis) ;
- Catégorie (si le fichier en a ; présélection = puce de catégorie active) ;
- Icône (emoji, facultatif) ;
- [Annuler] [Ajouter et sélectionner].
L'élément est créé avec `origine: "joueuse"` (voir `modele-donnees.md` §8) et sélectionné. Il est complétable plus tard dans Référentiels.

**Élément d'une ligne.** *Vignette de référentiel* (24 px en liste, 3:4 en grande grille) + nom + catégorie atténuée + badges (« Actuel », « Déjà ajouté » désactivé, « Ajouté par vous », « Non vérifié »).

| État | Rendu / micro-texte |
|---|---|
| Ouvert, recherche vide | tous les éléments, triés par catégorie puis nom (étapes de vie, niveaux d'études : par `details.ordre`) |
| Aucun résultat | « Aucun résultat pour « {saisie} ». » + ligne « Ajouter » |
| Liste vide | « Cette liste est vide. » + ligne « Ajouter » (saisie requise) |
| Erreur de chargement | « Impossible de charger la liste {titre}. Vous pouvez saisir une valeur. » + ligne « Ajouter » |
| Élément désactivé | grisé, badge « Déjà ajouté(e) », non sélectionnable |

**Clavier.** Focus initial dans la recherche ; ↑ / ↓ (← / → en grille) ; Entrée sélectionne ; Espace coche (mode multiple) ; Échap ferme sans changer la valeur ; Tab sort vers les puces de catégorie puis le pied.

**Accessibilité.** `role="combobox"` + `role="listbox"` (`aria-multiselectable` en mode multiple), `aria-activedescendant`, nombre de résultats annoncé (`aria-live="polite"` : « 12 résultats »).

**Props.** `referentiel: string`, `valeur: RefId | RefId[] | null`, `mode: 'simple' | 'multiple'`, `variante`, `max?`, `desactives?: RefId[]`, `filtre?: (el) => boolean` (ex. jalons d'une étape), `onChange`, `autoriserAjout = true`.

---

## 7. Sélecteur de Zoi / de famille / de foyer

Même comportement que le *Sélecteur de référentiel* (`combobox` ou `liste`), avec pour source les données de la joueuse :

| Sélecteur | Ligne | Saisie libre |
|---|---|---|
| Zoi | *Avatar* sm + « Prénom Nom » + foyer atténué | « Créer le Zoi « {saisie} » » : crée un Zoi (prénom = saisie, foyer = contexte ou « Sans foyer ») et le sélectionne |
| Famille | emblème + nom + nombre de Zois | « Créer la famille « {saisie} » » |
| Foyer | bannière miniature + nom + ville | — (création via la modale dédiée) ; option fixe « Sans foyer » |

Recherche sur prénom, nom, famille, foyer. Le Zoi courant est exclu quand c'est pertinent (relations).

---

## 8. Vignette de référentiel

**Usage.** Visuel d'un élément de référentiel (Vie désirée, trait, ambition, compétence, préférence, jalon…).

**Ordre de priorité de l'image (règle unique pour toute l'app) :**
1. image de la joueuse sur l'élément (`image`, ajoutée dans Référentiels) ;
2. icône officielle embarquée dans l'app (asset local issu de `icone_url`) — **jamais chargée depuis Internet à l'exécution** (app 100 % hors ligne) ;
3. emoji `icone` centré sur `--color-surface-tile` ;
4. initiale du nom.

Variantes de ratio : 1:1 (icônes), 3:4 (Vie désirée, trait), 16:10 (jalon). `alt` = nom de l'élément sauf si le nom est affiché à côté (`alt=""`).

---

## 9. Jauge de compétence circulaire

**Usage.** Niveau d'une compétence (carte Compétences, panneau « Toutes les compétences »), calquée sur le jeu.

**Anatomie.** Anneau de progression (part remplie = progression vers le niveau suivant, en %) autour de l'icône de la compétence ; à droite, nom puis « Niv. n ».

| Variante | Taille | Comportement |
|---|---|---|
| `sm` | 48 px | lecture ; clic → panneau « Toutes les compétences », ligne focalisée |
| `md` | 64 px | panneau d'édition, accompagnée d'un *Stepper* (niveau) et d'un *Curseur 0–100* (progression) |

| État | Rendu |
|---|---|
| Progression connue | arc `--color-accent` proportionnel |
| Progression inconnue | anneau complet en `--color-surface-tile`, pas d'arc |
| Niveau max atteint | anneau plein + « Niv. max » |
| Survol (sm) | infobulle « Cuisine · Niv. 1 · 40 % » |

**Accessibilité.** `role="meter"`, `aria-valuemin=1`, `aria-valuemax=niveau_max`, `aria-valuenow=n`, `aria-valuetext` « Cuisine, niveau 1 sur 10, 40 % vers le niveau 2 ».

---

## 10. Jauge de relation

**Usage.** Niveau d'une relation entre deux Zois (échelle −100 → +100, à vérifier en jeu).

**Anatomie.** Barre horizontale avec repère central à 0 ; remplissage du centre vers la valeur (`--color-positive` à droite, `--color-negative` à gauche) ; valeur signée en texte à droite (« +72 », « −60 », « — »).

| Variante | Détail |
|---|---|
| `mini` | 120 px, lecture (lignes de relation, tableau global) |
| `edition` | curseur pleine largeur + champ numérique ; bouton « Effacer » (remet à nul) |

| État | Rendu |
|---|---|
| Nul | barre vide, texte « — », libellé accessible « Niveau non renseigné » |
| Positif / négatif / zéro | remplissage coloré + signe en texte |

**Clavier (édition).** Flèches ±1, Page haut / bas ±10, Début / Fin = −100 / +100.

**Accessibilité.** `role="slider"` (édition) ou `role="meter"` (lecture) ; `aria-valuetext` « plus 72 sur une échelle de moins 100 à plus 100 ».

---

## 11. Puce de préférence (aime / n'aime pas)

**Usage.** Les 10 emplacements de l'onglet Préférences, calqués sur le jeu.

**Anatomie.** Tuile carrée 56 px (icône de la préférence) avec badge cœur en bas à droite ; libellé à droite de la tuile.

| Variante | Badge | Libellé |
|---|---|---|
| Aime | cœur plein `--color-like` | nom de la préférence |
| N'aime pas | cœur brisé `--color-dislike` (forme différente, pas seulement la couleur) | nom de la préférence |
| Vide | cœur contour atténué au centre de la tuile | « Aucune préférence » (libellé du jeu), texte atténué |

| État | Comportement |
|---|---|
| Survol / focus (rempli) | surface renforcée ; clic / Entrée → *Menu contextuel* : (•) Aime ( ) N'aime pas · Remplacer… · Retirer |
| Survol / focus (vide) | contour accentué ; clic / Entrée → sélecteur variante `preferences` |
| Libellé long | 2 lignes max puis ellipse, nom complet en infobulle |

**Accessibilité.** Bouton ; nom accessible « Lessive, aime » / « Nettoyage, n'aime pas » / « Emplacement vide, ajouter une préférence ».

---

## 12. Emplacement de désir

**Usage.** Carte « Désir » du Profil.

**Anatomie.** Cercle 56 px avec l'icône du désir ; bouton épingle superposé en haut à droite (comme le jeu) ; libellé court en dessous (ajout du tracker).

| Variante / état | Rendu |
|---|---|
| Rempli | icône + libellé ; clic → menu Remplacer… · Épingler / Désépingler · Retirer |
| Épinglé | épingle pleine, `aria-pressed="true"` |
| Vide | cercle atténué avec « ? » (comme le jeu) ; clic → sélecteur `liste` des désirs |

Pas de minuteur (différence assumée avec le jeu).

---

## 13. Puce (tag) et badges

| Variante | Anatomie | Usage |
|---|---|---|
| Caractéristique | icône + nom, fond blanc, × au survol / focus | carte Trait (comme le jeu : « Sociable », « Génie ») |
| Lien de relation | nom du lien, couleur neutre ; préfixe d'icône selon le type (famille, amour, amitié) | lignes de relation |
| Filtre | bascule `aria-pressed` | catégories, types de projet |
| Badge statut | petit texte sur fond atténué, non interactif | « Non vérifié », « Ajouté par vous », « Modifié », « Masqué », « Hérité du foyer Clark », « Accomplie », « Abandonnée » |

Une puce supprimable expose un bouton × distinct (`aria-label` « Retirer Sociable »). Suppr / Retour arrière sur la puce focalisée la retire (toast [Annuler]).

---

## 14. Liste d'objectifs (ligne d'objectif)

**Usage.** Objectifs d'une étape d'ambition (calqué sur le jeu : barre d'accent à gauche, texte, progression « 0/5 »).

**Anatomie.**
```
▌[ ] Préparer 5 boissons mélangées                         [−]  2/5  [+]   [⋯]
```

| État | Rendu |
|---|---|
| À faire (0/cible) | case vide, progression en `--color-accent` |
| En cours (0 < p < cible) | case partielle (tiret), barre d'accent pleine |
| Fait (p = cible) | case cochée, texte atténué, icône coche ; la ligne reste à sa place |
| Étape à venir | toute la liste atténuée mais éditable |
| Édition | double-clic ou menu « Modifier » : texte + cible en place ; Entrée valide, Échap annule |
| Ajout | ligne « + Ajouter un objectif » qui devient un formulaire en place (texte, cible = 1) |

**Clavier.** Espace sur la case = cocher / décocher ; ← / → (ou − / +) sur le stepper = ±1 ; Suppr sur la ligne = retirer (toast [Annuler]).

**Accessibilité.** Liste `ul` ; case `aria-label` = texte ; progression `aria-valuetext` « 2 sur 5 ».

---

## 15. Contrôle segmenté

**Usage.** Choix exclusif court : Étape 1 / 2 / 3 (ambitions), statut de carrière, tonalité de souvenir, Foyers / Familles, Aime / N'aime pas.

| Variante | Détail |
|---|---|
| Standard | segments égaux, segment actif en `--color-accent` (comme les étapes du jeu) |
| Étapes | segment terminé = coche + libellé ; segment à venir = atténué |

**Accessibilité.** `role="radiogroup"` + `role="radio"` ; flèches pour changer ; Étapes = navigation (`role="tablist"`) car elles changent le contenu affiché.

---

## 16. Stepper, curseurs et champs

| Composant | Règles |
|---|---|
| Stepper | [−] valeur [+] ; bornes min / max (boutons désactivés aux bornes) ; la valeur est aussi saisissable au clavier ; ← / → ou − / + |
| Curseur 0–100 | piste + poignée + champ numérique synchronisé ; valeur nulle possible (pas de poignée, champ « — ») ; enregistre au relâchement |
| Curseur d'étape de vie | piste à N crans (N = éléments de `etapes-de-vie` triés par `ordre`), icônes de la première et de la dernière étape aux extrémités (comme le jeu), libellé de l'étape courante à droite ; nul autorisé (« Non renseignée ») ; `role="slider"`, `aria-valuetext` = nom de l'étape ; ← / → = étape précédente / suivante, Début / Fin |
| Champ Meow | entier ≥ 0, icône Meow (asset DA) en préfixe, affichage `12 500`, saisie tolérante (espaces ignorés) ; repli texte « Meow » si l'icône manque |
| Champ texte | libellé au-dessus, compteur affiché à partir de 80 % de la limite, message d'erreur sous le champ |
| Zone de texte | hauteur auto (3 à 12 lignes), Ctrl/Cmd+Entrée valide le formulaire parent |
| Ligne d'information | libellé à gauche (colonne 140 px), valeur à droite ; clic sur la valeur = édition en place (calque de « Informations de base ») |

---

## 17. Emplacement photo

**Usage.** Toute image de la joueuse : portrait, bannière de foyer, maison, véhicule, entreprise, animal, jalon, emblème de famille, image d'élément de référentiel.

| Variante | Ratio | Affichage |
|---|---|---|
| Portrait | 1:1 | rond |
| Bannière | 4:1 | pleine largeur, titre superposé |
| Paysage | 16:9 | maison, véhicule, entreprise |
| Carte | 16:10 | jalon |
| Vertical | 3:4 | Vie désirée, trait (images de référentiel) |
| Carré | 1:1 | animal, emblème, icônes |

| État | Rendu et micro-texte |
|---|---|
| Vide | bordure pointillée, icône image, « Ajouter une photo » ; sous-texte (taille ≥ md) « Glissez une image, collez une capture (Ctrl+V) ou cliquez. » |
| Glisser au-dessus | bordure `--color-accent`, « Déposez l'image ici » |
| Import en cours | squelette + indicateur ; le reste de l'écran reste utilisable |
| Rempli | image `object-fit: cover` positionnée sur le point focal |
| Survol / focus (rempli) | barre d'actions : Remplacer · Repositionner · Retirer |
| Repositionner | glisser l'image pour déplacer le point focal (flèches au clavier, Entrée valide, Échap annule) |
| Erreur de format | « Format non pris en charge. Utilisez PNG, JPG ou WEBP. » |
| Erreur de taille | « Image trop lourde (25 Mo maximum). » |
| Fichier introuvable | fond atténué + « Image introuvable » + [Remplacer] |

**Comportement.** Formats PNG, JPG/JPEG, WEBP ; 25 Mo max. L'app **copie** l'image dans son dossier de données (le fichier d'origine peut être supprimé) et génère des miniatures (64, 256 px). Ctrl/Cmd+V colle l'image du presse-papiers (capture Windows Maj+Win+S, macOS Cmd+Ctrl+Maj+4) dans l'emplacement focalisé ou survolé. « Retirer » → toast [Annuler] ; le fichier est purgé à la fermeture de l'app s'il n'est plus référencé.

**Accessibilité.** Bouton focalisable (« Ajouter une photo de portrait pour Marina ») ; zone de dépôt doublée par le clic / Entrée qui ouvre la boîte de sélection de fichier native.

**Props.** `valeur: Photo | null`, `ratio`, `forme: 'rect' | 'rond'`, `libelle` (pour l'`aria-label`), `onChange`.

---

## 18. Carte Zoi

**Anatomie.** *Avatar* md (lg en grille), « Prénom Nom », puce tranche d'âge (icône + nom), foyer atténué ; en liste compacte : + carrière résumée + icône de Vie désirée.

| Variante | Usage |
|---|---|
| Grille | page Zois, membres du foyer, famille |
| Compacte (ligne) | vue liste de la page Zois |
| Nœud d'arbre | arbre généalogique (avatar + prénom seul) |

États : communs + menu ⋯ (Ouvrir la fiche · Retirer du foyer · Supprimer ce Zoi…) visible au survol / focus. Suppr = suppression avec confirmation. Glisser-déposer pour réordonner dans un foyer (alternative clavier par le menu).

---

## 19. Carte foyer

**Anatomie.** Bannière 4:1 (ou dégradé de repli si vide), nom du foyer, ville, pile d'avatars + « n Zois », budget. Menu ⋯ (Ouvrir · Supprimer le foyer…). Un seul lien principal (le nom) ; toute la carte est cliquable.

---

## 20. Tuile de jalon

**Anatomie.** Image 16:10 (photo de la joueuse > image du référentiel > emoji sur `--color-surface-tile`), titre du jalon en bas à gauche sur `--gradient-image-scrim` (comme le jeu), date en jeu sous le titre si renseignée.

| Variante / état | Rendu |
|---|---|
| Remplie | clic → panneau « Jalon » |
| Ajout | pointillés, « + Ajouter un jalon » |
| Survol / focus | légère élévation (`--shadow-card`), sans déplacement si mouvement réduit |

---

## 21. Ligne de souvenir

**Anatomie.** *Avatar* sm du Zoi lié (ou icône neutre), emoji d'émotion, texte (3 lignes puis « … »), date en jeu · date réelle relative.

| Tonalité | Fond | Annonce |
|---|---|---|
| Positive | `--color-positive-soft` (comme le jeu, vert pâle) | « Souvenir positif » |
| Négative | `--color-negative-soft` (comme le jeu, rouge pâle) | « Souvenir négatif » |
| Neutre | `--color-surface-tile` | — |

États : repos · survol (× visible) · dépliée en édition (texte, date en jeu, émotion, tonalité, Zoi lié, Supprimer).

---

## 22. Ligne de relation

**Anatomie.** *Avatar* sm, nom (lien vers sa fiche), foyer atténué, *Puces* de lien, *Jauge de relation* mini, menu ⋯. Clic sur la ligne (hors nom) → panneau « Relation ». Variante tableau (page Relations) : 2 avatars, colonne « est … de ».

---

## 23. Ligne de projet

**Anatomie.** Bouton de statut rond (○ À faire · ◐ En cours · ● Fait — formes distinctes, pas seulement la couleur), titre, puce de type, échéance, pile d'avatars des Zois concernés, menu ⋯.

| État | Rendu |
|---|---|
| Fait | titre atténué, date de fin en infobulle |
| Dépliée | description, échéance, type, Zois concernés éditables en place |

Espace sur le bouton de statut = statut suivant (annoncé en `aria-live`).

---

## 24. Ligne de possession

**Anatomie.** Vignette (16:9 véhicule / entreprise, 1:1 animal), nom (ou modèle si pas de surnom), sous-titre (type · ville · prix), badge propriétaire si affichée hors de son contexte (« Du foyer Clark »), menu ⋯ (Modifier · Transférer… · Supprimer).

---

## 25. Modale de confirmation

**Usage.** Actions destructives ou à fort impact : supprimer un Zoi / foyer / famille / élément de référentiel, changer d'ambition, importer une sauvegarde, rétablir un élément.

**Anatomie.**
```
┌ Supprimer Marina Takahashi ? ─────────────────────────────┐
│ Sa fiche et tout son contenu seront supprimés :            │
│ 6 jalons, 12 souvenirs, 1 ambition, 3 projets, 2 possessions. │
│ Ses 5 liens seront retirés des fiches des autres Zois,     │
│ qui eux ne sont pas supprimés.                             │
│ (options éventuelles : boutons radio)                      │
│                               [ Annuler ]  [ Supprimer le Zoi ] │
└────────────────────────────────────────────────────────────┘
```

| Variante | Détail |
|---|---|
| Danger | bouton d'action `danger`, libellé = verbe + objet (« Supprimer le Zoi ») |
| Neutre | bouton primaire (« Changer », « Remplacer mes données ») |
| Avec choix | boutons radio ; le libellé du bouton d'action suit le choix |

**Règles.** Titre = question avec le nom de l'objet. Corps = conséquences chiffrées (lignes à 0 omises). **Focus initial sur « Annuler ».** Échap = Annuler. Entrée ne déclenche jamais l'action danger si le focus est sur « Annuler ». Après l'action : toast avec [Annuler] (8 s).

**Accessibilité.** `role="alertdialog"`, `aria-labelledby` (titre), `aria-describedby` (corps), piège du focus, retour du focus au déclencheur (ou au conteneur parent si le déclencheur a disparu).

**Modale de formulaire** (Nouveau foyer, Nouveau Zoi…). Même cadre, `role="dialog"`, focus sur le premier champ, Entrée valide si le focus est dans un champ d'une ligne, Ctrl/Cmd+Entrée valide partout.

---

## 26. Panneau latéral

**Usage.** Édition d'un objet secondaire sans quitter l'écran : Nouveau lien, Relation, Jalon, Compétences, Possession, Élément de référentiel.

**Anatomie.** Panneau à droite, 480 px de large (100 % − 72 px si la fenêtre fait < 1100 px), titre, bouton fermer, corps défilant, pied d'actions collant.

| Mode | Pied |
|---|---|
| Création | [Annuler] [Ajouter …] — rien n'est enregistré avant validation |
| Modification | enregistrement automatique ; pied : action de suppression à gauche, [Fermer] à droite |

Échap ferme (en création avec des champs remplis : « Abandonner ce nouveau lien ? » [Continuer la saisie] [Abandonner]). Le contenu derrière reste visible mais inerte (`inert`).

---

## 27. Toast et Indicateur d'enregistrement

**Toast.** En bas au centre, empilés (3 max). Texte court + action optionnelle ([Annuler], [Réessayer]).

| Variante | Durée | Région |
|---|---|---|
| Information / succès | 5 s | `aria-live="polite"` |
| Avec « Annuler » | 8 s, minuterie suspendue au survol et au focus | `polite` |
| Erreur | persistant, bouton fermer | `assertive` |

Ctrl/Cmd+Z hors champ déclenche l'« Annuler » du toast le plus récent encore visible.

**Indicateur d'enregistrement** (barre supérieure) : « Enregistrement… » (après 300 ms seulement, pour éviter le clignotement) → « Enregistré » (coche, s'efface après 2 s) ; échec → « Échec de l'enregistrement · Réessayer » (persistant).

---

## 28. État vide

**Anatomie.** Icône ou illustration (style du jeu : pictogramme gris centré, ex. mallette pour Carrière, boutique pour Affaires), texte de constat (1 phrase), texte d'aide optionnel, bouton d'action.

| Variante | Usage |
|---|---|
| Carte | dans une *Carte panneau* (centré, compact) |
| Page | liste vide d'un écran (plus grand, avec bouton primaire) |
| Premier lancement | Accueil, avec illustration du DA (capture de la joueuse possible) |
| Filtre | « Aucun … ne correspond à … » + [Effacer le filtre] |

Le bouton d'action reçoit le focus quand la vue s'ouvre sur un état vide et qu'aucun autre élément n'est focalisé (ex. onglet Ambitions vide → « Choisir une ambition »).

---

## 29. Infobulle, Bandeau de suggestion, Menu contextuel

**Infobulle.** Au survol (délai 400 ms) et au focus ; Échap la ferme ; jamais seul support d'une information indispensable. L'icône ⓘ des cartes ouvre une infobulle riche (texte d'aide repris du jeu, reformulé).

**Bandeau de suggestion.** Dans une carte, sous le contenu concerné : texte + 2 boutons (« Passer à l'étape 2 » / « Plus tard »). Annoncé en `aria-live="polite"`, focus déplacé sur le premier bouton. Disparaît si la joueuse continue sans répondre (rien n'est appliqué).

**Menu contextuel (⋯).** `role="menu"`, flèches pour naviguer, Entrée pour activer, Échap pour fermer ; l'action destructive est en dernier, séparée, libellé terminé par « … » si elle ouvre une confirmation.

---

## 30. Correspondance composants → écrans

| Composant | Écrans |
|---|---|
| Avatar | Coquille (aucun), Accueil, Foyers, Zois, Fiche (rangée, relations, souvenirs, projets), Relations, Recherche, Arbre |
| Pastille d'onglet | Fiche Zoi, Foyers / Familles |
| Carte panneau | Fiche (tous les onglets), Foyer, Famille |
| Sélecteur de référentiel | Profil, Souvenirs, Ambitions, Préférences, Valeur, Carrière, Relations, Vie & possessions, Foyer, Référentiels (détails) |
| Jauge de compétence | Profil |
| Jauge de relation | Relations (fiche et globale) |
| Puce de préférence | Préférences |
| Liste d'objectifs | Ambitions |
| Emplacement photo | Profil, Foyer, Famille, Jalon, Possession, Référentiels, modales de création |
| Modale de confirmation | Suppressions, changement d'ambition, import, rétablissement |
