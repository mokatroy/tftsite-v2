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

/** Cost border color */
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

export function itemChip(it){
  const name = typeof it === 'string' ? it : (it.en || it.ar || it.name || '');
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
  const items = (comp.items||[]).map(itemChip).join('');

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
  const changes=(p.changes||[]).map(ch=>{
    const n=localize(ch.name);
    const d=localize(ch.detail);
    return `<article class="patch-change ${ch.type||''}"><h3>${n}</h3><p>${d}</p></article>`;
  }).join('');
  return `<div class="patch-hero"><p class="patch-release">${p.releaseDate||''}</p><h1>${title}</h1><p>${summary}</p></div><div class="patch-list">${changes}</div>`;
}
