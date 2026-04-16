import React from 'react';
import { Globe, Search } from 'lucide-react';
import { SEOData } from '../../types/cms';

interface SEOSectionProps {
  type: 'home' | 'blog';
  data: SEOData;
  onChange: (field: string, value: string) => void;
  renderPreview: (title: string, description: string) => React.ReactNode;
}

export const SEOSection: React.FC<SEOSectionProps> = ({ 
  type, 
  data, 
  onChange, 
  renderPreview 
}) => {
  const isHome = type === 'home';
  const Icon = isHome ? Globe : Search;
  const title = isHome ? 'SEO Strona Główna' : 'SEO Listy Artykułów (Blog)';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-[var(--radius-brand-card)] p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-3">
          <Icon size={24} className="text-brand-blue" /> {title}
        </h2>
        <p className="text-slate-400 font-medium">Zoptymalizuj widoczność tej strony w wyszukiwarkach.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Tytuł SEO (Meta Title)</label>
            <input 
              type="text" 
              value={data.title}
              onChange={(e) => onChange('title', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-[var(--radius-brand-button)] px-6 py-4 text-white font-bold focus:border-brand-blue outline-none transition-all"
              placeholder="Wprowadź tytuł..."
            />
            <div className="flex justify-between text-[10px] font-bold">
              <span className={data.title.length > 60 ? 'text-red-500' : 'text-slate-500'}>{data.title.length} / 60 znaków</span>
              <span className="text-slate-500 italic">Zalecane: 50-60</span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Opis SEO (Meta Description)</label>
            <textarea 
              value={data.description}
              onChange={(e) => onChange('description', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-[var(--radius-brand-button)] px-6 py-4 text-white font-bold focus:border-brand-blue outline-none transition-all min-h-[120px] resize-none"
              placeholder="Wprowadź opis..."
            />
            <div className="flex justify-between text-[10px] font-bold">
              <span className={data.description.length > 160 ? 'text-red-500' : 'text-slate-500'}>{data.description.length} / 160 znaków</span>
              <span className="text-slate-500 italic">Zalecane: 120-160</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Podgląd w Google</label>
          <div className="p-2 bg-slate-950 rounded-[var(--radius-brand-card)] border border-slate-800/50">
            {renderPreview(data.title, data.description)}
          </div>
        </div>
      </div>
    </div>
  );
};
