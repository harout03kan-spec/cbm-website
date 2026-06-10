import { useTranslation } from 'react-i18next';

// Homepage compact trust row — small, practical, verifiable points only (no
// stats, no "best in Canada", no guarantees). Sits right under the featured
// miners as a quiet credibility band. The last item is a real, tappable phone
// number.
export default function ProofStrip() {
  const { t } = useTranslation();
  const points = [
    { icon: 'ri-map-pin-2-line', label: t('hp_proof_1') },
    { icon: 'ri-truck-line', label: t('hp_proof_2') },
    { icon: 'ri-cpu-line', label: t('hp_proof_3') },
    { icon: 'ri-tools-line', label: t('hp_proof_4') },
  ];

  return (
    <section className="border-y border-white/[0.06] bg-[#0A0A0A] py-7">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-7 gap-y-3 px-6 sm:gap-x-9">
        {points.map((p) => (
          <div key={p.label} className="flex items-center gap-2.5">
            <i className={`${p.icon} text-base text-crimson-accent`} aria-hidden="true" />
            <span className="font-inter text-[13px] font-medium text-zinc-300 sm:text-sm">{p.label}</span>
          </div>
        ))}
        <a
          href="tel:+15146047050"
          className="flex items-center gap-2.5 font-inter text-[13px] font-semibold text-white transition-colors hover:text-crimson-accent sm:text-sm"
        >
          <i className="ri-phone-line text-base text-crimson-accent" aria-hidden="true" />
          {t('hp_proof_call')}
        </a>
      </div>
    </section>
  );
}
