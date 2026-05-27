import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HeroSection = () => {
  const { t } = useTranslation();
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      <div className="absolute inset-0">
        <img src="https://readdy.ai/api/search-image?query=Abstract%20dark%20industrial%20technology%20background%20with%20subtle%20geometric%20patterns%20and%20circuit%20board%20elements%20in%20deep%20black%20and%20dark%20gray%20tones%20creating%20sophisticated%20minimalist%20atmosphere%20for%20premium%20bitcoin%20mining%20hardware%20showcase&width=1920&height=1080&seq=hero-bg-mining&orientation=landscape" alt="Background" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="font-orbitron font-bold text-white text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">{t('hero_title')}</h1>
            <p className="text-soft-gray font-inter text-xl md:text-2xl mb-12 max-w-xl">{t('hero_sub')}</p>
            <Link to="/shop" className="inline-block px-12 py-5 bg-crimson-accent text-white font-inter font-semibold text-lg rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap">{t('hero_cta')}</Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-lg">
              <div className="absolute -inset-6 bg-crimson-accent/10 blur-3xl rounded-full" />
              <img src="/asic-miner-hero.png" alt="Antminer ASIC Bitcoin Miner — Canada BTC Miners" className="w-full h-auto object-contain drop-shadow-2xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default HeroSection;
