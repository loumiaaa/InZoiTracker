// Vues transverses : calendrier, chronique, dynastie, mémorial, statistiques, carte des relations,
// import depuis le jeu, saisie express, compatibilité et carte de partage.
import { useMemo, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { Crown, DownloadSimple, FolderOpen, Lightning, Minus, Plus, ShareNetwork, X } from '@phosphor-icons/react'
import { type Donnees, type EntreeJournal, type Zoi, importerImage, liste, nomComplet, nouveauZoi, prochaineEtape, trouver, uid } from '../donnees'
import { lienDe, PARENTS, CONJOINTS } from './Arbre'
import { Avatar, BoutonIcone, Champ, EnTete, Icone, Modale, Panneau, Vide, useCtx } from './ui'

const telecharger = (url: string, nom: string) => { const a = document.createElement('a'); a.href = url; a.download = nom; a.click() }

/* ——— Calendrier de vie ——— */
export function Calendrier({ ouvrirZoi }: { ouvrirZoi: (id: string) => void }) {
  const { d, maj } = useCtx()
  const setJour = (fid: string, jour: number) => maj((d) => ({ ...d, foyers: d.foyers.map((f) => (f.id === fid ? { ...f, jourActuel: Math.max(0, jour) } : f)) }))
  const evenements = d.zois.filter((z) => !z.decede).flatMap((z) => {
    const out: { z: Zoi; dans?: number; texte: string; type: string }[] = []
    const { suivante, dans } = prochaineEtape(d, z)
    if (suivante) out.push({ z, dans, type: 'etape', texte: `passe à l'étape « ${suivante.nom} »` })
    const jour = d.foyers.find((f) => f.id === z.foyerId)?.jourActuel
    for (const p of z.projets) if (p.statut !== 'fait' && (p.echeanceJour != null || p.echeance))
      out.push({ z, type: 'projet', texte: p.titre, dans: p.echeanceJour != null && jour != null ? p.echeanceJour - jour : undefined })
    if (z.anniversaire) out.push({ z, type: 'anniversaire', texte: `anniversaire : ${z.anniversaire}` })
    return out
  }).sort((a, b) => (a.dans ?? 9999) - (b.dans ?? 9999))

  return (
    <div className="pile">
      <EnTete titre="Calendrier de vie" sousTitre="Avance le compteur de jours de chaque famille au fil de tes parties : l'app calcule les prochaines étapes de vie." />
      <div className="grille-foyers">
        {d.foyers.map((f) => (
          <div key={f.id} className="compteur">
            <span className="compteur-nom">{f.nom || 'Famille sans nom'}</span>
            <div className="compteur-jour">
              <BoutonIcone label="Jour précédent" onClick={() => setJour(f.id, (f.jourActuel ?? 0) - 1)}><Minus size={16} weight="bold" /></BoutonIcone>
              <label>Jour<input type="number" value={f.jourActuel ?? 0} onChange={(e) => setJour(f.id, +e.target.value)} /></label>
              <BoutonIcone label="Jour suivant" className="btn-icone-plein" onClick={() => setJour(f.id, (f.jourActuel ?? 0) + 1)}><Plus size={16} weight="bold" /></BoutonIcone>
            </div>
          </div>
        ))}
      </div>
      <Panneau titre="À venir">
        {evenements.map((e, i) => (
          <button key={i} className="ligne-liste" onClick={() => ouvrirZoi(e.z.id)}>
            <Avatar src={e.z.portrait} nom={nomComplet(e.z)} taille={36} />
            <span>{e.z.prenom || nomComplet(e.z)} {e.texte}<small>{e.type === 'etape' && e.dans == null ? 'Indique le jour d’entrée dans l’étape (onglet Profil) pour un décompte' : e.type === 'projet' ? 'Projet' : e.type === 'anniversaire' ? 'Anniversaire' : 'Étape de vie'}</small></span>
            {e.dans != null && <span className={'statut-puce' + (e.dans <= 2 ? ' statut-en-cours' : '')}>{e.dans <= 0 ? 'Maintenant' : `Dans ${e.dans} j`}</span>}
          </button>
        ))}
        {evenements.length === 0 && <Vide titre="Rien de prévu" texte="Renseigne les étapes de vie et les projets de tes Zois." />}
      </Panneau>
    </div>
  )
}

/* ——— Chronique (journal automatique + entrées libres) ——— */
export function Chronique({ ouvrirZoi }: { ouvrirZoi: (id: string) => void }) {
  const { d, maj } = useCtx()
  const [foyer, setFoyer] = useState('')
  const [texte, setTexte] = useState('')
  const entrees = [...(d.journal ?? [])].filter((e) => !foyer || e.foyerId === foyer).reverse()
  const parJour = new Map<string, EntreeJournal[]>()
  for (const e of entrees) {
    const cle = new Date(e.quand).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    parJour.set(cle, [...(parJour.get(cle) ?? []), e])
  }
  return (
    <div className="pile">
      <EnTete titre="Chronique" sousTitre="L'histoire de tes familles s'écrit toute seule : promotions, mariages, naissances, étapes de vie…" />
      <div className="filtres">
        <div className="segment">
          <button className={foyer === '' ? 'actif' : ''} onClick={() => setFoyer('')}>Toutes</button>
          {d.foyers.map((f) => <button key={f.id} className={foyer === f.id ? 'actif' : ''} onClick={() => setFoyer(f.id)}>{f.nom || 'Sans nom'}</button>)}
        </div>
        <form className="ligne" style={{ flex: 1 }} onSubmit={(e) => {
          e.preventDefault()
          if (!texte.trim()) return
          maj((d) => ({ ...d, journal: [...(d.journal ?? []), { id: uid(), quand: Date.now(), foyerId: foyer || undefined, type: 'note', texte: texte.trim() }] }))
          setTexte('')
        }}>
          <input className="input" placeholder="Ajouter un événement à la main…" value={texte} onChange={(e) => setTexte(e.target.value)} />
          <button className="btn btn-accent"><Plus size={16} weight="bold" />Ajouter</button>
        </form>
      </div>
      {[...parJour].map(([jour, es]) => (
        <section key={jour} className="chronique-jour">
          <h3>{jour}</h3>
          {es.map((e) => {
            const z = d.zois.find((x) => x.id === e.zoiId)
            return (
              <div key={e.id} className={'chronique-entree type-' + e.type}>
                <span className="chronique-point" />
                {z && <button className="btn-avatar" onClick={() => ouvrirZoi(z.id)}><Avatar src={z.portrait} nom={nomComplet(z)} taille={32} decede={z.decede} /></button>}
                <span className="chronique-texte">{e.texte}{e.jour != null && <small>Jour {e.jour}</small>}</span>
                <BoutonIcone label="Supprimer" onClick={() => maj((d) => ({ ...d, journal: (d.journal ?? []).filter((x) => x.id !== e.id) }))}><X size={14} weight="bold" /></BoutonIcone>
              </div>
            )
          })}
        </section>
      ))}
      {entrees.length === 0 && <Vide titre="La chronique est vide" texte="Elle se remplit quand tu changes une étape de vie, un emploi, une ambition, un lien…" />}
    </div>
  )
}

/* ——— Dynastie : toutes les générations d'une famille ——— */
export function Dynastie({ foyerId, ouvrirZoi }: { foyerId: string; ouvrirZoi: (id: string) => void }) {
  const { d, maj } = useCtx()
  const zone = useRef<HTMLDivElement>(null)
  const foyer = d.foyers.find((f) => f.id === foyerId)!
  const membres = d.zois.filter((z) => z.foyerId === foyerId)
  const niveaux = useMemo(() => calculerGenerations(d, membres), [d, membres])
  const rangs = [...new Set(niveaux.values())].sort((a, b) => a - b)

  const exporter = async () => {
    if (!zone.current) return
    telecharger(await toPng(zone.current, { pixelRatio: 2, backgroundColor: getComputedStyle(document.body).backgroundColor }), `dynastie-${foyer.nom || 'famille'}.png`)
  }
  if (membres.length === 0) return null

  return (
    <Panneau titre="Dynastie" action={<button className="btn btn-doux btn-petit" onClick={exporter}><DownloadSimple size={14} weight="bold" />Exporter en image</button>}>
      <div ref={zone} className="dynastie">
        {rangs.map((r) => {
          const gens = membres.filter((z) => niveaux.get(z.id) === r)
          const ordonnes: Zoi[] = []
          for (const z of gens) if (!ordonnes.includes(z)) {
            ordonnes.push(z)
            for (const c of gens) if (!ordonnes.includes(c) && CONJOINTS.includes(lienDe(d, z.id, c.id) ?? '')) ordonnes.push(c)
          }
          return (
            <div key={r} className="generation">
              <span className="generation-titre">Génération {r + 1}</span>
              <div className="generation-noeuds">
                {ordonnes.map((z) => (
                  <button key={z.id} className={'noeud' + (z.decede ? ' noeud-decede' : '') + (foyer.heritier === z.id ? ' noeud-heritier' : '')} onClick={() => ouvrirZoi(z.id)}>
                    {foyer.heritier === z.id && <Crown className="couronne" size={18} weight="fill" />}
                    <Avatar src={z.portrait} nom={nomComplet(z)} taille={56} decede={z.decede} />
                    <strong>{z.prenom || nomComplet(z)}</strong>
                    <small>{z.decede ? 'Décédé·e' : trouver(d, 'etapes-de-vie', z.etapeDeVie)?.nom ?? ''}</small>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      <div className="grille-2">
        <Champ label="Héritier / héritière">
          <select className="input" value={foyer.heritier ?? ''} onChange={(e) => maj((d) => ({ ...d, foyers: d.foyers.map((f) => (f.id === foyerId ? { ...f, heritier: e.target.value || undefined } : f)) }))}>
            <option value="">—</option>
            {membres.filter((z) => !z.decede).map((z) => <option key={z.id} value={z.id}>{nomComplet(z)}</option>)}
          </select>
        </Champ>
        <ObjectifsFamille foyerId={foyerId} />
      </div>
    </Panneau>
  )
}

function ObjectifsFamille({ foyerId }: { foyerId: string }) {
  const { d, maj } = useCtx()
  const [t, setT] = useState('')
  const objectifs = d.foyers.find((f) => f.id === foyerId)?.objectifs ?? []
  const set = (o: typeof objectifs) => maj((d) => ({ ...d, foyers: d.foyers.map((f) => (f.id === foyerId ? { ...f, objectifs: o } : f)) }))
  return (
    <div className="champ">
      <span className="champ-label">Objectifs de la lignée</span>
      {objectifs.map((o) => (
        <label key={o.id} className={'objectif' + (o.fait ? ' objectif-fait' : '')}>
          <input type="checkbox" checked={o.fait} onChange={() => set(objectifs.map((x) => (x.id === o.id ? { ...x, fait: !x.fait } : x)))} />
          <span style={{ flex: 1 }}>{o.texte}</span>
          <BoutonIcone label="Retirer" onClick={() => set(objectifs.filter((x) => x.id !== o.id))}><X size={12} weight="bold" /></BoutonIcone>
        </label>
      ))}
      <form className="ligne" onSubmit={(e) => { e.preventDefault(); if (t.trim()) { set([...objectifs, { id: uid(), texte: t.trim(), fait: false }]); setT('') } }}>
        <input className="input" placeholder="Ex. : 3 générations de médecins" value={t} onChange={(e) => setT(e.target.value)} />
      </form>
    </div>
  )
}

/** Génération de chaque Zoi : 0 pour les ancêtres sans parent connu, +1 par génération ; les couples sont alignés. */
export function calculerGenerations(d: Donnees, zois: Zoi[]) {
  const niv = new Map(zois.map((z) => [z.id, 0]))
  for (let tour = 0; tour < zois.length + 2; tour++) {
    let change = false
    for (const z of zois) {
      for (const p of zois) {
        if (p.id === z.id) continue
        const lien = lienDe(d, z.id, p.id) ?? ''
        if (PARENTS.includes(lien) && niv.get(z.id)! <= niv.get(p.id)!) { niv.set(z.id, niv.get(p.id)! + 1); change = true }
        if (CONJOINTS.includes(lien) && niv.get(z.id)! < niv.get(p.id)!) { niv.set(z.id, niv.get(p.id)!); change = true }
      }
    }
    if (!change) break
  }
  return niv
}

/* ——— Mémorial ——— */
export function Memorial({ ouvrirZoi }: { ouvrirZoi: (id: string) => void }) {
  const { d, maj } = useCtx()
  const defunts = d.zois.filter((z) => z.decede)
  const set = (id: string, epitaphe: string) => maj((d) => ({ ...d, zois: d.zois.map((z) => (z.id === id ? { ...z, deces: { ...z.deces, epitaphe } } : z)) }))
  return (
    <div className="pile">
      <EnTete titre="Mémorial" sousTitre="En souvenir des Zois qui nous ont quittés." />
      <div className="memorial">
        {defunts.map((z) => (
          <div key={z.id} className="stele">
            <button className="btn-avatar" onClick={() => ouvrirZoi(z.id)}><Avatar src={z.portrait} nom={nomComplet(z)} taille={96} decede /></button>
            <strong>{nomComplet(z)}</strong>
            <small>{[z.deces?.date, z.deces?.cause].filter(Boolean).join(' · ') || 'Date inconnue'}</small>
            <textarea className="input epitaphe" rows={2} placeholder="Épitaphe…" value={z.deces?.epitaphe ?? ''} onChange={(e) => set(z.id, e.target.value)} />
          </div>
        ))}
      </div>
      {defunts.length === 0 && <Vide titre="Personne ici, tant mieux" texte="Coche « Décédé·e » dans le profil d'un Zoi pour qu'il apparaisse ici." />}
    </div>
  )
}

/* ——— Statistiques ——— */
export function Statistiques() {
  const { d } = useCtx()
  const vivants = d.zois.filter((z) => !z.decede)
  const compter = (f: (z: Zoi) => string | undefined) => {
    const m = new Map<string, number>()
    for (const z of vivants) { const k = f(z); if (k) m.set(k, (m.get(k) ?? 0) + 1) }
    return [...m].sort((a, b) => b[1] - a[1]).slice(0, 8)
  }
  const blocs = [
    { titre: 'Étapes de vie', data: compter((z) => trouver(d, 'etapes-de-vie', z.etapeDeVie)?.nom) },
    { titre: 'Carrières', data: compter((z) => trouver(d, 'carrieres', z.carriere.carriere)?.nom) },
    { titre: 'Vies désirées', data: compter((z) => trouver(d, 'vies-desirees', z.vieDesiree)?.nom) },
    { titre: 'Traits', data: compter((z) => trouver(d, 'traits', z.trait)?.nom) },
    { titre: 'Villes', data: compter((z) => trouver(d, 'villes', z.vie.ville ?? d.foyers.find((f) => f.id === z.foyerId)?.ville)?.nom) },
    { titre: 'Préférences les plus aimées', data: (() => { const m = new Map<string, number>(); vivants.forEach((z) => z.preferences.filter((p) => p.aime).forEach((p) => { const n = trouver(d, 'preferences', p.id)?.nom ?? p.id; m.set(n, (m.get(n) ?? 0) + 1) })); return [...m].sort((a, b) => b[1] - a[1]).slice(0, 8) })() },
  ]
  const budget = d.foyers.reduce((s, f) => s + (f.budget ?? 0), 0)
  const salaires = vivants.reduce((s, z) => s + (z.carriere.salaire ?? 0), 0)
  const chiffres = [
    { n: vivants.length, l: 'Zois en vie' }, { n: d.zois.length - vivants.length, l: 'décédés' },
    { n: budget.toLocaleString('fr-FR'), l: 'Miaou (budgets des foyers)' }, { n: salaires.toLocaleString('fr-FR'), l: 'Miaou de salaires cumulés' },
  ]
  return (
    <div className="pile">
      <EnTete titre="Statistiques" sousTitre="Un coup d'œil sur l'ensemble de tes Zois." />
      <div className="stats">{chiffres.map((c) => <div key={c.l} className="stat"><div><b>{c.n}</b><span>{c.l}</span></div></div>)}</div>
      <div className="grille-2">
        {blocs.map((b) => {
          const max = Math.max(1, ...b.data.map((x) => x[1]))
          return (
            <Panneau key={b.titre} titre={b.titre}>
              {b.data.map(([nom, n]) => (
                <div key={nom} className="barre-stat"><span>{nom}</span><i style={{ width: `${(n / max) * 100}%` }} /><b>{n}</b></div>
              ))}
              {b.data.length === 0 && <p className="vide">Pas encore de données.</p>}
            </Panneau>
          )
        })}
      </div>
    </div>
  )
}

/* ——— Carte des relations ——— */
const TYPE_LIEN = (d: Donnees, lien?: string, niveaux?: Record<string, string | undefined>) => {
  const cat = liste(d, 'relations').find((e) => e.id === lien)?.categorie
  if (cat === 'lien-familial') return 'famille'
  if (['marie', 'fiance', 'partenaire-amoureux', 'conjoint'].includes(lien ?? '') || niveaux?.amour) return 'amour'
  if (['amitie-foe', 'affaires-enemy', 'affaires-rival'].some((n) => Object.values(niveaux ?? {}).includes(n))) return 'conflit'
  return 'amitie'
}

export function CarteRelations({ ouvrirZoi }: { ouvrirZoi: (id: string) => void }) {
  const { d } = useCtx()
  const [foyer, setFoyer] = useState('')
  const zois = d.zois.filter((z) => !foyer || z.foyerId === foyer || d.relations.some((r) => (r.a === z.id || r.b === z.id) && d.zois.find((x) => x.id === (r.a === z.id ? r.b : r.a))?.foyerId === foyer))
  const T = 640, R = zois.length > 1 ? 240 : 0
  const pos = new Map(zois.map((z, i) => [z.id, { x: T / 2 + R * Math.cos((2 * Math.PI * i) / zois.length - Math.PI / 2), y: T / 2 + R * Math.sin((2 * Math.PI * i) / zois.length - Math.PI / 2) }]))
  const liens = d.relations.filter((r) => pos.has(r.a) && pos.has(r.b))
  return (
    <div className="pile">
      <EnTete titre="Carte des relations" sousTitre="Qui connaît qui. Clique sur un Zoi pour ouvrir sa fiche." />
      <div className="segment">
        <button className={foyer === '' ? 'actif' : ''} onClick={() => setFoyer('')}>Tous</button>
        {d.foyers.map((f) => <button key={f.id} className={foyer === f.id ? 'actif' : ''} onClick={() => setFoyer(f.id)}>{f.nom || 'Sans nom'}</button>)}
      </div>
      <Panneau>
        {zois.length < 2 ? <Vide titre="Pas encore de réseau" texte="Ajoute des liens entre tes Zois dans l'onglet Relations." /> : (
          <div className="carte-reseau">
            <svg viewBox={`0 0 ${T} ${T}`}>
              {liens.map((r) => {
                const a = pos.get(r.a)!, b = pos.get(r.b)!
                return <line key={r.id} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={'lien-' + TYPE_LIEN(d, r.lien, r.niveaux)} />
              })}
            </svg>
            {zois.map((z) => {
              const p = pos.get(z.id)!
              return (
                <button key={z.id} className="reseau-noeud" style={{ left: `${(p.x / T) * 100}%`, top: `${(p.y / T) * 100}%` }} onClick={() => ouvrirZoi(z.id)}>
                  <Avatar src={z.portrait} nom={nomComplet(z)} taille={48} decede={z.decede} />
                  <span>{z.prenom || nomComplet(z)}</span>
                </button>
              )
            })}
          </div>
        )}
        <div className="legende">
          {[['famille', 'Famille'], ['amour', 'Amour'], ['amitie', 'Amitié / autre'], ['conflit', 'Conflit']].map(([c, l]) => <span key={c}><i className={'lien-' + c} />{l}</span>)}
        </div>
      </Panneau>
    </div>
  )
}

/* ——— Compatibilité (estimation maison, pas la formule du jeu) ——— */
export function compatibilite(d: Donnees, a: Zoi, b: Zoi) {
  const raisons: string[] = []
  let score = 50
  for (const p of a.preferences) {
    const q = b.preferences.find((x) => x.id === p.id)
    if (!q) continue
    const nom = trouver(d, 'preferences', p.id)?.nom ?? p.id
    if (p.aime === q.aime) { score += 8; raisons.push(`${p.aime ? 'aiment' : 'détestent'} tous deux : ${nom}`) } else { score -= 8; raisons.push(`désaccord sur : ${nom}`) }
  }
  const communes = Object.keys(a.valeurs).filter((k) => k in b.valeurs)
  if (communes.length) {
    const ecart = communes.reduce((s, k) => s + Math.abs(a.valeurs[k] - b.valeurs[k]), 0) / communes.length
    score += Math.round((50 - ecart) / 3)
    raisons.push(`valeurs ${ecart < 25 ? 'proches' : ecart > 50 ? 'très différentes' : 'assez différentes'}`)
  }
  const ta = trouver(d, 'traits', a.trait), tb = trouver(d, 'traits', b.trait)
  if (ta && tb && ta.categorie === tb.categorie) { score += 6; raisons.push('traits de la même famille') }
  if (a.vieDesiree && a.vieDesiree === b.vieDesiree) { score += 6; raisons.push('même Vie désirée') }
  return { score: Math.max(0, Math.min(100, score)), raisons }
}

/* ——— Saisie express (accueil) ——— */
export function SaisieExpress() {
  const { d, maj } = useCtx()
  const [zid, setZid] = useState(d.zois.find((z) => !z.decede)?.id ?? '')
  const [texte, setTexte] = useState('')
  const [ok, setOk] = useState('')
  const z = d.zois.find((x) => x.id === zid)
  const setZ = (f: (z: Zoi) => Zoi) => maj((d) => ({ ...d, zois: d.zois.map((x) => (x.id === zid ? f(x) : x)) }))
  const flash = (m: string) => { setOk(m); setTimeout(() => setOk(''), 1800) }
  const objectifs = z?.ambitions.flatMap((a) => {
    const ref = trouver(d, 'ambitions', a.ambition)
    const obj: string[] = ref?.details?.niveaux?.find((n: any) => n.niveau === a.niveau)?.objectifs ?? []
    return obj.map((o, i) => ({ a, cle: `${a.niveau}:${i}`, o })).filter((x) => !a.faits.includes(x.cle))
  }) ?? []
  if (!d.zois.length) return null
  return (
    <Panneau titre={<span className="titre-icone"><Lightning size={18} weight="fill" />Saisie express</span>} action={ok && <span className="message">{ok}</span>}>
      <div className="saisie-zois">
        {d.zois.filter((x) => !x.decede).map((x) => (
          <button key={x.id} className={'btn-avatar' + (x.id === zid ? ' saisie-actif' : '')} onClick={() => setZid(x.id)} title={nomComplet(x)}>
            <Avatar src={x.portrait} nom={nomComplet(x)} taille={40} actif={x.id === zid} />
          </button>
        ))}
      </div>
      {z && <>
        <form className="ligne" onSubmit={(e) => {
          e.preventDefault()
          if (!texte.trim()) return
          setZ((z) => ({ ...z, souvenirs: [...z.souvenirs, { id: uid(), texte: texte.trim(), tonalite: 'positif', date: new Date().toLocaleDateString('fr-FR') }] }))
          setTexte(''); flash('Souvenir ajouté')
        }}>
          <input className="input" placeholder={`Un souvenir pour ${z.prenom || 'ce Zoi'}…`} value={texte} onChange={(e) => setTexte(e.target.value)} />
          <button className="btn btn-accent">Ajouter</button>
        </form>
        <div className="saisie-actions">
          {Object.entries(z.competences).map(([c, n]) => (
            <button key={c} className="puce puce-action" onClick={() => { setZ((z) => ({ ...z, competences: { ...z.competences, [c]: n + 1 } })); flash('Compétence +1') }}>
              <Icone el={trouver(d, 'competences', c)} taille={20} />{trouver(d, 'competences', c)?.nom} <b>{n} → {n + 1}</b>
            </button>
          ))}
          {objectifs.slice(0, 4).map((x) => (
            <button key={x.a.id + x.cle} className="puce puce-action" onClick={() => { setZ((z) => ({ ...z, ambitions: z.ambitions.map((a) => (a.id === x.a.id ? { ...a, faits: [...a.faits, x.cle] } : a)) })); flash('Objectif coché') }}>
              ✓ {x.o}
            </button>
          ))}
        </div>
      </>}
    </Panneau>
  )
}

/* ——— Carte de partage d'un Zoi (export PNG) ——— */
export function PartagerZoi({ z }: { z: Zoi }) {
  const { d } = useCtx()
  const carte = useRef<HTMLDivElement>(null)
  const [ouvert, setOuvert] = useState(false)
  const vie = trouver(d, 'vies-desirees', z.vieDesiree), trait = trouver(d, 'traits', z.trait)
  const comp = Object.entries(z.competences).sort((a, b) => b[1] - a[1]).slice(0, 4)
  const exporter = async () => carte.current && telecharger(await toPng(carte.current, { pixelRatio: 2 }), `${nomComplet(z)}.png`)
  return (
    <>
      <BoutonIcone label="Partager la fiche en image" onClick={() => setOuvert(true)}><ShareNetwork size={18} weight="bold" /></BoutonIcone>
      {ouvert && (
        <Modale titre="Carte de partage" onFermer={() => setOuvert(false)} large>
          <div ref={carte} className="carte-partage">
            <div className="carte-partage-tete">
              <Avatar src={z.portrait} nom={nomComplet(z)} taille={110} decede={z.decede} />
              <div>
                <small>{d.foyers.find((f) => f.id === z.foyerId)?.nom ? `Famille ${d.foyers.find((f) => f.id === z.foyerId)!.nom}` : 'inZOI'}</small>
                <h2>{nomComplet(z)}</h2>
                <span>{[trouver(d, 'etapes-de-vie', z.etapeDeVie)?.nom, trouver(d, 'carrieres', z.carriere.carriere)?.nom].filter(Boolean).join(' · ')}</span>
              </div>
            </div>
            <div className="carte-partage-corps">
              {vie?.url && <figure><img src={vie.url} alt="" /><figcaption>{vie.nom}</figcaption></figure>}
              {trait?.url && <figure><img src={trait.url} alt="" /><figcaption>{trait.nom}</figcaption></figure>}
              <div className="carte-partage-liste">
                {comp.map(([c, n]) => <span key={c} className="puce"><Icone el={trouver(d, 'competences', c)} taille={20} />{trouver(d, 'competences', c)?.nom} · Niv.{n}</span>)}
                {z.preferences.slice(0, 6).map((p) => <span key={p.id} className="puce"><Icone el={trouver(d, 'preferences', p.id)} taille={20} />{p.aime ? '♥' : '✕'} {trouver(d, 'preferences', p.id)?.nom}</span>)}
              </div>
            </div>
            <small className="carte-partage-pied">Zoi Tracker</small>
          </div>
          <div className="actions"><button className="btn btn-accent" onClick={exporter}><DownloadSimple size={16} weight="bold" />Télécharger l'image</button></div>
        </Modale>
      )}
    </>
  )
}

/* ——— Import depuis le jeu (dossier SaveGames) ——— */
type Sauvegarde = { nom: string; date: number; miniature?: File; portraits: File[]; donnees: File[] }

export function ImportJeu({ ouvrirZoi }: { ouvrirZoi: (id: string) => void }) {
  const { d, maj } = useCtx()
  const [saves, setSaves] = useState<Sauvegarde[]>([])
  const [choisie, setChoisie] = useState<Sauvegarde | null>(null)
  const [portrait, setPortrait] = useState<File | null>(null)
  const [analyse, setAnalyse] = useState<string>('')
  const [structure, setStructure] = useState('')
  const url = useMemo(() => new Map<File, string>(), [])
  const apercu = (f: File) => { if (!url.has(f)) url.set(f, URL.createObjectURL(f)); return url.get(f)! }

  const lireDossier = (fichiers: FileList | null) => {
    if (!fichiers || !fichiers.length) return
    const tous = Array.from(fichiers)
    // Une sauvegarde = un dossier de 1er niveau sous le dossier choisi (ou le dossier choisi lui-même).
    const profondeurMax = Math.max(...tous.map((f) => f.webkitRelativePath.split('/').length))
    const parSave = new Map<string, Sauvegarde>()
    for (const f of tous) {
      const parties = f.webkitRelativePath.split('/')
      const dossier = profondeurMax > 2 && parties.length > 2 ? parties.slice(0, 2).join('/') : parties[0]
      const s = parSave.get(dossier) ?? { nom: dossier.split('/').pop() || dossier, date: 0, portraits: [], donnees: [] }
      const nom = f.name.toLowerCase()
      if (nom.includes('thumbnail') || nom.startsWith('thumb')) s.miniature = f
      else if (/\.(png|jpe?g|webp|bmp|gif)$/.test(nom)) s.portraits.push(f)
      else if (/\.b\d+$/.test(nom) || /\.(sav|save|dat|json)$/.test(nom)) { s.donnees.push(f); s.date = Math.max(s.date, f.lastModified) }
      parSave.set(dossier, s)
    }
    const liste = [...parSave.values()].sort((a, b) => b.date - a.date || b.portraits.length - a.portraits.length)
    setSaves(liste); setChoisie(liste[0] ?? null); setAnalyse('')
    setStructure(decrireStructure(tous))
  }

  const attribuer = async (zoiId: string | null) => {
    if (!portrait) return
    const image = await importerImage(portrait, 400)
    if (zoiId) maj((d) => ({ ...d, zois: d.zois.map((z) => (z.id === zoiId ? { ...z, portrait: image } : z)) }))
    else { const n = nouveauZoi(); n.portrait = image; maj((d) => ({ ...d, zois: [...d.zois, n] })); ouvrirZoi(n.id) }
    setPortrait(null)
  }

  return (
    <div className="pile">
      <EnTete titre="Import depuis le jeu" sousTitre="Choisis ton dossier de sauvegardes inZOI : l'app y retrouve tes parties et les portraits de tes Zois." />
      <Panneau>
        <div className="import-aide">
          <FolderOpen size={40} weight="duotone" />
          <div>
            <strong>Où est le dossier ?</strong>
            <p className="texte-doux">Windows : <code>Documents\inZOI\SaveGames</code> · Mac (Steam) : <code>Documents/inZOI/SaveGames</code>. L'app lit les fichiers sans jamais les modifier, et rien n'est envoyé en ligne (sauf les portraits que tu attribues, si tu es connectée).</p>
          </div>
          <label className="btn btn-accent">
            <FolderOpen size={16} weight="bold" />Choisir le dossier SaveGames
            <input type="file" hidden multiple {...({ webkitdirectory: '', directory: '' } as any)} onChange={(e) => lireDossier(e.target.files)} />
          </label>
        </div>
      </Panneau>
      {structure && (
        <Panneau titre="Structure du dossier" action={<button className="btn btn-doux btn-petit" onClick={() => navigator.clipboard?.writeText(structure)}>Copier</button>}>
          <p className="texte-doux">Ce que l'app voit dans ton dossier. Si les portraits n'apparaissent pas, fais une capture de ce panneau et envoie-la.</p>
          <pre className="analyse">{structure}</pre>
        </Panneau>
      )}
      {saves.length > 0 && (
        <div className="segment">
          {saves.map((s) => <button key={s.nom} className={choisie === s ? 'actif' : ''} onClick={() => { setChoisie(s); setAnalyse('') }}>{s.nom}{s.date ? ` · ${new Date(s.date).toLocaleDateString('fr-FR')}` : ''}</button>)}
        </div>
      )}
      {choisie && (
        <div className="grille-2-1">
          <Panneau titre={`Portraits · ${choisie.portraits.length}`}>
            <p className="texte-doux">Clique sur un portrait pour l'attribuer à un Zoi.</p>
            <div className="portraits-jeu">
              {choisie.portraits.map((f) => (
                <button key={f.name} className="portrait-jeu" onClick={() => setPortrait(f)} title={f.name}><img src={apercu(f)} alt="" /></button>
              ))}
            </div>
            {choisie.portraits.length === 0 && <p className="vide">Aucun portrait dans cette sauvegarde.</p>}
          </Panneau>
          <Panneau titre="Données de la partie">
            {choisie.miniature && <img className="miniature-jeu" src={apercu(choisie.miniature)} alt="" onError={(e) => (e.currentTarget.style.display = 'none')} />}
            <p className="texte-doux">Le format des fichiers de données (.b1, .b2) n'est pas documenté. L'analyse ci-dessous aide à le décoder : envoie le rapport pour qu'on puisse importer automatiquement noms, traits et emplois.</p>
            {choisie.donnees.map((f) => <div key={f.name} className="ligne-liste"><span>{f.name}<small>{(f.size / 1024).toFixed(0)} Ko</small></span></div>)}
            <div className="actions actions-gauche">
              <button className="btn btn-doux" onClick={async () => setAnalyse(await analyserSauvegarde(choisie, d))}>Analyser</button>
              {analyse && <button className="btn btn-doux" onClick={() => telecharger(URL.createObjectURL(new Blob([analyse], { type: 'text/plain' })), `analyse-${choisie.nom}.txt`)}><DownloadSimple size={16} weight="bold" />Rapport</button>}
            </div>
            {analyse && <pre className="analyse">{analyse.slice(0, 3000)}</pre>}
          </Panneau>
        </div>
      )}
      {portrait && (
        <Modale titre="Attribuer ce portrait" onFermer={() => setPortrait(null)}>
          <img className="portrait-grand" src={apercu(portrait)} alt="" />
          <button className="btn btn-accent" onClick={() => attribuer(null)}><Plus size={16} weight="bold" />Créer un nouveau Zoi avec ce portrait</button>
          <div className="choix-grille">
            {d.zois.map((z) => (
              <button key={z.id} className="choix" onClick={() => attribuer(z.id)}><Avatar src={z.portrait} nom={nomComplet(z)} taille={44} /><span>{nomComplet(z)}</span></button>
            ))}
          </div>
        </Modale>
      )}
    </div>
  )
}

/** Résumé lisible de l'arborescence : dossiers, nombre de fichiers par extension, exemples de noms. */
function decrireStructure(fichiers: File[]): string {
  const dossiers = new Map<string, { n: number; ext: Map<string, number>; exemples: string[]; taille: number }>()
  for (const f of fichiers) {
    const parties = f.webkitRelativePath.split('/')
    const dossier = parties.slice(0, -1).join('/') || '(racine)'
    const e = dossiers.get(dossier) ?? { n: 0, ext: new Map<string, number>(), exemples: [] as string[], taille: 0 }
    const ext = f.name.includes('.') ? f.name.split('.').pop()!.toLowerCase() : '(sans extension)'
    e.n++; e.taille += f.size; e.ext.set(ext, (e.ext.get(ext) ?? 0) + 1)
    if (e.exemples.length < 4) e.exemples.push(f.name)
    dossiers.set(dossier, e)
  }
  return ([`${fichiers.length} fichiers dans ${dossiers.size} dossiers`, ''] as string[]).concat(
    [...dossiers].sort().slice(0, 60).map(([d, e]) => `${d}\n   ${e.n} fichiers · ${(e.taille / 1048576).toFixed(1)} Mo · ${[...e.ext].map(([x, n]) => `${n} .${x}`).join(', ')}\n   ex. : ${e.exemples.join(', ')}`),
  ).join('\n')
}

/** Rapport d'analyse d'une sauvegarde : entropie (compression ?), en-tête, chaînes lisibles et noms connus retrouvés. */
async function analyserSauvegarde(s: Sauvegarde, d: Donnees): Promise<string> {
  const lignes = [`Sauvegarde : ${s.nom}`, `Portraits : ${s.portraits.length} (${s.portraits.slice(0, 5).map((p) => p.name).join(', ')})`]
  for (const f of s.donnees) {
    const o = new Uint8Array(await f.arrayBuffer())
    const freq = new Array(256).fill(0); o.forEach((b) => freq[b]++)
    const entropie = -freq.reduce((s, n) => (n ? s + (n / o.length) * Math.log2(n / o.length) : s), 0)
    const entete = Array.from(o.slice(0, 32)).map((b) => b.toString(16).padStart(2, '0')).join(' ')
    const ascii = [...new TextDecoder('latin1').decode(o).matchAll(/[\x20-\x7e]{5,}/g)].map((m) => m[0])
    const utf16 = [...new TextDecoder('utf-16le').decode(o.slice(0, o.length - (o.length % 2))).matchAll(/[\p{L}\p{N} _\-'.]{4,}/gu)].map((m) => m[0])
    const connus = d.zois.flatMap((z) => [z.prenom, z.nom]).filter((n) => n && n.length > 2 && (ascii.some((a) => a.includes(n)) || utf16.some((u) => u.includes(n))))
    lignes.push('', `— ${f.name} : ${o.length} octets, entropie ${entropie.toFixed(2)} bits/octet ${entropie > 7.5 ? '(probablement compressé ou chiffré)' : '(données lisibles en partie)'}`,
      `En-tête : ${entete}`, `Noms de tes Zois retrouvés : ${[...new Set(connus)].join(', ') || 'aucun'}`,
      `Chaînes ASCII (${ascii.length}) : ${[...new Set(ascii)].slice(0, 80).join(' | ')}`,
      `Chaînes UTF-16 (${utf16.length}) : ${[...new Set(utf16)].slice(0, 80).join(' | ')}`)
  }
  return lignes.join('\n')
}

