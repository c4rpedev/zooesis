
    import React, { useState, useEffect, useRef, useCallback } from 'react';
    import PatientFormSection from '@/components/new-analysis/PatientFormSection.jsx';
    import AnamnesisSection from '@/components/new-analysis/AnamnesisSection.jsx';
    import ImageUploadSection from '@/components/new-analysis/ImageUploadSection.jsx';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

    const NewAnalysisForm = ({ formLogic, itemVariants, uploadIcon, onSubmitValidated, analysisType }) => {
      const { t } = useTranslation();
      const [errors, setErrors] = useState({});
      const formRef = useRef(null);

      const validateForm = useCallback(() => {
        const newErrors = {};
        if (!formLogic.patientName.trim()) newErrors.patientName = t('patientNameRequired');
        if (!formLogic.species) newErrors.species = t('speciesRequired');
        if (!formLogic.sex) newErrors.sex = t('sexRequired');
        
        const ageVal = parseFloat(formLogic.age);
        if (!formLogic.age.toString().trim() || isNaN(ageVal) || ageVal <= 0) {
          newErrors.age = t('ageRequiredPositive');
        } else if (ageVal > 50) { // Example validation, adjust as needed
            newErrors.age = t('ageTooHigh'); // Assuming you have this translation key
        }

        const weightVal = parseFloat(formLogic.weight);
        if (!formLogic.weight.toString().trim() || isNaN(weightVal) || weightVal <= 0) {
          newErrors.weight = t('weightRequiredPositive');
        } else if (weightVal > 200) { // Example validation
            newErrors.weight = t('weightTooHigh'); // Assuming you have this translation key
        }

        if (!formLogic.imageFile) newErrors.imageFile = t('imageRequiredError', {type: t(analysisType) }); // Use analysisType in error
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      }, [formLogic, t, analysisType, setErrors]); // Added analysisType dependency
      
      useEffect(() => {
        if (onSubmitValidated) {
          onSubmitValidated.current = validateForm;
        }
      }, [onSubmitValidated, validateForm]);
      
      return (
        <form 
          ref={formRef}
          onSubmit={(e) => e.preventDefault()} 
          className="space-y-8"
          data-form-component="true" // Ensure this attribute is present
        >
          <PatientFormSection
            patientName={formLogic.patientName}
            setPatientName={formLogic.setPatientName}
            identifier={formLogic.identifier}
            setIdentifier={formLogic.setIdentifier}
            sex={formLogic.sex}
            setSex={formLogic.setSex}
            species={formLogic.species}
            setSpecies={formLogic.setSpecies}
            breed={formLogic.breed}
            setBreed={formLogic.setBreed}
            age={formLogic.age}
            setAge={formLogic.setAge}
            weight={formLogic.weight}
            setWeight={formLogic.setWeight}
            errors={errors}
            itemVariants={itemVariants}
          />
          <AnamnesisSection
            anamnesis={formLogic.anamnesis}
            setAnamnesis={formLogic.setAnamnesis}
            errors={errors}
            setErrors={setErrors} // Pass setErrors if AnamnesisSection needs to set errors
            itemVariants={itemVariants}
          />
          <ImageUploadSection
            hemogramImage={formLogic.imageFile} // Prop name kept for compatibility but it's generic now
            setHemogramImage={formLogic.setImageFile} 
            imagePreview={formLogic.imagePreview}
            setImagePreview={formLogic.setImagePreview} 
            errors={errors} // Pass down errors object
            setErrors={setErrors} // Pass setErrors for ImageUploadSection to use
            itemVariants={itemVariants}
            uploadIcon={uploadIcon}
            analysisType={analysisType} // Pass analysisType to ImageUploadSection
          />
        </form>
      );
    };
    export default NewAnalysisForm;
  