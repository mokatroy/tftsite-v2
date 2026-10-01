import {setupLanguage,localize} from './i18n.js';import{compCard}from'./ui.js';
const load=path=>fetch(path).then(r=>r.json());let comps=[];
async function render(){const [compData,patches]=await Promise.all([load('data/comps.json'),load('data/patches.json')]);comps=compData;document.querySelector('#featured-comps').innerHTML=comps.filter(c=>c.featured).map(compCard).join('');const p=patches[0];document.querySelector('#stat-comps').textContent=comps.length;document.querySelector('#stat-patch').textContent=p.version;document.querySelector('#patch-version').textContent=p.version;document.querySelector('#patch-title').textContent=localize(p.title);document.querySelector('#patch-summary').textContent=localize(p.summary)}
setupLanguage(render);render();
