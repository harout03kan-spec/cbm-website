import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const HostingTeaser = () => {
  const { t } = useTranslation();
  const points = [t('ht_p1'), t('ht_p2'), t('ht_p3')];

  return (
    <section className="bg-[#050505] py-[80px] px-5">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[50px] items-center">
        {/* Left — image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#111] shadow-[0_20px_50px_rgba(0,0,0,0.35)] min-h-[420px]">
            <img
              src="/hosting-facility.jpg"
              alt="Hosting facility"
              className="w-full h-full object-cover object-center absolute inset-0"
              style={{ filter: 'brightness(0.82) contrast(1.04)' }}
            />
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(0,0,0,0.22)' }} />
          </div>
        </motion.div>

        {/* Right — content */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <span className="inline-block text-[12px] font-bold tracking-[2px] text-crimson-accent uppercase mb-4">{t('ht_tag')}</span>
          <h2 className="text-white font-inter font-extrabold text-[36px] lg:text-[40px] leading-[1.1] mb-[18px]">{t('ht_title')}</h2>
          <p className="text-[#cbd5e1] font-inter text-[16px] leading-[1.75] mb-6">{t('ht_desc')}</p>

          <div className="flex flex-col gap-3 mb-8">
            {points.map((p) => (
              <div key={p} className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.07] rounded-[14px] px-4 py-3">
                <span className="w-2 h-2 rounded-full bg-crimson-accent flex-shrink-0"></span>
                <span className="text-[#e2e8f0] font-inter text-[15px]">{p}</span>
              </div>
            ))}
          </div>

          <Link
            to="/hosting"
            className="inline-flex items-center justify-center min-h-[52px] px-8 rounded-[13px] bg-crimson-accent text-white font-inter font-bold text-[15px] hover:bg-red-700 transition-colors"
          >
            {t('ht_cta1')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
export default HostingTeaser;
