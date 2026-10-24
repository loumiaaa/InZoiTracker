import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Camera, CaretDown, Check, MagnifyingGlass, Plus, X } from '@phosphor-icons/react'
import { type Donnees, liste, importerImage, uid } from '../donnees'
import { REFERENTIELS, type CleRef, type ElementRef } from '../referentiels'

type Ctx = { d: Donnees; maj: (f: (d: Donnees) => Donnees) => void }
export const DonneesCtx = createContext<Ctx>(null!)
export const useCtx = () => useContext(DonneesCtx)

type El = ElementRef & { url?: string }

/** Icône du jeu ; à défaut, une pastille avec l'initiale (pas d'emoji). */
export function Icone({ el, taille = 28 }: { el?: El; taille?: number }) {
  if (!el) return null
  if (el.url) return <img className="icone" src={el.url} alt="" style={{ width: taille, height: taille }} />
  return (
    <span className="icone icone-initiale" style={{ width: taille, height: taille, fontSize: taille * 0.42 }} aria-hidden>
      {el.nom.trim().slice(0, 1).toUpperCase()}
    </span>
  )
}

export function Panneau({ titre, action, children, className = '' }: { titre?: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={'panneau ' + className}>
      {(titre || action) && (
        <header className="panneau-tete">
          <h3>{titre}</h3>
          {action}
        </header>
      )}
      {children}
    </section>
  )
}

export function EnTete({ titre, sousTitre, children }: { titre: ReactNode; sousTitre?: ReactNode; children?: ReactNode }) {
  return (
    <header className="entete">
      <div>
        <h1 className="titre-page">{titre}</h1>
        {sousTitre && <p className="sous-titre">{sousTitre}</p>}
      </div>
      {children && <div className="entete-actions">{children}</div>}
    </header>
  )
}

export function Vide({ titre, texte, children }: { titre: string; texte?: string; children?: ReactNode }) {
  return (
    <div className="etat-vide">
      <img src={urlMarque('Kitty_Paw-Cut_Aquamarine.png')} alt="" />
      <strong>{titre}</strong>
      {texte && <p>{texte}</p>}
      {children}
    </div>
  )
}

