import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "#/locales/en/translation.json";
import ptBR from "#/locales/pt-BR/translation.json";

// all English translations are keys in the en.json file
// but they don't have any value because we are using the keys as the values
// this is useful to know what keys are available in the translation file
// and to avoid typos. but we nede to parse them to an object with the same keys
// but with the values as the keys to use them in the i18n object

const enParsed = Object.keys(en).reduce((acc, key) => {
  acc[key] = key;
  return acc;
}, {});

export const defaultNS = "translation" as const;

export const resources = {
  en: {
    translation: enParsed,
  },
  "pt-BR": {
    translation: ptBR,
  },
} as const;

i18n.use(initReactI18next).init({
  resources,
  lng: "pt-BR",
  defaultNS,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
