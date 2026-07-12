import {
  createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode,
} from 'react';
import {
  loadEcwid, getEcwid, type EcwidCart, ECWID_STORE_ID,
} from '../lib/ecwid';
import { enhanceCheckoutLabels, installCheckoutObserver } from '../lib/ecwidCheckoutEnhancer';

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
  // Read the live drawer-open state inside Ecwid's OnPageLoaded callback (which is
  // registered once). Kept in sync with `open` below.
  const openRef = useRef(false);
  openRef.current = open;

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
      // "Browse Store" / "Continue shopping" (shown on the empty cart) makes Ecwid
      // navigate to its own storefront category grid. We never want that grid — the
      // shop is our React /shop page. So whenever the drawer is open and Ecwid tries
      // to render a storefront-browse page, send the shopper back to OUR /shop.
      // A root-relative path uses the CURRENT domain, so it works on Netlify deploy
      // previews AND on the production canadabtcminers.ca site — no hard-coded URL,
      // and it never opens Ecwid's default storefront / Instant Site.
      if (ecwid.OnPageLoaded) {
        const BROWSE = /^(CATEGORY|PRODUCT|SEARCH|DEFAULT|FAVORITES)/;
        ecwid.OnPageLoaded.add((page) => {
          if (cancelled) return;
          const type = String(page?.type ?? '');
          // "Browse Store" / "Continue shopping": return to OUR /shop, not the grid.
          if (openRef.current && BROWSE.test(type)) {
            if (window.location.pathname !== '/shop') {
              window.location.assign('/shop');
            } else {
              setOpen(false); // already on /shop — just close the cart drawer
            }
            return;
          }
          // On the checkout pages, promote Ecwid's placeholder-style address fields
          // to permanent visible labels above each box. Re-run a couple of times to
          // catch fields Ecwid renders asynchronously after the page event.
          if (/^CHECKOUT/.test(type)) {
            const el = document.getElementById(ECWID_CART_CONTAINER_ID);
            const run = () => enhanceCheckoutLabels(el);
            run();
            setTimeout(run, 350);
            setTimeout(run, 1000);
            // Keep labels / the Moneris row in place across Ecwid's re-renders.
            installCheckoutObserver(el);
          }
        });
      }
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

  // Add to the real Ecwid cart, using the SAME proven pattern as /store-test-cart:
  //   1. wait for Ecwid.OnAPILoaded (the cart API is only ready after this — the
  //      old code added as soon as Cart.addProduct existed, which is BEFORE the
  //      store is initialised, so the add was silently dropped and the cart
  //      opened empty),
  //   2. Ecwid.Cart.addProduct({ id, quantity, callback }),
  //   3. verify with Ecwid.Cart.get() that the quantity actually went up before
  //      resolving — so callers only open the drawer on a real, confirmed add.
  // Temporary [cbm-ecwid] console logs make the behaviour visible on the preview.
  const addProduct = useCallback((id: number, quantity = 1): Promise<EcwidCart> => {
    ensureLoaded();
    const pid = Number(id);
    const qty = Math.max(1, Math.floor(quantity));
    return new Promise((resolve, reject) => {
      if (!pid || Number.isNaN(pid)) { reject(new Error('Missing/invalid product id')); return; }
      // eslint-disable-next-line no-console
      console.log('[cbm-ecwid] add request → id:', pid, 'qty:', qty);

      let waited = 0;
      const start = () => {
        const ecwid = getEcwid();
        if (!ecwid || !ecwid.OnAPILoaded || !ecwid.Cart) {
          if (waited >= 12000) {
            // eslint-disable-next-line no-console
            console.error('[cbm-ecwid] Ecwid never finished loading');
            reject(new Error('Ecwid did not load'));
            return;
          }
          waited += 250;
          setTimeout(start, 250);
          return;
        }
        // OnAPILoaded is sticky: fires immediately if the API is already loaded.
        ecwid.OnAPILoaded.add(() => {
          ecwid.Cart.get((before) => {
            const beforeQty = before?.productsQuantity ?? 0;
            ecwid.Cart.addProduct({
              id: pid,
              quantity: qty,
              callback: (success, _product, cart) => {
                // eslint-disable-next-line no-console
                console.log('[cbm-ecwid] addProduct callback → success:', success, 'cart:', cart);
                if (!success) {
                  // eslint-disable-next-line no-console
                  console.error('[cbm-ecwid] Ecwid declined product', pid);
                  reject(new Error(`Ecwid declined product ${pid}`));
                  return;
                }
                ecwid.Cart.get((after) => {
                  const afterQty = after?.productsQuantity ?? 0;
                  // eslint-disable-next-line no-console
                  console.log('[cbm-ecwid] cart qty before:', beforeQty, '→ after:', afterQty);
                  if (afterQty > beforeQty) {
                    resolve(after);
                  } else {
                    // eslint-disable-next-line no-console
                    console.error(`[cbm-ecwid] product ${pid} did not land in the cart — it may be disabled, out of stock, or require options in Ecwid.`);
                    reject(new Error(`Product ${pid} was not added to the Ecwid cart`));
                  }
                });
              },
            });
          });
        });
      };
      start();
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
