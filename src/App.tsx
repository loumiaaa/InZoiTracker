import { useEffect, useMemo, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { ArrowLeft, Desktop, Moon, Sun, CloudArrowUp, CloudCheck, CloudWarning, DownloadSimple, HardDrives, MagnifyingGlass, Plus, SignOut, Trash, UploadSimple, X } from '@phosphor-icons/react'
import { type Donnees, type Foyer, type Statut, importerImage, liste, nomComplet, normaliser, nouveauZoi, trouver, uid, useDonnees } from './donnees'
import { REFERENTIELS, type CleRef, urlIconeFichier } from './referentiels'
import { supabase } from './cloud'
import { FicheZoi } from './components/FicheZoi'
import { Calendrier, CarteRelations, Chronique, Dynastie, ImportJeu, Memorial, SaisieExpress, Statistiques } from './components/Vues'
import { Avatar, BoutonIcone, Champ, Confirmer, DonneesCtx, EnTete, Icone, Modale, Panneau, Photo, Selecteur, Vide, urlMarque, useCtx } from './components/ui'

type Page = { nom: 'accueil' } | { nom: 'foyers' } | { nom: 'foyer'; id: string } | { nom: 'zois' } | { nom: 'zoi'; id: string; retour: Page } | { nom: 'referentiels' } | { nom: 'reglages' }
  | { nom: 'calendrier' } | { nom: 'chronique' } | { nom: 'memorial' } | { nom: 'reseau' } | { nom: 'stats' } | { nom: 'jeu' }

const NAV: { section: string; pages: { nom: Page['nom']; libelle: string; icone: string }[] }[] = [
  { section: 'Mes Zois', pages: [
    { nom: 'accueil', libelle: 'Accueil', icone: 'desirs/Urge_Resort.png' },
    { nom: 'foyers', libelle: 'Familles', icone: 'desirs/Urge_Friends.png' },
    { nom: 'zois', libelle: 'Zois', icone: 'caracteristiques/Characteristic_Cheerful.png' },
    { nom: 'reseau', libelle: 'Relations', icone: 'desirs/Urge_Love.png' },
  ] },
  { section: 'Histoire', pages: [
    { nom: 'calendrier', libelle: 'Calendrier', icone: 'desirs/Urge_Newspaper.png' },
    { nom: 'chronique', libelle: 'Chronique', icone: 'desirs/Urge_Doodle.png' },
    { nom: 'memorial', libelle: 'Mémorial', icone: 'desirs/Urge_Rest.png' },
  ] },
  { section: 'Outils', pages: [
    { nom: 'stats', libelle: 'Statistiques', icone: 'desirs/Urge_Logic.png' },
    { nom: 'jeu', libelle: 'Import du jeu', icone: 'desirs/Urge_Games.png' },
    { nom: 'referentiels', libelle: 'Référentiels', icone: 'desirs/Urge_Read.png' },
    { nom: 'reglages', libelle: 'Réglages', icone: 'desirs/Urge_Smartphone.png' },
  ] },
]

const STATUT: Record<Statut, { libelle: string; Icone: typeof CloudCheck }> = {
  local: { libelle: 'Sur cet appareil', Icone: HardDrives },
  synchro: { libelle: 'Synchronisation…', Icone: CloudArrowUp },
  ok: { libelle: 'Synchronisé', Icone: CloudCheck },
  erreur: { libelle: 'Synchro en échec', Icone: CloudWarning },
}

export default function App() {
  const { donnees, maj, remplacer, session, statut } = useDonnees()
  const [page, setPage] = useState<Page>({ nom: 'accueil' })
  const [palette, setPalette] = useState(false)
  const theme = donnees?.reglages?.theme ?? 'systeme'
  useEffect(() => {
    if (theme === 'systeme') document.documentElement.removeAttribute('data-theme')
    else document.documentElement.setAttribute('data-theme', theme === 'sombre' ? 'dark' : 'light')
  }, [theme])

  useEffect(() => {
    const raccourci = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPalette((p) => !p) }
    }
    window.addEventListener('keydown', raccourci)
    return () => window.removeEventListener('keydown', raccourci)
  }, [])

  if (!donnees) return <div className="chargement"><img src={urlMarque('Psycat_Icon.png')} alt="" /></div>

  const ouvrirZoi = (id: string) => setPage((p) => ({ nom: 'zoi', id, retour: p.nom === 'zoi' ? p.retour : p }))
  const creerZoi = (foyerId?: string) => {
    const z = nouveauZoi(foyerId)
    if (foyerId) z.nom = donnees.foyers.find((f) => f.id === foyerId)?.nom ?? ''
    maj((d) => ({ ...d, zois: [...d.zois, z] }))
    ouvrirZoi(z.id)
  }
  const creerFoyer = () => {
    const f: Foyer = { id: uid(), nom: '' }
    maj((d) => ({ ...d, foyers: [...d.foyers, f] }))
    setPage({ nom: 'foyer', id: f.id })
  }
  const actif = page.nom === 'zoi' ? 'zois' : page.nom === 'foyer' ? 'foyers' : page.nom
  const S = STATUT[statut]
  const cle = page.nom + ('id' in page ? page.id : '')

  return (
    <DonneesCtx.Provider value={{ d: donnees, maj }}>
      <div className="app">
        <aside className="barre">
          <div className="logo">
            <img src={urlMarque('Psycat_Icon.png')} alt="" />
            <span>Zoi<b>Tracker</b></span>
          </div>
          <button className="recherche-globale" onClick={() => setPalette(true)}>
            <MagnifyingGlass size={16} weight="bold" /><span>Rechercher</span><kbd>{navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} K</kbd>
          </button>
          <nav>
            {NAV.map((g) => (
              <div key={g.section} className="nav-section">
                <span className="nav-titre">{g.section}</span>
                {g.pages.map((n) => (
                  <button key={n.nom} className={'nav' + (actif === n.nom ? ' nav-actif' : '')} onClick={() => setPage({ nom: n.nom } as Page)}>
                    <img src={urlIconeFichier('assets/icones/' + n.icone)} alt="" />{n.libelle}
                  </button>
                ))}
              </div>
            ))}
          </nav>
          <button className="btn btn-accent btn-bloc" onClick={() => creerZoi()}><Plus size={18} weight="bold" />Nouveau Zoi</button>
          <button className={'synchro synchro-' + statut} onClick={() => setPage({ nom: 'reglages' })}><S.Icone size={16} weight="bold" />{S.libelle}</button>
        </aside>
        <main className="contenu">
          <div key={cle} className="page">
            {page.nom === 'accueil' && <Accueil ouvrirZoi={ouvrirZoi} ouvrirFoyer={(id) => setPage({ nom: 'foyer', id })} creerFoyer={creerFoyer} creerZoi={creerZoi} />}
            {page.nom === 'foyers' && <Foyers ouvrir={(id) => setPage({ nom: 'foyer', id })} creer={creerFoyer} />}
            {page.nom === 'foyer' && <DetailFoyer id={page.id} ouvrirZoi={ouvrirZoi} creerZoi={creerZoi} retour={() => setPage({ nom: 'foyers' })} />}
            {page.nom === 'zois' && <Zois ouvrir={ouvrirZoi} creer={() => creerZoi()} />}
            {page.nom === 'zoi' && <FicheZoi id={page.id} ouvrir={ouvrirZoi} fermer={() => setPage(page.retour)} />}
            {page.nom === 'referentiels' && <Referentiels />}
            {page.nom === 'reglages' && <Reglages remplacer={remplacer} session={session} />}
            {page.nom === 'calendrier' && <Calendrier ouvrirZoi={ouvrirZoi} />}
            {page.nom === 'chronique' && <Chronique ouvrirZoi={ouvrirZoi} />}
            {page.nom === 'memorial' && <Memorial ouvrirZoi={ouvrirZoi} />}
            {page.nom === 'reseau' && <CarteRelations ouvrirZoi={ouvrirZoi} />}
            {page.nom === 'stats' && <Statistiques />}
            {page.nom === 'jeu' && <ImportJeu ouvrirZoi={ouvrirZoi} />}
          </div>
        </main>
        {palette && <Palette fermer={() => setPalette(false)} ouvrirZoi={ouvrirZoi} ouvrirFoyer={(id) => setPage({ nom: 'foyer', id })} />}
      </div>
    </DonneesCtx.Provider>
  )
}

