
    import { useState } from 'react';
    import jsPDF from 'jspdf';
    import html2canvas from 'html2canvas';
    import { useToast } from '@/components/ui/use-toast.jsx';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

    const useReportDownloader = (reportRef, analysisData, analysisType) => {
      const { toast } = useToast();
      const { t } = useTranslation();
      const [isDownloading, setIsDownloading] = useState(false);

      const handleDownloadPdf = async () => {
        if (!reportRef.current || !analysisData) {
          toast({ title: t('errorTitle'), description: t('reportContentNotReady'), variant: 'destructive' });
          return;
        }
        setIsDownloading(true);
        toast({ title: t('downloadStartingTitle'), description: t('downloadStartingMessage') });

        await new Promise(resolve => setTimeout(resolve, 300));

        try {
          const canvas = await html2canvas(reportRef.current, { 
            scale: 2, 
            useCORS: true,
            logging: true,
            onclone: (document) => {
              const reportElement = document.getElementById('report-content');
              if (reportElement) {
                reportElement.style.width = '1048px'; 
                reportElement.style.padding = '0';
                reportElement.style.margin = '0 auto'; 
              }
            }
          });
          const imgData = canvas.toDataURL('image/png');
          
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: 'a4' 
          });

          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          
          const imgProps = pdf.getImageProperties(imgData);
          const imgWidth = imgProps.width;
          const imgHeight = imgProps.height;

          const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
          
          const newImgWidth = imgWidth * ratio;
          const newImgHeight = imgHeight * ratio;

          const xOffset = (pdfWidth - newImgWidth) / 2;
          const yOffset = (pdfHeight - newImgHeight) / 2;

          pdf.addImage(imgData, 'PNG', xOffset, yOffset, newImgWidth, newImgHeight);
          pdf.save(`${analysisData.patient_name || 'Report'}_${analysisType}_${analysisData.id.substring(0,8)}.pdf`);
          toast({ title: t('downloadCompletedTitle'), description: t('downloadCompletedMessage') });
        } catch (e) {
          console.error("Error generating PDF:", e);
          toast({ title: t('errorGeneratingPdf'), description: e.message, variant: 'destructive'});
        } finally {
          setIsDownloading(false);
        }
      };

      return { isDownloading, handleDownloadPdf };
    };

    export default useReportDownloader;
  