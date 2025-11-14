
import React, { useState } from 'react';
import type { User } from '../../types';

interface LoginProps {
  onLogin: (user: Omit<User, 'plan'>) => void;
  t: any;
}

const Login: React.FC<LoginProps> = ({ onLogin, t }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      // In a real app, you'd verify credentials. Here, we'll just simulate a user.
      // We'll derive a name from the email for the welcome message.
      const namePart = email.split('@')[0];
      const name = namePart ? namePart.replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '';
      onLogin({ name: name.trim() || t.defaultUsername, email });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-muted">
          {t.emailLabel}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-base-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-green focus:border-brand-green sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="password"className="block text-sm font-medium text-text-muted">
          {t.passwordLabel}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-base-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-green focus:border-brand-green sm:text-sm"
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-green hover:bg-brand-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-light"
      >
        {t.login}
      </button>
    </form>
  );
};

export default Login;
