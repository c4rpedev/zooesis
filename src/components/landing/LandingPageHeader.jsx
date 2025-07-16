import React, { useState } from 'react';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button.jsx';
    import { Globe, Menu, X } from 'lucide-react';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';
    import { motion, AnimatePresence } from 'framer-motion';
    import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuLabel,
      DropdownMenuRadioGroup,
      DropdownMenuRadioItem,
      DropdownMenuTrigger,
    } from '@/components/ui/dropdown-menu.jsx';

    const LOGO_URL = "https://storage.googleapis.com/hostinger-horizons-assets-prod/eb530bef-47a9-4fae-b305-64f5c47c846e/a083547c1ef271b97839001599f6287c.png";

    const LandingPageHeader = () => {
      const { t, language, setLanguage, availableLanguages } = useTranslation();
      const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

      const languageLabels = {
        en: t('english'),
        es: t('spanish'),
        pt: t('portuguese'),
      };

      // Animation variants for mobile menu
      const menuVariants = {
        hidden: { x: "100%" },
        visible: { x: 0 },
      };

      return (
        <header className="py-6 px-4 sm:px-6 lg:px-8 sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img  src={LOGO_URL} alt="Zooesis Logo" className="h-10 md:h-12 object-contain" />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center space-x-2 sm:space-x-3">
            
              <Button variant="ghost" asChild>
                <a href="#features">{t('features')}</a>
              </Button>
              <Button variant="ghost" asChild>
                <a href="#pricing">{t('prices')}</a>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/login">{t('login')}</Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link to="/signup">{t('signUp')}</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label={t('language')}>
                    <Globe className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{t('language')}</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={language} onValueChange={setLanguage}>
                    {availableLanguages.map((lang) => (
                      <DropdownMenuRadioItem key={lang} value={lang}>
                        {languageLabels[lang] || lang.toUpperCase()}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="sm:hidden flex items-center">
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label={t('language')}>
                    <Globe className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{t('language')}</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={language} onValueChange={setLanguage}>
                    {availableLanguages.map((lang) => (
                      <DropdownMenuRadioItem key={lang} value={lang}>
                        {languageLabels[lang] || lang.toUpperCase()}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                size="icon"
                className="ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open mobile menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu Overlay and Content */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                key="mobile-menu-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                key="mobile-menu-content"
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="fixed top-[80px] right-0 w-64 h-[calc(100vh-80px)] bg-white shadow-lg z-50 p-6 flex flex-col space-y-4 sm:hidden" // Adjusted top, height, and removed dark background
              >
                <div className="flex justify-end items-center pb-4 border-b border-slate-200 dark:border-slate-700"> {/* Added padding bottom and border */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Close mobile menu"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                <Button variant="ghost" asChild onClick={() => setIsMobileMenuOpen(false)}>
                  <a href="#features">{t('features')}</a>
                </Button>
                 <Button variant="ghost" asChild onClick={() => setIsMobileMenuOpen(false)}>
                  <a href="#pricing">{t('prices')}</a>
                </Button>
                <Button variant="ghost" asChild onClick={() => setIsMobileMenuOpen(false)}>
                  <Link to="/login">{t('login')}</Link>
                </Button>
                <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setIsMobileMenuOpen(false)}>
                  <Link to="/signup">{t('signUp')}</Link>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </header>
      );
    };
    

    export default LandingPageHeader;
