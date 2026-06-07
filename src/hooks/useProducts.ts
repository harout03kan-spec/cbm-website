import { useState, useEffect } from 'react';
import { fetchProducts, fetchProduct, Product } from '../lib/api';
import { CATALOG_PRODUCTS } from '../data/catalog';

// While the live WordPress API is blocked by the SiteGround anti-bot challenge,
// the real exported catalog (scripts/catalog_source.csv → src/data/catalog.ts)
// is the product data source. When the API is reachable again it takes priority.
const MOCK_NORMALIZED = CATALOG_PRODUCTS;

// ─── useProducts ──────────────────────────────────────────────────────────────
export function useProducts(params: {
  featured?: boolean;
  condition?: string;
  cooling?: string;
  per_page?: number;
} = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetchProducts(params)
      .then(data => {
        if (!cancelled) {
          setProducts(data.length > 0 ? data : MOCK_NORMALIZED);
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          // Silently fall back to mock data so the site always works
          setProducts(MOCK_NORMALIZED);
          setError(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.featured, params.condition, params.cooling, params.per_page]);

  return { products, loading, error };
}

// ─── useProduct (single) ──────────────────────────────────────────────────────
export function useProduct(id: number | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setProduct(null); setLoading(false); return; }
    let cancelled = false;
    setLoading(true);

    // The catalog is the source of truth (the live API is captcha-blocked).
    // Look up strictly by id — never fall back to a different product, so a bad
    // or unknown id yields null (a clean "not found"), not the wrong product.
    const local = MOCK_NORMALIZED.find(p => p.id === id) || null;
    fetchProduct(id)
      .then(data => { if (!cancelled) { setProduct(data || local); setLoading(false); } })
      .catch(() => { if (!cancelled) { setProduct(local); setLoading(false); } });

    return () => { cancelled = true; };
  }, [id]);

  return { product, loading };
}
