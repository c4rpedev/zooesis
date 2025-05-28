
    import React from 'react';
    import { motion } from 'framer-motion';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';
    import { UploadCloud, ClipboardList, FileDown } from 'lucide-react';

    const FeatureCard = ({ icon: Icon, title, description, delay }) => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="flex flex-col items-center p-6 bg-slate-50 dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-primary/20 transition-shadow duration-300"
      >
        <div className="p-4 bg-primary/10 rounded-full mb-4">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2 text-center">{title}</h3>
        <p className="text-slate-600 dark:text-slate-300 text-center text-sm">{description}</p>
      </motion.div>
    );
    
    const WhatIsZooesisSection = () => {
      const { t } = useTranslation();
      return (
        <section className="py-16 md:py-24 bg-white dark:bg-slate-850">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-4">{t('whatIsZooesisTitle')} <span className="text-primary">Zooesis</span>?</h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                {t('whatIsZooesisDescription1')}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto">
              <FeatureCard icon={UploadCloud} title={t('whatIsZooesisStep1Title')} description={t('whatIsZooesisStep1Description')} delay={0.1} />
              <FeatureCard icon={ClipboardList} title={t('whatIsZooesisStep2Title')} description={t('whatIsZooesisStep2Description')} delay={0.2} />
              <FeatureCard icon={FileDown} title={t('whatIsZooesisStep3Title')} description={t('whatIsZooesisStep3Description')} delay={0.3} />
            </div>
          </div>
        </section>
      );
    };
    export default WhatIsZooesisSection;
  