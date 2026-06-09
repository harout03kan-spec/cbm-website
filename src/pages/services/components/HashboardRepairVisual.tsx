import { useTranslation } from 'react-i18next';

// Hand-coded ASIC hashboard repair animation for the Services hero — inline SVG
// + CSS keyframes only (no images, no animation libraries; GPU-friendly
// transform / opacity / stroke-dashoffset). Stylised after a real Antminer-style
// hashboard from the client reference: a long green PCB, ~12 horizontal domain
// rows of small black chips on silver heat-contact strips with gaps between
// them, copper traces, small red capacitors and silver SMD parts, a left metal
// bus bar with screws, a small white tester connector near the top edge, and
// visible red/black test-clip cables clamping the top power terminals.
//
// Animation is deliberately subtle: a diagnostic scan line sweeps the board,
// faint current runs inside a few domain traces, test points pulse, one small
// chip is traced as a fault (red), then repaired and the board passes test
// (green). The phase status sits in a small bench-tester bar beside the board,
// never as a big label over the chips. Fixed aspect ratio → no layout shift;
// scales to its container → responsive, no overflow; freezes on a clean tested
// frame under prefers-reduced-motion.

const VW = 480;
const VH = 300;

const DOMAINS = 12;
const CHIPS = 16;
const domY = (d: number) => 44 + d * 18; // strip top
const STRIP_H = 12;
const chipX = (i: number) => 52 + i * 24;
const CW = 6;
const CHH = 8;

const FAULT_D = 7;
const FAULT_I = 9;
const faultX = chipX(FAULT_I);
const faultY = domY(FAULT_D) + 2;

const flowDomains = [1, 4, 7, 10]; // domains that show faint integrated current

