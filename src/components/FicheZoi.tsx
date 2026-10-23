import { useState } from 'react'
import { type Zoi, type Relation, type Projet, liste, nomComplet, nouveauZoi, trouver, uid } from '../donnees'
import { JAUGES, REFERENTIELS, inverseLien, urlIconeFichier } from '../referentiels'
import { Avatar, Champ, Confirmer, Icone, Modale, Onglets, Panneau, Photo, Selecteur, useCtx } from './ui'

type Onglet = 'profil' | 'souvenirs' | 'ambitions' | 'preferences' | 'valeur' | 'carriere' | 'relations' | 'vie' | 'futur'
const ONGLETS: { id: Onglet; nom: string }[] = [
  { id: 'profil', nom: 'Profil' }, { id: 'souvenirs', nom: 'Souvenirs' }, { id: 'ambitions', nom: 'Ambitions' },
  { id: 'preferences', nom: 'Préférences' }, { id: 'valeur', nom: 'Valeur' }, { id: 'carriere', nom: 'Carrière' },
  { id: 'relations', nom: 'Relations' }, { id: 'vie', nom: 'Vie & possessions' }, { id: 'futur', nom: 'Futur' },
]

export function FicheZoi({ id, ouvrir, fermer }: { id: string; ouvrir: (id: string) => void; fermer: () => void }) {
  const { d, maj } = useCtx()
  const [onglet, setOnglet] = useState<Onglet>('profil')
  const [suppression, setSuppression] = useState(false)
  const z = d.zois.find((x) => x.id === id)
  if (!z) return <p className="vide">Ce Zoi n'existe plus.</p>

  const set = (patch: Partial<Zoi>) => maj((d) => ({ ...d, zois: d.zois.map((x) => (x.id === id ? { ...x, ...patch } : x)) }))
  const membres = z.foyerId ? d.zois.filter((x) => x.foyerId === z.foyerId) : [z]

  const ajouterMembre = () => {
    const n = nouveauZoi(z.foyerId)
    n.nom = z.nom
    maj((d) => ({ ...d, zois: [...d.zois, n] }))
    ouvrir(n.id)
  }
  const supprimer = () => {
    maj((d) => ({ ...d, zois: d.zois.filter((x) => x.id !== id), relations: d.relations.filter((r) => r.a !== id && r.b !== id) }))
    fermer()
  }

  return (
    <div className="fiche">
      <header className="fiche-tete">
        <div className="fiche-membres">
          {membres.map((m) => (
            <button key={m.id} className="btn-avatar" onClick={() => ouvrir(m.id)}>
              <Avatar src={m.portrait} nom={nomComplet(m)} actif={m.id === id} taille={m.id === id ? 68 : 56} />
            </button>
          ))}
          <button className="btn-plus" onClick={ajouterMembre} aria-label="Ajouter un membre au foyer" title="Ajouter un membre au foyer">＋</button>
        </div>
        <div className="fiche-actions">
          <button className="btn btn-danger-doux" onClick={() => setSuppression(true)}>Supprimer</button>
          <button className="btn-icone" onClick={fermer} aria-label="Fermer la fiche">✕</button>
        </div>
      </header>
      <Onglets onglets={ONGLETS} actif={onglet} onChange={setOnglet} />
      <div className="fiche-corps">
        {onglet === 'profil' && <Profil z={z} set={set} />}
        {onglet === 'souvenirs' && <Souvenirs z={z} set={set} />}
        {onglet === 'ambitions' && <Ambitions z={z} set={set} />}
        {onglet === 'preferences' && <Preferences z={z} set={set} />}
        {onglet === 'valeur' && <Valeurs z={z} set={set} />}
        {onglet === 'carriere' && <Carriere z={z} set={set} />}
        {onglet === 'relations' && <Relations z={z} ouvrir={ouvrir} />}
        {onglet === 'vie' && <Vie z={z} set={set} />}
        {onglet === 'futur' && <Futur z={z} set={set} />}
      </div>
      {suppression && (
        <Confirmer message={`Supprimer ${nomComplet(z)} et toutes ses relations ? Cette action est définitive.`} onOui={supprimer} onNon={() => setSuppression(false)} />
      )}
    </div>
  )
}

