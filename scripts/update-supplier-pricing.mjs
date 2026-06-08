// Supplier pricing cleanup (operates on the existing 87-product catalog — does
// NOT add products). Normalizes variant pricing to the supplier-calculated CAD
// and lowers standalone supplier-matched products when the supplier price is
// cheaper. No accessories, specs, stock, or availability touched.
//   Run:  node scripts/update-supplier-pricing.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CATALOG_PRODUCTS } from '../src/data/catalog.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'src', 'data', 'catalog.ts');

// Set per-variant prices (by label) and the card/top-level price for a product.
function repriceVariants(id, byLabel, topPrice) {
  const p = CATALOG_PRODUCTS.find((x) => x.id === id);
  if (!p || !p.variants) { console.error('no variants for', id); return; }
  for (const v of p.variants) if (byLabel[v.label] != null) v.price = byLabel[v.label];
  if (topPrice != null) p.price = topPrice;
}

// L9 — supplier lists only 15G/16G/16.5G (no 17G). Drop the 17G variant (no
// supplier price; never extrapolate) and make the card show the highest supplier
// variant, 16.5G. Keep the same product card (id 714997514).
{
  const l9 = CATALOG_PRODUCTS.find((x) => x.id === 714997514);
  if (l9) {
    l9.variants = [
      { label: '16.5G', model: 'Antminer L9 (16.5Gh)', hashrate: '16.5', hashrate_unit: 'GH/s', power: '3570', efficiency: '0.216', efficiency_unit: 'J/MH', price: '5119' },
      { label: '16G',   model: 'Antminer L9 (16Gh)',   hashrate: '16',   hashrate_unit: 'GH/s', power: '3360', efficiency: '0.21',  efficiency_unit: 'J/MH', price: '4961' },
      { label: '15G',   model: 'Antminer L9 (15Gh)',   hashrate: '15',   hashrate_unit: 'GH/s', power: '3360', efficiency: '0.224', efficiency_unit: 'J/MH', price: '4661' },
    ];
    Object.assign(l9, { hashrate: '16.5', hashrate_unit: 'GH/s', power: '3570', efficiency: '0.216', efficiency_unit: 'J/MH', price: '5119' });
    l9.details = { ...(l9.details || {}), model: 'Antminer L9 (16.5Gh)' };
  }
}

// Variant sets — normalize to supplier-calculated CAD (monotonic: higher hashrate
// never cheaper than a lower one). Card price = highest variant.
repriceVariants(632647001, { '9.5G': '2044', '9.3G': '1973', '9.05G': '1930', '8.8G': '1901' }, '2044'); // L7
repriceVariants(673979281, { '174T': '2710', '172T': '2689', '170T': '2669' }, '2710'); // M60
repriceVariants(769891696, { '293T': '2200', '279T': '2100' }, '2200'); // S19 XP+ Hyd
repriceVariants(673979256, { '358T': '4271', '319T': '3862' }, '4271'); // S21+ Hyd
repriceVariants(769891226, { '245T': '3991', '234T': '3821' }, '3991'); // S21 Pro (already supplier)

// Standalone existing products — lower to supplier CAD only when cheaper.
const setPrice = (id, price) => { const p = CATALOG_PRODUCTS.find((x) => x.id === id); if (p) p.price = price; };
setPrice(799704490, '3445'); // S21+ 216T   3650.00 -> 3445
setPrice(769987280, '2916'); // DG1+ 14G    3299.99 -> 2916
setPrice(799721637, '2630'); // DG1+ 13G    2850.00 -> 2630
// Kept (supplier higher): S21 XP 270T (5320), Avalon Q 90T (2700), VolcMiner D1 18.5G (5999.99).

