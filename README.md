# Zoi Tracker

Carnet de bord pour suivre ses familles et ses Zois dans **inZOI** : fiche Zoi calquée sur le jeu (Profil, Souvenirs, Ambitions, Préférences, Valeur, Carrière), plus Relations réciproques, Vie & possessions et Futur (projets).

Application non officielle. inZOI et ses visuels © KRAFTON, Inc. — usage personnel (voir `assets/CREDITS.md`).

## Installer
Les installateurs sont fabriqués par GitHub Actions : onglet **Actions** → **Installateurs** → **Run workflow**, puis télécharger l'artefact `zoi-tracker-windows-latest` (.exe) ou `zoi-tracker-macos-latest` (.dmg).

- **Windows** : si SmartScreen s'affiche, « Informations complémentaires » → « Exécuter quand même ».
- **macOS** : l'app n'est pas signée ; au premier lancement, clic droit sur l'app → **Ouvrir**.

## Développer
```bash
npm install
npm run dev     # interface dans le navigateur (données en localStorage)
npm start       # application Electron
npm run dist    # installateur pour le système courant
```

## Organisation
| Dossier | Contenu |
|---|---|
| `src/` | Interface React (fiche Zoi dans `components/FicheZoi.tsx`) |
| `electron/` | Fenêtre et sauvegarde sur disque |
| `data/referentiels/` | Listes du jeu (traits, ambitions, carrières…) — format dans `docs/contrat-donnees.md` |
| `assets/icones/` | Icônes officielles du jeu |
| `docs/` | Brief, direction artistique, specs UX |
