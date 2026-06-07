// Dev-only converter: a raw store-export CSV → src/data/catalog.ts (Product[]).
//
// IMPORTANT: the raw CSV is intentionally NOT committed to the repo. It is an
// old-website export that carries internal/back-office fields (wholesale tier
// pricing, shipping markup, low-stock thresholds, inventory flags, store IDs)
// that the public shop does not need. Only the *cleaned* output — which keeps
// public product fields exclusively — is committed as src/data/catalog.ts.
// The production app imports that file and never reads any CSV at runtime.
//
// Why a baked catalog at all: the live WordPress REST API
// (wholesaleasic.com/wp-json/cbtc/v1/products) is currently behind a SiteGround
// anti-bot challenge that returns captcha HTML instead of JSON, so the catalog
// can't be fetched over the network. catalog.ts is the fallback meanwhile.
//
// Rules honored (see PR #27):
//  - Never invent price, stock, watts, J/TH, or condition.
//  - Hashrate / watts / efficiency are read from the real product description
//    (or, for hashrate, parsed from the title) — only when actually present.
//  - product_option rows (variations, blank product_name) are NOT emitted.
//  - Availability is conservative: nothing is marked physically "In stock".
//
// To regenerate: place the export at scripts/catalog_source.csv (or pass a path
// as argv[2]) and run from the project root:  node scripts/csv-to-catalog.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = process.argv[2] || path.join(__dirname, 'catalog_source.csv');
const OUT = path.join(__dirname, '..', 'src', 'data', 'catalog.ts');

if (!fs.existsSync(SRC)) {
  console.error(
    `Source CSV not found at ${SRC}.\n` +
    `The raw export is not committed (it contains internal fields). Supply it\n` +
    `locally — e.g. node scripts/csv-to-catalog.mjs ./my-export.csv — to regenerate.`
  );
  process.exit(1);
}

// ── Minimal RFC-4180 CSV parser (handles quoted fields + embedded newlines) ──
function parseCsv(s) {
  const rows = [];
  let row = [], cur = '', q = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) {
      if (c === '"') { if (s[i + 1] === '"') { cur += '"'; i++; } else q = false; }
      else cur += c;
    } else {
      if (c === '"') q = true;
      else if (c === ',') { row.push(cur); cur = ''; }
      else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
      else if (c === '\r') { /* skip */ }
      else cur += c;
    }
  }
  if (cur.length || row.length) { row.push(cur); rows.push(row); }
  return rows;
}

const text = fs.readFileSync(SRC, 'utf8');
const rows = parseCsv(text);
const header = rows[0];
const idx = Object.fromEntries(header.map((h, i) => [h, i]));
const data = rows.slice(1).filter((r) => r.length > 1);
const get = (r, k) => (r[idx[k]] ?? '').trim();

const stripHtml = (s) =>
  s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&')
   .replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim();

// Normalize a hashrate / efficiency unit to a clean display form.
const hUnit = (u) => ({ th: 'TH/s', gh: 'GH/s', mh: 'MH/s' }[u.toLowerCase()] || u);
const eUnit = (u) => 'J/' + u.toUpperCase();

// Real-data extraction from the product description (returns '' when absent).
function extractHashrate(desc, name) {
  const m = desc.match(/(?:hash\s*)?rate of\s*([\d.]+)\s*(Th|Gh|Mh)\s*\/?\s*s/i);
  if (m) return { value: m[1], unit: hUnit(m[2]) };
  // Fallback: parse a clear hashrate token from the title (e.g. "225T", "40TH", "13G", "2GH").
  const t = name.match(/(\d+(?:\.\d+)?)\s*(TH|GH|MH|T|G|M)h?\b/i);
  if (t) {
    const u = t[2].toUpperCase();
    return { value: t[1], unit: u.length === 1 ? hUnit(u + 'h') : hUnit(u) };
  }
  return { value: '', unit: '' };
}
function extractPower(desc) {
  const m =
    desc.match(/power consumption[:\s]*(?:of\s*)?([\d.]+)\s*W\b/i) ||
    desc.match(/consuming\s*([\d.]+)\s*W\b/i) ||
    desc.match(/consumption of\s*([\d.]+)\s*W\b/i);
  return m ? m[1].replace(/\.0$/, '') : '';
}
function extractEfficiency(desc) {
  const m = desc.match(/([\d.]+)\s*J\/(Th|Gh|Mh)\b/i);
  return m ? { value: m[1], unit: eUnit(m[2]) } : { value: '', unit: '' };
}

