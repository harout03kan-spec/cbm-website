import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { useProducts } from '../../hooks/useProducts';
import { useCart, type CartItem } from '../../hooks/useCart';
import { useTranslation } from 'react-i18next';
import { loadEcwid, getEcwid, ECWID_STORE_ID, type EcwidApi } from '../../lib/ecwid';
// Dark/red theme for the embedded Ecwid checkout (scoped to the container id).
import '../store-test-cart/ecwid-theme.css';

/**
 * Checkout = the Ecwid (Lightspeed eCom) checkout for store 99673270.
 *
 * The React cart is handed to Ecwid: its cart is cleared, each line is added
 * (with the hashrate option for multi-version miners), then Ecwid's checkout
 * opens in the page. Ecwid handles everything from there — shipping address,
 * GST/QST/HST by province, shipping rates, discount codes, Moneris card
 * payment, the order confirmation email, order statuses and tracking.
 *
 * No payment credentials or tokens live in this code.
 */

// Same container id the scoped theme (ecwid-theme.css) targets.
const CONTAINER_ID = `ecwid-cart-handoff-${ECWID_STORE_ID}`;

type Phase = 'loading' | 'blocked' | 'checkout' | 'empty' | 'error';

/** Wait for the Ecwid JS API to be ready (script loads async). */
function whenEcwidReady(timeoutMs = 20000): Promise<EcwidApi> {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const tick = () => {
      const ecwid = getEcwid();
      if (ecwid?.OnAPILoaded) {
        ecwid.OnAPILoaded.add(() => resolve(ecwid));
        return;
      }
      if (Date.now() - started > timeoutMs) reject(new Error('Ecwid did not load'));
      else setTimeout(tick, 200);
    };
    tick();
  });
}

const clearEcwidCart = (ecwid: EcwidApi) =>
  new Promise<void>(resolve => ecwid.Cart.clear(() => resolve()));

/**
 * Add one line and confirm Ecwid really took it: the callback can report
 * success while the cart stays unchanged (e.g. a required option that doesn't
 * match), so compare the cart quantity before and after.
 */
const addToEcwid = (ecwid: EcwidApi, id: number, quantity: number, options?: Record<string, string>) =>
  new Promise<boolean>(resolve => {
    try {
      ecwid.Cart.get(before => {
        const start = before.productsQuantity ?? 0;
        ecwid.Cart.addProduct({
          id,
          quantity,
          ...(options ? { options } : {}),
          callback: (ok, _product, cart) => resolve(!!ok && (cart?.productsQuantity ?? 0) >= start + quantity),
        });
      });
    } catch {
      resolve(false);
    }
  });

