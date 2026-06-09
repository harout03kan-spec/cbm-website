// One-off: remove the Antminer S21+ 225T card (id 769891202). It has no current
// supplier price and now reads wrong next to the cheaper, higher-hashrate 235TH.
// No grouping added; 216TH, 235TH, hydro S21+, and S21 Pro are untouched.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CATALOG_PRODUCTS } from '../src/data/catalog.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'src', 'data', 'catalog.ts');

const i = CATALOG_PRODUCTS.findIndex((p) => p.id === 769891202);
if (i === -1) { console.error('S21+ 225T not found'); process.exit(1); }
console.log('Removing:', CATALOG_PRODUCTS[i].name);
CATALOG_PRODUCTS.splice(i, 1);

const banner =
  '// AUTO-GENERATED catalog (csv-to-catalog + enrich + add-supplier-miners +\n' +
  '// update-supplier-pricing). Public static fields only — no stock/availability.\n';
fs.writeFileSync(OUT, banner +
  "import type { Product } from '../lib/api';\n\n" +
  'export const CATALOG_PRODUCTS: Product[] = ' + JSON.stringify(CATALOG_PRODUCTS, null, 2) + ';\n');
console.log('Total products:', CATALOG_PRODUCTS.length);
