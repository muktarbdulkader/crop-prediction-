// =============================================================
//  AGRI-AI — Complete All-in-One Optimized Module
// =============================================================

import { GoogleGenAI, Type, Chat, Modality } from "@google/genai";
import type {
  PredictionParams,
  PredictionResult,
  Language,
  LeafAnalysisResult,
} from "../types";

// =============================================================
//  Helper Functions
// =============================================================

const decode = (base64: string) => {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
};

const decodeAudioData = async (
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number
): Promise<AudioBuffer> => {
  const pcm = new Int16Array(data.buffer);
  const frames = pcm.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frames, sampleRate);

  for (let ch = 0; ch < numChannels; ch++) {
    const channel = buffer.getChannelData(ch);
    for (let i = 0; i < frames; i++) {
      channel[i] = pcm[i * numChannels + ch] / 32768;
    }
  }
  return buffer;
};

const getLanguageName = (lang: Language) =>
  lang === "am"
    ? "Amharic"
    : lang === "om"
    ? "Oromo (Afaan Oromoo)"
    : "English";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// =============================================================
//  Crop Prediction
// =============================================================
export const predictCrop = async (
  ai: GoogleGenAI,
  params: PredictionParams,
  language: Language
): Promise<PredictionResult> => {
  const prompt = `
You are an agricultural expert. Suggest the single best crop for the following farm data:

Rainfall: ${params.rainfall} mm
Temperature: ${params.temperature}°C
Humidity: ${params.humidity}%
N: ${params.nitrogen}, P: ${params.phosphorus}, K: ${params.potassium}
pH: ${params.ph}
Soil: ${params.soilType}
Region: ${params.region}, Ethiopia

Return JSON with keys: crop, reason, confidence (0-100), optional expectedYield.

Respond only in ${getLanguageName(language)}.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });
    return JSON.parse(response.text) as PredictionResult;
  } catch (error) {
    console.error("Crop prediction error:", error);
    throw new Error("PREDICTION_FAILED");
  }
};

// =============================================================
//  AgriBot Chat
// =============================================================
let chat: Chat | null = null;
let lastLang: Language | null = null;

export const askAgriBot = async (
  ai: GoogleGenAI,
  message: string,
  language: Language
): Promise<string> => {
  try {
    if (language !== lastLang) {
      chat = null;
      lastLang = language;
    }

    if (!chat) {
      chat = ai.chats.create({
        model: "gemini-2.5-flash-lite",
        config: {
          systemInstruction: `You are AgriBot, a friendly Ethiopian agricultural assistant. Respond only in ${getLanguageName(
            language
          )}.`,
        },
      });
    }

    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("AgriBot error:", error);
    throw new Error("AGRIBOT_FAILED");
  }
};

// =============================================================
//  Leaf Analysis
// =============================================================
export const analyzeLeaf = async (
  ai: GoogleGenAI,
  imageBase64: string,
  mimeType: string,
  prompt: string,
  language: Language
): Promise<LeafAnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: {
        parts: [
          { inlineData: { data: imageBase64, mimeType } },
          {
            text: `
Analyze the leaf image. Return JSON: { "analysis": "", "confidence": 0 }.
Respond only in ${getLanguageName(language)}.
            `,
          },
        ],
      },
      config: { responseMimeType: "application/json" },
    });
    return JSON.parse(response.text) as LeafAnalysisResult;
  } catch (error) {
    console.error("Leaf analysis error:", error);
    throw new Error("ANALYSIS_FAILED");
  }
};

// =============================================================
//  Soil Analysis
// =============================================================
export const analyzeSoil = async (
  ai: GoogleGenAI,
  imageBase64: string,
  mimeType: string,
  prompt: string,
  language: Language
): Promise<string> => {
  const text = `
Analyze this soil image.

Markdown headings required:
- **Soil Type Classification**
- **Visual Analysis**
- **Estimated Moisture & Organic Matter**
- **Farming Recommendations**

Respond only in ${getLanguageName(language)}.
`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: {
        parts: [{ inlineData: { data: imageBase64, mimeType } }, { text }],
      },
    });
    return response.text;
  } catch (error) {
    console.error("Soil analysis error:", error);
    throw new Error("SOIL_ANALYSIS_FAILED");
  }
};

// =============================================================
//  Treatment Plan
// =============================================================
export const getTreatmentPlan = async (
  ai: GoogleGenAI,
  analysis: string,
  language: Language
): Promise<string> => {
  const prompt = `
Based on this leaf analysis: "${analysis}", create a treatment plan for the farmer.

Use Markdown headings:
- **Likely Disease**
- **Commercial Treatments**
- **Organic & Cultural Controls**
- **Preventative Measures**

Respond only in ${getLanguageName(language)}.
`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Treatment plan error:", error);
    throw new Error("TREATMENT_PLAN_FAILED");
  }
};

// =============================================================
//  Farming Guide
// =============================================================
export const generateFarmingGuide = async (
  ai: GoogleGenAI,
  crop: string,
  region: string,
  language: Language
): Promise<string> => {
  const prompt = `
Provide a practical farming guide for ${crop} in ${region}, Ethiopia.

Markdown sections:
- **Introduction**
- **Soil Preparation**
- **Planting**
- **Watering & Irrigation**
- **Fertilization**
- **Weed & Pest Control**
- **Harvesting & Storage**

Respond only in ${getLanguageName(language)}.
`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Farming guide error:", error);
    throw new Error("GUIDE_FAILED");
  }
};

// =============================================================
//  Text-to-Speech
// =============================================================
export const generateSpeech = async (
  ai: GoogleGenAI,
  text: string
): Promise<AudioBuffer> => {
  if (!text.trim()) throw new Error("SPEECH_FAILED");
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } },
        },
      },
    });

    const base64 =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64) throw new Error("No audio data");

    const ctx = new AudioContext({ sampleRate: 24000 });
    return decodeAudioData(decode(base64), ctx, 24000, 1);
  } catch (error) {
    console.error("Speech error:", error);
    throw new Error("SPEECH_FAILED");
  }
};

// =============================================================
//  Location Detection
// =============================================================
export const getLocationData = async (
  ai: GoogleGenAI,
  lat: number,
  lon: number
): Promise<{ region: string; temperature: number }> => {
  const prompt = `
Identify Ethiopia region + approximate temperature.

Lat: ${lat}, Lon: ${lon}

Return JSON: { "region": "", "temperature": 0 }
Allowed regions: Oromia, Amhara, SNNPR, Tigray, Somali, Afar
`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Location detection error:", error);
    throw new Error("LOCATION_FETCH_FAILED");
  }
};

// =============================================================
//  Disease Name Extraction
// =============================================================
export const extractDiseaseName = async (
  ai: GoogleGenAI,
  analysis: string,
  language: Language
): Promise<string> => {
  const prompt = `
From this analysis: "${analysis}", extract only the disease/pest/nutrient deficiency name.
Respond only in ${getLanguageName(language)}.
`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text.trim().replace(/\*/g, "");
  } catch (error) {
    console.error("Disease extraction error:", error);
    throw new Error("DISEASE_EXTRACTION_FAILED");
  }
};

// =============================================================
//  Generate Disease Image
// =============================================================
export const generateDiseaseImage = async (
  ai: GoogleGenAI,
  diseaseName: string,
  plantName: string
): Promise<string> => {
  const prompt = `Photorealistic close-up of a ${plantName} leaf showing symptoms of ${diseaseName}.`;

  try {
    const result = await ai.models.generateImages({
      model: "imagen-4.0-generate-001",
      prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: "image/jpeg",
        aspectRatio: "1:1",
      },
    });

    const img = result.generatedImages?.[0]?.image?.imageBytes;
    if (!img) throw new Error("No image data");

    return `data:image/jpeg;base64,${img}`;
  } catch (error) {
    console.error("Disease image error:", error);
    throw new Error("IMAGE_GENERATION_FAILED");
  }
};
