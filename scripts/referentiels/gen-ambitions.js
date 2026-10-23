// Génère data/referentiels/ambitions.json
const fs = require('fs');
const path = require('path');
const OUT = '/home/user/inzoitracker/data/referentiels/ambitions.json';
const IMG = JSON.parse(fs.readFileSync(path.join(__dirname, '../wiki/img_Ambition.json'), 'utf8')).query.allimages;
const REPO = '/home/user/inzoitracker';
const iconeFichier = (f) => { const rel = 'assets/icones/ambitions/' + f; return f && fs.existsSync(path.join(REPO, rel)) ? rel : null; };
const imgUrl = (f) => { const i = IMG.find(x => x.name === f); return i ? i.url.replace(/\?cb=\d+$/, '') : null; };

const SRC = {
  fandom: 'https://inzoi.fandom.com/wiki/Ambition',
  gfinity: 'https://www.gfinityesports.com/article/inzoi-complete-guide-to-ambitions',
  capture: 'docs/references/jeu-fiche-ambitions.png',
  p015: 'https://playinzoi.com/fr/news/8544',
  p030: 'https://playinzoi.com/fr/news/9079',
  p040: 'https://playinzoi.com/fr/news/9309',
  p050: 'https://playinzoi.com/fr/news/9533',
  p070: 'https://playinzoi.com/fr/news/9824',
  p090: 'https://playinzoi.com/fr/news/10165',
  p0100: 'https://playinzoi.com/fr/news/10849',
  cheats: 'https://playinzoi.com/fr/guide/cheats',
  dexfr: 'https://www.dexerto.fr/jeux-video/ambitions-inzoi-1608329/',
  millenium: 'https://www.millenium.org/guide/423177.html',
  tgw: 'https://thegameswiki.com/inzoi/wiki/ambitions',
  sportskeeda: 'https://www.sportskeeda.com/esports/what-ambitions-work-inzoi',
  curse: 'https://www.curseforge.com/inzoi/mods/easier-ambitions',
};
const FR_SRC = {
  capture: 'capture du jeu FR (docs/references/jeu-fiche-ambitions.png)',
  p015: 'notes de patch officielles FR v0.1.5 (playinzoi.com/fr/news/8544)',
  p030: 'notes de patch officielles FR v0.3.0 (playinzoi.com/fr/news/9079)',
  p040: 'notes de patch officielles FR v0.4.0 (playinzoi.com/fr/news/9309)',
  p050: 'notes de patch officielles FR v0.5.0 (playinzoi.com/fr/news/9533)',
  dexfr: 'guide FR tiers Dexerto.fr (avril 2025, lu via extraits de moteur de recherche)',
  millenium: 'guide FR tiers Millenium (avril 2025, lu via extraits de moteur de recherche)',
};

const categories = [
  { id: 'reussite-financiere', nom: 'Réussite financière', nom_en: 'Financial Success', fr_verifie: true, source_fr: FR_SRC.p015, icone: '💰', wiki: 'Ambition_Financial_Success.png', public: 'jeune-adulte',
    description: 'Disposer de ressources financières suffisantes pour vivre sans soucis d\'argent.' },
  { id: 'reussite-professionnelle', nom: 'Réussite professionnelle', nom_en: 'Career Success', fr_verifie: true, source_fr: FR_SRC.dexfr, icone: '💼', wiki: 'Ambition_Career_Success.png', public: 'jeune-adulte',
    description: 'Viser un poste plus élevé dans sa carrière.',
    notes: 'Attention : les notes de patch FR v0.5.0 emploient aussi « Réussite professionnelle » pour traduire la nouvelle ambition « Business Success » (catégorie Business Flourishing).' },
  { id: 'entrainement-physique', nom: 'Entraînement physique', nom_en: 'Physical Training', fr_verifie: false, source_fr: null, icone: '🏋️', wiki: 'Ambition_Stay_Healthy.png', public: 'jeune-adulte',
    description: 'Développer son endurance et affiner ses capacités par diverses activités physiques.',
    notes: 'Catégorie appelée « Stay Healthy » au lancement (FR : « Bonne santé » selon Dexerto.fr et Millenium) ; renommée « Physical Training » sur le wiki fandom après la refonte v0.5.0, où Grand chef et Maniaque de la propreté ont été déplacés vers Pro des astuces du quotidien. Libellé FR actuel non vérifié.' },
  { id: 'bonheur-familial', nom: 'Bonheur familial', nom_en: 'Family Happiness', fr_verifie: true, source_fr: FR_SRC.dexfr, icone: '👨‍👩‍👧', wiki: 'Ambition_Family_Happiness.png', public: 'jeune-adulte',
    description: 'Offrir une vie heureuse et stable à tous les membres de la famille.' },
  { id: 'harmonie-et-paix', nom: 'Harmonie et paix', nom_en: 'Harmony and Peace', fr_verifie: true, source_fr: FR_SRC.dexfr, icone: '🕊️', wiki: 'Ambition_Harmony_and_Peace.png', public: 'jeune-adulte',
    description: 'Trouver la paix intérieure et rechercher la tranquillité en harmonie avec la nature.' },
  { id: 'connaissances-et-etudes', nom: 'Connaissances et études', nom_en: 'Knowledge and Learning', fr_verifie: true, source_fr: FR_SRC.p030, icone: '📚', wiki: 'Ambition_Knowledge_and_Learning.png', public: 'jeune-adulte',
    description: 'Acquérir des connaissances et découvrir de nouvelles technologies pour élargir ses horizons.' },
  { id: 'expression-artistique', nom: 'Expression artistique', nom_en: 'Creative Expression', fr_verifie: true, source_fr: FR_SRC.dexfr, icone: '🎨', wiki: 'Ambition_Creative_Expression.png', public: 'jeune-adulte',
    description: 'Exprimer sa créativité à travers des activités artistiques et musicales.' },
  { id: 'quete-de-l-amour', nom: 'Quête de l\'amour', nom_en: 'Pursuit of Love', fr_verifie: true, source_fr: FR_SRC.p015, icone: '💘', wiki: 'Ambition_Pursuit_of_Love.png', public: 'jeune-adulte',
    description: 'Entretenir une relation amoureuse avec quelqu\'un.',
    notes: 'Appelée « Romantic Relationship » dans certains guides EN du lancement (Kotaku, inzoiresource).' },
  { id: 'contribution-communautaire', nom: 'Contribution communautaire', nom_en: 'Community Contribution', fr_verifie: true, source_fr: FR_SRC.p040, icone: '🤝', wiki: 'Ambition_Community_Contribution.png', public: 'jeune-adulte',
    description: 'Contribuer à la communauté et renforcer la solidarité sociale.',
    notes: 'Aussi appelée « Contribute to Community » dans des guides EN ; Dexerto.fr écrit « Contributions à la communauté ».' },
  { id: 'desordre-social', nom: 'Désordre social', nom_en: 'Social Disorder', fr_verifie: true, source_fr: FR_SRC.dexfr, icone: '😈', wiki: 'Ambition_Social_Disorder.png', public: 'jeune-adulte',
    description: 'Défier la loi et l\'ordre en commettant des délits.',
    notes: 'Appelée « Social Unrest » par Sportskeeda.' },
  { id: 'pro-des-astuces-du-quotidien', nom: 'Pro des astuces du quotidien', nom_en: 'Lifehacker', fr_verifie: true, source_fr: FR_SRC.capture + ' + ' + FR_SRC.p050, icone: '🧽', wiki: 'Ambition_Lifehacker.png', public: 'jeune-adulte',
    description: 'Maîtriser les tâches du quotidien et se construire une vie autonome.', version_ajout: 'v0.5.0' },
  { id: 'collectionner-et-creation', nom: 'Collectionner et Création', nom_en: 'Collecting and Crafting', fr_verifie: true, source_fr: FR_SRC.p050, icone: '⛏️', wiki: 'Ambition_Collecting.png', public: 'jeune-adulte',
    description: 'Récolter des ressources et les transformer en objets de valeur.', version_ajout: 'v0.5.0',
    notes: 'Libellé FR tiré des notes de patch v0.5.0 (« Collectionner et Création ») ; le libellé exact en jeu reste à confirmer.' },
  { id: 'prosperite-de-l-entreprise', nom: 'Prospérité de l\'entreprise', nom_en: 'Business Flourishing', fr_verifie: false, source_fr: null, icone: '🏪', wiki: 'Ambition_Business.png', public: 'jeune-adulte',
    description: 'Saisir les opportunités et créer de la valeur pour faire prospérer son entreprise.', version_ajout: 'v0.5.0',
    notes: 'Nom EN « Business Flourishing » (wiki fandom) / « Business Success » (notes de patch EN v0.5.0). Les notes FR v0.5.0 traduisent « Réussite professionnelle » (homonyme de Career Success) ; « Prospérité de l\'entreprise » est le titre de section FR des notes v0.5.0 sur les entreprises, repris ici comme proposition.' },
  { id: 'celebrite-de-l-ecole', nom: 'Célébrité de l\'école', nom_en: 'School Celebrity', fr_verifie: false, source_fr: null, icone: '🌟', wiki: 'Ambition_School_Celebrity.png', public: 'adolescent',
    description: 'Pour les Zois qui veulent être au centre de la vie scolaire et attirer tous les regards.', version_ajout: 'v0.9.0' },
  { id: 'esprit-libre-a-l-ecole', nom: 'Esprit libre à l\'école', nom_en: 'Free Spirit at School', fr_verifie: false, source_fr: null, icone: '🛹', wiki: 'Ambition_Free_Spirit_School.png', public: 'adolescent',
    description: 'Devenir une présence fascinante qui parcourt l\'école librement et avec audace.', version_ajout: 'v0.9.0' },
];

