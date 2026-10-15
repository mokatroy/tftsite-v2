const listRoot = document.querySelector('#comp-list');
const detailRoot = document.querySelector('#comp-detail');
const searchInput = document.querySelector('#comp-search');
let comps = [];
let selectedSlug = localStorage.getItem('moka-overlay-comp') || '';

const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[char]));
const nameOf = (value) => typeof value === 'string' ? value : (value?.ar || value?.en || '');
const localized = (value) => typeof value === 'string' ? value : (value?.ar || value?.en || '');

function unitName(unit) {
  return nameOf(unit?.name || unit);
}

const CHAMP_CDN = 'https://cdn.jsdelivr.net/gh/mokatroy/tftsite-v2@main/assets/champs/';
const CHAMP_SPECIAL = {
  pebbles: 'tft18_sentry', sentry: 'tft18_sentry', ancientsentinel: 'tft18_sentinel',
  krug: 'tft18_krug', cinderling: 'tft18_cinderling', scuttlecrab: 'tft18_scuttlecrab',
  gromp: 'tft18_gromp', brambleback: 'tft18_brambleback', murkwolf: 'tft18_murkwolf',
  mamabeak: 'tft18_raptor', 'mama beak': 'tft18_raptor', sentinel: 'tft18_sentinel',
  elderdragon: 'tft18_elderdragon', 'elder dragon': 'tft18_elderdragon',
  kobuko: 'tft18_kobuko', yunara: 'tft18_yunara', willump: 'tft18_willump', alune: 'tft18_alune',
  khazix: 'tft18_khazix', "kha'zix": 'tft18_khazix', reksai: 'tft18_reksai', "rek'sai": 'tft18_reksai',
  kogmaw: 'tft18_kogmaw', "kog'maw": 'tft18_kogmaw', masteryi: 'tft18_masteryi', 'master yi': 'tft18_masteryi',
  leblanc: 'tft18_leblanc', fiddlesticks: 'tft18_fiddlesticks'
};
const TFT18 = new Set(['akali','camille','cinderling','karma','kobuko','leona','ornn','pebbles','rakan','reksai','varus','veigar','xayah','yorick','alistar','caitlyn','elise','gromp','kayle','leblanc','murkwolf','scuttlecrab','sejuani','shen','teemo','warwick','yunara','azir','cassiopeia','diana','fiddlesticks','hecarim','khazix','kogmaw','krug','masteryi','rammus','mamabeak','rengar','tristana','vi','ahri','amumu','aphelios','brambleback','ezreal','lillia','malphite','morgana','nidalee','sett','sentinel','sivir','soraka','zyra','alune','ashe','draven','elderdragon','gnar','ivern','kennen','lux','maokai','taric','ancientsentinel','willump']);

function champImage(name) {
  const raw = String(name || '').trim();
  if (!raw) return '';
  const key = raw.toLowerCase().replace(/['']/g, '').replace(/\s+/g, '');
  const spaced = raw.toLowerCase();
  let id = CHAMP_SPECIAL[spaced] || CHAMP_SPECIAL[key] || '';
  if (!id && TFT18.has(key)) id = 'tft18_' + key;
  if (id) return CHAMP_CDN + id + '.png';
  const dd = { reksai: 'RekSai', khazix: 'Khazix', kogmaw: 'KogMaw', masteryi: 'MasterYi', leblanc: 'Leblanc', fiddlesticks: 'FiddleSticks' };
  const ddKey = dd[key] || raw.replace(/['']/g, '').replace(/\s+/g, '');
  return 'https://ddragon.leagueoflegends.com/cdn/15.1.1/img/champion/' + ddKey + '.png';
}

