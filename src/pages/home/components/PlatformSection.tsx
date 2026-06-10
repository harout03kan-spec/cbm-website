import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// Homepage Services Gateway — the four ways to work with Canada Bitcoin Miners
// (Miner Sales / ASIC Repairs / Bulk Deals / Hosting Support) as clean, premium
// cards. Content flows naturally (no stretched gaps), each card carries an icon,
// a concise description, and a single arrow link to the matching page.
export default function PlatformSection() {
  const { t } = useTranslation();

  const cards = [
    { icon: 'ri-shopping-cart-2-line', title: t('plat_sales_title'), desc: t('plat_sales_desc'), cta: t('plat_sales_cta'), to: '/shop' },
    { icon: 'ri-tools-line', title: t('plat_repair_title'), desc: t('plat_repair_desc'), cta: t('plat_repair_cta'), to: '/services' },
    { icon: 'ri-stack-line', title: t('plat_bulk_title'), desc: t('plat_bulk_desc'), cta: t('plat_bulk_cta'), to: '/bulk-deals' },
    { icon: 'ri-server-line', title: t('plat_host_title'), desc: t('plat_host_desc'), cta: t('plat_host_cta'), to: '/hosting' },
  ];

  return (
    <section className="relative overflow-hidden border-y border-white/[0.06] bg-[#050506] py-20 sm:py-24">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(220,38,38,0.08), transparent 60%)' }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-inter text-xs font-semibold uppercase tracking-[0.22em] text-crimson-accent">{t('plat_tag')}</p>
          <h2 className="mt-3 text-balance font-inter text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{t('plat_title')}</h2>
          <p className="mt-4 font-inter text-base leading-7 text-soft-gray">{t('plat_sub')}</p>
        </div>

        {/* Gateway cards */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, i) => (
            <motion.div
              key={card.to}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
            >
              <Link
                to={card.to}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[linear-gradient(165deg,rgba(23,23,24,0.9),rgba(9,9,10,0.96))] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.32)] transition-all duration-200 hover:-translate-y-1.5 hover:border-crimson-accent/40 hover:shadow-[0_26px_56px_rgba(0,0,0,0.5)]"
              >
                <span
                  className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full opacity-60 transition-opacity duration-200 group-hover:opacity-100"
                  style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.16) 0%, rgba(220,38,38,0.03) 48%, transparent 72%)' }}
                  aria-hidden="true"
                />
                <span className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-crimson-accent/30 bg-crimson-accent/10 text-crimson-accent">
                  <i className={`${card.icon} text-2xl`} aria-hidden="true" />
                </span>
                <h3 className="relative mt-5 font-inter text-xl font-bold text-white">{card.title}</h3>
                <p className="relative mt-2.5 font-inter text-sm leading-6 text-soft-gray">{card.desc}</p>
                <span className="relative mt-5 inline-flex items-center gap-1.5 font-inter text-sm font-semibold text-white transition-colors group-hover:text-crimson-accent">
                  {card.cta}
                  <i className="ri-arrow-right-line text-base transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
