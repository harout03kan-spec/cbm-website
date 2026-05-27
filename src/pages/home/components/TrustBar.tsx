import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const TrustBar = () => {
  const { t } = useTranslation();
  const trustSignals = [
    { icon: 'ri-truck-line',        title: t('tb_shipping') },
    { icon: 'ri-file-list-line',    title: t('tb_tax') },
    { icon: 'ri-map-pin-line',      title: t('tb_inventory') },
    { icon: 'ri-shield-check-line', title: t('tb_warranty') },
  ];
  return (
    <section className="py-12 bg-graphite border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {trustSignals.map((signal, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="text-center">
              <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3"><i className={`${signal.icon} text-3xl text-white`}></i></div>
              <p className="text-white font-inter text-sm">{signal.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default TrustBar;
