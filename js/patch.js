import {setupLanguage} from './i18n.js';
import {patchPage} from './ui.js';
let patches=[];
function render(){
  const root=document.querySelector('#patch-root')||document.querySelector('#patch-page');
  if(root) root.innerHTML=patchPage(patches[0]);
}
fetch('data/patches.json').then(r=>r.json()).then(xs=>{patches=xs;render()});
setupLanguage(render);
