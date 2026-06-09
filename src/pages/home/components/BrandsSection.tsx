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

// Duplicated track so the loop is seamless (translate by exactly one set = -50%).
const track = [...brands, ...brands];

// Sliding marquee, hardened against the blank/black flash seen on some mobile
// browsers: the track is promoted to its own stable GPU layer (translateZ/
// will-change/backface-visibility) and uses translate3d so the compositor keeps
// it painted during fast scroll. A duplicated track always fills the viewport,
// and prefers-reduced-motion falls back to a static (still fully visible) row.
const BrandsSection = () => {
  const { t } = useTranslation();
  return (
    <section className="py-10 bg-[#0a0a0a] border-y border-white/[0.07] overflow-hidden">
      <style>{`
        @keyframes brand-scroll {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-50%, 0, 0); }
        }
        .brand-track {
          display: flex;
          align-items: center;
          width: max-content;
          animation: brand-scroll 40s linear infinite;
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        @media (min-width: 768px) { .brand-track { animation-duration: 55s; } }
        .brand-track:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .brand-track { animation: none; flex-wrap: wrap; justify-content: center; width: 100%; }
        }
      `}</style>

      <p className="text-center font-inter text-[10px] font-semibold uppercase tracking-[0.3em] text-crimson-accent mb-7">
        {t('brands_label')}
      </p>

      <div className="brand-track">
        {track.map(({ id, name, src }, idx) => (
          <div key={`${id}-${idx}`} className="flex shrink-0 items-center justify-center px-7 sm:px-10 py-2">
            <img
              src={src}
              alt={`${name} logo`}
              className="block h-6 sm:h-8 w-auto object-contain opacity-90"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default BrandsSection;
