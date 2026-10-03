import {lang,setupLanguage,t} from './locale.js';
import {augmentImg} from './icons.js';

const grid = document.querySelector('#augments-board');
const search = document.querySelector('#augment-search');
let entries = [], rarity = 'all';

const esc = v => String(v).replace(/[&<>"']/g, m => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[m]));

function renderFilters(){
  let filtersEl = document.querySelector('#augment-filters');
  if(!filtersEl){
    const toolbar = document.querySelector('.augment-toolbar');
    if(toolbar){
      filtersEl = document.createElement('div');
      filtersEl.id = 'augment-filters';
      filtersEl.className = 'filter-pills';
      toolbar.appendChild(filtersEl);
    }
  }
  if(!filtersEl) return;
  const rarities = ['all','Silver','Gold','Prismatic'];
  filtersEl.innerHTML = rarities.map(r=>{
    const label = r==='all' ? (lang==='ar'?'الكل':lang==='ja'?'すべて':'All') : (t(r.toLowerCase())||r);
    return `<button class="${rarity===r?'active':''}" data-rarity="${r}">${label}</button>`;
  }).join('');
  filtersEl.querySelectorAll('[data-rarity]').forEach(b=>{
    b.onclick = ()=>{ rarity = b.dataset.rarity; renderFilters(); render(); };
  });
}

function render(){
  if(!grid) return;
  const q = (search && search.value || '').trim().toLowerCase();
  const filtered = entries.filter(a=>{
    const matchR = rarity==='all' || a.rarity===rarity;
    const matchQ = !q || a.name.toLowerCase().includes(q) || (a.description||'').toLowerCase().includes(q);
    return matchR && matchQ;
  });

  const order = ['Prismatic','Gold','Silver'];
  const groups = {};
  filtered.forEach(a=>{
    groups[a.rarity] = groups[a.rarity] || [];
    groups[a.rarity].push(a);
  });

  grid.innerHTML = filtered.length ? order.filter(r=>groups[r]?.length).map(r=>{
    const list = groups[r];
    return `<div class="augment-tier">
      <div class="augment-tier-head rarity-${r.toLowerCase()}">${r} · ${list.length}</div>
      <div class="augment-tier-body">
        ${list.map(a=>{
          const img = augmentImg(a.name);
          return `
          <article class="augment-card rarity-${a.rarity.toLowerCase()}">
            <div class="augment-card-top">
              <img class="augment-icon" src="${img}" alt="" loading="lazy" onerror="this.style.display='none'">
              <span class="augment-rarity">${esc(a.rarity)}</span>
            </div>
            <h3>${esc(a.name)}</h3>
            <p>${esc(a.description||'')}</p>
          </article>`;
        }).join('')}
      </div>
    </div>`;
  }).join('') : `<div class="empty">${t('notFound')}</div>`;
}

if(search) search.addEventListener('input', render);

setupLanguage(()=>{ renderFilters(); render(); });

fetch('data/augments.json')
  .then(r=>{ if(!r.ok) throw new Error('load'); return r.json(); })
  .then(d=>{
    entries = d.entries || [];
    renderFilters();
    render();
  })
  .catch(()=>{
    if(grid) grid.innerHTML = `<div class="empty">${lang==='ar'?'تعذر تحميل بيانات الأوجمنتس.':'Could not load augment data.'}</div>`;
  });
