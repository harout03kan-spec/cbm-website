
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { useProducts } from '../../hooks/useProducts';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../hooks/useCart';

const CartPage = () => {
  const { t } = useTranslation();
  const { items: cartItems, updateQuantity, removeItem } = useCart();
  const { products } = useProducts();

  // Resolve a cart line to its product + selected variant (variant overrides
  // name/price/specs so each variant is priced and labelled correctly).
  const lineData = (item: typeof cartItems[number]) => {
    const product = products.find(p => p.id === item.id);
    if (!product) return null;
    const vr = item.variant ? product.variants?.find(v => v.label === item.variant) : undefined;
    return {
      product,
      name: vr ? `${product.name} — ${vr.label}` : product.name,
      price: Number(vr?.price ?? product.price),
      hashrate: vr?.hashrate ?? product.hashrate,
      hashrate_unit: vr?.hashrate_unit ?? product.hashrate_unit,
      power: vr?.power ?? product.power,
      efficiency: vr?.efficiency ?? product.efficiency,
      efficiency_unit: vr?.efficiency_unit ?? product.efficiency_unit,
      image: product.image,
    };
  };

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => {
      const d = lineData(item);
      return sum + (d ? d.price * item.quantity : 0);
    }, 0);
    return { subtotal: subtotal.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) };
  };

  const totals = calculateTotals();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-midnight">
        <Navbar />
        <section className="pt-32 pb-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-32 h-32 flex items-center justify-center mx-auto mb-6 bg-graphite rounded-full border-2 border-crimson-accent/20">
                <i className="ri-shopping-cart-line text-crimson-accent text-6xl"></i>
              </div>
              <h1 className="font-inter font-bold text-4xl text-white mb-4">
                {t('cart_empty')}
              </h1>
              <p className="text-soft-gray font-inter text-lg mb-8">
                Start building your mining operation with our premium ASIC miners
              </p>
              <Link
                to="/shop"
                className="inline-block px-8 py-4 bg-gradient-crimson text-white font-inter font-bold rounded-xl hover:scale-105 transition-transform cursor-pointer whitespace-nowrap"
              >
                {t('cart_continue')}
              </Link>
            </motion.div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-midnight">
      <Navbar />

      {/* Breadcrumb */}
      <section className="pt-32 pb-8 bg-graphite border-b border-crimson-accent/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-soft-gray font-inter text-sm">
            <Link to="/" className="hover:text-crimson-accent transition-colors cursor-pointer">{t('product_bc_home')}</Link>
            <i className="ri-arrow-right-s-line"></i>
            <span className="text-white">{t('cart_title')}</span>
          </div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="font-inter font-bold text-5xl text-white mb-8">
            {t('cart_title')}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Cart Items - Left Column */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => {
                const d = lineData(item);
                if (!d) return null;
                const hasImg = !!d.image;

                return (
                  <motion.div
                    key={`${item.id}-${item.variant || ''}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-graphite border border-crimson-accent/20 rounded-2xl p-4 sm:p-6"
                  >
                    <div className="flex gap-4 sm:gap-6">
                      {/* Product Image */}
                      <div className="relative w-20 h-20 sm:w-40 sm:h-40 bg-black rounded-xl overflow-hidden flex-shrink-0 border border-white/10 flex items-center justify-center">
                        {hasImg ? (
                          <img src={d.image} alt={d.name} className="w-full h-full object-contain object-center" />
                        ) : (
                          <i className="ri-image-line text-4xl text-zinc-700" aria-hidden="true"></i>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2 mb-3">
                          <Link
                            to={`/product?id=${item.id}`}
                            className="text-white font-inter font-bold text-lg sm:text-2xl break-words hover:text-crimson-accent transition-colors cursor-pointer"
                          >
                            {d.name}
                          </Link>
                          <button
                            onClick={() => removeItem(item.id, item.variant)}
                            aria-label={t('cart_remove')}
                            className="w-10 h-10 flex-shrink-0 flex items-center justify-center text-soft-gray hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <i className="ri-delete-bin-line text-xl"></i>
                          </button>
                        </div>

                        {/* Specs */}
                        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
                          {d.hashrate && (
                            <div>
                              <div className="text-soft-gray font-inter text-xs mb-1">{t('cart_spec_hashrate')}</div>
                              <div className="text-white font-inter font-bold">{d.hashrate} {d.hashrate_unit || 'TH/s'}</div>
                            </div>
                          )}
                          {d.power && (
                            <div>
                              <div className="text-soft-gray font-inter text-xs mb-1">{t('cart_spec_power')}</div>
                              <div className="text-white font-inter font-bold">{d.power}W</div>
                            </div>
                          )}
                          {d.efficiency && (
                            <div>
                              <div className="text-soft-gray font-inter text-xs mb-1">{t('cart_spec_efficiency')}</div>
                              <div className="text-white font-inter font-bold">{d.efficiency} {d.efficiency_unit || 'J/TH'}</div>
                            </div>
                          )}
                        </div>

                        {/* Quantity and Price */}
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="hidden sm:inline text-soft-gray font-inter text-sm">{t('product_qty')}:</span>
                            <div className="flex items-center bg-midnight border border-white/20 rounded-lg overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant)}
                                className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer"
                              >
                                <i className="ri-subtract-line"></i>
                              </button>
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, Number(e.target.value), item.variant)}
                                className="w-16 h-10 bg-transparent text-white text-center font-inter font-bold border-x border-white/20 outline-none"
                                min="1"
                              />
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant)}
                                className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer"
                              >
                                <i className="ri-add-line"></i>
                              </button>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-crimson-accent font-inter font-bold text-2xl sm:text-3xl">
                              ${(d.price * item.quantity).toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div className="text-soft-gray font-inter text-sm">
                              ${d.price.toFixed(2)} × {item.quantity}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Continue Shopping */}
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-crimson-accent font-inter font-semibold hover:gap-3 transition-all cursor-pointer whitespace-nowrap"
              >
                <i className="ri-arrow-left-line"></i>
                {t('cart_continue')}
              </Link>
            </div>

            {/* Order Summary - Right Column */}
            <div className="lg:col-span-1">
              <div className="bg-graphite border border-crimson-accent/20 rounded-2xl p-6 sticky top-24">
                <h2 className="font-inter font-bold text-2xl text-white mb-6">
                  {t('cart_subtotal')}
                </h2>

                {/* Subtotal — taxes and shipping are calculated by the Ecwid
                    checkout from the shipping address (GST/QST/HST by province). */}
                <div className="space-y-3 mb-6 pb-6 border-b border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-soft-gray font-inter">{t('cart_subtotal')}</span>
                    <span className="text-white font-inter font-bold text-2xl">${totals.subtotal}</span>
                  </div>
                  <p className="text-soft-gray font-inter text-xs leading-relaxed">
                    {t('cart_tax_note')}
                  </p>
                </div>

                {/* Checkout Button */}
                <Link
                  to="/checkout"
                  className="block w-full py-4 bg-gradient-crimson text-white font-inter font-bold text-lg text-center rounded-xl hover:scale-105 transition-transform cursor-pointer whitespace-nowrap mb-4"
                >
                  {t('cart_checkout')}
                </Link>

                {/* Trust Badges */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-soft-gray font-inter text-sm">
                    <i className="ri-shield-check-fill text-crimson-accent text-xl"></i>
                    <span>{t('cart_trust_secure')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-soft-gray font-inter text-sm">
                    <i className="ri-truck-fill text-crimson-accent text-xl"></i>
                    <span>{t('cart_trust_ships')}</span>
                  </div>
                  <a href="tel:+15146047050" className="flex items-center gap-3 text-soft-gray font-inter text-sm hover:text-white transition-colors">
                    <i className="ri-phone-fill text-crimson-accent text-xl"></i>
                    <span>{t('cart_trust_call')}</span>
                  </a>
                </div>

                {/* Payment Methods — cards are paid online through Moneris at
                    checkout; everything else is invoiced after the customer calls. */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="text-soft-gray font-inter text-xs font-semibold uppercase tracking-[0.15em] mb-3">
                    {t('cart_pay_online')}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Visa', icon: 'ri-visa-line' },
                      { label: 'Mastercard', icon: 'ri-mastercard-line' },
                      { label: t('footer_pay_debit'), icon: 'ri-bank-card-2-line' },
                    ].map((m) => (
                      <span key={m.label} className="flex flex-col items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-2.5 text-center text-xs text-gray-300 leading-tight">
                        <i className={`${m.icon} text-2xl text-crimson-accent`} aria-hidden="true"></i>
                        {m.label}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 text-soft-gray font-inter text-xs font-semibold uppercase tracking-[0.15em] mb-2">
                    {t('cart_pay_other')}
                  </div>
                  <p className="text-soft-gray font-inter text-sm leading-relaxed">
                    {t('cart_pay_other_desc')}{' '}
                    <a href="tel:+15146047050" className="font-semibold text-white hover:text-crimson-accent transition-colors whitespace-nowrap">+1 (514) 604-7050</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CartPage;
