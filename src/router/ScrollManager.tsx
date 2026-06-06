import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// On client-side navigation:
//  - no hash  -> scroll to the top of the new page
//  - with hash -> scroll to the matching element (e.g. /contact#contact-form),
//    retrying briefly because target pages are lazy-loaded and may mount a
//    moment after the route changes.
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      const scrollToEl = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return true;
        }
        return false;
      };
      if (scrollToEl()) return;
      let tries = 0;
      const timer = window.setInterval(() => {
        tries += 1;
        if (scrollToEl() || tries > 20) window.clearInterval(timer);
      }, 50);
      return () => window.clearInterval(timer);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
