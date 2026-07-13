import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import Seo from '../../components/feature/Seo';
import { useProduct, useProducts } from '../../hooks/useProducts';
import { useEcwidCart } from '../../hooks/useEcwidCart';
import { useTranslation } from 'react-i18next';

const ProductPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const productId = Number(searchParams.get('id')) || 0;
  const { product, loading } = useProduct(productId);
  const { products: allProducts } = useProducts();
  const { addProduct, openCart } = useEcwidCart();
  // Only Ecwid-backed products (real permalink) can be added to the cart; supplier
  // miners not yet listed in Ecwid route to the Contact/inquiry CTA instead.
  const canBuy = Boolean(product?.permalink);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [adding, setAdding] = useState(false);
  const [addingCable, setAddingCable] = useState(false);
  const [failed, setFailed] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(0);

  const images = product?.images?.length ? product.images : product ? [product.image] : [];
  // "Similar miners" — prefer other miners (they carry static `details`);
  // fall back to any other product so the section is never empty.
  const relatedProducts = (() => {
    const others = allProducts.filter(p => p.id !== productId);
    const miners = others.filter(p => p.details);
    return (miners.length ? miners : others).slice(0, 3);
  })();

  // "Buy with this miner" — the real catalog power cable only (network/Cat6/fan
  // removed). The Add button adds the real cable product to the cart.
  const POWER_CABLE_ID = 799701739; // C20 to C19 power extension cable
  const powerCable = allProducts.find(p => p.id === POWER_CABLE_ID) || null;

  // Add to the real Ecwid cart, then open the cart drawer. (Variant selection is
  // visual here; Ecwid handles product options in its own cart/checkout.)
  const handleAddToCart = async () => {
    if (!product || adding) return;
    setFailed(false);
    setAdding(true);
    try {
      await addProduct(product.id, quantity);
      openCart();
    } catch {
      setFailed(true);
      setTimeout(() => setFailed(false), 2500);
    } finally {
      setAdding(false);
    }
  };

  const handleAddCable = async (cableId: number) => {
    if (addingCable) return;
    setAddingCable(true);
    try {
      await addProduct(cableId, 1);
      openCart();
    } catch {
      /* leave the button state; user can retry */
    } finally {
      setAddingCable(false);
    }
  };

  // Returning to the shop — flag the navigation so ScrollManager restores the
  // exact scroll position the customer left from (saved when they clicked View
  // Details). Direct visits with no saved position just land at the shop top.
  const handleBackToShop = () => {
    try { sessionStorage.setItem('restoreShopScroll', '1'); } catch { /* ignore */ }
  };

  // Current variant — falls back to the product's top-level (highest) values.
  const variants = product?.variants ?? [];
  const v = variants[selectedVariant] ?? null;
  const cur = {
    hashrate: v?.hashrate ?? product?.hashrate ?? '',
    hashrate_unit: v?.hashrate_unit ?? product?.hashrate_unit,
    power: v?.power ?? product?.power ?? '',
    efficiency: v?.efficiency ?? product?.efficiency ?? '',
    efficiency_unit: v?.efficiency_unit ?? product?.efficiency_unit,
    price: v?.price ?? product?.price ?? '0',
    model: v?.model ?? product?.details?.model,
  };
  const subtotalNum = Number(cur.price) * quantity;
  const totals = {
    subtotal: subtotalNum.toFixed(2),
    hst: (subtotalNum * 0.13).toFixed(2),
    total: (subtotalNum * 1.13).toFixed(2),
    freeShipping: false,
  };

  // Separate badges: condition (Brand New / Used), cooling (Air-Cooled /
  // Hydro-Cooled), and coin/mining type. "Home" is never a badge.
  const lcv = (s?: string) => (s || '').toLowerCase();
  const condLabel = product ? (product.condition === 'New' ? 'Brand New' : product.condition) : '';
  const coolingLabel = (() => {
    if (!product) return '';
    const c = lcv(product.cooling);
    if (c === 'hydro' || /hydro|\bhyd\b|water[- ]?cool|liquid/.test(lcv(product.name))) return 'Hydro-Cooled';
    if (c === 'air' || product.details?.fans) return 'Air-Cooled';
    return '';                       // unclear → leave blank
  })();
  const coinKey = (() => {
    if (!product || !product.algorithm) return null;       // miners only
    const tx = `${lcv(product.name)} ${lcv(product.algorithm)}`;
    if (coolingLabel === 'Hydro-Cooled') return 'shop_badge_hydro';
    if (/xphash|xphere/.test(tx)) return 'shop_badge_coin_xp';
    if (/versahash|initverse/.test(tx)) return 'shop_badge_coin_ini';
    if (/blake3|alephium|\balph\b/.test(tx)) return 'shop_badge_coin_alph';
    if (/aleo|zksnark|\bae\d\b/.test(tx)) return 'shop_badge_coin_aleo';
    if (/scrypt|litecoin|\bltc\b|\bdoge\b|\bl[379]\b|\bl11\b|dg1|volcminer/.test(tx)) return 'shop_badge_coin_ltc';
    if (/kaspa|kheavyhash|\bkas\b|\bks\d/.test(tx)) return 'shop_badge_coin_kas';
    if (/zcash|equihash|\bzec\b|\bz15\b/.test(tx)) return 'shop_badge_coin_zec';
    if (/sha-?256|bitcoin|\bbtc\b/.test(tx)) return 'shop_badge_coin_btc';
    return null;
  })();

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

  const seoDesc = [
    product.name,
    product.hashrate ? `${product.hashrate} ${product.hashrate_unit || 'TH/s'}` : '',
    product.algorithm || '',
    product.brand || '',
  ].filter(Boolean).join(' · ') + ' — ASIC miner from Canada BTC Miners. New & used ASIC sales, repair and hosting across Canada.';

  return (
    <div className="min-h-screen bg-midnight">
      <Seo
        title={`${product.name} | Canada BTC Miners`}
        description={product.short_description?.trim() || seoDesc}
        path={`/product?id=${productId}`}
      />
      <Navbar />

      <section className="pt-32 pb-8 bg-graphite border-b border-crimson-accent/20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Back to Shop — prominent pill so customers always have a clear way out */}
          <Link to="/shop" onClick={handleBackToShop}
            className="inline-flex items-center gap-1.5 mb-4 px-4 py-2 rounded-full border border-crimson-accent/50 bg-crimson-accent/10 text-crimson-accent font-inter font-semibold text-sm hover:bg-crimson-accent hover:text-white transition-colors"
          >
            <i className="ri-arrow-left-line" aria-hidden="true"></i>
            {t('product_back')}
          </Link>

          {/* Breadcrumb — Home and Shop are clickable pills, current product is plain text */}
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 font-inter text-sm">
            <Link to="/"
              className="inline-flex items-center min-h-[36px] px-3 py-1.5 rounded-lg border border-white/20 bg-white/[0.06] text-white hover:bg-white/15 hover:border-white/40 transition-colors"
            >{t('product_bc_home')}</Link>
            <i className="ri-arrow-right-s-line text-soft-gray" aria-hidden="true"></i>
            <Link to="/shop" onClick={handleBackToShop}
              className="inline-flex items-center min-h-[36px] px-3 py-1.5 rounded-lg border border-white/20 bg-white/[0.06] text-white hover:bg-white/15 hover:border-white/40 transition-colors"
            >{t('product_bc_shop')}</Link>
            <i className="ri-arrow-right-s-line text-soft-gray" aria-hidden="true"></i>
            <span className="text-soft-gray truncate max-w-[60vw] sm:max-w-none">{product.name}</span>
          </nav>
        </div>
      </section>

      <section className="py-10 lg:py-16 bg-midnight">
        <div className="max-w-7xl mx-auto px-6">
          {/* Mobile order: title → image → price/variant/specs/qty/add-to-cart →
              trust. Desktop: image left, title+purchase right. */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6 lg:items-start">

            {/* Title + badges (full-width top on desktop) */}
            <div className="order-1 lg:order-none lg:col-span-2 lg:row-start-1">
              <h1 className="font-inter font-bold text-3xl lg:text-4xl text-white mb-3">{product.name}</h1>
              <div className="flex flex-wrap items-center gap-2">
                {condLabel && <span className="px-3 py-1 bg-white/15 border border-white/25 text-white rounded-full text-xs font-inter font-semibold">{condLabel}</span>}
                {coolingLabel && <span className="px-3 py-1 bg-white/15 border border-white/25 text-white rounded-full text-xs font-inter font-semibold">{coolingLabel}</span>}
                {coinKey && coinKey !== 'shop_badge_hydro' && <span className="px-3 py-1 bg-crimson-accent text-white rounded-full text-xs font-inter font-semibold">{t(coinKey)}</span>}
              </div>
            </div>

            {/* Image (desktop left column) */}
            <div className="order-2 lg:order-none lg:col-start-1 lg:row-start-2">
              <div className="relative w-full h-[320px] lg:h-[500px] bg-black rounded-2xl overflow-hidden mb-4 border-2 border-white/10 flex items-center justify-center">
                {(images[selectedImage] || product.image) ? (
                  <img src={images[selectedImage] || product.image} alt={product.name} className="w-full h-full object-contain object-center" />
                ) : (
                  <i className="ri-image-line text-6xl text-zinc-700" aria-hidden="true"></i>
                )}
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((img, index) => (
                    <button key={index} onClick={() => setSelectedImage(index)}
                      className={`relative w-full h-24 bg-black rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${selectedImage === index ? 'border-crimson-accent' : 'border-white/10 hover:border-white/30'}`}
                    >
                      <img src={img} alt={`${product.name} view ${index + 1}`} className="w-full h-full object-contain object-center" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Purchase core: price, variant, specs, quantity, add-to-cart (desktop right) */}
            <div className="order-3 lg:order-none lg:col-start-2 lg:row-start-2 lg:row-span-2">
              <div className="mb-6 pb-6 border-b border-white/10">
                <div className="flex items-baseline gap-3">
                  <span className="text-crimson-accent font-inter font-bold text-4xl lg:text-5xl">${Number(cur.price).toLocaleString()}</span>
                  <span className="text-soft-gray font-inter text-xl">CAD</span>
                </div>
                {product.short_description && (
                  <p className="text-soft-gray font-inter text-sm mt-2">{product.short_description}</p>
                )}
              </div>

              {/* Variant selector — updates hashrate, watts, efficiency and price */}
              {variants.length > 1 && (
                <div className="mb-6">
                  <label className="text-white font-inter font-semibold text-sm mb-2 block">Model / Hashrate</label>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((vr, i) => (
                      <button key={vr.label} type="button" onClick={() => setSelectedVariant(i)}
                        className={`min-h-[40px] px-4 py-2 rounded-lg font-inter text-sm font-semibold border transition-colors cursor-pointer ${
                          i === selectedVariant
                            ? 'bg-crimson-accent border-crimson-accent text-white'
                            : 'bg-transparent border-white/25 text-white hover:bg-white/10'
                        }`}
                      >{vr.label}</button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-white font-inter font-bold text-lg mb-3">Key Specs</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: 'ri-speed-fill',     value: cur.hashrate, unit: `${cur.hashrate_unit || 'TH/s'} Hashrate` },
                    { icon: 'ri-flashlight-fill', value: cur.power,    unit: 'Watts Power' },
                    { icon: 'ri-leaf-fill',       value: cur.efficiency, unit: `${cur.efficiency_unit || 'J/TH'} Efficiency` },
                  ].filter(s => s.value && String(s.value).trim()).map(s => (
                    <div key={s.unit} className="bg-gradient-to-br from-graphite to-midnight border border-crimson-accent/30 rounded-xl p-4">
                      <div className="w-9 h-9 flex items-center justify-center mb-2">
                        <i className={`${s.icon} text-crimson-accent text-2xl`}></i>
                      </div>
                      <div className="text-white font-inter font-bold text-2xl mb-1">{s.value}</div>
                      <div className="text-soft-gray font-inter text-xs">{s.unit}</div>
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

              {canBuy ? (
                <button onClick={handleAddToCart} disabled={adding} aria-busy={adding}
                  className="w-full py-4 mb-6 bg-gradient-crimson text-white font-inter font-bold text-lg rounded-xl hover:scale-105 transition-transform cursor-pointer whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <i className={`${adding ? 'ri-loader-4-line animate-spin' : 'ri-shopping-cart-fill'} mr-2`}></i>
                  {adding ? t('shop_adding') : failed ? t('shop_add_retry') : t('product_add_cart')}
                </button>
              ) : (
                <Link to="/contact#contact-form"
                  className="w-full py-4 mb-6 flex items-center justify-center gap-2 bg-gradient-crimson text-white font-inter font-bold text-lg rounded-xl hover:scale-105 transition-transform text-center"
                >
                  <i className="ri-customer-service-2-line" aria-hidden="true"></i>
                  {t('shop_pending_cta')}
                </Link>
              )}

            </div>

            {/* Buy with this miner — desktop: directly under the image (left column) */}
            <div className="order-4 lg:order-none lg:col-start-1 lg:row-start-3">
              <div className="bg-graphite border border-crimson-accent/20 rounded-xl p-6">
                <h3 className="text-white font-inter font-bold text-xl mb-4">Buy with this miner</h3>
                {powerCable ? (
                  <div className="flex items-center gap-4 bg-midnight/50 border border-white/10 rounded-lg p-4">
                    <div className="w-16 h-16 bg-black rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {powerCable.image ? (
                        <img src={powerCable.image} alt={powerCable.name} className="w-full h-full object-contain" />
                      ) : (<i className="ri-plug-2-line text-2xl text-zinc-600" aria-hidden="true"></i>)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-inter font-semibold text-sm mb-1">{powerCable.name}</h4>
                      <div className="text-crimson-accent font-inter font-bold text-lg">${Number(powerCable.price).toFixed(2)} CAD</div>
                    </div>
                    <button onClick={() => handleAddCable(powerCable.id)} disabled={addingCable} aria-busy={addingCable}
                      className="px-4 py-2 bg-crimson-accent/10 border border-crimson-accent text-crimson-accent font-inter font-semibold text-sm rounded-lg hover:bg-crimson-accent hover:text-white transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed">{addingCable ? t('shop_adding') : 'Add'}</button>
                  </div>
                ) : (
                  <p className="text-soft-gray font-inter text-sm">Power cable available on request.</p>
                )}
              </div>
            </div>

            {/* Shipping / support trust notes — desktop: under the purchase panel */}
            <div className="order-5 lg:order-none lg:col-start-2 lg:row-start-4">
              <div className="bg-gradient-to-br from-graphite to-midnight border border-crimson-accent/30 rounded-xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-crimson-accent/20 rounded-lg flex-shrink-0">
                    <i className="ri-truck-fill text-crimson-accent text-2xl"></i>
                  </div>
                  <div>
                    <div className="text-white font-inter font-semibold mb-1">6 to 9 Business Days</div>
                    <div className="text-soft-gray font-inter text-sm">Fast delivery across Canada · Secure packaging · Tracking included · Shipping &amp; brokerage included on new units</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-crimson-accent/20 rounded-lg flex-shrink-0">
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
                ['Hashrate',            cur.hashrate ? `${cur.hashrate} ${cur.hashrate_unit || 'TH/s'}` : ''],
                ['Power / Consumption', cur.power ? `${cur.power} W` : ''],
                ['Efficiency',          cur.efficiency ? `${cur.efficiency} ${cur.efficiency_unit || 'J/TH'}` : ''],
              ] },
              { title: 'Miner Details', rows: [
                ['Manufacturer', product.brand],
                ['Model',        cur.model],
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