// ── Local product images (downloaded clean, background-on photos from
// ASICMinerValue product pages — no branding/overlay — via fetch-product-images.mjs).
// Assign by exact product name, only when the local file exists.
const IMAGES = {
  'Antminer L11 20G': 'antminer-l11',
  'Antminer S21e Hyd': 'antminer-s21e-hyd',
  'SealMiner A2 Pro Hyd 500T': 'sealminer-a2-pro-hyd',
  'SealMiner A2 Pro Air 260T': 'sealminer-a2-pro-air',
  'SealMiner A3 Pro Hydro 660T': 'sealminer-a3-pro-hydro',
  'WhatsMiner M50S': 'whatsminer-m50s',
  'WhatsMiner M60S': 'whatsminer-m60s',
  'WhatsMiner M60S+': 'whatsminer-m60s-plus',
  'WhatsMiner M60S++': 'whatsminer-m60s-plus-plus',
  'WhatsMiner M63S 400T': 'whatsminer-m63s',
  'WhatsMiner M63S+': 'whatsminer-m63s-plus',
  'WhatsMiner M66': 'whatsminer-m66',
  'WhatsMiner M66S+': 'whatsminer-m66s-plus',
  'IceRiver XP0 150G': 'iceriver-xp0',
  'IceRiver ALPH AL0 400G': 'iceriver-al0',
  'IceRiver AL3 15T': 'iceriver-al3',
  'IceRiver KAS KS7 30T': 'iceriver-ks7',
  'IceRiver ALEO AE2 720M': 'iceriver-ae2',
  'IceRiver ALEO AE1 Lite 300M': 'iceriver-ae1-lite',
  'Goldshell LT6 3.35G': 'goldshell-lt6',
  'ElphaPex DG Home 1 2.1G': 'elphapex-dg-home-1',
  'Canaan Avalon Nano 3 4T': 'avalon-nano-3',
  'Canaan Avalon Nano 3S 6T': 'avalon-nano-3s',
  'Canaan Avalon Mini 3 37.5T': 'avalon-mini-3',
  'Canaan Avalon A15 200T': 'avalon-a15',
  'VolcMiner D1 Mini 2.2G': 'volcminer-d1-mini',
  'Fluminer L1 Pro 6G': 'fluminer-l1-pro',
  'Fluminer L2 1.2G': 'fluminer-l2',
  'Antminer Z15 Pro 840K': 'antminer-z15-pro',
  'Antminer S21j XP Hyd 495T': 'antminer-s21j-xp-hyd',
  'Fluminer T3 115T': 'fluminer-t3',
  'Pinecone INIBOX 850M': 'pinecone-inibox',
  'Pinecone INIBOX Pro 2.4G': 'pinecone-inibox-pro',
};
const imgDir = path.join(__dirname, '..', 'public', 'assets', 'products');
let imgCount = 0;
for (const [name, key] of Object.entries(IMAGES)) {
  if (!fs.existsSync(path.join(imgDir, `${key}.png`))) continue;
  const p = CATALOG_PRODUCTS.find((x) => x.name === name);
  if (p) { p.image = `/assets/products/${key}.png`; p.images = [p.image]; imgCount++; }
}
console.log(`Images assigned: ${imgCount}`);

// Strip condition words from product names + variant model names — condition is
// shown only as a badge, never inside the title.
const cleanName = (s) => (s || '')
  .replace(/\b(brand\s*new|used|refurbished|refurb)\b/gi, '')
  .replace(/\s{2,}/g, ' ').replace(/^[\s\-–|]+|[\s\-–|]+$/g, '').trim();
for (const p of CATALOG_PRODUCTS) {
  if (typeof p.name === 'string') p.name = cleanName(p.name);
  if (Array.isArray(p.variants)) for (const v of p.variants) if (v.model) v.model = cleanName(v.model);
  if (p.details && p.details.model) p.details.model = cleanName(p.details.model);
}

const banner =
  '// AUTO-GENERATED catalog (csv-to-catalog + enrich + add-supplier-miners +\n' +
  '// update-supplier-pricing). Public static fields only — no stock/availability.\n';
fs.writeFileSync(OUT, banner +
  "import type { Product } from '../lib/api';\n\n" +
  'export const CATALOG_PRODUCTS: Product[] = ' + JSON.stringify(CATALOG_PRODUCTS, null, 2) + ';\n');
console.log(`Repriced. Total products: ${CATALOG_PRODUCTS.length}`);
