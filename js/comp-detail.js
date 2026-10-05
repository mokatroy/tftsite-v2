import{setupLanguage,t,lang,localize}from'./locale.js?v=20261005k';
import{detail,unitChip,traitChip,itemChip,renderBoard}from'./ui.js?v=20261005k';

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

function renderComp(c){
  if(!c) return `<p class="empty">${t('notFound')||'Not found'}</p>`;
  let html=detail(c);
  const guide=playGuide(c);
  if(guide){
    if(html.includes('board-section')){
      html=html.replace(/(<section class="detail-section board-section">[\s\S]*?<\/section>)/, `$1\n  ${guide}`);
    } else if(html.includes('page-subtitle')){
      html=html.replace(/(<p class="page-subtitle">[\s\S]*?<\/p>)/, `$1\n  ${guide}`);
    } else {
      html=guide+html;
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
