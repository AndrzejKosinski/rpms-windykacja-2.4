import React from 'react';
import { Smartphone, Monitor, Tablet as TabletIcon } from 'lucide-react';

interface OnboardingDeviceStatsProps {
  deviceStats: {
    type: string;
    count: number;
    completed: number;
    rate: number;
  }[];
}

export const OnboardingDeviceStats: React.FC<OnboardingDeviceStatsProps> = ({ deviceStats }) => {
  return (
    <div className="bg-[#0f172a] p-10 rounded-[var(--radius-brand-card)] border border-slate-800 shadow-2xl">
      <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
        <Smartphone className="text-brand-blue" /> Urządzenia i Kontekst (Device Intelligence)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {deviceStats.map((stat, i) => (
          <div key={i} className="bg-slate-900/50 p-8 rounded-[var(--radius-brand-card)] border border-slate-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              {stat.type === 'Desktop' && <Monitor size={80} />}
              {stat.type === 'Mobile' && <Smartphone size={80} />}
              {stat.type === 'Tablet' && <TabletIcon size={80} />}
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-brand-blue/10 rounded-[var(--radius-brand-button)] flex items-center justify-center text-brand-blue">
                  {stat.type === 'Desktop' && <Monitor size={20} />}
                  {stat.type === 'Mobile' && <Smartphone size={20} />}
                  {stat.type === 'Tablet' && <TabletIcon size={20} />}
                </div>
                <span className="text-sm font-black text-white uppercase tracking-widest">{stat.type}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-black text-white">{stat.count}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Wszystkie sesje</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-brand-blue">{stat.rate}%</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Konwersja</p>
                </div>
              </div>

              <div className="mt-6 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-blue transition-all duration-1000" 
                  style={{ width: `${stat.rate}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
