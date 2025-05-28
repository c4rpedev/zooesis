
    import React from 'react';
    import { useNavigate } from 'react-router-dom';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
    import { Button } from '@/components/ui/button.jsx';
    import { Badge } from '@/components/ui/badge.jsx';
    import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog.jsx';
    import { Eye, Trash2, Edit3, FileText, Download } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

    const getStatusBadgeVariant = (status) => {
      const normalizedStatus = status?.toLowerCase().replace(/\s+/g, '');
      switch (normalizedStatus) {
        case 'pendingreview':
        case 'processingocr':
        case 'interpreting':
          return 'bg-yellow-500 hover:bg-yellow-600';
        case 'reviewed':
          return 'bg-blue-500 hover:bg-blue-600';
        case 'completed':
          return 'bg-green-500 hover:bg-green-600';
        case 'error':
          return 'bg-red-500 hover:bg-red-600';
        default:
          return 'bg-slate-500 hover:bg-slate-600';
      }
    };

    const HistoryTable = ({ analyses, onConfirmDelete }) => {
      const navigate = useNavigate();
      const { t } = useTranslation();

      const formatDate = (dateString) => {
        if (!dateString) return t('notAvailable');
        try {
          const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
          return new Intl.DateTimeFormat(navigator.language || 'en-US', options).format(new Date(dateString));
        } catch (error) {
          console.error("Error formatting date:", error);
          return dateString; 
        }
      };

      const handleViewReport = (analysis) => {
        if (!analysis || !analysis.analysis_type || !analysis.id) {
          console.error("View Report: Missing analysisType or analysisId. Analysis data:", analysis);
          return;
        }
        const normalizedStatus = analysis.status?.toLowerCase().replace(/\s+/g, '');
        if (normalizedStatus !== 'completed') {
          console.warn("View Report: Report viewing is only available for completed analyses. Current status:", analysis.status);
          return;
        }
        navigate(`/report/${analysis.analysis_type}/${analysis.id}`);
      };

      const handleReviewAnalysis = (analysis) => {
         if (!analysis || !analysis.analysis_type || !analysis.id) {
          console.error("Review Analysis: Missing analysisType or analysisId. Analysis data:", analysis);
          return;
        }
        const normalizedStatus = analysis.status?.toLowerCase().replace(/\s+/g, '');
        if (normalizedStatus === 'processingocr' || normalizedStatus === 'interpreting') {
            console.warn("Review Analysis: Review is not available while OCR/Interpretation is in progress. Current status:", analysis.status);
            return;
        }
        navigate(`/review/${analysis.analysis_type}/${analysis.id}`);
      };
      
      const handleDownloadPdfFromHistory = (analysis) => {
        if (!analysis || !analysis.analysis_type || !analysis.id) {
          console.error("Download PDF: Missing analysisType or analysisId. Analysis data:", analysis);
          return;
        }
        const normalizedStatus = analysis.status?.toLowerCase().replace(/\s+/g, '');
         if (normalizedStatus !== 'completed') {
          console.warn("Download PDF: PDF download is only available for completed analyses. Current status:", analysis.status);
          return;
        }
        navigate(`/report/${analysis.analysis_type}/${analysis.id}?download=true`);
      };


      const rowVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: (i) => ({
          opacity: 1,
          y: 0,
          transition: {
            delay: i * 0.05,
            duration: 0.3,
            ease: "easeOut"
          }
        })
      };

      return (
        <div className="overflow-x-auto bg-white dark:bg-slate-800 shadow-md rounded-lg">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-700">
              <TableRow>
                <TableHead className="text-slate-700 dark:text-slate-200">{t('patientName')}</TableHead>
                <TableHead className="text-slate-700 dark:text-slate-200">{t('species')}</TableHead>
                <TableHead className="text-slate-700 dark:text-slate-200">{t('uploadDate')}</TableHead>
                <TableHead className="text-slate-700 dark:text-slate-200">{t('status')}</TableHead>
                <TableHead className="text-right text-slate-700 dark:text-slate-200">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analyses.map((analysis, index) => {
                const normalizedStatus = analysis.status?.toLowerCase().replace(/\s+/g, '');
                return (
                <motion.tr
                  key={analysis.id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={rowVariants}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <TableCell className="font-medium text-slate-800 dark:text-slate-100">{analysis.patient_name || t('notAvailable')}</TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-300">{analysis.species || t('notAvailable')}</TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-300">{formatDate(analysis.created_at)}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusBadgeVariant(normalizedStatus)} text-white text-xs px-2 py-1 rounded-full`}>
                      {t(normalizedStatus || 'unknownStatus', analysis.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleReviewAnalysis(analysis)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      title={normalizedStatus === 'completed' ? t('viewReviewedData') : t('reviewAnalysis')}
                      disabled={normalizedStatus === 'processingocr' || normalizedStatus === 'interpreting'}
                    >
                      {normalizedStatus === 'completed' ? <Eye className="h-5 w-5" /> : <Edit3 className="h-5 w-5" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewReport(analysis)}
                      className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                      title={t('viewReport')}
                      disabled={normalizedStatus !== 'completed'}
                    >
                      <FileText className="h-5 w-5" />
                    </Button>
                     <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownloadPdfFromHistory(analysis)}
                        className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                        title={t('downloadPDF')}
                        disabled={normalizedStatus !== 'completed'}
                      >
                        <Download className="h-5 w-5" />
                      </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          title={t('deleteAnalysis')}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t('areYouSureDelete')}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t('deleteConfirmationMessage', { patientName: analysis.patient_name || 'this analysis' })}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onConfirmDelete(analysis.id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            {t('delete')}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </motion.tr>
              )})}
            </TableBody>
          </Table>
        </div>
      );
    };

    export default HistoryTable;
  