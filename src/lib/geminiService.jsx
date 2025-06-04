
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { supabase } from '@/lib/supabaseClient.jsx';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE" || API_KEY.trim() === "") {
  console.error("Gemini API Key is not configured. Please set VITE_GEMINI_API_KEY in your .env file.");
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

const visionModelConfigBase = {
  generationConfig: {
    temperature: 0.2,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  },
  safetySettings: [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  ],
};

const textModelConfigBase = {
    generationConfig: {
        temperature: 0.2,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
    },
    safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ],
};


async function fileToGenerativePart(file) {
  if (!file || !file.type || !file.arrayBuffer) {
    throw new Error("Invalid file object provided to fileToGenerativePart.");
  }
  try {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  } catch (error) {
    console.error("Error converting file to generative part:", error);
    throw new Error("Failed to process image file for OCR.");
  }
}

async function getPromptDetails(promptName, analysisType, language) {
  if (!promptName || !analysisType || !language) {
    throw new Error(`Prompt name, analysis type, and language are required to fetch prompt details. Received: promptName=${promptName}, analysisType=${analysisType}, language=${language}`);
  }
  const { data, error } = await supabase
    .from('analysis_prompts')
    .select('prompt_text, model_name')
    .eq('prompt_name', promptName)
    .eq('analysis_type', analysisType)
    .eq('language', language)
    .single();

  if (error) {
    console.error('Error fetching prompt details:', error);
    throw new Error(`Could not fetch prompt details for '${promptName}' for ${analysisType} in ${language}. Supabase error: ${error.message}`);
  }
  if (!data || !data.prompt_text || data.prompt_text.trim() === "" || !data.model_name || data.model_name.trim() === "") {
    throw new Error(`Prompt details (text or model) for '${promptName}' for ${analysisType} in ${language} not found or is empty.`);
  }
  return { promptText: data.prompt_text, modelName: data.model_name };
}

function extractJsonFromString(str) {
  if (typeof str !== 'string') {
    return null;
  }
  const match = str.match(/```json\s*([\s\S]*?)\s*```/);
  if (match && match[1]) {
    return match[1].trim();
  }
  
  const firstBrace = str.indexOf('{');
  const lastBrace = str.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    try {
      JSON.parse(str.substring(firstBrace, lastBrace + 1));
      return str.substring(firstBrace, lastBrace + 1);
    } catch (e) {
      // Not a valid JSON, so proceed to next check or return null
    }
  }
  return null; 
}

export async function extractValuesFromImage(imageFile, analysisType, language) {
  if (!genAI) throw new Error("Gemini AI SDK not initialized. Check API Key.");
  if (!imageFile) throw new Error("Image file is required for OCR extraction.");
  if (!analysisType) throw new Error("Analysis type is required for OCR extraction.");
  if (!language) throw new Error("Language is required for OCR extraction.");

  try {
    const imagePart = await fileToGenerativePart(imageFile);
    const { promptText, modelName } = await getPromptDetails('ocr_extraction', analysisType, language);
    
    const model = genAI.getGenerativeModel({ model: modelName, ...visionModelConfigBase });
    
    const contents = [
      { parts: [imagePart, { text: promptText }] }
    ];

    const result = await model.generateContent({ contents });
    
    if (!result || !result.response || !result.response.candidates || result.response.candidates.length === 0 || !result.response.candidates[0].content || !result.response.candidates[0].content.parts || result.response.candidates[0].content.parts.length === 0) {
      console.error("Invalid response structure from Gemini API:", result);
      throw new Error("Received an invalid or empty response structure from Gemini API.");
    }

    if (result.response.promptFeedback && result.response.promptFeedback.blockReason) {
      throw new Error(`Content generation blocked by Gemini. Reason: ${result.response.promptFeedback.blockReason}. Details: ${result.response.promptFeedback.blockReasonMessage || 'No additional details.'}`);
    }

    const rawTextResponse = result.response.candidates[0].content.parts[0].text;
    
    if (typeof rawTextResponse !== 'string' || rawTextResponse.trim() === "") {
        console.error("Empty or non-string text response from Gemini for OCR. Raw response:", rawTextResponse);
        throw new Error("No valid text response received from Gemini for OCR. The response was empty or not a string.");
    }

    const jsonString = extractJsonFromString(rawTextResponse);

    if (!jsonString) {
      console.error("Could not extract JSON from Gemini OCR response. Raw response:", rawTextResponse);
      throw new Error(`Failed to extract JSON from Gemini OCR response. Raw text: "${rawTextResponse}"`);
    }

    let jsonData;
    try {
        jsonData = JSON.parse(jsonString);
    } catch (parseError) {
        console.error("Error parsing extracted JSON from Gemini OCR response:", parseError, "Extracted JSON string:", jsonString, "Raw response:", rawTextResponse);
        throw new Error(`Failed to parse OCR data from Gemini. The extracted string was not valid JSON. Extracted text: "${jsonString}"`);
    }
    
    if (typeof jsonData !== 'object' || jsonData === null) {
      console.error("Parsed OCR data is not a valid object. Parsed data:", jsonData);
      throw new Error("Parsed OCR data is not a valid object.");
    }

    return jsonData;

  } catch (error) {
    console.error('Error in extractValuesFromImage:', error);
    throw error; 
  }
}

