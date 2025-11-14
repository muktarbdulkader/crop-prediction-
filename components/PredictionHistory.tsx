
import React from 'react';
import type { PredictionHistoryItem } from '../types';

interface PredictionHistoryProps {
  history: PredictionHistoryItem[];
  onClear: () => void;
  t: any;
}

const PredictionHistory: React.FC<PredictionHistoryProps> = ({ history, onClear, t }) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">{t.history.noHistory}</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-brand-green-dark">{t.history.title}</h3>
        <button
          onClick={onClear}
          className="text-sm text-red-600 hover:underline focus:outline-none"
        >
          {t.history.clear}
        </button>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {history.map((item) => (
          <div key={item.id} className="p-3 bg-white/70 rounded-lg border border-gray-200">
            <div className="flex justify-between items-start">
              <p className="font-bold text-brand-green-dark">{item.result.crop}</p>
              <p className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleDateString()}</p>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {item.params.region}, {item.params.soilType}
            </p>
            <p className="text-xs text-gray-600">
              {t.rainfall.split(' ')[0]}: {item.params.rainfall}, {t.temperature.split(' ')[0]}: {item.params.temperature}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PredictionHistory;
