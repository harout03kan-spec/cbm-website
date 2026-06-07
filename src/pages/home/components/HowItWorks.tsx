import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const HowItWorks = () => {
  const { t } = useTranslation();
  const steps = [
    { number: '01', icon: 'ri-search-line',         title: t('how_s1_title'), description: t('how_s1_desc') },
    { number: '02', icon: 'ri-file-list-3-line',    title: t('how_s2_title'), description: t('how_s2_desc') },
    { number: '03', icon: 'ri-secure-payment-line', title: t('how_s3_title'), description: t('how_s3_desc') },
    { number: '04', icon: 'ri-truck-line',           title: t('how_s4_title'), description: t('how_s4_desc') },
  ];
  return (
    <section className="py-24 bg-midnight">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <div className="text-crimson-accent font-inter text-sm font-bold tracking-widest mb-3">{t('how_tag')}</div>
          <h2 className="font-inter font-bold text-4xl md:text-5xl text-white mb-4">{t('how_title')}</h2>
          <p className="text-soft-gray font-inter text-lg max-w-2xl mx-auto">{t('how_sub')}</p>
        </motion.div>
        <div className="relative">
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-crimson-accent/40 to-transparent z-0" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div key={step.number} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.15 }} className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 flex items-center justify-center bg-graphite border border-crimson-accent/30 rounded-full shadow-lg shadow-crimson-accent/10">
                    <i className={`${step.icon} text-3xl text-crimson-accent`}></i>
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 flex items-center justify-center bg-crimson-accent text-white text-xs font-inter font-bold rounded-full">{step.number}</span>
                </div>
                <h3 className="text-white font-inter font-bold text-lg mb-3">{step.title}</h3>
                <p className="text-soft-gray font-inter text-sm leading-relaxed max-w-xs">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default HowItWorks;
