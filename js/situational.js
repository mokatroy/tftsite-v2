import {setupLanguage,localize,t,localePath} from './i18n.js';
const root=document.querySelector('#situational-root');
function render(list){
  if(!root) return;
  if(!list.length){ root.innerHTML='<p class="empty">'+t('notFound')+'</p>'; return; }
  root.innerHTML='<div class="page-title-block"><p class="eyebrow">SET 18</p><h1 class="page-title">'+t('situationalTitle')+'</h1></div><div class="situational-grid">'+list.map(c=>`<article class="situational-card"><div class="situational-card-head"><div><span class="situational-label">SITUATIONAL</span><h3>${localize(c.title)}</h3><p>${localize(c.style)}</p></div><a class="situational-open" href="${localePath('situational.html')}?slug=${c.slug}">${t('situationalOpen')} ↗</a></div><p class="situational-note">${localize(c.note)}</p><div class="situational-augments">${(c.augments||[]).map(a=>`<span>${a}</span>`).join('')}</div></article>`).join('')+'</div>';
}
fetch('data/situational-comps.json').then(r=>r.json()).then(xs=>{ render(xs); setupLanguage(()=>render(xs)); }).catch(()=>{ if(root) root.innerHTML='<p class="empty">'+t('notFound')+'</p>'; });