const marque = import.meta.glob('/assets/icones/marque/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>
export const urlMarque = (f: string) => marque['/assets/icones/marque/' + f]

export function Champ({ label, children, large }: { label: string; children: ReactNode; large?: boolean }) {
  return (
    <label className={'champ' + (large ? ' champ-large' : '')}>
      <span className="champ-label">{label}</span>
      {children}
    </label>
  )
}

export function Modale({ titre, onFermer, children, large }: { titre: string; onFermer: () => void; children: ReactNode; large?: boolean }) {
  useEffect(() => {
    const echap = (e: KeyboardEvent) => e.key === 'Escape' && onFermer()
    window.addEventListener('keydown', echap)
    return () => window.removeEventListener('keydown', echap)
  }, [onFermer])
  // Portail : le backdrop-filter des panneaux confinerait sinon la modale fixe à leur boîte.
  return createPortal(
    <div className="voile" onMouseDown={(e) => e.target === e.currentTarget && onFermer()}>
      <div className={'modale' + (large ? ' modale-large' : '')} role="dialog" aria-label={titre}>
        <header className="modale-tete">
          <h2>{titre}</h2>
          <BoutonIcone label="Fermer" onClick={onFermer}><X size={18} weight="bold" /></BoutonIcone>
        </header>
        <div className="modale-corps">{children}</div>
      </div>
    </div>,
    document.body,
  )
}

export function BoutonIcone({ label, onClick, children, className = '' }: { label: string; onClick: () => void; children: ReactNode; className?: string }) {
  return <button type="button" className={'btn-icone ' + className} onClick={onClick} aria-label={label} title={label}>{children}</button>
}

export function Confirmer({ message, libelle = 'Supprimer', onOui, onNon }: { message: string; libelle?: string; onOui: () => void; onNon: () => void }) {
  return (
    <Modale titre="Confirmation" onFermer={onNon}>
      <p>{message}</p>
      <div className="actions">
        <button className="btn" onClick={onNon}>Annuler</button>
        <button className="btn btn-danger" onClick={onOui}>{libelle}</button>
      </div>
    </Modale>
  )
}

/** Emplacement photo à remplir (portrait, bannière, maison…). */
export function Photo({ src, onChange, ratio = '1', rond, libelle = 'Ajouter une capture', taille = 640 }:
  { src?: string; onChange: (v?: string) => void; ratio?: string; rond?: boolean; libelle?: string; taille?: number }) {
  const input = useRef<HTMLInputElement>(null)
  const [envoi, setEnvoi] = useState(false)
  const [survol, setSurvol] = useState(false)
  const [depot, setDepot] = useState(false)
  const prendre = async (f?: File | null) => {
    if (!f || !f.type.startsWith('image/')) return
    setEnvoi(true)
    try { onChange(await importerImage(f, taille)) } finally { setEnvoi(false) }
  }
  // Coller une capture (Ctrl/Cmd + V) quand la souris survole l'emplacement.
  useEffect(() => {
    if (!survol) return
    const coller = (e: ClipboardEvent) => {
      const f = Array.from(e.clipboardData?.files ?? []).find((x) => x.type.startsWith('image/'))
      if (f) { e.preventDefault(); prendre(f) }
    }
    window.addEventListener('paste', coller)
    return () => window.removeEventListener('paste', coller)
  })
  return (
    <div className={'photo' + (rond ? ' photo-rond' : '') + (src ? '' : ' photo-vide') + (envoi ? ' photo-envoi' : '') + (depot ? ' photo-depot' : '')} style={{ aspectRatio: ratio }}
      onMouseEnter={() => setSurvol(true)} onMouseLeave={() => setSurvol(false)}
      onDragOver={(e) => { e.preventDefault(); setDepot(true) }} onDragLeave={() => setDepot(false)}
      onDrop={(e) => { e.preventDefault(); setDepot(false); prendre(e.dataTransfer.files[0]) }}
      title={`${libelle} — clique, glisse une image ou colle-la (Ctrl/Cmd + V)`}>
      {src ? <img src={src} alt="" /> : <span className="photo-libelle"><Camera size={rond ? 22 : 26} weight="duotone" />{!rond && <span>{libelle}<br /><small>ou glisse / colle une capture</small></span>}</span>}
      <button type="button" className="photo-clic" onClick={() => input.current?.click()} aria-label={libelle} title={libelle} />
      {src && <button type="button" className="photo-retirer" onClick={() => onChange(undefined)} aria-label="Retirer la photo"><X size={14} weight="bold" /></button>}
      <input ref={input} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; prendre(f) }} />
    </div>
  )
}

/** Ajoute un élément personnalisé à un référentiel et renvoie son id. */
export function useAjoutRef() {
  const { maj } = useCtx()
  return (cle: CleRef, nom: string, categorie?: string) => {
    const id = 'perso-' + uid()
    maj((d) => {
      const p = d.refPerso[cle] ?? { ajouts: [], icones: {} }
      return { ...d, refPerso: { ...d.refPerso, [cle]: { ...p, ajouts: [...p.ajouts, { id, nom, categorie, perso: true }] } } }
    })
    return id
  }
}

type PropsSel = {
  cle: CleRef
  filtre?: (e: El) => boolean
  placeholder?: string
  titre?: string
  compact?: boolean
} & ({ multiple?: false; valeur?: string; onChange: (v?: string) => void } | { multiple: true; valeur: string[]; onChange: (v: string[]) => void; max?: number })

/** Sélecteur de référentiel : champ + palette de recherche avec icônes, groupées par catégorie. */
export function Selecteur(props: PropsSel) {
  const { d } = useCtx()
  const [ouvert, setOuvert] = useState(false)
  const elements = useMemo(() => liste(d, props.cle).filter(props.filtre ?? (() => true)), [d, props.cle, props.filtre])
  const choisis = props.multiple ? props.valeur : props.valeur ? [props.valeur] : []
  const els = choisis.map((id) => elements.find((e) => e.id === id) ?? { id, nom: id })

  return (
    <>
      <button type="button" className={'selecteur' + (els.length ? '' : ' selecteur-vide') + (props.compact ? ' selecteur-compact' : '')} onClick={() => setOuvert(true)}>
        <span className="selecteur-valeurs">
          {els.length === 0 && (props.placeholder ?? 'Choisir…')}
          {els.map((e) => (
            <span key={e.id} className="puce"><Icone el={e} taille={22} />{e.nom}</span>
          ))}
        </span>
        {props.compact ? <Plus size={14} weight="bold" /> : <CaretDown size={14} weight="bold" className="selecteur-caret" />}
      </button>
      {ouvert && <FenetreChoix {...props} elements={elements} choisis={choisis} onFermer={() => setOuvert(false)} />}
    </>
  )
}

