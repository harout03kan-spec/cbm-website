import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import Seo from '../../components/feature/Seo';
import { LEGAL, LEGAL_PATHS, LEGAL_UPDATED, type LegalDocKey } from './content';

/** One policy page (Privacy, Terms of Sale, Shipping & Returns, Warranty). */
export default function LegalPage({ doc }: { doc: LegalDocKey }) {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const isFrenchUrl = pathname === '/fr' || pathname.startsWith('/fr/');
  const lang = isFrenchUrl || i18n.language?.startsWith('fr') ? 'fr' : 'en';
  const localize = (path: string) => (isFrenchUrl ? `/fr${path}` : path);
  const content = LEGAL[lang][doc];
  const others = (Object.keys(LEGAL_PATHS) as LegalDocKey[]).filter(k => k !== doc);

  return (
    <div className="min-h-screen bg-midnight text-white">
      <Seo title={`${content.title} | Canada BTC Miners`} description={content.seoDescription} path={LEGAL_PATHS[doc]} />
      <Navbar />

      <section className="pt-32 pb-10 bg-graphite border-b border-crimson-accent/20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-crimson-accent">{t('legal_tag')}</p>
          <h1 className="mt-3 font-inter text-3xl font-bold sm:text-5xl">{content.title}</h1>
          <p className="mt-3 text-sm text-soft-gray">{t('legal_updated')}: {LEGAL_UPDATED}</p>
          <p className="mt-6 text-base leading-7 text-zinc-300 sm:text-lg">{content.intro}</p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl space-y-10 px-4 sm:px-6">
          {content.sections.map(s => (
            <div key={s.h}>
              <h2 className="mb-3 font-inter text-xl font-semibold sm:text-2xl">{s.h}</h2>
              {s.list && (
                <ul className="mb-3 space-y-2">
                  {s.list.map(item => (
                    <li key={item} className="flex gap-3 text-zinc-300 leading-7">
                      <span className="mt-[11px] h-1.5 w-1.5 flex-none rounded-full bg-crimson-accent" aria-hidden="true"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {s.p?.map(para => (
                <p key={para} className="mb-3 text-zinc-300 leading-7">{para}</p>
              ))}
            </div>
          ))}

          <div className="rounded-2xl border border-white/10 bg-graphite p-6">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-soft-gray">{t('legal_other')}</p>
            <div className="flex flex-wrap gap-3">
              {others.map(k => (
                <Link key={k} to={localize(LEGAL_PATHS[k])}
                  className="rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-crimson-accent hover:text-crimson-accent">
                  {LEGAL[lang][k].title}
                </Link>
              ))}
              <a href="tel:+15146047050"
                className="inline-flex items-center gap-2 rounded-lg bg-crimson-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700">
                <i className="ri-phone-fill" aria-hidden="true"></i> +1 (514) 604-7050
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
