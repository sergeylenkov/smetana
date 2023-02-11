import i18n, { TOptions } from 'i18next';
import en from './en.json';
import ru from './ru.json';

type LocalizationStrings = typeof en;

const convert = (obj: any, path?: string): any => {
  return Object.keys(obj).reduce((newObj, key) => {
    if (obj[key] && typeof obj[key] === 'object') {
      return {...newObj, [key]: convert(obj[key], path ? `${path}.${key}` : key) };
    }

    return {...newObj, [key]: path ? `${path}.${key}` : key };
  }, {});
}

export const strings: LocalizationStrings = convert(en) as LocalizationStrings;

void i18n.init({
  lng: 'en',
  debug: true,
  fallbackLng: 'en',
  resources: {
    en: {
      translation: en
    },
    ru: {
      translation: ru
    }
  }
});

export const t = (key: string, options?: TOptions): string => i18n.t(key, options);

export default i18n;
