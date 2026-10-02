import {t,localize,lang,localePath} from './i18n.js';
import {traitImg} from './icons.js';

/** Name → CDragon character folder when display name differs */
const CHAMP_ALIAS = {
  "kog'maw": 'kogmaw',
  "kogmaw": 'kogmaw',
  "reksai": 'reksai',
  "rek'sai": 'reksai',
  "khazix": 'khazix',
  "kha'zix": 'khazix',
  "cho'gath": 'chogath',
  "vel'koz": 'velkoz',
  "kai'sa": 'kaisa',
  "bel'veth": 'belveth',
  "jarvan iv": 'jarvaniv',
  "lee sin": 'leesin',
  "master yi": 'masteryi',
  "miss fortune": 'missfortune',
  "twisted fate": 'twistedfate',
  "xin zhao": 'xinzhao',
  "aurelionsol": 'aurelionsol',
  "elder dragon": 'elderdragon',
  "mama beak": 'raptor',
  "mamabeak": 'raptor',
  "pebbles": 'sentry',
  "scuttlecrab": 'scuttlecrab',
  "cinderling": 'cinderling',
  "brambleback": 'brambleback',
  "murkwolf": 'murkwolf',
  "gromp": 'gromp',
  "krug": 'krug',
  "sentinel": 'sentry',
};

const CHAMP_HUD_ONLY = new Set(['sentry','raptor','cinderling','brambleback','murkwolf','gromp','krug','scuttlecrab']);

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

export function itemImg(name){
  if(!name) return '';
  const n = String(name).toLowerCase().trim()
    .replace(/['']/g,'').replace(/\s+/g,'').replace(/[^a-z0-9]/g,'');
  const aliases = {
    'handofjustice': 'unstableconcoction',
    'hoj': 'unstableconcoction',
    'infinityedge': 'infinityedge',
    'guinsoosrageblade': 'guinsoosrageblade',
    'bloodthirster': 'bloodthirster',
    'lastwhisper': 'lastwhisper',
    'titansresolve': 'titansresolve',
    'warmogsarmor': 'warmogsarmor',
    'gargoylestoneplate': 'gargoylestoneplate',
    'sunfirecape': 'sunfirecape',
    'bluebuff': 'bluebuff',
    'jeweledgauntlet': 'jeweledgauntlet',
    'rabadonsdeathcap': 'rabadonsdeathcap',
    'spearofshojin': 'spearofshojin',
    'archangelstaff': 'archangelsstaff',
    'morellonomicon': 'morellonomicon',
    'redbuff': 'redbuff',
  };
  const key = aliases[n] || n;
  return `https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/${key}.png`;
}

function costClass(cost){
  const c = Number(cost)||0;
  if(c<=1) return 'c1';
  if(c===2) return 'c2';
  if(c===3) return 'c3';
  if(c===4) return 'c4';
  return 'c5';
}

export function unitChip(u, withImg=true){
  const name = typeof u === 'string' ? u : (u.name?.en || (typeof u.name === 'string' ? u.name : '') || u.en || u.ar || '');
  const cost = u.cost;
  const img = withImg ? (u.image?.startsWith('http') ? u.image : champImg(name)) : '';
  const label = name;
  const attr = `data-unit="${String(label).replace(/"/g,'"')}"`;
  if(withImg && img){
    return `<span class="unit-chip has-img ${costClass(cost)}" ${attr}><img src="${img}" alt="${label}" loading="lazy" onerror="this.style.display='none'"><span>${label}</span></span>`;
  }
  return `<span class="unit-chip ${costClass(cost)}" ${attr}>${label}</span>`;
}

