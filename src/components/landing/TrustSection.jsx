
    import React from 'react';
    import { Button } from '@/components/ui/button.jsx';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

    const TrustSection = () => {
      const { t } = useTranslation();
      return (
        <section className="py-16 md:py-24 bg-white dark:bg-slate-850">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-4">{t('trustTitle')} <span className="text-primary">{t('trustTitleHighlight')}</span></h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              {t('trustDescription')}
            </p>
            <div className="flex justify-center space-x-6">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10" asChild>
                <a href="mailto:soporte@zooesis.com">{t('contactSupport')}</a>
              </Button>
            </div>
          </div>
        </section>
      );
    };
    export default TrustSection;
  