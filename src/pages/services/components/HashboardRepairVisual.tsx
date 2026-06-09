import { useTranslation } from 'react-i18next';

// Hand-coded ASIC hashboard repair visual for the Services hero — inline SVG +
// CSS keyframes only (no images, no animation libraries). Structured from the
// client's real hashboard photos: a tall green PCB with muted brushed-metal
// side/top rails and screws, vertical silver heat-contact strips with subtle
// copper pads, green lanes with fine traces, small BLACK ICs placed by domain
// (alternating high/low between domains, starting from the right), a light
// cream controller strip along the bottom with small black ICs and SMD parts,
// muted grey capacitors and a small white tester connector on the right edge,
// and two top-right metal terminal tabs gripped by realistic red/black
// alligator clips. Animation stays subtle (diagnostic scan, pulsing test
// points, one traced fault that repairs to green). Fixed aspect ratio → no
// layout shift; responsive; freezes on a clean tested frame under
// prefers-reduced-motion.

const VW = 396;
const VH = 462;

const AX = 40;     // strip area left
const AW = 300;    // strip area width (to x=340)
const AY = 78;     // strips top
const AYB = 380;   // strips bottom
const STRIPS = 10;
const SW = 17;
const stripX = (i: number) => AX + i * 30; // 40..310
const BANDS = [78, 154, 230, 306, 380];    // 4 domain bands; inter-domain at 154/230/306

// Subtle copper pads at the domain separators (small, muted — not gold blocks).
const COPPER: { x: number; y: number }[] = [];
for (let i = 0; i < STRIPS; i++) for (const by of BANDS) COPPER.push({ x: stripX(i) + 3, y: by - 4 });

// Small BLACK ICs placed by domain, alternating low/high, starting from the right.
const DOMAIN_ICS: { x: number; y: number; bad?: boolean }[] = [
  { x: 300, y: 156 }, { x: 282, y: 156 }, { x: 264, y: 156 },          // gap 1 — low, right
  { x: 196, y: 219 }, { x: 178, y: 219, bad: true }, { x: 214, y: 219 }, // gap 2 — high, centre (fault)
  { x: 296, y: 308 }, { x: 278, y: 308 }, { x: 260, y: 308 },          // gap 3 — low, right
];
const FAULT = DOMAIN_ICS.find((d) => d.bad)!;

const BEIGE_ICS = [34, 96, 168, 244, 312];
const BEIGE_SMD = [60, 72, 84, 132, 144, 210, 222, 288, 300, 348, 360];

