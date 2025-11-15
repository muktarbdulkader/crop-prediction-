
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { marked } from 'marked';

import type { PredictionParams, PredictionResult, Language, PredictionHistoryItem, User } from '../types';
import { predictCrop, generateFarmingGuide, getLocationData } from '../services/geminiService';

import InputSlider from './InputSlider';
import SelectInput from './SelectInput';
import PredictionCard from './PredictionCard';
import VisualizationTabs from './VisualizationTabs';
import PredictionHistory from './PredictionHistory';
import LoadingIndicator from './LoadingIndicator';
import PlayAudioButton from './PlayAudioButton';
import PaymentModal from './PaymentModal';

interface CropPredictorProps {
    language: Language;
    t: any;
    user: User;
    onUpgrade: () => void;
    onAskAgriBot: (prompt: string) => void;
}

const CropPredictor: React.FC<CropPredictorProps> = ({ language, t, user, onUpgrade, onAskAgriBot }) => {
  const [params, setParams] = useState<PredictionParams>({
    rainfall: 120,
    temperature: 25,
    humidity: 60,
    nitrogen: 50,
    phosphorus: 50,
    potassium: 50,
    ph: 6.5,
    soilType: t.soilTypes[0],
    region: t.regions[0],
    customPrompt: '',
  });
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);

  const [guide, setGuide] = useState<string | null>(null);
  const [rawGuide, setRawGuide] = useState<string | null>(null);
  const [isGuideLoading, setIsGuideLoading] = useState<boolean>(false);
  const [guideError, setGuideError] = useState<string | null>(null);
  
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const [history, setHistory] = useState<PredictionHistoryItem[]>(() => {
    try {
      const savedHistory = localStorage.getItem('predictionHistory');
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (e) {
      console.error("Failed to parse prediction history from localStorage", e);
      return [];
    }
  });
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // Pro features state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const justUpgradedRef = useRef(false);


  useEffect(() => {
    setParams(prev => ({
        ...prev,
        soilType: t.soilTypes[0],
        region: t.regions[0],
    }));
  }, [t.soilTypes, t.regions]);
  
  useEffect(() => {
    setGuide(null);
    setRawGuide(null);
    setGuideError(null);
  }, [prediction]);

  // Effect to auto-trigger guide generation after a successful upgrade
  useEffect(() => {
    if (user.plan === 'pro' && justUpgradedRef.current && prediction) {
        justUpgradedRef.current = false; // Reset the flag
        handleGenerateGuide(); // This will now succeed
    }
  }, [user.plan, prediction]);


  const handleParamChange = useCallback(<K extends keyof PredictionParams>(param: K, value: PredictionParams[K]) => {
    setParams(prev => ({ ...prev, [param]: value }));
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setPrediction(null);
    try {
      if (!process.env.API_KEY) {
        throw new Error("API_KEY_MISSING");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const result = await predictCrop(ai, params, language);
      setPrediction(result);

      const newHistoryItem: PredictionHistoryItem = {
        id: Date.now().toString(),
        params,
        result,
        timestamp: new Date().toISOString(),
      };
      const updatedHistory = [newHistoryItem, ...history].slice(0, 20); // Keep last 20
      setHistory(updatedHistory);
      localStorage.setItem('predictionHistory', JSON.stringify(updatedHistory));

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'UNKNOWN_ERROR';
      setError(t.errors[errorMessage] || t.errors.UNKNOWN_ERROR);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUseLocation = () => {
    if (!navigator.geolocation) {
        setLocationError(t.errors.GEOLOCATION_UNSUPPORTED);
        return;
    }

    setIsLocationLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                if (!process.env.API_KEY) throw new Error("API_KEY_MISSING");
                
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const { latitude, longitude } = position.coords;
                const locationData = await getLocationData(ai, latitude, longitude);
                
                if (t.regions.includes(locationData.region)) {
                    handleParamChange('region', locationData.region);
                }
                
                handleParamChange('temperature', Math.round(locationData.temperature));
            } catch (err) {
                const msg = err instanceof Error ? err.message : 'UNKNOWN_ERROR';
                setLocationError(t.errors[msg] || t.errors.UNKNOWN_ERROR);
            } finally {
                setIsLocationLoading(false);
            }
        },
        () => {
            setLocationError(t.errors.LOCATION_PERMISSION_DENIED);
            setIsLocationLoading(false);
        }
    );
  };

  const handleGenerateGuide = async () => {
    if (!prediction) return;

    if (user.plan === 'free') {
        justUpgradedRef.current = true; // Set intent to generate after upgrade
        setIsPaymentModalOpen(true);
        return;
    }

    setIsGuideLoading(true);
    setGuideError(null);
    setGuide(null);
    setRawGuide(null);

    try {
        if (!process.env.API_KEY) throw new Error("API_KEY_MISSING");
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const result = await generateFarmingGuide(ai, prediction.crop, params.region, language);
        setRawGuide(result);
        const htmlResult = await marked.parse(result);
        setGuide(htmlResult);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'UNKNOWN_ERROR';
        setGuideError(t.errors[errorMessage] || t.errors.UNKNOWN_ERROR);
    } finally {
        setIsGuideLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    onUpgrade();
    setIsPaymentModalOpen(false);
    // The useEffect will trigger the guide generation now that the plan is 'pro'
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('predictionHistory');
  };

  const handleAskBot = () => {
      if (prediction) {
          const prompt = t.askBotPrompts.crop.replace('{crop}', prediction.crop).replace('{region}', params.region);
          onAskAgriBot(prompt);
      }
  };


  return (
    <div>
        {isPaymentModalOpen && (
            <PaymentModal 
                isOpen={isPaymentModalOpen}
                onClose={() => {
                    setIsPaymentModalOpen(false);
                    justUpgradedRef.current = false; // Reset intent if modal is closed
                }}
                onConfirm={handlePaymentSuccess}
                t={t}
            />
        )}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 bg-card p-6 rounded-2xl shadow-lg border border-base-200">
            <div className="flex justify-between items-center mb-4 border-b-2 border-brand-green/50 pb-3 gap-2 flex-wrap">
                <h2 className="text-2xl font-bold text-brand-green-dark">{t.inputParams}</h2>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleUseLocation}
                        disabled={isLocationLoading}
                        className="text-xs font-semibold text-brand-brown hover:underline focus:outline-none flex items-center gap-1 disabled:opacity-50 disabled:cursor-wait"
                    >
                        {isLocationLoading ? (
                            <>{t.fetchingLocation}</>
                        ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                            {t.useCurrentLocation}
                        </>
                        )}
                    </button>
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className="text-sm font-semibold text-brand-green hover:underline focus:outline-none"
                    >
                        {showHistory ? t.history.hide : t.history.show}
                    </button>
                </div>
            </div>
            
            {locationError && <p className="text-red-500 text-xs text-center mb-4 animate-fade-in">{locationError}</p>}

            {showHistory ? (
                <PredictionHistory history={history} onClear={handleClearHistory} t={t} />
            ) : (
                <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                    <InputSlider label={t.rainfall} unit="mm" min={0} max={300} value={params.rainfall} onChange={(val) => handleParamChange('rainfall', val)} />
                    <InputSlider label={t.temperature} unit="°C" min={0} max={50} value={params.temperature} onChange={(val) => handleParamChange('temperature', val)} />
                    <InputSlider label={t.humidity} unit="%" min={0} max={100} value={params.humidity} onChange={(val) => handleParamChange('humidity', val)} />
                    <InputSlider label={t.nitrogen} unit="kg/ha" min={0} max={150} value={params.nitrogen} onChange={(val) => handleParamChange('nitrogen', val)} />
                    <InputSlider label={t.phosphorus} unit="kg/ha" min={0} max={150} value={params.phosphorus} onChange={(val) => handleParamChange('phosphorus', val)} />
                    <InputSlider label={t.potassium} unit="kg/ha" min={0} max={150} value={params.potassium} onChange={(val) => handleParamChange('potassium', val)} />
                </div>
                <InputSlider label={t.ph} unit="" min={3} max={10} step={0.1} value={params.ph} onChange={(val) => handleParamChange('ph', val)} />
                <SelectInput label={t.soilType} options={t.soilTypes} value={params.soilType} onChange={(val) => handleParamChange('soilType', val)} />
                <SelectInput label={t.region} options={t.regions} value={params.region} onChange={(val) => handleParamChange('region', val)} />
                
                <div>
                    <button
                        type="button"
                        onClick={() => setShowCustomPrompt(!showCustomPrompt)}
                        className="text-sm font-semibold text-brand-green hover:underline focus:outline-none flex items-center gap-1"
                    >
                        {showCustomPrompt ? t.hideCustomPrompt : t.showCustomPrompt}
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${showCustomPrompt ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {showCustomPrompt && (
                        <div className="mt-2 animate-fade-in">
                            <label htmlFor="customPrompt" className="sr-only">{t.showCustomPrompt}</label>
                            <textarea
                                id="customPrompt"
                                value={params.customPrompt || ''}
                                onChange={(e) => handleParamChange('customPrompt', e.target.value)}
                                placeholder={t.customPromptPlaceholder}
                                className="form-input"
                                rows={3}
                            />
                        </div>
                    )}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                    {isLoading ? t.analyzingButton : t.predictButton}
                </button>
                </div>
            )}
        </div>

        <div className="lg:col-span-8 space-y-8">
            <div className="bg-card p-6 rounded-2xl shadow-lg border border-base-200 min-h-[300px] flex flex-col items-center justify-center">
            <PredictionCard 
                prediction={prediction} 
                isLoading={isLoading} 
                error={error} 
                t={t} 
                onGenerateGuide={handleGenerateGuide}
                isGuideLoading={isGuideLoading}
                language={language}
            />
            </div>
            {(isGuideLoading || guideError || guide) && (
                <div className="bg-card p-6 rounded-2xl shadow-lg border border-base-200 animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-brand-green-dark">{t.farmingGuideTitle} for {prediction?.crop}</h2>
                        {guide && rawGuide && <PlayAudioButton textToRead={rawGuide} language={language} t={t} />}
                    </div>
                    {isGuideLoading && <LoadingIndicator text={t.generatingGuide} />}
                    {guideError && <div className="text-red-600 bg-red-100 p-3 rounded-md">{guideError}</div>}
                    {guide && <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: guide }} />}
                </div>
            )}

            {prediction && !isLoading && (
                <div className="bg-card p-4 rounded-2xl shadow-lg border border-base-200 text-center animate-fade-in">
                    <button
                        onClick={handleAskBot}
                        className="bg-brand-brown/10 text-brand-brown font-semibold py-3 px-6 rounded-lg transition-colors duration-300 hover:bg-brand-brown/20 flex items-center justify-center gap-2 w-full sm:w-auto mx-auto"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        {t.askBot}
                    </button>
                </div>
            )}

            <div className="bg-card p-6 rounded-2xl shadow-lg border border-base-200">
                <VisualizationTabs t={t} />
            </div>
        </div>
        </div>
    </div>
  );
};

export default CropPredictor;
