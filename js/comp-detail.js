import{setupLanguage,t,lang,localize}from'./locale.js?v=20261005aug4';
import{detail,unitChip,traitChip,itemChip,renderBoard}from'./ui.js?v=20261005aug4';
import{augmentImg}from'./icons.js?v=20261005aug4';

const COMP_AUGMENTS = {"riftbeast-sentinel":[{"name":"Built Different","rarity":"Gold"},{"name":"Last Stand","rarity":"Gold"},{"name":"Thrill of the Hunt","rarity":"Gold"},{"name":"Component Grab Bag","rarity":"Silver"},{"name":"Cybernetic Uplink","rarity":"Silver"},{"name":"Radiant Relics","rarity":"Prismatic"}],"elderwood-xayah":[{"name":"Jeweled Lotus","rarity":"Gold"},{"name":"Thrill of the Hunt","rarity":"Gold"},{"name":"Combat Training","rarity":"Silver"},{"name":"Pandora's Items","rarity":"Gold"},{"name":"Item Grab Bag","rarity":"Silver"},{"name":"Radiant Relics","rarity":"Prismatic"}],"vanguard-alune":[{"name":"Jeweled Lotus","rarity":"Gold"},{"name":"Cybernetic Uplink","rarity":"Silver"},{"name":"Built Different","rarity":"Gold"},{"name":"Component Grab Bag","rarity":"Silver"},{"name":"Dark Ritual","rarity":"Gold"},{"name":"Rich Get Richer","rarity":"Prismatic"}],"hunter-sivir":[{"name":"Thrill of the Hunt","rarity":"Gold"},{"name":"Combat Training","rarity":"Silver"},{"name":"Jeweled Lotus","rarity":"Gold"},{"name":"Pandora's Items","rarity":"Gold"},{"name":"Hustler","rarity":"Silver"},{"name":"Radiant Relics","rarity":"Prismatic"}],"spellweaver-veigar":[{"name":"Jeweled Lotus","rarity":"Gold"},{"name":"Cybernetic Uplink","rarity":"Silver"},{"name":"Dark Ritual","rarity":"Gold"},{"name":"Component Grab Bag","rarity":"Silver"},{"name":"Trade Sector","rarity":"Gold"},{"name":"Rich Get Richer","rarity":"Prismatic"}],"flora-azir":[{"name":"Jeweled Lotus","rarity":"Gold"},{"name":"New Recruit","rarity":"Gold"},{"name":"Component Grab Bag","rarity":"Silver"},{"name":"Built Different","rarity":"Gold"},{"name":"Wise Spending","rarity":"Silver"},{"name":"Radiant Relics","rarity":"Prismatic"}],"defender-cass":[{"name":"Jeweled Lotus","rarity":"Gold"},{"name":"Built Different","rarity":"Gold"},{"name":"Last Stand","rarity":"Gold"},{"name":"Cybernetic Uplink","rarity":"Silver"},{"name":"Component Grab Bag","rarity":"Silver"},{"name":"Portable Forge","rarity":"Prismatic"}],"juggernaut-flex":[{"name":"Built Different","rarity":"Gold"},{"name":"Last Stand","rarity":"Gold"},{"name":"Thrill of the Hunt","rarity":"Gold"},{"name":"Combat Training","rarity":"Silver"},{"name":"Pandora's Items","rarity":"Gold"},{"name":"Radiant Relics","rarity":"Prismatic"}],"lunar-aphelios":[{"name":"Thrill of the Hunt","rarity":"Gold"},{"name":"Built Different","rarity":"Gold"},{"name":"Combat Training","rarity":"Silver"},{"name":"Component Grab Bag","rarity":"Silver"},{"name":"Pandora's Items","rarity":"Gold"},{"name":"Radiant Relics","rarity":"Prismatic"}],"blackthorn-lulu":[{"name":"Jeweled Lotus","rarity":"Gold"},{"name":"Cybernetic Uplink","rarity":"Silver"},{"name":"New Recruit","rarity":"Gold"},{"name":"Component Grab Bag","rarity":"Silver"},{"name":"Trade Sector","rarity":"Gold"},{"name":"Rich Get Richer","rarity":"Prismatic"}],"arcanist-lux":[{"name":"Jeweled Lotus","rarity":"Gold"},{"name":"Cybernetic Uplink","rarity":"Silver"},{"name":"Dark Ritual","rarity":"Gold"},{"name":"Component Grab Bag","rarity":"Silver"},{"name":"Pandora's Items","rarity":"Gold"},{"name":"Radiant Relics","rarity":"Prismatic"}],"warden-ornn":[{"name":"Built Different","rarity":"Gold"},{"name":"Last Stand","rarity":"Gold"},{"name":"Component Grab Bag","rarity":"Silver"},{"name":"Cybernetic Uplink","rarity":"Silver"},{"name":"Portable Forge","rarity":"Prismatic"},{"name":"Radiant Relics","rarity":"Prismatic"}],"sivir-nidalee":[{"name":"Thrill of the Hunt","rarity":"Gold"},{"name":"Combat Training","rarity":"Silver"},{"name":"Jeweled Lotus","rarity":"Gold"},{"name":"Hustler","rarity":"Silver"},{"name":"Pandora's Items","rarity":"Gold"},{"name":"Rich Get Richer","rarity":"Prismatic"}],"draven-fast9":[{"name":"Rich Get Richer","rarity":"Prismatic"},{"name":"Wise Spending","rarity":"Silver"},{"name":"Hustler","rarity":"Silver"},{"name":"Trade Sector","rarity":"Gold"},{"name":"Item Grab Bag","rarity":"Silver"},{"name":"Radiant Relics","rarity":"Prismatic"}],"vanguard-aphelios":[{"name":"Thrill of the Hunt","rarity":"Gold"},{"name":"Built Different","rarity":"Gold"},{"name":"Combat Training","rarity":"Silver"},{"name":"Component Grab Bag","rarity":"Silver"},{"name":"Pandora's Items","rarity":"Gold"},{"name":"Radiant Relics","rarity":"Prismatic"}],"solar-yunara":[{"name":"Jeweled Lotus","rarity":"Gold"},{"name":"Thrill of the Hunt","rarity":"Gold"},{"name":"Combat Training","rarity":"Silver"},{"name":"Component Grab Bag","rarity":"Silver"},{"name":"New Recruit","rarity":"Gold"},{"name":"Rich Get Richer","rarity":"Prismatic"}],"warwick-ravager":[{"name":"Built Different","rarity":"Gold"},{"name":"Last Stand","rarity":"Gold"},{"name":"Thrill of the Hunt","rarity":"Gold"},{"name":"Combat Training","rarity":"Silver"},{"name":"Hustler","rarity":"Silver"},{"name":"Binary Airdrop","rarity":"Prismatic"}],"caitlyn-reroll":[{"name":"Hustler","rarity":"Silver"},{"name":"Trade Sector","rarity":"Gold"},{"name":"Combat Training","rarity":"Silver"},{"name":"Thrill of the Hunt","rarity":"Gold"},{"name":"Component Grab Bag","rarity":"Silver"},{"name":"Rich Get Richer","rarity":"Prismatic"}],"master-yi-adaptor":[{"name":"Built Different","rarity":"Gold"},{"name":"Thrill of the Hunt","rarity":"Gold"},{"name":"Combat Training","rarity":"Silver"},{"name":"Last Stand","rarity":"Gold"},{"name":"Pandora's Items","rarity":"Gold"},{"name":"Radiant Relics","rarity":"Prismatic"}]};