const CheckoutPage = () => {
  const { t } = useTranslation();
  const { products, loading } = useProducts();
  const { items, clearCart, removeItem } = useCart();
  const [phase, setPhase] = useState<Phase>('loading');
  const [blocked, setBlocked] = useState<CartItem[]>([]);
  const started = useRef(false);

  useEffect(() => {
    document.body.classList.add('cbm-ecwid-test-active');
    loadEcwid(CONTAINER_ID);
    return () => document.body.classList.remove('cbm-ecwid-test-active');
  }, []);

  // Hand the cart to Ecwid once products are known.
  const handOff = async (lines: CartItem[]) => {
    setPhase('loading');
    try {
      const ecwid = await whenEcwidReady();
      ecwid.OnOrderPlaced?.add(() => clearCart());
      await clearEcwidCart(ecwid);
      const failed: CartItem[] = [];
      for (const line of lines) {
        const product = products.find(p => p.id === line.id);
        const variant = line.variant ? product?.variants?.find(v => v.label === line.variant) : undefined;
        const options = variant ? { [variant.option || 'Hashrate']: variant.label } : undefined;
        const ok = product ? await addToEcwid(ecwid, line.id, line.quantity, options) : false;
        if (!ok) failed.push(line);
      }
      if (failed.length > 0) {
        setBlocked(failed);
        setPhase('blocked');
        return;
      }
      setPhase('checkout');
      ecwid.Cart.gotoCheckout();
    } catch {
      setPhase('error');
    }
  };

  useEffect(() => {
    if (loading || started.current) return;
    started.current = true;
    if (items.length === 0) { setPhase('empty'); return; }
    void handOff(items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const continueWithOthers = () => {
    const blockedKeys = new Set(blocked.map(b => `${b.id}|${b.variant || ''}`));
    blocked.forEach(b => removeItem(b.id, b.variant));
    const rest = items.filter(i => !blockedKeys.has(`${i.id}|${i.variant || ''}`));
    if (rest.length === 0) { setPhase('empty'); return; }
    void handOff(rest);
  };

  const nameOf = (line: CartItem) => {
    const p = products.find(x => x.id === line.id);
    const base = p?.name || `#${line.id}`;
    return line.variant ? `${base} — ${line.variant}` : base;
  };

  return (
    <div className="min-h-screen bg-midnight">
      <Navbar />
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pt-28 pb-20">
        <h1 className="mb-2 font-inter text-3xl font-bold text-white">{t('checkout_title')}</h1>
        <p className="mb-2 max-w-2xl text-sm leading-relaxed text-soft-gray">{t('checkout_secure_note')}</p>
        <p className="mb-8 max-w-2xl text-sm leading-relaxed text-soft-gray">
          {t('legal_final_sale')}{' '}
          <Link to="/terms" className="text-white underline hover:text-crimson-accent">{t('footer_terms')}</Link>
          {' · '}
          <Link to="/warranty" className="text-white underline hover:text-crimson-accent">{t('footer_warranty')}</Link>
          {' · '}
          <Link to="/shipping-returns" className="text-white underline hover:text-crimson-accent">{t('footer_shipping')}</Link>
        </p>

        {phase === 'loading' && (
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-graphite px-6 py-8 text-soft-gray">
            <i className="ri-loader-4-line animate-spin text-2xl text-crimson-accent" aria-hidden="true"></i>
            <span className="font-inter">{t('checkout_preparing')}</span>
          </div>
        )}

        {phase === 'empty' && (
          <div className="rounded-2xl border border-white/10 bg-graphite px-6 py-8">
            <p className="mb-6 font-inter text-white">{t('checkout_empty')}</p>
            <Link to="/shop" className="inline-flex items-center gap-2 font-inter font-semibold text-crimson-accent">
              <i className="ri-arrow-left-line"></i>{t('cart_continue')}
            </Link>
          </div>
        )}

        {phase === 'error' && (
          <div className="rounded-2xl border border-crimson-accent/30 bg-graphite px-6 py-8">
            <p className="mb-6 font-inter text-white">{t('checkout_load_error')}</p>
            <Link to="/cart" className="inline-flex items-center gap-2 font-inter font-semibold text-crimson-accent">
              <i className="ri-arrow-left-line"></i>{t('checkout_back_cart')}
            </Link>
          </div>
        )}

        {phase === 'blocked' && (
          <div className="rounded-2xl border border-crimson-accent/30 bg-graphite px-6 py-8">
            <h2 className="mb-2 font-inter text-xl font-bold text-white">{t('checkout_unavailable_title')}</h2>
            <p className="mb-4 font-inter text-sm text-soft-gray">{t('checkout_unavailable_desc')}</p>
            <ul className="mb-6 space-y-1 font-inter text-sm text-white">
              {blocked.map(b => (
                <li key={`${b.id}|${b.variant || ''}`}>• {nameOf(b)} × {b.quantity}</li>
              ))}
            </ul>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href="tel:+15146047050" className="inline-flex items-center justify-center gap-2 rounded-xl bg-crimson-accent px-6 py-3 font-inter font-bold text-white hover:bg-red-700">
                <i className="ri-phone-fill"></i> +1 (514) 604-7050
              </a>
              {blocked.length < items.length && (
                <button type="button" onClick={continueWithOthers} className="rounded-xl border-2 border-crimson-accent px-6 py-3 font-inter font-bold text-crimson-accent hover:bg-crimson-accent hover:text-white">
                  {t('checkout_continue_others')}
                </button>
              )}
              <Link to="/cart" className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-3 font-inter font-semibold text-white">
                {t('checkout_back_cart')}
              </Link>
            </div>
          </div>
        )}

        {/* Ecwid renders its checkout here. Hidden until the cart is handed off. */}
        <div
          className={phase === 'checkout' ? 'rounded-2xl border border-white/10 bg-graphite p-3 sm:p-6' : 'hidden'}
        >
          <div id={CONTAINER_ID}></div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
