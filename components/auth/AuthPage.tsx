
import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import type { User } from '../../types';

interface AuthPageProps {
  onLogin: (user: Omit<User, 'plan'>) => void;
  onRegister: (user: Omit<User, 'plan'>) => void;
  onBackToLanding: () => void;
  t: any; // Translation object
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onRegister, onBackToLanding, t }) => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-brand-green-dark">{showLogin ? t.login : t.register}</h1>
        <p className="text-brand-green">{t.appSubtitle}</p>
      </div>
      
      {showLogin ? (
        <Login onLogin={onLogin} t={t} />
      ) : (
        <Register onRegister={onRegister} t={t} />
      )}

      <div className="text-sm text-center text-gray-600">
        <p>
            {showLogin ? t.registerPrompt : t.loginPrompt}{' '}
            <button
            onClick={() => setShowLogin(!showLogin)}
            className="font-medium text-brand-green hover:underline focus:outline-none"
            >
            {showLogin ? t.register : t.login}
            </button>
        </p>
        <p className="mt-2">
            <button onClick={onBackToLanding} className="font-medium text-gray-500 hover:underline focus:outline-none">
                &larr; {t.backToHome}
            </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
