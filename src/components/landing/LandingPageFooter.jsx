
    import React from 'react';
    import { Link } from 'react-router-dom';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

    const LOGO_URL = "https://storage.googleapis.com/hostinger-horizons-assets-prod/eb530bef-47a9-4fae-b305-64f5c47c846e/a083547c1ef271b97839001599f6287c.png";

    const LandingPageFooter = () => {
      const { t } = useTranslation();
      return (
        <footer className="py-12 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
          <div className="container mx-auto px-4 text-center text-slate-600 dark:text-slate-400">
            <div className="flex justify-center items-center mb-4">
               <img  src={LOGO_URL} alt="Zooesis Logo Icon" className="h-8 object-contain" />
            </div>
            <p className="text-sm mb-4">
              © {new Date().getFullYear()} Zooesis. {t('allRightsReserved')}
            </p>
            <div className="space-x-4 text-sm">
              <Link to="/terms" className="hover:text-primary">{t('termsAndConditions')}</Link>
              <span>|</span>
              <Link to="/privacy" className="hover:text-primary">{t('privacyPolicy')}</Link>
              <span>|</span>
              <a href="mailto:contacto@zooesis.com" className="hover:text-primary">{t('contact')}</a>
            </div>
          </div>
        </footer>
      );
    };
    export default LandingPageFooter;
  