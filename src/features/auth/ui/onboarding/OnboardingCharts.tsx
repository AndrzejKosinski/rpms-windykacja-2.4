import React from 'react';
import dynamic from 'next/dynamic';
import { ArrowRight, MousePointer2 } from 'lucide-react';

const COLORS = ['#137fec', '#0a2e5c', '#64748b', '#94a3b8', '#e2e8f0'];

const FunnelChart = dynamic(() => import('../DashboardCharts').then(mod => mod.FunnelChart), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-slate-800/50 rounded-[var(--radius-brand-button)] flex items-center justify-center text-slate-400 text-sm font-bold">Ładowanie wykresu...</div>
});

const ChoicePieChart = dynamic(() => import('../DashboardCharts').then(mod => mod.ChoicePieChart), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-slate-800/50 rounded-full flex items-center justify-center text-slate-400 text-sm font-bold">Ładowanie...</div>
});

interface OnboardingChartsProps {
  funnelData: { name: string; value: number }[];
  choiceData: { name: string; value: number }[];
}

export const OnboardingCharts: React.FC<OnboardingChartsProps> = ({ funnelData, choiceData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Funnel Chart */}
      <div className="bg-[#0f172a] p-10 rounded-[var(--radius-brand-card)] border border-slate-800 shadow-2xl">
        <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
          <ArrowRight className="text-brand-blue" /> Lejek Konwersji Onboardingu
        </h3>
        <div className="h-[300px] w-full">
          <FunnelChart data={funnelData} />
        </div>
      </div>

      {/* Choice Distribution */}
      <div className="bg-[#0f172a] p-10 rounded-[var(--radius-brand-card)] border border-slate-800 shadow-2xl">
        <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
          <MousePointer2 className="text-brand-blue" /> Wybrane Metody (JTBD Choice)
        </h3>
        <div className="h-[300px] w-full flex items-center">
          <div className="w-full h-full">
            <ChoicePieChart data={choiceData} />
          </div>
          <div className="space-y-4 pr-10">
            {choiceData.map((d, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{d.name}</span>
                <span className="text-sm font-black text-white ml-auto">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
