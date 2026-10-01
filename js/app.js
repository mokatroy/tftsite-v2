import {setupLanguage,localize} from './i18n.js';import{compCard}from'./ui.js';
const load=path=>fetch(path).then(r=>{if(!r.ok)throw new Error(path);return r.json()});let comps=[];
async function render(){
  try{
    const [compData,patches]=await Promise.all([
      load('data/v2_comps.json').catch(()=>load('data/comps.json')),
      load('data/patches.json')
    ]);
    comps=Array.isArray(compData)?compData:(compData.comps||[]);
    const featured=comps.filter(c=>c.featured);
    const list=featured.length?featured:comps.slice(0,6);
    document.querySelector('#featured-comps').innerHTML=list.map(compCard).join('');
    const p=patches[0];
    document.querySelector('#stat-comps').textContent=comps.length;
    document.querySelector('#stat-patch').textContent=p.version;
    document.querySelector('#patch-version').textContent=p.version;
    document.querySelector('#patch-title').textContent=localize(p.title);
    document.querySelector('#patch-summary').textContent=localize(p.summary);
  }catch(e){console.error(e)}
}
setupLanguage(render);render();