// Condition strictly from the product name (never invented).
function condition(name) {
  const n = name.toLowerCase();
  if (/\bbrand new\b|\bnew\b/.test(n)) return 'New';
  if (/\bused\b/.test(n)) return 'Used';
  if (/\brefurb(ished)?\b/.test(n)) return 'Refurbished';
  return '';
}

// Known mining algorithm by model family — these are facts, not invented specs,
// and are used only for category + coin-badge logic.
function algorithm(name) {
  const n = name.toLowerCase();
  if (/\bl7\b|\bl9\b|\bl3\b|dg1|volcminer|\bd1\b/.test(n)) return 'Scrypt';
  if (/\bks\d/.test(n)) return 'kHeavyHash';
  if (/\bz15\b/.test(n)) return 'Equihash';
  if (/aleo|\bae\d\b/.test(n)) return 'Aleo';
  return 'SHA-256';
}

const cooling = (name) => (/\bhydro\b|\bhyd\b/i.test(name) ? 'Hydro' : 'Air');

// ── Accessory detection + single-subcategory classifier (precedence order) ──
const isAccessoryRow = (name, cat) => {
  const tx = `${name} ${cat}`.toLowerCase();
  return /power supply|psu|\bapw\d|control board|motherboard|amlogic|xilinx|hashboard|hash board|\bfans?\b|cooling fan|\bcables?\b|\bcord\b|splitter|replacement part|\bparts?\b/.test(tx);
};
function accSubcategory(name, cat) {
  const tx = `${name} ${cat}`.toLowerCase();
  if (/hashboard|hash board/.test(tx)) return 'hashboards';
  if (/control board|motherboard|amlogic|xilinx/.test(tx)) return 'control';
  if (/\bcord\b|\bcables?\b|splitter/.test(tx)) return 'cables';
  if (/power supply|psu|\bapw\d/.test(tx)) return 'psu';
  if (/\bfans?\b|cooling fan/.test(tx)) return 'fans';
  return 'other';
}

const products = [];
for (const r of data) {
  if (get(r, 'type') !== 'product') continue;        // skip product_option (variation) rows
  const name = get(r, 'product_name');
  if (!name) continue;                                // never emit a blank-name row

  const cat = get(r, 'product_category_1');
  const desc = stripHtml(get(r, 'product_description'));
  const accessory = isAccessoryRow(name, cat);

  // Miner specs only — accessories never carry hashrate/watts/efficiency.
  const hr = accessory ? { value: '', unit: '' } : extractHashrate(desc, name);
  const pw = accessory ? '' : extractPower(desc);
  const ef = accessory ? { value: '', unit: '' } : extractEfficiency(desc);

  const categories = [];
  if (cat) categories.push(cat);
  if (accessory) categories.push('Accessories', accSubcategory(name, cat));

  products.push({
    id: parseInt(get(r, 'product_internal_id'), 10) || products.length + 1,
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
    sku: get(r, 'product_sku'),
    price: get(r, 'product_price'),
    sale_price: '',
    // Conservative: never "instock". Everything is orderable from the supplier;
    // the UI gates new→"Available to order" vs used/unknown→"Contact us".
    stock_status: 'onbackorder',
    stock_quantity: null,
    condition: accessory ? '' : condition(name),
    cooling: accessory ? '' : cooling(name),
    algorithm: accessory ? '' : algorithm(name),
    hashrate: hr.value,
    hashrate_unit: hr.unit,
    power: pw,
    efficiency: ef.value,
    efficiency_unit: ef.unit,
    image: get(r, 'product_media_main_image_url'),
    images: [
      get(r, 'product_media_main_image_url'),
      get(r, 'product_media_gallery_image_url_1'),
      get(r, 'product_media_gallery_image_url_2'),
    ].filter(Boolean),
    badge: '',
    short_description: '',
    featured: get(r, 'product_is_featured') === 'true',
    categories,
    permalink: get(r, 'url'),
  });
}

const banner =
  '// AUTO-GENERATED by scripts/csv-to-catalog.mjs — do not edit by hand.\n' +
  '// Cleaned, public-only product fields derived from a store-export CSV.\n' +
  '// The raw CSV is NOT committed (it holds internal fields); supply it locally\n' +
  '// to regenerate:  node scripts/csv-to-catalog.mjs ./export.csv\n';

const body =
  banner +
  "import type { Product } from '../lib/api';\n\n" +
  'export const CATALOG_PRODUCTS: Product[] = ' +
  JSON.stringify(products, null, 2) +
  ';\n';

fs.writeFileSync(OUT, body);
console.log(`Wrote ${products.length} products → ${path.relative(process.cwd(), OUT)}`);
