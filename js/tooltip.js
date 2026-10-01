import {abilities} from './abilities.js';
import {lang,t} from './i18n.js';

let tip;
function ensureTip(){
  if(tip) return tip;
  tip=document.createElement('div');
  tip.className='ability-tip';
  document.body.appendChild(tip);
  return tip;
}

function render(el){
  const name=el.dataset.unit;
  const ab=abilities[name];
  const el2=ensureTip();
  const dispName=el.dataset.unitAr && lang==='ar'?el.dataset.unitAr:name;
  if(ab){
    const abName=lang==='ar'?ab.ar:ab.name;
    const abText=lang==='ar'?ab.text:ab.en;
    el2.innerHTML=`<strong class="tip-champ">${dispName}</strong><span class="tip-ability">${abName}</span><p>${abText}</p>`;
  } else {
    el2.innerHTML=`<strong class="tip-champ">${dispName}</strong><p class="tip-soon">${t('abilitySoon')}</p>`;
  }
  return el2;
}

function place(el,el2){
  const r=el.getBoundingClientRect();
  el2.style.display='block';
  const tw=el2.offsetWidth, th=el2.offsetHeight;
  let left=r.left+r.width/2-tw/2;
  left=Math.max(8,Math.min(left,window.innerWidth-tw-8));
  let top=r.top-th-10;
  let flipped=false;
  if(top<8){ top=r.bottom+10; flipped=true; }
  el2.style.left=left+'px';
  el2.style.top=top+window.scrollY+'px';
  const arrowLeft=Math.max(10,Math.min(r.left+r.width/2-left,tw-10));
  el2.style.setProperty('--arrow-left',arrowLeft+'px');
  el2.classList.toggle('flipped',flipped);
}

function hide(){ if(tip){ tip.style.display='none'; } }

let activeTapEl=null;
export function initAbilityTooltips(){
  document.addEventListener('mouseover',e=>{
    const el=e.target.closest('[data-unit]');
    if(!el) return;
    const el2=render(el);
    place(el,el2);
  });
  document.addEventListener('mouseout',e=>{
    const el=e.target.closest('[data-unit]');
    if(!el) return;
    if(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('[data-unit]')===el) return;
    hide();
  });
  document.addEventListener('click',e=>{
    const el=e.target.closest('[data-unit]');
    if(el){
      if(activeTapEl===el){ hide(); activeTapEl=null; return; }
      const el2=render(el);
      place(el,el2);
      activeTapEl=el;
    } else {
      hide(); activeTapEl=null;
    }
  });
  window.addEventListener('scroll',()=>{ hide(); activeTapEl=null; },true);
  window.addEventListener('resize',()=>{ hide(); activeTapEl=null; });
}
