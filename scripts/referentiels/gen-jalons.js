// Génère data/referentiels/jalons.json
const fs = require('fs');
const path = require('path');
const OUT = '/home/user/inzoitracker/data/referentiels/jalons.json';
const SRC = {
  fandom: 'https://inzoi.fandom.com/wiki/Memory',
  capture: 'docs/references/jeu-fiche-souvenirs.png',
  p070: 'https://playinzoi.com/fr/news/9824',
  p080: 'https://playinzoi.com/fr/news/9960',
  p090: 'https://playinzoi.com/fr/news/10165',
  p094: 'https://playinzoi.com/fr/news/10452',
  p0110: 'https://playinzoi.com/fr/news/11172',
  ages: 'https://inzoi.fandom.com/wiki/Age_Group',
  school: 'https://inzoi.fandom.com/wiki/High_School',
};
const FR_CAPTURE = 'capture du jeu FR (docs/references/jeu-fiche-souvenirs.png)';

const categories = [
  { id: 'education', nom: 'Développement et éducation', nom_en: 'Development / Education', icone: '🎓' },
  { id: 'carriere', nom: 'Parcours professionnel', nom_en: 'Career Path', icone: '💼' },
  { id: 'romance', nom: 'Romance', nom_en: 'Romance', icone: '💕' },
  { id: 'famille', nom: 'Famille', nom_en: 'Family', icone: '👪' },
  { id: 'vie', nom: 'Vie', nom_en: 'Life', icone: '🌱' },
  { id: 'catastrophe', nom: 'Catastrophe', nom_en: 'Disaster', icone: '🌪️' },
  { id: 'crime', nom: 'Crime', nom_en: 'Crime', icone: '🚔' },
];

