
import React, { useState } from 'react';
import type { User, Language } from '../types';
import PaymentModal from './PaymentModal';
import SelectInput from './SelectInput';

interface UserProfileProps {
  user: User;
  onUpdateUser: (details: { name?: string; phone?: string; role?: string; }) => void;
  onUpgrade: () => void;
  language: Language;
  t: any; // Translation object
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdateUser, onUpgrade, t }) => {
  const [newName, setNewName] = useState(user.name);
  const [newPhone, setNewPhone] = useState(user.phone || '');
  const [newRole, setNewRole] = useState(user.role);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newName.trim();
    const trimmedPhone = newPhone.trim();
    if (trimmedName && (trimmedName !== user.name || trimmedPhone !== (user.phone || '') || newRole !== user.role)) {
      onUpdateUser({ name: trimmedName, phone: trimmedPhone, role: newRole });
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000); // Hide message after 3 seconds
    }
  };
  
  const handlePaymentSuccess = () => {
    onUpgrade();
    setIsPaymentModalOpen(false);
    setUpgradeSuccess(true);
    setTimeout(() => setUpgradeSuccess(false), 4000);
  };

  const hasChanges = newName.trim() !== user.name || newPhone.trim() !== (user.phone || '') || newRole !== user.role;

  return (
    <div>
      {isPaymentModalOpen && (
        <PaymentModal 
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onConfirm={handlePaymentSuccess}
          t={t}
        />
      )}
      <h2 className="text-2xl font-bold mb-2 text-brand-green-dark border-b-2 border-brand-green pb-2">{t.profile.title}</h2>
      <p className="text-text-muted mb-6">{t.profile.overview}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-base-100 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold text-brand-green-dark mb-4">{t.profile.manageTitle}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-text-muted">{t.pro.currentPlan}</label>
                <p className={`mt-1 text-lg font-bold ${user.plan === 'pro' ? 'text-brand-green' : 'text-text-main'}`}>
                    {user.plan === 'pro' ? `⭐ ${t.pro.proTier}` : t.pro.freeTier}
                </p>
            </div>
             <div>
                <label className="block text-sm font-medium text-text-muted">{t.profile.currentEmail}</label>
                <p className="mt-1 text-text-muted">{user.email}</p>
            </div>
            
            <div className="pt-4 space-y-4">
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-text-main">{t.profile.updateNameLabel}</label>
                    <input
                        type="text"
                        id="fullName"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="mt-1 form-input"
                    />
                </div>
                 <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-text-main">{t.profile.updatePhoneLabel}</label>
                    <input
                        type="tel"
                        id="phone"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        placeholder={t.phonePlaceholder}
                        className="mt-1 form-input"
                    />
                </div>
                <div>
                    <SelectInput
                        label={t.profile.updateRoleLabel}
                        options={t.roleOptions}
                        value={newRole}
                        onChange={setNewRole}
                    />
                </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
                <button
                type="submit"
                className="bg-brand-green hover:bg-brand-green-dark text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50"
                disabled={!newName.trim() || !hasChanges}
                >
                {t.profile.updateButton}
                </button>
                {updateSuccess && (
                    <p className="text-sm text-green-600 animate-fade-in">{t.profile.updateSuccess}</p>
                )}
            </div>
            </form>
        </div>
        
        {user.plan === 'free' ? (
             <div className="bg-gradient-to-br from-brand-green to-brand-green-dark p-6 rounded-lg text-white flex flex-col justify-center shadow-lg">
                <h3 className="text-2xl font-bold mb-2">{t.pro.title}</h3>
                <p className="mb-4 text-lime-100">{t.pro.description}</p>
                <ul className="space-y-2 mb-6 list-disc list-inside text-lime-100">
                    <li>{t.pro.feature1}</li>
                    <li>{t.pro.feature2}</li>
                    <li>{t.pro.feature3}</li>
                </ul>
                 {upgradeSuccess && (
                    <p className="text-sm text-center bg-yellow-400 text-brand-green-dark font-semibold py-2 px-4 rounded-md animate-fade-in mb-4">{t.pro.success}</p>
                )}
                <button 
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-brand-green-dark font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                >
                    {t.pro.upgradeButton}
                </button>
            </div>
        ) : (
             <div className="bg-base-100 p-6 rounded-lg flex flex-col items-center justify-center text-center shadow-sm">
                 <span className="text-6xl mb-4">⭐</span>
                 <h3 className="text-2xl font-bold text-brand-green-dark">{t.pro.proTier}</h3>
                 <p className="text-text-muted mt-2">{t.pro.proMemberInfo}</p>
             </div>
        )}

      </div>
    </div>
  );
};

export default UserProfile;
