# Zoi Tracker

Carnet de bord pour suivre ses familles et ses Zois dans **inZOI** : fiche Zoi calquée sur le jeu (Profil, Souvenirs, Ambitions, Préférences, Valeur, Carrière), plus Relations réciproques avec compatibilité, Arbre généalogique, Vie & possessions et Futur (projets). Pages transverses : Calendrier de vie, Chronique automatique, Mémorial, Carte des relations, Dynastie par famille, Statistiques, Import depuis les sauvegardes du jeu, mode sombre.

Application non officielle. inZOI et ses visuels © KRAFTON, Inc. — usage personnel (voir `assets/CREDITS.md`).

## Installer
Zoi Tracker est une web app installable (PWA) :
- **Chrome / Edge** : ouvrir l'adresse de l'app → icône « Installer » dans la barre d'adresse.
- **Safari (Mac)** : Fichier → **Ajouter au Dock**. **iPhone / iPad** : Partager → **Sur l'écran d'accueil**.

Chaque nouvelle version publiée s'installe toute seule au lancement suivant. Connecte-toi dans Réglages pour synchroniser données et photos entre tes appareils (Supabase) ; l'export JSON reste disponible comme copie de secours.

## Développer
```bash
npm install
npm run dev       # serveur de développement
npm run build     # version de production dans dist/
npm run preview   # tester la version de production
```

## Organisation
| Dossier | Contenu |
|---|---|
| `src/` | Interface React (fiche Zoi dans `components/FicheZoi.tsx`) |
| `public/` | Icônes de l'app (PWA) |
| `data/referentiels/` | Listes du jeu (traits, ambitions, carrières…) — format dans `docs/contrat-donnees.md` |
| `assets/icones/` | Icônes officielles du jeu |
| `docs/` | Brief, direction artistique, specs UX |
