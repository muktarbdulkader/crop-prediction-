# Agricultural Assistant (Agri‑AI)
View your app in agriculture ai:https://croppredicti.netlify.app/

An AI-powered agricultural assistant that helps farmers and agronomists (especially in Ethiopia) make better decisions about crops and plant health.

The app combines several tools:

- **Smart Crop Predictor** – Suggests the best crop based on weather and soil parameters.
- **AgriBot Chat** – Conversational assistant for general agricultural questions.
- **Leaf Health Scanner** – Analyzes leaf images for diseases, pests, or nutrient deficiencies.
- **Soil Scanner** – Analyzes soil images and suggests farming recommendations.
- **Profile & Pro Upgrade** – Simple profile management and a mock Pro upgrade flow.

The UI supports **English**, **Amharic**, and **Afaan Oromoo**.

---

## Tech Stack

**Frontend**

- React + TypeScript
- Vite (bundler & dev server)
- `@google/genai` for calling Gemini models
- `recharts` for data visualizations

**Backend**

- FastAPI
- Uvicorn
- Pydantic

**AI Models** (via Google AI / Gemini)

- `gemini-2.5-flash` / `gemini-2.5-flash-lite` – chat and crop prediction
- `gemini-2.5-pro` – image-based leaf and soil analysis
- `imagen-4.0-generate-001` – disease illustration images

> You need a valid **Google AI (Gemini) API key** to use the AI features.

---

## Project Structure (High Level)

- [App.tsx](cci:7://file:///c:/Users/hp/OneDrive/Dokumenter/copy-of-muktar/App.tsx:0:0-0:0) – Main app shell, navigation, language switching
- `components/` – Feature components (CropPredictor, AgriBot, LeafScanner, SoilScanner, Profile, Auth, Landing)
- [services/geminiService.ts](cci:7://file:///c:/Users/hp/OneDrive/Dokumenter/copy-of-muktar/services/geminiService.ts:0:0-0:0) – All Gemini calls (text, images, TTS, etc.)
- [translations.ts](cci:7://file:///c:/Users/hp/OneDrive/Dokumenter/copy-of-muktar/translations.ts:0:0-0:0) – UI text for EN / AM / OM
- [types.ts](cci:7://file:///c:/Users/hp/OneDrive/Dokumenter/copy-of-muktar/types.ts:0:0-0:0) – Shared TypeScript types
- `backend/` – FastAPI backend with simple auth + payment confirmation

---

## Prerequisites

- **Node.js** (LTS recommended)
- **npm** (comes with Node)
- **Python 3** (for the backend)
- A **Google AI (Gemini) API key**

---

## Environment Variables

The frontend reads your Gemini API key from `.env.local` in the project root.

1. Create `.env.local` in the project root (same folder as [package.json](cci:7://file:///c:/Users/hp/OneDrive/Dokumenter/copy-of-muktar/package.json:0:0-0:0)):

   ```env
   GEMINI_API_KEY=your-google-ai-api-key-here
   ```
