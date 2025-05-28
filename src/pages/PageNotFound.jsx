
    import React from 'react';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button.jsx';
    import { AlertTriangle } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

    const PageNotFound = () => {
      const { t } = useTranslation();

      return (
        <motion.div
          className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AlertTriangle className="h-24 w-24 text-destructive mb-8" />
          <h1 className="text-5xl font-bold text-slate-800 dark:text-white mb-4">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-3">
            {t('pageNotFound')}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
            {t('pageNotFoundMsg')}
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link to="/">{t('goToDashboard')}</Link>
          </Button>
        </motion.div>
      );
    };

    export default PageNotFound;
  