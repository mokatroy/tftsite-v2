import {t,localize,lang,localePath} from './locale.js';
import {traitImg} from './icons.js';

/** Name → CDragon character folder when display name differs */
const CHAMP_ALIAS = {
  pebbles: 'sentry',
  'mama beak': 'raptor',
  mamabeak: 'raptor',
  'ancient sentinel': 'sentinel',
  ancientsentinel: 'sentinel',
  "kog'maw": 'kogmaw',
  kogmaw: 'kogmaw',
  "rek'sai": 'reksai',
  reksai: 'reksai',
  "kha'zix": 'khazix',
  khazix: 'khazix',
  'master yi': 'masteryi',
  masteryi: 'masteryi',
  'elder dragon': 'elderdragon',
  elderdragon: 'elderdragon'
};

/** Some units only have a square under /hud/ */
const CHAMP_HUD_ONLY = new Set(['raptor']);

/** Build CommunityDragon square icon URL for a TFT Set 18 unit */
export function champImg(name){
  if(!name) return '';
  const raw = String(name).toLowerCase().trim();
  const compact = raw.replace(/['']/g,'').replace(/\s+/g,'').replace(/[^a-z0-9]/g,'');
  const key = CHAMP_ALIAS[raw] || CHAMP_ALIAS[compact] || compact;
  if(CHAMP_HUD_ONLY.has(key)){
    return `https://raw.communitydragon.org/latest/game/assets/characters/tft18_${key}/hud/tft18_${key}_square.png`;
  }
  return `https://raw.communitydragon.org/latest/game/assets/characters/tft18_${key}/tft18_${key}_square.png`;
}

/** TFT item icon slug under hexcore/ */
const TFT_ITEM_SLUG = {
  'b.f. sword': 'tft_item_bfsword',
  'bf sword': 'tft_item_bfsword',
  'recurve bow': 'tft_item_recurvebow',
  'needlessly large rod': 'tft_item_needlesslylargerod',
  'tear of the goddess': 'tft_item_tearofthegoddess',
  'chain vest': 'tft_item_chainvest',
  'negatron cloak': 'tft_item_negatroncloak',
  "giant's belt": 'tft_item_giantsbelt',
  'sparring gloves': 'tft_item_sparringgloves',
  'spatula': 'tft_item_spatula',
  'frying pan': 'tft_item_fryingpan',
  'deathblade': 'tft_item_deathblade',
  'giant slayer': 'tft_item_madredsbloodrazor',
  'hextech gunblade': 'tft_item_hextechgunblade',
  'spear of shojin': 'tft_item_spearofshojin',
  'edge of night': 'tft_item_guardianangel',
  'bloodthirster': 'tft_item_bloodthirster',
  "sterak's gage": 'tft_item_steraksgage',
  'infinity edge': 'tft_item_infinityedge',
  'hand of justice': 'tft_item_unstableconcoction',
  'red buff': 'tft_item_rapidfirecannon',
  "guinsoo's rageblade": 'tft_item_guinsoosrageblade',
  'void staff': 'tft_item_voidstaff',
  "titan's resolve": 'tft_item_titansresolve',
  "kraken's fury": 'tft_item_krakensfury',
  "nashor's tooth": 'tft_item_nashorstooth',
  'last whisper': 'tft_item_lastwhisper',
  "rabadon's deathcap": 'tft_item_rabadonsdeathcap',
  "archangel's staff": 'tft_item_archangelsstaff',
  'crownguard': 'tft_item_crownguard',
  'ionic spark': 'tft_item_ionicspark',
  'morellonomicon': 'tft_item_morellonomicon',
  'jeweled gauntlet': 'tft_item_jeweledgauntlet',
  'blue buff': 'tft_item_bluebuff',
  "protector's vow": 'tft_item_protectorsvow',
  'adaptive helm': 'tft_item_adaptivehelm',
  'spirit visage': 'tft_item_spiritvisagerr',
  'bramble vest': 'tft_item_bramblevest',
  'gargoyle stoneplate': 'tft_item_gargoylestoneplate',
  'sunfire cape': 'tft_item_redbuff',
  'steadfast heart': 'tft_item_nightharvester',
  "dragon's claw": 'tft_item_dragonsclaw',
  'evenshroud': 'tft_item_spectralgauntlet',
  'quicksilver': 'tft_item_quicksilver',
  "warmog's armor": 'tft_item_warmogsarmor',
  "striker's flail": 'tft_item_strikersflail',
  "thief's gloves": 'tft_item_thiefsgloves',
  "tactician's crown": 'tft_item_tacticianscrown',
  "tactician's cape": 'tft_item_tacticianscape',
  "tactician's shield": 'tft_item_tacticiansshield'
};