// n(1..3) -> [objectifs FR], [objectifs EN]
const L = (fr, en) => ({ fr, en });
const A = [];
function amb(o) { A.push(o); }

amb({ id: 'richesse', nom: 'Richesse', nom_en: 'Wealth', fr: true, src_fr: FR_SRC.dexfr, cat: 'reussite-financiere', icone: '💰',
  description: 'Accumuler de l\'argent, épargner à la banque et vivre dans une propriété de valeur.',
  niveaux: [
    L(['Posséder 50 000 Miaou', 'Acheter 5 fois un meuble de plus de 800 Miaou'], ['Hold 50,000 Meow', 'Buy 5 furniture pieces worth 800+ Meow']),
    L(['Déposer de l\'argent à la banque 10 fois', 'Habiter une propriété d\'une valeur de plus de 35 000 Miaou'], ['Deposit money 10 times', 'Own property worth 35,000+ Meow']),
    L(['Posséder 200 000 Miaou', 'Habiter une propriété d\'une valeur de plus de 50 000 Miaou'], ['Hold 200,000 Meow', 'Own property worth 50,000+ Meow']),
  ],
  rec: ['Accès aux produits VIP de la banque', 'Interaction sur soi « Donner de l\'argent »', 'Conversation « Se vanter de son argent »'],
  rec_en: ['You can use VIP products at the bank', '"Give Away Money" self-interaction', '"Bragging About Your Money" conversation'],
  notes: 'Niveau 3 : 200 000 Miaou selon fandom, Dexerto, Game8 ; 20 000 selon Gfinity et TheGamer. La valeur de propriété ne compte que le terrain (précision officielle FR v0.1.5).',
  src: SRC.fandom });

amb({ id: 'manoir-de-luxe', nom: 'Manoir de luxe', nom_en: 'Luxury Mansion', fr: true, src_fr: FR_SRC.dexfr, cat: 'reussite-financiere', icone: '🏰',
  description: 'Posséder une propriété luxueuse et la meubler richement.',
  niveaux: [
    L(['Posséder 50 000 Miaou', 'Habiter une propriété d\'une valeur de 35 000 Miaou ou plus (terrain seul)'], ['Hold 50,000 Meow', 'Own property worth 35,000+ Meow']),
    L(['Acheter un meuble de plus de 1 500 Miaou', 'Planter 10 arbres de taille moyenne ou plus'], ['Buy 1,500+ Meow furniture', 'Plant 10 medium/large trees']),
    L(['Acheter 5 fois un meuble de plus de 800 Miaou', 'Habiter une propriété d\'une valeur de plus de 50 000 Miaou'], ['Buy 800+ Meow furniture 5 times', 'Own property worth 50,000+ Meow']),
  ],
  rec: ['Réduction sur les factures d\'eau et d\'électricité du foyer', 'Accès aux produits VIP de la banque', 'Conversation « Montrer sa maison »'],
  rec_en: ['Water and electricity usage at home discounted', 'You can use VIP products at the bank', '"Show Off Your House" conversation'],
  src: SRC.fandom });

amb({ id: 'responsable-de-generation-suivante', nom: 'Responsable de génération suivante', nom_en: 'Next Gen Leader', fr: true, src_fr: FR_SRC.p030, cat: 'reussite-professionnelle', icone: '👔',
  description: 'Devenir un leader grâce à la lecture et à l\'éloquence.',
  niveaux: [
    L(['Lire 10 fois des livres de développement personnel'], ['Read self-help books 10 times']),
    L(['Atteindre le niveau 6 en Rhétorique', 'Lire 10 fois des livres de développement personnel'], ['Rhetoric level 6', 'Read self-help books 10 times']),
    L(['Avoir 100 conversations d\'affaires positives', 'Atteindre le niveau 10 en Rhétorique'], ['100 positive business conversations', 'Rhetoric level 10']),
  ],
  rec: ['Cachet supplémentaire après un séminaire', 'Interaction sur soi « Montrer la carte de visite »'],
  rec_en: ['Additional lecture fee after the seminar', 'Business card self-interaction ("Show Off Business Card")'],
  notes: 'Libellé FR des notes de patch officielles v0.3.0 ; Dexerto.fr (avril 2025) écrit « Leader de dernière génération ».',
  src: SRC.fandom });

