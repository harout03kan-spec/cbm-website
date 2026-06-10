import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// Homepage Sell / Upgrade — a compact acquisition path for people who want to
// sell used miners, upgrade a fleet, or liquidate a site. Kept secondary to
// Shop / Repair / Bulk, with one clear "Request an Offer" CTA into the contact
// form. No purchase guarantee, no fake claims — just a serious sourcing block.
export default function SellUpgradeSection() {
  const { t } = useTranslation();

  const rows = [
    { num: '01', icon: 'ri-archive-2-line', title: t('sell_r1_title'), desc: t('sell_r1_desc') },
    { num: '02', icon: 'ri-stack-line', title: t('sell_r2_title'), desc: t('sell_r2_desc') },
    { num: '03', icon: 'ri-building-line', title: t('sell_r3_title'), desc: t('sell_r3_desc') },
  ];

  return (
    <section className="relative overflow-hidden border-y border-white/[0.06] bg-[#050506] py-20 sm:py-24">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 50% 50% at 80% 30%, rgba(220,38,38,0.08), transparent 60%)' }}
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-[1fr_1fr] lg:gap-16">
        {/* Statement + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-inter text-xs font-semibold uppercase tracking-[0.22em] text-crimson-accent">{t('sell_tag')}</p>
          <h2 className="mt-3 font-inter text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{t('sell_title')}</h2>
          <p className="mt-5 max-w-xl font-inter text-base leading-7 text-soft-gray">{t('sell_desc')}</p>
          <Link
            to="/contact#contact-form"
            className="mt-8 inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-crimson-accent px-8 font-inter text-base font-semibold text-white transition-colors hover:bg-red-700 active:bg-red-800"
          >
            <i className="ri-mail-send-line text-lg" aria-hidden="true" />
            {t('sell_cta1')}
          </Link>
        </motion.div>

        {/* Layered intake rows */}
        <div className="flex flex-col gap-4">
          {rows.map((row, i) => (
            <motion.div
              key={row.num}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="group flex items-start gap-4 rounded-2xl border border-white/[0.08] bg-[linear-gradient(160deg,rgba(21,21,22,0.9),rgba(9,9,10,0.95))] p-5 shadow-[0_14px_36px_rgba(0,0,0,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:border-crimson-accent/40 sm:p-6"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-crimson-accent/30 bg-crimson-accent/10 text-crimson-accent">
                <i className={`${row.icon} text-xl`} aria-hidden="true" />
              </span>
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-inter text-xs font-bold text-white/20">{row.num}</span>
                  <h3 className="font-inter text-lg font-bold text-white">{row.title}</h3>
                </div>
                <p className="mt-1.5 font-inter text-sm leading-6 text-soft-gray">{row.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
