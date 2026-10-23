# Direction artistique — inZOI Tracker

> Version 1.0 · 2026-10-23 · **mode clair uniquement (V1)** · statut : proposition DA, à valider par la joueuse.
> Source de vérité des valeurs : [`src/styles/tokens.css`](../src/styles/tokens.css). En cas d'écart entre ce document et le fichier, c'est le fichier qui fait foi. Styles globaux : [`src/styles/base.css`](../src/styles/base.css).

---

## 0. Sources et légende

**Référence principale** : cinq captures de l'UI du jeu en français (panneau Zoi, environ 730 px de large), dans `docs/references/` :
`jeu-fiche-profil.png`, `jeu-fiche-souvenirs.png`, `jeu-fiche-ambitions.png`, `jeu-fiche-preferences.png`, `jeu-fiche-carriere.png`.

Il n'existe pas de charte UI officielle d'inZOI publiée. Tout ce qui suit est une **lecture de l'interface**, pas la charte Krafton.

| Marque | Sens |
|---|---|
| **[R] Relevé** | Observé sur les captures. Les hex sont **estimés à l'œil** sur des PNG compressés posés sur une scène floutée : tolérance d'environ ±6 par canal. **À confirmer à la pipette dans Figma**, puis à reporter au §3.1. |
| **[I] Interprété** | Décision DA : ajustement pour l'AA, extrapolation à des écrans absents du jeu, pastels d'ambiance du brief. |
| **[O] Officiel / vérifié** | Source externe vérifiée (licences, paquets). |

---

## 1. Intention

**« Le carnet de bord a la peau de la fiche Zoi. »** Ouvrir l'app doit donner l'impression d'ouvrir le panneau du jeu, à côté du jeu : du verre gris perle posé sur une ambiance floutée, des cartes très arrondies, le bleu ciel comme unique couleur d'action, et des photos douces comme seule source de couleur riche.

Principes :

1. **Une seule couleur d'interaction, le bleu ciel.** Ce qui est actif ou cliquable est bleu ciel ou blanc. Rien d'autre n'est bleu.
2. **La couleur vient des images**, pas de l'interface : portraits, jalons, Vies désirées. L'UI reste gris perle et blanche pour les mettre en valeur.
3. **La hiérarchie passe par la valeur, pas par le trait.** Panneau, carte et bloc interne se distinguent par leur clarté, comme dans le jeu, presque sans bordures.
4. **De l'air.** Grille de 4 px, padding de carte de 16 px, une idée par carte.
5. **Fidèle, mais lisible.** Chaque écart au jeu est motivé par l'AA et listé au §3.4.

---

## 2. Anatomie de l'UI du jeu [R]

Les mesures sont en pixels de capture. Ce qui compte, ce sont les proportions.

| Élément | Ce qu'on voit | Capture |
|---|---|---|
| Rangée du foyer | Avatars ronds d'environ 62 px, liseré vert sauge d'environ 3 px. Zoi actif : anneau dégradé cyan → bleu ciel, halo et pastille coche en haut à droite. Bouton « + » : disque blanc, croix bleue. Fermeture « × » gris foncé en haut à droite. | toutes |
| Onglets | Pilules d'environ 42 px de haut, texte semi-gras d'environ 17 px. Inactif : pilule gris clair, texte gris moyen. Actif : pilule bleu ciel, texte blanc. Pastille cyan « nouveau » en haut à droite. Rail de défilement blanc sous la rangée. Le premier onglet n'a qu'une icône (patte), séparée des autres par un filet vertical. | toutes |
| Surfaces | Panneau en verre gris, puis cartes plus claires à liseré blanc, puis blocs internes plus sombres. Les éléments interactifs sont blancs (bouton « Arbre généalogique », tags, « + »). | profil, carrière |
| En-tête de carte | Titre semi-gras d'environ 17 px en haut à gauche, picto « i » bleu cerclé à côté. Action ronde d'environ 36 px en haut à droite : loupe sur pastille bleu pâle, ou « agrandir » sur disque blanc. Un mini-compteur bleu peut s'ajouter sur la loupe. | profil, souvenirs |
| Paire libellé / valeur | Libellé gris d'environ 13 px dans une colonne fixe d'environ 110 px. Valeur semi-grasse quasi noire d'environ 15 px. | profil |
| Compétence | Anneau de progression d'environ 56 px : dégradé bleu foncé → clair sur piste grise, picto bleu nuit sur disque blanc au centre. Nom en 13 px, « Niv.1 » en bleu gras, le tout dans une pilule grise. | profil |
| Ambition | Grand conteneur aux coins d'environ 24 px. Illustration 3D (tablier) à gauche. Sur-titre gris, titre gras d'environ 22 px, « Lv.1/3 » (« Lv.1 » en bleu, « /3 » en gris), filet séparateur. | ambitions |
| Étapes | Contrôle segmenté de 3 pilules. Active : bleu plein, texte blanc. Verrouillées : fond quasi blanc, liseré bleu pâle, texte bleu pâle. | ambitions |
| Objectif | Bloc bleu très pâle, barre verticale bleu pâle de 4 px à gauche, coins d'environ 6 px. Intitulé d'environ 15 px, compteur « 0/1 » en bleu gras. | ambitions |
| Préférence | Tuile carrée d'environ 64 px, fond blanc, icône rendue en 3D. Pastille en bas à droite : cœur doré (aime) ou cœur brisé violet nuit (n'aime pas). Libellé semi-gras, compteur « 5/10 ». Emplacement vide : tuile grise, cœur blanc, « Aucune préférence » en gris clair. | préférences |
| Jalon | Grille de 4 colonnes de vignettes photo d'environ 158 × 115 (≈ 4:3), coins d'environ 10 px, titre blanc gras en bas à gauche sur un dégradé sombre. | souvenirs |
| Souvenir récent | Bandeau teinté (vert sauge pâle pour un souvenir positif, rose pâle pour un négatif), avatar d'environ 40 px, emoji d'émotion, texte d'environ 15 px. | souvenirs |
| Vie désirée | Illustration verticale photo-réaliste douce d'environ 86 × 143 (3:5), puis un bloc gris avec le nom en semi-gras. | profil |
| Trait | Illustration en carte de tarot argentée d'environ 82 × 142 (≈ 4:7), nom en gras, tags blancs (« Sociable », « Génie ») avec mini-icône. | profil |
| École / Freelance | Écusson illustré de 54 px ; tuile d'icône en dégradé violet → bleu avec picto blanc. | carrière |
| État vide | Picto plein gris clair d'environ 60 px (mallette, boutique), centré, au-dessus d'une phrase grise : « Vous n'avez pas de carrière. » | carrière |

