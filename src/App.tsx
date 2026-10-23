import { useMemo, useState } from 'react'
import { type Donnees, type Foyer, liste, nomComplet, normaliser, nouveauZoi, trouver, uid, useDonnees } from './donnees'
import { REFERENTIELS, type CleRef } from './referentiels'
import { FicheZoi } from './components/FicheZoi'
import { Avatar, Champ, Confirmer, DonneesCtx, Icone, Panneau, Photo, Selecteur, useCtx } from './components/ui'
import { lireImage } from './donnees'

type Page = { nom: 'accueil' } | { nom: 'foyers' } | { nom: 'foyer'; id: string } | { nom: 'zois' } | { nom: 'zoi'; id: string; retour: Page } | { nom: 'referentiels' } | { nom: 'reglages' }

const NAV: { nom: Page['nom']; libelle: string; icone: string }[] = [
  { nom: 'accueil', libelle: 'Accueil', icone: '🏠' },
  { nom: 'foyers', libelle: 'Foyers', icone: '👨‍👩‍👧' },
  { nom: 'zois', libelle: 'Zois', icone: '🧑' },
  { nom: 'referentiels', libelle: 'Référentiels', icone: '📚' },
  { nom: 'reglages', libelle: 'Réglages', icone: '⚙️' },
]

export default function App() {
  const { donnees, maj, remplacer } = useDonnees()
  const [page, setPage] = useState<Page>({ nom: 'accueil' })
  if (!donnees) return <div className="chargement">Chargement…</div>

  const ouvrirZoi = (id: string) => setPage((p) => ({ nom: 'zoi', id, retour: p.nom === 'zoi' ? p.retour : p }))
  const creerZoi = (foyerId?: string) => {
    const z = nouveauZoi(foyerId)
    if (foyerId) z.nom = donnees.foyers.find((f) => f.id === foyerId)?.nom ?? ''
    maj((d) => ({ ...d, zois: [...d.zois, z] }))
    ouvrirZoi(z.id)
  }
  const creerFoyer = () => {
    const f: Foyer = { id: uid(), nom: 'Nouvelle famille' }
    maj((d) => ({ ...d, foyers: [...d.foyers, f] }))
    setPage({ nom: 'foyer', id: f.id })
  }
  const actif = page.nom === 'zoi' ? 'zois' : page.nom === 'foyer' ? 'foyers' : page.nom

  return (
    <DonneesCtx.Provider value={{ d: donnees, maj }}>
      <div className="app">
        <aside className="barre">
          <div className="logo">Zoi<span>Tracker</span></div>
          <nav>
            {NAV.map((n) => (
              <button key={n.nom} className={'nav' + (actif === n.nom ? ' nav-actif' : '')} onClick={() => setPage({ nom: n.nom } as Page)}>
                <span>{n.icone}</span>{n.libelle}
              </button>
            ))}
          </nav>
          <button className="btn btn-accent" onClick={() => creerZoi()}>＋ Nouveau Zoi</button>
        </aside>
        <main className="contenu">
          {page.nom === 'accueil' && <Accueil ouvrirZoi={ouvrirZoi} ouvrirFoyer={(id) => setPage({ nom: 'foyer', id })} creerFoyer={creerFoyer} creerZoi={creerZoi} />}
          {page.nom === 'foyers' && <Foyers ouvrir={(id) => setPage({ nom: 'foyer', id })} creer={creerFoyer} />}
          {page.nom === 'foyer' && <DetailFoyer id={page.id} ouvrirZoi={ouvrirZoi} creerZoi={creerZoi} retour={() => setPage({ nom: 'foyers' })} />}
          {page.nom === 'zois' && <Zois ouvrir={ouvrirZoi} />}
          {page.nom === 'zoi' && <FicheZoi key={page.id} id={page.id} ouvrir={ouvrirZoi} fermer={() => setPage(page.retour)} />}
          {page.nom === 'referentiels' && <Referentiels />}
          {page.nom === 'reglages' && <Reglages remplacer={remplacer} />}
        </main>
      </div>
    </DonneesCtx.Provider>
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
      <Avatar src={z.portrait} nom={nomComplet(z)} taille={72} />
      <strong>{nomComplet(z)}</strong>
      <small>{[etape?.nom, trait?.nom].filter(Boolean).join(' · ') || 'Fiche à compléter'}</small>
      {carriere && <small className="texte-accent">{carriere.nom}</small>}
    </button>
  )
}

