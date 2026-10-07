import{setupLanguage,t,lang,localize}from'./locale.js?v=20261007augs';
import{detail,unitChip,traitChip,itemChip,renderBoard}from'./ui.js?v=20261007augs';
import{augmentImg,augmentImgRemote}from'./icons.js?v=20261007augs';

const COMP_AUGMENTS = {"riftbeast-sentinel":[{"name":"Built Different","rarity":"Gold"},{"name":"Last Stand","rarity":"Gold"},{"name":"Thrill of the Hunt","rarity":"Gold"},{"name":"Component Grab Bag","rarity":"Silver"},{"name":"Cybernetic Uplink","rarity":"Silver"},{"name":"Radiant Relics","rarity":"Prismatic"}],"elderwood-xayah":[{"name":"Jeweled Lotus","rarity":"Gold"},{"name":"Thrill of the Hunt","rarity":"Gold"},{"name":"Combat Training","rarity":"Silver"},{"name":"Pandora's Items","rarity":"Gold"},{"name":"Item Grab Bag","rarity":"Silver"},{"name":"Radiant Relics","rarity":"Prismatic"}],"vanguard-alune":[{"name":"Jeweled Lotus","rarity":"Gold"},{"name":"Cybernetic Uplink","rarity":"Silver"},{"name":"Built Different","rarity":"Gold"},{"name":"Component Grab Bag","rarity":"Silver"},{"name":"Dark Ritual","rarity":"Gold"},{"name":"Rich Get Richer","rarity":"Prismatic"}],"hunter-sivir":[{"name":"Thrill of the Hunt","rarity":"Gold"},{"name":"Combat Training","rarity":"Silver"},{"name":"Jeweled Lotus","rarity":"Gold"},{"name":"Pandora's Items","rarity":"Gold"},{"name":"Hustler","rarity":"Silver"},{"name":"Radiant Relics","rarity":"Prismatic"}],"spellweaver-veigar":[{"name":"Jeweled Lotus","rarity":"Gold"},{"name":"Cybernetic Uplink","rarity":"Silver"},{"name":"Dark Ritual","rarity":"Gold"},{"name":"Component Grab Bag","rarity":"Silver"},{"name":"Trade Sector","rarity":"Gold"},{"name":"Rich Get Richer","rarity":"Prismatic"}],"flora-azir":[{"name":"Jeweled Lotus","rarity":"Gold"},{"name":"New Recruit","rarity":"Gold"},{"name":"Component Grab Bag","rarity":"Silver"},{"name":"Built Different","rarity":"Gold"},{"name":"Wise Spending","rarity":"Silver"},{"name":"Radiant Relics","rarity":"Prismatic"}],"defender-cass":[{"name":"Jeweled Lotus","rarity":"Gold"},{"name":"Built Different","rarity":"Gold"},{"name":"Last Stand","rarity":"Gold"},{"name":"Cybernetic Uplink","rarity":"Silver"},{"name":"Component Grab Bag","rarity":"Silver"},{"name":"Portable Forge","rarity":"Prismatic"}],"juggernaut-flex":[{"name":"Built Different","rarity":"Gold"},{"name":"Last Stand","rarity":"Gold"},{"name":"Thrill of the Hunt","rarity":"Gold"},{"name":"Combat Training","rarity":"Silver"},{"name":"Pandora's Items","rarity":"Gold"},{"name":"Radiant Relics","rarity":"Prismatic"}],"lunar-aphelios":[{"name":"Thrill of the Hunt","rarity":"Gold"},{"name":"Built Different","rarity":"Gold"},{"name":"Combat Training","rarity":"Silver"},{"name":"Component Grab Bag","rarity":"Silver"},{"name":"Pandora's Items","rarity":"Gold"},{"name":"Radiant Relics","rarity":"Prismatic"}],"lunar-aphelios-nidalee":[{"name":"Thrill of the Hunt","rarity":"Gold"},{"name":"Jeweled Lotus","rarity":"Gold"},{"name":"Combat Training","rarity":"Silver"},{"name":"Component Grab Bag","rarity":"Silver"},{"name":"Pandora's Items","rarity":"Gold"},{"name":"Rich Get Richer","rarity":"Prismatic"}],"invoker-ahri":[{"name":"Jeweled Lotus","rarity":"Gold"},{"name":"Cybernetic Uplink","rarity":"Silver"},{"name":"Dark Ritual","rarity":"Gold"},{"name":"Component Grab Bag","rarity":"Silver"},{"name":"Trade Sector","rarity":"Gold"},{"name":"Radiant Relics","rarity":"Prismatic"}],"executioner-khazix":[{"name":"Thrill of the Hunt","rarity":"Gold"},{"name":"Combat Training","rarity":"Silver"},{"name":"Hustler","rarity":"Silver"},{"name":"Pandora's Items","rarity":"Gold"},{"name":"Last Stand","rarity":"Gold"},{"name":"Binary Airdrop","rarity":"Prismatic"}],"juggernaut-ashe":[{"name":"Thrill of the Hunt","rarity":"Gold"},{"name":"Built Different","rarity":"Gold"},{"name":"Combat Training","rarity":"Silver"},{"name":"Jeweled Lotus","rarity":"Gold"},{"name":"Component Grab Bag","rarity":"Silver"},{"name":"Radiant Relics","rarity":"Prismatic"}],"invoker-morgana-sentinel":[{"name":"Jeweled Lotus","rarity":"Gold"},{"name":"Built Different","rarity":"Gold"},{"name":"Cybernetic Uplink","rarity":"Silver"},{"name":"Last Stand","rarity":"Gold"},{"name":"Component Grab Bag","rarity":"Silver"},{"name":"Portable Forge","rarity":"Prismatic"}],"sivir-nidalee":[{"name":"Thrill of the Hunt","rarity":"Gold"},{"name":"Combat Training","rarity":"Silver"},{"name":"Jeweled Lotus","rarity":"Gold"},{"name":"Hustler","rarity":"Silver"},{"name":"Pandora's Items","rarity":"Gold"},{"name":"Rich Get Richer","rarity":"Prismatic"}],"draven-fast9":[{"name":"Rich Get Richer","rarity":"Prismatic"},{"name":"Wise Spending","rarity":"Silver"},{"name":"Hustler","rarity":"Silver"},{"name":"Trade Sector","rarity":"Gold"},{"name":"Item Grab Bag","rarity":"Silver"},{"name":"Radiant Relics","rarity":"Prismatic"}],"vanguard-aphelios":[{"name":"Thrill of the Hunt","rarity":"Gold"},{"name":"Built Different","rarity":"Gold"},{"name":"Combat Training","rarity":"Silver"},{"name":"Component Grab Bag","rarity":"Silver"},{"name":"Pandora's Items","rarity":"Gold"},{"name":"Radiant Relics","rarity":"Prismatic"}],"solar-yunara":[{"name":"Jeweled Lotus","rarity":"Gold"},{"name":"Thrill of the Hunt","rarity":"Gold"},{"name":"Combat Training","rarity":"Silver"},{"name":"Component Grab Bag","rarity":"Silver"},{"name":"New Recruit","rarity":"Gold"},{"name":"Rich Get Richer","rarity":"Prismatic"}],"warwick-ravager":[{"name":"Built Different","rarity":"Gold"},{"name":"Last Stand","rarity":"Gold"},{"name":"Thrill of the Hunt","rarity":"Gold"},{"name":"Combat Training","rarity":"Silver"},{"name":"Hustler","rarity":"Silver"},{"name":"Binary Airdrop","rarity":"Prismatic"}],"caitlyn-reroll":[{"name":"Hustler","rarity":"Silver"},{"name":"Trade Sector","rarity":"Gold"},{"name":"Combat Training","rarity":"Silver"},{"name":"Thrill of the Hunt","rarity":"Gold"},{"name":"Component Grab Bag","rarity":"Silver"},{"name":"Rich Get Richer","rarity":"Prismatic"}],"master-yi-adaptor":[{"name":"Built Different","rarity":"Gold"},{"name":"Thrill of the Hunt","rarity":"Gold"},{"name":"Combat Training","rarity":"Silver"},{"name":"Last Stand","rarity":"Gold"},{"name":"Pandora's Items","rarity":"Gold"},{"name":"Radiant Relics","rarity":"Prismatic"}]};

