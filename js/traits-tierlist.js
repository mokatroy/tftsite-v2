import {setupLanguage,lang,t} from './i18n.js';
import {traitImg} from './icons.js';

const board = document.querySelector('#tier-board');
const search = document.querySelector('#tier-search');

const tiers = [
  {
    tier: 'S',
    items: [
      {name: 'Riftbeast', note: '3/5/7/10 — core vertical'},
      {name: 'Primal', note: 'Strong dual carries'},
      {name: 'Spellweaver', note: 'AP scaling'}
    ]
  },
  {
    tier: 'A',
    items: [
      {name: 'Invoker', note: 'Mana support'},
      {name: 'Defender', note: 'Frontline'},
      {name: 'Rapidfire', note: 'Attack speed'},
      {name: 'Juggernaut', note: 'Durable front'},
      {name: 'Elderwood', note: 'Scaling tanks'},
      {name: 'Inferno', note: 'Burn / execute'}
    ]
  },
  {
    tier: 'B',
    items: [
      {name: 'Blossom', note: 'Support utility'},
      {name: 'Hunter', note: 'Execute'},
      {name: 'Brawler', note: 'HP stacking'},
      {name: 'Vanguard', note: 'Frontline'},
      {name: 'Fae', note: 'Flex'},
      {name: 'Sprykin', note: 'Early'}
    ]
  },
  {
    tier: 'C',
    items: [
      {name: 'Ravager', note: 'Niche'},
      {name: 'Coven', note: 'Situational'},
      {name: 'Solar', note: 'Niche'},
      {name: 'Adaptor', note: 'Situational'},
      {name: 'Summoner', note: 'Niche'},
      {name: 'Executioner', note: 'Niche'}
    ]
  }
];

function render(){
  if(!board) return;
  const q = (search && search.value || '').trim().toLowerCase();
  board.innerHTML = tiers.map(row=>{
    const items = row.items.filter(it=>!q || it.name.toLowerCase().includes(q) || (it.note||'').toLowerCase().includes(q));
    if(!items.length && q) return '';
    return `<div class="tier-row tier-${row.tier.toLowerCase()}">
      <div class="tier-label">${row.tier}</div>
      <div class="tier-items">${items.map(it=>{
        const img = traitImg(it.name);
        return `<span class="tier-entry trait-entry has-icon">
          <img class="trait-icon" src="${img}" alt="${it.name}" loading="lazy" onerror="this.style.display='none'">
          <span class="item-text"><span class="item-name">${it.name}</span>${it.note?`<span class="item-note">${it.note}</span>`:''}</span>
        </span>`;
      }).join('')}
      </div>
    </div>`;
  }).join('') || `<p class="empty">${t('notFound')}</p>`;
}

if(search) search.addEventListener('input', render);
render();
setupLanguage(render);
