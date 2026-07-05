import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEcwidCart } from '../../hooks/useEcwidCart';
import type { Product } from '../../lib/api';

// Shared product card — the same layout/badges/specs the shop grid uses, so the
// homepage featured grid matches the shop exactly. Add to Cart adds the product
// at its default/highest-variant price (top-level fields = highest variant);
// View Details opens the product page (with its variant selector).

const toNumber = (v: unknown): number | null => {
  if (v === null || v === undefined) return null;
  const n = parseFloat(String(v).replace(/[^0-9.]/g, ''));
  return Number.isNaN(n) ? null : n;
};
const lc = (s?: string) => (s || '').toLowerCase();
const ptext = (p: Product) =>
  `${lc(p.name)} ${lc((p.categories || []).join(' '))} ${lc(p.short_description)} ${lc(p.algorithm)}`;
const hasHashrate = (p: Product) => (toNumber(p.hashrate) ?? 0) > 0;
const isUnclear = (p: Product) => {
  const n = lc(p.name).trim();
  return !n || n === 'product' || n === 'products' || /^product(\b|$)/.test(n) || n.length < 2;
};
const ACCESSORY_RE = /power supply|psu|control board|hashboard|hash board|\bfans?\b|\bcables?\b|\bparts?\b|immersion|accessor|adapter|controller|connector|bracket|\bcord\b|cooling kit|repair kit|\btool/;
const isAccessory = (p: Product) => ACCESSORY_RE.test(ptext(p)) && !hasHashrate(p);
const isMiner = (p: Product) =>
  !isAccessory(p) && (hasHashrate(p) || /miner|antminer|whatsminer|avalon|\b[sml]\d{1,2}\b|\bks\d|\bz15\b/.test(lc(p.name)));