const DEFAULT_AUGMENTS = [{"name":"Component Grab Bag","rarity":"Silver"},{"name":"Pandora's Items","rarity":"Gold"},{"name":"Built Different","rarity":"Gold"},{"name":"Jeweled Lotus","rarity":"Gold"},{"name":"Rich Get Richer","rarity":"Prismatic"},{"name":"Radiant Relics","rarity":"Prismatic"}];

const AUG_PRIO = {
  "Component Grab Bag":"items","Pandora's Items":"items","Item Grab Bag":"items","Radiant Relics":"items","Portable Forge":"items","Binary Airdrop":"items",
  "Rich Get Richer":"econ","Wise Spending":"econ","Hustler":"econ","Trade Sector":"econ",
  "Built Different":"combat","Last Stand":"combat","Thrill of the Hunt":"combat","Jeweled Lotus":"combat","Cybernetic Uplink":"combat","Dark Ritual":"combat","Combat Training":"combat",
  "New Recruit":"unit"
};

function prioLabel(p){
  if(lang==='ar'){
    return {items:'أيتمز',econ:'اقتصاد',combat:'كومبات',unit:'وحدات'}[p]||p;
  }
  if(lang==='ja'){
    return {items:'アイテム',econ:'経済',combat:'戦闘',unit:'ユニット'}[p]||p;
  }
  return {items:'Items',econ:'Econ',combat:'Combat',unit:'Units'}[p]||p;
}

