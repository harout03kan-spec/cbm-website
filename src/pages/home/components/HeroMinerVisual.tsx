import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import AsicMiner, { MINER_VIEWBOX, MINER_PORTS } from './AsicMiner';

const TARGET_HASHRATE = 270; // TH/s — Antminer S21 XP (the unit on the faceplate)

// Cable paths in the shared miner viewBox (0 0 400 350) so endpoints land on ports.
const P = MINER_PORTS;
// One thick power cable rises from off-frame and plugs into the PSU inlet.
const PLUG_BOTTOM = P.socket.y + 26; // where the cable meets the plug boot
const POWER_CABLE = `M${P.socket.x - 26} 352 C ${P.socket.x - 14} 338, ${P.socket.x - 2} 322, ${P.socket.x} ${PLUG_BOTTOM}`;
// Ethernet sweeps in low from the LEFT and rises into the centered ETH port from
// below-left, staying under the top nameplate so it never crosses the label.
const ETH_PATH = `M-18 126 C 46 118, 116 96, ${P.eth.x} ${P.eth.y}`;

/**
 * Premium "power-on" hero: a stylized Antminer S21 XP (vector) rotates into a
 * dark industrial bay, one thick power cable plugs into the PSU inlet from below
 * carrying red current, an Ethernet line streams data packets in from the left
 * into the ETH port, status LEDs wake, all five fans spin up and the live
 * hashrate ticks to 270 TH/s. CSS/SVG + framer-motion only (no 3D bundle);
 * GPU-friendly transforms; freezes to a clean "powered" state under
 * prefers-reduced-motion.
 */
