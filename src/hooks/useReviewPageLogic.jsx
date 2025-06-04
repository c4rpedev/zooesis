
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient.jsx';
import { interpretValues } from '@/lib/geminiService.jsx'; 
import { getParametersForAnalysisType } from '@/lib/analysisUtils.jsx';


const useReviewPageLogic = (analysisId, analysisType, user, toast, navigate, t, language) => {
  const [analysis, setAnalysis] = useState(null);
  const [editableValues, setEditableValues] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [parameters, setParameters] = useState([]);

  useEffect(() => {
    if (analysisType) {
      setParameters(getParametersForAnalysisType(analysisType));
    }
  }, [analysisType]);

  const fetchAnalysis = useCallback(async () => {
    if (!user || !analysisId || !analysisType) {
        setIsLoading(false);
        return;
    }
    setIsLoading(true);
    try {
      const { data, error, status } = await supabase
        .from('analyses')
        .select('*')
        .eq('id', analysisId)
        .eq('user_id', user.id)
        .eq('analysis_type', analysisType) 
        .single();

      if (error && status !== 406) { 
        throw error;
      }
      if (!data) {
        throw new Error(t('analysisNotFound'));
      }
      
      setAnalysis(data);
      const initialValues = {};
      const currentParams = getParametersForAnalysisType(data.analysis_type); 
      
      const actualExtractedValues = data.extracted_values?.extracted_values || data.extracted_values || {};

      currentParams.forEach(param => {
        initialValues[param.id] = actualExtractedValues[param.id] ?? actualExtractedValues[param.label] ?? "";
      });
      setEditableValues(initialValues);
      setParameters(currentParams); 

    } catch (error) {
      console.error("Error fetching analysis:", error);
      toast({ title: t('errorFetchingAnalysisTitle'), description: error.message || t('unexpectedError'), variant: 'destructive' });
      navigate('/history');
    } finally {
      setIsLoading(false);
    }
  }, [analysisId, analysisType, user, toast, navigate, t]);

  useEffect(() => {
    fetchAnalysis();
  }, [fetchAnalysis]);

  const handleValueChange = (param, value) => {
    setEditableValues(prev => ({ ...prev, [param]: value }));
  };

  const handleSaveReview = async () => {
    setIsSaving(true);
    try {
      const updatedAnalysisData = { 
        extracted_values: { extracted_values: editableValues }, // Maintain the nested structure if needed for consistency
        status: 'Reviewed',
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('analyses')
        .update(updatedAnalysisData)
        .eq('id', analysisId)
        .eq('user_id', user.id);

      if (error) throw error;
      toast({ title: t('reviewSavedTitle'), description: t('reviewSavedSuccess') });
      setAnalysis(prev => ({...prev, ...updatedAnalysisData}));
    } catch (error) {
      console.error("Error saving review:", error);
      toast({ title: t('errorSavingReviewTitle'), description: error.message || t('unexpectedError'), variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleConfirmAndInterpret = async () => {
    setIsInterpreting(true);
    try {
      const valuesToInterpret = { ...editableValues };
      
      const interpretingStatusUpdate = { 
        extracted_values: { extracted_values: valuesToInterpret }, // Save with nesting
        status: 'Interpreting',
        updated_at: new Date().toISOString()
      };

      const { error: saveError } = await supabase
        .from('analyses')
        .update(interpretingStatusUpdate)
        .eq('id', analysisId)
        .eq('user_id', user.id);

      if (saveError) throw saveError;
      setAnalysis(prev => ({...prev, ...interpretingStatusUpdate}));

      const patientContext = {
        patient_name: analysis?.patient_name,
        species: analysis?.species,
        breed: analysis?.breed,
        age: analysis?.age,
        sex: analysis?.sex,
        weight: analysis?.weight,
        anamnesis: analysis?.anamnesis,
      };
      console.log('valuesToInterpret',valuesToInterpret)
      console.log('patientContext',patientContext)
      const interpretationResult = await interpretValues(valuesToInterpret, analysisType, language, patientContext);
      console.log('interpretationResult',interpretationResult)
      
      const finalUpdateData = { 
        report_data: interpretationResult, 
        status: 'Completed',
        reviewed_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error: updateError } = await supabase
        .from('analyses')
        .update(finalUpdateData)
        .eq('id', analysisId)
        .eq('user_id', user.id);
      
      if (updateError) throw updateError;

      toast({ title: t('interpretationCompleteTitle'), description: t('interpretationCompleteSuccess') });
      navigate(`/report/${analysisType}/${analysisId}`); 

    } catch (error) {
      console.error("Error during interpretation:", error);
      toast({ title: t('errorDuringInterpretationTitle'), description: error.message || t('unexpectedError'), variant: 'destructive' });
       const revertStatusUpdate = { status: 'Reviewed', updated_at: new Date().toISOString() };
       await supabase.from('analyses').update(revertStatusUpdate).eq('id', analysisId).eq('user_id', user.id);
       setAnalysis(prev => ({...prev, status: 'Reviewed'}));
    } finally {
      setIsInterpreting(false);
    }
  };

  return {
    analysis,
    editableValues,
    isLoading,
    isSaving,
    isInterpreting,
    parameters, 
    fetchAnalysis,
    handleValueChange,
    handleSaveReview,
    handleConfirmAndInterpret,
  };
};

export default useReviewPageLogic;