const ALTCOIN_RE = /scrypt|kheavyhash|heavyhash|kaspa|blake3|blake2|eaglesong|equihash|x11|handshake|blake256|cuckoo|aleo|\bdash\b|\bdoge\b|litecoin|\bltc\b|\bkas\b|\bzec\b|\bhns\b|\bl[379]\b|\bks\d|\bz15\b|dg1|volcminer|\bae\d\b/;
const BITCOIN_RE = /sha-?256|bitcoin|\bbtc\b/;
const isHydro = (p: Product) => lc(p.cooling) === 'hydro' || /hydro|\bhyd\b/.test(ptext(p));

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
const conditionKey = (p: Product): string | null => {
  const c = lc(p.condition);
  if (!c) return null;
  if (/new/.test(c)) return 'shop_cond_new';
  if (/refurb/.test(c)) return 'shop_cond_refurb';
  if (/used/.test(c)) return 'shop_cond_used';
  return null;
};
const hashFromTitle = (name: string): string | null => {
  const m = (name || '').match(/(\d+(?:\.\d+)?)\s*T(?:h|H)?\b/);
  return m ? m[1] : null;
};
const cleanName = (name: string): string => {
  const cleaned = name
    .replace(/\b(brand new|refurbished|refurb|used|new)\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/^[\s\-–|]+|[\s\-–|]+$/g, '')
    .trim();
  return cleaned || name;
};

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { t } = useTranslation();
  const { addProduct, openCart } = useEcwidCart();
  const [adding, setAdding] = useState(false);
  const [failed, setFailed] = useState(false);

  const unclear = isUnclear(product);
  const miner = isMiner(product);
  const priceNum = toNumber(product.price);
  const showPrice = !unclear && priceNum != null && priceNum > 0;
  const specs = (!unclear && miner) ? [
    { value: product.hashrate || hashFromTitle(product.name), unit: product.hashrate_unit || 'TH/s' },
    { value: product.power, unit: 'Watts' },
    { value: product.efficiency, unit: product.efficiency_unit || 'J/TH' },
  ].filter((s) => s.value && String(s.value).trim()) : [];
  const condKey = conditionKey(product);
  const coinKey = coinTypeKey(product);
  const displayName = unclear ? t('shop_pending_name') : cleanName(product.name);

  // Add the product to the real Ecwid cart, then open the cart drawer.
  const handleAdd = async () => {
    if (adding) return;
    setFailed(false);
    setAdding(true);
    try {
      await addProduct(product.id, 1);
      openCart();
    } catch {
      setFailed(true);
      setTimeout(() => setFailed(false), 2500);
    } finally {
      setAdding(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: index * 0.05 }}
      className="flex flex-col bg-[#141414] rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300"
    >
      <div className="relative w-full h-40 sm:h-64 bg-black overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={displayName} className="w-full h-full object-contain object-center hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-700">
            <i className="ri-image-line text-5xl" aria-hidden="true"></i>
          </div>
        )}
        {!unclear && (condKey || coinKey) && (
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex flex-col items-start gap-1.5 sm:gap-2">
            {condKey && <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-black/70 border border-white/30 text-white text-[10px] sm:text-xs font-inter font-semibold rounded">{t(condKey)}</span>}
            {coinKey && <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-crimson-accent text-white text-[10px] sm:text-xs font-inter font-semibold rounded">{t(coinKey)}</span>}
          </div>
        )}
      </div>

      <div className="p-3 sm:p-6 flex flex-col flex-1">
        <h3 className="text-white font-inter font-bold text-base sm:text-xl mb-2 sm:mb-3 line-clamp-2">{displayName}</h3>

        {!unclear && miner && product.algorithm && (
          <div className="mb-2 sm:mb-3">
            <span className="inline-flex items-center gap-1 sm:gap-1.5 rounded-md border border-white/15 bg-white/[0.04] px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-inter font-semibold text-soft-gray">
              <i className="ri-cpu-line text-crimson-accent" aria-hidden="true"></i>
              {product.algorithm}
            </span>
          </div>
        )}

        {specs.length > 0 && (
          <div className="flex items-center gap-1.5 sm:gap-4 mb-3 sm:mb-5">
            {specs.map((s, i) => (
              <div key={s.unit} className="flex items-center gap-1.5 sm:gap-4">
                {i > 0 && <div className="w-px h-7 sm:h-10 bg-white/20"></div>}
                <div className="text-center">
                  <div className="text-white font-inter font-bold text-sm sm:text-xl">{s.value}</div>
                  <div className="text-soft-gray font-inter text-[10px] sm:text-xs">{s.unit}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showPrice ? (
          <div className="mb-3 sm:mb-4">
            <span className="text-white font-inter font-bold text-xl sm:text-3xl">${priceNum.toLocaleString()} CAD</span>
            {product.sale_price && product.sale_price !== product.price && (
              <span className="ml-2 sm:ml-3 text-soft-gray line-through text-sm sm:text-lg font-inter">${Number(product.sale_price).toLocaleString()}</span>
            )}
          </div>
        ) : (
          <p className="text-soft-gray font-inter text-sm leading-6 mb-4">{t('shop_pending_desc')}</p>
        )}

        <div className="mt-auto flex flex-col sm:flex-row gap-2 sm:gap-3">
          {showPrice ? (
            <button onClick={handleAdd} disabled={adding} aria-busy={adding}
              className="relative z-10 flex-1 min-h-[44px] py-3 bg-crimson-accent text-white font-inter font-semibold text-sm sm:text-base rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson-accent">
              {adding ? t('shop_adding') : failed ? t('shop_add_retry') : t('shop_add_cart')}
            </button>
          ) : (
            <Link to="/contact#contact-form"
              className="relative z-10 flex-1 min-h-[44px] flex items-center justify-center gap-2 py-3 bg-crimson-accent text-white font-inter font-semibold text-sm sm:text-base rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson-accent"
            >
              <i className="ri-customer-service-2-line text-lg" aria-hidden="true"></i>
              {t('shop_pending_cta')}
            </Link>
          )}
          <Link to={`/product?id=${product.id}`}
            className="relative z-10 flex-1 min-h-[44px] flex items-center justify-center py-3 bg-transparent border border-white/30 text-white font-inter font-normal text-sm sm:text-base rounded-lg hover:bg-white/10 active:bg-white/15 transition-colors cursor-pointer whitespace-nowrap text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
          >{t('fp_view')}</Link>
        </div>
      </div>
    </motion.div>
  );
}