---

## 3. Couleurs

### 3.1 Relevés sur les captures [R]

| Élément | Hex relevé (≈) | Remarque |
|---|---|---|
| Scène floutée derrière le panneau | `#D4D4D6` → `#E2E2E4` | variable selon la scène |
| Panneau (hors carte) | `#DADADD` | |
| Carte | `#E8E8EA`, liseré `#F4F4F6` | |
| Bloc interne (« Vie de simplicité ») | `#D7D7DA` | |
| Onglet inactif | fond `#E4E4E6`, texte `#8C8C91` | |
| Onglet actif | fond `#7DBBF5`, texte `#FFFFFF` | |
| Pastille loupe | fond `#A9D2F7`, picto `#1C2B3D` | |
| Bouton « + » | disque `#FFFFFF`, croix `#5AA9F0` | |
| Texte accent « Lv.1 », « 0/1 » | `#3A8EE6` | |
| « Niv.1 » (compétences) | `#1F5FAE` | plus sombre que « Lv.1 » |
| Étape active | `#5EA8F2`, texte blanc | |
| Étape verrouillée | fond `#EEF5FC`, liseré `#B9DAF7`, texte `#A3CBF2` | |
| Bloc objectif | fond `#EEF6FE`, barre `#A9D2F7` | |
| Anneau de compétence | `#1F5FAE` → `#8CC5F7`, piste `#BDBDC3` | |
| Liseré d'avatar | `#8FA67C` | vert sauge |
| Avatar actif | `#8CE9E4` → `#6DB9F4` + halo | |
| Pastille « nouveau » | `#7FE3EE` | |
| Cœur « aime » | `#F5A524` (dégradé `#FFC341` → `#F29A0E`) | |
| Cœur brisé « n'aime pas » | `#3E3A6E` | |
| Tuile de préférence vide | `#D9D9DC`, cœur `#F2F2F4`, texte `#A5A5AA` | |
| Souvenir positif / négatif | `#CFE3D2` / `#EBD0D3` | |
| Texte principal | `#1E1E1E` | |
| Texte secondaire (libellés, descriptions) | `#6E6E73` | |
| Picto d'état vide | `#B5B5BA` | |
| Tuile Freelance | `#8C6FF2` → `#5A7FF6` | |

### 3.2 Tokens sémantiques

Les composants n'utilisent **que** ces tokens. La palette brute (`--palette-*`) sert uniquement à les construire et à préparer un futur thème sombre.

**Surfaces**

| Token | Valeur | Usage | |
|---|---|---|---|
| `--color-bg-app` + `--gradient-app` | `#ECECF0` + halos pastel | fond d'ambiance, **jamais de texte dessus** | I |
| `--color-surface-panel` | `#E4E4E9` | panneau opaque | I |
| `--color-surface-glass` | `rgba(230,230,236,.62)` ≈ `#E4E4E9` | panneau verre : navigation, panneau principal | I d'après R |
| `--color-surface-glass-strong` | `rgba(242,242,246,.86)` | menus, popovers, modales | I |
| `--color-surface-card` | `rgba(255,255,255,.50)` ≈ `#F1F1F4` | carte | I d'après R |
| `--color-surface-card-hover` | `rgba(255,255,255,.68)` | survol de carte cliquable | I |
| `--color-surface-inset` | `rgba(28,28,52,.07)` ≈ `#E0E0E5` | bloc interne, tuile vide, groupe de stats | I d'après R |
| `--color-surface-raised` | `#FFFFFF` | bouton secondaire, tag, tuile d'icône, champ de saisie | R |
| `--color-surface-tab` | `rgba(255,255,255,.60)` | onglet inactif | I |
| `--color-surface-overlay` | `rgba(30,30,48,.28)` | fond de modale | I |
| `--color-veil-ambiance` | `rgba(244,244,247,.78)` | voile sur la capture de ville en fond | I |
| `--color-surface-*-solid` | `#E4E4E9` / `#F7F7F9` / `#F1F1F4` / `#E0E0E5` | repli sans transparence, référence de contraste | I |

**Texte**

| Token | Valeur | Usage | |
|---|---|---|---|
| `--color-text` | `#1E1E24` | texte principal | R |
| `--color-text-secondary` | `#595962` | libellés, descriptions, états vides | I (R `#6E6E73`) |
| `--color-text-placeholder` | `#6B6B74` | placeholder, **sur champ blanc uniquement** | I |
| `--color-text-disabled` | `#84848E` | états désactivés uniquement | I |
| `--color-text-accent` | `#1A5DA8` | « Niv.1 », compteurs « 0/1 », liens | I (R `#3A8EE6` / `#1F5FAE`) |
| `--color-text-on-accent` | `#0E3A6B` | texte et pictos sur fond bleu ciel | I |
| `--color-text-inverse` | `#FFFFFF` | sur voile d'image, sur bouton danger | R |

**Accent (bleu ciel)**

