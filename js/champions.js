import {setupLanguage,localize,t,lang} from './i18n.js';
import {champImg,unitChip} from './ui.js';

const grid = document.querySelector('#champ-grid');
const search = document.querySelector('#champ-search');
const costFilters = document.querySelector('#cost-filters');
let champions = [], query = '', cost = 'all';

function costClass(c){ return `cost-${Math.min(5,Math.max(1,Number(c)||1))}`; }

function renderFilters(){
  if(!costFilters) return;
  const costs = ['all',1,2,3,4,5];
  costFilters.innerHTML = costs.map(c=>{
    const label = c==='all' ? (lang==='ar'?'الكل':lang==='ja'?'すべて':'All') : `${c}¢`;
    return `<button class="${cost===String(c)?'active':''}" data-cost="${c}">${label}</button>`;
  }).join('');
  costFilters.querySelectorAll('[data-cost]').forEach(b=>{
    b.onclick = ()=>{ cost = b.dataset.cost; render(); renderFilters(); };
  });
}

function render(){
  if(!grid) return;
  const q = query.toLowerCase();
  const list = champions.filter(c=>{
    const matchCost = cost==='all' || String(c.cost)===cost;
    const n = (c.name?.en||'') + (c.name?.ar||'') + (c.name?.ja||'');
    const traits = (c.traits||[]).map(t=>t.name||t).join(' ');
    const matchQ = !q || n.toLowerCase().includes(q) || traits.toLowerCase().includes(q);
    return matchCost && matchQ;
  });

  // sort by cost then name
  list.sort((a,b)=>(a.cost||0)-(b.cost||0) || (a.name?.en||'').localeCompare(b.name?.en||''));

  grid.innerHTML = list.length ? list.map(c=>{
    const name = localize(c.name) || c.name?.en || '';
    const img = champImg(c.name?.en || name);
    const traits = (c.traits||[]).map(tr=>`<span class="unit-chip trait">${tr.name||tr}</span>`).join('');
    const abilityName = c.ability?.name || '';
    const abilityText = localize(c.ability) || c.ability?.en || c.ability?.ar || '';
    const items = (c.bestItems||[]).slice(0,3).map(it=>{
      const iname = typeof it === 'string' ? it : (it.name||'');
      return `<span class="item-chip">${iname}</span>`;
    }).join('');

    return `<article class="champ-card ${costClass(c.cost)}">
      <div class="champ-card-head">
        <img class="champ-avatar" src="${img}" alt="${name}" loading="lazy" onerror="this.style.opacity=.3">
        <div class="champ-meta">
          <span class="cost-badge ${costClass(c.cost)}">${c.cost||'?'}¢</span>
          <h3>${name}</h3>
          <div class="unit-list">${traits}</div>
        </div>
      </div>
      ${abilityText ? `<div class="champ-ability"><strong>${abilityName}</strong><p>${abilityText}</p></div>` : ''}
      ${items ? `<div class="champ-items"><span class="items-label">BiS</span><div class="item-list">${items}</div></div>` : ''}
    </article>`;
  }).join('') : `<p class="empty">${t('notFound')}</p>`;
}

if(search) search.addEventListener('input', e=>{ query = e.target.value; render(); });

Promise.all([
  fetch('data/v2_champions.json').then(r=>r.ok?r.json():fetch('data/champions.json').then(x=>x.json()))
]).then(([d])=>{
  champions = d.champions || d || [];
  renderFilters();
  render();
}).catch(()=>{ if(grid) grid.innerHTML = '<p class="empty">—</p>'; });

setupLanguage(()=>{ renderFilters(); render(); });
