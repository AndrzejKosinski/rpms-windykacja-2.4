import React from 'react';

interface TargetAudienceCTAProps {
  title: string;
  description: string;
  buttonText: string;
  onChange: (field: 'title' | 'description' | 'buttonText', value: string) => void;
}

export const TargetAudienceCTA: React.FC<TargetAudienceCTAProps> = ({ title, description, buttonText, onChange }) => {
  return (
    <div className="bg-[#0f172a] rounded-[var(--radius-brand-button)] p-6 border border-slate-800">
      <h3 className="text-lg font-bold text-white mb-6">Sekcja CTA (Call to Action)</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tytuł CTA</label>
          <input
            type="text"
            value={title}
            onChange={(e) => onChange('title', e.target.value)}
            className="w-full bg-[#020617] border border-slate-800 rounded-[var(--radius-brand-input)] px-4 py-3 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Opis CTA</label>
          <textarea
            value={description}
            onChange={(e) => onChange('description', e.target.value)}
            className="w-full bg-[#020617] border border-slate-800 rounded-[var(--radius-brand-input)] px-4 py-3 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tekst Przycisku</label>
          <input
            type="text"
            value={buttonText}
            onChange={(e) => onChange('buttonText', e.target.value)}
            className="w-full bg-[#020617] border border-slate-800 rounded-[var(--radius-brand-input)] px-4 py-3 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
          />
        </div>
      </div>
    </div>
  );
};
