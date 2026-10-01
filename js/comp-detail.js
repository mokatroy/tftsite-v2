import{setupLanguage,t,lang,localize}from'./i18n.js';import{detail}from'./ui.js';
const slug=new URLSearchParams(location.search).get('slug');
let comp,patch;
function render(){
  const root=document.querySelector('#comp-detail')||document.querySelector('#comp-root');
  if(!root)return;
  if(!comp){root.innerHTML='<p class="empty">'+(t('notFound')||'Not found')+'</p>';return;}
  document.title=(localize(comp.name)||comp.slug)+' — MokaTroy TFT';
  root.innerHTML=detail(comp,patch);
}
Promise.all([
  fetch('data/v2_comps.json').then(r=>r.ok?r.json():fetch('data/comps.json').then(r=>r.json())),
  fetch('data/patches.json').then(r=>r.json())
]).then(([xs,ps])=>{
  patch=ps[0];
  const list=Array.isArray(xs)?xs:(xs.comps||[]);
  comp=list.find(x=>x.slug===slug);
  render();
});
setupLanguage(render);
