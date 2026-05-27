import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HeroMinerVisual from './HeroMinerVisual';

const HeroSection = () => {
  const { t } = useTranslation();
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-black">
      {/* Backdrop — pure CSS (no external image): deep gradient + tech grid + crimson glow */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 70% 35%, rgba(220,38,38,0.12), transparent 60%), linear-gradient(180deg, #050505 0%, #0a0a0a 60%, #050505 100%)' }}
        />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse 70% 70% at 50% 40%, black, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 40%, black, transparent 80%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 pt-28 lg:py-0">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Left — copy + CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center lg:text-left"
          >
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-crimson-accent/30 bg-crimson-accent/10 px-4 py-1.5 font-inter text-[11px] font-bold uppercase tracking-[0.18em] text-crimson-accent">
              <i className="ri-flashlight-fill text-sm" aria-hidden="true" />
              {t('hero_eyebrow')}
            </span>

            <h1 className="mb-6 font-orbitron text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              {t('hero_title')}
            </h1>

            <p className="mx-auto mb-9 max-w-xl font-inter text-lg text-soft-gray md:text-xl lg:mx-0">
              {t('hero_sub')}
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row lg:items-start lg:justify-start">
              <Link
                to="/shop"
                className="inline-flex min-h-[56px] w-full items-center justify-center rounded-xl bg-crimson-accent px-10 font-inter text-lg font-semibold text-white transition-colors hover:bg-red-700 sm:w-auto"
              >
                {t('hero_cta')}
              </Link>
              <a
                href="https://wa.me/15146047050"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.03] px-10 font-inter text-lg font-semibold text-white transition-colors hover:bg-white/[0.08] sm:w-auto"
              >
                <i className="ri-whatsapp-fill text-xl text-green-400" aria-hidden="true" />
                {t('hero_cta2')}
              </a>
            </div>

            <p className="mt-7 font-inter text-sm text-zinc-500">{t('hero_trust')}</p>
          </motion.div>

          {/* Right — animated power-on miner */}
          <div className="flex items-center justify-center">
            <HeroMinerVisual />
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:block"
        aria-hidden="true"
      >
        <div className="flex h-9 w-6 items-start justify-center rounded-full border border-white/20 p-1.5">
          <motion.div
            className="h-1.5 w-1 rounded-full bg-crimson-accent"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
