import {setupLanguage,lang} from './i18n.js';
import {traitIcon,traitTooltip} from './hover-data.js';
const board=document.querySelector('#tier-board');
const search=document.querySelector('#tier-search');
let rows=[];
function render(){
  if(!board) return;
  const q=(search&&search.value||'').trim().toLowerCase();
  board.innerHTML=rows.map(row=>{
    const items=row.items.filter(it=>!q||it.name.toLowerCase().includes(q));
    if(!items.length&&q) return '';
    return `<div class="tier-row tier-${row.tier.toLowerCase()}"><div class="tier-label">${row.tier}</div><div class="tier-items">${items.map(it=>`<span class="tier-entry has-global-tip"><img src="${traitIcon(it.name)}" alt="${it.name}"><span>${it.name}</span>${traitTooltip(it.name)}</span>`).join('')}</div></div>`;
  }).join('');
}
if(search) search.addEventListener('input',render);
fetch('data/champions.json').then(r=>r.json()).then(d=>{
  // Build a simple trait tier from champions data if no dedicated file
  const traitMap={};
  (d.champions||[]).forEach(c=>{(c.traits||[]).forEach(t=>{traitMap[t.name]=(traitMap[t.name]||0)+1})});
  const names=Object.keys(traitMap).sort();
  rows=[
    {tier:'S', items: names.slice(0,4).map(n=>({name:n}))},
    {tier:'A', items: names.slice(4,10).map(n=>({name:n}))},
    {tier:'B', items: names.slice(10,18).map(n=>({name:n}))},
    {tier:'C', items: names.slice(18).map(n=>({name:n}))}
  ];
  render();
}).catch(()=>{ if(board) board.innerHTML='<p class="empty">—</p>'; });
setupLanguage(render);
