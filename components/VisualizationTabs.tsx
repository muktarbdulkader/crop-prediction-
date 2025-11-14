
import React, { useState } from 'react';
import CorrelationHeatmap from './charts/CorrelationHeatmap';
import FeatureImportanceChart from './charts/FeatureImportanceChart';
import YieldScatterPlot from './charts/YieldScatterPlot';

type Tab = 'heatmap' | 'importance' | 'rainfall' | 'temperature';

interface VisualizationTabsProps {
  t: any;
}

const VisualizationTabs: React.FC<VisualizationTabsProps> = ({ t }) => {
  const [activeTab, setActiveTab] = useState<Tab>('heatmap');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'heatmap', label: t.visualizations.heatmap },
    { id: 'importance', label: t.visualizations.importance },
    { id: 'rainfall', label: t.visualizations.rainfallVsYield },
    { id: 'temperature', label: t.visualizations.tempVsYield },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'heatmap':
        return <CorrelationHeatmap t={t} />;
      case 'importance':
        return <FeatureImportanceChart t={t} />;
      case 'rainfall':
        return <YieldScatterPlot xKey="rainfall" xLabel={t.rainfall} t={t} />;
      case 'temperature':
        return <YieldScatterPlot xKey="temperature" xLabel={t.temperature} t={t} />;
      default:
        return null;
    }
  };
  
  const TabButton: React.FC<{tabId: Tab; label: string}> = ({tabId, label}) => (
     <button
        onClick={() => setActiveTab(tabId)}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            activeTab === tabId
            ? 'bg-brand-green text-white shadow'
            : 'text-text-muted hover:bg-base-200'
        }`}
        >
        {label}
    </button>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-brand-green-dark">{t.visualizations.title}</h2>
      <div className="mb-4 flex flex-wrap gap-2 border-b border-base-300 pb-2">
        {tabs.map(tab => <TabButton key={tab.id} tabId={tab.id} label={tab.label} />)}
      </div>
      <div className="mt-4 h-80 w-full">
        {renderContent()}
      </div>
    </div>
  );
};

export default VisualizationTabs;
