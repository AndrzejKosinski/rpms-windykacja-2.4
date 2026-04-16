import React from 'react';

interface TargetAudienceHeaderProps {
  title: string;
  description: string;
  onChange: (field: 'title' | 'description', value: string) => void;
}

export const TargetAudienceHeader: React.FC<TargetAudienceHeaderProps> = ({ title, description, onChange }) => {
  return (
    <div className="bg-[#0f172a] rounded-[var(--radius-brand-button)] p-6 border border-slate-800">
      <h3 className="text-lg font-bold text-white mb-6">Nagłówek Sekcji</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Główny Tytuł (H2)</label>
          <p className="text-xs text-slate-400 px-1 mb-2">Użyj znaczników <code className="text-brand-blue bg-brand-blue/10 px-1 rounded-[var(--radius-brand-button)]">[blue]tekst[/blue]</code> dla niebieskiego koloru z podkreśleniem oraz <code className="text-brand-blue bg-brand-blue/10 px-1 rounded-[var(--radius-brand-button)]">[br]</code> dla nowej linii.</p>
          <textarea
            value={title}
            onChange={(e) => onChange('title', e.target.value)}
            className="w-full bg-[#020617] border border-slate-800 rounded-[var(--radius-brand-input)] px-4 py-3 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Opis</label>
          <textarea
            value={description}
            onChange={(e) => onChange('description', e.target.value)}
            className="w-full bg-[#020617] border border-slate-800 rounded-[var(--radius-brand-input)] px-4 py-3 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};
