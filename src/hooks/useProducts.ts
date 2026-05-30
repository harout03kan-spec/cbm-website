import { useState, useEffect } from 'react';
import { fetchProducts, fetchProduct, Product } from '../lib/api';
import { products as mockProducts } from '../mocks/products';

// Convert mock product shape to Product interface shape
function normalizeMock(p: typeof mockProducts[0]): Product {
  return {
    id: p.id,
    name: p.name,
    slug: p.name.toLowerCase().replace(/\s+/g, '-'),
    price: p.price,
    sale_price: '',
    stock_status: 'instock',
    stock_quantity: null,
    condition: p.condition,
    cooling: p.cooling,
    algorithm: (p as any).algorithm || 'SHA-256',
    hashrate: p.hashrate,
    power: p.power,
    efficiency: p.efficiency,
    image: p.image,
    images: [p.image],
    badge: '',
    short_description: '',
    featured: p.id <= 4,
    categories: [],
    permalink: '',
  };
}

const MOCK_NORMALIZED = mockProducts.map(normalizeMock);

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
