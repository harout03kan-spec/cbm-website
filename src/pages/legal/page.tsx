import { useLocation } from 'react-router-dom';
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
  const content = LEGAL[lang][doc];

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
        </div>
      </section>

      <Footer />
    </div>
  );
}