export function itemChip(it, withImg=true){
  const name = typeof it === 'string' ? it : (it.en || it.ar || it.name || '');
  const img = withImg ? itemImg(name) : '';
  const attr = `data-item="${String(name).replace(/"/g,'"')}"`;
  if(img){
    return `<span class="item-chip has-img" ${attr}><img src="${img}" alt="${name}" width="28" height="28" style="width:28px;height:28px;object-fit:contain" loading="lazy" onerror="this.style.display='none'"><span>${name}</span></span>`;
  }
  return `<span class="item-chip" ${attr}>${name}</span>`;
}

export function traitChip(tr){
  const raw = typeof tr === 'string' ? tr : (tr.name?.en || tr.name || '');
  const name = typeof tr === 'string' ? tr : (localize(tr.name) || tr.name?.en || '');
  const count = tr.count != null ? tr.count : '';
  const img = traitImg(raw);
  const attr = `data-trait="${String(raw).replace(/"/g,'"')}"`;
  return `<span class="trait-chip" ${attr}>${img?`<img src="${img}" alt="" width="18" height="18">`:''}<span>${name}${count!==''?` ${count}`:''}</span></span>`;
}

function unitName(u){
  return (typeof u === 'string' ? u : (u.name?.en || (typeof u.name === 'string' ? u.name : '') || u.en || u.ar || '')).toString();
}

const BACKLINE_HINTS = new Set(['aphelios','ashe','sivir','caitlyn','tristana','draven','xayah','ahri','morgana','alune','veigar','soraka','zyra','azir','cassiopeia','leblanc','nidalee','kogmaw','varus','ezreal','kennen','lux','karma','teemo','masteryi','yunara']);

