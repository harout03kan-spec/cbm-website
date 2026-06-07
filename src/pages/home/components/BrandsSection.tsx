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

// Duplicate for a seamless marquee loop.
const allBrands = [...brands, ...brands];

const BrandsSection = () => {
  return (
    <section className="py-10 bg-[#0a0a0a] border-y border-white/[0.07] overflow-hidden">
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          align-items: center;
          width: max-content;
          animation: marquee 45s linear infinite;
        }
        .marquee-track:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>

      {/* Label */}
      <p className="text-center font-inter text-[10px] font-semibold uppercase tracking-[0.3em] text-crimson-accent mb-7">
        Brands We Sell &amp; Repair
      </p>

      <div className="marquee-track">
        {allBrands.map(({ id, name, src }, idx) => (
          <div
            key={`${id}-${idx}`}
            className="flex items-center justify-center px-8 sm:px-10 opacity-70 hover:opacity-100 transition-opacity duration-300"
          >
            <img
              src={src}
              alt={`${name} logo`}
              loading="lazy"
              className="h-7 sm:h-8 w-auto object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default BrandsSection;
