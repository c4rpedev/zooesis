
    import React from 'react';
    import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

    const ReviewPageHeader = ({ patientName, isProcessingOCR }) => {
      const { t } = useTranslation();

      return (
        <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-700/20 dark:to-cyan-700/20 p-6 rounded-t-lg">
          <CardTitle className="text-3xl font-bold text-slate-800 dark:text-white">{t('reviewAnalysisTitle')}</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-300">
            {t('reviewAnalysisDescription', { patientName: patientName })}
            {isProcessingOCR && <span className="ml-2 font-semibold text-amber-600 dark:text-amber-400">({t('ocrInProgressStatus')})</span>}
          </CardDescription>
        </CardHeader>
      );
    };

    export default ReviewPageHeader;
  