import React, { useState } from 'react';
import Image from 'next/image';
import { 
  FileText, Trash2, Monitor, Smartphone, 
  Image as ImageIcon, AlertCircle, ChevronDown, ChevronUp, Settings, Globe, HelpCircle, ArrowLeft
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { BlogPost } from '../../types/cms';
import { FAQEditor } from './FAQEditor';
import { TiptapEditor } from './TiptapEditor';
import { PostSEOEditor } from './PostSEOEditor';

interface BlogPostEditorProps {
  post: BlogPost;
  index: number;
  previewMode: 'desktop' | 'mobile';
  setPreviewMode: (mode: 'desktop' | 'mobile') => void;
  editorTab: 'edit' | 'preview';
  setEditorTab: (tab: 'edit' | 'preview') => void;
  isOptimizing: boolean;
  onFieldChange: (index: number, field: keyof BlogPost | keyof BlogPost['seo'], value: any, isSeo?: boolean) => void;
  onDelete: (index: number) => void;
  onAIOptimize: (index: number) => void;
  onOpenImagePicker: (index: number) => void;
  renderSEOPreview: (title: string, description: string) => React.ReactNode;
  onBack: () => void;
}

export const BlogPostEditor: React.FC<BlogPostEditorProps> = ({
  post,
  index,
  previewMode,
  setPreviewMode,
  editorTab,
  setEditorTab,
  isOptimizing,
  onFieldChange,
  onDelete,
  onAIOptimize,
  onOpenImagePicker,
  renderSEOPreview,
  onBack
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    content: true,
    publishing: true,
    media: false,
    seo: false,
    faq: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight mb-1">Edytor Artykułu</h2>
            <p className="text-slate-400">
              {post.status === 'published' ? 'Opublikowany' : 'Szkic'} • Ostatnia edycja: {post.date || 'Brak'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-900 p-1 rounded-[var(--radius-brand-button)] border border-slate-800">
            <button 
              onClick={() => onFieldChange(index, 'status', 'draft')}
              className={`px-4 py-2 rounded-[var(--radius-brand-button)] text-xs font-black uppercase tracking-widest transition-all ${post.status !== 'published' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Szkic
            </button>
            <button 
              onClick={() => onFieldChange(index, 'status', 'published')}
              className={`px-4 py-2 rounded-[var(--radius-brand-button)] text-xs font-black uppercase tracking-widest transition-all ${post.status === 'published' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Publikuj
            </button>
          </div>
          <button 
            onClick={() => onDelete(index)}
            className="p-3 bg-red-500/10 text-red-500 rounded-[var(--radius-brand-button)] hover:bg-red-500 hover:text-white transition-colors"
            title="Usuń artykuł"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Main Layout: Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Main Workspace */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Content Section */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-[var(--radius-brand-card)] p-6">
            <div className="flex items-center gap-3 mb-6">
              <FileText size={20} className="text-brand-blue" />
              <h4 className="font-black text-base text-white">Treść Artykułu</h4>
            </div>
            
            <div className="space-y-6 flex-1 flex flex-col">
                {/* Title Input - Prominent */}
                <div className="space-y-2">
                  <textarea 
                    rows={2}
                    value={post.title}
                    onChange={(e) => {
                      onFieldChange(index, 'title', e.target.value);
                      if (!post.slug) {
                        const slug = e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                        onFieldChange(index, 'slug', slug);
                      }
                    }}
                    placeholder="Wprowadź tytuł artykułu..."
                    className="w-full bg-transparent border-none text-white font-black text-2xl lg:text-3xl placeholder:text-slate-700 focus:ring-0 outline-none px-0 py-2 resize-none overflow-hidden"
                  />
                </div>

                {/* Editor Tabs & Device Preview */}
                <div className="flex items-center justify-between bg-slate-950/50 p-2 rounded-[var(--radius-brand-button)] border border-slate-800">
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => setEditorTab('edit')}
                      className={`px-6 py-2.5 rounded-[var(--radius-brand-button)] text-xs font-black uppercase tracking-widest transition-all ${editorTab === 'edit' ? 'bg-brand-blue text-white shadow-md' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
                    >
                      Edytor Wizualny
                    </button>
                    <button 
                      onClick={() => setEditorTab('preview')}
                      className={`px-6 py-2.5 rounded-[var(--radius-brand-button)] text-xs font-black uppercase tracking-widest transition-all ${editorTab === 'preview' ? 'bg-brand-blue text-white shadow-md' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
                    >
                      Podgląd na żywo
                    </button>
                  </div>
                  
                  {editorTab === 'preview' && (
                    <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-[var(--radius-brand-button)] border border-slate-800">
                      <button 
                        onClick={() => setPreviewMode('desktop')}
                        className={`p-2 rounded-[var(--radius-brand-input)] transition-all ${previewMode === 'desktop' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:text-slate-400'}`}
                        title="Widok Desktop"
                      >
                        <Monitor size={16} />
                      </button>
                      <button 
                        onClick={() => setPreviewMode('mobile')}
                        className={`p-2 rounded-[var(--radius-brand-input)] transition-all ${previewMode === 'mobile' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:text-slate-400'}`}
                        title="Widok Mobile"
                      >
                        <Smartphone size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col min-h-[600px] bg-slate-950 border border-slate-800 rounded-[var(--radius-brand-card)] overflow-hidden relative">
                  {editorTab === 'edit' ? (
                    <TiptapEditor 
                      initialValue={post.content}
                      onChange={(markdown) => onFieldChange(index, 'content', markdown)}
                    />
                  ) : (
                    <div className={`w-full h-full bg-white text-brand-navy overflow-y-auto p-8 lg:p-12 prose prose-slate max-w-none ${previewMode === 'mobile' ? 'max-w-[400px] mx-auto border-x border-slate-200 shadow-2xl' : ''}`}>
                      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                        {post.content || '*Brak treści do wyświetlenia.*'}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
                
                {/* H1 Warning */}
                {editorTab === 'edit' && /(^|\n)#\s/.test(post.content) && (
                  <div className="flex items-start gap-3 text-amber-500 bg-amber-500/10 p-4 rounded-[var(--radius-brand-button)] border border-amber-500/20 animate-in slide-in-from-bottom-2">
                    <AlertCircle size={20} className="mt-0.5 shrink-0" />
                    <p className="text-sm font-medium leading-relaxed">
                      <strong className="font-black block mb-1">Uwaga SEO: Wykryto nagłówek H1 (#) w treści.</strong>
                      Tytuł artykułu jest już głównym nagłówkiem H1 na stronie. Ze względów optymalizacyjnych, w treści artykułu używaj tylko nagłówków H2 (##) i mniejszych.
                    </p>
                  </div>
                )}
              </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-[var(--radius-brand-card)] p-6">
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle size={20} className="text-amber-500" />
              <h4 className="font-black text-base text-white">Sekcja FAQ ({post.faqs?.length || 0})</h4>
            </div>
            
            <FAQEditor 
              faqs={post.faqs || []} 
              onChange={(newFaqs) => onFieldChange(index, 'faqs', newFaqs)} 
            />
          </div>

        </div>

        {/* Right Column: Sidebar Settings */}
        <div className="space-y-8">
          
          {/* Section 1: Publishing & Meta */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-[var(--radius-brand-card)] p-6">
            <div className="flex items-center gap-3 mb-6">
              <Settings size={18} className="text-brand-blue" />
              <span className="font-black text-sm uppercase tracking-widest text-white">Publikacja</span>
            </div>
            
            <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Slug (URL)</label>
                  <div className="flex items-center bg-slate-950 border border-slate-800 rounded-[var(--radius-brand-button)] overflow-hidden focus-within:border-brand-blue transition-colors">
                    <span className="pl-4 pr-2 py-3 text-slate-600 text-xs font-bold bg-slate-900 border-r border-slate-800">/blog/</span>
                    <input 
                      type="text" 
                      value={post.slug || ''}
                      onChange={(e) => onFieldChange(index, 'slug', e.target.value.toLowerCase().replace(/ /g, '-'))}
                      className="flex-1 bg-transparent px-3 py-3 text-white text-sm font-bold outline-none"
                      placeholder="przyjazny-adres-url"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Kategoria</label>
                  <select 
                    value={post.category}
                    onChange={(e) => onFieldChange(index, 'category', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-[var(--radius-brand-button)] px-4 py-3 text-white text-sm font-bold focus:border-brand-blue outline-none transition-all appearance-none"
                  >
                    <option value="Porady Prawne">Porady Prawne</option>
                    <option value="Windykacja">Windykacja</option>
                    <option value="Case Study">Case Study</option>
                    <option value="Aktualności">Aktualności</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Data Publikacji</label>
                  <input 
                    type="date" 
                    value={post.publishedAt || ''}
                    onChange={(e) => onFieldChange(index, 'publishedAt', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-[var(--radius-brand-button)] px-4 py-3 text-white text-sm font-bold focus:border-brand-blue outline-none transition-all"
                  />
                </div>
              </div>
          </div>

          {/* Section 2: Media & Excerpt */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-[var(--radius-brand-card)] p-6">
            <div className="flex items-center gap-3 mb-6">
              <ImageIcon size={18} className="text-purple-500" />
              <span className="font-black text-sm uppercase tracking-widest text-white">Media i Wstęp</span>
            </div>
            
            <div className="space-y-5">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Zdjęcie Wyróżniające</label>
                  <div className="relative group rounded-[var(--radius-brand-button)] overflow-hidden border border-slate-800 h-40 bg-slate-950">
                    {post.image ? (
                      <Image 
                        src={post.image} 
                        alt="Preview" 
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                        <ImageIcon size={32} className="mb-2 opacity-50" />
                        <span className="text-xs font-bold">Brak zdjęcia</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => onOpenImagePicker(index)}
                        className="px-4 py-2 bg-brand-blue text-white rounded-[var(--radius-brand-button)] font-bold text-xs flex items-center gap-2 hover:scale-105 transition-transform"
                      >
                        <ImageIcon size={14} /> Wybierz z Unsplash
                      </button>
                    </div>
                  </div>
                  <input 
                    type="text" 
                    value={post.image}
                    onChange={(e) => onFieldChange(index, 'image', e.target.value)}
                    placeholder="Lub wklej URL zdjęcia..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-[var(--radius-brand-button)] px-4 py-3 text-white text-xs font-medium focus:border-brand-blue outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Krótki Opis (Zajawka)</label>
                  <textarea 
                    rows={6}
                    value={post.excerpt}
                    onChange={(e) => onFieldChange(index, 'excerpt', e.target.value)}
                    placeholder="Krótkie streszczenie widoczne na liście artykułów..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-[var(--radius-brand-button)] px-4 py-3 text-white text-sm font-medium focus:border-brand-blue outline-none transition-all resize-none"
                  />
                </div>
              </div>
          </div>

          {/* SEO Optimization Section */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-[var(--radius-brand-card)] p-6">
            <div className="flex items-center gap-3 mb-6">
              <Globe size={20} className="text-emerald-500" />
              <h4 className="font-black text-base text-white">Optymalizacja SEO</h4>
            </div>
            
            <div className="space-y-8">
              <PostSEOEditor 
                post={post}
                index={index}
                isOptimizing={isOptimizing}
                onFieldChange={onFieldChange}
                onAIOptimize={onAIOptimize}
              />
              
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Podgląd w Google</label>
                <div className="p-6 bg-slate-950 rounded-[var(--radius-brand-button)] border border-slate-800/50">
                  {renderSEOPreview(post.seo?.title || post.title, post.seo?.description || post.excerpt)}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
