
    import React from 'react';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button.jsx';
    import { FileText } from 'lucide-react';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

    const HistoryEmptyState = ({ searchTerm }) => {
      const { t } = useTranslation();
      return (
        <div className="text-center py-16 px-6">
          <FileText className="mx-auto h-16 w-16 text-slate-400 dark:text-slate-500 mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-1">{t('noAnalysesFound')}</h3>
          <p className="text-slate-500 dark:text-slate-400">
            {searchTerm ? t('noAnalysesMatchSearch') : t('noAnalysesYet')}
          </p>
          {!searchTerm && (
            <Button asChild className="mt-6">
              <Link to="/new-analysis">{t('startFirstAnalysis')}</Link>
            </Button>
          )}
        </div>
      );
    };
    export default HistoryEmptyState;
  