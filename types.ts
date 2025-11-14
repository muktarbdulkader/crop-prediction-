export type Language = "en" | "am" | "om";

export type User = {
  name: string;
  email: string;
  plan: "free" | "pro";
};

export type Tool =
  | "predictor"
  | "chatbot"
  | "scanner"
  | "soil_scanner"
  | "profile";

export interface PredictionParams {
  rainfall: number;
  temperature: number;
  humidity: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  soilType: string;
  region: string;
}

export interface PredictionResult {
  crop: string;
  reason: string;
  confidence: number;
  expectedYield?: string;
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
  isError?: boolean;
}

export interface LeafAnalysisResult {
  analysis: string; // Markdown formatted string
  confidence: number; // A score from 0 to 100
}

export interface PredictionHistoryItem {
  id: string;
  params: PredictionParams;
  result: PredictionResult;
  timestamp: string;
}

export interface ScanHistoryItem {
  id: string;
  imageDataUrl: string; // base64 encoded image
  plantName: string;
  analysis: {
    raw: string;
    confidence: number;
  };
  treatmentPlan?: string; // Storing raw markdown
  generatedImageUrl?: string;
  timestamp: string;
}
