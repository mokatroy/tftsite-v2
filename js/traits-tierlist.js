import {setupLanguage,lang,t} from './i18n.js';

const board = document.querySelector('#tier-board');
const search = document.querySelector('#tier-search');

// Set 18 trait meta tiers (18.3b)
const tiers = [
  {
    tier: 'S',
    items: [
      {name: 'Riftbeast', note: '3/5/7/10 — core vertical'},
      {name: 'Primal', note: 'Strong dual carries'},
      {name: 'Arcanist', note: 'AP scaling'}
    ]
  },
  {
    tier: 'A',
    items: [
      {name: 'Blackthorn', note: 'Sacrifice power'},
      {name: 'Invoker', note: 'Mana support'},
      {name: 'Warden', note: 'Frontline'},
      {name: 'Rapidfire', note: 'Attack speed'},
      {name: 'Juggernaut', note: 'Durable front'},
      {name: 'Elderwood', note: 'Scaling tanks'}
    ]
  },
  {
    tier: 'B',
    items: [
      {name: 'Inferno', note: 'Burn / execute'},
      {name: 'Blossom', note: 'Support utility'},
      {name: 'Hunter', note: 'Execute'},
      {name: 'Brawler', note: 'HP stacking'},
      {name: 'Defender', note: 'Armor / MR'},
      {name: 'Spellweaver', note: 'AP support'},
      {name: 'Vanguard', note: 'Frontline'}
    ]
  },
  {
    tier: 'C',
    items: [
      {name: 'Ravager', note: 'Niche'},
      {name: 'Coven', note: 'Situational'},
      {name: 'Solar', note: 'Niche'},
      {name: 'Fae', note: 'Flex'},
      {name: 'Sprykin', note: 'Early'},
      {name: 'Adaptor', note: 'Situational'},
      {name: 'Summoner', note: 'Niche'}
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
      <div class="tier-items">${items.map(it=>`
        <span class="tier-entry trait-entry">
          <span class="item-name">${it.name}</span>
          ${it.note ? `<span class="item-note">${it.note}</span>` : ''}
        </span>`).join('')}
      </div>
    </div>`;
  }).join('') || `<p class="empty">${t('notFound')}</p>`;
}

if(search) search.addEventListener('input', render);
render();
setupLanguage(render);
