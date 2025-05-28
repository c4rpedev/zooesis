
    import React from 'react';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';
    import { Zap } from 'lucide-react';

    const GrowingSection = () => {
      const { t } = useTranslation();
      return (
        <section className="py-16 md:py-24 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
              <Zap className="h-16 w-16 mx-auto mb-6 text-white/80" />
              <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('growingTitle')} <span className="border-b-4 border-yellow-300">{t('growingTitleHighlight')}</span></h2>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
                  {t('growingDescription1')} <strong className="font-semibold">{t('biochemistry')}</strong> {t('and')} <strong className="font-semibold">{t('urinalysis')}</strong>{t('growingDescription2')}
              </p>
              <p className="text-lg md:text-xl max-w-3xl mx-auto">
                  {t('growingVision')}
              </p>
          </div>
        </section>
      );
    };
    export default GrowingSection;
  