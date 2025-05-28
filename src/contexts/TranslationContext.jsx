
    import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

    const availableLanguages = ['en', 'es', 'pt'];

    const loadTranslations = async (language) => {
      if (!availableLanguages.includes(language)) {
        console.warn(`Language "${language}" not available, defaulting to "en".`);
        language = 'en';
      }
      try {
        const common = await import(`@/locales/${language}/common.json`);
        const auth = await import(`@/locales/${language}/auth.json`);
        const analysis = await import(`@/locales/${language}/analysis.json`);
        const admin = await import(`@/locales/${language}/admin.json`);
        const landing = await import(`@/locales/${language}/landing.json`);
        const subscription = await import(`@/locales/${language}/subscription.json`);

        return {
          ...common.default,
          ...auth.default,
          ...analysis.default,
          ...admin.default,
          ...landing.default,
          ...subscription.default,
        };
      } catch (error) {
        console.error(`Error loading translations for ${language}:`, error);
        if (language !== 'en') {
          try {
            console.log(`Attempting to load English translations as fallback for ${language}`);
            const enCommon = await import(`@/locales/en/common.json`);
            const enAuth = await import(`@/locales/en/auth.json`);
            const enAnalysis = await import(`@/locales/en/analysis.json`);
            const enAdmin = await import(`@/locales/en/admin.json`);
            const enLanding = await import(`@/locales/en/landing.json`);
            const enSubscription = await import(`@/locales/en/subscription.json`);
            return {
              ...enCommon.default,
              ...enAuth.default,
              ...enAnalysis.default,
              ...enAdmin.default,
              ...enLanding.default,
              ...enSubscription.default,
            };
          } catch (fallbackError) {
            console.error(`Error loading English fallback translations:`, fallbackError);
            return {}; 
          }
        }
        return {}; 
      }
    };

    const TranslationContext = createContext();

    const getInitialLanguage = () => {
      const storedLang = localStorage.getItem('zooesis_lang');
      if (storedLang && availableLanguages.includes(storedLang)) {
        return storedLang;
      }
      const browserLang = navigator.language?.split('-')[0];
      if (browserLang && availableLanguages.includes(browserLang)) {
        return browserLang;
      }
      return 'en'; 
    };

    export const TranslationProvider = ({ children }) => {
      const [language, setLanguageState] = useState(getInitialLanguage);
      const [currentTranslations, setCurrentTranslations] = useState({});
      const [isLoadingTranslations, setIsLoadingTranslations] = useState(true);

      const fetchTranslations = useCallback(async (lang) => {
        setIsLoadingTranslations(true);
        const translations = await loadTranslations(lang);
        setCurrentTranslations(translations);
        localStorage.setItem('zooesis_lang', lang);
        document.documentElement.lang = lang;
        setIsLoadingTranslations(false);
      }, []);

      useEffect(() => {
        fetchTranslations(language);
      }, [language, fetchTranslations]);

      const setLanguage = (lang) => {
        if (availableLanguages.includes(lang)) {
          setLanguageState(lang);
        } else {
          console.warn(`Attempted to set unsupported language: ${lang}`);
        }
      };
      
      const t = useCallback((key, params = {}) => {
        if (isLoadingTranslations) return key; 

        let translation = currentTranslations[key] || key;
        Object.keys(params).forEach(paramKey => {
          const value = params[paramKey];
          translation = translation.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), value);
        });
        return translation;
      }, [currentTranslations, isLoadingTranslations]);


      return (
        <TranslationContext.Provider value={{ language, setLanguage, t, availableLanguages, isLoadingTranslations }}>
          {children}
        </TranslationContext.Provider>
      );
    };

    export const useTranslation = () => {
      const context = useContext(TranslationContext);
      if (!context) {
        throw new Error('useTranslation must be used within a TranslationProvider');
      }
      return context;
    };
  