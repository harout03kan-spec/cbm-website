import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import Seo, { localBusinessLd } from '../../components/feature/Seo';
import { useRecaptcha } from '../../hooks/useRecaptcha';

const TEL = '+15146047050';
const EMAIL = 'info@canadabtcminers.ca';
const ADDRESS = '6500 Route Transcanadienne, Suite 209, Saint-Laurent, Quebec H4T 1X4';
// Same WordPress REST backend the rest of the site posts to (see hosting page).
const CONTACT_ENDPOINT = 'https://wholesaleasic.com/wp-json/cbtc/v1/contact';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  company: '',
  inquiry: '',
  message: '',
};

export default function ContactPage() {
  const { t } = useTranslation();
  const { getToken } = useRecaptcha();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<Status>('idle');

  const inquiryOptions: [string, string][] = [
    ['buy',     t('ct_inq_buy')],
    ['sell',    t('ct_inq_sell')],
    ['repair',  t('ct_inq_repair')],
    ['hosting', t('ct_inq_hosting')],
    ['bulk',    t('ct_inq_bulk')],
    ['general', t('ct_inq_general')],
  ];

  const update = (key: keyof typeof initialForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const recaptchaToken = await getToken('contact_form').catch(() => '');
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, recaptcha_token: recaptchaToken }),
      });
      // Only report success on a real 2xx response — never fake a submission.
      if (res.ok) {
        setStatus('sent');
        setForm(initialForm);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const inputCls =
    'w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-600/40';
  const labelCls = 'mb-1.5 block text-sm font-medium text-zinc-300';

  return (
    <div className="min-h-screen bg-black text-white font-inter antialiased">
      <Seo
        title="Contact Canada BTC Miners | ASIC Miner Sales, Repair and Hosting"
        description="Contact Canada BTC Miners in Montreal for ASIC miner sales, repairs, hosting, and bulk orders. Call +1 514 604 7050 or send us a message and our team will reply fast."
        path="/contact"
        jsonLd={[localBusinessLd]}
      />
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-zinc-900 pt-24 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.16),transparent_32%),linear-gradient(to_bottom,rgba(18,18,18,0.7),rgba(0,0,0,1))]">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="inline-flex rounded-full border border-red-900/60 bg-red-950/30 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-red-400 sm:text-xs">
              {t('ct_hero_tag')}
            </p>
            <h1 className="mx-auto mt-5 max-w-3xl font-orbitron text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              {t('ct_hero_title')}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
              {t('ct_hero_sub')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CONTACT INFO + FORM ──────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.85fr,1.15fr]">

          {/* Info column */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-5"
          >
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-400">{t('ct_info_tag')}</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{t('ct_info_title')}</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-400">{t('ct_info_sub')}</p>
            </div>

            {/* Phone (direct call) */}
            <a
              href={`tel:${TEL}`}
              className="group flex items-center gap-4 rounded-2xl border border-zinc-900 bg-zinc-950/70 px-5 py-4 transition hover:border-red-900/60"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-900/50 bg-red-950/30 text-red-400">
                <i className="ri-phone-fill text-xl" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-xs uppercase tracking-[0.18em] text-zinc-500">{t('ct_info_phone_label')}</span>
                <span className="text-base font-semibold text-white group-hover:text-red-400">+1 514 604 7050</span>
              </span>
            </a>

            {/* Email */}
            <a
              href={`mailto:${EMAIL}`}
              className="group flex items-center gap-4 rounded-2xl border border-zinc-900 bg-zinc-950/70 px-5 py-4 transition hover:border-red-900/60"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-900/50 bg-red-950/30 text-red-400">
                <i className="ri-mail-fill text-xl" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs uppercase tracking-[0.18em] text-zinc-500">{t('ct_info_email_label')}</span>
                <span className="block truncate text-base font-semibold text-white group-hover:text-red-400">{EMAIL}</span>
              </span>
            </a>

            {/* Address */}
            <div className="flex items-start gap-4 rounded-2xl border border-zinc-900 bg-zinc-950/70 px-5 py-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-900/50 bg-red-950/30 text-red-400">
                <i className="ri-map-pin-fill text-xl" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-xs uppercase tracking-[0.18em] text-zinc-500">{t('ct_info_address_label')}</span>
                <span className="text-sm font-medium leading-6 text-zinc-200">{ADDRESS}</span>
              </span>
            </div>

            {/* Call CTA */}
            <a
              href={`tel:${TEL}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-red-500"
            >
              <i className="ri-phone-fill text-base" aria-hidden="true" />
              {t('ct_call_btn')}
            </a>
          </motion.div>

          {/* Form column */}
          <motion.div
            id="contact-form"
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="scroll-mt-28 rounded-[2rem] border border-zinc-900 bg-zinc-950/60 p-6 shadow-2xl shadow-black/40 sm:p-8"
          >
            {status === 'sent' ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-green-700/50 bg-green-950/30 text-green-400">
                  <i className="ri-check-line text-4xl" aria-hidden="true" />
                </span>
                <h3 className="mt-6 text-2xl font-semibold text-white">{t('ct_success_title')}</h3>
                <p className="mt-3 max-w-sm text-sm leading-7 text-zinc-400">{t('ct_success_sub')}</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 rounded-xl border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900"
                >
                  {t('ct_success_again')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="ct-name" className={labelCls}>{t('ct_f_name')}</label>
                    <input
                      id="ct-name" type="text" required value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      className={inputCls} placeholder={t('ct_f_name_ph')}
                    />
                  </div>
                  <div>
                    <label htmlFor="ct-email" className={labelCls}>{t('ct_f_email')}</label>
                    <input
                      id="ct-email" type="email" required value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      className={inputCls} placeholder={t('ct_f_email_ph')}
                    />
                  </div>
                  <div>
                    <label htmlFor="ct-phone" className={labelCls}>{t('ct_f_phone')}</label>
                    <input
                      id="ct-phone" type="tel" required value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      className={inputCls} placeholder={t('ct_f_phone_ph')}
                    />
                  </div>
                  <div>
                    <label htmlFor="ct-company" className={labelCls}>
                      {t('ct_f_company')} <span className="text-zinc-600">{t('ct_f_optional')}</span>
                    </label>
                    <input
                      id="ct-company" type="text" value={form.company}
                      onChange={(e) => update('company', e.target.value)}
                      className={inputCls} placeholder={t('ct_f_company_ph')}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="ct-inquiry" className={labelCls}>{t('ct_f_inquiry')}</label>
                  <select
                    id="ct-inquiry" required value={form.inquiry}
                    onChange={(e) => update('inquiry', e.target.value)}
                    className={`${inputCls} ${form.inquiry ? 'text-white' : 'text-zinc-500'}`}
                  >
                    <option value="" disabled>{t('ct_f_inquiry_ph')}</option>
                    {inquiryOptions.map(([value, label]) => (
                      <option key={value} value={value} className="bg-zinc-950 text-white">{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="ct-message" className={labelCls}>{t('ct_f_message')}</label>
                  <textarea
                    id="ct-message" required rows={5} value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                    className={`${inputCls} resize-y`} placeholder={t('ct_f_message_ph')}
                  />
                </div>

                {status === 'error' && (
                  <p className="rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-300">
                    {t('ct_error')}{' '}
                    <a href={`mailto:${EMAIL}`} className="font-semibold text-red-200 underline hover:text-white">{EMAIL}</a>
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-red-900/30 transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {status === 'sending' ? t('ct_sending') : t('ct_submit')}
                </button>

                <p className="text-xs leading-5 text-zinc-500">{t('ct_form_note')}</p>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