const slug=new URLSearchParams(location.search).get('slug');
let comp,patch;

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

const DEFAULT_AUGMENTS = [{"name": "Component Grab Bag", "rarity": "Silver"}, {"name": "Pandora's Items", "rarity": "Gold"}, {"name": "Built Different", "rarity": "Gold"}, {"name": "Jeweled Lotus", "rarity": "Gold"}, {"name": "Rich Get Richer", "rarity": "Prismatic"}, {"name": "Radiant Relics", "rarity": "Prismatic"}];

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
  if(slug) return "https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/augments/hexcore/"+slug+".png";
  try{return augmentImg(name)||"";}catch(e){return"";}
}

function augmentsSection(c){
  if(!c) return '';
  const list = (COMP_AUGMENTS[c.slug] || DEFAULT_AUGMENTS).slice(0,6);
  if(!list.length) return '';
  const title = lang==='ar' ? 'الأوجمنتس المقترحة' : lang==='ja' ? 'おすすめオーグメント' : 'Recommended Augments';
  const hint = lang==='ar' ? 'أولويات عامة — اختار حسب الأوجمنتس اللي بتظهرلك' : lang==='ja' ? '目安です。出たものから優先' : 'General priorities — pick from what you hit';
  const cards = list.map(a=>{
    const rarity=(a.rarity||'Gold');
    const name=a.name||'';
    return `<div class="comp-aug rarity-${rarity.toLowerCase()}" title="${name}">
      <img src="${augmentIcon(name)}" alt="" width="36" height="36" loading="eager" decoding="async" referrerpolicy="no-referrer">
      <div class="comp-aug-meta">
        <span class="comp-aug-name">${name}</span>
        <span class="comp-aug-rarity">${rarity}</span>
      </div>
    </div>`;
  }).join('');
  return `<section class="detail-section comp-augs-section">
    <h2>${title}</h2>
    <p class="comp-augs-hint">${hint}</p>
    <div class="comp-augs-grid">${cards}</div>
  </section>
  <style>
  .comp-augs-hint{margin:0 0 14px;color:var(--muted);font-size:13px}
  .comp-augs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px}
  .comp-aug{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;border:1px solid var(--line);background:rgba(255,255,255,.03)}
  .comp-aug img{width:36px;height:36px;object-fit:contain;flex-shrink:0;border-radius:8px;background:#0d111c}
  .comp-aug-meta{display:flex;flex-direction:column;gap:2px;min-width:0}
  .comp-aug-name{font:600 13px Outfit,Cairo,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .comp-aug-rarity{font:600 11px Outfit,sans-serif;opacity:.75}
  .comp-aug.rarity-silver .comp-aug-rarity{color:#c8c8c8}
  .comp-aug.rarity-gold .comp-aug-rarity{color:#e9b964}
  .comp-aug.rarity-prismatic .comp-aug-rarity{color:#c47ae0}
  </style>`;
}

function renderComp(c){
  if(!c) return `<p class="empty">${t('notFound')||'Not found'}</p>`;
  let html=detail(c);
  const guide=playGuide(c);
  const augs=augmentsSection(c);
  const extra=(guide||'')+(augs||'');
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
