# Modèle de données de la joueuse — inZOI Tracker V1

> Livrable UX · v1.0 · 2026-10-23 · modèle **logique** (le stockage SQLite relève du dev).
> Les éléments du jeu sont référencés par leur `id` de référentiel (`data/referentiels/*.json`, voir `docs/contrat-donnees.md`).

## 1. Principes

- `Id` = UUID v4 (données de la joueuse) ; `RefId` = slug d'un élément de référentiel.
- `null` = **inconnu** (jamais 0 par défaut). Horodatages ISO 8601 (`cree_le`, `modifie_le` sur chaque entité).
- `DateEnJeu` = texte libre ≤ 60 car. (« Jour 12 », « après le mariage ») : le calendrier du jeu n'est pas modélisé.
- Saisie libre : un élément absent est **ajouté au référentiel** (`origine: "joueuse"`, §8) puis référencé par son id. Seuls quelques champs restent du texte libre (poste, quartier, moyenne, licences).
- Listes liées aux référentiels (caractéristiques, désirs, compétences, préférences, valeurs) : tables de jointure recommandées, pour compter « Utilisé par n Zois » et bloquer la suppression d'un élément utilisé.

## 2. Types communs

```ts
type Id = string;        // UUID v4
type RefId = string;     // id d'élément de référentiel
type DateEnJeu = string; // ≤ 60 car.

interface Photo {
  fichier: string;           // relatif au dossier de données, ex. "images/<uuid>.webp" (recadré au ratio)
  original: string;          // fichier d'origine conservé
  largeur: number; hauteur: number;
  point_focal: { x: number; y: number }; // 0–1
}
```

## 3. Famille et foyer

```ts
interface Famille { id: Id; nom: string /*1–60*/; embleme: Photo | null; notes: string /*≤5000*/; }

interface Foyer {
  id: Id; nom: string /*1–60*/;
  famille_id: Id | null;          // famille principale (regroupement, pré-remplissage)
  ville_id: RefId | null;         // ref:villes
  quartier: string | null;        // suggestions : villes.details.quartiers
  adresse: string | null;         // ≤ 120
  budget: number | null;          // entier ≥ 0, en Miaou
  generation: number | null;      // 1–99
  banniere: Photo | null; photo_maison: Photo | null;
  notes: string;                  // ≤ 5000
}
```

## 4. Zoi

```ts
interface Zoi {
  id: Id; prenom: string /*1–40*/; nom: string /*≤40*/;
  famille_id: Id | null;            // « Nom de famille » du jeu
  foyer_id: Id | null;              // null = « Sans foyer »
  ordre_foyer: number;              // ordre de la rangée d'avatars
  portrait: Photo | null;
  etape_de_vie_id: RefId | null;    // ref:etapes-de-vie (9 étapes, tri details.ordre)
  vie_desiree_id: RefId | null;     // ref:vies-desirees
  trait_id: RefId | null;           // ref:traits
  caracteristiques: RefId[];        // ref:caracteristiques (avertir si incompatible : traits.details.caracteristiques_incompatibles, caracteristiques.details.incompatibles)
  desirs: { desir_id: RefId; epingle: boolean }[];                 // max 4, ordonné
  competences: { competence_id: RefId; niveau: number; progression: number | null }[]; // niveau 1..niveau_max, progression 0–100
  preferences: { preference_id: RefId; sentiment: "aime" | "deteste"; ordre: number }[]; // max = preferences.regles.max_par_zoi (10)
  valeurs: { valeur_id: RefId; score: number | null }[];           // score 0–100
  ecole: { ecole_id: RefId | null; niveau_etudes_id: RefId | null; moyenne: string | null /*≤5*/ };
  carriere: {
    statut: "en_poste" | "sans_emploi" | "retraite" | null;
    carriere_id: RefId | null;      // ref:carrieres
    poste_nom: string | null;       // copié de details.postes[] ou libre
    niveau: number | null; salaire: number | null; // copiés à la sélection du poste, puis indépendants
  };
  freelance: { activite_id: RefId | null; note: number | null; gains_totaux: number | null;
               licences: string[]; contrats_termines: number | null };
  logement: { mode: "herite" | "propre";  // "herite" = valeurs du foyer (lecture seule)
              ville_id: RefId | null; quartier: string | null; adresse: string | null; photo: Photo | null };
}
```

