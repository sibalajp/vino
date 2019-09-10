import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import XHR from "i18next-xhr-backend";
import { REACT_APP_LANG_CONFIG_URL } from './config'

fetch(REACT_APP_LANG_CONFIG_URL)
.then((res) => { return res.json() })
.then((res) => {
  i18n
  .use(XHR)
  .use(LanguageDetector)
  .init(res.i18nOptions)
});

export default i18n;
