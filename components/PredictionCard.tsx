
import React from 'react';
import type { PredictionResult } from '../types';
import LoadingIndicator from './LoadingIndicator';

interface PredictionCardProps {
  prediction: PredictionResult | null;
  isLoading: boolean;
  error: string | null;
  t: any; // Translation object
  onGenerateGuide: () => void;
  isGuideLoading: boolean;
}

const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, isLoading, error, t, onGenerateGuide, isGuideLoading }) => {
  if (isLoading) {
    return <LoadingIndicator text={t.analyzingButton} />;
  }

  if (error) {
    return (
      <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg animate-fade-in">
        <h3 className="text-xl font-bold">{t.errors.title}</h3>
        <p className="mt-2">{error}</p>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="text-center text-text-muted">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-base-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2a4 4 0 00-4-4H3V9h2a4 4 0 004-4V3l4 4-4 4v2a4 4 0 004 4h2v2h-2a4 4 0 00-4 4z" /></svg>
        <h3 className="text-xl font-bold mt-4">{t.awaitingPrediction}</h3>
        <p className="mt-2">{t.awaitingPredictionDesc}</p>
      </div>
    );
  }

  return (
    <div className="text-center w-full animate-fade-in">
        <div className="bg-gradient-to-br from-brand-green to-brand-green-dark text-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-lime-200">{t.recommendedCrop}</h3>
            <p className="text-5xl font-extrabold drop-shadow-md my-2">{prediction.crop}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-left">
             <div className="bg-base-100 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <div>
                        <h4 className="font-semibold text-text-muted">{t.confidence}</h4>
                        <p className="text-xl font-bold text-text-main">{prediction.confidence.toFixed(1)}%</p>
                    </div>
                </div>
             </div>
             {prediction.expectedYield && (
                <div className="bg-base-100 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4M4 7s0 0 0 0" /></svg>
                         <div>
                            <h4 className="font-semibold text-text-muted">{t.expectedYield}</h4>
                            <p className="text-xl font-bold text-text-main">{prediction.expectedYield}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>

      <div className="mt-6 text-left bg-base-100 p-4 rounded-lg border border-base-200">
        <h4 className="font-bold text-brand-green-dark">{t.justification}:</h4>
        <p className="text-text-muted mt-1">{prediction.reason}</p>
      </div>

       <div className="mt-6">
            <button
            onClick={onGenerateGuide}
            disabled={isGuideLoading}
            className="w-full sm:w-auto bg-brand-brown hover:bg-brand-brown/80 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
            {isGuideLoading ? t.generatingGuide : t.generateGuideButton}
        </button>
    </div>
    </div>
  );
};

export default PredictionCard;