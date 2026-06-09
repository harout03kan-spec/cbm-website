import { useTranslation } from 'react-i18next';

// Hand-coded ASIC hashboard repair visual for the Services hero — inline SVG +
// CSS keyframes only (no images, no animation libraries; GPU-friendly transform
// / opacity / dashoffset). Structured from the client's real hashboard photos:
// a tall (portrait) green PCB with segmented metal side/top rails and screws,
// vertical silver heat-contact strips carrying copper pads and blue thermal
// marks, green lanes with fine horizontal traces and small black ICs, circular
// mounting holes, blue electrolytic caps + a small white connector at the top,
// and a lighter beige controller strip along the bottom packed with small ICs,
// SMD parts and test points. Red/black test clips clamp the top terminals.
//
// Animation is subtle and technical: a diagnostic scan sweeps the board, test
// points pulse, one small IC is traced as a fault (probe + red glow) then
// repaired to green. The phase status sits in a small bench-tester bar below the
// board — never as a big label over the chips. Fixed aspect ratio → no layout
// shift; scales to container → responsive; freezes on a clean tested frame under
// prefers-reduced-motion.

const VW = 396;
const VH = 462;

// chip area
const AX = 40;       // left of strips
const AW = 308;      // width of strip area (to x=348)
const AY = 80;       // top of strips
const AYB = 380;     // bottom of strips
const STRIPS = 10;
const SW = 18;       // strip width
const stripX = (i: number) => AX + i * 31;            // 40,71,...,319
const BANDS_Y = [80, 155, 230, 305, 380];             // 4 domain bands

// copper pad positions (top/bottom of each band, on every strip)
const COPPER: { x: number; y: number }[] = [];
for (let i = 0; i < STRIPS; i++) {
  for (const by of BANDS_Y) COPPER.push({ x: stripX(i) + 2, y: by - 6 });
}

// circular mounting holes scattered in the green lanes
const HOLES = [
  [70, 118], [132, 118], [256, 118], [318, 118],
  [70, 195], [194, 195], [318, 195],
  [101, 270], [225, 270], [318, 270],
  [70, 345], [194, 345], [287, 345],
];

// central column of small black ICs (diodes/MOSFETs in the middle lane)
const ICS = [108, 138, 168, 198, 228, 258, 288, 318, 348].map((y) => ({ x: 190, y }));
const FAULT = { x: 190, y: 258 };

