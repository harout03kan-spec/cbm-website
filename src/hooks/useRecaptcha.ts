// Google reCAPTCHA v3 hook
// The site key is PUBLIC and safe in the frontend. The secret key must ONLY be
// used server-side to verify tokens — it must never appear in this bundle.
// Configure VITE_RECAPTCHA_SITE_KEY in the environment; the literal below is the
// existing public site key kept as a fallback so the form keeps working.

const SITE_KEY =
  import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6Lcv4PMsAAAAADgeJokEytfxiF7WcfQYAWWQ92lV';

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

// Lazy-load the reCAPTCHA script on demand (only when a form is actually
// submitted) instead of loading it on every page. Loading it globally renders
// the persistent badge in the corner — and on any domain not registered for
// this site key it shows "ERROR for site owner: Invalid domain". Loading it
// lazily keeps that out of the storefront and the CRM while still protecting
// the forms on the production domain. Callers already tolerate a failed token.
let loaderPromise: Promise<void> | null = null;

function loadRecaptcha(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'));
  if (window.grecaptcha) return Promise.resolve();
  if (loaderPromise) return loaderPromise;
  loaderPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-recaptcha]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('reCAPTCHA failed to load')));
      return;
    }
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.setAttribute('data-recaptcha', 'true');
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('reCAPTCHA failed to load'));
    document.head.appendChild(script);
  });
  return loaderPromise;
}

/**
 * Returns a function that, when called with an action name, resolves to a
 * reCAPTCHA v3 token ready to be sent to your backend for verification.
 * The reCAPTCHA script is loaded on first use, not on page load.
 *
 * Backend verification endpoint should POST to:
 *   https://www.google.com/recaptcha/api/siteverify
 * with secret=SECRET_KEY and response=TOKEN
 */
export function useRecaptcha() {
  const getToken = (action: string): Promise<string> => {
    return loadRecaptcha().then(
      () =>
        new Promise<string>((resolve, reject) => {
          if (!window.grecaptcha) {
            reject(new Error('reCAPTCHA not loaded'));
            return;
          }
          window.grecaptcha.ready(() => {
            window.grecaptcha!
              .execute(SITE_KEY, { action })
              .then(resolve)
              .catch(reject);
          });
        }),
    );
  };

  return { getToken };
}
