import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import Seo from '../../components/feature/Seo';
import { visibleBulkDeals, type BulkDeal } from '../../data/bulkDeals';

// Bulk / wholesale ASIC batches. Inquiry-based only — no Add to Cart, no retail
// catalog products here. Renders real batches from src/data/bulkDeals.ts; when
// there are none, shows a clean "contact for the current list" state.

const BulkDealCard = ({ deal, index }: { deal: BulkDeal; index: number }) => {
  const { t } = useTranslation();

  // Real lot photos. Any image that fails to load (e.g. not added yet) is dropped
  // so the card degrades cleanly to the placeholder instead of a broken image.
  const [failed, setFailed] = useState<string[]>([]);
  const [selected, setSelected] = useState(0);
  const imgs = (deal.images ?? []).filter((src) => !failed.includes(src));
  const cur = Math.min(selected, Math.max(0, imgs.length - 1));

  // Only show fields the batch actually provides — never invent data.
  const rows: { label: string; value?: string }[] = [
    { label: t('bulk_f_models'), value: deal.models?.length ? deal.models.join(', ') : undefined },
    { label: t('bulk_f_quantity'), value: deal.quantity ? `${deal.quantity} units` : undefined },
    { label: t('bulk_f_moq'), value: deal.moq ? `${deal.moq} units` : undefined },
    { label: t('bulk_f_avg_hash'), value: deal.averageHashrate },
    { label: t('bulk_f_range'), value: deal.hashrateRange },
    { label: t('bulk_f_total_hash'), value: deal.totalHashrate },
    { label: t('bulk_f_per_th'), value: deal.pricePerTh },
    { label: t('bulk_f_unit_price'), value: deal.estUnitPrice },
    { label: t('bulk_f_price'), value: deal.priceLabel },
    { label: t('bulk_f_location'), value: deal.location },
    { label: t('bulk_f_condition'), value: deal.condition },
    { label: t('bulk_f_cooling'), value: deal.cooling },
    { label: t('bulk_f_warranty'), value: deal.warranty },
    { label: t('bulk_f_extra'), value: deal.extraUnits },
  ].filter((r) => r.value && r.value.trim());

  const statusLabel = deal.status === 'Pending' ? t('bulk_status_pending') : t('bulk_status_available');
  const statusClass = deal.status === 'Pending'
    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
    : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: index * 0.05 }}
      className="flex flex-col bg-[#141414] rounded-xl overflow-hidden border border-white/10"
    >
      {imgs.length > 0 ? (
        <div>
          <div className="relative w-full h-64 bg-black overflow-hidden">
            <img
              src={imgs[cur]}
              alt={deal.title}
              loading="lazy"
              className="w-full h-full object-contain object-center"
              onError={() => setFailed((f) => (f.includes(imgs[cur]) ? f : [...f, imgs[cur]]))}
            />
          </div>
          {imgs.length > 1 && (
            <div className="grid grid-cols-4 gap-2 p-3 bg-[#0A0A0A] border-b border-white/10">
              {imgs.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setSelected(i)}
                  aria-label={`${deal.title} photo ${i + 1}`}
                  className={`relative h-16 bg-black rounded-md overflow-hidden border transition-colors ${i === cur ? 'border-crimson-accent' : 'border-white/10 hover:border-white/30'}`}
                >
                  <img
                    src={src}
                    alt={`${deal.title} ${i + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    onError={() => setFailed((f) => (f.includes(src) ? f : [...f, src]))}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Clean placeholder until the real lot photos load/are added.
        <div className="relative w-full h-64 bg-[#0A0A0A] border-b border-white/10 flex flex-col items-center justify-center gap-2 text-zinc-600">
          <i className="ri-image-2-line text-5xl" aria-hidden="true"></i>
          <span className="font-inter text-xs uppercase tracking-wider">{t('bulk_img_pending')}</span>
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-4">
          <h3 className="text-white font-inter font-bold text-xl">{deal.title}</h3>
          <span className={`shrink-0 px-3 py-1 rounded-full border text-xs font-inter font-semibold ${statusClass}`}>{statusLabel}</span>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-5">
          {rows.map((r) => (
            <div key={r.label} className="flex justify-between gap-3 border-b border-white/5 py-1.5">
              <dt className="text-soft-gray font-inter text-sm">{r.label}</dt>
              <dd className="text-white font-inter text-sm font-semibold text-right">{r.value}</dd>
            </div>
          ))}
        </dl>

        {deal.notes && <p className="text-soft-gray font-inter text-sm leading-6 mb-5">{deal.notes}</p>}

        <Link to="/contact#contact-form"
          className="mt-auto inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-3 bg-crimson-accent text-white font-inter font-semibold rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors text-center"
        >
          <i className="ri-mail-send-line text-lg" aria-hidden="true"></i>
          {deal.ctaLabel || t('bulk_cta')}
        </Link>
      </div>
    </motion.div>
  );
};

export default function BulkDealsPage() {
  const { t } = useTranslation();
  const deals = visibleBulkDeals();

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Seo title={t('bulk_seo_title')} description={t('bulk_seo_desc')} path="/bulk-deals" />
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-12 bg-[#0A0A0A]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-full border border-crimson-accent/40 bg-crimson-accent/10 text-crimson-accent font-inter font-semibold text-xs uppercase tracking-wider">
              <i className="ri-stack-line" aria-hidden="true"></i> Wholesale
            </span>
            <h1 className="font-inter font-bold text-4xl md:text-5xl text-white mb-5">{t('bulk_title')}</h1>
            <p className="text-soft-gray font-inter text-lg leading-7 max-w-3xl mx-auto">{t('bulk_intro')}</p>
          </motion.div>
        </div>
      </section>

      {/* How bulk batches work — sets the inquiry-based expectation (no cart) */}
      <section className="pb-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="rounded-xl border border-white/10 bg-[#141414] p-6 sm:p-8">
            <h2 className="text-white font-inter font-bold text-xl mb-4">{t('bulk_how_title')}</h2>
            <ul className="space-y-3">
              {[t('bulk_how_1'), t('bulk_how_2'), t('bulk_how_3')].map((line) => (
                <li key={line} className="flex items-start gap-3 text-soft-gray font-inter text-sm leading-6">
                  <i className="ri-checkbox-circle-line text-crimson-accent text-lg shrink-0 mt-0.5" aria-hidden="true"></i>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Batches — real data only; clean empty state when there are none */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-6">
          {deals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {deals.map((deal, i) => <BulkDealCard key={deal.id} deal={deal} index={i} />)}
            </div>
          ) : (
            <div className="mx-auto max-w-xl rounded-xl border border-white/10 bg-[#141414] p-10 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-crimson-accent/30 bg-crimson-accent/10">
                <i className="ri-stack-line text-3xl text-crimson-accent" aria-hidden="true"></i>
              </div>
              <h2 className="font-inter font-bold text-2xl text-white mb-3">{t('bulk_empty_title')}</h2>
              <p className="text-soft-gray font-inter text-base leading-7 mb-8">{t('bulk_empty_desc')}</p>
              <Link to="/contact#contact-form"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 px-8 py-3.5 bg-crimson-accent text-white font-inter font-semibold rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors"
              >
                <i className="ri-customer-service-2-line text-lg" aria-hidden="true"></i>
                {t('bulk_empty_cta')}
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
