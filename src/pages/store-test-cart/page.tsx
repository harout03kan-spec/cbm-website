import { useEffect, useState, useCallback } from 'react';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { loadEcwid, getEcwid, ECWID_STORE_ID, type EcwidCart } from '../../lib/ecwid';
// Scoped dark/red theme for the embedded Ecwid cart/checkout (this route only).
import './ecwid-theme.css';

/**
 * INTERNAL, HIDDEN test route (/store-test-cart).
 *
 * Proof-of-concept for the Ecwid CART HANDOFF: React-styled buttons drive the
 * real Ecwid / Lightspeed eCom cart + checkout (store 99673270) via the public
 * JS API — WITHOUT showing the old Ecwid storefront category grid.
 *
 *   • "Add sample product to Ecwid cart" → Ecwid.Cart.addProduct(...)
 *   • "View Ecwid cart"                  → Ecwid.openPage('cart')
 *   • "Go to Ecwid checkout"             → Ecwid.Cart.gotoCheckout()
 *   • Live cart count                    → Ecwid.OnCartChanged
 *
 * The Ecwid container is kept hidden until the shopper opens cart/checkout, so
 * the default view is just the React buttons — no grid, no storefront design.
 *
 * Only PUBLIC values are used (store id + public storefront script). No REST API
 * token, no Moneris credentials — payment, orders, confirmation emails, order
 * statuses, tracking numbers and abandoned-cart recovery all stay inside the
 * Ecwid dashboard.
 *
 * This route is intentionally NOT in the navbar, NOT in the /fr tree, and NOT in
 * the sitemap, and it sets robots=noindex,nofollow. It does not touch the real
 * React shop, cart, checkout, product pages or catalog data.
 */

// Public Ecwid product id used only for this proof of concept (a low-value
// sample item). No pricing / product data is duplicated from catalog.ts.
const SAMPLE_PRODUCT_ID = 706736087;
const CONTAINER_ID = `ecwid-cart-handoff-${ECWID_STORE_ID}`;