function augmentIcon(name){
  const MAP={
    "Jeweled Lotus":"jeweled-lotus-ii","Rich Get Richer":"richgetricher2","Dark Ritual":"missing-t2",
    "Pandora's Items":"pandora1","Trade Sector":"trade2","Cybernetic Uplink":"cybernetic-uplink-ii",
    "Binary Airdrop":"binaryairdrop3","Component Grab Bag":"componentgrabbag-ii","Item Grab Bag":"itemgrabbag1",
    "Thrill of the Hunt":"thrillhunt1","Portable Forge":"portableforge2","Last Stand":"last-stand-ii",
    "Hustler":"hyperroll2","Combat Training":"combat-training-ii","New Recruit":"newrecruit3",
    "Radiant Relics":"radiantrelic-iii","Built Different":"builtdifferent2","Wise Spending":"wisespending3"
  };
  const slug=MAP[name];
  if(slug) return "assets/augments/"+slug+".png";
  try{
    const u=augmentImg(name);
    if(u) return u;
  }catch(e){}
  return "";
}
function augmentIconRemote(name){
  const MAP={
    "Jeweled Lotus":"jeweled-lotus-ii","Rich Get Richer":"richgetricher2","Dark Ritual":"missing-t2",
    "Pandora's Items":"pandora1","Trade Sector":"trade2","Cybernetic Uplink":"cybernetic-uplink-ii",
    "Binary Airdrop":"binaryairdrop3","Component Grab Bag":"componentgrabbag-ii","Item Grab Bag":"itemgrabbag1",
    "Thrill of the Hunt":"thrillhunt1","Portable Forge":"portableforge2","Last Stand":"last-stand-ii",
    "Hustler":"hyperroll2","Combat Training":"combat-training-ii","New Recruit":"newrecruit3",
    "Radiant Relics":"radiantrelic-iii","Built Different":"builtdifferent2","Wise Spending":"wisespending3"
  };
  const slug=MAP[name];
  if(slug) return "https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/augments/hexcore/"+slug+".png";
  try{return augmentImgRemote?augmentImgRemote(name):(augmentImg(name)||"");}catch(e){return"";}
}

