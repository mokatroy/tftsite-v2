import{setupLanguage,t,lang,localize}from'./i18n.js';
import{detail}from'./ui.js';

const slug=new URLSearchParams(location.search).get('slug');
let comp,patch;

function render(){
  const root=document.querySelector('#comp-detail')||document.querySelector('#comp-root');
  if(!root)return;
  if(!comp){root.innerHTML='<p class="empty">'+(t('notFound')||'Not found')+'</p>';return;}
  document.title=(localize(comp.name)||comp.slug)+' — MokaTroy TFT';
  root.innerHTML=detail(comp,patch);
}

function normalizeList(x){
  if(Array.isArray(x)) return x;
  if(x && Array.isArray(x.comps)) return x.comps;
  return [];
}

Promise.all([
  fetch('data/v2_comps.json').then(r=>r.ok?r.json():fetch('data/comps.json').then(r=>r.json())).catch(()=>[]),
  fetch('data/v2_comps_extra.json').then(r=>r.ok?r.json():[]).catch(()=>[]),
  fetch('data/v2_comps_extra2.json').then(r=>r.ok?r.json():[]).catch(()=>[]),
  fetch('data/patches.json').then(r=>r.json()).catch(()=>[])
]).then(([base,extra,extra2,ps])=>{
  patch=Array.isArray(ps)?ps[0]:ps;
  const list=[
    ...normalizeList(base),
    ...normalizeList(extra),
    ...normalizeList(extra2)
  ];
  const seen=new Set();
  const merged=[];
  for(const c of list){
    if(!c||!c.slug||seen.has(c.slug)) continue;
    seen.add(c.slug);
    merged.push(c);
  }
  comp=merged.find(x=>x.slug===slug) || null;
  render();
});

setupLanguage(render);
