import { useTranslation } from 'react-i18next';

// Homepage compact trust row — small, practical, verifiable points only (no
// stats, no "best in Canada", no guarantees). On phones it lays out as a tidy
// 2 + 2 grid with the tappable phone number on its own centered row; on larger
// screens it collapses to a single clean row.
export default function ProofStrip() {
  const { t } = useTranslation();
  const points = [
    { icon: 'ri-map-pin-2-line', label: t('hp_proof_1') },
    { icon: 'ri-truck-line', label: t('hp_proof_2') },
    { icon: 'ri-cpu-line', label: t('hp_proof_3') },
    { icon: 'ri-tools-line', label: t('hp_proof_4') },
  ];

  return (
    <section className="border-y border-white/[0.06] bg-[#0A0A0A] py-6">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-4 px-6 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-9 sm:gap-y-3">
        {points.map((p) => (
          <div key={p.label} className="flex items-start gap-2.5 text-left sm:items-center">
            <i className={`${p.icon} mt-0.5 shrink-0 text-base leading-5 text-crimson-accent sm:mt-0`} aria-hidden="true" />
            <span className="font-inter text-[13px] font-medium leading-5 text-zinc-300 sm:text-sm">{p.label}</span>
          </div>
        ))}
        <a
          href="tel:+15146047050"
          className="col-span-2 mt-1 flex items-center justify-center gap-2.5 font-inter text-[13px] font-semibold text-white transition-colors hover:text-crimson-accent sm:col-span-1 sm:mt-0 sm:text-sm"
        >
          <i className="ri-phone-line shrink-0 text-base text-crimson-accent" aria-hidden="true" />
          {t('hp_proof_call')}
        </a>
      </div>
    </section>
  );
}
