
    import React, { useMemo } from 'react';
    import { getParametersForAnalysisType } from '@/lib/analysisUtils.jsx';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

    const useAnalysisParameters = (analysisType, species) => {
      const { currentLanguage } = useTranslation();

      return useMemo(() => {
        if (analysisType) {
          return getParametersForAnalysisType(analysisType, species, currentLanguage);
        }
        return [];
      }, [analysisType, species, currentLanguage]);
    };

    export default useAnalysisParameters;
  