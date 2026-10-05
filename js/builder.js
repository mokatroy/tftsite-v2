/**
 * Team Builder — fully standalone (no shared app modules).
 * Only reads data/v2_champions.json for the champion pool.
 */

const ROWS = 4;
const COLS = 7;
const MAX_UNITS = 10;

const i18n = {
  ar: {
    title: 'باني الفريق',
    sub: 'اختار تشامبيونز وحطهم على البورد — التريتس تتعدّ تلقائيًا',
    traits: 'التريتس',
    traitsEmpty: 'حط تشامبيونز عشان تظهر التريتس',
    clear: 'مسح البورد',
    hint: 'اضغط على خانة فاضية بعد ما تختار تشامبيون من تحت',
    search: 'بحث…',
    all: 'الكل'
  },
  en: {
    title: 'Team Builder',
    sub: 'Pick champions and place them on the board — traits update live',
    traits: 'Traits',
    traitsEmpty: 'Place champions to see traits',
    clear: 'Clear board',
    hint: 'Select a champion below, then click an empty hex',
    search: 'Search…',
    all: 'All'
  }
};

let lang = (localStorage.getItem('tft-lang') === 'en') ? 'en' : 'ar';
let champions = [];
/** @type {Record<string, {name:string, cost:number, traits:string[]}|null>} */
let board = {};
let selectedChamp = null;
let costFilter = 'all';
let searchQ = '';

function t(key){ return (i18n[lang] || i18n.ar)[key] || key; }

function champKey(name){
  return String(name||'').toLowerCase().replace(/['']/g,'').replace(/\s+/g,'');
}

function champImg(name){
  const n = champKey(name);
  const special = {
    pebbles:'tft18_sentry', sentry:'tft18_sentry',
    krug:'tft18_krug', cinderling:'tft18_cinderling',
    scuttlecrab:'tft18_scuttlecrab', gromp:'tft18_gromp',
    brambleback:'tft18_brambleback', murkwolf:'tft18_murkwolf',
    mamabeak:'tft18_raptor', sentinel:'tft18_sentinel',
    ancientsentinel:'tft18_sentinel', elderdragon:'tft18_elderdragon',
    kobuko:'tft18_kobuko', yunara:'tft18_yunara', alune:'tft18_alune'
  };
  if(special[n]){
    const id = special[n];
    if(id === 'tft18_raptor')
      return 'https://raw.communitydragon.org/latest/game/assets/characters/tft18_raptor/hud/tft18_raptor_square.png';
    return `https://raw.communitydragon.org/latest/game/assets/characters/${id}/${id}_square.png`;
  }
  const id = 'tft18_' + n;
  return `https://raw.communitydragon.org/latest/game/assets/characters/${id}/${id}_square.png`;
}

function unitCount(){
  return Object.values(board).filter(Boolean).length;
}

function unitsOnBoard(){
  return Object.values(board).filter(Boolean);
}

function namesOnBoard(){
  return new Set(unitsOnBoard().map(u => champKey(u.name)));
}

function traitCounts(){
  const counts = {};
  for(const u of unitsOnBoard()){
    for(const tr of (u.traits || [])){
      const name = typeof tr === 'string' ? tr : (tr.name || '');
      if(!name) continue;
      counts[name] = (counts[name] || 0) + 1;
    }
  }
  return Object.entries(counts).sort((a,b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

function applyLang(){
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  const title = document.getElementById('builder-title');
  const sub = document.getElementById('builder-sub');
  const traitsH = document.getElementById('traits-heading');
  const clearBtn = document.getElementById('btn-clear');
  const hint = document.getElementById('builder-hint');
  const search = document.getElementById('pool-search');
  const langBtn = document.getElementById('builder-lang');
  if(title) title.textContent = t('title');
  if(sub) sub.textContent = t('sub');
  if(traitsH) traitsH.textContent = t('traits');
  if(clearBtn) clearBtn.textContent = t('clear');
  if(hint) hint.textContent = t('hint');
  if(search) search.placeholder = t('search');
  if(langBtn) langBtn.textContent = lang === 'ar' ? 'EN' : 'عر';
  renderCostTabs();
  renderTraits();
  renderPool();
}

function renderBoard(){
  const el = document.getElementById('board');
  if(!el) return;
  const rows = [];
  for(let r = 0; r < ROWS; r++){
    const cells = [];
    for(let c = 0; c < COLS; c++){
      const key = `${r},${c}`;
      const unit = board[key];
      if(unit){
        cells.push(`
          <div class="builder-hex filled" data-pos="${key}" title="${unit.name}">
            <div class="builder-hex-inner">
              <img src="${champImg(unit.name)}" alt="${unit.name}" loading="lazy">
            </div>
            <button type="button" class="hex-x" data-remove="${key}" aria-label="Remove">×</button>
          </div>`);
      } else {
        cells.push(`
          <div class="builder-hex empty" data-pos="${key}">
            <div class="builder-hex-inner"></div>
          </div>`);
      }
    }
    rows.push(`<div class="builder-row ${r % 2 === 1 ? 'offset' : ''}">${cells.join('')}</div>`);
  }
  el.innerHTML = rows.join('');

  const countEl = document.getElementById('unit-count');
  if(countEl) countEl.textContent = `${unitCount()} / ${MAX_UNITS}`;

  el.querySelectorAll('.builder-hex.empty').forEach(hex => {
    hex.addEventListener('click', () => {
      if(!selectedChamp) return;
      if(unitCount() >= MAX_UNITS) return;
      if(namesOnBoard().has(champKey(selectedChamp.name))) return;
      const pos = hex.dataset.pos;
      board[pos] = selectedChamp;
      selectedChamp = null;
      renderAll();
    });
  });

  el.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const pos = btn.getAttribute('data-remove');
      delete board[pos];
      renderAll();
    });
  });

  // click filled hex to remove
  el.querySelectorAll('.builder-hex.filled').forEach(hex => {
    hex.addEventListener('click', e => {
      if(e.target.closest('[data-remove]')) return;
      const pos = hex.dataset.pos;
      delete board[pos];
      renderAll();
    });
  });
}

