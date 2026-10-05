import {t,localize,lang,localePath} from './locale.js';
import {traitImg} from './icons.js';

const COST={};
export function champImg(name){
  const n=String(name||'').replace(/\s+/g,'');
  return `https://ddragon.leagueoflegends.com/cdn/15.1.1/img/champion/${n}.png`;
}
export function itemImg(name){
  const map={'Guinsoo\'s Rageblade':'GuinsoosRageblade','Bloodthirster':'Bloodthirster','Last Whisper':'LastWhisper','Giant Slayer':'GiantSlayer','Infinity Edge':'InfinityEdge','Hand of Justice':'HandOfJustice','Edge of Night':'EdgeOfNight','Spear of Shojin':'SpearofShojin','Blue Buff':'BlueBuff','Rabadon\'s Deathcap':'RabadonsDeathcap','Archangel\'s Staff':'ArchangelsStaff','Jeweled Gauntlet':'JeweledGauntlet','Morellonomicon':'Morellonomicon','Sunfire Cape':'SunfireCape','Gargoyle Stoneplate':'GargoyleStoneplate','Warmog\'s Armor':'WarmogsArmor','Bramble Vest':'BrambleVest','Dragon\'s Claw':'DragonsClaw','Ionic Spark':'IonicSpark','Red Buff':'RedBuff','Titan\'s Resolve':'TitansResolve','Sterak\'s Gage':'SteraksGage','Hextech Gunblade':'HextechGunblade','Deathblade':'Deathblade','Kraken\'s Fury':'KrakensFury','Nashor\'s Tooth':'NashorsTooth','Adaptive Helm':'AdaptiveHelm','Protector\'s Vow':'ProtectorsVow','Spirit Visage':'SpiritVisage','Evenshroud':'Evenshroud','Steadfast Heart':'SteadfastHeart','Crownguard':'Crownguard','Void Staff':'VoidStaff'};
  const key=map[name]||String(name||'').replace(/[^a-zA-Z]/g,'');
  return `https://ddragon.leagueoflegends.com/cdn/15.1.1/img/item/${key}.png`;
}
export function unitChip(u, withImg=true){
  const name=typeof u==='string'?u:(u?.name?localize(u.name)||u.name:u?.en||u?.ar||'');
  const n=String(name||'');
  if(!n) return '';
  const img=withImg?`<img src="${champImg(n)}" alt="" loading="lazy" onerror="this.style.display='none'">`:'';
  return `<span class="unit-chip has-img" data-unit="${n}">${img}<span>${n}</span></span>`;
}
export function traitChip(tr){
  const name=typeof tr==='string'?tr:(tr?.name?localize(tr.name)||tr.name:'');
  const count=tr?.count!=null?` ${tr.count}`:'';
  const img=traitImg?traitImg(name):'';
  return `<span class="trait-chip" data-trait="${name}">${img?`<img src="${img}" alt="">`:''}<span>${name}${count}</span></span>`;
}
export function itemChip(name){
  const n=typeof name==='string'?name:(name?.name||'');
  if(!n) return '';
  return `<span class="item-chip has-img" data-item="${n}"><img src="${itemImg(n)}" alt="" loading="lazy" onerror="this.style.display='none'"><span>${n}</span></span>`;
}
export function compCard(c){
  const title=localize(c.name)||c.slug||'';
  const style=localize(c.style)||'';
  const summary=localize(c.summary)||'';
  const tier=(c.tier||'B').toLowerCase();
  const units=(c.units||[]).slice(0,8).map(u=>unitChip(u,true)).join('');
  return `<a class="comp-card tier-${tier}" href="${localePath('comp.html')}?slug=${c.slug}"><div class="comp-card-top"><span class="tier-badge">${(c.tier||'').toUpperCase()}</span><span class="style-pill">${style}</span></div><h3>${title}</h3><p>${summary}</p><div class="comp-units">${units}</div></a>`;
}
export function renderBoard(comp){
  const units=comp.units||[];
  if(!units.length) return '<p class="empty">—</p>';
  return `<div class="board-simple"><div class="unit-row large">${units.map(u=>unitChip(u,true)).join('')}</div></div>`;
}
export function detail(comp){
  if(!comp) return `<p class="empty">${t('notFound')}</p>`;
  const title=localize(comp.name)||comp.slug||'';
  const style=localize(comp.style)||'';
  const note=localize(comp.note)||localize(comp.summary)||'';
  const how=localize(comp.howToPlay)||localize(comp.guide)||'';
  const tier=(comp.tier||'A').toUpperCase();
  const traits=(comp.traits||[]).map(tr=>traitChip(tr)).join('');
  const items=(comp.items||comp.coreItems||[]).map(n=>itemChip(typeof n==='string'?n:n.name||n)).join('');
  const boardHtml=renderBoard(comp);
  const units=(comp.units||[]).map(u=>unitChip(u,true)).join('');
  const boardTitle=lang==='ar'?'توزيع البورد':lang==='ja'?'配置':'Board';
  return `<a class="back-link" href="${localePath('comps.html')}">${t('back')}</a>
  <p class="eyebrow"><span class="tier-badge">${tier}</span> <span class="style-pill">${style}</span></p>
  <h1 class="page-title">${title}</h1>
  <p class="page-subtitle">${note}</p>
  <section class="detail-section"><h2>${t('units')}</h2><div class="unit-row">${units}</div></section>
  <section class="detail-section board-section"><h2>${boardTitle}</h2>${boardHtml}</section>
  ${traits?`<section class="detail-section"><h2>${t('traits')}</h2><div class="trait-row">${traits}</div></section>`:''}
  ${items?`<section class="detail-section"><h2>${t('items')}</h2><div class="item-row">${items}</div></section>`:''}
  ${how?`<section class="detail-section"><h2>${t('howToPlay')}</h2><div class="guide">${how}</div></section>`:''}`;
}
export function patchPage(p){
  if(!p) return `<p class="empty">${t('notFound')}</p>`;
  const ver=p.version||'';
  const title=localize(p.title)||ver;
  const date=p.releaseDate||p.date||'';
  const summary=localize(p.summary)||'';
  let highlights=[];
  if(Array.isArray(p.highlights)) highlights=p.highlights.map(h=>localize(h)||(typeof h==='string'?h:'')).filter(Boolean);
  const changes=(p.changes||[]).map(ch=>{
    const who=localize(ch.unit||ch.name)||'';
    const text=localize(ch.detail||ch.text||ch.change)||'';
    return `<div class="patch-change"><strong>${who}</strong> ${text}</div>`;
  }).join('');
  return `<p class="eyebrow">PATCH NOTES</p><h1 class="page-title">${title}</h1><p class="page-subtitle">${ver}${date?` · ${date}`:''}</p>${summary?`<p class="guide">${summary}</p>`:''}${highlights.length?`<ul class="guide-list">${highlights.map(h=>`<li>${h}</li>`).join('')}</ul>`:''}${changes}`;
}