amb({ id: 'zoi-competent', nom: 'Zoi compétent', nom_en: 'Competent Talent', fr: true, src_fr: FR_SRC.dexfr, cat: 'reussite-professionnelle', icone: '📈',
  description: 'Réseauter, investir et grimper les échelons au travail.',
  niveaux: [
    L(['Serrer la main d\'une connaissance (ou plus proche) 10 fois', 'S\'entraîner à l\'investissement simulé sur ordinateur 5 fois'], ['Shake hands 10 times', 'Simulate investments 5 times']),
    L(['Avoir un emploi à temps plein', 'Obtenir une promotion'], ['Have full-time job', 'Get promoted once']),
    L(['Trinquer 10 fois avec un partenaire d\'affaires', 'Obtenir 2 promotions'], ['Toast with partners 10 times', 'Get promoted twice']),
  ],
  rec: ['Interaction « Investir réellement en bourse »', 'Points de relation d\'affaires supplémentaires pendant les conversations'],
  rec_en: ['"Genuinely Invest Stocks" interaction', 'Additional Business Relationship points during conversations'],
  src: SRC.fandom });

amb({ id: 'expert-de-la-condition-physique', nom: 'Expert de la condition physique', nom_en: 'Fitness Master', fr: true, src_fr: FR_SRC.dexfr, cat: 'entrainement-physique', icone: '💪',
  description: 'S\'entraîner régulièrement et maîtriser la compétence Condition physique.',
  niveaux: [
    L(['Acheter un équipement de fitness', 'Faire de l\'exercice 3 fois'], ['Buy fitness equipment', 'Work out 3 times']),
    L(['Lire 10 fois des livres sur la santé', 'Atteindre le niveau 6 en Condition physique'], ['Read health books 10 times', 'Fitness level 6']),
    L(['Faire de l\'exercice 20 fois en étant concentré', 'Atteindre le niveau 10 en Condition physique'], ['Work out 20 times while focused', 'Fitness level 10']),
  ],
  rec: ['Interaction sur soi « Montrer ses muscles »', 'Conversation « Expliquer comment rester concentré pendant l\'entraînement »'],
  rec_en: ['"Show Off Muscles" self-interaction', '"Explain How to Maintain Focus While Working Out" conversation'],
  src: SRC.fandom });

amb({ id: 'maitre-de-la-natation', nom: 'Maître de la natation', nom_en: 'Master Swimmer', fr: false, src_fr: null, cat: 'entrainement-physique', icone: '🏊',
  description: 'Prendre des cours, gagner des compétitions et maîtriser la natation.',
  niveaux: [
    L(['Participer 3 fois à des cours de natation', 'Atteindre le niveau 3 en Nager'], ['Participate in swimming lessons 3 times', 'Swimming level 3']),
    L(['Gagner 3 fois une compétition de natation', 'Atteindre le niveau 6 en Nager'], ['Win a swimming competition 3 times', 'Swimming level 6']),
    L(['Atteindre le niveau 10 en Nager'], ['Swimming level 10']),
  ],
  rec: ['La Vitalité diminue très lentement pendant la nage', 'Meilleures chances de gagner une compétition de natation'],
  rec_en: ['Vitality decreases very slowly when swimming', 'Chances of winning a swimming competition increase'],
  notes: 'Liée à la compétence Nager (arrivée avec le DLC Escapade insulaire / v0.3.0) ; version d\'ajout de l\'ambition non confirmée. « Nager » = nom officiel FR de la compétence (guide des codes de triche).',
  src: SRC.fandom });

amb({ id: 'famille-aimante', nom: 'Famille aimante', nom_en: 'Loving Family', fr: true, src_fr: FR_SRC.dexfr, cat: 'bonheur-familial', icone: '👨‍👩‍👧',
  description: 'Fonder une famille et entretenir des liens chaleureux avec son/sa partenaire et ses enfants.',
  niveaux: [
    L(['Se marier (fonder une famille)', 'Avoir 3 conversations familiales positives avec son/sa partenaire'], ['Get married', '3 positive family conversations']),
    L(['Avoir 20 conversations familiales positives avec son/sa partenaire', 'Avoir 10 conversations familiales touchantes en étant ému(e) ou sentimental(e)'], ['20 positive partner conversations', '10 sentimental family moments']),
    L(['Avoir 50 conversations familiales positives avec son/sa partenaire', 'Avoir 30 conversations positives avec un enfant'], ['50 positive partner conversations', '30 positive child conversations']),
  ],
  rec: ['Conversation « Conseils pour une famille aimante »', 'Points de relation familiale supplémentaires pendant les conversations'],
  rec_en: ['"Counseling Loving Families" conversation', 'Additional family relationship points during conversations'],
  src: SRC.fandom });

amb({ id: 'parentalite-experte', nom: 'Parentalité experte', nom_en: 'Parenting Expert', fr: true, src_fr: FR_SRC.dexfr, cat: 'bonheur-familial', icone: '🍼',
  description: 'Jouer avec ses enfants, s\'en occuper et les éduquer.',
  niveaux: [
    L(['Jouer 5 fois avec un enfant', 'Danser 5 fois pour un enfant'], ['Play with child 5 times', 'Dance for child 5 times']),
    L(['Raconter 10 fois une histoire', 'S\'occuper d\'un enfant 20 fois'], ['Tell stories 10 times', 'Child care 20 times']),
    L(['Chanter 10 fois des chansons amusantes à un enfant', 'Faire 50 actions d\'éducation'], ['Sing to child 10 times', 'Child rearing 50 times']),
  ],
  rec: ['Possibilité de postuler à un emploi de baby-sitter', 'Conversation « Conseils de parentalité »'],
  rec_en: ['You can apply for a babysitting job', '"Parenting Tips" conversation'],
  notes: 'Les guides ne répartissent pas tous les objectifs de la même façon entre les niveaux.',
  src: SRC.fandom });

amb({ id: 'amateur-de-plantes', nom: 'Amateur de plantes', nom_en: 'Plant Lover', fr: true, src_fr: FR_SRC.dexfr, cat: 'harmonie-et-paix', icone: '🪴',
  description: 'Cultiver des plantes d\'intérieur et des bonsaïs, maîtriser le Jardinage.',
  niveaux: [
    L(['Acheter 5 plantes d\'intérieur', 'Arroser un pot de fleurs (ou interagir avec) 3 fois'], ['Buy 5 houseplants', 'Water plants 3 times']),
    L(['Arroser les plantes (ou interagir avec) 10 fois', 'Atteindre le niveau 6 en Jardinage'], ['Water plants 10 times', 'Gardening level 6']),
    L(['Arranger un bonsaï 5 fois (pot à bonsaï)', 'Atteindre le niveau 10 en Jardinage'], ['Arrange bonsai 5 times', 'Gardening level 10']),
  ],
  rec: ['Interaction « Faire pousser les plantes instantanément »', 'Conversation « Comment prendre soin d\'une plante »'],
  rec_en: ['"Grow a plant immediately" interaction', '"How to take care of a plant" conversation'],
  notes: 'Nom FR de l\'interaction de récompense tiré des notes de patch officielles FR v0.3.0.',
  src: SRC.fandom });

amb({ id: 'esprit-tranquille', nom: 'Esprit tranquille', nom_en: 'Tranquil Mind', fr: true, src_fr: FR_SRC.dexfr, cat: 'harmonie-et-paix', icone: '🧘',
  description: 'Yoga, méditation et détente pour atteindre la sérénité.',
  niveaux: [
    L(['Acheter un tapis de yoga', 'Faire du yoga 3 fois'], ['Buy yoga mat', 'Do yoga 3 times']),
    L(['Faire du yoga 10 fois', 'Prendre une douche chaude 5 fois en étant mal à l\'aise'], ['Yoga 10 times', 'Hot showers 5 times when uncomfortable']),
    L(['Méditer 50 fois sur un tapis de yoga', 'Se reposer ou faire la sieste 30 fois sur un transat'], ['Meditate 50 times', 'Sunbed naps 30 times']),
  ],
  rec: ['L\'émotion « Satisfait » est toujours active', 'Interaction sur soi « Partager sa paix intérieure »'],
  rec_en: ['The Content emotion is always active', '"Share Inner Peace" self-interaction'],
  src: SRC.fandom });

