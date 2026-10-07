/** Set 18 trait slug (icon filename without path) */
export function traitSlug(name){
  if(!name) return '';
  const key = String(name).toLowerCase()
    .replace(/['’']/g,'')
    .replace(/\s+/g,'')
    .replace(/[^a-z0-9]/g,'');
  const alias = {
    blackthorn: 'caustic',
    arcanist: 'spellweaver',
    warden: 'defender',
    bountyseeker: 'bountyseeker'
  };
  return alias[key] || key;
}

export function traitImgRemote(name){
  const slug = traitSlug(name);
  if(!slug) return '';
  return `https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_18_${slug}.png`;
}

/** Local-first trait icon (assets/traits). Fallback via img onerror. */
export function traitImg(name){
  const slug = traitSlug(name);
  if(!slug) return '';
  return `assets/traits/trait_icon_18_${slug}.png`;
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

export function augmentSlug(name){
  if(!name) return '';
  const key = String(name).toLowerCase().trim();
  let slug = AUGMENT_SLUGS[key];
  if(!slug){
    slug = key
      .replace(/['’']/g,'')
      .replace(/\s*[ivx]+$/i,'')
      .replace(/[^a-z0-9]+/g,'')
      .toLowerCase();
  }
  return slug;
}

export function augmentImgRemote(name){
  const slug = augmentSlug(name);
  if(!slug) return '';
  return `https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/augments/hexcore/${slug}.png`;
}

/** Local-first augment icon (assets/augments). Fallback via img onerror. */
export function augmentImg(name){
  const slug = augmentSlug(name);
  if(!slug) return '';
  return `assets/augments/${slug}.png`;
}