export default function HashboardRepairVisual() {
  const { t } = useTranslation();
  const steps = [t('srv_anim_1'), t('srv_anim_2'), t('srv_anim_3'), t('srv_anim_4')];
  const longest = steps.reduce((a, b) => (a.length >= b.length ? a : b), '');

  return (
    <div className="relative">
      <style>{`
        .hbv-scan { animation: hbv-scan 9s ease-in-out infinite; }
        .hbv-cur { stroke-dasharray: 5 11; opacity:.5; animation: hbv-cur 4s linear infinite; }
        .hbv-tp { animation: hbv-tp 2.4s ease-in-out infinite; }
        .hbv-tp2{animation-delay:.5s} .hbv-tp3{animation-delay:1s} .hbv-tp4{animation-delay:1.5s} .hbv-tp5{animation-delay:.8s}
        .hbv-bad { fill:#16a34a; animation: hbv-bad 9s ease-in-out infinite; }
        .hbv-bad-red { opacity:0; animation: hbv-bad-red 9s ease-in-out infinite; }
        .hbv-bad-grn { opacity:1; animation: hbv-bad-grn 9s ease-in-out infinite; }
        .hbv-probe { opacity:0; animation: hbv-probe 9s ease-in-out infinite; }
        .hbv-clip { animation: hbv-pulse 2.6s ease-in-out infinite; }
        .hbv-wave { stroke-dasharray:30 50; animation: hbv-wave 2.2s linear infinite; }
        .hbv-led { fill:#22c55e; animation: hbv-led 9s ease-in-out infinite; }
        .hbv-l1{opacity:0;animation:hbv-l1 9s ease-in-out infinite}
        .hbv-l2{opacity:0;animation:hbv-l2 9s ease-in-out infinite}
        .hbv-l3{opacity:0;animation:hbv-l3 9s ease-in-out infinite}
        .hbv-l4{opacity:1;animation:hbv-l4 9s ease-in-out infinite}

        @keyframes hbv-scan { 0%{transform:translateY(0);opacity:0} 5%{opacity:.85} 34%{opacity:.85} 40%{transform:translateY(218px);opacity:0} 100%{transform:translateY(218px);opacity:0} }
        @keyframes hbv-cur { to { stroke-dashoffset:-160 } }
        @keyframes hbv-tp { 0%,100%{opacity:.28} 50%{opacity:1} }
        @keyframes hbv-bad { 0%,30%{fill:#101015} 38%{fill:#7f1d1d} 46%,60%{fill:#dc2626} 70%{fill:#b45309} 80%{fill:#15803d} 90%,100%{fill:#16a34a} }
        @keyframes hbv-bad-red { 0%,32%{opacity:0} 46%,60%{opacity:1} 70%,100%{opacity:0} }
        @keyframes hbv-bad-grn { 0%,80%{opacity:0} 90%,99%{opacity:1} 100%{opacity:0} }
        @keyframes hbv-probe { 0%,30%{opacity:0} 40%,64%{opacity:1} 74%,100%{opacity:0} }
        @keyframes hbv-pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
        @keyframes hbv-wave { to { stroke-dashoffset:-80 } }
        @keyframes hbv-led { 0%,30%{fill:#f87171} 46%,60%{fill:#ef4444} 80%,100%{fill:#22c55e} }
        @keyframes hbv-l1{0%{opacity:1}30%{opacity:1}35%,100%{opacity:0}}
        @keyframes hbv-l2{0%,31%{opacity:0}37%,49%{opacity:1}54%,100%{opacity:0}}
        @keyframes hbv-l3{0%,50%{opacity:0}56%,73%{opacity:1}78%,100%{opacity:0}}
        @keyframes hbv-l4{0%,77%{opacity:0}83%,98%{opacity:1}100%{opacity:0}}

        @media (prefers-reduced-motion: reduce){
          .hbv-scan,.hbv-cur,.hbv-tp,.hbv-bad,.hbv-bad-red,.hbv-bad-grn,.hbv-probe,
          .hbv-clip,.hbv-wave,.hbv-led,.hbv-l1,.hbv-l2,.hbv-l3,.hbv-l4{animation:none!important}
        }
      `}</style>

      <div className="relative overflow-hidden rounded-[2rem] border border-red-950/60 bg-[radial-gradient(circle_at_25%_10%,rgba(127,29,29,0.18),transparent_55%),linear-gradient(160deg,#0c0c10,#050506)] p-3 shadow-2xl shadow-black/60">
        <div className="overflow-hidden rounded-[1.4rem] border border-zinc-900 bg-black">
          <svg className="block w-full" viewBox={`0 0 ${VW} ${VH}`} role="img" aria-label={t('srv_anim_aria')} style={{ aspectRatio: `${VW} / ${VH}` }}>
            <defs>
              <linearGradient id="pcb2" x1="0" y1="0" x2="0.3" y2="1">
                <stop offset="0" stopColor="#0e3724" />
                <stop offset="1" stopColor="#071c12" />
              </linearGradient>
              <linearGradient id="pad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#c8ccd2" />
                <stop offset="0.5" stopColor="#9a9ea6" />
                <stop offset="1" stopColor="#74787f" />
              </linearGradient>
              <linearGradient id="chip2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#26262d" />
                <stop offset="1" stopColor="#0e0e13" />
              </linearGradient>
            </defs>

            {/* PCB */}
            <rect x="16" y="18" width="448" height="252" rx="10" fill="url(#pcb2)" stroke="#1c6a44" strokeWidth="1.4" />
            <rect x="21" y="23" width="438" height="242" rx="7" fill="none" stroke="#145e3a" strokeWidth="0.8" opacity="0.5" />

            {/* left metal bus bar + screws */}
            <rect x="20" y="26" width="16" height="236" rx="2" fill="url(#pad)" stroke="#4b4f55" strokeWidth="0.7" />
            {[40, 96, 152, 208, 252].map((y) => <circle key={y} cx="28" cy={y} r="3" fill="#3f3f46" />)}

            {/* top metal mounting strips + screws */}
            <rect x="44" y="20" width="60" height="10" rx="2" fill="url(#pad)" stroke="#4b4f55" strokeWidth="0.7" />
            <rect x="392" y="20" width="56" height="10" rx="2" fill="url(#pad)" stroke="#4b4f55" strokeWidth="0.7" />
            {[58, 92, 406, 436].map((x) => <circle key={x} cx={x} cy="25" r="2.6" fill="#3f3f46" />)}

            {/* top power terminals (where clips clamp) */}
            <rect x="300" y="24" width="74" height="9" rx="2" fill="url(#pad)" stroke="#4b4f55" strokeWidth="0.7" />
            <circle cx="318" cy="28.5" r="3" fill="#3f3f46" /><circle cx="356" cy="28.5" r="3" fill="#3f3f46" />

            {/* small white tester connector near top edge */}
            <rect x="262" y="22" width="26" height="11" rx="2" fill="#e7e9ee" stroke="#9ca3af" strokeWidth="0.7" />
            <g stroke="#9ca3af" strokeWidth="0.6">{[266, 271, 276, 281, 285].map((x) => <line key={x} x1={x} y1="24" x2={x} y2="31" />)}</g>

            {/* electrolytic caps top-right */}
            {[[378, 20], [392, 20], [406, 20]].map(([cx, cy]) => (
              <g key={`c-${cx}`}><rect x={cx - 4} y={cy - 2} width="8" height="11" rx="4" fill="#1b1b22" stroke="#3f3f46" strokeWidth="0.6" /></g>
            ))}

            {/* red + black test-clip cables clamping the top terminals */}
            <g className="hbv-clip">
              <path d="M462 8 C 410 14, 372 20, 320 26" fill="none" stroke="#ef4444" strokeWidth="3.4" strokeLinecap="round" />
              <rect x="311" y="14" width="15" height="11" rx="3" fill="#dc2626" stroke="#7f1d1d" strokeWidth="0.6" />
              <path d="M313 25 L318 30 L324 25" fill="none" stroke="#b91c1c" strokeWidth="1.8" strokeLinejoin="round" />
              <circle cx="318.5" cy="19" r="1.4" fill="#fca5a5" />
            </g>
            <g className="hbv-clip" style={{ animationDelay: '.5s' }}>
              <path d="M468 22 C 420 26, 386 28, 350 30" fill="none" stroke="#27272a" strokeWidth="3.4" strokeLinecap="round" />
              <rect x="349" y="16" width="15" height="11" rx="3" fill="#18181b" stroke="#000" strokeWidth="0.6" />
              <path d="M351 27 L356 32 L362 27" fill="none" stroke="#000" strokeWidth="1.8" strokeLinejoin="round" />
              <circle cx="356.5" cy="21" r="1.4" fill="#71717a" />
            </g>

            {/* domain rows: silver heat-contact strip + small chips + red caps + traces */}
            {Array.from({ length: DOMAINS }).map((_, d) => {
              const y = domY(d);
              return (
                <g key={d}>
                  {/* faint integrated current trace under select domains */}
                  {flowDomains.includes(d) && (
                    <>
                      <path d={`M46 ${y + STRIP_H + 3} H446`} stroke="#0d4a2f" strokeWidth="1.4" fill="none" />
                      <path d={`M46 ${y + STRIP_H + 3} H446`} className="hbv-cur" stroke="#f87171" strokeWidth="1.4" fill="none" />
                    </>
                  )}
                  {/* silver heat-contact strip */}
                  <rect x="46" y={y} width="400" height={STRIP_H} rx="2" fill="url(#pad)" stroke="#5b5f66" strokeWidth="0.5" opacity="0.92" />
                  {/* chips on the strip */}
                  {Array.from({ length: CHIPS }).map((_, i) => {
                    const x = chipX(i);
                    const bad = d === FAULT_D && i === FAULT_I;
                    return (
                      <g key={i}>
                        <rect x={x} y={y + 2} width={CW} height={CHH} rx="1"
                          fill={bad ? undefined : 'url(#chip2)'} className={bad ? 'hbv-bad' : ''} stroke="#050507" strokeWidth="0.5" />
                        {i % 3 === 1 && <rect x={x + CW + 3} y={y + 4} width="4" height="3" rx="0.6" fill="#dc2626" opacity="0.9" />}
                        {i % 4 === 2 && <rect x={x + CW + 3} y={y + 4} width="4" height="2.4" rx="0.6" fill="#9ca3af" />}
                      </g>
                    );
                  })}
                </g>
              );
            })}

            {/* fault highlight: probe + red→green ring on the small bad chip */}
            <rect className="hbv-bad-red" x={faultX - 2.5} y={faultY - 2.5} width={CW + 5} height={CHH + 5} rx="2"
              fill="none" stroke="#ef4444" strokeWidth="1.6" style={{ filter: 'drop-shadow(0 0 5px rgba(239,68,68,0.95))' }} />
            <rect className="hbv-bad-grn" x={faultX - 2.5} y={faultY - 2.5} width={CW + 5} height={CHH + 5} rx="2"
              fill="none" stroke="#22c55e" strokeWidth="1.6" style={{ filter: 'drop-shadow(0 0 5px rgba(34,197,94,0.85))' }} />
            <g className="hbv-probe">
              <line x1={faultX + 26} y1={faultY - 22} x2={faultX + CW} y2={faultY + CHH / 2} stroke="#e5e7eb" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx={faultX + CW} cy={faultY + CHH / 2} r="1.6" fill="#fca5a5" />
            </g>

            {/* test points (pulse) on the left bus bar / board edge */}
            <g fill="#fca5a5">
              <circle className="hbv-tp" cx="40" cy="70" r="2.4" />
              <circle className="hbv-tp hbv-tp2" cx="40" cy="130" r="2.4" />
              <circle className="hbv-tp hbv-tp3" cx="40" cy="190" r="2.4" />
              <circle className="hbv-tp hbv-tp4" cx="452" cy="120" r="2.4" />
              <circle className="hbv-tp hbv-tp5" cx="452" cy="210" r="2.4" />
            </g>

            {/* diagnostic scan line (subtle) */}
            <g className="hbv-scan">
              <rect x="18" y="40" width="444" height="2" fill="#f87171" opacity="0.85" />
              <rect x="18" y="34" width="444" height="14" fill="#dc2626" opacity="0.1" />
            </g>
          </svg>

          {/* small bench-tester status bar BESIDE (below) the board — never over the chips */}
          <div className="flex items-center justify-between gap-3 border-t border-zinc-900 bg-black/85 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <svg width="26" height="14" viewBox="0 0 26 14" aria-hidden="true" className="shrink-0">
                <rect x="0.5" y="0.5" width="25" height="13" rx="2" fill="#0c0c10" stroke="#27272a" />
                <polyline className="hbv-wave" points="3,9 7,5 10,10 13,4 16,9 19,6 23,8" fill="none" stroke="#34d399" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <span className="relative inline-flex h-2 w-2 rounded-full">
                <svg viewBox="0 0 8 8" className="h-2 w-2"><circle cx="4" cy="4" r="4" className="hbv-led" /></svg>
              </span>
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