export async function interpretValues(valuesData, analysisType, language, patientContext) {
  if (!genAI) throw new Error("Gemini AI SDK not initialized. Check API Key.");
  if (!valuesData || typeof valuesData !== 'object' || Object.keys(valuesData).length === 0) {
    throw new Error("Values data is required for interpretation and cannot be empty.");
  }
  if (!analysisType) throw new Error("Analysis type is required for interpretation.");
  if (!language) throw new Error("Language is required for interpretation.");

  try {
    const { promptText, modelName } = await getPromptDetails('clinical_interpretation', analysisType, language);
    const valuesString = JSON.stringify(valuesData, null, 2);

    let patientContextString = "";
    if (patientContext && Object.keys(patientContext).length > 0) {
      patientContextString = "Patient Context:\n";
      patientContextString += `Species: ${patientContext.species || "N/A"}\n`;
      patientContextString += `Breed: ${patientContext.breed || "N/A"}\n`;
      patientContextString += `Name: ${patientContext.name || "N/A"}\n`;
      patientContextString += `Age: ${patientContext.age || "N/A"}\n`;
      patientContextString += `Sex: ${patientContext.sex || "N/A"}\n`;
      patientContextString += `Weight: ${patientContext.weight || "N/A"}\n`;
      patientContextString += `Anamnesis: ${patientContext.anamnesis || "N/A"}\n`;
    }

    const fullPrompt = patientContextString
      ? `${patientContextString}\n${promptText}\n\nLab Values:\n${valuesString}`
      : `${promptText}\n\nLab Values:\n${valuesString}`;
console.log('fullPrompt',fullPrompt)
    const model = genAI.getGenerativeModel({ model: modelName, ...textModelConfigBase });
    const result = await model.generateContent(fullPrompt);

    if (!result || !result.response || !result.response.candidates || result.response.candidates.length === 0 || !result.response.candidates[0].content || !result.response.candidates[0].content.parts || result.response.candidates[0].content.parts.length === 0) {
      console.error("Invalid response structure from Gemini API for interpretation:", result);
      throw new Error("Received an invalid or empty response structure from Gemini API for interpretation.");
    }

    if (result.response.promptFeedback && result.response.promptFeedback.blockReason) {
      throw new Error(`Content generation blocked by Gemini. Reason: ${result.response.promptFeedback.blockReason}. Details: ${result.response.promptFeedback.blockReasonMessage || 'No additional details.'}`);
    }
    
    const rawTextResponse = result.response.candidates[0].content.parts[0].text;

    if (typeof rawTextResponse !== 'string' || rawTextResponse.trim() === "") {
        console.error("Empty or non-string text response from Gemini for interpretation. Raw response:", rawTextResponse);
        throw new Error("No valid text response received from Gemini for interpretation. The response was empty or not a string.");
    }
    
    const jsonString = extractJsonFromString(rawTextResponse);

    if (!jsonString) {
      console.error("Could not extract JSON from Gemini interpretation response. Raw response:", rawTextResponse);
      throw new Error(`Failed to extract JSON from Gemini interpretation response. Raw text: "${rawTextResponse}"`);
    }

    let jsonData;
    try {
        jsonData = JSON.parse(jsonString);
    } catch (parseError) {
        console.error("Error parsing extracted JSON from Gemini interpretation response:", parseError, "Extracted JSON string:", jsonString, "Raw response:", rawTextResponse);
        throw new Error(`Failed to parse interpretation data from Gemini. The extracted string was not valid JSON. Extracted text: "${jsonString}"`);
    }

    if (typeof jsonData !== 'object' || jsonData === null) {
      console.error("Parsed interpretation data is not a valid object. Parsed data:", jsonData);
      throw new Error("Parsed interpretation data is not a valid object.");
    }
    
    return jsonData;

  } catch (error) {
    console.error('Error in interpretValues:', error);
    throw error;
  }
}

export async function extractHemogramValuesFromImage(imageFile, language = 'en') {
  return extractValuesFromImage(imageFile, 'hemogram', language);
}

export async function interpretHemogramValues(valuesData, language = 'en', patientContext) {
  return interpretValues(valuesData, 'hemogram', language, patientContext);
}