export default function StoreTestCartPage() {
  const [apiReady, setApiReady] = useState(false);
  const [cartCount, setCartCount] = useState<number | null>(null);
  const [storeOpen, setStoreOpen] = useState(false);
  const [status, setStatus] = useState('');

  // Keep this internal test route out of search engines, and flag the route as
  // active on <body>. The body flag lets ecwid-theme.css safely restyle the few
  // things Ecwid injects at the document-body level (its cookie/privacy popup)
  // ONLY while this hidden route is open — never on the rest of the site.
  useEffect(() => {
    document.title = 'Cart Handoff Test (internal) — Canada BTC Miners';
    const robots = document.createElement('meta');
    robots.setAttribute('name', 'robots');
    robots.setAttribute('content', 'noindex, nofollow');
    document.head.appendChild(robots);
    document.body.classList.add('cbm-ecwid-test-active');
    return () => {
      robots.remove();
      document.body.classList.remove('cbm-ecwid-test-active');
    };
  }, []);

  // Load the public Ecwid storefront script and wire up the JS API.
  useEffect(() => {
    loadEcwid(CONTAINER_ID);

    let cancelled = false;
    let iv: ReturnType<typeof setInterval> | undefined;

    // Ecwid is undefined until the storefront script finishes loading, so poll
    // briefly, then register callbacks exactly once.
    const register = (): boolean => {
      const ecwid = getEcwid();
      if (!ecwid || !ecwid.OnAPILoaded || !ecwid.OnCartChanged) return false;

      ecwid.OnCartChanged.add((cart: EcwidCart) => {
        if (!cancelled) setCartCount(cart.productsQuantity ?? 0);
      });
      ecwid.OnAPILoaded.add(() => {
        if (cancelled) return;
        setApiReady(true);
        ecwid.Cart.get((cart) => { if (!cancelled) setCartCount(cart.productsQuantity ?? 0); });
      });
      return true;
    };

    if (!register()) {
      iv = setInterval(() => { if (register() && iv) clearInterval(iv); }, 300);
    }
    return () => { cancelled = true; if (iv) clearInterval(iv); };
  }, []);

  const addSample = useCallback(() => {
    const ecwid = getEcwid();
    if (!ecwid) return;
    ecwid.Cart.addProduct({
      id: SAMPLE_PRODUCT_ID,
      quantity: 1,
      callback: (success) => {
        setStatus(
          success
            ? `Added sample product ${SAMPLE_PRODUCT_ID} to the Ecwid cart.`
            : `Ecwid did not add product ${SAMPLE_PRODUCT_ID} (check the id is enabled in the store).`,
        );
      },
    });
  }, []);

  const viewCart = useCallback(() => {
    const ecwid = getEcwid();
    if (!ecwid) return;
    setStoreOpen(true);
    ecwid.openPage('cart');
    setStatus('Opened the Ecwid cart below.');
  }, []);

  const goToCheckout = useCallback(() => {
    const ecwid = getEcwid();
    if (!ecwid) return;
    setStoreOpen(true);
    ecwid.Cart.gotoCheckout();
    setStatus('Opened Ecwid checkout below — Moneris payment and order emails run here.');
  }, []);

  const btnBase =
    'px-6 py-3 rounded-xl font-inter font-bold text-sm transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <div className="min-h-screen bg-midnight">
      <Navbar />

      <section className="mx-auto max-w-3xl px-6 pt-28 pb-20">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-crimson-accent">
          Internal test — not linked in navigation
        </p>
        <h1 className="mb-4 font-inter text-3xl font-bold text-white">Ecwid Cart Handoff Test</h1>
        <p className="mb-8 max-w-2xl text-sm leading-relaxed text-soft-gray">
          These React buttons drive the real Ecwid cart and checkout (store {ECWID_STORE_ID}) through
          the public JS API — with no Ecwid storefront grid on the page. The cart, checkout, Moneris
          payment, orders, confirmation emails, statuses, tracking and abandoned-cart recovery all
          stay inside Ecwid. The regular React shop, cart and checkout are unchanged.
        </p>

        {/* Live cart count from Ecwid.OnCartChanged */}
        <div className="mb-8 flex items-center gap-3 rounded-xl border border-crimson-accent/20 bg-graphite px-5 py-4">
          <i className="ri-shopping-bag-3-line text-2xl text-crimson-accent" aria-hidden="true"></i>
          <div>
            <div className="text-xs uppercase tracking-wide text-soft-gray">Live Ecwid cart</div>
            <div className="font-inter text-lg font-bold text-white">
              {cartCount === null ? '—' : `${cartCount} item${cartCount === 1 ? '' : 's'}`}
            </div>
          </div>
        </div>

        {/* React-styled action buttons */}
        <div className="mb-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={addSample}
            disabled={!apiReady}
            className={`${btnBase} bg-crimson-accent text-white hover:bg-red-700`}
          >
            Add sample product to Ecwid cart
          </button>
          <button
            type="button"
            onClick={viewCart}
            disabled={!apiReady}
            className={`${btnBase} border-2 border-crimson-accent text-crimson-accent hover:bg-crimson-accent hover:text-white`}
          >
            View Ecwid cart
          </button>
          <button
            type="button"
            onClick={goToCheckout}
            disabled={!apiReady}
            className={`${btnBase} border-2 border-crimson-accent text-crimson-accent hover:bg-crimson-accent hover:text-white`}
          >
            Go to Ecwid checkout
          </button>
        </div>

        <p className="min-h-[1.25rem] text-sm text-soft-gray" role="status" aria-live="polite">
          {apiReady ? status : 'Connecting to Ecwid…'}
        </p>

        {/*
          Ecwid renders the cart / checkout into this container, wrapped in a
          branded React "Secure Checkout" card for a cleaner, on-brand frame.
          It stays visually hidden (sr-only) until the shopper opens cart or
          checkout, so the storefront category grid is never shown as the main
          view. We KEEP all of Ecwid's own links/icons — they are only restyled
          to the dark/red theme, never hidden.
        */}
        <div className={storeOpen ? 'mt-10' : 'sr-only'} aria-hidden={!storeOpen}>
          <div className="overflow-hidden rounded-2xl border border-crimson-accent/20 bg-graphite shadow-xl shadow-black/30">
            <div className="flex flex-col gap-1 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-6">
              <div className="flex items-center gap-2">
                <i className="ri-lock-2-line text-lg text-crimson-accent" aria-hidden="true"></i>
                <span className="font-inter text-sm font-bold uppercase tracking-wide text-white">
                  Secure Checkout
                </span>
              </div>
              <span className="text-xs text-soft-gray sm:text-right">Secure payment via Moneris</span>
            </div>
            <div className="px-3 py-5 sm:px-6">
              <div id={CONTAINER_ID} />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