amb({ id: 'maitre-du-cafe', nom: 'Maître du café', nom_en: 'Coffee Master', fr: false, src_fr: null, cat: 'harmonie-et-paix', icone: '☕', version_ajout: 'v0.7.0',
  description: 'Préparer du café et maîtriser la compétence Fabrication de café.',
  niveaux: [
    L(['Acheter un moulin à café', 'Préparer 5 tasses de café'], ['Purchase a Coffee Grinder', 'Make 5 cups of coffee']),
    L(['Atteindre le niveau 6 en Fabrication de café', 'Préparer 15 tasses de café'], ['Coffee Craft Level 6', 'Make 15 cups of coffee']),
    L(['Atteindre le niveau 10 en Fabrication de café', 'Préparer 5 cafés de qualité parfaite'], ['Coffee Craft Level 10', 'Make 5 perfect quality cups of coffee']),
  ],
  rec: ['Concentration accrue en préparant le café, pour des cafés de meilleure qualité'],
  rec_en: ['Your focus increases when brewing coffee, leading to a higher quality cup of coffee'],
  notes: 'Notes de patch officielles FR v0.7.0 : « Pro du café » ; mais la même note écrit « Pro de la préparation de boissons » alors que le jeu affiche « Maître de la préparation de boissons » (capture), d\'où la proposition « Maître du café ». Classée dans Harmonie et paix par le wiki fandom (les deux autres ambitions v0.7.0 sont dans Pro des astuces du quotidien) : catégorie à vérifier en jeu. TheGamesWiki l\'appelle « Master Barista ».',
  src: SRC.fandom });

amb({ id: 'encyclopedie-vivante', nom: 'Encyclopédie vivante', nom_en: 'Walking Encyclopedia', fr: true, src_fr: FR_SRC.dexfr, cat: 'connaissances-et-etudes', icone: '📖',
  description: 'Réparer, fabriquer, créer et monter de nombreuses compétences.',
  niveaux: [
    L(['Réparer un objet cassé 3 fois', 'Atteindre le niveau 5 dans 3 compétences'], ['Fix objects 3 times', 'Level 5 in 3 skills']),
    L(['Fabriquer des meubles à l\'établi 15 fois', 'Atteindre le niveau 8 dans 5 compétences'], ['Make furniture 15 times', 'Level 8 in 5 skills']),
    L(['Créer des vidéos sur ordinateur 20 fois', 'Atteindre le niveau 10 dans 5 compétences'], ['Create videos 20 times', 'Level 10 in 5 skills']),
  ],
  rec: ['Moins de risques de pannes et d\'incendies', 'Plus d\'XP en Tâches ménagères, Jardinage, Condition physique, Cuisine, Fabrication de café et Instruments'],
  rec_en: ['Chances of malfunctions and fires decrease', 'More experience in Chores, Gardening, Exercise, Cooking, Coffee Craft and Instruments'],
  src: SRC.fandom });

amb({ id: 'puits-de-connaissance', nom: 'Puits de connaissance', nom_en: 'Knowledge Seeker', fr: true, src_fr: FR_SRC.millenium, cat: 'connaissances-et-etudes', icone: '🎓',
  description: 'Lire, s\'informer, écrire et maîtriser la Pensée critique.',
  niveaux: [
    L(['Acheter une bibliothèque', 'Lire un livre 3 fois'], ['Buy bookshelf', 'Read books 3 times']),
    L(['Lire un livre 10 fois', 'Lire le journal 5 fois (tablette ou kiosque)'], ['Read books 10 times', 'Read news 5 times']),
    L(['Atteindre le niveau 10 en Pensée critique', 'Écrire 20 fois sur un ordinateur'], ['Critical Thinking level 10', 'Write on computer 20 times']),
  ],
  rec: ['XP supplémentaire en Charme, Pensée critique, Programmation, Art et Production média'],
  rec_en: ['Additional skill experience for Charm, Critical Thinking, Programming, Art, Media Production'],
  src: SRC.fandom });

amb({ id: 'grand-peintre', nom: 'Grand peintre', nom_en: 'Great Painter', fr: true, src_fr: FR_SRC.dexfr, cat: 'expression-artistique', icone: '🖼️',
  description: 'Peindre, étudier l\'art et maîtriser la compétence Art.',
  niveaux: [
    L(['Acheter un chevalet', 'Peindre 3 tableaux'], ['Buy easel', 'Paint 3 times']),
    L(['Peindre 10 tableaux', 'Lire 10 livres d\'art'], ['Paint 10 times', 'Read art books 10 times']),
    L(['Atteindre le niveau 10 en Art', 'Apprécier l\'art 10 fois en étant curieux'], ['Art level 10', 'Appreciate art 10 times while Curious']),
  ],
  rec: ['Émotions supplémentaires dans les galeries d\'art'],
  rec_en: ['You can gain additional emotions on the art gallery property'],
  src: SRC.fandom });

amb({ id: 'voix-d-ange', nom: 'Voix d\'ange', nom_en: 'Voice of Heaven', fr: true, src_fr: FR_SRC.dexfr, cat: 'expression-artistique', icone: '🎤',
  description: 'Chanter, faire du karaoké et maîtriser la compétence Spectacle.',
  niveaux: [
    L(['Acheter un micro sur pied', 'Chanter 3 fois'], ['Buy a standing microphone', 'Sing 3 times']),
    L(['Chanter 10 fois en étant amusé', 'Atteindre le niveau 6 en Spectacle'], ['Sing 10 times while amused', 'Performance level 6']),
    L(['Chanter 10 fois au karaoké (cabine à pièces)', 'Atteindre le niveau 10 en Spectacle'], ['Karaoke 10 times', 'Performance level 10']),
  ],
  rec: ['Meilleures chances de gagner un concours de chant', 'Interaction sur soi « Chanter d\'une voix douce »'],
  rec_en: ['Probability of winning a singing competition increases', '"Sing with Sweet Voice" self-interaction'],
  src: SRC.fandom });

amb({ id: 'pro-de-la-musique', nom: 'Pro de la musique', nom_en: 'Pro Musician', fr: true, src_fr: FR_SRC.dexfr, cat: 'expression-artistique', icone: '🎸',
  description: 'Jouer d\'un instrument et maîtriser la compétence Instruments.',
  niveaux: [
    L(['Acheter un instrument', 'Jouer d\'un instrument 3 fois'], ['Buy instrument', 'Play 3 times']),
    L(['Jouer de la batterie 10 fois', 'Jouer d\'un instrument 10 fois en étant sentimental'], ['Play drums 10 times', 'Play instrument 10 times while Moved']),
    L(['Atteindre le niveau 10 en Instruments', 'Jouer de la guitare 20 fois'], ['Instrument level 10', 'Play guitar 20 times']),
  ],
  rec: ['Meilleures chances de gagner une compétition', 'Interaction sur soi « Jouer de la guitare comme un pro »'],
  rec_en: ['Chances of winning a competition increase', '"Play Guitar Professionally" self-interaction'],
  notes: 'Niveau 2 : émotion « Moved » (fandom) ou « Sentimental » (Gfinity, Game8).',
  src: SRC.fandom });

