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


const ROLE_MAP = {
  tank: ['amumu','taric','sentinel','scuttlecrab','gromp','rakan','krug','ornn','alistar','sejuani','shen','leona','kobuko','ivern','maokai','lillia','rammus','yorick','willump'],
  ap: ['alune','veigar','azir','cassiopeia','ahri','morgana','pebbles','elise','diana','leblanc','karma','kayle','teemo','lux','kennen','zyra','soraka','fiddlesticks'],
  ad: ['xayah','ezreal','aphelios','sivir','ashe','draven','caitlyn','yunara','nidalee','khazix','cinderling','mamabeak','varus','tristana','kogmaw','camille','akali'],
  flex: ['warwick','masteryi','gnar','brambleback','murkwolf','hecarim','sett','rengar','vi','reksai']
};
const CHAMP_ALIAS = {
  pebbles: 'pebbles', 'mama beak': 'mamabeak', mamabeak: 'mamabeak',
  scuttlecrab: 'scuttlecrab', cinderling: 'cinderling', brambleback: 'brambleback',
  gromp: 'gromp', krug: 'krug', sentinel: 'sentinel', ancientsentinel: 'sentinel',
  "kha'zix": 'khazix', "rek'sai": 'reksai', "kog'maw": 'kogmaw', 'master yi': 'masteryi',
  leblanc: 'leblanc'
};

function roleKey(name) {
  const n = String(name || '').toLowerCase().trim();
  return CHAMP_ALIAS[n] || n.replace(/['']/g, '').replace(/\s+/g, '');
}

function roleOf(name) {
  const k = roleKey(name);
  for (const [role, list] of Object.entries(ROLE_MAP)) {
    if (list.includes(k)) return role;
  }
  return 'flex';
}

function isBackline(name) {
  const role = roleOf(name);
  return role === 'ad' || role === 'ap';
}

/** Same placement rules as the website (js/ui-core autoPositions). */
function buildPositions(comp) {
  const explicit = comp.positions && Object.keys(comp.positions).length ? comp.positions : null;
  if (explicit) return explicit;

  const units = (comp.units || []).map(unitName).filter(Boolean);
  const front = [];
  const back = [];
  for (const n of units) {
    if (isBackline(n)) back.push(n);
    else front.push(n);
  }
  while (back.length > 4 && front.length < 4) front.push(back.pop());

  const primary = back[0] || null;
  const pos = {};
  // TFT 7-wide: row 0 = enemy side / frontline, row 3 = player backline
  const frontSlots = [[0,1],[0,2],[0,3],[0,4],[1,0],[1,1],[1,2],[1,3],[1,4],[1,5]];
  const backSlots = [[3,0],[3,6],[3,1],[3,5],[2,0],[2,6],[2,1],[2,5],[3,2],[3,4]];

  let fi = 0;
  let bi = 0;
  const place = (name, slots, idx) => {
    if (!name || idx >= slots.length) return idx;
    const [r, c] = slots[idx];
    const carry = !!(primary && roleKey(name) === roleKey(primary));
    pos[r + ',' + c] = { name, carry };
    return idx + 1;
  };
  for (const t of front) fi = place(t, frontSlots, fi);
  for (const n of back) bi = place(n, backSlots, bi);
  return pos;
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

/* —— announcements + feedback —— */
const META_URLS = [
  'https://tftsite-v2.mokatroymonk.workers.dev/data/overlay_meta.json',
  'https://cdn.jsdelivr.net/gh/mokatroy/tftsite-v2@main/data/overlay_meta.json'
];
const announceBar = document.querySelector('#announce-bar');
const announceMessage = document.querySelector('#announce-message');
const announceDismiss = document.querySelector('#announce-dismiss');
const feedbackBtn = document.querySelector('#feedback-btn');
const feedbackModal = document.querySelector('#feedback-modal');
const feedbackText = document.querySelector('#feedback-text');
const feedbackStatus = document.querySelector('#feedback-status');
let metaConfig = {
  feedbackUrl: 'https://formsubmit.co/ajax/mokatroy@gmail.com',
  feedbackEmail: 'mokatroy@gmail.com',
  feedbackEndpoint: 'https://script.google.com/macros/s/AKfycbwVSs_43h8duhjUkFkiCQd22Sha1v4LQzdd_WY9CaOMKU7HUeDTwQWojpcehM5pVI8/exec',
  announcement: null
};

async function loadMeta() {
  for (const url of META_URLS) {
    try {
      const res = await fetch(url + (url.includes('?') ? '&' : '?') + 't=' + Date.now(), { cache: 'no-store' });
      if (!res.ok) continue;
      const data = await res.json();
      if (data) {
        metaConfig = { ...metaConfig, ...data };
        break;
      }
    } catch (_) {}
  }
  showAnnouncement();
}

function showAnnouncement() {
  const a = metaConfig.announcement;
  if (!a || !a.active || !a.ar) {
    announceBar.hidden = true;
    return;
  }
  const dismissed = localStorage.getItem('moka-overlay-announce-dismissed');
  if (dismissed && dismissed === String(a.id)) {
    announceBar.hidden = true;
    return;
  }
  announceBar.hidden = false;
  announceBar.classList.remove('warn', 'error', 'info');
  if (a.level) announceBar.classList.add(a.level);
  let html = escapeHtml(a.ar);
  if (a.link) {
    html += ' <a href="#" id="announce-link">المزيد</a>';
  }
  announceMessage.innerHTML = html;
  const link = document.querySelector('#announce-link');
  if (link && a.link) {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.mokaOverlay.openExternal(a.link);
    });
  }
}

