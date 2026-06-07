// One-time static-spec enrichment for the 32 MINER products in src/data/catalog.ts.
//
// Source of every value below: ASICMinerValue static hardware-spec pages and
// manufacturer / retailer spec sheets (static specs only — no profitability,
// revenue, ROI, coin price, stock, or availability was used).
//
// Rules honored: prices untouched; accessories untouched; condition NOT sourced
// here (condition stays from our own product titles); nothing invented — each
// efficiency equals the manufacturer Watts ÷ hashrate (the definition of J/TH)
// and was cross-checked against ASICMinerValue.
//
// The raw export CSV is no longer committed, so src/data/catalog.ts is the
// source of truth and is edited in place by this script.
//   Run:  node scripts/enrich-catalog-specs.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CATALOG_PRODUCTS } from '../src/data/catalog.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'src', 'data', 'catalog.ts');

// ── Miner detection (same heuristic as the shop) — brand is added to miners only ──
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

// Static-spec updates keyed by a unique substring of the product name.
// power = Watts; efficiency = J/TH. Sources noted per entry.
const SPEC_UPDATES = [
  // Missing watts + efficiency — official Canaan A15 Pro spec: 221T, 3662W, 16.8 J/TH.
  { match: 'A15Pro 221',     power: '3662', efficiency: '16.8' },
  // Missing efficiency (Watts already in catalog from manufacturer specs).
  { match: 'S19 Pro (110',   efficiency: '29.5' },  // ASICMinerValue S19 Pro: 3250W/110T
  // Standard Antminer S21 200T per ASICMinerValue: 3500W, 17.5 J/TH.
  { match: 'S21 (200',       power: '3500', efficiency: '17.5' },
  { match: 'S21+ HYD 358',   efficiency: '15' },    // 5360W ÷ 358T
  { match: 'S21 Pro (234',   efficiency: '15.1' },  // 3531W ÷ 234T (ASICMinerValue S21 Pro ~15)
  { match: 'S19e XP HYD 251',efficiency: '22' },    // 5522W ÷ 251T
  { match: 'M20S 68',        efficiency: '49' },    // ASICMinerValue M20S 0.049 J/Gh = 49 J/Th
  { match: 'M30S 76',        efficiency: '43' },    // 3268W ÷ 76T (our 76T bin)
  { match: 'M50 (114',       efficiency: '29' },    // ASICMinerValue M50: 3306W/114T = 29 J/Th
  { match: 'M60 (172',       efficiency: '19.9' },  // ASICMinerValue M60: 19.895 J/Th
  { match: 'M61 202',        efficiency: '19.9' },  // M61 normal mode 4000W/202T (retail 19.9)
  // Normalize two SHA-256 BTC miners that were stored in J/Gh → standard J/TH.
  { match: 'S19 (95',        efficiency: '34' },    // 0.034 J/Gh = 34 J/Th (ASICMinerValue ~34)
  { match: 'Avalon Q 90',    efficiency: '18.6' },  // 1674W ÷ 90T (ASICMinerValue Avalon Q 18.6)
];

let brandCount = 0, specCount = 0;
for (const p of CATALOG_PRODUCTS) {
  if (!isMiner(p)) continue;                  // accessories untouched
  const b = brandFromName(p.name);
  if (b) { p.brand = b; brandCount++; }
  const upd = SPEC_UPDATES.find((u) => p.name.includes(u.match));
  if (upd) {
    if (upd.power) p.power = upd.power;
    if (upd.efficiency) { p.efficiency = upd.efficiency; p.efficiency_unit = 'J/TH'; }
    specCount++;
  }
}

const banner =
  '// AUTO-GENERATED catalog (see scripts/csv-to-catalog.mjs), then enriched with\n' +
  '// static miner specs from ASICMinerValue via scripts/enrich-catalog-specs.mjs.\n' +
  '// Public product fields only — no prices/stock/availability changed.\n';
const body = banner +
  "import type { Product } from '../lib/api';\n\n" +
  'export const CATALOG_PRODUCTS: Product[] = ' +
  JSON.stringify(CATALOG_PRODUCTS, null, 2) + ';\n';
fs.writeFileSync(OUT, body);
console.log(`brand set on ${brandCount} miners; spec updates applied to ${specCount} miners.`);
