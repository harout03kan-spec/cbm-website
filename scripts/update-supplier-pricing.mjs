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

// Variant sets — normalize to supplier-calculated CAD (monotonic: higher hashrate
// never cheaper than a lower one). Card price = highest variant.
repriceVariants(714997514, { '17G': '5276', '16.5G': '5119', '16G': '4961', '15G': '4661' }, '5276'); // L9 (17G extrapolated)
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

const banner =
  '// AUTO-GENERATED catalog (csv-to-catalog + enrich + add-supplier-miners +\n' +
  '// update-supplier-pricing). Public static fields only — no stock/availability.\n';
fs.writeFileSync(OUT, banner +
  "import type { Product } from '../lib/api';\n\n" +
  'export const CATALOG_PRODUCTS: Product[] = ' + JSON.stringify(CATALOG_PRODUCTS, null, 2) + ';\n');
console.log(`Repriced. Total products: ${CATALOG_PRODUCTS.length}`);
