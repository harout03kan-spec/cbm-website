import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useTranslation } from 'react-i18next';
import Seo from '../../components/feature/Seo';
import type { Product } from '../../lib/api';

const ShopPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('all');
  const [accSub, setAccSub] = useState('all');
  // Seed the search from a ?q= param so the homepage "Used Deals" card can open
  // the shop pre-filtered to used units — reusing the existing search (no new
  // category, no new filter UI). Customers can clear it to see everything.
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState('');
  const { products, loading } = useProducts();

  // Persist the shop scroll position so returning from a product page — via the
  // Shop / Back to Shop buttons (PUSH) or the browser Back button (POP) — lands
  // the customer back where they were. ScrollManager reads `shopScrollY`.
  useEffect(() => {
    const save = () => { try { sessionStorage.setItem('shopScrollY', String(window.scrollY)); } catch { /* ignore */ } };
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => { save(); ticking = false; });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { save(); window.removeEventListener('scroll', onScroll); };
  }, []);

  const categories = [
    { id: 'all',         key: 'shop_cat_all' },
    { id: 'bitcoin',     key: 'shop_cat_bitcoin' },
    { id: 'altcoin',     key: 'shop_cat_altcoin' },
    { id: 'hydro',       key: 'shop_cat_hydro' },
    { id: 'home',        key: 'shop_cat_home' },
    { id: 'accessories', key: 'shop_cat_accessories' },
  ];

  // Accessory subcategories (only shown when Accessories is selected).
  const accessorySubs = [
    { id: 'all',        key: 'shop_acc_all' },
    { id: 'psu',        key: 'shop_acc_psu' },
    { id: 'fans',       key: 'shop_acc_fans' },
    { id: 'control',    key: 'shop_acc_control' },
    { id: 'cables',     key: 'shop_acc_cables' },
    { id: 'hashboards', key: 'shop_acc_hashboards' },
  ];

  const selectCategory = (id: string) => {
    setActiveCategory(id);
    setAccSub('all');
  };

  // Pull a usable number out of values like "$3,200", "335", or "335 TH/s".
  const toNumber = (v: unknown): number | null => {
    if (v === null || v === undefined) return null;
    const n = parseFloat(String(v).replace(/[^0-9.]/g, ''));
    return Number.isNaN(n) ? null : n;
  };

  // ── Safe catalog helpers — categorize without inventing any specs/prices ──
  const lc = (s?: string) => (s || '').toLowerCase();
  const ptext = (p: Product) =>
    `${lc(p.name)} ${lc((p.categories || []).join(' '))} ${lc(p.short_description)} ${lc(p.algorithm)}`;
  const hasHashrate = (p: Product) => (toNumber(p.hashrate) ?? 0) > 0;

  // Generic / broken imported product (e.g. name "Product" or empty).
  const isUnclear = (p: Product) => {
    const n = lc(p.name).trim();
    return !n || n === 'product' || n === 'products' || /^product(\b|$)/.test(n) || n.length < 2;
  };

  // Accessories: parts/extras with no real hashrate.
  const ACCESSORY_RE = /power supply|psu|control board|hashboard|hash board|\bfans?\b|\bcables?\b|\bparts?\b|immersion|accessor|adapter|controller|connector|bracket|\bcord\b|cooling kit|repair kit|\btool/;
  const isAccessory = (p: Product) => ACCESSORY_RE.test(ptext(p)) && !hasHashrate(p);

  const isMiner = (p: Product) =>
    !isAccessory(p) && (hasHashrate(p) || /miner|antminer|whatsminer|avalon|\b[sml]\d{1,2}\b|\bks\d|\bz15\b/.test(lc(p.name)));

  const ALTCOIN_RE = /scrypt|kheavyhash|heavyhash|kaspa|blake3|blake2|eaglesong|equihash|x11|handshake|blake256|cuckoo|aleo|\bdash\b|\bdoge\b|litecoin|\bltc\b|\bkas\b|\bzec\b|\bhns\b|\bl[379]\b|\bks\d|\bz15\b|dg1|volcminer|\bae\d\b/;
  const BITCOIN_RE = /sha-?256|bitcoin|\bbtc\b/;

  // Static category traits (algorithm/cooling based — reliable, per-product).
  const isHydro = (p: Product) => lc(p.cooling) === 'hydro' || /hydro|\bhyd\b/.test(ptext(p));
  const isHome = (p: Product) => /\bhome\b/.test(ptext(p)) || (toNumber(p.power) ?? Infinity) <= 2500;
  const isSha = (p: Product) => /sha-?256/.test(lc(p.algorithm)); // SHA-256 = Bitcoin family

  // Category logic:
  //  All Miners  → every miner (Bitcoin air, Hydro, Altcoin, Home).
  //  Bitcoin     → SHA-256, air-cooled only (no Hydro, no Home, no altcoin).
  //  Hydro       → any water-cooled miner.
  //  Altcoin     → any non-SHA-256 miner (Scrypt L7/L9/DG1+/D1, kHeavyHash KS7, Aleo).
  //  Home        → home miners (e.g. Avalon Q), excluding Hydro.
  const inCategory = (p: Product, cat: string): boolean => {
    if (cat === 'accessories') return isAccessory(p);
    if (cat === 'all') return isMiner(p);
    if (isUnclear(p) || isAccessory(p) || !isMiner(p)) return false;
    if (cat === 'hydro') return isHydro(p);
    if (cat === 'altcoin') return !isSha(p);
    if (cat === 'home') return isHome(p) && !isHydro(p);
    if (cat === 'bitcoin') return isSha(p) && !isHydro(p) && !isHome(p);
    return false;
  };

  // Each accessory belongs to exactly one subcategory (precedence order avoids
  // an item showing up under two filters — e.g. an APW power *cord* is a cable).
  const accSubOf = (p: Product): string => {
    const tx = ptext(p);
    if (/hashboard|hash board/.test(tx)) return 'hashboards';
    if (/control board|motherboard|amlogic|xilinx/.test(tx)) return 'control';
    if (/\bcord\b|\bcables?\b|splitter/.test(tx)) return 'cables';
    if (/power supply|psu|\bapw\d/.test(tx)) return 'psu';
    if (/\bfans?\b|cooling fan/.test(tx)) return 'fans';
    return 'other';
  };
  const accSubMatch = (p: Product, sub: string): boolean =>
    sub === 'all' ? true : accSubOf(p) === sub;

  // Red type badge (miners only). Hydro miners read "Hydro"; otherwise the
  // mining type by algorithm (Bitcoin / LTC/DOGE / KAS / ALEO). "Home" is a
  // filter only and is never a badge. Returns an i18n key or null.
  const coinTypeKey = (p: Product): string | null => {
    if (!isMiner(p) || isUnclear(p)) return null;
    if (isHydro(p)) return 'shop_badge_hydro';
    const tx = ptext(p);
    if (/xphash|xphere/.test(tx))                     return 'shop_badge_coin_xp';
    if (/versahash|initverse/.test(tx))               return 'shop_badge_coin_ini';
    if (/blake3|alephium|\balph\b/.test(tx))          return 'shop_badge_coin_alph';
    if (/aleo|\bae\d\b/.test(tx))                     return 'shop_badge_coin_aleo';
    if (/scrypt|litecoin|\bltc\b|\bdoge\b|\bl[379]\b|dg1|volcminer/.test(tx)) return 'shop_badge_coin_ltc';
    if (/kaspa|kheavyhash|\bkas\b|\bks\d/.test(tx))   return 'shop_badge_coin_kas';
    if (/zcash|equihash|\bzec\b|\bz15\b/.test(tx))    return 'shop_badge_coin_zec';
    if (/\bdash\b|x11/.test(tx))                      return 'shop_badge_coin_dash';
    if (BITCOIN_RE.test(tx) || !ALTCOIN_RE.test(tx))  return 'shop_badge_coin_btc';
    if (ALTCOIN_RE.test(tx))                          return 'shop_badge_coin_alt';
    return null;
  };

  // Condition badge i18n key from product data (no condition invented).
  const conditionKey = (p: Product): string | null => {
    const c = lc(p.condition);
    if (!c) return null;
    if (/new/.test(c)) return 'shop_cond_new';
    if (/refurb/.test(c)) return 'shop_cond_refurb';
    if (/used/.test(c)) return 'shop_cond_used';
    return null;
  };

  // Pull hashrate from a product title like "Antminer S19 95T" → "95" (TH/s).
  // Used only as a fallback when there's no dedicated hashrate field.
  const hashFromTitle = (name: string): string | null => {
    const m = (name || '').match(/(\d+(?:\.\d+)?)\s*T(?:h|H)?\b/);
    return m ? m[1] : null;
  };

  // Clean display name: drop condition words (they become a badge).
  const cleanName = (name: string): string => {
    const cleaned = name
      .replace(/\b(brand new|refurbished|refurb|used|new)\b/gi, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/^[\s\-–|]+|[\s\-–|]+$/g, '')
      .trim();
    return cleaned || name;
  };

  // 1) Category filter (+ accessory subfilter when Accessories is selected).
  const categoryFiltered = products.filter((p) =>
    inCategory(p, activeCategory) && (activeCategory !== 'accessories' || accSubMatch(p, accSub))
  );

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

  // Default storefront order (only when no sort is chosen): Bitcoin air‑cooled
  // Antminers first (S19 ladder → S21 ladder → T21), then other Bitcoin air
  // miners, then hydro, then Scrypt / L‑series, then other altcoin / home.
  // A chosen sort option overrides this entirely.
  const defaultRank = (p: Product): number => {
    const n = lc(p.name);
    const hydro = isHydro(p);
    const scrypt = /\bl7\b|\bl9\b|\bl11\b|scrypt|litecoin|\bdoge\b|dg1|volcminer|goldshell|elphapex|fluminer l|\blt6\b/.test(n);
    const sha = /sha-?256/.test(lc(p.algorithm)) || /\bs19\b|\bs21\b|\bs23\b|\bt21\b|whatsminer m|avalon|sealminer/.test(n);
    if (!hydro) {
      if (/\bs19\b/.test(n) && !/xp|pro|s19j|s19e/.test(n)) return 100; // S19 (95T) base
      if (/s19j pro/.test(n)) return 110;
      if (/s19 pro/.test(n)) return 120;
      if (/s19 xp/.test(n)) return 130;
      if (/\bs21\b/.test(n) && !/\+|pro|xp/.test(n)) return 200; // S21 base
      if (/s21\+/.test(n)) return 210;
      if (/s21 pro/.test(n)) return 220;
      if (/s21 xp/.test(n)) return 230;
      if (/\bt21\b/.test(n)) return 240;
    }
    if (hydro) return 400;
    if (scrypt) return 500;
    if (sha) return 300;
    return 600;
  };

  // 3) Sort. Empty value uses the curated default order; missing values sort to the end.
  const filteredProducts = (() => {
    if (!sortBy) {
      return searchedProducts
        .map((p, i) => ({ p, i, r: defaultRank(p) }))
        .sort((a, b) => a.r - b.r || a.i - b.i)
        .map((x) => x.p);
    }
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
            <h1 className="font-inter font-bold text-5xl md:text-6xl text-white mb-6">
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
              <button key={category.id} onClick={() => selectCategory(category.id)}
                className={`relative z-10 w-full min-h-[44px] px-4 py-2.5 text-center rounded-lg font-inter text-sm transition-all cursor-pointer border active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson-accent ${
                  activeCategory === category.id
                    ? 'bg-crimson-accent border-crimson-accent text-white font-semibold'
                    : 'bg-transparent border-white/15 text-white/80 hover:text-white hover:bg-white/10 active:bg-white/15'
                }`}
              >{t(category.key)}</button>
            ))}
          </div>

          {/* Accessory subcategories — only when Accessories is selected */}
          {activeCategory === 'accessories' && (
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {accessorySubs.map((sub) => (
                <button key={sub.id} onClick={() => setAccSub(sub.id)}
                  className={`min-h-[40px] px-4 py-2 rounded-lg font-inter text-xs sm:text-sm transition-all cursor-pointer border active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson-accent ${
                    accSub === sub.id
                      ? 'bg-crimson-accent/20 border-crimson-accent text-crimson-accent font-semibold'
                      : 'bg-transparent border-white/15 text-white/70 hover:text-white hover:bg-white/10 active:bg-white/15'
                  }`}
                >{t(sub.key)}</button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6">
          {/* ── Results toolbar: count + search + sort, directly above the cards ── */}
          <div className="relative z-20 mb-8 flex flex-col gap-4 rounded-xl border border-white/10 bg-[#141414] p-3 sm:p-4 lg:flex-row lg:items-center lg:gap-4">
            <div className="shrink-0 text-soft-gray font-inter text-sm">
              {loading ? (
                <span className="animate-pulse">{t('shop_loading')}</span>
              ) : (
                <span>{t(activeCategory === 'accessories' ? 'shop_count_accessories' : 'shop_count_miners', { count: filteredProducts.length })}</span>
              )}
            </div>

            <div className="flex flex-col gap-3 lg:flex-1 lg:flex-row lg:items-center">
              {/* Search — red magnifier (inline SVG) on the right */}
              <div className="relative z-20 w-full lg:flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('shop_search_ph')}
                  aria-label={t('shop_search_ph')}
                  className="relative z-10 w-full min-h-[44px] rounded-lg border border-white/15 bg-[#0A0A0A] py-3 pl-3 pr-11 font-inter text-base sm:text-sm text-white placeholder-soft-gray transition-colors focus:border-crimson-accent focus:outline-none"
                />
                <svg
                  width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"
                  className="pointer-events-none absolute right-3 top-1/2 z-30 -translate-y-1/2"
                >
                  <circle cx="10.5" cy="10.5" r="6.5" stroke="#DC2626" strokeWidth="2.5" />
                  <path d="M15.5 15.5L21 21" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>

              {/* Sort — native select; closed box shows "Sort by"; red caret on the right */}
              <div className="relative z-20 self-start lg:self-auto shrink-0">
                <label htmlFor="shop-sort" className="sr-only">{t('shop_sort_label')}</label>
                <select
                  id="shop-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="relative z-10 w-[150px] max-w-full appearance-none cursor-pointer rounded-lg border border-white/15 bg-[#0A0A0A] pl-3 pr-10 py-3 min-h-[44px] font-inter text-base sm:text-sm text-white focus:border-crimson-accent focus:outline-none"
                >
                  <option value="">{t('shop_sort_label')}</option>
                  <option value="price_asc">{t('shop_sort_price_asc')}</option>
                  <option value="price_desc">{t('shop_sort_price_desc')}</option>
                  <option value="hash_asc">{t('shop_sort_hash_asc')}</option>
                  <option value="hash_desc">{t('shop_sort_hash_desc')}</option>
                </select>
                <svg
                  width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"
                  className="pointer-events-none absolute right-3 top-1/2 z-30 -translate-y-1/2"
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
              <h3 className="font-inter font-bold text-2xl text-white mb-3">{t('shop_empty_title')}</h3>
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
            ) : filteredProducts.map((product, index) => {
              const unclear = isUnclear(product);
              const miner = isMiner(product);
              const priceNum = toNumber(product.price);
              const showPrice = !unclear && priceNum != null && priceNum > 0;
              // Miner specs only — accessories never show TH/s, W, J/TH.
              const specs = (!unclear && miner) ? [
                // Hashrate from the real field, else parsed from the title (e.g. "95T").
                // Unit comes from the data (TH/s, GH/s, MH/s); defaults to TH/s.
                { value: product.hashrate || hashFromTitle(product.name), unit: product.hashrate_unit || 'TH/s' },
                // Watts / efficiency only from real data — never invented.
                { value: product.power, unit: 'Watts' },
                { value: product.efficiency, unit: product.efficiency_unit || 'J/TH' },
              ].filter((s) => s.value && String(s.value).trim()) : [];
              const condKey = conditionKey(product);
              const coinKey = coinTypeKey(product);
              const displayName = unclear ? t('shop_pending_name') : cleanName(product.name);
              return (
              <motion.div key={product.id}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: index * 0.05 }}
                className="flex flex-col bg-[#141414] rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300"
              >
                <div className="relative w-full h-64 bg-black overflow-hidden">
                  {product.image ? (
                    <img src={product.image} alt={displayName} className="w-full h-full object-contain object-center hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-700">
                      <i className="ri-image-line text-5xl" aria-hidden="true"></i>
                    </div>
                  )}
                  {/* Top corner badges: condition + coin/mining type */}
                  {!unclear && (condKey || coinKey) && (
                    <div className="absolute top-4 left-4 flex flex-col items-start gap-2">
                      {condKey && <span className="px-3 py-1 bg-black/70 border border-white/30 text-white text-xs font-inter font-semibold rounded">{t(condKey)}</span>}
                      {coinKey && <span className="px-3 py-1 bg-crimson-accent text-white text-xs font-inter font-semibold rounded">{t(coinKey)}</span>}
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-white font-inter font-bold text-xl mb-3">{displayName}</h3>

                  {/* Algorithm (miners only) — shown alongside the performance stats below */}
                  {!unclear && miner && product.algorithm && (
                    <div className="mb-3">
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/[0.04] px-2.5 py-1 text-xs font-inter font-semibold text-soft-gray">
                        <i className="ri-cpu-line text-crimson-accent" aria-hidden="true"></i>
                        {product.algorithm}
                      </span>
                    </div>
                  )}

                  {specs.length > 0 && (
                    <div className="flex items-center gap-4 mb-5">
                      {specs.map((s, i) => (
                        <div key={s.unit} className="flex items-center gap-4">
                          {i > 0 && <div className="w-px h-10 bg-white/20"></div>}
                          <div className="text-center">
                            <div className="text-white font-inter font-bold text-xl">{s.value}</div>
                            <div className="text-soft-gray font-inter text-xs">{s.unit}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {showPrice ? (
                    <div className="mb-4">
                      <span className="text-white font-inter font-bold text-3xl">${priceNum.toLocaleString()} CAD</span>
                      {product.sale_price && product.sale_price !== product.price && (
                        <span className="ml-3 text-soft-gray line-through text-lg font-inter">${Number(product.sale_price).toLocaleString()}</span>
                      )}
                    </div>
                  ) : (
                    <p className="text-soft-gray font-inter text-sm leading-6 mb-4">{t('shop_pending_desc')}</p>
                  )}

                  <div className="mt-auto flex gap-3">
                    {showPrice ? (
                      <button className="relative z-10 flex-1 min-h-[44px] py-3 bg-crimson-accent text-white font-inter font-semibold rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors cursor-pointer whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson-accent">
                        {t('shop_add_cart')}
                      </button>
                    ) : (
                      <Link to="/contact#contact-form"
                        className="relative z-10 flex-1 min-h-[44px] flex items-center justify-center gap-2 py-3 bg-crimson-accent text-white font-inter font-semibold rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson-accent"
                      >
                        <i className="ri-customer-service-2-line text-lg" aria-hidden="true"></i>
                        {t('shop_pending_cta')}
                      </Link>
                    )}
                    <Link to={`/product?id=${product.id}`}
                      className="relative z-10 flex-1 min-h-[44px] flex items-center justify-center py-3 bg-transparent border border-white/30 text-white font-inter font-normal rounded-lg hover:bg-white/10 active:bg-white/15 transition-colors cursor-pointer whitespace-nowrap text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
                    >{t('fp_view')}</Link>
                  </div>
                </div>
              </motion.div>
              );
            })}
          </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-[#0A0A0A] border-t border-white/10">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-inter font-bold text-3xl md:text-4xl text-white mb-4">{t('shop_help_title')}</h2>
            <p className="text-soft-gray font-inter text-lg mb-8">{t('shop_help_desc')}</p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
              <a href="tel:+15146047050" className="relative z-10 inline-flex min-h-[44px] items-center justify-center gap-2 px-8 py-4 bg-crimson-accent text-white font-inter font-semibold rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors cursor-pointer whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson-accent">
                <i className="ri-phone-fill text-lg" aria-hidden="true"></i>
                {t('shop_help_call')}
              </a>
              <Link to="/contact#contact-form" className="relative z-10 inline-flex min-h-[44px] items-center justify-center px-8 py-4 bg-transparent border border-white/30 text-white font-inter font-semibold rounded-lg hover:bg-white/10 active:bg-white/15 transition-colors cursor-pointer whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40">{t('shop_help_contact')}</Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ShopPage;
