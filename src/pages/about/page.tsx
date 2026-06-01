import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import Seo, { localBusinessLd } from '../../components/feature/Seo';

const PHONE = '+1 (514) 604-7050';


const StarRating = ({ count = 5 }: { count?: number }) => (
  <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
    {Array.from({ length: count }).map((_, i) => (
      <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

export default function AboutPage() {
  const { t } = useTranslation();

  const stats = [
    { value: '5+',     label: t('about_stats_years'),    sub: 'Since 2019' },
    { value: '2,300+', label: t('about_stats_repaired'), sub: 'Board-level repairs' },
    { value: '92%',    label: t('about_stats_rate'),     sub: 'Industry-leading' },
    { value: '9,000+', label: t('about_stats_sold'),     sub: 'Across Canada & US' },
  ];

  const differentiators = [
    { icon: '🔧', text: t('about_diff_1') },
    { icon: '💰', text: t('about_diff_2') },
    { icon: '✅', text: t('about_diff_3') },
    { icon: '🇨🇦', text: t('about_diff_4') },
  ];

  const markets = [t('about_m1'), t('about_m2'), t('about_m3'), t('about_m4'), t('about_m5')];

  const audiences = [
    { icon: '⛏️', label: t('about_a1'), desc: 'From single units to small farms' },
    { icon: '🏭', label: t('about_a2'), desc: 'Bulk sourcing, repairs & hosting' },
    { icon: '🤝', label: t('about_a3'), desc: 'Wholesale pricing on request' },
    { icon: '🖥️', label: t('about_a4'), desc: 'Enterprise-scale deployments' },
  ];

  const values = [
    { icon: '🇨🇦', title: t('about_v1_title'), text: t('about_v1_text') },
    { icon: '🔬', title: t('about_v2_title'), text: t('about_v2_text') },
    { icon: '📋', title: t('about_v3_title'), text: t('about_v3_text') },
    { icon: '🔄', title: t('about_v4_title'), text: t('about_v4_text') },
  ];

  const reviews = [
    { name: 'R M',                 stars: 5, text: 'Excellent service from start to finish. They diagnosed the issue quickly, explained everything clearly, and completed the repair on time. Pricing was fair and the miner is now working perfectly.' },
    { name: 'Stephane Brouillard', stars: 5, text: 'Harout always gave me great prices and matching services.' },
    { name: 'Chris Angus',         stars: 5, text: 'Ordered an S19 and received an upgraded S19 Pro at no extra cost. Arrived the next day. Great service.' },
    { name: 'Brad Holman',         stars: 5, text: 'They were very helpful sorting out my setup issue. Pricing was reasonable and shipping to Ontario was quick.' },
    { name: 'Will James',          stars: 5, text: 'Ordered an S21. Great service, quick response, and smooth shipping in Canada.' },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Seo
        title="About Canada BTC Miners | Montreal ASIC Miner Sales and Repair"
        description="Canada BTC Miners is a Montreal based ASIC miner sales and repair company serving Canada with mining hardware, diagnostics, maintenance, and Canada wide shipping."
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
        <meta itemProp="url" content="https://canadabtcminers.com" />

        {/* Background photo */}
        <img
          src="/Put%20this%20in%20the%20about%20us%20page%20background%20instead%20of%20the%20miner.jpeg"
          alt="Bitcoin mining facility — Canada BTC Miners"
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
        />
        {/* Dark overlay so text stays readable */}
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

        <div className="relative z-10 mx-auto max-w-4xl px-5 py-20 sm:px-6 sm:py-28 lg:py-32 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-500 sm:text-sm">
            About Canada BTC Miners
          </p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl lg:text-[3.4rem] lg:leading-[1.1]">
            Canada's ASIC Miner{' '}
            <span className="text-red-500">Supplier,</span>{' '}
            Repair &amp; Hosting Team
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base sm:leading-8">
            Based in Montreal, Quebec — we supply new &amp; refurbished ASIC miners,
            perform board-level repairs, and coordinate hosting placements across
            Canada and the U.S. Real service. Clear pricing. Direct communication.
          </p>

          {/* Trust badges */}
          <div className="mt-6 flex flex-wrap gap-3 justify-center text-xs text-zinc-400">
            <span className="flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800 rounded-full px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              Canadian Inventory
            </span>
            <span className="flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800 rounded-full px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              30-Day Repair Warranty
            </span>
            <span className="flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800 rounded-full px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              Tested Before Shipping
            </span>
          </div>

          {/* Hero CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/15146047050" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-7 py-4 font-semibold hover:bg-red-500 transition-colors text-base"
              aria-label="Call Canada BTC Miners"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {PHONE}
            </a>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-black/40 px-7 py-4 font-semibold hover:bg-zinc-900 transition-colors"
            >
              Shop ASIC Miners
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-b border-zinc-900 bg-zinc-950" aria-label="Company statistics">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-5 py-10 sm:px-6 sm:gap-6 sm:py-12 lg:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="rounded-2xl border border-zinc-800 bg-black/40 px-4 py-5 text-center sm:px-5 sm:py-6 hover:border-red-800 transition-colors">
              <div className="text-2xl font-semibold text-red-500 sm:text-3xl lg:text-4xl">{item.value}</div>
              <div className="mt-2 text-xs text-zinc-200 font-medium sm:text-sm">{item.label}</div>
              <div className="mt-1 text-xs text-zinc-500">{item.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT BAR ── */}
      <div className="bg-red-600/10 border-b border-red-900/30 px-5 py-4">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <span className="text-zinc-300">Questions about buying, repairing or hosting ASIC miners?</span>
          <div className="flex gap-6 items-center flex-wrap justify-center">
            <a href="https://wa.me/15146047050" target="_blank" rel="noopener noreferrer" className="font-semibold text-white hover:text-red-400 transition-colors flex items-center gap-1.5">
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {PHONE}
            </a>
            <a href="mailto:info@canadabtcminers.ca" className="font-semibold text-red-500 hover:text-red-400 transition-colors">
              info@canadabtcminers.ca
            </a>
          </div>
        </div>
      </div>

      {/* ── LEADERSHIP ── */}
      <section className="border-y border-zinc-900 bg-zinc-950/60">
        <div className="mx-auto max-w-5xl px-5 py-16 text-center sm:px-6 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-500 sm:text-sm">Leadership</p>
          <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">The Operators Behind The Business</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-zinc-400">
            You deal directly with the people who run the operation — not a call center.
          </p>
          <div className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6">
            {[
              { initials: 'HK', name: 'Harout Kantanakian', role: t('about_harout_role'), bio: t('about_harout_bio') },
              { initials: 'PD', name: 'Patrice Destin',      role: t('about_patrice_role'), bio: t('about_patrice_bio') },
            ].map((person) => (
              <div key={person.name} className="rounded-[2rem] border border-zinc-800 bg-black/40 p-6 sm:p-7 text-left hover:border-zinc-600 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-600/20 border border-red-900/40 flex items-center justify-center text-base font-bold text-red-400 flex-shrink-0">
                    {person.initials}
                  </div>
                  <div>
                    <div className="text-xl font-semibold">{person.name}</div>
                    <div className="text-sm text-red-400">{person.role}</div>
                  </div>
                </div>
                <div className="text-sm leading-7 text-zinc-300 sm:text-base">{person.bio}</div>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-400 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn Profile
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY + DIFFERENTIATORS ── */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 flex flex-col gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-500 sm:text-sm">Why We Built This</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
            Reliable ASIC Support In Canada<br className="hidden lg:block" /> Should Not Be Hard To Find
          </h2>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base sm:leading-8">
            Canada BTC Miners was built to fill a real gap: ASIC miner sales, repairs, and hosting support
            that's actually accessible to Canadian operators. We cut out the confusion —
            you get a straight answer, a clear price, and a team that follows through.
          </p>
        </div>
        <div className="rounded-[2rem] border border-red-950/60 bg-zinc-950 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-500 sm:text-sm mb-6">What Makes Us Different</p>
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
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-500 sm:text-sm">Location</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">Montreal Repair Center</h2>
          <div className="mt-6 space-y-3 text-sm leading-7 text-zinc-300 sm:text-base sm:leading-8">
            <p>{t('about_location_p1')}</p>
            <p className="flex items-start gap-2">
              <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>6500 Route Transcanadienne, Suite 209, Saint-Laurent, Quebec H4T 1X4</span>
            </p>
            <p className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href="https://wa.me/15146047050" target="_blank" rel="noopener noreferrer" className="font-semibold text-white hover:text-red-400 transition-colors">{PHONE}</a>
            </p>
            <p className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:info@canadabtcminers.ca" className="font-semibold text-white hover:text-red-400 transition-colors">info@canadabtcminers.ca</a>
            </p>
          </div>
        </div>

        {/* Google Map — dark-themed iframe */}
        <div className="overflow-hidden rounded-[2rem] border border-red-950/60 bg-black h-72 sm:h-80 lg:h-96">
          <iframe
            title="Canada BTC Miners Montreal location — 6500 Route Transcanadienne"
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
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-500 sm:text-sm">Where We Sell</p>
              <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Serving Clients Across Multiple Markets</h2>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base sm:leading-8">
                Based in Montreal, we ship ASIC miners and provide repair services to clients across
                Canada and internationally. Whether you're buying one miner or deploying a full farm, we can support you.
              </p>
            </div>
            <div className="rounded-[2rem] border border-red-950/60 bg-[linear-gradient(135deg,rgba(127,29,29,0.18),rgba(12,12,12,0.95))] p-6 sm:p-8">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3">
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
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-500 sm:text-sm">Who We Work With</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Support For Every Type of Mining Client</h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-zinc-300 sm:text-base sm:leading-8">{t('about_who_desc')}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {audiences.map((item) => (
              <div key={item.label} className="flex items-start gap-4 rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-5 hover:border-zinc-600 transition-colors">
                <span className="text-2xl mt-0.5">{item.icon}</span>
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
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-500 sm:text-sm">Core Values</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl lg:text-5xl">Built On Practical Standards</h2>
          </div>
          <div className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
            {values.map((item) => (
              <div key={item.title} className="rounded-[2rem] border border-zinc-800 bg-black p-6 text-center transition hover:border-red-600 sm:p-7 group">
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="text-lg font-semibold text-white group-hover:text-red-400 transition-colors">{item.title}</div>
                <div className="mt-3 text-sm leading-7 text-zinc-400">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-500 sm:text-sm">Client Feedback</p>
          <h2 className="mt-4 text-3xl font-semibold sm:text-4xl lg:text-5xl">Real Reviews From Real Clients</h2>
          <p className="mt-4 text-sm text-zinc-400">All reviews from verified Google customers</p>
        </div>
        <div className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((item) => (
            <div
              key={item.name}
              itemScope
              itemType="https://schema.org/Review"
              className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-5 sm:p-6 flex flex-col gap-3 hover:border-zinc-600 transition-colors"
            >
              <StarRating count={item.stars} />
              <p itemProp="reviewBody" className="text-sm leading-7 text-zinc-300 sm:text-base flex-1">"{item.text}"</p>
              <div itemProp="author" className="text-sm font-semibold text-red-400">— {item.name}</div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <p className="text-sm text-zinc-300 sm:text-base mb-3">Happy with our service? Leave us a review. It helps other miners find us.</p>
          <a
            href="https://g.page/r/CdfEOvDvGeTDEBM/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-semibold text-red-500 hover:text-red-400 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Write a Google Review
          </a>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative overflow-hidden border-t border-zinc-900 bg-[linear-gradient(135deg,#0f0f10,#171717_45%,#101012)] px-5 py-20 text-center sm:px-6 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(220,38,38,0.10),transparent_65%)]" />
        <div className="relative z-10 mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-500 sm:text-sm mb-4">Get Started Today</p>
          <h2 className="text-3xl font-semibold sm:text-4xl lg:text-5xl">Work With A Reliable ASIC Team</h2>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-zinc-300 sm:text-base">
            Call or message us. You get a clear answer before sending anything.
            No runaround, no vague quotes — direct support from Montreal.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="https://wa.me/15146047050" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-8 py-4 font-semibold hover:bg-red-500 transition-colors text-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {PHONE}
            </a>
            <Link to="/services" className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 px-8 py-4 font-semibold hover:bg-zinc-900 transition-colors">
              View Services
            </Link>
            <Link to="/shop" className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 px-8 py-4 font-semibold hover:bg-zinc-900 transition-colors">
              Shop Miners
            </Link>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-6 text-sm text-zinc-500">
            <span>📍 6500 Route Transcanadienne, Montreal, QC</span>
            <span>✉️ info@canadabtcminers.ca</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
