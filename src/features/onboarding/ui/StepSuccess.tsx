import React from 'react';
import { Check, ArrowRight, ShieldCheck, Zap, Clock, Star } from 'lucide-react';

interface StepSuccessProps {
  onContinue: () => void;
  userStatus: 'NEW' | 'RETURNING' | 'AUTHENTICATED';
}

const StepSuccess: React.FC<StepSuccessProps> = ({ onContinue, userStatus }) => {
  const getCtaContent = () => {
    switch (userStatus) {
      case 'AUTHENTICATED':
        return {
          btnText: "Wejdź do Panelu Spraw",
          description: "Zgłoszenie zostało pomyślnie dodane. Przejdź do swojego Dashboardu, aby śledzić szczegóły analizy merytorycznej i kolejne kroki prawne."
        };
      case 'RETURNING':
        return {
          btnText: "Ustaw hasło do Panelu",
          description: "Twoje cyfrowe biuro windykacyjne jest już gotowe. Aktywuj dostęp, aby monitorować statusy wszystkich swoich faktur w jednym miejscu."
        };
      default:
        return {
          btnText: "Aktywuj Panel Spraw",
          description: "Zyskaj stały podgląd na postępy windykacji w czasie rzeczywistym oraz wygodną ścieżkę dodawania kolejnych spraw w przyszłości."
        };
    }
  };

  const cta = getCtaContent();

  const liquidFlowStyle = {
    backgroundColor: '#ffffff',
    backgroundImage: `
      url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' viewBox='0 0 1000 1000' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'%3E%3Cpath d='M-100 300 C 200 150, 400 500, 1100 200' fill='none' stroke='%2322c55e' stroke-opacity='0.05' stroke-width='1.5'/%3E%3Cpath d='M-100 500 C 300 300, 600 700, 1100 400' fill='none' stroke='%23137fec' stroke-opacity='0.03' stroke-width='1.2'/%3E%3C/svg%3E"),
      radial-gradient(at 50% 50%, rgba(34, 197, 94, 0.05) 0px, transparent 50%)
    `,
    backgroundSize: '100% 100%',
    backgroundAttachment: 'local'
  };

  return (
    <div 
      className="flex flex-col items-center justify-center h-full -mx-6 md:-mx-12 -mt-8 md:-mt-10 -mb-10 px-6 md:px-12 pt-8 md:pt-10 text-center relative overflow-hidden"
      style={liquidFlowStyle}
    >
      {/* Animowana Ikona Sukcesu */}
      <div className="relative mb-6 md:mb-8 group">
        <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
        <div className="relative w-16 h-16 md:w-20 md:h-20 bg-green-500 text-white rounded-[var(--radius-brand-button)] md:rounded-[var(--radius-brand-card)] flex items-center justify-center shadow-2xl shadow-green-200 transform animate-in zoom-in-50 duration-700">
          {/* Fixed invalid md:size prop by removing it and using Tailwind classes for responsive sizing */}
          <Check strokeWidth={3} className="w-9 h-9 md:w-10 md:h-10 animate-in slide-in-from-bottom-2 duration-1000" />
        </div>
        <div className="absolute -top-2 -right-2 bg-amber-400 text-white p-1.5 rounded-[var(--radius-brand-input)] shadow-lg animate-bounce">
          <Star size={14} fill="white" />
        </div>
      </div>

      <h2 className="text-3xl md:text-4xl font-black text-brand-navy mb-3 md:mb-4 tracking-tight">
        Przyjęliśmy zgłoszenie!
      </h2>
      <p className="text-slate-500 font-medium text-xs md:text-base max-w-md mx-auto mb-8 md:mb-10 leading-relaxed">
        Twój osobisty opiekun prawny rozpoczyna weryfikację dokumentów. Pierwsze efekty zobaczysz w ciągu <span className="text-brand-blue font-black underline decoration-brand-blue/20 underline-offset-4">15 minut</span>.
      </p>

      {/* Jednolity Mapa drogowa */}
      <div className="w-full max-w-lg grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-10 relative">
        <div className="absolute top-1/2 left-0 w-full h-px bg-slate-100 hidden md:block -z-10"></div>
        
        {[
          { icon: <ShieldCheck size={18} />, label: "Weryfikacja zgłoszenia", status: "Wykonano", active: true, done: true },
          { icon: <Zap size={18} />, label: "Analiza merytoryczna", status: "W toku", active: true, done: false },
          { icon: <Clock size={18} />, label: "Start windykacji", status: "~15 min", active: false, done: false }
        ].map((step, idx) => (
          <div key={idx} className={`p-4 rounded-[var(--radius-brand-button)] border bg-white shadow-sm flex flex-col items-center transition-all ${step.active ? 'border-brand-blue/30 scale-105' : 'border-slate-100 opacity-60'}`}>
            <div className={`w-9 h-9 md:w-10 md:h-10 rounded-[var(--radius-brand-button)] flex items-center justify-center mb-2 ${step.active ? (step.done ? 'bg-green-50 text-green-600' : 'bg-brand-blue/10 text-brand-blue') : 'bg-slate-50 text-slate-300'}`}>
              {step.done ? <Check size={18} /> : step.icon}
            </div>
            <p className="text-[9px] md:text-[10px] font-black text-brand-navy uppercase tracking-widest leading-tight mb-1">{step.label}</p>
            <p className={`text-[8px] md:text-[9px] font-bold uppercase ${step.done ? 'text-green-600' : step.active ? 'text-brand-blue' : 'text-slate-400'}`}>
              {step.status}
            </p>
          </div>
        ))}
      </div>

      {/* Dynamiczna Karta Aktywacji Panelu */}
      <div className="w-full max-w-md p-6 md:p-8 bg-white rounded-[var(--radius-brand-card)] border border-slate-100 shadow-[0_32px_64px_-16px_rgba(10,46,92,0.12)] relative group mb-6">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-navy text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">
           TWÓJ PANEL KONTROLI
        </div>
        <p className="text-slate-500 text-xs md:text-sm mb-6 md:mb-8 font-medium leading-relaxed px-2">
          {cta.description}
        </p>
        <button 
          onClick={onContinue}
          className="w-full py-4 md:py-5 bg-brand-navy text-white rounded-[var(--radius-brand-button)] font-black text-xs md:text-sm uppercase tracking-widest shadow-xl shadow-brand-navy/20 hover:bg-brand-blue hover:shadow-brand-blue/30 transition-all flex items-center justify-center gap-3 active:scale-95 group"
        >
          {cta.btnText} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="mt-4 md:mt-6 flex items-center gap-3 opacity-50 pb-8">
        <ShieldCheck size={14} className="text-slate-400" />
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Standard Bezpieczeństwa ISO/LegalTech</span>
      </div>
    </div>
  );
};

export default StepSuccess;
