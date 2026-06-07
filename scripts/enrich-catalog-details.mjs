// Adds full static hardware specs (the `details` object) to the 32 MINER
// products in src/data/catalog.ts. Source: ASICMinerValue product spec tables
// (static specs only — no profitability/price/stock/availability).
//
// Performance specs (hashrate/power/efficiency/algorithm) are NOT changed here;
// they were reviewed/approved in PR #28. This script only adds the dimensional
// / environmental detail fields and the `model` label.
//
// Bin note: some products are a different hashrate bin of a model whose chassis
// specs (size/weight/noise/fans/voltage/interface/temp/humidity) are physically
// identical across bins; those reuse the family chassis values (flagged in the
// PR report). Products with no ASICMinerValue match get only model + brand.
//   Run:  node scripts/enrich-catalog-details.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CATALOG_PRODUCTS } from '../src/data/catalog.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'src', 'data', 'catalog.ts');

const lc = (s) => (s || '').toLowerCase();
const toNumber = (v) => { const n = parseFloat(String(v ?? '').replace(/[^0-9.]/g, '')); return Number.isNaN(n) ? null : n; };
const ptext = (p) => `${lc(p.name)} ${lc((p.categories || []).join(' '))} ${lc(p.algorithm)}`;
const ACCESSORY_RE = /power supply|psu|control board|hashboard|hash board|\bfans?\b|\bcables?\b|\bparts?\b|immersion|accessor|adapter|controller|connector|bracket|\bcord\b|cooling kit|repair kit|\btool/;
const hasHashrate = (p) => (toNumber(p.hashrate) ?? 0) > 0;
const isAccessory = (p) => ACCESSORY_RE.test(ptext(p)) && !hasHashrate(p);
const isMiner = (p) => !isAccessory(p) && (hasHashrate(p) || /miner|antminer|whatsminer|avalon|\b[sml]\d{1,2}\b|\bks\d|\bz15\b/.test(lc(p.name)));
const brandFromName = (name) => {
  const n = lc(name);
  if (/whatsminer|microbt/.test(n)) return 'MicroBT';
  if (/antminer|bitmain/.test(n)) return 'Bitmain';
  if (/avalon|canaan/.test(n)) return 'Canaan';
  if (/elphapex/.test(n)) return 'ElphaPex';
  if (/iceriver/.test(n)) return 'IceRiver';
  if (/volcminer/.test(n)) return 'VolcMiner';
  return '';
};
const cleanModel = (name) => name
  .replace(/\b(brand new|refurbished|refurb|used|new)\b/gi, '')
  .replace(/\s{2,}/g, ' ').replace(/^[\s\-–|]+|[\s\-–|]+$/g, '').trim();

// Shared chassis blocks (reused by same-model different-bin products).
const S21_AIR   = { size: '400 x 195 x 290 mm', noise: '75 dB', fans: '2', interface: 'Ethernet' };
const S21P_HYD  = { size: '410 x 170 x 209 mm', noise: '50 dB', interface: 'Ethernet', temperature: '5 - 40 °C', humidity: '10 - 90 %' };
const DG1PLUS   = { release: 'Jul 2024', size: '432 x 196 x 287 mm', weight: '18300 g', noise: '75 dB', fans: '4', voltage: '200-240V', interface: 'RJ45 Ethernet 10/100M', temperature: '5 - 45 °C', humidity: '5 - 95 %' };

