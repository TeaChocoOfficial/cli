// -Path: 'ui\src\i18n\i18n.ts'
import i18n from 'i18next';
import enLocale from './locales/en-US.json';
import thLocale from './locales/th-TH.json';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    'th-TH': { translation: thLocale },
    'en-US': { translation: enLocale },
};

const isBrowser = typeof window !== 'undefined';

if (isBrowser) i18n.use(LanguageDetector);

i18n.use(initReactI18next).init({
    resources,
    fallbackLng: 'en-US',
    interpolation: { escapeValue: false },
    detection: {
        order: ['cookie', 'localStorage', 'navigator'],
        caches: ['cookie', 'localStorage'],
        lookupCookie: 'i18next',
        lookupLocalStorage: 'i18next',
        cookieMinutes: 10080,
    },
});

export default i18n;
