
    import React from 'react';
    import { useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button.jsx';
    import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
    import { Download, Printer, Edit, FileText, Loader2 } from 'lucide-react';
    import { useTranslation } from '@/contexts/TranslationContext.jsx'; // Import useTranslation


    const ReportHeader = ({ analysisId, analysisType, patientName, reportDate, onPrint, onDownloadPdf, isDownloadingPdf }) => {
    

      const navigate = useNavigate();

      const { t } = useTranslation(); // Use the translation hook

      // Determine the locale key for the title based on analysis type
      const reportTitleKey = () => {
        switch (analysisType) {
          case 'hemogram':
            return 'hemogramReportTitle'; // Locale key for Hemogram report title
          case 'biochemistry':
            return 'biochemistryReportTitle'; // Locale key for Biochemistry report title
          case 'urinalysis':
            return 'urinalysisReportTitle'; // Locale key for Urinalysis report title
          default:
            return 'analysisReportTitle'; // Default locale key
        }
      };

      return (
        <CardHeader className="bg-gradient-to-br from-primary/80 to-sky-600 dark:from-primary/70 dark:to-sky-700 p-6 rounded-t-lg print:bg-transparent print:dark:bg-transparent">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-3">
                <FileText className="h-12 w-12 text-white print:text-primary" />
                <CardTitle className="text-4xl font-bold text-white print:text-slate-800 print:dark:text-slate-100">{t(reportTitleKey())}</CardTitle>
              </div>
              <CardDescription className="text-sky-100 dark:text-sky-200 mt-1 print:text-slate-500 print:dark:text-slate-400">
              {t('dateLabel')} : {reportDate}
              </CardDescription>
            </div>
            <div className="flex space-x-2 print:hidden">
              <Button variant="outline" size="icon" onClick={() => navigate(`/review/${analysisType}/${analysisId}`)} title="Edit Values">
                <Edit className="h-5 w-5"/>
              </Button>
              <Button variant="outline" size="icon" onClick={onPrint} title="Print Report">
                <Printer className="h-5 w-5"/>
              </Button>
              {/* <Button variant="outline" size="icon" onClick={onDownloadPdf} title="Download PDF" disabled={isDownloadingPdf}>
                {isDownloadingPdf ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5"/>}
              </Button> */}
            </div>
          </div>
        </CardHeader>
      );
    };

    export default ReportHeader;
  