import {t,localize,lang,localePath} from './locale.js?v=20261005c';
import {traitImg} from './icons.js?v=20261005c';

const CHAMP_ALIAS = {pebbles:'sentry','mama beak':'raptor',mamabeak:'raptor','ancient golem':'golem',scuttlecrab:'scuttlecrab',cinderling:'cinderling',brambleback:'brambleback',gromp:'gromp',krug:'krug'};
const CHAMP_COST = {xayah:4,ezreal:3,aphelios:4,sivir:3,ashe:2,draven:4,caitlyn:5,yunara:4,nidalee:3,khazix:3,warwick:2,masteryi:5,gnar:2,rakan:3,alune:4,veigar:3,azir:4,cassiopeia:3,ahri:4,morgana:3,amumu:1,taric:2,sentinel:1,krug:2,pebbles:1,cinderling:1,scuttlecrab:1,gromp:2,brambleback:3,'mama beak':3,mamabeak:3};
const CHAMP_BIS = {
  xayah: ["Guinsoo's Rageblade","Last Whisper","Bloodthirster"],
  ezreal: ["Guinsoo's Rageblade","Spear of Shojin","Last Whisper"],
  aphelios: ["Infinity Edge","Last Whisper","Giant Slayer"],
  sivir: ["Infinity Edge","Last Whisper","Bloodthirster"],
  ashe: ["Guinsoo's Rageblade","Last Whisper","Giant Slayer"],
  draven: ["Infinity Edge","Bloodthirster","Last Whisper"],
  caitlyn: ["Infinity Edge","Last Whisper","Giant Slayer"],
  yunara: ["Guinsoo's Rageblade","Infinity Edge","Last Whisper"],
  nidalee: ["Infinity Edge","Last Whisper","Bloodthirster"],
  khazix: ["Infinity Edge","Bloodthirster","Titan's Resolve"],
  warwick: ["Titan's Resolve","Bloodthirster","Sterak's Gage"],
  masteryi: ["Guinsoo's Rageblade","Bloodthirster","Titan's Resolve"],
  gnar: ["Titan's Resolve","Bloodthirster","Sterak's Gage"],
  rakan: ["Warmog's Armor","Gargoyle Stoneplate","Sunfire Cape"],
  alune: ["Blue Buff","Jeweled Gauntlet","Rabadon's Deathcap"],
  veigar: ["Blue Buff","Jeweled Gauntlet","Rabadon's Deathcap"],
  azir: ["Spear of Shojin","Jeweled Gauntlet","Rabadon's Deathcap"],
  cassiopeia: ["Blue Buff","Jeweled Gauntlet","Morellonomicon"],
  ahri: ["Blue Buff","Jeweled Gauntlet","Rabadon's Deathcap"],
  morgana: ["Blue Buff","Jeweled Gauntlet","Morellonomicon"],
  amumu: ["Warmog's Armor","Gargoyle Stoneplate","Sunfire Cape"],
  taric: ["Warmog's Armor","Gargoyle Stoneplate","Sunfire Cape"],
  sentinel: ["Warmog's Armor","Gargoyle Stoneplate","Sunfire Cape"],
  krug: ["Warmog's Armor","Titan's Resolve","Sterak's Gage"],
  pebbles: ["Blue Buff","Jeweled Gauntlet","Rabadon's Deathcap"],
  cinderling: ["Guinsoo's Rageblade","Last Whisper","Bloodthirster"],
  scuttlecrab: ["Warmog's Armor","Gargoyle Stoneplate","Bramble Vest"],
  gromp: ["Warmog's Armor","Dragon's Claw","Gargoyle Stoneplate"],
  brambleback: ["Titan's Resolve","Bloodthirster","Sterak's Gage"],
  'mama beak': ["Warmog's Armor","Gargoyle Stoneplate","Sunfire Cape"],
  mamabeak: ["Warmog's Armor","Gargoyle Stoneplate","Sunfire Cape"]
};
const TANK_BIS = ["Warmog's Armor","Gargoyle Stoneplate","Sunfire Cape"];
const AP_BIS = ["Blue Buff","Jeweled Gauntlet","Rabadon's Deathcap"];
const AD_BIS = ["Infinity Edge","Last Whisper","Bloodthirster"];
const ROLE_MAP = {
  tank:['amumu','taric','sentinel','scuttlecrab','gromp','rakan','mama beak','mamabeak'],
  ap:['alune','veigar','azir','cassiopeia','ahri','morgana','pebbles'],
  ad:['xayah','ezreal','aphelios','sivir','ashe','draven','caitlyn','yunara','nidalee','khazix','cinderling'],
  flex:['warwick','masteryi','gnar','krug','brambleback']
};
function roleKey(name){
  const n=String(name||'').toLowerCase().trim();
  return CHAMP_ALIAS[n]||n.replace(/\s+/g,'');
}
function roleOf(name){
  const k=roleKey(name);
  for(const [role,list] of Object.entries(ROLE_MAP)){
    if(list.includes(k)||list.includes(String(name||'').toLowerCase())) return role;
  }
  return 'flex';
}
function itemsForChampion(name, shared, isPrimaryCarry){
  const k=roleKey(name);
  const compact=k.replace(/ /g,'');
  if(CHAMP_BIS[k]) return CHAMP_BIS[k].slice();
  if(CHAMP_BIS[compact]) return CHAMP_BIS[compact].slice();
  const role=roleOf(name);
  if(role==='tank') return TANK_BIS.slice();
  if(role==='ap') return AP_BIS.slice();
  if(role==='ad') return AD_BIS.slice();
  if(role==='flex' && isPrimaryCarry && shared && shared.length>=3) return shared.slice(0,3);
  if(isPrimaryCarry && shared && shared.length>=3) return shared.slice(0,3);
  return [];
}
export function champImg(name){
  const n=String(name||'').replace(/\s+/g,'');
  const map={Pebbles:'Sentry',Sentinel:'Galio',Krug:'Krug',Cinderling:'Smolder',Scuttlecrab:'Rammus',Gromp:'Gromp',Brambleback:'Ivern','MamaBeak':'Quinn',Mamabeak:'Quinn'};
  const key=map[n]||n;
  return `https://ddragon.leagueoflegends.com/cdn/15.1.1/img/champion/${key}.png`;
}
export function itemImg(name){
  const map={"Guinsoo's Rageblade":"GuinsoosRageblade","Bloodthirster":"Bloodthirster","Last Whisper":"LastWhisper","Giant Slayer":"GiantSlayer","Infinity Edge":"InfinityEdge","Hand of Justice":"HandOfJustice","Edge of Night":"EdgeOfNight","Spear of Shojin":"SpearofShojin","Blue Buff":"BlueBuff","Rabadon's Deathcap":"RabadonsDeathcap","Archangel's Staff":"ArchangelsStaff","Jeweled Gauntlet":"JeweledGauntlet","Morellonomicon":"Morellonomicon","Sunfire Cape":"SunfireCape","Gargoyle Stoneplate":"GargoyleStoneplate","Warmog's Armor":"WarmogsArmor","Bramble Vest":"BrambleVest","Dragon's Claw":"DragonsClaw","Ionic Spark":"IonicSpark","Red Buff":"RedBuff","Titan's Resolve":"TitansResolve","Sterak's Gage":"SteraksGage","Hextech Gunblade":"HextechGunblade","Deathblade":"Deathblade","Kraken's Fury":"KrakensFury","Nashor's Tooth":"NashorsTooth","Adaptive Helm":"AdaptiveHelm","Protector's Vow":"ProtectorsVow","Spirit Visage":"SpiritVisage","Evenshroud":"Evenshroud","Steadfast Heart":"SteadfastHeart","Crownguard":"Crownguard","Void Staff":"VoidStaff"};
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
function costColor(cost){
  const c=Number(cost)||1;
  if(c===1) return '#9aa4b2';
  if(c===2) return '#27ae60';
  if(c===3) return '#3498db';
  if(c===4) return '#9b59b6';
  return '#f1c40f';
}
function autoPositions(units){
  const list=(units||[]).map(u=>typeof u==='string'?{name:u}:u);
  const front=[],back=[];
  list.forEach((u,i)=>{
    const name=u.name||u.en||u.ar||'';
    const role=roleOf(name);
    if(role==='tank'||role==='flex') front.push(u);
    else back.push(u);
  });
  const positions=[];
  front.slice(0,4).forEach((u,i)=>positions.push({unit:u,row:0,col:1+i}));
  back.slice(0,4).forEach((u,i)=>positions.push({unit:u,row:2,col:1+i}));
  const rest=[...front.slice(4),...back.slice(4)];
  rest.forEach((u,i)=>positions.push({unit:u,row:1,col:i%7}));
  return positions;
}
export function renderBoard(comp){
  const units=comp.units||[];
  if(!units.length) return '<p class="empty">—</p>';
  const shared=(comp.items||comp.coreItems||[]).map(n=>typeof n==='string'?n:n.name||n).filter(Boolean);
  const positions=Array.isArray(comp.positions)&&comp.positions.length?comp.positions.map(p=>({
    unit:p.unit||p.name||p,
    row:p.row??0,
    col:p.col??0
  })):autoPositions(units);
  const primary=units[0];
  const primaryName=typeof primary==='string'?primary:(primary?.name||primary?.en||'');
  const cells=[];
  for(let r=0;r<4;r++){
    for(let c=0;c<7;c++){
      const hit=positions.find(p=>Number(p.row)===r&&Number(p.col)===c);
      if(!hit){
        cells.push(`<div class="hex empty" data-row="${r}" data-col="${c}"></div>`);
        continue;
      }
      const u=hit.unit;
      const name=typeof u==='string'?u:(u?.name?localize(u.name)||u.name:u?.en||u?.ar||'');
      const cost=CHAMP_COST[roleKey(name)]||CHAMP_COST[String(name||'').toLowerCase()]||2;
      const isPrimary=roleKey(name)===roleKey(primaryName);
      const items=itemsForChampion(name, shared, isPrimary).slice(0,3);
      const itemHtml=items.map(it=>`<img class="hex-item" src="${itemImg(it)}" alt="${it}" title="${it}" data-item="${it}" loading="lazy" onerror="this.style.display='none'">`).join('');
      cells.push(`<div class="hex filled cost-${cost}" style="--cost:${costColor(cost)}" data-unit="${name}" data-row="${r}" data-col="${c}">
        <img class="hex-champ" src="${champImg(name)}" alt="${name}" loading="lazy" onerror="this.style.display='none'">
        <span class="hex-name">${name}</span>
        <div class="hex-items">${itemHtml}</div>
      </div>`);
    }
  }
  return `<div class="hex-board" dir="ltr">${cells.join('')}</div>`;
}
