import {setupLanguage,lang,t} from './i18n.js';
import {itemImg} from './ui.js';

const board = document.querySelector('#tier-board');
const search = document.querySelector('#tier-search');

const tiers = [
  {
    tier: 'S',
    items: [
      {name: 'Infinity Edge', note: 'AD carries'},
      {name: "Guinsoo's Rageblade", note: 'On-hit / Rapidfire'},
      {name: 'Spear of Shojin', note: 'Mana carries'},
      {name: 'Hand of Justice', note: 'Flexible carry'},
      {name: 'Bloodthirster', note: 'Sustain AD'},
      {name: "Rabadon's Deathcap", note: 'AP carries'}
    ]
  },
  {
    tier: 'A',
    items: [
      {name: "Titan's Resolve", note: 'Frontline / Bruiser'},
      {name: 'Jeweled Gauntlet', note: 'AP crit'},
      {name: 'Gargoyle Stoneplate', note: 'Tank'},
      {name: "Dragon's Claw", note: 'MR tank'},
      {name: 'Last Whisper', note: 'Armor shred'},
      {name: 'Edge of Night', note: 'Assassin / carry'},
      {name: 'Giant Slayer', note: 'vs tanks'},
      {name: 'Steadfast Heart', note: 'Frontline'}
    ]
  },
  {
    tier: 'B',
    items: [
      {name: 'Bramble Vest', note: 'vs AD'},
      {name: 'Sunfire Cape', note: 'Burn tank'},
      {name: 'Morellonomicon', note: 'Anti-heal AP'},
      {name: 'Crownguard', note: 'AP tank'},
      {name: 'Red Buff', note: 'Burn / wound'},
      {name: 'Quicksilver', note: 'CC immunity'},
      {name: 'Ionic Spark', note: 'vs AP'}
    ]
  },
  {
    tier: 'C',
    items: [
      {name: 'Negatron Cloak', note: 'Component'},
      {name: 'Recurve Bow', note: 'Component'},
      {name: 'Tear of the Goddess', note: 'Component'},
      {name: 'Chain Vest', note: 'Component'},
      {name: "Giant's Belt", note: 'Component'},
      {name: 'Sparring Gloves', note: 'Component'}
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
        const img = itemImg(it.name);
        return `<span class="tier-entry item-entry" data-item="${it.name}">
          ${img?`<img class="item-icon" src="${img}" alt="${it.name}" loading="lazy" onerror="this.style.display='none'">`:''}
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
