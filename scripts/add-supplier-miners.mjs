// Adds the approved Chinese-supplier miners (±10 tolerance verification report)
// to src/data/catalog.ts: 28 new products + variants on 5 existing products.
// Static specs only (ASICMinerValue). All new units are Brand New. Prices are
// the final CAD figures from the verification report. No existing prices change
// (existing variants keep their on-site price). No accessories touched.
//   Run:  node scripts/add-supplier-miners.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CATALOG_PRODUCTS } from '../src/data/catalog.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'src', 'data', 'catalog.ts');
const slug = (n) => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// ── NEW PRODUCTS ──────────────────────────────────────────────────────────────
// v: [label, model, hashrate, hUnit, power, eff, effUnit, priceCAD]  (first = highest)
const NEW = [
  { name: 'Antminer L11 20G', brand: 'Bitmain', algo: 'Scrypt', cool: 'Air',
    details: { release: 'Sep 2025', size: '195 x 290 x 379 mm', weight: '15500 g', noise: '75 dB', interface: 'Ethernet', temperature: '5 - 45 °C', humidity: '5 - 95 %' },
    v: [['20G','Antminer L11 (20Gh)','20','GH/s','3680','0.184','J/MH','9995']] },

  { name: 'Antminer S21e Hyd', brand: 'Bitmain', algo: 'SHA-256', cool: 'Hydro',
    details: { release: 'Aug 2025', size: '410 x 170 x 209 mm', weight: '12800 g', noise: '50 dB', voltage: '380-415V', interface: 'Ethernet', temperature: '5 - 45 °C', humidity: '5 - 95 %' },
    v: [['310T','Antminer S21e Hyd (310Th)','310','TH/s','5270','17','J/TH','2982'],
        ['288T','Antminer S21e Hyd (288Th)','288','TH/s','4896','17','J/TH','2796']] },

  { name: 'SealMiner A2 Pro Hyd 500T', brand: 'Bitdeer', algo: 'SHA-256', cool: 'Hydro',
    details: { release: 'Mar 2025', noise: '50 dB', interface: 'Ethernet', temperature: '5 - 40 °C', humidity: '10 - 90 %' },
    v: [['500T','SealMiner A2 Pro Hyd (500Th)','500','TH/s','7450','14.9','J/TH','10703']] },

  { name: 'SealMiner A2 Pro Air 260T', brand: 'Bitdeer', algo: 'SHA-256', cool: 'Air',
    details: { release: 'Mar 2025', noise: '75 dB', fans: '4', interface: 'Ethernet', temperature: '5 - 40 °C', humidity: '10 - 90 %' },
    v: [['260T','SealMiner A2 Pro Air (260Th)','260','TH/s','3790','14.6','J/TH','5342']] },

  { name: 'SealMiner A3 Pro Hydro 660T', brand: 'Bitdeer', algo: 'SHA-256', cool: 'Hydro',
    details: { release: 'Sep 2025', interface: 'Ethernet' },
    v: [['660T','SealMiner A3 Pro Hydro (660Th)','660','TH/s','8250','12.5','J/TH','15507']] },

  { name: 'WhatsMiner M50S', brand: 'MicroBT', algo: 'SHA-256', cool: 'Air', details: {},
    v: [['126T','WhatsMiner M50S (126Th)','126','TH/s','3276','26','J/TH','1916'],
        ['124T','WhatsMiner M50S (124Th)','124','TH/s','3276','26.4','J/TH','1901']] },

  { name: 'WhatsMiner M60S', brand: 'MicroBT', algo: 'SHA-256', cool: 'Air', details: {},
    v: [['192T','WhatsMiner M60S (192Th)','192','TH/s','3441','17.9','J/TH','3030'],
        ['190T','WhatsMiner M60S (190Th)','190','TH/s','3441','18.1','J/TH','3008'],
        ['188T','WhatsMiner M60S (188Th)','188','TH/s','3441','18.3','J/TH','2986']] },

  { name: 'WhatsMiner M60S+', brand: 'MicroBT', algo: 'SHA-256', cool: 'Air', details: {},
    v: [['208T','WhatsMiner M60S+ (208Th)','208','TH/s','3600','17.3','J/TH','3471'],
        ['206T','WhatsMiner M60S+ (206Th)','206','TH/s','3600','17.5','J/TH','3447'],
        ['204T','WhatsMiner M60S+ (204Th)','204','TH/s','3600','17.6','J/TH','3423']] },

  { name: 'WhatsMiner M60S++', brand: 'MicroBT', algo: 'SHA-256', cool: 'Air', details: {},
    v: [['226T','WhatsMiner M60S++ (226Th)','226','TH/s','3600','15.9','J/TH','3916'],
        ['224T','WhatsMiner M60S++ (224Th)','224','TH/s','3600','16.1','J/TH','3890'],
        ['222T','WhatsMiner M60S++ (222Th)','222','TH/s','3600','16.2','J/TH','3864'],
        ['220T','WhatsMiner M60S++ (220Th)','220','TH/s','3600','16.4','J/TH','3837']] },

  { name: 'WhatsMiner M63S 400T', brand: 'MicroBT', algo: 'SHA-256', cool: 'Hydro', details: {},
    v: [['400T','WhatsMiner M63S (400Th)','400','TH/s','7215','18','J/TH','4961']] },

  { name: 'WhatsMiner M63S+', brand: 'MicroBT', algo: 'SHA-256', cool: 'Hydro', details: {},
    v: [['430T','WhatsMiner M63S+ (430Th)','430','TH/s','7208','16.8','J/TH','5630'],
        ['428T','WhatsMiner M63S+ (428Th)','428','TH/s','7208','16.8','J/TH','5606'],
        ['420T','WhatsMiner M63S+ (420Th)','420','TH/s','7208','17.2','J/TH','5512'],
        ['418T','WhatsMiner M63S+ (418Th)','418','TH/s','7208','17.2','J/TH','5488']] },

  { name: 'WhatsMiner M66', brand: 'MicroBT', algo: 'SHA-256', cool: 'Hydro', details: {},
    v: [['280T','WhatsMiner M66 (280Th)','280','TH/s','5572','19.9','J/TH','3546'],
        ['274T','WhatsMiner M66 (274Th)','274','TH/s','5572','20.3','J/TH','3491'],
        ['272T','WhatsMiner M66 (272Th)','272','TH/s','5572','20.5','J/TH','3471']] },

  { name: 'WhatsMiner M66S+', brand: 'MicroBT', algo: 'SHA-256', cool: 'Hydro', details: {},
    v: [['318T','WhatsMiner M66S+ (318Th)','318','TH/s','5406','17','J/TH','4354'],
        ['316T','WhatsMiner M66S+ (316Th)','316','TH/s','5406','17.1','J/TH','4332']] },

  { name: 'IceRiver XP0 150G', brand: 'IceRiver', algo: 'XPHash', cool: 'Air',
    details: { release: 'May 2026', size: '200 x 194 x 74 mm', weight: '2500 g', noise: '50 dB', interface: 'Ethernet' },
    v: [['150G','IceRiver XP0 (150Gh)','150','GH/s','60','0.4','J/GH','2986']] },

  { name: 'IceRiver ALPH AL0 400G', brand: 'IceRiver', algo: 'Blake3', cool: 'Air',
    details: { release: 'Aug 2024', size: '200 x 194 x 74 mm', weight: '2500 g', noise: '50 dB', voltage: '100-240V', interface: 'Ethernet' },
    v: [['400G','IceRiver ALPH AL0 (400Gh)','400','GH/s','100','0.25','J/GH','1215']] },

  { name: 'IceRiver AL3 15T', brand: 'IceRiver', algo: 'Blake3', cool: 'Air',
    details: { release: 'Sep 2024', size: '370 x 195 x 290 mm', interface: 'Ethernet', temperature: '5 - 40 °C' },
    v: [['15T','IceRiver AL3 (15Th)','15','TH/s','3500','0.233','J/GH','2373']] },

  { name: 'IceRiver KAS KS7 30T', brand: 'IceRiver', algo: 'kHeavyHash', cool: 'Air',
    details: { release: 'Apr 2025', size: '430 x 195 x 290 mm', weight: '17500 g', interface: 'Ethernet' },
    v: [['30T','IceRiver KAS KS7 (30Th)','30','TH/s','3500','0.117','J/GH','3732']] },

  { name: 'IceRiver ALEO AE2 720M', brand: 'IceRiver', algo: 'zkSNARK', cool: 'Air',
    details: { release: 'Jul 2025', size: '205 x 110 x 202 mm', weight: '4690 g', noise: '50 dB', voltage: '100-240V', interface: 'Ethernet', temperature: '5 - 45 °C', humidity: '10 - 90 %' },
    v: [['720M','IceRiver ALEO AE2 (720Mh)','720','MH/s','1300','1.806','J/MH','4690']] },

  { name: 'IceRiver ALEO AE1 Lite 300M', brand: 'IceRiver', algo: 'zkSNARK', cool: 'Air',
    details: { release: 'Apr 2025', size: '298 x 208 x 304 mm', weight: '4690 g', noise: '45 dB', fans: '1', voltage: '100-240V', interface: 'Ethernet', temperature: '5 - 40 °C' },
    v: [['300M','IceRiver ALEO AE1 Lite (300Mh)','300','MH/s','500','1.667','J/MH','2344']] },

  { name: 'Goldshell LT6 3.35G', brand: 'Goldshell', algo: 'Scrypt', cool: 'Air',
    details: { release: 'Jan 2022', size: '264 x 200 x 290 mm', weight: '12500 g', noise: '80 dB', fans: '4', interface: 'Ethernet', temperature: '5 - 35 °C', humidity: '5 - 95 %' },
    v: [['3.35G','Goldshell LT6 (3.35Gh)','3.35','GH/s','3200','0.955','J/MH','2086']] },

  { name: 'ElphaPex DG Home 1 2.1G', brand: 'ElphaPex', algo: 'Scrypt', cool: '',
    details: { release: 'Oct 2024', noise: '50 dB', interface: 'Ethernet 10/100M', temperature: '5 - 45 °C', humidity: '5 - 95 %' },
    v: [['2.1G','ElphaPex DG Home 1 (2.1Gh)','2.1','GH/s','620','0.295','J/MH','1730']] },

  { name: 'Canaan Avalon Nano 3 4T', brand: 'Canaan', algo: 'SHA-256', cool: 'Air',
    details: { release: 'Feb 2024', size: '205 x 115 x 57 mm', weight: '725 g', noise: '35 dB', voltage: '28V', interface: 'Ethernet', temperature: '5 - 45 °C', humidity: '5 - 95 %' },
    v: [['4T','Canaan Avalon Nano 3 (4Th)','4','TH/s','140','35','J/TH','1086']] },

  { name: 'Canaan Avalon Nano 3S 6T', brand: 'Canaan', algo: 'SHA-256', cool: 'Air',
    details: { release: 'Jan 2025', size: '205 x 115 x 58 mm', weight: '860 g', noise: '40 dB', voltage: '28V', interface: 'Ethernet / Wifi' },
    v: [['6T','Canaan Avalon Nano 3S (6Th)','6','TH/s','140','23.3','J/TH','1243']] },

  { name: 'Canaan Avalon Mini 3 37.5T', brand: 'Canaan', algo: 'SHA-256', cool: 'Air',
    details: { release: 'Jan 2025', size: '760 x 104 x 214 mm', weight: '8350 g', noise: '55 dB', voltage: '110-240V', interface: 'Ethernet' },
    v: [['37.5T','Canaan Avalon Mini 3 (37.5Th)','37.5','TH/s','800','21.3','J/TH','2087']] },

  { name: 'Canaan Avalon A15 200T', brand: 'Canaan', algo: 'SHA-256', cool: 'Air',
    details: { release: 'Dec 2024', size: '301 x 192 x 292 mm', weight: '14900 g', noise: '75 dB', interface: 'Ethernet' },
    v: [['200T','Canaan Avalon A15 (200Th)','200','TH/s','3647','18.2','J/TH','2316']] },

  { name: 'VolcMiner D1 Mini 2.2G', brand: 'VolcMiner', algo: 'Scrypt', cool: 'Air',
    details: { release: 'Jan 2025', size: '175 x 202 x 135 mm', weight: '4650 g', noise: '55 dB', interface: 'Ethernet', temperature: '5 - 45 °C', humidity: '5 - 95 %' },
    v: [['2.2G','VolcMiner D1 Mini (2.2Gh)','2.2','GH/s','500','0.227','J/MH','1815']] },

  { name: 'Fluminer L1 Pro 6G', brand: 'Fluminer', algo: 'Scrypt', cool: 'Air',
    details: { release: 'Jun 2025', size: '140 x 300 x 450 mm', weight: '12800 g', noise: '45 dB', fans: '3', interface: 'Ethernet / WiFi', temperature: '5 - 40 °C', humidity: '5 - 95 %' },
    v: [['6G','Fluminer L1 Pro (6Gh)','6','GH/s','1400','0.233','J/MH','2201']] },

  { name: 'Fluminer L2 1.2G', brand: 'Fluminer', algo: 'Scrypt', cool: 'Air',
    details: { release: 'Jun 2025' },
    v: [['1.2G','Fluminer L2 (1.2Gh)','1.2','GH/s','230','0.192','J/MH','1444']] },

  // ── Corrected-name products (PR #30 review, rechecked vs ASICMinerValue) ──
  { name: 'Antminer Z15 Pro 840K', brand: 'Bitmain', algo: 'Equihash', cool: 'Air',
    details: { release: 'Jun 2023', size: '245 x 132 x 290 mm', weight: '5900 g', noise: '75 dB', fans: '2', interface: 'RJ45 Ethernet 10/100M', temperature: '5 - 40 °C', humidity: '10 - 90 %' },
    v: [['840K','Antminer Z15 Pro (840Kh)','840','KH/s','2780','3.31','J/kSol','12669']] },

  { name: 'Antminer S21j XP Hyd 495T', brand: 'Bitmain', algo: 'SHA-256', cool: 'Hydro',
    details: { release: 'Mar 2026', size: '410 x 170 x 209 mm', noise: '50 dB', interface: 'Ethernet', temperature: '5 - 45 °C', humidity: '5 - 95 %' },
    v: [['495T','Antminer S21j XP Hyd (495Th)','495','TH/s','5940','12','J/TH','10913']] },

  { name: 'Fluminer T3 115T', brand: 'Fluminer', algo: 'SHA-256', cool: 'Air',
    details: { release: 'Jun 2025', size: '450 x 140 x 300 mm', weight: '12600 g', noise: '50 dB', temperature: '5 - 45 °C', humidity: '5 - 95 %' },
    v: [['115T','Fluminer T3 (115Th)','115','TH/s','1700','14.78','J/TH','3160']] },

  { name: 'Pinecone INIBOX 850M', brand: 'Pinecone', algo: 'VersaHash', cool: 'Air',
    details: { release: '2025', size: '195 x 165 x 125 mm', weight: '3050 g', noise: '60 dB', voltage: '220V', interface: 'Ethernet', temperature: '5 - 40 °C' },
    v: [['850M','Pinecone INIBOX (850Mh)','850','MH/s','500','0.588','J/MH','1943']] },

  { name: 'Pinecone INIBOX Pro 2.4G', brand: 'Pinecone', algo: 'VersaHash', cool: 'Air',
    details: { release: '2025', size: '270 x 184 x 291 mm', weight: '10700 g', noise: '70 dB', voltage: '220V', interface: 'Ethernet', temperature: '5 - 40 °C' },
    v: [['2.4G','Pinecone INIBOX Pro (2.4Gh)','2.4','GH/s','1280','0.533','J/MH','5274']] },
];

