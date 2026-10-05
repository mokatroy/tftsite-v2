/** Set 18 trait icon via CommunityDragon */
export function traitImg(name){
  if(!name) return '';
  const key = String(name).toLowerCase()
    .replace(/['’]/g,'')
    .replace(/\s+/g,'')
    .replace(/[^a-z0-9]/g,'');
  // aliases for names that differ from icon files
  const alias = {
    blackthorn: 'caustic', // fallback if missing
    arcanist: 'spellweaver',
    warden: 'defender',
    'bounty seeker': 'bountyseeker',
    bountyseeker: 'bountyseeker'
  };
  const slug = alias[key] || alias[String(name).toLowerCase()] || key;
  return `https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_${slug}.png`;
}

/** Known augment name → hexcore icon slug */
const AUGMENT_SLUGS = {
  'jeweled lotus': 'jeweled-lotus-ii',
  'rich get richer': 'richgetricher2',
  'dark ritual': 'missing-t2',
  "pandora's items": 'pandora1',
  'trade sector': 'trade2',
  'cybernetic uplink': 'cybernetic-uplink-ii',
  'binary airdrop': 'binaryairdrop3',
  'component grab bag': 'componentgrabbag-ii',
  'item grab bag': 'itemgrabbag1',
  'thrill of the hunt': 'thrillhunt1',
  'portable forge': 'portableforge2',
  'last stand': 'last-stand-ii',
  'hustler': 'hyperroll2',
  'combat training': 'combat-training-ii',
  'new recruit': 'newrecruit3',
  'radiant relics': 'radiantrelic-iii',
  'built different': 'builtdifferent2',
  'wise spending': 'wisespending3'
};

export function augmentImg(name){
  if(!name) return '';
  const key = String(name).toLowerCase().trim();
  let slug = AUGMENT_SLUGS[key];
  if(!slug){
    // heuristic: strip roman numerals, spaces → slug
    slug = key
      .replace(/['’]/g,'')
      .replace(/\s*[ivx]+$/i,'')
      .replace(/[^a-z0-9]+/g,'')
      .toLowerCase();
  }
  return `https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/augments/hexcore/${slug}.png`;
}
