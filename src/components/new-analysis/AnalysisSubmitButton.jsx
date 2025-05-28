
    import React from 'react';
    import { Button } from '@/components/ui/button.jsx';
    import { FilePlus2, Loader2, BrainCircuit } from 'lucide-react';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

    const AnalysisSubmitButton = ({ onClick, isSubmitting, ocrInProgress }) => {
      const { t } = useTranslation();

      return (
        <Button 
          type="button" 
          onClick={onClick}
          size="lg" 
          className="min-w-[220px] shadow-lg bg-gradient-to-r from-primary to-sky-500 hover:from-primary/90 hover:to-sky-500/90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:focus:ring-offset-slate-800" 
          disabled={isSubmitting || ocrInProgress}
        >
          {isSubmitting && !ocrInProgress && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          {ocrInProgress && <BrainCircuit className="mr-2 h-5 w-5 animate-spin" />}
          
          {isSubmitting && !ocrInProgress && t('submitting')}
          {ocrInProgress && t('ocrProcessingButton')}
          {!isSubmitting && !ocrInProgress && (
            <>
              <FilePlus2 className="mr-2 h-5 w-5" />
              {t('submitForAnalysis')}
            </>
          )}
        </Button>
      );
    };

    export default AnalysisSubmitButton;
  