function stageLabel(stage){
  const n=Number(stage)||0;
  if(lang==='ar'){ if(n<=2) return 'البدري'; if(n===3) return 'النص'; return 'الفاينل'; }
  if(lang==='ja'){ if(n<=2) return '序盤'; if(n===3) return '中盤'; return '終盤'; }
  if(n<=2) return 'Early'; if(n===3) return 'Mid'; return 'Late';
}

function playGuide(c){
  if(!c) return '';
  const stages=Array.isArray(c.stages)?c.stages:[];
  const how=localize(c.howToPlay)||localize(c.guide)||'';
  const early=(c.earlyUnits||[]).map(u=>unitChip(u,true)).join('');
  if(!stages.length&&!how&&!early) return '';
  const stageCards=stages.map(st=>{
    const text=localize(st.text)||localize(st.note)||'';
    if(!text) return '';
    return `<div class="play-stage"><div class="play-stage-head"><span class="play-stage-num">${st.stage??''}</span><span class="play-stage-label">${stageLabel(st.stage)}</span></div><p class="play-stage-text">${text}</p></div>`;
  }).join('');
  const earlyTitle=lang==='ar'?'وحدات البداية':lang==='ja'?'序盤ユニット':'Early units';
  const tipTitle=lang==='ar'?'نصيحة سريعة':lang==='ja'?'ポイント':'Quick tip';
  return `<section class="detail-section play-guide-section"><h2>${t('howToPlay')}</h2>${stageCards?`<div class="play-stages">${stageCards}</div>`:''}${early?`<div class="play-early"><span class="play-early-label">${earlyTitle}</span><div class="unit-row">${early}</div></div>`:''}${how?`<div class="play-tip"><span class="play-tip-label">${tipTitle}</span><p>${how}</p></div>`:''}</section>`;
}

function detectEconPlan(styleText){
  const s=(styleText||'').toLowerCase();
  if(/fast\s*9|فاست\s*9|ファスト\s*9/.test(s)) return 'fast9';
  if(/fast\s*8.?9|فاست\s*8.?9|ファスト\s*8.?9/.test(s)) return 'fast89';
  if(/fast\s*8|فاست\s*8|ファスト\s*8/.test(s)) return 'fast8';
  if(/slow\s*roll.*7.?8|سلو\s*رول.*7.?8|スローロール.*7.?8/.test(s)) return 'sr78';
  if(/slow\s*roll.*7|سلو\s*رول.*7|スローロール.*7|level\s*7\s*reroll|ريرول\s*لفل\s*7|レベル7/.test(s)) return 'sr7';
  if(/level\s*5.?6|لفل\s*5.?6|5.?6\s*reroll|ريرول\s*لفل\s*5/.test(s)) return 'rr56';
  if(/reroll\s*6.?7|ريرول\s*لفل\s*6.?7/.test(s)) return 'rr67';
  if(/level\s*6|لفل\s*6|reroll\s*6|ريرول\s*لفل\s*6|レベル6/.test(s)) return 'rr6';
  if(/low.?cost|رخيص/.test(s)) return 'sr7';
  return 'fast8';
}

