import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import Seo, { localBusinessLd } from '../../components/feature/Seo';

const TEL = 'tel:+15146047050';
const EMAIL = 'info@canadabtcminers.ca';
const GOOGLE_REVIEW = 'https://g.page/r/CdfEOvDvGeTDEBM/review';

export default function AboutPage() {
  const { t } = useTranslation();
  const CALL_LABEL = t('about_call');

  // What we do — the four parts of the business, each links to its page.
  const whatWeDo = [
    { icon: 'ri-shopping-cart-2-line', title: t('about_wwd_c1_title'), desc: t('about_wwd_c1_desc'), cta: t('about_wwd_c1_cta'), to: '/shop' },
    { icon: 'ri-tools-line', title: t('about_wwd_c2_title'), desc: t('about_wwd_c2_desc'), cta: t('about_wwd_c2_cta'), to: '/services' },
    { icon: 'ri-stack-line', title: t('about_wwd_c3_title'), desc: t('about_wwd_c3_desc'), cta: t('about_wwd_c3_cta'), to: '/bulk-deals' },
    { icon: 'ri-server-line', title: t('about_wwd_c4_title'), desc: t('about_wwd_c4_desc'), cta: t('about_wwd_c4_cta'), to: '/hosting' },
  ];

  // Montreal repair center capabilities — non-numeric, no fabricated claims.
  const repairCaps = [
    'about_repair_p1', 'about_repair_p2', 'about_repair_p3',
    'about_repair_p4', 'about_repair_p5', 'about_repair_p6',
  ].map((k) => t(k));

  // Bulk & sourcing points.
  const sourcing = [
    { icon: 'ri-refresh-line', title: t('about_src_p1_title'), desc: t('about_src_p1_desc') },
    { icon: 'ri-stack-line', title: t('about_src_p2_title'), desc: t('about_src_p2_desc') },
    { icon: 'ri-building-line', title: t('about_src_p3_title'), desc: t('about_src_p3_desc') },
    { icon: 'ri-team-line', title: t('about_src_p4_title'), desc: t('about_src_p4_desc') },
  ];

  // How we work — honest trust points, no numbers/guarantees.
  const howWeWork = [
    { icon: 'ri-price-tag-3-line', label: t('about_how_1') },
    { icon: 'ri-file-list-3-line', label: t('about_how_2') },
    { icon: 'ri-phone-line', label: t('about_how_3') },
    { icon: 'ri-truck-line', label: t('about_how_4') },
    { icon: 'ri-stack-line', label: t('about_how_5') },
  ];

  const leadership = [
    { initials: 'HK', name: 'Harout Kantanakian', role: t('about_harout_role'), bio: t('about_harout_bio') },
    { initials: 'PD', name: 'Patrice Destin', role: t('about_patrice_role'), bio: t('about_patrice_bio') },
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

      {/* ── 1. HERO ──────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden border-b border-zinc-900 pt-24"
        itemScope
        itemType="https://schema.org/Organization"
      >
        <meta itemProp="name" content="Canada BTC Miners" />
        <meta itemProp="telephone" content="+15146047050" />
        <meta itemProp="address" content="6500 Route Transcanadienne, Suite 209, Saint-Laurent, Quebec H4T 1X4" />
        <meta itemProp="url" content="https://wholesaleasic.com" />

        <img
          src="/about-hero.jpeg"
          alt={t('about_hero_img_alt')}
          className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/72 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-4xl px-5 py-20 text-center sm:px-6 sm:py-28 lg:py-32">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-crimson-accent sm:text-sm">{t('about_hero_tag')}</p>
          <h1 className="mt-5 text-balance text-4xl font-semibold leading-tight sm:text-5xl lg:text-[3.4rem] lg:leading-[1.1]">
            {t('about_hero_title')}{' '}
            <span className="text-crimson-accent">{t('about_hero_accent')}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base sm:leading-8">{t('about_hero_sub')}</p>

          <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs text-zinc-300">
            {[t('about_badge1'), t('about_badge2'), t('about_badge3')].map((b) => (
              <span key={b} className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
                {b}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={TEL} aria-label={t('about_call_aria')} className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-red-600 px-7 font-semibold text-white transition-colors hover:bg-red-500">
              <i className="ri-phone-fill text-lg" aria-hidden="true" />
              {CALL_LABEL}
            </a>
            <Link to="/shop" className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-black/40 px-7 font-semibold text-white transition-colors hover:bg-zinc-900">
              {t('about_shop_cta')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. WHO WE ARE ────────────────────────────────────────────── */}
      <section className="border-b border-zinc-900 bg-zinc-950/40">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-crimson-accent sm:text-sm">{t('about_wwa_tag')}</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">{t('about_wwa_title')}</h2>
            <p className="mt-6 text-sm leading-7 text-zinc-300 sm:text-base sm:leading-8">{t('about_wwa_p1')}</p>
            <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base sm:leading-8">{t('about_wwa_p2')}</p>
          </div>

          {/* Real operators — keeps legitimacy without fluff */}
          <div className="mt-10 grid gap-5 sm:grid-cols-2 sm:gap-6">
            {leadership.map((person) => (
              <div key={person.name} className="rounded-[2rem] border border-zinc-800 bg-black/40 p-6 sm:p-7">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-red-900/40 bg-red-600/20 text-base font-bold text-crimson-accent">{person.initials}</div>
                  <div>
                    <div className="text-xl font-semibold">{person.name}</div>
                    <div className="text-sm text-crimson-accent">{person.role}</div>
                  </div>
                </div>
                <p className="text-sm leading-7 text-zinc-300 sm:text-base">{person.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. WHAT WE DO ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-crimson-accent sm:text-sm">{t('about_wwd_tag')}</p>
          <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">{t('about_wwd_title')}</h2>
          <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">{t('about_wwd_sub')}</p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {whatWeDo.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="group flex h-full flex-col rounded-2xl border border-zinc-800 bg-[linear-gradient(160deg,rgba(24,24,27,0.7),rgba(9,9,11,0.92))] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-red-900/50"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-900/40 bg-red-950/25 text-crimson-accent">
                <i className={`${c.icon} text-xl`} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-white">{c.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-zinc-400">{c.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white transition-colors group-hover:text-crimson-accent">
                {c.cta}
                <i className="ri-arrow-right-line text-base transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 4. MONTREAL REPAIR CENTER ────────────────────────────────── */}
      <section className="border-y border-zinc-900 bg-zinc-950/40">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-crimson-accent sm:text-sm">{t('about_repair_tag')}</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">{t('about_repair_title')}</h2>
            <p className="mt-4 text-sm leading-7 text-zinc-300 sm:text-base sm:leading-8">{t('about_repair_sub')}</p>
            <ul className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {repairCaps.map((cap) => (
                <li key={cap} className="flex items-start gap-2.5 text-sm text-zinc-200">
                  <i className="ri-checkbox-circle-line mt-0.5 shrink-0 text-crimson-accent" aria-hidden="true" />
                  {cap}
                </li>
              ))}
            </ul>

            {/* Address + contact */}
            <div className="mt-8 space-y-3 text-sm leading-7 text-zinc-300 sm:text-base">
              <p className="flex items-start gap-2">
                <i className="ri-map-pin-2-line mt-0.5 shrink-0 text-crimson-accent" aria-hidden="true" />
                <span>{t('about_address')}</span>
              </p>
              <p className="flex items-center gap-2">
                <i className="ri-phone-line shrink-0 text-crimson-accent" aria-hidden="true" />
                <a href={TEL} className="font-semibold text-white hover:text-crimson-accent">{CALL_LABEL}</a>
              </p>
              <p className="flex items-center gap-2">
                <i className="ri-mail-line shrink-0 text-crimson-accent" aria-hidden="true" />
                <a href={`mailto:${EMAIL}`} className="font-semibold text-white hover:text-crimson-accent">{EMAIL}</a>
              </p>
            </div>
          </div>

          {/* Google Map — dark-themed iframe */}
          <div className="overflow-hidden rounded-[2rem] border border-red-950/60 bg-black min-h-[300px] lg:min-h-0">
            <iframe
              title={t('about_map_title')}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2795.3!2d-73.745!3d45.498!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc9390c1d3e4a93%3A0x0!2s6500+Rte+Transcanadienne%2C+Saint-Laurent%2C+QC+H4T+1X4!5e0!3m2!1sen!2sca!4v1"
              width="100%"
              height="100%"
              className="h-full w-full"
              style={{ border: 0, minHeight: '300px', filter: 'invert(90%) hue-rotate(180deg) saturate(0.7)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* ── 5. BULK & SOURCING ───────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-crimson-accent sm:text-sm">{t('about_src_tag')}</p>
          <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">{t('about_src_title')}</h2>
          <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">{t('about_src_sub')}</p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sourcing.map((s) => (
            <div key={s.title} className="flex items-start gap-4 rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-5 transition-colors hover:border-red-900/50">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-900/40 bg-red-950/25 text-crimson-accent">
                <i className={`${s.icon} text-lg`} aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-base font-bold text-white">{s.title}</h3>
                <p className="mt-1 text-sm leading-6 text-zinc-400">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/bulk-deals" className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl bg-red-600 px-7 font-semibold text-white transition-colors hover:bg-red-500">
            {t('about_wwd_c3_cta')}
            <i className="ri-arrow-right-line text-base" aria-hidden="true" />
          </Link>
          <Link to="/contact#contact-form" className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl border border-zinc-700 px-7 font-semibold text-white transition-colors hover:bg-zinc-900">
            {t('about_final_contact')}
          </Link>
        </div>
      </section>

      {/* ── 6. HOW WE WORK ───────────────────────────────────────────── */}
      <section className="border-y border-zinc-900 bg-zinc-950">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-crimson-accent sm:text-sm">{t('about_how_tag')}</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl lg:text-5xl">{t('about_how_title')}</h2>
            <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">{t('about_how_sub')}</p>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2">
            {howWeWork.map((p) => (
              <div key={p.label} className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-black/40 px-5 py-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-900/40 bg-red-950/25 text-crimson-accent">
                  <i className={`${p.icon} text-base`} aria-hidden="true" />
                </span>
                <span className="text-sm font-medium leading-snug text-zinc-200">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. CLIENT FEEDBACK — honest Google review link only ──────── */}
      <section className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-6 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-crimson-accent sm:text-sm">{t('about_feedback_tag')}</p>
        <h2 className="mt-4 text-3xl font-semibold sm:text-4xl lg:text-5xl">{t('about_feedback_title')}</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-zinc-300 sm:text-base">{t('about_feedback_desc')}</p>
        <a
          href={GOOGLE_REVIEW}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-black/40 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-zinc-900"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {t('about_feedback_cta')}
        </a>
      </section>

      {/* ── 8. FINAL CTA ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-zinc-900 bg-[linear-gradient(135deg,#0f0f10,#171717_45%,#101012)] px-5 py-20 text-center sm:px-6 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(220,38,38,0.1),transparent_65%)] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-3xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-crimson-accent sm:text-sm">{t('about_final_tag')}</p>
          <h2 className="text-balance text-3xl font-semibold sm:text-4xl lg:text-5xl">{t('about_final_title')}</h2>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-zinc-300 sm:text-base">{t('about_final_sub')}</p>
          <div className="mt-8 flex flex-col flex-wrap justify-center gap-4 sm:flex-row">
            <Link to="/shop" className="inline-flex min-h-[52px] items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-red-600 px-8 font-semibold text-white transition-colors hover:bg-red-500">
              {t('about_shop_cta')}
            </Link>
            <Link to="/contact#contact-form" className="inline-flex min-h-[52px] items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-zinc-700 px-8 font-semibold text-white transition-colors hover:bg-zinc-900">
              {t('about_final_repair')}
            </Link>
            <Link to="/contact" className="inline-flex min-h-[52px] items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-zinc-700 px-8 font-semibold text-white transition-colors hover:bg-zinc-900">
              {t('about_final_contact')}
            </Link>
          </div>
          <div className="mt-6 flex flex-col justify-center gap-2 text-sm text-zinc-500 sm:flex-row sm:gap-6">
            <span>📍 {t('about_final_addr')}</span>
            <span>✉️ {EMAIL}</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
