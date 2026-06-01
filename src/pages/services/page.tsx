import { motion, useReducedMotion } from 'framer-motion';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { useTranslation } from 'react-i18next';
import Seo, { repairServiceLd } from '../../components/feature/Seo';

// Contact channels — three distinct intents (not everything is WhatsApp).
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

  // ── Premium stats (facts already in i18n, shown number-first) ──
  const stats = [
    { value: '2,300+', label: 'Units Repaired', icon: 'ri-tools-fill' },
    { value: '92%', label: 'Repair Success Rate', icon: 'ri-checkbox-circle-fill' },
    { value: '5–12', label: 'Day Turnaround', icon: 'ri-time-fill' },
    { value: 'Montreal', label: 'Repair Center', icon: 'ri-map-pin-2-fill' },
  ];

  // ── Repair pricing — Level 1/2/3 only. Real prices preserved, "Starting at". ──
  const repairTiers = [
    {
      level: t('srv_pricing_l1_level'),
      title: t('srv_pricing_l1_title'),
      blurb: 'Basic hashboard repair — small parts and simple faults.',
      priceCad: '$60 CAD',
      priceUsd: '$45 USD',
      featured: false,
    },
    {
      level: t('srv_pricing_l2_level'),
      title: t('srv_pricing_l2_title'),
      blurb: 'Advanced hashboard repair for multiple chip or circuit issues.',
      priceCad: '$100 CAD',
      priceUsd: '$75 USD',
      featured: true,
    },
    {
      level: t('srv_pricing_l3_level'),
      title: t('srv_pricing_l3_title'),
      blurb: 'Complex board repair — advanced faults, deeper board work, and heavy diagnostics.',
      priceCad: '$130 CAD',
      priceUsd: '$95 USD',
      featured: false,
    },
  ];

  // ── Supporting services — 6 cards, fixed order. Prices preserved exactly. ──
  const supportServices = [
    { icon: 'ri-search-eye-line', name: 'Diagnostic', price: 'Starting at $35 CAD', desc: 'Inspection and fault isolation, credited toward repair if approved.' },
    { icon: 'ri-flashlight-line', name: 'PSU Diagnosis & Replacement Support', price: 'Starting at $120 CAD', desc: 'Power issue diagnosis with replacement support, bench tested before return.' },
    { icon: 'ri-cpu-line', name: 'Control Board Repair', price: 'Starting at $45 CAD', desc: 'Control board diagnosis, repair, and validation.' },
    { icon: 'ri-temp-cold-line', name: 'Thermal Paste Replacement', price: 'Starting at $40 CAD', desc: 'Fresh thermal interface for better heat transfer.' },
    { icon: 'ri-install-line', name: 'Firmware Restore', price: 'Starting at $10 CAD', desc: 'Restore or reflash firmware to recover a unit.' },
    { icon: 'ri-brush-line', name: 'Cleaning & Maintenance', price: 'Quoted per unit', desc: 'Dust removal and preventive servicing to keep units stable.' },
  ];

  // ── Animated "How Repair Works" — 7 steps ──
  const repairFlow = [
    { icon: 'ri-customer-service-2-line', title: 'Contact us', text: 'Send your model, symptoms, and photos.' },
    { icon: 'ri-truck-line', title: 'Drop off or ship', text: 'Drop off in Montreal or ship from anywhere in Canada.' },
    { icon: 'ri-search-eye-line', title: 'Diagnostic', text: 'Board-level diagnosis to find the real fault.' },
    { icon: 'ri-file-list-3-line', title: 'Quote approval', text: 'A clear, confirmed price before any work begins.' },
    { icon: 'ri-tools-line', title: 'Repair', text: 'Hashboard, control board, and component-level repair.' },
    { icon: 'ri-pulse-line', title: 'Load testing', text: 'Bench-tested under load to confirm stable hashrate.' },
    { icon: 'ri-checkbox-circle-line', title: 'Pickup or return shipping', text: 'Collect in Montreal or have it shipped back.' },
  ];

  // Reusable CTA cluster: Call / Quote / WhatsApp — three distinct channels.
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
      <section className="relative overflow-hidden border-b border-zinc-900 pt-24 bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.18),transparent_36%),linear-gradient(to_bottom,rgba(16,16,16,0.9),rgba(0,0,0,1))]">
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
            <p className="inline-flex items-center gap-2 rounded-full border border-red-900/60 bg-red-950/30 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-red-400 sm:text-xs">
              <i className="ri-map-pin-2-fill text-sm" aria-hidden="true" />
              Montreal Repair Center · Canada Wide
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">
              ASIC Miner Repair in Canada
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">
              Board-level diagnostics, hashboard repair, cleaning, firmware restore, and testing from our
              Montreal repair center.
            </p>

            <CtaCluster className="mt-8" />
          </motion.div>

          <motion.div {...heroReveal(0.1)} className="relative">
            <div className="rounded-[2rem] border border-red-950/60 bg-black/40 p-3 shadow-2xl shadow-black/50">
              <img
                src="/repair-lab.jpg"
                alt="Technician repairing an ASIC miner hashboard at the Canada BTC Miners Montreal repair center"
                loading="lazy"
                className="h-[280px] w-full rounded-[1.5rem] border border-zinc-900 object-cover sm:h-[360px] lg:h-[460px]"
              />
            </div>
            <div className="absolute -bottom-4 left-6 right-6 rounded-2xl border border-zinc-800 bg-black/80 px-5 py-3 backdrop-blur sm:left-10 sm:right-10">
              <p className="text-center text-xs font-medium uppercase tracking-[0.18em] text-zinc-300">
                Board-level repair · Bench-tested · Canada wide
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 2. PREMIUM STATS ─────────────────────────────────────────── */}
      <section className="border-b border-zinc-900 bg-zinc-950/70">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:py-14">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                {...reveal(idx * 0.06)}
                className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-[linear-gradient(to_bottom,rgba(24,24,27,0.7),rgba(9,9,11,0.92))] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-red-800/60"
              >
                {/* corner glow */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-60 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.4), transparent 70%)' }}
                />
                <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-red-900/40 bg-red-950/30 text-red-400">
                  <i className={`${stat.icon} text-xl`} aria-hidden="true" />
                </span>
                <div className="relative mt-5 font-orbitron text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {stat.value}
                </div>
                <div className="relative mt-1 text-sm font-medium text-zinc-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. REPAIR PRICING — Level 1 / 2 / 3 only ─────────────────── */}
      <section id="pricing" className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-400">Repair Pricing</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Hashboard Repair by Level</h2>
            <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">
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
              className={`group relative flex flex-col rounded-3xl border p-8 transition-all duration-200 hover:-translate-y-1 ${
                tier.featured
                  ? 'border-red-700/70 bg-[linear-gradient(to_bottom,rgba(127,29,29,0.26),rgba(9,9,11,0.92))] shadow-2xl shadow-red-950/40'
                  : 'border-zinc-800 bg-[linear-gradient(to_bottom,rgba(24,24,27,0.7),rgba(9,9,11,0.9))] hover:border-zinc-700'
              }`}
            >
              {tier.featured && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full opacity-70 blur-3xl"
                  style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.45), transparent 70%)' }}
                />
              )}
              <div className="relative flex items-center justify-between gap-3">
                <span className="text-sm font-semibold uppercase tracking-[0.18em] text-red-400">{tier.level}</span>
                {tier.featured && (
                  <span className="rounded-full bg-red-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                    Most Common
                  </span>
                )}
              </div>

              <h3 className="relative mt-4 text-xl font-semibold leading-tight">{tier.title}</h3>
              <p className="relative mt-2 text-sm leading-6 text-zinc-400">{tier.blurb}</p>

              <div className="relative mt-7">
                <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Starting at</div>
                <div className="mt-1 font-orbitron text-4xl font-bold text-red-400">{tier.priceCad}</div>
                <div className="mt-1 text-sm text-zinc-500">Starting at {tier.priceUsd}</div>
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
      </section>

      {/* ── 4. SUPPORTING SERVICES — 6 cards, fixed order ────────────── */}
      <section className="border-y border-zinc-900 bg-zinc-950/60">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-400">Supporting Services</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Everything to Keep Miners Running</h2>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {supportServices.map((svc, idx) => (
              <motion.div
                key={svc.name}
                {...reveal(idx * 0.05)}
                className="group flex flex-col rounded-3xl border border-zinc-800 bg-[linear-gradient(to_bottom,rgba(24,24,27,0.7),rgba(9,9,11,0.9))] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-red-900/50"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-900/30 bg-red-950/20 text-red-400">
                  <i className={`${svc.icon} text-2xl`} aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-base font-semibold text-white">{svc.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-zinc-400">{svc.desc}</p>
                <div className="mt-4 inline-flex w-fit items-center rounded-full border border-red-900/40 bg-red-950/20 px-3 py-1 text-xs font-semibold text-red-300">
                  {svc.price}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. HOW REPAIR WORKS — animated power-flow process track ───── */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        {/* ambient industrial glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(220,38,38,0.08), transparent 70%)' }}
        />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-400">How Repair Works</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">From First Message to Mining Again</h2>
            <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">
              A clear seven-step process. You approve the price before any repair begins.
            </p>
          </div>

          {/* ── Desktop: horizontal animated track ── */}
          <div className="relative mt-16 hidden lg:block">
            {/* power line (base rail + animated red current) */}
            <svg
              aria-hidden="true"
              className="absolute left-0 right-0 top-8 h-2 w-full"
              viewBox="0 0 1000 8"
              preserveAspectRatio="none"
            >
              <line x1="20" y1="4" x2="980" y2="4" stroke="#27272a" strokeWidth="2" />
              <line
                x1="20"
                y1="4"
                x2="980"
                y2="4"
                stroke="#DC2626"
                strokeWidth="2"
                strokeDasharray="6 14"
                className={reduce ? '' : 'animate-current-flow'}
                style={{ filter: 'drop-shadow(0 0 4px rgba(220,38,38,0.9))' }}
              />
            </svg>

            <ol className="relative grid grid-cols-7 gap-3">
              {repairFlow.map((step, idx) => (
                <motion.li
                  key={step.title}
                  {...reveal(idx * 0.07)}
                  className="group flex flex-col items-center text-center"
                >
                  {/* glowing node */}
                  <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-900/40 bg-[radial-gradient(circle_at_30%_25%,rgba(127,29,29,0.55),rgba(9,9,11,0.96))] text-red-300 shadow-[0_0_0_4px_rgba(0,0,0,1)] transition-all duration-200 group-hover:-translate-y-1 group-hover:border-red-600 group-hover:text-red-200 group-hover:shadow-[0_0_24px_rgba(220,38,38,0.5),0_0_0_4px_rgba(0,0,0,1)]">
                    <i className={`${step.icon} text-2xl`} aria-hidden="true" />
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow-md shadow-red-950/60">
                      {idx + 1}
                    </span>
                  </span>
                  <h3 className="mt-5 text-sm font-semibold text-white">{step.title}</h3>
                  <p className="mt-1.5 text-xs leading-5 text-zinc-400">{step.text}</p>
                </motion.li>
              ))}
            </ol>
          </div>

          {/* ── Mobile / tablet: vertical animated flow ── */}
          <ol className="relative mt-12 space-y-4 lg:hidden">
            {/* vertical power rail */}
            <span
              aria-hidden="true"
              className="absolute bottom-6 left-[31px] top-6 w-px bg-gradient-to-b from-red-600/70 via-red-800/40 to-transparent"
            />
            {repairFlow.map((step, idx) => (
              <motion.li
                key={step.title}
                {...reveal(idx * 0.05)}
                className="group relative flex items-start gap-4 rounded-2xl border border-zinc-800 bg-[linear-gradient(to_bottom,rgba(24,24,27,0.75),rgba(9,9,11,0.92))] p-4 transition-colors duration-200 hover:border-red-800/60"
              >
                <span className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-red-900/40 bg-[radial-gradient(circle_at_30%_25%,rgba(127,29,29,0.55),rgba(9,9,11,0.96))] text-red-300">
                  <i className={`${step.icon} text-2xl`} aria-hidden="true" />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                    {idx + 1}
                  </span>
                </span>
                <div className="pt-1">
                  <h3 className="text-base font-semibold text-white">{step.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-zinc-400">{step.text}</p>
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
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-400">Get Your Miner Fixed</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">Stop Losing Mining Time</h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">
            Send the issue, approve the quote, and get your miner back online.
            <br />
            Montreal repair center · Canada wide repair service.
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
