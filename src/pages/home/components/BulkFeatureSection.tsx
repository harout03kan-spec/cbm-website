import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { visibleBulkDeals } from '../../../data/bulkDeals';

// Homepage Bulk Deals feature — the wholesale side of the business shown as one
// serious data module instead of a small card. Used Deals has been removed; this
// surfaces the real featured bulk batch (photos + specs) straight from
// src/data/bulkDeals.ts. No fake inventory, no invented numbers — every field
// comes from the data file, and the CTA goes to the full /bulk-deals page.
export default function BulkFeatureSection() {
  const { t } = useTranslation();
  const batch = visibleBulkDeals()[0];

  // Real lot photos with graceful fallback (mirrors the /bulk-deals page).
  const [failed, setFailed] = useState<string[]>([]);
  const [selected, setSelected] = useState(0);
  const imgs = (batch?.images ?? []).filter((src) => !failed.includes(src));
  const cur = Math.min(selected, Math.max(0, imgs.length - 1));

  const chips = [t('bf_chip_1'), t('bf_chip_2'), t('bf_chip_3'), t('bf_chip_4'), t('bf_chip_5')];

  const specs = batch
    ? ([
        [t('bulk_f_models'), batch.models?.length ? batch.models.join(', ') : null],
        [t('bulk_f_quantity'), batch.quantity ? `${batch.quantity} units` : null],
        [t('bulk_f_moq'), batch.moq ? `${batch.moq} units` : null],
        [t('bulk_f_avg_hash'), batch.averageHashrate],
        [t('bulk_f_range'), batch.hashrateRange],
        [t('bulk_f_per_th'), batch.pricePerTh],
        [t('bulk_f_unit_price'), batch.estUnitPrice],
        [t('bulk_f_location'), batch.location],
        [t('bulk_f_condition'), batch.condition],
        [t('bulk_f_warranty'), batch.warranty],
        [t('bulk_f_extra'), batch.extraUnits],
      ].filter(([, v]) => v && String(v).trim()) as [string, string][])
    : [];

  return (
    <section className="relative overflow-hidden bg-[#0A0A0A] py-20 sm:py-28">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 55% 50% at 85% 12%, rgba(220,38,38,0.08), transparent 60%)' }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="font-inter text-xs font-semibold uppercase tracking-[0.22em] text-crimson-accent">{t('bf_tag')}</p>
          <h2 className="mt-3 font-inter text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">{t('bf_title')}</h2>
          <p className="mt-4 font-inter text-base leading-7 text-soft-gray sm:text-lg">{t('bf_sub')}</p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {chips.map((c) => (
              <span key={c} className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 font-inter text-xs font-medium text-zinc-300">
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Featured batch module */}
        {batch ? (
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55 }}
            className="mt-12 grid grid-cols-1 overflow-hidden rounded-3xl border border-white/[0.08] bg-[linear-gradient(160deg,rgba(22,12,12,0.85),rgba(9,9,10,0.96))] shadow-[0_30px_80px_rgba(0,0,0,0.45)] lg:grid-cols-2"
          >
            {/* Photos */}
            <div className="flex flex-col bg-black/60 p-5 sm:p-6">
              <div className="relative w-full overflow-hidden rounded-2xl bg-black" style={{ aspectRatio: '4 / 3' }}>
                {imgs.length > 0 ? (
                  <img
                    src={imgs[cur]}
                    alt={batch.title}
                    loading="lazy"
                    className="h-full w-full object-contain object-center"
                    onError={() => setFailed((f) => (f.includes(imgs[cur]) ? f : [...f, imgs[cur]]))}
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-zinc-600">
                    <i className="ri-stack-line text-5xl" aria-hidden="true" />
                    <span className="font-inter text-xs uppercase tracking-wider">{t('bulk_img_pending')}</span>
                  </div>
                )}
              </div>
              {imgs.length > 1 && (
                <div className="mt-3 grid grid-cols-4 gap-2.5">
                  {imgs.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setSelected(i)}
                      aria-label={`${batch.title} photo ${i + 1}`}
                      className={`relative overflow-hidden rounded-lg border bg-black transition-colors ${i === cur ? 'border-crimson-accent' : 'border-white/10 hover:border-white/30'}`}
                      style={{ aspectRatio: '1 / 1' }}
                    >
                      <img
                        src={src}
                        alt={`${batch.title} ${i + 1}`}
                        loading="lazy"
                        className="h-full w-full object-cover"
                        onError={() => setFailed((f) => (f.includes(src) ? f : [...f, src]))}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Data */}
            <div className="flex flex-col p-7 sm:p-9">
              <div className="flex items-center justify-between gap-3">
                <span className="font-inter text-[11px] font-semibold uppercase tracking-[0.18em] text-crimson-accent">{t('bf_featured')}</span>
                <span className="rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-0.5 font-inter text-[11px] font-semibold text-emerald-300">{t('bulk_status_available')}</span>
              </div>
              <h3 className="mt-3 font-inter text-2xl font-bold text-white sm:text-3xl">{batch.title}</h3>

              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3.5">
                {specs.map(([k, v]) => (
                  <div key={k} className="flex flex-col border-b border-white/[0.06] pb-2.5">
                    <dt className="font-inter text-[11px] uppercase tracking-wide text-zinc-500">{k}</dt>
                    <dd className="mt-0.5 font-inter text-sm font-semibold text-zinc-100">{v}</dd>
                  </div>
                ))}
              </dl>

              {batch.notes && <p className="mt-6 font-inter text-sm leading-6 text-soft-gray">{batch.notes}</p>}

              <Link
                to="/bulk-deals"
                className="mt-9 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-crimson-accent px-7 font-inter text-base font-semibold text-white transition-colors hover:bg-red-700 active:bg-red-800 sm:w-fit"
              >
                {t('bf_cta')}
                <i className="ri-arrow-right-line text-lg" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        ) : (
          // Defensive empty state — never shown while the real batch exists.
          <div className="mt-12 rounded-3xl border border-white/[0.08] bg-[#141414] p-10 text-center">
            <h3 className="font-inter text-2xl font-bold text-white">{t('bf_empty_title')}</h3>
            <p className="mx-auto mt-3 max-w-xl font-inter text-base leading-7 text-soft-gray">{t('bf_empty_desc')}</p>
            <Link
              to="/bulk-deals"
              className="mt-7 inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-crimson-accent px-8 font-inter text-base font-semibold text-white transition-colors hover:bg-red-700"
            >
              {t('bf_cta')}
              <i className="ri-arrow-right-line text-lg" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
