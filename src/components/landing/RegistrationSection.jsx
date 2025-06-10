
    import React from 'react';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button.jsx';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

    const RegistrationSection = () => {
      const { t } = useTranslation();
      return (
        <section className="py-16 md:py-24 bg-primary/90 dark:bg-primary/80 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('registrationTitle')}</h2>
            <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto">
              {t('registrationSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button size="lg" asChild className="bg-white hover:bg-slate-100 text-primary text-lg px-10 py-7 rounded-full shadow-lg transform hover:scale-105 transition-transform">
                <Link to="/signup">{t('createAccount')}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white hover:bg-white/10 text-black text-lg px-10 py-7 rounded-full shadow-lg transform hover:scale-105 transition-transform">
                <Link to="/login">{t('login')}</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm opacity-80">{t('registrationSupabase')}</p>
          </div>
        </section>
      );
    };
    export default RegistrationSection;
  