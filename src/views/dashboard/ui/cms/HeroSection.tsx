import React from 'react';
import { Layout } from 'lucide-react';

interface HeroSectionProps {
  data: {
    badge: string;
    title: string;
    description: string;
  };
  onChange: (field: string, value: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ data, onChange }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-[var(--radius-brand-card)] p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-3">
          <Layout size={24} className="text-brand-blue" /> Treść Sekcji Hero
        </h2>
        <p className="text-slate-400 font-medium">Główny baner powitalny na stronie głównej.</p>
      </div>

      <div className="max-w-3xl space-y-8">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Badge (Mały napis nad tytułem)</label>
          <input 
            type="text" 
            value={data.badge}
            onChange={(e) => onChange('badge', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-[var(--radius-brand-button)] px-6 py-4 text-white font-bold focus:border-brand-blue outline-none transition-all"
          />
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Główny Tytuł (H1)</label>
            <p className="text-xs text-slate-400 px-1">Użyj znaczników <code className="text-brand-blue bg-brand-blue/10 px-1 rounded-[var(--radius-brand-button)]">[blue]tekst[/blue]</code> dla niebieskiego koloru z podkreśleniem oraz <code className="text-brand-blue bg-brand-blue/10 px-1 rounded-[var(--radius-brand-button)]">[br]</code> dla nowej linii.</p>
          </div>
          <input 
            type="text" 
            value={data.title}
            onChange={(e) => onChange('title', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-[var(--radius-brand-button)] px-6 py-4 text-white font-black text-xl focus:border-brand-blue outline-none transition-all"
          />
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Opis</label>
          <textarea 
            rows={3}
            value={data.description}
            onChange={(e) => onChange('description', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-[var(--radius-brand-button)] px-6 py-4 text-white font-medium focus:border-brand-blue outline-none transition-all resize-none"
          />
        </div>
      </div>
    </div>
  );
};
