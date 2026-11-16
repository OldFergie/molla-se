// Fyller index.html med texter och bilder från content/sida.json.
// Körs automatiskt av GitHub Actions innan sidan publiceras.
// Kör lokalt: node scripts/bygg-sidan.mjs  (skriver över index.html)
import { readFileSync, writeFileSync } from 'node:fs';

const SAJT = 'https://molla.se';
const data = JSON.parse(readFileSync('content/sida.json', 'utf8'));
let html = readFileSync('index.html', 'utf8');
const saknas = [];

const hamta = (nyckel) => {
  const v = nyckel.split('.').reduce((o, k) => (o == null ? undefined : o[k]), data);
  if (v === undefined) saknas.push(nyckel);
  return v;
};
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const text = (t) => esc(t).replace(/\r?\n/g, '<br>');
const url = (u) => (String(u).startsWith('/') ? SAJT + u : String(u));

// 1. Attribut, t.ex. data-cms-attr="href:livok.lank" eller "content:seo.delningsbild|url"
html = html.replace(/<[a-z][a-z0-9]*\b[^>]*\bdata-cms-attr="([^"]+)"[^>]*>/gi, (tagg, spec) => {
  for (const del of spec.split(';')) {
    const [attr, rest] = del.split(':');
    const [nyckel, filter] = rest.split('|');
    let v = hamta(nyckel);
    if (v === undefined) continue;
    if (filter === 'url') v = url(v);
    tagg = tagg.replace(new RegExp(`(\\s${attr}=")[^"]*(")`), (_m, a, b) => a + esc(v) + b);
  }
  return tagg;
});

// 2. Textinnehåll, t.ex. <h3 data-cms="livok.namn">Livok</h3>
html = html.replace(/(<([a-z][a-z0-9]*)\b[^>]*\bdata-cms="([^"]+)"[^>]*>)([\s\S]*?)(<\/\2>)/gi,
  (hel, start, _tagg, nyckel, _inne, slut) => {
    const v = hamta(nyckel);
    return v === undefined ? hel : start + text(v) + slut;
  });

// 3. Bilder: <!--cms-bild:livok.bild:klass--> ...illustration... <!--/cms-bild-->
//    Tom bild = illustrationen ligger kvar. Vald bild = bilden visas i stället.
html = html.replace(/<!--cms-bild:([^:]+):([^>]+?)-->([\s\S]*?)<!--\/cms-bild-->/g, (hel, nyckel, klass, inne) => {
  const v = hamta(nyckel);
  if (!v) return hel;
  const del = nyckel.split('.')[0];
  const alt = (data[del] && (data[del].namn || data[del].rubrik)) || '';
  return `<div class="${esc(klass)} cms-bild"><img src="${esc(v)}" alt="${esc(alt)}" loading="lazy"></div>`;
});

if (saknas.length) {
  console.error('Saknas i content/sida.json: ' + saknas.join(', '));
  process.exit(1);
}
writeFileSync('index.html', html);
console.log('index.html uppdaterad från content/sida.json');
