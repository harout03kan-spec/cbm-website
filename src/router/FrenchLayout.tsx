import { useEffect, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Layout for the localized "/fr" URL prefix. It forces the French locale and
// renders the same page components (via <Outlet />) so /fr/services, /fr/shop,
// etc. show the French versions instead of 404ing. English routes are untouched.
export default function FrenchLayout() {
  const { i18n } = useTranslation();
  useEffect(() => {
    if (i18n.language !== 'fr') i18n.changeLanguage('fr');
  }, [i18n]);
  return (
    <Suspense fallback={null}>
      <Outlet />
    </Suspense>
  );
}
