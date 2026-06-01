import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { useTranslation } from 'react-i18next';
import Seo, { repairServiceLd } from '../../components/feature/Seo';

// Contact channels — distinct intents (not everything is WhatsApp).
const TEL = 'tel:+15146047050';
const WA = 'https://wa.me/15146047050';
const QUOTE_EMAIL =
  'mailto:info@canadabtcminers.ca?subject=ASIC%20Repair%20Quote%20Request&body=Miner%20model%3A%0AIssue%2Fsymptoms%3A%0AQuantity%3A%0APreferred%20option%20(drop-off%20in%20Montreal%20or%20ship)%3A';

export default function ServicesPage() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Scroll-triggered reveal for below-the-fold sections (reduced-motion aware).
  const reveal = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-60px' },
          transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  // Immediate reveal for above-the-fold hero (animates on mount, never waits
  // for a scroll observer; respects reduced motion).
  const heroReveal = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  // ── Premium repair pricing (existing real prices preserved; shown as "Starting at") ──
  const repairTiers = [
    {
      level: t('srv_pricing_l1_level'),
      title: t('srv_pricing_l1_title'),
      blurb: 'Basic hashboard repair — small parts and simple faults.',
      priceCad: '$60 CAD',
      priceUsd: '$45 USD',
      featured: false,
      details: [t('srv_pricing_l1_d1'), t('srv_pricing_l1_d2'), t('srv_pricing_l1_d3'), t('srv_pricing_l1_d4')],
    },
    {
      level: t('srv_pricing_l2_level'),
      title: t('srv_pricing_l2_title'),
      blurb: 'Advanced hashboard repair — multiple chip or circuit issues.',
      priceCad: '$100 CAD',
      priceUsd: '$75 USD',
      featured: true,
      details: [t('srv_pricing_l2_d1'), t('srv_pricing_l2_d2'), t('srv_pricing_l2_d3'), t('srv_pricing_l2_d4')],
    },
    {
      level: t('srv_pricing_l3_level'),
      title: t('srv_pricing_l3_title'),
      blurb: 'Complex repair — deeper board work, heavy diagnostics, advanced faults.',
      priceCad: '$130 CAD',
      priceUsd: '$95 USD',
      featured: false,
      details: [t('srv_pricing_l3_d1'), t('srv_pricing_l3_d2'), t('srv_pricing_l3_d3'), t('srv_pricing_l3_d4')],
    },
  ];

  // Supporting services (prices preserved exactly from the existing data).
  const supportServices = [
    { icon: 'ri-search-eye-line', name: t('srv_extra_diag'), cad: '$35 CAD', usd: '$25 USD', note: t('srv_extra_diag_note') },
    { icon: 'ri-cpu-line', name: t('srv_extra_ctrl'), cad: '$45 CAD', usd: '$35 USD', note: t('srv_extra_ctrl_note') },
    { icon: 'ri-flashlight-line', name: t('srv_extra_psu'), cad: '$120 CAD', usd: '$85 USD', note: t('srv_extra_psu_note') },
    { icon: 'ri-temp-cold-line', name: t('srv_extra_thermal'), cad: '$40 CAD', usd: '$30 USD', note: t('srv_extra_thermal_note') },
    { icon: 'ri-install-line', name: t('srv_extra_firmware'), cad: '$10 CAD', usd: '$7.50 USD', note: t('srv_extra_firmware_note') },
  ];

  // ── Animated "How Repair Works" — 7 steps ──
  const repairFlow = [
    { icon: 'ri-customer-service-2-line', title: 'Contact us', text: 'Send your model, symptoms, photos, or quantity.' },
    { icon: 'ri-truck-line', title: 'Send or drop off miner', text: 'Ship to us, or drop off at our Montreal repair center.' },
    { icon: 'ri-search-eye-line', title: 'Diagnostic', text: 'Full board-level diagnosis to find the real fault.' },
    { icon: 'ri-file-list-3-line', title: 'Quote approval', text: 'A clear, confirmed price before any work begins.' },
    { icon: 'ri-tools-line', title: 'Repair', text: 'Hashboard, control board, and component-level repair.' },
    { icon: 'ri-shield-check-line', title: 'Testing', text: 'Bench-tested under load to confirm stable hashrate.' },
    { icon: 'ri-checkbox-circle-line', title: 'Pickup or return shipping', text: 'Collect in Montreal or have it shipped back to you.' },
  ];

  // ── Trust / capabilities ──
  const capabilities = [
    { icon: 'ri-map-pin-2-line', label: 'Montreal Repair Center' },
    { icon: 'ri-road-map-line', label: 'Canada Wide Repair Service' },
    { icon: 'ri-search-eye-line', label: 'Diagnostics & Testing' },
    { icon: 'ri-cpu-line', label: 'Hashboard Repair' },
    { icon: 'ri-circuit-board-line', label: 'Control Board Support' },
    { icon: 'ri-brush-line', label: 'Cleaning & Maintenance' },
    { icon: 'ri-temp-cold-line', label: 'Thermal Paste Replacement' },
    { icon: 'ri-install-line', label: 'Firmware Restore' },
    { icon: 'ri-truck-line', label: 'Pickup or Return Shipping' },
  ];

  const heroTrustItems = [t('srv_trust_1'), t('srv_trust_2'), t('srv_trust_3'), t('srv_trust_4')];

  const faq = [
    { q: t('srv_faq_q1'), a: t('srv_faq_a1') },
    { q: t('srv_faq_q2'), a: t('srv_faq_a2') },
    { q: t('srv_faq_q3'), a: t('srv_faq_a3') },
    { q: t('srv_faq_q4'), a: t('srv_faq_a4') },
  ];

  const fleetSupport = [t('srv_fleet_1'), t('srv_fleet_2'), t('srv_fleet_3'), t('srv_fleet_4')];

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

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-zinc-900 pt-24 bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.16),transparent_34%),linear-gradient(to_bottom,rgba(18,18,18,0.85),rgba(0,0,0,1))]">
        {/* faint industrial circuit grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '46px 46px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 30% 30%, black, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 30% 30%, black, transparent 75%)',
          }}
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 sm:py-20 lg:grid-cols-[1.05fr,0.95fr] lg:py-24">
          <motion.div {...heroReveal()}>
            <p className="inline-flex items-center gap-2 rounded-full border border-red-900/60 bg-red-950/30 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-red-400 sm:text-xs">
              <i className="ri-map-pin-2-fill text-sm" aria-hidden="true" />
              {t('srv_hero_tag')} · Montreal
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">
              {t('srv_hero_title')}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">
              Dead boards, low hashrate, hardware errors, and power issues diagnosed and repaired by hand.
              Units are repaired, tested under load, and returned ready to mine from our Montreal repair center —
              with Canada wide shipping.
            </p>
            <p className="mt-3 max-w-2xl text-sm text-zinc-400">
              Servicing Antminer, Whatsminer, and other leading ASIC mining rigs across Canada.
            </p>

            <CtaCluster className="mt-8" />

            <div className="mt-9 grid max-w-md grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {heroTrustItems.map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <i className="ri-checkbox-circle-fill mt-0.5 shrink-0 text-red-500" aria-hidden="true" />
                  <span className="font-medium leading-snug text-zinc-200">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div {...heroReveal(0.1)} className="relative">
            <div className="rounded-[2rem] border border-red-950/60 bg-black/40 p-3 shadow-2xl shadow-black/50">
              <img
                src="/repair-lab.jpg"
                alt="Technician repairing an ASIC miner hashboard at the Canada BTC Miners Montreal repair center"
                loading="lazy"
                className="h-[280px] w-full rounded-[1.5rem] border border-zinc-900 object-cover sm:h-[360px] lg:h-[500px]"
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

      {/* ── CAPABILITIES STRIP ───────────────────────────────────────── */}
      <section className="border-b border-zinc-900 bg-zinc-950/70">
        <div className="mx-auto max-w-7xl px-6 py-10 sm:py-12">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-400">What We Handle</p>
          <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
            {t('srv_core_title')}
          </h2>
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
            {capabilities.map((cap, idx) => (
              <motion.div
                key={cap.label}
                {...reveal(idx * 0.04)}
                className="group flex items-center gap-3 rounded-2xl border border-zinc-800 bg-black/40 px-4 py-4 transition-colors duration-200 hover:border-red-900/50 hover:bg-red-950/10"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-900/30 bg-red-950/20 text-red-400">
                  <i className={`${cap.icon} text-xl`} aria-hidden="true" />
                </span>
                <span className="text-sm font-medium leading-snug text-zinc-200">{cap.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW REPAIR WORKS — animated 7-step stepper ───────────────── */}
      <section className="relative mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-400">How Repair Works</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">From First Message to Mining Again</h2>
          <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">
            A clear, seven-step process — no surprise charges. You approve the price before any repair begins.
          </p>
        </div>

        <ol className="relative mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* glowing progress line (desktop) */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px lg:block"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(220,38,38,0.5) 12%, rgba(220,38,38,0.5) 88%, transparent)' }}
          />
          {repairFlow.map((step, idx) => (
            <motion.li
              key={step.title}
              {...reveal(idx * 0.06)}
              className="relative flex flex-col rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 transition-colors duration-200 hover:border-red-900/50"
            >
              <div className="flex items-center gap-3">
                <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-red-900/40 bg-red-950/20 text-red-400">
                  <i className={`${step.icon} text-2xl`} aria-hidden="true" />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                    {idx + 1}
                  </span>
                </span>
              </div>
              <h3 className="mt-4 text-base font-semibold text-white">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-zinc-400">{step.text}</p>
            </motion.li>
          ))}
        </ol>
      </section>

      {/* ── REPAIR PRICING BY LEVEL ──────────────────────────────────── */}
      <section id="pricing" className="border-y border-zinc-900 bg-zinc-950/60">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-400">Repair Pricing</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Hashboard Repair Pricing by Level</h2>
              <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">
                Transparent ASIC repair pricing for Antminer, Whatsminer, and other supported models.
                Final price is confirmed after diagnosis.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-black/40 px-4 py-3 text-sm text-zinc-400">
              Diagnostic fee credited toward repair
            </div>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {repairTiers.map((tier, idx) => (
              <motion.div
                key={tier.level}
                {...reveal(idx * 0.08)}
                className={`relative flex flex-col rounded-3xl border p-7 transition-colors duration-200 ${
                  tier.featured
                    ? 'border-red-700/70 bg-[linear-gradient(to_bottom,rgba(127,29,29,0.22),rgba(10,10,10,0.9))] shadow-2xl shadow-red-950/30'
                    : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold uppercase tracking-[0.18em] text-red-400">{tier.level}</span>
                  {tier.featured && (
                    <span className="rounded-full bg-red-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
                      Most Common
                    </span>
                  )}
                </div>
                <h3 className="mt-4 text-xl font-semibold leading-tight">{tier.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{tier.blurb}</p>

                <div className="mt-6 border-b border-zinc-800 pb-6">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Starting at</div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-red-400">{tier.priceCad}</span>
                  </div>
                  <div className="mt-1 text-sm text-zinc-400">Starting at {tier.priceUsd}</div>
                </div>

                <ul className="mt-6 space-y-3 text-sm text-zinc-300">
                  {tier.details.map((detail, di) => (
                    <li key={di} className="flex items-start gap-3">
                      <i className="ri-checkbox-circle-fill mt-0.5 shrink-0 text-red-500/80" aria-hidden="true" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={QUOTE_EMAIL}
                  className={`mt-7 inline-flex min-h-[48px] items-center justify-center rounded-xl px-5 text-sm font-semibold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 ${
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

          {/* Level explanations */}
          <div className="mt-8 grid gap-4 rounded-3xl border border-zinc-800 bg-black/40 p-6 sm:grid-cols-3">
            <div>
              <div className="text-sm font-semibold text-red-400">Level 1</div>
              <p className="mt-1.5 text-sm leading-6 text-zinc-400">Basic hashboard repair, small parts, simple faults.</p>
            </div>
            <div>
              <div className="text-sm font-semibold text-red-400">Level 2</div>
              <p className="mt-1.5 text-sm leading-6 text-zinc-400">More advanced hashboard repair, multiple chip or circuit issues.</p>
            </div>
            <div>
              <div className="text-sm font-semibold text-red-400">Level 3</div>
              <p className="mt-1.5 text-sm leading-6 text-zinc-400">Complex repair, deeper board work, heavy diagnostics, advanced faults.</p>
            </div>
          </div>

          {/* Supporting services */}
          <div className="mt-12">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-400">Supporting Services</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {supportServices.map((svc, idx) => (
                <motion.div
                  key={svc.name}
                  {...reveal(idx * 0.05)}
                  className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-950 p-5 transition-colors duration-200 hover:border-red-900/50"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-900/30 bg-red-950/20 text-red-400">
                    <i className={`${svc.icon} text-xl`} aria-hidden="true" />
                  </span>
                  <div className="mt-4 text-sm font-semibold text-white">{svc.name}</div>
                  <div className="mt-2 text-[11px] uppercase tracking-[0.16em] text-zinc-500">Starting at</div>
                  <div className="text-lg font-semibold text-red-400">{svc.cad}</div>
                  <div className="text-sm text-zinc-400">Starting at {svc.usd}</div>
                  <div className="mt-2 text-xs leading-5 text-zinc-500">{svc.note}</div>
                </motion.div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-6 text-zinc-500">
              Power issues are handled as PSU diagnosis and PSU replacement support, bench-tested before return.
            </p>
          </div>
        </div>
      </section>

      {/* ── MID CTA ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="rounded-[2rem] border border-zinc-800 bg-gradient-to-b from-zinc-950 to-black px-6 py-9 sm:px-10 sm:py-11">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">Get Your Miner Back Running</h2>
            <p className="mt-3 max-w-xl text-sm text-zinc-400 sm:text-base">
              Clear pricing, fast communication, and no delays. Drop off in Montreal or ship from anywhere in Canada.
            </p>
            <CtaCluster className="mt-7 justify-center" />
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zinc-500">
              <span>Fast Response</span>
              <span className="text-zinc-700" aria-hidden="true">·</span>
              <span>Transparent Quotes</span>
              <span className="text-zinc-700" aria-hidden="true">·</span>
              <span>Quick Turnaround</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY US + FLEET ───────────────────────────────────────────── */}
      <section className="border-y border-zinc-900 bg-zinc-950/50">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.02fr,0.98fr]">
            <motion.div {...reveal()}>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-400">Why Clients Choose Us</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Clear Pricing. Proper Repair. No Guesswork.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">
                Every unit is professionally diagnosed, quoted clearly, repaired, tested under load, and returned ready to run —
                from our Montreal repair center with Canada wide shipping.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[t('srv_trust_1'), t('srv_trust_2'), t('srv_trust_3'), t('srv_trust_4'), t('srv_trust_5'), t('srv_trust_6')].map(
                  (item, idx) => (
                    <motion.div
                      key={idx}
                      {...reveal(idx * 0.05)}
                      className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-black/40 px-4 py-3.5 text-zinc-200"
                    >
                      <i className="ri-shield-check-line shrink-0 text-lg text-red-400" aria-hidden="true" />
                      <span className="text-sm font-medium sm:text-base">{item}</span>
                    </motion.div>
                  ),
                )}
              </div>
            </motion.div>

            <motion.div
              {...reveal(0.1)}
              className="flex flex-col justify-between rounded-[2rem] border border-red-950/60 bg-[linear-gradient(to_bottom,rgba(127,29,29,0.24),rgba(10,10,10,0.95))] p-7 sm:p-8"
            >
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-300">Fleet Support</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                  We Inspect Batches and Buy Older Mining Equipment
                </h2>
                <p className="mt-5 text-base leading-7 text-zinc-200 sm:text-lg sm:leading-8">
                  Buying a batch, cleaning inventory, or selling older ASICs? We inspect, sort, and evaluate large lots.
                </p>
              </div>

              <div className="mt-8 grid gap-3 text-sm text-zinc-200 sm:grid-cols-2">
                {fleetSupport.map((item, idx) => (
                  <motion.div
                    key={idx}
                    {...reveal(idx * 0.05)}
                    className="rounded-2xl border border-red-900/40 bg-black/30 px-4 py-4"
                  >
                    {item}
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={QUOTE_EMAIL}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-red-600 px-6 text-sm font-semibold transition-colors duration-200 hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
                >
                  Request Inspection
                </a>
                <a
                  href={TEL}
                  aria-label="Call to get a valuation"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-zinc-700 px-6 text-sm font-semibold text-zinc-200 transition-colors duration-200 hover:border-zinc-500 hover:bg-black/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
                >
                  <i className="ri-phone-fill" aria-hidden="true" />
                  Call for Valuation
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-400">Common Questions</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">Frequently Asked</h2>
        </div>
        <div className="mt-10 grid gap-3">
          {faq.map((item, idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/70"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                aria-expanded={openFaq === idx}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors duration-200 hover:bg-white/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
              >
                <span className="text-base font-medium text-white sm:text-lg">{item.q}</span>
                <i
                  className={`ri-arrow-down-s-line shrink-0 text-2xl text-zinc-500 transition-transform duration-300 ${
                    openFaq === idx ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
              <AnimatePresence initial={false}>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: reduce ? 0 : 0.26 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-zinc-800 px-6 py-5 text-sm leading-7 text-zinc-400 sm:text-base">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-red-950/50 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.18),transparent_38%),linear-gradient(to_bottom,rgba(24,24,27,0.8),rgba(0,0,0,1))]">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-400">Get Your Miner Fixed</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">Stop Losing Mining Time</h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">
            Send the issue, get a quote, and get your miner back online.
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