function Accueil({ ouvrirZoi, ouvrirFoyer, creerFoyer, creerZoi }: { ouvrirZoi: (id: string) => void; ouvrirFoyer: (id: string) => void; creerFoyer: () => void; creerZoi: () => void }) {
  const { d } = useCtx()
  const projets = d.zois.flatMap((z) => z.projets.filter((p) => p.statut !== 'fait').map((p) => ({ z, p })))
  const ambitions = d.zois.flatMap((z) => z.ambitions.map((a) => ({ z, a, ref: trouver(d, 'ambitions', a.ambition) })))

  if (d.zois.length === 0 && d.foyers.length === 0) {
    return (
      <div className="accueil-vide">
        <h1>Bienvenue dans ton carnet de Zois ✨</h1>
        <p>Commence par créer une famille, puis ajoute ses membres.</p>
        <div className="actions">
          <button className="btn btn-accent" onClick={creerFoyer}>Créer une famille</button>
          <button className="btn" onClick={() => creerZoi()}>Ajouter un Zoi seul</button>
        </div>
      </div>
    )
  }

  return (
    <div className="pile">
      <h1 className="titre-page">Accueil</h1>
      <div className="stats">
        <div className="stat"><b>{d.foyers.length}</b>familles</div>
        <div className="stat"><b>{d.zois.length}</b>Zois</div>
        <div className="stat"><b>{d.relations.length}</b>liens</div>
        <div className="stat"><b>{projets.length}</b>projets en cours</div>
      </div>
      <Panneau titre="Mes familles" action={<button className="btn btn-petit" onClick={creerFoyer}>＋ Famille</button>}>
        <div className="familles">
          {d.foyers.map((f) => (
            <button key={f.id} className="famille" onClick={() => ouvrirFoyer(f.id)}>
              <strong>{f.nom}</strong>
              <span className="famille-avatars">
                {d.zois.filter((z) => z.foyerId === f.id).map((z) => <Avatar key={z.id} src={z.portrait} nom={nomComplet(z)} taille={40} />)}
              </span>
            </button>
          ))}
        </div>
      </Panneau>
      <div className="grille-2">
        <Panneau titre="Projets à venir">
          {projets.slice(0, 8).map(({ z, p }) => (
            <button key={p.id} className="ligne-liste" onClick={() => ouvrirZoi(z.id)}>
              <Avatar src={z.portrait} nom={nomComplet(z)} taille={32} />
              <span>{p.titre}</span>
              <small>{p.statut === 'en-cours' ? 'En cours' : 'À faire'}{p.echeance ? ' · ' + p.echeance : ''}</small>
            </button>
          ))}
          {projets.length === 0 && <p className="vide">Aucun projet : ajoute-en depuis l'onglet « Futur » d'un Zoi.</p>}
        </Panneau>
        <Panneau titre="Ambitions en cours">
          {ambitions.slice(0, 8).map(({ z, a, ref }) => (
            <button key={a.id} className="ligne-liste" onClick={() => ouvrirZoi(z.id)}>
              <Avatar src={z.portrait} nom={nomComplet(z)} taille={32} />
              <span>{ref?.nom ?? a.ambition}</span>
              <small className="texte-accent">Lv.{a.niveau}/3</small>
            </button>
          ))}
          {ambitions.length === 0 && <p className="vide">Aucune ambition suivie.</p>}
        </Panneau>
      </div>
    </div>
  )
}

