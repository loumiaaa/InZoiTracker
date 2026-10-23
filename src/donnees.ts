// Données de la joueuse : modèle, persistance locale (fichier via Electron, localStorage en navigateur).
import { useEffect, useRef, useState } from 'react'
import { REFERENTIELS, type CleRef, type ElementRef, urlIconeFichier } from './referentiels'

export type Souvenir = { id: string; jalon?: string; texte: string; date?: string; tonalite?: 'positif' | 'negatif' | 'neutre'; image?: string }
export type AmbitionSuivie = { id: string; ambition: string; niveau: number; faits: string[] }
export type PreferenceZoi = { id: string; aime: boolean }
export type Projet = { id: string; titre: string; statut: 'a-faire' | 'en-cours' | 'fait'; echeance?: string; notes?: string }
export type Affaire = { id: string; type?: string; nom: string; notes?: string; image?: string }

export type Zoi = {
  id: string
  foyerId?: string
  prenom: string
  nom: string
  portrait?: string
  etapeDeVie?: string
  genre?: string
  anniversaire?: string
  vieDesiree?: string
  trait?: string
  caracteristiques: string[]
  desirs: string[]
  competences: Record<string, number>
  valeurs: Record<string, number>
  souvenirs: Souvenir[]
  ambitions: AmbitionSuivie[]
  preferences: PreferenceZoi[]
  ecole: { etablissement?: string; niveauEtudes?: string; moyenne?: string }
  carriere: { carriere?: string; poste?: string; niveau?: number; salaire?: number; notes?: string }
  affaires: Affaire[]
  freelance: { note?: number; gains?: number; licences: string[]; contrats?: number }
  vie: { ville?: string; logement?: string; adresse?: string; vehicules: string[]; animaux: string[]; photoMaison?: string; photoVehicule?: string }
  projets: Projet[]
  notes?: string
  cree: number
}

export type Foyer = { id: string; nom: string; ville?: string; logement?: string; adresse?: string; budget?: number; banniere?: string; notes?: string }

export type Relation = { id: string; a: string; b: string; lien?: string; niveaux: Partial<Record<'amitie' | 'amour' | 'famille' | 'affaires', string>>; notes?: string }

export type RefPerso = { ajouts: ElementRef[]; icones: Record<string, string> }

export type Donnees = {
  version: 1
  foyers: Foyer[]
  zois: Zoi[]
  relations: Relation[]
  refPerso: Partial<Record<CleRef, RefPerso>>
}

export const vide = (): Donnees => ({ version: 1, foyers: [], zois: [], relations: [], refPerso: {} })

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)

export const nouveauZoi = (foyerId?: string): Zoi => ({
  id: uid(), foyerId, prenom: '', nom: '', caracteristiques: [], desirs: [], competences: {}, valeurs: {},
  souvenirs: [], ambitions: [], preferences: [], ecole: {}, carriere: {}, affaires: [],
  freelance: { licences: [] }, vie: { vehicules: [], animaux: [] }, projets: [], cree: Date.now(),
})

declare global {
  interface Window {
    zoiApi?: {
      lire: () => Promise<string | null>
      ecrire: (c: string) => Promise<boolean>
      exporter: (c: string) => Promise<boolean>
      importer: () => Promise<string | null>
    }
  }
}

const CLE_LOCALE = 'zoi-tracker'

async function charger(): Promise<Donnees> {
  try {
    const brut = window.zoiApi ? await window.zoiApi.lire() : localStorage.getItem(CLE_LOCALE)
    if (!brut) return vide()
    return normaliser(JSON.parse(brut))
  } catch {
    return vide()
  }
}

export function normaliser(d: any): Donnees {
  const base = vide()
  return {
    ...base,
    ...d,
    zois: (d.zois ?? []).map((z: any) => ({ ...nouveauZoi(), ...z })),
    foyers: d.foyers ?? [],
    relations: d.relations ?? [],
    refPerso: d.refPerso ?? {},
  }
}

async function sauver(d: Donnees) {
  const contenu = JSON.stringify(d)
  if (window.zoiApi) await window.zoiApi.ecrire(contenu)
  else {
    try { localStorage.setItem(CLE_LOCALE, contenu) } catch { /* quota navigateur dépassé */ }
  }
}

/** État global + sauvegarde automatique (débounce 400 ms). */
export function useDonnees() {
  const [donnees, setDonnees] = useState<Donnees | null>(null)
  const minuteur = useRef<number>()

  useEffect(() => { charger().then(setDonnees) }, [])

  useEffect(() => {
    if (!donnees) return
    window.clearTimeout(minuteur.current)
    minuteur.current = window.setTimeout(() => sauver(donnees), 400)
  }, [donnees])

  const maj = (f: (d: Donnees) => Donnees) => setDonnees((d) => (d ? f(d) : d))
  return { donnees, maj, remplacer: setDonnees }
}

/** Référentiel fusionné : éléments du jeu + ajouts de la joueuse, avec icône résolue. */
export function liste(d: Donnees, cle: CleRef): (ElementRef & { url?: string })[] {
  const ref = REFERENTIELS[cle]
  const perso = d.refPerso[cle]
  const elements = [...(ref?.elements ?? []), ...(perso?.ajouts ?? [])]
  return elements.map((e) => ({ ...e, url: perso?.icones[e.id] ?? urlIconeFichier(e.icone_fichier) }))
}

export function trouver(d: Donnees, cle: CleRef, id?: string) {
  if (!id) return undefined
  return liste(d, cle).find((e) => e.id === id)
}

export const nomComplet = (z: Zoi) => [z.prenom, z.nom].filter(Boolean).join(' ') || 'Zoi sans nom'

/** Réduit une image importée (max `taille` px) et la renvoie en data URL. */
export function lireImage(fichier: File, taille = 640): Promise<string> {
  return new Promise((ok, ko) => {
    const lecteur = new FileReader()
    lecteur.onerror = ko
    lecteur.onload = () => {
      const img = new Image()
      img.onerror = ko
      img.onload = () => {
        const r = Math.min(1, taille / Math.max(img.width, img.height))
        const c = document.createElement('canvas')
        c.width = Math.round(img.width * r)
        c.height = Math.round(img.height * r)
        c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height)
        ok(fichier.type === 'image/png' ? c.toDataURL('image/png') : c.toDataURL('image/jpeg', 0.86))
      }
      img.src = lecteur.result as string
    }
    lecteur.readAsDataURL(fichier)
  })
}
