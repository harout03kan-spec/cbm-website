import { useTranslation } from 'react-i18next';

// Homepage proof strip — practical, verifiable trust points only (no stats, no
// "number one"). Replaces the old metric bar.
export default function ProofStrip() {
  const { t } = useTranslation();
  const points = [
    { icon: 'ri-map-pin-2-line', label: t('hp_proof_1') },
    { icon: 'ri-truck-line', label: t('hp_proof_2') },
    { icon: 'ri-cpu-line', label: t('hp_proof_3') },
    { icon: 'ri-stack-line', label: t('hp_proof_4') },
    { icon: 'ri-list-check-2', label: t('hp_proof_5') },
    { icon: 'ri-price-tag-3-line', label: t('hp_proof_6') },
  ];

  return (
    <section className="border-y border-white/[0.06] bg-[#0A0A0A] py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {points.map((p) => (
            <div key={p.label} className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-crimson-accent/25 bg-crimson-accent/10 text-crimson-accent">
                <i className={`${p.icon} text-base`} aria-hidden="true" />
              </span>
              <span className="font-inter text-sm font-medium text-zinc-200">{p.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
