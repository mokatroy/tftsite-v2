import {setupLanguage,localize} from './locale.js';
import{compCard}from'./ui.js';
const load=path=>fetch(path).then(r=>{if(!r.ok)throw new Error(path);return r.json()});
let comps=[];
async function render(){
  try{
    const [compData,extra,extra2,extra3,patches]=await Promise.all([
      load('data/v2_comps.json').catch(()=>load('data/comps.json')),
      load('data/v2_comps_extra.json').catch(()=>[]),
      load('data/v2_comps_extra2.json').catch(()=>[]),
      load('data/v2_comps_extra3.json').catch(()=>[]),
      load('data/patches.json')
    ]);
    const base=Array.isArray(compData)?compData:(compData.comps||[]);
    const more=[...(Array.isArray(extra)?extra:[]),...(Array.isArray(extra2)?extra2:[]),...(Array.isArray(extra3)?extra3:[])];
    const seen=new Set(base.map(x=>x.slug));
    comps=base.concat(more.filter(x=>x&&x.slug&&!seen.has(x.slug)));
    const featured=comps.filter(c=>c.featured);
    const list=featured.length?featured:comps.slice(0,6);
    const el=document.querySelector('#featured-comps');
    if(el) el.innerHTML=list.map(compCard).join('');
    const p=patches[0];
    if(p){
      const sc=document.querySelector('#stat-comps'); if(sc) sc.textContent=comps.length;
      const sp=document.querySelector('#stat-patch'); if(sp) sp.textContent=p.version;
      const pv=document.querySelector('#patch-version'); if(pv) pv.textContent=p.version;
      const pt=document.querySelector('#patch-title'); if(pt) pt.textContent=localize(p.title);
      const ps=document.querySelector('#patch-summary'); if(ps) ps.textContent=localize(p.summary);
    }
  }catch(e){console.error(e)}
}
setupLanguage(render);render();
