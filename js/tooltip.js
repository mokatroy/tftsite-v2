import {lang,localize} from './i18n.js';
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
  'red buff': {en:'Attacks apply Burn and Wound.', ar:'الهجمات بتحط حرق وضعف شفاء.'},
  'blue buff': {en:'+Mana. After casting, restore Mana.', ar:'مانا. بعد الكاست بيرجع مانا.'},
  'archangel staff': {en:'+AP that grows over combat.', ar:'AP بيزيد مع استمرار القتال.'},
  'crownguard': {en:'+AP / Armor. Starting combat shield.', ar:'AP ودرع + درع في بداية القتال.'}
};

/** Set 18 trait descriptions + breakpoints */
const TRAIT_DESC = {
  adaptor: {
    bp: '2 / 3 / 4',
    en: 'Adaptor abilities change based on whether AD or AP is higher. The trait adds more of whichever is higher.',
    ar: 'قدرات الـ Adaptor بتتغير حسب AD أو AP الأعلى، والتريت بيزود الإحصائية الأعلى.'
  },
  blackthorn: {
    bp: '2 / 4 / 6',
    en: 'The ally on the Blackthorn hex is sacrificed before combat. Your team gains Health; Blackthorn champs gain extra stats from the sacrifice.',
    ar: 'الحليف على خانة الـ Blackthorn بيتضحى قبل القتال. الفريق بياخد صحة، وأبطال Blackthorn بياخدوا ستاتس إضافية.'
  },
  blossom: {
    bp: '3 / 5 / 7 / 9 / 11',
    en: 'After combat, Wisps are empowered. Blossom champs gain AD, AP and max Health. Higher tiers upgrade Wisps and shop access.',
    ar: 'بعد القتال الـ Wisps بتتقوى. أبطال Blossom بياخدوا AD و AP وصحة. المستويات الأعلى بتحسّن الـ Wisps والمحل.'
  },
  brawler: {
    bp: '2 / 4 / 6',
    en: 'Your team gains max Health. Brawlers gain more.',
    ar: 'الفريق بياخد صحة إضافية. الـ Brawlers بياخدوا أكتر.'
  },
  coven: {
    bp: '3 / 4 / 5 / 7',
    en: 'Gather Essence from kills and losses. Cash it in for rewards, or keep stacking for bigger payouts.',
    ar: 'اجمع Essence من القتل والخسائر. اصرفه لمكافآت أو كمّل التكديس لمكافآت أكبر.'
  },
  defender: {
    bp: '2 / 4 / 6',
    en: 'Your team gains Armor and Magic Resist. Defenders gain more.',
    ar: 'الفريق بياخد درع ومقاومة سحرية. الـ Defenders بياخدوا أكتر.'
  },
  elderwood: {
    bp: '3 / 5 / 7 / 9 / 11',
    en: 'Gain placeable Elderwood plants (Stonebark Tree, Lifebloom, Deepwood Protector). Plants scale with Elderwood star level.',
    ar: 'تحصل على نباتات Elderwood قابلة للوضع. النباتات بتقوى مع مستوى نجوم الـ Elderwood.'
  },
  executioner: {
    bp: '2 / 3 / 4',
    en: 'Executioners gain Precision and Crit Chance. From (3), enemies bleed bonus true damage.',
    ar: 'الـ Executioners بياخدوا Precision ونسبة كريت. من (3) الأعداء بينزفوا ضرر حقيقي إضافي.'
  },
  fae: {
    bp: '2 / 4',
    en: 'Damage, healing and shielding attract Pixies. Each Pixie gives Fae champs AD/AP and heal below 50% HP. At (4), Golden Pixies grant gold.',
    ar: 'الضرر والشفاء والدروع بتجذب Pixies. كل واحدة بتدي AD/AP وشفاء تحت 50% صحة. عند (4) الـ Golden Pixies بتدي ذهب.'
  },
  'flora fatalis': {
    bp: '1 / 2',
    en: 'Harvest enemies on takedown for Mana. At (2), also heal your lowest-Health ally.',
    ar: 'احصد الأعداء عند القتل عشان مانا. عند (2) كمان اشفي أضعف حليف.'
  },
  hunter: {
    bp: '2 / 3 / 4 / 5',
    en: 'Hunters gain Attack Damage, plus Damage Amp while staying on the same target.',
    ar: 'الـ Hunters بياخدوا AD، و Damage Amp لو فضلوا على نفس الهدف.'
  },
  inferno: {
    bp: '2 / 3 / 5 / 7',
    en: 'Inferno damage Burns and Wounds. Higher tiers ignite shop slots to roll higher-cost champs.',
    ar: 'ضرر Inferno بيعمل Burn و Wound. المستويات الأعلى بتولّع خانات في المحل لشات أعلى تكلفة.'
  },
  invoker: {
    bp: '2 / 3 / 4 / 5',
    en: 'Your team gains Mana Regen. Invokers gain more.',
    ar: 'الفريق بياخد تجديد مانا. الـ Invokers بياخدوا أكتر.'
  },
  juggernaut: {
    bp: '2 / 4 / 6',
    en: 'Your team gains Durability. Juggernauts gain more.',
    ar: 'الفريق بياخد Durability. الـ Juggernauts بياخدوا أكتر.'
  },
  lunar: {
    bp: '2 / 3 / 4 / 5',
    en: 'Lunar champs and adjacent allies gain Attack Speed and Ability Power. Lunar champs gain more.',
    ar: 'أبطال Lunar والحلفاء المجاورين بياخدوا سرعة هجوم و AP. أبطال Lunar بياخدوا أكتر.'
  },
  primal: {
    bp: '2 / 4',
    en: 'At (2), choose one of four Primal Blessings. At (4), choose a second.',
    ar: 'عند (2) اختار واحدة من أربع بركات Primal. عند (4) اختار تانية.'
  },
  rapidfire: {
    bp: '2 / 3 / 4 / 5',
    en: 'Your team gains Attack Speed. Rapidfire champs gain more on every attack, up to a stack cap.',
    ar: 'الفريق بياخد سرعة هجوم. أبطال Rapidfire بيزودوا مع كل ضربة لحد حد معين.'
  },
  ravager: {
    bp: '2 / 4 / 6',
    en: 'Ravagers gain Omnivamp and bonus damage, doubled against low-Health enemies.',
    ar: 'الـ Ravagers بياخدوا أومنيفامب وضرر إضافي، بيتضاعف ضد الأهداف ضعيفة الصحة.'
  },
  riftbeast: {
    bp: '3 / 5 / 7 / 10',
    en: '(3) Alpha Mark buffs one Riftbeast. (5) Shop overruns with Riftbeasts. (7) They grow in combat. (10) +2 max team size.',
    ar: '(3) Alpha Mark بتقوي Riftbeast واحد. (5) المحل بيتملّى Riftbeasts. (7) بيكبروا في القتال. (10) +2 حجم الفريق.'
  },
  rival: {
    bp: '1 / 2',
    en: 'Kha\'Zix and Rengar collect takedowns. Alone they evolve/earn gold; together their abilities buff each other.',
    ar: 'Kha\'Zix و Rengar بيجمعوا قتلات. لوحدهم بيتطوروا/ياخدوا ذهب؛ مع بعض قدراتهم بتقوي بعض.'
  },
  solar: {
    bp: '3',
    en: 'Team gains max Health shield and bonus magic damage. More unique 3-stars strengthen the bonus; enough can ascend a 3-star to 4-star.',
    ar: 'الفريق بياخد درع صحة وضرر سحري. كل 3-star فريد بيزود البونس؛ مع عدد كافي ممكن 3-star يترقى لـ 4-star.'
  },
  spellweaver: {
    bp: '2 / 4 / 6',
    en: 'Your team gains Ability Power. Spellweavers gain more, plus extra AP each time one casts.',
    ar: 'الفريق بياخد AP. الـ Spellweavers بياخدوا أكتر، و AP إضافي مع كل كاست.'
  },
  sprykin: {
    bp: '3 / 5 / 7',
    en: 'Gain the Big Furry Friend. Drop a Sprykin on it as Rider for Health and Attack Speed. Higher tiers empower more Sprykin.',
    ar: 'تحصل على Big Furry Friend. حط Sprykin عليه كـ Rider عشان صحة وسرعة هجوم. المستويات الأعلى بتقوي أكتر.'
  },
  summoner: {
    bp: '2 / 3',
    en: 'Summoners empower their summons in unique ways. At (3) every effect improves.',
    ar: 'الـ Summoners بيقووا الاستدعاءات بطرق مختلفة. عند (3) كل التأثيرات بتتحسّن.'
  },
  vanguard: {
    bp: '2 / 4 / 6',
    en: 'At combat start and below 50% Health, Vanguards gain a max Health shield. At (6) also Durability while shielded.',
    ar: 'في بداية القتال وتحت 50% صحة، الـ Vanguards بياخدوا درع صحة. عند (6) كمان Durability وهم مدرعين.'
  },
  // single-champ
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
    en: 'Unique Kog\'Maw-related trait.',
    ar: 'تريت مرتبط بـ Kog\'Maw.'
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
      const key = (c.name?.en||'').toLowerCase();
      if(key) champMap[key] = c;
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
  const key = String(name||'').toLowerCase();
  const c = champMap && champMap[key];
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

function renderTrait(name){
  const key = String(name||'').toLowerCase().trim();
  const img = traitImg(name);
  const meta = TRAIT_DESC[key] || null;
  const text = meta ? (lang==='ar' ? (meta.ar||meta.en) : meta.en) : '';
  const bp = meta?.bp || '';
  const champs = (traitChamps && traitChamps[key]) || [];
  const champHtml = champs
    .slice()
    .sort((a,b)=>(a.cost||9)-(b.cost||9))
    .map(c=>{
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

export function initTooltips(){
  loadData();
  document.addEventListener('mouseover', e=>{
    const el = e.target.closest(TIP_SEL);
    if(!el) return;
    showFor(el);
  });
  document.addEventListener('mouseout', e=>{
    const el = e.target.closest(TIP_SEL);
    if(!el) return;
    if(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(TIP_SEL) === el) return;
    hide();
  });
  document.addEventListener('click', e=>{
    const el = e.target.closest(TIP_SEL);
    if(el){
      e.preventDefault();
      showFor(el);
    } else hide();
  });
  window.addEventListener('scroll', hide, true);
  window.addEventListener('resize', hide);
}

if(typeof document !== 'undefined'){
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initTooltips);
  else initTooltips();
}
