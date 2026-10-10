/**
 * Ecwid catalog → site Product mapping.
 *
 * Ecwid (My e-Shop) is the single place products are managed: name, price,
 * photos, categories, specs and options. This module reads the public catalog
 * through the Ecwid REST API with a PUBLIC token (read-only, safe in the
 * browser) and maps it to the same Product shape the shop, product page and
 * cards already use, so no page needs to know where products come from.
 *
 * Until the new store is switched on (USE_NEW_STORE in ./ecwid), `ecwidCatalogEnabled`
 * is false and the site keeps using the bundled catalog (src/data/catalog.ts).
 *
 * How products are set up in Ecwid so they map cleanly:
 *  • Categories — "Bitcoin Miners", "Altcoin Miners", "Hydro Miners",
 *    "Home Miners", and "Accessories" with "Power Supplies", "Fans",
 *    "Control Boards", "Cables", "Hashboards" under it. The shop filters read
 *    these names, so a product shows wherever it is ticked.
 *  • Product attributes (custom fields) — Hashrate, Hashrate unit, Power,
 *    Efficiency, Efficiency unit, Algorithm, Cooling, Condition, Manufacturer,
 *    Model, Release, Size, Weight, Noise, Fans, Voltage, Interface,
 *    Temperature, Humidity, Badge, Coin (the red card label, e.g. "LTC/DOGE",
 *    "KAS", "ALEO" — left blank, it is worked out from Algorithm).
 *    Empty fields simply don't show.
 *  • Hashrate versions — one product option (e.g. "Hashrate": 310T / 335T)
 *    with a price per choice. Variation-level attributes (Hashrate, Power,
 *    Efficiency, Model) override the product's when present.
 *
 * Reference: https://api-docs.ecwid.com/reference/products
 */
import type { Product, ProductVariant } from './api';
import { ECWID_STORE_ID, ECWID_PUBLIC_TOKEN } from './ecwid';

const PUBLIC_TOKEN = ECWID_PUBLIC_TOKEN;
const API = `https://app.ecwid.com/api/v3/${ECWID_STORE_ID}`;
const PAGE = 100;

export const ecwidCatalogEnabled = PUBLIC_TOKEN.length > 0;

// ─── Ecwid API shapes (only the fields we read) ───────────────────────────────
export interface EcwidAttribute { name?: string; alias?: string; value?: string }
export interface EcwidChoice { text: string; priceModifier?: number; priceModifierType?: 'ABSOLUTE' | 'PERCENT' }
export interface EcwidOption { name: string; type?: string; choices?: EcwidChoice[] }
export interface EcwidCombination {
  options?: Array<{ name: string; value: string }>;
  price?: number;
  defaultDisplayedPrice?: number;
  sku?: string;
  attributes?: EcwidAttribute[];
}
export interface EcwidImage { imageOriginalUrl?: string; image1500pxUrl?: string; image800pxUrl?: string }
export interface EcwidProduct {
  id: number;
  sku?: string;
  name: string;
  price?: number;
  defaultDisplayedPrice?: number;
  compareToPrice?: number;
  enabled?: boolean;
  inStock?: boolean;
  unlimited?: boolean;
  quantity?: number;
  url?: string;
  description?: string;
  imageUrl?: string;
  originalImageUrl?: string;
  hdThumbnailUrl?: string;
  galleryImages?: Array<{ url?: string; originalImageUrl?: string; imageUrl?: string }>;
  media?: { images?: EcwidImage[] };
  categoryIds?: number[];
  attributes?: EcwidAttribute[];
  options?: EcwidOption[];
  combinations?: EcwidCombination[];
  relatedProducts?: { productIds?: number[] };
}
export interface EcwidCategory { id: number; parentId?: number; name: string; enabled?: boolean }

// ─── helpers ──────────────────────────────────────────────────────────────────
const norm = (s?: string) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

