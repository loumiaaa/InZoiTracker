// Données de la joueuse : modèle, persistance locale (IndexedDB) et synchro Supabase.
import { useEffect, useRef, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { REFERENTIELS, type CleRef, type ElementRef, urlIconeFichier } from './referentiels'
import { ecrireCloud, lireCloud, supabase, televerserImage } from './cloud'

export type Souvenir = { id: string; jalon?: string; texte: string; date?: string; tonalite?: 'positif' | 'negatif' | 'neutre'; image?: string }
export type AmbitionSuivie = { id: string; ambition: string; niveau: number; faits: string[] }
export type PreferenceZoi = { id: string; aime: boolean }
export type Projet = { id: string; titre: string; statut: 'a-faire' | 'en-cours' | 'fait'; echeance?: string; echeanceJour?: number; notes?: string }
export type EntreeJournal = { id: string; quand: number; jour?: number; zoiId?: string; foyerId?: string; type: string; texte: string }
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
  decede?: boolean
  deces?: { date?: string; cause?: string; epitaphe?: string }
  /** Jour de jeu (compteur du foyer) où le Zoi est entré dans son étape de vie actuelle. */
  etapeDepuisJour?: number
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

export type Foyer = {
  id: string; nom: string; ville?: string; logement?: string; adresse?: string; budget?: number; banniere?: string; notes?: string
  /** Compteur de jours de jeu, avancé par la joueuse. */
  jourActuel?: number
  heritier?: string
  objectifs?: { id: string; texte: string; fait: boolean }[]
}

export type Relation = { id: string; a: string; b: string; lien?: string; niveaux: Partial<Record<'amitie' | 'amour' | 'famille' | 'affaires', string>>; notes?: string }

export type RefPerso = { ajouts: ElementRef[]; icones: Record<string, string>; noms?: Record<string, string> }

export type Donnees = {
  version: 1
  foyers: Foyer[]
  zois: Zoi[]
  relations: Relation[]
  refPerso: Partial<Record<CleRef, RefPerso>>
  journal?: EntreeJournal[]
  reglages?: { theme?: 'clair' | 'sombre' | 'systeme'; dernierExport?: number }
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

  const maj = (f: (d: Donnees) => Donnees) => setDonnees((d) => (d ? journaliser(d, { ...f(d), maj: Date.now() }) : d))
  const remplacer = (d: Donnees) => setDonnees({ ...d, maj: Date.now() })
  return { donnees, maj, remplacer, session, statut: userId ? statut : 'local' as Statut }
}

/** Référentiel fusionné : éléments du jeu + ajouts de la joueuse, avec icône résolue. */
export function liste(d: Donnees, cle: CleRef): (ElementRef & { url?: string })[] {
  const ref = REFERENTIELS[cle]
  const perso = d.refPerso[cle]
  const elements = [...(ref?.elements ?? []), ...(perso?.ajouts ?? [])]
  return elements.map((e) => ({ ...e, nom: perso?.noms?.[e.id] ?? e.nom, fr_verifie: perso?.noms?.[e.id] ? true : e.fr_verifie, url: perso?.icones[e.id] ?? urlIconeFichier(e.icone_fichier) }))
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

const nomRef = (d: Donnees, cle: CleRef, id?: string) => (id ? trouver(d, cle, id)?.nom ?? id : undefined)

/** Ajoute au journal les changements marquants entre deux états (promotion, mariage, naissance, décès…). */
export function journaliser(avant: Donnees, apres: Donnees): Donnees {
  const ajouts: EntreeJournal[] = []
  const jourDe = (z?: Zoi) => apres.foyers.find((f) => f.id === z?.foyerId)?.jourActuel
  const noter = (z: Zoi | undefined, type: string, texte: string) =>
    ajouts.push({ id: uid(), quand: Date.now(), jour: jourDe(z), zoiId: z?.id, foyerId: z?.foyerId, type, texte })
  const anciens = new Map(avant.zois.map((z) => [z.id, z]))
  for (const z of apres.zois) {
    const v = anciens.get(z.id)
    const n = nomComplet(z)
    if (!v) continue
    if (z.prenom && !v.prenom) {
      const parents = apres.relations.flatMap((r) => (r.a === z.id && r.lien === 'parent' ? [r.b] : r.b === z.id && r.lien === 'enfant' ? [r.a] : []))
        .map((id) => apres.zois.find((x) => x.id === id)?.prenom).filter(Boolean)
      if (parents.length) noter(z, 'naissance', `${z.prenom} rejoint la famille, enfant de ${parents.join(' et ')}`)
    }
    if (z.etapeDeVie && z.etapeDeVie !== v.etapeDeVie && v.etapeDeVie) noter(z, 'etape', `${n} passe à l'étape « ${nomRef(apres, 'etapes-de-vie', z.etapeDeVie)} »`)
    if (z.decede && !v.decede) noter(z, 'deces', `${n} nous a quittés`)
    if (z.carriere.carriere && z.carriere.carriere !== v.carriere.carriere) noter(z, 'carriere', `${n} commence chez ${nomRef(apres, 'carrieres', z.carriere.carriere)}`)
    else if (z.carriere.poste && v.carriere.poste && z.carriere.poste !== v.carriere.poste) noter(z, 'carriere', `${n} devient ${z.carriere.poste}`)
    if (z.ecole.niveauEtudes && z.ecole.niveauEtudes !== v.ecole.niveauEtudes) noter(z, 'ecole', `${n} : ${nomRef(apres, 'niveaux-etudes', z.ecole.niveauEtudes)}`)
    for (const a of z.ambitions) {
      const ancienne = v.ambitions.find((x) => x.id === a.id)
      if (ancienne && a.niveau > ancienne.niveau) noter(z, 'ambition', `${n} atteint le niveau ${a.niveau} de « ${nomRef(apres, 'ambitions', a.ambition)} »`)
    }
    for (const s of z.souvenirs) if (s.jalon && !v.souvenirs.some((x) => x.jalon === s.jalon)) noter(z, 'jalon', `${n} : ${nomRef(apres, 'jalons', s.jalon)}`)
  }
  const anciennesRel = new Map(avant.relations.map((r) => [r.id, r]))
  for (const r of apres.relations) {
    if (!r.lien || anciennesRel.get(r.id)?.lien === r.lien) continue
    const a = apres.zois.find((z) => z.id === r.a), b = apres.zois.find((z) => z.id === r.b)
    if (!a || !b || !a.prenom || !b.prenom) continue
    if (r.lien === 'enfant') noter(b, 'naissance', `${b.prenom} rejoint la famille, enfant de ${a.prenom}`)
    if (r.lien === 'parent') noter(a, 'naissance', `${a.prenom} rejoint la famille, enfant de ${b.prenom}`)
    if (r.lien === 'marie') noter(a, 'mariage', `${a.prenom} et ${b.prenom} se marient`)
    if (r.lien === 'fiance') noter(a, 'mariage', `${a.prenom} et ${b.prenom} se fiancent`)
    if (r.lien === 'partenaire-amoureux') noter(a, 'amour', `${a.prenom} et ${b.prenom} sont en couple`)
    if (r.lien === 'divorce') noter(a, 'amour', `${a.prenom} et ${b.prenom} divorcent`)
  }
  return ajouts.length ? { ...apres, journal: [...(apres.journal ?? []), ...ajouts] } : apres
}

/** Étapes de vie : jours restants avant l'étape suivante (si le foyer a un compteur de jours). */
export function prochaineEtape(d: Donnees, z: Zoi): { suivante?: ElementRef; dans?: number } {
  const etapes = liste(d, 'etapes-de-vie').filter((e) => e.details?.ordre != null).sort((a, b) => a.details!.ordre - b.details!.ordre)
  const i = etapes.findIndex((e) => e.id === z.etapeDeVie)
  if (i < 0 || i === etapes.length - 1) return {}
  const duree = Number(etapes[i].details?.duree_jours)
  const foyer = d.foyers.find((f) => f.id === z.foyerId)
  const jour = foyer ? foyer.jourActuel ?? 0 : undefined
  if (!duree || jour == null || z.etapeDepuisJour == null) return { suivante: etapes[i + 1] }
  return { suivante: etapes[i + 1], dans: z.etapeDepuisJour + duree - jour }
}