function champImgHtml(name, cls) {
  const src = champImage(name);
  const alt = escapeHtml(name);
  if (!src) return '<span class="' + cls + ' letter">' + escapeHtml((name || '?').slice(0, 2)) + '</span>';
  return '<img class="' + cls + '" src="' + src + '" alt="' + alt + '" loading="lazy" decoding="async" onerror="this.onerror=null;this.replaceWith(Object.assign(document.createElement(\'span\'),{className:\'' + cls + ' letter\',textContent:\'' + alt.slice(0, 2).replace(/'/g, '') + '\'}))">';
}


function isBackline(name) {
  return /ahri|alune|aphelios|ashe|azir|caitlyn|draven|ezreal|karma|leblanc|lux|morgana|sivir|soraka|tristana|veigar|xayah|zyra/i.test(name);
}

function buildPositions(comp) {
  const explicit = comp.positions && Object.keys(comp.positions).length ? comp.positions : null;
  if (explicit) return explicit;

  const front = [], back = [];
  (comp.units || []).map(unitName).filter(Boolean).forEach((name) => (isBackline(name) ? back : front).push(name));
  const slots = {};
  const frontSlots = [[0,1],[0,2],[0,3],[0,4],[1,1],[1,2],[1,3],[1,4]];
  const backSlots = [[3,1],[3,5],[3,2],[3,4],[2,1],[2,5],[2,2],[2,4]];
  front.forEach((name, index) => { if (frontSlots[index]) slots[frontSlots[index].join(',')] = { name, carry: false }; });
  back.forEach((name, index) => { if (backSlots[index]) slots[backSlots[index].join(',')] = { name, carry: index === 0 }; });
  return slots;
}

function renderBoard(comp) {
  const positions = buildPositions(comp);
  const rows = Array.from({ length: 4 }, (_, row) => {
    const cells = Array.from({ length: 7 }, (_, col) => {
      const entry = positions[row + ',' + col];
      if (!entry) return '<div class="board-cell"></div>';
      const name = typeof entry === 'string' ? entry : unitName(entry);
      const carry = typeof entry === 'object' && entry.carry;
      return '<div class="board-cell filled ' + (carry ? 'carry' : '') + '">' + champImgHtml(name, 'board-unit') + '<span class="board-name">' + escapeHtml(name) + '</span></div>';
    }).join('');
    return '<div class="board-row ' + (row % 2 ? 'offset' : '') + '">' + cells + '</div>';
  }).join('');
  return '<div class="board"><p class="board-label">↑ العدو / FRONTLINE</p>' + rows + '</div>';
}

function renderTabs() {
  const term = searchInput.value.trim().toLowerCase();
  const visible = comps.filter((comp) => {
    const text = [localized(comp.name), localized(comp.summary), ...(comp.units || []).map(unitName)].join(' ').toLowerCase();
    return text.includes(term);
  });
  listRoot.innerHTML = visible.map((comp) => '<button class="comp-tab ' + (comp.slug === selectedSlug ? 'active' : '') + '" data-slug="' + escapeHtml(comp.slug) + '">' + escapeHtml(localized(comp.name)) + '</button>').join('');
  listRoot.querySelectorAll('[data-slug]').forEach((button) => button.addEventListener('click', () => {
    selectedSlug = button.dataset.slug;
    localStorage.setItem('moka-overlay-comp', selectedSlug);
    render();
  }));
}

function renderStages(stages) {
  if (!stages?.length) return '';
  return '<section class="section"><h2>خطة المراحل</h2><div class="stages">' + stages.map((stage) => '<article class="stage"><strong>Stage ' + escapeHtml(stage.stage || '') + '</strong>' + escapeHtml(localized(stage.text || stage)) + '</article>').join('') + '</div></section>';
}

function renderDetail() {
  const comp = comps.find((item) => item.slug === selectedSlug) || comps[0];
  if (!comp) {
    detailRoot.innerHTML = '<div class="loading">تعذر تحميل البيانات. تأكد من اتصال الإنترنت ثم أعد فتح التطبيق.</div>';
    return;
  }
  selectedSlug = comp.slug;
  const traits = (comp.traits || []).map((trait) => '<span class="chip">' + escapeHtml(nameOf(trait.name || trait)) + (trait.count ? ' ' + trait.count : '') + '</span>').join('');
  const items = (comp.items || comp.coreItems || []).map((item) => '<span class="chip">' + escapeHtml(nameOf(item.name || item)) + '</span>').join('');
  const units = (comp.units || []).map((unit) => { const n = unitName(unit); return '<div class="unit">' + champImgHtml(n, 'unit-avatar') + '<span>' + escapeHtml(n) + '</span></div>'; }).join('');
  const early = (comp.earlyUnits || []).map((unit) => '<span class="chip">' + escapeHtml(unitName(unit)) + '</span>').join('');

  detailRoot.innerHTML = '<p class="eyebrow"><span class="tier">' + escapeHtml(comp.tier || 'A') + '</span> ' + escapeHtml(localized(comp.style) || 'TFT Comp') + '</p>' +
    '<h1 class="comp-name">' + escapeHtml(localized(comp.name)) + '</h1>' +
    '<p class="summary">' + escapeHtml(localized(comp.summary) || '') + '</p>' +
    '<section class="section"><h2>توزيع البورد</h2>' + renderBoard(comp) + '</section>' +
    '<section class="section"><h2>الوحدات النهائية</h2><div class="units">' + units + '</div></section>' +
    (traits ? '<section class="section"><h2>Traits</h2><div class="chips">' + traits + '</div></section>' : '') +
    (items ? '<section class="section"><h2>Core Items</h2><div class="chips">' + items + '</div></section>' : '') +
    (early ? '<section class="section"><h2>وحدات البداية</h2><div class="chips">' + early + '</div></section>' : '') +
    renderStages(comp.stages) +
    (comp.guide ? '<section class="section"><h2>طريقة اللعب</h2><p class="guide">' + escapeHtml(localized(comp.guide)) + '</p></section>' : '');
}

function render() {
  renderTabs();
  renderDetail();
}

document.querySelector('#hide').addEventListener('click', () => window.mokaOverlay.close());
document.querySelector('#minimize').addEventListener('click', () => window.mokaOverlay.minimize());
document.querySelector('#maximize').addEventListener('click', () => window.mokaOverlay.toggleMaximize());
window.mokaOverlay.onWindowState((state) => {
  const button = document.querySelector('#maximize');
  button.textContent = state.maximized ? '❐' : '□';
  button.title = state.maximized ? 'استعادة الحجم' : 'تكبير';
});
searchInput.addEventListener('input', renderTabs);

window.mokaOverlay.loadComps().then((data) => {
  comps = data;
  render();
}).catch(() => renderDetail());

const updateBar = document.querySelector('#update-bar');
const updateMessage = document.querySelector('#update-message');
const updateAction = document.querySelector('#update-action');
let updateActionMode = '';

function showUpdate(message, actionLabel = '', actionMode = '') {
  updateBar.hidden = false;
  updateMessage.textContent = message;
  updateActionMode = actionMode;
  updateAction.hidden = !actionLabel;
  updateAction.textContent = actionLabel;
}

window.mokaOverlay.onUpdate((update) => {
  if (update.state === 'checking') showUpdate('جارٍ البحث عن تحديثات…');
  if (update.state === 'available') showUpdate('يتوفر تحديث ' + update.version + ' — جارٍ التنزيل…');
  if (update.state === 'downloading') showUpdate('جارٍ تنزيل التحديث: ' + (update.percent || 0) + '%');
  if (update.state === 'ready') showUpdate('التحديث جاهز — جارٍ إعادة تشغيل البرنامج…');
  if (update.state === 'current') showUpdate('أنت على آخر إصدار');
  if (update.state === 'dev') showUpdate('وضع التطوير — التحديث يعمل فقط من النسخة المثبتة');
  if (update.state === 'error') showUpdate('تعذر التحقق من التحديث' + (update.message ? ': ' + update.message : ''));
});

const versionEl = document.querySelector('#app-version');
const checkBtn = document.querySelector('#check-update');
window.mokaOverlay.onVersion((info) => {
  if (versionEl) versionEl.textContent = 'v' + (info.version || '?');
});
if (checkBtn) checkBtn.addEventListener('click', () => window.mokaOverlay.checkForUpdates());

updateAction.addEventListener('click', () => {
  if (updateActionMode === 'download') window.mokaOverlay.downloadUpdate();
  if (updateActionMode === 'install') window.mokaOverlay.installUpdate();
});