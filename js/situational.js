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

function renderList(){
  if(!root) return;
  root.innerHTML = `
    <p class="eyebrow">SET 18 · 18.3B</p>
    <h1 class="page-title">${t('situationalTitle')||'Situational'}</h1>
    <p class="page-subtitle">${lang==='ar'?'تشكيلات مشروطة بأوجمنت أو ظروف معينة — افتح الدليل الكامل.':lang==='ja'?'特定オーグメントや条件付きの構成。詳細ガイドを開いてください。':'Conditional comps that need specific augments or conditions — open the full guide.'}</p>
    <div class="situational-grid">
      ${list.map(c=>{
        const title = localize(c.title) || c.name || c.slug || '';
        const style = localize(c.style) || '';
        const note = localize(c.note) || '';
        const board = (c.guide?.board || []).slice(0,6);
        const units = board.map(n=>unitChip({name:{en:n}},true)).join('');
        const augs = (c.augments||[]).slice(0,4).map(a=>`<span>${a}</span>`).join('');
        const req = c.requiredAugment ? `<span class="req-aug">Requires: ${c.requiredAugment}</span>` : '';
        return `<article class="situational-card">
          <div class="situational-card-head">
            <div>
              <span class="situational-label">SITUATIONAL</span>
              ${req}
              <h3>${title}</h3>
              <p class="style-line">${style}</p>
            </div>
            <a class="situational-open" href="${localePath('situational.html')}?slug=${c.slug||''}">${t('situationalOpen')||'Open'} ↗</a>
          </div>
          <p class="situational-note">${note}</p>
          ${units?`<div class="unit-list">${units}</div>`:''}
          <div class="situational-augments">${augs}</div>
        </article>`;
      }).join('')}
    </div>`;
}

function renderDetail(c){
  if(!root || !c) return;
  const title = localize(c.title) || c.name || c.slug || '';
  const style = localize(c.style) || '';
  const note = localize(c.note) || '';
  const unitList = (c.guide?.board || []).map(n=>({name:{en:n}}));
  // attach items from guide.items onto units for the board
  (c.guide?.items||[]).forEach(block=>{
    const u = unitList.find(x=>x.name.en===block.unit);
    if(u) u.items = block.items;
  });
  const boardChips = unitList.map(u=>unitChip(u,true)).join('');
  const early = (c.guide?.early || []).map(n=>unitChip({name:{en:n}},true)).join('');
  const stages = (c.stages||[]).map(s=>{
    const txt = localize(s.text) || '';
    return `<div class="stage-row"><span class="stage-num">Stage ${s.stage}</span><p>${txt}</p></div>`;
  }).join('');
  const itemBlocks = (c.guide?.items || []).map(block=>{
    const unit = block.unit || '';
    const items = (block.items||[]).map(n=>itemChip(n,true)).join('');
    return `<div class="sit-item-row"><span class="sit-unit">${unit}</span><div class="item-list">${items}</div></div>`;
  }).join('');
  const priority = (c.guide?.priority||[]).map(n=>itemChip(n,true)).join('');
  const augs = (c.augments||[]).map(a=>`<span>${a}</span>`).join('');
  const position = guideText(c.guide, 'position');
  const flex = guideText(c.guide, 'flex');
  const alt = guideText(c.guide, 'alt');
  const boardHtml = renderBoard({units: unitList});

  root.innerHTML = `
    <a class="back-link" href="${localePath('situational.html')}">← ${t('situationalTitle')||'Situational'}</a>
    <div class="detail-hero">
      <span class="situational-label">SITUATIONAL</span>
      ${c.requiredAugment?`<span class="req-aug">Requires: ${c.requiredAugment}</span>`:''}
      <h1>${title}</h1>
      <p class="page-subtitle">${style}</p>
      <p class="guide">${note}</p>
    </div>

    ${boardHtml}

    <div class="detail-grid">
      <section class="detail-section">
        <h2>${t('units')}</h2>
        <div class="unit-list large">${boardChips}</div>
        ${early?`<h3 style="margin-top:16px;font-size:14px;color:var(--muted)">Early</h3><div class="unit-list">${early}</div>`:''}
      </section>
      <section class="detail-section">
        <h2>${t('items')}</h2>
        ${itemBlocks || '<p class="empty">—</p>'}
        ${priority?`<h3 style="margin-top:14px;font-size:14px;color:var(--muted)">Priority</h3><div class="item-list">${priority}</div>`:''}
      </section>
    </div>

    ${stages?`<section class="detail-section" style="margin-top:16px"><h2>Stages</h2><div class="stages">${stages}</div></section>`:''}

    ${position?`<section class="detail-section" style="margin-top:16px"><h2>Positioning notes</h2><p class="guide">${position}</p></section>`:''}
    ${flex?`<section class="detail-section" style="margin-top:16px"><h2>Flex</h2><p class="guide">${flex}</p></section>`:''}
    ${alt?`<section class="detail-section" style="margin-top:16px"><h2>Alternatives</h2><p class="guide">${alt}</p></section>`:''}

    <section class="detail-section" style="margin-top:16px">
      <h2>Key Augments</h2>
      <div class="situational-augments">${augs}</div>
    </section>
  `;
}

function render(){
  if(activeSlug){
    const c = list.find(x=>x.slug===activeSlug);
    if(c) renderDetail(c);
    else renderList();
  } else {
    renderList();
  }
}

fetch('data/v2_situational-comps.json')
  .then(r=>r.ok?r.json():[])
  .then(xs=>{ list = Array.isArray(xs)?xs:[]; render(); })
  .catch(()=>{ if(root) root.innerHTML='<p class="empty">—</p>'; });

setupLanguage(render);
