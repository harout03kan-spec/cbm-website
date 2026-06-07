import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { useProduct, useProducts } from '../../hooks/useProducts';
import { useCart } from '../../hooks/useCart';
import { useTranslation } from 'react-i18next';

const ProductPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const productId = Number(searchParams.get('id')) || 0;
  const { product, loading } = useProduct(productId);
  const { products: allProducts } = useProducts();
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  const images = product?.images?.length ? product.images : product ? [product.image] : [];
  // "Similar miners" — prefer other miners (they carry static `details`);
  // fall back to any other product so the section is never empty.
  const relatedProducts = (() => {
    const others = allProducts.filter(p => p.id !== productId);
    const miners = others.filter(p => p.details);
    return (miners.length ? miners : others).slice(0, 3);
  })();

  const accessories = [
    { id: 1, name: 'Power Cable C19 to C20', price: '45.00', image: 'https://readdy.ai/api/search-image?query=professional%20black%20power%20cable%20C19%20to%20C20%20connector%20for%20ASIC%20miner%20on%20simple%20white%20background%20product%20photography&width=200&height=200&seq=acc-cable-1&orientation=squarish' },
    { id: 2, name: 'Network Cable Cat6',     price: '15.00', image: 'https://readdy.ai/api/search-image?query=blue%20ethernet%20network%20cable%20Cat6%20RJ45%20connector%20coiled%20on%20simple%20white%20background%20product%20photography&width=200&height=200&seq=acc-cable-2&orientation=squarish' },
    { id: 3, name: 'Cooling Fan Replacement',price: '85.00', image: 'https://readdy.ai/api/search-image?query=industrial%20cooling%20fan%20for%20ASIC%20miner%20black%20metal%20frame%20on%20simple%20white%20background%20product%20photography&width=200&height=200&seq=acc-fan-1&orientation=squarish' },
  ];

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product.id, quantity);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const calculateTotal = () => {
    if (!product) return { subtotal: '0.00', hst: '0.00', total: '0.00' };
    const subtotal = Number(product.price) * quantity;
    const hst = subtotal * 0.13;
    return { subtotal: subtotal.toFixed(2), hst: hst.toFixed(2), total: (subtotal + hst).toFixed(2) };
  };

  const totals = calculateTotal();

  if (loading) {
    return (
      <div className="min-h-screen bg-midnight">
        <Navbar />
        <div className="pt-40 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-crimson-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-soft-gray font-inter">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  // Unknown / missing id — show a clean not-found instead of a wrong product.
  if (!product) {
    return (
      <div className="min-h-screen bg-midnight">
        <Navbar />
        <div className="pt-40 pb-24 flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <i className="ri-search-eye-line text-5xl text-crimson-accent mb-4 block" aria-hidden="true"></i>
            <h1 className="font-inter font-bold text-3xl text-white mb-3">Product not found</h1>
            <p className="text-soft-gray font-inter mb-8">We couldn’t find that product. It may have been removed or the link is incorrect.</p>
            <Link to="/shop" className="inline-flex min-h-[44px] items-center justify-center px-8 py-3 bg-crimson-accent text-white font-inter font-semibold rounded-lg hover:bg-red-700 transition-colors">
              Back to Shop
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-midnight">
      <Navbar />

      {showNotification && (
        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="fixed top-24 right-6 z-50 bg-crimson-accent text-white px-6 py-4 rounded-lg shadow-2xl font-inter font-semibold"
        >
          <i className="ri-checkbox-circle-fill mr-2"></i>Added to cart successfully!
        </motion.div>
      )}

      <section className="pt-32 pb-8 bg-graphite border-b border-crimson-accent/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-soft-gray font-inter text-sm">
            <Link to="/" className="hover:text-crimson-accent transition-colors">Home</Link>
            <i className="ri-arrow-right-s-line"></i>
            <Link to="/shop" className="hover:text-crimson-accent transition-colors">Shop</Link>
            <i className="ri-arrow-right-s-line"></i>
            <span className="text-white">{product.name}</span>
          </div>
        </div>
      </section>

      <section className="py-16 bg-midnight">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Left: Images */}
            <div>
              <div className="relative w-full h-[500px] bg-black rounded-2xl overflow-hidden mb-4 border-2 border-white/10">
                <img src={images[selectedImage] || product.image} alt={product.name} className="w-full h-full object-contain object-center" />
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3 mb-8">
                  {images.map((img, index) => (
                    <button key={index} onClick={() => setSelectedImage(index)}
                      className={`relative w-full h-24 bg-black rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${selectedImage === index ? 'border-crimson-accent' : 'border-white/10 hover:border-white/30'}`}
                    >
                      <img src={img} alt={`${product.name} view ${index + 1}`} className="w-full h-full object-contain object-center" />
                    </button>
                  ))}
                </div>
              )}

              <div className="bg-graphite border border-crimson-accent/20 rounded-xl p-6 mb-8">
                <h3 className="text-white font-inter font-bold text-xl mb-4">Buy with this miner</h3>
                <div className="space-y-4">
                  {accessories.map((acc) => (
                    <div key={acc.id} className="flex items-center gap-4 bg-midnight/50 border border-white/10 rounded-lg p-4 hover:border-crimson-accent/30 transition-colors">
                      <div className="w-16 h-16 bg-black rounded-lg overflow-hidden flex-shrink-0">
                        <img src={acc.image} alt={acc.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-inter font-semibold text-sm mb-1">{acc.name}</h4>
                        <div className="text-crimson-accent font-inter font-bold text-lg">${acc.price} CAD</div>
                      </div>
                      <button className="px-4 py-2 bg-crimson-accent/10 border border-crimson-accent text-crimson-accent font-inter font-semibold text-sm rounded-lg hover:bg-crimson-accent hover:text-white transition-colors cursor-pointer whitespace-nowrap">Add</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: 'ri-shield-check-fill', title: 'Safe Purchase', sub: 'Secure Transaction' },
                  { icon: 'ri-truck-fill',         title: 'Fast Shipping', sub: '6-9 Business Days' },
                  { icon: 'ri-customer-service-2-fill', title: '24/7 Support', sub: 'Expert Team' },
                ].map(b => (
                  <div key={b.title} className="bg-graphite border border-crimson-accent/20 rounded-lg p-4 text-center">
                    <div className="w-8 h-8 flex items-center justify-center mx-auto mb-2">
                      <i className={`${b.icon} text-crimson-accent text-2xl`}></i>
                    </div>
                    <div className="text-white font-inter text-sm font-semibold">{b.title}</div>
                    <div className="text-soft-gray font-inter text-xs mt-1">{b.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Info */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <h1 className="font-inter font-bold text-4xl text-white">{product.name}</h1>
                {product.condition && <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm font-inter font-semibold">{product.condition}</span>}
                {product.cooling && <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm font-inter font-semibold">{product.cooling}</span>}
              </div>

              <div className="mb-6 pb-6 border-b border-white/10">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-crimson-accent font-inter font-bold text-5xl">${Number(product.price).toLocaleString()}</span>
                  <span className="text-soft-gray font-inter text-xl">CAD</span>
                </div>
                {product.short_description && (
                  <p className="text-soft-gray font-inter text-sm mt-2">{product.short_description}</p>
                )}
              </div>

              <div className="mb-8">
                <h3 className="text-white font-inter font-bold text-xl mb-4">Technical Specifications</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: 'ri-speed-fill',     value: product.hashrate, unit: `${product.hashrate_unit || 'TH/s'} Hashrate` },
                    { icon: 'ri-flashlight-fill', value: product.power,    unit: 'Watts Power' },
                    { icon: 'ri-leaf-fill',       value: product.efficiency, unit: `${product.efficiency_unit || 'J/TH'} Efficiency` },
                  ].filter(s => s.value && String(s.value).trim()).map(s => (
                    <div key={s.unit} className="bg-gradient-to-br from-graphite to-midnight border border-crimson-accent/30 rounded-xl p-4">
                      <div className="w-10 h-10 flex items-center justify-center mb-3">
                        <i className={`${s.icon} text-crimson-accent text-3xl`}></i>
                      </div>
                      <div className="text-white font-inter font-bold text-3xl mb-1">{s.value}</div>
                      <div className="text-soft-gray font-inter text-sm">{s.unit}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="text-white font-inter font-semibold text-sm mb-2 block">{t('product_qty')}</label>
                <div className="flex items-center bg-graphite border border-white/20 rounded-lg overflow-hidden w-fit">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer">
                    <i className="ri-subtract-line text-xl"></i>
                  </button>
                  <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-20 h-12 bg-transparent text-white text-center font-inter font-bold text-xl border-x border-white/20 outline-none" min="1"
                  />
                  <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer">
                    <i className="ri-add-line text-xl"></i>
                  </button>
                </div>
              </div>

              <div className="mb-6 bg-graphite border border-crimson-accent/20 rounded-xl p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-soft-gray font-inter">Subtotal ({quantity} unit{quantity > 1 ? 's' : ''})</span>
                    <span className="text-white font-inter font-bold text-xl">${totals.subtotal} CAD</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-soft-gray font-inter">HST (13%)</span>
                    <span className="text-white font-inter font-bold text-xl">${totals.hst} CAD</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                    <span className="text-white font-inter font-bold text-lg">Total</span>
                    <span className="text-crimson-accent font-inter font-bold text-3xl">${totals.total} CAD</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mb-6">
                <button onClick={handleAddToCart}
                  className="flex-1 py-4 bg-gradient-crimson text-white font-inter font-bold text-lg rounded-xl hover:scale-105 transition-transform cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-shopping-cart-fill mr-2"></i>
                  {t('product_add_cart')}
                </button>
                <button className="w-16 h-16 flex items-center justify-center border-2 border-white/30 text-white rounded-xl hover:bg-white hover:text-midnight transition-colors cursor-pointer">
                  <i className="ri-heart-line text-2xl"></i>
                </button>
              </div>

              <div className="bg-gradient-to-br from-graphite to-midnight border border-crimson-accent/30 rounded-xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-crimson-accent/20 rounded-lg">
                    <i className="ri-map-pin-fill text-crimson-accent text-2xl"></i>
                  </div>
                  <div>
                    <div className="text-white font-inter font-semibold mb-1">6 to 9 Business Days</div>
                    <div className="text-soft-gray font-inter text-sm">Fast delivery across Canada · Secure packaging · Tracking included</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-crimson-accent/20 rounded-lg">
                    <i className="ri-customer-service-2-fill text-crimson-accent text-2xl"></i>
                  </div>
                  <div>
                    <div className="text-white font-inter font-semibold mb-1">Need Help?</div>
                    <div className="text-soft-gray font-inter text-sm mb-2">Contact our team for bulk orders or technical questions</div>
                    <a href="tel:+15146047050" className="text-crimson-accent font-inter font-semibold hover:underline">
                      <i className="ri-phone-fill mr-1"></i>+1 (514) 604-7050
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full specs — only for products that have static spec data (miners) */}
      {(product.algorithm || product.hashrate || product.details) && (
      <section className="py-16 bg-graphite">
        <div className="max-w-7xl mx-auto px-6">
          {(() => {
            const d = product.details || {};
            const groups = [
              { title: 'Performance', rows: [
                ['Algorithm',           product.algorithm],
                ['Hashrate',            product.hashrate ? `${product.hashrate} ${product.hashrate_unit || 'TH/s'}` : ''],
                ['Power / Consumption', product.power ? `${product.power} W` : ''],
                ['Efficiency',          product.efficiency ? `${product.efficiency} ${product.efficiency_unit || 'J/TH'}` : ''],
              ] },
              { title: 'Miner Details', rows: [
                ['Manufacturer', product.brand],
                ['Model',        d.model],
                ['Release',      d.release],
                ['Size',         d.size],
                ['Weight',       d.weight],
                ['Noise level',  d.noise],
                ['Fans',         d.fans],
              ] },
              { title: 'Operating Requirements', rows: [
                ['Voltage',     d.voltage],
                ['Interface',   d.interface],
                ['Temperature', d.temperature],
                ['Humidity',    d.humidity],
              ] },
            ]
              .map(g => ({ ...g, rows: g.rows.filter(([, v]) => v && String(v).trim()) }))
              .filter(g => g.rows.length > 0);

            if (groups.length === 0) return null;

            return (
              <>
              <h2 className="font-inter font-bold text-4xl text-white mb-8">Complete Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map(g => (
                  <div key={g.title} className="bg-midnight border border-crimson-accent/20 rounded-xl p-6">
                    <h3 className="text-crimson-accent font-inter font-bold text-xl mb-4">{g.title}</h3>
                    <div className="space-y-3">
                      {g.rows.map(([k, v]) => (
                        <div key={k} className="flex justify-between items-center gap-4 py-2 border-b border-white/5 last:border-0">
                          <span className="text-soft-gray font-inter">{k}</span>
                          <span className="text-white font-inter font-semibold text-right">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              </>
            );
          })()}
        </div>
      </section>
      )}

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-midnight">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-inter font-bold text-4xl text-white mb-2">You May Also Like</h2>
                <p className="text-soft-gray font-inter text-lg">Similar miners from our catalog</p>
              </div>
              <Link to="/shop" className="px-6 py-3 border-2 border-white/30 text-white font-inter font-semibold rounded-lg hover:bg-white hover:text-midnight transition-all cursor-pointer whitespace-nowrap">View All →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map((p, index) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                  <Link to={`/product?id=${p.id}`} className="block group bg-gradient-to-br from-midnight to-graphite border-2 border-transparent hover:border-crimson-accent rounded-2xl overflow-hidden transition-all duration-300">
                    <div className="relative w-full h-64 bg-black overflow-hidden">
                      <img src={p.image} alt={p.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-white font-inter font-bold text-xl mb-2">{p.name}</h3>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-crimson-accent font-inter font-bold text-2xl">${Number(p.price).toLocaleString()}</span>
                        <span className="text-soft-gray font-inter text-sm">CAD</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div><div className="text-white font-inter font-bold text-lg">{p.hashrate || '—'}</div><div className="text-soft-gray font-inter text-xs">{p.hashrate_unit || 'TH/s'}</div></div>
                        <div><div className="text-white font-inter font-bold text-lg">{p.power || '—'}</div><div className="text-soft-gray font-inter text-xs">Watts</div></div>
                        <div><div className="text-white font-inter font-bold text-lg">{p.efficiency || '—'}</div><div className="text-soft-gray font-inter text-xs">{p.efficiency_unit || 'J/TH'}</div></div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default ProductPage;
