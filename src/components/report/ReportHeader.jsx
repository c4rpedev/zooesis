
    import React from 'react';
    import { useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button.jsx';
    import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
    import { Download, Printer, Edit, FileText, Loader2 } from 'lucide-react';

    const ReportHeader = ({ analysisId, patientName, reportDate, onPrint, onDownloadPdf, isDownloadingPdf }) => {
      const navigate = useNavigate();

      return (
        <CardHeader className="bg-gradient-to-br from-primary/80 to-sky-600 dark:from-primary/70 dark:to-sky-700 p-6 rounded-t-lg print:bg-transparent print:dark:bg-transparent">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-3">
                <FileText className="h-12 w-12 text-white print:text-primary" />
                <CardTitle className="text-4xl font-bold text-white print:text-slate-800 print:dark:text-slate-100">Hemogram Interpretation Report</CardTitle>
              </div>
              <CardDescription className="text-sky-100 dark:text-sky-200 mt-1 print:text-slate-500 print:dark:text-slate-400">
                Patient: {patientName} | Date: {reportDate}
              </CardDescription>
            </div>
            <div className="flex space-x-2 print:hidden">
              <Button variant="outline" size="icon" onClick={() => navigate(`/review/${analysisId}`)} title="Edit Values">
                <Edit className="h-5 w-5"/>
              </Button>
              <Button variant="outline" size="icon" onClick={onPrint} title="Print Report">
                <Printer className="h-5 w-5"/>
              </Button>
              <Button variant="outline" size="icon" onClick={onDownloadPdf} title="Download PDF" disabled={isDownloadingPdf}>
                {isDownloadingPdf ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5"/>}
              </Button>
            </div>
          </div>
        </CardHeader>
      );
    };

    export default ReportHeader;
  