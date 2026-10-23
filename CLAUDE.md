# inZOI Tracker

Web app installable (PWA, Chrome / Safari) pour suivre ses familles et ses Zois dans le jeu inZOI (Krafton) : foyers, carrières / école, relations, goûts, traits, Vies désirées, ambitions, histoire.

Projet perso d'une graphiste / web designer. Langue de travail et de l'interface : **français**.

## L'équipe (agents dans `.claude/agents/`)
| Agent | Rôle | Livrables |
|---|---|---|
| `ceo` | Vision, priorisation, arbitrage | `docs/brief.md`, `docs/roadmap.md` |
| `directeur-artistique` | Charte inspirée d'inZOI, tokens, visuels | `docs/direction-artistique.md`, tokens CSS |
| `ui-ux-designer` | Parcours, écrans, composants, micro-textes | `docs/ux/` |
| `developpeur` | Code, données, tests, packaging | `src/`, builds |

Ordre habituel : CEO (quoi / pourquoi) → UX (comment ça marche) + DA (à quoi ça ressemble) → Dev (on construit) → CEO valide.

## Stack
Web app installable (PWA) : Vite + React + TypeScript + vite-plugin-pwa · données dans IndexedDB, synchronisées avec Supabase si connectée (`src/cloud.ts`, `supabase/schema.sql`) · publiée sur GitHub Pages à chaque push (`.github/workflows/publier.yml`).

## Règles
- Utilisable hors ligne : données locales d'abord, synchro Supabase ensuite ; export / import JSON.
- Les référentiels du jeu sont des données éditables (le jeu change à chaque patch).
- Visuels Krafton : usage personnel, provenance notée dans `assets/CREDITS.md`.
- Couleurs et typo uniquement via les design tokens.
