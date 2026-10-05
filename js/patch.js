import {setupLanguage, localize, t, lang} from './locale.js?v=20261005p';

let patches = [];

function catLabel(cat){
  const map = {
    champion: {ar:'تشامبيون', en:'Champion', ja:'チャンピオン'},
    trait: {ar:'تريت', en:'Trait', ja:'トレイト'},
    augment: {ar:'أوجمنت', en:'Augment', ja:'オーグメント'},
    wisp: {ar:'Wisp', en:'Wisp', ja:'Wisp'},
    system: {ar:'نظام', en:'System', ja:'システム'},
    meta: {ar:'ميتا', en:'Meta', ja:'メタ'},
    item: {ar:'أيتم', en:'Item', ja:'アイテム'}
  };
  const m = map[cat] || {ar:cat, en:cat, ja:cat};
  return m[lang] || m.en || cat;
}

function typeLabel(type){
  const map = {
    nerf: {ar:'نيرف', en:'Nerf', ja:'ナーフ'},
    buff: {ar:'باف', en:'Buff', ja:'バフ'},
    adjust: {ar:'تعديل', en:'Adjust', ja:'調整'}
  };
  const m = map[type] || {ar:type, en:type, ja:type};
  return m[lang] || m.en || type;
}

function renderPatch(p){
  if(!p) return `<p class="empty">${t('notFound')||'—'}</p>`;
  const title = localize(p.title) || p.version || '';
  const date = p.releaseDate || p.date || '';
  const summary = localize(p.summary) || '';
  const highlight = localize(p.highlights) || (Array.isArray(p.highlights) ? p.highlights.map(h=>localize(h)||h).filter(Boolean).join(' ') : '');

  const byCat = {};
  for(const ch of (p.changes||[])){
    const cat = ch.category || 'system';
    (byCat[cat] = byCat[cat] || []).push(ch);
  }
  const catOrder = ['champion','trait','augment','wisp','item','system','meta'];
  const cats = [...catOrder.filter(c=>byCat[c]), ...Object.keys(byCat).filter(c=>!catOrder.includes(c))];

  const sections = cats.map(cat=>{
    const cards = byCat[cat].map(ch=>{
      const type = (ch.type||'adjust').toLowerCase();
      const who = localize(ch.name || ch.unit) || '';
      const text = localize(ch.detail || ch.text || ch.change) || '';
      return `<article class="patch-change ${type}">
        <div class="patch-change-head">
          <span class="patch-cat">${typeLabel(type)}</span>
          <h3>${who}</h3>
        </div>
        <p>${text}</p>
      </article>`;
    }).join('');
    return `<section class="patch-section">
      <h2 class="patch-section-title">${catLabel(cat)}</h2>
      <div class="patch-list">${cards}</div>
    </section>`;
  }).join('');

  return `
  <p class="eyebrow">PATCH NOTES · SET 18</p>
  <div class="patch-hero">
    <p class="patch-release">${p.version||''}${date ? ' · ' + date : ''}</p>
    <h1>${title}</h1>
    ${summary ? `<p>${summary}</p>` : ''}
    ${highlight ? `<p class="patch-highlights">${highlight}</p>` : ''}
  </div>
  ${sections}`;
}

function render(){
  const root = document.querySelector('#patch-root') || document.querySelector('#patch-page');
  if(!root) return;
  if(!patches.length){
    root.innerHTML = `<p class="empty">${t('notFound')||'—'}</p>`;
    return;
  }
  // Show latest first; if multiple patches, stack them
  root.innerHTML = patches.map(renderPatch).join('<hr class="patch-divider">');
  document.title = (localize(patches[0].title) || patches[0].version || 'Patch') + ' — MokaTroy TFT';
}

const CDN = 'https://cdn.jsdelivr.net/gh/mokatroy/tftsite-v2@main/data';
function loadPatches(){
  return fetch('data/patches.json?v=20261005p').then(async r=>{
    if(!r.ok) throw new Error('local');
    const d = await r.json();
    if(Array.isArray(d) && d.length === 0) throw new Error('empty');
    return d;
  }).catch(()=>fetch(CDN+'/patches.json').then(r=>r.json()));
}

loadPatches().then(xs=>{
  patches = Array.isArray(xs) ? xs : [xs];
  render();
}).catch(()=>{
  const root = document.querySelector('#patch-root');
  if(root) root.innerHTML = '<p class="empty">—</p>';
});

setupLanguage(render);
