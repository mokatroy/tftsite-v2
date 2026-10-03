import {setupLanguage,setPatchVersion,t,localize,localePath} from './locale.js';
import {renderCompDetail} from './ui.js';
const params=new URLSearchParams(location.search);
const slug=params.get('slug')||'';
Promise.all([
  fetch('data/v2_comps.json').then(r=>r.ok?r.json():[]).catch(()=>[]),
  fetch('data/v2_comps_extra.json').then(r=>r.ok?r.json():[]).catch(()=>[]),
  fetch('data/v2_comps_extra2.json').then(r=>r.ok?r.json():[]).catch(()=>[]),
  fetch('data/v2_comps_extra3.json').then(r=>r.ok?r.json():[]).catch(()=>[]),
  fetch('data/patches.json').then(r=>r.json())
]).then(([c,e1,e2,e3,p])=>{
  const all=[...(Array.isArray(c)?c:c.comps||[]),...(e1||[]),...(e2||[]),...(e3||[])];
  const comp=all.find(x=>x.slug===slug);
  if(p[0]) setPatchVersion(p[0].version);
  const root=document.querySelector('#comp-detail');
  function draw(){
    if(!root)return;
    if(!comp){root.innerHTML=`<p class="empty">${t('notFound')}</p>`;return;}
    root.innerHTML=renderCompDetail(comp);
  }
  draw();
  setupLanguage(draw);
});
