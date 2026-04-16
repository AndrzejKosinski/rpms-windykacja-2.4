import React from 'react';
import { X, AlertTriangle, FileX, Info, ArrowRight } from 'lucide-react';
import { ValidationError } from './types';

interface ValidationReportModalProps {
  isOpen: boolean;
  errors: ValidationError[];
  onClose: () => void;
}

const ValidationReportModal: React.FC<ValidationReportModalProps> = ({ isOpen, errors, onClose }) => {
  if (!isOpen || errors.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-brand-navy/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="bg-white w-full max-w-lg rounded-[var(--radius-brand-card)] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 border border-red-100">
        <div className="bg-red-50 p-6 flex items-center gap-4 border-b border-red-100">
          <div className="w-12 h-12 bg-white rounded-[var(--radius-brand-button)] flex items-center justify-center text-red-500 shadow-sm">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-brand-navy leading-tight">Weryfikacja negatywna</h3>
            <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mt-0.5">Raport zgodności z wymogami Kancelarii</p>
          </div>
          <button onClick={onClose} className="ml-auto p-2 text-slate-400 hover:text-brand-navy transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          <p className="text-sm text-slate-500 font-medium mb-6 leading-relaxed">
            System odrzucił <span className="font-black text-brand-navy">{errors.length}</span> {errors.length === 1 ? 'załącznik' : 'załączniki'}, które nie spełniają standardów procesowych wymaganych do skutecznej windykacji:
          </p>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
            {errors.map((error, idx) => (
              <div key={idx} className="flex gap-4 p-4 bg-slate-50 rounded-[var(--radius-brand-button)] border border-slate-100 group hover:border-red-200 transition-colors">
                <div className="w-8 h-8 bg-white rounded-[var(--radius-brand-input)] flex items-center justify-center text-slate-400 shrink-0 shadow-sm group-hover:text-red-400">
                  <FileX size={16} />
                </div>
                <div>
                  <p className="text-[11px] font-black text-brand-navy truncate max-w-[280px]">{error.fileName}</p>
                  <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight mt-0.5">{error.reason}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-4">
            <button 
              onClick={onClose}
              className="w-full py-4 bg-brand-navy text-white rounded-[var(--radius-brand-button)] font-black text-xs uppercase tracking-widest hover:bg-brand-blue transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-navy/10"
            >
              Rozumiem, przejdź dalej <ArrowRight size={14} />
            </button>
            <div className="flex items-center gap-2 justify-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              <Info size={12} /> Akceptujemy wyłącznie faktury VAT w formacie PDF/JPG (max 5 str.)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidationReportModal;
