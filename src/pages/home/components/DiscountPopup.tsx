import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const PROMO_CODE = 'CBM5';
// Netlify Forms. A matching hidden static form lives in index.html so Netlify
// detects it at build time. The "subject" field sets the notification email
// subject ("[Website Discount Leads] ...") — kept separate from normal contact
// leads so discount signups can be filtered/labeled on their own.
const FORM_NAME = 'discount-signup';

const encodeForm = (data: Record<string, string>) =>
  Object.keys(data)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`)
    .join('&');

export default function DiscountPopup() {
  const { t, i18n } = useTranslation();
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

    const payload = {
      'form-name': FORM_NAME,
      subject: '[Website Discount Leads] Promo code signup',
      email,
      promo_code: PROMO_CODE,
      language: i18n.language === 'fr' ? 'fr' : 'en',
      page_source: document.referrer || window.location.href,
      submitted_at: new Date().toLocaleString('en-CA', {
        timeZone: 'America/Toronto',
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      'bot-field': '',
    };

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodeForm(payload),
      });
      // Only reveal the code after a real successful submission — never fake it.
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (!visible) return null;

  // Corner popup — never blocks the rest of the page.
  return (
    <div
      role="dialog"
      aria-label={t('promo_title')}
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
          <div className="text-center py-2">
            <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-red-600/20 border border-red-900/40 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="text-zinc-500 text-[11px] uppercase tracking-[0.18em] mb-1">{t('promo_code_label')}</div>
            <div className="text-3xl font-bold tracking-normal text-red-500 mb-3 select-all">{PROMO_CODE}</div>
            <p className="text-sm text-zinc-300 leading-relaxed">{t('promo_success')}</p>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-900/40 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a2 2 0 014-4z" />
                </svg>
              </div>
              <div className="text-white font-semibold text-base leading-snug">{t('promo_title')}</div>
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed mb-5">{t('promo_text')}</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('promo_placeholder')}
                required
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-base sm:text-sm placeholder-zinc-500 outline-none focus:border-red-600 transition-colors"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-semibold text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    {t('promo_sending')}
                  </>
                ) : t('promo_btn')}
              </button>
              {status === 'error' && (
                <p className="text-xs text-crimson-accent text-center">{t('promo_error')}</p>
              )}
            </form>

            <p className="mt-4 text-[11px] leading-4 text-zinc-500">{t('promo_terms')}</p>
          </>
        )}
      </div>
    </div>
  );
}
