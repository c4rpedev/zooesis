
    import React from 'react';
    import { Card } from '@/components/ui/card.jsx';
    import ReportHeader from '@/components/report/ReportHeader.jsx';
    import PatientSummary from '@/components/report/PatientSummary.jsx';
    import ValuesTableDisplay from '@/components/report/ValuesTableDisplay.jsx';
    import InterpretationSections from '@/components/report/InterpretationSections.jsx';
    import ReportConclusion from '@/components/report/ReportConclusion.jsx';
    import ReportMetaFooter from '@/components/report/ReportMetaFooter.jsx';
    import { useTranslation } from '@/contexts/TranslationContext.jsx';

    const ReportDisplayContent = ({
      reportRef,
      analysisData,
      interpretedValues,
      analysisParameters,
      userFullName,
    }) => {
      const { t } = useTranslation();

      if (!analysisData || !interpretedValues) {
        return <p>{t('analysisDataUnavailable')}</p>;
      }
      
      const patientInfo = {
        name: analysisData.patient_name,
        species: analysisData.species,
        breed: analysisData.breed,
        age: analysisData.age,
        sex: analysisData.sex,
        identifier: analysisData.identifier,
        weight: analysisData.weight,
      };
      const anamnesis = analysisData.anamnesis;
      const valuesForTable = analysisData.extracted_values;

      return (
        <Card id="report-content-wrapper" className="shadow-2xl rounded-lg overflow-hidden bg-white dark:bg-slate-800 print:shadow-none">
          <div ref={reportRef} id="report-content" className="p-6 md:p-10 print-report-styles">
            <ReportHeader
              analysisType={analysisData.analysis_type}
              reportDate={analysisData.completed_at || analysisData.reviewed_at || analysisData.created_at}
            />
            <PatientSummary
              patientInfo={patientInfo}
              anamnesis={anamnesis}
            />
            
            {/* {valuesForTable && Object.keys(valuesForTable).length > 0 ? (
              <ValuesTableDisplay
                values={valuesForTable}
                analysisType={analysisData.analysis_type}
                parameters={analysisParameters}
              />
            ) : (
              <p className="my-4 text-muted-foreground">{t('noExtractedValues')}</p>
            )} */}

            <InterpretationSections
              interpretation={interpretedValues}
              analysisType={analysisData.analysis_type}
            />
            
            <ReportConclusion 
              conclusion={interpretedValues.conclusion || interpretedValues[`${analysisData.analysis_type}_conclusion`]} 
            />
            <ReportMetaFooter 
              analysisId={analysisData.id} 
              veterinarianName={userFullName || 'N/A'} 
            />
          </div>
        </Card>
      );
    };

    export default ReportDisplayContent;
  