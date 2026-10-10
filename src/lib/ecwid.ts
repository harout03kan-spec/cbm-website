/**
 * Minimal, PUBLIC Ecwid storefront loader + typed JS API accessor.
 *
 * Uses ONLY public values: the store id and the public storefront script
 * (app.ecwid.com/script.js). No REST API token and no Moneris credentials live
 * here — payment, orders, receipt/confirmation emails, order statuses, tracking
 * numbers and abandoned-cart recovery are all configured inside the Ecwid /
 * Lightspeed eCom dashboard, never in this code.
 *
 * This centralises the script-loading and the JS API types so the React UI can
 * drive the real Ecwid cart / checkout (add to cart, open cart, go to checkout,
 * live cart count) WITHOUT rendering the old storefront category grid.
 *
 * Reference: Ecwid JS API — https://api-docs.ecwid.com/reference/javascript-api
 */

// Ecwid stores during the move (both ids and the token are public values —
// they appear in every storefront and only allow reading).
//  • Legacy 99673270 — the store inside the Looka site. Current orders and
//    Moneris live here until launch.
//  • New 143927266 — CBM's own Ecwid account (Business plan). Products,
//    Moneris, taxes and shipping are being set up here.
// Launch = set USE_NEW_STORE to true (or VITE_ECWID_USE_NEW_STORE=true in
// Netlify). Checkout and the product catalog then BOTH use the new store; they
// must switch together because cart product ids are per store.
const LEGACY_STORE_ID = '99673270';
const NEW_STORE_ID = '143927266';
const NEW_STORE_PUBLIC_TOKEN = 'public_g9nayzjbys9vYBw85USjLB99P3fzjvvn';

export const USE_NEW_STORE =
  (import.meta.env.VITE_ECWID_USE_NEW_STORE as string | undefined)?.trim() === 'true';

export const ECWID_STORE_ID = USE_NEW_STORE ? NEW_STORE_ID : LEGACY_STORE_ID;
/** Read-only public token; empty for the legacy store (catalog stays bundled). */
export const ECWID_PUBLIC_TOKEN = USE_NEW_STORE ? NEW_STORE_PUBLIC_TOKEN : '';

// Shape of the cart object passed to OnCartChanged / Cart.get callbacks.
export interface EcwidCart {
  productsQuantity?: number;
  items?: Array<{ product: { id: number; name: string }; quantity: number }>;
}

// The subset of the Ecwid JS API this site uses.
export interface EcwidApi {
  init: () => void;
  Cart: {
    addProduct: (
      product:
        | number
        | {
            id: number;
            quantity?: number;
            options?: Record<string, string>;
            callback?: (success: boolean, product: unknown, cart: EcwidCart) => void;
          },
    ) => void;
    gotoCheckout: () => void;
    clear: (callback?: (success: boolean, error?: unknown) => void) => void;
    get: (callback: (cart: EcwidCart) => void) => void;
  };
  openPage: (page: string, params?: Record<string, unknown>) => void;
  OnAPILoaded: { add: (cb: () => void) => void };
  OnCartChanged: { add: (cb: (cart: EcwidCart) => void) => void };
  OnOrderPlaced?: { add: (cb: (order: unknown) => void) => void };
}

// Minimal window shape we read/write. Accessed through a local cast so this
// file never augments the global Window type (avoids clashing with other
// pages that declare a narrower window.Ecwid).
interface EcwidWindow {
  Ecwid?: EcwidApi;
  _xnext_initialization_scripts?: Array<{ widgetType: string; id: string; arg: string[] }>;
}

const ecwidWindow = (): EcwidWindow => window as unknown as EcwidWindow;

/** Typed accessor for the global Ecwid object (undefined until the script loads). */
export function getEcwid(): EcwidApi | undefined {
  return ecwidWindow().Ecwid;
}

const SCRIPT_ID = 'ecwid-script';

/**
 * Load the public Ecwid storefront script once and initialise a ProductBrowser
 * into `containerId`. Ecwid needs a ProductBrowser container to render the
 * cart / checkout UI into; callers keep that container hidden until the shopper
 * opens the cart or checkout, so the category grid is never the main view.
 *
 * Safe to call on every mount: if the script is already present it just re-inits.
 */
export function loadEcwid(containerId: string): void {
  ecwidWindow()._xnext_initialization_scripts = [
    { widgetType: 'ProductBrowser', id: containerId, arg: [`id=${containerId}`] },
  ];

  const existing = getEcwid();
  if (existing && typeof existing.init === 'function') {
    existing.init();
    return;
  }
  if (document.getElementById(SCRIPT_ID)) return;

  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.src = `https://app.ecwid.com/script.js?${ECWID_STORE_ID}&data_platform=code`;
  script.async = true;
  script.setAttribute('charset', 'utf-8');
  script.setAttribute('data-cfasync', 'false');
  document.body.appendChild(script);
}
