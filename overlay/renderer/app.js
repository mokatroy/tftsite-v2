const listRoot = document.querySelector('#comp-list');
const detailRoot = document.querySelector('#comp-detail');
const searchInput = document.querySelector('#comp-search');
let comps = [];
let selectedSlug = localStorage.getItem('moka-overlay-comp') || '';

const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[char]));
const nameOf = (value) => typeof value === 'string' ? value : (value?.ar || value?.en || '');
const localized = (value) => typeof value === 'string' ? value : (value?.ar || value?.en || '');

function renderTabs() {
  const term = searchInput.value.trim().toLowerCase();
  const visible = comps.filter((comp) => {
    const text = [localized(comp.name), localized(comp.summary), ...(comp.units || []).map(nameOf)].join(' ').toLowerCase();
    return text.includes(term);
  });

  listRoot.innerHTML = visible.map((comp) => `<button class="comp-tab ${comp.slug === selectedSlug ? 'active' : ''}" data-slug="${escapeHtml(comp.slug)}">${escapeHtml(localized(comp.name))}</button>`).join('');

  listRoot.querySelectorAll('[data-slug]').forEach((button) => {
    button.addEventListener('click', () => {
      selectedSlug = button.dataset.slug;
      localStorage.setItem('moka-overlay-comp', selectedSlug);
      render();
    });
  });
}

function renderDetail() {
  const comp = comps.find((item) => item.slug === selectedSlug) || comps[0];
  if (!comp) {
    detailRoot.innerHTML = '<div class="loading">تعذر تحميل البيانات. تأكد من اتصال الإنترنت ثم أعد فتح التطبيق.</div>';
    return;
  }
  selectedSlug = comp.slug;
  const traits = (comp.traits || []).map((trait) => `<span class="chip">${escapeHtml(nameOf(trait.name || trait))}${trait.count ? ' ' + trait.count : ''}</span>`).join('');
  const items = (comp.items || comp.coreItems || []).map((item) => `<span class="chip">${escapeHtml(nameOf(item.name || item))}</span>`).join('');
  const units = (comp.units || []).map((unit) => `<div class="unit">${escapeHtml(nameOf(unit.name || unit))}</div>`).join('');

  detailRoot.innerHTML = `
    <p class="eyebrow"><span class="tier">${escapeHtml(comp.tier || 'A')}</span> ${escapeHtml(localized(comp.style) || 'TFT Comp')}</p>
    <h1 class="comp-name">${escapeHtml(localized(comp.name))}</h1>
    <p class="summary">${escapeHtml(localized(comp.summary) || '')}</p>
    <section class="section"><h2>الوحدات النهائية</h2><div class="units">${units}</div></section>
    ${traits ? `<section class="section"><h2>Traits</h2><div class="chips">${traits}</div></section>` : ''}
    ${items ? `<section class="section"><h2>Core Items</h2><div class="chips">${items}</div></section>` : ''}
    ${comp.guide ? `<section class="section"><h2>طريقة اللعب</h2><p class="guide">${escapeHtml(localized(comp.guide))}</p></section>` : ''}
  `;
}

function render() {
  renderTabs();
  renderDetail();
}

document.querySelector('#hide').addEventListener('click', () => window.mokaOverlay.hide());
document.querySelector('#minimize').addEventListener('click', () => window.mokaOverlay.minimize());
searchInput.addEventListener('input', renderTabs);

window.mokaOverlay.loadComps()
  .then((data) => {
    comps = data;
    render();
  })
  .catch(() => renderDetail());