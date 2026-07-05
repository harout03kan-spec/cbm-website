import {
  createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode,
} from 'react';
import {
  loadEcwid, getEcwid, addToEcwidCart, type EcwidCart, ECWID_STORE_ID,
} from '../lib/ecwid';

/**
 * App-wide bridge to the real Ecwid / Lightspeed eCom cart (store 99673270).
 *
 * The React shop UI stays exactly as designed; "Add to Cart" adds the product to
 * the REAL Ecwid cart via the public JS API, and the cart/checkout open in a
 * shared drawer that renders Ecwid's own cart/checkout (where Moneris, orders,
 * emails, statuses, tracking and abandoned-cart recovery all live). Only PUBLIC
 * values are used — no REST token, no Moneris credentials.
 *
 * The Ecwid ProductBrowser needs a container to render cart/checkout into; that
 * container lives (hidden until opened) inside <EcwidCartDrawer/>, which this
 * provider mounts once, app-wide.
 */

// The one Ecwid container the drawer renders cart/checkout into.
export const ECWID_CART_CONTAINER_ID = `cbm-ecwid-cart-${ECWID_STORE_ID}`;

interface EcwidCartContextValue {
  count: number;            // live number of items in the Ecwid cart
  apiReady: boolean;        // Ecwid JS API finished loading
  open: boolean;            // drawer open?
  addProduct: (id: number, quantity?: number) => Promise<EcwidCart>;
  openCart: () => void;
  openCheckout: () => void;
  closeCart: () => void;
}

const EcwidCartContext = createContext<EcwidCartContextValue | undefined>(undefined);

// The hidden internal test route mounts its own Ecwid instance; don't double-init
// a second ProductBrowser on that page.
const isStoreTestRoute = () =>
  typeof window !== 'undefined' && window.location.pathname.startsWith('/store-test-cart');

export function EcwidCartProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);
  const [apiReady, setApiReady] = useState(false);
  const [open, setOpen] = useState(false);
  const loadedRef = useRef(false);

  // Ensure the Ecwid storefront script is loaded and cart callbacks are wired.
  const ensureLoaded = useCallback(() => {
    if (loadedRef.current || isStoreTestRoute()) return;
    loadedRef.current = true;
    loadEcwid(ECWID_CART_CONTAINER_ID);
  }, []);

  useEffect(() => {
    ensureLoaded();

    let cancelled = false;
    let iv: ReturnType<typeof setInterval> | undefined;

    const register = (): boolean => {
      const ecwid = getEcwid();
      if (!ecwid || !ecwid.OnAPILoaded || !ecwid.OnCartChanged) return false;
      ecwid.OnCartChanged.add((cart: EcwidCart) => {
        if (!cancelled) setCount(cart.productsQuantity ?? 0);
      });
      ecwid.OnAPILoaded.add(() => {
        if (cancelled) return;
        setApiReady(true);
        ecwid.Cart.get((cart) => { if (!cancelled) setCount(cart.productsQuantity ?? 0); });
      });
      return true;
    };

    if (!register()) {
      iv = setInterval(() => { if (register() && iv) clearInterval(iv); }, 300);
    }
    return () => { cancelled = true; if (iv) clearInterval(iv); };
  }, [ensureLoaded]);

  // When the drawer is open and Ecwid is ready, show the cart page (never the
  // storefront category grid).
  useEffect(() => {
    if (open && apiReady) getEcwid()?.openPage('cart');
  }, [open, apiReady]);

  // Add to the real Ecwid cart. Waits briefly for the API if a shopper clicks
  // before the script has finished loading.
  const addProduct = useCallback((id: number, quantity = 1): Promise<EcwidCart> => {
    ensureLoaded();
    return new Promise((resolve, reject) => {
      if (!id || Number.isNaN(id)) { reject(new Error('Missing product id')); return; }
      let waited = 0;
      const attempt = () => {
        const ecwid = getEcwid();
        if (ecwid && ecwid.Cart && typeof ecwid.Cart.addProduct === 'function') {
          addToEcwidCart(id, quantity).then(resolve).catch(reject);
          return;
        }
        if (waited >= 8000) { reject(new Error('Ecwid did not finish loading')); return; }
        waited += 250;
        setTimeout(attempt, 250);
      };
      attempt();
    });
  }, [ensureLoaded]);

  const openCart = useCallback(() => {
    ensureLoaded();
    setOpen(true);
    getEcwid()?.openPage('cart');
  }, [ensureLoaded]);

  const openCheckout = useCallback(() => {
    ensureLoaded();
    setOpen(true);
    getEcwid()?.Cart.gotoCheckout();
  }, [ensureLoaded]);

  const closeCart = useCallback(() => setOpen(false), []);

  return (
    <EcwidCartContext.Provider
      value={{ count, apiReady, open, addProduct, openCart, openCheckout, closeCart }}
    >
      {children}
    </EcwidCartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useEcwidCart() {
  const ctx = useContext(EcwidCartContext);
  if (!ctx) throw new Error('useEcwidCart must be used within an EcwidCartProvider');
  return ctx;
}
