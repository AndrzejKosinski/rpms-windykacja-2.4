import React from 'react';
import { RefreshCw } from 'lucide-react';

interface OnboardingHeaderProps {
  timeRange: 'all' | 'today' | '7d' | '30d';
  setTimeRange: (range: 'all' | 'today' | '7d' | '30d') => void;
  isLoading: boolean;
  onRefresh: () => void;
}

export const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  timeRange,
  setTimeRange,
  isLoading,
  onRefresh
}) => {
  return (
    <div className="flex justify-between items-end">
      <div>
        <h1 className="text-4xl font-black text-white italic tracking-tight">Onboarding <span className="text-brand-blue">Insights</span></h1>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-2">Analiza JTBD i ścieżek konwersji</p>
      </div>
      <div className="flex items-center gap-3 bg-slate-900 p-1.5 rounded-[var(--radius-brand-button)] border border-slate-800">
        {[
          { id: 'all', label: 'Wszystko' },
          { id: 'today', label: 'Dziś' },
          { id: '7d', label: '7 dni' },
          { id: '30d', label: '30 dni' }
        ].map(range => (
          <button
            key={range.id}
            onClick={() => setTimeRange(range.id as any)}
            className={`px-6 py-2.5 rounded-[var(--radius-brand-button)] text-[10px] font-black transition-all ${
              timeRange === range.id 
              ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' 
              : 'text-slate-500 hover:text-white'
            }`}
          >
            {range.label}
          </button>
        ))}
        <div className="w-px h-6 bg-slate-800 mx-1"></div>
        <button 
          onClick={onRefresh} 
          className="p-2.5 text-slate-500 hover:text-brand-blue transition-all"
          title="Odśwież dane"
        >
          <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>
    </div>
  );
};
