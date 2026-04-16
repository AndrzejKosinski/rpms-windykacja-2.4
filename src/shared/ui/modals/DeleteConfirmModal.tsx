import React from 'react';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ 
  isOpen, onClose, onConfirm, isDeleting, title, message, confirmText 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-brand-navy/60 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={!isDeleting ? onClose : undefined} 
      />
      
      <div className="bg-white w-full max-w-md rounded-[var(--radius-brand-card)] shadow-2xl relative z-[10000] overflow-hidden animate-in zoom-in-95 duration-300 border border-red-100">
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <Trash2 size={32} />
            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20" />
          </div>
          
          <h3 className="text-2xl font-black text-brand-navy mb-4 italic">
            {title || 'Usuwanie elementu'}
          </h3>
          <p className="text-slate-500 font-medium leading-relaxed mb-8">
            {message || 'Czy na pewno chcesz wykonać tę operację? Tej czynności nie można cofnąć.'}
          </p>

          <div className="flex flex-col gap-3">
            <button 
              onClick={onConfirm}
              disabled={isDeleting}
              className="w-full py-4 bg-red-600 text-white rounded-[var(--radius-brand-button)] font-black text-sm uppercase tracking-widest shadow-xl shadow-red-200 hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isDeleting ? <Loader2 className="animate-spin" size={18} /> : (confirmText || 'Tak, usuń')}
            </button>
            <button 
              onClick={onClose}
              disabled={isDeleting}
              className="w-full py-4 bg-slate-50 text-slate-500 rounded-[var(--radius-brand-button)] font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all disabled:opacity-50"
            >
              Anuluj
            </button>
          </div>
        </div>

        <div className="bg-red-50 py-3 px-6 flex items-center justify-center gap-2 border-t border-red-100">
           <AlertTriangle size={14} className="text-red-500" />
           <span className="text-[10px] font-black text-red-600 uppercase tracking-tighter">Operacja destrukcyjna - brak możliwości przywrócenia</span>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
