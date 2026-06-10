import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import messages from './local/index';

// Resolve the initial language from the URL so a direct load of a "/fr" route
// renders French on the very first paint (no English→French title flash). The
// FrenchLayout still keeps the locale in sync for client-side navigation.
const initialLng =
  typeof window !== 'undefined' && window.location.pathname.startsWith('/fr') ? 'fr' : 'en';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: initialLng,
    fallbackLng: 'en',
    debug: false,
    resources: messages,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;