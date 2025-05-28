
    import React from 'react';
    import { Button } from '@/components/ui/button.jsx';
    import { Download, ArrowLeft, Loader2 } from 'lucide-react';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

    const ReportActionsBar = ({ onBack, onDownload, isDownloading }) => {
      const { t } = useTranslation();

      return (
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button variant="outline" onClick={onBack} className="w-full sm:w-auto text-primary border-primary hover:bg-primary/10">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t('backToHistory')}
          </Button>
          <Button onClick={onDownload} disabled={isDownloading} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
            {isDownloading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            {t('downloadPDF')}
          </Button>
        </div>
      );
    };

    export default ReportActionsBar;
  