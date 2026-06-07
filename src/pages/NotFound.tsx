
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/feature/Navbar';
import Footer from '../components/feature/Footer';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-midnight flex flex-col">
      <Navbar />
      
      <section className="flex-1 flex items-center justify-center px-6 py-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 0.05, scale: 1 }} transition={{ duration: 0.8 }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="font-orbitron font-black text-[20rem] text-white select-none">404</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="relative z-10">
            <div className="w-32 h-32 bg-graphite border border-crimson-accent/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <i className="ri-error-warning-line text-crimson-accent text-7xl"></i>
            </div>

            <h1 className="font-orbitron font-bold text-6xl text-white mb-4">{t('nf_title')}</h1>
            <p className="text-soft-gray font-inter text-xl mb-8 max-w-2xl mx-auto">{t('nf_desc')}</p>

            <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/" className="inline-flex min-h-[44px] items-center justify-center px-8 py-4 bg-gradient-crimson text-white font-inter font-bold text-lg rounded-xl hover:scale-105 active:scale-95 transition-transform cursor-pointer whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson-accent"><i className="ri-home-4-line mr-2"></i>{t('nf_back_home')}</Link>
              <Link to="/shop" className="inline-flex min-h-[44px] items-center justify-center px-8 py-4 border-2 border-crimson-accent text-crimson-accent font-inter font-bold text-lg rounded-xl hover:bg-crimson-accent hover:text-white active:bg-red-800 active:text-white transition-all cursor-pointer whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson-accent"><i className="ri-shopping-bag-3-line mr-2"></i>{t('nf_browse_shop')}</Link>
            </div>

            <div className="bg-graphite border border-crimson-accent/20 rounded-2xl p-8 max-w-2xl mx-auto">
              <h2 className="font-orbitron font-bold text-2xl text-white mb-6">{t('nf_popular')}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { to: '/shop', icon: 'ri-shopping-cart-line', labelKey: 'nav_shop' },
                  { to: '/services', icon: 'ri-tools-line', labelKey: 'nav_services' },
                  { to: '/hosting', icon: 'ri-server-line', labelKey: 'nav_hosting' },
                  { to: '/about', icon: 'ri-information-line', labelKey: 'nav_about' }
                ].map((item) => (
                  <Link key={item.to} to={item.to} className="flex flex-col items-center gap-3 p-4 bg-midnight rounded-xl hover:bg-midnight/50 transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-crimson-accent/20 rounded-full flex items-center justify-center">
                      <i className={`${item.icon} text-crimson-accent text-2xl`}></i>
                    </div>
                    <span className="text-white font-inter text-sm">{t(item.labelKey)}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-12">
              <p className="text-soft-gray font-inter text-sm mb-4">{t('nf_help')}</p>
              <div className="flex flex-wrap justify-center gap-6">
                <a href="tel:+15146047050" className="flex items-center gap-2 text-crimson-accent font-inter hover:underline cursor-pointer whitespace-nowrap"><i className="ri-phone-line"></i><span>{t('nf_call')}</span></a>
                <a href="mailto:info@canadabtcminers.ca" className="flex items-center gap-2 text-crimson-accent font-inter hover:underline cursor-pointer whitespace-nowrap"><i className="ri-mail-line"></i><span>info@canadabtcminers.ca</span></a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
