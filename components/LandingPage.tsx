
import React from 'react';

interface LandingPageProps {
  onNavigateToAuth: () => void;
  t: any;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-200 text-center transform hover:scale-105 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-green text-white mx-auto mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-brand-green-dark mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
    </div>
);


const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToAuth, t }) => {
  return (
    <div className="w-full max-w-5xl text-center animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-extrabold text-brand-green-dark drop-shadow-md">
            {t.landing.title}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-brand-green max-w-3xl mx-auto">
            {t.landing.subtitle}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
            <FeatureCard 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 00-4-4H3V9h2a4 4 0 004-4V3l4 4-4 4v2a4 4 0 004 4h2v2h-2a4 4 0 00-4 4z" /></svg>}
                title={t.landing.feature1Title}
                description={t.landing.feature1Desc}
            />
            <FeatureCard 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
                title={t.landing.feature2Title}
                description={t.landing.feature2Desc}
            />
            <FeatureCard 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
                title={t.landing.feature3Title}
                description={t.landing.feature3Desc}
            />
        </div>

        <button 
            onClick={onNavigateToAuth}
            className="bg-brand-green hover:bg-brand-green-dark text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-110 shadow-xl"
        >
            {t.landing.getStarted}
        </button>
    </div>
  );
};

export default LandingPage;
