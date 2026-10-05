import {t,localize,lang,localePath} from './locale.js?v=20261005g';
import {traitImg} from './icons.js?v=20261005g';

export const CHAMP_ALIAS = {pebbles:'sentry','mama beak':'raptor',mamabeak:'raptor','ancient golem':'golem',scuttlecrab:'scuttlecrab',cinderling:'cinderling',brambleback:'brambleback',gromp:'gromp',krug:'krug'};
export const CHAMP_COST = {xayah:4,ezreal:3,aphelios:4,sivir:3,ashe:2,draven:4,caitlyn:5,yunara:4,nidalee:3,khazix:3,warwick:2,masteryi:5,gnar:2,rakan:3,alune:4,veigar:3,azir:4,cassiopeia:3,ahri:4,morgana:3,amumu:1,taric:2,sentinel:1,krug:2,pebbles:1,cinderling:1,scuttlecrab:1,gromp:2,brambleback:3,'mama beak':3,mamabeak:3};
export const CHAMP_BIS = {
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
export const TANK_BIS = ["Warmog's Armor","Gargoyle Stoneplate","Sunfire Cape"];
export const AP_BIS = ["Blue Buff","Jeweled Gauntlet","Rabadon's Deathcap"];
export const AD_BIS = ["Infinity Edge","Last Whisper","Bloodthirster"];
export const ROLE_MAP = {
  tank:['amumu','taric','sentinel','scuttlecrab','gromp','rakan','mama beak','mamabeak'],
  ap:['alune','veigar','azir','cassiopeia','ahri','morgana','pebbles'],
  ad:['xayah','ezreal','aphelios','sivir','ashe','draven','caitlyn','yunara','nidalee','khazix','cinderling'],
  flex:['warwick','masteryi','gnar','krug','brambleback']
};
export function roleKey(name){
  const n=String(name||'').toLowerCase().trim();
  return CHAMP_ALIAS[n]||n.replace(/\s+/g,'');
}
export function roleOf(name){
  const k=roleKey(name);
  for(const [role,list] of Object.entries(ROLE_MAP)){
    if(list.includes(k)||list.includes(String(name||'').toLowerCase())) return role;
  }
  return 'flex';
}
export function itemsForChampion(name, shared, isPrimaryCarry){
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
