
    import React from 'react';
    import { CardContent } from '@/components/ui/card.jsx';
    import { Loader2 } from 'lucide-react';
    import EditableHemogramTable from '@/components/review/EditableHemogramTable.jsx'; // Name can be more generic
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

    const ReviewPageContent = ({ analysis, isProcessingOCR, parameters, editableValues, onValueChange, analysisType }) => {
      const { t } = useTranslation();

      return (
        <CardContent className="p-6 md:p-8 space-y-6">
          {analysis.image_url && (
            <div className="mb-6 p-4 border rounded-lg bg-slate-50 dark:bg-slate-700/50 shadow-inner">
              <h3 className="text-lg font-semibold mb-2 text-primary dark:text-sky-400">{t('uploadedImageTitle', {type: t(analysisType)})}</h3>
              <img src={analysis.image_url} alt={t('analysisImageAlt', { patientName: analysis.patient_name, type: t(analysisType) })} className="max-w-full md:max-w-md lg:max-w-lg mx-auto rounded-md shadow-md object-contain" />
            </div>
          )}

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
  