import React from 'react';
import { HelpCircle, Plus, Trash2 } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQEditorProps {
  faqs: FAQ[];
  onChange: (faqs: FAQ[]) => void;
}

export const FAQEditor: React.FC<FAQEditorProps> = ({ faqs = [], onChange }) => {
  const handleAddFaq = () => {
    onChange([...faqs, { question: '', answer: '' }]);
  };

  const handleRemoveFaq = (index: number) => {
    const newFaqs = [...faqs];
    newFaqs.splice(index, 1);
    onChange(newFaqs);
  };

  const handleChangeFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    onChange(newFaqs);
  };

  return (
    <div className="bg-slate-900/50 p-8 rounded-[var(--radius-brand-card)] border border-slate-800 space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <HelpCircle size={14} /> Sekcja FAQ (Pytania i Odpowiedzi)
        </h4>
        <button 
          onClick={handleAddFaq}
          className="flex items-center gap-2 px-3 py-1.5 bg-brand-blue/10 text-brand-blue border border-brand-blue/20 rounded-[var(--radius-brand-input)] text-[10px] font-black uppercase tracking-widest hover:bg-brand-blue hover:text-white transition-all"
        >
          <Plus size={12} /> Dodaj Pytanie
        </button>
      </div>
      
      {faqs.length === 0 ? (
        <p className="text-sm text-slate-500 italic text-center py-4">Brak pytań FAQ. Dodaj pierwsze pytanie, aby poprawić SEO artykułu.</p>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-4 bg-slate-900 rounded-[var(--radius-brand-button)] border border-slate-800 relative group">
              <button 
                onClick={() => handleRemoveFaq(idx)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                title="Usuń pytanie"
              >
                <Trash2 size={12} />
              </button>
              <div className="space-y-3">
                <input 
                  type="text" 
                  value={faq.question}
                  onChange={(e) => handleChangeFaq(idx, 'question', e.target.value)}
                  placeholder="Pytanie (np. Jakie są koszty windykacji?)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-[var(--radius-brand-button)] px-4 py-3 text-white text-sm font-bold focus:border-brand-blue outline-none transition-all"
                />
                <textarea 
                  rows={2}
                  value={faq.answer}
                  onChange={(e) => handleChangeFaq(idx, 'answer', e.target.value)}
                  placeholder="Odpowiedź..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-[var(--radius-brand-button)] px-4 py-3 text-white text-sm font-medium focus:border-brand-blue outline-none transition-all resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
