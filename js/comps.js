import {setupLanguage,setPatchVersion,t,localize,localePath} from './locale.js?v=20261015meta';
import{compCard,unitChip}from'./ui.js?v=20261012stats';
let comps=[],situational=[],tier='All',query='';

const TIER_18_4 = {
  'riftbeast-pebbles':'S','flora-azir':'S','azir-rammus':'S',
  'lunar-aphelios-nidalee':'S','lunarwood-khazix':'S','invoker-morgana-sentinel':'S',
  'defender-rengar':'S','elderwood-aphelios':'S',
  'vanguard-alune':'A','elderwood-xayah':'A','riftbeast-sentinel':'A',
  'hunter-sivir':'A','executioner-khazix':'A','defender-cass':'A',
  'invoker-ahri':'A','sivir-nidalee':'A','draven-fast9':'A',
  'vanguard-aphelios':'A','akali-reroll':'A','juggernaut-zyra':'A',
  'executioner-soraka':'A','solar-kayle':'A',
  'spellweaver-veigar':'B','juggernaut-flex':'B','juggernaut-ashe':'B',
  'solar-yunara':'B','warwick-ravager':'B','caitlyn-reroll':'B',
  'master-yi-adaptor':'B','eclipse-kayle':'B','malphite-ap-flex':'B'
};
function applyPatchTiers(list){
  return (list||[]).map(c=>{
    if(!c||!c.slug) return c;
    const t = TIER_18_4[c.slug];
    return t ? Object.assign({}, c, {tier:t}) : c;
  });
}

const root=document.querySelector('#comps-grid') || document.querySelector('#comps-list');
const situationalRoot=document.querySelector('#situational-list');
function renderSituational(){
  if(!situationalRoot)return;
  const section=document.querySelector('#situational-section');
  const q=(query||'').toLowerCase().trim();
  const list=situational.filter(c=>{
    if(!q) return true;
    try{ return JSON.stringify(c).toLowerCase().includes(q); }catch(e){ return true; }
  });
  if(section) section.hidden = !situational.length;
  if(!list.length){
    situationalRoot.innerHTML = situational.length
      ? `<p class="empty">${t('notFound')}</p>`
      : '';
    return;
  }
  situationalRoot.innerHTML=list.map(c=>{
    const title=localize(c.title)||c.name||c.slug||'';
    const style=localize(c.style)||'';
    const note=localize(c.note)||'';
    const augs=(c.augments||[]).slice(0,4).map(a=>`<span>${a}</span>`).join('');
    const slug=c.slug||'';
    const req=c.requiredAugment?`<span class="req-aug">${c.requiredAugment}</span>`:'';
    const board=(c.guide&&c.guide.board||[]).slice(0,8).map(n=>unitChip(n,true)).join('');
    const itemPreview=(c.guide&&c.guide.items||[]).slice(0,2).map(row=>{
      const its=(row.items||[]).slice(0,3).map(n=>`<span class="chip item">${n}</span>`).join('');
      return `<div class="sit-card-items"><strong>${row.unit||''}</strong>${its}</div>`;
    }).join('');
    return `<article class="situational-card"><div class="situational-card-head"><div><span class="situational-label">SITUATIONAL</span>${req}<h3>${title}</h3><p class="style-line">${style}</p></div><a class="situational-open" href="${localePath('situational.html')}?slug=${slug}">${t('situationalOpen')||'Open'} ↗</a></div><p class="situational-note">${note}</p>${board?`<div class="unit-list">${board}</div>`:''}${itemPreview}<div class="situational-augments">${augs}</div></article>`;
  }).join('');
}
function render(){
  if(!root)return;
  const filtered=comps.filter(c=>{
    const matchTier=tier==='All'||c.tier===tier;
    const matchQ=!query||JSON.stringify(c).toLowerCase().includes(query.toLowerCase());
    return matchTier&&matchQ;
  });
  root.innerHTML=filtered.length?filtered.map(compCard).join(''):`<p class="empty">${t('notFound')}</p>`;
  const filters=document.querySelector('#tier-filters');
  if(filters){
    filters.innerHTML=['All','S','A','B'].map(x=>`<button class="${tier===x?'active':''}" data-tier="${x}">${x==='All'?t('all'):x}</button>`).join('');
    filters.querySelectorAll('[data-tier]').forEach(b=>b.onclick=()=>{tier=b.dataset.tier;render()});
  }
}
const CDN='https://cdn.jsdelivr.net/gh/mokatroy/tftsite-v2@14a2ca5/data';
const loadJson=(local,cdn)=>fetch(local).then(async r=>{
  if(!r.ok) throw new Error('local');
  const d=await r.json();
  if(Array.isArray(d)&&d.length===0) throw new Error('empty');
  if(typeof d==='string') throw new Error('bad');
  return d;
}).catch(()=>fetch(cdn).then(r=>r.json()).catch(()=>[]));
Promise.all([
  loadJson('data/v2_comps.json', CDN+'/v2_comps.json').then(d=>Array.isArray(d)?d:(d.comps||[])).catch(()=>[]),
  loadJson('data/v2_comps_extra.json', CDN+'/v2_comps_extra.json'),
  loadJson('data/v2_comps_extra2.json', CDN+'/v2_comps_extra2.json'),
  loadJson('data/v2_comps_extra3.json', CDN+'/v2_comps_extra3.json'),
  loadJson('data/v2_comps_extra4.json', 'https://cdn.jsdelivr.net/gh/mokatroy/tftsite-v2@6a63287/data/v2_comps_extra4.json'),
  loadJson('data/v2_comps_extra5.json', 'https://cdn.jsdelivr.net/gh/mokatroy/tftsite-v2@main/data/v2_comps_extra5.json'),
  fetch('data/v2_situational-comps.json').then(r=>r.ok?r.json():[]).catch(()=>[]),
  fetch('data/v2_situational_extra.json').then(r=>r.ok?r.json():[]).catch(()=>[]),
  fetch('data/patches.json?v=20261010p184c').then(r=>r.ok?r.json():[]).catch(()=>[])
]).then(([c,extra,extra2,extra3,extra4,extra5,s,sx,p])=>{
  const base=Array.isArray(c)?c:(c.comps||[]);
  const more=[...(Array.isArray(extra)?extra:[]), ...(Array.isArray(extra2)?extra2:[]), ...(Array.isArray(extra3)?extra3:[]), ...(Array.isArray(extra4)?extra4:[]), ...(Array.isArray(extra5)?extra5:[])];
  const seen=new Set(base.map(x=>x.slug));
  comps=applyPatchTiers(base.concat(more.filter(x=>x&&x.slug&&!seen.has(x.slug))));
  const sitBase=Array.isArray(s)?s:[];
  const sitExtra=Array.isArray(sx)?sx:[];
  const sitSeen=new Set(sitBase.map(x=>x.slug));
  situational=sitBase.concat(sitExtra.filter(x=>x&&x.slug&&!sitSeen.has(x.slug)));
  if(Array.isArray(p)&&p[0]) setPatchVersion(p[0].version);
  render();renderSituational();
}).catch(e=>{console.error('comps load',e);render();});
const search=document.querySelector('#comp-search');
if(search) search.addEventListener('input',e=>{query=e.target.value;render();renderSituational()});
setupLanguage(()=>{render();renderSituational()});
