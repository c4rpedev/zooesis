
    import { useState, useEffect, useCallback } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { supabase } from '@/lib/supabaseClient.jsx';
    import { useAuth } from '@/contexts/AuthContext.jsx';
    import { useToast } from '@/components/ui/use-toast.jsx';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';
    import { extractValuesFromImage } from '@/lib/geminiService.jsx';
    import { getPlanDetails } from '@/lib/planConfig.js'; // <-- IMPORTED

    const useNewAnalysisForm = (initialAnalysisType = 'hemogram') => {
      const { user } = useAuth();
      const navigate = useNavigate();
      const { toast } = useToast();
      const { t, language: currentLanguage } = useTranslation(); // Changed to language from context

      const [analysisType, setAnalysisType] = useState(initialAnalysisType);
      const [patientName, setPatientName] = useState('');
      const [species, setSpecies] = useState('');
      const [breed, setBreed] = useState('');
      const [age, setAge] = useState('');
      const [sex, setSex] = useState('Unknown');
      const [identifier, setIdentifier] = useState('');
      const [weight, setWeight] = useState('');
      const [anamnesis, setAnamnesis] = useState('');
      const [imageFile, setImageFile] = useState(null);
      const [imagePreview, setImagePreview] = useState(null);
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [ocrInProgress, setOcrInProgress] = useState(false);
      const [errors, setErrors] = useState({});

      useEffect(() => {
        setAnalysisType(initialAnalysisType);
      }, [initialAnalysisType]);

      const validateForm = useCallback(() => {
        const newErrors = {};
        if (!patientName.trim()) newErrors.patientName = t('validationPatientNameRequired');
        if (!species.trim()) newErrors.species = t('validationSpeciesRequired');
        if (!age.trim()) newErrors.age = t('validationAgeRequired');
        else if (isNaN(age) || Number(age) <= 0) newErrors.age = t('validationAgePositive');
        
        if (weight.trim() && (isNaN(weight) || Number(weight) <= 0)) {
            newErrors.weight = t('validationWeightPositive');
        }

        if (!anamnesis.trim()) newErrors.anamnesis = t('validationAnamnesisRequired');
        if (!imageFile) newErrors.imageFile = t('validationImageRequired');
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      }, [patientName, species, age, weight, anamnesis, imageFile, t]);

      const resetForm = useCallback(() => {
        setPatientName('');
        setSpecies('');
        setBreed('');
        setAge('');
        setSex('Unknown');
        setIdentifier('');
        setWeight('');
        setAnamnesis('');
        setImageFile(null);
        setImagePreview(null);
        setErrors({});
        setIsSubmitting(false);
        setOcrInProgress(false);
      }, []);
      
      const handleOcrExtraction = async (file, type, lang) => {
        if (!lang || lang.trim() === '') {
          console.error("OCR Extraction error: Language is missing in useNewAnalysisForm.");
          toast({
            title: t('ocrErrorTitle'),
            description: t('languageRequiredForOcrError'), 
            variant: 'destructive',
          });
          throw new Error(t('languageRequiredForOcrError'));
        }
        setOcrInProgress(true);
        try {
          const extractedData = await extractValuesFromImage(file, type, lang);
          if (!extractedData || typeof extractedData !== 'object' || Object.keys(extractedData).length === 0) {
            throw new Error(t('ocrNoDataReturned'));
          }
          return extractedData;
        } catch (error) {
          console.error("OCR Extraction error in useNewAnalysisForm:", error);
          toast({
            title: t('ocrErrorTitle'),
            description: `${t('ocrErrorMessage')}: ${error.message}`,
            variant: 'destructive',
          });
          throw error; 
        } finally {
          setOcrInProgress(false);
        }
      };

      const handleSubmit = async (event) => {
        if (event) event.preventDefault();

        // --- Plan Limit Check ---
    if (!user || !user.profile) {
      toast({ title: t('errorTitle'), description: t('userProfileNotFound', {defaultValue: "User profile not found. Please try logging in again."}), variant: 'destructive' });
      setIsSubmitting(false);
      return;
    }

    const currentPlanId = user.profile.subscription_plan_id;
    const currentAnalysisCount = user.profile.analysis_count || 0;
    const { nameKey: currentPlanNameKey, limit: currentPlanLimit } = getPlanDetails(currentPlanId);

    if (currentPlanLimit !== Infinity && currentAnalysisCount >= currentPlanLimit) {
      toast({
        title: t('analysisLimitReachedTitle', {defaultValue: "Analysis Limit Reached"}),
        description: t('analysisLimitReachedMessage', { planName: t(currentPlanNameKey, {defaultValue: "your current plan"}), defaultValue: `You have reached your analysis limit for ${t(currentPlanNameKey)}. Please upgrade.` }),
        variant: 'destructive',
        duration: 7000,
      });
      navigate('/subscription');
      setIsSubmitting(false); // Ensure isSubmitting is reset
      return;
    }
    // --- End Plan Limit Check ---
        
        if (!validateForm()) {
          toast({ title: t('validationErrorTitle'), description: t('validationErrorMessage'), variant: 'destructive' });
          const firstErrorKey = Object.keys(errors)[0];
          if (firstErrorKey) {
            const errorElement = document.getElementById(firstErrorKey) || document.getElementsByName(firstErrorKey)[0];
            if (errorElement) {
              errorElement.focus();
              errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
          return;
        }

        if (!user) {
          toast({ title: t('errorTitle'), description: t('userNotAuthenticated'), variant: 'destructive' });
          return;
        }
        
        if (!currentLanguage || currentLanguage.trim() === '') {
            toast({
                title: t('errorTitle'),
                description: t('languageSelectionError'),
                variant: 'destructive',
            });
            return;
        }

        setIsSubmitting(true);
        let extractedValues;
        try {
          extractedValues = await handleOcrExtraction(imageFile, analysisType, currentLanguage);
        } catch (ocrError) {
          setIsSubmitting(false);
          return; 
        }

        const fileName = `${user.id}_${Date.now()}_${imageFile.name}`;
        const filePath = `public/${fileName}`;

        try {
          const { error: fileUploadError } = await supabase.storage
            .from('analysis-images')
            .upload(filePath, imageFile);

          if (fileUploadError) throw fileUploadError;

          const { data: urlData } = supabase.storage.from('analysis-images').getPublicUrl(filePath);
          const publicURL = urlData.publicUrl;

          const analysisRecord = {
            user_id: user.id,
            patient_name: patientName,
            species: species,
            breed: breed,
            age: age,
            sex: sex,
            identifier: identifier,
            weight: weight,
            anamnesis: anamnesis,
            image_name: imageFile.name,
            image_path: filePath,
            image_url: publicURL,
            extracted_values: extractedValues,
            status: 'Pending Review',
            upload_date: new Date().toISOString(),
            analysis_type: analysisType,
          };

          const { data: dbData, error: dbError } = await supabase
            .from('analyses')
            .insert([analysisRecord])
            .select()
            .single();

          if (dbError) throw dbError;
 // --- Increment Analysis Count ---
      // IMPORTANT FOR USER: Verify 'id' is the correct column name for the user's ID in 'user_profiles' table.
      // It should match the column that is a foreign key to auth.users.id.
      const newAnalysisCount = (user.profile.analysis_count || 0) + 1;
      const { error: updateCountError } = await supabase
        .from('user_profiles')
        .update({ analysis_count: newAnalysisCount })
        .eq('id', user.id); // <<< CHECK THIS 'id' COLUMN NAME!

      if (updateCountError) {
        console.error("Error updating analysis count:", updateCountError);
        // This is a non-fatal error for this specific flow; the analysis was created.
        // The user's count might be stale until their profile is next refreshed.
        // You might want to add a specific toast here if it's critical.
      } else {
        // TODO: Update analysis_count in local AuthContext state for immediate UI feedback.
        // Example: if (user.refreshUserProfile) { user.refreshUserProfile(); }
        // Or, if your useAuth hook provides a setter for the profile:
        // user.setProfile({ ...user.profile, analysis_count: newAnalysisCount });
        console.log("Analysis count updated in DB. Local state update needed for AuthContext.");
      }
      // --- End Increment Analysis Count ---
          toast({ title: t('submissionSuccessTitle'), description: t('submissionSuccessMessage', {type: t(analysisType)}) });
          resetForm();
          navigate(`/review/${analysisType}/${dbData.id}`);
        } catch (error) {
          console.error('Submission error:', error);
          toast({
            title: t('submissionErrorTitle'),
            description: `${t('submissionErrorMessage')}: ${error.message}`,
            variant: 'destructive',
          });
        } finally {
          setIsSubmitting(false);
        }
      };
      
      const formState = {
        patientName, species, breed, age, sex, identifier, weight, anamnesis, imageFile, imagePreview, analysisType, errors, isSubmitting, ocrInProgress
      };

      const formSetters = {
        setPatientName, setSpecies, setBreed, setAge, setSex, setIdentifier, setWeight, setAnamnesis, setImageFile, setImagePreview, setAnalysisType, setErrors
      };
      
      return {
        ...formState,
        ...formSetters,
        handleSubmit,
        validateForm,
        resetForm,
      };
    };

    export default useNewAnalysisForm;
  