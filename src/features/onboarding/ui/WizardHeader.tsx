import React from 'react';
import { X } from 'lucide-react';
import { WizardStep } from './types';

interface WizardHeaderProps {
  step: WizardStep;
  onClose: () => void;
}

export const WizardHeader: React.FC<WizardHeaderProps> = ({ step, onClose }) => {
  const getProgressWidth = () => {
    switch (step) {
      case 'entry': return '20%';
      case 'panel_intro': return '30%';
      case 'file_management': return '50%';
      case 'contact': return '70%';
      case 'thanks': return '90%';
      default: return '100%';
    }
  };

  return (
    <>
      <div className="w-full h-1 bg-slate-100 shrink-0">
         <div 
          className="h-full bg-brand-blue transition-all duration-700 shadow-[0_0_8px_rgba(19,127,236,0.3)]" 
          style={{ width: getProgressWidth() }}
         />
      </div>
      <button onClick={onClose} className="absolute top-6 md:top-8 right-6 md:right-10 p-2 text-slate-400 hover:text-brand-navy hover:bg-slate-50 rounded-full transition-all z-50">
        <X size={24} />
      </button>
    </>
  );
};
