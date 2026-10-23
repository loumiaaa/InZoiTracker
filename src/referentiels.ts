// Chargement des référentiels du jeu (data/referentiels/*.json) et de leurs icônes.

export type ElementRef = {
  id: string
  nom: string
  nom_en?: string
  fr_verifie?: boolean
  categorie?: string
  description?: string
  icone?: string
  icone_fichier?: string | null
  details?: Record<string, any>
  perso?: boolean
}

export type CategorieRef = { id: string; nom: string; icone?: string; icone_fichier?: string | null }

export type Referentiel = {
  referentiel: string
  titre: string
  version_jeu?: string
  notes?: string
  categories?: CategorieRef[]
  elements: ElementRef[]
}

const fichiers = import.meta.glob('/data/referentiels/*.json', { eager: true, import: 'default' }) as Record<string, Referentiel>
const icones = import.meta.glob('/assets/icones/**/*.{png,jpg,jpeg,webp}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>

export const REFERENTIELS: Record<string, Referentiel> = {}
for (const [chemin, ref] of Object.entries(fichiers)) {
  const cle = chemin.split('/').pop()!.replace('.json', '')
  REFERENTIELS[cle] = ref
}

export type CleRef =
  | 'etapes-de-vie' | 'traits' | 'caracteristiques' | 'valeurs' | 'vies-desirees' | 'desirs' | 'emotions'
  | 'ambitions' | 'jalons' | 'preferences' | 'competences' | 'carrieres' | 'ecoles' | 'niveaux-etudes'
  | 'freelance' | 'entreprises' | 'villes' | 'vehicules' | 'relations' | 'animaux' | 'logements'

export function urlIconeFichier(fichier?: string | null): string | undefined {
  if (!fichier) return undefined
  return icones['/' + fichier.replace(/^\/+/, '')]
}

/** Inverse d'un lien : si A est « parent » de B, B est « enfant » de A. Les liens absents sont symétriques. */
export const LIEN_INVERSE: Record<string, string> = {
  'parent': 'enfant',
  'enfant': 'parent',
  'parent-biologique': 'enfant',
  'parent-adoptif': 'enfant-adopte',
  'enfant-adopte': 'parent-adoptif',
  'grand-parent': 'petit-enfant',
  'petit-enfant': 'grand-parent',
  'arriere-grand-parent': 'arriere-petit-enfant',
  'arriere-petit-enfant': 'arriere-grand-parent',
  'oncle-tante': 'neveu-niece',
  'neveu-niece': 'oncle-tante',
  'beau-parent-conjoint': 'gendre-belle-fille',
  'gendre-belle-fille': 'beau-parent-conjoint',
  'beau-parent-recompose': 'bel-enfant',
  'bel-enfant': 'beau-parent-recompose',
  'admirateur-secret': 'connaissance',
  'coup-de-coeur-non-partage': 'connaissance',
  'membre-du-personnel': 'collegue-de-travail',
}
export const inverseLien = (lien: string) => LIEN_INVERSE[lien] ?? lien

export const JAUGES = [
  { id: 'amitie', nom: 'Amitié', categorie: 'niveau-amitie' },
  { id: 'amour', nom: 'Amour', categorie: 'niveau-amour' },
  { id: 'famille', nom: 'Famille', categorie: 'niveau-famille' },
  { id: 'affaires', nom: 'Affaires', categorie: 'niveau-affaires' },
] as const