| Token | Valeur | Usage | |
|---|---|---|---|
| `--color-accent` | `#7DBBF5` | onglet actif, bouton principal, segment actif | R |
| `--color-accent-hover` | `#6AB0F2` | survol | I |
| `--color-accent-soft` | `#A9D2F7` | bouton loupe, barre d'objectif, sélection de texte | R |
| `--color-accent-subtle` | `#EEF6FE` | bloc objectif, ligne sélectionnée | R |
| `--color-accent-graphic` | `#2A7DD6` | jauges, anneaux, « + », coche | I (R `#3A8EE6`) |
| `--color-accent-graphic-light` | `#5EA8F2` | fin de dégradé d'anneau (décoratif) | R |

**Préférences, souvenirs, états**

| Token | Valeur | Usage | |
|---|---|---|---|
| `--color-like` | `#F5A524` | cœur « aime » (remplissage) | R |
| `--color-like-stroke` | `#B86E00` | contour du cœur, 1,5 px | I |
| `--color-like-text` / `-subtle` | `#7A5000` / `#FFF2D9` | puce « Aime » | I |
| `--color-dislike` | `#3E3A6E` | cœur brisé, texte « N'aime pas » | R |
| `--color-dislike-subtle` | `#ECEAF6` | puce « N'aime pas » | I |
| `--color-memory-positive` | `#CFE3D2` | souvenir positif | R |
| `--color-memory-negative` | `#EBD0D3` | souvenir négatif | R |
| `--color-success` / `-text` / `-subtle` | `#3E9B5F` / `#22693A` / `#DDF0E2` | enregistré, validé | I |
| `--color-danger` / `-hover` / `-text` / `-subtle` | `#C62F43` / `#B42335` / `#B42335` / `#FBE4E7` | suppression, erreur | I |
| `--color-warning-text` / `-subtle` | `#7A5000` / `#FFF2D9` | avertissement | I |
| `--color-avatar-ring` | `#8FA67C` | liseré d'avatar (décoratif) | R |
| `--color-badge-new` | `#7FE3EE` | pastille « nouveau » (décorative) | R |
| `--color-icon` / `-muted` / `-on-accent` | `#3A3A43` / `#A8A8B0` / `#0E3A6B` | pictos d'action / décoratifs / sur bleu ciel | I |

**Bordures et divers**

| Token | Valeur | Usage | |
|---|---|---|---|
| `--color-border-glass` | `rgba(255,255,255,.60)` | liseré lumineux des panneaux et cartes | R |
| `--color-border-subtle` | `rgba(28,28,52,.10)` | séparateurs | R |
| `--color-border-control` | `#84848E` | contour des champs et des cases | I |
| `--color-border-accent` | `#A9D2F7` | étape verrouillée, sélection douce | R |
| `--color-focus-ring` | `#1A5DA8` | anneau de focus | I |
| `--color-track` | `#CDCDD3` | piste de jauge ou d'anneau | I |
| `--color-selection` | `#A9D2F7` | sélection de texte | R |

### 3.3 Hiérarchie des surfaces

| Niveau | Surface | Rôle | Flou |
|---|---|---|---|
| 0 | `--gradient-app` (ou capture de ville floutée + voile) | ambiance | — |
| 1 | `--color-surface-glass` | navigation latérale, panneau principal, en-tête | **oui** |
| 2 | `--color-surface-card` | cartes | non (voile blanc) |
| 3 | `--color-surface-inset` | blocs internes | non (voile sombre) |
| Interactif | `--color-surface-raised` (blanc) ou `--color-accent` | boutons, tags, champs, tuiles | — |
| Superposition | `--color-surface-glass-strong` | menus, modales | **oui** |

L'ensemble est **plus clair que le jeu d'environ 8 niveaux de gris (≈ 3 %)** [I]. Il n'y a pas de scène 3D derrière, il faut donc compenser la luminosité, et cela donne de la marge AA. L'écart carte → bloc interne (environ 17 niveaux) reste identique au jeu.

**Seuil** : aucune surface qui porte du texte ne descend sous `#D2D2D6` (luminance 0,63). Le pire cas calculé, du verre sur une capture noire sous le voile d'ambiance, donne un panneau d'environ `#D7D7DB` : c'est conforme.

### 3.4 Écarts assumés au jeu (accessibilité)

