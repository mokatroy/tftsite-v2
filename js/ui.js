import {t,localize,lang,localePath} from './locale.js?v=20261005k';
export * from './ui-core.js?v=20261005k';
import {unitChip,traitChip,itemChip,renderBoard} from './ui-core.js?v=20261005k';

export function detail(comp){
  if(!comp) return `<p class="empty">${t('notFound')}</p>`;
  const title=localize(comp.name)||comp.slug||'';
  const style=localize(comp.style)||'';
  const note=localize(comp.note)||localize(comp.summary)||'';
  const tier=(comp.tier||'A').toUpperCase();
  const traits=(comp.traits||[]).map(tr=>traitChip(tr)).join('');
  const items=(comp.items||comp.coreItems||[]).map(n=>itemChip(typeof n==='string'?n:n.name||n)).join('');
  const boardHtml=renderBoard(comp);
  const units=(comp.units||[]).map(u=>unitChip(u,true)).join('');
  const boardTitle=lang==='ar'?'توزيع البورد':lang==='ja'?'配置':'Board';
  return `<a class="back-link" href="${localePath('comps.html')}">${t('back')}</a>
  <p class="eyebrow"><span class="tier-badge">${tier}</span> <span class="style-pill">${style}</span></p>
  <h1 class="page-title">${title}</h1>
  <p class="page-subtitle">${note}</p>
  <section class="detail-section board-section"><h2>${boardTitle}</h2>${boardHtml}</section>
  <section class="detail-section"><h2>${t('units')}</h2><div class="unit-row">${units}</div></section>
  ${traits?`<section class="detail-section"><h2>${t('traits')}</h2><div class="trait-row">${traits}</div></section>`:''}
  ${items?`<section class="detail-section"><h2>${t('items')}</h2><div class="item-row">${items}</div></section>`:''}`;
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
