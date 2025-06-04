
    import React from 'react';
    import { CardContent } from '@/components/ui/card.jsx';
    import { Loader2 } from 'lucide-react';
    import EditableHemogramTable from '@/components/review/EditableHemogramTable.jsx'; // Name can be more generic
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

    const ReviewPageContent = ({ analysis, isProcessingOCR, parameters, editableValues, onValueChange, analysisType }) => {
      const { t } = useTranslation();
    
      return (
        <CardContent className="p-6 md:p-8 space-y-6">
          

          {isProcessingOCR ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">{t('ocrProcessingWait')}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('ocrProcessingInfo')}</p>
            </div>
          ) : (
            <EditableHemogramTable // Consider renaming this component to EditableValuesTable
                parameters={parameters}
                values={editableValues}
                onValueChange={onValueChange}
                analysisType={analysisType} // Pass analysisType to use for translations if needed
            />
          )}
        </CardContent>
      );
    };

    export default ReviewPageContent;
  