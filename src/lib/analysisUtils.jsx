
    import React from 'react';

    // Define parameters for each analysis type
    // These would ideally come from a configuration or database in a real app for easier management
    const ANALYSIS_PARAMETERS = {
      hemogram: [
        { id: "Erythrocytes", label: "Erythrocytes", unit: "x10⁶/μL", refMin: "5.5", refMax: "8.5" },
        { id: "Hematocrit", label: "Hematocrit", unit: "%", refMin: "37", refMax: "55" },
        { id: "Hemoglobin", label: "Hemoglobin", unit: "g/dL", refMin: "12", refMax: "18" },
        { id: "MCV", label: "MCV", unit: "fL", refMin: "60", refMax: "77" },
        { id: "MCHC", label: "MCHC", unit: "g/dL", refMin: "32", refMax: "36" },
        { id: "MCH", label: "MCH", unit: "pg", refMin: "19.5", refMax: "24.5" },
        { id: "RDW", label: "RDW", unit: "%", refMin: "11.5", refMax: "14.5" },
        { id: "MPV", label: "MPV", unit: "fL", refMin: "7.4", refMax: "10.4" },
        { id: "Total Leukocytes", label: "Total Leukocytes", unit: "x10³/μL", refMin: "6.0", refMax: "17.0" },
        { id: "Neutrophils", label: "Neutrophils", unit: "x10³/μL", refMin: "3.0", refMax: "11.5" }, // Can be further broken down: Segmented, Bands
        { id: "Lymphocytes", label: "Lymphocytes", unit: "x10³/μL", refMin: "1.0", refMax: "4.8" },
        { id: "Monocytes", label: "Monocytes", unit: "x10³/μL", refMin: "0.15", refMax: "1.35" },
        { id: "Eosinophils", label: "Eosinophils", unit: "x10³/μL", refMin: "0.1", refMax: "1.25" },
        { id: "Basophils", label: "Basophils", unit: "x10³/μL", refMin: "0", refMax: "0.1" },
        { id: "Platelets", label: "Platelets", unit: "x10³/μL", refMin: "200", refMax: "500" },
        { id: "Reticulocytes", label: "Reticulocytes", unit: "%", refMin: "0.5", refMax: "1.5" }, // Or absolute count
        // Add other relevant hemogram parameters
      ],
      biochemistry: [
        { id: "Glucose", label: "Glucose", unit: "mg/dL", refMin: "70", refMax: "110" },
        { id: "Urea", label: "Urea (BUN)", unit: "mg/dL", refMin: "7", refMax: "20" },
        { id: "Creatinine", label: "Creatinine", unit: "mg/dL", refMin: "0.5", refMax: "1.2" },
        { id: "ALT", label: "Alanine Aminotransferase (ALT)", unit: "U/L", refMin: "10", refMax: "40" },
        { id: "AST", label: "Aspartate Aminotransferase (AST)", unit: "U/L", refMin: "10", refMax: "35" },
        { id: "ALP", label: "Alkaline Phosphatase (ALP)", unit: "U/L", refMin: "30", refMax: "120" },
        { id: "GGT", label: "Gamma-Glutamyl Transferase (GGT)", unit: "U/L", refMin: "5", refMax: "30" },
        { id: "TotalProtein", label: "Total Protein", unit: "g/dL", refMin: "6.0", refMax: "8.3" },
        { id: "Albumin", label: "Albumin", unit: "g/dL", refMin: "3.5", refMax: "5.0" },
        { id: "Globulin", label: "Globulin", unit: "g/dL", refMin: "2.0", refMax: "3.5" },
        { id: "AGRatio", label: "A/G Ratio", unit: "", refMin: "1.0", refMax: "2.0" },
        { id: "TotalBilirubin", label: "Total Bilirubin", unit: "mg/dL", refMin: "0.2", refMax: "1.0" },
        { id: "Cholesterol", label: "Cholesterol", unit: "mg/dL", refMin: "140", refMax: "200" },
        { id: "Triglycerides", label: "Triglycerides", unit: "mg/dL", refMin: "50", refMax: "150" },
        { id: "Calcium", label: "Calcium", unit: "mg/dL", refMin: "8.5", refMax: "10.2" },
        { id: "Phosphorus", label: "Phosphorus", unit: "mg/dL", refMin: "2.5", refMax: "4.5" },
        { id: "Sodium", label: "Sodium (Na)", unit: "mEq/L", refMin: "136", refMax: "145" },
        { id: "Potassium", label: "Potassium (K)", unit: "mEq/L", refMin: "3.5", refMax: "5.0" },
        { id: "Chloride", label: "Chloride (Cl)", unit: "mEq/L", refMin: "98", refMax: "106" },
        { id: "Amylase", label: "Amylase", unit: "U/L", refMin: "25", refMax: "125" },
        { id: "Lipase", label: "Lipase", unit: "U/L", refMin: "10", refMax: "60" },
        // Add other relevant biochemistry parameters
      ],
      urinalysis: [
        // Physical/Macroscopic
        { id: "UrineColor", label: "Color", unit: "", reference_range: "Yellow" },
        { id: "UrineClarity", label: "Clarity/Turbidity", unit: "", reference_range: "Clear" },
        // Chemical/Dipstick
        { id: "UrineSG", label: "Specific Gravity", unit: "", refMin: "1.015", refMax: "1.045" }, // Dog, cat can be higher
        { id: "UrinePH", label: "pH", unit: "", refMin: "5.5", refMax: "7.0" },
        { id: "UrineProtein", label: "Protein", unit: "mg/dL", reference_range: "Negative/Trace" },
        { id: "UrineGlucose", label: "Glucose", unit: "mg/dL", reference_range: "Negative" },
        { id: "UrineKetones", label: "Ketones", unit: "mg/dL", reference_range: "Negative" },
        { id: "UrineBilirubin", label: "Bilirubin", unit: "", reference_range: "Negative (Trace in dogs)" },
        { id: "UrineBlood", label: "Blood/Hemoglobin", unit: "", reference_range: "Negative" },
        { id: "UrineLeukocytes", label: "Leukocyte Esterase", unit: "", reference_range: "Negative" }, // Often unreliable in cats
        { id: "UrineNitrites", label: "Nitrites", unit: "", reference_range: "Negative" },
        { id: "UrineUrobilinogen", label: "Urobilinogen", unit: "EU/dL", reference_range: "Normal/0.2-1.0" },
        // Microscopic Sediment (per HPF - High Power Field, or LPF - Low Power Field)
        { id: "UrineRBC", label: "Red Blood Cells", unit: "/HPF", refMin: "0", refMax: "5" },
        { id: "UrineWBC", label: "White Blood Cells", unit: "/HPF", refMin: "0", refMax: "5" },
        { id: "UrineEpithelialCells", label: "Epithelial Cells (Squamous, Transitional, Renal)", unit: "/HPF", reference_range: "Few" },
        { id: "UrineCasts", label: "Casts (Hyaline, Granular, Cellular, Waxy)", unit: "/LPF", reference_range: "0-Few Hyaline" },
        { id: "UrineCrystals", label: "Crystals (Struvite, Calcium Oxalate, etc.)", unit: "/HPF", reference_range: "None/Few depending on type and pH" },
        { id: "UrineBacteria", label: "Bacteria", unit: "/HPF", reference_range: "None/Few" },
        { id: "UrineYeast", label: "Yeast", unit: "/HPF", reference_range: "None" },
        { id: "UrineSperm", label: "Spermatozoa", unit: "/HPF", reference_range: "Variable" },
        { id: "UrineMucus", label: "Mucus Threads", unit: "/LPF", reference_range: "None/Few" },
        // Add other relevant urinalysis parameters
      ],
    };

    export const getParametersForAnalysisType = (analysisType) => {
      return ANALYSIS_PARAMETERS[analysisType] || [];
    };
  