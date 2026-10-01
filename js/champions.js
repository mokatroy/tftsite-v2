import {setupLanguage} from './i18n.js';
const grid=document.querySelector('#champ-grid');
const search=document.querySelector('#champ-search');
let champions=[],query='';
function render(){
  if(!grid) return;
  const q=query.toLowerCase();
  const list=champions.filter(c=>{
    const n=(c.name?.en||'')+(c.name?.ar||'');
    const traits=(c.traits||[]).map(t=>t.name||t).join(' ');
    return !q||n.toLowerCase().includes(q)||traits.toLowerCase().includes(q);
  });
  grid.innerHTML=list.map(c=>{
    const traits=(c.traits||[]).map(t=>`<span class="unit-chip">${t.name||t}</span>`).join('');
    return `<article class="comp-card" style="min-height:auto"><div class="card-top"><span class="tier a">${c.cost||'?'}c</span></div><h3>${c.name?.en||''}</h3><div class="unit-list">${traits}</div></article>`;
  }).join('')||'<p class="empty">—</p>';
}
if(search) search.addEventListener('input',e=>{query=e.target.value;render()});
fetch('data/champions.json').then(r=>r.json()).then(d=>{champions=d.champions||d||[];render()}).catch(()=>{if(grid)grid.innerHTML='<p class="empty">—</p>'});
setupLanguage(render);