export function itemImg(name){
  if(!name) return '';
  const key = String(name).toLowerCase().trim();
  const slug = TFT_ITEM_SLUG[key];
  if(slug){
    return `https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/hexcore/${slug}.png`;
  }
  const heur = key.replace(/['']/g,'').replace(/\s+/g,'').replace(/[^a-z0-9]/g,'');
  if(heur){
    return `https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/hexcore/tft_item_${heur}.png`;
  }
  return '';
}

function costClass(cost){
  const c = Number(cost)||1;
  return `cost-${Math.min(5,Math.max(1,c))}`;
}

export function unitChip(u, withImg=true){
  const name = typeof u === 'string' ? u : (u.name?.en || (typeof u.name === 'string' ? u.name : '') || u.en || u.ar || '');
  const cost = u && u.cost;
  const img = withImg ? (u && u.image && String(u.image).startsWith('http') ? u.image : champImg(name)) : '';
  const label = name;
  const attr = `data-unit="${String(label).replace(/"/g,'"')}"`;
  if(withImg && img){
    return `<span class="unit-chip has-img ${costClass(cost)}" ${attr}><img src="${img}" alt="${label}" loading="lazy" onerror="this.style.display='none'"><span>${label}</span></span>`;
  }
  return `<span class="unit-chip ${costClass(cost)}" ${attr}>${label}</span>`;
}

export function traitChip(tr){
  const raw = typeof tr === 'string' ? tr : (tr.name?.en || tr.name || '');
  const name = typeof raw === 'object' ? (raw.en || raw.ar || '') : raw;
  const img = traitImg(name);
  const count = (typeof tr === 'object' && tr.count != null) ? tr.count : '';
  return `<span class="trait-chip" data-trait="${String(name).replace(/"/g,'"')}">${img?`<img src="${img}" alt="" loading="lazy" onerror="this.style.display='none'">`:''}<span>${name}${count!==''?` ${count}`:''}</span></span>`;
}

export function itemChip(name){
  if(!name) return '';
  const n = typeof name === 'string' ? name : (name.en || name.name || '');
  const img = itemImg(n);
  return `<span class="item-chip" data-item="${String(n).replace(/"/g,'"')}">${img?`<img src="${img}" alt="${n}" loading="lazy" onerror="this.style.display='none'">`:''}<span>${n}</span></span>`;
}

export function compCard(c){
  const title = localize(c.name) || c.slug || '';
  const style = localize(c.style) || '';
  const note = localize(c.note) || localize(c.summary) || '';
  const tier = (c.tier || 'A').toUpperCase();
  const units = (c.units || c.board || []).slice(0,8).map(u=>unitChip(u,true)).join('');
  const href = localePath('comp.html') + '?slug=' + encodeURIComponent(c.slug||'');
  return `<a class="comp-card tier-${tier.toLowerCase()}" href="${href}">
    <div class="comp-card-top"><span class="tier-badge">${tier}</span><span class="style-pill">${style}</span></div>
    <h3>${title}</h3>
    <p>${note}</p>
    <div class="comp-units">${units}</div>
  </a>`;
}

