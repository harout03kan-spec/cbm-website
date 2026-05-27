
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { products } from '../../mocks/products';
import { useTranslation } from 'react-i18next';

interface CartItem {
  id: number;
  quantity: number;
}

const CartPage = () => {
  const { t } = useTranslation();
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 1, quantity: 2 },
    { id: 3, quantity: 1 }
  ]);

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'CANADA10') {
      setPromoApplied(true);
      setPromoDiscount(10);
    }
  };

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => {
      const product = products.find(p => p.id === item.id);
      return sum + (product ? Number(product.price) * item.quantity : 0);
    }, 0);

    const discount = promoApplied ? (subtotal * promoDiscount) / 100 : 0;
    const subtotalAfterDiscount = subtotal - discount;
    const hst = subtotalAfterDiscount * 0.13;
    const shipping = subtotal > 10000 ? 0 : 150;
    const total = subtotalAfterDiscount + hst + shipping;

    return {
      subtotal: subtotal.toFixed(2),
      discount: discount.toFixed(2),
      subtotalAfterDiscount: subtotalAfterDiscount.toFixed(2),
      hst: hst.toFixed(2),
      shipping: shipping.toFixed(2),
      total: total.toFixed(2),
      freeShipping: subtotal > 10000
    };
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
              <h1 className="font-orbitron font-bold text-4xl text-white mb-4">
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
            <Link to="/" className="hover:text-crimson-accent transition-colors cursor-pointer">Home</Link>
            <i className="ri-arrow-right-s-line"></i>
            <span className="text-white">Shopping Cart</span>
          </div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="font-orbitron font-bold text-5xl text-white mb-8">
            {t('cart_title')}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Cart Items - Left Column */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => {
                const product = products.find(p => p.id === item.id);
                if (!product) return null;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-graphite border border-crimson-accent/20 rounded-2xl p-6"
                  >
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="relative w-40 h-40 bg-black rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain object-center"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <Link
                              to={`/product?id=${product.id}`}
                              className="text-white font-orbitron font-bold text-2xl hover:text-crimson-accent transition-colors cursor-pointer"
                            >
                              {product.name}
                            </Link>
                            <div className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-inter font-semibold ${
                              product.badgeType === 'hot' ? 'bg-crimson-accent/20 text-crimson-accent' :
                              product.badgeType === 'cold' ? 'bg-white/20 text-white' :
                              product.badgeType === 'eco' ? 'bg-green-600/20 text-green-400' :
                              'bg-white/20 text-white'
                            }`}>
                              {product.badge}
                            </div>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="w-10 h-10 flex items-center justify-center text-soft-gray hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <i className="ri-delete-bin-line text-xl"></i>
                          </button>
                        </div>

                        {/* Specs */}
                        <div className="flex gap-6 mb-4">
                          <div>
                            <div className="text-soft-gray font-inter text-xs mb-1">Hashrate</div>
                            <div className="text-white font-orbitron font-bold">{product.hashrate} TH/s</div>
                          </div>
                          <div>
                            <div className="text-soft-gray font-inter text-xs mb-1">Power</div>
                            <div className="text-white font-orbitron font-bold">{product.power}W</div>
                          </div>
                          <div>
                            <div className="text-soft-gray font-inter text-xs mb-1">Efficiency</div>
                            <div className="text-white font-orbitron font-bold">{product.efficiency} J/TH</div>
                          </div>
                        </div>

                        {/* Quantity and Price */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="text-soft-gray font-inter text-sm">Quantity:</span>
                            <div className="flex items-center bg-midnight border border-white/20 rounded-lg overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer"
                              >
                                <i className="ri-subtract-line"></i>
                              </button>
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                                className="w-16 h-10 bg-transparent text-white text-center font-orbitron font-bold border-x border-white/20 outline-none"
                                min="1"
                              />
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer"
                              >
                                <i className="ri-add-line"></i>
                              </button>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-crimson-accent font-orbitron font-bold text-3xl">
                              ${(Number(product.price) * item.quantity).toFixed(2)}
                            </div>
                            <div className="text-soft-gray font-inter text-sm">
                              ${product.price} × {item.quantity}
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
                <h2 className="font-orbitron font-bold text-2xl text-white mb-6">
                  {t('cart_subtotal')}
                </h2>

                {/* Promo Code */}
                <div className="mb-6">
                  <label className="text-soft-gray font-inter text-sm mb-2 block">
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      disabled={promoApplied}
                      className="flex-1 px-4 py-3 bg-midnight border border-white/20 rounded-lg text-white font-inter outline-none focus:border-crimson-accent transition-colors disabled:opacity-50"
                    />
                    <button
                      onClick={applyPromoCode}
                      disabled={promoApplied}
                      className="px-6 py-3 bg-crimson-accent text-white font-inter font-semibold rounded-lg hover:scale-105 transition-transform cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Apply
                    </button>
                  </div>
                  {promoApplied && (
                    <div className="mt-2 flex items-center gap-2 text-green-400 font-inter text-sm">
                      <i className="ri-checkbox-circle-fill"></i>
                      Promo code applied: {promoDiscount}% off
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-4 mb-6 pb-6 border-b border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-soft-gray font-inter">Subtotal</span>
                    <span className="text-white font-orbitron font-bold text-lg">${totals.subtotal}</span>
                  </div>
                  
                  {promoApplied && (
                    <div className="flex justify-between items-center">
                      <span className="text-green-400 font-inter">Discount ({promoDiscount}%)</span>
                      <span className="text-green-400 font-orbitron font-bold text-lg">-${totals.discount}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-soft-gray font-inter">Shipping</span>
                    <span className="text-white font-orbitron font-bold text-lg">
                      {totals.freeShipping ? (
                        <span className="text-green-400">FREE</span>
                      ) : (
                        `$${totals.shipping}`
                      )}
                    </span>
                  </div>

                  {!totals.freeShipping && (
                    <div className="text-soft-gray font-inter text-xs">
                      <i className="ri-truck-fill text-crimson-accent mr-1"></i>
                      Free shipping on orders over $10,000
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-soft-gray font-inter">HST (13%)</span>
                    <span className="text-white font-orbitron font-bold text-lg">${totals.hst}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-white font-inter font-bold text-xl">Total</span>
                  <span className="text-crimson-accent font-orbitron font-bold text-4xl">${totals.total}</span>
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
                    <span>Secure SSL Encrypted Checkout</span>
                  </div>
                  <div className="flex items-center gap-3 text-soft-gray font-inter text-sm">
                    <i className="ri-truck-fill text-crimson-accent text-xl"></i>
                    <span>Ships from Toronto in 1-2 Days</span>
                  </div>
                  <div className="flex items-center gap-3 text-soft-gray font-inter text-sm">
                    <i className="ri-customer-service-2-fill text-crimson-accent text-xl"></i>
                    <span>24/7 Canadian Support Team</span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="text-soft-gray font-inter text-xs mb-3 text-center">
                    We Accept
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-12 h-8 flex items-center justify-center bg-white rounded">
                      <i className="ri-visa-line text-2xl text-midnight"></i>
                    </div>
                    <div className="w-12 h-8 flex items-center justify-center bg-white rounded">
                      <i className="ri-mastercard-line text-2xl text-midnight"></i>
                    </div>
                    <div className="w-12 h-8 flex items-center justify-center bg-midnight border border-white/20 rounded">
                      <i className="ri-bitcoin-line text-xl text-crimson-accent"></i>
                    </div>
                    <div className="w-12 h-8 flex items-center justify-center bg-midnight border border-white/20 rounded text-white text-xs font-bold">
                      WIRE
                    </div>
                  </div>
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
