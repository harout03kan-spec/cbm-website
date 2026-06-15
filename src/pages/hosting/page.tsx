import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { useTranslation } from 'react-i18next';
import { useRecaptcha } from '../../hooks/useRecaptcha';
import Seo from '../../components/feature/Seo';

export default function HostingPage() {
  const { t } = useTranslation();
  const { getToken } = useRecaptcha();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: '', email: '', phone: '', miners: '', quantity: '', location: '', timeline: '', message: '',
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const trustBar = [t('host_trust1'), t('host_trust2'), t('host_trust3'), t('host_trust4')];

  const steps = [
    { title: t('host_step1_title'), text: t('host_step1_text') },
    { title: t('host_step2_title'), text: t('host_step2_text') },
    { title: t('host_step3_title'), text: t('host_step3_text') },
    { title: t('host_step4_title'), text: t('host_step4_text') },
    { title: t('host_step5_title'), text: t('host_step5_text') },
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

  // Hosting highlights — what the hosting service covers (no claims/numbers).
  const highlights = [
    { icon: 'ri-temp-cold-line',           title: t('host_hl1_title'), desc: t('host_hl1_desc') },
    { icon: 'ri-line-chart-line',          title: t('host_hl2_title'), desc: t('host_hl2_desc') },
    { icon: 'ri-plug-line',                title: t('host_hl3_title'), desc: t('host_hl3_desc') },
    { icon: 'ri-tools-line',               title: t('host_hl4_title'), desc: t('host_hl4_desc') },
    { icon: 'ri-customer-service-2-line',  title: t('host_hl5_title'), desc: t('host_hl5_desc') },
    { icon: 'ri-global-line',              title: t('host_hl6_title'), desc: t('host_hl6_desc') },
  ];

  // Why host with us — honest home-vs-facility comparison (no fake claims).
  const whyHome = [t('host_why_home1'), t('host_why_home2'), t('host_why_home3'), t('host_why_home4')];
  const whyUs   = [t('host_why_us1'), t('host_why_us2'), t('host_why_us3'), t('host_why_us4')];

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
      // The browser sends the form + a reCAPTCHA token to the backend, which
      // verifies the token server-side at
      // https://www.google.com/recaptcha/api/siteverify using the secret key held
      // only in server environment variables (never in this frontend bundle).
      const res = await fetch('https://wholesaleasic.com/wp-json/cbtc/v1/hosting-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, recaptcha_token: recaptchaToken }),
      });
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
      setFormStatus('sent');
    } catch {
      // Only surface success on a confirmed response; otherwise show an error.
      setFormStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Seo
        title={t('host_seo_title')}
        description={t('host_seo_desc')}
        path="/hosting"
      />
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="pt-24 bg-[linear-gradient(180deg,#050505_0%,#0b0b0c_100%)]">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-24">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex rounded-full border border-crimson-accent/30 bg-crimson-accent/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.22em] text-crimson-accent">
              {t('host_hero_tag')}
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {t('host_hero_title')}
              <span className="block text-crimson-accent">{t('host_hero_tagline')}</span>
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
              src="/hosting-hero.jpeg"
              alt={t('host_hero_img_alt')}
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

      {/* ── HOSTING HIGHLIGHTS (unified divided panel, not a card grid) ── */}
      <section className="bg-[#0a0a0a]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-crimson-accent">{t('host_hl_eyebrow')}</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{t('host_hl_title')}</h2>
              <p className="mt-5 max-w-md text-base leading-7 text-zinc-400">{t('host_hl_sub')}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="grid grid-cols-1 divide-y divide-zinc-800/80 overflow-hidden rounded-2xl border border-zinc-800 bg-[#121214] sm:grid-cols-2 sm:divide-y-0 sm:[&>*:nth-child(even)]:border-l sm:[&>*:nth-child(even)]:border-zinc-800/80 sm:[&>*:nth-child(n+3)]:border-t sm:[&>*:nth-child(n+3)]:border-zinc-800/80"
            >
              {highlights.map((h) => (
                <div key={h.title} className="flex items-start gap-3 p-5">
                  <i className={`${h.icon} mt-0.5 text-lg text-crimson-accent`} aria-hidden="true" />
                  <div>
                    <h3 className="text-sm font-semibold text-white">{h.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-zinc-400">{h.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS (full-width horizontal stepper) ─────────────── */}
      <section className="border-t border-zinc-900 bg-[#141414]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-crimson-accent">{t('host_process_eyebrow')}</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{t('host_process')}</h2>
            <p className="mt-4 text-base leading-7 text-zinc-400">{t('host_process_sub')}</p>
          </motion.div>

          <ol className="mt-12 grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step, idx) => {
              const isLast = idx === steps.length - 1;
              return (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.07 }}
                  className="relative"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-crimson-accent/30 bg-crimson-accent/10 text-sm font-semibold text-crimson-accent">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    {!isLast && (
                      <span aria-hidden="true" className="hidden h-px flex-1 bg-gradient-to-r from-crimson-accent/40 to-transparent lg:block" />
                    )}
                  </div>
                  <h3 className="mt-4 text-base font-semibold leading-snug text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{step.text}</p>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ── HOSTING TIERS ────────────────────────────────────────────── */}
      <section className="border-t border-zinc-900 bg-[#0d0d0d]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-crimson-accent">{t('host_options_eyebrow')}</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              {t('host_tiers')}
            </h2>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
            {hostingTypes.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative flex h-full flex-col rounded-2xl border p-8 ${
                  item.featured
                    ? 'border-crimson-accent bg-[linear-gradient(180deg,rgba(220,38,38,0.08)_0%,rgba(10,10,10,1)_100%)]'
                    : 'border-zinc-800 bg-[#151516]'
                }`}
              >
                {item.featured && (
                  <div className="absolute right-5 top-5 inline-flex rounded-full border border-crimson-accent/30 bg-crimson-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-red-300">
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
      <section className="border-t border-zinc-900 bg-[#121212]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:sticky lg:top-28">
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-crimson-accent">{t('host_included_eyebrow')}</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                {t('host_included_title')}
              </h2>
              <p className="mt-5 max-w-md text-base leading-7 text-zinc-400">{t('host_included_sub')}</p>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2">
              {included.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.07 }}
                  className="flex items-start gap-3 rounded-2xl bg-[#1a1a1b] px-5 py-5 text-zinc-200 ring-1 ring-zinc-700"
                >
                  <i className="ri-check-line mt-0.5 shrink-0 text-lg text-crimson-accent" aria-hidden="true" />
                  <span className="leading-6">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY HOST WITH US (vs self-host) ──────────────────────────── */}
      <section className="border-t border-zinc-900 bg-[#0a0a0a]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-crimson-accent">{t('host_why_eyebrow')}</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{t('host_why_title')}</h2>
          </motion.div>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="rounded-2xl border border-zinc-800 bg-[#141416] p-7"
            >
              <h3 className="text-lg font-semibold text-zinc-300">{t('host_why_home_title')}</h3>
              <ul className="mt-5 space-y-3">
                {whyHome.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm leading-6 text-zinc-400">
                    <i className="ri-close-line mt-0.5 shrink-0 text-lg text-zinc-500" aria-hidden="true" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }}
              className="rounded-2xl border border-crimson-accent/40 bg-[linear-gradient(180deg,rgba(220,38,38,0.08)_0%,rgba(10,10,10,1)_100%)] p-7"
            >
              <h3 className="text-lg font-semibold text-white">{t('host_why_us_title')}</h3>
              <ul className="mt-5 space-y-3">
                {whyUs.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm leading-6 text-zinc-200">
                    <i className="ri-check-line mt-0.5 shrink-0 text-lg text-crimson-accent" aria-hidden="true" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
          <div className="mt-10">
            <a href="#quote-form" className="inline-block rounded-xl bg-crimson-accent px-8 py-4 text-base font-semibold text-white transition hover:bg-red-700">
              {t('host_hero_cta1')}
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="bg-[#0b0b0b]">
        <div className="mx-auto max-w-5xl px-6 py-20 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-crimson-accent">{t('host_faq_eyebrow')}</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{t('host_faq_heading')}</h2>
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
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-crimson-accent">{t('host_form_eyebrow')}</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{t('host_form_heading')}</h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
                {t('host_form_sub')}
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="rounded-2xl bg-[#161616] p-6 ring-1 ring-zinc-700">
              {formStatus === 'sent' ? (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                    <i className="ri-check-line text-3xl text-green-400"></i>
                  </div>
                  <h3 className="text-2xl font-semibold text-white">{t('host_form_sent_title')}</h3>
                  <p className="text-zinc-400">{t('host_form_sent')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {formStatus === 'error' && (
                    <div className="flex items-start gap-3 rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-3" role="alert">
                      <i className="ri-error-warning-line mt-0.5 text-lg text-red-400" aria-hidden="true" />
                      <div className="text-sm leading-6 text-red-200">
                        <p>{t('host_form_error')}</p>
                        <p className="mt-1">
                          <a href="tel:+15146047050" className="font-semibold underline">+1 (514) 604-7050</a>
                          <span className="px-2 text-red-400/60" aria-hidden="true">·</span>
                          <a href="https://wa.me/15146047050" className="font-semibold underline">WhatsApp</a>
                        </p>
                      </div>
                    </div>
                  )}
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