function econPlanLines(key){
  const plans={
    fast8:{ar:['Stage 2–3: اقتصاد وون/لوس ستريك حسب اللوبي','Level: ادفع لفل 8 بسرعة (حوالي Stage 4-1)','Gold: حافظ على 50 دهب لما تقدر، رول خفيف لو ضعيف'],en:['Stage 2–3: Streak for interest','Level: Push to 8 around 4-1','Gold: Hold 50 when possible; light roll if weak'],ja:['Stage 2–3: ストリークで利息','Level: 4-1前後でレベル8','Gold: 可能なら50ゴールド維持']},
    fast89:{ar:['Stage 2–3: تيمبو قوي أو اقتصاد نظيف','Level: لفل 8 بدري، لفل 9 لو البورد مستقر','Gold: متبعترش دهب قبل 8 إلا للبقاء'],en:['Stage 2–3: Strong tempo or clean econ','Level: Hit 8 early, 9 if stable','Gold: Don’t burn gold before 8 unless surviving'],ja:['Stage 2–3: テンポか安定エコ','Level: 早めに8、安定なら9','Gold: 8前の無駄遣いを避ける']},
    fast9:{ar:['Stage 2–4: اقتصاد أقصى + تيمبو كافٍ للبقاء','Level: لفل 9 هدف أساسي (Stage 5)','Gold: 50+ طول الطريق، رول بس لما توصل 9'],en:['Stage 2–4: Max econ + enough tempo to live','Level: Level 9 is the goal (Stage 5)','Gold: Stay 50+; roll mainly at 9'],ja:['Stage 2–4: 最大エコ＋生存テンポ','Level: レベル9が目標（Stage5）','Gold: 50以上維持、主に9でロール']},
    sr78:{ar:['Stage 2: وون ستريك لو أمكن','Level: لفل 7 ثم سلو رول فوق 50','Gold: متنزلش تحت 50 وأنت بتسلو رول'],en:['Stage 2: Win-streak if possible','Level: Hit 7 then slow roll above 50','Gold: Don’t drop under 50 while slow rolling'],ja:['Stage 2: 可能ならウィンストリーク','Level: 7到達後50以上でスローロール','Gold: スローロール中は50を割らない']},
    sr7:{ar:['Stage 2–3: تيمبو بدري مستقر','Level: لفل 7 وسلو رول للـ2★','Gold: رول فوق 50، كمّل لفل 8 بعد ما تثبت'],en:['Stage 2–3: Stable early tempo','Level: Level 7 and slow roll for 2★','Gold: Roll above 50; level 8 after you stabilize'],ja:['Stage 2–3: 安定した序盤','Level: 7で2★狙いのスローロール','Gold: 50以上でロール、安定後に8']},
    rr6:{ar:['Stage 2: اجمع وحدات الريرول بدري','Level: لفل 6 ورول للـ3★','Gold: رول فوق 50 على 6، متستعجلش 7'],en:['Stage 2: Collect reroll units early','Level: Level 6 and roll for 3★','Gold: Roll above 50 at 6; don’t rush 7'],ja:['Stage 2: リロールユニットを早めに','Level: 6で3★狙い','Gold: 6で50以上ロール、7を急がない']},
    rr56:{ar:['Stage 1–2: افتح وحدات رخيصة فورًا','Level: لفل 5–6 ورول عنيف للـ3★','Gold: مصلحة الريرول أهم من الفائدة البنكية'],en:['Stage 1–2: Open cheap units immediately','Level: Level 5–6 and hard roll for 3★','Gold: Reroll value > pure interest'],ja:['Stage 1–2: 安いユニットをすぐ集める','Level: 5–6で3★ハードロール','Gold: 利息よりリロール優先']},
    rr67:{ar:['Stage 2–3: وحدات الريرول + تيمبو','Level: لفل 6–7 حسب قطعتك','Gold: رول فوق 50، ثبّت 2★/3★ قبل ما تطلع'],en:['Stage 2–3: Reroll units + tempo','Level: Level 6–7 depending on hits','Gold: Roll above 50; stabilize before leveling'],ja:['Stage 2–3: リロール＋テンポ','Level: 当たり次第で6–7','Gold: 50以上でロール、安定優先']}
  };
  const p=plans[key]||plans.fast8;
  return p[lang]||p.en;
}

