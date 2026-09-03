import React, { createContext, useContext, useState, useEffect } from 'react';
import { LANGUAGES, translations } from '../data/translations.js';

const LanguageContext = createContext();
const DEFAULT_LANGUAGE = 'te';

const getInitialLanguage = () => {
  const storedLanguage = localStorage.getItem('vm_language');
  return translations[storedLanguage] ? storedLanguage : DEFAULT_LANGUAGE;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(getInitialLanguage);

  const changeLanguage = (langCode) => {
    if (!translations[langCode]) return;
    setCurrentLanguage(langCode);
    localStorage.setItem('vm_language', langCode);
  };

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  const t = translations[currentLanguage] || translations.en;

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
