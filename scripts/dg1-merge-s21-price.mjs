// One-off: (1) merge the two ElphaPex DG1+ cards (14G + 13G) into one grouped
// product with variants (card shows the highest, 14G); (2) update Antminer S21+
// 235TH to the latest supplier-calculated CAD price. No other products touched.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CATALOG_PRODUCTS } from '../src/data/catalog.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'src', 'data', 'catalog.ts');

// (1) DG1+ merge — keep the 14G product (769987280) as the grouped card, drop 13G (799721637).
const dg14 = CATALOG_PRODUCTS.find((p) => p.id === 769987280);
const dg13 = CATALOG_PRODUCTS.find((p) => p.id === 799721637);
if (dg14 && dg13) {
  dg14.name = 'ElphaPex DG1+';
  dg14.variants = [
    { label: '14G', model: 'ElphaPex DG1+ 14G', hashrate: '14', hashrate_unit: 'GH/s', power: '3920', efficiency: '0.28', efficiency_unit: 'J/MH', price: '2916' },
    { label: '13G', model: 'ElphaPex DG1+ 13G', hashrate: '13', hashrate_unit: 'GH/s', power: '3920', efficiency: '0.28', efficiency_unit: 'J/MH', price: '2630' },
  ];
  // Top-level fields already equal the highest (14G); keep them. Card shows 14G.
  dg14.details = { ...(dg14.details || {}), model: 'ElphaPex DG1+ 14G' };
  const i = CATALOG_PRODUCTS.indexOf(dg13);
  CATALOG_PRODUCTS.splice(i, 1);
  console.log('Merged DG1+: kept 769987280 with variants [14G,13G]; removed 799721637');
} else {
  console.error('DG1+ products not found');
}

// (2) S21+ 235TH supplier-calculated price -> 3228 CAD.
const s21p235 = CATALOG_PRODUCTS.find((p) => p.id === 769891205);
if (s21p235) { s21p235.price = '3228'; console.log('S21+ 235TH price ->', s21p235.price); }

const banner =
  '// AUTO-GENERATED catalog (csv-to-catalog + enrich + add-supplier-miners +\n' +
  '// update-supplier-pricing). Public static fields only — no stock/availability.\n';
fs.writeFileSync(OUT, banner +
  "import type { Product } from '../lib/api';\n\n" +
  'export const CATALOG_PRODUCTS: Product[] = ' + JSON.stringify(CATALOG_PRODUCTS, null, 2) + ';\n');
console.log('Total products:', CATALOG_PRODUCTS.length);
