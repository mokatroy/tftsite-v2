import {setupLanguage,setPatchVersion,t,localize,localePath} from './locale.js?v=20261005fix';
import{compCard}from'./ui.js?v=20261005fix';
let comps=[],situational=[],tier='All',query='';

const TIER_18_4 = {
  'riftbeast-sentinel':'S','elderwood-xayah':'S','vanguard-alune':'S',
  'hunter-sivir':'A','juggernaut-flex':'A','spellweaver-veigar':'B',
  'flora-azir':'S','defender-cass':'A','lunar-aphelios-nidalee':'S',
  'invoker-ahri':'A','executioner-khazix':'S','juggernaut-ashe':'B',
  'invoker-morgana-sentinel':'S','sivir-nidalee':'A','draven-fast9':'A',
  'vanguard-aphelios':'A','solar-yunara':'B','warwick-ravager':'B',
  'caitlyn-reroll':'A','master-yi-adaptor':'B'
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
  situationalRoot.innerHTML=situational.map(c=>{
    const title=localize(c.title)||c.name||c.slug||'';
    const style=localize(c.style)||'';
    const note=localize(c.note)||'';
    const augs=(c.augments||[]).map(a=>`<span>${a}</span>`).join('');
    const slug=c.slug||'';
    return `<article class="situational-card"><div class="situational-card-head"><div><span class="situational-label">SITUATIONAL</span><h3>${title}</h3><p>${style}</p></div><a class="situational-open" href="${localePath('situational.html')}?slug=${slug}">${t('situationalOpen')||'Open'} ↗</a></div><p class="situational-note">${note}</p><div class="situational-augments">${augs}</div></article>`;
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
  fetch('data/v2_situational-comps.json').then(r=>r.ok?r.json():[]).catch(()=>[]),
  fetch('data/v2_situational_extra.json').then(r=>r.ok?r.json():[]).catch(()=>[]),
  fetch('data/patches.json?v=20261008p184').then(r=>r.json())
]).then(([c,extra,extra2,extra3,s,sx,p])=>{
  const base=Array.isArray(c)?c:(c.comps||[]);
  const more=[...(Array.isArray(extra)?extra:[]), ...(Array.isArray(extra2)?extra2:[]), ...(Array.isArray(extra3)?extra3:[])];
  const seen=new Set(base.map(x=>x.slug));
  comps=applyPatchTiers(base.concat(more.filter(x=>x&&x.slug&&!seen.has(x.slug))));
  const sitBase=Array.isArray(s)?s:[];
  const sitExtra=Array.isArray(sx)?sx:[];
  const sitSeen=new Set(sitBase.map(x=>x.slug));
  situational=sitBase.concat(sitExtra.filter(x=>x&&x.slug&&!sitSeen.has(x.slug)));
  if(p[0]) setPatchVersion(p[0].version);
  render();renderSituational();
});
const search=document.querySelector('#comp-search');
if(search) search.addEventListener('input',e=>{query=e.target.value;render()});
setupLanguage(()=>{render();renderSituational()});