Règles : sans foyer, `logement.mode` est forcé à `"propre"`. Au choix d'un trait : `caracteristiques` pré-remplies depuis `details.caracteristiques` si vide ; `valeurs` pré-remplies depuis `details.valeurs` (score `null`) si vide.

## 5. Relations (réciprocité automatique)

Une **Relation** par paire de Zois, porteuse de un ou plusieurs **liens**. Un lien est stocké **une seule fois**, dans le sens « sujet est *type* de objet » ; l'autre fiche l'affiche via l'inverse.

```ts
interface Relation {
  id: Id; zoi_a_id: Id; zoi_b_id: Id;   // paire non ordonnée, unique (stocker a < b)
  niveau: number | null;                // −100..+100 (échelle à vérifier en jeu)
  depuis: DateEnJeu | null; notes: string; // ≤ 2000
  liens: { id: Id; type_id: RefId /*ref:relations*/; sujet_id: Id /* zoi_a_id ou zoi_b_id */ }[];
}
```

Affichage sur la fiche de X : lien dont le sujet est l'autre Zoi → `nom` du type ; dont le sujet est X → `nom` de `details.inverse` (ou du type lui-même si symétrique).
Exemple : « Hiro est **Parent** de Marina » est stocké `{type_id: "parent", sujet_id: Hiro}` ; la fiche de Hiro affiche Marina comme **Enfant**.

**Extension du contrat requise** pour `relations.json` (`details`) :

| Champ | Valeurs | Rôle |
|---|---|---|
| `type` | `familial` · `amoureux` · `amical` · `autre` | groupe d'affichage **et** exclusivité : au plus **un lien par `type`** et par paire (un nouveau lien du même type remplace l'ancien, après avertissement). Couple / fiancé·e / marié·e / ex rangés dans `amoureux` (le contrat cite « statut » : à fusionner, décision CEO). |
| `inverse` | `RefId` ou `null` (symétrique) | réciprocité (`parent` ↔ `enfant`, `grand-parent` ↔ `petit-enfant`, `oncle-tante` ↔ `neveu-niece`) |
| `role_arbre` | `parent` · `enfant` · `conjoint` · `ex_conjoint` · `fratrie` · `null` | arbre généalogique et suggestions (conjoint·e → second parent, autres enfants → fratrie) |

## 6. Histoire : jalons, souvenirs, ambitions

```ts
interface JalonZoi { id: Id; zoi_id: Id; jalon_id: RefId /*ref:jalons*/; date_en_jeu: DateEnJeu | null;
                     photo: Photo | null; avec: Id[]; note: string /*≤1000*/; ordre: number; }

interface Souvenir { id: Id; zoi_id: Id; texte: string /*1–500*/; emotion_id: RefId | null /*ref:emotions*/;
                     tonalite: "positive" | "neutre" | "negative"; zoi_lie_id: Id | null; date_en_jeu: DateEnJeu | null; }

interface AmbitionZoi {
  id: Id; zoi_id: Id; ambition_id: RefId;           // ref:ambitions
  statut: "en_cours" | "accomplie" | "abandonnee"; // au plus 1 "en_cours" par Zoi
  niveau: number;                                   // 1..nombre d'étapes (details.niveaux.length, 3)
  date_fin_en_jeu: DateEnJeu | null;
  objectifs: { id: Id; etape: number; texte: string /*1–200*/; cible: number /*≥1*/;
               progression: number /*0..cible*/; origine: "referentiel" | "joueuse"; ordre: number }[];
}
```

Objectifs **copiés** depuis `details.niveaux[].objectifs` au choix de l'ambition (un patch du référentiel ne modifie pas la fiche). `cible` = `details.niveaux[].cibles[i]` si le champ existe (extension proposée), sinon premier entier du texte (« Préparer 5 boissons » → 5 ; « 50 000 » → 50000), sinon 1 ; toujours modifiable. « Fait » est dérivé : `progression >= cible`.
Sélecteur d'ambition : ambitions dont `details.public` correspond à l'étape de vie du Zoi en premier.
Tonalité du souvenir : déduite de la catégorie de l'émotion (`positive` / `negative`, sinon `neutre`), modifiable.

## 7. Futur et possessions

