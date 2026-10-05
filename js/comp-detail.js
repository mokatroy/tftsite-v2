import{setupLanguage,t,lang,localize}from'./locale.js';
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
  const list=[
    ...normalizeList(base),
    ...normalizeList(extra),
    ...normalizeList(extra2),
    ...normalizeList(extra3)
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
