import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useTranslation } from 'react-i18next';
import Seo from '../../components/feature/Seo';
import type { Product } from '../../lib/api';

const ShopPage = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const { products, loading } = useProducts();

  const categories = [
    { id: 'all',        label: 'All ASIC Miners' },
    { id: 'antminer',   label: 'Bitmain Antminer' },
    { id: 'whatsminer', label: 'Whatsminer' },
    { id: 'scrypt',     label: 'Litecoin / Dogecoin' },
    { id: 'hydro',      label: 'Hydro Cooled' },
    { id: 'home',       label: 'Home Mining' },
  ];

  // Pull a usable number out of values like "$3,200", "335", or "335 TH/s".
  const toNumber = (v: unknown): number | null => {
    if (v === null || v === undefined) return null;
    const n = parseFloat(String(v).replace(/[^0-9.]/g, ''));
    return Number.isNaN(n) ? null : n;
  };

  // 1) Category filter (unchanged behaviour).
  const categoryFiltered = (() => {
    if (activeCategory === 'antminer')   return products.filter(p => p.name.toLowerCase().includes('antminer'));
    if (activeCategory === 'whatsminer') return products.filter(p => p.name.toLowerCase().includes('whatsminer'));
    if (activeCategory === 'scrypt')     return products.filter(p => p.algorithm?.toLowerCase() === 'scrypt');
    if (activeCategory === 'hydro')      return products.filter(p => p.cooling === 'Hydro');
    if (activeCategory === 'home')       return products.filter(p => parseInt(p.power) < 3000);
    return products;
  })();

  // 2) Free-text search across model/brand/algorithm/hashrate/etc.
  const query = searchQuery.trim().toLowerCase();
  const searchedProducts = query
    ? categoryFiltered.filter((p) => {
        const haystack = [p.name, p.algorithm, p.cooling, p.condition, p.hashrate, p.power, p.efficiency, p.short_description, p.badge]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(query);
      })
    : categoryFiltered;

  // 3) Sort. Empty value keeps default order; missing values sort to the end.
  const filteredProducts = (() => {
    if (!sortBy) return searchedProducts;
    const key: 'price' | 'hashrate' = sortBy.startsWith('hash') ? 'hashrate' : 'price';
    const dir: 'asc' | 'desc' = sortBy.endsWith('asc') ? 'asc' : 'desc';
    const val = (p: Product) => toNumber(key === 'price' ? p.price : p.hashrate);
    return [...searchedProducts].sort((a, b) => {
      const av = val(a); const bv = val(b);
      if (av === null && bv === null) return 0;
      if (av === null) return 1;
      if (bv === null) return -1;
      return dir === 'asc' ? av - bv : bv - av;
    });
  })();

  const trustSignals = [
    { icon: 'ri-truck-line',        title: t('tb_shipping') },
    { icon: 'ri-file-list-line',    title: t('tb_tax') },
    { icon: 'ri-map-pin-line',      title: t('tb_inventory') },
    { icon: 'ri-tools-line',        title: t('tb_warranty') },
  ];

  const SkeletonCard = () => (
    <div className="bg-[#141414] rounded-xl overflow-hidden border border-white/10 animate-pulse">
      <div className="h-64 bg-white/5" />
      <div className="p-6 space-y-4">
        <div className="h-6 bg-white/5 rounded w-3/4" />
        <div className="h-4 bg-white/5 rounded w-1/2" />
        <div className="h-10 bg-white/5 rounded w-1/3" />
        <div className="h-12 bg-white/5 rounded" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Seo
        title="Buy ASIC Miners in Canada | Canada BTC Miners"
        description="Shop new and used ASIC miners in Canada, including Antminer and Whatsminer models. Canada BTC Miners offers tested mining hardware, Montreal pickup, and Canada wide shipping."
        path="/shop"
      />
      <Navbar />

      <section className="pt-32 pb-16 bg-[#0A0A0A] relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="font-orbitron font-bold text-5xl md:text-6xl text-white mb-6">
              {t('shop_title')}
            </h1>
            <p className="text-soft-gray font-inter text-xl max-w-3xl mx-auto">
              {t('shop_sub')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Category filter block (alone) ── */}
      <section className="py-6 bg-[#141414] border-y border-white/10">
        <div className="max-w-3xl mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categories.map((category) => (
              <button key={category.id} onClick={() => setActiveCategory(category.id)}
                className={`relative z-10 w-full min-h-[44px] px-4 py-2.5 text-center rounded-lg font-inter text-sm transition-all cursor-pointer border active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson-accent ${
                  activeCategory === category.id
                    ? 'bg-crimson-accent border-crimson-accent text-white font-semibold'
                    : 'bg-transparent border-white/15 text-white/80 hover:text-white hover:bg-white/10 active:bg-white/15'
                }`}
              >{category.label}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6">
          {/* ── Results toolbar: count + search + sort, directly above the cards ── */}
          <div className="relative z-20 mb-8 flex flex-col gap-4 rounded-xl border border-white/10 bg-[#141414] p-4 lg:flex-row lg:items-center lg:gap-4">
            <div className="shrink-0 text-soft-gray font-inter text-sm">
              {loading ? (
                <span className="animate-pulse">{t('shop_loading')}</span>
              ) : (
                <>{t('shop_showing_label')} <span className="text-white font-semibold">{filteredProducts.length}</span> {t('shop_showing_suffix')}</>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-1">
              {/* Search — red magnifier (inline SVG) on the right */}
              <div className="relative z-20 flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('shop_search_ph')}
                  aria-label={t('shop_search_ph')}
                  className="relative z-20 w-full min-h-[44px] rounded-lg border border-white/15 bg-[#0A0A0A] py-3 pl-4 pr-11 font-inter text-base sm:text-sm text-white placeholder-soft-gray transition-colors focus:border-crimson-accent focus:outline-none"
                />
                <svg
                  width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
                >
                  <circle cx="10.5" cy="10.5" r="6.5" stroke="#DC2626" strokeWidth="2.5" />
                  <path d="M15.5 15.5L21 21" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>

              {/* Sort — native select; closed box shows "Sort by"; red caret on the right */}
              <div className="relative z-20 self-start sm:self-auto shrink-0">
                <label htmlFor="shop-sort" className="sr-only">{t('shop_sort_label')}</label>
                <select
                  id="shop-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="relative z-20 w-[150px] max-w-full appearance-none cursor-pointer rounded-lg border border-white/15 bg-[#0A0A0A] pl-3 pr-9 py-3 min-h-[44px] font-inter text-base sm:text-sm text-white focus:border-crimson-accent focus:outline-none"
                >
                  <option value="">{t('shop_sort_label')}</option>
                  <option value="price_asc">{t('shop_sort_price_asc')}</option>
                  <option value="price_desc">{t('shop_sort_price_desc')}</option>
                  <option value="hash_asc">{t('shop_sort_hash_asc')}</option>
                  <option value="hash_desc">{t('shop_sort_hash_desc')}</option>
                </select>
                <svg
                  width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
                >
                  <path d="M7 9.5L12 14.5L17 9.5" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          {!loading && filteredProducts.length === 0 ? (
            <div className="mx-auto max-w-xl py-16 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-crimson-accent/30 bg-crimson-accent/10">
                <i className="ri-search-eye-line text-3xl text-crimson-accent" aria-hidden="true"></i>
              </div>
              <h3 className="font-orbitron font-bold text-2xl text-white mb-3">{t('shop_empty_title')}</h3>
              <p className="text-soft-gray font-inter text-base leading-7 mb-8">{t('shop_empty_desc')}</p>
              <Link to="/contact#contact-form" className="relative z-10 inline-flex min-h-[44px] items-center justify-center gap-2 px-8 py-3.5 bg-crimson-accent text-white font-inter font-semibold rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson-accent">
                <i className="ri-customer-service-2-line text-lg" aria-hidden="true"></i>
                {t('shop_empty_cta')}
              </Link>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
            ) : filteredProducts.map((product, index) => (
              <motion.div key={product.id}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: index * 0.05 }}
                className="bg-[#141414] rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300"
              >
                <div className="relative w-full h-64 bg-black overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain object-center hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="px-3 py-1 bg-[#2A2A2A] text-white text-xs font-inter font-medium rounded">{product.cooling}</span>
                    {product.condition === 'New'
                      ? <span className="px-3 py-1 bg-transparent border border-white/50 text-white text-xs font-inter font-medium rounded">New</span>
                      : <span className="px-3 py-1 bg-[#2A2A2A] text-gray-400 text-xs font-inter font-medium rounded">{product.condition}</span>
                    }
                    {product.badge && <span className="px-3 py-1 bg-crimson-accent text-white text-xs font-inter font-bold rounded">{product.badge}</span>}
                  </div>
                  {product.stock_status !== 'instock' && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-center py-1.5 text-xs font-inter text-amber-400 font-semibold">
                      {product.stock_status === 'outofstock' ? 'Out of Stock' : 'Pre-Order'}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-white font-orbitron font-bold text-xl mb-3">{product.name}</h3>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="text-center">
                      <div className="text-white font-orbitron font-bold text-2xl">{product.hashrate}</div>
                      <div className="text-soft-gray font-inter text-xs">TH/s</div>
                    </div>
                    <div className="w-px h-10 bg-white/20"></div>
                    <div className="text-center">
                      <div className="text-white font-orbitron font-semibold text-lg">{product.power}</div>
                      <div className="text-soft-gray font-inter text-xs">Watts</div>
                    </div>
                    <div className="w-px h-10 bg-white/20"></div>
                    <div className="text-center">
                      <div className="text-white font-orbitron font-semibold text-lg">{product.efficiency}</div>
                      <div className="text-soft-gray font-inter text-xs">J/TH</div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <span className="text-white font-orbitron font-bold text-3xl">
                      ${Number(product.price).toLocaleString()} CAD
                    </span>
                    {product.sale_price && product.sale_price !== product.price && (
                      <span className="ml-3 text-soft-gray line-through text-lg font-inter">${Number(product.sale_price).toLocaleString()}</span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button className="relative z-10 flex-1 min-h-[44px] py-3 bg-crimson-accent text-white font-inter font-semibold rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors cursor-pointer whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson-accent disabled:opacity-60 disabled:cursor-not-allowed"
                      disabled={product.stock_status === 'outofstock'}
                    >
                      {product.stock_status === 'outofstock' ? t('shop_out_stock') : t('shop_add_cart')}
                    </button>
                    <Link to={`/product?id=${product.id}`}
                      className="relative z-10 flex-1 min-h-[44px] flex items-center justify-center py-3 bg-transparent border border-white/30 text-white font-inter font-normal rounded-lg hover:bg-white/10 active:bg-white/15 transition-colors cursor-pointer whitespace-nowrap text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
                    >{t('fp_view')}</Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          )}
        </div>
      </section>

      <section className="py-12 bg-[#141414] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {trustSignals.map((signal, index) => (
              <motion.div key={signal.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="text-center"
              >
                <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <i className={`${signal.icon} text-3xl text-white`}></i>
                </div>
                <p className="text-white font-inter text-sm">{signal.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-orbitron font-bold text-4xl text-white mb-4">Need Help Choosing?</h2>
            <p className="text-soft-gray font-inter text-lg mb-8">Our team can help you select the right miner for your requirements.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact#contact-form" className="relative z-10 inline-flex min-h-[44px] items-center justify-center px-8 py-4 bg-crimson-accent text-white font-inter font-semibold rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors cursor-pointer whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson-accent">Contact Our Team</Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ShopPage;
