import {t,localize,lang,localePath} from './locale.js?v=20261005h';
import {traitImg} from './icons.js?v=20261005h';
import {roleKey,roleOf,itemsForChampion,CHAMP_COST} from './ui-data.js?v=20261005h';

export function champImg(name){
  const n=String(name||'').replace(/\s+/g,'');
  const map={Pebbles:'Sentry',Sentinel:'Galio',Krug:'Krug',Cinderling:'Smolder',Scuttlecrab:'Rammus',Gromp:'Gromp',Brambleback:'Ivern',MamaBeak:'Quinn',Mamabeak:'Quinn'};
  const key=map[n]||n;
  return `https://ddragon.leagueoflegends.com/cdn/15.1.1/img/champion/${key}.png`;
}
export function itemImg(name){
  if(!name) return '';
  const map={
    "Guinsoo's Rageblade":"tft_item_guinsoosrageblade",
    "Bloodthirster":"tft_item_bloodthirster",
    "Last Whisper":"tft_item_lastwhisper",
    "Giant Slayer":"tft_item_madredsbloodrazor",
    "Infinity Edge":"tft_item_infinityedge",
    "Hand of Justice":"tft_item_unstableconcoction",
    "Spear of Shojin":"tft_item_spearofshojin",
    "Blue Buff":"tft_item_bluebuff",
    "Rabadon's Deathcap":"tft_item_rabadonsdeathcap",
    "Jeweled Gauntlet":"tft_item_jeweledgauntlet",
    "Morellonomicon":"tft_item_morellonomicon",
    "Sunfire Cape":"tft_item_redbuff",
    "Gargoyle Stoneplate":"tft_item_gargoylestoneplate",
    "Warmog's Armor":"tft_item_warmogsarmor",
    "Bramble Vest":"tft_item_bramblevest",
    "Dragon's Claw":"tft_item_dragonsclaw",
    "Titan's Resolve":"tft_item_titansresolve",
    "Sterak's Gage":"tft_item_steraksgage",
    "Deathblade":"tft_item_deathblade",
    "Ionic Spark":"tft_item_ionicspark",
    "Red Buff":"tft_item_redbuff",
    "Edge of Night":"tft_item_guardianangel",
    "Archangel's Staff":"tft_item_archangelsstaff",
    "Hextech Gunblade":"tft_item_hextechgunblade",
    "Crownguard":"tft_item_crownguard",
    "Protector's Vow":"tft_item_protectorsvow",
    "Spirit Visage":"tft_item_spiritvisage",
    "Adaptive Helm":"tft_item_adaptivehelm",
    "Evenshroud":"tft_item_evenshroud",
    "Steadfast Heart":"tft_item_steadfastheart",
    "Nashor's Tooth":"tft_item_nashorstooth",
    "Void Staff":"tft_item_voidstaff",
    "Kraken's Fury":"tft_item_krakensfury",
    "B.F. Sword":"tft_item_bfsword",
    "Recurve Bow":"tft_item_recurvebow",
    "Needlessly Large Rod":"tft_item_needlesslylargerod",
    "Tear of the Goddess":"tft_item_tearofthegoddess",
    "Chain Vest":"tft_item_chainvest",
    "Negatron Cloak":"tft_item_negatroncloak",
    "Giant's Belt":"tft_item_giantsbelt",
    "Sparring Gloves":"tft_item_sparringgloves",
    "Spatula":"tft_item_spatula",
    "Frying Pan":"tft_item_fryingpan"
  };
  let slug=map[name];
  if(!slug){
    const k=String(name).toLowerCase().replace(/['']/g,'').replace(/[^a-z0-9]+/g,'');
    slug='tft_item_'+k;
  }
  return `https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/hexcore/${slug}.png`;
}
export function unitChip(u, withImg=true){
  const name=typeof u==='string'?u:(u?.name?localize(u.name)||u.name:u?.en||u?.ar||'');
  const n=String(name||'');
  if(!n) return '';
  const img=withImg?`<img src="${champImg(n)}" alt="" loading="lazy" onerror="this.style.display='none'">`:'';
  return `<span class="unit-chip has-img" data-unit="${n}">${img}<span>${n}</span></span>`;
}
export function traitChip(tr){
  const name=typeof tr==='string'?tr:(tr?.name?localize(tr.name)||tr.name:'');
  const count=tr?.count!=null?` ${tr.count}`:'';
  const img=traitImg?traitImg(name):'';
  return `<span class="trait-chip" data-trait="${name}">${img?`<img src="${img}" alt="">`:''}<span>${name}${count}</span></span>`;
}
export function itemChip(name){
  const n=typeof name==='string'?name:(name?.name||'');
  if(!n) return '';
  return `<span class="item-chip has-img" data-item="${n}"><img src="${itemImg(n)}" alt="" loading="lazy" onerror="this.style.display='none'"><span>${n}</span></span>`;
}
export function compCard(c){
  const title=localize(c.name)||c.slug||'';
  const style=localize(c.style)||'';
  const summary=localize(c.summary)||'';
  const tier=(c.tier||'B').toLowerCase();
  const units=(c.units||[]).slice(0,8).map(u=>unitChip(u,true)).join('');
  return `<a class="comp-card tier-${tier}" href="${localePath('comp.html')}?slug=${c.slug}"><div class="comp-card-top"><span class="tier-badge">${(c.tier||'').toUpperCase()}</span><span class="style-pill">${style}</span></div><h3>${title}</h3><p>${summary}</p><div class="comp-units">${units}</div></a>`;
}
function unitName(u){
  if(!u) return '';
  if(typeof u==='string') return u;
  return u.name?.en||u.name||u.en||u.ar||'';
}
function champCost(name){
  const k=roleKey(name);
  return CHAMP_COST[k]||CHAMP_COST[String(name||'').toLowerCase()]||1;
}
function autoPositions(comp){
  const units=(comp.units||[]).map(unitName).filter(Boolean);
  const tanks=[], carries=[], rest=[];
  for(const n of units){
    const role=roleOf(n);
    if(role==='tank') tanks.push(n);
    else if(role==='ad'||role==='ap') carries.push(n);
    else rest.push(n);
  }
  const primary=carries[0]||rest[0]||units[0];
  const secondary=carries.find(n=>n!==primary)||rest.find(n=>n!==primary)||null;
  const pos={};
  const frontSlots=[[0,1],[0,2],[0,3],[0,4],[1,0],[1,1],[1,2]];
  const backSlots=[[2,1],[2,2],[2,3],[2,4],[3,1],[3,2],[3,3]];
  let fi=0, bi=0;
  const place=(name, slots, idx)=>{
    if(!name||idx>=slots.length) return idx;
    const [r,c]=slots[idx];
    const shared=(comp.items||comp.coreItems||[]).map(x=>typeof x==='string'?x:x.name||x).filter(Boolean);
    const isPri=roleKey(name)===roleKey(primary);
    const isSec=secondary&&roleKey(name)===roleKey(secondary);
    const items=itemsForChampion(name, shared, isPri||isSec).slice(0,3);
    pos[`${r},${c}`]={name, items, allItems:items, carry:isPri};
    return idx+1;
  };
  for(const t of tanks) fi=place(t, frontSlots, fi);
  for(const n of units){
    if(tanks.includes(n)) continue;
    if(roleOf(n)==='ad'||roleOf(n)==='ap'||n===primary||n===secondary) bi=place(n, backSlots, bi);
    else fi=place(n, frontSlots, fi);
  }
  return pos;
}
export function renderBoard(comp){
  const positions=(comp.positions && Object.keys(comp.positions).length)?comp.positions:autoPositions(comp);
  const rows=[], builds=[], frontUnits=[], backUnits=[];
  for(let r=0;r<4;r++){
    const cells=[];
    for(let c=0;c<7;c++){
      const unit=positions[`${r},${c}`];
      if(!unit){
        cells.push(`<div class="cell empty-cell"><div class="hex empty"><div class="hex-inner"></div></div></div>`);
        continue;
      }
      const name=typeof unit==='string'?unit:(unit.name?.en||unit.name||'');
      const img=champImg(name);
      const cost=champCost(name);
      const items=(unit.items||[]).slice(0,3);
      const allItems=(unit.allItems||unit.items||[]).slice(0,3);
      const icons=items.map(n=>`<img class="hex-item" data-item="${n}" src="${itemImg(n)}" alt="${n}" title="${n}" loading="lazy">`).join('');
      if(allItems.length) builds.push({name, items: allItems, img});
      const entry={name, img, items, carry:!!unit.carry};
      if(r<=1) frontUnits.push(entry); else backUnits.push(entry);
      cells.push(`<div class="cell" data-unit="${name}"><div class="hex filled cost-${cost} ${unit.carry?'carry':''}" title="${name}"><div class="hex-inner"><img class="hex-champ" src="${img}" alt="${name}" loading="lazy" onerror="this.style.opacity=.3"></div>${icons?`<div class="hex-items">${icons}</div>`:''}</div></div>`);
    }
    rows.push(`<div class="hex-row ${r%2===1?'offset':''}">${cells.join('')}</div>`);
  }
  const front=lang==='ar'?'↑ العدو / فرونت لاين':lang==='ja'?'↑ 敵 / フロント':'↑ enemy / frontline';
  const fl=lang==='ar'?'فرونت لاين':lang==='ja'?'フロント':'Frontline';
  const bl=lang==='ar'?'باك لاين':lang==='ja'?'バック':'Backline';
  const lane=list=>list.map(u=>{
    const icons=(u.items||[]).map(n=>`<img src="${itemImg(n)}" alt="${n}" title="${n}" loading="lazy">`).join('');
    return `<div class="bm-unit ${u.carry?'carry':''}"><img class="bm-champ" src="${u.img}" alt="${u.name}" loading="lazy" onerror="this.style.opacity=.3"><span class="bm-name">${u.name}</span><div class="bm-items">${icons}</div></div>`;
  }).join('');
  const mobile=`<div class="board-mobile"><div class="bm-lane"><span class="bm-label">${fl}</span><div class="bm-units">${lane(frontUnits)}</div></div><div class="bm-lane"><span class="bm-label">${bl}</span><div class="bm-units">${lane(backUnits)}</div></div></div>`;
  const desktop=`<div class="board-desktop hex-grid">${rows.join('')}</div>`;
  const buildHtml=builds.map(b=>`<div class="board-build" data-unit="${b.name}"><img class="bb-champ" src="${b.img}" alt=""><strong>${b.name}</strong><div class="bb-items">${b.items.map(n=>`<img data-item="${n}" src="${itemImg(n)}" alt="${n}" title="${n}">`).join('')}</div></div>`).join('');
  return `<div class="tft-board"><div class="board-label">${front}</div>${mobile}${desktop}${buildHtml?`<div class="board-builds">${buildHtml}</div>`:''}</div>`;
}
