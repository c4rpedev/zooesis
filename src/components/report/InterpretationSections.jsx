import React from 'react';
import { useTranslation } from '@/contexts/TranslationContext.jsx';
import ReportSection from '@/components/report/ReportSection.jsx';
import { FileText, ListChecks, Search, TestTube2, MessageSquare as MessageSquareQuestion, Microscope, CheckCircle } from 'lucide-react';

const renderContentSafely = (content, t, sectionTitle) => {
  if (typeof content === 'string' && content.trim() !== '') {
    return <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 print:text-black">{content}</p>;
  }
  if (Array.isArray(content) && content.length > 0) {
    return (
      <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700 dark:text-slate-300 print:text-black">
        {content.map((item, index) => (
          <li key={index}>{typeof item === 'string' ? item : JSON.stringify(item)}</li>
        ))}
      </ul>
    );
  }
  if (typeof content === 'object' && content !== null && Object.keys(content).length > 0) {
    console.warn(`Interpretation content for ${sectionTitle} is an object:`, content);
    return (
      <div className="text-sm text-slate-700 dark:text-slate-300 print:text-black">
        <p className="font-semibold mb-1">{t('complexObjectWarningTitle')}</p>
        <pre className="whitespace-pre-wrap bg-slate-100 dark:bg-slate-700 p-2 rounded text-xs overflow-auto">
          {JSON.stringify(content, null, 2)}
        </pre>
        <p className="mt-1 text-xs text-muted-foreground">{t('complexObjectWarningText')}</p>
      </div>
    );
  }
  return <p className="text-sm text-muted-foreground print:text-slate-500">{t('notAvailable')}</p>;
};