// beige bottom controller strip — small ICs + SMD + test points
const BEIGE_ICS = [30, 78, 150, 222, 300].map((x) => x);
const BEIGE_SMD = [54, 66, 102, 114, 126, 186, 198, 258, 270, 330, 342, 354];

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
        @keyframes hbv-scan{0%{transform:translateY(0);opacity:0}5%{opacity:.8}33%{opacity:.8}40%{transform:translateY(300px);opacity:0}100%{transform:translateY(300px);opacity:0}}
        @keyframes hbv-tp{0%,100%{opacity:.25}50%{opacity:1}}
        @keyframes hbv-bad{0%,30%{fill:#16161c}38%{fill:#7f1d1d}46%,60%{fill:#dc2626}70%{fill:#b45309}80%{fill:#15803d}90%,100%{fill:#16a34a}}
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

      <div className="relative overflow-hidden rounded-[1.8rem] border border-red-950/60 bg-[radial-gradient(circle_at_25%_8%,rgba(127,29,29,0.16),transparent_55%),linear-gradient(160deg,#0b0b0f,#050506)] p-3 shadow-2xl shadow-black/60">
        <div className="overflow-hidden rounded-[1.3rem] border border-zinc-900 bg-[#06120c]">
          <svg className="block w-full" viewBox={`0 0 ${VW} ${VH}`} role="img" aria-label={t('srv_anim_aria')} style={{ aspectRatio: `${VW} / ${VH}` }}>
            <defs>
              <linearGradient id="g-pcb" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stopColor="#10492f" /><stop offset="1" stopColor="#0a2c1c" /></linearGradient>
              <linearGradient id="g-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#cfd3d9" /><stop offset="0.45" stopColor="#a4a8af" /><stop offset="0.55" stopColor="#b8bcc2" /><stop offset="1" stopColor="#7d8188" /></linearGradient>
              <linearGradient id="g-strip" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#b9bcc2" /><stop offset="0.5" stopColor="#dde0e4" /><stop offset="1" stopColor="#9a9ea5" /></linearGradient>
              <linearGradient id="g-copper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d39256" /><stop offset="1" stopColor="#9c5e2e" /></linearGradient>
              <linearGradient id="g-chip" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#26262e" /><stop offset="1" stopColor="#0c0c11" /></linearGradient>
              <linearGradient id="g-beige" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d9d3ad" /><stop offset="1" stopColor="#c4be94" /></linearGradient>
              <linearGradient id="g-cap" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5b86b8" /><stop offset="1" stopColor="#2f527e" /></linearGradient>
            </defs>

            {/* board */}
            <rect x="14" y="14" width="368" height="434" rx="9" fill="url(#g-pcb)" stroke="#1c6a44" strokeWidth="1.3" />

            {/* fine horizontal traces across the lanes (covered by strips later) */}
            <g stroke="#1f8a58" strokeWidth="0.5" opacity="0.5">
              {Array.from({ length: 40 }).map((_, k) => <line key={k} x1={AX} y1={AY + 4 + k * 7.4} x2={AX + AW} y2={AY + 4 + k * 7.4} />)}
            </g>

            {/* vertical silver heat-contact strips */}
            {Array.from({ length: STRIPS }).map((_, i) => (
              <rect key={i} x={stripX(i)} y={AY} width={SW} height={AYB - AY} rx="2" fill="url(#g-strip)" stroke="#73777e" strokeWidth="0.4" opacity="0.96" />
            ))}

            {/* horizontal domain separator bars with copper pads */}
            {BANDS_Y.map((by) => (
              <rect key={by} x={AX - 2} y={by - 7} width={AW + 4} height="13" fill="url(#g-metal)" opacity="0.5" />
            ))}
            {COPPER.map((p, i) => (
              <g key={`cu-${i}`}>
                <rect x={p.x} y={p.y} width="14" height="12" rx="1.5" fill="url(#g-copper)" stroke="#7a4a22" strokeWidth="0.4" />
                <rect x={p.x + 3} y={p.y + 13} width="8" height="2.4" rx="1" fill="#2f6fb0" opacity="0.85" />
              </g>
            ))}

            {/* circular mounting holes */}
            {HOLES.map(([x, y], i) => (
              <g key={`h-${i}`}><circle cx={x} cy={y} r="5.4" fill="#06160e" stroke="#2c7a52" strokeWidth="1.2" /><circle cx={x} cy={y} r="2.4" fill="#0a2417" /></g>
            ))}

            {/* central column of small black ICs */}
            {ICS.map((c, i) => {
              const bad = c.y === FAULT.y;
              return (
                <g key={`ic-${i}`}>
                  <rect x={c.x} y={c.y} width="14" height="9" rx="1.2" fill={bad ? undefined : 'url(#g-chip)'} className={bad ? 'hbv-bad' : ''} stroke="#050507" strokeWidth="0.5" />
                  <rect x={c.x + 2} y={c.y + 2} width="10" height="1.5" rx="0.6" fill="#3f3f46" />
                </g>
              );
            })}

            {/* ── top section: rails + caps + white connector + terminals ── */}
            <rect x="22" y="14" width="352" height="12" rx="2" fill="url(#g-metal)" stroke="#6b6f76" strokeWidth="0.5" />
            {[40, 96, 300, 356].map((x) => <circle key={`ts-${x}`} cx={x} cy="20" r="2.6" fill="#3f3f46" />)}
            {/* blue electrolytic caps */}
            {[176, 192, 208, 224].map((cx) => (
              <g key={`bc-${cx}`}><rect x={cx - 6} y="30" width="12" height="22" rx="6" fill="#3f6ea6" stroke="#274d7a" strokeWidth="0.7" /><path d={`M${cx} 33 v16 M${cx - 4} 41 h8`} stroke="#27466e" strokeWidth="0.8" /></g>
            ))}
            {/* small white connector top-right + terminals */}
            <rect x="300" y="34" width="40" height="13" rx="2" fill="#e7e9ee" stroke="#9ca3af" strokeWidth="0.7" />
            <g stroke="#9ca3af" strokeWidth="0.6">{[305, 310, 315, 320, 325, 330, 335].map((x) => <line key={x} x1={x} y1="36" x2={x} y2="45" />)}</g>
            <rect x="250" y="58" width="80" height="9" rx="2" fill="url(#g-metal)" stroke="#6b6f76" strokeWidth="0.5" />
            <circle cx="268" cy="62.5" r="2.6" fill="#3f3f46" /><circle cx="312" cy="62.5" r="2.6" fill="#3f3f46" />
            {/* a few top SMD + barcode */}
            <rect x="60" y="40" width="22" height="8" rx="1" fill="#dcdcc6" stroke="#9ca3af" strokeWidth="0.4" />
            <g fill="#1b1b22">{[44, 50, 56, 96, 102, 130, 136].map((x) => <rect key={x} x={x} y="56" width="4" height="6" rx="0.6" />)}</g>

            {/* segmented side rails with screws */}
            <rect x="16" y="28" width="14" height="412" rx="2" fill="url(#g-metal)" stroke="#6b6f76" strokeWidth="0.5" />
            <rect x="366" y="28" width="14" height="412" rx="2" fill="url(#g-metal)" stroke="#6b6f76" strokeWidth="0.5" />
            <g stroke="#8a8e95" strokeWidth="0.5">{Array.from({ length: 13 }).map((_, k) => (<g key={k}><line x1="16" y1={40 + k * 30} x2="30" y2={40 + k * 30} /><line x1="366" y1={40 + k * 30} x2="380" y2={40 + k * 30} /></g>))}</g>
            {[56, 200, 360].map((y) => <g key={`rs-${y}`}><circle cx="23" cy={y} r="3" fill="#3f3f46" /><circle cx="373" cy={y} r="3" fill="#3f3f46" /></g>)}

            {/* ── beige controller strip (bottom) ── */}
            <rect x="16" y="384" width="364" height="54" rx="3" fill="url(#g-beige)" stroke="#a39c72" strokeWidth="0.6" />
            {BEIGE_ICS.map((x, i) => (
              <g key={`bi-${i}`}><rect x={x} y={398 + (i % 2) * 12} width="18" height="13" rx="1.5" fill="#1b1b22" stroke="#3f3f46" strokeWidth="0.5" /><rect x={x + 3} y={401 + (i % 2) * 12} width="12" height="2" rx="0.6" fill="#52525b" /></g>
            ))}
            <g fill="#52525b">{BEIGE_SMD.map((x, i) => <rect key={`bs-${i}`} x={x} y={426} width="6" height="3" rx="0.6" fill={i % 3 === 0 ? '#9ca3af' : '#3f3f46'} />)}</g>
            <rect x="180" y="396" width="12" height="12" rx="2" fill="#2f6fb0" stroke="#1f4d80" strokeWidth="0.6" />{/* blue trimmer */}
            <g className="hbv-tp" fill="#fca5a5">
              <circle cx="40" cy="430" r="2.4" /><circle className="hbv-tp2" cx="120" cy="430" r="2.4" /><circle className="hbv-tp3" cx="240" cy="430" r="2.4" /><circle className="hbv-tp4" cx="330" cy="430" r="2.4" />
            </g>
            <rect x="300" y="424" width="30" height="9" rx="1.5" fill="#e7e9ee" stroke="#9ca3af" strokeWidth="0.5" />{/* small connector */}

            {/* bottom rail */}
            <rect x="22" y="438" width="352" height="8" rx="2" fill="url(#g-metal)" stroke="#6b6f76" strokeWidth="0.5" />

            {/* test points pulsing in lanes */}
            <g fill="#fca5a5">
              <circle className="hbv-tp hbv-tp5" cx="100" cy="100" r="2.2" />
              <circle className="hbv-tp hbv-tp6" cx="288" cy="160" r="2.2" />
              <circle className="hbv-tp hbv-tp2" cx="132" cy="300" r="2.2" />
            </g>

            {/* fault: probe + red→green ring on the bad IC */}
            <rect className="hbv-bad-red" x={FAULT.x - 2.5} y={FAULT.y - 2.5} width="19" height="14" rx="2" fill="none" stroke="#ef4444" strokeWidth="1.6" style={{ filter: 'drop-shadow(0 0 5px rgba(239,68,68,0.95))' }} />
            <rect className="hbv-bad-grn" x={FAULT.x - 2.5} y={FAULT.y - 2.5} width="19" height="14" rx="2" fill="none" stroke="#22c55e" strokeWidth="1.6" style={{ filter: 'drop-shadow(0 0 5px rgba(34,197,94,0.85))' }} />
            <g className="hbv-probe">
              <line x1={FAULT.x + 44} y1={FAULT.y - 28} x2={FAULT.x + 14} y2={FAULT.y + 4} stroke="#e5e7eb" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx={FAULT.x + 14} cy={FAULT.y + 4} r="1.6" fill="#fca5a5" />
            </g>

            {/* red + black test clips clamping the top terminals */}
            <g className="hbv-clip">
              <path d="M392 6 C 350 14, 318 24, 268 30" fill="none" stroke="#ef4444" strokeWidth="3.2" strokeLinecap="round" />
              <rect x="259" y="16" width="15" height="11" rx="3" fill="#dc2626" stroke="#7f1d1d" strokeWidth="0.6" />
              <path d="M261 27 L266 32 L272 27" fill="none" stroke="#b91c1c" strokeWidth="1.8" strokeLinejoin="round" />
              <circle cx="266.5" cy="21" r="1.4" fill="#fca5a5" />
            </g>
            <g className="hbv-clip" style={{ animationDelay: '.5s' }}>
              <path d="M392 20 C 356 26, 336 30, 312 32" fill="none" stroke="#27272a" strokeWidth="3.2" strokeLinecap="round" />
              <rect x="311" y="18" width="15" height="11" rx="3" fill="#18181b" stroke="#000" strokeWidth="0.6" />
              <path d="M313 29 L318 34 L324 29" fill="none" stroke="#000" strokeWidth="1.8" strokeLinejoin="round" />
              <circle cx="318.5" cy="23" r="1.4" fill="#71717a" />
            </g>

            {/* diagnostic scan line (subtle) */}
            <g className="hbv-scan">
              <rect x="14" y={AY} width="368" height="2" fill="#f87171" opacity="0.8" />
              <rect x="14" y={AY - 6} width="368" height="14" fill="#dc2626" opacity="0.09" />
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
