import { useTranslation } from 'react-i18next';

// Premium hashboard repair animation for the Services hero. Pure SVG + CSS
// keyframes (no images, no 3D bundle, GPU-friendly transform/opacity only).
// A diagnostic scan sweeps the board, one ASIC flags as a fault (red), is
// repaired (amber), then the whole board passes testing (green ticks) — looping
// through Inspect → Isolate → Repair → Test. Under prefers-reduced-motion it
// freezes on the clean "tested" frame. Fixed aspect ratio → no layout shift.

const COLS = [40, 116, 192, 268];
const ROWS = [50, 118, 186];
const CHIP_W = 52;
const CHIP_H = 48;
const FAULT_X = 192; // col 3
const FAULT_Y = 118; // row 2

type Chip = { x: number; y: number; key: string; fault: boolean };
const CHIPS: Chip[] = ROWS.flatMap((y, r) =>
  COLS.map((x, c) => ({ x, y, key: `${r}-${c}`, fault: x === FAULT_X && y === FAULT_Y })),
);

const tick = (x: number, y: number) =>
  `M${x + CHIP_W - 18} ${y + 14} l4 5 l8 -10`; // small check inside chip top-right

export default function HashboardRepairVisual() {
  const { t } = useTranslation();
  const steps = [t('srv_anim_1'), t('srv_anim_2'), t('srv_anim_3'), t('srv_anim_4')];

  return (
    <div className="relative">
      <style>{`
        .hbv-scan { animation: hbv-scan 9s linear infinite; }
        .hbv-fault { fill: #16a34a; animation: hbv-fault 9s ease-in-out infinite; }
        .hbv-glow-red { opacity: 0; animation: hbv-glow-red 9s ease-in-out infinite; }
        .hbv-glow-grn { opacity: 1; animation: hbv-glow-grn 9s ease-in-out infinite; }
        .hbv-tick { opacity: 1; animation: hbv-tick 9s ease-in-out infinite; }
        .hbv-cp { animation: hbv-cp 2.2s ease-in-out infinite; }
        .hbv-l1 { opacity: 0; animation: hbv-l1 9s ease-in-out infinite; }
        .hbv-l2 { opacity: 0; animation: hbv-l2 9s ease-in-out infinite; }
        .hbv-l3 { opacity: 0; animation: hbv-l3 9s ease-in-out infinite; }
        .hbv-l4 { opacity: 1; animation: hbv-l4 9s ease-in-out infinite; }

        @keyframes hbv-scan {
          0%   { transform: translateY(0px);   opacity: 0; }
          5%   { opacity: 0.95; }
          34%  { opacity: 0.95; }
          42%  { transform: translateY(232px); opacity: 0; }
          100% { transform: translateY(232px); opacity: 0; }
        }
        @keyframes hbv-fault {
          0%,40% { fill: #14141a; }
          46%    { fill: #7f1d1d; }
          52%,60%{ fill: #dc2626; }
          70%    { fill: #b45309; }
          80%    { fill: #15803d; }
          90%,100%{ fill: #16a34a; }
        }
        @keyframes hbv-glow-red { 0%,42%{opacity:0} 52%,60%{opacity:1} 70%,100%{opacity:0} }
        @keyframes hbv-glow-grn { 0%,80%{opacity:0} 88%,99%{opacity:1} 100%{opacity:0} }
        @keyframes hbv-tick { 0%,76%{opacity:0} 86%,99%{opacity:1} 100%{opacity:0} }
        @keyframes hbv-cp { 0%,100%{opacity:.25; transform:scale(1)} 50%{opacity:1; transform:scale(1.5)} }
        @keyframes hbv-l1 { 0%{opacity:1} 36%{opacity:1} 41%,100%{opacity:0} }
        @keyframes hbv-l2 { 0%,37%{opacity:0} 43%,58%{opacity:1} 63%,100%{opacity:0} }
        @keyframes hbv-l3 { 0%,59%{opacity:0} 64%,77%{opacity:1} 82%,100%{opacity:0} }
        @keyframes hbv-l4 { 0%,78%{opacity:0} 83%,98%{opacity:1} 100%{opacity:0} }
        .hbv-cp2 { animation-delay: .5s; }
        .hbv-cp3 { animation-delay: 1s; }
        .hbv-cp4 { animation-delay: 1.5s; }
        @media (prefers-reduced-motion: reduce) {
          .hbv-scan, .hbv-fault, .hbv-glow-red, .hbv-glow-grn, .hbv-tick, .hbv-cp,
          .hbv-l1, .hbv-l2, .hbv-l3, .hbv-l4 { animation: none !important; }
        }
      `}</style>

      <div className="relative overflow-hidden rounded-[2rem] border border-red-950/60 bg-[radial-gradient(circle_at_30%_15%,rgba(127,29,29,0.22),transparent_55%),linear-gradient(160deg,#0b0b0e,#050506)] p-3 shadow-2xl shadow-black/60">
        <div className="relative overflow-hidden rounded-[1.5rem] border border-zinc-900 bg-black">
          <svg
            className="hbv block w-full"
            viewBox="0 0 360 300"
            role="img"
            aria-label={t('srv_anim_aria')}
            style={{ aspectRatio: '360 / 300' }}
          >
            <defs>
              <linearGradient id="hbv-board" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#13251b" />
                <stop offset="1" stopColor="#0a140f" />
              </linearGradient>
              <linearGradient id="hbv-chip" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#26262e" />
                <stop offset="1" stopColor="#15151b" />
              </linearGradient>
              <linearGradient id="hbv-scanline" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#dc2626" stopOpacity="0" />
                <stop offset="0.5" stopColor="#f87171" stopOpacity="1" />
                <stop offset="1" stopColor="#dc2626" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* PCB board */}
            <rect x="8" y="8" width="344" height="252" rx="16" fill="url(#hbv-board)" stroke="#1f3a2c" strokeWidth="1.5" />

            {/* faint traces */}
            <g stroke="#1c3a2b" strokeWidth="1.5" fill="none" opacity="0.8">
              <path d="M20 40 H340" /><path d="M20 108 H340" /><path d="M20 176 H340" />
              <path d="M66 20 V250" /><path d="M142 20 V250" /><path d="M218 20 V250" /><path d="M294 20 V250" />
            </g>

            {/* gold connector pads (bottom) */}
            <g fill="#caa14a">
              {[28, 52, 76, 100, 124, 236, 260, 284, 308, 332].map((x) => (
                <rect key={x} x={x} y="238" width="14" height="14" rx="2" opacity="0.85" />
              ))}
            </g>

            {/* checkpoint dots (signal/voltage checks) */}
            <g fill="#f87171">
              <circle className="hbv-cp" cx="22" cy="40" r="3" />
              <circle className="hbv-cp hbv-cp2" cx="22" cy="108" r="3" />
              <circle className="hbv-cp hbv-cp3" cx="22" cy="176" r="3" />
              <circle className="hbv-cp hbv-cp4" cx="338" cy="74" r="3" />
              <circle className="hbv-cp hbv-cp2" cx="338" cy="142" r="3" />
            </g>

            {/* chips */}
            {CHIPS.map((chip) => (
              <g key={chip.key}>
                <rect
                  x={chip.x}
                  y={chip.y}
                  width={CHIP_W}
                  height={CHIP_H}
                  rx="5"
                  fill={chip.fault ? undefined : 'url(#hbv-chip)'}
                  className={chip.fault ? 'hbv-fault' : ''}
                  stroke="#000"
                  strokeWidth="1"
                />
                {/* chip pin notch */}
                <rect x={chip.x + 6} y={chip.y + 6} width={CHIP_W - 12} height="3" rx="1.5" fill="#3f3f46" />
                {/* tested check */}
                <path
                  d={tick(chip.x, chip.y)}
                  className="hbv-tick"
                  fill="none"
                  stroke="#4ade80"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            ))}

            {/* fault glow rings on the flagged chip */}
            <rect className="hbv-glow-red" x={FAULT_X - 4} y={FAULT_Y - 4} width={CHIP_W + 8} height={CHIP_H + 8} rx="8"
              fill="none" stroke="#ef4444" strokeWidth="2.5" style={{ filter: 'drop-shadow(0 0 8px rgba(239,68,68,0.9))' }} />
            <rect className="hbv-glow-grn" x={FAULT_X - 4} y={FAULT_Y - 4} width={CHIP_W + 8} height={CHIP_H + 8} rx="8"
              fill="none" stroke="#22c55e" strokeWidth="2.5" style={{ filter: 'drop-shadow(0 0 8px rgba(34,197,94,0.85))' }} />

            {/* diagnostic scan line */}
            <g className="hbv-scan">
              <rect x="10" y="12" width="340" height="3" fill="url(#hbv-scanline)" />
              <rect x="10" y="12" width="340" height="22" fill="url(#hbv-scanline)" opacity="0.16" />
            </g>
          </svg>

          {/* Status overlay — Inspect / Isolate / Repair / Test (bilingual) */}
          <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/70 px-3 py-1.5 backdrop-blur">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inline-flex h-2 w-2 rounded-full bg-crimson-accent" />
            </span>
            <span className="relative grid font-inter text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-200">
              {/* stacked labels cross-fade; reserve width with the longest */}
              <span className="col-start-1 row-start-1 invisible">{steps.reduce((a, b) => (a.length >= b.length ? a : b), '')}</span>
              <span className="hbv-l1 col-start-1 row-start-1">{steps[0]}</span>
              <span className="hbv-l2 col-start-1 row-start-1">{steps[1]}</span>
              <span className="hbv-l3 col-start-1 row-start-1">{steps[2]}</span>
              <span className="hbv-l4 col-start-1 row-start-1">{steps[3]}</span>
            </span>
          </div>
        </div>
      </div>

      {/* caption strip (kept from the previous hero image) */}
      <div className="absolute -bottom-4 left-6 right-6 rounded-2xl border border-zinc-800 bg-black/85 px-5 py-3 backdrop-blur sm:left-10 sm:right-10">
        <p className="text-center text-xs font-medium uppercase tracking-[0.18em] text-zinc-300">
          {t('srv2_hero_caption')}
        </p>
      </div>
    </div>
  );
}
