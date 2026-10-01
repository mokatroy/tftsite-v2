import {t,localize,lang,localePath} from './i18n.js';
export function compCard(c){
  const name=localize(c.name)||c.slug;
  const summary=localize(c.summary)||'';
  const units=(c.units||[]).slice(0,6).map(u=>`<span class="unit-chip">${u.name?.en||u.name||''}</span>`).join('');
  return `<a class="comp-card" href="${localePath('comp.html')}?slug=${c.slug}" style="--accent:${c.accent||'rgba(155,118,242,.4)'}"><div class="card-top"><span class="tier ${String(c.tier||'a').toLowerCase()}">${c.tier||'A'}</span></div><h3>${name}</h3><p>${summary}</p><div class="unit-list">${units}</div></a>`;
}
export function detail(comp,patch){
  if(!comp) return `<p class="empty">${t('notFound')}</p>`;
  const name=localize(comp.name);
  const summary=localize(comp.summary)||'';
  const units=(comp.units||[]).map(u=>`<span class="unit-chip" data-unit="${u.name?.en||''}">${u.name?.en||u.name||''}</span>`).join('');
  const traits=(comp.traits||[]).map(tr=>`<span class="unit-chip">${tr}</span>`).join('');
  const guide=localize(comp.guide)||localize(comp.howToPlay)||'';
  return `<a class="back-link" href="${localePath('comps.html')}">${t('back')}</a>
  <div class="detail-hero"><div class="detail-title-row"><div><span class="tier ${String(comp.tier||'a').toLowerCase()}">${comp.tier||'A'}</span><h1>${name}</h1><p class="page-subtitle">${summary}</p></div></div></div>
  <div class="detail-grid"><section class="detail-section"><h2>${t('units')}</h2><div class="unit-list">${units}</div></section>
  <section class="detail-section"><h2>${t('traits')}</h2><div class="unit-list">${traits}</div></section></div>
  <section class="detail-section" style="margin-top:16px"><h2>${t('howToPlay')}</h2><p class="guide">${guide}</p></section>`;
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
