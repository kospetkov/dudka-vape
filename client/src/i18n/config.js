import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ua from './locales/ua.json';
import ru from './locales/ru.json';
import en from './locales/en.json';

const savedLanguage = localStorage.getItem('language') || 'ua';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            ua: { translation: ua },
            ru: { translation: ru },
            en: { translation: en }
        },
        lng: savedLanguage,
        fallbackLng: 'ua',
        interpolation: {
            escapeValue: false
        }
    });

// Save language preference when it changes
i18n.on('languageChanged', (lng) => {
    localStorage.setItem('language', lng);
});

export default i18n;
