import { useEffect } from 'react';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';

/**
 * INTERNAL, HIDDEN test route (/store-test).
 *
 * Proof-of-concept only: embeds the existing Ecwid / Lightspeed eCom storefront
 * (store 99673270) so we can verify the new React site can drive real Ecwid
 * cart → checkout → Moneris → orders → emails → abandoned-cart, WITHOUT touching
 * the current React shop/cart/checkout.
 *
 * Only PUBLIC Ecwid values are used here: the store id and the public storefront
 * script (app.ecwid.com/script.js). No REST API token, no Moneris credentials —
 * payment is configured inside the Ecwid dashboard, never in this code.
 *
 * This route is intentionally NOT in the navbar, NOT in the /fr tree, and NOT in
 * the sitemap, and it sets robots=noindex,nofollow so it stays out of search.
 */

const ECWID_STORE_ID = '99673270';
const CONTAINER_ID = `my-store-${ECWID_STORE_ID}`;

declare global {
  interface Window {
    _xnext_initialization_scripts?: Array<{ widgetType: string; id: string; arg: string[] }>;
    Ecwid?: { init: () => void };
    xProductBrowser?: (...args: string[]) => void;
  }
}

export default function StoreTestPage() {
  // Keep this internal test route out of search engines.
  useEffect(() => {
    document.title = 'Store Test (internal) — Canada BTC Miners';
    const robots = document.createElement('meta');
    robots.setAttribute('name', 'robots');
    robots.setAttribute('content', 'noindex, nofollow');
    document.head.appendChild(robots);
    return () => { robots.remove(); };
  }, []);

  // Load + render the Ecwid storefront (public store id + public storefront script only).
  useEffect(() => {
    window._xnext_initialization_scripts = [
      { widgetType: 'ProductBrowser', id: CONTAINER_ID, arg: [`id=${CONTAINER_ID}`] },
    ];

    // Client-side re-entry: the script is already loaded, just re-init into the container.
    if (window.Ecwid && typeof window.Ecwid.init === 'function') {
      window.Ecwid.init();
      return;
    }
    if (document.getElementById('ecwid-script')) return;

    const script = document.createElement('script');
    script.id = 'ecwid-script';
    script.src = `https://app.ecwid.com/script.js?${ECWID_STORE_ID}&data_platform=code`;
    script.async = true;
    script.setAttribute('charset', 'utf-8');
    script.setAttribute('data-cfasync', 'false');
    document.body.appendChild(script);
  }, []);

  return (
    <div className="min-h-screen bg-midnight">
      <Navbar />
      <section className="mx-auto max-w-7xl px-6 pt-28 pb-20">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-crimson-accent">
          Internal test — not linked in navigation
        </p>
        <h1 className="mb-6 font-inter text-3xl font-bold text-white">Ecwid Store Test</h1>
        <p className="mb-8 max-w-2xl text-sm text-soft-gray">
          Proof of concept: the Ecwid storefront (store {ECWID_STORE_ID}) loads below. It handles
          cart, checkout, Moneris payment, orders, emails, and abandoned carts. The regular React
          shop, cart, and checkout are unchanged.
        </p>
        {/* Ecwid renders its storefront into this container */}
        <div id={CONTAINER_ID} />
      </section>
      <Footer />
    </div>
  );
}
