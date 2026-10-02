import {t,localize,lang,localePath} from './i18n.js';
import {traitImg} from './icons.js';

/** Name → CDragon character folder when display name differs */
const CHAMP_ALIAS = {
  "kog'maw": 'kogmaw',
  'kogmaw': 'kogmaw',
  "rek'sai": 'reksai',
  'reksai': 'reksai',
  "kha'zix": 'khazix',
  'khazix': 'khazix',
  'elder dragon': 'elderdragon',
  'mama beak': 'raptor',
  'mamabeak': 'raptor',
  'pebbles': 'sentry',
  'scuttlecrab': 'scuttlecrab',
  'cinderling': 'cinderling',
  'brambleback': 'brambleback',
  'murkwolf': 'murkwolf',
  'gromp': 'gromp',
  'krug': 'krug',
  'sentinel': 'sentry',
  'master yi': 'masteryi',
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
  let n = String(name).toLowerCase().trim().replace(/['']/g,'').replace(/\s+/g,'').replace(/[^a-z0-9]/g,'');
  const aliases = {
    handofjustice: 'unstableconcoction',
    hoj: 'unstableconcoction',
  };
  n = aliases[n] || n;
  return `https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/${n}.png`;
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
  const name = typeof tr === 'string' ? tr : (localize(tr.name) || tr.name?.en || '');
  const count = tr && tr.count != null ? tr.count : '';
  const img = traitImg(raw);
  const attr = `data-trait="${String(raw).replace(/"/g,'"')}"`;
  return `<span class="trait-chip" ${attr}>${img?`<img src="${img}" alt="" width="18" height="18">`:''}<span>${name}${count!==''?` ${count}`:''}</span></span>`;
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

function unitName(u){
  return (typeof u === 'string' ? u : (u.name?.en || (typeof u.name === 'string' ? u.name : '') || u.en || u.ar || '')).toString();
}

const BACKLINE_HINTS = new Set(['aphelios','ashe','sivir','caitlyn','tristana','draven','xayah','ahri','morgana','alune','veigar','soraka','zyra','azir','cassiopeia','leblanc','nidalee','kogmaw','varus','ezreal','kennen','lux','karma','teemo','masteryi','yunara']);

function isFrontline(u){
  const name = unitName(u).toLowerCase().replace(/['\s]/g,'');
  if(BACKLINE_HINTS.has(name)) return false;
  if(u && (u.role === 'front' || u.frontline)) return true;
  if(u && (u.role === 'back' || u.carry)) return false;
  const cost = Number(u && u.cost)||0;
  return cost <= 3 || /sentinel|maokai|amumu|taric|ivern|ornn|alistar|hecarim|vi|rakan|sejuani|yorick|rammus|fiddlesticks|krug|scuttle|bramble/.test(name);
}

export function renderBoard(comp){
  const units = (comp && comp.units) || [];
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

export function patchPage(p){
  if(!p) return `<p class="empty">${t('notFound')}</p>`;
  const ver = p.version || '';
  const title = localize(p.title) || ver;
  const date = p.date || '';
  const summary = localize(p.summary) || '';
  const highlights = (p.highlights||[]).map(h=>localize(h)).filter(Boolean);
  const changes = (p.changes||[]).map(ch=>{
    const who = localize(ch.unit||ch.name) || '';
    const text = localize(ch.text||ch.change) || '';
    const type = ch.type || '';
    return `<div class="patch-change"><strong>${who}</strong>${type?` <span class="patch-type">${type}</span>`:''} ${text}</div>`;
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