// details keyed by a unique substring of the product name (ASICMinerValue specs).
const DETAILS = [
  ['S19 (95',          { release: 'May 2020', size: '195 x 290 x 400 mm', weight: '14500 g', noise: '75 dB', fans: '4', interface: 'Ethernet', temperature: '5 - 40 °C', humidity: '5 - 95 %' }],
  ['S19 Pro (110',     { release: 'May 2020', size: '195 x 290 x 370 mm', weight: '13200 g', noise: '75 dB', fans: '4', voltage: '12V', interface: 'Ethernet', temperature: '5 - 40 °C', humidity: '5 - 95 %' }],
  ['S19j Pro (104',    { release: 'Jul 2021', size: '195 x 290 x 370 mm', weight: '13200 g', noise: '75 dB', fans: '4', voltage: '12V', interface: 'Ethernet', temperature: '5 - 35 °C', humidity: '5 - 95 %' }],
  ['S19j Pro Plus (120',{ release: 'Dec 2022', size: '195 x 290 x 370 mm', weight: '13200 g', noise: '75 dB', fans: '4', interface: 'Ethernet', temperature: '5 - 45 °C', humidity: '5 - 95 %' }],
  ['S19 XP (141',      { release: 'Jul 2022', size: '195 x 290 x 400 mm', weight: '14500 g', noise: '75 dB', fans: '4', interface: 'Ethernet', temperature: '5 - 45 °C', humidity: '5 - 95 %' }],
  ['S19 XP Hydro 257', { release: 'Oct 2022', size: '410 x 170 x 209 mm', weight: '13100 g', noise: '50 dB', fans: '0', interface: 'Ethernet', temperature: '5 - 40 °C', humidity: '10 - 90 %' }],
  ['S19 XP+ Hydro 293',{ release: 'Apr 2025', size: '410 x 170 x 209 mm', weight: '13500 g', noise: '50 dB', interface: 'Ethernet', temperature: '5 - 40 °C', humidity: '10 - 90 %' }],
  ['S21 (200',         { release: 'Feb 2024', size: '400 x 195 x 290 mm', noise: '75 dB', fans: '2', voltage: '12V', interface: 'Ethernet', temperature: '5 - 40 °C', humidity: '5 - 95 %' }],
  ['S21+ 216',         { release: 'Feb 2025', ...S21_AIR, temperature: '10 - 40 °C', humidity: '10 - 90 %' }],
  ['S21+ 225',         { release: 'Feb 2025', ...S21_AIR, temperature: '10 - 40 °C', humidity: '10 - 90 %' }],   // same chassis as S21+ 216
  ['S21+ 235',         { release: 'Feb 2025', ...S21_AIR, temperature: '10 - 40 °C', humidity: '10 - 90 %' }],   // same chassis as S21+ 216
  ['S21+ HYD 358',     { release: 'Feb 2025', ...S21P_HYD }],                                                     // chassis from S21+ Hyd 319
  ['S21 Pro (234',     { release: 'Jul 2024', ...S21_AIR, temperature: '5 - 45 °C', humidity: '5 - 95 %' }],
  ['S21 Pro 245',      { release: 'Jul 2024', ...S21_AIR, temperature: '5 - 45 °C', humidity: '5 - 95 %' }],     // same chassis as S21 Pro 234
  ['S21 XP 270',       { release: 'Sep 2024', size: '400 x 195 x 290 mm', noise: '75 dB', fans: '4', interface: 'Ethernet 10/100M', temperature: '5 - 45 °C', humidity: '5 - 95 %' }],
  ['T21 (190',         { release: 'Apr 2024', size: '400 x 195 x 290 mm', weight: '16500 g', interface: 'Ethernet', temperature: '5 - 45 °C', humidity: '5 - 95 %' }], // chassis from T21 180
  ['S21+ 216',         { release: 'Feb 2025', ...S21_AIR, temperature: '10 - 40 °C', humidity: '10 - 90 %' }],
  ['S23 Hyd 580',      { release: 'Jan 2026', size: '410 x 170 x 209 mm', noise: '50 dB', interface: 'Ethernet', temperature: '5 - 45 °C', humidity: '5 - 95 %' }],
  ['A15Pro 221',       { release: 'Feb 2025', size: '301 x 192 x 292 mm', weight: '14900 g', noise: '75 dB', fans: '2', interface: 'Ethernet' }],                      // chassis from A15Pro-218T
  ['Avalon Q 90',      { release: 'Apr 2025', size: '455 x 130 x 440 mm', weight: '10500 g', noise: '45 dB', fans: '2', voltage: '110-240V', interface: 'Ethernet / Wifi' }],
  ['M20S 68',          { release: 'Aug 2019', size: '130 x 220 x 390 mm', weight: '12500 g', noise: '75 dB', fans: '2', voltage: '12V', interface: 'Ethernet' }],
  ['M30S 76',          { release: 'Apr 2020', size: '150 x 225 x 390 mm', weight: '10500 g', noise: '72 dB', fans: '2', voltage: '12V', interface: 'Ethernet' }],      // chassis from M30S 86
  ['M50 (114',         { release: 'Jul 2022', size: '125 x 225 x 425 mm', noise: '75 dB', fans: '2', interface: 'Ethernet', temperature: '5 - 45 °C', humidity: '5 - 95 %' }],
  ['M60 (172',         { release: 'Feb 2024', size: '430 x 155 x 226 mm', weight: '13500 g', noise: '75 dB', fans: '2', interface: 'Ethernet' }],
  ['L7 8050',          { release: 'Feb 2022', size: '195 x 290 x 370 mm', weight: '15000 g', noise: '75 dB', fans: '4', interface: 'Ethernet', temperature: '5 - 45 °C', humidity: '5 - 95 %' }],
  ['Antminer L9',      { release: 'May 2024', size: '195 x 290 x 379 mm', weight: '13500 g', noise: '75 dB', fans: '2', interface: 'Ethernet', temperature: '5 - 45 °C', humidity: '5 - 95 %' }],
  ['KS7 40',           { release: 'May 2025', size: '430 x 196 x 290 mm', weight: '16400 g', noise: '75 dB', fans: '4', voltage: '220-277V', interface: 'Ethernet', temperature: '5 - 45 °C', humidity: '10 - 90 %' }],
  ['DG1+ 13G',         { ...DG1PLUS }],   // same chassis as DG1+ 14G
  ['DG1+ 14G',         { ...DG1PLUS }],
  ['ALEO AE3',         { release: 'Nov 2025', size: '370 x 195 x 290 mm', weight: '15000 g', noise: '75 dB', voltage: '200-250V', interface: 'Ethernet', temperature: '5 - 40 °C', humidity: '10 - 90 %' }],
  ['D1 18.5',          { release: 'Oct 2024', size: '335 x 217 x 395 mm', weight: '17550 g', noise: '75 dB', fans: '4', interface: 'Ethernet' }],
  // No ASICMinerValue match — model/manufacturer only: S19e XP HYD 251, M61 202.
];