export default function HashboardRepairVisual() {
  const { t } = useTranslation();
  const steps = [t('srv_anim_1'), t('srv_anim_2'), t('srv_anim_3'), t('srv_anim_4')];
  const longest = steps.reduce((a, b) => (a.length >= b.length ? a : b), '');

  return (
    <div className="relative">
      <style>{`
        .hbv-scan{animation:hbv-scan 9s ease-in-out infinite}
        .hbv-tp{animation:hbv-tp 2.4s ease-in-out infinite}
        .hbv-tp2{animation-delay:.5s}.hbv-tp3{animation-delay:1s}.hbv-tp4{animation-delay:1.5s}.hbv-tp5{animation-delay:.8s}.hbv-tp6{animation-delay:1.3s}
        .hbv-bad{fill:#16a34a;animation:hbv-bad 9s ease-in-out infinite}
        .hbv-bad-red{opacity:0;animation:hbv-bad-red 9s ease-in-out infinite}
        .hbv-bad-grn{opacity:1;animation:hbv-bad-grn 9s ease-in-out infinite}
        .hbv-probe{opacity:0;animation:hbv-probe 9s ease-in-out infinite}
        .hbv-clip{animation:hbv-pulse 2.6s ease-in-out infinite}
        .hbv-wave{stroke-dasharray:30 50;animation:hbv-wave 2.2s linear infinite}
        .hbv-led{fill:#22c55e;animation:hbv-led 9s ease-in-out infinite}
        .hbv-l1{opacity:0;animation:hbv-l1 9s ease-in-out infinite}
        .hbv-l2{opacity:0;animation:hbv-l2 9s ease-in-out infinite}
        .hbv-l3{opacity:0;animation:hbv-l3 9s ease-in-out infinite}
        .hbv-l4{opacity:1;animation:hbv-l4 9s ease-in-out infinite}
        @keyframes hbv-scan{0%{transform:translateY(0);opacity:0}5%{opacity:.75}33%{opacity:.75}40%{transform:translateY(300px);opacity:0}100%{transform:translateY(300px);opacity:0}}
        @keyframes hbv-tp{0%,100%{opacity:.25}50%{opacity:1}}
        @keyframes hbv-bad{0%,30%{fill:#15151a}38%{fill:#7f1d1d}46%,60%{fill:#dc2626}70%{fill:#b45309}80%{fill:#15803d}90%,100%{fill:#16a34a}}
        @keyframes hbv-bad-red{0%,32%{opacity:0}46%,60%{opacity:1}70%,100%{opacity:0}}
        @keyframes hbv-bad-grn{0%,80%{opacity:0}90%,99%{opacity:1}100%{opacity:0}}
        @keyframes hbv-probe{0%,30%{opacity:0}40%,64%{opacity:1}74%,100%{opacity:0}}
        @keyframes hbv-pulse{0%,100%{opacity:.6}50%{opacity:1}}
        @keyframes hbv-wave{to{stroke-dashoffset:-80}}
        @keyframes hbv-led{0%,30%{fill:#f87171}46%,60%{fill:#ef4444}80%,100%{fill:#22c55e}}
        @keyframes hbv-l1{0%{opacity:1}30%{opacity:1}35%,100%{opacity:0}}
        @keyframes hbv-l2{0%,31%{opacity:0}37%,49%{opacity:1}54%,100%{opacity:0}}
        @keyframes hbv-l3{0%,50%{opacity:0}56%,73%{opacity:1}78%,100%{opacity:0}}
        @keyframes hbv-l4{0%,77%{opacity:0}83%,98%{opacity:1}100%{opacity:0}}
        @media (prefers-reduced-motion:reduce){
          .hbv-scan,.hbv-tp,.hbv-bad,.hbv-bad-red,.hbv-bad-grn,.hbv-probe,.hbv-clip,.hbv-wave,.hbv-led,.hbv-l1,.hbv-l2,.hbv-l3,.hbv-l4{animation:none!important}
        }
      `}</style>

      <div className="relative overflow-hidden rounded-[1.8rem] border border-red-950/60 bg-[radial-gradient(circle_at_25%_8%,rgba(127,29,29,0.14),transparent_55%),linear-gradient(160deg,#0b0b0f,#050506)] p-3 shadow-2xl shadow-black/60">
        <div className="overflow-hidden rounded-[1.3rem] border border-zinc-900 bg-[#06120c]">
          <svg className="block w-full" viewBox={`0 0 ${VW} ${VH}`} role="img" aria-label={t('srv_anim_aria')} style={{ aspectRatio: `${VW} / ${VH}` }}>
            <defs>
              <linearGradient id="g-pcb" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stopColor="#10492f" /><stop offset="1" stopColor="#0a2c1c" /></linearGradient>
              {/* muted brushed metal — not bright/white */}
              <linearGradient id="g-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#8c9097" /><stop offset="0.5" stopColor="#6f747b" /><stop offset="1" stopColor="#565a61" /></linearGradient>
              <linearGradient id="g-strip" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#7f838a" /><stop offset="0.5" stopColor="#9a9ea5" /><stop offset="1" stopColor="#676b72" /></linearGradient>
              {/* muted copper, not gold */}
              <linearGradient id="g-copper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9a5f33" /><stop offset="1" stopColor="#6c4222" /></linearGradient>
              <linearGradient id="g-chip" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#212128" /><stop offset="1" stopColor="#0a0a0e" /></linearGradient>
              {/* light cream controller strip */}
              <linearGradient id="g-beige" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e8e4d4" /><stop offset="1" stopColor="#d4cfb8" /></linearGradient>
            </defs>

            {/* board */}
            <rect x="14" y="14" width="368" height="434" rx="9" fill="url(#g-pcb)" stroke="#1c6a44" strokeWidth="1.3" />

            {/* fine horizontal traces in the lanes (covered by strips later) */}
            <g stroke="#1d8453" strokeWidth="0.5" opacity="0.45">
              {Array.from({ length: 40 }).map((_, k) => <line key={k} x1={AX} y1={AY + 4 + k * 7.4} x2={AX + AW} y2={AY + 4 + k * 7.4} />)}
            </g>

            {/* vertical silver heat-contact strips (muted) */}
            {Array.from({ length: STRIPS }).map((_, i) => (
              <rect key={i} x={stripX(i)} y={AY} width={SW} height={AYB - AY} rx="2" fill="url(#g-strip)" stroke="#4f535a" strokeWidth="0.4" opacity="0.95" />
            ))}

            {/* subtle domain separators + small muted copper pads */}
            {BANDS.map((by) => <rect key={by} x={AX - 2} y={by - 5} width={AW + 4} height="10" fill="url(#g-metal)" opacity="0.4" />)}
            {COPPER.map((p, i) => <rect key={`cu-${i}`} x={p.x} y={p.y} width="10" height="7" rx="1.2" fill="url(#g-copper)" stroke="#5a3618" strokeWidth="0.3" opacity="0.92" />)}

            {/* small black ICs placed by domain (alternating high/low, from the right) */}
            {DOMAIN_ICS.map((c, i) => (
              <g key={`ic-${i}`}>
                <rect x={c.x} y={c.y} width="13" height="8" rx="1.1" fill={c.bad ? undefined : 'url(#g-chip)'} className={c.bad ? 'hbv-bad' : ''} stroke="#040406" strokeWidth="0.5" />
                <rect x={c.x + 2} y={c.y + 1.8} width="9" height="1.4" rx="0.5" fill="#3f3f46" />
              </g>
            ))}

            {/* ── top section ── */}
            <rect x="22" y="14" width="352" height="11" rx="2" fill="url(#g-metal)" stroke="#4f535a" strokeWidth="0.5" />
            {[40, 96, 300].map((x) => <circle key={`ts-${x}`} cx={x} cy="19.5" r="2.4" fill="#2b2b30" />)}
            {/* muted grey electrolytic caps */}
            {[150, 166, 182, 198].map((cx) => (
              <g key={`bc-${cx}`}><rect x={cx - 6} y="30" width="12" height="22" rx="6" fill="#5b5f66" stroke="#3a3d43" strokeWidth="0.7" /><path d={`M${cx} 33 v16 M${cx - 4} 41 h8`} stroke="#3a3d43" strokeWidth="0.8" /></g>
            ))}
            {/* barcode + a few top SMD */}
            <rect x="60" y="40" width="22" height="8" rx="1" fill="#cfd2c0" stroke="#9ca3af" strokeWidth="0.4" />
            <g fill="#17171c">{[40, 46, 96, 102, 120, 126].map((x) => <rect key={x} x={x} y="56" width="4" height="6" rx="0.6" />)}</g>

            {/* top-right metal terminal tabs (bent) — where the clips clamp */}
            <path d="M334 16 L334 4 Q334 1 337 1 L344 1 Q347 1 347 4 L347 16 Z" fill="url(#g-metal)" stroke="#4f535a" strokeWidth="0.6" />
            <path d="M352 16 L352 6 Q352 3 355 3 L362 3 Q365 3 365 6 L365 16 Z" fill="url(#g-metal)" stroke="#4f535a" strokeWidth="0.6" />

            {/* segmented side rails with screws (muted) */}
            <rect x="16" y="28" width="14" height="412" rx="2" fill="url(#g-metal)" stroke="#4f535a" strokeWidth="0.5" />
            <rect x="366" y="28" width="14" height="412" rx="2" fill="url(#g-metal)" stroke="#4f535a" strokeWidth="0.5" />
            <g stroke="#52565d" strokeWidth="0.5">{Array.from({ length: 13 }).map((_, k) => (<g key={k}><line x1="16" y1={40 + k * 30} x2="30" y2={40 + k * 30} /><line x1="366" y1={40 + k * 30} x2="380" y2={40 + k * 30} /></g>))}</g>
            {[60, 220, 400].map((y) => <g key={`rs-${y}`}><circle cx="23" cy={Math.min(y, 432)} r="2.8" fill="#2b2b30" /><circle cx="373" cy={Math.min(y, 432)} r="2.8" fill="#2b2b30" /></g>)}

            {/* small white tester connector on the RIGHT edge, below the terminals */}
            <rect x="350" y="64" width="16" height="30" rx="2" fill="#e7e9ee" stroke="#9ca3af" strokeWidth="0.7" />
            <g stroke="#9ca3af" strokeWidth="0.6">{[68, 74, 80, 86, 92].map((y) => <line key={y} x1="352" y1={y} x2="364" y2={y} />)}</g>

            {/* ── light cream controller strip (bottom) ── */}
            <rect x="16" y="384" width="364" height="54" rx="3" fill="url(#g-beige)" stroke="#b7b189" strokeWidth="0.6" />
            {BEIGE_ICS.map((x, i) => (
              <g key={`bi-${i}`}><rect x={x} y={398 + (i % 2) * 12} width="17" height="12" rx="1.4" fill="#17171c" stroke="#3a3a40" strokeWidth="0.5" /><rect x={x + 3} y={401 + (i % 2) * 12} width="11" height="1.8" rx="0.6" fill="#4b4b52" /></g>
            ))}
            <g>{BEIGE_SMD.map((x, i) => <rect key={`bs-${i}`} x={x} y={426} width="6" height="3" rx="0.6" fill={i % 3 === 0 ? '#8a8e95' : '#2b2b30'} />)}</g>
            <g className="hbv-tp" fill="#fca5a5">
              <circle cx="40" cy="430" r="2.2" /><circle className="hbv-tp2" cx="124" cy="430" r="2.2" /><circle className="hbv-tp3" cx="244" cy="430" r="2.2" /><circle className="hbv-tp4" cx="332" cy="430" r="2.2" />
            </g>
            <rect x="300" y="424" width="28" height="9" rx="1.5" fill="#e7e9ee" stroke="#9ca3af" strokeWidth="0.5" />
            <rect x="22" y="438" width="352" height="8" rx="2" fill="url(#g-metal)" stroke="#4f535a" strokeWidth="0.5" />

            {/* pulsing test points in the lanes */}
            <g fill="#fca5a5">
              <circle className="hbv-tp hbv-tp5" cx="96" cy="110" r="2.2" />
              <circle className="hbv-tp hbv-tp6" cx="300" cy="180" r="2.2" />
              <circle className="hbv-tp hbv-tp2" cx="120" cy="300" r="2.2" />
            </g>

            {/* fault: probe + red→green ring on the small bad IC */}
            <rect className="hbv-bad-red" x={FAULT.x - 2.5} y={FAULT.y - 2.5} width="18" height="13" rx="2" fill="none" stroke="#ef4444" strokeWidth="1.6" style={{ filter: 'drop-shadow(0 0 5px rgba(239,68,68,0.95))' }} />
            <rect className="hbv-bad-grn" x={FAULT.x - 2.5} y={FAULT.y - 2.5} width="18" height="13" rx="2" fill="none" stroke="#22c55e" strokeWidth="1.6" style={{ filter: 'drop-shadow(0 0 5px rgba(34,197,94,0.85))' }} />
            <g className="hbv-probe">
              <line x1={FAULT.x - 30} y1={FAULT.y - 26} x2={FAULT.x} y2={FAULT.y + 4} stroke="#e5e7eb" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx={FAULT.x} cy={FAULT.y + 4} r="1.6" fill="#fca5a5" />
            </g>

            {/* realistic red + black alligator clips on the top-right terminal tabs */}
            {/* RED — outer terminal (x≈358) */}
            <g className="hbv-clip">
              <path d="M392 -2 C 384 6, 374 8, 360 10" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
              <rect x="362" y="4" width="13" height="9" rx="3" fill="#dc2626" stroke="#7f1d1d" strokeWidth="0.6" />{/* boot */}
              <path d="M362 9 L357 12 L362 13 L357 16" fill="none" stroke="#b91c1c" strokeWidth="1.5" strokeLinejoin="round" />{/* upper jaw teeth */}
              <path d="M362 12 L356 16 L362 16 L357 19" fill="none" stroke="#991b1b" strokeWidth="1.5" strokeLinejoin="round" />{/* lower jaw teeth */}
              <circle cx="362" cy="12" r="1.3" fill="#fca5a5" />{/* pivot */}
            </g>
            {/* BLACK — inner terminal (x≈340) */}
            <g className="hbv-clip" style={{ animationDelay: '.5s' }}>
              <path d="M392 12 C 380 16, 366 16, 352 16" fill="none" stroke="#27272a" strokeWidth="3" strokeLinecap="round" />
              <rect x="344" y="10" width="13" height="9" rx="3" fill="#18181b" stroke="#000" strokeWidth="0.6" />
              <path d="M344 15 L339 18 L344 19 L339 22" fill="none" stroke="#0a0a0a" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M344 18 L338 22 L344 22 L339 25" fill="none" stroke="#000" strokeWidth="1.5" strokeLinejoin="round" />
              <circle cx="344" cy="18" r="1.3" fill="#71717a" />
            </g>

            {/* subtle diagnostic scan line */}
            <g className="hbv-scan">
              <rect x="14" y={AY} width="368" height="2" fill="#f87171" opacity="0.75" />
              <rect x="14" y={AY - 6} width="368" height="14" fill="#dc2626" opacity="0.08" />
            </g>
          </svg>

          {/* small bench-tester status bar below the board */}
          <div className="flex items-center justify-between gap-3 border-t border-zinc-900 bg-black/85 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <svg width="26" height="14" viewBox="0 0 26 14" aria-hidden="true" className="shrink-0">
                <rect x="0.5" y="0.5" width="25" height="13" rx="2" fill="#0c0c10" stroke="#27272a" />
                <polyline className="hbv-wave" points="3,9 7,5 10,10 13,4 16,9 19,6 23,8" fill="none" stroke="#34d399" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <svg viewBox="0 0 8 8" className="h-2 w-2 shrink-0" aria-hidden="true"><circle cx="4" cy="4" r="4" className="hbv-led" /></svg>
              <span className="grid font-inter text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-200 sm:text-[11px]">
                <span className="col-start-1 row-start-1 invisible">{longest}</span>
                <span className="hbv-l1 col-start-1 row-start-1">{steps[0]}</span>
                <span className="hbv-l2 col-start-1 row-start-1">{steps[1]}</span>
                <span className="hbv-l3 col-start-1 row-start-1">{steps[2]}</span>
                <span className="hbv-l4 col-start-1 row-start-1">{steps[3]}</span>
              </span>
            </div>
            <span className="hidden truncate font-inter text-[10px] uppercase tracking-[0.16em] text-zinc-500 sm:block">
              {t('srv2_hero_caption')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
