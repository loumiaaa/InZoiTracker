// Génère data/referentiels/preferences.json
const fs = require('fs');
const path = require('path');
const OUT = '/home/user/inzoitracker/data/referentiels/preferences.json';
const IMG = JSON.parse(fs.readFileSync(path.join(__dirname, '../wiki/img_Pref.json'), 'utf8')).query.allimages;
const REPO = '/home/user/inzoitracker';
const iconeFichier = (f) => { const rel = 'assets/icones/preferences/' + f; return f && fs.existsSync(path.join(REPO, rel)) ? rel : null; };
const imgUrl = (f) => { const i = IMG.find(x => x.name === f); return i ? i.url.replace(/\?cb=\d+$/, '') : null; };

const SRC = {
  fandom: 'https://inzoi.fandom.com/wiki/Preference',
  capture: 'docs/references/jeu-fiche-preferences.png',
  p020: 'https://playinzoi.com/fr/news/8812',
  p030: 'https://playinzoi.com/fr/news/9079',
  p0110: 'https://playinzoi.com/fr/news/11172',
  desired: 'https://inzoi.fandom.com/wiki/Desired_Life',
  gamerant: 'https://gamerant.com/inzoi-all-preferences-list/',
  thegamer: 'https://www.thegamer.com/inzoi-how-to-change-preferences-guide/',
  tgw: 'https://thegameswiki.com/inzoi/wiki/hobbies-and-preferences',
};
const FR_CAPTURE = 'capture du jeu FR (docs/references/jeu-fiche-preferences.png)';
const FR_P020 = 'notes de patch officielles FR v0.2.0 (playinzoi.com/fr/news/8812)';

const categories = [
  { id: 'activites', nom: 'Activités', nom_en: 'Activity', icone: '🧺' },
  { id: 'sport', nom: 'Sport', nom_en: 'Fitness', icone: '🏃' },
  { id: 'nourriture', nom: 'Nourriture', nom_en: 'Food', icone: '🍽️' },
  { id: 'loisirs', nom: 'Loisirs', nom_en: 'Hobby', icone: '🎨' },
  { id: 'instruments', nom: 'Instruments', nom_en: 'Instrument', icone: '🎼' },
  { id: 'lecture', nom: 'Lecture', nom_en: 'Reading', icone: '📚' },
  { id: 'nature', nom: 'Nature', nom_en: 'Relationship / Nature', icone: '🌿',
    notes: 'Catégorie nommée « Relationship » sur le wiki fandom, « Nature » chez TheGamer / CurseForge, « Perception » chez Game Rant.' },
];