| Dans le jeu [R] | Ratio dans le jeu | Dans l'app [I] | Ratio |
|---|---|---|---|
| Onglet actif : texte blanc sur `#7DBBF5` | 2,0:1 | texte `#0E3A6B` sur `#7DBBF5`. Le jeu utilise déjà ce vocabulaire : picto foncé sur la pastille loupe bleu pâle. | 5,6:1 |
| « Étape 1 » : texte blanc sur `#5EA8F2` | 2,5:1 | même traitement que l'onglet actif | 5,6:1 |
| « Lv.1 », « 0/1 » : `#3A8EE6` sur `#EEF6FE` | 3,1:1 | `#1A5DA8` | 6,1:1 |
| Libellés gris clair et états vides (« Aucune préférence », « Vous n'avez pas de carrière. ») | 1,7 à 2,2:1 | `#595962` | ≥ 4,8:1 |
| Étapes verrouillées : texte bleu pâle | 1,5:1 | fond blanc, liseré bleu pâle, texte secondaire et picto cadenas | 6,9:1 |
| Cœur doré seul sur tuile blanche (non-texte) | 2,0:1 | contour `#B86E00` de 1,5 px et libellé accessible | 4,0:1 |
| Croix « + » `#5AA9F0` sur blanc (non-texte) | 2,5:1 | `#2A7DD6` | 4,2:1 |
| Coche blanche sur pastille bleu ciel (Zoi actif) | 2,0:1 | coche blanche sur `#2A7DD6` | 4,2:1 |

### 3.5 Dégradés [I]

| Token | Composition | Usage |
|---|---|---|
| `--gradient-app` | halos radiaux : lavande `#E7E1F6` (haut gauche), bleu ciel `#DCEBFA` (haut droite), pêche `#FBE6DA` (bas droite), rose poudré `#F6E1EA` (bas gauche) sur `#ECECF0` | fond d'ambiance : évoque la scène floutée du jeu sans dépendre d'une image |
| `--gradient-placeholder` | lavande → bleu ciel, 135° | emplacements photo vides, avatars sans portrait |
| `--gradient-placeholder-warm` | pêche → rose poudré, 135° | variante chaude (maison, Vie désirée) |
| `--gradient-ville-dowon` | bleu ciel → lavande | bannière par défaut, Dowon (ville urbaine) |
| `--gradient-ville-bliss-bay` | pêche → rose poudré | bannière par défaut, Bliss Bay (côte au coucher du soleil) |
| `--gradient-ville-cahaya` | lagon `#D6F1EC` → bleu ciel | bannière par défaut, Cahaya (île) |
| `--gradient-avatar-active` | `#8CE9E4` → `#6DB9F4` [R] | anneau du Zoi sélectionné |
| `--gradient-icon-tile` | `#8C6FF2` → `#5A7FF6` [R] | tuiles d'icône de catégorie (comme Freelance) |
| `--gradient-progress` | `#1A5DA8` → `#2A7DD6` | remplissage de jauge |
| `--scrim-image` | nuit 72 % → 60 % (à 35 %) → 0 (à 75 %), du bas vers le haut | lisibilité du texte blanc sur photo |

**Option fond photo** : la capture de ville de la joueuse en plein cadre, avec `filter: blur(var(--blur-ambiance))` (64 px), recouverte de `--color-veil-ambiance`. Le voile est obligatoire : c'est lui qui garantit le pire cas du §3.3.

---

## 4. Typographie

### 4.1 Constat [R]

L'UI du jeu utilise une sans-serif néo-grotesque : hauteur d'x élevée, « a » à double étage, terminaisons horizontales, chiffres larges, graisses de 400 à 700, aucune capitale de mise en forme ni d'italique.

La police exacte de l'UI d'inZOI n'est pas documentée publiquement. **Pretendard figure dans la charte de marque Krafton** pour le texte courant, à côté de KRAFTON Sans et KRAFTON Edge, toutes deux propriétaires [O, d'après la page Typographie de brand.krafton.com vue en résultat de recherche ; la page n'a pas pu être consultée directement].

### 4.2 Choix

- **Piste A (recommandée) : Pretendard Variable.** Licence SIL OFL 1.1 [O], paquet npm `pretendard` (v1.3.9 au moment de la rédaction). Son latin dérive d'Inter et couvre tous les diacritiques du français (é è ê ë à â ç î ï ô œ ù û ü ÿ, « », espaces fines). Elle couvre aussi le hangeul complet, utile pour les noms coréens de Dowon. Axe de graisse continu de 45 à 920. Elle est cohérente avec la marque Krafton. La variable woff2 pèse environ 2 Mo, ce qui est négligeable dans une app Electron.
- **Piste B : Inter Variable.** OFL 1.1, `@fontsource-variable/inter`. Même dessin latin et plus légère, mais sans hangeul et sans lien avec la marque. À garder seulement si le poids devenait un sujet.

### 4.3 Installation hors ligne

```sh
npm i pretendard
```

```ts
// point d'entrée du renderer (main.tsx)
import 'pretendard/dist/web/variable/pretendardvariable.css'; // famille « Pretendard Variable »
import './styles/tokens.css';
import './styles/base.css';
```

Vite copie le `.woff2` dans le build : aucune requête réseau. Ne pas utiliser les variantes `*-dynamic-subset`, conçues pour un CDN (des dizaines de fichiers), ni le CDN jsDelivr.
Le chemin est **à vérifier à l'installation** (`node_modules/pretendard/dist/web/variable/`). Repli possible : `dist/web/static/pretendard.css` (famille « Pretendard », 9 graisses statiques), déjà prévue dans la pile `--font-family-sans`.

### 4.4 Échelle (racine 16 px)

| Rôle (token `font`) | Taille / interligne | Graisse | Usage | Équivalent jeu |
|---|---|---|---|---|
| `--font-display` | 38 / 1,2 | 700 | nom de famille sur bannière | — |
| `--font-page-title` | 30 / 1,2 | 700 | nom du Zoi en en-tête, titre d'écran (h1) | — |
| `--font-title` | 24 / 1,2 | 700 | titre d'ambition, titre de modale | ≈ 22, gras |
| `--font-section-title` | 20 / 1,2 | 600 | « Ambitions », « Préférences » (h2) | ≈ 20, semi-gras |
| `--font-card-title` | 17 / 1,35 | 600 | « Informations de base », « Jalons » (h3) | ≈ 17, semi-gras |
| `--font-tab` | 15 / 1,2 | 600 | onglets, boutons | ≈ 17 (réduit : l'app se lit sur un bureau, pas à distance TV) |
| `--font-value` | 15 / 1,35 | 600 | valeurs (« Takahashi Marina »), noms de préférence | ≈ 15 |
| `--font-body` | 15 / 1,5 | 400 | corps, descriptions, souvenirs | ≈ 15 |
| `--font-label` | 13 / 1,35 | 400 | libellés de champ (« Nom de famille ») | ≈ 13 |
| `--font-caption` | 12 / 1,35 | 400 | métadonnées, dates | — |
| `--font-badge` | 11 / 1 | 700 | compteurs de pastille | ≈ 9 à 10 |

Approche : `--letter-spacing-tight` (−0,015em) à partir de 20 px, `--letter-spacing-wide` (+0,02em) pour le 11 à 12 px en gras.

### 4.5 Règles

- Pas de capitales de mise en forme ni d'italique : ils sont absents du jeu. L'emphase passe par la graisse (600) ou par `--color-text-accent`.
- Chiffres tabulaires pour les compteurs, niveaux, Meow et dates. `base.css` les applique déjà à `data`, `time`, `output`, `meter` et `progress`.
- Typographie française : espace fine insécable (U+202F) avant « ; ! ? », insécable avant « : » et dans les guillemets « ». À appliquer dans les micro-textes (UX).
- Monnaie : le jeu utilise pour le Meow un glyphe propre (un « M » barré), absent d'Unicode. En V1, écrire « 12 500 Meow » ; en V2, un picto SVG redessiné.
- Textes longs (notes d'histoire, journal) : 60 à 75 caractères par ligne au maximum.

---

## 5. Rayons

Les rayons sont relevés puis poussés de 10 à 30 % vers le « très arrondi » demandé par le brief [I].

| Token | Valeur | Usage | Relevé |
|---|---|---|---|
| `--radius-xs` | 4 px | tags de caractéristique | ≈ 4 |
| `--radius-sm` | 8 px | blocs internes, objectifs, champs, tuiles de 48 px | ≈ 6 à 8 |
| `--radius-md` | 12 px | vignettes photo, tuiles de 64 px, menus | ≈ 6 à 10 |
| `--radius-lg` | 16 px | cartes | ≈ 12 |
| `--radius-xl` | 24 px | panneaux, modales, conteneur d'ambition | ≈ 24 |
| `--radius-pill` | 999 px | onglets, boutons, recherche, segments | pilule |
| `--radius-round` | 50 % | avatars | cercle |

**Imbrication** : on descend d'au moins un cran à chaque niveau. Panneau `xl` → carte `lg` → bloc `sm` → tag `xs`. Jamais deux rayons identiques imbriqués.

---

## 6. Ombres et élévation

Le jeu n'a presque pas d'ombres portées : la profondeur vient du verre et des valeurs. Les nôtres restent très diffuses et teintées nuit (`#1C1C34`), jamais noires.

| Niveau | Token | Usage |
|---|---|---|
| 1 | `--shadow-glass` (reflet intérieur + `md`) | panneaux en verre |
| 2 | `--shadow-card` (reflet intérieur + `xs`) | cartes |
| 2+ | `--shadow-sm` | éléments blancs (boutons, tags, tuiles), survol de carte |
| 3 | `--shadow-lg` | menus, popovers, modales, élément en cours de glisser-déposer |
| — | `--shadow-avatar-active` | halo du Zoi sélectionné |
| — | `--shadow-inset` | champs en creux, pistes de jauge |

`--shadow-highlight` (reflet blanc de 1 px en haut, à l'intérieur) donne l'arête lumineuse du verre : on la garde sur tout ce qui est en verre ou en carte.

---

## 7. Verre dépoli

Recette unique pour un panneau :

```css
.panneau {
  background: var(--color-surface-glass);
  backdrop-filter: var(--backdrop-glass);          /* blur(24px) saturate(140%) */
  border: var(--size-border) solid var(--color-border-glass);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-glass);
}
```

Superpositions (menus, modales) : `--color-surface-glass-strong` + `--backdrop-glass-strong` (40 px) + `--shadow-lg`.

Règles :

1. **Seuls les panneaux de niveau 1 et les superpositions sont floutés.** Les cartes ne floutent pas, elles utilisent un voile blanc à 50 %. Au plus 2 couches `backdrop-filter` à l'écran en continu, plus 1 pour une modale ouverte. Raisons : le coût GPU, et un flou dans un flou ne se voit pas.
2. Jamais de `backdrop-filter` sur des éléments de liste qui défilent.
3. Le système peut réduire la transparence (Windows « Effets de transparence », macOS « Réduire la transparence ») : `tokens.css` bascule alors automatiquement sur les aplats `-solid`. Même chose avec `prefers-contrast: more`.
4. Le texte n'est jamais posé directement sur le fond d'ambiance.

Pistes de mise en œuvre :

- **A (recommandée) : verre CSS sur un fond peint par l'app** (dégradé ou capture floutée). Rendu identique sous Windows et macOS, contrastes maîtrisés.
- **B : matériaux natifs Electron** (`vibrancy` sous macOS, `backgroundMaterial: 'acrylic'` sous Windows 11). On verrait le bureau à travers la fenêtre, ce qui fait plus « système » que « inZOI ». Rendu différent selon l'OS, absent de Windows 10, contrastes non garantis. Écartée pour la V1.

---

## 8. Espacements et grille

La grille de base est de **4 px** (`--space-1` à `--space-20`).

Repères relevés dans le panneau du jeu (730 px) : marge de 14 px, gouttière entre cartes de 8 à 10 px, padding de carte de 14 px, 2 colonnes de cartes.

| Token | Valeur | Usage |
|---|---|---|
| `--space-panel-padding` | 20 px | intérieur des panneaux en verre |
| `--space-card-gap` | 12 px | gouttière entre cartes |
| `--space-card-padding` | 16 px | intérieur des cartes |
| `--space-stack-label` | 4 px | libellé → valeur, en empilé |
| `--space-section` | 32 px | entre deux sections d'un écran |

- Hauteurs de contrôle : 32, 40 et 48 px (`--size-control-*`). Onglets et boutons standard en 40 px.
- Fiche Zoi : cartes en **2 colonnes égales** comme dans le jeu (Vie désirée | Trait ; Désir | Compétences), dès une fenêtre de 1024 px. Une 3ᵉ colonne au-delà de 1440 px est à arbitrer avec l'UX.
- Paires libellé / valeur en colonnes (bloc « Informations de base ») : colonne de libellés de 112 px, alignée sur la grille.

---

## 9. Recettes visuelles des composants signature

Ce tableau fixe l'aspect. Le comportement, les états et les micro-textes relèvent de l'UX.

| Composant | Recette (tokens) |
|---|---|
| Onglet inactif | `surface-tab`, `font-tab`, `text-secondary`, hauteur `control-md`, padding horizontal `space-4`, `radius-pill` |
| Onglet actif | `accent`, `text-on-accent` ; survol `accent-hover` |
| Bouton principal | comme l'onglet actif, plus `shadow-sm` |
| Bouton secondaire | `surface-raised`, `text`, `shadow-sm` (comme « Arbre généalogique ») |
| Bouton icône | disque `control-md` en `accent-soft` avec picto `icon-on-accent` de 20 px (loupe) ; variante `surface-raised` + `icon` (agrandir) |
| Bouton danger | `danger`, `text-inverse` ; survol `danger-hover` |
| Carte | `surface-card`, bordure `border-glass`, `radius-lg`, `shadow-card`, padding `card-padding` ; titre `font-card-title`, picto info de 16 px en `accent-graphic` |
| Paire libellé / valeur | `font-label` + `text-secondary` / `font-value` + `text` |
| Bloc interne | `surface-inset`, `radius-sm`, padding `space-3` |
| Champ de saisie | `surface-raised`, bordure de 1 px en `border-control`, `radius-sm`, hauteur `control-md` ; focus = anneau `focus-ring` |
| Tag de caractéristique | `surface-raised`, `radius-xs`, 13 px en graisse 500, `text`, mini-icône de 16 px |
| Objectif | `accent-subtle`, barre gauche de `size-accent-bar` en `accent-soft`, `radius-sm` ; compteur en `text-accent` 600, chiffres tabulaires |
| Segments d'étape | actif = onglet actif ; verrouillé = `surface-raised`, liseré `border-accent`, `text-secondary` et picto cadenas |
| Jauge linéaire | piste `color-track`, remplissage `gradient-progress`, épaisseur `size-progress`, `radius-pill` |
| Anneau de compétence | diamètre `size-skill-ring`, épaisseur `size-ring`, piste `color-track`, remplissage `accent-graphic` ; picto `icon-on-accent` sur disque blanc ; « Niv. » en `text-accent` 600 |
| Avatar | cercle, liseré `avatar-ring` de `size-avatar-ring` ; actif : `gradient-avatar-active` + `shadow-avatar-active` + pastille coche (`accent-graphic`, coche blanche) |
| Pastille « nouveau » | `badge-dot` en `badge-new`, liseré blanc de 1,5 px ; jamais seule porteuse d'information |
| Tuile de préférence | `tile-md`, `surface-raised`, `radius-md`, emoji `size-emoji-lg` ; cœur `size-heart-badge` en bas à droite, débordant de 4 px |
| Souvenir | bandeau `memory-positive` / `memory-negative`, `radius-sm`, avatar `size-avatar-md`, emoji + `font-body` |
| Vignette de jalon | ratio 4:3, `radius-md`, `scrim-image`, titre en `font-value` et `text-inverse`, padding `space-3` |

---

## 10. Iconographie

Quatre familles, à ne pas mélanger.

**1. Pictos d'interface** (loupe, fermer, info, agrandir, plus, coche, cadenas, appareil photo, crayon, poubelle, arbre). Dans le jeu, ils sont pleins ou en trait épais, avec des terminaisons arrondies.

- **Piste A (recommandée) : Phosphor Icons** (`@phosphor-icons/react`, MIT [O]). Graisse `bold` pour les actions, `fill` pour les états vides et les cœurs : c'est la même logique que le jeu (mallette et boutique pleines).
- **Piste B : Lucide** (`lucide-react`, ISC). Excellent jeu, mais en trait uniquement, sans version pleine : moins proche du jeu.

Tailles : `--size-icon-*`. Couleurs : `--color-icon`, `--color-icon-on-accent`, `--color-accent-graphic`, `--color-icon-muted` (décoratif). Aucune autre.

**2. Icônes de contenu** (traits, préférences, compétences, carrières, désirs…).

- **V1** : l'emoji du champ `icone` du contrat de données, posé dans une tuile blanche (`surface-raised`, `radius-sm` à 48 px, `radius-md` à 64 px) pour imiter les tuiles d'icônes 3D du jeu. Emoji système (Segoe UI Emoji sous Windows, Apple Color Emoji sous macOS) : le rendu diffère selon l'OS, c'est assumé en V1.
- **V1.5 (option)** : **Microsoft Fluent Emoji 3D** (MIT [O], PNG) embarqués. Leur rendu 3D doux est le plus proche des icônes d'inZOI, et il est identique hors ligne sur les deux OS. Microsoft a exclu du dépôt certains emoji (marques, jeux vidéo, drapeaux…). Attribution dans `assets/CREDITS.md`.
- **V2** : icônes officielles (`icone_url`) recadrées par la joueuse depuis ses captures, pour un usage personnel, avec la provenance dans CREDITS.

**3. Cœurs aime / n'aime pas.** Pictos Phosphor `Heart` (fill, `--color-like`, contour `--color-like-stroke`) et `HeartBreak` (fill, `--color-dislike`). La présence de `HeartBreak` est à confirmer au catalogue ; à défaut, un SVG maison. Pas d'emoji 💛 / 💔 : 💔 est rouge, alors que le jeu utilise un violet nuit. Les cœurs sont toujours accompagnés d'un libellé (« Aime », « N'aime pas »), visible ou en `.visually-hidden`.

**4. Émotions** (souvenirs) : emoji système, comme dans le jeu.

---

## 11. Place des visuels

**Principe** : les captures de la joueuse d'abord, prises en mode photo du jeu. Les images Krafton (kit presse, site officiel) ne servent qu'à défaut, pour un usage personnel, avec la provenance dans `assets/CREDITS.md`. **Jamais le logo inZOI.**

| Emplacement | Ratio | Affichage | Import minimal | Cadrage / prise de vue | Si vide |
|---|---|---|---|---|---|
| Portrait du Zoi (avatar) | 1:1, cercle | 24 → 144 px | 512 × 512 | visage centré, haut des épaules, regard caméra, fond simple ; 15 % de marge au-dessus de la tête | cercle `gradient-placeholder` + initiales `text-on-accent` 600 |
| Portrait en pied (en-tête de fiche, option) | 3:4 | ≈ 240 × 320 | 900 × 1200 | en pied ou trois-quarts, lumière de jour | `gradient-placeholder` + picto appareil photo |
| Bannière de famille | 3:1 | pleine largeur × 240 à 320 | 2400 × 800 | foyer réuni devant la maison, ou plan large de la ville ; sujet dans le tiers central (les bords sont rognés selon la taille de la fenêtre) | `gradient-ville-*` selon la ville |
| Maison / lot | 16:9 | carte 320 × 180 → plein écran | 1600 × 900 | façade de jour, angle trois-quarts ; golden hour bienvenue | `gradient-placeholder-warm` + picto maison |
| Véhicule | 16:9 | carte | 1280 × 720 | trois-quarts avant, sujet centré | `gradient-placeholder` + picto voiture |
| Entreprise | 16:9 | carte | 1280 × 720 | devanture ou intérieur | `gradient-placeholder-warm` + picto boutique |
| Jalon | 4:3 | vignette ≈ 200 × 150, en grille | 800 × 600 | scène du moment ; le bas de l'image reçoit le voile et le titre | tuile `gradient-placeholder`, titre en `text` |
| Vie désirée | 3:5 | ≈ 108 × 180 | 600 × 1000 | illustration verticale, personnage dans le tiers inférieur | `gradient-placeholder-warm` |
| Trait | 4:7 | ≈ 100 × 175 | 400 × 700 | capture de la carte du trait dans le jeu | `gradient-placeholder` + emoji du trait |
| Ville (fond d'ambiance) | 16:9 | plein cadre, floutée à 64 px + voile à 78 % | 1920 × 1080 | n'importe quel plan large lumineux ; le flou fait le reste | `gradient-app` |

**Traitement**

- `object-fit: cover`, avec recadrage à l'import au ratio imposé par l'emplacement et point focal mémorisé. L'original est conservé.
- Pas de filtre par défaut. `--filter-photo-soft` (−8 % de saturation, −4 % de contraste, +3 % de luminosité) reste optionnel, pour harmoniser des captures disparates. À tester sur les vraies captures.
- Texte sur image : uniquement dans le tiers bas, sous `--scrim-image`, en blanc et au moins en `font-value`.
- Bannière de famille, deux pistes :
  - **A (recommandée)** : un cartouche en verre (`surface-glass-strong` + `backdrop-glass-strong`, `radius-lg`) en bas à gauche, avec le nom de famille en `font-page-title` et `text`, et la ville en `font-label`. Le contraste est garanti quelle que soit la photo, et c'est cohérent avec le jeu, qui pose son texte sur du verre.
  - **B** : texte blanc sur voile sombre, comme les vignettes de jalon. Plus « affiche », mais cela assombrit le bas de la photo.
- Conseils de prise de vue pour la joueuse : mode photo, HUD masqué, lumière de jour ou golden hour, légère profondeur de champ, export PNG.

---

## 12. États vides

Le modèle est la carte « Vous n'avez pas de carrière. » du jeu, avec une action en plus : c'est un tracker.

- **Carte vide** : picto Phosphor `fill` de `--size-icon-empty` (48 px) en `--color-icon-muted`, décoratif, centré. En dessous (`space-3`), une phrase en `font-body` et `text-secondary`. Action facultative en bouton secondaire (« Ajouter une carrière »).
- **Emplacement photo vide** : surface en dégradé pastel (§11), picto appareil photo de 24 px en `icon-on-accent`, libellé « Ajouter une capture » en `font-label` 600 et `text-on-accent`. Au survol : `shadow-sm` et `surface-card-hover`. Au glisser-déposer : anneau de 2 px en `accent-graphic`. Pas de pointillés : ils sont absents du jeu.
- **Emplacements de liste** (préférences) : tuile `surface-inset`, cœur au contour blanc, « Aucune préférence » en `text-secondary`. On garde la grille complète des emplacements, comme le jeu (5/10), pour montrer la capacité restante.
- **Avatar sans portrait** : initiales (§11).
- **Premier lancement** (aucune famille) : grande carte en verre centrée sur le `gradient-app`, titre en `font-title`, bouton principal. Aucune image Krafton.

---

## 13. Accessibilité : contrastes vérifiés

Formule WCAG 2.x (luminance relative sRGB), calculée valeur par valeur. Fonds de référence :

- carte solide `#F1F1F4` ;
- bloc interne solide `#E0E0E5` ;
- **pire cas panneau** ≈ `#D7D7DB` : verre à 62 % sur une capture noire sous le voile à 78 % ;
- pire cas bloc interne ≈ `#DCDCDF`.

**Texte (seuil 4,5:1)**

| Couleur | Fond | Ratio |
|---|---|---|
| `text` `#1E1E24` | carte / bloc / pire cas | 14,7 / 12,6 / 11,5 |
| `text-secondary` `#595962` | carte / bloc / pire cas | 6,15 / 5,27 / 4,83 |
| `text-accent` `#1A5DA8` | carte / bloc / pire cas / `accent-subtle` | 5,87 / 5,03 / 4,61 / 6,06 |
| `text-on-accent` `#0E3A6B` | `accent` / `accent-hover` / `accent-soft` | 5,61 / 4,96 / 7,21 |
| `text-placeholder` `#6B6B74` | champ blanc | 5,28 |
| `text-secondary` | onglet inactif (pire cas) | ≥ 6,0 |
| `like-text` `#7A5000` | carte / `like-subtle` | 6,26 / 6,37 |
| `dislike` `#3E3A6E` | carte / `dislike-subtle` | 9,15 / 8,68 |
| `success-text` `#22693A` | carte / `success-subtle` / pire cas | 5,91 / 5,60 / 4,64 |
| `danger-text` `#B42335` | carte / `danger-subtle` / pire cas | 5,76 / 5,37 / 4,52 |
| blanc | `danger` / `danger-hover` | 5,40 / 6,50 |
| blanc | photo sous `scrim-image` (opacité ≥ 0,60, image blanche) | ≥ 4,95 |
| `text` / `text-secondary` | `memory-positive` | 12,3 / 5,14 |
| `text` / `text-secondary` | `memory-negative` | 11,4 / 4,78 |
| initiales `#0E3A6B` | `gradient-placeholder` (point le plus sombre) | 8,98 |
| `text` | `selection` | 10,5 |

**Non-texte (WCAG 1.4.11, seuil 3:1)**

| Couleur | Fond | Ratio |
|---|---|---|
| `accent-graphic` `#2A7DD6` | carte / bloc / blanc | 3,72 / 3,19 / 4,20 |
| `border-control` `#84848E` | blanc / carte | 3,70 / 3,28 |
| `focus-ring` `#1A5DA8` | carte / `accent` | 5,87 / 3,24 |
| `like-stroke` `#B86E00` | blanc | 3,99 |
| `success` `#3E9B5F` | blanc / carte | 3,47 / 3,07 |
| picto blanc | `gradient-icon-tile` | ≥ 3,62 |

**Exemptions documentées** : `text-disabled` (3,28, états désactivés uniquement). `icon-muted`, `avatar-ring` et `badge-new` sont décoratifs, et l'information qu'ils accompagnent est toujours doublée.

**Règles**

- Jamais de texte sur une surface plus sombre que `#D2D2D6`, ni sur une photo sans voile.
- Tout nouvel appariement de couleurs passe par ce tableau (DA).
- Focus : anneau de 2 px en `--color-focus-ring`, décalé de 2 px ; il suit le rayon sous Chromium. Jamais d'`outline: none` sans remplacement.
- `prefers-reduced-transparency`, `prefers-contrast: more` et `prefers-reduced-motion` sont gérés dans `tokens.css` et `base.css`.
- La couleur ne porte jamais seule une information : cœurs, pastilles et souvenirs positifs ou négatifs sont toujours doublés d'un emoji, d'un texte ou d'un libellé accessible.

---

## 14. Mode sombre (hors V1)

Le brief le place en « plus tard », mais l'architecture est prête. Les composants ne consomment que des tokens sémantiques : un thème sombre se résumera à un bloc `:root[data-theme="dark"]` qui redéfinit les sections 2 à 7 de `tokens.css`, sans toucher aux composants. En V1, `color-scheme: light` force les contrôles natifs en clair, même si l'OS est en sombre.

---

## 15. Logotype « Zoi Tracker » [I]

Ni logo inZOI (marque Krafton), ni reprise de son dessin. Voici une base, à redessiner de ta main :

- **Mot-symbole** : « Zoi » en Pretendard 700 et `#0E3A6B`, « Tracker » en 500 et `#595962`, approche −0,02em, 20 px dans la navigation.
- **Monogramme** : carré aux coins très arrondis (rayon de 30 % du côté) en `gradient-placeholder` (lavande → bleu ciel), avec un « Z » en 700 et `#0E3A6B`, et un liseré `border-glass` pour que le verre se lise dès l'icône. Déclinaisons de 16 à 1024 px pour l'icône d'app (`.ico` / `.icns`).

---

## 16. Provenance des visuels : `assets/CREDITS.md`

Le fichier n'existe pas encore. Il faudra le créer avec le premier visuel versionné dans `assets/`, au format suivant :

| Fichier | Contenu | Source | Auteur·rice | Date | Licence / usage |
|---|---|---|---|---|---|
| `assets/…` | … | capture in-game / kit presse (URL) / Fluent Emoji (URL) | la joueuse / Krafton / Microsoft | AAAA-MM-JJ | usage personnel / MIT |

- Les captures importées dans l'app (dossier de données utilisateur) ne sont pas des assets du dépôt : aucune entrée n'est requise.
- Les références `docs/references/*.png` (captures de l'UI du jeu, © Krafton) sont à y lister aussi, en tant que références internes.

---

## 17. Règles pour le code

1. Ordre de chargement : police (import JS), puis `tokens.css`, puis `base.css`.
2. Aucune couleur, police, taille, rayon, ombre ou espacement en dur. Aucun `--palette-*` dans un composant.
3. Le verre passe uniquement par la recette du §7.
4. Toute nouvelle valeur passe par une demande à la DA, puis un ajout dans `tokens.css` et dans ce document.
5. Ne pas ajouter `scrollbar-color` ni `scrollbar-width` : depuis Chromium 121, ces propriétés désactivent les scrollbars personnalisées de `base.css`.

---

## 18. À valider / à vérifier

1. **Relevés hex** à confirmer à la pipette (Figma) sur les PNG, puis à mettre à jour au §3.1. Les tokens [I] n'en dépendent qu'à la marge.
2. **Chemin du CSS Pretendard** après `npm i pretendard` (dev).
3. **Phosphor** : présence de `HeartBreak` au catalogue.
4. **Pistes à trancher** : bannière (A cartouche en verre / B texte sur voile) ; Fluent Emoji 3D en V1.5, oui ou non.
5. **Police réelle du jeu** : à confirmer si la joueuse peut consulter les crédits ou les fichiers du jeu. Cela ne change pas la recommandation : Pretendard reste la meilleure option libre.
