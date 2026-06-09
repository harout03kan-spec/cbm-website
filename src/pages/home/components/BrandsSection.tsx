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

// Static, centered, wrapping grid — no animation. The previous CSS marquee could
// occasionally drop its composited layer on mobile (blank/black flash) during
// fast scroll; a static grid always renders on every device, refresh, and locale.
const BrandsSection = () => {
  const { t } = useTranslation();
  return (
    <section className="py-10 bg-[#0a0a0a] border-y border-white/[0.07]">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center font-inter text-[10px] font-semibold uppercase tracking-[0.3em] text-crimson-accent mb-7">
          {t('brands_label')}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-6 sm:gap-x-12">
          {brands.map(({ id, name, src }) => (
            <img
              key={id}
              src={src}
              alt={`${name} logo`}
              className="block h-6 sm:h-8 w-auto object-contain opacity-90"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;