amb({ id: 'chouchou-de-la-nation', nom: 'Chouchou de la nation', nom_en: 'Nation\'s Sweetheart', fr: true, src_fr: FR_SRC.p015, cat: 'quete-de-l-amour', icone: '😍',
  description: 'Multiplier les conversations romantiques et les grands amours.',
  niveaux: [
    L(['Avoir 5 conversations romantiques positives'], ['Positive romantic conversations 5 times']),
    L(['Avoir 50 conversations romantiques positives'], ['Romantic conversations 50 times']),
    L(['Atteindre le niveau 10 en Charme', 'Avoir 5 relations « Grand amour »'], ['Charm level 10', '5 true love relationships']),
  ],
  rec: ['Les points de relation amoureuse augmentent davantage pendant les conversations', 'Interaction sur soi « Exprimer son attirance »'],
  rec_en: ['Romantic relationship scores increase more during conversations', '"Express Attraction" self-interaction'],
  notes: 'Gfinity indique « 1 relation True Love » au niveau 3 ; fandom et Sportskeeda indiquent 5.',
  src: SRC.fandom });

amb({ id: 'partenaires-amoureux', nom: 'Partenaires amoureux', nom_en: 'Partners in Love', fr: true, src_fr: FR_SRC.p015, cat: 'quete-de-l-amour', icone: '💑',
  description: 'Vivre une relation de couple jusqu\'à la demande en mariage.',
  niveaux: [
    L(['Avoir 1 relation de béguin réciproque', 'Se tenir la main et discuter 3 fois (béguin réciproque ou plus)'], ['1 mutual crush', 'Hold hands and talk 3 times']),
    L(['Se tenir la main et discuter 10 fois', 'Faire une sérénade 10 fois (chéri(e) ou plus)'], ['Hold hands and talk 10 times', 'Serenade 10 times']),
    L(['Faire sa demande en étant troublé(e) ou ébloui(e)', 'Montrer son affection à son grand amour 20 fois'], ['Propose while aflutter', 'Show affection True Love 20 times']),
  ],
  rec: ['Possibilité de donner des conseils amoureux en conversation'],
  rec_en: ['You can give relationship advice in a conversation'],
  src: SRC.fandom });

amb({ id: 'philanthrope', nom: 'Philanthrope', nom_en: 'Philanthropist', fr: true, src_fr: FR_SRC.p015, cat: 'contribution-communautaire', icone: '🎁',
  description: 'Faire des dons et aider la communauté.',
  niveaux: [
    L(['Envoyer 5 lettres depuis une boîte aux lettres de rue', 'Faire 5 dons à une œuvre caritative via un distributeur automatique de billets'], ['Send letters 5 times', 'Charity via ATM 5 times']),
    L(['Faire 10 dons à la communauté locale (boîte aux lettres de rue)', 'Donner 15 livres (boîte aux lettres)'], ['Donate to community 10 times', 'Donate books 15 times']),
    L(['Faire 10 dons à un sans-abri', 'Signer un accord de don d\'organes sur ordinateur (action de karma)'], ['Donate to homeless 10 times', 'Sign organ donation']),
  ],
  rec: ['Messages de remerciement et argent envoyés par des bienfaiteurs anonymes'],
  rec_en: ['Thank-you messages and currency from anonymous supporters'],
  src: SRC.fandom });

amb({ id: 'voisin-enjoue', nom: 'Voisin enjoué', nom_en: 'Cheerful Neighbor', fr: false, src_fr: null, cat: 'contribution-communautaire', icone: '😊',
  description: 'Se faire des amis dans le voisinage et multiplier les meilleurs amis.',
  niveaux: [
    L(['Avoir 5 conversations positives', 'Avoir 5 conversations amicales positives'], ['Positive conversations 5 times', 'Positive friendship talks 5 times']),
    L(['Avoir 15 conversations amicales positives', 'Offrir 10 cartes de remerciement ou cadeaux surprises'], ['Friendship talks 15 times', 'Give gifts 10 times']),
    L(['Avoir 10 relations de meilleur(e) ami(e)', 'Danser avec enthousiasme 20 fois avec un(e) meilleur(e) ami(e)'], ['10 BFF relationships', 'Dance with BFF 20 times']),
  ],
  rec: ['Les points d\'amitié augmentent davantage pendant les conversations', 'Interaction sur soi « Danse joyeuse »', 'Conversation « Recommander des attractions locales »'],
  rec_en: ['Friendship relationship points increase more during conversations', '"Pleasant Dance" self-interaction', '"Recommend Local Attractions" conversation'],
  src: SRC.fandom });

amb({ id: 'vilain-notoire', nom: 'Vilain notoire', nom_en: 'Notorious Villain', fr: true, src_fr: FR_SRC.p015, cat: 'desordre-social', icone: '🦹',
  description: 'Vandaliser, se battre et finir derrière les barreaux.',
  niveaux: [
    L(['Passer sa colère sur un distributeur automatique 5 fois', 'Jeter discrètement des déchets par terre 3 fois'], ['Damage vending machines 5 times', 'Litter 3 times']),
    L(['Pousser et faire tomber des Zois 3 fois', 'Déclencher une bagarre 5 fois'], ['Push Zois 3 times', 'Start fights 5 times']),
    L(['Obtenir un financement grâce à de fausses informations 5 fois (Rhétorique niv. 5 requise)', 'Être arrêté(e) et placé(e) en détention 5 fois'], ['Secure Funding through False Information 5 times (Rhetoric skill Level 5)', 'Get arrested 5 times']),
  ],
  rec: ['Interaction « Demander une surveillance policière accrue »'],
  rec_en: ['"Request Increased Police Attention" interaction'],
  notes: 'Appelée « Crime-Bent Villain » par Gfinity. Niveau 3 avant v0.5.0 (Gfinity/Sportskeeda) : « présenter une bonne idée et obtenir un investissement 5 fois ». Dexerto.fr (selon un extrait de moteur de recherche) écrirait « Malfaiteur notoire » : le libellé retenu est celui des notes de patch officielles FR v0.1.5.',
  src: SRC.fandom });

amb({ id: 'hackers-celebres', nom: 'Hackers célèbres', nom_en: 'Famous Hackers', fr: false, src_fr: null, cat: 'desordre-social', icone: '💻',
  description: 'Programmer, pirater des DAB puis des banques.',
  niveaux: [
    L(['Atteindre le niveau 3 en Programmation', 'Survivre 5 fois à une arnaque de vente d\'occasion'], ['Achieve programming level 3', 'Survive a secondhand trade scam 5 times']),
    L(['Atteindre le niveau 6 en Programmation', 'Pirater un distributeur automatique de billets 10 fois'], ['Achieve programming level 6', 'Hack an ATM 10 times']),
    L(['Atteindre le niveau 10 en Programmation', 'Pirater une banque 3 fois'], ['Achieve programming level 10', 'Hack a bank 3 times']),
  ],
  rec: ['Meilleures chances de gagner un concours de piratage', 'Interaction « Diffuser un code malveillant sur Internet »'],
  rec_en: ['Chances of winning a hacking competition increase', '"Spread malicious code on the internet" interaction'],
  notes: 'Objectifs d\'après Gfinity/Sportskeeda (le tableau fandom recopie par erreur ceux de Vilain notoire) ; récompenses d\'après fandom. Aussi orthographié « Famous Hacker ».',
  src: SRC.gfinity });

