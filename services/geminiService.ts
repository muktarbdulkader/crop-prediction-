import { GoogleGenAI, Type, Chat, Modality } from "@google/genai";
import type {
  PredictionParams,
  PredictionResult,
  Language,
  LeafAnalysisResult,
} from "../types";

// Helper functions for audio decoding
const decode = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const decodeAudioData = async (
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number
): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};

const getLanguageName = (lang: Language): string => {
  switch (lang) {
    case "am":
      return "Amharic";
    case "om":
      return "Oromo (Afaan Oromoo)";
    default:
      return "English";
  }
};

export const predictCrop = async (
  ai: GoogleGenAI,
  params: PredictionParams,
  language: Language
): Promise<PredictionResult> => {
  const customPromptSection = params.customPrompt
    ? `\nUser's specific requirements (prioritize this): "${params.customPrompt}"`
    : "";

  const prompt = `
    Act as an expert agricultural scientist and crop prediction model.
    Based on the following environmental and soil data, predict the single most suitable crop to grow.

    Data:
    - Rainfall: ${params.rainfall} mm
    - Average Temperature: ${params.temperature}°C
    - Humidity: ${params.humidity}%
    - Soil Nitrogen (N): ${params.nitrogen} kg/ha
    - Soil Phosphorus (P): ${params.phosphorus} kg/ha
    - Soil Potassium (K): ${params.potassium} kg/ha
    - Soil pH: ${params.ph}
    - Soil Type: ${params.soilType}
    - Region: ${params.region}, Ethiopia
    ${customPromptSection}

    Your response must be a JSON object adhering to the provided schema.
    Provide the single best crop, a brief justification, a confidence score, an optional expected yield, and a brief market demand analysis.
    The reasoning should be concise and directly related to the provided parameters.
    Example crop names: Maize, Teff, Wheat, Sorghum, Barley, Coffee, Chickpea, Lentil, Potato.

    CRITICAL INSTRUCTION: Your entire response, including all text fields, MUST be ONLY in ${getLanguageName(
      language
    )}. Do not use any other language.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            crop: {
              type: Type.STRING,
              description: "The name of the single most suitable crop.",
            },
            reason: {
              type: Type.STRING,
              description:
                "A brief justification for why this crop is suitable based on the provided data.",
            },
            confidence: {
              type: Type.NUMBER,
              description:
                "A confidence score for the prediction, from 0 to 100.",
            },
            expectedYield: {
              type: Type.STRING,
              description:
                "An estimated range of the expected yield in kg/ha (e.g., '2500-3500 kg/ha').",
            },
            marketDemand: {
              type: Type.STRING,
              description:
                "A brief analysis of the market demand for the crop in the region (e.g., 'High local demand').",
            },
          },
          required: ["crop", "reason", "confidence"],
        },
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);

    if (
      typeof result.crop !== "string" ||
      typeof result.reason !== "string" ||
      typeof result.confidence !== "number"
    ) {
      throw new Error("Invalid response format from AI model.");
    }

    return result as PredictionResult;
  } catch (error) {
    console.error("Error calling Gemini API for crop prediction:", error);
    throw new Error("PREDICTION_FAILED");
  }
};

let chat: Chat | null = null;
let lastChatLanguage: Language | null = null;

export const askAgriBotStream = async (
  ai: GoogleGenAI,
  message: string,
  language: Language,
  onChunk: (chunk: string) => void
) => {
  try {
    // Reset chat if language changes
    if (language !== lastChatLanguage) {
      chat = null;
      lastChatLanguage = language;
    }

    if (!chat) {
      chat = ai.chats.create({
        model: "gemini-2.5-flash-lite",
        config: {
          systemInstruction: `You are AgriBot, a helpful AI assistant for farmers and agricultural experts. Answer questions concisely and accurately about farming, crops, soil, plant diseases, and sustainable agriculture practices. Use clear and simple language. CRITICAL INSTRUCTION: Your entire response must be ONLY in ${getLanguageName(
            language
          )}. Do not use any other language.`,
        },
      });
    }
    const responseStream = await chat.sendMessageStream({ message });
    for await (const chunk of responseStream) {
      onChunk(chunk.text);
    }
  } catch (error) {
    console.error("Error communicating with AgriBot:", error);
    throw new Error("AGRIBOT_FAILED");
  }
};

export const analyzeLeaf = async (
  ai: GoogleGenAI,
  imageBase64: string,
  mimeType: string,
  prompt: string,
  language: Language
): Promise<LeafAnalysisResult> => {
  const imagePart = {
    inlineData: {
      data: imageBase64,
      mimeType,
    },
  };

  const textPart = {
    text: `
        ${prompt}. 
        Provide a detailed analysis in Markdown format.
        Also, provide a confidence score (0-100) indicating your certainty in the diagnosis.
        Your response must be a JSON object adhering to the provided schema.
        CRITICAL INSTRUCTION: Your entire response, especially the 'analysis' field, MUST be ONLY in ${getLanguageName(
          language
        )}. Do not use any other language.
        `,
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: {
              type: Type.STRING,
              description:
                "The detailed analysis of the leaf condition in Markdown format.",
            },
            confidence: {
              type: Type.NUMBER,
              description:
                "A confidence score for the diagnosis, from 0 to 100.",
            },
          },
          required: ["analysis", "confidence"],
        },
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);

    if (
      typeof result.analysis !== "string" ||
      typeof result.confidence !== "number"
    ) {
      throw new Error(
        "Invalid response format from AI model for leaf analysis."
      );
    }

    return result as LeafAnalysisResult;
  } catch (error) {
    console.error("Error analyzing leaf image:", error);
    throw new Error("ANALYSIS_FAILED");
  }
};

export const analyzeSoil = async (
  ai: GoogleGenAI,
  imageBase64: string,
  mimeType: string,
  prompt: string,
  language: Language
): Promise<string> => {
  const imagePart = {
    inlineData: {
      data: imageBase64,
      mimeType,
    },
  };

  const textPart = {
    text: `Act as an expert soil scientist. Analyze the provided image of a soil sample. Based on the visual characteristics like color, texture, and structure, provide a detailed analysis.
        ${prompt}.
        Your response MUST be a well-structured Markdown format with these exact headings:
        - **Soil Type Classification:** (e.g., Clay, Sandy, Loam, Silt, Peaty)
        - **Visual Analysis:** (Describe color, estimated texture, and structure)
        - **Estimated Moisture & Organic Matter:** (e.g., Dry, Moist; Low, Medium, High organic content)
        - **Farming Recommendations:** (Suggest suitable crops and soil improvement techniques.)
        - **Cost-Effective Amendments:** (Suggest practical, low-cost ways to improve this soil using locally available materials like compost, manure, wood ash, etc.)
        
        CRITICAL INSTRUCTION: Your entire response, including all headings and content, MUST be ONLY in ${getLanguageName(
          language
        )}. Do not use any other language.`,
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [imagePart, textPart] },
    });

    return response.text;
  } catch (error) {
    console.error("Error analyzing soil image:", error);
    throw new Error("SOIL_ANALYSIS_FAILED");
  }
};

export const getTreatmentPlan = async (
  ai: GoogleGenAI,
  analysis: string,
  language: Language
): Promise<string> => {
  const prompt = `
        Act as an expert plant pathologist and agronomist.
        Based on the following leaf disease analysis, provide a detailed and actionable treatment plan suitable for a farmer.

        **Previous Analysis:**
        "${analysis}"

        **Your Task:**
        1.  From the analysis, clearly identify and state the most likely disease or issue.
        2.  Provide a comprehensive treatment plan structured in Markdown.
        
        **Structure the plan with these exact headings:**
        - **Likely Disease:**
        - **Commercial Treatments:** (List 1-3 specific, commonly available fungicide or pesticide products. Include active ingredients and general application advice.)
        - **Organic & Cultural Controls:** (List non-chemical options like neem oil, crop rotation, sanitation, etc.)
        - **Preventative Measures:** (List actions to prevent future outbreaks.)

        Be practical and clear. Assume the user is a farmer in Ethiopia.
        CRITICAL INSTRUCTION: Your entire response, including all headings and content, MUST be ONLY in ${getLanguageName(
          language
        )}. Do not use any other language.
    `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating treatment plan:", error);
    throw new Error("TREATMENT_PLAN_FAILED");
  }
};

export const generateSpeech = async (
  ai: GoogleGenAI,
  text: string
): Promise<AudioBuffer> => {
  if (!text || !text.trim()) {
    console.error("Speech generation stopped: Input text is empty.");
    throw new Error("SPEECH_FAILED");
  }

  try {
    const MAX_TTS_LENGTH = 4000;
    let textToSpeak = text;
    if (text.length > MAX_TTS_LENGTH) {
      console.warn(
        `TTS input text truncated from ${text.length} to ${MAX_TTS_LENGTH} characters.`
      );
      textToSpeak = text.substring(0, MAX_TTS_LENGTH);
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: textToSpeak }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Kore" },
          },
        },
      },
    });

    const base64Audio =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      console.error(
        "Speech generation failed. API Response:",
        JSON.stringify(response, null, 2)
      );
      throw new Error("No audio data received from the API.");
    }

    const outputAudioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const audioBuffer = await decodeAudioData(
      decode(base64Audio),
      outputAudioContext,
      24000,
      1
    );

    return audioBuffer;
  } catch (error) {
    console.error("Error generating speech:", error);
    throw new Error("SPEECH_FAILED");
  }
};

export const generateFarmingGuide = async (
  ai: GoogleGenAI,
  crop: string,
  region: string,
  language: Language
): Promise<string> => {
  const prompt = `
        Act as an expert agronomist.
        Provide a comprehensive but easy-to-understand farming guide for cultivating "${crop}" in the "${region}" region of Ethiopia.
        The guide should be practical for a local farmer.
        Structure the guide with the following sections using Markdown headings:
        - **Introduction**: Brief overview of the crop and its importance in the region.
        - **Soil Preparation**: Ideal soil type, pH, and how to prepare the land.
        - **Planting**: Best time to plant, seed selection, spacing, and depth.
        - **Watering & Irrigation**: Water requirements throughout the growth cycle and recommended irrigation methods.
        - **Fertilization**: Nutrient requirements (N, P, K) and recommended fertilization schedule (organic and chemical options).
        - **Weed & Pest Control**: Common weeds and pests for this crop in the region, and integrated pest management (IPM) strategies.
        - **Harvesting & Storage**: How to know when to harvest, proper harvesting techniques, and post-harvest storage advice.

        CRITICAL INSTRUCTION: Your entire response, including all Markdown headings and content, MUST be ONLY in ${getLanguageName(
          language
        )}. Do not use any other language.
    `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating farming guide:", error);
    throw new Error("GUIDE_FAILED");
  }
};

export const getLocationData = async (
  ai: GoogleGenAI,
  lat: number,
  lon: number
): Promise<{ region: string; temperature: number }> => {
  const prompt = `
    Based on the following GPS coordinates, identify the administrative region within Ethiopia and the current local temperature.
    
    Coordinates:
    - Latitude: ${lat}
    - Longitude: ${lon}

    Your tasks:
    1. Identify the major administrative region in Ethiopia.
    2. Determine the current approximate temperature in Celsius for that location. You can infer this based on general knowledge of the region's climate and the current season.
    
    Your response MUST be a JSON object with two keys: "region" and "temperature".
    - The "region" must be one of the following exact English strings: 'Oromia', 'Amhara', 'SNNPR', 'Tigray', 'Somali', 'Afar'.
    - The "temperature" must be a number representing degrees Celsius.

    Example Response: {"region": "Oromia", "temperature": 24}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            region: {
              type: Type.STRING,
              description: "The administrative region in Ethiopia.",
            },
            temperature: {
              type: Type.NUMBER,
              description: "The current approximate temperature in Celsius.",
            },
          },
          required: ["region", "temperature"],
        },
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);

    const validRegions = [
      "Oromia",
      "Amhara",
      "SNNPR",
      "Tigray",
      "Somali",
      "Afar",
    ];
    if (
      typeof result.region !== "string" ||
      !validRegions.includes(result.region) ||
      typeof result.temperature !== "number"
    ) {
      throw new Error("Invalid location data format from AI model.");
    }

    return result;
  } catch (error) {
    console.error("Error calling Gemini API for location data:", error);
    throw new Error("LOCATION_FETCH_FAILED");
  }
};