function Foyers({ ouvrir, creer }: { ouvrir: (id: string) => void; creer: () => void }) {
  const { d } = useCtx()
  return (
    <div className="pile">
      <div className="ligne-entre"><h1 className="titre-page">Familles & foyers</h1><button className="btn btn-accent" onClick={creer}>＋ Nouvelle famille</button></div>
      <div className="grille-foyers">
        {d.foyers.map((f) => {
          const ville = trouver(d, 'villes', f.ville)
          return (
            <button key={f.id} className="carte-foyer" onClick={() => ouvrir(f.id)}>
              <div className="banniere" style={f.banniere ? { backgroundImage: `url(${f.banniere})` } : undefined}>
                <span className="cartouche">{f.nom}</span>
              </div>
              <div className="carte-foyer-pied">
                <span>{ville ? `${ville.icone ?? ''} ${ville.nom}` : 'Ville non renseignée'}</span>
                <span className="famille-avatars">
                  {d.zois.filter((z) => z.foyerId === f.id).map((z) => <Avatar key={z.id} src={z.portrait} nom={nomComplet(z)} taille={32} />)}
                </span>
              </div>
            </button>
          )
        })}
      </div>
      {d.foyers.length === 0 && <p className="vide">Aucune famille pour l'instant.</p>}
    </div>
  )
}

function DetailFoyer({ id, ouvrirZoi, creerZoi, retour }: { id: string; ouvrirZoi: (id: string) => void; creerZoi: (f: string) => void; retour: () => void }) {
  const { d, maj } = useCtx()
  const [suppr, setSuppr] = useState(false)
  const f = d.foyers.find((x) => x.id === id)
  if (!f) return <p className="vide">Cette famille n'existe plus.</p>
  const set = (p: Partial<Foyer>) => maj((d) => ({ ...d, foyers: d.foyers.map((x) => (x.id === id ? { ...x, ...p } : x)) }))
  const membres = d.zois.filter((z) => z.foyerId === id)

  return (
    <div className="pile">
      <div className="ligne-entre">
        <button className="btn btn-lien" onClick={retour}>← Familles</button>
        <button className="btn btn-danger-doux" onClick={() => setSuppr(true)}>Supprimer la famille</button>
      </div>
      <div className="banniere-edition">
        <Photo src={f.banniere} onChange={(banniere) => set({ banniere })} ratio="3/1" libelle="Ajouter une bannière (capture de la maison, de la famille…)" taille={1400} />
        <input className="cartouche cartouche-input" value={f.nom} onChange={(e) => set({ nom: e.target.value })} aria-label="Nom de la famille" />
      </div>
      <div className="grille-2">
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
        <Panneau titre={`Membres (${membres.length})`} action={<button className="btn btn-petit" onClick={() => creerZoi(id)}>＋ Membre</button>}>
          <div className="grille-zois">{membres.map((z) => <CarteZoi key={z.id} id={z.id} ouvrir={ouvrirZoi} />)}</div>
          {membres.length === 0 && <p className="vide">Aucun membre : ajoute le premier Zoi de cette famille.</p>}
        </Panneau>
      </div>
      {suppr && (
        <Confirmer message={`Supprimer la famille « ${f.nom} » ? Ses Zois sont conservés, sans foyer.`} onNon={() => setSuppr(false)}
          onOui={() => { maj((d) => ({ ...d, foyers: d.foyers.filter((x) => x.id !== id), zois: d.zois.map((z) => (z.foyerId === id ? { ...z, foyerId: undefined } : z)) })); retour() }} />
      )}
    </div>
  )
}

function Zois({ ouvrir }: { ouvrir: (id: string) => void }) {
  const { d } = useCtx()
  const [q, setQ] = useState('')
  const [foyer, setFoyer] = useState('')
  const zois = d.zois.filter((z) => (!foyer || z.foyerId === foyer) && nomComplet(z).toLowerCase().includes(q.toLowerCase()))
  return (
    <div className="pile">
      <h1 className="titre-page">Tous les Zois</h1>
      <div className="ligne">
        <input className="input" placeholder="Rechercher un Zoi…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input input-auto" value={foyer} onChange={(e) => setFoyer(e.target.value)}>
          <option value="">Toutes les familles</option>
          {d.foyers.map((f) => <option key={f.id} value={f.id}>{f.nom}</option>)}
        </select>
      </div>
      <div className="grille-zois">{zois.map((z) => <CarteZoi key={z.id} id={z.id} ouvrir={ouvrir} />)}</div>
      {zois.length === 0 && <p className="vide">Aucun Zoi trouvé.</p>}
    </div>
  )
}

function Referentiels() {
  const { d, maj } = useCtx()
  const cles = Object.keys(REFERENTIELS).sort() as CleRef[]
  const [cle, setCle] = useState<CleRef>('traits')
  const [nouveau, setNouveau] = useState('')
  const ref = REFERENTIELS[cle]
  const elements = useMemo(() => liste(d, cle), [d, cle])
  const perso = d.refPerso[cle] ?? { ajouts: [], icones: {} }
  const setPerso = (p: typeof perso) => maj((d) => ({ ...d, refPerso: { ...d.refPerso, [cle]: p } }))

  return (
    <div className="pile">
      <h1 className="titre-page">Référentiels du jeu</h1>
      <p className="texte-doux">Les listes du jeu (version {ref?.version_jeu ?? '?'}). Les libellés marqués * sont des traductions à vérifier. Clique sur une icône pour la remplacer par ta capture.</p>
      <div className="ref-onglets">
        {cles.map((c) => <button key={c} className={'onglet' + (c === cle ? ' onglet-actif' : '')} onClick={() => setCle(c)}>{REFERENTIELS[c].titre}</button>)}
      </div>
      <Panneau titre={`${ref?.titre} · ${elements.length} éléments`}>
        <form className="ligne" onSubmit={(e) => {
          e.preventDefault()
          if (!nouveau.trim()) return
          setPerso({ ...perso, ajouts: [...perso.ajouts, { id: 'perso-' + uid(), nom: nouveau.trim(), icone: '✨', perso: true }] })
          setNouveau('')
        }}>
          <input className="input" placeholder="Ajouter un élément manquant…" value={nouveau} onChange={(e) => setNouveau(e.target.value)} />
          <button className="btn btn-accent">Ajouter</button>
        </form>
        <div className="ref-liste">
          {elements.map((e) => (
            <div key={e.id} className="ref-element" title={e.description}>
              <label className="ref-icone">
                <Icone el={e} taille={44} />
                <input type="file" accept="image/*" hidden onChange={async (ev) => {
                  const fichier = ev.target.files?.[0]
                  if (fichier) setPerso({ ...perso, icones: { ...perso.icones, [e.id]: await lireImage(fichier, 160) } })
                }} />
              </label>
              <span>{e.nom}{e.fr_verifie === false && <sup> *</sup>}<small>{e.nom_en}</small></span>
              {(e.perso || perso.icones[e.id]) && (
                <button className="btn-icone" aria-label="Retirer" title={e.perso ? "Supprimer l'élément" : "Revenir à l'icône d'origine"} onClick={() => {
                  const { [e.id]: _, ...icones } = perso.icones
                  setPerso({ ajouts: e.perso ? perso.ajouts.filter((a) => a.id !== e.id) : perso.ajouts, icones })
                }}>✕</button>
              )}
            </div>
          ))}
        </div>
        {ref?.notes && <details className="notes-ref"><summary>Notes sur les sources</summary><p>{ref.notes}</p></details>}
      </Panneau>
    </div>
  )
}

function Reglages({ remplacer }: { remplacer: (d: Donnees) => void }) {
  const { d } = useCtx()
  const [message, setMessage] = useState('')
  const [reset, setReset] = useState(false)
  const contenu = () => JSON.stringify(d, null, 1)

  const exporter = () => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([contenu()], { type: 'application/json' }))
    a.download = `zoi-tracker-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    setMessage('Sauvegarde exportée ✔')
  }
  const importer = async (brut: string | null) => {
    if (!brut) return
    try { remplacer(normaliser(JSON.parse(brut))); setMessage('Sauvegarde importée ✔') } catch { setMessage("Ce fichier n'est pas une sauvegarde Zoi Tracker valide.") }
  }

  return (
    <div className="pile">
      <h1 className="titre-page">Réglages</h1>
      <Panneau titre="Sauvegarde">
        <p className="texte-doux">Tes données sont enregistrées automatiquement dans ce navigateur, sur cet appareil. Exporte-les régulièrement pour en garder une copie ou pour les transférer sur un autre appareil (Importer).</p>
        <div className="actions">
          <button className="btn btn-accent" onClick={exporter}>Exporter mes données</button>
          <label className="btn">Importer une sauvegarde<input type="file" accept=".json" hidden onChange={async (e) => importer(await e.target.files?.[0]?.text() ?? null)} /></label>
          <button className="btn btn-danger-doux" onClick={() => setReset(true)}>Tout effacer</button>
        </div>
        {message && <p className="message">{message}</p>}
      </Panneau>
      <Panneau titre="À propos">
        <p className="texte-doux">Zoi Tracker — application non officielle. inZOI et ses visuels © KRAFTON, Inc., utilisés à titre personnel.</p>
      </Panneau>
      {reset && <Confirmer message="Effacer toutes les familles, Zois et relations ? Pense à exporter avant." libelle="Tout effacer"
        onNon={() => setReset(false)} onOui={() => { remplacer({ version: 1, foyers: [], zois: [], relations: [], refPerso: d.refPerso }); setReset(false) }} />}
    </div>
  )
}
