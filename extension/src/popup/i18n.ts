import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import hi from '../locales/hi.json';
import kn from '../locales/kn.json';
import tulu from '../locales/tulu.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    kn: { translation: kn },
    tulu: { translation: tulu },
  },
  lng: localStorage.getItem("preferred-lang") || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});
export default i18n;
