import {setupLanguage,localize,t,localePath,lang} from './i18n.js';
import {champImg,unitChip,itemChip,renderBoard} from './ui.js';

const root = document.querySelector('#situational-root');
const params = new URLSearchParams(location.search);
const activeSlug = params.get('slug');
let list = [];

function guideText(g, key){
  if(!g) return '';
  if(g[lang] && g[lang][key]) return g[lang][key];
  if(g.en && g.en[key]) return g.en[key];
  if(typeof g[key] === 'string') return g[key];
  return '';
}

function renderDetail(c){
  if(!root || !c) return;
  const title = localize(c.title) || c.name || c.slug || '';
  const style = localize(c.style) || '';
  const note = localize(c.note) || '';
  const boardNames = c.guide?.board || [];
  const unitList = boardNames.map(n => ({name:{en:n}}));
  const boardChips = boardNames.map(n => unitChip(n, true)).join('');
  const earlyNames = c.guide?.early || [];
  const early = earlyNames.map(n => unitChip(n, true)).join('');
  const itemBlocks = (c.guide?.items || []).map(row => {
    const unit = row.unit || '';
    const items = (row.items || []).map(n => itemChip(n)).join('');
    return `<div class="sit-item-row"><span class="sit-unit">${unitChip(unit, true)}</span><div class="item-list">${items}</div></div>`;
  }).join('');
  const priority = (c.guide?.priority || []).map(n => itemChip(n)).join('');
  const augs = (c.augments || []).map(a => `<span>${a}</span>`).join('');
  const stages = (c.stages || []).map(st => {
    const text = localize(st.text) || '';
    return `<article class="stage"><strong>Stage ${st.stage || ''}</strong><p>${text}</p></article>`;
  }).join('');
  const position = guideText(c.guide, 'position');
  const flex = guideText(c.guide, 'flex');
  const alt = guideText(c.guide, 'alt');
  const how = guideText(c.guide, 'how');
  const boardHtml = renderBoard({units: unitList});

  root.innerHTML = `
    <a class="back-link" href="${localePath('comps.html')}#situational-section">← ${t('compsTitle') || 'Comps'}</a>
    <div class="detail-hero">
      <span class="situational-label">SITUATIONAL</span>
      ${c.requiredAugment ? `<span class="req-aug">${c.requiredAugment}</span>` : ''}
      <h1>${title}</h1>
      <p class="page-subtitle">${style}</p>
      <p class="guide">${note}</p>
    </div>

    ${boardHtml ? `<section class="detail-section"><h2>${t('units') || 'Board'}</h2>${boardHtml}</section>` : ''}

    <div class="detail-grid">
      <section class="detail-section">
        <h2>${t('units') || 'Units'}</h2>
        <div class="unit-list large">${boardChips}</div>
        ${early ? `<h3 class="subhead">Early</h3><div class="unit-list">${early}</div>` : ''}
      </section>
      <section class="detail-section">
        <h2>${t('items') || 'Items'}</h2>
        ${itemBlocks || '<p class="empty">—</p>'}
        ${priority ? `<h3 class="subhead">Priority</h3><div class="item-list">${priority}</div>` : ''}
      </section>
    </div>

    ${how ? `<section class="detail-section" style="margin-top:16px"><h2>${t('howToPlay') || 'How to play'}</h2><p class="guide">${how}</p></section>` : ''}
    ${stages ? `<section class="detail-section" style="margin-top:16px"><h2>Stages</h2><div class="stages">${stages}</div></section>` : ''}
    ${position ? `<section class="detail-section" style="margin-top:16px"><h2>Positioning</h2><p class="guide">${position}</p></section>` : ''}
    ${flex ? `<section class="detail-section" style="margin-top:16px"><h2>Flex</h2><p class="guide">${flex}</p></section>` : ''}
    ${alt ? `<section class="detail-section" style="margin-top:16px"><h2>Alternatives</h2><p class="guide">${alt}</p></section>` : ''}

    <section class="detail-section" style="margin-top:16px">
      <h2>Key Augments</h2>
      <div class="situational-augments">${augs}</div>
    </section>
  `;
}

function render(){
  if(!activeSlug){
    location.replace(localePath('comps.html') + '#situational-section');
    return;
  }
  const c = list.find(x => x.slug === activeSlug);
  if(c) renderDetail(c);
  else location.replace(localePath('comps.html') + '#situational-section');
}

Promise.all([
  fetch('data/v2_situational-comps.json?v=20261017human').then(r => r.ok ? r.json() : []).catch(() => []),
  fetch('data/v2_situational_extra.json?v=20261017human').then(r => r.ok ? r.json() : []).catch(() => [])
]).then(([base, extra]) => {
  const a = Array.isArray(base) ? base : [];
  const b = Array.isArray(extra) ? extra : [];
  const seen = new Set(a.map(x => x.slug));
  list = a.concat(b.filter(x => x && x.slug && !seen.has(x.slug)));
  render();
}).catch(() => {
  if(root) root.innerHTML = '<p class="empty">—</p>';
});

setupLanguage(render);
