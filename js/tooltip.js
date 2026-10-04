import {lang,localize} from './locale.js';
import {champImg,itemImg} from './ui.js';
import {traitImg} from './icons.js';

let tip, champMap = null, itemMap = null, traitChamps = null, loading = null;

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
  'blue buff': {en:'+Mana. Mana refund after casting.', ar:'مانا + استرجاع مانا بعد الكاست.'},
  "archangel's staff": {en:'+AP that scales over combat.', ar:'AP بتزيد مع مرور القتال.'},
  'hextech gunblade': {en:'+AD/AP. Omnivamp on abilities.', ar:'AD/AP + أومنيفامب من القدرات.'},
  'evenshroud': {en:'+Health. Reduces nearby enemy durability.', ar:'صحة. بيقلل متانة الأعداء القريبين.'},
  "protector's vow": {en:'+Armor/Mana. Shield allies when combat starts.', ar:'درع/مانا. درع للحلفاء في بداية القتال.'},
  'adaptive helm': {en:'+MR. Gain stats based on damage taken type.', ar:'MR. ستاتس حسب نوع الضرر المستلم.'},
  'spirit visage': {en:'+MR. Increases healing and shielding.', ar:'MR. بيزود الشفاء والدروع.'},
  "nashor's tooth": {en:'+AS/AP. Attacks deal bonus magic damage.', ar:'AS/AP. الهجمات بتضيف ضرر سحري.'},
  'red buff': {en:'+AS. Attacks apply Burn and Wound.', ar:'AS. الهجمات بتحط حرق وضعف شفاء.'},
  "sterak's gage": {en:'+Health. Shield and AD when low HP.', ar:'صحة. درع وAD لما الصحة تقل.'},
  'deathblade': {en:'+AD. Stacks Attack Damage.', ar:'AD. بيزود قوة الهجوم.'},
  "thief's gloves": {en:'Two random items each round.', ar:'أيتمين عشوائيين كل راوند.'},
  "tactician's crown": {en:'+1 team size.', ar:'+1 حجم الفريق.'},
  'crownguard': {en:'+AP/Armor. Starting shield and AP burst.', ar:'AP/درع. درع بداية وانفجار AP.'}
};

