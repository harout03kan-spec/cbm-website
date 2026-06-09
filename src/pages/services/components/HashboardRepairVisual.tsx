import { useTranslation } from 'react-i18next';

// Premium, hand-coded ASIC hashboard repair animation for the Services hero.
// Pure inline SVG + CSS keyframes — no images, no animation libraries, only
// GPU-friendly transform / opacity / stroke-dashoffset. Stylised after an
// Antminer S21-style hashboard: green PCB, ~110 black chips in a 10×11 grid,
// silver SMD parts, test points, screws, top power terminals with red (+) and
// black (–) alligator clips, and a side tester plug + handheld tester. Current
// flows through the chips along a numbered serpentine path; a fault is traced to
// one bad chip (red), then repaired and the board passes testing (green).
// Freezes on a clean "tested" frame under prefers-reduced-motion. Fixed aspect
// ratio → no layout shift; scales to its container → responsive, no overflow.

const VW = 470;
const VH = 380;

// Chip grid (10 columns × 11 rows = 110).
const COLS = 10;
const ROWS = 11;
const CW = 28;
const CH = 16;
const colX = (c: number) => 52 + c * 33;
const rowY = (r: number) => 98 + r * 22;

const BAD_C = 4; // bad chip column
const BAD_R = 6; // bad chip row

type Chip = { x: number; y: number; bad: boolean; key: string };
const CHIPS: Chip[] = [];
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    CHIPS.push({ x: colX(c), y: rowY(r), bad: c === BAD_C && r === BAD_R, key: `${r}-${c}` });
  }
}

// Serpentine "current path" through every chip centre (the numbered flow).
const FLOW_PATH = (() => {
  let d = '';
  for (let r = 0; r < ROWS; r++) {
    const order = r % 2 === 0 ? [...Array(COLS).keys()] : [...Array(COLS).keys()].reverse();
    order.forEach((c, i) => {
      const x = colX(c) + CW / 2;
      const y = rowY(r) + CH / 2;
      d += r === 0 && i === 0 ? `M${x} ${y}` : ` L${x} ${y}`;
    });
  }
  return d;
})();

// Small scattered SMD parts (silver caps/resistors) and test points — keeps the
// board from looking empty without per-part animation.
const SMD = [
  [44, 70], [60, 72], [120, 70], [150, 72], [300, 70], [318, 72], [360, 72],
  [44, 348], [120, 350], [240, 350], [330, 350], [360, 348], [200, 70], [250, 72],
];
const TESTPTS = [[46, 120], [46, 200], [46, 280], [384, 110], [384, 250], [384, 320]];

