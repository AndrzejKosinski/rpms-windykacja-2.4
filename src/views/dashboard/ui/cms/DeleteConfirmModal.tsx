import React from 'react';
import { Trash2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[#020617]/90 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0f172a] border border-slate-800 rounded-[var(--radius-brand-card)] p-10 shadow-2xl animate-in zoom-in duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-[var(--radius-brand-card)] flex items-center justify-center mb-6 shadow-lg shadow-red-500/10">
            <Trash2 size={40} />
          </div>
          <h2 className="text-2xl font-black text-white mb-4">{title}</h2>
          <p className="text-slate-400 font-medium mb-8">
            {description || (
              <>Czy na pewno chcesz usunąć artykuł <span className="text-white font-bold">"{title}"</span>? Tej operacji nie można cofnąć.</>
            )}
          </p>
          <div className="flex gap-4 w-full">
            <button 
              onClick={onClose}
              className="flex-1 px-6 py-4 bg-slate-800 text-slate-400 rounded-[var(--radius-brand-button)] font-black hover:bg-slate-700 transition-all"
            >
              Anuluj
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 px-6 py-4 bg-red-500 text-white rounded-[var(--radius-brand-button)] font-black hover:bg-red-600 transition-all shadow-xl shadow-red-500/20"
            >
              Usuń trwale
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
