
    import React, { useEffect, useRef } from 'react';
    import { useParams, useLocation, useNavigate } from 'react-router-dom';
    import { useAuth } from '@/contexts/AuthContext.jsx';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';
    import { motion } from 'framer-motion';
    import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
    import NotFoundMessage from '@/components/common/NotFoundMessage.jsx';
    import useReportData from '@/hooks/useReportData.jsx';
    import useReportDownloader from '@/hooks/useReportDownloader.jsx';
    import useAnalysisParameters from '@/hooks/useAnalysisParameters.jsx';
    import ReportActionsBar from '@/components/report/ReportActionsBar.jsx';
    import ReportDisplayContent from '@/components/report/ReportDisplayContent.jsx';

    const ReportPage = () => {
      const { analysisType, analysisId } = useParams();
      const location = useLocation();
      const navigate = useNavigate();
      const { user } = useAuth();
      const { t } = useTranslation(); 
      
      const reportRef = useRef(null);

      const { 
        analysisData, 
        interpretedValues, 
        loading, 
        error,
      } = useReportData(analysisId, analysisType);
      
      const { 
        isDownloading, 
        handleDownloadPdf 
      } = useReportDownloader(reportRef, analysisData, analysisType);

      useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        if (queryParams.get('download') === 'true' && analysisData && !loading && !error && !isDownloading) {
          handleDownloadPdf();
          navigate(`/report/${analysisType}/${analysisId}`, { replace: true }); 
        }
      }, [location.search, analysisData, loading, error, analysisType, analysisId, navigate, handleDownloadPdf, isDownloading]);
      
      const analysisParameters = useAnalysisParameters(analysisData?.analysis_type, analysisData?.species);

      if (loading) {
        return <LoadingSpinner fullScreen={true} text={t('loadingReport')} />;
      }

      if (error) {
        return <NotFoundMessage message={error} />;
      }

      if (!analysisData || !interpretedValues) {
        return <NotFoundMessage message={t('analysisDataUnavailable')} />;
      }
      
      const reportPageVariants = {
        initial: { opacity: 0, scale: 0.98 },
        animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
      };
      
      return (
        <motion.div 
          variants={reportPageVariants}
          initial="initial"
          animate="animate"
          className="container mx-auto p-4 md:p-8 max-w-4xl"
        >
          <ReportActionsBar 
            onBack={() => navigate('/history')}
            onDownload={handleDownloadPdf}
            isDownloading={isDownloading}
            className="no-print"
          />
          <ReportDisplayContent
            reportRef={reportRef}
            analysisData={analysisData}
            interpretedValues={interpretedValues}
            analysisParameters={analysisParameters}
            userFullName={user?.user_metadata?.full_name}
          />
        </motion.div>
      );
    };

    export default ReportPage;
  