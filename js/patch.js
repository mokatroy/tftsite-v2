import {setupLanguage} from './locale.js';
import {patchPage} from './ui.js';
let patches=[];
function render(){
  const root=document.querySelector('#patch-root')||document.querySelector('#patch-page');
  if(!root) return;
  if(!patches.length){ root.innerHTML='<p class="empty">…</p>'; return; }
  root.innerHTML=patchPage(patches[0]);
}
fetch('data/patches.json')
  .then(r=>r.json())
  .then(xs=>{ patches=Array.isArray(xs)?xs:[xs]; render(); })
  .catch(()=>{ const root=document.querySelector('#patch-root'); if(root) root.innerHTML='<p class="empty">—</p>'; });
setupLanguage(render);