let detailCount = 0, brandCount = 0, noDetail = [];
for (const p of CATALOG_PRODUCTS) {
  if (!isMiner(p)) continue;                       // accessories untouched
  const b = brandFromName(p.name);
  if (b) { p.brand = b; brandCount++; }
  const entry = DETAILS.find(([sub]) => p.name.includes(sub));
  const model = cleanModel(p.name);
  if (entry) {
    p.details = { model, ...entry[1] };
    detailCount++;
  } else {
    p.details = { model };                          // model-only for unmatched
    noDetail.push(p.name);
  }
}

const banner =
  '// AUTO-GENERATED catalog (scripts/csv-to-catalog.mjs), enriched with static\n' +
  '// miner specs from ASICMinerValue (scripts/enrich-catalog-specs.mjs +\n' +
  '// scripts/enrich-catalog-details.mjs). Public fields only — no price/stock.\n';
const body = banner +
  "import type { Product } from '../lib/api';\n\n" +
  'export const CATALOG_PRODUCTS: Product[] = ' +
  JSON.stringify(CATALOG_PRODUCTS, null, 2) + ';\n';
fs.writeFileSync(OUT, body);
console.log(`details added to ${detailCount} miners; brand on ${brandCount}; model-only (no AMV match): ${noDetail.join(', ')}`);
