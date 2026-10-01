export function traitIcon(name){
  const map={};
  return map[name]||`data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="6" fill="%23121827"/><text x="20" y="26" text-anchor="middle" fill="%23e9b964" font-size="14" font-family="sans-serif">'+(name||'?').slice(0,2)+'</text></svg>')}`;
}
export function traitTooltip(name){
  return `<span class="tier-tooltip"><strong>${name||''}</strong></span>`;
}
export function itemTooltip(name){
  return `<span class="tier-tooltip"><strong>${name||''}</strong></span>`;
}
