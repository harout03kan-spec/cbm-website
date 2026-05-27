// Brand logos with clean, professional designs
const brands = [
  {
    id: 'bitmain',
    name: 'Bitmain',
    Logo: () => (
      <div className="flex items-center gap-2.5 select-none">
        {/* Bitmain — orange square grid mark */}
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="6" fill="#FF6B00" opacity="0.15"/>
          <rect x="6" y="6" width="8" height="8" rx="1.5" fill="#FF6B00"/>
          <rect x="18" y="6" width="8" height="8" rx="1.5" fill="#FF6B00" opacity="0.7"/>
          <rect x="6" y="18" width="8" height="8" rx="1.5" fill="#FF6B00" opacity="0.7"/>
          <rect x="18" y="18" width="8" height="8" rx="1.5" fill="#FF6B00" opacity="0.4"/>
        </svg>
        <span style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900, fontSize: '15px', letterSpacing: '0.04em', color: 'white' }}>
          BITMAIN
        </span>
      </div>
    ),
  },
  {
    id: 'antminer',
    name: 'Antminer',
    Logo: () => (
      <div className="flex items-center gap-2.5 select-none">
        {/* Antminer — orange hex circuit mark */}
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="16,3 28,9.5 28,22.5 16,29 4,22.5 4,9.5" fill="#FF6B00" opacity="0.12"/>
          <polygon points="16,3 28,9.5 28,22.5 16,29 4,22.5 4,9.5" fill="none" stroke="#FF6B00" strokeWidth="1.5"/>
          <circle cx="16" cy="16" r="4" fill="#FF6B00"/>
        </svg>
        <span style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900, fontSize: '15px', letterSpacing: '0.04em', color: 'white' }}>
          ANTMINER
        </span>
      </div>
    ),
  },
  {
    id: 'microbt',
    name: 'MicroBT',
    Logo: () => (
      <div className="flex items-center gap-2.5 select-none">
        {/* MicroBT — teal/green M-chip mark */}
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="6" fill="#00C896" opacity="0.12"/>
          <path d="M7 23V9l5 7 4-7 4 7 5-7v14" stroke="#00C896" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
        <span style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900, fontSize: '15px', letterSpacing: '0.04em', color: 'white' }}>
          MICROBT
        </span>
      </div>
    ),
  },
  {
    id: 'whatsminer',
    name: 'Whatsminer',
    Logo: () => (
      <div className="flex items-center gap-2.5 select-none">
        {/* Whatsminer — teal diamond mark */}
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="6" fill="#00C896" opacity="0.12"/>
          <path d="M16 5 L27 16 L16 27 L5 16 Z" fill="#00C896" opacity="0.2"/>
          <path d="M16 5 L27 16 L16 27 L5 16 Z" stroke="#00C896" strokeWidth="1.8" fill="none"/>
          <circle cx="16" cy="16" r="3" fill="#00C896"/>
        </svg>
        <span style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900, fontSize: '15px', letterSpacing: '0.04em', color: 'white' }}>
          WHATSMINER
        </span>
      </div>
    ),
  },
  {
    id: 'canaan',
    name: 'Canaan',
    Logo: () => (
      <div className="flex items-center gap-2.5 select-none">
        {/* Canaan — blue wave/avalon mark */}
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="6" fill="#3B82F6" opacity="0.12"/>
          <path d="M5 20 Q9 10 16 16 Q23 22 27 12" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          <circle cx="16" cy="16" r="2.5" fill="#3B82F6"/>
        </svg>
        <span style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900, fontSize: '15px', letterSpacing: '0.04em', color: 'white' }}>
          CANAAN
        </span>
      </div>
    ),
  },
  {
    id: 'avalon',
    name: 'Avalon',
    Logo: () => (
      <div className="flex items-center gap-2.5 select-none">
        {/* Avalon — blue A-mark */}
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="6" fill="#3B82F6" opacity="0.12"/>
          <path d="M16 5 L27 26 H5 Z" fill="#3B82F6" opacity="0.15"/>
          <path d="M16 5 L27 26 H5 Z" stroke="#3B82F6" strokeWidth="2" strokeLinejoin="round" fill="none"/>
          <line x1="10" y1="19" x2="22" y2="19" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <span style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900, fontSize: '15px', letterSpacing: '0.04em', color: 'white' }}>
          AVALON
        </span>
      </div>
    ),
  },
  {
    id: 'goldshell',
    name: 'Goldshell',
    Logo: () => (
      <div className="flex items-center gap-2.5 select-none">
        {/* Goldshell — gold shell/hexagon mark */}
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="6" fill="#F59E0B" opacity="0.12"/>
          <polygon points="16,4 26,9.5 26,22.5 16,28 6,22.5 6,9.5" fill="#F59E0B" opacity="0.2"/>
          <polygon points="16,4 26,9.5 26,22.5 16,28 6,22.5 6,9.5" stroke="#F59E0B" strokeWidth="1.8" fill="none"/>
          <polygon points="16,10 21,13 21,19 16,22 11,19 11,13" fill="#F59E0B" opacity="0.5"/>
        </svg>
        <span style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900, fontSize: '15px', letterSpacing: '0.04em', color: 'white' }}>
          GOLDSHELL
        </span>
      </div>
    ),
  },
];

// Duplicate for seamless loop
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
      `}</style>

      {/* Label */}
      <p className="text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-600 mb-7">
        Brands We Sell &amp; Repair
      </p>

      <div className="marquee-track">
        {allBrands.map(({ id, Logo }, idx) => (
          <div
            key={`${id}-${idx}`}
            className="flex items-center justify-center px-10 opacity-60 hover:opacity-100 transition-opacity duration-300"
          >
            <Logo />
          </div>
        ))}
      </div>
    </section>
  );
};

export default BrandsSection;
