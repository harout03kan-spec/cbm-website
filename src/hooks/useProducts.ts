import { Product } from '../lib/api';
import { CATALOG_PRODUCTS } from '../data/catalog';

// The enriched local catalog (src/data/catalog.ts) is the single source of
// truth for the storefront. The live WordPress API is behind a SiteGround
// anti-bot challenge and, when it does respond, returns incomplete data
// (default algorithm, no spec units, no detail fields, different ids) that
// would override our ASICMinerValue-sourced static specs and break product
// links. So we read from the catalog directly — synchronous, deterministic,
// and identical between local and deployed builds. The same product objects
// (and ids) feed the shop grid and the detail page, so every link resolves.

// ─── useProducts ──────────────────────────────────────────────────────────────
export function useProducts(_params: {
  featured?: boolean;
  condition?: string;
  cooling?: string;
  per_page?: number;
} = {}) {
  const products: Product[] = CATALOG_PRODUCTS;
  return { products, loading: false, error: null as string | null };
}

// ─── useProduct (single) ──────────────────────────────────────────────────────
export function useProduct(id: number | null) {
  // Strict id match against the same catalog the cards link to. Unknown id →
  // null (clean "not found") — never substitute a different product.
  const product = id ? (CATALOG_PRODUCTS.find(p => p.id === id) || null) : null;
  return { product, loading: false };
}