amb({ id: 'champion-de-la-proprete', nom: 'Champion de la propreté', nom_en: 'Cleanliness Champion', fr: false, src_fr: null, cat: 'pro-des-astuces-du-quotidien', icone: '🧹',
  description: 'Nettoyer, faire la lessive et maîtriser les Tâches ménagères.',
  niveaux: [
    L(['Acheter un outil de nettoyage', 'Nettoyer 3 fois'], ['Buy a cleaning tool', 'Clean 3 times']),
    L(['Nettoyer 10 fois', 'Acheter un lave-linge'], ['Clean 10 times', 'Buy a washing machine']),
    L(['Faire la lessive 20 fois', 'Atteindre le niveau 10 en Tâches ménagères'], ['Do laundry 20 times', 'Housework level 10']),
  ],
  rec: ['Interaction sur soi « Nettoyage professionnel »', 'Conversation « Donner des astuces pour garder la maison propre »'],
  rec_en: ['"Professional Cleaning" self-interaction', '"Providing Tips for Maintaining Cleanliness" conversation'],
  notes: 'Ex-« Neat Freak » (catégorie Stay Healthy au lancement), FR « Maniaque de la propreté » selon Dexerto.fr et Millenium (avril 2025). Renommée « Cleanliness Champion » et déplacée dans Lifehacker en v0.5.0 : le libellé FR actuel n\'est pas confirmé (« Maniaque de la propreté » peut toujours être affiché).',
  src: SRC.fandom });

amb({ id: 'grand-chef', nom: 'Grand chef', nom_en: 'Master Chef', fr: true, src_fr: FR_SRC.dexfr, cat: 'pro-des-astuces-du-quotidien', icone: '👨‍🍳',
  description: 'Cuisiner régulièrement et maîtriser la compétence Cuisine.',
  niveaux: [
    L(['Cuisiner 5 fois à partir du réfrigérateur'], ['Cook from refrigerator 5 times']),
    L(['Atteindre le niveau 6 en Cuisine', 'Cuisiner 20 fois à partir du réfrigérateur'], ['Cooking level 6', 'Cook from refrigerator 20 times']),
    L(['Atteindre le niveau 10 en Cuisine', 'Cuisiner 30 fois à partir du réfrigérateur'], ['Cooking level 10', 'Cook from refrigerator 30 times']),
  ],
  rec: ['Interaction « Publier une recette sur les réseaux sociaux »', 'Conversation « Transmettre l\'état d\'esprit du cuisinier »'],
  rec_en: ['"Post Cooking Recipe on Social Media" interaction', '"Teach Cooking Mindset" conversation'],
  notes: 'Dans la catégorie Stay Healthy au lancement ; déplacée dans Lifehacker en v0.5.0 (wiki fandom, TheGamesWiki).',
  src: SRC.fandom });

amb({ id: 'maitre-de-la-patisserie', nom: 'Maître de la pâtisserie', nom_en: 'Baking Master', fr: false, src_fr: null, cat: 'pro-des-astuces-du-quotidien', icone: '🧁', version_ajout: 'v0.7.0',
  description: 'Préparer des desserts et maîtriser la compétence Pâtisserie.',
  niveaux: [
    L(['Préparer 1 assiette de biscuits au beurre', 'Préparer 5 portions de dessert'], ['Make 1 plates of butter cookies', 'Prepare 5 servings of dessert']),
    L(['Atteindre le niveau 6 en Pâtisserie', 'Préparer 15 portions de dessert'], ['Baking level 6', 'Prepare 15 servings of dessert']),
    L(['Atteindre le niveau 10 en Pâtisserie', 'Réaliser 5 desserts de qualité parfaite'], ['Baking level 10', 'Produce 5 perfect quality desserts']),
  ],
  rec: ['Grâce à un savoir-faire impeccable, les pâtisseries sont de qualité supérieure'],
  rec_en: ['With impeccable baking skills, you can produce baked goods of superior quality'],
  notes: 'Nom EN officiel (notes de patch v0.7.0) « Baking Master » ; le wiki fandom écrit « Master Baker ». Notes de patch FR v0.7.0 : « Pro de la pâtisserie » (même schéma que « Pro de la préparation de boissons », contredit par la capture du jeu qui affiche « Maître de la préparation de boissons »).',
  src: SRC.fandom });

amb({ id: 'maitre-de-la-preparation-de-boissons', nom: 'Maître de la préparation de boissons', nom_en: 'Drink Mixing Master', fr: true, src_fr: FR_SRC.capture, cat: 'pro-des-astuces-du-quotidien', icone: '🍹', version_ajout: 'v0.7.0',
  description: 'Préparer des boissons mélangées et maîtriser la compétence Préparation de boissons.',
  niveaux: [
    L(['Acheter un distributeur de préparation de boissons', 'Préparer 5 boissons mélangées'], ['Purchase a Drink Mixing Dispenser', 'Prepare 5 servings of mixed drink']),
    L(['Atteindre le niveau 6 en Préparation de boissons', 'Préparer 15 boissons mélangées'], ['Drink Mixing Skill level 6', 'Prepare 15 servings of mixed drink']),
    L(['Atteindre le niveau 10 en Préparation de boissons', 'Préparer 5 boissons mélangées de qualité parfaite'], ['Drink Mixing Skill level 10', 'Make 5 perfect quality mixed drinks']),
  ],
  rec: ['Boissons mélangées de qualité supérieure grâce à une saveur et un arôme améliorés'],
  rec_en: ['You can create mixed drinks of superior quality by enhancing the flavor and scent of your beverages'],
  notes: 'Nom et objectifs de l\'étape 1 vérifiés sur capture FR (« Lv.1/3 », onglets « Étape 1/2/3 »). Notes de patch FR v0.7.0 : « Pro de la préparation de boissons ». TheGamesWiki : « Master Bartender ».',
  src: SRC.fandom });

amb({ id: 'expert-en-collection', nom: 'Expert en collection', nom_en: 'Collection Expert', fr: false, src_fr: null, cat: 'collectionner-et-creation', icone: '💎', version_ajout: 'v0.5.0',
  description: 'Miner et maîtriser la compétence Collectionner.',
  niveaux: [
    L(['Miner 5 fois', 'Acheter une pioche'], ['Mine 5 times', 'Buy a pickaxe']),
    L(['Miner 20 fois', 'Atteindre le niveau 6 en Collectionner'], ['Mine 20 times', 'Collecting level 6']),
    L(['Atteindre le niveau 10 en Collectionner'], ['Collecting level 10']),
  ],
  rec: ['Achat de pioches en argent, en or et en joyau au magasin de fournitures agricoles', 'Plus de chances d\'obtenir des objets de collection rares'],
  rec_en: ['You can purchase silver, gold, and gem pickaxes at the farming store', 'Chances of obtaining rare collectibles increase'],
  src: SRC.fandom });

