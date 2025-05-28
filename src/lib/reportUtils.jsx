
    import React from "react";
    import { getParametersForAnalysisType } from '@/lib/analysisUtils.jsx';


    export const generateInterpretation = (values, analysisType) => {
      let findings = [];
      let commentary = [];
      let diffDiags = new Set();
      let addTests = new Set();

      const parameters = getParametersForAnalysisType(analysisType);

      const findParamDefinition = (id) => parameters.find(p => p.id.toLowerCase() === id.toLowerCase());
      
      const getParamValue = (id) => {
        if (!values || typeof values !== 'object') return null;
        const key = Object.keys(values).find(k => k.toLowerCase() === id.toLowerCase());
        return key ? values[key] : null;
      };


      if (analysisType === 'hemogram') {
        const rbcVal = getParamValue('Erythrocytes');
        const hgbVal = getParamValue('Hemoglobin');
        const hctVal = getParamValue('Hematocrit');
        const wbcVal = getParamValue('Total Leukocytes');
        const pltVal = getParamValue('Platelets');

        const rbcDef = findParamDefinition('Erythrocytes');
        const hgbDef = findParamDefinition('Hemoglobin');
        const hctDef = findParamDefinition('Hematocrit');
        const wbcDef = findParamDefinition('Total Leukocytes');
        const pltDef = findParamDefinition('Platelets');

        if (rbcVal && hgbVal && hctVal && rbcDef && hgbDef && hctDef) {
          const isAnemic = parseFloat(rbcVal) < parseFloat(rbcDef.refMin) ||
                           parseFloat(hgbVal) < parseFloat(hgbDef.refMin) ||
                           parseFloat(hctVal) < parseFloat(hctDef.refMin);
          const isPolycythemic = parseFloat(rbcVal) > parseFloat(rbcDef.refMax) ||
                                 parseFloat(hgbVal) > parseFloat(hgbDef.refMax) ||
                                 parseFloat(hctVal) > parseFloat(hctDef.refMax);

          if (isAnemic) {
            findings.push("Erythrogram suggests anemia.");
            commentary.push("The decreased red blood cell count, hemoglobin, and/or hematocrit indicate anemia. Further classification (e.g., regenerative vs. non-regenerative) is crucial and typically requires reticulocyte count and RBC indices (MCV, MCH, MCHC).");
            diffDiags.add("Hemorrhage (acute or chronic)");
            diffDiags.add("Hemolysis (immune-mediated, toxic, infectious)");
            diffDiags.add("Decreased production (chronic disease, bone marrow disorders, nutritional deficiencies)");
            addTests.add("Reticulocyte count");
            addTests.add("Blood smear evaluation for RBC morphology");
            addTests.add("Biochemistry panel (iron, kidney/liver function)");
          } else if (isPolycythemic) {
            findings.push("Erythrogram suggests polycythemia.");
            commentary.push("The increased red blood cell count, hemoglobin, and/or hematocrit indicate polycythemia. This can be relative (e.g., dehydration) or absolute (primary or secondary).");
            diffDiags.add("Dehydration (relative polycythemia)");
            diffDiags.add("Polycythemia vera (primary)");
            diffDiags.add("Secondary polycythemia (e.g., chronic hypoxia, EPO-producing tumors)");
            addTests.add("Hydration status assessment");
            addTests.add("Arterial blood gas analysis");
            addTests.add("Erythropoietin (EPO) levels");
          } else {
            findings.push("Erythrogram parameters (RBC, HGB, HCT) are within reference ranges.");
          }
        }

        if (wbcVal && wbcDef) {
          const isLeukocytosis = parseFloat(wbcVal) > parseFloat(wbcDef.refMax);
          const isLeukopenia = parseFloat(wbcVal) < parseFloat(wbcDef.refMin);

          if (isLeukocytosis) {
            findings.push("Leukocytosis noted.");
            commentary.push("An elevated white blood cell count (leukocytosis) is present. The differential count (neutrophils, lymphocytes, monocytes, eosinophils, basophils) is essential to characterize the response (e.g., inflammatory, stress, allergic, neoplastic).");
            diffDiags.add("Inflammation/Infection (bacterial, viral, fungal, parasitic)");
            diffDiags.add("Stress/Corticosteroid response");
            diffDiags.add("Neoplasia (e.g., leukemia)");
            addTests.add("Full differential WBC count");
            addTests.add("Blood smear evaluation for WBC morphology");
            addTests.add("Inflammatory markers (e.g., C-reactive protein)");
          } else if (isLeukopenia) {
            findings.push("Leukopenia noted.");
            commentary.push("A decreased white blood cell count (leukopenia) is present. This can be due to decreased production, increased destruction, or consumption. The specific cell lines affected are important for diagnosis.");
            diffDiags.add("Viral infections (e.g., Parvovirus, FeLV, FIV)");
            diffDiags.add("Severe bacterial infection (sepsis, endotoxemia)");
            diffDiags.add("Bone marrow suppression (drugs, toxins, neoplasia)");
            addTests.add("Full differential WBC count");
            addTests.add("Bone marrow aspirate/biopsy if persistent or severe");
          } else {
             findings.push("Total white blood cell count is within reference range.");
          }
        }
        
        if (pltVal && pltDef) {
          const isThrombocytosis = parseFloat(pltVal) > parseFloat(pltDef.refMax);
          const isThrombocytopenia = parseFloat(pltVal) < parseFloat(pltDef.refMin);

          if (isThrombocytosis) {
            findings.push("Thrombocytosis noted.");
            commentary.push("An elevated platelet count (thrombocytosis) can be reactive (e.g., inflammation, iron deficiency, post-splenectomy) or, rarely, primary (essential thrombocythemia).");
            diffDiags.add("Reactive thrombocytosis (inflammation, iron deficiency)");
            diffDiags.add("Essential thrombocythemia (rare)");
            addTests.add("Iron panel if anemia also present");
            addTests.add("Inflammatory markers");
          } else if (isThrombocytopenia) {
            findings.push("Thrombocytopenia noted.");
            commentary.push("A decreased platelet count (thrombocytopenia) increases bleeding risk. Causes include decreased production, increased destruction (e.g., IMTP), consumption (e.g., DIC), or sequestration.");
            diffDiags.add("Immune-mediated thrombocytopenia (IMTP)");
            diffDiags.add("Infectious causes (e.g., Ehrlichia, Anaplasma)");
            diffDiags.add("Disseminated intravascular coagulation (DIC)");
            diffDiags.add("Bone marrow disorders");
            addTests.add("Blood smear evaluation for platelet clumps and morphology");
            addTests.add("Tick-borne disease panel");
            addTests.add("Coagulation profile if bleeding observed");
          } else {
            findings.push("Platelet count is within reference range.");
          }
        }
      } else if (analysisType === 'biochemistry') {
        // Example for Glucose
        const glucoseVal = getParamValue('Glucose');
        const glucoseDef = findParamDefinition('Glucose');
        if (glucoseVal && glucoseDef) {
          if (parseFloat(glucoseVal) > parseFloat(glucoseDef.refMax)) {
            findings.push("Hyperglycemia noted.");
            commentary.push("Elevated glucose. Consider stress, diabetes mellitus, post-prandial, or iatrogenic causes.");
            diffDiags.add("Diabetes Mellitus");
            diffDiags.add("Stress hyperglycemia (especially in cats)");
            addTests.add("Urinalysis for glucosuria/ketonuria");
            addTests.add("Fructosamine levels");
          } else if (parseFloat(glucoseVal) < parseFloat(glucoseDef.refMin)) {
            findings.push("Hypoglycemia noted.");
            commentary.push("Low glucose. Consider insulinoma, sepsis, liver disease, artifact, or juvenile hypoglycemia.");
            diffDiags.add("Insulinoma");
            diffDiags.add("Sepsis");
            addTests.add("Insulin/glucose ratio");
            addTests.add("Liver function tests");
          }
        }
        // Add more biochemistry parameter interpretations here
        findings.push("Biochemistry interpretation placeholder.");
        commentary.push("Detailed biochemistry interpretation logic needs to be implemented based on specific parameters.");

      } else if (analysisType === 'urinalysis') {
        // Example for Urine pH
        const phVal = getParamValue('UrinePH');
        const phDef = findParamDefinition('UrinePH');
        if (phVal && phDef) {
          if (parseFloat(phVal) > parseFloat(phDef.refMax)) {
            findings.push("Alkaline urine noted.");
            commentary.push("Urine pH is alkaline. May be associated with certain diets, infections (urease-producing bacteria), or metabolic alkalosis.");
          } else if (parseFloat(phVal) < parseFloat(phDef.refMin)) {
            findings.push("Acidic urine noted.");
            commentary.push("Urine pH is acidic. May be associated with high protein diets, metabolic acidosis, or certain medications.");
          }
        }
        // Add more urinalysis parameter interpretations here
        findings.push("Urinalysis interpretation placeholder.");
        commentary.push("Detailed urinalysis interpretation logic needs to be implemented based on specific parameters.");
      }


      if (findings.length === 0) findings.push("All reviewed parameters are within their respective reference ranges.");
      if (commentary.length === 0) commentary.push("The analysis appears largely unremarkable based on the reviewed parameters. Clinical correlation is always advised.");
      if (diffDiags.size === 0) diffDiags.add("No specific differential diagnoses strongly indicated by these parameters alone.");
      if (addTests.size === 0) addTests.add("Further testing may be guided by clinical signs and full results not reviewed here.");
      
      // This structure should match what InterpretationSections.jsx expects
      // For example, if Gemini returns { "findings": "...", "commentary": "..." }
      // then this local generation should also return a similar structure.
      // The current structure is more detailed than what Gemini might return directly.
      // Adjust this to be more aligned with the expected Gemini output structure for consistency.
      
      // Simplified structure for now, assuming Gemini returns these top-level keys
      const interpretationResult = {
        [`${analysisType}_findings`]: findings.join(' '),
        [`${analysisType}_commentary`]: commentary.join(' '),
        differential_diagnoses: Array.from(diffDiags),
        additional_tests_suggested: Array.from(addTests),
        key_questions_to_clinician: ["Are there any clinical signs consistent with these findings?", "What is the patient's vaccination and deworming history?"], // Example
        conclusion: `Based on the provided values for ${analysisType}, ${findings.join(' ')}. ${commentary.join(' ')} Clinical correlation is essential.`
      };

      if (analysisType === 'biochemistry') {
        interpretationResult.organ_system_assessment = {
            liver: "Liver assessment placeholder based on ALT, AST, ALP, Bilirubin, etc.",
            kidney: "Kidney assessment placeholder based on Urea, Creatinine, etc."
        };
      }
      if (analysisType === 'urinalysis') {
        interpretationResult.microscopic_findings_summary = "Microscopic findings summary placeholder.";
      }


      return interpretationResult;
    };
  