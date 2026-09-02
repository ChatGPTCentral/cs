// Rebuilds chart-map.svg: world map bucketed into 5 audience regions,
// zoomed on the US-Europe corridor (v8). Shares from the quiz sample
// (N=4,714 with a country): NA 50, Rest 17, Asia 14, Europe 13, UK 6.
// "Rest" is deliberately left uncolored.
import { readFileSync, writeFileSync } from 'fs';
import * as topojson from 'topojson-client';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import countries from 'world-countries/countries.json' with { type: 'json' };

const world = JSON.parse(readFileSync('node_modules/world-atlas/countries-110m.json', 'utf8'));
const feats = topojson.feature(world, world.objects.countries).features;

const byCcn3 = new Map(countries.map(c => [c.ccn3, c]));

const COLORS = {
  'North America': '#A50D26',
  'Asia':          '#CE4B59',
  'Europe':        '#D9636F',
  'UK':            '#F0BFC6',
  'Rest':          '#E3DFD7',
};

function bucket(id) {
  const c = byCcn3.get(String(id).padStart(3, '0'));
  if (!c) return 'Rest';
  if (c.cca3 === 'GBR') return 'UK';
  if (['USA', 'CAN', 'MEX'].includes(c.cca3)) return 'North America';
  if (c.cca3 === 'RUS') return 'Rest';
  if (c.region === 'Europe') return 'Europe';
  if (c.region === 'Asia') return 'Asia';
  return 'Rest';
}

const W = 1100, H = 620;
// Fit the projection to a window centred on the US-Europe corridor; everything
// outside falls beyond the viewBox and is clipped.
const focus = {
  type: 'Polygon',
  coordinates: [[[-128, 14], [-128, 66], [42, 66], [42, 14], [-128, 14]]],
};
const proj = geoNaturalEarth1().fitSize([W, H], focus);
const path = geoPath(proj);

const groups = {};
for (const f of feats) {
  if (String(f.id) === '010') continue; // Antarctica
  const b = bucket(f.id);
  const d = path(f);
  if (!d) continue;
  (groups[b] ||= []).push(d);
}

let svg = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="World map zoomed on the US to Europe corridor, shaded by audience share: North America 50 percent, Rest 17, Asia 14, Europe 13, UK 6. Rest of world is left unshaded.">\n`;
for (const b of ['Rest', 'Europe', 'Asia', 'North America', 'UK']) {
  if (!groups[b]) continue;
  svg += `<g fill="${COLORS[b]}" stroke="#FDFCFA" stroke-width="0.7">\n`;
  for (const d of groups[b]) svg += `<path d="${d}"/>\n`;
  svg += `</g>\n`;
}
svg += `</svg>`;
writeFileSync('chart-map.svg', svg);
console.log('wrote chart-map.svg,', Object.entries(groups).map(([k, v]) => `${k}:${v.length}`).join(' '));
