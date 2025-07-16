import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/contexts/TranslationContext.jsx';

const ScreenshotsSection = () => {
  const { t } = useTranslation();
  const image1Src = "https://uyxbupyjmyvulmpjtyum.supabase.co/storage/v1/object/public/landing-images//2.png";
  const image2Src = "https://uyxbupyjmyvulmpjtyum.supabase.co/storage/v1/object/public/landing-images//1.png";

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-slate-850">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-4">
            {t('screenshotsTitle')} <span className="text-primary">Zooesis</span> {t('screenshotsTitleSuffix')}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            {t('screenshotsSubtitle')}
          </p>
        </div>

        {/* First Feature - Image Right, Text Left */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16 lg:mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <div className="max-w-lg">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-4">
                {t('feature1Title') }
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                {t('feature1Description') }
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
              <a href="/signup" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-center">
                  {t('landingHeroCTA')}
                </a>
            
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl   p-2">
              <img 
                className="w-full h-full object-contain rounded-lg" 
                alt={t('altDashboardScreenshot')} 
                src={image1Src} 
              />
              <div className="absolute inset-0 rounded-2xl"></div>
            </div>
          </motion.div>
        </div>

        {/* Second Feature - Image Left, Text Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="order-1"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl p-2">
              <img 
                className="w-full h-full object-contain rounded-lg" 
                alt={t('altReportScreenshot')} 
                src={image2Src} 
              />
              <div className="absolute inset-0 rounded-2xl"></div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-2"
          >
            <div className="max-w-lg lg:ml-8">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-4">
                {t('feature2Title') || 'Detailed Reporting System'}
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                {t('feature2Description') || 'Generate comprehensive reports with customizable templates. Export data in multiple formats and share insights with your team effortlessly.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
              <a href="/signup" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-center">
                  {t('landingHeroCTA')}
                </a>
             
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ScreenshotsSection;