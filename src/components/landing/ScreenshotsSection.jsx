
    import React from 'react';
    import { motion } from 'framer-motion';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

    const ScreenshotsSection = () => {
      const { t } = useTranslation();
      const image1Src = "https://uyxbupyjmyvulmpjtyum.supabase.co/storage/v1/object/public/landing-images//image2.png";
      const image2Src = "https://uyxbupyjmyvulmpjtyum.supabase.co/storage/v1/object/public/landing-images//image1.png";

      return (
        <section className="py-16 md:py-24 bg-white dark:bg-slate-850">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-4">{t('screenshotsTitle')} <span className="text-primary">Zooesis</span> {t('screenshotsTitleSuffix')}</h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">{t('screenshotsSubtitle')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6 }}
                className=" overflow-hidden  border-slate-200 dark:border-slate-700 aspect-[16/10] md:aspect-auto"
              >
                <img  className="w-full h-full object-contain" alt={t('altDashboardScreenshot')} src={image1Src} />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay:0.2 }}
                className="overflow-hidden border-slate-200 dark:border-slate-700 aspect-[16/10] md:aspect-auto"
              >
                <img  className="w-full h-full object-contain" alt={t('altReportScreenshot')} src={image2Src} />
              </motion.div>
            </div>
        
          </div>
        </section>
      );
    };
    export default ScreenshotsSection;
  