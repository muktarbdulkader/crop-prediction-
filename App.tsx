
import React, { useState, useEffect } from 'react';
import CropPredictor from './components/CropPredictor';
import AgriBot from './components/AgriBot';
import LeafScanner from './components/LeafScanner';
import SoilScanner from './components/SoilScanner';
import ProductScanner from './components/ProductScanner';
import UserProfile from './components/UserProfile';
import AuthPage from './components/auth/AuthPage';
import LandingPage from './components/LandingPage';
import { translations } from './translations';
import type { Language, User, Tool } from './types';

type View = 'landing' | 'auth' | 'app';

const NavButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`relative flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-t-lg transition-colors duration-300 ease-in-out group focus:outline-none focus:ring-2 focus:ring-brand-green-light ${
      isActive
        ? 'text-brand-green-dark'
        : 'text-text-muted hover:text-brand-green-dark'
    }`}
    aria-pressed={isActive}
  >
    {icon}
    <span className="hidden sm:inline font-semibold">{label}</span>
    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-brand-green rounded-full transition-transform duration-300 ease-in-out ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'}`}></div>
  </button>
);

const LanguageSwitcher: React.FC<{
    currentLang: Language;
    onChangeLang: (lang: Language) => void;
}> = ({ currentLang, onChangeLang }) => {
    const languages: { code: Language; label: string }[] = [
        { code: 'en', label: 'EN' },
        { code: 'am', label: 'አማ' },
        { code: 'om', label: 'OM' },
    ];
    return (
        <div className="bg-white/50 backdrop-blur-sm p-1 rounded-full shadow-sm flex gap-1 border border-base-300">
            {languages.map(({ code, label }) => (
                <button
                    key={code}
                    onClick={() => onChangeLang(code)}
                    className={`px-3 py-1 text-sm font-semibold rounded-full transition-all duration-200 transform ${
                        currentLang === code
                            ? 'bg-brand-green text-white shadow-md'
                            : 'text-brand-green-dark hover:bg-brand-green/20 hover:scale-105'
                    }`}
                >
                    {label}
                </button>
            ))}
        </div>
    );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('landing');
  const [activeTool, setActiveTool] = useState<Tool>(() => {
    const savedTool = localStorage.getItem('lastActiveTool');
    return (savedTool === 'predictor' || savedTool === 'chatbot' || savedTool === 'scanner' || savedTool === 'soil_scanner' || savedTool === 'product_scanner' || savedTool === 'profile') ? savedTool as Tool : 'predictor';
  });
  const [language, setLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem('preferredLanguage');
    return (savedLang === 'en' || savedLang === 'am' || savedLang === 'om') ? savedLang : 'en';
  });
  const [agriBotInitialPrompt, setAgriBotInitialPrompt] = useState<string | null>(null);


  useEffect(() => {
    localStorage.setItem('lastActiveTool', activeTool);
    localStorage.setItem('preferredLanguage', language);
  }, [activeTool, language]);

  const t = translations[language];

  const handleLogin = (loggedInUser: Omit<User, 'plan'>) => {
    setUser({ ...loggedInUser, phone: loggedInUser.phone || '+251911000111', role: loggedInUser.role || t.roleOptions[0], plan: 'free' }); // All users start on free plan
    setView('app');
  };
  
  const handleRegister = (registeredUser: Omit<User, 'plan'>) => {
    setUser({ ...registeredUser, plan: 'free' }); // Auto-login after registration with free plan
    setView('app');
  };

  const handleLogout = () => {
    setUser(null);
    setView('landing'); // Go back to landing page on logout
    setActiveTool('predictor'); // Reset to default tool on logout
  };

  const handleUpdateUser = (updatedDetails: { name?: string; phone?: string; role?: string; }) => {
    if (user) {
        setUser({ ...user, ...updatedDetails });
    }
  };
  
  const handleUpgrade = () => {
      if (user) {
          setUser({ ...user, plan: 'pro' });
      }
  };

  const handleAskAgriBot = (prompt: string) => {
      setAgriBotInitialPrompt(prompt);
      setActiveTool('chatbot');
  };

  const clearAgriBotPrompt = () => {
      setAgriBotInitialPrompt(null);
  };

  const renderTool = () => {
    if (!user) return null;
    
    const props = { 
        language, 
        t,
        user,
        onUpgrade: handleUpgrade,
        onAskAgriBot: handleAskAgriBot,
    };

    switch (activeTool) {
      case 'predictor':
        return <CropPredictor {...props} />;
      case 'chatbot':
        return <AgriBot {...props} initialPrompt={agriBotInitialPrompt} onPromptSent={clearAgriBotPrompt} />;
      case 'scanner':
        return <LeafScanner {...props} />;
      case 'soil_scanner':
        return <SoilScanner {...props} />;
      case 'product_scanner':
        return <ProductScanner {...props} />;
      case 'profile':
        return <UserProfile user={user} onUpdateUser={handleUpdateUser} onUpgrade={handleUpgrade} {...props} />;
      default:
        return null;
    }
  };
  
  if (view !== 'app' || !user) {
    return (
        <div className="min-h-screen bg-brand-bg text-text-main p-4 sm:p-6 lg:p-8 flex flex-col justify-center items-center">
             <div className="absolute top-4 right-4 z-10">
                 <LanguageSwitcher currentLang={language} onChangeLang={setLanguage} />
             </div>
             {view === 'landing' && <LandingPage onNavigateToAuth={() => setView('auth')} t={t} />}
             {view === 'auth' && <AuthPage onLogin={handleLogin} onRegister={handleRegister} onBackToLanding={() => setView('landing')} t={t} />}
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-bg text-text-main p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-7xl animate-fade-in">
        <header className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-green-dark drop-shadow-md">
              {t.appName}
            </h1>
            <p className="text-lg text-text-muted mt-2 max-w-3xl">
              {t.appSubtitle}
            </p>
          </div>
          <div className="absolute top-0 right-0 sm:static flex items-center gap-4 mt-2 sm:mt-0">
              <LanguageSwitcher currentLang={language} onChangeLang={setLanguage} />
              <div className="hidden sm:flex items-center gap-2 text-sm">
                  <span className="font-semibold text-text-muted">{t.welcomeMessage}, {user.name.split(' ')[0]} ({user.role})!</span>
                   <button onClick={handleLogout} className="bg-brand-brown/80 text-white px-3 py-1 rounded-full hover:bg-brand-brown transition-colors">
                      {t.logout}
                   </button>
              </div>
          </div>
        </header>

        <nav className="flex justify-center sm:justify-start gap-2 z-10 relative bg-brand-bg/50 backdrop-blur-sm rounded-t-lg">
          <NavButton
            label={t.predictorTab}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.657 7.343A8 8 0 0117.657 18.657z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1014.12 11.88l-4.242 4.242z" /></svg>}
            isActive={activeTool === 'predictor'}
            onClick={() => setActiveTool('predictor')}
          />
          <NavButton
            label={t.agriBotTab}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
            isActive={activeTool === 'chatbot'}
            onClick={() => setActiveTool('chatbot')}
          />
          <NavButton
            label={t.scannerTab}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
            isActive={activeTool === 'scanner'}
            onClick={() => setActiveTool('scanner')}
          />
          <NavButton
            label={t.soilScannerTab}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8c2-3 6-3 8 0s6 3 8 0" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12c2-3 6-3 8 0s6 3 8 0" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16c2-3 6-3 8 0s6 3 8 0" />
            </svg>}
            isActive={activeTool === 'soil_scanner'}
            onClick={() => setActiveTool('soil_scanner')}
          />
           <NavButton
            label={t.productScannerTab}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 3v1m0 16V8h8v12M8 3h8M5 8h14" />
             </svg>}
            isActive={activeTool === 'product_scanner'}
            onClick={() => setActiveTool('product_scanner')}
          />
           <NavButton
            label={t.profileTab}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
            isActive={activeTool === 'profile'}
            onClick={() => setActiveTool('profile')}
          />
        </nav>

        <main className="bg-card p-6 sm:p-8 rounded-b-2xl rounded-r-2xl shadow-lg border border-base-200">
          {renderTool()}
        </main>
        
        <footer className="text-center mt-8 text-sm text-text-muted">
            <p>{t.footer}</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
