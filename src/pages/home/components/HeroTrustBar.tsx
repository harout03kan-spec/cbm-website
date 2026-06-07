import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const HeroTrustBar = () => {
  const { t } = useTranslation();
  const stats = [
    { icon: 'ri-tools-fill',           value: t('htb_v1'), label: t('htb_l1') },
    { icon: 'ri-checkbox-circle-fill', value: t('htb_v2'), label: t('htb_l2') },
    { icon: 'ri-time-fill',            value: t('htb_v3'), label: t('htb_l3') },
    { icon: 'ri-map-pin-fill',         value: t('htb_v4'), label: t('htb_l4') },
  ];
  return (
    <section className="py-10 bg-graphite border-y border-crimson-accent/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="flex items-center gap-4">
              <div className="w-11 h-11 flex items-center justify-center bg-crimson-accent/10 rounded-lg flex-shrink-0">
                <i className={`${stat.icon} text-xl text-crimson-accent`}></i>
              </div>
              <div>
                <div className="text-white font-inter font-bold text-xl leading-tight">{stat.value}</div>
                <div className="text-soft-gray font-inter text-xs">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default HeroTrustBar;
