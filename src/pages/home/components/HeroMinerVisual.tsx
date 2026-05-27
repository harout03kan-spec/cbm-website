import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const TARGET_HASHRATE = 234; // TH/s — reads like a flagship S21-class miner

/**
 * Premium "power-on" hero visual: a stylized ASIC miner that boots up — current
 * flows down the power cable, the panel breaker lights, fans spin up, status
 * LEDs come alive, mining energy rises and the live hashrate ticks up.
 * Built entirely with CSS/SVG + framer-motion (no 3D bundle). GPU-friendly
 * (transform/opacity only) and degrades to a static "powered" state when the
 * user prefers reduced motion.
 */
export default function HeroMinerVisual() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const [powered, setPowered] = useState(false);
  const [hash, setHash] = useState(0);

  // Boot sequence: brief delay so the "powering on" beat is felt.
  useEffect(() => {
    if (reduce) {
      setPowered(true);
      setHash(TARGET_HASHRATE);
      return;
    }
    const id = setTimeout(() => setPowered(true), 650);
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

  const leds = [
    { color: '#22c55e', delay: '0s' },
    { color: '#22c55e', delay: '0.5s' },
    { color: '#DC2626', delay: '1s' },
    { color: '#22c55e', delay: '0.3s' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="hero-visual relative mx-auto w-full max-w-[520px] aspect-square select-none"
      aria-hidden="true"
    >
      {/* Backdrop: radial crimson glow + faint tech grid */}
      <div
        className="absolute inset-0 rounded-[36px]"
        style={{
          background:
            'radial-gradient(circle at 50% 42%, rgba(220,38,38,0.16), transparent 58%)',
        }}
      />
      <div
        className="absolute inset-0 rounded-[36px] opacity-[0.18]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '34px 34px',
          maskImage: 'radial-gradient(circle at 50% 45%, black, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 45%, black, transparent 70%)',
        }}
      />

      {/* Igniting glow that intensifies once powered */}
      <motion.div
        className="absolute left-1/2 top-[42%] h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.45), transparent 70%)' }}
        animate={{ opacity: powered ? 0.9 : 0.15 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      />

      {/* Power cable + electrical panel feeding the miner */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        fill="none"
        preserveAspectRatio="none"
      >
        {/* cable casing */}
        <path
          d="M6 92 C 6 78, 20 74, 30 74 L 40 74"
          stroke="#1f2937"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
        {/* live current flowing through the cable */}
        <path
          d="M6 92 C 6 78, 20 74, 30 74 L 40 74"
          stroke="#DC2626"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="3 9"
          className={powered ? 'animate-current-flow' : ''}
          style={{
            opacity: powered ? 1 : 0.2,
            filter: 'drop-shadow(0 0 3px rgba(220,38,38,0.9))',
            transition: 'opacity 0.6s ease',
          }}
        />
      </svg>

      {/* Electrical panel */}
      <div className="absolute bottom-[3%] left-[1%] w-[15%] rounded-[10px] border border-white/10 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] p-[6%] shadow-lg">
        <div className="mb-[10%] h-[6px] w-full rounded-full bg-white/5" />
        <div className="flex items-center justify-between">
          <div className="h-[10px] w-[34%] rounded-sm bg-white/10" />
          <motion.div
            className="h-[8px] w-[8px] rounded-full"
            style={{ boxShadow: '0 0 8px currentColor' }}
            animate={{ color: powered ? '#22c55e' : '#3f3f46' }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* ── Miner chassis ───────────────────────────────────────────── */}
      <motion.div
        className="absolute left-1/2 top-[26%] w-[80%] -translate-x-1/2 overflow-hidden rounded-[20px] border border-white/12"
        style={{
          background:
            'linear-gradient(160deg, #2a2a2e 0%, #1a1a1d 42%, #0e0e10 100%)',
          aspectRatio: '16 / 9',
        }}
        animate={{
          boxShadow: powered
            ? '0 0 0 1px rgba(220,38,38,0.35), 0 30px 70px rgba(0,0,0,0.6), 0 0 60px rgba(220,38,38,0.28)'
            : '0 18px 50px rgba(0,0,0,0.5)',
        }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      >
        {/* top edge highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        {/* ventilation slits */}
        <div className="absolute left-[6%] right-[6%] top-[8%] flex flex-col gap-[3px]">
          {[0, 1, 2].map(i => (
            <div key={i} className="h-[2px] w-full rounded-full bg-black/40" />
          ))}
        </div>

        {/* two fans */}
        <div className="absolute inset-0 flex items-center justify-center gap-[8%] pt-[6%]">
          {[0, 1].map(i => (
            <div
              key={i}
              className="relative aspect-square w-[34%] rounded-full border border-white/10"
              style={{ background: 'radial-gradient(circle, #161618 0%, #0a0a0b 100%)' }}
            >
              {/* spinning blades */}
              <div
                className={`absolute inset-[8%] rounded-full ${powered ? 'animate-fan-spin' : ''}`}
                style={{
                  background:
                    'repeating-conic-gradient(rgba(255,255,255,0.10) 0deg 14deg, rgba(255,255,255,0.015) 14deg 28deg)',
                  opacity: powered ? 1 : 0.45,
                  transition: 'opacity 0.6s ease',
                }}
              />
              {/* hub */}
              <div className="absolute left-1/2 top-1/2 h-[18%] w-[18%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1c1c1f] border border-white/10" />
              {/* rim light */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ boxShadow: 'inset 0 0 12px rgba(220,38,38,0.6)' }}
                animate={{ opacity: powered ? 1 : 0 }}
                transition={{ duration: 0.8 }}
              />
            </div>
          ))}
        </div>

        {/* status LED strip */}
        <div className="absolute bottom-[8%] left-[8%] flex items-center gap-[6px]">
          {leds.map((led, i) => (
            <div
              key={i}
              className={`h-[7px] w-[7px] rounded-full ${powered ? 'animate-led-flicker' : ''}`}
              style={{
                background: powered ? led.color : '#3f3f46',
                boxShadow: powered ? `0 0 6px ${led.color}` : 'none',
                animationDelay: led.delay,
                transition: 'background 0.4s ease',
              }}
            />
          ))}
        </div>

        {/* brand plate */}
        <div className="absolute bottom-[8%] right-[8%] h-[9px] w-[26%] rounded-sm bg-white/8" />
      </motion.div>

      {/* Rising mining energy */}
      {powered && !reduce && (
        <div className="absolute left-1/2 top-[64%] flex -translate-x-1/2 gap-[14px]">
          {[0, 1, 2, 3, 4, 5].map(i => (
            <span
              key={i}
              className="block h-[5px] w-[5px] rounded-full bg-crimson-accent animate-energy-rise"
              style={{
                animationDelay: `${i * 0.28}s`,
                boxShadow: '0 0 6px rgba(220,38,38,0.8)',
              }}
            />
          ))}
        </div>
      )}

      {/* Orbiting Bitcoin energy */}
      {!reduce && (
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[40%] h-0 w-0 animate-orbit">
            <span
              className="absolute -translate-x-1/2 -translate-y-1/2 font-orbitron text-2xl font-bold text-crimson-accent/30"
              style={{ left: '170px', top: '0px' }}
            >
              ₿
            </span>
            <span
              className="absolute -translate-x-1/2 -translate-y-1/2 font-orbitron text-lg font-bold text-crimson-accent/20"
              style={{ left: '-160px', top: '40px' }}
            >
              ₿
            </span>
          </div>
        </div>
      )}

      {/* Live hashrate HUD */}
      <motion.div
        className="absolute bottom-[2%] left-1/2 -translate-x-1/2 rounded-2xl border border-white/10 bg-black/60 px-5 py-3 backdrop-blur-md"
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
          <span className="font-orbitron text-3xl font-black leading-none text-white tabular-nums">
            {hash}
          </span>
          <span className="font-inter text-sm font-bold text-soft-gray">TH/s</span>
        </div>
        <div className="mt-0.5 font-inter text-[10px] uppercase tracking-wider text-zinc-500">
          {t('hero_metric_label')}
        </div>
      </motion.div>
    </motion.div>
  );
}
