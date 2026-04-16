import React, { useState } from 'react';
import { Shield, Building2, ChevronRight } from 'lucide-react';
import ChangePasswordForm from '../../../features/settings/ui/ChangePasswordForm';
import CompanyDetailsForm from '../../../features/settings/ui/CompanyDetailsForm';

const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'security' | 'company'>('company');

  const tabs = [
    {
      id: 'company',
      label: 'Dane firmy i rozliczenia',
      description: 'NIP, adres, numer konta bankowego',
      icon: <Building2 size={20} />,
      component: <CompanyDetailsForm />
    },
    {
      id: 'security',
      label: 'Bezpieczeństwo',
      description: 'Zmiana hasła i ochrona konta',
      icon: <Shield size={20} />,
      component: <ChangePasswordForm />
    }
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="animate-in fade-in duration-700 max-w-6xl mx-auto pb-24">
      <div className="pt-8 px-4 md:px-0">
        <div className="mb-12">
          <h1 className="text-3xl font-black text-brand-navy tracking-tight">Ustawienia konta</h1>
          <p className="text-slate-500 font-medium">Zarządzaj swoimi danymi i bezpieczeństwem.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Nawigacyjny */}
          <aside className="w-full md:w-80 flex-shrink-0">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-start gap-4 p-4 rounded-[var(--radius-brand-button)] transition-all text-left group ${
                    activeTab === tab.id 
                      ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' 
                      : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-100'
                  }`}
                >
                  <div className={`mt-0.5 p-2 rounded-[var(--radius-brand-button)] ${
                    activeTab === tab.id ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-white'
                  }`}>
                    {tab.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-black text-sm uppercase tracking-wider">{tab.label}</div>
                    <div className={`text-xs mt-0.5 font-medium ${
                      activeTab === tab.id ? 'text-white/70' : 'text-slate-400'
                    }`}>
                      {tab.description}
                    </div>
                  </div>
                  <ChevronRight size={16} className={`mt-1 transition-transform ${
                    activeTab === tab.id ? 'translate-x-1 opacity-100' : 'opacity-0'
                  }`} />
                </button>
              ))}
            </nav>
          </aside>

          {/* Obszar Treści */}
          <main className="flex-1 min-w-0">
            <div key={activeTab} className="animate-in slide-in-from-right-4 duration-500">
              {activeTabData?.component}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