export const extractDiseaseName = async (
  ai: GoogleGenAI,
  analysis: string,
  language: Language
): Promise<string> => {
  const prompt = `
        From the following plant leaf analysis text, extract and return ONLY the specific name of the most likely disease, pest, or nutrient deficiency.
        For example, if the text says "This appears to be Northern Corn Leaf Blight", you should return "Northern Corn Leaf Blight".
        If it says "The symptoms suggest Potassium (K) Deficiency", you should return "Potassium Deficiency".
        Do not add any explanation, labels, or introductory text. Just the name.

        **Analysis Text:**
        "${analysis}"

        CRITICAL INSTRUCTION: Your entire response must be ONLY in ${getLanguageName(
          language
        )}.
    `;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response text received from API");
    }
    return responseText.trim().replace(/\*/g, ""); // Remove any markdown bolding
  } catch (error) {
    console.error("Error extracting disease name:", error);
    throw new Error("DISEASE_EXTRACTION_FAILED");
  }
};

export const generateDiseaseImage = async (
  ai: GoogleGenAI,
  diseaseName: string,
  plantName: string
): Promise<string> => {
  const prompt = `Photorealistic close-up image of a single ${plantName} leaf clearly showing the symptoms of ${diseaseName}. The image should be focused on the leaf, highlighting the specific visual characteristics of the condition like lesions, discoloration, or spots. High detail, natural lighting, macro photography style.`;

  try {
    const response = await ai.models.generateImages({
      model: "imagen-4.0-generate-001",
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: "image/jpeg",
        aspectRatio: "1:1",
      },
    });

    if (
      response.generatedImages &&
      response.generatedImages.length > 0 &&
      response.generatedImages[0].image.imageBytes
    ) {
      const base64ImageBytes: string =
        response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      throw new Error("No image data was returned from the API.");
    }
  } catch (error) {
    console.error("Error generating disease image:", error);
    throw new Error("IMAGE_GENERATION_FAILED");
  }
};

export const getPlantGrowthStages = async (
  ai: GoogleGenAI,
  plantName: string,
  language: Language
): Promise<string> => {
  const prompt = `
        Act as an expert botanist and agronomist.
        Provide a clear, concise guide to the primary growth stages of a "${plantName}" plant, suitable for a farmer.
        Structure the guide in Markdown with a main heading for each stage. For each stage, provide a brief description and a bulleted list of key visual indicators.

        **Example Structure:**
        ### Stage 1: Germination & Seedling
        - Description of the stage...
        - **Visual Indicators:**
            - First leaves (cotyledons) emerge.
            - Plant is small and fragile.
        
        ### Stage 2: Vegetative Growth
        - Description of the stage...
        - **Visual Indicators:**
            - Rapid increase in leaf and stem size.
            - Plant appears bushy and green.

        ...and so on for flowering, fruiting/harvesting stages.

        Focus on the most critical, visually identifiable stages.
        CRITICAL INSTRUCTION: Your entire response, including all Markdown headings and content, MUST be ONLY in ${getLanguageName(
          language
        )}. Do not use any other language.
    `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating plant growth stages:", error);
    throw new Error("GROWTH_STAGE_FAILED");
  }
};
