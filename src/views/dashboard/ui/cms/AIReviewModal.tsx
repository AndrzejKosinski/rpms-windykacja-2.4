import React from 'react';
import { X, Sparkles, Check } from 'lucide-react';
import { SEOOptimizationResult, BlogPost } from '../../types/cms';

interface AIReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SEOOptimizationResult | null;
  currentPost: BlogPost | null;
  selectedFields: Record<string, boolean>;
  setSelectedFields: (fields: Record<string, boolean>) => void;
  onApply: () => void;
}

export const AIReviewModal: React.FC<AIReviewModalProps> = ({
  isOpen,
  onClose,
  data,
  currentPost,
  selectedFields,
  setSelectedFields,
  onApply
}) => {
  if (!isOpen || !data || !currentPost) return null;

  const fields = [
    { id: 'title', label: 'SEO Tytuł', current: currentPost.seo.title, suggested: data.title },
    { id: 'description', label: 'SEO Opis', current: currentPost.seo.description, suggested: data.description },
    { id: 'excerpt', label: 'Krótki Opis (Zajawka)', current: currentPost.excerpt, suggested: data.excerpt },
    { id: 'keywords', label: 'Słowa Kluczowe', current: currentPost.seo.keywords, suggested: data.keywords },
    { id: 'slug', label: 'Slug (URL)', current: currentPost.slug, suggested: data.slug },
    { id: 'imageAlt', label: 'Tekst ALT Zdjęcia', current: currentPost.imageAlt, suggested: data.imageAlt },
  ];

  const toggleField = (id: string) => {
    setSelectedFields({ ...selectedFields, [id]: !selectedFields[id] });
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[#020617]/95 backdrop-blur-xl" onClick={onClose} />
      <div className="relative w-full max-w-5xl bg-[#0f172a] border border-slate-800 rounded-[var(--radius-brand-card)] p-10 shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-blue rounded-[var(--radius-brand-button)] flex items-center justify-center text-white shadow-lg shadow-brand-blue/20">
              <Sparkles size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">AI SEO Assistant: Weryfikacja</h2>
              <p className="text-slate-500 text-sm font-medium">Przejrzyj i wybierz elementy do wdrożenia.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 pr-4 custom-scrollbar space-y-6">
          {fields.map((field) => (
            <div key={field.id} className="bg-slate-900/50 border border-slate-800 rounded-[var(--radius-brand-card)] p-6 hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between mb-4">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${selectedFields[field.id] ? 'bg-brand-blue' : 'bg-slate-700'}`}></div>
                  {field.label}
                </label>
                <button 
                  onClick={() => toggleField(field.id)}
                  className={`px-4 py-1.5 rounded-[var(--radius-brand-button)] text-[10px] font-black uppercase tracking-widest transition-all ${
                    selectedFields[field.id] 
                    ? 'bg-brand-blue text-white' 
                    : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {selectedFields[field.id] ? 'Zaakceptowano' : 'Odrzucono'}
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">Obecnie:</p>
                  <p className="text-sm text-slate-400 font-medium italic">{field.current || '(Brak)'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-brand-blue uppercase tracking-tighter">Sugestia AI:</p>
                  <p className="text-sm text-white font-bold">{field.suggested}</p>
                </div>
              </div>
            </div>
          ))}

          {/* FAQ Section in Review */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-[var(--radius-brand-card)] p-6 hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${selectedFields.faqs ? 'bg-brand-blue' : 'bg-slate-700'}`}></div>
                Sekcja FAQ (Pytania i Odpowiedzi)
              </label>
              <button 
                onClick={() => toggleField('faqs')}
                className={`px-4 py-1.5 rounded-[var(--radius-brand-button)] text-[10px] font-black uppercase tracking-widest transition-all ${
                  selectedFields.faqs 
                  ? 'bg-brand-blue text-white' 
                  : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                {selectedFields.faqs ? 'Zaakceptowano' : 'Odrzucono'}
              </button>
            </div>
            <div className="space-y-4">
              {data.faqs.map((faq, fidx) => (
                <div key={fidx} className="p-4 bg-slate-900 rounded-[var(--radius-brand-button)] border border-slate-800">
                  <p className="text-sm font-black text-white mb-1">{faq.question}</p>
                  <p className="text-xs text-slate-400 font-medium">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 px-8 py-4 bg-slate-800 text-slate-400 rounded-[var(--radius-brand-button)] font-black hover:bg-slate-700 transition-all"
          >
            Anuluj wszystko
          </button>
          <button 
            onClick={onApply}
            className="flex-[2] px-8 py-4 bg-brand-blue text-white rounded-[var(--radius-brand-button)] font-black hover:bg-brand-blue/90 transition-all shadow-xl shadow-brand-blue/20 flex items-center justify-center gap-3"
          >
            <Check size={20} /> Wdróż wybrane zmiany
          </button>
        </div>
      </div>
    </div>
  );
};
