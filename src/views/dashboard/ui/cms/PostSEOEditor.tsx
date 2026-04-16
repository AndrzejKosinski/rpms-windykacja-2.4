import React from 'react';
import { Search, Sparkles, Loader2 } from 'lucide-react';
import { BlogPost } from '../../types/cms';

interface PostSEOEditorProps {
  post: BlogPost;
  index: number;
  isOptimizing: boolean;
  onFieldChange: (index: number, field: keyof BlogPost | keyof BlogPost['seo'], value: any, isSeo?: boolean) => void;
  onAIOptimize: (index: number) => void;
}

export const PostSEOEditor: React.FC<PostSEOEditorProps> = ({
  post,
  index,
  isOptimizing,
  onFieldChange,
  onAIOptimize
}) => {
  return (
    <div className="bg-slate-900/50 p-8 rounded-[var(--radius-brand-card)] border border-slate-800 space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Search size={14} /> Optymalizacja SEO Wpisu
        </h4>
        <button 
          onClick={() => onAIOptimize(index)}
          disabled={isOptimizing}
          className="flex items-center gap-2 px-3 py-1.5 bg-brand-blue/10 text-brand-blue border border-brand-blue/20 rounded-[var(--radius-brand-input)] text-[10px] font-black uppercase tracking-widest hover:bg-brand-blue hover:text-white transition-all disabled:opacity-50"
        >
          {isOptimizing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
          AI SEO Assistant
        </button>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">SEO Tytuł</label>
        <input 
          type="text" 
          value={post.seo?.title || ''}
          onChange={(e) => onFieldChange(index, 'title', e.target.value, true)}
          className="w-full bg-slate-900 border border-slate-800 rounded-[var(--radius-brand-button)] px-4 py-3 text-white text-sm font-bold focus:border-brand-blue outline-none transition-all"
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">SEO Opis</label>
        <textarea 
          rows={3}
          value={post.seo?.description || ''}
          onChange={(e) => onFieldChange(index, 'description', e.target.value, true)}
          className="w-full bg-slate-900 border border-slate-800 rounded-[var(--radius-brand-button)] px-4 py-3 text-white text-sm font-medium focus:border-brand-blue outline-none transition-all"
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tekst Alternatywny Zdjęcia (ALT)</label>
        <input 
          type="text" 
          value={post.imageAlt || ''}
          onChange={(e) => onFieldChange(index, 'imageAlt', e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-[var(--radius-brand-button)] px-4 py-3 text-white text-sm font-medium focus:border-brand-blue outline-none transition-all"
        />
        <p className="text-[9px] text-slate-500 font-bold">Opisz co jest na zdjęciu dla Google Grafika i czytników ekranu.</p>
      </div>
    </div>
  );
};
