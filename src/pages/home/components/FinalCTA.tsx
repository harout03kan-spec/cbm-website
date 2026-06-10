import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const FinalCTA = () => {
  const { t } = useTranslation();
  return (
    <section className="relative py-28 bg-[#050505] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(220,38,38,0.10) 0%, transparent 70%)' }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-crimson-accent/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <span className="inline-block text-[12px] font-bold tracking-[2px] text-crimson-accent uppercase mb-5 font-inter">{t('cta_tag')}</span>
          <h2 className="text-balance font-inter font-black text-4xl sm:text-5xl md:text-6xl text-white leading-[1.08] mb-6">
            {t('cta_title1')} <span className="text-crimson-accent">{t('cta_title2')}</span>
          </h2>
          <p className="text-[#94a3b8] font-inter text-xl max-w-2xl mx-auto mb-12 leading-relaxed">{t('cta_sub')}</p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
            <Link to="/shop" className="inline-flex items-center justify-center min-h-[58px] px-10 rounded-xl font-bold text-white text-lg bg-crimson-accent border border-crimson-accent hover:bg-red-700 hover:border-red-700 transition-colors font-inter whitespace-nowrap">{t('cta_btn1')}</Link>
            <Link to="/contact#contact-form" className="inline-flex items-center justify-center min-h-[58px] px-10 rounded-xl font-bold text-white text-lg bg-transparent border border-white/20 hover:bg-white/[0.06] transition-colors font-inter whitespace-nowrap">{t('cta_btn2')}</Link>
            <Link to="/bulk-deals" className="inline-flex items-center justify-center min-h-[58px] px-10 rounded-xl font-bold text-white text-lg bg-transparent border border-white/20 hover:bg-white/[0.06] transition-colors font-inter whitespace-nowrap">{t('cta_btn3')}</Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
export default FinalCTA;
