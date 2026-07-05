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

// Public store id (safe to expose in the browser — it is in every storefront).
export const ECWID_STORE_ID = '99673270';

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
            callback?: (success: boolean, product: unknown, cart: EcwidCart) => void;
          },
    ) => void;
    gotoCheckout: () => void;
    get: (callback: (cart: EcwidCart) => void) => void;
  };
  openPage: (page: string, params?: Record<string, unknown>) => void;
  OnAPILoaded: { add: (cb: () => void) => void };
  OnCartChanged: { add: (cb: (cart: EcwidCart) => void) => void };
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

/**
 * Add a product to the real Ecwid cart by its Ecwid product id (which is the
 * same as catalog `id`). Resolves with the updated cart, rejects if Ecwid is not
 * ready or the store declines the product. Uses only the public JS API.
 */
export function addToEcwidCart(id: number, quantity = 1): Promise<EcwidCart> {
  return new Promise((resolve, reject) => {
    const ecwid = getEcwid();
    if (!ecwid || !ecwid.Cart || typeof ecwid.Cart.addProduct !== 'function') {
      reject(new Error('Ecwid is not ready'));
      return;
    }
    ecwid.Cart.addProduct({
      id,
      quantity: Math.max(1, Math.floor(quantity)),
      callback: (success, _product, cart) => {
        if (success) resolve(cart);
        else reject(new Error(`Ecwid could not add product ${id}`));
      },
    });
  });
}

/** Open the Ecwid cart page inside the current ProductBrowser container. */
export function openEcwidCart(): void {
  getEcwid()?.openPage('cart');
}

/** Jump straight to Ecwid checkout (Moneris + order emails live in Ecwid). */
export function openEcwidCheckout(): void {
  getEcwid()?.Cart.gotoCheckout();
}

/** Register a callback for the live cart (fires on every cart change). */
export function onEcwidCartChanged(cb: (cart: EcwidCart) => void): void {
  getEcwid()?.OnCartChanged.add(cb);
}

/** Register a callback for when the Ecwid JS API has finished loading. */
export function onEcwidApiLoaded(cb: () => void): void {
  getEcwid()?.OnAPILoaded.add(cb);
}