announceDismiss?.addEventListener('click', () => {
  const id = metaConfig.announcement?.id;
  if (id) localStorage.setItem('moka-overlay-announce-dismissed', String(id));
  announceBar.hidden = true;
});

function openFeedbackModal() {
  feedbackModal.hidden = false;
  feedbackStatus.hidden = true;
  feedbackText.value = '';
  feedbackText.focus();
}
function closeFeedbackModal() {
  feedbackModal.hidden = true;
}

feedbackBtn?.addEventListener('click', openFeedbackModal);
document.querySelector('#feedback-close')?.addEventListener('click', closeFeedbackModal);
feedbackModal?.addEventListener('click', (e) => {
  if (e.target === feedbackModal) closeFeedbackModal();
});

document.querySelector('#feedback-copy')?.addEventListener('click', async () => {
  const text = feedbackText.value.trim();
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    feedbackStatus.hidden = false;
    feedbackStatus.textContent = 'تم نسخ النص';
  } catch (_) {
    feedbackStatus.hidden = false;
    feedbackStatus.textContent = 'تعذر النسخ — انسخ يدويًا';
  }
});

document.querySelector('#feedback-send')?.addEventListener('click', async () => {
  const text = feedbackText.value.trim();
  if (!text) {
    feedbackStatus.hidden = false;
    feedbackStatus.style.color = '#ffb4b4';
    feedbackStatus.textContent = 'اكتب الملاحظة أولاً';
    return;
  }
  const sendBtn = document.querySelector('#feedback-send');
  if (sendBtn) {
    sendBtn.disabled = true;
    sendBtn.textContent = 'جارٍ الإرسال…';
  }
  feedbackStatus.hidden = false;
  feedbackStatus.style.color = '#c8f2d8';
  feedbackStatus.textContent = 'جارٍ إرسال الرسالة مباشرة…';

  let version = '';
  try { version = await window.mokaOverlay.getVersion(); } catch (_) {}

  try {
    const result = await window.mokaOverlay.sendFeedback({
      message: text,
      version: version || '?',
      email: metaConfig.feedbackEmail || 'mokatroy@gmail.com',
      endpoint: metaConfig.feedbackEndpoint || ''
    });
    if (result && result.ok) {
      feedbackStatus.style.color = '#9be7b5';
      feedbackStatus.textContent = 'تم إرسال ملاحظتك بنجاح. شكرًا لك!';
      feedbackText.value = '';
    } else {
      throw new Error(result && result.error ? result.error : 'failed');
    }
  } catch (err) {
    feedbackStatus.style.color = '#ffb4b4';
    feedbackStatus.textContent = 'تعذر الإرسال الآن. استخدم «نسخ النص» وابعت يدويًا.';
    console.error(err);
  } finally {
    if (sendBtn) {
      sendBtn.disabled = false;
      sendBtn.textContent = 'إرسال';
    }
  }
});

loadMeta();



/* —— opacity + compact mode (safe) —— */
(function initOverlayChrome() {
  try {
    const shell = document.querySelector('.overlay-shell');
    const opacityRange = document.querySelector('#opacity-range');
    const opacityValue = document.querySelector('#opacity-value');
    const compactBtn = document.querySelector('#compact-toggle');
    if (!window.mokaOverlay) return;

    function applyOpacity(pct) {
      try {
        const value = Math.min(100, Math.max(35, Number(pct) || 100));
        if (opacityRange) opacityRange.value = String(value);
        if (opacityValue) opacityValue.textContent = value + '%';
        localStorage.setItem('moka-overlay-opacity', String(value));
        if (typeof window.mokaOverlay.setOpacity === 'function') {
          window.mokaOverlay.setOpacity(value / 100);
        }
      } catch (e) { console.error('opacity', e); }
    }

    function setCompact(on) {
      try {
        shell && shell.classList.toggle('compact', !!on);
        compactBtn && compactBtn.classList.toggle('active', !!on);
        if (compactBtn) compactBtn.textContent = on ? 'موسّع' : 'مضغوط';
        localStorage.setItem('moka-overlay-compact', on ? '1' : '0');
        document.querySelectorAll('.comp-detail .section').forEach((sec) => {
          sec.classList.toggle('compact-hide', !!(on && !sec.querySelector('.board')));
        });
      } catch (e) { console.error('compact', e); }
    }

    function toggleCompact() {
      setCompact(!(shell && shell.classList.contains('compact')));
    }

    opacityRange && opacityRange.addEventListener('input', () => applyOpacity(opacityRange.value));
    compactBtn && compactBtn.addEventListener('click', toggleCompact);
    if (typeof window.mokaOverlay.onCompactShortcut === 'function') {
      window.mokaOverlay.onCompactShortcut(() => toggleCompact());
    }

    // Default fully visible — never leave window invisible
    let saved = 100;
    try { saved = Number(localStorage.getItem('moka-overlay-opacity') || '100') || 100; } catch (_) {}
    if (saved < 35 || saved > 100) saved = 100;
    applyOpacity(saved);
    try { setCompact(localStorage.getItem('moka-overlay-compact') === '1'); } catch (_) {}

    const originalRenderDetail = typeof renderDetail === 'function' ? renderDetail : null;
    if (originalRenderDetail) {
      renderDetail = function () {
        originalRenderDetail.apply(this, arguments);
        try {
          if (shell && shell.classList.contains('compact')) {
            document.querySelectorAll('.comp-detail .section').forEach((sec) => {
              sec.classList.toggle('compact-hide', !sec.querySelector('.board'));
            });
          }
        } catch (_) {}
      };
    }
  } catch (e) {
    console.error('initOverlayChrome failed', e);
  }
})();