function FenetreChoix(props: PropsSel & { elements: El[]; choisis: string[]; onFermer: () => void }) {
  const [q, setQ] = useState('')
  const ajouter = useAjoutRef()
  const ref = REFERENTIELS[props.cle]
  const norm = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
  const trouves = props.elements.filter((e) => norm(e.nom + ' ' + (e.nom_en ?? '')).includes(norm(q)))
  const groupes = new Map<string, El[]>()
  for (const e of trouves) {
    const g = e.perso ? 'Mes ajouts' : ref?.categories?.find((c) => c.id === e.categorie)?.nom ?? ''
    groupes.set(g, [...(groupes.get(g) ?? []), e])
  }
  const grand = props.cle === 'vies-desirees' || props.cle === 'traits'

  const basculer = (id: string) => {
    if (props.multiple) {
      const deja = props.valeur.includes(id)
      if (!deja && props.max && props.valeur.length >= props.max) return
      props.onChange(deja ? props.valeur.filter((v) => v !== id) : [...props.valeur, id])
    } else {
      props.onChange(id)
      props.onFermer()
    }
  }

  return (
    <Modale titre={props.titre ?? ref?.titre ?? 'Choisir'} onFermer={props.onFermer} large>
      <div className="recherche-ligne">
        <label className="recherche">
          <MagnifyingGlass size={18} weight="bold" />
          <input autoFocus placeholder="Rechercher…" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        {!props.multiple && props.valeur && <button className="btn btn-doux" onClick={() => { props.onChange(undefined); props.onFermer() }}>Retirer</button>}
        {props.multiple && <button className="btn btn-accent" onClick={props.onFermer}><Check size={16} weight="bold" />Valider · {props.valeur.length}{props.max ? '/' + props.max : ''}</button>}
      </div>
      <div className="choix-liste">
        {[...groupes].map(([g, els]) => (
          <div key={g}>
            {g && <h4 className="choix-groupe">{g}</h4>}
            <div className={'choix-grille' + (grand ? ' choix-grille-grand' : '')}>
              {els.map((e) => {
                const actif = props.choisis.includes(e.id)
                return (
                  <button key={e.id} className={'choix' + (actif ? ' choix-actif' : '')} onClick={() => basculer(e.id)} title={e.description}>
                    {actif && <span className="choix-coche"><Check size={12} weight="bold" /></span>}
                    {grand && e.url ? <img className="choix-illus" src={e.url} alt="" /> : <Icone el={e} taille={44} />}
                    <span>{e.nom}{e.fr_verifie === false && <sup title="Libellé français non vérifié"> *</sup>}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
        {trouves.length === 0 && <p className="vide">Aucun résultat pour « {q} ».</p>}
      </div>
      {q.trim() && (
        <button className="btn btn-doux ajout-libre" onClick={() => basculer(ajouter(props.cle, q.trim()))}>
          <Plus size={16} weight="bold" />Ajouter « {q.trim()} » à la liste
        </button>
      )}
    </Modale>
  )
}

export function Onglets<T extends string>({ onglets, actif, onChange }: { onglets: { id: T; nom: string }[]; actif: T; onChange: (t: T) => void }) {
  return (
    <nav className="onglets" role="tablist">
      {onglets.map((o) => (
        <button key={o.id} role="tab" aria-selected={o.id === actif} className={'onglet' + (o.id === actif ? ' onglet-actif' : '')} onClick={() => onChange(o.id)}>
          {o.nom}
        </button>
      ))}
    </nav>
  )
}

export function Avatar({ src, nom, taille = 56, actif, decede }: { src?: string; nom: string; taille?: number; actif?: boolean; decede?: boolean }) {
  return (
    <span className={'avatar' + (actif ? ' avatar-actif' : '') + (decede ? ' avatar-decede' : '')} style={{ width: taille, height: taille }} title={nom}>
      {src ? <img src={src} alt="" /> : <span className="avatar-initiale" style={{ fontSize: taille * 0.38 }}>{nom.slice(0, 1).toUpperCase() || '?'}</span>}
    </span>
  )
}