const InterpretationSections = ({ interpretation, analysisType }) => {
  const { t } = useTranslation();

  if (!interpretation || Object.keys(interpretation).length === 0) {
    return (
      <ReportSection title={t('interpretation')} icon={<FileText className="text-gray-500 dark:text-gray-400 print:text-gray-500" />}>
        <p className="text-muted-foreground">{t('noInterpretationAvailable')}</p>
      </ReportSection>
    );
  }

  let sectionsToDisplay = [];

  if (analysisType === 'hemogram') {
    sectionsToDisplay = [
      { 
        key: 'hematologic_findings', 
        title: t('hematologicFindings'), 
        icon: <Microscope className="text-red-500 dark:text-red-400 print:text-red-500" />, 
        content: interpretation.hematologic_findings || interpretation[`${analysisType}_findings`] || interpretation.findings
      },
      { 
        key: 'hematologic_commentary', 
        title: t('hematologicCommentary'), 
        icon: <FileText className="text-red-700 dark:text-red-600 print:text-red-700" />, 
        content: interpretation.hematologic_commentary || interpretation[`${analysisType}_commentary`] || interpretation.commentary
      },
      { 
        key: 'hematologic_differential_diagnoses', 
        title: t('differentialDiagnoses'), 
        icon: <Search className="text-purple-500 dark:text-purple-400 print:text-purple-500" />, 
        content: interpretation.hematologic_differential_diagnoses || interpretation[`${analysisType}_differential_diagnoses`] || interpretation.differential_diagnoses 
      },
      { 
        key: 'hematologic_additional_tests_recommended', 
        title: t('additionalTestsRecommended'), 
        icon: <TestTube2 className="text-orange-500 dark:text-orange-400 print:text-orange-500" />, 
        content: interpretation.hematologic_additional_tests_recommended || 
                 interpretation[`${analysisType}_additional_tests_recommended`] || 
                 interpretation[`${analysisType}_additional_tests_suggested`] || 
                 interpretation.additional_tests_recommended || 
                 interpretation.additional_tests_suggested
      },
      { 
        key: 'hematologic_key_questions_to_clinician', 
        title: t('keyQuestionsToClinician'), 
        icon: <MessageSquareQuestion className="text-teal-500 dark:text-teal-400 print:text-teal-500" />, 
        content: interpretation.hematologic_key_questions_to_clinician || interpretation[`${analysisType}_key_questions_to_clinician`] || interpretation.key_questions_to_clinician 
      }
    ];
  } else if (analysisType === 'biochemistry') {
    sectionsToDisplay = [
      { 
        key: 'biochemical_findings', 
        title: t('findings'), 
        icon: <ListChecks className="text-blue-500 dark:text-blue-400 print:text-blue-500" />, 
        content: interpretation.biochemical_findings || 
                 interpretation[`${analysisType}_findings`] || 
                 interpretation.findings 
      },
      { 
        key: 'biochemical_commentary', 
        title: t('commentary'), 
        icon: <FileText className="text-green-500 dark:text-green-400 print:text-green-500" />, 
        content: interpretation.biochemical_commentary || 
                 interpretation[`${analysisType}_commentary`] || 
                 interpretation.commentary 
      },
      { 
        key: 'biochemical_differential_diagnoses', 
        title: t('differentialDiagnoses'), 
        icon: <Search className="text-purple-500 dark:text-purple-400 print:text-purple-500" />, 
        content: interpretation.biochemical_differential_diagnoses || 
                 interpretation[`${analysisType}_differential_diagnoses`] || 
                 interpretation.differential_diagnoses 
      },
      { 
        key: 'biochemical_additional_tests_recommended', 
        title: t('additionalTestsRecommended'), 
        icon: <TestTube2 className="text-orange-500 dark:text-orange-400 print:text-orange-500" />, 
        content: interpretation.biochemical_additional_tests_recommended || 
                 interpretation[`${analysisType}_additional_tests_recommended`] || 
                 interpretation[`${analysisType}_additional_tests_suggested`] || 
                 interpretation.additional_tests_recommended || 
                 interpretation.additional_tests_suggested
      },
      { 
        key: 'biochemical_key_questions_to_clinician', 
        title: t('keyQuestionsToClinician'), 
        icon: <MessageSquareQuestion className="text-teal-500 dark:text-teal-400 print:text-teal-500" />, 
        content: interpretation.biochemical_key_questions_to_clinician || 
                 interpretation[`${analysisType}_key_questions_to_clinician`] || 
                 interpretation.key_questions_to_clinician 
      }
    ];
  } else if (analysisType === 'urinalysis') {
    sectionsToDisplay = [
      { 
        key: 'general_urinalysis_findings', 
        title: t('generalUrinalysisFindings'), 
        icon: <ListChecks className="text-blue-500 dark:text-blue-400 print:text-blue-500" />, 
        content: interpretation.general_urinalysis_findings || 
                 interpretation[`${analysisType}_findings`] || 
                 interpretation.findings 
      },
      { 
        key: 'urinalysis_commentary', 
        title: t('urinalysisCommentary'), 
        icon: <FileText className="text-green-500 dark:text-green-400 print:text-green-500" />, 
        content: interpretation.urinalysis_commentary || 
                 interpretation[`${analysisType}_commentary`] || 
                 interpretation.commentary 
      },
      { 
        key: 'urinalysis_differential_diagnoses', 
        title: t('differentialDiagnoses'), 
        icon: <Search className="text-purple-500 dark:text-purple-400 print:text-purple-500" />, 
        content: interpretation.urinalysis_differential_diagnoses || 
                 interpretation[`${analysisType}_differential_diagnoses`] || 
                 interpretation.differential_diagnoses 
      },
      { 
        key: 'urinalysis_additional_tests_recommended', 
        title: t('additionalTestsRecommended'), 
        icon: <TestTube2 className="text-orange-500 dark:text-orange-400 print:text-orange-500" />, 
        content: interpretation.urinalysis_additional_tests_recommended || 
                 interpretation[`${analysisType}_additional_tests_recommended`] || 
                 interpretation[`${analysisType}_additional_tests_suggested`] || 
                 interpretation.additional_tests_recommended || 
                 interpretation.additional_tests_suggested
      },
      { 
        key: 'urinalysis_key_questions_to_clinician', 
        title: t('keyQuestionsToClinician'), 
        icon: <MessageSquareQuestion className="text-teal-500 dark:text-teal-400 print:text-teal-500" />, 
        content: interpretation.urinalysis_key_questions_to_clinician || 
                 interpretation[`${analysisType}_key_questions_to_clinician`] || 
                 interpretation.key_questions_to_clinician 
      }
    ];
    
    // Add microscopic findings if available
    if (interpretation.microscopic_findings_summary) {
      sectionsToDisplay.push({
        key: 'microscopic_findings',
        title: t('microscopicFindingsSummary'),
        icon: <Microscope className="text-pink-500 dark:text-pink-400 print:text-pink-500" />,
        content: interpretation.microscopic_findings_summary
      });
    }
  } else {
    sectionsToDisplay = [
      { 
        key: 'findings', 
        title: t('findings'), 
        icon: <ListChecks className="text-blue-500 dark:text-blue-400 print:text-blue-500" />, 
        content: interpretation[`${analysisType}_findings`] || interpretation.findings 
      },
      { 
        key: 'commentary', 
        title: t('commentary'), 
        icon: <FileText className="text-green-500 dark:text-green-400 print:text-green-500" />, 
        content: interpretation[`${analysisType}_commentary`] || interpretation.commentary 
      },
      { 
        key: 'differential_diagnoses', 
        title: t('differentialDiagnoses'), 
        icon: <Search className="text-purple-500 dark:text-purple-400 print:text-purple-500" />, 
        content: interpretation[`${analysisType}_differential_diagnoses`] || interpretation.differential_diagnoses 
      },
      { 
        key: 'additional_tests_recommended', 
        title: t('additionalTestsRecommended'), 
        icon: <TestTube2 className="text-orange-500 dark:text-orange-400 print:text-orange-500" />, 
        content: interpretation[`${analysisType}_additional_tests_recommended`] || 
                 interpretation[`${analysisType}_additional_tests_suggested`] || 
                 interpretation.additional_tests_recommended || 
                 interpretation.additional_tests_suggested
      },
      { 
        key: 'key_questions_to_clinician', 
        title: t('keyQuestionsToClinician'), 
        icon: <MessageSquareQuestion className="text-teal-500 dark:text-teal-400 print:text-teal-500" />, 
        content: interpretation[`${analysisType}_key_questions_to_clinician`] || interpretation.key_questions_to_clinician 
      }
    ];
  }

  return (
    <div className="space-y-6 print:space-y-4">
      {sectionsToDisplay.map(section => {
        const sectionContent = section.content;
        if (sectionContent === undefined || (typeof sectionContent === 'string' && sectionContent.trim() === '') || (Array.isArray(sectionContent) && sectionContent.length === 0 && typeof sectionContent[0] !== 'object') || (typeof sectionContent === 'object' && !Array.isArray(sectionContent) && Object.keys(sectionContent).length === 0) ) {
          return null; 
        }
        return (
          <ReportSection key={section.key} title={section.title} icon={section.icon}>
            {renderContentSafely(sectionContent, t, section.title)}
          </ReportSection>
        );
      })}
    </div>
  );
};

export default InterpretationSections;