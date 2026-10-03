import {setupLanguage,setPatchVersion,t,localize} from './locale.js';
import {patchPage} from './ui.js';
fetch('data/patches.json').then(r=>r.json()).then(patches=>{
  if(patches[0]) setPatchVersion(patches[0].version);
  const root=document.querySelector('#patch-root');
  if(root) root.innerHTML=patches.map(patchPage).join('');
  setupLanguage(()=>{root.innerHTML=patches.map(patchPage).join('')});
});