function isFrontline(u){
  const name = unitName(u).toLowerCase();
  if(BACKLINE_HINTS.has(name.replace(/['\s]/g,''))) return false;
  if(u.role === 'front' || u.frontline) return true;
  if(u.role === 'back' || u.carry) return false;
  const cost = Number(u.cost)||0;
  return cost <= 3 || name.includes('sentinel') || name.includes('maokai') || name.includes('amumu') || name.includes('taric') || name.includes('ivern') || name.includes('ornn') || name.includes('alistar') || name.includes('hecarim') || name.includes('vi') || name.includes('rakan') || name.includes('sejuani') || name.includes('yorick') || name.includes('rammus') || name.includes('fiddlesticks') || name.includes('krug') || name.includes('scuttle') || name.includes('bramble');
}

export function renderBoard(comp){
  const units = comp.units || [];
  if(!units.length) return '';
  const front = units.filter(isFrontline);
  const back = units.filter(u=>!isFrontline(u));
  const row = (list)=>list.map(u=>unitChip(u,true)).join('');
  return `<div class="board-preview"><div class="board-row front">${row(front)}</div><div class="board-row back">${row(back)}</div></div>`;
}

export function compCard(c){
  const name = localize(c.name) || c.slug || '';
  const style = localize(c.style) || '';
  const summary = localize(c.summary) || '';
  const tier = String(c.tier||'a').toLowerCase();
  const accent = c.color || 'rgba(120,160,220,.35)';
  const units = (c.units||[]).slice(0,8).map(u=>unitChip(u,true)).join('');
  return `<a class="comp-card" href="${localePath('comp.html')}?slug=${c.slug}" style="--accent:${accent}">
    <div class="comp-card-top"><span class="tier ${tier}">${c.tier||'A'}</span><span class="style-tag">${style}</span></div>
    <h3>${name}</h3>
    <p class="comp-summary">${summary}</p>
    <div class="unit-list">${units}</div>
  </a>`;
}

export function detail(comp,patch){
  if(!comp) return `<p class="empty">${t('notFound')}</p>`;
  const name = localize(comp.name);
  const summary = localize(comp.summary)||'';
  const style = localize(comp.style)||'';
  const guide = localize(comp.guide) || localize(comp.howToPlay) || '';
  const units = (comp.units||[]).map(u=>unitChip(u,true)).join('');
  const early = (comp.earlyUnits||[]).map(u=>unitChip(u,true)).join('');
  const traits = (comp.traits||[]).map(traitChip).join('');
  const items = (comp.items||[]).map(it=>itemChip(it,true)).join('');
  const boardHtml = renderBoard(comp);
  const stagesHtml = (comp.stages||[]).map(s=>{
    const txt = localize(s.text)||'';
    return `<div class="stage-row"><span class="stage-num">Stage ${s.stage}</span><p>${txt}</p></div>`;
  }).join('');
  const sectionsHtml = (comp.sections||[]).map(sec=>{
    const title = localize(sec.title)||'';
    const body = (sec.body||[]).map(b=>`<p>${localize(b)}</p>`).join('');
    const bullets = (sec.bullets||[]).map(b=>`<li>${localize(b)}</li>`).join('');
    return `<section class="detail-section"><h2>${title}</h2>${body}${bullets?`<ul class="guide-list">${bullets}</ul>`:''}</section>`;
  }).join('');
  return `
  <a class="back-link" href="${localePath('comps.html')}">${t('back')}</a>
  <div class="detail-hero">
    <div class="detail-title-row">
      <div>
        <span class="tier ${String(comp.tier||'a').toLowerCase()}">${comp.tier||'A'}</span>
        ${style?`<span class="style-tag">${style}</span>`:''}
        <h1>${name}</h1>
        <p class="page-subtitle">${summary}</p>
      </div>
    </div>
  </div>
  ${boardHtml}
  <div class="detail-grid">
    <section class="detail-section">
      <h2>${t('units')}</h2>
      <div class="unit-list large">${units}</div>
      ${early?`<h3 style="margin-top:18px;font-size:14px;color:var(--muted)">Early / Pivot</h3><div class="unit-list">${early}</div>`:''}
    </section>
    <section class="detail-section">
      <h2>${t('traits')}</h2>
      <div class="unit-list">${traits}</div>
      ${items?`<h2 style="margin-top:20px">${t('items')}</h2><div class="item-list">${items}</div>`:''}
    </section>
  </div>
  ${guide?`<section class="detail-section" style="margin-top:16px"><h2>${t('howToPlay')}</h2><p class="guide">${guide}</p></section>`:''}
  ${stagesHtml?`<section class="detail-section" style="margin-top:16px"><h2>Stages</h2><div class="stages">${stagesHtml}</div></section>`:''}
  ${sectionsHtml}
  `;
}

export function champCard(c){
  const name = localize(c.name) || c.id || '';
  const cost = c.cost || 1;
  const traits = (c.traits||[]).map(tr=>traitChip(typeof tr==='string'?tr:{name:{en:tr}})).join('');
  const items = (c.recommendedItems||c.items||[]).slice(0,3).map(it=>itemChip(it,true)).join('');
  const img = champImg(name);
  return `<article class="champ-card c${cost}">
    <div class="champ-head">
      ${img?`<img class="champ-avatar" src="${img}" alt="${name}" loading="lazy" onerror="this.style.display='none'">`:''}
      <div><span class="cost-badge">$${cost}</span><h3>${name}</h3></div>
    </div>
    <div class="unit-list">${traits}</div>
    ${items?`<div class="item-list bis-row">${items}</div>`:''}
  </article>`;
}

export function patchCard(p){
  const ver = p.version || '';
  const title = localize(p.title) || ver;
  const highlights = (p.highlights||[]).map(h=>localize(h)).filter(Boolean).join(' · ');
  const changes = (p.changes||[]).map(ch=>{
    const who = localize(ch.unit||ch.name) || '';
    const text = localize(ch.text||ch.change) || '';
    return `<div class="patch-change"><strong>${who}</strong> ${text}</div>`;
  }).join('');
  return `<article class="patch-card">
  <div class="patch-head"><span class="patch-ver">${ver}</span><h3>${title}</h3>
    ${highlights?`<p class="patch-highlights">${highlights}</p>`:''}
  </div>
  <div class="patch-list">${changes}</div></article>`;
}
