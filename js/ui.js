import {t,localize,lang,localePath} from './i18n.js';

/** Build CommunityDragon square icon URL for a TFT Set 18 unit */
export function champImg(name){
  if(!name) return '';
  const key = String(name).toLowerCase()
    .replace(/['’]/g,'')
    .replace(/\s+/g,'')
    .replace(/[^a-z0-9]/g,'');
  return `https://raw.communitydragon.org/latest/game/assets/characters/tft18_${key}/tft18_${key}_square.png`;
}

/** Map common TFT / LoL item names to DDragon item IDs */
const ITEM_IDS = {
  'infinity edge': '3031',
  "guinsoo's rageblade": '3124',
  'spear of shojin': '3161',
  'bloodthirster': '3072',
  "rabadon's deathcap": '3089',
  'last whisper': '3035',
  'edge of night': '3814',
  'bramble vest': '3076',
  'morellonomicon': '3165',
  "warmog's armor": '3083',
  'void staff': '3135',
  "giant's belt": '1011',
  'recurve bow': '1043',
  'tear of the goddess': '3070',
  'chain vest': '1031',
  'negatron cloak': '1057',
  'needlessly large rod': '1058',
  'bf sword': '1038',
  "b.f. sword": '1038',
  'sparring gloves': '2140',
  'quicksilver': '3140',
  'ionic spark': '3115',
  'sunfire cape': '3068',
  'archangel staff': '3003',
  'blue buff': '3004',
  'red buff': '1044',
  'gargoyle stoneplate': '3193',
  "dragon's claw": '3026',
  'giant slayer': '3031',
  'hand of justice': '3190',
  "titan's resolve": '3748',
  'jeweled gauntlet': '3134',
  'steadfast heart': '3105',
  'crownguard': '3102',
  'deathblade': '3031',
  'guardian angel': '3026'
};

export function itemImg(name){
  if(!name) return '';
  const key = String(name).toLowerCase().trim();
  const id = ITEM_IDS[key];
  if(id) return `https://ddragon.leagueoflegends.com/cdn/15.1.1/img/item/${id}.png`;
  return '';
}

function costClass(cost){
  const c = Number(cost)||1;
  return `cost-${Math.min(5,Math.max(1,c))}`;
}

export function unitChip(u, withImg=true){
  const name = typeof u === 'string' ? u : (u.name?.en || u.name || '');
  const cost = u.cost;
  const img = withImg ? (u.image?.startsWith('http') ? u.image : champImg(name)) : '';
  const label = name;
  if(withImg && img){
    return `<span class="unit-chip has-img ${costClass(cost)}" title="${label}"><img src="${img}" alt="${label}" loading="lazy" onerror="this.style.display='none'"><span>${label}</span></span>`;
  }
  return `<span class="unit-chip ${costClass(cost)}">${label}</span>`;
}

export function traitChip(tr){
  if(typeof tr === 'string') return `<span class="unit-chip trait">${tr}</span>`;
  const name = localize(tr.name) || tr.name?.en || '';
  const count = tr.count ? ` (${tr.count})` : '';
  return `<span class="unit-chip trait">${name}${count}</span>`;
}

export function itemChip(it, withImg=true){
  const name = typeof it === 'string' ? it : (it.en || it.ar || it.name || '');
  const img = withImg ? itemImg(name) : '';
  if(img){
    return `<span class="item-chip has-img" title="${name}"><img src="${img}" alt="${name}" loading="lazy" onerror="this.parentElement.classList.remove('has-img');this.remove()"><span>${name}</span></span>`;
  }
  return `<span class="item-chip">${name}</span>`;
}

export function compCard(c){
  const name = localize(c.name) || c.slug;
  const summary = localize(c.summary) || '';
  const style = localize(c.style) || '';
  const units = (c.units||[]).slice(0,8).map(u=>unitChip(u,true)).join('');
  const accent = c.color || c.accent || 'rgba(155,118,242,.4)';
  return `<a class="comp-card" href="${localePath('comp.html')}?slug=${c.slug}" style="--accent:${accent}">
    <div class="card-top"><span class="tier ${String(c.tier||'a').toLowerCase()}">${c.tier||'A'}</span>${style?`<span class="style-tag">${style}</span>`:''}</div>
    <h3>${name}</h3>
    <p>${summary}</p>
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
  if(!p) return `<p class="empty">—</p>`;
  const title=localize(p.title);
  const summary=localize(p.summary);
  const highlights=localize(p.highlights)||'';
  const changes=(p.changes||[]).map(ch=>{
    const n=localize(ch.name);
    const d=localize(ch.detail);
    const cat=ch.category?`<span class="patch-cat">${ch.category}</span>`:'';
    return `<article class="patch-change ${ch.type||''}"><div class="patch-change-head">${cat}<h3>${n}</h3></div><p>${d}</p></article>`;
  }).join('');
  return `<div class="patch-hero">
    <p class="patch-release">${p.releaseDate||''} · Set 18 Enchanted Wilds</p>
    <h1>${title}</h1>
    <p>${summary}</p>
    ${highlights?`<p class="patch-highlights">${highlights}</p>`:''}
  </div>
  <div class="patch-list">${changes}</div>`;
}