type P = { z: Zoi; set: (p: Partial<Zoi>) => void }

function Profil({ z, set }: P) {
  const { d } = useCtx()
  const vie = trouver(d, 'vies-desirees', z.vieDesiree)
  const trait = trouver(d, 'traits', z.trait)
  const carriere = trouver(d, 'carrieres', z.carriere.carriere)
  const etudes = trouver(d, 'niveaux-etudes', z.ecole.niveauEtudes)
  const competences = liste(d, 'competences')

  return (
    <div className="grille-2">
      <Panneau titre="Informations de base" className="col-2">
        <div className="infos-base">
          <Photo src={z.portrait} onChange={(portrait) => set({ portrait })} rond libelle="Portrait" taille={400} />
          <div className="formulaire">
            <Champ label="Prénom"><input className="input" value={z.prenom} onChange={(e) => set({ prenom: e.target.value })} placeholder="Marina" /></Champ>
            <Champ label="Nom de famille"><input className="input" value={z.nom} onChange={(e) => set({ nom: e.target.value })} placeholder="Clark" /></Champ>
            <Champ label="Foyer">
              <select className="input" value={z.foyerId ?? ''} onChange={(e) => set({ foyerId: e.target.value || undefined })}>
                <option value="">Sans foyer</option>
                {d.foyers.map((f) => <option key={f.id} value={f.id}>{f.nom}</option>)}
              </select>
            </Champ>
            <Champ label="Tranche d'âge"><Selecteur cle="etapes-de-vie" valeur={z.etapeDeVie} onChange={(etapeDeVie) => set({ etapeDeVie })} /></Champ>
            <Champ label="Genre"><input className="input" value={z.genre ?? ''} onChange={(e) => set({ genre: e.target.value })} /></Champ>
            <Champ label="Anniversaire"><input className="input" value={z.anniversaire ?? ''} onChange={(e) => set({ anniversaire: e.target.value })} placeholder="Jour en jeu" /></Champ>
            <Champ label="Carrière"><span className="valeur">{carriere?.nom ?? 'Sans emploi'}</span></Champ>
            <Champ label="Niveau d'études"><span className="valeur">{etudes?.nom ?? '—'}</span></Champ>
          </div>
        </div>
      </Panneau>

      <Panneau titre="Vie désirée">
        <div className="carte-illustree">
          {vie?.url ? <img className="illus-vie" src={vie.url} alt="" /> : <div className="illus-vie illus-vide">🌸</div>}
          <div className="carte-illustree-corps">
            <Selecteur cle="vies-desirees" valeur={z.vieDesiree} onChange={(vieDesiree) => set({ vieDesiree })} placeholder="Choisir une Vie désirée" />
            {vie?.description && <p className="texte-doux">{vie.description}</p>}
          </div>
        </div>
      </Panneau>

      <Panneau titre="Traits de caractère et caractéristiques">
        <div className="carte-illustree">
          {trait?.url ? <img className="illus-trait" src={trait.url} alt="" /> : <div className="illus-trait illus-vide">✦</div>}
          <div className="carte-illustree-corps">
            <Selecteur cle="traits" valeur={z.trait} onChange={(t) => set({ trait: t })} placeholder="Choisir un trait" />
            <Selecteur cle="caracteristiques" multiple max={2} valeur={z.caracteristiques} onChange={(caracteristiques) => set({ caracteristiques })} placeholder="Caractéristiques (2)" />
          </div>
        </div>
      </Panneau>

      <Panneau titre="Désir">
        <Selecteur cle="desirs" multiple max={4} valeur={z.desirs} onChange={(desirs) => set({ desirs })} placeholder="Ajouter des désirs (4 max)" />
      </Panneau>

      <Panneau titre="Compétences" action={
        <Selecteur cle="competences" multiple titre="Compétences suivies" valeur={Object.keys(z.competences)} placeholder="＋ Ajouter"
          onChange={(ids) => set({ competences: Object.fromEntries(ids.map((i) => [i, z.competences[i] ?? 1])) })} />
      }>
        <div className="competences">
          {Object.entries(z.competences).map(([cid, niv]) => {
            const c = competences.find((x) => x.id === cid)
            const max = Number(c?.details?.niveau_max) || 10
            return (
              <div key={cid} className="competence">
                <span className="anneau" style={{ ['--p' as any]: `${(niv / max) * 100}%` }}><Icone el={c} taille={34} /></span>
                <div>
                  <div className="competence-nom">{c?.nom ?? cid}</div>
                  <label className="niv">Niv.<input type="number" min={0} max={max} value={niv}
                    onChange={(e) => set({ competences: { ...z.competences, [cid]: Math.max(0, Math.min(max, +e.target.value)) } })} /></label>
                </div>
              </div>
            )
          })}
          {Object.keys(z.competences).length === 0 && <p className="vide">Aucune compétence suivie pour l'instant.</p>}
        </div>
      </Panneau>
    </div>
  )
}

function Souvenirs({ z, set }: P) {
  const { d } = useCtx()
  const [texte, setTexte] = useState('')
  const [ton, setTon] = useState<'positif' | 'negatif' | 'neutre'>('positif')
  const jalons = z.souvenirs.filter((s) => s.jalon)
  const recents = z.souvenirs.filter((s) => !s.jalon)
  const majSouvenir = (sid: string, p: object) => set({ souvenirs: z.souvenirs.map((s) => (s.id === sid ? { ...s, ...p } : s)) })
  const retirer = (sid: string) => set({ souvenirs: z.souvenirs.filter((s) => s.id !== sid) })

  return (
    <div className="pile">
      <Panneau titre="Jalons" action={
        <Selecteur cle="jalons" multiple titre="Jalons atteints" valeur={jalons.map((j) => j.jalon!)} placeholder="＋ Ajouter un jalon"
          onChange={(ids) => set({ souvenirs: [...recents, ...ids.map((j) => jalons.find((s) => s.jalon === j) ?? { id: uid(), jalon: j, texte: '' })] })} />
      }>
        <div className="jalons">
          {jalons.map((s) => {
            const j = trouver(d, 'jalons', s.jalon)
            return (
              <div key={s.id} className="jalon">
                <Photo src={s.image} onChange={(image) => majSouvenir(s.id, { image })} ratio="4/3" libelle="Illustration" />
                <div className="jalon-titre">{j?.icone} {j?.nom ?? s.jalon}</div>
                <input className="input input-mini" placeholder="Date / détail" value={s.date ?? ''} onChange={(e) => majSouvenir(s.id, { date: e.target.value })} />
              </div>
            )
          })}
          {jalons.length === 0 && <p className="vide">Aucun jalon pour l'instant : première rencontre, premier emploi…</p>}
        </div>
      </Panneau>

      <Panneau titre="Souvenirs récents">
        <form className="ligne" onSubmit={(e) => {
          e.preventDefault()
          if (!texte.trim()) return
          set({ souvenirs: [...z.souvenirs, { id: uid(), texte: texte.trim(), tonalite: ton, date: new Date().toLocaleDateString('fr-FR') }] })
          setTexte('')
        }}>
          <select className="input input-auto" value={ton} onChange={(e) => setTon(e.target.value as any)}>
            <option value="positif">😊 Positif</option>
            <option value="neutre">😐 Neutre</option>
            <option value="negatif">😠 Négatif</option>
          </select>
          <input className="input" placeholder="Ce qui s'est passé…" value={texte} onChange={(e) => setTexte(e.target.value)} />
          <button className="btn btn-accent">Ajouter</button>
        </form>
        <div className="souvenirs">
          {[...recents].reverse().map((s) => (
            <div key={s.id} className={'souvenir souvenir-' + (s.tonalite ?? 'neutre')}>
              <span>{s.texte}</span>
              <small>{s.date}</small>
              <button className="btn-icone" onClick={() => retirer(s.id)} aria-label="Supprimer">✕</button>
            </div>
          ))}
        </div>
      </Panneau>
    </div>
  )
}

function Ambitions({ z, set }: P) {
  const { d } = useCtx()
  const refAmb = liste(d, 'ambitions')
  const categories = REFERENTIELS['ambitions']?.categories ?? []
  const majAmb = (aid: string, p: object) => set({ ambitions: z.ambitions.map((a) => (a.id === aid ? { ...a, ...p } : a)) })

  return (
    <div className="pile">
      <div className="ligne-entre">
        <p className="texte-doux">Les objectifs ou grands rêves que ce Zoi souhaite réaliser. Coche les objectifs au fil de tes parties.</p>
        <Selecteur cle="ambitions" valeur={undefined} placeholder="＋ Ajouter une ambition"
          onChange={(aid) => aid && set({ ambitions: [...z.ambitions, { id: uid(), ambition: aid, niveau: 1, faits: [] }] })} />
      </div>
      {z.ambitions.map((a) => {
        const ref = refAmb.find((x) => x.id === a.ambition)
        const cat = categories.find((c) => c.id === ref?.categorie)
        const niveaux: { niveau: number; objectifs: string[] }[] = ref?.details?.niveaux ?? []
        const objectifs = niveaux.find((n) => n.niveau === a.niveau)?.objectifs ?? []
        return (
          <Panneau key={a.id} className="ambition">
            <div className="ambition-tete">
              <span className="ambition-icone">{urlIconeFichier(cat?.icone_fichier) ? <img src={urlIconeFichier(cat?.icone_fichier)} alt="" /> : cat?.icone ?? ref?.icone}</span>
              <div>
                <div className="texte-doux">{cat?.nom}</div>
                <h3 className="ambition-nom">{ref?.nom ?? a.ambition}</h3>
                <div className="texte-accent">Lv.{a.niveau}/{niveaux.length || 3}</div>
              </div>
              <button className="btn-icone" onClick={() => set({ ambitions: z.ambitions.filter((x) => x.id !== a.id) })} aria-label="Retirer l'ambition">✕</button>
            </div>
            <h4>Objectifs</h4>
            <div className="etapes">
              {(niveaux.length ? niveaux : [{ niveau: 1 }, { niveau: 2 }, { niveau: 3 }]).map((n) => (
                <button key={n.niveau} className={'etape' + (n.niveau === a.niveau ? ' etape-active' : '')} onClick={() => majAmb(a.id, { niveau: n.niveau })}>Étape {n.niveau}</button>
              ))}
            </div>
            {objectifs.map((o, i) => {
              const cle = `${a.niveau}:${i}`
              const fait = a.faits.includes(cle)
              return (
                <label key={cle} className={'objectif' + (fait ? ' objectif-fait' : '')}>
                  <input type="checkbox" checked={fait} onChange={() => majAmb(a.id, { faits: fait ? a.faits.filter((f) => f !== cle) : [...a.faits, cle] })} />
                  <span>{o}</span>
                </label>
              )
            })}
            {objectifs.length === 0 && <p className="vide">Objectifs non répertoriés pour cette étape.</p>}
          </Panneau>
        )
      })}
      {z.ambitions.length === 0 && <p className="vide">Aucune ambition suivie.</p>}
    </div>
  )
}

function Preferences({ z, set }: P) {
  const { d } = useCtx()
  const prefs = liste(d, 'preferences')
  return (
    <div className="pile">
      <div className="ligne-entre">
        <p className="texte-doux">Ce que ce Zoi aime ou n'aime pas. Clique sur le cœur pour basculer.</p>
        <Selecteur cle="preferences" multiple max={10} valeur={z.preferences.map((p) => p.id)} placeholder="＋ Ajouter des préférences"
          onChange={(ids) => set({ preferences: ids.map((i) => z.preferences.find((p) => p.id === i) ?? { id: i, aime: true }) })} />
      </div>
      <Panneau titre={`${z.preferences.length}/10`}>
        <div className="preferences">
          {z.preferences.map((p) => {
            const el = prefs.find((x) => x.id === p.id)
            return (
              <div key={p.id} className="preference">
                <span className="tuile"><Icone el={el} taille={44} />
                  <button className={'coeur ' + (p.aime ? 'coeur-aime' : 'coeur-naime')} title={p.aime ? 'Aime' : "N'aime pas"}
                    onClick={() => set({ preferences: z.preferences.map((x) => (x.id === p.id ? { ...x, aime: !x.aime } : x)) })}>
                    {p.aime ? '♥' : '💔'}
                  </button>
                </span>
                <span className="preference-nom">{el?.nom ?? p.id}<small>{p.aime ? 'Aime' : "N'aime pas"}</small></span>
              </div>
            )
          })}
          {Array.from({ length: Math.max(0, 10 - z.preferences.length) }).map((_, i) => (
            <div key={'v' + i} className="preference preference-vide"><span className="tuile">♡</span><span>Aucune préférence</span></div>
          ))}
        </div>
      </Panneau>
    </div>
  )
}

function Valeurs({ z, set }: P) {
  const { d } = useCtx()
  return (
    <Panneau titre="Valeurs" action={<span className="texte-doux">0 à 100</span>}>
      <div className="valeurs">
        {liste(d, 'valeurs').map((v) => {
          const val = z.valeurs[v.id]
          return (
            <label key={v.id} className={'valeur-ligne' + (val === undefined ? ' valeur-inactive' : '')} title={v.description}>
              <span><Icone el={v} taille={22} /> {v.nom}</span>
              <input type="range" min={0} max={100} value={val ?? 0} onChange={(e) => set({ valeurs: { ...z.valeurs, [v.id]: +e.target.value } })} />
              <b>{val ?? '—'}</b>
            </label>
          )
        })}
      </div>
    </Panneau>
  )
}

function Carriere({ z, set }: P) {
  const { d } = useCtx()
  const carriere = trouver(d, 'carrieres', z.carriere.carriere)
  const postes: any[] = Array.isArray(carriere?.details?.postes) ? carriere!.details!.postes : []
  const ec = (p: object) => set({ ecole: { ...z.ecole, ...p } })
  const ca = (p: object) => set({ carriere: { ...z.carriere, ...p } })
  const fr = (p: object) => set({ freelance: { ...z.freelance, ...p } })

  return (
    <div className="grille-2">
      <Panneau titre="École">
        <div className="formulaire">
          <Champ label="Établissement"><Selecteur cle="ecoles" valeur={z.ecole.etablissement} onChange={(etablissement) => ec({ etablissement })} /></Champ>
          <Champ label="Plus haut niveau d'études"><Selecteur cle="niveaux-etudes" valeur={z.ecole.niveauEtudes} onChange={(niveauEtudes) => ec({ niveauEtudes })} /></Champ>
          <Champ label="Moyenne">
            <select className="input" value={z.ecole.moyenne ?? ''} onChange={(e) => ec({ moyenne: e.target.value || undefined })}>
              <option value="">—</option>
              {['A+', 'A', 'B', 'C', 'D', 'F'].map((n) => <option key={n}>{n}</option>)}
            </select>
          </Champ>
        </div>
      </Panneau>

      <Panneau titre="Carrière">
        <div className="formulaire">
          <Champ label="Employeur / carrière"><Selecteur cle="carrieres" valeur={z.carriere.carriere} onChange={(c) => ca({ carriere: c, poste: undefined })} placeholder="Sans emploi" /></Champ>
          <Champ label="Poste">
            {postes.length ? (
              <select className="input" value={z.carriere.poste ?? ''} onChange={(e) => {
                const p = postes.find((x) => String(x.nom) === e.target.value)
                ca({ poste: e.target.value || undefined, niveau: p?.niveau ?? z.carriere.niveau, salaire: typeof p?.salaire === 'number' ? p.salaire : z.carriere.salaire })
              }}>
                <option value="">—</option>
                {postes.map((p, i) => <option key={i} value={String(p.nom)}>{p.niveau ? `Niv.${p.niveau} · ` : ''}{p.nom}</option>)}
              </select>
            ) : <input className="input" value={z.carriere.poste ?? ''} onChange={(e) => ca({ poste: e.target.value })} />}
          </Champ>
          <Champ label="Niveau"><input className="input" type="number" min={0} value={z.carriere.niveau ?? ''} onChange={(e) => ca({ niveau: e.target.value ? +e.target.value : undefined })} /></Champ>
          <Champ label="Salaire (Miaou)"><input className="input" type="number" min={0} value={z.carriere.salaire ?? ''} onChange={(e) => ca({ salaire: e.target.value ? +e.target.value : undefined })} /></Champ>
          <Champ label="Notes"><input className="input" value={z.carriere.notes ?? ''} onChange={(e) => ca({ notes: e.target.value })} placeholder="Horaires, télétravail, projets…" /></Champ>
        </div>
      </Panneau>

      <Panneau titre="Affaires" action={<button className="btn btn-petit" onClick={() => set({ affaires: [...z.affaires, { id: uid(), nom: '' }] })}>＋ Entreprise</button>}>
        {z.affaires.map((a) => {
          const ma = (p: object) => set({ affaires: z.affaires.map((x) => (x.id === a.id ? { ...x, ...p } : x)) })
          return (
            <div key={a.id} className="affaire">
              <Photo src={a.image} onChange={(image) => ma({ image })} ratio="4/3" libelle="Photo" />
              <div className="formulaire">
                <Champ label="Nom"><input className="input" value={a.nom} onChange={(e) => ma({ nom: e.target.value })} /></Champ>
                <Champ label="Type"><Selecteur cle="entreprises" valeur={a.type} onChange={(type) => ma({ type })} /></Champ>
                <Champ label="Notes"><input className="input" value={a.notes ?? ''} onChange={(e) => ma({ notes: e.target.value })} /></Champ>
                <button className="btn btn-lien" onClick={() => set({ affaires: z.affaires.filter((x) => x.id !== a.id) })}>Retirer</button>
              </div>
            </div>
          )
        })}
        {z.affaires.length === 0 && <p className="vide">🏪 Vous n'avez pas d'entreprise.</p>}
      </Panneau>

      <Panneau titre="Freelance">
        <div className="formulaire">
          <Champ label="Note"><input className="input" type="number" value={z.freelance.note ?? ''} onChange={(e) => fr({ note: e.target.value ? +e.target.value : undefined })} /></Champ>
          <Champ label="Gains totaux (Miaou)"><input className="input" type="number" value={z.freelance.gains ?? ''} onChange={(e) => fr({ gains: e.target.value ? +e.target.value : undefined })} /></Champ>
          <Champ label="Licences possédées"><Selecteur cle="freelance" multiple valeur={z.freelance.licences} onChange={(licences) => fr({ licences })} placeholder="Aucune" /></Champ>
          <Champ label="Contrats terminés"><input className="input" type="number" value={z.freelance.contrats ?? ''} onChange={(e) => fr({ contrats: e.target.value ? +e.target.value : undefined })} /></Champ>
        </div>
      </Panneau>
    </div>
  )
}

function Relations({ z, ouvrir }: { z: Zoi; ouvrir: (id: string) => void }) {
  const { d, maj } = useCtx()
  const [ajout, setAjout] = useState(false)
  const rels = d.relations.filter((r) => r.a === z.id || r.b === z.id)
  const niveaux = liste(d, 'relations')
  const filtreLien = (e: { categorie?: string }) => ['lien-familial', 'statut', 'professionnel'].includes(e.categorie ?? '')
  const majRel = (rid: string, p: Partial<Relation>) => maj((d) => ({ ...d, relations: d.relations.map((r) => (r.id === rid ? { ...r, ...p } : r)) }))

  return (
    <div className="pile">
      <div className="ligne-entre">
        <p className="texte-doux">Les liens sont réciproques : si tu indiques un parent, l'autre Zoi verra automatiquement son enfant.</p>
        <button className="btn btn-accent" onClick={() => setAjout(true)} disabled={d.zois.length < 2}>＋ Nouveau lien</button>
      </div>
      {rels.map((r) => {
        const autreId = r.a === z.id ? r.b : r.a
        const autre = d.zois.find((x) => x.id === autreId)
        const lienVu = r.lien && (r.a === z.id ? r.lien : inverseLien(r.lien))
        return (
          <Panneau key={r.id} className="relation">
            <button className="relation-zoi" onClick={() => ouvrir(autreId)}>
              <Avatar src={autre?.portrait} nom={autre ? nomComplet(autre) : '?'} taille={52} />
              <span>{autre ? nomComplet(autre) : 'Zoi supprimé'}</span>
            </button>
            <div className="relation-champs">
              <Champ label={`${autre?.prenom || 'Ce Zoi'} est… pour ${z.prenom || 'lui/elle'}`}>
                <Selecteur cle="relations" filtre={filtreLien} valeur={lienVu} titre="Type de lien"
                  onChange={(l) => majRel(r.id, { lien: l && (r.a === z.id ? l : inverseLien(l)) })} />
              </Champ>
              <div className="jauges">
                {JAUGES.map((j) => (
                  <Champ key={j.id} label={j.nom}>
                    <select className="input" value={r.niveaux[j.id] ?? ''} onChange={(e) => majRel(r.id, { niveaux: { ...r.niveaux, [j.id]: e.target.value || undefined } })}>
                      <option value="">—</option>
                      {niveaux.filter((n) => n.categorie === j.categorie).map((n) => <option key={n.id} value={n.id}>{n.nom}</option>)}
                    </select>
                  </Champ>
                ))}
              </div>
              <input className="input" placeholder="Notes sur cette relation…" value={r.notes ?? ''} onChange={(e) => majRel(r.id, { notes: e.target.value })} />
            </div>
            <button className="btn-icone" aria-label="Supprimer le lien" onClick={() => maj((d) => ({ ...d, relations: d.relations.filter((x) => x.id !== r.id) }))}>✕</button>
          </Panneau>
        )
      })}
      {rels.length === 0 && <p className="vide">Aucune relation renseignée.</p>}
      {ajout && (
        <Modale titre="Nouveau lien" onFermer={() => setAjout(false)}>
          <p className="texte-doux">Avec quel Zoi ?</p>
          <div className="choix-grille">
            {d.zois.filter((x) => x.id !== z.id).map((x) => (
              <button key={x.id} className="choix" onClick={() => {
                maj((d) => ({ ...d, relations: [...d.relations, { id: uid(), a: z.id, b: x.id, niveaux: {} }] }))
                setAjout(false)
              }}>
                <Avatar src={x.portrait} nom={nomComplet(x)} taille={44} />
                <span>{nomComplet(x)}</span>
              </button>
            ))}
          </div>
        </Modale>
      )}
    </div>
  )
}

function Vie({ z, set }: P) {
  const v = (p: object) => set({ vie: { ...z.vie, ...p } })
  return (
    <div className="grille-2">
      <Panneau titre="Où vit ce Zoi">
        <div className="formulaire">
          <Champ label="Ville"><Selecteur cle="villes" valeur={z.vie.ville} onChange={(ville) => v({ ville })} /></Champ>
          <Champ label="Logement / terrain">
            <Selecteur cle="logements" valeur={z.vie.logement} onChange={(logement) => v({ logement })}
              filtre={z.vie.ville ? (e) => !e.details?.ville || e.details.ville === z.vie.ville : undefined} />
          </Champ>
          <Champ label="Adresse / notes"><input className="input" value={z.vie.adresse ?? ''} onChange={(e) => v({ adresse: e.target.value })} /></Champ>
        </div>
        <Photo src={z.vie.photoMaison} onChange={(photoMaison) => v({ photoMaison })} ratio="16/9" libelle="Photo de la maison" />
      </Panneau>
      <Panneau titre="Véhicules">
        <Selecteur cle="vehicules" multiple valeur={z.vie.vehicules} onChange={(vehicules) => v({ vehicules })} placeholder="Aucun véhicule" />
        <Photo src={z.vie.photoVehicule} onChange={(photoVehicule) => v({ photoVehicule })} ratio="16/9" libelle="Photo du véhicule" />
      </Panneau>
      <Panneau titre="Animaux">
        <Selecteur cle="animaux" multiple valeur={z.vie.animaux} onChange={(animaux) => v({ animaux })} placeholder="Aucun animal" />
      </Panneau>
    </div>
  )
}

const STATUTS: { id: Projet['statut']; nom: string }[] = [
  { id: 'a-faire', nom: 'À faire' }, { id: 'en-cours', nom: 'En cours' }, { id: 'fait', nom: 'Fait' },
]

function Futur({ z, set }: P) {
  const [titre, setTitre] = useState('')
  const mp = (pid: string, p: Partial<Projet>) => set({ projets: z.projets.map((x) => (x.id === pid ? { ...x, ...p } : x)) })
  return (
    <div className="pile">
      <Panneau titre="Ce que je prévois pour ce Zoi">
        <form className="ligne" onSubmit={(e) => {
          e.preventDefault()
          if (!titre.trim()) return
          set({ projets: [...z.projets, { id: uid(), titre: titre.trim(), statut: 'a-faire' }] })
          setTitre('')
        }}>
          <input className="input" placeholder="Ex. : le marier avec…, ouvrir un café, devenir pro gamer" value={titre} onChange={(e) => setTitre(e.target.value)} />
          <button className="btn btn-accent">Ajouter</button>
        </form>
        <div className="projets">
          {STATUTS.map((s) => (
            <div key={s.id} className="colonne">
              <h4>{s.nom} <small>{z.projets.filter((p) => p.statut === s.id).length}</small></h4>
              {z.projets.filter((p) => p.statut === s.id).map((p) => (
                <div key={p.id} className="projet">
                  <input className="input projet-titre" value={p.titre} onChange={(e) => mp(p.id, { titre: e.target.value })} />
                  <input className="input input-mini" placeholder="Échéance (ex. avant Senior)" value={p.echeance ?? ''} onChange={(e) => mp(p.id, { echeance: e.target.value })} />
                  <textarea className="input" rows={2} placeholder="Notes…" value={p.notes ?? ''} onChange={(e) => mp(p.id, { notes: e.target.value })} />
                  <div className="ligne">
                    <select className="input input-auto" value={p.statut} onChange={(e) => mp(p.id, { statut: e.target.value as Projet['statut'] })}>
                      {STATUTS.map((x) => <option key={x.id} value={x.id}>{x.nom}</option>)}
                    </select>
                    <button className="btn btn-lien" onClick={() => set({ projets: z.projets.filter((x) => x.id !== p.id) })}>Supprimer</button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Panneau>
      <Panneau titre="Histoire & notes">
        <textarea className="input" rows={6} placeholder="Son histoire, ses secrets, tes idées…" value={z.notes ?? ''} onChange={(e) => set({ notes: e.target.value })} />
      </Panneau>
    </div>
  )
}
