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
    <section className="relative bg-[#050505] py-12">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-crimson-accent/30 to-transparent" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, ease: 'easeOut' }}
              className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 transition-all duration-200 hover:border-crimson-accent/30 hover:bg-white/[0.04]"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-crimson-accent/20 bg-crimson-accent/10 transition-colors duration-200 group-hover:bg-crimson-accent/15">
                <i className={`${stat.icon} text-2xl text-crimson-accent`} aria-hidden="true"></i>
              </div>
              <div className="min-w-0">
                <div className="font-orbitron text-2xl font-bold leading-tight text-white">{stat.value}</div>
                <div className="mt-0.5 font-inter text-xs leading-snug text-soft-gray">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default HeroTrustBar;
