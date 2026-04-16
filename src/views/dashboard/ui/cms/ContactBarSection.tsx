import React from 'react';
import { Phone, Mail, Eye, EyeOff, Save, Info } from 'lucide-react';

interface ContactBarSectionProps {
  data?: {
    isEnabled: boolean;
    showPhone: boolean;
    showEmail: boolean;
  };
  companyInfo?: {
    phone: string;
    email: string;
  };
  onChange: (field: string, value: any) => void;
}

export const ContactBarSection: React.FC<ContactBarSectionProps> = ({ data, companyInfo, onChange }) => {
  const defaultData = {
    isEnabled: true,
    showPhone: true,
    showEmail: true,
  };

  const config = { ...defaultData, ...data };
  const displayPhone = companyInfo?.phone || '+48 61 307 09 91';
  const displayEmail = companyInfo?.email || 'kancelaria@rpms.pl';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight mb-2">Górna Belka Kontaktowa</h2>
          <p className="text-slate-400">Zarządzaj widocznością danych kontaktowych na samej górze strony.</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900 p-1 rounded-[var(--radius-brand-button)] border border-slate-800">
          <button
            onClick={() => onChange('isEnabled', true)}
            className={`px-4 py-2 rounded-[var(--radius-brand-button)] text-xs font-black uppercase tracking-widest transition-all ${config.isEnabled ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Włączona
          </button>
          <button
            onClick={() => onChange('isEnabled', false)}
            className={`px-4 py-2 rounded-[var(--radius-brand-button)] text-xs font-black uppercase tracking-widest transition-all ${!config.isEnabled ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Wyłączona
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Settings Card */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-[var(--radius-brand-card)] p-8 space-y-8">
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Info size={20} className="text-brand-blue" />
              Konfiguracja Wyświetlania
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => onChange('showPhone', !config.showPhone)}
                className={`flex flex-col items-center gap-3 p-6 rounded-[var(--radius-brand-button)] border transition-all ${config.showPhone ? 'bg-brand-blue/10 border-brand-blue/30 text-brand-blue' : 'bg-slate-800/50 border-slate-700 text-slate-500'}`}
              >
                {config.showPhone ? <Eye size={24} /> : <EyeOff size={24} />}
                <span className="text-[10px] font-black uppercase tracking-widest">Pokaż Telefon</span>
              </button>
              
              <button
                onClick={() => onChange('showEmail', !config.showEmail)}
                className={`flex flex-col items-center gap-3 p-6 rounded-[var(--radius-brand-button)] border transition-all ${config.showEmail ? 'bg-brand-blue/10 border-brand-blue/30 text-brand-blue' : 'bg-slate-800/50 border-slate-700 text-slate-500'}`}
              >
                {config.showEmail ? <Eye size={24} /> : <EyeOff size={24} />}
                <span className="text-[10px] font-black uppercase tracking-widest">Pokaż Email</span>
              </button>
            </div>
          </div>

          <div className="p-6 bg-brand-blue/5 border border-brand-blue/10 rounded-[var(--radius-brand-button)] space-y-4">
            <div className="flex items-center gap-3 text-brand-blue">
              <Save size={20} />
              <h4 className="font-bold">Źródło Danych</h4>
            </div>
            <p className="text-xs text-brand-blue/80 leading-relaxed">
              Treść numeru telefonu i adresu e-mail jest teraz zarządzana centralnie w sekcji <strong>Ustawienia Firmy</strong>. Tutaj decydujesz jedynie o ich widoczności w nagłówku strony.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Phone size={12} /> {displayPhone}
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Mail size={12} /> {displayEmail}
              </div>
            </div>
          </div>
        </div>

        {/* Preview Card */}
        <div className="space-y-6">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Podgląd na żywo</h3>
          <div className="bg-white rounded-[var(--radius-brand-card)] p-12 border border-slate-200 shadow-2xl relative overflow-hidden min-h-[300px] flex flex-col justify-center">
            <div className="absolute top-0 left-0 w-full h-1 bg-brand-blue/10"></div>
            
            {config.isEnabled ? (
              <div className="space-y-8">
                <div className="flex justify-start gap-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] pl-[76px] animate-in fade-in duration-500">
                  {config.showPhone && (
                    <div className="flex items-center gap-2 text-slate-500">
                      <Phone size={12} className="text-brand-blue" />
                      {displayPhone}
                    </div>
                  )}
                  {config.showEmail && (
                    <div className="flex items-center gap-2 text-slate-500">
                      <Mail size={12} className="text-brand-blue" />
                      {displayEmail}
                    </div>
                  )}
                  {!config.showPhone && !config.showEmail && (
                    <span className="text-slate-300 italic normal-case tracking-normal">Brak wybranych elementów do wyświetlenia</span>
                  )}
                </div>
                
                {/* Mock Header Content */}
                <div className="flex items-center gap-4 opacity-20 select-none">
                  <div className="w-10 h-10 bg-brand-navy rounded-lg"></div>
                  <div className="h-6 w-48 bg-brand-navy rounded"></div>
                  <div className="ml-auto flex gap-4">
                    <div className="h-4 w-20 bg-slate-200 rounded"></div>
                    <div className="h-4 w-20 bg-slate-200 rounded"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 space-y-4">
                <EyeOff size={48} className="opacity-20" />
                <p className="font-bold uppercase tracking-widest text-xs">Belka jest obecnie ukryta</p>
              </div>
            )}
          </div>
          
          <div className="bg-brand-blue/5 border border-brand-blue/10 rounded-[var(--radius-brand-button)] p-6">
            <p className="text-xs text-brand-blue/80 leading-relaxed">
              <strong>Wskazówka:</strong> Wyrównanie optyczne (pl-[76px]) jest stosowane automatycznie, aby dane kontaktowe idealnie zrównały się z tekstem logo "Windykacja".
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
