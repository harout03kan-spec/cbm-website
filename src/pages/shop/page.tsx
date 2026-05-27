import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useTranslation } from 'react-i18next';

const ShopPage = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const { products, loading } = useProducts();

  const categories = [
    { id: 'all',        label: 'All ASIC Miners' },
    { id: 'antminer',   label: 'Bitmain Antminer' },
    { id: 'whatsminer', label: 'Whatsminer' },
    { id: 'scrypt',     label: 'Litecoin / Dogecoin' },
    { id: 'hydro',      label: 'Hydro Cooled' },
    { id: 'home',       label: 'Home Mining' },
  ];

  const filteredProducts = (() => {
    if (activeCategory === 'all')        return products;
    if (activeCategory === 'antminer')   return products.filter(p => p.name.toLowerCase().includes('antminer'));
    if (activeCategory === 'whatsminer') return products.filter(p => p.name.toLowerCase().includes('whatsminer'));
    if (activeCategory === 'scrypt')     return products.filter(p => p.algorithm?.toLowerCase() === 'scrypt');
    if (activeCategory === 'hydro')      return products.filter(p => p.cooling === 'Hydro');
    if (activeCategory === 'home')       return products.filter(p => parseInt(p.power) < 3000);
    return products;
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

      <section className="py-6 bg-[#141414] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map((category) => (
              <button key={category.id} onClick={() => setActiveCategory(category.id)}
                className={`px-5 py-2.5 rounded-lg font-inter text-sm transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === category.id
                    ? 'bg-crimson-accent text-white font-semibold'
                    : 'bg-transparent text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >{category.label}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8 text-soft-gray font-inter text-sm">
            {loading ? (
              <span className="animate-pulse">Loading miners...</span>
            ) : (
              <>Showing <span className="text-white font-semibold">{filteredProducts.length}</span> miners</>
            )}
          </div>

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
                    <button className="flex-1 py-3 bg-crimson-accent text-white font-inter font-semibold rounded-lg hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap"
                      disabled={product.stock_status === 'outofstock'}
                    >
                      {product.stock_status === 'outofstock' ? t('shop_out_stock') : t('shop_add_cart')}
                    </button>
                    <Link to={`/product?id=${product.id}`}
                      className="flex-1 py-3 bg-transparent border border-white/30 text-white font-inter font-normal rounded-lg hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap text-center"
                    >{t('fp_view')}</Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
              <Link to="/about" className="px-8 py-4 bg-crimson-accent text-white font-inter font-semibold rounded-lg hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap">Contact Our Team</Link>
              <Link to="/#calculator" className="px-8 py-4 border border-white/30 text-white font-inter font-semibold rounded-lg hover:bg-white/10 transition-all cursor-pointer whitespace-nowrap">Calculate ROI</Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ShopPage;