function econSection(c){
  if(!c) return '';
  const styleText=localize(c.style)||'';
  const key=detectEconPlan(styleText||'');
  const lines=econPlanLines(key);
  if(!lines||!lines.length) return '';
  const title=lang==='ar'?'الاقتصاد واللفلنج':lang==='ja'?'経済とレベリング':'Economy & Leveling';
  const styleBadge=styleText?`<span class="econ-style">${styleText.replace(/^Playstyle:\s*|^أسلوب اللعب:\s*|^プレイスタイル[：:]\s*/i,'')}</span>`:'';
  const items=lines.map(line=>{
    const m=String(line).match(/^([^:]{2,18}):\s*(.+)$/);
    if(m) return `<li><strong>${m[1]}</strong> ${m[2]}</li>`;
    return `<li>${line}</li>`;
  }).join('');
  return `<section class="detail-section econ-section"><h2>${title}</h2>${styleBadge}<ul class="econ-list">${items}</ul></section>
  <style>.econ-section{margin-top:8px}.econ-style{display:inline-block;margin:0 0 10px;padding:4px 10px;border-radius:999px;background:rgba(233,185,100,.12);color:var(--gold);font:600 12px Outfit,Cairo,sans-serif}.econ-list{margin:0;padding:0;list-style:none;display:grid;gap:8px}.econ-list li{padding:10px 12px;border-radius:10px;border:1px solid var(--line);background:rgba(255,255,255,.03);font:500 13px Outfit,Cairo,sans-serif;line-height:1.45;color:var(--text)}.econ-list li strong{color:var(--gold);margin-inline-end:6px;font-weight:700}</style>`;
}

function augmentsSection(c){
  if(!c) return '';
  const list = (COMP_AUGMENTS[c.slug] || DEFAULT_AUGMENTS).slice(0,6);
  if(!list.length) return '';
  const title = lang==='ar' ? 'الأوجمنتس المقترحة' : lang==='ja' ? 'おすすめオーグメント' : 'Recommended Augments';
  const hint = lang==='ar'
    ? 'الأولوية حسب نوع الأوجمنت: أيتمز · اقتصاد · كومبات · وحدات — اختار اللي يناسب وضعك في اللوبي'
    : lang==='ja'
    ? '優先: アイテム · 経済 · 戦闘 · ユニット — 状況に合わせて選ぶ'
    : 'Priority by type: Items · Econ · Combat · Units — pick what fits your lobby';
  const cards = list.map((a,i)=>{
    const rarity=(a.rarity||'Gold');
    const name=a.name||'';
    const prio=a.prio||AUG_PRIO[name]||'combat';
    const pl=prioLabel(prio);
    const order=i+1;
    return `<div class="comp-aug rarity-${rarity.toLowerCase()} prio-${prio}" title="${name}">
      <span class="comp-aug-order">${order}</span>
      <img src="${augmentIcon(name)}" data-remote="${augmentIconRemote(name)}" alt="" width="36" height="36" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="if(!this.dataset.fb){this.dataset.fb=1;this.src=this.dataset.remote||'';}else{this.style.display='none'}">
      <div class="comp-aug-meta">
        <span class="comp-aug-name">${name}</span>
        <span class="comp-aug-tags"><span class="comp-aug-rarity">${rarity}</span><span class="comp-aug-prio">${pl}</span></span>
      </div>
    </div>`;
  }).join('');
  return `<section class="detail-section comp-augs-section">
    <h2>${title}</h2>
    <p class="comp-augs-hint">${hint}</p>
    <div class="comp-augs-grid">${cards}</div>
  </section>
  <style>
  .comp-augs-hint{margin:0 0 14px;color:var(--muted);font-size:13px;line-height:1.5}
  .comp-augs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px}
  .comp-aug{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;border:1px solid var(--line);background:rgba(255,255,255,.03);position:relative}
  .comp-aug-order{flex-shrink:0;width:20px;height:20px;border-radius:50%;background:rgba(233,185,100,.15);color:var(--gold);font:700 11px Outfit,sans-serif;display:flex;align-items:center;justify-content:center}
  .comp-aug img{width:36px;height:36px;object-fit:contain;flex-shrink:0;border-radius:8px;background:#0d111c}
  .comp-aug-meta{display:flex;flex-direction:column;gap:3px;min-width:0;flex:1}
  .comp-aug-name{font:600 13px Outfit,Cairo,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .comp-aug-tags{display:flex;gap:6px;align-items:center;flex-wrap:wrap}
  .comp-aug-rarity{font:600 11px Outfit,sans-serif;opacity:.75}
  .comp-aug.rarity-silver .comp-aug-rarity{color:#c8c8c8}
  .comp-aug.rarity-gold .comp-aug-rarity{color:#e9b964}
  .comp-aug.rarity-prismatic .comp-aug-rarity{color:#c47ae0}
  .comp-aug-prio{font:600 10px Outfit,Cairo,sans-serif;padding:2px 7px;border-radius:999px;background:rgba(255,255,255,.06);color:var(--muted)}
  .comp-aug.prio-items .comp-aug-prio{background:rgba(100,180,255,.12);color:#7ec8ff}
  .comp-aug.prio-econ .comp-aug-prio{background:rgba(80,200,120,.12);color:#6dce8a}
  .comp-aug.prio-combat .comp-aug-prio{background:rgba(233,100,100,.12);color:#f08a8a}
  .comp-aug.prio-unit .comp-aug-prio{background:rgba(180,140,255,.12);color:#c4a8ff}
  </style>`;
}

