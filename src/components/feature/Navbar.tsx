import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../hooks/useCart';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { totalQuantity } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const toggleLang = () => i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en');

  const navLinks = [
    { to: '/',         label: t('nav_home') },
    { to: '/shop',     label: t('nav_shop') },
    { to: '/services', label: t('nav_services') },
    { to: '/hosting',  label: t('nav_hosting') },
    { to: '/about',    label: t('nav_about') },
    { to: '/contact',  label: t('nav_contact') },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-midnight/95 backdrop-blur-xl shadow-lg shadow-crimson-accent/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex flex-col cursor-pointer group">
            <div className="text-xl font-orbitron font-bold text-white tracking-wider leading-tight group-hover:text-crimson-accent transition-colors">Canada BTC Miners</div>
            <p className="text-[10px] sm:text-xs text-crimson-accent font-inter tracking-wide">ASIC Sales · Repairs · Hosting</p>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className={`font-inter font-medium transition-colors whitespace-nowrap ${location.pathname === link.to ? 'text-crimson-accent' : 'text-white hover:text-crimson-accent'}`}>
                {link.label}
              </Link>
            ))}
            <Link to="/cart" className="relative w-10 h-10 flex items-center justify-center text-white hover:text-crimson-accent transition-colors">
              <i className="ri-shopping-cart-line text-2xl"></i>
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-crimson-accent text-white text-xs font-bold rounded-full">{totalQuantity > 99 ? '99+' : totalQuantity}</span>
              )}
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:+15146047050"
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-zinc-300 hover:text-white transition-colors whitespace-nowrap"
              aria-label="Call +1 514 604 7050"
            >
              <i className="ri-phone-fill text-base text-crimson-accent"></i>
              +1 (514) 604-7050
            </a>
            <button onClick={toggleLang} className="px-3 py-1.5 text-xs font-bold font-inter tracking-widest border border-white/20 text-white rounded-lg hover:border-crimson-accent hover:text-crimson-accent transition-colors">
              {t('nav_lang')}
            </button>
            <Link to="/shop" className="hidden sm:block px-6 py-2.5 bg-gradient-crimson text-white font-inter font-semibold rounded-lg hover:scale-105 transition-transform whitespace-nowrap">
              {t('nav_shopMiners')}
            </Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden w-10 h-10 flex items-center justify-center text-white hover:text-crimson-accent transition-colors">
              <i className={`${mobileOpen ? 'ri-close-line' : 'ri-menu-line'} text-2xl`}></i>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden relative z-50 -mx-6 mt-4 flex flex-col gap-4 border-t border-white/10 bg-black/90 px-6 pb-5 pt-4 backdrop-blur-xl shadow-xl shadow-crimson-accent/10">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className={`font-inter font-medium text-base transition-colors ${location.pathname === link.to ? 'text-crimson-accent' : 'text-white hover:text-crimson-accent'}`}>
                {link.label}
              </Link>
            ))}
            <a href="tel:+15146047050" className="flex items-center gap-2 text-white font-medium text-base" aria-label="Call +1 514 604 7050">
              <i className="ri-phone-fill text-lg text-crimson-accent"></i>
              +1 (514) 604-7050
            </a>
            <Link to="/shop" className="mt-2 px-6 py-3 bg-gradient-crimson text-white font-inter font-semibold rounded-lg text-center">{t('nav_shopMiners')}</Link>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};
export default Navbar;