// [id, nom FR, nom EN, cat, emoji, fichier wiki, frVerifie, sourceFr, notes]
const P = [
  ['bain', 'Bain', 'Bathing', 'activites', '🛁', 'Pref_Bathing.png'],
  ['nettoyage', 'Nettoyage', 'Cleaning', 'activites', '🧽', 'Pref_Cleaning.png', true, FR_CAPTURE],
  ['cuisine', 'Cuisine', 'Cooking', 'activites', '🍳', 'Pref_Cooking.png', false, null, '« Cuisine » est le nom officiel FR de la compétence Cooking ; libellé de la préférence non vérifié.'],
  ['lessive', 'Lessive', 'Laundry', 'activites', '🧺', 'Pref_Laundry.png', true, FR_CAPTURE],
  ['reparation', 'Réparation', 'Repair', 'activites', '🔧', 'Pref_Repair_Work.png', false, null, 'Appelée « Repair » (fandom) ou « Repairing » (Game Rant).'],
  ['lavage-de-voitures', 'Lavage de voitures', 'Washing Cars', 'activites', '🚗', 'Pref_Washing_Cars.png', true, FR_P020, 'Libellé cité dans les notes de patch officielles FR v0.2.0 (« la préférence « Lavage de voitures » »).'],
  ['sports-de-ballon', 'Sports de ballon', 'Ball Sports', 'sport', '🏀', 'Pref_Ball_Sports.png'],
  ['boxe', 'Boxe', 'Boxing', 'sport', '🥊', 'Pref_Boxing.png'],
  ['jogging', 'Jogging', 'Jogging', 'sport', '🏃', 'Pref_Jogging.png'],
  ['musculation', 'Musculation', 'Strength Training', 'sport', '🏋️', 'Pref_Strenght_Training.png'],
  ['yoga', 'Yoga', 'Yoga', 'sport', '🧘', 'Pref_Yoga.png'],
  ['natation', 'Natation', 'Swimming', 'sport', '🏊', 'Pref_Swimming.png', false, null, 'Ajoutée avec la natation (DLC Escapade insulaire / v0.3.0) ; absente des listes de 33 préférences du lancement. La compétence officielle FR s\'appelle « Nager ».'],
  ['gateau', 'Gâteau', 'Cake', 'nourriture', '🍰', 'Pref_Cake.png'],
  ['viande', 'Viande', 'Meat', 'nourriture', '🥩', 'Pref_Meat.png'],
  ['cafe', 'Café', 'Coffee', 'nourriture', '☕', 'Pref_Coffee.png'],
  ['restauration-rapide', 'Restauration rapide', 'Fast Food', 'nourriture', '🍔', 'Pref_Fast_Food.png'],
  ['plats-epices', 'Plats épicés', 'Spicy Food', 'nourriture', '🌶️', 'Pref_Spicy_Food.png'],
  ['cuisine-de-rue', 'cuisine de rue', 'Street Food', 'nourriture', '🍢', 'Pref_Street_Food.png', true, FR_CAPTURE, 'Affiché en minuscule dans le jeu FR (capture).'],
  ['legumes', 'Légumes', 'Vegetables', 'nourriture', '🥦', 'Pref_Vegetables.png', false, null, 'TheGamer parle de « régime végétarien ».'],
  ['appreciation-de-l-art', 'Appréciation de l\'art', 'Appreciating Art', 'loisirs', '🖼️', 'Pref_Appreciating_Art.png'],
  ['danse', 'Danse', 'Dancing', 'loisirs', '💃', 'Pref_Dancing.png'],
  ['jeux-video', 'Jeux vidéo', 'Gaming', 'loisirs', '🎮', 'Pref_Gaming.png'],
  ['peinture', 'Peinture', 'Painting', 'loisirs', '🎨', 'Pref_Painting.png'],
  ['chant', 'Chant', 'Singing', 'loisirs', '🎤', 'Pref_Singing.png'],
  ['prise-de-photos', 'Prise de photos', 'Taking Photos', 'loisirs', '📷', 'Pref_Taking_Photos.png', true, FR_CAPTURE],
  ['batterie', 'Batterie', 'Drums', 'instruments', '🥁', 'Pref_Drums.png'],
  ['piano', 'Piano', 'Piano', 'instruments', '🎹', 'Pref_Piano.png'],
  ['guitare', 'Guitare', 'Guitar', 'instruments', '🎸', 'Pref_Guitar.png', false, null, 'Icône de guitare, mais libellée « Other » dans le tableau du wiki fandom ; « Guitar » chez Game Rant, TheGamer et dans les Vies désirées.'],
  ['livres-d-art', 'Livres d\'art', 'Art Books', 'lecture', '📕', 'Pref_Art_Books.png'],
  ['livres-de-sante', 'Livres de santé', 'Health Books', 'lecture', '📗', 'Pref_Health_Books.png'],
  ['romans', 'Romans', 'Novels', 'lecture', '📘', 'Pref_Novels.png'],
  ['livres-de-developpement-personnel', 'Livres de développement personnel', 'Self-Help Books', 'lecture', '📙', 'Pref_Self-Help_Books.png', true, FR_CAPTURE],
  ['animaux', 'Animaux', 'Animals', 'nature', '🐾', 'Pref_Animals.png'],
  ['plantes', 'Plantes', 'Plants', 'nature', '🪴', 'Pref_Plants.png'],
];