const slug=new URLSearchParams(location.search).get('slug');
let comp,patch;

function renderComp(c){
  if(!c) return `<p class="empty">${t('notFound')||'Not found'}</p>`;
  let html=detail(c);
  const guide=playGuide(c);
  const econ=econSection(c);
  const augs=augmentsSection(c);
  const extra=(guide||'')+(econ||'')+(augs||'');
  if(extra){
    if(html.includes('board-section')){
      html=html.replace(/(<section class="detail-section board-section">[\s\S]*?<\/section>)/, `$1\n  ${extra}`);
    } else if(html.includes('page-subtitle')){
      html=html.replace(/(<p class="page-subtitle">[\s\S]*?<\/p>)/, `$1\n  ${extra}`);
    } else {
      html=extra+html;
    }
  }
  return html;
}

function render(){
  const root=document.querySelector('#comp-detail')||document.querySelector('#comp-root');
  if(!root)return;
  if(!comp){root.innerHTML='<p class="empty">'+(t('notFound')||'Not found')+'</p>';return;}
  document.title=(localize(comp.name)||comp.slug)+' — MokaTroy TFT';
  root.innerHTML=renderComp(comp);
}

function normalizeList(x){
  if(Array.isArray(x)) return x;
  if(x && Array.isArray(x.comps)) return x.comps;
  return [];
}

const CDN='https://cdn.jsdelivr.net/gh/mokatroy/tftsite-v2@14a2ca5/data';
const loadJson=(local,cdn)=>fetch(local).then(async r=>{
  if(!r.ok) throw new Error('local');
  const d=await r.json();
  if(Array.isArray(d)&&d.length===0) throw new Error('empty');
  if(typeof d==='string') throw new Error('bad');
  return d;
}).catch(()=>fetch(cdn).then(r=>r.json()).catch(()=>[]));

Promise.all([
  loadJson('data/v2_comps.json', CDN+'/v2_comps.json').then(d=>normalizeList(d)).catch(()=>[]),
  loadJson('data/v2_comps_extra.json', CDN+'/v2_comps_extra.json'),
  loadJson('data/v2_comps_extra2.json', CDN+'/v2_comps_extra2.json'),
  loadJson('data/v2_comps_extra3.json', CDN+'/v2_comps_extra3.json'),
  fetch('data/patches.json').then(r=>r.json()).catch(()=>[])
]).then(([base,extra,extra2,extra3,ps])=>{
  patch=Array.isArray(ps)?ps[0]:ps;
  const list=[...normalizeList(base),...normalizeList(extra),...normalizeList(extra2),...normalizeList(extra3)];
  const seen=new Set();
  const merged=[];
  for(const c of list){
    if(!c||!c.slug||seen.has(c.slug)) continue;
    seen.add(c.slug);
    merged.push(c);
  }
  comp=merged.find(x=>x.slug===slug)||null;
  render();
});

setupLanguage(render);
