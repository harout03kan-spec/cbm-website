import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// Homepage "platform layers" — the four parts of the Canada Bitcoin Miners
// business (Sales / Repair / Bulk / Hosting) presented as connected
// infrastructure layers rather than four plain boxes: a large statement on the
// left, and a vertical stack of dimensional panels threaded by a single red
// connection line on the right. Motion is restrained (scroll reveal + hover
// depth), CSS-only depth — no heavy animation.
export default function PlatformSection() {
  const { t } = useTranslation();

  const layers = [
    { icon: 'ri-shopping-cart-2-line', title: t('plat_sales_title'), desc: t('plat_sales_desc'), cta: t('plat_sales_cta'), to: '/shop' },
    { icon: 'ri-tools-line', title: t('plat_repair_title'), desc: t('plat_repair_desc'), cta: t('plat_repair_cta'), to: '/services' },
    { icon: 'ri-stack-line', title: t('plat_bulk_title'), desc: t('plat_bulk_desc'), cta: t('plat_bulk_cta'), to: '/bulk-deals' },
    { icon: 'ri-server-line', title: t('plat_host_title'), desc: t('plat_host_desc'), cta: t('plat_host_cta'), to: '/hosting' },
  ];

  return (
    <section className="relative overflow-hidden border-y border-white/[0.06] bg-[#050506] py-20 sm:py-28">
      {/* ambient depth */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 15% 20%, rgba(220,38,38,0.10), transparent 60%), radial-gradient(ellipse 50% 50% at 90% 90%, rgba(220,38,38,0.05), transparent 55%)' }}
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        {/* Left — large statement */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="lg:sticky lg:top-28 lg:self-start"
        >
          <p className="font-inter text-xs font-semibold uppercase tracking-[0.22em] text-crimson-accent">{t('plat_tag')}</p>
          <h2 className="mt-4 font-inter text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t('plat_lead').split(' ').map((word, i) => (
              <span key={`${word}-${i}`} className="inline-block">
                {word.replace('.', '')}
                <span className="text-crimson-accent">.</span>
                {' '}
              </span>
            ))}
          </h2>
          <p className="mt-6 max-w-md font-inter text-lg font-medium text-zinc-300">{t('plat_title')}</p>
          <p className="mt-4 max-w-md font-inter text-base leading-7 text-soft-gray">{t('plat_sub')}</p>
        </motion.div>

        {/* Right — connected layer stack */}
        <div className="relative">
          {/* vertical connection line threading the index badges */}
          <span
            className="pointer-events-none absolute left-[27px] top-8 bottom-8 hidden w-px bg-gradient-to-b from-crimson-accent/0 via-crimson-accent/40 to-crimson-accent/0 sm:block"
            aria-hidden="true"
          />
          <div className="flex flex-col gap-5">
            {layers.map((layer, i) => (
              <motion.div
                key={layer.to}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative flex items-stretch gap-5"
              >
                {/* index badge sitting on the line */}
                <div className="relative z-10 hidden shrink-0 sm:block">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-crimson-accent/30 bg-[#0c0c0d] font-inter text-sm font-bold text-crimson-accent shadow-[0_0_0_4px_rgba(5,5,6,1)] transition-colors duration-200 group-hover:border-crimson-accent/60">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* dimensional panel */}
                <div className="relative flex flex-1 flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[linear-gradient(160deg,rgba(23,23,24,0.92),rgba(9,9,10,0.96))] p-6 shadow-[0_18px_44px_rgba(0,0,0,0.35)] transition-all duration-200 group-hover:-translate-y-1 group-hover:border-crimson-accent/40 group-hover:shadow-[0_26px_60px_rgba(0,0,0,0.5)] sm:p-7">
                  <span
                    className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-60 transition-opacity duration-200 group-hover:opacity-100"
                    style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.16) 0%, rgba(220,38,38,0.03) 48%, transparent 72%)' }}
                    aria-hidden="true"
                  />
                  <div className="relative flex items-center gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-crimson-accent/30 bg-crimson-accent/10 text-crimson-accent">
                      <i className={`${layer.icon} text-2xl`} aria-hidden="true" />
                    </span>
                    <h3 className="font-inter text-xl font-bold text-white sm:text-2xl">{layer.title}</h3>
                  </div>
                  <p className="relative mt-4 font-inter text-sm leading-6 text-soft-gray sm:text-[15px]">{layer.desc}</p>
                  <Link
                    to={layer.to}
                    className="relative z-10 mt-5 inline-flex w-fit items-center gap-1.5 font-inter text-sm font-semibold text-white transition-colors hover:text-crimson-accent"
                  >
                    {layer.cta}
                    <i className="ri-arrow-right-line text-base transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
