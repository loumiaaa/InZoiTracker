# Contrat de données — référentiels du jeu

Les listes du jeu (traits, ambitions, carrières…) vivent dans `data/referentiels/*.json`. Elles servent de **seed** : l'app les charge au premier lancement, puis la joueuse peut les modifier / compléter dans l'app.

## Format d'un fichier

```json
{
  "referentiel": "traits",
  "titre": "Traits de caractère",
  "maj": "2026-10-23",
  "version_jeu": "v0.8+ (à confirmer)",
  "sources": ["https://…"],
  "notes": "Points incertains, divergences entre sources…",
  "elements": [
    {
      "id": "adepte-des-mondanites",
      "nom": "Adepte des mondanités",
      "nom_en": "Socialite",
      "fr_verifie": true,
      "categorie": "social",
      "description": "…",
      "icone": "🎭",
      "icone_url": null,
      "details": {},
      "source": "https://…"
    }
  ]
}
```

| Champ | Règle |
|---|---|
| `id` | slug kebab-case unique dans le fichier, sans accents |
| `nom` | libellé **français tel qu'affiché dans le jeu en FR** |
| `nom_en` | libellé anglais officiel |
| `fr_verifie` | `true` seulement si le libellé FR vient d'une source FR ou d'une capture du jeu ; sinon traduction proposée → `false` |
| `categorie` | id d'une catégorie (liste des catégories dans `categories` au niveau fichier si utile) |
| `icone` | emoji de remplacement en attendant l'icône officielle |
| `icone_url` | URL de l'icône officielle si trouvée, sinon `null` |
| `details` | champs propres au référentiel (voir ci-dessous) |

Un fichier peut avoir un tableau `categories: [{ "id", "nom", "nom_en", "icone" }]`.

## Détails par référentiel
| Fichier | `details` |
|---|---|
| `etapes-de-vie.json` | `ordre`, `duree_jours`, `peut_travailler`, `ecole` |
| `traits.json` | `valeurs: [id]` (4 valeurs de départ), `caracteristiques: [id]` |
| `caracteristiques.json` | — (ex. Sociable, Génie) |
| `valeurs.json` | `oppose` (id de la valeur opposée si le jeu fonctionne en paires) |
| `vies-desirees.json` | `ambition`, `valeurs: [id]`, `competences: [id]`, `preferences: [id]` |
| `ambitions.json` | `niveaux: [{ "niveau": 1, "objectifs": ["…"] }]`, `recompenses: ["…"]` |
| `desirs.json` | — |
| `emotions.json` | — |
| `jalons.json` | `etape_de_vie` |
| `preferences.json` | `sous_categorie` |
| `competences.json` | `niveau_max` |
| `carrieres.json` | `ville`, `employeur`, `secteur`, `postes: [{ "niveau", "nom", "salaire", "horaires" }]`, `teletravail` |
| `ecoles.json` | `type` (primaire / collège-lycée / université), `ville` |
| `niveaux-etudes.json` | `ordre` |
| `freelance.json` | `licences` |
| `entreprises.json` | `type` |
| `villes.json` | `quartiers: ["…"]`, `dlc` |
| `vehicules.json` | `type` (voiture, moto, vélo…), `prix` |
| `relations.json` | `type` (lien familial / amical / amoureux / statut) |
| `animaux.json` | `espece` |
