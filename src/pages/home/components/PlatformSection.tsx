import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// Homepage "platform layers" — the four parts of the Canada BTC Miners business
// (Sales / Repair / Bulk / Hosting) shown as one infrastructure-style module.
// Restrained reveal motion; dark premium, single red accent per card.
export default function PlatformSection() {
  const { t } = useTranslation();

  const layers = [
    { icon: 'ri-shopping-cart-2-line', title: t('plat_sales_title'), desc: t('plat_sales_desc'), cta: t('plat_sales_cta'), to: '/shop' },
    { icon: 'ri-tools-line', title: t('plat_repair_title'), desc: t('plat_repair_desc'), cta: t('plat_repair_cta'), to: '/services' },
    { icon: 'ri-stack-line', title: t('plat_bulk_title'), desc: t('plat_bulk_desc'), cta: t('plat_bulk_cta'), to: '/bulk-deals' },
    { icon: 'ri-server-line', title: t('plat_host_title'), desc: t('plat_host_desc'), cta: t('plat_host_cta'), to: '/hosting' },
  ];

  return (
    <section className="border-y border-white/[0.06] bg-[#050506] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <p className="font-inter text-xs font-semibold uppercase tracking-[0.22em] text-crimson-accent">{t('plat_tag')}</p>
          <h2 className="mt-3 font-inter text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">{t('plat_title')}</h2>
          <p className="mt-5 font-inter text-base leading-7 text-soft-gray sm:text-lg">{t('plat_sub')}</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
          {layers.map((layer, i) => (
            <motion.div
              key={layer.to}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[linear-gradient(160deg,rgba(20,20,20,0.9),rgba(8,8,9,0.95))] p-7 transition-colors duration-200 hover:border-crimson-accent/40 sm:p-8"
            >
              <span className="absolute right-6 top-7 font-inter text-sm font-bold text-white/10">{String(i + 1).padStart(2, '0')}</span>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-crimson-accent/30 bg-crimson-accent/10 text-crimson-accent">
                <i className={`${layer.icon} text-2xl`} aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-inter text-xl font-bold text-white sm:text-2xl">{layer.title}</h3>
              <p className="mt-3 font-inter text-sm leading-6 text-soft-gray sm:text-[15px]">{layer.desc}</p>
              <Link
                to={layer.to}
                className="relative z-10 mt-6 inline-flex items-center gap-1.5 font-inter text-sm font-semibold text-white transition-colors hover:text-crimson-accent"
              >
                {layer.cta}
                <i className="ri-arrow-right-line text-base transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