const mkVariant = ([label, model, hashrate, hashrate_unit, power, efficiency, efficiency_unit, price]) =>
  ({ label, model, hashrate, hashrate_unit, power, efficiency, efficiency_unit, price });

let nextId = 900000001;
for (const n of NEW) {
  const variants = n.v.map(mkVariant);
  const top = variants[0];
  CATALOG_PRODUCTS.push({
    id: nextId++,
    name: n.name,
    slug: slug(n.name),
    sku: '',
    brand: n.brand,
    price: top.price,
    sale_price: '',
    stock_status: 'onbackorder',
    stock_quantity: null,
    condition: 'New',                 // Brand New
    cooling: n.cool,
    algorithm: n.algo,
    hashrate: top.hashrate,
    hashrate_unit: top.hashrate_unit,
    power: top.power,
    efficiency: top.efficiency,
    efficiency_unit: top.efficiency_unit,
    image: '',
    images: [],
    badge: '',
    short_description: '',
    featured: false,
    categories: [],
    permalink: '',
    details: { model: top.model, ...n.details },
    variants,
  });
}

// ── VARIANTS on EXISTING products (existing variant keeps its on-site price) ──
const addVariants = (id, variants, newTop) => {
  const p = CATALOG_PRODUCTS.find((x) => x.id === id);
  if (!p) { console.error('missing existing product id', id); return; }
  p.variants = variants.map(mkVariant);
  if (newTop) {                       // M60: card must show the higher 174T
    Object.assign(p, newTop);
    p.details = { ...(p.details || {}), model: variants[0][1] };
  }
};

