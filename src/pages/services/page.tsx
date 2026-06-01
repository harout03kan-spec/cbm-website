import { motion, useReducedMotion } from 'framer-motion';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { useTranslation } from 'react-i18next';
import Seo, { repairServiceLd } from '../../components/feature/Seo';

// Contact channels. Three distinct intents (not everything is WhatsApp).
const TEL = 'tel:+15146047050';
const WA = 'https://wa.me/15146047050';
const QUOTE_EMAIL =
  'mailto:info@canadabtcminers.ca?subject=ASIC%20Repair%20Quote%20Request&body=Miner%20model%3A%0AIssue%2Fsymptoms%3A%0AQuantity%3A%0APreferred%20option%20(drop-off%20in%20Montreal%20or%20ship)%3A';

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

  // Premium metric strip (facts already in i18n; clean spacing, no dashes).
  const stats = [
    { value: '2,300+', label: 'Units Repaired', icon: 'ri-tools-fill' },
    { value: '92%', label: 'Repair Success', icon: 'ri-checkbox-circle-fill' },
    { value: '5 to 12', label: 'Day Turnaround', icon: 'ri-time-fill' },
    { value: 'Montreal', label: 'Repair Center', icon: 'ri-map-pin-2-fill' },
  ];

  // Repair pricing. Level 1/2/3 only. Real prices preserved, shown as "Starting at".
  const repairTiers = [
    {
      level: t('srv_pricing_l1_level'),
      title: t('srv_pricing_l1_title'),
      blurb: 'Small parts and simple faults on the hashboard.',
      priceCad: '$60 CAD',
      priceUsd: '$45 USD',
      featured: false,
    },
    {
      level: t('srv_pricing_l2_level'),
      title: t('srv_pricing_l2_title'),
      blurb: 'Multiple chip or circuit issues across the board.',
      priceCad: '$100 CAD',
      priceUsd: '$75 USD',
      featured: true,
    },
    {
      level: t('srv_pricing_l3_level'),
      title: t('srv_pricing_l3_title'),
      blurb: 'Advanced faults, deeper board work, and heavy diagnostics.',
      priceCad: '$130 CAD',
      priceUsd: '$95 USD',
      featured: false,
    },
  ];

  // Supporting services. Six compact tiles, fixed order. Prices preserved exactly.
  const supportServices = [
    { icon: 'ri-search-eye-line', name: 'Diagnostic', price: 'From $35 CAD' },
    { icon: 'ri-flashlight-line', name: 'PSU Diagnosis & Replacement Support', price: 'From $120 CAD' },
    { icon: 'ri-cpu-line', name: 'Control Board Repair', price: 'From $45 CAD' },
    { icon: 'ri-temp-cold-line', name: 'Thermal Paste Replacement', price: 'From $40 CAD' },
    { icon: 'ri-install-line', name: 'Firmware Restore', price: 'From $10 CAD' },
    { icon: 'ri-brush-line', name: 'Cleaning & Maintenance', price: 'Quoted per unit' },
  ];

  // Animated "How Repair Works" process. Seven stages.
  const repairFlow = [
    { icon: 'ri-customer-service-2-line', title: 'Contact us', text: 'Send your model, symptoms, and photos.' },
    { icon: 'ri-truck-line', title: 'Drop off or ship', text: 'Drop off in Montreal or ship from anywhere in Canada.' },
    { icon: 'ri-search-eye-line', title: 'Diagnostic', text: 'Board level diagnosis to find the real fault.' },
    { icon: 'ri-file-list-3-line', title: 'Quote approval', text: 'A clear, confirmed price before any work begins.' },
    { icon: 'ri-tools-line', title: 'Repair', text: 'Hashboard, control board, and component level repair.' },
    { icon: 'ri-pulse-line', title: 'Load testing', text: 'Bench tested under load to confirm stable hashrate.' },
    { icon: 'ri-checkbox-circle-line', title: 'Pickup or return shipping', text: 'Collect in Montreal or have it shipped back.' },
  ];

  // Reusable CTA cluster: Call / Quote / WhatsApp. Three distinct channels.
  const CtaCluster = ({ className = '' }: { className?: string }) => (
    <div className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap ${className}`}>
      <a
        href={TEL}
        aria-label="Call Canada BTC Miners now at +1 514 604 7050"
        className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-red-600 px-7 text-base font-semibold text-white shadow-lg shadow-red-900/30 transition-colors duration-200 hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
      >
        <i className="ri-phone-fill text-lg" aria-hidden="true" />
        Call Now
      </a>
      <a
        href={QUOTE_EMAIL}
        aria-label="Request a repair quote by email"
        className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-white/[0.03] px-7 text-base font-semibold text-white transition-colors duration-200 hover:border-zinc-500 hover:bg-white/[0.07] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
      >
        <i className="ri-mail-send-line text-lg" aria-hidden="true" />
        Request Repair Quote
      </a>
      <a
        href={WA}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Message us on WhatsApp"
        className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-white/[0.03] px-7 text-base font-semibold text-zinc-200 transition-colors duration-200 hover:border-green-700/60 hover:bg-green-950/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
      >
        <i className="ri-whatsapp-fill text-lg text-green-400" aria-hidden="true" />
        Message on WhatsApp
      </a>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased">
      <Seo
        title="ASIC Miner Repair Canada | Hashboard Diagnostics and Maintenance"
        description="ASIC miner repair services in Canada from Canada BTC Miners. We offer diagnostics, hashboard repair, control board support, cleaning, maintenance, thermal paste replacement, firmware restore, and testing."
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
              Montreal Repair Center
            </span>

            {/* Headline matches the homepage hero typography exactly. */}
            <h1 className="mb-6 font-orbitron text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              ASIC Miner Repair in Canada
            </h1>

            <p className="mb-9 max-w-xl font-inter text-lg text-soft-gray md:text-xl">
              Board level diagnostics, hashboard repair, cleaning, firmware restore, and testing from our
              Montreal repair center.
            </p>

            <CtaCluster />
          </motion.div>

          <motion.div {...heroReveal(0.1)} className="relative">
            <div className="relative overflow-hidden rounded-[2rem] border border-red-950/60 bg-black/40 p-3 shadow-2xl shadow-black/60">
              <div className="relative overflow-hidden rounded-[1.5rem] border border-zinc-900">
                <img
                  src="/repair-lab.jpg"
                  alt="Technician repairing an ASIC miner hashboard at the Canada BTC Miners Montreal repair center"
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
                Board level repair · Bench tested · Canada wide
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
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-900/40 bg-red-950/30 text-red-400">
                  <i className={`${stat.icon} text-lg`} aria-hidden="true" />
                </span>
                <div>
                  <div className="font-orbitron text-xl font-bold leading-none text-white sm:text-2xl">{stat.value}</div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-zinc-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 3. REPAIR PRICING (large premium cards, Level 1/2/3 only) ─── */}
      <section id="pricing" className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="font-inter text-sm font-semibold uppercase tracking-[0.22em] text-red-400">Repair Pricing</p>
            <h2 className="mt-3 font-orbitron text-3xl font-bold tracking-tight sm:text-4xl">Hashboard Repair by Level</h2>
            <p className="mt-4 font-inter text-sm leading-7 text-zinc-400 sm:text-base">
              Antminer, Whatsminer, and other supported models. Final price is confirmed after diagnosis.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-white/[0.02] px-4 py-3 text-sm text-zinc-400">
            Diagnostic fee credited toward repair
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
                <span className="font-inter text-sm font-semibold uppercase tracking-[0.18em] text-red-400">{tier.level}</span>
                {tier.featured && (
                  <span className="rounded-full bg-red-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                    Most Common
                  </span>
                )}
              </div>

              <h3 className="relative mt-4 font-orbitron text-lg font-bold leading-snug text-white">{tier.title}</h3>
              <p className="relative mt-3 font-inter text-sm leading-6 text-zinc-400">{tier.blurb}</p>

              <div className="relative mt-8">
                <div className="font-inter text-[11px] uppercase tracking-[0.18em] text-zinc-500">Starting at</div>
                <div className="mt-1 font-orbitron text-4xl font-bold text-red-400">{tier.priceCad}</div>
                <div className="mt-1 font-inter text-sm text-zinc-500">Starting at {tier.priceUsd}</div>
              </div>

              <a
                href={QUOTE_EMAIL}
                className={`relative mt-8 inline-flex min-h-[48px] items-center justify-center rounded-xl px-5 text-sm font-semibold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 ${
                  tier.featured
                    ? 'bg-red-600 text-white hover:bg-red-500'
                    : 'border border-zinc-700 text-zinc-200 hover:border-zinc-500 hover:bg-white/5'
                }`}
              >
                Request Repair Quote
              </a>
            </motion.div>
          ))}
        </div>

        {/* ── 4. SUPPORTING SERVICES (compact tiles under pricing) ────── */}
        <div className="mt-14">
          <div className="flex items-center gap-3">
            <h3 className="font-inter text-sm font-semibold uppercase tracking-[0.2em] text-zinc-300">Supporting Services</h3>
            <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {supportServices.map((svc, idx) => (
              <motion.div
                key={svc.name}
                {...reveal(idx * 0.04)}
                className="group flex items-center gap-3 rounded-2xl border border-zinc-800 bg-white/[0.02] px-4 py-3.5 transition-colors duration-200 hover:border-red-900/50 hover:bg-red-950/10"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-900/30 bg-red-950/20 text-red-400">
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
            <p className="font-inter text-sm font-semibold uppercase tracking-[0.22em] text-red-400">How Repair Works</p>
            <h2 className="mt-3 font-orbitron text-3xl font-bold tracking-tight sm:text-4xl">From First Message to Mining Again</h2>
            <p className="mt-4 font-inter text-sm leading-7 text-zinc-400 sm:text-base">
              A clear seven step process. You approve the price before any repair begins.
            </p>
          </div>

          {/* ── Desktop: horizontal animated power track ── */}
          <div className="relative mt-16 hidden lg:block">
            {/* power rail with animated red current flowing through the steps */}
            <svg
              aria-hidden="true"
              className="absolute left-0 right-0 top-9 h-3 w-full"
              viewBox="0 0 1000 12"
              preserveAspectRatio="none"
            >
              <line x1="14" y1="6" x2="986" y2="6" stroke="#27272a" strokeWidth="2" />
              <line
                x1="14"
                y1="6"
                x2="986"
                y2="6"
                stroke="#DC2626"
                strokeWidth="2.5"
                strokeDasharray="5 16"
                className={reduce ? '' : 'animate-current-flow'}
                style={{ filter: 'drop-shadow(0 0 5px rgba(220,38,38,0.95))' }}
              />
            </svg>

            <ol className="relative grid grid-cols-7 gap-3">
              {repairFlow.map((step, idx) => (
                <motion.li key={step.title} {...reveal(idx * 0.08)} className="group flex flex-col items-center text-center">
                  {/* glowing technical node with a subtle pulsing status light */}
                  <span className="relative z-10 flex h-[68px] w-[68px] items-center justify-center rounded-2xl border border-red-900/50 bg-[radial-gradient(circle_at_30%_22%,rgba(127,29,29,0.6),rgba(9,9,11,0.97))] text-red-300 shadow-[0_0_0_5px_#09090b,0_10px_24px_rgba(0,0,0,0.6)] transition-all duration-200 group-hover:-translate-y-1.5 group-hover:border-red-500 group-hover:text-red-200 group-hover:shadow-[0_0_28px_rgba(220,38,38,0.55),0_0_0_5px_#09090b]">
                    <i className={`${step.icon} text-2xl`} aria-hidden="true" />
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow-md shadow-red-950/60">
                      {idx + 1}
                    </span>
                    <span
                      className={`absolute -bottom-1 h-1.5 w-1.5 rounded-full bg-red-500 ${reduce ? '' : 'animate-led-flicker'}`}
                      style={{ boxShadow: '0 0 6px rgba(220,38,38,0.9)', animationDelay: `${idx * 0.25}s` }}
                      aria-hidden="true"
                    />
                  </span>
                  <h3 className="mt-5 font-inter text-sm font-semibold text-white">{step.title}</h3>
                  <p className="mt-1.5 font-inter text-xs leading-5 text-zinc-400">{step.text}</p>
                </motion.li>
              ))}
            </ol>
          </div>

          {/* ── Mobile / tablet: vertical animated power flow ── */}
          <ol className="relative mt-12 space-y-3 lg:hidden">
            {/* vertical glowing power rail behind the nodes */}
            <span
              aria-hidden="true"
              className="absolute bottom-8 left-[34px] top-8 w-[2px] bg-gradient-to-b from-red-600/80 via-red-700/40 to-transparent"
            />
            {repairFlow.map((step, idx) => (
              <motion.li
                key={step.title}
                {...reveal(idx * 0.05)}
                className="group relative flex items-start gap-4 rounded-2xl border border-zinc-800 bg-[linear-gradient(160deg,rgba(24,24,27,0.8),rgba(9,9,11,0.94))] p-4 transition-colors duration-200 hover:border-red-800/60"
              >
                <span className="relative z-10 flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-2xl border border-red-900/50 bg-[radial-gradient(circle_at_30%_22%,rgba(127,29,29,0.6),rgba(9,9,11,0.97))] text-red-300 shadow-[0_0_0_4px_#0b0b0d]">
                  <i className={`${step.icon} text-xl`} aria-hidden="true" />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                    {idx + 1}
                  </span>
                </span>
                <div className="pt-1">
                  <h3 className="font-inter text-base font-semibold text-white">{step.title}</h3>
                  <p className="mt-1 font-inter text-sm leading-6 text-zinc-400">{step.text}</p>
                </div>
              </motion.li>
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
          <p className="font-inter text-sm font-semibold uppercase tracking-[0.22em] text-red-400">Get Your Miner Fixed</p>
          <h2 className="mt-4 font-orbitron text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">Stop Losing Mining Time</h2>
          <p className="mx-auto mt-6 max-w-2xl font-inter text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">
            Send the issue, approve the quote, and get your miner back online from our Montreal repair center with
            Canada wide repair service.
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
