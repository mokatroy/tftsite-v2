import {setupLanguage,localize} from './locale.js?v=20261005nav';
import{compCard}from'./ui.js?v=20261005nav';
const load=path=>fetch(path).then(r=>{if(!r.ok)throw new Error(path);return r.json()});
let comps=[];
async function render(){
  const root=document.querySelector('#featured-comps');
  const patchTitle=document.querySelector('#patch-title');
  const patchSummary=document.querySelector('#patch-summary');
  const patchVersion=document.querySelector('#patch-version');
  const statComps=document.querySelector('#stat-comps');
  const statPatch=document.querySelector('#stat-patch');
  if(statComps) statComps.textContent=String(comps.length||'—');
  if(root){
    const featured=comps.filter(c=>(c.tier||'').toUpperCase()==='S'||(c.tier||'').toUpperCase()==='A').slice(0,6);
    root.innerHTML=(featured.length?featured:comps.slice(0,6)).map(c=>compCard(c)).join('')||'<p class="empty">—</p>';
  }
}
function normalizeList(x){
  if(Array.isArray(x)) return x;
  if(x&&Array.isArray(x.comps)) return x.comps;
  return [];
}
const CDN='https://cdn.jsdelivr.net/gh/mokatroy/tftsite-v2@14a2ca5/data';
const loadJson=(local,cdn)=>fetch(local).then(async r=>{
  if(!r.ok) throw new Error('local');
  const d=await r.json();
  if(Array.isArray(d)&&d.length===0) throw new Error('empty');
  return d;
}).catch(()=>fetch(cdn).then(r=>r.json()).catch(()=>[]));

Promise.all([
  loadJson('data/v2_comps.json', CDN+'/v2_comps.json'),
  loadJson('data/v2_comps_extra.json', CDN+'/v2_comps_extra.json'),
  loadJson('data/v2_comps_extra2.json', CDN+'/v2_comps_extra2.json'),
  loadJson('data/v2_comps_extra3.json', CDN+'/v2_comps_extra3.json'),
  fetch('data/patches.json?v=20261008p184').then(r=>r.json()).catch(()=>[])
]).then(([base,extra,extra2,extra3,ps])=>{
  const list=[...normalizeList(base),...normalizeList(extra),...normalizeList(extra2),...normalizeList(extra3)];
  const seen=new Set();
  comps=[];
  for(const c of list){
    if(!c||!c.slug||seen.has(c.slug)) continue;
    seen.add(c.slug);
    comps.push(c);
  }
  const patch=Array.isArray(ps)?ps[0]:ps;
  const patchTitle=document.querySelector('#patch-title');
  const patchSummary=document.querySelector('#patch-summary');
  const patchVersion=document.querySelector('#patch-version');
  const statPatch=document.querySelector('#stat-patch');
  if(patch){
    if(patchTitle) patchTitle.textContent=localize(patch.title)||patch.version||'';
    if(patchSummary) patchSummary.textContent=localize(patch.summary)||'';
    if(patchVersion) patchVersion.textContent=patch.version||'';
    if(statPatch) statPatch.textContent=patch.version||'—';
  }
  render();
});
setupLanguage(render);