const elements = P.map(([id, nom, nom_en, cat, icone, wiki, frv = false, srcFr = null, notes = null]) => {
  const url = imgUrl(wiki);
  if (!url) throw new Error('icône wiki introuvable ' + wiki);
  return {
    id, nom, nom_en, fr_verifie: frv, source_fr: srcFr, categorie: cat,
    description: null, icone, icone_url: url, nom_fichier_wiki: wiki, icone_fichier: iconeFichier(wiki),
    details: { sous_categorie: null },
    notes,
    source: frv && srcFr === FR_CAPTURE ? SRC.capture : (srcFr === FR_P020 ? SRC.p020 : SRC.fandom),
  };
});

const out = {
  referentiel: 'preferences',
  titre: 'Préférences',
  maj: '2026-10-23',
  version_jeu: 'v0.11.x (octobre 2026) — liste fandom datée de novembre 2025 (post v0.3.0)',
  sources: [SRC.capture, SRC.fandom, SRC.p020, SRC.p030, SRC.p0110, SRC.desired, SRC.gamerant, SRC.thegamer, SRC.tgw],
  regles: {
    max_par_zoi: 10,
    etats: [
      { id: 'aime', nom: 'Aime', icone: '💛', note: 'cœur jaune en jeu (clic simple)' },
      { id: 'deteste', nom: 'N\'aime pas', icone: '💔', note: 'cœur brisé gris en jeu (double clic)' },
    ],
  },
  notes: [
    'RÈGLES (capture FR + fandom) : jusqu\'à 10 préférences par Zoi (« 5/10 » sur la fiche), chacune aimée (cœur jaune) ou détestée (cœur brisé) ; les cases vides affichent « Aucune préférence ». Elles influencent la vitesse de progression des compétences et les émotions des interactions. Plus d\'attribution automatique aux nouveaux Zois depuis v0.3.0 ; réglables dans Créer un Zoi depuis v0.11.0.',
    'COMPLÉTUDE : 34 préférences en 7 catégories selon le wiki fandom (33 au lancement + Natation). Aucune source ne mentionne de préférences de couleurs, de styles ou de genres musicaux dans inZOI, ni d\'ajout de préférences dans les notes de patch v0.4 à v0.11 (les compétences Pâtisserie, Préparation de boissons, Pêcher, Collectionner, Jeu vidéo… n\'ont pas de préférence associée connue). Les préférences de mods (ZoiWorks Preferences Pack, 118 préférences) sont exclues.',
    'LIBELLÉS FR : 6 vérifiés (5 sur capture + « Lavage de voitures » dans les notes de patch officielles FR v0.2.0) ; les autres sont des traductions proposées. Les noms de catégories ne sont pas affichés sur la fiche Préférences de la capture : noms FR proposés.',
    'ICÔNES : toutes les préférences ont une icône sur le wiki fandom (icone_url + nom_fichier_wiki, ex. Pref_Laundry.png ; copie locale dans icone_fichier, ex. assets/icones/preferences/Pref_Laundry.png) ; le fichier de Musculation est orthographié « Pref_Strenght_Training.png » sur le wiki.',
  ].join('\n'),
  categories: categories.map(c => ({ id: c.id, nom: c.nom, nom_en: c.nom_en, fr_verifie: false, icone: c.icone, notes: c.notes || null })),
  elements,
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
const ids = new Set(); for (const e of elements) { if (ids.has(e.id)) throw new Error('doublon ' + e.id); ids.add(e.id); if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(e.id)) throw new Error('id invalide ' + e.id); }
const v = elements.filter(e => e.fr_verifie).length;
console.log('icone_fichier renseignés: ' + elements.filter(e=>e.icone_fichier).length);
console.log(`preferences: ${categories.length} catégories, ${elements.length} préférences (${v} FR vérifiées = ${Math.round(100 * v / elements.length)}%), icônes wiki utilisées: ${elements.length}/${IMG.filter(i=>i.name.startsWith('Pref_')).length}`);