const TRAIT_DESC = {
  riftbeast: {
    bp: '3 / 5 / 7 / 10',
    en: '(3) Alpha Mark empowers one Riftbeast. (5) Shop fills with Riftbeasts. (7) They grow in combat. (10) +2 team size.',
    ar: '(3) Alpha Mark بتقوي Riftbeast واحد. (5) المحل بيتملّى Riftbeasts. (7) بيكبروا في القتال. (10) +2 حجم الفريق.'
  },
  elderwood: {
    bp: '3 / 5 / 7 / 9 / 11',
    en: 'Gain placeable Elderwood plants that scale with Elderwood star level.',
    ar: 'نباتات Elderwood قابلة للوضع، بتتقوى مع نجوم Elderwood.'
  },
  invoker: {
    bp: '2 / 4 / 6',
    en: 'Invoker units gain Mana regen and ability power.',
    ar: 'Invoker بيكسبوا تجديد مانا وقوة قدرات.'
  },
  vanguard: {
    bp: '2 / 4 / 6',
    en: 'Vanguard units gain Armor and Magic Resist.',
    ar: 'Vanguard بيكسبوا درع ومقاومة سحرية.'
  },
  brawler: {
    bp: '2 / 4 / 6',
    en: 'Brawler units gain max Health.',
    ar: 'Brawler بيكسبوا صحة قصوى.'
  },
  juggernaut: {
    bp: '2 / 4 / 6',
    en: 'Juggernauts gain durability that decays over combat.',
    ar: 'Juggernaut بيكسبوا متانة بتقل مع القتال.'
  },
  fae: {
    bp: '2 / 4 / 6',
    en: 'Team damage/heal/shield attracts Pixies that grant AD/AP and heal below 50% HP.',
    ar: 'الضرر/الشفاء/الدرع بيجذب Pixies بتدي AD/AP وبتشفي تحت 50% صحة.'
  },
  rapidfire: {
    bp: '2 / 4 / 6',
    en: 'Team gains Attack Speed. Rapidfire units stack more AS on attack.',
    ar: 'الفريق بيكسب AS. Rapidfire بيزودوا AS أكتر مع كل هجوم.'
  },
  defender: {
    bp: '2 / 4 / 6',
    en: 'Defenders gain Armor; team gains a portion.',
    ar: 'Defender بيكسبوا درع؛ الفريق بياخد جزء منه.'
  },
  inferno: {
    bp: '3 / 5 / 7',
    en: 'Inferno units apply Burn and gain power from burning enemies.',
    ar: 'Inferno بيحرقوا الأعداء وبيكسبوا قوة من الحرق.'
  },
  blossom: {
    bp: '3 / 5 / 7',
    en: 'Blossom units empower allies with petals and combat buffs.',
    ar: 'Blossom بتقوي الحلفاء ببتلات وبافات قتال.'
  },
  solar: {
    bp: '2 / 3 / 4 / 5',
    en: 'Solar units share light stacks for damage and utility.',
    ar: 'Solar بيشاركوا ستاكات نور للضرر والمنفعة.'
  },
  lunar: {
    bp: '2 / 3 / 4',
    en: 'Lunar units cycle moon phases for different combat effects.',
    ar: 'Lunar بتغيّر أطوار القمر لتأثيرات قتال مختلفة.'
  },
  hunter: {
    bp: '2 / 4 / 6',
    en: 'Hunters gain damage against low-HP or isolated targets.',
    ar: 'Hunter بيكسبوا ضرر ضد الأهداف الضعيفة أو المنعزلة.'
  },
  executioner: {
    bp: '2 / 3 / 4 / 5',
    en: 'Executioners deal bonus damage to low-HP enemies and can execute.',
    ar: 'Executioner بتعمل ضرر زيادة ضد الأهداف الضعيفة وتقدر تعمل execute.'
  },
  spellweaver: {
    bp: '2 / 4 / 6',
    en: 'Spellweavers gain Ability Power; casts grant more AP.',
    ar: 'Spellweaver بيكسبوا AP؛ كل كاست بيزود AP أكتر.'
  },
  adaptor: {
    bp: '2 / 3 / 4 / 5',
    en: 'Adaptors gain flexible combat stats based on items and board.',
    ar: 'Adaptor بيكسبوا ستاتس مرنة حسب الأيتمز والبورد.'
  },
  ravager: {
    bp: '2 / 4 / 6',
    en: 'Ravagers gain Omnivamp and damage after takedowns.',
    ar: 'Ravager بيكسبوا أومنيفامب وضرر بعد القتلات.'
  },
  coven: {
    bp: '3 / 5 / 7',
    en: 'Coven gathers Essence for cashouts and combat power.',
    ar: 'Coven بتجمع Essence للكاش أوت وقوة القتال.'
  },
  flora: {
    bp: '2 / 3 / 4 / 5',
    en: 'Flora units grow plants and empower the board over time.',
    ar: 'Flora بتنمّي نباتات وبتقوي البورد مع الوقت.'
  },
  'apex predator': {
    bp: '—',
    en: 'Elder Dragon takes 2 team slots and adds 2 to Riftbeast count.',
    ar: 'الـ Elder Dragon بياخد خانتين في الفريق وبيزود Riftbeast بـ 2.'
  },
  attuned: {
    bp: '—',
    en: 'Alune shifts moon phase after each cast: Durability below half moon, Damage Amp above.',
    ar: 'Alune بتغيّر طور القمر بعد كل كاست: Durability تحت نصف القمر، و Damage Amp فوقه.'
  },
  avatar: {
    bp: '—',
    en: 'Lux chooses an Origin; that trait counts twice. Other Avatars in shop become her trait.',
    ar: 'Lux بتختار Origin؛ التريت ده بيتحسب مرتين. باقي الـ Avatars في المحل بيبقوا تريتها.'
  },
  'bounty seeker': {
    bp: '—',
    en: 'Draven chooses bounties and progresses them for champions, gold, items, rerolls or XP.',
    ar: 'Draven بيختار مهام bounty ويكملها مقابل أبطال، ذهب، أيتمز، ريرول أو XP.'
  },
  'emerald aspect': {
    bp: '—',
    en: 'Unique Taric trait.',
    ar: 'تريت خاص بـ Taric.'
  },
  greenfather: {
    bp: '—',
    en: 'Unique Ivern trait.',
    ar: 'تريت خاص بـ Ivern.'
  },
  monolith: {
    bp: '—',
    en: 'Unique Malphite trait.',
    ar: 'تريت خاص بـ Malphite.'
  },
  'old growth': {
    bp: '—',
    en: 'Unique Maokai trait.',
    ar: 'تريت خاص بـ Maokai.'
  },
  thornmaiden: {
    bp: '—',
    en: 'Unique Zyra trait.',
    ar: 'تريت خاص بـ Zyra.'
  },
  caustic: {
    bp: '—',
    en: "Unique Kog'Maw-related trait.",
    ar: "تريت مرتبط بـ Kog'Maw."
  }
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
    traitChamps = {};
    (ch.champions||[]).forEach(c=>{
      const key = (c.name?.en||'').toLowerCase().trim();
      if(key){
        champMap[key] = c;
        champMap[key.replace(/\s+/g,'')] = c;
      }
      (c.traits||[]).forEach(tr=>{
        const tn = (typeof tr === 'string' ? tr : (tr.name||'')).toLowerCase();
        if(!tn) return;
        if(!traitChamps[tn]) traitChamps[tn] = [];
        traitChamps[tn].push({name: c.name?.en || key, cost: c.cost});
      });
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
  const key = String(name||'').toLowerCase().trim();
  const compact = key.replace(/[''`]/g,'').replace(/\s+/g,'');
  const c = champMap && (champMap[key] || champMap[compact]);
  const img = champImg(name);
  if(!c){
    return `<div class="tip-head"><img src="${img}" alt="" class="tip-avatar" onerror="this.style.display='none'"><div><strong>${name}</strong></div></div>`;
  }
  const disp = localize(c.name) || c.name?.en || name;
  const traits = (c.traits||[]).map(t=>{
    const n = t.name||t;
    return `<span class="tip-trait" data-trait="${n}">${n}</span>`;
  }).join('');
  const abName = c.ability?.name || '';
  const abText = localize(c.ability) || c.ability?.en || c.ability?.ar || '';
  const bis = (c.bestItems||[]).slice(0,3).map(it=>{
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
    ${bis?`<div class="tip-items"><span class="tip-label">BiS</span>${bis}</div>`:''}
  `;
}

function renderItem(name){
  const key = String(name||'').toLowerCase().trim();
  const d = (itemMap && itemMap[key]) || ITEM_DESC[key];
  const img = itemImg(name);
  const text = d ? (d[lang] || d.en || '') : '';
  return `
    <div class="tip-head">
      ${img?`<img src="${img}" alt="" class="tip-avatar item" onerror="this.style.display='none'">`:''}
      <div><strong>${name}</strong></div>
    </div>
    ${text?`<p class="tip-desc">${text}</p>`:`<p class="tip-desc">${lang==='ar'?'وصف الأيتم غير متوفر.':'Item description unavailable.'}</p>`}
  `;
}

function renderTrait(name){
  const key = String(name||'').toLowerCase().trim();
  const d = TRAIT_DESC[key];
  const img = traitImg(name);
  const bp = d?.bp || '';
  const text = d ? (d[lang] || d.en || '') : '';
  const list = (traitChamps && traitChamps[key]) || [];
  const champHtml = list.slice(0,12).map(c=>{
    const ci = champImg(c.name);
    return `<span class="tip-trait-champ">${ci?`<img src="${ci}" alt="" loading="lazy" onerror="this.style.display='none'">`:''}<span>${c.name}</span>${costBadge(c.cost)}</span>`;
  }).join('');
  return `
    <div class="tip-head">
      ${img?`<img src="${img}" alt="" class="tip-avatar trait" onerror="this.style.display='none'">`:''}
      <div>
        <strong>${name}</strong>
        ${bp?`<div class="tip-bp">${bp}</div>`:''}
      </div>
    </div>
    ${text?`<p class="tip-desc">${text}</p>`:''}
    ${champHtml?`<div class="tip-trait-champs"><span class="tip-label">${lang==='ar'?'الأبطال':'Champions'}</span><div class="tip-trait-list">${champHtml}</div></div>`:''}
  `;
}

function place(anchor){
  const el = ensureTip();
  const r = anchor.getBoundingClientRect();
  el.style.display = 'block';
  el.style.visibility = 'hidden';
  const tw = el.offsetWidth || 260, th = el.offsetHeight || 80;
  let left = r.left + r.width/2 - tw/2;
  left = Math.max(8, Math.min(left, window.innerWidth - tw - 8));
  let top = r.top - th - 14;
  let flipped = false;
  if(top < 8){ top = r.bottom + 14; flipped = true; }
  el.style.left = left + 'px';
  el.style.top = top + 'px';
  el.style.visibility = 'visible';
  el.classList.toggle('flipped', flipped);
  const arrow = Math.max(12, Math.min(r.left + r.width/2 - left, tw - 12));
  el.style.setProperty('--arrow', arrow + 'px');
}

function hide(){
  if(tip) tip.style.display = 'none';
}

const TIP_SEL = '[data-unit], [data-item], [data-trait]';

async function showFor(el){
  await loadData();
  const unit = el.dataset.unit || el.getAttribute('data-unit');
  const item = el.dataset.item || el.getAttribute('data-item');
  const trait = el.dataset.trait || el.getAttribute('data-trait');
  const box = ensureTip();
  if(unit){
    box.innerHTML = renderChamp(unit);
    box.dataset.kind = 'champ';
  } else if(item){
    box.innerHTML = renderItem(item);
    box.dataset.kind = 'item';
  } else if(trait){
    box.innerHTML = renderTrait(trait);
    box.dataset.kind = 'trait';
  } else return;
  place(el);
}

let hideTimer = null;
let activeEl = null;

export function initTooltips(){
  loadData();
  document.addEventListener('mouseover', e=>{
    const el = e.target.closest(TIP_SEL);
    if(!el) return;
    if(hideTimer){ clearTimeout(hideTimer); hideTimer = null; }
    if(activeEl === el) return;
    activeEl = el;
    showFor(el);
  });
  document.addEventListener('mouseout', e=>{
    const el = e.target.closest(TIP_SEL);
    if(!el) return;
    const to = e.relatedTarget;
    if(to && to.closest && to.closest(TIP_SEL) === el) return;
    hideTimer = setTimeout(()=>{
      if(activeEl === el){ activeEl = null; hide(); }
    }, 80);
  });
  document.addEventListener('click', e=>{
    const el = e.target.closest(TIP_SEL);
    if(el){
      if(hideTimer){ clearTimeout(hideTimer); hideTimer = null; }
      activeEl = el;
      showFor(el);
    } else {
      activeEl = null;
      hide();
    }
  });
  window.addEventListener('scroll', ()=>{ activeEl = null; hide(); }, true);
  window.addEventListener('resize', ()=>{ activeEl = null; hide(); });
}

if(typeof document !== 'undefined'){
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initTooltips);
  else initTooltips();
}
