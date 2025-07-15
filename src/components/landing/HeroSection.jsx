import React from 'react';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button.jsx';
    import { motion } from 'framer-motion';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

    const HeroSection = () => {
      const { t } = useTranslation();

      // Animation variants for the container
      const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2 // Stagger children animations
          }
        }
      };

      // Animation variants for text and image items
      const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1
        }
      };

      return (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="py-16 md:py-24 bg-cover bg-center relative overflow-hidden" // Added overflow-hidden to prevent image overflow
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10 dark:from-primary/10 dark:via-background dark:to-secondary/5"></div>
          <motion.div
            className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12" // Use flexbox for layout
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Text Content */}
            <motion.div className="w-full md:w-1/2 text-center md:text-left space-y-6" variants={itemVariants}> {/* Added variants to text container */}
              <motion.h1
                className="text-5xl md:text-7xl font-extrabold text-slate-800 dark:text-white tracking-tight"
              >
                {t('landingHeroTitle')} <span className="text-primary">{t('landingHeroTitleHighlight')}</span>
              </motion.h1>
              <motion.p
                className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl md:max-w-none mx-auto md:mx-0"
              >
                {t('landingHeroSubtitle')}
              </motion.p>
              <motion.div>
                <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-7 rounded-full shadow-lg transform hover:scale-105 transition-transform">
                  <Link to="/signup">{t('landingHeroCTA')}</Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Image Content */}
            <motion.div className="w-full md:w-1/2 flex justify-center md:justify-end" variants={itemVariants}> {/* Added variants to image container */}
              {/* TODO: Replace with your desired image */}
              <img
                src="https://uyxbupyjmyvulmpjtyum.supabase.co/storage/v1/object/public/landing-images//landing_image.png" // Placeholder image URL
                alt="Hero Section Image" // Placeholder alt text
                className="w-full max-w-md md:max-w-xl lg:max-w-2xl h-auto rounded-lg" // Modified styling for the image to make it bigger
              />
            </motion.div>
          </motion.div>
        </motion.section>
      );
    };

    export default HeroSection;
