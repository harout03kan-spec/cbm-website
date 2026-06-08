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

    // Returning to the shop via a "Shop" / "Back to Shop" button after opening a
    // product — restore the scroll position the customer left from instead of
    // jumping to the top. Direct visits (no flag / no saved position) go to top.
    if (pathname === '/shop' && sessionStorage.getItem('restoreShopScroll')) {
      sessionStorage.removeItem('restoreShopScroll');
      const y = Number(sessionStorage.getItem('shopScrollY') || 0);
      if (y > 0) {
        let tries = 0;
        const timer = window.setInterval(() => {
          window.scrollTo(0, y);
          tries += 1;
          if (Math.abs(window.scrollY - y) < 2 || tries > 20) window.clearInterval(timer);
        }, 30);
        return () => window.clearInterval(timer);
      }
    }

    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