function renderTraits(){
  const list = document.getElementById('traits-list');
  if(!list) return;
  const rows = traitCounts();
  if(!rows.length){
    list.innerHTML = `<p class="traits-empty">${t('traitsEmpty')}</p>`;
    return;
  }
  list.innerHTML = rows.map(([name, count]) => `
    <div class="trait-row ${count >= 2 ? 'active' : ''}">
      <span class="trait-name">${name}</span>
      <span class="trait-count">${count}</span>
    </div>`).join('');
}

function renderCostTabs(){
  const el = document.getElementById('cost-tabs');
  if(!el) return;
  const costs = ['all', 1, 2, 3, 4, 5];
  el.innerHTML = costs.map(c => {
    const label = c === 'all' ? t('all') : `${c}¢`;
    return `<button type="button" data-cost="${c}" class="${costFilter === String(c) ? 'active' : ''}">${label}</button>`;
  }).join('');
  el.querySelectorAll('[data-cost]').forEach(btn => {
    btn.addEventListener('click', () => {
      costFilter = btn.dataset.cost;
      renderCostTabs();
      renderPool();
    });
  });
}

function renderPool(){
  const el = document.getElementById('pool-grid');
  if(!el) return;
  const onBoard = namesOnBoard();
  const q = searchQ.toLowerCase();
  let list = champions.slice();
  if(costFilter !== 'all') list = list.filter(c => String(c.cost) === costFilter);
  if(q){
    list = list.filter(c => {
      const n = (c.name?.en || '') + (c.name?.ar || '') + (c.name?.ja || '');
      return n.toLowerCase().includes(q);
    });
  }
  list.sort((a,b) => (a.cost||0) - (b.cost||0) || (a.name?.en||'').localeCompare(b.name?.en||''));

  el.innerHTML = list.map(c => {
    const en = c.name?.en || '';
    const display = lang === 'ar' ? (c.name?.ar || en) : en;
    const key = champKey(en);
    const sel = selectedChamp && champKey(selectedChamp.name) === key ? 'selected' : '';
    const on = onBoard.has(key) ? 'on-board' : '';
    return `<button type="button" class="pool-champ cost-${c.cost||1} ${sel} ${on}" data-champ="${en}">
      <img src="${champImg(en)}" alt="${display}" loading="lazy">
      <span>${display}</span>
    </button>`;
  }).join('');

  el.querySelectorAll('[data-champ]').forEach(btn => {
    btn.addEventListener('click', () => {
      const en = btn.dataset.champ;
      if(namesOnBoard().has(champKey(en))) return;
      const c = champions.find(x => (x.name?.en || '') === en);
      if(!c) return;
      const traits = (c.traits || []).map(tr => typeof tr === 'string' ? tr : (tr.name || '')).filter(Boolean);
      selectedChamp = { name: en, cost: c.cost || 1, traits };
      renderPool();
    });
  });
}

function renderAll(){
  renderBoard();
  renderTraits();
  renderPool();
}

function clearBoard(){
  board = {};
  selectedChamp = null;
  renderAll();
}

// Events
document.getElementById('btn-clear')?.addEventListener('click', clearBoard);
document.getElementById('builder-lang')?.addEventListener('click', () => {
  lang = lang === 'ar' ? 'en' : 'ar';
  localStorage.setItem('tft-lang', lang);
  applyLang();
});
document.getElementById('pool-search')?.addEventListener('input', e => {
  searchQ = e.target.value || '';
  renderPool();
});

// Load champions (local then CDN fallback)
const CDN = 'https://cdn.jsdelivr.net/gh/mokatroy/tftsite-v2@14a2ca5/data';
function loadChamps(){
  return fetch('data/v2_champions.json').then(async r => {
    if(!r.ok) throw new Error('local');
    const d = await r.json();
    const list = d.champions || d;
    if(!Array.isArray(list) || !list.length) throw new Error('empty');
    return list;
  }).catch(() => fetch(CDN + '/v2_champions.json').then(r => r.json()).then(d => d.champions || d || []));
}

loadChamps().then(list => {
  champions = Array.isArray(list) ? list : [];
  applyLang();
  renderAll();
}).catch(() => {
  const pool = document.getElementById('pool-grid');
  if(pool) pool.innerHTML = '<p class="traits-empty">—</p>';
});