// [id, nom, nom_en, cat, emoji, etape, desc FR, desc EN, frVerifie, notes, source]
const J = [
  ['diplome-de-lycee', 'Diplôme de lycée', 'College Graduate', 'education', '🎓', 'adolescent',
    'Après de longues études, j\'ai lancé mon mortier de diplômé vers le ciel.', 'After completing my lengthy studies, I tossed my graduation cap into sky.', true,
    'Libellé FR vérifié sur capture (illustration : mortiers lancés en l\'air). Le wiki fandom (v0.7.0) liste en EN « College Graduate » avec cette description ; correspondance supposée (le jeu n\'a qu\'un lycée, remise des diplômes à la fin du cursus, v0.9.0). Le libellé EN actuel peut être « High School Graduate ».', SRC.capture],
  ['exclusion-scolaire', 'Départ de l\'école sans diplôme', 'Experience with Expulsion', 'education', '🚪', 'adolescent',
    'Vous avez quitté l\'école autrement que par l\'obtention du diplôme.', 'You have left school by means other than graduation.', false,
    'Lié notamment à l\'objectif « Se faire renvoyer » de l\'ambition ado « La voie du rebelle ».', SRC.fandom],
  ['partenaire-de-prom', 'Partenaire de prom', 'Prom Partner', 'education', '💃', 'adolescent',
    'Avoir eu un(e) partenaire pour le bal de promo du lycée.', null, true,
    'Vu sur capture FR ; ajouté avec le lycée actif et le bal de promo (v0.9.0). Nom EN et catégorie non confirmés (proposition).', SRC.capture],
  ['premier-emploi', 'Premier emploi', 'First Employment', 'carriere', '💼', 'jeune-adulte',
    'Enfin, vous avez fait vos premiers pas dans la société.', 'At last, you\'ve made your first foray into society.', true, null, SRC.capture],
  ['premier-licenciement', 'Premier licenciement', 'First Dismissal', 'carriere', '📦', 'jeune-adulte',
    'Soudain, j\'ai été renvoyé(e) de mon travail et je me suis retrouvé(e) à la rue.', 'Suddenly, I was unexpectedly let go from my workplace and found myself on the streets.', false, null, SRC.fandom],
  ['premiere-promotion', 'Première promotion', 'Initial Promotion', 'carriere', '📈', 'jeune-adulte',
    'Vous avez été promu(e) d\'un échelon et affecté(e) à un nouveau poste.', 'Your job position has been promoted by one level and you\'ve been placed in a new role.', false, null, SRC.fandom],
  ['premiere-demission', 'Première démission', 'First Resignation', 'carriere', '✉️', 'jeune-adulte',
    'J\'ai rédigé ma propre lettre de démission et pris la route d\'un nouveau départ.', 'I penned my own resignation and embarked on a journey towards a new beginning.', false, null, SRC.fandom],
  ['premier-amour', 'Premier amour', 'First Love', 'romance', '💗', 'adolescent',
    'Vivre son premier amour.', null, true,
    'Vu sur capture FR ; absent de la liste fandom (v0.7.0), probablement ajouté avec la romance adolescente (v0.9.0). Nom EN et description non confirmés.', SRC.capture],
  ['premier-chagrin-d-amour', 'Premier chagrin d\'amour', 'First Heartbreak', 'romance', '💔', 'adolescent',
    'Je me suis déclaré(e) pour la première fois, le cœur battant, mais je n\'ai pas été accepté(e).', 'Although I confessed with a trembling heart for the first time, it was not accepted.', false, null, SRC.fandom],
  ['fiancailles', 'Fiançailles', 'Engaged', 'romance', '💍', 'jeune-adulte',
    'Vous avez échangé des bagues avec l\'être aimé et promis un avenir ensemble.', 'You exchanged rings with your beloved and pledged a future together.', true, null, SRC.capture],
  ['double-jeu', 'Double jeu', 'Playing the Field', 'romance', '🎭', 'adolescent',
    'Alors que quelqu\'un partage votre vie, vous avez donné votre cœur à une autre personne.', 'While you have someone by your side, you\'ve given your heart to another.', false, null, SRC.fandom],
  ['infidelite-de-l-etre-aime', 'Infidélité de l\'être aimé', 'Infidelity of a Sweetheart', 'romance', '🥀', 'adolescent',
    'J\'ai compris que la personne que j\'aime donne son affection à quelqu\'un d\'autre que moi.', 'I came to realize that my beloved is giving their affection to someone else, not me.', false, null, SRC.fandom],
  ['mariage', 'Mariage', 'Marriage', 'romance', '💒', 'jeune-adulte',
    'Faisant le vœu de passer leur vie ensemble, ils ont échangé des alliances.', 'With a vow to spend their lives together, they exchanged rings.', false, null, SRC.fandom],
  ['remariage', 'Remariage', 'Remarriage', 'romance', '💞', 'jeune-adulte',
    'Vous avez de nouveau promis votre vie à quelqu\'un.', 'You\'ve once again made a lifelong promise to someone.', false, null, SRC.fandom],
  ['divorce', 'Divorce', 'Divorce', 'romance', '📝', 'jeune-adulte',
    'J\'ai fini par me séparer de la personne avec qui j\'étais.', 'I ended up parting ways with the person is was with.', false, null, SRC.fandom],
  ['premiere-grossesse', 'Première grossesse', 'First Pregnancy', 'famille', '🤰', 'jeune-adulte',
    'Vous avez découvert qu\'une nouvelle vie grandit en vous !', 'You\'ve discovered a new life growing within you!', true, null, SRC.capture],
  ['naissance', 'Naissance d\'une nouvelle vie', 'Birth of New Life', 'famille', '👶', 'jeune-adulte',
    'Pour la première fois, j\'ai tenu dans mes bras l\'être le plus précieux au monde.', 'For the first time, I cradled the most precious being in the world in my arms.', false, null, SRC.fandom],
  ['enfant-du-coeur', 'Enfant du cœur', 'Child born from the heart', 'famille', '🫶', 'jeune-adulte',
    'Nous avons accueilli dans notre famille un enfant lié à nous par le cœur.', 'We embraced a child bound by the heart as family.', false,
    'Jalon d\'adoption.', SRC.fandom],
  ['deces-d-un-membre-de-la-famille', 'Décès d\'un membre de la famille', 'Family\'s Death', 'famille', '🕯️', 'toutes',
    'Un être cher qui était toujours à vos côtés a quitté ce monde.', 'A loved one who was always by your side has left this world.', false, null, SRC.fandom],
  ['faillite', 'Faillite', 'Bankrupt Father', 'vie', '💸', 'jeune-adulte',
    'Vous avez tout donné pour votre famille, mais il ne vous reste que les poches vides.', 'You\'ve persevered for your family, but in the end you\'re left with nothing but empty pockets.', false,
    'Libellé EN du wiki fandom (« Bankrupt Father ») à prendre avec prudence ; traduction FR adaptée.', SRC.fandom],
  ['accident-de-la-route-mortel', 'Accident de la route mortel', 'Inducing fatal traffic accidents', 'vie', '🚑', 'jeune-adulte',
    'Un instant d\'inattention a causé un accident irréparable.', 'An instant lapse led to an irreversible accident.', false,
    'La conduite est réservée aux jeunes adultes et plus (achat de voiture à partir de jeune adulte).', SRC.fandom],
  ['deces-d-une-connaissance', 'Décès d\'une connaissance', 'Passing of an Acquaintance', 'vie', '🕊️', 'toutes',
    'J\'ai dû dire adieu à quelqu\'un de proche.', 'I had to say goodbye to someone I was close to.', false, null, SRC.fandom],
  ['premier-incendie', 'Premier incendie', 'The First Fire', 'catastrophe', '🔥', 'toutes',
    'Pour la première fois, j\'ai vu des flammes s\'élever sous mes yeux.', 'I witnessed flames soaring before my eyes for the first time.', false, null, SRC.fandom],
  ['premiere-tempete', 'Première tempête', 'The First Storm', 'catastrophe', '⛈️', 'toutes',
    'Pour la première fois, j\'ai affronté le vent et la pluie déchaînés.', 'I encountered the fierce wind and rain for the first time.', false, null, SRC.fandom],
  ['sur-la-voie-du-crime', 'Sur la voie du crime', 'The Path of Crime', 'crime', '🦹', 'adolescent',
    'Pour la première fois, j\'ai enfreint la loi et j\'en ai subi les conséquences.', 'For the first time, I violated the law and reaped the consequences.', false,
    'Étape de vie minimale supposée.', SRC.fandom],
  ['derriere-les-barreaux', 'Derrière les barreaux', 'Trapped Behind Bars', 'crime', '⛓️', 'jeune-adulte',
    'Vous avez été enfermé(e) derrière de froids barreaux de fer, privé(e) de liberté.', 'You\'ve been imprisoned within the cold iron bars, stripped of your freedom.', false, null, SRC.fandom],
  ['accuse', 'Accusé(e)', 'Defendant', 'crime', '⚖️', 'jeune-adulte',
    'Vous avez comparu comme accusé(e) devant un tribunal.', 'You have taken the stand as a defendant in a courtroom.', false, null, SRC.fandom],
  ['arnaque-telephonique', 'Arnaque téléphonique', 'Voice Phishing', 'crime', '📞', 'jeune-adulte',
    'Vous avez dupé la personne au bout du fil et lui avez pris son argent.', 'You deceived the person on the other end of the phone and took their money.', false,
    'Lié aux escroqueries ajoutées en v0.5.0 (compétence Crime).', SRC.fandom],
];

