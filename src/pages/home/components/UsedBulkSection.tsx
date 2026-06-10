import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { visibleBulkDeals } from '../../../data/bulkDeals';

// Homepage Used Deals + Bulk Deals — kept secondary to the shop but presented as
// two premium modules. Used Deals opens the shop pre-filtered to used units; the
// Bulk module surfaces the real featured batch as a compact data card and links
// to /bulk-deals. No fake inventory: the bulk figures come from src/data/bulkDeals.ts.
export default function UsedBulkSection() {
  const { t } = useTranslation();
  const batch = visibleBulkDeals()[0];

  const specs = batch
    ? ([
        [t('bulk_f_quantity'), `${batch.quantity} units`],
        [t('bulk_f_moq'), batch.moq ? `${batch.moq} units` : null],
        [t('bulk_f_avg_hash'), batch.averageHashrate],
        [t('bulk_f_per_th'), batch.pricePerTh],
        [t('bulk_f_location'), batch.location],
        [t('bulk_f_condition'), batch.condition],
      ].filter(([, v]) => v) as [string, string][])
    : [];

  return (
    <section className="bg-[#0A0A0A] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <p className="font-inter text-xs font-semibold uppercase tracking-[0.22em] text-crimson-accent">{t('ub_tag')}</p>
          <h2 className="mt-3 font-inter text-3xl font-bold tracking-tight text-white sm:text-4xl">{t('deals_title')}</h2>
          <p className="mt-4 font-inter text-base leading-7 text-soft-gray">{t('deals_sub')}</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Used Deals module */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5 }}
            className="flex flex-col rounded-2xl border border-white/[0.08] bg-[#141414] p-7 sm:p-8"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-crimson-accent/30 bg-crimson-accent/10 text-crimson-accent">
                <i className="ri-price-tag-3-line text-xl" aria-hidden="true" />
              </span>
              <h3 className="font-inter text-xl font-bold text-white">{t('deals_used_title')}</h3>
            </div>
            <p className="mt-4 font-inter text-sm leading-6 text-soft-gray">{t('deals_used_desc')}</p>
            <Link to="/shop?q=used" className="mt-auto inline-flex min-h-[48px] w-fit items-center gap-2 rounded-xl border border-white/20 bg-white/[0.03] px-6 font-inter text-sm font-semibold text-white transition-colors hover:border-crimson-accent/50 hover:bg-crimson-accent/10 hover:text-crimson-accent">
              {t('deals_used_cta')}
              <i className="ri-arrow-right-line" aria-hidden="true" />
            </Link>
          </motion.div>

          {/* Bulk Deals module — real featured batch as a data card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5, delay: 0.08 }}
            className="flex flex-col rounded-2xl border border-crimson-accent/20 bg-[linear-gradient(160deg,rgba(30,16,16,0.85),rgba(10,10,10,0.95))] p-7 sm:p-8"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-crimson-accent/30 bg-crimson-accent/10 text-crimson-accent">
                <i className="ri-stack-line text-xl" aria-hidden="true" />
              </span>
              <h3 className="font-inter text-xl font-bold text-white">{t('deals_bulk_title')}</h3>
            </div>
            <p className="mt-4 font-inter text-sm leading-6 text-soft-gray">{t('deals_bulk_desc')}</p>

            {batch && (
              <div className="mt-5 rounded-xl border border-white/10 bg-black/40 p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-inter text-[11px] font-semibold uppercase tracking-[0.16em] text-crimson-accent">{t('ub_bulk_featured')}</span>
                  <span className="rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-0.5 font-inter text-[11px] font-semibold text-emerald-300">{t('bulk_status_available')}</span>
                </div>
                <p className="mt-2 font-inter text-base font-bold text-white">{batch.title}</p>
                <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-2.5">
                  {specs.map(([k, v]) => (
                    <div key={k} className="flex flex-col">
                      <dt className="font-inter text-[11px] uppercase tracking-wide text-zinc-500">{k}</dt>
                      <dd className="font-inter text-sm font-semibold text-zinc-200">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <Link to="/bulk-deals" className="mt-6 inline-flex min-h-[48px] w-fit items-center gap-2 rounded-xl bg-crimson-accent px-6 font-inter text-sm font-semibold text-white transition-colors hover:bg-red-700">
              {t('deals_bulk_cta')}
              <i className="ri-arrow-right-line" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
