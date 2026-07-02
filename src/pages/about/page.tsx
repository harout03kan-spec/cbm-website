import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import Seo, { localBusinessLd } from '../../components/feature/Seo';

export default function AboutPage() {
  const { t } = useTranslation();
  const CALL_LABEL = t('about_call');
  const { pathname } = useLocation();
  const isFrench = pathname === '/fr' || pathname.startsWith('/fr/');
  // Keep on-page CTAs within the active locale (e.g. /fr/about → /fr/shop).
  const localize = (path: string) => (isFrench ? `/fr${path === '/' ? '' : path}` : path);

  // Non-numeric, verifiable trust points — no fabricated statistics.
  const trustPoints = [
    { title: t('about_tp1_title'), sub: t('about_tp1_sub') },
    { title: t('about_tp2_title'), sub: t('about_tp2_sub') },
    { title: t('about_tp3_title'), sub: t('about_tp3_sub') },
    { title: t('about_tp4_title'), sub: t('about_tp4_sub') },
  ];

  const differentiators = [
    { text: t('about_diff_1') },
    { text: t('about_diff_2') },
    { text: t('about_diff_3') },
    { text: t('about_diff_4') },
  ];

  const markets = [t('about_m1'), t('about_m2'), t('about_m3')];

  const audiences = [
    { icon: 'ri-user-line', label: t('about_a1'), desc: t('about_a1_desc') },
    { icon: 'ri-tools-line', label: t('about_a2'), desc: t('about_a2_desc') },
    { icon: 'ri-store-2-line', label: t('about_a3'), desc: t('about_a3_desc') },
    { icon: 'ri-server-line', label: t('about_a4'), desc: t('about_a4_desc') },
  ];

  const values = [
    { icon: 'ri-map-pin-line', title: t('about_v1_title'), text: t('about_v1_text') },
    { icon: 'ri-tools-line', title: t('about_v2_title'), text: t('about_v2_text') },
    { icon: 'ri-price-tag-3-line', title: t('about_v3_title'), text: t('about_v3_text') },
    { icon: 'ri-customer-service-2-line', title: t('about_v4_title'), text: t('about_v4_text') },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Seo
        title={t('about_seo_title')}
        description={t('about_seo_desc')}
        path="/about"
        jsonLd={[localBusinessLd]}
      />
      <Navbar />

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden border-b border-zinc-900 pt-24"
        itemScope
        itemType="https://schema.org/Organization"
      >
        <meta itemProp="name" content="Canada BTC Miners" />
        <meta itemProp="telephone" content="+15146047050" />
        <meta itemProp="address" content="6500 Route Transcanadienne, Suite 209, Saint-Laurent, Quebec H4T 1X4" />
        <meta itemProp="url" content="https://canadabtcminers.ca" />

        {/* Background photo */}
        <img
          src="/Put%20this%20in%20the%20about%20us%20page%20background%20instead%20of%20the%20miner.jpeg"
          alt={t('about_hero_img_alt')}
          className="absolute inset-0 w-full h-full object-cover object-top sm:object-center pointer-events-none"
          loading="eager"
        />
        {/* Dark overlay so text stays readable */}
        <div className="absolute inset-0 bg-black/70 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-4xl px-5 py-20 sm:px-6 sm:py-28 lg:py-32 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-crimson-accent sm:text-sm">
            {t('about_hero_tag')}
          </p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl lg:text-[3.4rem] lg:leading-[1.1]">
            {t('about_hero_title')}{' '}
            <span className="text-crimson-accent">{t('about_hero_accent')}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base sm:leading-8">
            {t('about_hero_sub')}
          </p>

          {/* Trust badges */}
          <div className="mt-6 flex flex-wrap gap-3 justify-center text-xs text-zinc-400">
            <span className="flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800 rounded-full px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              {t('about_badge1')}
            </span>
            <span className="flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800 rounded-full px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              {t('about_badge2')}
            </span>
            <span className="flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800 rounded-full px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              {t('about_badge3')}
            </span>
          </div>

          {/* Hero CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:+15146047050"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-7 py-4 font-semibold hover:bg-red-500 transition-colors text-base"
              aria-label={t('about_call_aria')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {CALL_LABEL}
            </a>
            <Link
              to={localize('/shop')}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-black/40 px-7 py-4 font-semibold hover:bg-zinc-900 transition-colors"
            >
              {t('about_shop_cta')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRUST POINTS — non-numeric, no fabricated statistics ── */}
      <section className="border-b border-zinc-900 bg-zinc-950" aria-label={t('about_tp_aria')}>
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-5 py-10 sm:px-6 sm:gap-6 sm:py-12 lg:grid-cols-4">
          {trustPoints.map((item) => (
            <div key={item.title} className="rounded-2xl border border-zinc-800 bg-black/40 px-4 py-5 text-center sm:px-5 sm:py-6 hover:border-red-800 transition-colors">
              <div className="text-base font-semibold text-crimson-accent sm:text-lg">{item.title}</div>
              <div className="mt-2 text-xs text-zinc-400 sm:text-sm">{item.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT BAR ── */}
      <div className="bg-red-600/10 border-b border-red-900/30 px-5 py-4">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <span className="text-zinc-300">{t('about_contactbar')}</span>
          <div className="flex gap-6 items-center flex-wrap justify-center">
            <a href="tel:+15146047050" className="font-semibold text-white hover:text-crimson-accent transition-colors flex items-center gap-1.5">
              <svg className="w-4 h-4 text-crimson-accent" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {CALL_LABEL}
            </a>
            <a href="mailto:info@canadabtcminers.ca" className="font-semibold text-crimson-accent hover:text-crimson-accent transition-colors">
              info@canadabtcminers.ca
            </a>
          </div>
        </div>
      </div>

      {/* ── LEADERSHIP ── */}
      <section className="border-y border-zinc-900 bg-zinc-950/60">
        <div className="mx-auto max-w-5xl px-5 py-16 text-center sm:px-6 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-crimson-accent sm:text-sm">{t('about_leadership_tag')}</p>
          <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">{t('about_leadership_title')}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-zinc-400">
            {t('about_leadership_sub')}
          </p>
          <div className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6">
            {[
              { initials: 'HK', name: 'Harout Kantanakian', role: t('about_harout_role'), bio: t('about_harout_bio') },
              { initials: 'PD', name: 'Patrice Destin',      role: t('about_patrice_role'), bio: t('about_patrice_bio') },
            ].map((person) => (
              <div key={person.name} className="rounded-[2rem] border border-zinc-800 bg-black/40 p-6 sm:p-7 text-left hover:border-zinc-600 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-600/20 border border-red-900/40 flex items-center justify-center text-base font-bold text-crimson-accent flex-shrink-0">
                    {person.initials}
                  </div>
                  <div>
                    <div className="text-xl font-semibold">{person.name}</div>
                    <div className="text-sm text-crimson-accent">{person.role}</div>
                  </div>
                </div>
                <div className="text-sm leading-7 text-zinc-300 sm:text-base">{person.bio}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY + DIFFERENTIATORS ── */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 flex flex-col gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-crimson-accent sm:text-sm">{t('about_why_tag')}</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
            {t('about_why_title')}
          </h2>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base sm:leading-8">
            {t('about_why_desc')}
          </p>
        </div>
        <div className="rounded-[2rem] border border-red-950/60 bg-zinc-950 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-crimson-accent sm:text-sm mb-6">{t('about_diff_tag')}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {differentiators.map((item) => (
              <div key={item.text} className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-black/50 px-4 py-5 text-sm font-medium text-zinc-200 sm:text-base hover:border-zinc-600 transition-colors">
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOCATION + MAP ── */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 flex flex-col gap-6">
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-crimson-accent sm:text-sm">{t('about_location_tag')}</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">{t('about_location_title')}</h2>
          <div className="mt-6 space-y-3 text-sm leading-7 text-zinc-300 sm:text-base sm:leading-8">
            <p>{t('about_location_p1')}</p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=6500%20Rte%20Transcanadienne%2C%20Suite%20209%2C%20Saint-Laurent%2C%20QC%20H4T%201X4%2C%20Canada"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open address in Google Maps"
              className="flex items-start gap-2 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 text-crimson-accent mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{t('about_address')}</span>
            </a>
            <p className="flex items-center gap-2">
              <svg className="w-5 h-5 text-crimson-accent flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href="tel:+15146047050" className="font-semibold text-white hover:text-crimson-accent transition-colors">{CALL_LABEL}</a>
            </p>
            <p className="flex items-center gap-2">
              <svg className="w-5 h-5 text-crimson-accent flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:info@canadabtcminers.ca" className="font-semibold text-white hover:text-crimson-accent transition-colors">info@canadabtcminers.ca</a>
            </p>
          </div>
        </div>

        {/* Google Map — dark-themed iframe */}
        <div className="overflow-hidden rounded-[2rem] border border-red-950/60 bg-black h-72 sm:h-80 lg:h-96">
          <iframe
            title={t('about_map_title')}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2795.3!2d-73.745!3d45.498!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc9390c1d3e4a93%3A0x0!2s6500+Rte+Transcanadienne%2C+Saint-Laurent%2C+QC+H4T+1X4!5e0!3m2!1sen!2sca!4v1"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) saturate(0.7)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {/* ── MARKETS ── */}
      <section className="border-y border-zinc-900 bg-zinc-950/60">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20">
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-crimson-accent sm:text-sm">{t('about_markets_tag')}</p>
              <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">{t('about_markets_title')}</h2>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base sm:leading-8">
                {t('about_markets_desc')}
              </p>
            </div>
            <div className="rounded-[2rem] border border-red-950/60 bg-[linear-gradient(135deg,rgba(127,29,29,0.18),rgba(12,12,12,0.95))] p-6 sm:p-8">
              <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-3">
                {markets.map((item) => (
                  <div key={item} className="rounded-2xl border border-red-900/30 bg-black/30 px-3 py-4 text-center text-sm font-medium text-zinc-100 sm:px-4 sm:py-5 sm:text-base">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHO WE WORK WITH ── */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-crimson-accent sm:text-sm">{t('about_who_tag')}</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">{t('about_who_title')}</h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-zinc-300 sm:text-base sm:leading-8">{t('about_who_desc')}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {audiences.map((item) => (
              <div key={item.label} className="flex items-start gap-4 rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-5 hover:border-zinc-600 transition-colors">
                <i className={`${item.icon} text-2xl text-crimson-accent mt-0.5`} aria-hidden="true"></i>
                <div>
                  <div className="font-semibold text-white sm:text-lg">{item.label}</div>
                  <div className="mt-1 text-sm text-zinc-400">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CORE VALUES ── */}
      <section className="border-y border-zinc-900 bg-zinc-950">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-crimson-accent sm:text-sm">{t('about_values_tag')}</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl lg:text-5xl">{t('about_values_title')}</h2>
          </div>
          <div className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
            {values.map((item) => (
              <div key={item.title} className="rounded-[2rem] border border-zinc-800 bg-black p-6 text-center transition hover:border-red-600 sm:p-7 group">
                <div className="mb-3"><i className={`${item.icon} text-3xl text-crimson-accent`} aria-hidden="true"></i></div>
                <div className="text-lg font-semibold text-white group-hover:text-crimson-accent transition-colors">{item.title}</div>
                <div className="mt-3 text-sm leading-7 text-zinc-400">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLIENT FEEDBACK — link to real Google reviews, no fabricated review text ── */}
      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-20 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-crimson-accent sm:text-sm">{t('about_feedback_tag')}</p>
        <h2 className="mt-4 text-3xl font-semibold sm:text-4xl lg:text-5xl">{t('about_feedback_title')}</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-zinc-300 sm:text-base">
          {t('about_feedback_desc')}
        </p>
        <a
          href="https://g.page/r/CdfEOvDvGeTDEBM/review"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-black/40 px-6 py-3.5 font-semibold text-white hover:bg-zinc-900 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {t('about_feedback_cta')}
        </a>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative overflow-hidden border-t border-zinc-900 bg-[linear-gradient(135deg,#0f0f10,#171717_45%,#101012)] px-5 py-20 text-center sm:px-6 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(220,38,38,0.10),transparent_65%)] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-crimson-accent sm:text-sm mb-4">{t('about_final_tag')}</p>
          <h2 className="text-3xl font-semibold sm:text-4xl lg:text-5xl">{t('about_final_title')}</h2>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-zinc-300 sm:text-base">
            {t('about_final_sub')}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-4">
            <a
              href="tel:+15146047050"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-8 py-4 font-semibold hover:bg-red-500 transition-colors text-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {CALL_LABEL}
            </a>
            <Link to={localize('/contact')} className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 px-8 py-4 font-semibold hover:bg-zinc-900 transition-colors">
              {t('about_final_contact')}
            </Link>
            <Link to={localize('/services')} className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 px-8 py-4 font-semibold hover:bg-zinc-900 transition-colors">
              {t('about_final_services')}
            </Link>
            <Link to={localize('/shop')} className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 px-8 py-4 font-semibold hover:bg-zinc-900 transition-colors">
              {t('about_shop_cta')}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