const catIds = new Set(categories.map(c => c.id));
const elements = J.map(([id, nom, nom_en, cat, icone, etape, desc, descEn, frv, notes, src]) => {
  if (!catIds.has(cat)) throw new Error('cat ' + cat);
  return {
    id, nom, nom_en, fr_verifie: frv, source_fr: frv ? FR_CAPTURE : null, categorie: cat,
    description: desc, icone, icone_url: null, nom_fichier_wiki: null, icone_fichier: null,
    details: { etape_de_vie: etape, description_en: descEn },
    notes: notes || null,
    source: src,
  };
});

const out = {
  referentiel: 'jalons',
  titre: 'Jalons (Souvenirs)',
  maj: '2026-10-23',
  version_jeu: 'v0.11.x (octobre 2026) — liste fandom datée v0.7.0 + 3 jalons vus sur capture ; incomplète',
  sources: [SRC.capture, SRC.fandom, SRC.p070, SRC.p080, SRC.p090, SRC.p094, SRC.p0110, SRC.ages, SRC.school],
  notes: [
    'FONCTIONNEMENT : onglet « Souvenirs » de la fiche Zoi, bloc « Jalons » (vignettes illustrées, compteur), à côté des « Souvenirs récents ». Système ajouté en v0.7.0 (notes FR : « Dates importantes ») ; v0.8.0 : certains jalons enregistrent le nom du Zoi concerné ; v0.11.0 : relations du foyer mieux décrites dans les jalons.',
    'COMPLÉTUDE : 28 jalons = 25 du wiki fandom (liste v0.7.0, classée en 7 catégories) + « Partenaire de prom » et « Premier amour » vus sur capture (« Diplôme de lycée » est rapproché de « College Graduate »). TROUS CONNUS : les jalons ajoutés en v0.8.0 pour le freelance et les nouvelles carrières (Chercheur, Développeur IT, Architecte, Producteur de musique, Journaliste, Agent de voyage), et ceux du lycée v0.9.0 au-delà des deux vus en capture (bal de promo, roi/reine du bal, renvoi, diplôme avec mention…) ne sont documentés par aucune source accessible. D\'autres jalons (ex. premier baiser, décès, fantôme, vacances v0.10) peuvent exister.',
    'LIBELLÉS FR : 6 vérifiés sur capture (Première grossesse, Fiançailles, Premier emploi, Diplôme de lycée, Partenaire de prom, Premier amour) ; les autres et toutes les descriptions sont des traductions proposées depuis l\'anglais du wiki fandom (descriptions EN conservées dans details.description_en). Les catégories viennent du classement du wiki fandom et ne sont pas visibles sur la capture : noms FR proposés.',
    'ÉTAPE DE VIE : details.etape_de_vie = étape à partir de laquelle le jalon peut normalement être obtenu (« toutes » = n\'importe quel âge). Ids alignés sur data/referentiels/etapes-de-vie.json (nourrisson, enfant-en-bas-age, enfant, preadolescent, adolescent, jeune-adulte, adulte, age-moyen, senior) ; valeur spéciale « toutes ». Étapes minimales déduites des mécaniques (lycée, mariage, conduite…), non documentées jalon par jalon.',
    'ICÔNES : le wiki fandom n\'héberge pas les illustrations des jalons (seulement Checkpoint.png, générique) → icone_url null.',
  ].join('\n'),
  categories: categories.map(c => ({ id: c.id, nom: c.nom, nom_en: c.nom_en, fr_verifie: false, icone: c.icone })),
  elements,
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
const ids = new Set(); for (const e of elements) { if (ids.has(e.id)) throw new Error('doublon ' + e.id); ids.add(e.id); if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(e.id)) throw new Error('id invalide ' + e.id); }
const v = elements.filter(e => e.fr_verifie).length;
console.log(`jalons: ${categories.length} catégories, ${elements.length} jalons (${v} FR vérifiés = ${Math.round(100 * v / elements.length)}%)`);
