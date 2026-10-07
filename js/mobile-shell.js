/** Mobile bottom tab bar — inject only on narrow viewports */
(function(){
  const MQ = window.matchMedia('(max-width:900px)');
  const TABS = [
    { href:'index.html', key:'navHome', ar:'الرئيسية', en:'Home', ja:'ホーム', ico:'⌂' },
    { href:'comps.html', key:'navComps', ar:'التشكيلات', en:'Comps', ja:'編成', ico:'◆' },
    { href:'builder.html', key:'navBuilder', ar:'البناء', en:'Builder', ja:'ビルダー', ico:'✦' },
    { href:'augments.html', key:'navAugments', ar:'أوجمنت', en:'Augments', ja:'オーグ', ico:'◈' },
    { href:'champions.html', key:'navChampions', ar:'أبطال', en:'Champs', ja:'チャンピオン', ico:'★' }
  ];

  function lang(){
    try{
      const l = (localStorage.getItem('tft_lang')||document.documentElement.lang||'ar').slice(0,2);
      return l==='ja'?'ja':l==='en'?'en':'ar';
    }catch(e){ return 'ar'; }
  }

  function label(tab){
    const L = lang();
    return tab[L]||tab.en;
  }

  function current(){
    const p = (location.pathname.split('/').pop()||'index.html').toLowerCase();
    if(p==='comp.html') return 'comps.html';
    return p || 'index.html';
  }

  function build(){
    let bar = document.querySelector('.mobile-tabbar');
    if(!bar){
      bar = document.createElement('nav');
      bar.className = 'mobile-tabbar';
      bar.setAttribute('aria-label','Mobile navigation');
      document.body.appendChild(bar);
    }
    const cur = current();
    bar.innerHTML = TABS.map(tab=>{
      const active = cur===tab.href || (tab.href==='comps.html' && cur==='comp.html') ? ' active' : '';
      return `<a class="${active.trim()}" href="${tab.href}"><span class="tab-ico">${tab.ico}</span><span>${label(tab)}</span></a>`;
    }).join('');
  }

  function sync(){
    if(MQ.matches) build();
    else {
      const bar = document.querySelector('.mobile-tabbar');
      if(bar) bar.remove();
    }
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', sync);
  else sync();
  MQ.addEventListener('change', sync);
  window.addEventListener('storage', sync);
})();
