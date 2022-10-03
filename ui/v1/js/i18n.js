import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: require('./i18n/en')
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  keySeparator: '.',
  interpolation: {
    escapeValue: false,
    format: function (value, format, lng) {
      return value.toLocaleString(lng);
    }
  }
});

export default i18n;
