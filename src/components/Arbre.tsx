import { useState } from 'react'
import { Heart, Plus } from '@phosphor-icons/react'
import { type Donnees, type Zoi, nomComplet, nouveauZoi, trouver, uid } from '../donnees'
import { inverseLien } from '../referentiels'
import { Avatar, Modale, Vide, useCtx } from './ui'

export const PARENTS = ['parent', 'parent-biologique', 'parent-adoptif']
const ENFANTS = ['enfant', 'enfant-adopte']
export const CONJOINTS = ['conjoint', 'marie', 'fiance', 'partenaire-amoureux']
const FRATRIE = ['frere-soeur', 'demi-frere-soeur', 'jumeau']

/** Ce qu'est `y` pour `x` (ex. « parent »), d'après les relations saisies. */
export function lienDe(d: Donnees, x: string, y: string): string | undefined {
  for (const r of d.relations) {
    if (r.a === x && r.b === y && r.lien) return r.lien
    if (r.b === x && r.a === y && r.lien) return inverseLien(r.lien)
  }
}

const proches = (d: Donnees, x: string, liens: string[]) =>
  d.zois.filter((z) => z.id !== x && liens.includes(lienDe(d, x, z.id) ?? ''))

const unique = (zs: Zoi[]) => [...new Map(zs.map((z) => [z.id, z])).values()]

type Ajout = { lien: 'parent' | 'enfant' | 'conjoint' | 'frere-soeur'; titre: string }

export function Arbre({ z, ouvrir }: { z: Zoi; ouvrir: (id: string) => void }) {
  const { d, maj } = useCtx()
  const [ajout, setAjout] = useState<Ajout | null>(null)

  const parents = proches(d, z.id, PARENTS)
  const enfants = proches(d, z.id, ENFANTS)
  const conjoints = proches(d, z.id, CONJOINTS)
  const fratrie = unique([...proches(d, z.id, FRATRIE), ...parents.flatMap((p) => proches(d, p.id, ENFANTS))]).filter((x) => x.id !== z.id)
  const grandsParents = unique([...proches(d, z.id, ['grand-parent']), ...parents.flatMap((p) => proches(d, p.id, PARENTS))])
  const petitsEnfants = unique([...proches(d, z.id, ['petit-enfant']), ...enfants.flatMap((e) => proches(d, e.id, ENFANTS))])

  const lier = (autre: string, lien: Ajout['lien']) =>
    maj((d) => ({ ...d, relations: [...d.relations, { id: uid(), a: z.id, b: autre, lien, niveaux: {} }] }))
  const creer = (lien: Ajout['lien']) => {
    const n = nouveauZoi(z.foyerId)
    if (lien !== 'conjoint') n.nom = z.nom
    maj((d) => ({ ...d, zois: [...d.zois, n], relations: [...d.relations, { id: uid(), a: z.id, b: n.id, lien, niveaux: {} }] }))
    setAjout(null)
    ouvrir(n.id)
  }
  const dejaLies = new Set([z.id, ...parents, ...enfants, ...conjoints, ...fratrie].map((x) => (typeof x === 'string' ? x : x.id)))

  const Noeud = ({ x, centre }: { x: Zoi; centre?: boolean }) => {
    const etape = trouver(d, 'etapes-de-vie', x.etapeDeVie)
    return (
      <button className={'noeud' + (centre ? ' noeud-centre' : '') + (x.decede ? ' noeud-decede' : '')} onClick={() => !centre && ouvrir(x.id)} title={centre ? undefined : `Voir l'arbre de ${nomComplet(x)}`}>
        <Avatar src={x.portrait} nom={nomComplet(x)} taille={centre ? 76 : 58} actif={centre} decede={x.decede} />
        <strong>{x.prenom || nomComplet(x)}</strong>
        <small>{x.decede ? 'Décédé·e' : etape?.nom ?? x.nom}</small>
      </button>
    )
  }
  const BoutonAjout = ({ a }: { a: Ajout }) => (
    <button className="noeud noeud-ajout" onClick={() => setAjout(a)}><span><Plus size={20} weight="bold" /></span><small>{a.titre}</small></button>
  )

  const generations: { titre: string; zois: Zoi[]; ajout?: Ajout }[] = [
    { titre: 'Grands-parents', zois: grandsParents },
    { titre: 'Parents', zois: parents, ajout: parents.length < 2 ? { lien: 'parent', titre: 'Ajouter un parent' } : undefined },
  ]

  return (
    <div className="arbre">
      {generations.filter((g) => g.zois.length || g.ajout).map((g) => (
        <div key={g.titre} className="generation">
          <span className="generation-titre">{g.titre}</span>
          <div className="generation-noeuds">
            {g.zois.map((x) => <Noeud key={x.id} x={x} />)}
            {g.ajout && <BoutonAjout a={g.ajout} />}
          </div>
        </div>
      ))}

      <div className="generation generation-centrale">
        <span className="generation-titre">Génération de {z.prenom || 'ce Zoi'}</span>
        <div className="generation-noeuds">
          {fratrie.map((x) => <Noeud key={x.id} x={x} />)}
          <BoutonAjout a={{ lien: 'frere-soeur', titre: 'Frère / sœur' }} />
          <div className="couple">
            <Noeud x={z} centre />
            {conjoints.map((x) => (
              <span key={x.id} className="couple-lien"><Heart size={16} weight="fill" /><Noeud x={x} /></span>
            ))}
            {conjoints.length === 0 && <BoutonAjout a={{ lien: 'conjoint', titre: 'Conjoint·e' }} />}
          </div>
        </div>
      </div>

      <div className="generation">
        <span className="generation-titre">Enfants</span>
        <div className="generation-noeuds">
          {enfants.map((x) => <Noeud key={x.id} x={x} />)}
          <BoutonAjout a={{ lien: 'enfant', titre: 'Ajouter un enfant' }} />
        </div>
      </div>

      {petitsEnfants.length > 0 && (
        <div className="generation">
          <span className="generation-titre">Petits-enfants</span>
          <div className="generation-noeuds">{petitsEnfants.map((x) => <Noeud key={x.id} x={x} />)}</div>
        </div>
      )}

      {d.zois.length === 1 && <Vide titre="L'arbre commence ici" texte="Ajoute des parents, des enfants ou un conjoint : les liens apparaissent aussi dans l'onglet Relations." />}

      {ajout && (
        <Modale titre={ajout.titre} onFermer={() => setAjout(null)}>
          <button className="btn btn-accent" onClick={() => creer(ajout.lien)}><Plus size={16} weight="bold" />Créer un nouveau Zoi</button>
          {d.zois.some((x) => !dejaLies.has(x.id)) && <p className="texte-doux">…ou choisir un Zoi existant :</p>}
          <div className="choix-grille">
            {d.zois.filter((x) => !dejaLies.has(x.id)).map((x) => (
              <button key={x.id} className="choix" onClick={() => { lier(x.id, ajout.lien); setAjout(null) }}>
                <Avatar src={x.portrait} nom={nomComplet(x)} taille={44} decede={x.decede} />
                <span>{nomComplet(x)}</span>
              </button>
            ))}
          </div>
        </Modale>
      )}
    </div>
  )
}
