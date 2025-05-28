
    import React from 'react';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';
    import ReportSection from '@/components/report/ReportSection.jsx';
    import { CheckSquare } from 'lucide-react';

    const ReportConclusion = ({ conclusion }) => {
      const { t } = useTranslation();

      const renderConclusionContent = () => {
        if (typeof conclusion === 'string' && conclusion.trim() !== '') {
          return <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 print:text-black">{conclusion}</p>;
        }
        if (typeof conclusion === 'object' && conclusion !== null) {
           console.warn("Report conclusion is an object:", conclusion);
           return <p className="text-sm text-red-500 dark:text-red-400 print:text-red-500">{t('invalidConclusionFormat')}</p>;
        }
        return <p className="text-sm text-muted-foreground print:text-slate-500">{t('noConclusionProvided')}</p>;
      };

      return (
        <ReportSection title={t('conclusion')} icon={<CheckSquare className="text-sky-500 dark:text-sky-400 print:text-sky-500" />}>
          {renderConclusionContent()}
        </ReportSection>
      );
    };

    export default ReportConclusion;
  