// L9 (17G existing $4960) — card stays 17G; add 16.5/16/15
addVariants(714997514, [
  ['17G','Antminer L9 (17Gh)','17','GH/s','3570','0.21','J/MH','4960.00'],
  ['16.5G','Antminer L9 (16.5Gh)','16.5','GH/s','3570','0.216','J/MH','5119'],
  ['16G','Antminer L9 (16Gh)','16','GH/s','3360','0.21','J/MH','4961'],
  ['15G','Antminer L9 (15Gh)','15','GH/s','3360','0.224','J/MH','4661'],
]);
// L7 (9.5G existing $1830)
addVariants(632647001, [
  ['9.5G','Antminer L7 (9.5Gh)','9.5','GH/s','3425','0.361','J/MH','1830.00'],
  ['9.3G','Antminer L7 (9.3Gh)','9.3','GH/s','3425','0.368','J/MH','1973'],
  ['9.05G','Antminer L7 (9.05Gh)','9.05','GH/s','3425','0.378','J/MH','1930'],
  ['8.8G','Antminer L7 (8.8Gh)','8.8','GH/s','3425','0.389','J/MH','1901'],
]);
// S19 XP+ Hyd (293 existing $2350)
addVariants(769891696, [
  ['293T','Antminer S19 XP+ Hyd (293Th)','293','TH/s','5567','19','J/TH','2350.00'],
  ['279T','Antminer S19 XP+ Hyd (279Th)','279','TH/s','5301','19','J/TH','2100'],
]);
// S21+ Hyd (358 existing $4299)
addVariants(673979256, [
  ['358T','Antminer S21+ Hyd (358Th)','358','TH/s','5360','15','J/TH','4299.00'],
  ['319T','Antminer S21+ Hyd (319Th)','319','TH/s','4785','15','J/TH','3862'],
]);
// M60 (172 existing $3899.99) — card now shows 174T (highest)
addVariants(673979281, [
  ['174T','WhatsMiner M60 (174Th)','174','TH/s','3422','19.67','J/TH','2710'],
  ['172T','WhatsMiner M60 (172Th)','172','TH/s','3422','19.9','J/TH','3899.99'],
  ['170T','WhatsMiner M60 (170Th)','170','TH/s','3422','20.13','J/TH','2669'],
], { hashrate: '174', hashrate_unit: 'TH/s', power: '3422', efficiency: '19.67', efficiency_unit: 'J/TH', price: '2710' });

