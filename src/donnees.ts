// Données de la joueuse : modèle, persistance locale (fichier via Electron, localStorage en navigateur).
import { useEffect, useRef, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { REFERENTIELS, type CleRef, type ElementRef, urlIconeFichier } from './referentiels'
import { ecrireCloud, lireCloud, supabase, televerserImage } from './cloud'

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
  /** Horodatage de la dernière modification (arbitrage appareil / cloud). */
  maj?: number
}

export const vide = (): Donnees => ({ version: 1, foyers: [], zois: [], relations: [], refPerso: {} })

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)

export const nouveauZoi = (foyerId?: string): Zoi => ({
  id: uid(), foyerId, prenom: '', nom: '', caracteristiques: [], desirs: [], competences: {}, valeurs: {},
  souvenirs: [], ambitions: [], preferences: [], ecole: {}, carriere: {}, affaires: [],
  freelance: { licences: [] }, vie: { vehicules: [], animaux: [] }, projets: [], cree: Date.now(),
})

// Stockage dans IndexedDB (le localStorage est limité à ~5 Mo, trop peu pour les photos).
const BASE = 'zoi-tracker'
const CLE = 'donnees'

function ouvrirBase(): Promise<IDBDatabase> {
  return new Promise((ok, ko) => {
    const req = indexedDB.open(BASE, 1)
    req.onupgradeneeded = () => req.result.createObjectStore('etat')
    req.onsuccess = () => ok(req.result)
    req.onerror = () => ko(req.error)
  })
}

async function lireBase(): Promise<string | undefined> {
  const db = await ouvrirBase()
  return new Promise((ok, ko) => {
    const req = db.transaction('etat').objectStore('etat').get(CLE)
    req.onsuccess = () => ok(req.result)
    req.onerror = () => ko(req.error)
  })
}

async function ecrireBase(contenu: string) {
  const db = await ouvrirBase()
  return new Promise<void>((ok, ko) => {
    const tx = db.transaction('etat', 'readwrite')
    tx.objectStore('etat').put(contenu, CLE)
    tx.oncomplete = () => ok()
    tx.onerror = () => ko(tx.error)
  })
}

async function charger(): Promise<Donnees> {
  // Demande au navigateur de ne pas effacer les données en cas de manque d'espace.
  navigator.storage?.persist?.().catch(() => {})
  try {
    const brut = await lireBase()
    return brut ? normaliser(JSON.parse(brut)) : vide()
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
  try { await ecrireBase(JSON.stringify(d)) } catch (e) { console.error('Sauvegarde impossible', e) }
}

export type Statut = 'local' | 'synchro' | 'ok' | 'erreur'

/** État global + sauvegarde automatique : navigateur (400 ms) puis Supabase si connectée (1,5 s). */
export function useDonnees() {
  const [donnees, setDonnees] = useState<Donnees | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [statut, setStatut] = useState<Statut>('local')
  const minuteur = useRef<number>()
  const minuteurCloud = useRef<number>()
  const depuisCloud = useRef(false)

  useEffect(() => {
    charger().then(setDonnees)
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  // À la connexion : on garde la version la plus récente (cloud ou appareil).
  const userId = session?.user.id
  useEffect(() => {
    if (!userId || !donnees) return
    setStatut('synchro')
    lireCloud(userId)
      .then((distant) => {
        if (distant && distant.maj > (donnees.maj ?? 0)) {
          depuisCloud.current = true
          setDonnees(normaliser({ ...distant.contenu, maj: distant.maj }))
          setStatut('ok')
        } else {
          return ecrireCloud(userId, donnees, donnees.maj ?? Date.now()).then(() => setStatut('ok'))
        }
      })
      .catch(() => setStatut('erreur'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, donnees === null])

  useEffect(() => {
    if (!donnees) return
    window.clearTimeout(minuteur.current)
    minuteur.current = window.setTimeout(() => sauver(donnees), 400)
    if (!userId) return
    if (depuisCloud.current) { depuisCloud.current = false; return }
    window.clearTimeout(minuteurCloud.current)
    minuteurCloud.current = window.setTimeout(() => {
      setStatut('synchro')
      ecrireCloud(userId, donnees, donnees.maj ?? Date.now()).then(() => setStatut('ok'), () => setStatut('erreur'))
    }, 1500)
  }, [donnees, userId])

  const maj = (f: (d: Donnees) => Donnees) => setDonnees((d) => (d ? { ...f(d), maj: Date.now() } : d))
  const remplacer = (d: Donnees) => setDonnees({ ...d, maj: Date.now() })
  return { donnees, maj, remplacer, session, statut: userId ? statut : 'local' as Statut }
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

/** Réduit une image importée puis l'envoie dans le cloud si la joueuse est connectée. */
export async function importerImage(fichier: File, taille = 640): Promise<string> {
  return televerserImage(await lireImage(fichier, taille))
}

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
