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
    if (!id) return;
    let cancelled = false;
    setLoading(true);

    fetchProduct(id)
      .then(data => { if (!cancelled) { setProduct(data); setLoading(false); } })
      .catch(() => {
        if (!cancelled) {
          const fallback = MOCK_NORMALIZED.find(p => p.id === id) || MOCK_NORMALIZED[0];
          setProduct(fallback);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [id]);

  return { product, loading };
}
