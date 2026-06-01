import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { useTranslation } from 'react-i18next';
import Seo, { repairServiceLd } from '../../components/feature/Seo';

const WA = 'https://wa.me/15146047050';

export default function ServicesPage() {
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const coreServices = [
    t('srv_c1'), t('srv_c2'), t('srv_c3'),
    t('srv_c4'), t('srv_c5'), t('srv_c6'),
  ];

  const pricingLevels = [
    {
      level:    t('srv_pricing_l1_level'),
      title:    t('srv_pricing_l1_title'),
      priceCad: '$60 CAD',
      priceUsd: '$45 USD',
      featured: false,
      details:  [t('srv_pricing_l1_d1'), t('srv_pricing_l1_d2'), t('srv_pricing_l1_d3'), t('srv_pricing_l1_d4')],
    },
    {
      level:    t('srv_pricing_l2_level'),
      title:    t('srv_pricing_l2_title'),
      priceCad: '$100 CAD',
      priceUsd: '$75 USD',
      featured: true,
      details:  [t('srv_pricing_l2_d1'), t('srv_pricing_l2_d2'), t('srv_pricing_l2_d3'), t('srv_pricing_l2_d4')],
    },
    {
      level:    t('srv_pricing_l3_level'),
      title:    t('srv_pricing_l3_title'),
      priceCad: '$130 CAD',
      priceUsd: '$95 USD',
      featured: false,
      details:  [t('srv_pricing_l3_d1'), t('srv_pricing_l3_d2'), t('srv_pricing_l3_d3'), t('srv_pricing_l3_d4')],
    },
  ];

  const extraPricing: [string, string, string, string][] = [
    [t('srv_extra_diag'),     '$35 CAD',  '$25 USD',   t('srv_extra_diag_note')],
    [t('srv_extra_psu'),      '$120 CAD', '$85 USD',   t('srv_extra_psu_note')],
    [t('srv_extra_thermal'),  '$40 CAD',  '$30 USD',   t('srv_extra_thermal_note')],
    [t('srv_extra_firmware'), '$10 CAD',  '$7.50 USD', t('srv_extra_firmware_note')],
    [t('srv_extra_ctrl'),     '$45 CAD',  '$35 USD',   t('srv_extra_ctrl_note')],
  ];

  const process: [string, string, string][] = [
    ['1', t('srv_process_1'), t('srv_process_1_desc')],
    ['2', t('srv_process_2'), t('srv_process_2_desc')],
    ['3', t('srv_process_3'), t('srv_process_3_desc')],
    ['4', t('srv_process_4'), t('srv_process_4_desc')],
  ];

  const trustPoints = [
    t('srv_trust_1'), t('srv_trust_2'), t('srv_trust_3'),
    t('srv_trust_4'), t('srv_trust_5'), t('srv_trust_6'),
  ];

  const fleetSupport = [
    t('srv_fleet_1'), t('srv_fleet_2'), t('srv_fleet_3'), t('srv_fleet_4'),
  ];

  const faq = [
    { q: t('srv_faq_q1'), a: t('srv_faq_a1') },
    { q: t('srv_faq_q2'), a: t('srv_faq_a2') },
    { q: t('srv_faq_q3'), a: t('srv_faq_a3') },
    { q: t('srv_faq_q4'), a: t('srv_faq_a4') },
  ];

  const heroTrustItems = [t('srv_trust_1'), t('srv_trust_2'), t('srv_trust_3'), t('srv_trust_4')];

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
      <section className="relative overflow-hidden border-b border-zinc-900 pt-24 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.16),transparent_30%),linear-gradient(to_bottom,rgba(20,20,20,0.75),rgba(0,0,0,1))]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 sm:py-20 lg:grid-cols-[1.05fr,0.95fr] lg:py-24">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="inline-flex rounded-full border border-red-900/60 bg-red-950/30 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-red-400 sm:text-xs">
              {t('srv_hero_tag')}
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.02] tracking-tight sm:text-5xl lg:text-7xl">
              {t('srv_hero_title')}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">
              Dead boards, low hashrate, hardware errors, and PSU failures fixed fast. Units are repaired, tested, and returned ready to mine from our Montreal repair center.
            </p>
            <p className="mt-3 max-w-2xl text-sm text-zinc-400">
              Servicing Antminer, Whatsminer, and other leading ASIC mining rigs across Canada.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="#pricing"
                className="rounded-2xl bg-red-600 px-7 py-4 text-center text-base font-semibold shadow-lg shadow-red-900/30 transition hover:scale-[1.01] hover:bg-red-500"
              >
                {t('srv_hero_cta1')}
              </a>
              <a
                href={WA}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-zinc-700 px-7 py-4 text-center text-base font-semibold text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900 flex items-center justify-center gap-2"
              >
                <i className="ri-whatsapp-fill text-green-400 text-lg" />
                {t('srv_hero_cta2')}
              </a>
            </div>

            <div className="mt-8 grid max-w-md grid-cols-2 gap-x-6 gap-y-3 text-sm text-zinc-300">
              {heroTrustItems.map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                  <span className="font-medium leading-snug text-white">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="rounded-[2rem] border border-red-950/60 bg-black/40 p-4 shadow-2xl shadow-black/40">
              <img
                src="/repair-lab.jpg"
                alt="ASIC miner repair station Montreal"
                className="h-[280px] w-full rounded-[1.5rem] border border-zinc-900 object-cover sm:h-[360px] lg:h-[500px]"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CORE SERVICES ────────────────────────────────────────────── */}
      <section className="border-b border-zinc-900 bg-zinc-950/70">
        <div className="mx-auto max-w-7xl px-6 py-10 sm:py-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="lg:max-w-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-400">What We Handle</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
                {t('srv_core_title')}
              </h2>
              <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">
                We specialize in full diagnostics, hashboard and PSU repair, and preventive maintenance for Bitcoin and crypto mining equipment.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:w-[55%]">
              {coreServices.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.06 }}
                  className={`rounded-2xl px-4 py-4 text-center text-sm font-medium ${
                    idx === 0 ? 'bg-red-600 text-white' : 'border border-zinc-800 bg-black/40 text-zinc-200'
                  }`}
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS + PRICING ───────────────────────────────────── */}
      <section id="pricing" className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.82fr,1.18fr]">

          {/* How it works */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-[2rem] border border-zinc-900 bg-zinc-950 p-7 sm:p-8"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-400">How It Works</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Four Simple Steps</h2>
            <div className="mt-8 space-y-4">
              {process.map(([step, title, text], idx) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.09 }}
                  className="flex items-start gap-4 border-b border-zinc-800 pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-semibold">
                    {step}
                  </div>
                  <div>
                    <div className="text-base font-semibold">{title}</div>
                    <div className="mt-1 text-sm text-zinc-400">{text}</div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-zinc-800 bg-black/40 px-4 py-4">
              <p className="text-xs leading-6 text-zinc-400">
                Every miner is fully bench‑tested under load conditions before return to ensure stable hash performance.
              </p>
            </div>
          </motion.div>

          {/* Pricing */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-[2rem] border border-zinc-900 bg-black/60 shadow-2xl shadow-black/40"
          >
            <div className="border-b border-zinc-900 bg-zinc-950 px-7 py-6 sm:px-8">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-400">Repair Pricing</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Repair Pricing by Level</h2>
                  <p className="mt-2 text-sm text-zinc-400">Transparent ASIC repair pricing for Antminer, Whatsminer, and other supported models.</p>
                </div>
                <div className="text-sm text-zinc-400 whitespace-nowrap">Diagnostic fee credited toward repair</div>
              </div>
            </div>

            <div className="grid gap-4 p-5 sm:p-6 lg:grid-cols-3">
              {pricingLevels.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`rounded-3xl border p-6 ${item.featured ? 'border-red-800 bg-red-950/15' : 'border-zinc-900 bg-zinc-950'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold uppercase tracking-[0.18em] text-red-400">{item.level}</div>
                    {item.featured && (
                      <span className="rounded-full bg-red-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
                        Most Common
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold leading-tight">{item.title}</h3>
                  <div className="mt-5 flex items-end justify-between gap-4 border-b border-zinc-800 pb-5">
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">CAD</div>
                      <div className="text-3xl font-semibold text-red-400">{item.priceCad}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">USD</div>
                      <div className="text-lg font-medium text-zinc-300">{item.priceUsd}</div>
                    </div>
                  </div>
                  <ul className="mt-5 space-y-3 text-sm text-zinc-300">
                    {item.details.map((detail, di) => (
                      <li key={di} className="flex items-start gap-3">
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <div className="border-t border-zinc-900 px-5 py-5 sm:px-6 sm:py-6">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">Additional Services</p>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                {extraPricing.map(([name, cad, usd, note], ei) => (
                  <div key={ei} className="rounded-2xl border border-zinc-900 bg-zinc-950 px-4 py-4">
                    <div className="text-sm font-semibold text-white">{name}</div>
                    <div className="mt-2 text-lg font-semibold text-red-400">{cad}</div>
                    <div className="text-sm text-zinc-400">{usd}</div>
                    <div className="mt-2 text-xs leading-5 text-zinc-500">{note}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── MID CTA ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-[2rem] border border-zinc-800 bg-gradient-to-b from-zinc-950 to-black px-6 py-8 sm:px-10 sm:py-10">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-2xl font-semibold text-white sm:text-3xl">Get Your Miner Back Running</h3>
            <p className="mt-3 max-w-xl text-sm text-zinc-400 sm:text-base">
              Clear pricing, fast communication, and no delays.
            </p>
            <div className="mt-6 flex w-full max-w-md flex-col gap-3 sm:flex-row">
              <a
                href={WA}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-2xl bg-red-600 px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-red-500 flex items-center justify-center gap-2"
              >
                <i className="ri-whatsapp-fill text-base" />
                {t('srv_hero_cta2')}
              </a>
              <a
                href={WA}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-2xl border border-zinc-700 px-6 py-3.5 text-center text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900"
              >
                {t('srv_hero_cta1')}
              </a>
            </div>
            <div className="mt-6 flex items-center gap-6 text-xs text-zinc-500">
              <span>Fast Response</span>
              <span className="text-zinc-700">·</span>
              <span>Transparent Quotes</span>
              <span className="text-zinc-700">·</span>
              <span>Quick Turnaround</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY US + FLEET ───────────────────────────────────────────── */}
      <section className="border-y border-zinc-900 bg-zinc-950/50">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.02fr,0.98fr]">

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-400">Why Clients Choose Us</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Clear Pricing. Proper Repair. No Guesswork.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">
                Every unit is professionally diagnosed, quoted clearly, repaired, tested, and returned ready to run.
              </p>
              <div className="mt-8 space-y-4">
                {trustPoints.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.07 }}
                    className="flex items-start gap-3 border-b border-zinc-800 pb-4 text-zinc-200"
                  >
                    <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-red-500" />
                    <span className="text-base sm:text-lg">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
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

              <div className="mt-8 grid gap-3 text-sm text-zinc-200">
                {fleetSupport.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.07 }}
                    className="rounded-2xl border border-red-900/40 bg-black/30 px-4 py-4"
                  >
                    {item}
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={WA} target="_blank" rel="noopener noreferrer"
                  className="rounded-2xl bg-red-600 px-6 py-3.5 text-sm font-semibold text-center transition hover:bg-red-500">
                  Request Inspection
                </a>
                <a href={WA} target="_blank" rel="noopener noreferrer"
                  className="rounded-2xl border border-zinc-700 px-6 py-3.5 text-sm font-semibold text-zinc-200 text-center transition hover:border-zinc-500 hover:bg-black/40">
                  Get Valuation
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-400">Common Questions</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">Frequently Asked</h2>
        </div>
        <div className="mt-10 grid gap-4">
          {faq.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className={`overflow-hidden rounded-2xl border ${idx === 0 ? 'border-red-950/70 bg-red-950/10' : 'border-zinc-900 bg-black/50'}`}
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <span className="pr-4 text-lg font-medium text-white">{item.q}</span>
                <div className={`shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`}>
                  <i className="ri-arrow-down-s-line text-2xl text-zinc-500"></i>
                </div>
              </button>
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.26 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-zinc-800 px-6 py-5 text-zinc-400">{item.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-red-950/50 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.18),transparent_35%),linear-gradient(to_bottom,rgba(24,24,27,0.78),rgba(0,0,0,1))]">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center sm:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-400">Get Your Miner Fixed</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">Stop Losing Mining Time</h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">
            Send the issue, get a quote, and get your miner back online.<br />
            Canada's trusted ASIC repair experts based in Montreal.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
            <a href={WA} target="_blank" rel="noopener noreferrer"
              className="rounded-2xl bg-red-600 px-8 py-4 text-base font-semibold shadow-lg shadow-red-900/30 transition hover:scale-[1.01] hover:bg-red-500">
              {t('srv_hero_cta1')}
            </a>
            <a href={WA} target="_blank" rel="noopener noreferrer"
              className="rounded-2xl border border-zinc-700 px-8 py-4 text-center text-base font-semibold text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900 flex items-center gap-2">
              <i className="ri-whatsapp-fill text-green-400 text-lg" />
              {t('srv_hero_cta2')}
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
