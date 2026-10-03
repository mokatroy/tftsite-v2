import {setupLanguage, lang, t} from './locale.js';
import {itemImg} from './ui.js';

const COMPONENTS = [
  'B.F. Sword',
  'Recurve Bow',
  'Needlessly Large Rod',
  'Tear of the Goddess',
  'Chain Vest',
  'Negatron Cloak',
  "Giant's Belt",
  'Sparring Gloves',
  'Spatula',
  'Frying Pan'
];

const RECIPES = {
  'b.f. sword|b.f. sword': 'Deathblade',
  'b.f. sword|recurve bow': 'Giant Slayer',
  'b.f. sword|needlessly large rod': 'Hextech Gunblade',
  'b.f. sword|tear of the goddess': 'Spear of Shojin',
  'b.f. sword|chain vest': 'Edge of Night',
  'b.f. sword|negatron cloak': 'Bloodthirster',
  "b.f. sword|giant's belt": "Sterak's Gage",
  'b.f. sword|sparring gloves': 'Infinity Edge',
  'b.f. sword|spatula': 'Fae Emblem',
  'b.f. sword|frying pan': 'Hunter Emblem',
  'recurve bow|recurve bow': 'Red Buff',
  'needlessly large rod|recurve bow': "Guinsoo's Rageblade",
  'recurve bow|tear of the goddess': 'Void Staff',
  'chain vest|recurve bow': "Titan's Resolve",
  'negatron cloak|recurve bow': "Kraken's Fury",
  "giant's belt|recurve bow": "Nashor's Tooth",
  'recurve bow|sparring gloves': 'Last Whisper',
  'recurve bow|spatula': 'Inferno Emblem',
  'frying pan|recurve bow': 'Rapidfire Emblem',
  'needlessly large rod|needlessly large rod': "Rabadon's Deathcap",
  'needlessly large rod|tear of the goddess': "Archangel's Staff",
  'chain vest|needlessly large rod': 'Crownguard',
  'needlessly large rod|negatron cloak': 'Ionic Spark',
  "giant's belt|needlessly large rod": 'Morellonomicon',
  'needlessly large rod|sparring gloves': 'Jeweled Gauntlet',
  'needlessly large rod|spatula': 'Blossom Emblem',
  'frying pan|needlessly large rod': 'Spellweaver Emblem',
  'tear of the goddess|tear of the goddess': 'Blue Buff',
  'chain vest|tear of the goddess': "Protector's Vow",
  'negatron cloak|tear of the goddess': 'Adaptive Helm',
  "giant's belt|tear of the goddess": 'Spirit Visage',
  'sparring gloves|tear of the goddess': 'Hand of Justice',
  'spatula|tear of the goddess': 'Lunar Emblem',
  'frying pan|tear of the goddess': 'Invoker Emblem',
  'chain vest|chain vest': 'Bramble Vest',
  'chain vest|negatron cloak': 'Gargoyle Stoneplate',
  "chain vest|giant's belt": 'Sunfire Cape',
  'chain vest|sparring gloves': 'Steadfast Heart',
  'chain vest|spatula': 'Elderwood Emblem',
  'chain vest|frying pan': 'Vanguard Emblem',
  'negatron cloak|negatron cloak': "Dragon's Claw",
  "giant's belt|negatron cloak": 'Evenshroud',
  'negatron cloak|sparring gloves': 'Quicksilver',
  'negatron cloak|spatula': 'Sprykin Emblem',
  'frying pan|negatron cloak': 'Ravager Emblem',
  "giant's belt|giant's belt": "Warmog's Armor",
  "giant's belt|sparring gloves": "Striker's Flail",
  "giant's belt|spatula": 'Blackthorn Emblem',
  "frying pan|giant's belt": 'Brawler Emblem',
  'sparring gloves|sparring gloves': "Thief's Gloves",
  'spatula|sparring gloves': 'Primal Emblem',
  'frying pan|sparring gloves': 'Executioner Emblem',
  'spatula|spatula': "Tactician's Crown",
  'frying pan|spatula': "Tactician's Cape",
  'frying pan|frying pan': "Tactician's Shield"
};

function norm(name) {
  return String(name || '').toLowerCase().trim();
}

function recipeKey(a, b) {
  const x = norm(a);
  const y = norm(b);
  return x < y ? `${x}|${y}` : `${y}|${x}`;
}

function combine(a, b) {
  if (!a || !b) return null;
  return RECIPES[recipeKey(a, b)] || null;
}

let slotA = null;
let slotB = null;

