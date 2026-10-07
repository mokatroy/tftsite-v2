import {setupLanguage,localize,t,lang} from './locale.js?v=20261007champs';
import {itemChip,traitChip} from './ui.js?v=20261007champs';

function champAvatar(name){
  const raw=String(name||'').trim();
  if(!raw) return '';
  const n=raw.toLowerCase().replace(/['']/g,'').replace(/\s+/g,'');
  const special={
    pebbles:'tft18_sentry',
    sentry:'tft18_sentry',
    krug:'tft18_krug',
    cinderling:'tft18_cinderling',
    scuttlecrab:'tft18_scuttlecrab',
    gromp:'tft18_gromp',
    brambleback:'tft18_brambleback',
    murkwolf:'tft18_murkwolf',
    mamabeak:'tft18_raptor',
    sentinel:'tft18_sentinel',
    ancientsentinel:'tft18_sentinel',
    elderdragon:'tft18_elderdragon',
    kobuko:'tft18_kobuko',
    yunara:'tft18_yunara',
    willump:'tft18_willump',
    alune:'tft18_alune'
  };
  let id=special[n]||'';
  const tft18Champs=new Set([
    'akali','camille','cinderling','karma','kobuko','leona','ornn','pebbles','rakan','reksai',
    'varus','veigar','xayah','yorick','alistar','caitlyn','elise','gromp','kayle','leblanc',
    'murkwolf','scuttlecrab','sejuani','shen','teemo','warwick','yunara','azir','cassiopeia',
    'diana','fiddlesticks','hecarim','khazix','kogmaw','krug','masteryi','rammus','mamabeak',
    'rengar','tristana','vi','ahri','amumu','aphelios','brambleback','ezreal','lillia',
    'malphite','morgana','nidalee','sett','sentinel','sivir','soraka','zyra','alune','ashe',
    'draven','elderdragon','gnar','ivern','kennen','lux','maokai','taric','ancientsentinel'
  ]);
  if(!id && tft18Champs.has(n)) id='tft18_'+n;
  if(id) return 'assets/champs/'+id+'.png';
  const dd={reksai:'RekSai',khazix:'Khazix',kogmaw:'KogMaw',masteryi:'MasterYi',leblanc:'Leblanc',fiddlesticks:'FiddleSticks'};
  const key=dd[n]||raw.replace(/['']/g,'').replace(/\s+/g,'');
  return 'https://ddragon.leagueoflegends.com/cdn/15.1.1/img/champion/'+key+'.png';
}

const grid = document.querySelector('#champ-grid') || document.querySelector('#champ-list');
(function ensureCostFilters(){
  let el = document.querySelector('#cost-filters');
  if(!el){
    const toolbar = document.querySelector('.champ-toolbar');
    if(toolbar){
      el = document.createElement('div');
      el.id = 'cost-filters';
      el.className = 'filter-pills';
      toolbar.appendChild(el);
    }
  }
})();
const search = document.querySelector('#champ-search');
const costFilters = () => document.querySelector('#cost-filters');
let champions = [], query = '', cost = 'all';

function costClass(c){ return `cost-${Math.min(5,Math.max(1,Number(c)||1))}`; }

function renderFilters(){
  const cf = costFilters(); if(!cf) return;
  const costs = ['all',1,2,3,4,5];
  cf.innerHTML = costs.map(c=>{
    const label = c==='all' ? (lang==='ar'?'الكل':lang==='ja'?'すべて':'All') : `${c}\u00a2`;
    return `<button class="${cost===String(c)?'active':''}" data-cost="${c}">${label}</button>`;
  }).join('');
  cf.querySelectorAll('[data-cost]').forEach(b=>{
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

  list.sort((a,b)=>(a.cost||0)-(b.cost||0) || (a.name?.en||'').localeCompare(b.name?.en||''));

  grid.innerHTML = list.length ? list.map(c=>{
    const enName = c.name?.en || '';
    const name = localize(c.name) || enName;
    const img = champAvatar(enName || name);
    const traits = (c.traits||[]).map(tr=>traitChip(tr)).join('');
    const abilityName = c.ability?.name || '';
    const abilityText = localize(c.ability) || c.ability?.en || c.ability?.ar || '';
    const items = (c.bestItems||[]).slice(0,3).map(it=>{
      const iname = typeof it === 'string' ? it : (it.name||'');
      return itemChip(iname);
    }).join('');

    return `<article class="champ-card ${costClass(c.cost)}" data-unit="${enName}">
      <div class="champ-card-head">
        <img class="champ-avatar" src="${img}" alt="${name}" loading="lazy" decoding="async" data-unit="${enName}" onerror="if(!this.dataset.fb&&this.src.includes('assets/champs/')){this.dataset.fb=1;const id=this.src.split('/').pop().replace('.png','');this.src=id==='tft18_raptor'?'https://raw.communitydragon.org/latest/game/assets/characters/tft18_raptor/hud/tft18_raptor_square.png':'https://raw.communitydragon.org/latest/game/assets/characters/'+id+'/'+id+'_square.png';}else{this.style.opacity=.3}">
        <div class="champ-meta">
          <span class="cost-badge ${costClass(c.cost)}">${c.cost||'?'}\u00a2</span>
          <h3 data-unit="${enName}">${name}</h3>
          <div class="unit-list">${traits}</div>
        </div>
      </div>
      ${abilityText ? `<div class="champ-ability"><strong>${abilityName}</strong><p>${abilityText}</p></div>` : ''}
      ${items ? `<div class="champ-items"><span class="items-label">BiS</span><div class="item-list">${items}</div></div>` : ''}
    </article>`;
  }).join('') : `<p class="empty">${t('notFound')}</p>`;
}

if(search) search.addEventListener('input', e=>{ query = e.target.value; render(); });

const CDN='https://cdn.jsdelivr.net/gh/mokatroy/tftsite-v2@14a2ca5/data';
function loadChamps(){
  return fetch('data/v2_champions.json').then(async r=>{
    if(!r.ok) throw new Error('local');
    const d=await r.json();
    if(Array.isArray(d)&&d.length===0) throw new Error('empty');
    return d;
  }).catch(()=>fetch(CDN+'/v2_champions.json').then(r=>r.json()));
}

loadChamps().then(d=>{
  champions = d.champions || d || [];
  renderFilters();
  render();
}).catch(()=>{ if(grid) grid.innerHTML = '<p class="empty">—</p>'; });

setupLanguage(()=>{ renderFilters(); render(); });
