import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProducts } from '../../../hooks/useProducts';
import { useCart } from '../../../hooks/useCart';

type FilterKey = 'Air Cooled' | 'Hydro' | 'Home Miners' | 'Deals';

export default function FeaturedProducts() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('Air Cooled');
  const { products, loading } = useProducts();
  const { addItem } = useCart();
  const [addedId, setAddedId] = useState<number | null>(null);

  const handleAddToCart = (id: number) => {
    addItem(id, 1);
    setAddedId(id);
    setTimeout(() => setAddedId(current => (current === id ? null : current)), 1500);
  };

  const filters: { key: FilterKey; label: string }[] = [
    { key: 'Air Cooled',  label: t('fp_filter_air') },
    { key: 'Hydro',       label: t('fp_filter_hydro') },
    { key: 'Home Miners', label: t('fp_filter_home') },
    { key: 'Deals',       label: t('fp_filter_deals') },
  ];

  const visible = (() => {
    if (activeFilter === 'Air Cooled')  return products.filter(p => p.cooling === 'Air');
    if (activeFilter === 'Hydro')       return products.filter(p => p.cooling === 'Hydro');
    if (activeFilter === 'Home Miners') return products.filter(p => Number(p.power) <= 2900 && p.cooling === 'Air');
    if (activeFilter === 'Deals')       return products.filter(p => p.condition === 'Refurbished' || p.condition === 'Used');
    return products;
  })();

  return (
    <section data-section="products" id="products" className="py-20 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-inter font-bold text-5xl md:text-6xl text-white mb-4">{t('fp_title')}</h2>
          <p className="text-soft-gray font-inter text-xl max-w-3xl mx-auto">{t('fp_sub')}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-12 max-w-2xl mx-auto">
          {filters.map(({ key, label }) => {
            const isActive = activeFilter === key;
            const isDeal = key === 'Deals';
            return (
              <button key={key} onClick={() => setActiveFilter(key)}
                className={`w-full px-4 py-3 text-center font-inter font-semibold rounded-lg transition-colors cursor-pointer border-2 ${
                  isActive
                    ? isDeal ? 'bg-crimson-accent/20 border-crimson-accent text-crimson-accent' : 'bg-white/15 border-white text-white'
                    : isDeal ? 'bg-transparent border-crimson-accent text-crimson-accent hover:bg-crimson-accent/10' : 'bg-transparent border-white/30 text-white hover:bg-white/10'
                }`}>{label}</button>
            );
          })}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[34px] mb-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#111111] border border-white/[0.08] rounded-[18px] overflow-hidden animate-pulse">
                <div className="h-[280px] bg-white/5" />
                <div className="p-[26px] space-y-4">
                  <div className="h-7 bg-white/5 rounded w-3/4" />
                  <div className="h-5 bg-white/5 rounded w-1/2" />
                  <div className="h-14 bg-white/5 rounded w-1/3" />
                  <div className="h-12 bg-white/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-16 text-soft-gray font-inter text-lg">{t('fp_no_results')}</div>
        ) : (
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[34px] mb-12">
            {visible.slice(0, 6).map((product, index) => (
              <motion.div key={product.id}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                className="bg-[#111111] border border-white/[0.08] rounded-[18px] overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.28)] transition-all duration-200 hover:-translate-y-1 hover:border-crimson-accent hover:shadow-[0_20px_40px_rgba(0,0,0,0.35)] flex flex-col"
              >
                <div className="relative bg-[#0b0b0b] border-b border-white/[0.06] min-h-[280px] flex items-center justify-center p-5">
                  <img src={product.image} alt={product.name} className="max-w-full max-h-[240px] object-contain" />
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-[13px] font-bold text-white ${product.cooling === 'Hydro' ? 'bg-[#2563eb]' : 'bg-[#374151]'}`}>{product.cooling}</span>
                    {product.condition === 'New'         && <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-[13px] font-bold bg-[#22c55e] text-[#08110a]">New</span>}
                    {product.condition === 'Refurbished' && <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-[13px] font-bold bg-[#f59e0b] text-[#1a0e00]">Refurb</span>}
                    {product.condition === 'Used'        && <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-[13px] font-bold bg-[#374151] text-gray-300">Used</span>}
                    {product.badge && <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-[13px] font-bold bg-crimson-accent text-white">{product.badge}</span>}
                  </div>
                </div>
                <div className="p-[26px] flex flex-col flex-1">
                  <h3 className="text-white font-inter font-extrabold text-[27px] mb-[10px] leading-tight">{product.name}</h3>
                  <p className="text-[#b8c0cc] font-inter text-[15px] mb-[18px]">
                    {[
                      product.hashrate && `${product.hashrate} ${product.hashrate_unit || 'TH/s'}`,
                      product.power && `${product.power} W`,
                      product.efficiency && `${product.efficiency} ${product.efficiency_unit || 'J/TH'}`,
                    ].filter(Boolean).join('  •  ')}
                  </p>
                  <div className="flex items-end gap-[10px] mb-[18px]">
                    <span className="text-white font-inter font-black text-[58px] leading-none">${Number(product.price).toLocaleString()}</span>
                    <span className="text-[#94a3b8] font-inter font-bold text-[18px] mb-2">CAD</span>
                  </div>
                  <div className="flex flex-col gap-[7px] mb-[22px]">
                    {product.condition === 'New' && (
                      <div className="text-[#e5e7eb] font-inter text-[14px]">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500 mr-2 mb-0.5 shrink-0"></span>
                        {t('fp_shipping')}
                      </div>
                    )}
                    <div className="text-[#e5e7eb] font-inter text-[14px]">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500 mr-2 mb-0.5 shrink-0"></span>
                      {t('fp_tested')}
                    </div>
                    <div className="text-[#94a3b8] font-inter text-[13px]">
                      <span className="text-crimson-accent font-black mr-[6px]">✖</span> {t('fp_no_cables')}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4 mt-auto">
                    <button onClick={() => handleAddToCart(product.id)} className="min-h-[54px] rounded-xl text-[16px] font-extrabold text-white bg-crimson-accent border border-crimson-accent hover:bg-red-700 transition-colors cursor-pointer">{addedId === product.id ? t('fp_added') : t('fp_add_cart')}</button>
                    <Link to={`/product?id=${product.id}`} className="min-h-[54px] rounded-xl text-[16px] font-extrabold text-white bg-transparent border border-white/[0.22] hover:bg-white/[0.06] transition-colors flex items-center justify-center">{t('fp_view')}</Link>
                  </div>
                  <p className="text-[#9aa3af] font-inter text-[13px] text-center m-0">{t('fp_bulk')}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link to="/shop" className="inline-block px-12 py-4 bg-transparent border-2 border-white text-white font-inter font-semibold text-lg rounded-lg hover:bg-white/10 transition-colors whitespace-nowrap">{t('fp_view_all')}</Link>
        </div>
      </div>
    </section>
  );
}
