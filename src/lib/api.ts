// ─── API CONFIG ───────────────────────────────────────────────────────────────
export const WP_BASE = 'https://wholesaleasic.com';
export const CBTC_API = `${WP_BASE}/wp-json/cbtc/v1`;

// ─── PRODUCT TYPE (mirrors WC product + ASIC meta) ───────────────────────────
export interface Product {
  id: number;
  name: string;
  slug: string;
  sku?: string;
  brand?: string;          // manufacturer (Bitmain | MicroBT | Canaan | ElphaPex | IceRiver | VolcMiner)
  price: string;           // regular_price from WC
  sale_price: string;
  stock_status: string;    // 'instock' | 'outofstock' | 'onbackorder'
  stock_quantity: number | null;
  condition: string;       // New | Refurbished | Used
  cooling: string;         // Air | Hydro | Immersion
  algorithm: string;       // SHA-256 | Scrypt
  hashrate: string;        // TH/s
  hashrate_unit?: string;  // display unit for hashrate (TH/s, GH/s, MH/s)
  power: string;           // Watts
  efficiency: string;      // J/TH
  efficiency_unit?: string; // display unit for efficiency (J/TH, J/GH, J/MH)
  image: string;           // first image src
  images: string[];        // all image srcs
  badge: string;
  short_description: string;
  featured: boolean;
  categories: string[];
  permalink: string;
}

// ─── CONTENT TYPE ─────────────────────────────────────────────────────────────
export interface SiteContent {
  home_hero: Record<string, string>;
  home_trust_bar: Record<string, string>;
  home_repair_teaser: Record<string, string>;
  home_final_cta: Record<string, string>;
  home_trust_signals: Record<string, string>;
  faq_shop: Array<{ question: string; answer: string }>;
  faq_repair: Array<{ question: string; answer: string }>;
  services_hero: Record<string, string>;
  services_pricing: Record<string, string>;
  services_extra_pricing: Array<{ name: string; cad: string; usd: string; note: string }>;
  services_trust_points: Array<{ point: string }>;
  hosting_hero: Record<string, string>;
  hosting_tiers: Record<string, string>;
  hosting_included: Array<{ item: string }>;
  about_hero: Record<string, string>;
  about_stats: Record<string, string>;
  about_leadership: Record<string, string>;
  about_differentiators: Array<{ item: string }>;
  about_location: Record<string, string>;
  about_markets: Array<{ market: string }>;
  about_values: Array<{ title: string; text: string }>;
  about_reviews: Array<{ name: string; text: string; featured: string }>;
  global_contact: Record<string, string>;
  [key: string]: unknown;
}

// ─── FETCH PRODUCTS ───────────────────────────────────────────────────────────
export async function fetchProducts(params: {
  featured?: boolean;
  condition?: string;
  cooling?: string;
  per_page?: number;
} = {}): Promise<Product[]> {
  const qs = new URLSearchParams();
  if (params.featured)   qs.set('featured', '1');
  if (params.condition)  qs.set('condition', params.condition);
  if (params.cooling)    qs.set('cooling', params.cooling);
  if (params.per_page)   qs.set('per_page', String(params.per_page));

  const url = `${CBTC_API}/products${qs.toString() ? '?' + qs : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Products API ${res.status}`);
  return res.json();
}

export async function fetchProduct(id: number): Promise<Product> {
  const res = await fetch(`${CBTC_API}/products/${id}`);
  if (!res.ok) throw new Error(`Product API ${res.status}`);
  return res.json();
}

// ─── FETCH CONTENT ────────────────────────────────────────────────────────────
export async function fetchContent(): Promise<SiteContent> {
  const res = await fetch(`${CBTC_API}/content`);
  if (!res.ok) throw new Error(`Content API ${res.status}`);
  return res.json();
}

export async function fetchContentSection<T = unknown>(section: string): Promise<T> {
  const res = await fetch(`${CBTC_API}/content/${section}`);
  if (!res.ok) throw new Error(`Content section API ${res.status}`);
  const json = await res.json();
  return json.data as T;
}