/** Read an attribute by any of its accepted names (case/space-insensitive). */
function attr(list: EcwidAttribute[] | undefined, ...names: string[]): string {
  if (!list) return '';
  const wanted = names.map(norm);
  const hit = list.find(a => wanted.includes(norm(a.name)) || wanted.includes(norm(a.alias)));
  return (hit?.value || '').trim();
}

/** Leading number of a value like "335", "335 TH/s", "3,250 W". */
const numStr = (v: string) => {
  const m = v.replace(/,/g, '').match(/\d+(\.\d+)?/);
  return m ? m[0] : '';
};

const money = (n?: number) => (typeof n === 'number' && Number.isFinite(n) ? n.toFixed(2) : '');

export function stripHtml(html?: string): string {
  return (html || '')
    .replace(/<(br|\/p|\/li|\/h\d)\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n')
    .trim();
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function imagesOf(p: EcwidProduct): string[] {
  const out: string[] = [];
  const push = (u?: string) => { if (u && !out.includes(u)) out.push(u); };
  push(p.originalImageUrl || p.hdThumbnailUrl || p.imageUrl);
  (p.media?.images || []).forEach(i => push(i.imageOriginalUrl || i.image1500pxUrl || i.image800pxUrl));
  (p.galleryImages || []).forEach(g => push(g.originalImageUrl || g.url || g.imageUrl));
  return out;
}

/** The option that holds hashrate versions (named "Hashrate", or the first select option). */
function variantOption(p: EcwidProduct): EcwidOption | undefined {
  const opts = (p.options || []).filter(o => (o.choices || []).length > 0);
  return opts.find(o => /hash/i.test(o.name)) || (opts.length === 1 ? opts[0] : undefined);
}

function variantsOf(p: EcwidProduct, base: { hashrate_unit: string; efficiency_unit: string }): ProductVariant[] | undefined {
  const opt = variantOption(p);
  if (!opt?.choices?.length) return undefined;
  const basePrice = p.price ?? p.defaultDisplayedPrice ?? 0;
  return opt.choices.map((c) => {
    const combo = (p.combinations || []).find(cb =>
      (cb.options || []).some(o => norm(o.name) === norm(opt.name) && o.value === c.text));
    const mod = c.priceModifier || 0;
    const fromModifier = c.priceModifierType === 'PERCENT' ? basePrice * (1 + mod / 100) : basePrice + mod;
    const price = combo?.price ?? combo?.defaultDisplayedPrice ?? fromModifier;
    const ca = combo?.attributes;
    const hashrate = numStr(attr(ca, 'Hashrate')) || numStr(c.text);
    return {
      label: c.text,
      option: opt.name,
      model: attr(ca, 'Model') || undefined,
      hashrate,
      hashrate_unit: attr(ca, 'Hashrate unit') || base.hashrate_unit || undefined,
      power: numStr(attr(ca, 'Power', 'Power consumption', 'Watts')) || undefined,
      efficiency: numStr(attr(ca, 'Efficiency')) || undefined,
      efficiency_unit: attr(ca, 'Efficiency unit') || base.efficiency_unit || undefined,
      price: money(price),
    };
  });
}

/** Map one Ecwid product to the site's Product shape. */
export function mapEcwidProduct(p: EcwidProduct, categoryNames: Map<number, string>): Product {
  const a = p.attributes;
  const hashrate = numStr(attr(a, 'Hashrate'));
  const hashrate_unit = attr(a, 'Hashrate unit') || (hashrate ? 'TH/s' : '');
  const efficiency = numStr(attr(a, 'Efficiency'));
  const efficiency_unit = attr(a, 'Efficiency unit') || (efficiency ? 'J/TH' : '');
  const images = imagesOf(p);
  const categories = (p.categoryIds || []).map(id => categoryNames.get(id)).filter((n): n is string => !!n);
  const variants = variantsOf(p, { hashrate_unit, efficiency_unit });
  // Card shows the first version, so lift its specs/price when the product itself has none.
  const first = variants?.[0];
  const details = {
    model: attr(a, 'Model') || undefined,
    release: attr(a, 'Release', 'Release date') || undefined,
    size: attr(a, 'Size', 'Dimensions') || undefined,
    weight: attr(a, 'Weight') || undefined,
    noise: attr(a, 'Noise', 'Noise level') || undefined,
    fans: attr(a, 'Fans') || undefined,
    voltage: attr(a, 'Voltage') || undefined,
    interface: attr(a, 'Interface') || undefined,
    temperature: attr(a, 'Temperature') || undefined,
    humidity: attr(a, 'Humidity') || undefined,
  };
  const hasDetails = Object.values(details).some(Boolean);
  const salePrice = p.compareToPrice && p.price && p.compareToPrice > p.price ? money(p.price) : '';
  const regular = salePrice ? money(p.compareToPrice) : money(p.price ?? p.defaultDisplayedPrice);
  const instock = p.unlimited || p.inStock !== false;

  return {
    id: p.id,
    name: p.name,
    slug: slugify(p.name),
    sku: p.sku || '',
    brand: attr(a, 'Manufacturer', 'Brand') || undefined,
    price: regular || first?.price || '',
    sale_price: salePrice,
    stock_status: instock ? 'instock' : 'outofstock',
    stock_quantity: p.unlimited ? null : (p.quantity ?? null),
    condition: attr(a, 'Condition'),
    cooling: attr(a, 'Cooling'),
    // Ticked "Bitcoin Miners" but Algorithm left blank → still a SHA-256 miner.
    algorithm: attr(a, 'Algorithm') || (categories.some(c => /bitcoin/i.test(c)) ? 'SHA-256' : ''),
    hashrate: hashrate || first?.hashrate || '',
    hashrate_unit: hashrate_unit || first?.hashrate_unit || '',
    power: numStr(attr(a, 'Power', 'Power consumption', 'Watts')) || first?.power || '',
    efficiency: efficiency || first?.efficiency || '',
    efficiency_unit: efficiency_unit || first?.efficiency_unit || '',
    image: images[0] || '',
    images,
    badge: attr(a, 'Badge'),
    ...(attr(a, 'Coin', 'Coin label', 'Coin type') ? { coin: attr(a, 'Coin', 'Coin label', 'Coin type') } : {}),
    short_description: stripHtml(p.description),
    featured: false,
    categories,
    permalink: p.url || '',
    ...(hasDetails ? { details } : {}),
    ...(variants ? { variants } : {}),
    ...(p.relatedProducts?.productIds?.length ? { related: p.relatedProducts.productIds } : {}),
  };
}

// ─── fetch ────────────────────────────────────────────────────────────────────
async function getAll<T>(path: string): Promise<T[]> {
  const items: T[] = [];
  for (let offset = 0; ; offset += PAGE) {
    const sep = path.includes('?') ? '&' : '?';
    const res = await fetch(`${API}${path}${sep}limit=${PAGE}&offset=${offset}`, {
      headers: { Authorization: `Bearer ${PUBLIC_TOKEN}` },
    });
    if (!res.ok) throw new Error(`Ecwid ${path} → HTTP ${res.status}`);
    const body = (await res.json()) as { total: number; items: T[] };
    items.push(...body.items);
    if (items.length >= body.total || body.items.length === 0) break;
  }
  return items;
}

let cache: Promise<Product[]> | null = null;

/** All enabled Ecwid products, mapped. Fetched once per page load. */
export function loadEcwidCatalog(): Promise<Product[]> {
  if (!cache) {
    cache = (async () => {
      const [cats, prods] = await Promise.all([
        getAll<EcwidCategory>('/categories?hidden_categories=false'),
        getAll<EcwidProduct>('/products?enabled=true'),
      ]);
      const names = new Map(cats.map(c => [c.id, c.name] as [number, string]));
      return prods.filter(p => p.enabled !== false).map(p => mapEcwidProduct(p, names));
    })();
    // Let a failed load be retried on the next mount instead of caching the error.
    cache.catch(() => { cache = null; });
  }
  return cache;
}
