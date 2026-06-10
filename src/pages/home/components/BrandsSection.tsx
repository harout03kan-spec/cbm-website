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

// One full set of logos, rendered as a single inline group.
const BrandRow = ({ ariaHidden }: { ariaHidden?: boolean }) => (
  <div className="brand-group" aria-hidden={ariaHidden}>
    {brands.map(({ id, name, src }) => (
      <div key={id} className="flex shrink-0 items-center justify-center px-7 py-2 sm:px-10">
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

// Sliding brand marquee. Two identical rows sit side by side inside a w-max
// flex track; the track animates from 0 to -50%, so the second row seamlessly
// takes over and the loop never shows a gap. This is also the failure mode: if
// the animation never runs (old browser, JS off, paint glitch) the rows stay
// fully visible and simply don't move — they never go blank or black. A solid
// min-height keeps the band from ever collapsing, and prefers-reduced-motion
// falls back to a centered, wrapped, fully-static set.
const BrandsSection = () => {
  const { t } = useTranslation();
  return (
    <section className="overflow-hidden border-y border-white/[0.07] bg-[#0a0a0a] py-10">
      <style>{`
        @keyframes brand-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .brand-viewport { width: 100%; overflow: hidden; }
        .brand-track {
          display: flex;
          width: max-content;
          min-height: 48px;
          align-items: center;
          animation: brand-scroll 40s linear infinite;
          will-change: transform;
        }
        .brand-group { display: flex; align-items: center; flex: 0 0 auto; }
        @media (min-width: 768px) { .brand-track { animation-duration: 55s; } }
        .brand-track:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .brand-track {
            animation: none;
            width: 100%;
            flex-wrap: wrap;
            justify-content: center;
          }
          .brand-track .brand-group:nth-child(2) { display: none; }
          .brand-track .brand-group { flex-wrap: wrap; justify-content: center; }
        }
      `}</style>

      <p className="mb-7 text-center font-inter text-[10px] font-semibold uppercase tracking-[0.3em] text-crimson-accent">
        {t('brands_label')}
      </p>

      <div className="brand-viewport">
        <div className="brand-track">
          <BrandRow />
          <BrandRow ariaHidden />
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;
