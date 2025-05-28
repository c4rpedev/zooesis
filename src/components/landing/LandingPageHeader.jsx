
    import React from 'react';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button.jsx';
    import { Globe } from 'lucide-react';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';
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
      const languageLabels = {
        en: t('english'),
        es: t('spanish'),
        pt: t('portuguese'),
      };

      return (
        <header className="py-6 px-4 sm:px-6 lg:px-8 sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img  src={LOGO_URL} alt="Zooesis Logo" className="h-10 md:h-12 object-contain" />
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-3">
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
              <Button variant="ghost" asChild className="hidden sm:inline-flex">
                <Link to="/login">{t('login')}</Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link to="/signup">{t('signUp')}</Link>
              </Button>
            </div>
          </div>
        </header>
      );
    };
    export default LandingPageHeader;
  