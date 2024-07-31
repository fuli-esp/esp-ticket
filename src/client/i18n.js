import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 直接在前端定义翻译资源
const resources = {
  en: {
    translation: {
      "welcome": "Welcome to my project",
      "description": "This is a description"
    }
  },
  ja: {
    translation: {
      "welcome": "プロジェクトへようこそ",
      "description": "これは説明です"
    }
  },
  zh: {
    translation: {
      "welcome": "欢迎来到我的项目",
      "description": "这是一个描述"
    }
  }
};

i18n.use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ja',
    debug: true,
    interpolation: {
      escapeValue: false, // React already does escaping
    }
  });

export default i18n;
