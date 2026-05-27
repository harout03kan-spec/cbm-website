import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const FAQSection = () => {
  const { t } = useTranslation();
  const [openItem, setOpenItem] = useState<number | null>(null);

  const faqs = [
    { id: 1, q: t('faq_q1'), a: t('faq_a1') },
    { id: 2, q: t('faq_q2'), a: t('faq_a2') },
    { id: 3, q: t('faq_q3'), a: t('faq_a3') },
    { id: 4, q: t('faq_q4'), a: t('faq_a4') },
    { id: 5, q: t('faq_q5'), a: t('faq_a5') },
    { id: 6, q: t('faq_q6'), a: t('faq_a6') },
    { id: 7, q: t('faq_q7'), a: t('faq_a7') },
    { id: 8, q: t('faq_q8'), a: t('faq_a8') },
  ];

  return (
    <section className="py-24 bg-near-black relative overflow-hidden">
      <div className="relative max-w-4xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="font-orbitron font-bold text-4xl text-white mb-4">{t('faq_title')}</h2>
          <p className="text-soft-gray font-inter text-base max-w-2xl mx-auto">{t('faq_sub')}</p>
        </motion.div>
        <div className="space-y-3">
          {faqs.map((item) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-graphite rounded-lg overflow-hidden">
              <button onClick={() => setOpenItem(openItem === item.id ? null : item.id)} className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer hover:bg-graphite/80 transition-colors">
                <span className="text-white font-inter font-medium text-base pr-4">{item.q}</span>
                <div className={`w-6 h-6 flex items-center justify-center flex-shrink-0 transition-transform ${openItem === item.id ? 'rotate-180' : ''}`}>
                  <i className="ri-arrow-down-s-line text-xl text-white"></i>
                </div>
              </button>
              <AnimatePresence>
                {openItem === item.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                    <div className="px-6 pb-5 text-soft-gray font-inter text-base leading-relaxed">{item.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-12 text-muted-gray text-sm">
          {t('faq_footer')}
        </motion.p>
      </div>
    </section>
  );
};
export default FAQSection;
