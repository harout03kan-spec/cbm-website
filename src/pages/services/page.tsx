import { Fragment } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { useTranslation } from 'react-i18next';
import Seo, { repairServiceLd } from '../../components/feature/Seo';

// Contact channels. Direct phone call, plus the on-site contact form for quotes.
const TEL = 'tel:+15146047050';
const QUOTE_LINK = '/contact#contact-form';

export default function ServicesPage() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();

  // Scroll-triggered reveal (reduced-motion aware).
  const reveal = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-60px' },
          transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  // Above-the-fold reveal (animates on mount).
  const heroReveal = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  // Premium metric strip. Values + labels translated so the French site reads natively.
  const stats = [
    { value: t('srv2_stat1_value'), label: t('srv2_stat1_label'), icon: 'ri-tools-fill' },
    { value: t('srv2_stat2_value'), label: t('srv2_stat2_label'), icon: 'ri-checkbox-circle-fill' },
    { value: t('srv2_stat3_value'), label: t('srv2_stat3_label'), icon: 'ri-time-fill' },
    { value: t('srv2_stat4_value'), label: t('srv2_stat4_label'), icon: 'ri-map-pin-2-fill' },
  ];

  // Repair pricing. Level 1/2/3 only. Real prices preserved, shown as "Starting at".
  const repairTiers = [
    {
      level: t('srv_pricing_l1_level'),
      title: t('srv_pricing_l1_title'),
      blurb: t('srv2_l1_blurb'),
      priceCad: '$60 CAD',
      priceUsd: '$45 USD',
      featured: false,
    },
    {
      level: t('srv_pricing_l2_level'),
      title: t('srv_pricing_l2_title'),
      blurb: t('srv2_l2_blurb'),
      priceCad: '$100 CAD',
      priceUsd: '$75 USD',
      featured: true,
    },
    {
      level: t('srv_pricing_l3_level'),
      title: t('srv_pricing_l3_title'),
      blurb: t('srv2_l3_blurb'),
      priceCad: '$130 CAD',
      priceUsd: '$95 USD',
      featured: false,
    },
  ];

  // Supporting services. Six compact tiles, fixed order. Prices preserved exactly.
  const supportServices = [
    { icon: 'ri-search-eye-line', name: t('srv2_sup1_name'), price: t('srv2_sup1_price') },
    { icon: 'ri-flashlight-line', name: t('srv2_sup2_name'), price: t('srv2_sup2_price') },
    { icon: 'ri-cpu-line', name: t('srv2_sup3_name'), price: t('srv2_sup3_price') },
    { icon: 'ri-temp-cold-line', name: t('srv2_sup4_name'), price: t('srv2_sup4_price') },
    { icon: 'ri-install-line', name: t('srv2_sup5_name'), price: t('srv2_sup5_price') },
    { icon: 'ri-brush-line', name: t('srv2_sup6_name'), price: t('srv2_sup6_price') },
  ];

  // "How Repair Works" — three clean steps (was a seven-stage animated track).
  const repairFlow = [
    { icon: 'ri-customer-service-2-line', title: t('srv2_flow1_title'), text: t('srv2_flow1_text') },
    { icon: 'ri-file-list-3-line', title: t('srv2_flow2_title'), text: t('srv2_flow2_text') },
    { icon: 'ri-checkbox-circle-line', title: t('srv2_flow3_title'), text: t('srv2_flow3_text') },
  ];

  // Repair-bench flow: Inspect → Isolate → Repair → Test (compact strip, not cards).
  const repairStages: { icon: string; num: string; title: string; desc: string }[] = [
    { icon: 'ri-search-eye-line',  num: '01', title: t('srv_graphic_1'), desc: t('srv_graphic_1_desc') },
    { icon: 'ri-focus-3-line',     num: '02', title: t('srv_graphic_2'), desc: t('srv_graphic_2_desc') },
    { icon: 'ri-tools-fill',       num: '03', title: t('srv_graphic_3'), desc: t('srv_graphic_3_desc') },
    { icon: 'ri-pulse-line',       num: '04', title: t('srv_graphic_4'), desc: t('srv_graphic_4_desc') },
  ];

  // Reusable CTA cluster: direct phone call + repair quote (contact form).
  const CtaCluster = ({ className = '' }: { className?: string }) => (
    <div className={`relative z-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap ${className}`}>
      <a
        href={TEL}
        aria-label={t('srv2_cta_call_aria')}
        className="relative z-10 inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-red-600 px-7 text-base font-semibold text-white shadow-lg shadow-red-900/30 transition-colors duration-200 hover:bg-red-500 active:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
      >
        <i className="ri-phone-fill text-lg" aria-hidden="true" />
        {t('srv2_cta_call')}
      </a>
      <Link
        to={QUOTE_LINK}
        aria-label={t('srv2_cta_quote_aria')}
        className="relative z-10 inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-white/[0.03] px-7 text-base font-semibold text-white transition-colors duration-200 hover:border-zinc-500 hover:bg-white/[0.07] active:bg-white/[0.12] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
      >
        <i className="ri-mail-send-line text-lg" aria-hidden="true" />
        {t('srv2_cta_quote')}
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased">
      <Seo
        title={t('srv_seo_title')}
        description={t('srv_seo_desc')}
        path="/services"
        jsonLd={[repairServiceLd]}
      />
      <Navbar />

      {/* ── 1. INTRO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-24 bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.18),transparent_36%),linear-gradient(to_bottom,rgba(16,16,16,0.92),rgba(0,0,0,1))]">
        {/* faint industrial circuit grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '46px 46px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 30% 28%, black, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 30% 28%, black, transparent 75%)',
          }}
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 sm:py-20 lg:grid-cols-[1.05fr,0.95fr] lg:py-24">
          <motion.div {...heroReveal()}>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-crimson-accent/30 bg-crimson-accent/10 px-4 py-1.5 font-inter text-[11px] font-bold uppercase tracking-[0.18em] text-crimson-accent">
              <i className="ri-map-pin-2-fill text-sm" aria-hidden="true" />
              {t('srv2_hero_badge')}
            </span>

            {/* Headline matches the homepage hero typography exactly. */}
            <h1 className="mb-6 font-inter text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              {t('srv2_hero_title')}
            </h1>

            <p className="mb-9 max-w-xl font-inter text-lg text-soft-gray md:text-xl">
              {t('srv2_hero_sub')}
            </p>

            <CtaCluster />
          </motion.div>

          <motion.div {...heroReveal(0.1)} className="relative">
            <div className="relative overflow-hidden rounded-[2rem] border border-red-950/60 bg-black/40 p-3 shadow-2xl shadow-black/60">
              <div className="relative overflow-hidden rounded-[1.5rem] border border-zinc-900">
                <img
                  src="/repair-lab.jpg"
                  alt={t('srv2_hero_img_alt')}
                  loading="lazy"
                  className="h-[280px] w-full object-cover sm:h-[360px] lg:h-[460px]"
                />
                {/* dark industrial overlay so the bright lab photo fits the theme */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.15)), radial-gradient(circle at 70% 20%, rgba(220,38,38,0.18), transparent 55%)',
                  }}
                />
              </div>
            </div>
            <div className="absolute -bottom-4 left-6 right-6 rounded-2xl border border-zinc-800 bg-black/85 px-5 py-3 backdrop-blur sm:left-10 sm:right-10">
              <p className="text-center text-xs font-medium uppercase tracking-[0.18em] text-zinc-300">
                {t('srv2_hero_caption')}
              </p>
            </div>
          </motion.div>
        </div>

        {/* ── 2. PREMIUM METRIC STRIP (industrial status panel) ───────── */}
        <div className="relative mx-auto mt-14 max-w-7xl px-6 pb-14">
          <motion.div
            {...reveal()}
            className="grid grid-cols-2 divide-y divide-zinc-800/70 overflow-hidden rounded-2xl border border-zinc-800 bg-[linear-gradient(to_bottom,rgba(24,24,27,0.8),rgba(9,9,11,0.95))] sm:grid-cols-4 sm:divide-y-0 sm:divide-x"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-4 px-6 py-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-900/40 bg-red-950/30 text-crimson-accent">
                  <i className={`${stat.icon} text-lg`} aria-hidden="true" />
                </span>
                <div>
                  <div className="font-inter text-xl font-bold leading-none text-white sm:text-2xl">{stat.value}</div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-zinc-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 2.5 SERVICE PILLARS (Diagnostic / Repair / Maintenance) ───── */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <div className="max-w-2xl">
          <p className="font-inter text-sm font-semibold uppercase tracking-[0.22em] text-crimson-accent">{t('srv_graphic_tag')}</p>
          <h2 className="mt-3 font-inter text-3xl font-bold tracking-tight sm:text-4xl">{t('srv_graphic_title')}</h2>
          <p className="mt-4 font-inter text-sm leading-7 text-zinc-400 sm:text-base">{t('srv_graphic_sub')}</p>
        </div>

        {/* Repair-bench flow — one bordered panel split into four numbered steps
            (Inspect / Isolate / Repair / Test). Intentionally different from the
            Repair-by-Level cards; reads left-to-right on desktop, stacked on mobile. */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-zinc-800 bg-[linear-gradient(160deg,rgba(24,24,27,0.6),rgba(9,9,11,0.85))]">
          <div className="grid grid-cols-1 divide-y divide-zinc-800/80 lg:grid-cols-4 lg:divide-y-0 lg:divide-x">
            {repairStages.map((stage, idx) => (
              <motion.div key={stage.num} {...reveal(idx * 0.08)} className="flex items-start gap-4 p-6 sm:p-7">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-900/40 bg-red-950/30 text-crimson-accent">
                  <i className={`${stage.icon} text-xl`} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-inter text-[11px] font-bold tracking-[0.18em] text-red-400/80">{stage.num}</span>
                    <h3 className="font-inter text-base font-bold leading-snug text-white">{stage.title}</h3>
                  </div>
                  <p className="mt-1.5 font-inter text-sm leading-6 text-zinc-400">{stage.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. REPAIR PRICING (large premium cards, Level 1/2/3 only) ─── */}
      <section id="pricing" className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="font-inter text-sm font-semibold uppercase tracking-[0.22em] text-crimson-accent">{t('srv2_pricing_eyebrow')}</p>
            <h2 className="mt-3 font-inter text-3xl font-bold tracking-tight sm:text-4xl">{t('srv2_pricing_title')}</h2>
            <p className="mt-4 font-inter text-sm leading-7 text-zinc-400 sm:text-base">
              {t('srv2_pricing_sub')}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-white/[0.02] px-4 py-3 text-sm text-zinc-400">
            {t('srv2_pricing_note')}
          </div>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {repairTiers.map((tier, idx) => (
            <motion.div
              key={tier.level}
              {...reveal(idx * 0.08)}
              className={`group relative flex flex-col overflow-hidden rounded-3xl border p-8 transition-all duration-200 hover:-translate-y-1 ${
                tier.featured
                  ? 'border-red-700/70 bg-[linear-gradient(160deg,rgba(127,29,29,0.3),rgba(9,9,11,0.94))] shadow-2xl shadow-red-950/40 lg:scale-[1.03]'
                  : 'border-zinc-800 bg-[linear-gradient(160deg,rgba(24,24,27,0.75),rgba(9,9,11,0.92))] hover:border-zinc-700'
              }`}
            >
              {tier.featured && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full opacity-70 blur-3xl"
                  style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.5), transparent 70%)' }}
                />
              )}
              <div className="relative flex items-center justify-between gap-3">
                <span className="font-inter text-sm font-semibold uppercase tracking-[0.18em] text-crimson-accent">{tier.level}</span>
                {tier.featured && (
                  <span className="rounded-full bg-red-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                    {t('srv2_pricing_badge')}
                  </span>
                )}
              </div>

              <h3 className="relative mt-4 font-inter text-lg font-bold leading-snug text-white">{tier.title}</h3>
              <p className="relative mt-3 font-inter text-sm leading-6 text-zinc-400">{tier.blurb}</p>

              <div className="relative mt-auto pt-8">
                <div className="font-inter text-[11px] uppercase tracking-[0.18em] text-zinc-500">{t('srv2_pricing_startingat')}</div>
                <div className="mt-1 font-inter text-4xl font-bold text-crimson-accent">{tier.priceCad}</div>
                <div className="mt-1 font-inter text-sm text-zinc-500">{t('srv2_pricing_startingat')} {tier.priceUsd}</div>
              </div>

              <Link
                to={QUOTE_LINK}
                className={`relative z-10 mt-8 inline-flex min-h-[48px] items-center justify-center rounded-xl px-5 text-sm font-semibold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 ${
                  tier.featured
                    ? 'bg-red-600 text-white hover:bg-red-500 active:bg-red-700'
                    : 'border border-zinc-700 text-zinc-200 hover:border-zinc-500 hover:bg-white/5 active:bg-white/10'
                }`}
              >
                {t('srv2_cta_quote')}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* ── 4. SUPPORTING SERVICES (compact tiles under pricing) ────── */}
        <div className="mt-14">
          <div className="flex items-center gap-3">
            <h3 className="font-inter text-sm font-semibold uppercase tracking-[0.2em] text-zinc-300">{t('srv2_support_title')}</h3>
            <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {supportServices.map((svc, idx) => (
              <motion.div
                key={svc.name}
                {...reveal(idx * 0.04)}
                className="group flex items-center gap-3 rounded-2xl border border-zinc-800 bg-white/[0.02] px-4 py-3.5 transition-colors duration-200 hover:border-red-900/50 hover:bg-red-950/10"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-900/30 bg-red-950/20 text-crimson-accent">
                  <i className={`${svc.icon} text-base`} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1 text-sm font-medium leading-snug text-zinc-200">{svc.name}</span>
                <span className="shrink-0 rounded-full border border-red-900/40 bg-red-950/20 px-2.5 py-1 text-[11px] font-semibold text-red-300">
                  {svc.price}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. HOW REPAIR WORKS (custom animated power-flow process) ──── */}
      <section className="relative overflow-hidden border-y border-zinc-900 bg-zinc-950/60 py-16 sm:py-24">
        {/* ambient industrial glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 24%, rgba(220,38,38,0.1), transparent 70%)' }}
        />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="font-inter text-sm font-semibold uppercase tracking-[0.22em] text-crimson-accent">{t('srv2_how_eyebrow')}</p>
            <h2 className="mt-3 font-inter text-3xl font-bold tracking-tight sm:text-4xl">{t('srv2_how_title')}</h2>
            <p className="mt-4 font-inter text-sm leading-7 text-zinc-400 sm:text-base">
              {t('srv2_how_sub')}
            </p>
          </div>

          {/* Three clean numbered step cards — identical on desktop (row) and mobile
              (stacked). A subtle chevron connects them on desktop; no fragile rail. */}
          <ol className="mt-12 flex flex-col gap-4 md:flex-row md:items-stretch">
            {repairFlow.map((step, idx) => (
              <Fragment key={step.title}>
                <motion.li
                  {...reveal(idx * 0.08)}
                  className="group relative flex flex-1 flex-col rounded-2xl border border-zinc-800 bg-[linear-gradient(160deg,rgba(24,24,27,0.8),rgba(9,9,11,0.94))] p-6 transition-colors duration-200 hover:border-red-800/60 sm:p-7"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-900/50 bg-[radial-gradient(circle_at_30%_22%,rgba(127,29,29,0.6),rgba(9,9,11,0.97))] text-red-300">
                      <i className={`${step.icon} text-xl`} aria-hidden="true" />
                    </span>
                    <span className="font-inter text-base font-bold tracking-[0.1em] text-crimson-accent">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="mt-4 font-inter text-lg font-bold leading-snug text-white">{step.title}</h3>
                  <p className="mt-2 font-inter text-sm leading-6 text-zinc-400">{step.text}</p>
                </motion.li>
                {idx < repairFlow.length - 1 && (
                  <li aria-hidden="true" className="hidden items-center justify-center text-zinc-700 md:flex">
                    <i className="ri-arrow-right-s-line text-3xl" />
                  </li>
                )}
              </Fragment>
            ))}
          </ol>

          <div className="mt-12">
            <CtaCluster />
          </div>
        </div>
      </section>

      {/* ── 6. FINAL CTA ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-red-950/50 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.2),transparent_40%),linear-gradient(to_bottom,rgba(24,24,27,0.82),rgba(0,0,0,1))]">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:py-24">
          <p className="font-inter text-sm font-semibold uppercase tracking-[0.22em] text-crimson-accent">{t('srv2_final_eyebrow')}</p>
          <h2 className="mt-4 font-inter text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">{t('srv2_final_title')}</h2>
          <p className="mx-auto mt-6 max-w-2xl font-inter text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">
            {t('srv2_final_sub')}
          </p>
          <div className="mt-10 flex justify-center">
            <CtaCluster className="justify-center" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
