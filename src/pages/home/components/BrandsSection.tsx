import { useTranslation } from 'react-i18next';

// Brand logos provided by the client, stored in public/assets/brands/.
// All files are transparent PNG/WebP so they sit cleanly on the dark background.
const brands = [
  { id: 'bitmain',     name: 'Bitmain',     src: '/assets/brands/bitmain.webp' },
  { id: 'whatsminer',  name: 'Whatsminer',  src: '/assets/brands/whatsminer.png' },
  { id: 'canaan',      name: 'Canaan',      src: '/assets/brands/canaan.webp' },
  { id: 'innosilicon', name: 'Innosilicon', src: '/assets/brands/innosilicon.webp' },
  { id: 'bitdeer',     name: 'Bitdeer',     src: '/assets/brands/bitdeer.webp' },
  { id: 'iceriver',    name: 'IceRiver',    src: '/assets/brands/iceriver.webp' },
  { id: 'goldshell',   name: 'Goldshell',   src: '/assets/brands/goldshell.webp' },
  { id: 'jasminer',    name: 'Jasminer',    src: '/assets/brands/jasminer.webp' },
  { id: 'elphapex',    name: 'Elphapex',    src: '/assets/brands/elphapex.webp' },
  { id: 'fluminer',    name: 'Fluminer',    src: '/assets/brands/fluminer.webp' },
  { id: 'volcminer',   name: 'Volcminer',   src: '/assets/brands/volcminer.webp' },
];

// One full set of logos. Each track holds a complete set; we render two tracks.
const BrandTrack = ({ ariaHidden }: { ariaHidden?: boolean }) => (
  <div className="bs-track" aria-hidden={ariaHidden}>
    {brands.map(({ id, name, src }) => (
      <div key={id} className="bs-item">
        <img
          src={src}
          alt={`${name} logo`}
          loading="eager"
          decoding="async"
          className="block h-6 w-auto object-contain opacity-90 sm:h-8"
        />
      </div>
    ))}
  </div>
);

// Sliding brand marquee — rebuilt to be blank-proof on mobile.
//
// Why the old version went black on phones: it animated `transform` on a single
// `width: max-content` flex container, which iOS Safari intermittently fails to
// paint (and GPU-layer promotion could drop the layer entirely). This version
// uses the canonical two-track pattern instead:
//   • Two identical tracks, each `min-width: 100%`, sit side by side.
//   • Both animate translateX(0) → translateX(-100%) in lockstep, so as track 1
//     scrolls off the left, track 2 takes its exact place — a seamless loop.
//   • Because every track is at least a full viewport wide (min-width:100% +
//     space-around), the band is always filled — never a blank/black gap.
//   • Pure CSS, local assets, no JS-driven visibility, no IntersectionObserver,
//     no opacity:0, no animation-delay, no will-change/translateZ.
//   • No :hover or touch pause — it never stops.
//   • If animation is disabled (reduced-motion / unsupported), one static track
//     stays fully visible as the fallback.
const BrandsSection = () => {
  const { t } = useTranslation();
  return (
    <section className="overflow-hidden border-y border-white/[0.07] bg-[#0a0a0a] py-10">
      <style>{`
        @keyframes bs-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-100%); }
        }
        .bs-marquee {
          display: flex;
          width: 100%;
          min-height: 40px;
          overflow: hidden;
        }
        .bs-track {
          flex: 0 0 auto;
          min-width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-around;
          animation: bs-scroll 16s linear infinite;
        }
        .bs-item {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px 28px;
        }
        @media (min-width: 640px) { .bs-item { padding: 8px 40px; } }
        @media (min-width: 768px) { .bs-track { animation-duration: 26s; } }
        /* No :hover or touch pause — the ticker never stops. */
        @media (prefers-reduced-motion: reduce) {
          .bs-track { animation: none; flex-wrap: wrap; }
          .bs-track + .bs-track { display: none; }
        }
      `}</style>

      <p className="mb-7 text-center font-inter text-[10px] font-semibold uppercase tracking-[0.3em] text-crimson-accent">
        {t('brands_label')}
      </p>

      <div className="bs-marquee">
        <BrandTrack />
        <BrandTrack ariaHidden />
      </div>
    </section>
  );
};

export default BrandsSection;
