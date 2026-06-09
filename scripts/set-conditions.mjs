// One-off: set the condition field (badge source) for miners that were missing
// it. Condition is shown only as a badge/tag — never written into the title.
// Operates on the existing catalog; changes nothing else.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CATALOG_PRODUCTS } from '../src/data/catalog.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'src', 'data', 'catalog.ts');

const NEW = [769976558, 769891696, 769891202, 769891205, 769976557, 799704490, 800783108, 673979281, 769987262];
const USED = [673979279];

const set = (ids, value) => {
  for (const id of ids) {
    const p = CATALOG_PRODUCTS.find((x) => x.id === id);
    if (!p) { console.error('NOT FOUND', id); continue; }
    p.condition = value;
    console.log(`${id} -> ${value} | ${p.name}`);
  }
};
set(NEW, 'New');
set(USED, 'Used');

const banner =
  '// AUTO-GENERATED catalog (csv-to-catalog + enrich + add-supplier-miners +\n' +
  '// update-supplier-pricing). Public static fields only — no stock/availability.\n';
fs.writeFileSync(OUT, banner +
  "import type { Product } from '../lib/api';\n\n" +
  'export const CATALOG_PRODUCTS: Product[] = ' + JSON.stringify(CATALOG_PRODUCTS, null, 2) + ';\n');
console.log('Done. Total products:', CATALOG_PRODUCTS.length);
