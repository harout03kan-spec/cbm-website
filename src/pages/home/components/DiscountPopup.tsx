import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function DiscountPopup() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    const dismissed = sessionStorage.getItem('discount_popup_dismissed');
    if (dismissed) return;
    const timer = setTimeout(() => setVisible(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem('discount_popup_dismissed', '1');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      await new Promise(res => setTimeout(res, 1000));
      setStatus('success');
      setTimeout(() => dismiss(), 2500);
    } catch {
      setStatus('error');
    }
  };

  if (!visible) return null;

  // No backdrop — just a corner popup that never blocks the rest of the page
  return (
    <div
      role="dialog"
      aria-label="Get price drop alerts"
      className="fixed z-50 inset-x-4 bottom-4 sm:inset-auto sm:bottom-6 sm:right-6 sm:left-auto sm:w-[380px] rounded-2xl bg-[#111] border border-zinc-800 shadow-2xl shadow-black/70 overflow-hidden"
    >
      <div className="h-1 w-full bg-gradient-to-r from-red-700 via-red-500 to-red-700" />

      <button
        onClick={dismiss}
        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"
        aria-label="Close"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="p-6">
        {status === 'success' ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">✅</div>
            <div className="text-white font-semibold text-lg">You're in!</div>
            <p className="mt-2 text-sm text-zinc-400">Check your email for alerts and deals.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-900/40 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a2 2 0 014-4z" />
                </svg>
              </div>
              <div>
                <div className="text-white font-semibold text-base leading-tight">Price Drop Alerts</div>
                <div className="text-zinc-500 text-xs mt-0.5">New inventory &amp; deals first</div>
              </div>
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed mb-5">
              {t('email_sub')} No spam. Unsubscribe anytime.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t('email_placeholder')}
                required
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm placeholder-zinc-500 outline-none focus:border-red-600 transition-colors"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Subscribing...
                  </>
                ) : t('email_btn')}
              </button>
              {status === 'error' && (
                <p className="text-xs text-red-400 text-center">{t('email_error')}</p>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