```ts
interface Projet {
  id: Id; zoi_id: Id; titre: string /*1–120*/;
  type: "objectif" | "idee" | "echeance";
  statut: "a_faire" | "en_cours" | "fait"; termine_le: string | null;
  echeance: DateEnJeu | null; description: string /*≤2000*/; zois_concernes: Id[];
}

interface Possession {
  id: Id; categorie: "vehicule" | "entreprise" | "animal";
  proprietaire: { type: "zoi" | "foyer"; id: Id };
  ref_id: RefId | null;     // vehicule → ref:vehicules ; entreprise → ref:entreprises (type) ; animal → ref:animaux (espèce)
  nom: string | null;       // surnom du véhicule (≤60) / nom de l'entreprise (requis, ≤80) / nom de l'animal (requis, ≤40)
  ville_id: RefId | null; adresse: string | null; // entreprise
  photo: Photo | null; notes: string;
}
```

Les entreprises possédées (`categorie: "entreprise"`, propriétaire Zoi) alimentent aussi la carte Carrière › Affaires.

## 8. Référentiels en base

Chaque élément du seed est copié en base avec, en plus des champs du contrat :

| Champ | Type | Règle |
|---|---|---|
| `origine` | `"seed"` · `"joueuse"` | id d'un ajout joueuse préfixé `perso-` (ex. `perso-reine-du-karaoke`) pour ne jamais entrer en collision avec un futur seed |
| `modifie` | boolean | `true` dès que la joueuse édite un élément du seed |
| `masque` | boolean | exclu des sélecteurs, reste affiché sur les fiches |
| `image` | `Photo \| null` | capture de la joueuse, prioritaire |

Mise à jour du seed (nouvelle version de l'app) : ajoute les nouveaux éléments, met à jour les éléments `seed` non modifiés, ne touche jamais aux éléments `modifie` ou `joueuse`, ne supprime rien.

**Résolution de l'icône** (règle unique, aucun chargement réseau, `icone_url` jamais utilisé à l'exécution) :
`image` → `icone_fichier` de l'élément → `nom_fichier_wiki` recherché dans `assets/icones/manifest.json` → `icone_fichier` de la catégorie (cas des ambitions) → emoji `icone` de l'élément → de la catégorie → initiale.
Les icônes `assets/icones/` sont embarquées comme ressources de l'app (usage personnel, `assets/CREDITS.md`).

| Référentiel | Référencé par |
|---|---|
| etapes-de-vie | `Zoi.etape_de_vie_id` |
| traits, caracteristiques, vies-desirees, desirs, competences, preferences, valeurs | champs homonymes de `Zoi` |
| ecoles, niveaux-etudes, carrieres, freelance | `Zoi.ecole`, `Zoi.carriere`, `Zoi.freelance` |
| villes | `Foyer.ville_id`, `Zoi.logement.ville_id`, `Possession.ville_id` |
| jalons, emotions, ambitions | `JalonZoi`, `Souvenir`, `AmbitionZoi` |
| vehicules, entreprises, animaux | `Possession.ref_id` |
| relations | `Relation.liens[].type_id` |

## 9. Suppression, annulation, export

- **Suppression douce** : `supprime_le` + `lot_suppression_id` posés sur l'objet et ses dépendances ; « Annuler » (toast 8 s, Ctrl/Cmd+Z) restaure tout le lot ; purge définitive à la fermeture de l'app.
- Cascades — Zoi : jalons, souvenirs, ambitions, projets, possessions possédées, relations (et liens) ; ailleurs, son id est retiré de `avec`, `zois_concernes` et `zoi_lie_id` (→ `null`). Foyer : Zois → `foyer_id = null` (ou supprimés si la joueuse le choisit), possessions du foyer supprimées. Famille : `famille_id = null` sur Zois et foyers.
- **Export** : archive `.zip` = `donnees.json` + `images/`. `donnees.json` = `{ format: "inzoi-tracker", version_schema: 1, exporte_le, version_app, donnees: {familles, foyers, zois, relations, jalons_zoi, souvenirs, ambitions_zoi, projets, possessions}, referentiels: {<nom>: éléments joueuse + modifiés + masqués} }`. Import = remplacement complet, précédé d'une copie de sécurité automatique ; `version_schema` supérieure refusée.
- Préférences d'interface (dernier onglet, Zois récents, vue grille / liste, barre latérale, zoom) : stockage local séparé, hors export.

## 10. Champs du brief non repris en V1 (arbitrage CEO)

Genre, jour de naissance en jeu (donc anniversaires à venir), karma, état émotionnel actuel, horaires / télétravail saisis (affichés depuis `carrieres.json` seulement), projets de carrière (couverts par l'onglet Futur).
