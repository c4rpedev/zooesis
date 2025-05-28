
    import React from 'react';
    import ReportSection from '@/components/report/ReportSection.jsx';

    const PatientSummary = ({ patientInfo, anamnesis }) => {
      return (
        <ReportSection title="Patient Information & Anamnesis">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 mb-4">
            <p><strong>Name:</strong> {patientInfo.name}</p>
            <p><strong>Identifier:</strong> {patientInfo.identifier || 'N/A'}</p>
            <p><strong>Species:</strong> {patientInfo.species}</p>
            <p><strong>Breed:</strong> {patientInfo.breed || 'N/A'}</p>
            <p><strong>Age:</strong> {patientInfo.age} years</p>
            <p><strong>Weight:</strong> {patientInfo.weight} kg</p>
            <p><strong>Sex:</strong> {patientInfo.sex}</p>
          </div>
          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100 mt-4 mb-1">Anamnesis:</h3>
          <p className="whitespace-pre-wrap">{anamnesis}</p>
        </ReportSection>
      );
    };

    export default PatientSummary;
  