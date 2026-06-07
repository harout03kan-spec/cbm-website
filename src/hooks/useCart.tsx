import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface CartItem {
  id: number;
  quantity: number;
  variant?: string;   // selected variant label (e.g. "16.5G", "310T"); undefined = base product
}

interface CartContextValue {
  items: CartItem[];
  totalQuantity: number;
  addItem: (id: number, quantity?: number, variant?: string) => void;
  updateQuantity: (id: number, quantity: number, variant?: string) => void;
  removeItem: (id: number, variant?: string) => void;
  clearCart: () => void;
}

const STORAGE_KEY = 'cbm_cart';
const sameLine = (a: CartItem, id: number, variant?: string) =>
  a.id === id && (a.variant || '') === (variant || '');

const CartContext = createContext<CartContextValue | undefined>(undefined);

function readStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((x: unknown): x is CartItem =>
        !!x && typeof (x as CartItem).id === 'number' && typeof (x as CartItem).quantity === 'number')
      .map(x => ({
        id: x.id,
        quantity: Math.max(1, Math.floor(x.quantity)),
        ...(typeof x.variant === 'string' && x.variant ? { variant: x.variant } : {}),
      }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readStoredCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable (private mode / quota) — cart stays in memory */
    }
  }, [items]);

  // A product + variant is its own cart line (so L9 15G and L9 17G are separate).
  const addItem = useCallback((id: number, quantity = 1, variant?: string) => {
    const qty = Math.max(1, Math.floor(quantity));
    setItems(prev => {
      const existing = prev.find(i => sameLine(i, id, variant));
      if (existing) {
        return prev.map(i => (sameLine(i, id, variant) ? { ...i, quantity: i.quantity + qty } : i));
      }
      return [...prev, { id, quantity: qty, ...(variant ? { variant } : {}) }];
    });
  }, []);

  const updateQuantity = useCallback((id: number, quantity: number, variant?: string) => {
    if (quantity < 1) return;
    setItems(prev => prev.map(i => (sameLine(i, id, variant) ? { ...i, quantity } : i)));
  }, []);

  const removeItem = useCallback((id: number, variant?: string) => {
    setItems(prev => prev.filter(i => !sameLine(i, id, variant)));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, totalQuantity, addItem, updateQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
