import React from 'react';
import { MessageSquare } from 'lucide-react';

interface OnboardingContactStatsProps {
  contactStats: {
    name: string;
    opens: number;
    submits: number;
  }[];
}

export const OnboardingContactStats: React.FC<OnboardingContactStatsProps> = ({ contactStats }) => {
  return (
    <div className="bg-[#0f172a] p-10 rounded-[var(--radius-brand-card)] border border-slate-800 shadow-2xl">
      <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
        <MessageSquare className="text-brand-blue" /> Kanały Kontaktu (Lead & Intent Analysis)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {contactStats.map((stat, i) => (
          <div key={i} className="bg-slate-900/50 p-6 rounded-[var(--radius-brand-card)] border border-slate-800">
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">{stat.name}</p>
            <div className="flex items-end gap-4">
              <div>
                <p className="text-3xl font-black text-white">{stat.submits}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Zgłoszenia</p>
              </div>
              <div className="h-10 w-px bg-slate-800"></div>
              <div>
                <p className="text-xl font-black text-slate-400">{stat.opens}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Otwarcia</p>
              </div>
              <div className="ml-auto">
                <p className="text-lg font-black text-brand-blue">
                  {stat.opens > 0 ? Math.round((stat.submits / stat.opens) * 100) : 0}%
                </p>
                <p className="text-[9px] font-bold text-slate-600 uppercase">Konwersja</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
