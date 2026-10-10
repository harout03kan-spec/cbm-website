import { useEffect, useState } from 'react';
import { Product } from '../lib/api';
import { CATALOG_PRODUCTS } from '../data/catalog';
import { ecwidCatalogEnabled, loadEcwidCatalog } from '../lib/ecwidCatalog';

// Where products come from:
//  • Ecwid (My e-Shop) once the new store is switched on — the single place
//    products, prices, specs and categories are managed. See lib/ecwidCatalog.
//  • Otherwise the bundled catalog (src/data/catalog.ts), so the site keeps
//    working until the Ecwid catalog is ready.
// Both feed the same Product shape, so the shop grid, cards and detail page
// stay identical and every link resolves by the same id.

// ─── useProducts ──────────────────────────────────────────────────────────────
export function useProducts() {
  const [products, setProducts] = useState<Product[]>(ecwidCatalogEnabled ? [] : CATALOG_PRODUCTS);
  const [loading, setLoading] = useState(ecwidCatalogEnabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ecwidCatalogEnabled) return;
    let alive = true;
    loadEcwidCatalog()
      .then(list => { if (alive) { setProducts(list); setLoading(false); } })
      .catch(e => { if (alive) { setError(String(e?.message || e)); setLoading(false); } });
    return () => { alive = false; };
  }, []);

  return { products, loading, error };
}

// ─── useProduct (single) ──────────────────────────────────────────────────────
export function useProduct(id: number | null) {
  // Strict id match against the same list the cards link to. Unknown id →
  // null (clean "not found") — never substitute a different product.
  const { products, loading } = useProducts();
  const product = id ? (products.find(p => p.id === id) || null) : null;
  return { product, loading };
}