const ovenRoot = () => document.querySelector('#oven-root');
const resultEl = () => document.querySelector('#oven-result');
const slotsEl = () => document.querySelector('#oven-slots');
const componentsEl = () => document.querySelector('#oven-components');

function slotHtml(item, index) {
  const emptyLabel = t('ovenEmpty') || '—';
  if (!item) {
    return `<button type="button" class="oven-slot empty" data-slot="${index}" aria-label="Empty slot">
      <span class="oven-slot-plus">+</span>
      <span class="oven-slot-label">${emptyLabel}</span>
    </button>`;
  }
  const img = itemImg(item);
  return `<button type="button" class="oven-slot filled" data-slot="${index}" data-item="${item}">
    ${img ? `<img src="${img}" alt="${item}" loading="lazy" onerror="this.style.display='none'">` : ''}
    <span class="oven-slot-name">${item}</span>
  </button>`;
}

function resultHtml(name) {
  if (!name) {
    const hint = t('ovenHint') || 'اختر كومبوننتين عشان تشوف النتيجة';
    return `<div class="oven-result-empty">${hint}</div>`;
  }
  const img = itemImg(name);
  return `<div class="oven-result-card" data-item="${name}">
    ${img ? `<img class="oven-result-img" src="${img}" alt="${name}" loading="lazy" onerror="this.style.display='none'">` : ''}
    <div class="oven-result-meta">
      <span class="oven-result-label">${t('ovenResult') || 'النتيجة'}</span>
      <strong class="oven-result-name">${name}</strong>
    </div>
  </div>`;
}

function componentBtn(name) {
  const img = itemImg(name);
  const active = slotA === name || slotB === name;
  return `<button type="button" class="oven-comp${active ? ' active' : ''}" data-comp="${name}">
    ${img ? `<img src="${img}" alt="" loading="lazy" onerror="this.style.display='none'">` : ''}
    <span>${name}</span>
  </button>`;
}

function renderOven() {
  const root = ovenRoot();
  if (!root) return;
  if (slotsEl()) {
    slotsEl().innerHTML = slotHtml(slotA, 0) + `<span class="oven-plus">+</span>` + slotHtml(slotB, 1);
  }
  if (resultEl()) {
    const out = combine(slotA, slotB);
    resultEl().innerHTML = resultHtml(out);
  }
  if (componentsEl()) {
    componentsEl().innerHTML = COMPONENTS.map(componentBtn).join('');
  }
}

function pickComponent(name) {
  if (slotA === name) slotA = null;
  else if (slotB === name) slotB = null;
  else if (!slotA) slotA = name;
  else if (!slotB) slotB = name;
  else { slotA = name; slotB = null; }
  renderOven();
}

function clearSlot(index) {
  if (index === 0) slotA = null;
  else slotB = null;
  renderOven();
}

function clearAll() {
  slotA = null;
  slotB = null;
  renderOven();
}

function bindOven() {
  const root = ovenRoot();
  if (!root || root.dataset.bound) return;
  root.dataset.bound = '1';
  root.addEventListener('click', (e) => {
    const comp = e.target.closest('[data-comp]');
    if (comp) { pickComponent(comp.dataset.comp); return; }
    const slot = e.target.closest('.oven-slot');
    if (slot && slot.classList.contains('filled')) {
      clearSlot(Number(slot.dataset.slot));
      return;
    }
    if (e.target.closest('#oven-clear')) clearAll();
  });
}

function ensureOvenShell() {
  const root = ovenRoot();
  if (!root) return;
  if (root.querySelector('#oven-slots')) return;
  root.innerHTML = `
  <section class="oven-panel">
    <div class="oven-header">
      <div>
        <p class="eyebrow">${t('ovenTitle')||'الفرن'}</p>
        <h2>${t('ovenSubtitle')||'اختار كومبوننتين وشوف الأيتم'}</h2>
      </div>
      <button type="button" class="button ghost" id="oven-clear">${t('ovenClear')||'مسح'}</button>
    </div>
    <div class="oven-workspace">
      <div class="oven-left">
        <div id="oven-slots" class="oven-slots"></div>
        <div class="oven-result-wrap">
          <p class="oven-result-label">${t('ovenResult')||'النتيجة'}</p>
          <div id="oven-result" class="oven-result"></div>
        </div>
      </div>
      <div class="oven-right">
        <p class="oven-comp-label">${t('ovenComponents')||'الكومبوننتس'}</p>
        <div id="oven-components" class="oven-components"></div>
      </div>
    </div>
  </section>`;
}

function initOven() {
  ensureOvenShell();
  bindOven();
  renderOven();
  setupLanguage(() => { ensureOvenShell(); renderOven(); });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOven);
  } else {
    initOven();
  }
}