/** Recherche rapide (Ctrl/Cmd + K) parmi les Zois et les familles. */
function Palette({ fermer, ouvrirZoi, ouvrirFoyer }: { fermer: () => void; ouvrirZoi: (id: string) => void; ouvrirFoyer: (id: string) => void }) {
  const { d } = useCtx()
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const norm = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
  const resultats = [
    ...d.zois.map((z) => ({ id: z.id, type: 'zoi' as const, nom: nomComplet(z), info: d.foyers.find((f) => f.id === z.foyerId)?.nom ?? 'Zoi', img: z.portrait })),
    ...d.foyers.map((f) => ({ id: f.id, type: 'foyer' as const, nom: f.nom || 'Famille sans nom', info: 'Famille', img: f.banniere })),
  ].filter((r) => norm(r.nom).includes(norm(q))).slice(0, 8)
  const aller = (r: (typeof resultats)[number]) => { (r.type === 'zoi' ? ouvrirZoi : ouvrirFoyer)(r.id); fermer() }

  return (
    <Modale titre="Rechercher" onFermer={fermer}>
      <label className="recherche">
        <MagnifyingGlass size={18} weight="bold" />
        <input autoFocus placeholder="Un Zoi, une famille…" value={q} onChange={(e) => { setQ(e.target.value); setSel(0) }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, resultats.length - 1)) }
            if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)) }
            if (e.key === 'Enter' && resultats[sel]) aller(resultats[sel])
          }} />
      </label>
      <div className="palette-liste">
        {resultats.map((r, i) => (
          <button key={r.type + r.id} className={'ligne-liste' + (i === sel ? ' ligne-active' : '')} onMouseEnter={() => setSel(i)} onClick={() => aller(r)}>
            <Avatar src={r.img} nom={r.nom} taille={36} />
            <span>{r.nom}</span>
            <small>{r.info}</small>
          </button>
        ))}
        {resultats.length === 0 && <p className="vide">Aucun résultat.</p>}
      </div>
    </Modale>
  )
}

