import React from 'react';
import { Settings, RefreshCw, MessageSquare, ShieldCheck } from 'lucide-react';

interface AdminSettingsTabProps {
  settings: any;
  isSaving: boolean;
  saveStatus: 'idle' | 'success' | 'error';
  isTestingEmail: boolean;
  onUpdateSettings: (newSettings: any) => void;
  onTestEmail: () => void;
  onSave: () => void;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({
  settings,
  isSaving,
  saveStatus,
  isTestingEmail,
  onUpdateSettings,
  onTestEmail,
  onSave
}) => {
  const updateSetting = (path: string, value: any) => {
    const keys = path.split('.');
    const newSettings = { ...settings };
    let current = newSettings;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    onUpdateSettings(newSettings);
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-3xl mx-auto">
      <div className="bg-[#0f172a] border border-slate-800 rounded-[var(--radius-brand-card)] p-8 shadow-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-brand-blue/10 text-brand-blue rounded-[var(--radius-brand-button)] flex items-center justify-center">
            <Settings size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">Ustawienia Systemu</h3>
            <p className="text-slate-400 text-sm">Zarządzaj globalnymi funkcjami i zachowaniem strony.</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Scroll Snap Toggle */}
          <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-[var(--radius-brand-button)] flex items-start justify-between gap-6">
            <div>
              <h4 className="text-lg font-bold text-white mb-1">Tryb Cinematic Scroll</h4>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Włącza "przyciąganie" do sekcji podczas przewijania strony głównej (Scroll Snapping). 
                Zalecane dla uzyskania efektu nowoczesnej prezentacji.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Status:</span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${settings?.enableScrollSnap ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {settings?.enableScrollSnap ? 'Włączony' : 'Wyłączony'}
                </span>
              </div>
            </div>
            <button
              onClick={() => updateSetting('enableScrollSnap', !settings?.enableScrollSnap)}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${
                settings?.enableScrollSnap ? 'bg-brand-blue' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  settings?.enableScrollSnap ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Analytics Toggle */}
          <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-[var(--radius-brand-button)] flex items-start justify-between gap-6">
            <div>
              <h4 className="text-lg font-bold text-white mb-1">Śledzenie aktywności i analityka</h4>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Zezwala na zbieranie danych o sesjach, kliknięciach i ścieżkach konwersji (np. w module Onboardingu). Wyłączenie tej opcji całkowicie wstrzyma wysyłanie logów do chmury RPMS.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Status:</span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${settings?.enableActivityLogging !== false ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {settings?.enableActivityLogging !== false ? 'Włączony' : 'Wyłączony'}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                const newValue = settings?.enableActivityLogging === false ? true : false;
                updateSetting('enableActivityLogging', newValue);
                if (typeof window !== 'undefined') {
                  localStorage.setItem('rpms_analytics_enabled', String(newValue));
                }
              }}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${
                settings?.enableActivityLogging !== false ? 'bg-brand-blue' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  settings?.enableActivityLogging !== false ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Email Settings */}
          <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-[var(--radius-brand-button)] flex flex-col gap-6">
            <div>
              <h4 className="text-lg font-bold text-white mb-1">Ustawienia Formularzy / E-mail</h4>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Skonfiguruj dane dostępowe do serwera SMTP (np. Google Workspace) oraz adres e-mail, na który mają trafiać zapytania z formularzy kontaktowych.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Adres docelowy (Odbiorca)</label>
                <input 
                  type="email" 
                  value={settings?.email?.destination || ''}
                  onChange={(e) => updateSetting('email.destination', e.target.value)}
                  placeholder="np. biuro@twojafirma.pl"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-[var(--radius-brand-input)] px-4 py-3 outline-none focus:border-brand-blue"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Użytkownik SMTP (Nadawca)</label>
                <input 
                  type="email" 
                  value={settings?.email?.smtpUser || ''}
                  onChange={(e) => updateSetting('email.smtpUser', e.target.value)}
                  placeholder="np. powiadomienia@twojafirma.pl"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-[var(--radius-brand-input)] px-4 py-3 outline-none focus:border-brand-blue"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hasło SMTP (Hasło aplikacji)</label>
                <input 
                  type="password" 
                  value={settings?.email?.smtpPass || ''}
                  onChange={(e) => updateSetting('email.smtpPass', e.target.value)}
                  placeholder="Wprowadź hasło aplikacji (np. dla Gmail)"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-[var(--radius-brand-input)] px-4 py-3 outline-none focus:border-brand-blue"
                />
                <p className="text-[10px] text-slate-500 mt-1">Dla kont Google użyj wygenerowanego 'Hasła aplikacji', a nie standardowego hasła do konta.</p>
              </div>
            </div>
          </div>

          {/* Save Button for Settings */}
          <div className="mt-10 pt-6 border-t border-slate-800 flex justify-between items-center">
            <button
              onClick={onTestEmail}
              disabled={isTestingEmail}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-[var(--radius-brand-button)] font-black text-[11px] uppercase tracking-widest transition-all border border-slate-700 flex items-center gap-2"
            >
              {isTestingEmail ? <RefreshCw size={14} className="animate-spin" /> : <MessageSquare size={14} />}
              Wyślij e-mail testowy
            </button>
            <button
              onClick={onSave}
              disabled={isSaving}
              className={`px-8 py-3 rounded-[var(--radius-brand-button)] font-black text-[11px] uppercase tracking-widest transition-all shadow-lg flex items-center gap-2 ${
                saveStatus === 'success' ? 'bg-emerald-500 text-white shadow-emerald-500/20' :
                saveStatus === 'error' ? 'bg-red-500 text-white shadow-red-500/20' :
                'bg-brand-blue text-white hover:bg-brand-blue/90 shadow-brand-blue/20'
              }`}
            >
              {isSaving ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Zapisywanie...
                </>
              ) : saveStatus === 'success' ? (
                <>
                  <ShieldCheck size={14} />
                  Zapisano pomyślnie
                </>
              ) : (
                'Zapisz wszystkie ustawienia'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
