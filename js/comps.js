import {setupLanguage,setPatchVersion,t,localize,localePath} from './i18n.js';
import{compCard}from'./ui.js';
let comps=[],situational=[],tier='All',query='';
const root=document.querySelector('#comps-list');
const situationalRoot=document.querySelector('#situational-list');
function renderSituational(){
  if(!situationalRoot)return;
  situationalRoot.innerHTML=situational.map(c=>{
    const title=localize(c.title)||c.name||c.slug||'';
    const style=localize(c.style)||'';
    const note=localize(c.note)||'';
    const augs=(c.augments||[]).map(a=>`<span>${a}</span>`).join('');
    const slug=c.slug||'';
    return `<article class="situational-card"><div class="situational-card-head"><div><span class="situational-label">SITUATIONAL</span><h3>${title}</h3><p>${style}</p></div><a class="situational-open" href="${localePath('situational.html')}?slug=${slug}">${t('situationalOpen')||'Open'} ↗</a></div><p class="situational-note">${note}</p><div class="situational-augments">${augs}</div></article>`;
  }).join('');
}
function render(){
  if(!root)return;
  const filtered=comps.filter(c=>{
    const matchTier=tier==='All'||c.tier===tier;
    const matchQ=!query||JSON.stringify(c).toLowerCase().includes(query.toLowerCase());
    return matchTier&&matchQ;
  });
  root.innerHTML=filtered.length?filtered.map(compCard).join(''):`<p class="empty">${t('notFound')}</p>`;
  const filters=document.querySelector('#tier-filters');
  if(filters){
    filters.innerHTML=['All','S','A','B'].map(x=>`<button class="${tier===x?'active':''}" data-tier="${x}">${x==='All'?t('all'):x}</button>`).join('');
    filters.querySelectorAll('[data-tier]').forEach(b=>b.onclick=()=>{tier=b.dataset.tier;render()});
  }
}
Promise.all([
  fetch('data/v2_comps.json').then(r=>r.ok?r.json():fetch('data/comps.json').then(r=>r.json())),
  fetch('data/v2_comps_extra.json').then(r=>r.ok?r.json():[]).catch(()=>[]),
  fetch('data/v2_comps_extra2.json').then(r=>r.ok?r.json():[]).catch(()=>[]),
  fetch('data/v2_comps_extra3.json').then(r=>r.ok?r.json():[]).catch(()=>[]),
  fetch('data/v2_situational-comps.json').then(r=>r.ok?r.json():[]).catch(()=>[]),
  fetch('data/patches.json').then(r=>r.json())
]).then(([c,extra,extra2,extra3,s,p])=>{
  const base=Array.isArray(c)?c:(c.comps||[]);
  const more=[...(Array.isArray(extra)?extra:[]), ...(Array.isArray(extra2)?extra2:[]), ...(Array.isArray(extra3)?extra3:[])];
  const seen=new Set(base.map(x=>x.slug));
  comps=base.concat(more.filter(x=>x&&x.slug&&!seen.has(x.slug)));
  situational=Array.isArray(s)?s:[];
  if(p[0]) setPatchVersion(p[0].version);
  render();renderSituational();
});
const search=document.querySelector('#comp-search');
if(search) search.addEventListener('input',e=>{query=e.target.value;render()});
setupLanguage(()=>{render();renderSituational()});
