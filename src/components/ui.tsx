import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { type Donnees, liste, importerImage, uid } from '../donnees'
import { REFERENTIELS, type CleRef, type ElementRef } from '../referentiels'

type Ctx = { d: Donnees; maj: (f: (d: Donnees) => Donnees) => void }
export const DonneesCtx = createContext<Ctx>(null!)
export const useCtx = () => useContext(DonneesCtx)

type El = ElementRef & { url?: string }

export function Icone({ el, taille = 28 }: { el?: El; taille?: number }) {
  if (!el) return null
  if (el.url) return <img className="icone" src={el.url} alt="" style={{ width: taille, height: taille }} />
  return <span className="icone icone-emoji" style={{ fontSize: taille * 0.72, width: taille, height: taille }}>{el.icone ?? '•'}</span>
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

export function Champ({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="champ">
      <span className="champ-label">{label}</span>
      {children}
    </label>
  )
}

export function Modale({ titre, onFermer, children, large }: { titre: string; onFermer: () => void; children: ReactNode; large?: boolean }) {
  // Portail : le backdrop-filter des panneaux confinerait sinon la modale fixe à leur boîte.
  return createPortal(
    <div className="voile" onMouseDown={(e) => e.target === e.currentTarget && onFermer()}>
      <div className={'modale' + (large ? ' modale-large' : '')} role="dialog" aria-label={titre}>
        <header className="modale-tete">
          <h2>{titre}</h2>
          <button className="btn-icone" onClick={onFermer} aria-label="Fermer">✕</button>
        </header>
        <div className="modale-corps">{children}</div>
      </div>
    </div>,
    document.body,
  )
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
  return (
    <div className={'photo' + (rond ? ' photo-rond' : '') + (src ? '' : ' photo-vide')} style={{ aspectRatio: ratio }}>
      {src ? <img src={src} alt="" /> : <span className="photo-libelle">📷<br />{libelle}</span>}
      <button className="photo-clic" onClick={() => input.current?.click()} aria-label={libelle} />
      {src && <button className="photo-retirer" onClick={() => onChange(undefined)} aria-label="Retirer la photo">✕</button>}
      <input ref={input} type="file" accept="image/*" hidden onChange={async (e) => {
        const f = e.target.files?.[0]
        if (f) onChange(await importerImage(f, taille))
        e.target.value = ''
      }} />
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
      return { ...d, refPerso: { ...d.refPerso, [cle]: { ...p, ajouts: [...p.ajouts, { id, nom, categorie, icone: '✨', perso: true }] } } }
    })
    return id
  }
}

type PropsSel = {
  cle: CleRef
  filtre?: (e: El) => boolean
  placeholder?: string
  titre?: string
} & ({ multiple?: false; valeur?: string; onChange: (v?: string) => void } | { multiple: true; valeur: string[]; onChange: (v: string[]) => void; max?: number })

/** Sélecteur de référentiel : bouton + fenêtre de recherche avec icônes, groupées par catégorie. */
export function Selecteur(props: PropsSel) {
  const { d } = useCtx()
  const [ouvert, setOuvert] = useState(false)
  const elements = useMemo(() => liste(d, props.cle).filter(props.filtre ?? (() => true)), [d, props.cle, props.filtre])
  const choisis = props.multiple ? props.valeur : props.valeur ? [props.valeur] : []
  const els = choisis.map((id) => elements.find((e) => e.id === id) ?? { id, nom: id })

  return (
    <>
      <button className={'selecteur' + (els.length ? '' : ' selecteur-vide')} onClick={() => setOuvert(true)}>
        {els.length === 0 && <span>{props.placeholder ?? 'Choisir…'}</span>}
        {els.map((e) => (
          <span key={e.id} className="puce"><Icone el={e} taille={22} />{e.nom}</span>
        ))}
      </button>
      {ouvert && (
        <FenetreChoix {...props} elements={elements} choisis={choisis} onFermer={() => setOuvert(false)} />
      )}
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
        <input autoFocus className="input" placeholder="Rechercher…" value={q} onChange={(e) => setQ(e.target.value)} />
        {!props.multiple && props.valeur && <button className="btn" onClick={() => { props.onChange(undefined); props.onFermer() }}>Retirer</button>}
        {props.multiple && <button className="btn btn-accent" onClick={props.onFermer}>Valider ({props.valeur.length}{props.max ? '/' + props.max : ''})</button>}
      </div>
      <div className="choix-liste">
        {[...groupes].map(([g, els]) => (
          <div key={g}>
            {g && <h4 className="choix-groupe">{g}</h4>}
            <div className="choix-grille">
              {els.map((e) => (
                <button key={e.id} className={'choix' + (props.choisis.includes(e.id) ? ' choix-actif' : '')} onClick={() => basculer(e.id)} title={e.description}>
                  {props.cle === 'vies-desirees' && e.url ? <img className="choix-illus" src={e.url} alt="" /> : <Icone el={e} taille={40} />}
                  <span>{e.nom}{e.fr_verifie === false && <sup title="Libellé français non vérifié"> *</sup>}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
        {trouves.length === 0 && <p className="vide">Aucun résultat.</p>}
      </div>
      {q.trim() && (
        <button className="btn btn-lien" onClick={() => basculer(ajouter(props.cle, q.trim()))}>
          ＋ Ajouter « {q.trim()} » à la liste
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

export function Avatar({ src, nom, taille = 56, actif }: { src?: string; nom: string; taille?: number; actif?: boolean }) {
  return (
    <span className={'avatar' + (actif ? ' avatar-actif' : '')} style={{ width: taille, height: taille }} title={nom}>
      {src ? <img src={src} alt="" /> : <span className="avatar-initiale">{nom.slice(0, 1).toUpperCase() || '?'}</span>}
    </span>
  )
}
