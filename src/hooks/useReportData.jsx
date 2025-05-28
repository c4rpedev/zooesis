
    import { useState, useEffect, useCallback } from 'react';
    import { supabase } from '@/lib/supabaseClient.jsx';
    import { useAuth } from '@/contexts/AuthContext.jsx';
    import { useToast } from '@/components/ui/use-toast.jsx';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

    const useReportData = (analysisId, analysisType) => {
      const { user } = useAuth();
      const { toast } = useToast();
      const { t } = useTranslation();

      const [analysisData, setAnalysisData] = useState(null);
      const [interpretedValues, setInterpretedValues] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      const fetchAnalysis = useCallback(async () => {
        if (!user || !analysisId || !analysisType) {
          setError(t('errorMissingParams'));
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);
        setAnalysisData(null);
        setInterpretedValues(null);

        try {
          const { data, error: dbError } = await supabase
            .from('analyses')
            .select('*, extracted_values, report_data')
            .eq('id', analysisId)
            .eq('user_id', user.id)
            .single();

          if (dbError) throw dbError;
          
          if (!data) {
            setError(t('analysisNotFound'));
            setLoading(false);
            return;
          }

          const normalizedStatus = data.status?.toLowerCase().replace(/\s+/g, '');
          if (normalizedStatus !== 'completed' && normalizedStatus !== 'reviewed') {
            setError(t('analysisNotCompletedYet', { status: data.status }));
            setLoading(false);
            return;
          }
          
          setAnalysisData(data);

          if (data.report_data) {
            setInterpretedValues(typeof data.report_data === 'string' ? JSON.parse(data.report_data) : data.report_data);
          } else {
            console.warn("Report data (interpreted values) is missing or not in expected format for this analysis.");
            setInterpretedValues({}); 
          }

        } catch (err) {
          console.error("Error fetching analysis:", err);
          setError(t('errorFetchingAnalysisDetails', { message: err.message }));
          toast({ title: t('errorTitle'), description: t('errorFetchingAnalysisDetails', { message: err.message }), variant: 'destructive' });
        } finally {
          setLoading(false);
        }
      }, [analysisId, analysisType, user, t, toast]);

      useEffect(() => {
        fetchAnalysis();
      }, [fetchAnalysis]);

      return { analysisData, interpretedValues, loading, error, fetchAnalysis };
    };

    export default useReportData;
  