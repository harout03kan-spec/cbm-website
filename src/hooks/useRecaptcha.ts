// Google reCAPTCHA v3 hook
// Site key is public — secret key must ONLY be used server-side to verify tokens.

const SITE_KEY = '6Lcv4PMsAAAAADgeJokEytfxiF7WcfQYAWWQ92lV';

declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

/**
 * Returns a function that, when called with an action name, resolves to a
 * reCAPTCHA v3 token ready to be sent to your backend for verification.
 *
 * Backend verification endpoint should POST to:
 *   https://www.google.com/recaptcha/api/siteverify
 * with secret=SECRET_KEY and response=TOKEN
 */
export function useRecaptcha() {
  const getToken = (action: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.grecaptcha) {
        reject(new Error('reCAPTCHA not loaded'));
        return;
      }
      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(SITE_KEY, { action })
          .then(resolve)
          .catch(reject);
      });
    });
  };

  return { getToken };
}