amb({ id: 'pecheur-hors-pair', nom: 'Pêcheur hors pair', nom_en: 'Godlike Angler', fr: false, src_fr: null, cat: 'collectionner-et-creation', icone: '🎣', version_ajout: 'v0.5.0',
  description: 'Pêcher avec appât et maîtriser la compétence Pêcher.',
  niveaux: [
    L(['Acheter une canne à pêche', 'Pêcher 10 fois'], ['Buy a fishing rod', 'Fish 10 times']),
    L(['Pêcher 20 fois avec un appât', 'Atteindre le niveau 6 en Pêcher'], ['Fish with bait 20 times', 'Fishing level 6']),
    L(['Atteindre le niveau 10 en Pêcher'], ['Fishing level 10']),
  ],
  rec: ['Achat de cannes à pêche en argent, en or et en joyau au magasin de pêche', 'Plus de chances d\'attraper un poisson rare'],
  rec_en: ['You can buy Silver, Gold, and Jewel Fishing Rods at the Fishing Store', 'Chances of obtaining a rare fish increase'],
  src: SRC.fandom });

amb({ id: 'forgeron', nom: 'Forgeron', nom_en: 'Blacksmith', fr: false, src_fr: null, cat: 'collectionner-et-creation', icone: '⚒️', version_ajout: 'v0.5.0',
  description: 'Fabriquer des outils, tailler des gemmes et maîtriser le Travail manuel.',
  niveaux: [
    L(['Fabriquer des outils 3 fois', 'Tailler des gemmes 3 fois'], ['Craft tools 3 times', 'Cut gems 3 times']),
    L(['Fabriquer 3 fois des outils premium ou en joyau', 'Atteindre le niveau 6 en Travail manuel'], ['Craft premium or Jewel Tools 3 times', 'Handiwork level 6']),
    L(['Atteindre le niveau 10 en Travail manuel'], ['Handiwork level 10']),
  ],
  rec: ['Chance de récupérer les matériaux principaux utilisés à l\'établi'],
  rec_en: ['You can probabilistically get back the main materials used at the crafting table'],
  src: SRC.fandom });

amb({ id: 'entrepreneur-avise', nom: 'Entrepreneur avisé', nom_en: 'Savvy Entrepreneur', fr: false, src_fr: null, cat: 'prosperite-de-l-entreprise', icone: '🏪', version_ajout: 'v0.5.0',
  description: 'Développer le chiffre d\'affaires et la valeur de son entreprise.',
  niveaux: [
    L(['Atteindre 10 000 de chiffre d\'affaires', 'Atteindre le niveau de valeur d\'entreprise « Sprout Store » (libellé FR inconnu)'], ['10,000 Business Revenue', 'Reaching "Sprout Store" Business Value Level']),
    L(['Atteindre 50 000 de chiffre d\'affaires', 'Embaucher 2 employés'], ['50,000 Business Revenue', 'Hire 2 employees']),
    L(['Atteindre 200 000 de chiffre d\'affaires', 'Atteindre le niveau de valeur « Local Representative Store » (libellé FR inconnu)'], ['200,000 Business Revenue', 'Achieving the "Local Representative Store" Value Level']),
  ],
  rec: ['Réduction des coûts d\'exploitation fixes de l\'entreprise'],
  rec_en: ['Fixed operational costs are reduced when running a business'],
  notes: 'Seule ambition connue de la catégorie. Les noms des niveaux de valeur d\'entreprise en FR n\'ont pas été trouvés.',
  src: SRC.fandom });

// Ados (v0.9.0)
amb({ id: 'eleve-modele', nom: 'Élève modèle', nom_en: 'Quintessential Role Model', fr: false, src_fr: null, cat: 'celebrite-de-l-ecole', icone: '📝', version_ajout: 'v0.9.0', public: 'adolescent',
  description: 'Briller par ses résultats et son sérieux en classe.',
  niveaux: [
    L(['Terminer 3 fois la tâche « Devoirs après l\'école »', 'Poser 3 fois une question au professeur sur la leçon pendant le cours'], ['Complete the "After-School Homework" to-do 3 times', 'Ask the teacher a question about the lesson during class 3 times']),
    L(['Terminer 5 fois la tâche « Devoirs après l\'école »', 'Accomplir 10 tâches liées à l\'emploi du temps scolaire pendant les cours'], ['Complete the "After-School Homework" to-do item 5 time(s)', 'Complete 10 School Schedule-related task(s) during class']),
    L(['Obtenir 1 fois une évaluation de rang A+'], ['Receive an A+ Rank Evaluation 1 time']),
  ],
  rec: ['Les compétences Pensée critique, Rhétorique et Programmation progressent plus vite', 'Petit bonus lors des entretiens d\'embauche et des évaluations de promotion'],
  rec_en: ['Logic, Rhetoric, and Programming skills increase faster', 'Small bonus during job interviews and promotion reviews'],
  src: SRC.fandom });

amb({ id: 'star-mondaine-du-lycee', nom: 'Star mondaine du lycée', nom_en: 'Socialite Taking School by Storm', fr: false, src_fr: null, cat: 'celebrite-de-l-ecole', icone: '🌟', version_ajout: 'v0.9.0', public: 'adolescent',
  description: 'Se faire des amis, rejoindre un club et régner sur le bal de promo.',
  niveaux: [
    L(['Se faire 3 nouveaux amis', 'Rejoindre un club scolaire'], ['Make 3 new friend(s)', 'Join a School Club']),
    L(['Aller au bal de promo avec quelqu\'un', 'Établir 3 nouvelles relations de confident'], ['Attend Prom with someone', 'Establish 3 new Confidant relationship(s)']),
    L(['Être élu(e) roi ou reine du bal de promo 1 fois'], ['Get selected as Prom Party Royalty 1 time(s)']),
  ],
  rec: ['L\'amitié et la romance construites par la conversation progressent légèrement plus vite'],
  rec_en: ['Friendship and Romance built through conversation deepen slightly faster'],
  src: SRC.fandom });

amb({ id: 'la-voie-du-rebelle', nom: 'La voie du rebelle', nom_en: 'The Rebel\'s Path', fr: false, src_fr: null, cat: 'esprit-libre-a-l-ecole', icone: '🤘', version_ajout: 'v0.9.0', public: 'adolescent',
  description: 'Farces, insolence et renvoi de l\'école.',
  niveaux: [
    L(['Faire 1 farce à l\'école', 'Dire du mal d\'un autre ami 3 fois'], ['Pull a mischievous prank at school 1 time(s)', 'Badmouth a different friend 3 time(s)']),
    L(['Répondre au professeur 3 fois', 'Recevoir 1 évaluation de rang F'], ['Talk back to the teacher 3 time(s)', 'Receive an F-rank evaluation 1 time(s)']),
    L(['Se faire renvoyer'], ['Being Expelled']),
  ],
  rec: ['Les compétences Art, Spectacle et Production média progressent plus vite', 'Réussir un entretien d\'embauche devient légèrement plus difficile'],
  rec_en: ['Art, Performance, and Video Production skills increase faster', 'Passing job interviews becomes slightly more difficult'],
  src: SRC.fandom });

