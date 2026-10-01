import {setupLanguage,localize,t,localePath} from './i18n.js';
const root=document.querySelector('#situational-root');
function render(list){
  if(!root) return;
  if(!list.length){ root.innerHTML='<p class="empty">'+(t('notFound')||'—')+'</p>'; return; }
  root.innerHTML='<p class="eyebrow">SET 18</p><h1 class="page-title">'+(t('situationalTitle')||'Situational')+'</h1><div class="situational-grid">'+
    list.map(c=>{
      const title=localize(c.title)||c.name||c.slug||'';
      const style=localize(c.style)||'';
      const note=localize(c.note)||'';
      const augs=(c.augments||[]).map(a=>`<span>${a}</span>`).join('');
      return `<article class="situational-card"><div class="situational-card-head"><div><span class="situational-label">SITUATIONAL</span><h3>${title}</h3><p>${style}</p></div></div><p class="situational-note">${note}</p><div class="situational-augments">${augs}</div></article>`;
    }).join('')+'</div>';
}
fetch('data/v2_situational-comps.json').then(r=>r.ok?r.json():fetch('data/situational-comps.json').then(r=>r.json()))
  .then(xs=>{const list=Array.isArray(xs)?xs:[]; render(list); setupLanguage(()=>render(list));})
  .catch(()=>{ if(root) root.innerHTML='<p class="empty">—</p>'; });