export default function HeroMinerVisual() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const [powered, setPowered] = useState(false);
  const [hash, setHash] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Track small screens so we can lighten the animation for smoother mobile scroll.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Boot beat: let the miner rotate into place, then power it on.
  useEffect(() => {
    if (reduce) {
      setPowered(true);
      setHash(TARGET_HASHRATE);
      return;
    }
    const id = setTimeout(() => setPowered(true), 950);
    return () => clearTimeout(id);
  }, [reduce]);

  // Count the hashrate up once powered.
  useEffect(() => {
    if (!powered || reduce) return;
    let raf = 0;
    const start = performance.now();
    const duration = 1600;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setHash(Math.round(eased * TARGET_HASHRATE));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [powered, reduce]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="hero-visual relative mx-auto aspect-square w-full max-w-[540px] select-none"
      aria-hidden="true"
    >
      {/* Backdrop: industrial bay — radial crimson glow + tech grid + vignette */}
      <div
        className="absolute inset-0 rounded-[36px]"
        style={{ background: 'radial-gradient(circle at 50% 44%, rgba(220,38,38,0.18), transparent 60%)' }}
      />
      <div
        className="absolute inset-0 rounded-[36px] opacity-[0.16]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '34px 34px',
          maskImage: 'radial-gradient(circle at 50% 46%, black, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 46%, black, transparent 70%)',
        }}
      />
      {/* reflective floor sheen */}
      <div
        className="absolute inset-x-[12%] bottom-[8%] h-[22%] rounded-[50%] blur-2xl"
        style={{ background: 'radial-gradient(ellipse at center, rgba(220,38,38,0.16), transparent 70%)' }}
      />

      {/* Igniting under-glow that intensifies on power-on */}
      <motion.div
        className="absolute left-1/2 top-[46%] h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.4), transparent 70%)' }}
        animate={{ opacity: powered ? 0.9 : 0.18 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      />

      {/* ── 3D stage: miner + cables rotate in together ──────────────── */}
      <div className="absolute inset-0" style={{ perspective: 1100 }}>
        <motion.div
          className="absolute inset-0"
          style={{ transformStyle: 'preserve-3d' }}
          initial={reduce ? false : { rotateY: -34, rotateX: 6, opacity: 0 }}
          animate={{ rotateY: reduce ? 0 : -6, rotateX: reduce ? 0 : 3, opacity: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ willChange: 'transform' }}
            animate={powered && !reduce && !isMobile ? { y: [0, -6, 0] } : { y: 0 }}
            transition={{ duration: 6, repeat: powered && !reduce && !isMobile ? Infinity : 0, ease: 'easeInOut' }}
          >
            {/* the miner */}
            <AsicMiner powered={powered} reduce={!!reduce} lite={isMobile} />

            {/* cables + connections (same viewBox → endpoints meet the ports) */}
            <svg viewBox={MINER_VIEWBOX} className="absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
              <defs>
                <path id="ethPath" d={ETH_PATH} />
              </defs>

              {/* one thick power cable + red current flow into the plug */}
              <path d={POWER_CABLE} stroke="#0c0d0f" strokeWidth={12} strokeLinecap="round" />
              <path d={POWER_CABLE} stroke="#1c1f24" strokeWidth={8} strokeLinecap="round" />
              <path
                d={POWER_CABLE}
                stroke="#DC2626"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeDasharray="2 11"
                className={powered ? 'animate-current-flow' : ''}
                style={{
                  opacity: powered ? 1 : 0.15,
                  filter: 'drop-shadow(0 0 3px rgba(220,38,38,0.9))',
                  transition: 'opacity 0.6s ease',
                }}
              />

              {/* one clean stylized plug, fully seated into the square inlet */}
              <g>
                {/* cable boot below the inlet */}
                <rect x={P.socket.x - 7} y={P.socket.y + 21} width={14} height={10} rx={3} fill="#15171a" stroke="rgba(255,255,255,0.1)" strokeWidth={0.8} />
                {/* connector body — top edge sits up inside the inlet cavity (inserted) */}
                <rect
                  x={P.socket.x - 11}
                  y={P.socket.y - 7}
                  width={22}
                  height={30}
                  rx={3}
                  fill="#1b1e22"
                  stroke="rgba(255,255,255,0.16)"
                  strokeWidth={1}
                  style={{
                    filter: powered ? 'drop-shadow(0 0 5px rgba(220,38,38,0.6))' : 'none',
                    transition: 'filter 0.7s ease',
                  }}
                />
                {/* shadow line at the inlet mouth sells the "seated" look */}
                <line x1={P.socket.x - 10} y1={P.socket.y + 11} x2={P.socket.x + 10} y2={P.socket.y + 11} stroke="rgba(0,0,0,0.55)" strokeWidth={1.4} />
                {/* connector grip ribs */}
                <line x1={P.socket.x - 7} y1={P.socket.y + 16} x2={P.socket.x + 7} y2={P.socket.y + 16} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
                <line x1={P.socket.x - 7} y1={P.socket.y + 19} x2={P.socket.x + 7} y2={P.socket.y + 19} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
              </g>

              {/* ethernet cable (thinner) */}
              <path d={ETH_PATH} stroke="#0c0d0f" strokeWidth={3.4} strokeLinecap="round" />
              <path d={ETH_PATH} stroke="#1f2937" strokeWidth={2} strokeLinecap="round" />

              {/* data packets streaming into the ETH port */}
              {powered && !reduce && (
                <>
                  {[
                    { c: '#3b82f6', begin: '0s' },
                    { c: '#22c55e', begin: '0.8s' },
                    { c: '#3b82f6', begin: '1.6s' },
                  ].map((pkt, i) => (
                    <circle key={i} r="2.6" fill={pkt.c} style={{ filter: `drop-shadow(0 0 3px ${pkt.c})` }}>
                      <animateMotion dur="2.4s" begin={pkt.begin} repeatCount="indefinite">
                        <mpath href="#ethPath" />
                      </animateMotion>
                    </circle>
                  ))}
                </>
              )}
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Subtle Bitcoin mining energy — kept low so the miner stays the focus */}
      {!reduce && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[
            { left: '16%', top: '30%', size: 'text-xl', delay: '0s' },
            { left: '80%', top: '24%', size: 'text-lg', delay: '2.4s' },
            { left: '72%', top: '60%', size: 'text-base', delay: '4.2s' },
            { left: '24%', top: '64%', size: 'text-sm', delay: '6s' },
          ].map((b, i) => (
            <span
              key={i}
              className={`absolute font-orbitron font-bold text-crimson-accent ${b.size} ${powered ? 'animate-drift' : ''}`}
              style={{ left: b.left, top: b.top, opacity: powered ? undefined : 0, animationDelay: b.delay }}
            >
              ₿
            </span>
          ))}
        </div>
      )}

      {/* Live hashrate HUD — tucked lower/smaller on mobile so it doesn't block the miner */}
      <motion.div
        className="absolute bottom-0 right-1 rounded-2xl border border-white/10 bg-black/60 px-3.5 py-2 backdrop-blur-md sm:bottom-[2%] sm:right-[4%] sm:px-5 sm:py-3"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: powered ? 1 : 0, y: powered ? 0 : 16 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            {!reduce && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
            )}
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span className="font-inter text-[10px] font-semibold uppercase tracking-[0.15em] text-green-400 sm:text-[11px]">
            {t('hero_status')}
          </span>
        </div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="font-orbitron text-2xl font-black leading-none text-white tabular-nums sm:text-3xl">{hash}</span>
          <span className="font-inter text-xs font-bold text-soft-gray sm:text-sm">TH/s</span>
        </div>
        <div className="mt-0.5 font-inter text-[10px] uppercase tracking-wider text-zinc-500">
          {t('hero_metric_label')}
        </div>
      </motion.div>
    </motion.div>
  );
}
