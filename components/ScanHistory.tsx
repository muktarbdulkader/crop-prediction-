import React from 'react';
import type { ScanHistoryItem } from '../types';

interface ScanHistoryProps {
  history: ScanHistoryItem[];
  onSelectScan: (item: ScanHistoryItem) => void;
  onClear: () => void;
  t: any;
}

const ScanHistory: React.FC<ScanHistoryProps> = ({ history, onSelectScan, onClear, t }) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-10 animate-fade-in">
        <p className="text-text-muted">{t.scanHistory.noHistory}</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-brand-green-dark">{t.scanHistory.title}</h3>
        <button
          onClick={onClear}
          className="text-sm text-red-600 hover:underline focus:outline-none"
        >
          {t.scanHistory.clear}
        </button>
      </div>
      <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-2">
        {history.map((item) => (
          <div key={item.id} className="p-3 bg-base-100 rounded-lg border border-base-200">
            <div className="flex items-center gap-4">
              <img src={item.imageDataUrl} alt={item.plantName} className="w-16 h-16 object-cover rounded-md flex-shrink-0 bg-base-200" />
              <div className="flex-grow">
                <p className="font-bold text-text-main">{item.plantName || 'Unknown Plant'}</p>
                <p className="text-xs text-text-muted mt-1">
                  {new Date(item.timestamp).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => onSelectScan(item)}
                className="px-3 py-1 bg-brand-green text-white rounded-md hover:bg-brand-green-dark transition-colors text-sm font-semibold"
              >
                {t.scanHistory.viewScan}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScanHistory;