// S21 Pro — repurpose the existing (blank-condition) S21 Pro 245 listing into ONE
// clean Brand New grouped card with 245T/234T/220T variants (supplier prices).
// The separate "S21 Pro (234Th) USED" listing is kept untouched (Used).
// 220T watts/efficiency are left blank: not on ASICMinerValue and not invented.
const s21pro = CATALOG_PRODUCTS.find((x) => x.id === 769891226);
if (s21pro) {
  s21pro.name = 'Antminer S21 Pro BRAND NEW';
  s21pro.slug = 'antminer-s21-pro-brand-new';
  s21pro.brand = 'Bitmain';
  s21pro.condition = 'New';
  s21pro.cooling = 'Air';
  s21pro.algorithm = 'SHA-256';
  s21pro.variants = [
    { label: '245T', model: 'Antminer S21 Pro (245Th)', hashrate: '245', hashrate_unit: 'TH/s', power: '3510', efficiency: '14.3', efficiency_unit: 'J/TH', price: '3991' },
    { label: '234T', model: 'Antminer S21 Pro (234Th)', hashrate: '234', hashrate_unit: 'TH/s', power: '3531', efficiency: '15.1', efficiency_unit: 'J/TH', price: '3821' },
    { label: '220T', model: 'Antminer S21 Pro (220Th)', hashrate: '220', hashrate_unit: 'TH/s', power: '', efficiency: '', efficiency_unit: 'J/TH', price: '3617' },
  ];
  Object.assign(s21pro, { hashrate: '245', hashrate_unit: 'TH/s', power: '3510', efficiency: '14.3', efficiency_unit: 'J/TH', price: '3991' });
  s21pro.details = { ...(s21pro.details || {}), model: 'Antminer S21 Pro (245Th)' };
}

const banner =
  '// AUTO-GENERATED catalog (csv-to-catalog + enrich + add-supplier-miners).\n' +
  '// Public static fields only — no price/stock/availability beyond catalog data.\n';
fs.writeFileSync(OUT, banner +
  "import type { Product } from '../lib/api';\n\n" +
  'export const CATALOG_PRODUCTS: Product[] = ' + JSON.stringify(CATALOG_PRODUCTS, null, 2) + ';\n');
console.log(`Added ${NEW.length} new products + variants on 5 existing. Total products: ${CATALOG_PRODUCTS.length}`);
