
    import React from 'react';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button.jsx';
    import { motion } from 'framer-motion';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

    const HeroSection = () => {
      const { t } = useTranslation();
      return (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="py-20 md:py-32 text-center bg-cover bg-center relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10 dark:from-primary/10 dark:via-background dark:to-secondary/5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.h1 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-7xl font-extrabold text-slate-800 dark:text-white mb-6 tracking-tight"
            >
              {t('landingHeroTitle')} <span className="text-primary">{t('landingHeroTitleHighlight')}</span>
            </motion.h1>
            <motion.p 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-10 max-w-3xl mx-auto"
            >
              {t('landingHeroSubtitle')}
            </motion.p>
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-7 rounded-full shadow-lg transform hover:scale-105 transition-transform">
                <Link to="/signup">{t('landingHeroCTA')}</Link>
              </Button>
            </motion.div>
          </div>
        </motion.section>
      );
    };
    export default HeroSection;
  