export function renderBoard(comp){
  const board = comp.board || comp.units || [];
  const positions = comp.positions || {};
  const rows = [];
  for(let r=0;r<4;r++){
    const cells = [];
    for(let c=0;c<7;c++){
      const key = `${r},${c}`;
      let unit = positions[key];
      if(!unit && Array.isArray(board)){
        // fallback: fill left-to-right
      }
      if(unit){
        const name = typeof unit === 'string' ? unit : (unit.name?.en || unit.name || '');
        const cost = unit.cost || 1;
        const img = champImg(name);
        const items = (unit.items||[]).map(n=>{
          const ii = itemImg(n);
          return ii ? `<img class="hex-item" src="${ii}" alt="" title="${n}">` : '';
        }).join('');
        cells.push(`<div class="hex filled cost-${Math.min(5,Math.max(1,Number(cost)||1))}" title="${name}">
          <div class="hex-inner">
            <img class="hex-champ" src="${img}" alt="${name}" loading="lazy" onerror="this.style.opacity=.25">
            <span class="hex-name">${name}</span>
            ${items?`<div class="hex-items">${items}</div>`:''}
          </div>
        </div>`);
      } else {
        cells.push(`<div class="hex empty"><div class="hex-inner"></div></div>`);
      }
    }
    rows.push(`<div class="hex-row ${r%2===1?'offset':''}" data-row="${r}">${cells.join('')}</div>`);
  }
  // If no positions, render simple unit row
  if(!Object.keys(positions).length && board.length){
    const chips = board.map(u=>unitChip(u,true)).join('');
    return `<div class="board-fallback">${chips}</div>`;
  }
  return `<div class="tft-board"><div class="hex-grid">${rows.join('')}</div></div>`;
}

export function detail(comp,patch){
  if(!comp) return `<p class="empty">${t('notFound')}</p>`;
  const title = localize(comp.name) || comp.slug || '';
  const style = localize(comp.style) || '';
  const note = localize(comp.note) || localize(comp.summary) || '';
  const how = localize(comp.howToPlay) || localize(comp.guide) || '';
  const tier = (comp.tier || 'A').toUpperCase();
  const traits = (comp.traits||[]).map(tr=>traitChip(tr)).join('');
  const items = (comp.items||comp.coreItems||[]).map(n=>itemChip(typeof n==='string'?n:n.name||n)).join('');
  const boardHtml = renderBoard(comp);
  const units = (comp.units||[]).map(u=>unitChip(u,true)).join('');
  return `
  <a class="back-link" href="${localePath('comps.html')}">${t('back')}</a>
  <p class="eyebrow">${tier} · ${style}</p>
  <h1 class="page-title">${title}</h1>
  <p class="page-subtitle">${note}</p>
  <section class="detail-section"><h2>${t('units')}</h2><div class="unit-row">${units||boardHtml}</div></section>
  ${boardHtml && Object.keys(comp.positions||{}).length ? `<section class="detail-section"><h2>Board</h2>${boardHtml}</section>`:''}
  ${traits?`<section class="detail-section"><h2>${t('traits')}</h2><div class="trait-row">${traits}</div></section>`:''}
  ${items?`<section class="detail-section"><h2>${t('items')}</h2><div class="item-row">${items}</div></section>`:''}
  ${how?`<section class="detail-section"><h2>${t('howToPlay')}</h2><div class="guide">${how}</div></section>`:''}
  `;
}

export function patchPage(p){
  if(!p) return `<p class="empty">${t('notFound')}</p>`;
  const ver = p.version || '';
  const title = localize(p.title) || ver;
  const date = p.releaseDate || p.date || '';
  const summary = localize(p.summary) || '';
  // highlights may be localized object {ar,en,ja} OR array of strings/objects
  let highlights = [];
  if (Array.isArray(p.highlights)) {
    highlights = p.highlights.map(h => localize(h) || (typeof h === 'string' ? h : '')).filter(Boolean);
  } else if (p.highlights && typeof p.highlights === 'object') {
    const h = localize(p.highlights);
    if (h) highlights = [h];
  }
  const changes = (p.changes||[]).map(ch=>{
    const who = localize(ch.unit||ch.name) || '';
    const text = localize(ch.detail||ch.text||ch.change) || '';
    const type = ch.type || '';
    const cat = ch.category ? ` <span class="patch-cat">${ch.category}</span>` : '';
    return `<div class="patch-change"><strong>${who}</strong>${type?` <span class="patch-type">${type}</span>`:''}${cat} ${text}</div>`;
  }).join('');
  return `
  <p class="eyebrow">PATCH NOTES</p>
  <h1 class="page-title">${title}</h1>
  <p class="page-subtitle">${ver}${date?` · ${date}`:''}</p>
  ${summary?`<p class="guide">${summary}</p>`:''}
  ${highlights.length?`<ul class="guide-list">${highlights.map(h=>`<li>${h}</li>`).join('')}</ul>`:''}
  <div class="patch-list" style="margin-top:20px">${changes}</div>
  `;
}