function CarteZoi({ id, ouvrir }: { id: string; ouvrir: (id: string) => void }) {
  const { d } = useCtx()
  const z = d.zois.find((x) => x.id === id)!
  const etape = trouver(d, 'etapes-de-vie', z.etapeDeVie)
  const trait = trouver(d, 'traits', z.trait)
  const carriere = trouver(d, 'carrieres', z.carriere.carriere)
  return (
    <button className="carte-zoi" onClick={() => ouvrir(id)}>
      <Avatar src={z.portrait} nom={nomComplet(z)} taille={84} decede={z.decede} />
      <strong>{nomComplet(z)}</strong>
      <small>{z.decede ? 'Décédé·e' : [etape?.nom, trait?.nom].filter(Boolean).join(' · ') || 'Fiche à compléter'}</small>
      {carriere && <span className="badge"><Icone el={carriere} taille={16} />{carriere.nom}</span>}
    </button>
  )
}

function Accueil({ ouvrirZoi, ouvrirFoyer, creerFoyer, creerZoi }: { ouvrirZoi: (id: string) => void; ouvrirFoyer: (id: string) => void; creerFoyer: () => void; creerZoi: () => void }) {
  const { d, maj } = useCtx()
  const projets = d.zois.flatMap((z) => z.projets.filter((p) => p.statut !== 'fait').map((p) => ({ z, p })))
  const ambitions = d.zois.flatMap((z) => z.ambitions.map((a) => ({ z, a, ref: trouver(d, 'ambitions', a.ambition) })))
  const heure = new Date().getHours()

  if (d.zois.length === 0 && d.foyers.length === 0) {
    return (
      <div className="accueil-vide">
        <img src={urlMarque('Psycat_Icon.png')} alt="" />
        <h1>Bienvenue dans ton carnet de Zois</h1>
        <p>Commence par créer une famille, puis ajoute ses membres.</p>
        <div className="actions actions-centre">
          <button className="btn btn-accent btn-grand" onClick={creerFoyer}>Créer une famille</button>
          <button className="btn btn-grand" onClick={() => creerZoi()}>Ajouter un Zoi seul</button>
        </div>
      </div>
    )
  }

  const stats = [
    { n: d.foyers.length, l: 'familles', i: 'desirs/Urge_Friends.png' },
    { n: d.zois.length, l: 'Zois', i: 'caracteristiques/Characteristic_Cheerful.png' },
    { n: d.relations.length, l: 'liens', i: 'desirs/Urge_Love.png' },
    { n: projets.length, l: 'projets en cours', i: 'desirs/Urge_Newspaper.png' },
  ]

  return (
    <div className="pile">
      <EnTete titre={heure < 18 ? 'Bonjour' : 'Bonsoir'} sousTitre="Voici où en sont tes Zois." />
      {Date.now() - (d.reglages?.dernierExport ?? d.zois[0]?.cree ?? Date.now()) > 7 * 864e5 && (
        <div className="bandeau">Ta dernière sauvegarde de secours date de plus d'une semaine. <button className="btn btn-doux btn-petit" onClick={() => exporterDonnees(d, maj)}><DownloadSimple size={14} weight="bold" />Exporter maintenant</button></div>
      )}
      <SaisieExpress />
      <div className="stats">
        {stats.map((s) => (
          <div key={s.l} className="stat">
            <img src={urlIconeFichier('assets/icones/' + s.i)} alt="" />
            <div><b>{s.n}</b><span>{s.l}</span></div>
          </div>
        ))}
      </div>
      <Panneau titre="Mes familles" action={<button className="btn btn-doux btn-petit" onClick={creerFoyer}><Plus size={14} weight="bold" />Famille</button>}>
        <div className="grille-foyers">
          {d.foyers.map((f) => <CarteFoyer key={f.id} f={f} ouvrir={ouvrirFoyer} />)}
        </div>
      </Panneau>
      <div className="grille-2">
        <Panneau titre="Projets à venir">
          {projets.slice(0, 8).map(({ z, p }) => (
            <button key={p.id} className="ligne-liste" onClick={() => ouvrirZoi(z.id)}>
              <Avatar src={z.portrait} nom={nomComplet(z)} taille={36} />
              <span>{p.titre}<small>{nomComplet(z)}</small></span>
              <span className={'statut-puce statut-' + p.statut}>{p.statut === 'en-cours' ? 'En cours' : 'À faire'}</span>
            </button>
          ))}
          {projets.length === 0 && <p className="vide">Ajoute des projets depuis l'onglet « Futur » d'un Zoi.</p>}
        </Panneau>
        <Panneau titre="Ambitions en cours">
          {ambitions.slice(0, 8).map(({ z, a, ref }) => (
            <button key={a.id} className="ligne-liste" onClick={() => ouvrirZoi(z.id)}>
              <Avatar src={z.portrait} nom={nomComplet(z)} taille={36} />
              <span>{ref?.nom ?? a.ambition}<small>{nomComplet(z)}</small></span>
              <span className="progression"><i style={{ width: `${(a.niveau / 3) * 100}%` }} /></span>
            </button>
          ))}
          {ambitions.length === 0 && <p className="vide">Aucune ambition suivie pour l'instant.</p>}
        </Panneau>
      </div>
    </div>
  )
}

function CarteFoyer({ f, ouvrir }: { f: Foyer; ouvrir: (id: string) => void }) {
  const { d } = useCtx()
  const ville = trouver(d, 'villes', f.ville)
  const membres = d.zois.filter((z) => z.foyerId === f.id)
  return (
    <button className="carte-foyer" onClick={() => ouvrir(f.id)}>
      <div className="banniere" style={f.banniere ? { backgroundImage: `url(${f.banniere})` } : undefined} />
      <div className="carte-foyer-pied">
        <div>
          <strong>{f.nom || 'Famille sans nom'}</strong>
          <small>{ville?.nom ?? 'Ville non renseignée'} · {membres.length} membre{membres.length > 1 ? 's' : ''}</small>
        </div>
        <span className="pile-avatars">
          {membres.slice(0, 5).map((z) => <Avatar key={z.id} src={z.portrait} nom={nomComplet(z)} taille={30} decede={z.decede} />)}
        </span>
      </div>
    </button>
  )
}

function Foyers({ ouvrir, creer }: { ouvrir: (id: string) => void; creer: () => void }) {
  const { d } = useCtx()
  return (
    <div className="pile">
      <EnTete titre="Familles" sousTitre={`${d.foyers.length} foyer${d.foyers.length > 1 ? 's' : ''}`}>
        <button className="btn btn-accent" onClick={creer}><Plus size={16} weight="bold" />Nouvelle famille</button>
      </EnTete>
      <div className="grille-foyers">{d.foyers.map((f) => <CarteFoyer key={f.id} f={f} ouvrir={ouvrir} />)}</div>
      {d.foyers.length === 0 && <Vide titre="Aucune famille" texte="Crée ta première famille pour y regrouper tes Zois." />}
    </div>
  )
}

function DetailFoyer({ id, ouvrirZoi, creerZoi, retour }: { id: string; ouvrirZoi: (id: string) => void; creerZoi: (f: string) => void; retour: () => void }) {
  const { d, maj } = useCtx()
  const [suppr, setSuppr] = useState(false)
  const f = d.foyers.find((x) => x.id === id)
  if (!f) return <Vide titre="Cette famille n'existe plus." />
  const set = (p: Partial<Foyer>) => maj((d) => ({ ...d, foyers: d.foyers.map((x) => (x.id === id ? { ...x, ...p } : x)) }))
  const membres = d.zois.filter((z) => z.foyerId === id)

  return (
    <div className="pile">
      <div className="barre-retour">
        <button className="btn btn-fantome" onClick={retour}><ArrowLeft size={16} weight="bold" />Familles</button>
        <BoutonIcone label="Supprimer la famille" className="btn-icone-danger" onClick={() => setSuppr(true)}><Trash size={18} weight="bold" /></BoutonIcone>
      </div>
      <div className="banniere-edition">
        <Photo src={f.banniere} onChange={(banniere) => set({ banniere })} ratio="4/1" libelle="Ajouter une bannière : capture de la maison, de la famille…" taille={1600} />
        <input className="nom-famille" value={f.nom} placeholder="Nom de la famille" onChange={(e) => set({ nom: e.target.value })} aria-label="Nom de la famille" autoFocus={!f.nom} />
      </div>
      <div className="grille-2-1">
        <Panneau titre={`Membres · ${membres.length}`} action={<button className="btn btn-doux btn-petit" onClick={() => creerZoi(id)}><Plus size={14} weight="bold" />Membre</button>}>
          <div className="grille-zois">{membres.map((z) => <CarteZoi key={z.id} id={z.id} ouvrir={ouvrirZoi} />)}</div>
          {membres.length === 0 && <Vide titre="Aucun membre" texte="Ajoute le premier Zoi de cette famille." />}
        </Panneau>
        <Panneau titre="Foyer">
          <div className="formulaire">
            <Champ label="Ville"><Selecteur cle="villes" valeur={f.ville} onChange={(ville) => set({ ville })} /></Champ>
            <Champ label="Logement / terrain"><Selecteur cle="logements" valeur={f.logement} onChange={(logement) => set({ logement })}
              filtre={f.ville ? (e) => !e.details?.ville || e.details.ville === f.ville : undefined} /></Champ>
            <Champ label="Adresse"><input className="input" value={f.adresse ?? ''} onChange={(e) => set({ adresse: e.target.value })} /></Champ>
            <Champ label="Budget (Miaou)"><input className="input" type="number" value={f.budget ?? ''} onChange={(e) => set({ budget: e.target.value ? +e.target.value : undefined })} /></Champ>
            <Champ label="Notes"><textarea className="input" rows={3} value={f.notes ?? ''} onChange={(e) => set({ notes: e.target.value })} /></Champ>
          </div>
        </Panneau>
      </div>
      <Dynastie foyerId={id} ouvrirZoi={ouvrirZoi} />
      {suppr && (
        <Confirmer message={`Supprimer la famille « ${f.nom || 'sans nom'} » ? Ses Zois sont conservés, sans foyer.`} onNon={() => setSuppr(false)}
          onOui={() => { maj((d) => ({ ...d, foyers: d.foyers.filter((x) => x.id !== id), zois: d.zois.map((z) => (z.foyerId === id ? { ...z, foyerId: undefined } : z)) })); retour() }} />
      )}
    </div>
  )
}

function Zois({ ouvrir, creer }: { ouvrir: (id: string) => void; creer: () => void }) {
  const { d } = useCtx()
  const [q, setQ] = useState('')
  const [foyer, setFoyer] = useState('')
  const zois = d.zois.filter((z) => (!foyer || z.foyerId === foyer) && nomComplet(z).toLowerCase().includes(q.toLowerCase()))
  return (
    <div className="pile">
      <EnTete titre="Zois" sousTitre={`${d.zois.length} Zoi${d.zois.length > 1 ? 's' : ''}`}>
        <button className="btn btn-accent" onClick={creer}><Plus size={16} weight="bold" />Nouveau Zoi</button>
      </EnTete>
      <div className="filtres">
        <label className="recherche">
          <MagnifyingGlass size={18} weight="bold" />
          <input placeholder="Rechercher un Zoi…" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <div className="segment">
          <button className={foyer === '' ? 'actif' : ''} onClick={() => setFoyer('')}>Toutes</button>
          {d.foyers.map((f) => <button key={f.id} className={foyer === f.id ? 'actif' : ''} onClick={() => setFoyer(f.id)}>{f.nom || 'Sans nom'}</button>)}
        </div>
      </div>
      <div className="grille-zois">{zois.map((z) => <CarteZoi key={z.id} id={z.id} ouvrir={ouvrir} />)}</div>
      {zois.length === 0 && <Vide titre="Aucun Zoi trouvé" />}
    </div>
  )
}

function Referentiels() {
  const { d, maj } = useCtx()
  const cles = Object.keys(REFERENTIELS).sort((a, b) => REFERENTIELS[a].titre.localeCompare(REFERENTIELS[b].titre)) as CleRef[]
  const [cle, setCle] = useState<CleRef>('traits')
  const [nouveau, setNouveau] = useState('')
  const [q, setQ] = useState('')
  const [aVerifier, setAVerifier] = useState(false)
  const ref = REFERENTIELS[cle]
  const elements = useMemo(() => liste(d, cle).filter((e) => e.nom.toLowerCase().includes(q.toLowerCase()) && (!aVerifier || e.fr_verifie === false)), [d, cle, q, aVerifier])
  const perso = d.refPerso[cle] ?? { ajouts: [], icones: {} }
  const setPerso = (p: typeof perso) => maj((d) => ({ ...d, refPerso: { ...d.refPerso, [cle]: p } }))

  return (
    <div className="pile">
      <EnTete titre="Référentiels du jeu" sousTitre={`Version du jeu : ${ref?.version_jeu ?? '?'} · * libellé français à vérifier · clique sur une icône pour la remplacer`} />
      <div className="ref-mise-en-page">
        <nav className="ref-menu">
          {cles.map((c) => (
            <button key={c} className={'ref-menu-item' + (c === cle ? ' actif' : '')} onClick={() => { setCle(c); setQ('') }}>
              {REFERENTIELS[c].titre}<small>{liste(d, c).length}</small>
            </button>
          ))}
        </nav>
        <Panneau titre={ref?.titre}>
          <div className="filtres">
            <label className="recherche">
              <MagnifyingGlass size={18} weight="bold" />
              <input placeholder="Filtrer…" value={q} onChange={(e) => setQ(e.target.value)} />
            </label>
            <div className="segment">
              <button className={!aVerifier ? 'actif' : ''} onClick={() => setAVerifier(false)}>Tout</button>
              <button className={aVerifier ? 'actif' : ''} onClick={() => setAVerifier(true)}>À vérifier ({liste(d, cle).filter((e) => e.fr_verifie === false).length})</button>
            </div>
            <form className="ligne" onSubmit={(e) => {
              e.preventDefault()
              if (!nouveau.trim()) return
              setPerso({ ...perso, ajouts: [...perso.ajouts, { id: 'perso-' + uid(), nom: nouveau.trim(), perso: true }] })
              setNouveau('')
            }}>
              <input className="input" placeholder="Élément manquant…" value={nouveau} onChange={(e) => setNouveau(e.target.value)} />
              <button className="btn btn-accent"><Plus size={16} weight="bold" />Ajouter</button>
            </form>
          </div>
          <div className="ref-liste">
            {elements.map((e) => (
              <div key={e.id} className="ref-element" title={e.description}>
                <label className="ref-icone" title="Remplacer l'icône">
                  <Icone el={e} taille={44} />
                  <input type="file" accept="image/*" hidden onChange={async (ev) => {
                    const fichier = ev.target.files?.[0]
                    if (fichier) setPerso({ ...perso, icones: { ...perso.icones, [e.id]: await importerImage(fichier, 160) } })
                  }} />
                </label>
                <span>
                  <input className="ref-nom" value={e.nom} title="Corrige le libellé tel qu'il apparaît dans ton jeu"
                    onChange={(ev) => setPerso({ ...perso, noms: { ...perso.noms, [e.id]: ev.target.value } })} />
                  <small>{e.fr_verifie === false && <sup>* à vérifier · </sup>}{e.nom_en}</small>
                </span>
                {(e.perso || perso.icones[e.id]) && (
                  <BoutonIcone label={e.perso ? "Supprimer l'élément" : "Revenir à l'icône d'origine"} onClick={() => {
                    const { [e.id]: _, ...icones } = perso.icones
                    setPerso({ ajouts: e.perso ? perso.ajouts.filter((a) => a.id !== e.id) : perso.ajouts, icones })
                  }}><X size={14} weight="bold" /></BoutonIcone>
                )}
              </div>
            ))}
          </div>
          {ref?.notes && <details className="notes-ref"><summary>Notes sur les sources</summary><p>{ref.notes}</p></details>}
        </Panneau>
      </div>
    </div>
  )
}

function Compte({ session }: { session: Session | null }) {
  const [email, setEmail] = useState('')
  const [mdp, setMdp] = useState('')
  const [message, setMessage] = useState('')
  if (!supabase) return <p className="texte-doux">Synchronisation non configurée : les données restent sur cet appareil.</p>
  if (session) {
    return (
      <div className="ligne-entre">
        <p className="texte-doux">Connectée avec <b>{session.user.email}</b>. Tes données et tes photos sont synchronisées sur tous tes appareils.</p>
        <button className="btn btn-doux" onClick={() => supabase!.auth.signOut()}><SignOut size={16} weight="bold" />Se déconnecter</button>
      </div>
    )
  }
  const agir = async (creation: boolean) => {
    setMessage('')
    const { error } = creation
      ? await supabase!.auth.signUp({ email, password: mdp, options: { emailRedirectTo: location.href } })
      : await supabase!.auth.signInWithPassword({ email, password: mdp })
    if (error) setMessage(error.message === 'Invalid login credentials' ? 'E-mail ou mot de passe incorrect.' : error.message)
    else if (creation) setMessage('Compte créé. Confirme ton adresse via l’e-mail reçu, puis connecte-toi.')
  }
  return (
    <form className="pile pile-serree" onSubmit={(e) => { e.preventDefault(); agir(false) }}>
      <p className="texte-doux">Connecte-toi pour retrouver tes familles et tes photos sur tous tes appareils.</p>
      <div className="grille-2">
        <input className="input" type="email" autoComplete="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="input" type="password" autoComplete="current-password" placeholder="Mot de passe" value={mdp} onChange={(e) => setMdp(e.target.value)} required minLength={6} />
      </div>
      <div className="actions">
        <button type="button" className="btn btn-doux" onClick={() => agir(true)}>Créer mon compte</button>
        <button className="btn btn-accent">Se connecter</button>
      </div>
      {message && <p className="message">{message}</p>}
    </form>
  )
}

function exporterDonnees(d: Donnees, maj: (f: (d: Donnees) => Donnees) => void) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([JSON.stringify(d, null, 1)], { type: 'application/json' }))
  a.download = `zoi-tracker-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  maj((d) => ({ ...d, reglages: { ...d.reglages, dernierExport: Date.now() } }))
}

function Reglages({ remplacer, session }: { remplacer: (d: Donnees) => void; session: Session | null }) {
  const { d, maj } = useCtx()
  const [message, setMessage] = useState('')
  const [reset, setReset] = useState(false)

  const exporter = () => { exporterDonnees(d, maj); setMessage('Sauvegarde exportée.') }
  const importer = async (brut: string | null) => {
    if (!brut) return
    try { remplacer(normaliser(JSON.parse(brut))); setMessage('Sauvegarde importée.') } catch { setMessage("Ce fichier n'est pas une sauvegarde Zoi Tracker valide.") }
  }

  return (
    <div className="pile reglages">
      <EnTete titre="Réglages" />
      <Panneau titre="Compte & synchronisation"><Compte session={session} /></Panneau>
      <Panneau titre="Apparence">
        <div className="segment">
          {([['clair', 'Clair', Sun], ['sombre', 'Sombre', Moon], ['systeme', 'Comme le système', Desktop]] as const).map(([t, l, I]) => (
            <button key={t} className={(d.reglages?.theme ?? 'systeme') === t ? 'actif' : ''} onClick={() => maj((d) => ({ ...d, reglages: { ...d.reglages, theme: t } }))}><I size={16} weight="bold" /> {l}</button>
          ))}
        </div>
      </Panneau>
      <Panneau titre="Sauvegarde">
        <p className="texte-doux">Tes données sont enregistrées automatiquement dans ce navigateur (et dans ton compte si tu es connectée). Exporte-les de temps en temps pour garder une copie de secours.</p>
        <div className="actions actions-gauche">
          <button className="btn btn-doux" onClick={exporter}><DownloadSimple size={16} weight="bold" />Exporter</button>
          <label className="btn btn-doux"><UploadSimple size={16} weight="bold" />Importer<input type="file" accept=".json" hidden onChange={async (e) => importer(await e.target.files?.[0]?.text() ?? null)} /></label>
          <button className="btn btn-danger-doux" onClick={() => setReset(true)}><Trash size={16} weight="bold" />Tout effacer</button>
        </div>
        {message && <p className="message">{message}</p>}
      </Panneau>
      <p className="texte-doux centre">Zoi Tracker — application non officielle. inZOI et ses visuels © KRAFTON, Inc., utilisés à titre personnel.</p>
      {reset && <Confirmer message="Effacer toutes les familles, Zois et relations ? Pense à exporter avant." libelle="Tout effacer"
        onNon={() => setReset(false)} onOui={() => { remplacer({ version: 1, foyers: [], zois: [], relations: [], refPerso: d.refPerso }); setReset(false) }} />}
    </div>
  )
}
