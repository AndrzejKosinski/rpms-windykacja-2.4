import React from 'react';
import { ArrowLeft, Save, Globe, FileText, Settings } from 'lucide-react';
import { Page } from '../../types/cms';
import { TiptapEditor } from './TiptapEditor';

interface PageEditorSectionProps {
  page: Page;
  onChange: (field: keyof Page | keyof Page['seo'], value: any, isSeo?: boolean) => void;
  onBack: () => void;
}

export const PageEditorSection: React.FC<PageEditorSectionProps> = ({
  page,
  onChange,
  onBack
}) => {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    onChange('title', newTitle);
    
    // Auto-generate slug if it's empty or matches the old title's slug
    if (!page.slug || page.slug === page.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')) {
      const newSlug = newTitle.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      onChange('slug', newSlug);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight mb-1">Edytor Podstrony</h2>
            <p className="text-slate-400">Zarządzaj treścią i ustawieniami podstrony.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-900 p-1 rounded-[var(--radius-brand-button)] border border-slate-800">
            <button
              onClick={() => onChange('isPublished', true)}
              className={`px-4 py-2 rounded-[var(--radius-brand-button)] text-xs font-black uppercase tracking-widest transition-all ${page.isPublished ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Opublikowana
            </button>
            <button
              onClick={() => onChange('isPublished', false)}
              className={`px-4 py-2 rounded-[var(--radius-brand-button)] text-xs font-black uppercase tracking-widest transition-all ${!page.isPublished ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Szkic
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Editor */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900/50 border border-slate-800 rounded-[var(--radius-brand-card)] p-8 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
              <FileText size={20} className="text-brand-blue" />
              Treść Podstrony
            </h3>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Tytuł strony</label>
              <input
                type="text"
                value={page.title}
                onChange={handleTitleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-[var(--radius-brand-button)] py-4 px-4 text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue transition-colors text-lg font-bold"
                placeholder="Np. Polityka Prywatności"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Treść (WYSIWYG)</label>
              <div className="bg-slate-800 border border-slate-700 rounded-[var(--radius-brand-button)] overflow-hidden">
                <TiptapEditor 
                  initialValue={page.content} 
                  onChange={(markdown) => onChange('content', markdown)} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-8">
          <div className="bg-slate-900/50 border border-slate-800 rounded-[var(--radius-brand-card)] p-8 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
              <Settings size={20} className="text-brand-blue" />
              Ustawienia
            </h3>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Adres URL (Slug)</label>
              <div className="flex items-center">
                <span className="bg-slate-800 border border-slate-700 border-r-0 rounded-l-[var(--radius-brand-button)] py-3 px-4 text-slate-500 font-mono text-sm">
                  rpms.pl/
                </span>
                <input
                  type="text"
                  value={page.slug}
                  onChange={(e) => onChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-r-[var(--radius-brand-button)] py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue transition-colors font-mono text-sm"
                  placeholder="polityka-prywatnosci"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-[var(--radius-brand-card)] p-8 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
              <Globe size={20} className="text-brand-blue" />
              SEO (Meta tagi)
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Meta Tytuł</label>
                <input
                  type="text"
                  value={page.seo?.title || ''}
                  onChange={(e) => onChange('title', e.target.value, true)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-[var(--radius-brand-button)] py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue transition-colors text-sm"
                  placeholder={page.title}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Meta Opis</label>
                <textarea
                  value={page.seo?.description || ''}
                  onChange={(e) => onChange('description', e.target.value, true)}
                  rows={4}
                  className="w-full bg-slate-800 border border-slate-700 rounded-[var(--radius-brand-button)] py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue transition-colors text-sm resize-none"
                  placeholder="Krótki opis strony dla wyszukiwarek..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
