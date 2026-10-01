import {setupLanguage} from './i18n.js';
const grid=document.querySelector('#champ-grid');
const search=document.querySelector('#champ-search');
let champions=[],query='';
function render(){
  if(!grid) return;
  const q=query.toLowerCase();
  const list=champions.filter(c=>{
    const n=(c.name?.en||'')+(c.name?.ar||'')+(c.name?.ja||'');
    const traits=(c.traits||[]).map(t=>t.name||t).join(' ');
    return !q||n.toLowerCase().includes(q)||traits.toLowerCase().includes(q);
  });
  grid.innerHTML=list.map(c=>{
    const traits=(c.traits||[]).map(t=>`<span class="unit-chip">${t.name||t}</span>`).join('');
    const photo=c.image?`<img src="${c.image}" alt="${c.name?.en||''}" style="width:72px;height:72px;border-radius:10px;object-fit:cover">`:'';
    return `<article class="comp-card" style="min-height:auto"><div class="card-top"><span class="tier a">${c.cost||'?'}c</span></div>${photo}<h3>${c.name?.en||''}</h3><div class="unit-list">${traits}</div></article>`;
  }).join('')||'<p class="empty">—</p>';
}
if(search) search.addEventListener('input',e=>{query=e.target.value;render()});
fetch('data/v2_champions.json').then(r=>r.ok?r.json():fetch('data/champions.json').then(x=>x.json()))
  .then(d=>{champions=d.champions||d||[];render()})
  .catch(()=>{if(grid)grid.innerHTML='<p class="empty">—</p>'});
setupLanguage(render);
