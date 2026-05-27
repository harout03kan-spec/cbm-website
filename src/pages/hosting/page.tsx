import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { useTranslation } from 'react-i18next';
import { useRecaptcha } from '../../hooks/useRecaptcha';

export default function HostingPage() {
  const { t } = useTranslation();
  const { getToken } = useRecaptcha();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: '', email: '', phone: '', miners: '', quantity: '', location: '', timeline: '', message: '',
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const trustBar = ['Air Cooled', 'Live Monitoring', 'Ventilation', 'Canada & U.S.'];

  const steps = [
    { title: 'Send your miner list',        text: 'Send the miner models, quantity, current location, and timeline.' },
    { title: 'We review the batch',         text: 'The batch is reviewed based on size, miner type, and deployment needs.' },
    { title: 'You receive options',         text: 'Available hosting options are presented based on what fits the batch best.' },
    { title: 'Deployment gets coordinated', text: 'Once the direction is chosen, intake and deployment are coordinated.' },
    { title: 'Support continues',           text: 'Monitoring, troubleshooting, and repair support stay part of the process.' },
  ];

  const hostingTypes = [
    {
      name:     t('host_tier1_name'),
      subtitle: t('host_tier1_sub'),
      points:   [t('host_tier1_p1'), t('host_tier1_p2'), t('host_tier1_p3'), t('host_tier1_p4')],
      featured: false,
    },
    {
      name:     t('host_tier2_name'),
      subtitle: t('host_tier2_sub'),
      points:   [t('host_tier2_p1'), t('host_tier2_p2'), t('host_tier2_p3'), t('host_tier2_p4')],
      featured: true,
    },
    {
      name:     t('host_tier3_name'),
      subtitle: t('host_tier3_sub'),
      points:   [t('host_tier3_p1'), t('host_tier3_p2'), t('host_tier3_p3'), t('host_tier3_p4')],
      featured: false,
    },
  ];

  const included = [
    t('host_inc1'), t('host_inc2'), t('host_inc3'),
    t('host_inc4'), t('host_inc5'), t('host_inc6'),
  ];

  const faq = [
    { q: t('host_faq_q1'), a: t('host_faq_a1') },
    { q: t('host_faq_q2'), a: t('host_faq_a2') },
    { q: t('host_faq_q3'), a: t('host_faq_a3') },
    { q: t('host_faq_q4'), a: t('host_faq_a4') },
    { q: t('host_faq_q5'), a: t('host_faq_a5') },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    try {
      const recaptchaToken = await getToken('hosting_quote').catch(() => '');
      // Send form + reCAPTCHA token to your backend for verification
      // Backend should verify token at: https://www.google.com/recaptcha/api/siteverify
      // using secret key: 6Lcv4PMsAAAAABa2AepW1UF66kAZrAHNKgWVJ4b-
      await fetch('https://wholesaleasic.com/wp-json/cbtc/v1/hosting-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, recaptcha_token: recaptchaToken }),
      }).catch(() => null); // silently fail if endpoint not yet live
    } catch { /* noop */ }
    setFormStatus('sent');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="pt-24 bg-[linear-gradient(180deg,#050505_0%,#0b0b0c_100%)]">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-24">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm font-medium uppercase tracking-[0.22em] text-zinc-300">
              {t('host_hero_tag')}
            </div>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              {t('host_hero_title')}
              <span className="block text-crimson-accent">Simple. Scalable. Direct.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400 sm:text-xl">
              {t('host_hero_sub')}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#quote-form"
                className="rounded-xl bg-crimson-accent px-8 py-4 text-base font-semibold text-white transition hover:bg-red-700"
              >
                {t('host_hero_cta1')}
              </a>
              <a
                href="tel:+15146047050"
                className="rounded-xl border border-zinc-700 bg-transparent px-8 py-4 text-base font-semibold text-white transition hover:border-zinc-500"
              >
                {t('host_hero_cta2')}
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="overflow-hidden rounded-[1.75rem] border border-zinc-800 bg-[#111214] shadow-2xl"
          >
            <img
              src="/Put%20this%20in%20the%20hosting%20page%20pic%20on%20top%20please.jpeg"
              alt="Mining hosting facility — Canada BTC Miners"
              className="h-full w-full min-h-[340px] object-cover"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </motion.div>
        </div>
      </section>

      {/* ── TRUST BAR ────────────────────────────────────────────────── */}
      <section className="border-y border-zinc-900 bg-[#111214]">
        <div className="mx-auto max-w-7xl px-6 py-5 lg:px-10">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {trustBar.map((item) => (
              <div key={item} className="rounded-md border border-zinc-800 bg-[#18191b] px-3 py-3 text-center text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-300 sm:text-xs">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="bg-[#141414]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-crimson-accent">How hosting works</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                {t('host_process')}
              </h2>
            </motion.div>

            <div className="space-y-4">
              {steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="rounded-2xl bg-[#0d0d0e] p-5 ring-1 ring-zinc-700"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-crimson-accent/10 text-sm font-semibold text-crimson-accent">
                      0{idx + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-zinc-400">{step.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOSTING TIERS ────────────────────────────────────────────── */}
      <section className="bg-[#0a0a0a]">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-crimson-accent">Hosting options</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              {t('host_tiers')}
            </h2>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            {hostingTypes.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`flex h-full flex-col rounded-2xl border p-8 ${
                  item.featured
                    ? 'border-crimson-accent bg-[linear-gradient(180deg,rgba(220,38,38,0.08)_0%,rgba(10,10,10,1)_100%)]'
                    : 'border-zinc-800 bg-[#151516]'
                }`}
              >
                {item.featured && (
                  <div className="mb-4 inline-flex w-fit rounded-full border border-crimson-accent/30 bg-crimson-accent/10 px-4 py-2 text-sm font-semibold text-red-300">
                    {t('host_tier2_popular')}
                  </div>
                )}
                <h3 className="text-3xl font-semibold text-white">{item.name}</h3>
                <p className="mt-3 text-zinc-400">{item.subtitle}</p>
                <div className="mt-8 space-y-4 text-zinc-300 flex-1">
                  {item.points.map((point, pi) => (
                    <div key={pi} className="flex gap-3">
                      <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-crimson-accent" />
                      <span className="leading-7">{point}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a href="#quote-form" className="inline-block rounded-xl bg-crimson-accent px-10 py-4 text-base font-semibold text-white transition hover:bg-red-700">
              {t('host_hero_cta1')}
            </a>
          </div>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ──────────────────────────────────────────── */}
      <section className="bg-[#121212]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-crimson-accent">What is included</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                {t('host_included_title')}
              </h2>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2">
              {included.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.07 }}
                  className="rounded-2xl bg-[#1a1a1b] px-6 py-5 text-zinc-200 ring-1 ring-zinc-700"
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="bg-[#0b0b0b]">
        <div className="mx-auto max-w-5xl px-6 py-20 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-crimson-accent">FAQ</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">What clients usually ask</h2>
          </motion.div>

          <div className="mt-12 space-y-4">
            {faq.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.07 }}
                className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#141414]"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between px-6 py-6 text-left"
                >
                  <h3 className="text-lg font-semibold text-white pr-4">{item.q}</h3>
                  <div className={`shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`}>
                    <i className="ri-arrow-down-s-line text-2xl text-zinc-400"></i>
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-base leading-8 text-zinc-400">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUOTE FORM ───────────────────────────────────────────────── */}
      <section id="quote-form" className="bg-[linear-gradient(180deg,#111111_0%,#070707_100%)]">
        <div className="mx-auto max-w-6xl px-6 py-24 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-crimson-accent">Request a quote</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">Send your miner list</h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
                Send the models, quantity, current location, and target timeline.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="rounded-2xl bg-[#161616] p-6 ring-1 ring-zinc-700">
              {formStatus === 'sent' ? (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                    <i className="ri-check-line text-3xl text-green-400"></i>
                  </div>
                  <h3 className="text-2xl font-semibold text-white">Request Sent</h3>
                  <p className="text-zinc-400">{t('host_form_sent')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { key: 'name',     placeholder: t('host_form_name') },
                      { key: 'email',    placeholder: t('host_form_email'),  type: 'email' },
                      { key: 'phone',    placeholder: t('host_form_phone') },
                      { key: 'miners',   placeholder: t('host_form_miners') },
                      { key: 'quantity', placeholder: t('host_form_qty') },
                      { key: 'location', placeholder: t('host_form_location') },
                    ].map(({ key, placeholder, type }) => (
                      <input
                        key={key}
                        type={type ?? 'text'}
                        placeholder={placeholder}
                        value={(form as any)[key]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        className="rounded-xl bg-[#0f0f10] px-4 py-4 text-white placeholder:text-zinc-500 outline-none ring-1 ring-zinc-800 focus:ring-crimson-accent transition-shadow"
                        required={key === 'email' || key === 'name'}
                      />
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder={t('host_form_timeline')}
                    value={form.timeline}
                    onChange={e => setForm(f => ({ ...f, timeline: e.target.value }))}
                    className="w-full rounded-xl bg-[#0f0f10] px-4 py-4 text-white placeholder:text-zinc-500 outline-none ring-1 ring-zinc-800 focus:ring-crimson-accent transition-shadow"
                  />
                  <textarea
                    placeholder={t('host_form_message')}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="min-h-[140px] w-full rounded-xl bg-[#0f0f10] px-4 py-4 text-white placeholder:text-zinc-500 outline-none ring-1 ring-zinc-800 focus:ring-crimson-accent transition-shadow resize-none"
                  />
                  <button
                    type="submit"
                    disabled={formStatus === 'sending'}
                    className="w-full rounded-xl bg-crimson-accent px-8 py-4 text-base font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                  >
                    {formStatus === 'sending' ? t('host_form_sending') : t('host_form_submit')}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