export default function HashboardRepairVisual() {
  const { t } = useTranslation();
  const steps = [t('srv_anim_1'), t('srv_anim_2'), t('srv_anim_3'), t('srv_anim_4')];
  const longest = steps.reduce((a, b) => (a.length >= b.length ? a : b), '');

  return (
    <div className="relative">
      <style>{`
        .hbv-flow { stroke-dasharray: 6 12; animation: hbv-flow 5s linear infinite; }
        .hbv-clip-red { animation: hbv-pulse 2.4s ease-in-out infinite; }
        .hbv-clip-blk { animation: hbv-pulse 2.4s ease-in-out infinite .4s; }
        .hbv-bad { fill: #16a34a; animation: hbv-bad 10s ease-in-out infinite; }
        .hbv-bad-red { opacity: 0; animation: hbv-bad-red 10s ease-in-out infinite; }
        .hbv-bad-grn { opacity: 1; animation: hbv-bad-grn 10s ease-in-out infinite; }
        .hbv-probe { opacity: 0; animation: hbv-probe 10s ease-in-out infinite; }
        .hbv-tp { animation: hbv-tp 2.6s ease-in-out infinite; }
        .hbv-wave { stroke-dasharray: 40 60; animation: hbv-wave 2.2s linear infinite; }
        .hbv-l1 { opacity: 0; animation: hbv-l1 10s ease-in-out infinite; }
        .hbv-l2 { opacity: 0; animation: hbv-l2 10s ease-in-out infinite; }
        .hbv-l3 { opacity: 0; animation: hbv-l3 10s ease-in-out infinite; }
        .hbv-l4 { opacity: 1; animation: hbv-l4 10s ease-in-out infinite; }
        .hbv-tp2{animation-delay:.6s} .hbv-tp3{animation-delay:1.2s} .hbv-tp4{animation-delay:1.8s}

        @keyframes hbv-flow { to { stroke-dashoffset: -180; } }
        @keyframes hbv-pulse { 0%,100%{opacity:.55} 50%{opacity:1} }
        @keyframes hbv-bad {
          0%,30%{fill:#14141a} 38%{fill:#7f1d1d} 46%,62%{fill:#dc2626}
          72%{fill:#b45309} 82%{fill:#15803d} 92%,100%{fill:#16a34a}
        }
        @keyframes hbv-bad-red { 0%,32%{opacity:0} 46%,62%{opacity:1} 72%,100%{opacity:0} }
        @keyframes hbv-bad-grn { 0%,82%{opacity:0} 92%,99%{opacity:1} 100%{opacity:0} }
        @keyframes hbv-probe { 0%,30%{opacity:0} 40%,66%{opacity:1} 76%,100%{opacity:0} }
        @keyframes hbv-tp { 0%,100%{opacity:.3} 50%{opacity:1} }
        @keyframes hbv-wave { to { stroke-dashoffset: -100; } }
        @keyframes hbv-l1 { 0%{opacity:1} 30%{opacity:1} 35%,100%{opacity:0} }
        @keyframes hbv-l2 { 0%,31%{opacity:0} 37%,50%{opacity:1} 55%,100%{opacity:0} }
        @keyframes hbv-l3 { 0%,51%{opacity:0} 57%,76%{opacity:1} 81%,100%{opacity:0} }
        @keyframes hbv-l4 { 0%,77%{opacity:0} 83%,98%{opacity:1} 100%{opacity:0} }

        @media (prefers-reduced-motion: reduce) {
          .hbv-flow,.hbv-clip-red,.hbv-clip-blk,.hbv-bad,.hbv-bad-red,.hbv-bad-grn,
          .hbv-probe,.hbv-tp,.hbv-wave,.hbv-l1,.hbv-l2,.hbv-l3,.hbv-l4 { animation: none !important; }
        }
      `}</style>

      <div className="relative overflow-hidden rounded-[2rem] border border-red-950/60 bg-[radial-gradient(circle_at_28%_12%,rgba(127,29,29,0.2),transparent_55%),linear-gradient(160deg,#0c0c10,#050506)] p-3 shadow-2xl shadow-black/60">
        <div className="relative overflow-hidden rounded-[1.4rem] border border-zinc-900 bg-black">
          <svg className="block w-full" viewBox={`0 0 ${VW} ${VH}`} role="img" aria-label={t('srv_anim_aria')} style={{ aspectRatio: `${VW} / ${VH}` }}>
            <defs>
              <linearGradient id="pcb" x1="0" y1="0" x2="0.4" y2="1">
                <stop offset="0" stopColor="#0f3a26" />
                <stop offset="1" stopColor="#082015" />
              </linearGradient>
              <linearGradient id="chip" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#2a2a31" />
                <stop offset="1" stopColor="#121217" />
              </linearGradient>
              <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#d4d7dc" />
                <stop offset="0.5" stopColor="#9a9ea6" />
                <stop offset="1" stopColor="#6c7077" />
              </linearGradient>
              <linearGradient id="flowg" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#f87171" />
                <stop offset="1" stopColor="#dc2626" />
              </linearGradient>
            </defs>

            {/* ── PCB board ── */}
            <rect x="40" y="60" width="350" height="300" rx="14" fill="url(#pcb)" stroke="#1f6b45" strokeWidth="1.5" />
            {/* silkscreen edge + soldermask sheen */}
            <rect x="46" y="66" width="338" height="288" rx="10" fill="none" stroke="#155e3a" strokeWidth="1" opacity="0.7" />

            {/* thermal/heatsink contact bands behind chip columns */}
            <g fill="#114a30" opacity="0.55">
              {[0, 2, 4, 6, 8].map((c) => (
                <rect key={c} x={colX(c) - 3} y="92" width={CW + 6} height="252" rx="4" />
              ))}
            </g>

            {/* faint copper traces */}
            <g stroke="#0f5c39" strokeWidth="1" fill="none" opacity="0.6">
              <path d="M50 90 H380" /><path d="M50 222 H380" /><path d="M50 344 H380" />
              <path d="M215 70 V350" />
            </g>

            {/* top mounting brackets (metal) */}
            <rect x="44" y="50" width="60" height="20" rx="3" fill="url(#metal)" stroke="#4b4f55" strokeWidth="0.8" />
            <rect x="326" y="50" width="60" height="20" rx="3" fill="url(#metal)" stroke="#4b4f55" strokeWidth="0.8" />
            <circle cx="60" cy="60" r="3.4" fill="#3f3f46" /><circle cx="88" cy="60" r="3.4" fill="#3f3f46" />
            <circle cx="342" cy="60" r="3.4" fill="#3f3f46" /><circle cx="370" cy="60" r="3.4" fill="#3f3f46" />

            {/* electrolytic capacitors near the top */}
            <g>
              {[[300, 50], [316, 50], [332, 50], [348, 50]].map(([cx, cy]) => (
                <g key={`cap-${cx}`}>
                  <rect x={cx - 6} y={cy - 4} width="12" height="14" rx="6" fill="#1b1b22" stroke="#3f3f46" strokeWidth="0.8" />
                  <line x1={cx} y1={cy - 3} x2={cx} y2={cy + 8} stroke="#52525b" strokeWidth="1" />
                </g>
              ))}
            </g>

            {/* power terminals + alligator clips */}
            {/* (+) terminal — red clip */}
            <rect x="138" y="58" width="34" height="16" rx="3" fill="url(#metal)" stroke="#4b4f55" strokeWidth="0.8" />
            <circle cx="155" cy="66" r="4" fill="#3f3f46" />
            <text x="132" y="72" fontSize="11" fontWeight="700" fill="#f87171">+</text>
            <path d="M155 30 V52" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" className="hbv-clip-red" />
            <g className="hbv-clip-red">
              <path d="M147 40 L155 52 L163 40 Z" fill="#ef4444" />
              <rect x="148" y="30" width="14" height="12" rx="3" fill="#dc2626" />
              <path d="M149 52 l6 7 M161 52 l-6 7" stroke="#b91c1c" strokeWidth="2" />
            </g>

            {/* (–) terminal — black clip */}
            <rect x="258" y="58" width="34" height="16" rx="3" fill="url(#metal)" stroke="#4b4f55" strokeWidth="0.8" />
            <circle cx="275" cy="66" r="4" fill="#3f3f46" />
            <text x="252" y="71" fontSize="12" fontWeight="700" fill="#a1a1aa">–</text>
            <path d="M275 30 V52" stroke="#27272a" strokeWidth="4" strokeLinecap="round" className="hbv-clip-blk" />
            <g className="hbv-clip-blk">
              <path d="M267 40 L275 52 L283 40 Z" fill="#27272a" />
              <rect x="268" y="30" width="14" height="12" rx="3" fill="#18181b" />
              <path d="M269 52 l6 7 M281 52 l-6 7" stroke="#000" strokeWidth="2" />
            </g>

            {/* chips */}
            {CHIPS.map((chip) => (
              <g key={chip.key}>
                <rect
                  x={chip.x} y={chip.y} width={CW} height={CH} rx="2.5"
                  fill={chip.bad ? undefined : 'url(#chip)'}
                  className={chip.bad ? 'hbv-bad' : ''}
                  stroke="#050507" strokeWidth="0.8"
                />
                <rect x={chip.x + 3} y={chip.y + 3} width={CW - 6} height="2" rx="1" fill="#3f3f46" />
                <circle cx={chip.x + 4} cy={chip.y + CH - 4} r="1" fill="#52525b" />
                <circle cx={chip.x + CW - 4} cy={chip.y + CH - 4} r="1" fill="#52525b" />
              </g>
            ))}

            {/* serpentine current flow through the chips */}
            <path d={FLOW_PATH} fill="none" stroke="#0c3d27" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d={FLOW_PATH} fill="none" stroke="url(#flowg)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
              className="hbv-flow" style={{ filter: 'drop-shadow(0 0 3px rgba(220,38,38,0.8))' }} />

            {/* bad-chip glow rings (red → green) + probe */}
            <rect className="hbv-bad-red" x={colX(BAD_C) - 4} y={rowY(BAD_R) - 4} width={CW + 8} height={CH + 8} rx="5"
              fill="none" stroke="#ef4444" strokeWidth="2.2" style={{ filter: 'drop-shadow(0 0 7px rgba(239,68,68,0.95))' }} />
            <rect className="hbv-bad-grn" x={colX(BAD_C) - 4} y={rowY(BAD_R) - 4} width={CW + 8} height={CH + 8} rx="5"
              fill="none" stroke="#22c55e" strokeWidth="2.2" style={{ filter: 'drop-shadow(0 0 7px rgba(34,197,94,0.85))' }} />
            {/* probe needle pointing at the bad chip */}
            <g className="hbv-probe">
              <line x1={colX(BAD_C) + CW + 30} y1={rowY(BAD_R) - 26} x2={colX(BAD_C) + CW + 1} y2={rowY(BAD_R) + CH / 2} stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" />
              <circle cx={colX(BAD_C) + CW + 1} cy={rowY(BAD_R) + CH / 2} r="2" fill="#fca5a5" />
            </g>

            {/* SMD parts + test points + screws */}
            <g>
              {SMD.map(([x, y], i) => (
                <rect key={`smd-${i}`} x={x} y={y} width="7" height="3.4" rx="1" fill={i % 3 === 0 ? '#9ca3af' : '#3f3f46'} />
              ))}
            </g>
            <g>
              {TESTPTS.map(([x, y], i) => (
                <circle key={`tp-${i}`} className={`hbv-tp ${['', 'hbv-tp2', 'hbv-tp3', 'hbv-tp4', 'hbv-tp2', 'hbv-tp3'][i]}`} cx={x} cy={y} r="2.6" fill="#fca5a5" />
              ))}
            </g>
            <g fill="#71717a" stroke="#3f3f46" strokeWidth="0.6">
              {[[50, 70], [380, 70], [50, 350], [380, 350], [215, 350]].map(([x, y], i) => (
                <g key={`scr-${i}`}><circle cx={x} cy={y} r="4" /><path d={`M${x - 2.5} ${y} h5`} stroke="#27272a" strokeWidth="1" /></g>
              ))}
            </g>

            {/* white tester plug on the right edge + handheld tester */}
            <rect x="384" y="150" width="14" height="60" rx="2" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.8" />
            <g stroke="#9ca3af" strokeWidth="0.8">
              {[158, 168, 178, 188, 198].map((y) => <line key={y} x1="386" y1={y} x2="396" y2={y} />)}
            </g>
            <path d="M398 180 C 418 180, 420 210, 432 214" fill="none" stroke="#52525b" strokeWidth="2.5" />
            <rect x="412" y="206" width="50" height="74" rx="7" fill="#15151b" stroke="#3f3f46" strokeWidth="1" />
            <rect x="419" y="214" width="36" height="26" rx="3" fill="#06251a" stroke="#0f5c39" strokeWidth="0.8" />
            <polyline className="hbv-wave" points="421,227 427,221 433,231 439,219 445,229 451,223" fill="none" stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="420" cy="250" r="2.4" fill="#ef4444" className="hbv-clip-red" />
            <rect x="430" y="248" width="22" height="6" rx="3" fill="#27272a" />
            <rect x="430" y="260" width="22" height="6" rx="3" fill="#27272a" />
          </svg>

          {/* minimal status label, synced to the phases (bilingual) */}
          <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/70 px-3 py-1.5 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-crimson-accent" />
            <span className="grid font-inter text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-200">
              <span className="col-start-1 row-start-1 invisible">{longest}</span>
              <span className="hbv-l1 col-start-1 row-start-1">{steps[0]}</span>
              <span className="hbv-l2 col-start-1 row-start-1">{steps[1]}</span>
              <span className="hbv-l3 col-start-1 row-start-1">{steps[2]}</span>
              <span className="hbv-l4 col-start-1 row-start-1">{steps[3]}</span>
            </span>
          </div>
        </div>
      </div>

      {/* caption strip */}
      <div className="absolute -bottom-4 left-6 right-6 rounded-2xl border border-zinc-800 bg-black/85 px-5 py-3 backdrop-blur sm:left-10 sm:right-10">
        <p className="text-center text-xs font-medium uppercase tracking-[0.18em] text-zinc-300">
          {t('srv2_hero_caption')}
        </p>
      </div>
    </div>
  );
}
