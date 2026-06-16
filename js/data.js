/* ══════════════════════════════════════════
   data.js — Données statiques
   Livres, noms, potions
══════════════════════════════════════════ */

// ── Potions ──────────────────────────────
const POTION_TYPES = {
  skill:   { label: "Potion d'Adresse",       icon: '⚔️', stat: 'skill'   },
  stamina: { label: 'Potion de Vigueur',       icon: '❤️', stat: 'stamina' },
  luck:    { label: 'Potion de Bonne Fortune', icon: '🍀', stat: 'luck'    },
};

// ── Générateur de noms ───────────────────
const NAME_PARTS = {
  prefix: ['Ald','Bra','Cal','Dor','Eld','Fal','Gar','Hal','Ith','Jor',
            'Kel','Lor','Mal','Nor','Orn','Pel','Ran','Sor','Tal','Vor',
            'Wyn','Zar','Aer','Bel','Cyn','Dar','Even','Fir','Gwen','Hael'],
  mid:    ['an','ar','en','or','al','in','on','el','ath','iel',
            'wyn','mir','dan','gar','dor','ven','bar','tor','sel','mar'],
  suffix: ['dor','mir','wyn','las','rand','iel','ion','ath','ryn','gar',
            'thor','ven','dal','sur','rath','bor','sel','nar','diel','orn'],
  titles: ["le Brave","le Téméraire","la Courageuse","l'Intrépide",
            'la Valkyrie','le Chasseur',"l'Éclaireur",'la Guerrière',
            'le Sage',"l'Ombre",'le Forgeron','la Chasseresse',
            'le Pèlerin',"l'Érudit",'la Sentinelle'],
  female: ['Aelindra','Sylvara','Myrène','Elowen','Ithilwen','Caladria',
            'Nyriel','Selvaine','Thariel','Rysara','Briavel','Cenara',
            'Fenwyn','Lyreith','Morwenna'],
  male:   ['Aldric','Braxton','Caldor','Dorian','Elvaren','Falkor',
            'Garreth','Halsten','Irvaan','Jorund','Keldar','Lorian',
            'Malvern','Nordan','Orskel','Pelador','Randor','Sorvan',
            'Taldris','Vorath'],
};

// ── Liste des livres Défi Fantastique ────
const BOOKS = [
  { n:  1, t: 'Le Sorcier de la Montagne de Feu' },
  { n:  2, t: 'La Citadelle du Chaos' },
  { n:  3, t: 'La Forêt de la Malédiction' },
  { n:  4, t: 'La Cité des Voleurs' },
  { n:  5, t: 'La Plaine des Ténèbres' },
  { n:  6, t: "Le Manoir de l'Enfer" },
  { n:  7, t: "L'Île du Roi Lézard" },
  { n:  8, t: 'Les Collines du Diable' },
  { n:  9, t: 'Le Marais du Désespoir' },
  { n: 10, t: 'La Légende du Zagor' },
  { n: 11, t: 'La Créature venue des profondeurs' },
  { n: 12, t: 'La Forteresse de la Terreur' },
  { n: 13, t: 'La Malédiction de la Momie' },
  { n: 14, t: "L'Épée du Samouraï" },
  { n: 15, t: "L'Antre de la Peur" },
  { n: 16, t: 'La Galaxie Maudite' },
  { n: 17, t: "L'Ennemi du Temps" },
  { n: 18, t: "L'Autel des Dieux" },
  { n: 19, t: 'Le Masque du Chaos' },
  { n: 20, t: 'La Tombe des Rois' },
  { n: 21, t: 'Le Château Mystérieux' },
  { n: 22, t: 'Le Robot de Glace' },
  { n: 23, t: "L'Horreur sur Titan" },
  { n: 24, t: 'La Tour du Destin' },
  { n: 25, t: 'Les Galères du Malheur' },
  { n: 26, t: 'Le Labyrinthe de la Mort' },
  { n: 27, t: "L'Arène des Ombres" },
  { n: 28, t: 'La Prison du Mal' },
  { n: 29, t: 'La Terre des Dieux' },
  { n: 30, t: 'La Rébellion des Robots' },
  { n: 31, t: 'Le Passage du Diable' },
  { n: 32, t: "Le Voleur d'Âmes" },
  { n: 33, t: 'Les Jungles de la Mort' },
  { n: 34, t: "L'Île du Roi du Volcan" },
  { n: 35, t: 'Le Talisman de la Mort' },
  { n: 36, t: 'Le Chasseur de Primes' },
  { n: 37, t: "Le Guerrier d'Acier" },
  { n: 38, t: 'La Demeure des Morts' },
  { n: 39, t: 'Le Retour de Vampyr' },
  { n: 40, t: 'Les Donjons de Dragonlance' },
  { n: 41, t: 'La Légende des Sept Serpents' },
  { n: 42, t: 'Le Colosse de Mahaka' },
  { n: 43, t: 'La Montagne du Druide' },
  { n: 44, t: 'Le Temple de la Terreur' },
  { n: 45, t: 'Le Manoir des Pièges' },
  { n: 46, t: 'La Créature du Chaos' },
  { n: 47, t: "L'Abbaye des Spectres" },
  { n: 48, t: "Le Voleur d'Âmes (rééd.)" },
  { n: 49, t: "La Pyramide de l'Horreur" },
  { n: 50, t: 'Le Retour du Sorcier' },
  { n: 51, t: 'Les Guerriers du Destin' },
  { n: 52, t: 'Les Catacombes du Cauchemar' },
  { n: 53, t: 'La Grotte du Chaos' },
  { n: 54, t: 'La Tour de Glace' },
  { n: 55, t: 'La Lande de la Mort' },
  { n: 56, t: 'Les Chevaliers du Destin' },
  { n: 57, t: 'Le Chasseur de Mages' },
  { n: 58, t: 'Le Retour du Vampire' },
  { n: 59, t: 'La Malédiction de la Momie (rééd.)' },
];

// ── Icônes d'objets ──────────────────────
function itemIcon(name) {
  const n = name.toLowerCase();
  if (/épée|sabre|lame|dague|couteau|hache|massue|arme/.test(n)) return '⚔️';
  if (/bouclier|armure|casque|cuirasse/.test(n))                  return '🛡';
  if (/potion|fiole|élixir|remède|adresse|vigueur|fortune/.test(n)) return '🧪';
  if (/livre|parchemin|carte|lettre|note|sort/.test(n))           return '📜';
  if (/clé|clef/.test(n))                                         return '🗝';
  if (/lampe|torche|lanterne/.test(n))                            return '🕯';
  if (/corde/.test(n))                                            return '🪢';
  if (/flèche|arc/.test(n))                                       return '🏹';
  if (/bâton|staff/.test(n))                                      return '🪄';
  if (/anneau|bague|amulette/.test(n))                            return '💍';
  if (/or|pièce|monnaie/.test(n))                                 return '🪙';
  return '🎒';
}

// ── Utilitaire HTML escape ───────────────
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
