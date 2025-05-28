
    import React from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import { useToast } from '@/components/ui/use-toast.jsx';
    import { Card } from '@/components/ui/card.jsx';
    import { motion } from 'framer-motion';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';
    import { useAuth } from '@/contexts/AuthContext.jsx';
    import ReviewPageHeader from '@/components/review/ReviewPageHeader.jsx';
    import ReviewPageContent from '@/components/review/ReviewPageContent.jsx';
    import ReviewPageActions from '@/components/review/ReviewPageActions.jsx';
    import useReviewPageLogic from '@/hooks/useReviewPageLogic.jsx';
    import LoadingSpinner from '@/components/common/LoadingSpinner.jsx'; 
    import NotFoundMessage from '@/components/common/NotFoundMessage.jsx';

    const ReviewPage = () => {
      const { analysisType, analysisId } = useParams(); // Get analysisType from URL
      const navigate = useNavigate();
      const { t, language } = useTranslation();
      const { user } = useAuth();
      const { toast } = useToast();

      const {
        analysis,
        editableValues,
        isLoading,
        isSaving,
        isInterpreting,
        parameters, // Now parameters are dynamic
        handleValueChange,
        handleSaveReview,
        handleConfirmAndInterpret,
      } = useReviewPageLogic(analysisId, analysisType, user, toast, navigate, t, language);
      
      if (isLoading) {
        return <LoadingSpinner fullScreen={true} text={t('loadingAnalysis')} />;
      }

      if (!analysis) {
        return <NotFoundMessage message={t('analysisNotFound')} />;
      }
      
      const isProcessingOCR = analysis.status === "Processing OCR";
      const pageTitle = t(`reviewPageTitle_${analysisType}`, t('reviewAnalysis')); // Dynamic title

      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-8"
        >
          <Card className="max-w-4xl mx-auto shadow-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <ReviewPageHeader 
              patientName={analysis.patient_name || t('unknownPatient')} 
              isProcessingOCR={isProcessingOCR}
              pageTitle={pageTitle}
              analysisType={analysisType}
            />
            <ReviewPageContent
              analysis={analysis}
              isProcessingOCR={isProcessingOCR}
              parameters={parameters} // Pass dynamic parameters
              editableValues={editableValues}
              onValueChange={handleValueChange}
              analysisType={analysisType} // Pass analysisType
            />
            {!isProcessingOCR && (
              <ReviewPageActions
                isSaving={isSaving}
                isInterpreting={isInterpreting}
                onSaveReview={handleSaveReview}
                onConfirmAndInterpret={handleConfirmAndInterpret}
                onBackToHistory={() => navigate('/history')}
              />
            )}
          </Card>
        </motion.div>
      );
    };

    export default ReviewPage;
  