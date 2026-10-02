import {lang,localize} from './i18n.js';
import {champImg,itemImg} from './ui.js';

let tip, champMap = null, itemMap = null, loading = null;

const ITEM_DESC = {
  'infinity edge': {en:'+AD. Abilities can critically strike. +Crit chance / crit damage.', ar:'زيادة AD. القدرات تقدر تعمل كريت. زيادة نسبة وضرر الكريت.'},
  "guinsoo's rageblade": {en:'+AS. Attacks grant stacking Attack Speed.', ar:'زيادة سرعة هجوم. كل هجوم بيزود AS.'},
  'spear of shojin': {en:'+AD / Mana. Attacks grant Mana.', ar:'زيادة AD ومانا. الهجمات بتدي مانا.'},
  'bloodthirster': {en:'+AD / Omnivamp. Shield when low HP.', ar:'AD + أومنيفامب. درع لما الصحة تقل.'},
  "rabadon's deathcap": {en:'+AP. Massive Ability Power multiplier.', ar:'زيادة AP كبيرة ومضاعف قوة سحرية.'},
  'last whisper': {en:'+AS. Attacks reduce target Armor.', ar:'AS. الهجمات بتقلل درع الهدف.'},
  'edge of night': {en:'+AD. One-time damage immunity at low HP.', ar:'AD. مناعة مرة واحدة من الضرر عند انخفاض الصحة.'},
  'bramble vest': {en:'+Armor. Reflects damage when hit.', ar:'درع. بيرد جزء من الضرر.'},
  'morellonomicon': {en:'+AP. Abilities apply Burn and Wound.', ar:'AP. القدرات بتحط حرق وضعف شفاء.'},
  "warmog's armor": {en:'+Health. Regenerates HP out of combat.', ar:'صحة عالية وتجديد خارج القتال.'},
  'void staff': {en:'+AP. Abilities reduce Magic Resist.', ar:'AP. القدرات بتقلل المقاومة السحرية.'},
  'gargoyle stoneplate': {en:'+Armor / MR that scales with nearby enemies.', ar:'درع ومقاومة تزيد مع عدد الأعداء القريبين.'},
  "dragon's claw": {en:'+MR. Periodic magic damage reduction.', ar:'مقاومة سحرية وتقليل ضرر سحري.'},
  'hand of justice': {en:'+AD/AP adaptive. Omnivamp or damage based on HP.', ar:'AD/AP تكيفي + أومنيفامب أو ضرر حسب الصحة.'},
  "titan's resolve": {en:'Stacking AD/AP and Armor/MR on hit.', ar:'ستاكات AD/AP ودرع/مقاومة مع كل ضربة.'},
  'jeweled gauntlet': {en:'+AP. Abilities can critically strike.', ar:'AP. القدرات تقدر تعمل كريت.'},
  'steadfast heart': {en:'+Armor. Damage reduction while above HP threshold.', ar:'درع. تقليل ضرر فوق حد معين من الصحة.'},
  'sunfire cape': {en:'+Health. Burns nearby enemies.', ar:'صحة. بيحرق الأعداء حواليه.'},
  'quicksilver': {en:'+AS. CC immunity for a few seconds.', ar:'AS. مناعة من الـCC لثواني.'},
  'ionic spark': {en:'+MR. Enemies take extra damage and lose Mana.', ar:'MR. الأعداء بياخدوا ضرر زيادة وبيفقدوا مانا.'},
  'giant slayer': {en:'Bonus damage to high-HP targets.', ar:'ضرر إضافي ضد الأهداف عالية الصحة.'},
  'red buff': {en:'Attacks apply Burn and Wound.', ar:'الهجمات بتحط حرق وضعف شفاء.'},
  'blue buff': {en:'+Mana. After casting, restore Mana.', ar:'مانا. بعد الكاست بيرجع مانا.'},
  'archangel staff': {en:'+AP that grows over combat.', ar:'AP بيزيد مع استمرار القتال.'},
  'crownguard': {en:'+AP / Armor. Starting combat shield.', ar:'AP ودرع + درع في بداية القتال.'}
};

function ensureTip(){
  if(tip) return tip;
  tip = document.createElement('div');
  tip.className = 'hover-tip';
  tip.style.display = 'none';
  document.body.appendChild(tip);
  return tip;
}

