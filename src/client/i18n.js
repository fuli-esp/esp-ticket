import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from './locales/index';

const fallbackLng  = 'ja';
// 从本地存储读取语言设置
const savedLanguage = localStorage.getItem('language') || fallbackLng;
i18n.use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng,
    debug: true,
    interpolation: {
      escapeValue: false, // React already does escaping
    }
  });

export default i18n;
