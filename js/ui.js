import {t,localize,lang,localePath} from './locale.js';
import {traitImg} from './icons.js';

const CHAMP_ALIAS = {pebbles:'sentry','mama beak':'raptor',mamabeak:'raptor','ancient sentinel':'sentinel',ancientsentinel:'sentinel',"kog'maw":'kogmaw',kogmaw:'kogmaw',"rek'sai":'reksai',reksai:'reksai',"kha'zix":'khazix',khazix:'khazix','master yi':'masteryi',masteryi:'masteryi','elder dragon':'elderdragon',elderdragon:'elderdragon'};
const CHAMP_HUD_ONLY = new Set(['raptor']);
export function champImg(name){
  if(!name) return '';
  const raw = String(name).toLowerCase().trim();
  const compact = raw.replace(/['’]/g,'').replace(/\s+/g,'').replace(/[^a-z0-9]/g,'');
  const key = CHAMP_ALIAS[raw] || CHAMP_ALIAS[compact] || compact;
  if(CHAMP_HUD_ONLY.has(key)) return `https://raw.communitydragon.org/latest/game/assets/characters/tft18_${key}/hud/tft18_${key}_square.png`;
  return `https://raw.communitydragon.org/latest/game/assets/characters/tft18_${key}/tft18_${key}_square.png`;
}
const TFT_ITEM_SLUG = {'b.f. sword':'tft_item_bfsword','bf sword':'tft_item_bfsword','recurve bow':'tft_item_recurvebow','needlessly large rod':'tft_item_needlesslylargerod','tear of the goddess':'tft_item_tearofthegoddess','chain vest':'tft_item_chainvest','negatron cloak':'tft_item_negatroncloak',"giant's belt":'tft_item_giantsbelt','sparring gloves':'tft_item_sparringgloves',spatula:'tft_item_spatula','frying pan':'tft_item_fryingpan',deathblade:'tft_item_deathblade','giant slayer':'tft_item_madredsbloodrazor','hextech gunblade':'tft_item_hextechgunblade','spear of shojin':'tft_item_spearofshojin','edge of night':'tft_item_guardianangel',bloodthirster:'tft_item_bloodthirster',"sterak's gage":'tft_item_steraksgage','infinity edge':'tft_item_infinityedge','hand of justice':'tft_item_unstableconcoction','red buff':'tft_item_rapidfirecannon',"guinsoo's rageblade":'tft_item_guinsoosrageblade','void staff':'tft_item_voidstaff',"titan's resolve":'tft_item_titansresolve',"kraken's fury":'tft_item_krakensfury',"nashor's tooth":'tft_item_nashorstooth','last whisper':'tft_item_lastwhisper',"rabadon's deathcap":'tft_item_rabadonsdeathcap',"archangel's staff":'tft_item_archangelsstaff',crownguard:'tft_item_crownguard','ionic spark':'tft_item_ionicspark',morellonomicon:'tft_item_morellonomicon','jeweled gauntlet':'tft_item_jeweledgauntlet','blue buff':'tft_item_bluebuff',"protector's vow":'tft_item_protectorsvow','adaptive helm':'tft_item_adaptivehelm','spirit visage':'tft_item_spiritvisagerr','bramble vest':'tft_item_bramblevest','gargoyle stoneplate':'tft_item_gargoylestoneplate','sunfire cape':'tft_item_redbuff','steadfast heart':'tft_item_nightharvester',"dragon's claw":'tft_item_dragonsclaw',evenshroud:'tft_item_spectralgauntlet',quicksilver:'tft_item_quicksilver',"warmog's armor":'tft_item_warmogsarmor',"striker's flail":'tft_item_strikersflail',"thief's gloves":'tft_item_thiefsgloves',"tactician's crown":'tft_item_tacticianscrown',"tactician's cape":'tft_item_tacticianscape',"tactician's shield":'tft_item_tacticiansshield'};
export function itemImg(name){
  if(!name) return '';
  const key = String(name).toLowerCase().trim();
  const slug = TFT_ITEM_SLUG[key];
  if(slug) return `https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/hexcore/${slug}.png`;
  const heur = key.replace(/['’]/g,'').replace(/\s+/g,'').replace(/[^a-z0-9]/g,'');
  return heur ? `https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/hexcore/tft_item_${heur}.png` : '';
}
function costClass(cost){const c=Number(cost)||1;return `cost-${Math.min(5,Math.max(1,c))}`;}
export function unitChip(u, withImg=true){
  const name = typeof u === 'string' ? u : (u.name?.en || (typeof u.name === 'string' ? u.name : '') || u.en || u.ar || '');
  const img = withImg ? champImg(name) : '';
  const attr = `data-unit="${String(name).replace(/"/g,'')}"`;
  if(withImg && img) return `<span class="unit-chip has-img ${costClass(u&&u.cost)}" ${attr}><img src="${img}" alt="${name}" loading="lazy" onerror="this.style.display='none'"><span>${name}</span></span>`;
  return `<span class="unit-chip" ${attr}>${name}</span>`;
}
export function traitChip(tr){
  const raw = typeof tr === 'string' ? tr : (tr.name?.en || tr.name || '');
  const name = typeof raw === 'object' ? (raw.en || raw.ar || '') : raw;
  const img = traitImg(name);
  const count = (typeof tr === 'object' && tr.count != null) ? tr.count : '';
  return `<span class="trait-chip" data-trait="${name}">${img?`<img src="${img}" alt="" loading="lazy" onerror="this.style.display='none'">`:''}<span>${name}${count!==''?` ${count}`:''}</span></span>`;
}
export function itemChip(name){
  if(!name) return '';
  const n = typeof name === 'string' ? name : (name.en || name.name || '');
  const img = itemImg(n);
  return `<span class="item-chip" data-item="${n}">${img?`<img src="${img}" alt="${n}" loading="lazy" onerror="this.style.display='none'">`:''}<span>${n}</span></span>`;
}
export function compCard(c){
  const title = localize(c.name) || c.slug || '';
  const style = localize(c.style) || '';
  const note = localize(c.note) || localize(c.summary) || '';
  const tier = (c.tier || 'A').toUpperCase();
  const units = (c.units || c.board || []).slice(0,8).map(u=>unitChip(u,true)).join('');
  const href = localePath('comp.html') + '?slug=' + encodeURIComponent(c.slug||'');
  return `<a class="comp-card tier-${tier.toLowerCase()}" href="${href}"><div class="comp-card-top"><span class="tier-badge">${tier}</span><span class="style-pill">${style}</span></div><h3>${title}</h3><p>${note}</p><div class="comp-units">${units}</div></a>`;
}

const TANKS = new Set(['sentinel','taric','amumu','alistar','ornn','hecarim','rakan','vi','leona','braum','nautilus','zac','sejuani','malphite','shen','ksante','sett','illaoi','sion','chogath','mundo','tahmkench','galio','poppy','rell','thresh','blitzcrank','gromp','scuttlecrab']);
const APS = new Set(['veigar','ahri','morgana','alune','azir','cassiopeia','cass','leblanc','brand','karma','seraphine','lulu','syndra','zoe','vex','annie','viktor','neeko','nami','elise','diana']);
const ADS = new Set(['xayah','sivir','aphelios','ashe','draven','caitlyn','tristana','jinx','yunara','nidalee','khazix','warwick','masteryi','ezreal','kindred','samira','gnar','krug']);
const TANK_BIS=["Warmog's Armor","Gargoyle Stoneplate","Sunfire Cape"];
const AD_BIS=["Infinity Edge","Last Whisper","Giant Slayer"];
const AP_BIS=["Rabadon's Deathcap","Jeweled Gauntlet","Spear of Shojin"];
const AS_BIS=["Guinsoo's Rageblade","Hand of Justice","Titan's Resolve"];
function unitName(u){ if(!u) return ''; if(typeof u==='string') return u; return u.name?.en || u.en || u.name || ''; }
function roleKey(name){ return String(name||'').toLowerCase().replace(/['’]/g,'').replace(/[^a-z]/g,''); }
function itemsFor(name, shared, role){
  if(role==='tank') return TANK_BIS.slice();
  if(role==='ap') return shared.length===3 ? shared.slice() : AP_BIS.slice();
  if(role==='ad') return shared.length===3 ? shared.slice() : AD_BIS.slice();
  return AS_BIS.slice();
}
function autoPositions(comp){
  const units=(comp.units||[]).map(unitName).filter(Boolean);
  const shared=(comp.items||[]).map(n=>typeof n==='string'?n:(n.en||n.name||'')).filter(Boolean);
  const tanks=[], ads=[], aps=[], rest=[];
  for(const n of units){
    const k=roleKey(n);
    if(TANKS.has(k)) tanks.push(n);
    else if(APS.has(k)) aps.push(n);
    else if(ADS.has(k)) ads.push(n);
    else rest.push(n);
  }
  const carry = ads[0] || aps[0] || rest[0];
  const second = ads[1] || aps[0] || rest[1];
  const mainTank = tanks[0];
  const pos={};
  const used=new Set();
  function put(row,col,name,role){
    if(!name || used.has(name) || col<0 || col>6) return;
    used.add(name);
    const itemized = name===carry || name===second || name===mainTank;
    pos[`${row},${col}`]={name, items:itemized?itemsFor(name, shared, role):[], carry:name===carry};
  }
  put(0,3,mainTank,'tank');
  tanks.slice(1).forEach((n,i)=>put(0, i%2===0?2-Math.floor(i/2):4+Math.floor(i/2), n, 'tank'));
  tanks.filter(n=>!used.has(n)).forEach((n,i)=>put(1, 2+i, n, 'tank'));
  put(3,1,carry, ads.includes(carry)?'ad':'ap');
  if(second && second!==carry) put(3,2,second, ads.includes(second)?'ad':'ap');
  const back=[...ads,...aps].filter(n=>!used.has(n));
  back.forEach((n,i)=>put(3, 4+i, n, APS.has(roleKey(n))?'ap':'ad'));
  rest.filter(n=>!used.has(n)).forEach((n,i)=>put(2, 2+i, n, 'ad'));
  units.filter(n=>!used.has(n)).forEach((n,i)=>put(2, i, n, 'ad'));
  return pos;
}
export function renderBoard(comp){
  const positions=(comp.positions && Object.keys(comp.positions).length)?comp.positions:autoPositions(comp);
  const rows=[];
  const builds=[];
  for(let r=0;r<4;r++){
    const cells=[];
    for(let c=0;c<7;c++){
      const unit=positions[`${r},${c}`];
      if(!unit){ cells.push(`<div class="cell"><div class="hex empty"><div class="hex-inner"></div></div></div>`); continue; }
      const name=typeof unit==='string'?unit:(unit.name?.en||unit.name||'');
      const img=champImg(name);
      const items=(unit.items||[]).slice(0,3);
      const icons=items.map(n=>`<img class="hex-item" src="${itemImg(n)}" alt="${n}" title="${n}" loading="lazy">`).join('');
      if(items.length) builds.push({name, items, img});
      cells.push(`<div class="cell"><div class="hex filled ${unit.carry?'carry':''}" title="${name}"><div class="hex-inner"><img class="hex-champ" src="${img}" alt="${name}" loading="lazy" onerror="this.style.opacity=.3"></div></div><span class="hex-name">${name}</span><div class="hex-items">${icons}</div></div>`);
    }
    rows.push(`<div class="hex-row ${r%2===1?'offset':''}">${cells.join('')}</div>`);
  }
  const front=lang==='ar'?'↑ العدو / فرونت لاين':lang==='ja'?'↑ 敵 / フロント':'\u2191 enemy / frontline';
  const buildHtml=builds.map(b=>`<div class="board-build"><img class="bb-champ" src="${b.img}" alt=""><strong>${b.name}</strong><div class="bb-items">${b.items.map(n=>`<img src="${itemImg(n)}" alt="${n}" title="${n}">`).join('')}</div></div>`).join('');
  return `<div class="tft-board"><div class="board-label">${front}</div><div class="hex-grid">${rows.join('')}</div>${buildHtml?`<div class="board-builds">${buildHtml}</div>`:''}</div>`;
}
export function detail(comp){
  if(!comp) return `<p class="empty">${t('notFound')}</p>`;
  const title=localize(comp.name)||comp.slug||'';
  const style=localize(comp.style)||'';
  const note=localize(comp.note)||localize(comp.summary)||'';
  const how=localize(comp.howToPlay)||localize(comp.guide)||'';
  const tier=(comp.tier||'A').toUpperCase();
  const traits=(comp.traits||[]).map(tr=>traitChip(tr)).join('');
  const items=(comp.items||comp.coreItems||[]).map(n=>itemChip(typeof n==='string'?n:n.name||n)).join('');
  const boardHtml=renderBoard(comp);
  const units=(comp.units||[]).map(u=>unitChip(u,true)).join('');
  const boardTitle=lang==='ar'?'توزيع البورد':lang==='ja'?'配置':'Board';
  return `<a class="back-link" href="${localePath('comps.html')}">${t('back')}</a>
  <p class="eyebrow">${tier} · ${style}</p>
  <h1 class="page-title">${title}</h1>
  <p class="page-subtitle">${note}</p>
  <section class="detail-section"><h2>${t('units')}</h2><div class="unit-row">${units}</div></section>
  <section class="detail-section board-section"><h2>${boardTitle}</h2>${boardHtml}</section>
  ${traits?`<section class="detail-section"><h2>${t('traits')}</h2><div class="trait-row">${traits}</div></section>`:''}
  ${items?`<section class="detail-section"><h2>${t('items')}</h2><div class="item-row">${items}</div></section>`:''}
  ${how?`<section class="detail-section"><h2>${t('howToPlay')}</h2><div class="guide">${how}</div></section>`:''}`;
}
export function patchPage(p){
  if(!p) return `<p class="empty">${t('notFound')}</p>`;
  const ver=p.version||'';
  const title=localize(p.title)||ver;
  const date=p.releaseDate||p.date||'';
  const summary=localize(p.summary)||'';
  let highlights=[];
  if(Array.isArray(p.highlights)) highlights=p.highlights.map(h=>localize(h)||(typeof h==='string'?h:'')).filter(Boolean);
  else if(p.highlights&&typeof p.highlights==='object'){ const h=localize(p.highlights); if(h) highlights=[h]; }
  const changes=(p.changes||[]).map(ch=>{
    const who=localize(ch.unit||ch.name)||'';
    const text=localize(ch.detail||ch.text||ch.change)||'';
    const type=ch.type||'';
    return `<div class="patch-change"><strong>${who}</strong>${type?` <span class="patch-type">${type}</span>`:''} ${text}</div>`;
  }).join('');
  return `<p class="eyebrow">PATCH NOTES</p><h1 class="page-title">${title}</h1><p class="page-subtitle">${ver}${date?` · ${date}`:''}</p>${summary?`<p class="guide">${summary}</p>`:''}${highlights.length?`<ul class="guide-list">${highlights.map(h=>`<li>${h}</li>`).join('')}</ul>`:''}<div class="patch-list" style="margin-top:20px">${changes}</div>`;
}
