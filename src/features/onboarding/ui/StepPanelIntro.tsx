import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight,
  Zap, 
  Layers,
  Gavel,
  CheckCircle2,
  Users,
  Layout,
  Sparkles,
  Clock
} from 'lucide-react';

interface StepPanelIntroProps {
  onContinue: () => void;
  onBack: () => void;
  onLogin?: () => void;
  onRegister?: () => void;
}

const StepPanelIntro: React.FC<StepPanelIntroProps> = ({ onContinue, onBack, onLogin, onRegister }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      title: "Centrum Twoich spraw",
      desc: "Zarządzaj setkami faktur, monitoruj postępy prawników i kontroluj spłaty w jednym, przejrzystym kokpicie klasy Enterprise.",
      icon: <Layout className="text-brand-blue/80" size={32} />,
      visual: (
        <div className="relative w-full h-48 bg-white/5 rounded-[var(--radius-brand-card)] border border-white/10 overflow-hidden mt-6 shadow-2xl">
          <div className="p-5 space-y-4">
             <div className="flex justify-between items-center">
                <div className="h-2 w-24 bg-white/20 rounded-[var(--radius-brand-button)]"></div>
                <div className="h-5 w-16 bg-brand-blue rounded-[var(--radius-brand-input)]"></div>
             </div>
             <div className="grid grid-cols-3 gap-3">
                <div className="h-16 bg-white/5 rounded-[var(--radius-brand-button)] border border-white/5 p-3">
                   <div className="h-1 w-8 bg-white/10 rounded-[var(--radius-brand-button)] mb-2"></div>
                   <div className="h-3 w-12 bg-white/30 rounded-[var(--radius-brand-button)]"></div>
                </div>
                <div className="h-16 bg-white/5 rounded-[var(--radius-brand-button)] border border-white/5 p-3">
                   <div className="h-1 w-8 bg-white/10 rounded-[var(--radius-brand-button)] mb-2"></div>
                   <div className="h-3 w-12 bg-green-400/40 rounded-[var(--radius-brand-button)]"></div>
                </div>
                <div className="h-20 bg-brand-blue/20 rounded-[var(--radius-brand-button)] border border-brand-blue/20 p-3">
                   <div className="h-1 w-8 bg-brand-blue/30 rounded-[var(--radius-brand-button)] mb-2"></div>
                   <div className="h-3 w-12 bg-white/40 rounded-[var(--radius-brand-button)]"></div>
                </div>
             </div>
          </div>
        </div>
      )
    },
    {
      title: "Inteligentny import Faktur",
      desc: "System automatycznie mapuje dane z Twoich plików PDF/JPG, eliminując ryzyko błędów ręcznych i oszczędzając Twój czas.",
      icon: <Zap className="text-brand-blue/80" size={32} />,
      visual: (
        <div className="relative w-full h-48 mt-6 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/20 to-transparent rounded-[var(--radius-brand-card)]"></div>
          <div className="relative w-4/5 h-36 bg-white rounded-[var(--radius-brand-button)] shadow-2xl p-5 border border-slate-200 overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-brand-blue animate-scan"></div>
             <div className="space-y-3 pt-1">
                <div className="flex gap-3 items-center">
                   <div className="w-8 h-8 rounded-[var(--radius-brand-button)] bg-slate-100 flex items-center justify-center text-brand-blue"><Sparkles size={16} /></div>
                   <div className="space-y-1">
                      <div className="h-1.5 w-20 bg-slate-200 rounded-[var(--radius-brand-button)]"></div>
                      <div className="h-1.5 w-12 bg-slate-100 rounded-[var(--radius-brand-button)]"></div>
                   </div>
                </div>
                <div className="h-10 bg-brand-blue/5 rounded-[var(--radius-brand-button)] border border-brand-blue/20 flex items-center px-4">
                   <span className="text-[9px] font-black text-brand-blue uppercase tracking-widest">Wykryto NIP: 525-000-00-00</span>
                </div>
             </div>
          </div>
        </div>
      )
    },
    {
      title: "Obsługa masowa",
      desc: "Zarządzaj całymi pakietami wierzytelności. Jeden import – dziesiątki spraw w toku jednocześnie pod pełną kontrolą prawników.",
      icon: <Layers className="text-brand-blue/80" size={32} />,
      visual: (
        <div className="relative w-full h-48 mt-6 p-5 bg-white/5 rounded-[var(--radius-brand-card)] border border-white/10">
           <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className={`flex items-center gap-3 p-2 rounded-[var(--radius-brand-button)] border border-white/10 ${i === 1 ? 'bg-brand-blue/20 border-brand-blue/30' : 'bg-white/5 opacity-50'}`}>
                   <div className={`w-4 h-4 rounded-[var(--radius-brand-button)] border ${i === 1 ? 'bg-brand-blue border-brand-blue text-white' : 'border-white/20'} flex items-center justify-center`}>
                      {i === 1 && <CheckCircle2 size={10} />}
                   </div>
                   <div className="flex-1 h-1.5 bg-white/20 rounded-[var(--radius-brand-button)]"></div>
                   <div className="w-10 h-1.5 bg-white/10 rounded-[var(--radius-brand-button)]"></div>
                </div>
              ))}
              <div className="flex justify-end pt-1">
                 <div className="px-3 py-1.5 bg-brand-blue rounded-[var(--radius-brand-input)] text-[8px] font-black uppercase tracking-widest shadow-xl">Zleć masowo (24)</div>
              </div>
           </div>
        </div>
      )
    },
    {
      title: "Szybka Ścieżka EPU",
      desc: "Gdy dłużnik nie reaguje na wezwanie, możesz zlecić skierowanie sprawy do e-sądu w ciągu 24h. Nasz prawnik opracuje zgłoszenie.",
      icon: <Gavel className="text-brand-blue/80" size={32} />,
      visual: (
        <div className="relative w-full h-48 mt-6 flex flex-col items-center justify-center p-6 bg-brand-blue/10 border border-brand-blue/20 rounded-[var(--radius-brand-card)]">
           <div className="w-12 h-12 bg-white rounded-[var(--radius-brand-button)] shadow-2xl flex items-center justify-center text-brand-navy mb-4 transform -rotate-6">
              <Gavel size={24} />
           </div>
           <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-2xl border border-white flex items-center gap-2">
              <Clock size={14} className="text-brand-blue animate-pulse" />
              <span className="text-[9px] font-black text-brand-navy uppercase tracking-widest">Weryfikacja prawnika {"<"} 24h</span>
           </div>
        </div>
      )
    }
  ];

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);

  const handleManualNav = (index: number) => {
    setActiveSlide(index);
    setIsPaused(true);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full overflow-hidden animate-in fade-in duration-700">
      
      {/* LEWA SEKCOJA: TREŚĆ I FORMULARZ */}
      <div className="lg:w-1/2 bg-white p-6 md:p-8 lg:p-10 flex flex-col relative h-full">
        <div className="max-w-md w-full mx-auto lg:mx-0">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-brand-blue transition-colors group mb-4 md:mb-6 outline-none focus:ring-2 focus:ring-brand-blue rounded-[var(--radius-brand-input)] py-2 px-3 -ml-3 w-fit"
          >
            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Wróć do wyboru metody</span>
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-light-blue text-brand-blue text-[9px] font-black uppercase tracking-widest mb-6 shadow-sm border border-brand-blue/10">
            <ShieldCheck size={12} className="fill-brand-blue text-white" /> BEZPIECZNY PANEL RPMS
          </div>

          <h3 className="text-3xl lg:text-4xl xl:text-5xl font-black text-brand-navy mb-6 tracking-tight leading-[1.15]">
            Odzyskaj <span className="text-brand-blue relative">
              kontrolę
              <svg className="absolute -bottom-2 left-0 w-full h-2 text-brand-blue/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 25 0, 50 5 T 100 5" stroke="currentColor" strokeWidth="12" fill="none" />
              </svg>
            </span> <br /> nad swoimi należnościami
          </h3>
          
          <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed mb-8 max-w-sm">
            Dodaj fakturę, a zespół prawny RPMS natychmiast rozpocznie windykację. Nasi prawnicy przygotują strategię i oficjalne wezwania, a Ty monitorujesz każdy postęp i działania procesowe 24/7 w swoim Panelu.
          </p>

          <div className="space-y-10">
            <button 
              onClick={onRegister || onContinue}
              className="w-full py-5 bg-brand-blue text-white rounded-[var(--radius-brand-button)] font-black text-lg xl:text-xl shadow-xl shadow-brand-blue/20 hover:bg-brand-navy hover:scale-[1.01] transition-all flex items-center justify-center gap-4 group active:scale-95"
            >
              Uzyskaj bezpłatny dostęp <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center justify-between border-t border-slate-100 pt-8">
               <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[var(--radius-brand-button)] bg-slate-50 flex items-center justify-center text-brand-blue shadow-sm">
                    <Users size={16} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Dołącz do 1200+ firm</span>
               </div>
               
               <p className="text-xs text-slate-400 font-bold">
                Masz już konto?{' '}
                <button 
                  onClick={onLogin}
                  className="text-brand-blue font-black hover:underline focus:outline-none ml-1 uppercase text-[10px] tracking-widest"
                >
                  Zaloguj się
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PRAWA SEKCOJA (50%): FULL-BLEED SLIDER */}
      <div className="lg:w-1/2 bg-brand-navy flex flex-col relative overflow-hidden text-white group/slider h-full">
        {/* Dekoracje tła */}
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-blue/20 rounded-full blur-[140px] translate-x-1/4 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-blue/10 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />
        </div>

        {/* Kontent Slidera */}
        <div className="flex-1 flex flex-col justify-center p-10 md:p-12 lg:p-16 relative z-10 w-full h-full">
          <div key={activeSlide} className="animate-in fade-in slide-in-from-right-8 duration-700 w-full max-w-lg mx-auto">
            <div className="mb-6 p-4 bg-white/5 rounded-[var(--radius-brand-button)] w-fit border border-white/10 shadow-2xl backdrop-blur-sm">
              {slides[activeSlide].icon}
            </div>
            <h2 className="text-2xl md:text-3xl font-black mb-3 tracking-tight leading-tight" style={{ color: 'var(--color-text-inverse)' }}>
              {slides[activeSlide].title}
            </h2>
            <p className="text-sm md:text-base font-medium leading-relaxed mb-1" style={{ color: 'var(--color-text-inverse)', opacity: 0.7 }}>
              {slides[activeSlide].desc}
            </p>
            
            {slides[activeSlide].visual}
          </div>

          {/* Nawigacja Strzałki */}
          <div className="absolute inset-y-0 left-4 right-4 flex items-center justify-between pointer-events-none opacity-0 group-hover/slider:opacity-100 transition-opacity">
            <button 
              onClick={() => { prevSlide(); setIsPaused(true); }}
              className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-brand-blue transition-all pointer-events-auto shadow-2xl active:scale-90"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => { nextSlide(); setIsPaused(true); }}
              className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-brand-blue transition-all pointer-events-auto shadow-2xl active:scale-90"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Pasek postępu u dołu */}
        <div className="px-10 md:px-12 lg:p-16 pt-0 pb-12 flex items-center gap-3 z-10 w-full">
          {slides.map((_, i) => (
            <div 
              key={i} 
              onClick={() => handleManualNav(i)}
              className="flex-1 h-1 bg-white/10 rounded-full cursor-pointer overflow-hidden group/dot relative"
            >
              <div 
                className={`h-full bg-brand-blue transition-all ${i === activeSlide ? 'w-full' : 'w-0'}`}
                style={{ 
                  transitionDuration: i === activeSlide && !isPaused ? '5000ms' : '300ms', 
                  transitionTimingFunction: 'linear' 
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(120px); }
          100% { transform: translateY(0); }
        }
        .animate-scan {
          animation: scan 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default StepPanelIntro;
