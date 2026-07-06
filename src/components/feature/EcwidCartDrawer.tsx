import { useEcwidCart, ECWID_CART_CONTAINER_ID } from '../../hooks/useEcwidCart';
// Reuse the exact approved dark/red Ecwid theme from /store-test-cart. Its
// selectors match this drawer's container id as well as the test container id, so
// the drawer gets the identical polish without changing anything on
// /store-test-cart. NOTE: it must be scoped to the container ID (not a class) —
// Ecwid overwrites the mount element's className when it initialises, but keeps
// its id, so an id scope survives and a class scope would not.
import '../../pages/store-test-cart/ecwid-theme.css';

/**
 * Shared slide-in cart drawer that renders the REAL Ecwid cart / checkout.
 *
 * The Ecwid ProductBrowser container (#ECWID_CART_CONTAINER_ID) is always in the
 * DOM so Ecwid stays initialised; the panel is off-screen until opened, then the
 * provider calls Ecwid.openPage('cart') so the shopper sees the cart directly —
 * never the old storefront category grid. Checkout (Moneris + order emails) runs
 * inside the same container via Ecwid's own flow.
 */
export default function EcwidCartDrawer() {
  const { open, closeCart, openCheckout, count } = useEcwidCart();

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-[70] ${open ? '' : 'pointer-events-none'}`}
    >
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-label="Shopping cart"
        className={`absolute right-0 top-0 flex h-full w-full flex-col border-l border-white/10 bg-graphite shadow-2xl transition-transform duration-300 sm:w-[420px] ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <i className="ri-shopping-cart-2-line text-xl text-crimson-accent" aria-hidden="true"></i>
            <span className="font-inter font-bold text-white">
              Your Cart{count > 0 ? ` (${count})` : ''}
            </span>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-soft-gray hover:bg-white/10 hover:text-white transition-colors"
          >
            <i className="ri-close-line text-2xl" aria-hidden="true"></i>
          </button>
        </header>

        {/* Ecwid renders the cart / checkout here; themed via the container id. */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <div id={ECWID_CART_CONTAINER_ID} />
        </div>

        <footer className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={openCheckout}
            className="w-full rounded-lg bg-crimson-accent py-3 font-inter font-bold text-white transition-colors hover:bg-red-700 active:bg-red-800"
          >
            Checkout
          </button>
          <p className="mt-2 text-center text-xs text-soft-gray">Secure payment via Moneris</p>
        </footer>
      </aside>
    </div>
  );
}