amb({ id: 'au-coeur-du-drame', nom: 'Au cœur du drame', nom_en: 'Center of the Drama', fr: false, src_fr: null, cat: 'esprit-libre-a-l-ecole', icone: '🎭', version_ajout: 'v0.9.0', public: 'adolescent',
  description: 'Collectionner les béguins et les chéri(e)s au lycée.',
  niveaux: [
    L(['Avoir un béguin réciproque avec 2 personnes en même temps', 'Atteindre le niveau 3 en Charme'], ['Have Mutual Crush relationship(s) with 2 people at the same time', 'Reach level 3 in the Charm skill']),
    L(['Réussir 3 demandes de rendez-vous amoureux', 'Être en relation « Chéri(e) » avec 3 personnes en même temps'], ['Successfully send a Dating request 3 time(s)', 'Enter into a "Sweetheart" relationship with 3 people at the same time']),
    L(['Aller 2 fois au bal de promo avec des partenaires différents'], ['Attend Prom 2 time(s) with different partners']),
  ],
  rec: ['Meilleur taux de réussite des demandes et romance qui progresse un peu plus vite'],
  rec_en: ['Proposal success rate increases, and Romance deepens a little faster'],
  src: SRC.fandom });

// ---- assemble
const catById = Object.fromEntries(categories.map(c => [c.id, c]));
const elements = A.map(a => {
  if (!catById[a.cat]) throw new Error('cat inconnue ' + a.cat);
  return {
    id: a.id,
    nom: a.nom,
    nom_en: a.nom_en,
    fr_verifie: a.fr,
    source_fr: a.src_fr,
    categorie: a.cat,
    description: a.description,
    icone: a.icone,
    icone_url: null,
    nom_fichier_wiki: null,
    icone_fichier: null,
    details: {
      niveaux: a.niveaux.map((n, i) => ({ niveau: i + 1, objectifs: n.fr, objectifs_en: n.en })),
      recompenses: a.rec,
      recompenses_en: a.rec_en,
      public: a.public || catById[a.cat].public,
      version_ajout: a.version_ajout || catById[a.cat].version_ajout || 'lancement (v0.1)',
    },
    notes: a.notes || null,
    source: a.src,
  };
});

const out = {
  referentiel: 'ambitions',
  titre: 'Ambitions',
  maj: '2026-10-23',
  version_jeu: 'v0.11.x (octobre 2026) — liste adultes/ados à jour v0.9.0 ; ambitions enfants (v0.10.0) manquantes',
  sources: [SRC.capture, SRC.fandom, SRC.gfinity, SRC.p015, SRC.p030, SRC.p040, SRC.p050, SRC.p070, SRC.p090, SRC.p0100, SRC.cheats, SRC.dexfr, SRC.millenium, SRC.tgw, SRC.sportskeeda, SRC.curse],
  notes: [
    'STRUCTURE : catégorie → ambitions → 3 niveaux (affichés « Lv.1/3 » et onglets « Étape 1/2/3 » en jeu FR), chacun avec 1 à 2 objectifs ; récompenses = bonus débloqués quand l\'ambition est accomplie. Chaque étape rapporte aussi des pièces Ronron (Meow Coins, montants non trouvés). Depuis v0.10.0, accomplir certaines ambitions peut aussi donner un nouveau trait (lesquels : non trouvé).',
    'COMPLÉTUDE : 15 catégories / 34 ambitions = liste du wiki fandom (à jour v0.9.0) + recoupements. TROU CONNU : la v0.10.0 (03/09/2026) permet aux ENFANTS de choisir des ambitions ; aucune source n\'en donne les noms → non listées. Les ambitions de mods (ZoiWorks Ambitions Pack…) sont exclues.',
    'LIBELLÉS FR : fr_verifie=true si le nom vient de la capture du jeu, des notes de patch officielles FR (playinzoi.com/fr) ou d\'un guide FR (Dexerto.fr / Millenium, avril 2025). Le champ source_fr précise laquelle. Les guides FR tiers n\'ont pu être lus que via des extraits de moteur de recherche (pages inaccessibles) : à confirmer en jeu. Les notes de patch FR ne coïncident pas toujours avec le jeu (« Pro de la préparation de boissons » dans le patch v0.7.0 vs « Maître de la préparation de boissons » sur la capture).',
    'OBJECTIFS : traduits en FR à partir du wiki fandom (anglais), complétés par Gfinity ; seuls ceux de l\'étape 1 de « Maître de la préparation de boissons » sont vérifiés sur capture. Noms des compétences et objets alignés sur le vocabulaire officiel FR (guide des codes de triche playinzoi.com/fr : Condition physique, Pensée critique, Rhétorique, Spectacle, Fabrication de café, Collectionner, Pêcher, Nager, Travail manuel, Pâtisserie, Préparation de boissons, Production média, Miaou…). Les objectifs EN sont conservés dans objectifs_en.',
    'DIVERGENCES : refonte v0.5.0 — Stay Healthy renommée Physical Training ; Neat Freak → Cleanliness Champion et Master Chef déplacés vers Lifehacker ; récompenses rééquilibrées (les récompenses listées sont celles du fandom post-v0.5.0). Le tableau fandom range Coffee Master dans Harmonie et paix (à vérifier). Le tableau fandom recopie par erreur les objectifs de Vilain notoire pour Famous Hackers (objectifs repris de Gfinity). Richesse niv. 3 : 200 000 vs 20 000 Miaou selon les sources. TheGamesWiki nomme les ambitions v0.7.0 « Master Barista / Master Baker / Master Bartender » (noms officiels EN : Coffee Master, Baking Master, Drink Mixing Master).',
    'PUBLIC (champ public = étape de vie minimale, ids de etapes-de-vie.json) : ambitions adultes = jeune-adulte et plus (choisies à la création du Zoi depuis v0.4.0) ; catégories Célébrité de l\'école et Esprit libre à l\'école = adolescent (lycée, v0.9.0).',
    'ICÔNES : seules les catégories ont une icône sur le wiki fandom (icone_url + nom_fichier_wiki + icone_fichier local dans assets/icones/ambitions/) ; les illustrations propres à chaque ambition (ex. tablier pour la préparation de boissons) ne sont pas disponibles.',
  ].join('\n'),
  categories: categories.map(c => ({
    id: c.id, nom: c.nom, nom_en: c.nom_en, fr_verifie: c.fr_verifie, source_fr: c.source_fr,
    description: c.description, icone: c.icone, icone_url: imgUrl(c.wiki), nom_fichier_wiki: c.wiki, icone_fichier: iconeFichier(c.wiki),
    public: c.public, version_ajout: c.version_ajout || 'lancement (v0.1)', notes: c.notes || null,
  })),
  elements,
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
const ids = new Set(); for (const e of elements) { if (ids.has(e.id)) throw new Error('doublon ' + e.id); ids.add(e.id); if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(e.id)) throw new Error('id invalide ' + e.id); }
for (const c of out.categories) { if (!c.icone_url) throw new Error('icone manquante ' + c.id); if (!c.icone_fichier) console.warn('icone_fichier absent ' + c.id); }
const v = elements.filter(e => e.fr_verifie).length, vc = out.categories.filter(c => c.fr_verifie).length;
console.log(`ambitions: ${categories.length} catégories (${vc} FR vérifiées), ${elements.length} ambitions (${v} FR vérifiées = ${Math.round(100 * v / elements.length)}%)`);