async function loadData(){
  if(champMap) return;
  if(loading) return loading;
  loading = Promise.all([
    fetch('data/v2_champions.json').then(r=>r.ok?r.json():{champions:[]}).catch(()=>({champions:[]})),
  ]).then(([ch])=>{
    champMap = {};
    (ch.champions||[]).forEach(c=>{
      const key = (c.name?.en||'').toLowerCase();
      if(key) champMap[key] = c;
    });
    itemMap = ITEM_DESC;
  });
  return loading;
}

function costBadge(cost){
  const c = Number(cost)||1;
  return `<span class="tip-cost cost-${c}">${c}¢</span>`;
}

function renderChamp(name){
  const key = String(name||'').toLowerCase();
  const c = champMap && champMap[key];
  const img = champImg(name);
  if(!c){
    return `<div class="tip-head"><img src="${img}" alt="" class="tip-avatar" onerror="this.style.display='none'"><div><strong>${name}</strong></div></div>`;
  }
  const disp = localize(c.name) || c.name?.en || name;
  const traits = (c.traits||[]).map(t=>`<span class="tip-trait">${t.name||t}</span>`).join('');
  const abName = c.ability?.name || '';
  const abText = localize(c.ability) || c.ability?.en || c.ability?.ar || '';
  const items = (c.bestItems||[]).slice(0,3).map(it=>{
    const n = typeof it==='string'?it:(it.name||'');
    const ii = itemImg(n);
    return `<span class="tip-bis">${ii?`<img src="${ii}" alt="">`:''}${n}</span>`;
  }).join('');
  return `
    <div class="tip-head">
      <img src="${img}" alt="" class="tip-avatar" onerror="this.style.display='none'">
      <div>
        <div class="tip-title-row">${costBadge(c.cost)}<strong>${disp}</strong></div>
        <div class="tip-traits">${traits}</div>
      </div>
    </div>
    ${abText?`<div class="tip-ability"><span class="tip-ab-name">${abName}</span><p>${abText}</p></div>`:''}
    ${items?`<div class="tip-items"><span class="tip-label">BiS</span>${items}</div>`:''}
  `;
}

function renderItem(name){
  const key = String(name||'').toLowerCase().trim();
  const img = itemImg(name);
  const desc = (itemMap && itemMap[key]) || null;
  const text = desc ? (lang==='ar' ? (desc.ar||desc.en) : desc.en) : '';
  return `
    <div class="tip-head">
      ${img?`<img src="${img}" alt="" class="tip-avatar item" onerror="this.style.display='none'">`:''}
      <div><strong>${name}</strong></div>
    </div>
    ${text?`<p class="tip-desc">${text}</p>`:''}
  `;
}

function place(anchor){
  const el = ensureTip();
  const r = anchor.getBoundingClientRect();
  el.style.display = 'block';
  const tw = el.offsetWidth, th = el.offsetHeight;
  let left = r.left + r.width/2 - tw/2;
  left = Math.max(8, Math.min(left, window.innerWidth - tw - 8));
  let top = r.top - th - 12;
  let flipped = false;
  if(top < 8){ top = r.bottom + 12; flipped = true; }
  el.style.left = left + 'px';
  el.style.top = (top + window.scrollY) + 'px';
  el.classList.toggle('flipped', flipped);
  const arrow = Math.max(12, Math.min(r.left + r.width/2 - left, tw - 12));
  el.style.setProperty('--arrow', arrow + 'px');
}

function hide(){
  if(tip) tip.style.display = 'none';
}

async function showFor(el){
  await loadData();
  const unit = el.dataset.unit || el.getAttribute('data-unit');
  const item = el.dataset.item || el.getAttribute('data-item');
  const box = ensureTip();
  if(unit){
    box.innerHTML = renderChamp(unit);
    box.dataset.kind = 'champ';
  } else if(item){
    box.innerHTML = renderItem(item);
    box.dataset.kind = 'item';
  } else return;
  place(el);
}

export function initTooltips(){
  loadData();
  document.addEventListener('mouseover', e=>{
    const el = e.target.closest('[data-unit], [data-item]');
    if(!el) return;
    showFor(el);
  });
  document.addEventListener('mouseout', e=>{
    const el = e.target.closest('[data-unit], [data-item]');
    if(!el) return;
    if(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('[data-unit], [data-item]') === el) return;
    hide();
  });
  // mobile tap
  document.addEventListener('click', e=>{
    const el = e.target.closest('[data-unit], [data-item]');
    if(el){
      e.preventDefault();
      showFor(el);
    } else hide();
  });
  window.addEventListener('scroll', hide, true);
  window.addEventListener('resize', hide);
}

// auto-init
if(typeof document !== 'undefined'){
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initTooltips);
  else initTooltips();
}
