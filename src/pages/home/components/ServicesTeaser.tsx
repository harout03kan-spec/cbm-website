import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ServicesTeaser = () => {
  const { t } = useTranslation();
  const points = [t('st_p1'), t('st_p2'), t('st_p3'), t('st_p4')];
  const process = [t('st_proc1'), t('st_proc2'), t('st_proc3'), t('st_proc4')];

  return (
    <section className="bg-[#0b0b0c] py-[90px] px-5" id="repair-section">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[50px] items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="w-full">
          <div className="relative overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#111111] shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
            <img src="/repair-lab.jpg" alt="Canada BTC Miners ASIC repair facility — Montreal" className="w-full block object-cover object-center min-h-[520px]" style={{ filter: 'contrast(1.08) brightness(0.85) saturate(1.05)' }} />
            <div className="absolute inset-0 pointer-events-none rounded-[20px]" style={{ background: 'rgba(0,0,0,0.26)' }} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}>
          <span className="inline-block text-[12px] font-bold tracking-[2px] text-crimson-accent uppercase mb-4">{t('st_tag')}</span>
          <h2 className="text-white font-orbitron font-extrabold text-[38px] lg:text-[42px] leading-[1.1] mb-[18px]">{t('st_title')}</h2>
          <p className="text-[#cbd5e1] font-inter text-[17px] leading-[1.75] mb-3">{t('st_desc')}</p>
          <p className="text-[#94a3b8] font-inter text-[15px] leading-[1.7] mb-3">{t('st_models')}</p>
          <p className="text-[#94a3b8] font-inter text-[15px] leading-[1.7] mb-6">{t('st_scope')}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {points.map((point) => (
              <div key={point} className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.07] rounded-[14px] px-4 py-3">
                <span className="w-2 h-2 rounded-full bg-crimson-accent flex-shrink-0"></span>
                <span className="text-[#e2e8f0] font-inter text-[14px]">{point}</span>
              </div>
            ))}
          </div>

          <p className="text-[#94a3b8] font-inter text-[14px] mb-6">{t('st_pricing')}</p>

          <div className="mb-8">
            <div className="flex flex-col gap-2">
              {process.map((step, i) => (
                <div key={i} className="flex items-center gap-3 text-[#cbd5e1] font-inter text-[14px]">
                  <span className="w-6 h-6 rounded-full bg-crimson-accent/20 border border-crimson-accent/40 flex items-center justify-center text-crimson-accent font-bold text-[12px] flex-shrink-0">{i + 1}</span>
                  {step}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link to="/services" className="inline-flex items-center justify-center min-h-[52px] px-8 rounded-[13px] bg-crimson-accent text-white font-inter font-bold text-[15px] hover:bg-red-700 transition-colors">{t('st_cta1')}</Link>
            <Link to="/services" className="inline-flex items-center justify-center min-h-[52px] px-8 rounded-[13px] bg-transparent border border-white/[0.18] text-white font-inter font-bold text-[15px] hover:bg-white/[0.06] transition-colors">{t('st_cta2')}</Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
export default ServicesTeaser;
