import {lang,setupLanguage,t} from './locale.js';
import {augmentImg} from './icons.js';

const root = document.querySelector('#augments-root') || document.querySelector('#augments-board');
const search = document.querySelector('#augment-search') || document.querySelector('#tier-search');
const filters = document.querySelector('#rarity-filters');

let data = [];
let rarity = 'all';

function rarityKey(a){
  return String(a.rarity || a.tier || 'silver').toLowerCase();
}

function render(){
  if(!root) return;
  const q = (search && search.value || '').trim().toLowerCase();
  const groups = {prismatic:[], gold:[], silver:[]};
  for(const a of data){
    const r = rarityKey(a);
    const bucket = groups[r] ? r : 'silver';
    const name = (a.name && (a.name[lang] || a.name.en || a.name)) || a.name || '';
    const desc = (a.description && (a.description[lang] || a.description.en || a.description)) || a.desc || '';
    if(q && !String(name).toLowerCase().includes(q) && !String(desc).toLowerCase().includes(q)) continue;
    if(rarity !== 'all' && bucket !== rarity) continue;
    groups[bucket].push({name, desc, rarity: bucket, raw: a});
  }
  const order = ['prismatic','gold','silver'];
  root.innerHTML = order.map(r=>{
    const list = groups[r];
    if(!list.length) return '';
    const label = t(r) || r;
    return `<section class="augment-tier augment-${r}">
      <header class="augment-tier-head"><span>${label}</span><span>${list.length}</span></header>
      <div class="augment-grid">${list.map(a=>{
        const img = augmentImg(a.name);
        return `<article class="augment-card">
          <span class="aug-rarity">${a.rarity}</span>
          ${img?`<img src="${img}" alt="" loading="lazy" onerror="this.style.display='none'">`:''}
          <h3>${a.name}</h3>
          <p>${a.desc}</p>
        </article>`;
      }).join('')}</div>
    </section>`;
  }).join('') || `<p class="empty">${t('notFound')}</p>`;
}

if(search) search.addEventListener('input', render);
if(filters){
  filters.addEventListener('click', e=>{
    const btn = e.target.closest('[data-rarity]');
    if(!btn) return;
    rarity = btn.dataset.rarity;
    filters.querySelectorAll('[data-rarity]').forEach(b=>b.classList.toggle('active', b===btn));
    render();
  });
}

fetch('data/augments.json').then(r=>r.json()).then(xs=>{
  data = Array.isArray(xs) ? xs : (xs.augments || []);
  render();
}).catch(()=>{ if(root) root.innerHTML = `<p class="empty">—</p>`; });

setupLanguage(render);
