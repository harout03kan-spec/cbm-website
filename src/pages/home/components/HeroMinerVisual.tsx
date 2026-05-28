import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import AsicMiner, { MINER_VIEWBOX, MINER_PORTS } from './AsicMiner';

const TARGET_HASHRATE = 141; // TH/s — Antminer S19 XP (the unit on the faceplate)

// Cable paths in the shared miner viewBox (0 0 360 340) so endpoints land on ports.
const P = MINER_PORTS;
const POWER_A = `M322 300 C 296 296 268 282 ${P.socketA.x} ${P.socketA.y}`;
const POWER_B = `M330 296 C 312 286 290 270 ${P.socketB.x} ${P.socketB.y}`;
const ETH_PATH = `M22 252 C 64 232 84 132 ${P.eth.x} ${P.eth.y}`;

/**
 * Premium "power-on" hero: a stylized Antminer S19 XP (vector) rotates into a
 * dark industrial bay, twin power cables feed the PSU sockets with red current,
 * an Ethernet line streams data packets into the ETH port, status LEDs wake, the
 * fans spin up and the live hashrate ticks to 141 TH/s. CSS/SVG + framer-motion
 * only (no 3D bundle); GPU-friendly transforms; freezes to a clean "powered"
 * state under prefers-reduced-motion.
 */
export default function HeroMinerVisual() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const [powered, setPowered] = useState(false);
  const [hash, setHash] = useState(0);

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
            animate={powered && !reduce ? { y: [0, -6, 0] } : { y: 0 }}
            transition={{ duration: 6, repeat: powered && !reduce ? Infinity : 0, ease: 'easeInOut' }}
          >
            {/* the miner */}
            <AsicMiner powered={powered} reduce={!!reduce} />

            {/* cables + connections (same viewBox → endpoints meet the ports) */}
            <svg viewBox={MINER_VIEWBOX} className="absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
              <defs>
                <path id="ethPath" d={ETH_PATH} />
              </defs>

              {/* small PDU / plug module beside the miner that the power feeds from */}
              <g>
                <rect x="314" y="298" width="40" height="26" rx="4" fill="#15171a" stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
                <rect x="319" y="303" width="7" height="6" rx="1.5" fill="#0a0b0d" stroke="rgba(255,255,255,0.12)" strokeWidth={0.6} />
                <rect x="319" y="313" width="7" height="6" rx="1.5" fill="#0a0b0d" stroke="rgba(255,255,255,0.12)" strokeWidth={0.6} />
                <circle
                  cx="346"
                  cy="305"
                  r="2.2"
                  fill={powered ? '#22c55e' : '#1f2937'}
                  style={{ filter: powered ? 'drop-shadow(0 0 3px #22c55e)' : 'none', transition: 'fill 0.4s ease' }}
                />
              </g>

              {/* power cables (thick, dark) + red current flow */}
              {[POWER_A, POWER_B].map((d, i) => (
                <g key={i}>
                  <path d={d} stroke="#0c0d0f" strokeWidth={6} strokeLinecap="round" />
                  <path d={d} stroke="#202327" strokeWidth={4} strokeLinecap="round" />
                  <path
                    d={d}
                    stroke="#DC2626"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeDasharray="2 10"
                    className={powered ? 'animate-current-flow' : ''}
                    style={{
                      opacity: powered ? 1 : 0.15,
                      filter: 'drop-shadow(0 0 3px rgba(220,38,38,0.9))',
                      transition: 'opacity 0.6s ease',
                    }}
                  />
                </g>
              ))}

              {/* ethernet jack module (data source) */}
              <g>
                <rect x="6" y="244" width="26" height="18" rx="3" fill="#15171a" stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
                <rect x="11" y="248" width="9" height="7" rx="1.2" fill="#0a0b0d" />
                <circle cx="26" cy="249" r="1.4" fill={powered ? '#3b82f6' : '#1f2937'} className={powered ? 'animate-eth-blink' : ''} />
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

      {/* Live hashrate HUD */}
      <motion.div
        className="absolute bottom-[1%] left-1/2 -translate-x-1/2 rounded-2xl border border-white/10 bg-black/60 px-5 py-3 backdrop-blur-md"
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
          <span className="font-inter text-[11px] font-semibold uppercase tracking-[0.15em] text-green-400">
            {t('hero_status')}
          </span>
        </div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="font-orbitron text-3xl font-black leading-none text-white tabular-nums">{hash}</span>
          <span className="font-inter text-sm font-bold text-soft-gray">TH/s</span>
        </div>
        <div className="mt-0.5 font-inter text-[10px] uppercase tracking-wider text-zinc-500">
          {t('hero_metric_label')}
        </div>
      </motion.div>
    </motion.div>
  );
}
