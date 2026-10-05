import {
  setupLanguage as setupLocaleLanguage,
  applyLanguage,
  LANG_LABEL
} from './locale.js?v=20261005lang';

export {
  copy, detectLang, lang, patchVersion, setPatchVersion, t, localize,
  LANGS, nextLang, localePath, LANG_LABEL, applyLanguage
} from './locale.js?v=20261005lang';

export function currentLocaleUrl(target='ar'){
  const u=new URL(location.href);
  if(target==='ar') u.searchParams.delete('lang');
  else u.searchParams.set('lang', target);
  return u.pathname+u.search+u.hash;
}

function setupMobileNav(){
  const header=document.querySelector('.site-header');
  const nav=header&&header.querySelector('nav');
  if(!header||!nav||header.querySelector('.nav-toggle')) return;
  const btn=document.createElement('button');
  btn.className='nav-toggle';
  btn.type='button';
  btn.setAttribute('aria-label','Menu');
  btn.setAttribute('aria-expanded','false');
  btn.innerHTML='<span></span><span></span><span></span>';
  btn.addEventListener('click',()=>{
    const open=header.classList.toggle('nav-open');
    btn.setAttribute('aria-expanded',open?'true':'false');
  });
  const langBtn=header.querySelector('.lang-toggle');
  header.insertBefore(btn, langBtn||null);
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    header.classList.remove('nav-open');
    btn.setAttribute('aria-expanded','false');
  }));
}

export function setupLanguage(onChange){
  setupLocaleLanguage(()=>{
    try{
      const cur=document.documentElement.lang||'ar';
      localStorage.setItem('tft_lang', cur);
      localStorage.setItem('tft-lang', cur);
    }catch(e){}
    if(typeof onChange==='function') onChange();
  });
  setupMobileNav();
}
