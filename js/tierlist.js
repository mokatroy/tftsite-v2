import {setupLanguage,lang} from './i18n.js';
const board=document.querySelector('#tier-board');
const search=document.querySelector('#tier-search');
const tiers=[
  {tier:'S', items:['Infinity Edge','Spear of Shojin','Guinsoo\'s Rageblade','Hand of Justice','Bloodthirster']},
  {tier:'A', items:['Titan\'s Resolve','Jeweled Gauntlet','Rabadon\'s Deathcap','Gargoyle Stoneplate','Dragon\'s Claw','Last Whisper']},
  {tier:'B', items:['Bramble Vest','Sunfire Cape','Morellonomicon','Crownguard','Steadfast Heart','Giant Slayer']},
  {tier:'C', items:['Negatron Cloak','Recurve Bow','Tear of the Goddess','Chain Vest']}
];
function render(){
  if(!board) return;
  const q=(search&&search.value||'').trim().toLowerCase();
  board.innerHTML=tiers.map(row=>{
    const items=row.items.filter(n=>!q||n.toLowerCase().includes(q));
    if(!items.length&&q) return '';
    return `<div class="tier-row tier-${row.tier.toLowerCase()}"><div class="tier-label">${row.tier}</div><div class="tier-items">${items.map(n=>`<span class="tier-entry"><span>${n}</span></span>`).join('')}</div></div>`;
  }).join('');
}
if(search) search.addEventListener('input',render);
render();
setupLanguage(render);
