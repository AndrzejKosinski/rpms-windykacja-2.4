
import React, { useState, useEffect } from 'react';
import { X, TrendingUp, ArrowRight, Zap, ShieldCheck } from 'lucide-react';

interface TimedCTAPopupProps {
  onStart: (source?: string) => void;
}

const TimedCTAPopup: React.FC<TimedCTAPopupProps> = ({ onStart }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem('hasSeenTimedPopup');
    
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        sessionStorage.setItem('hasSeenTimedPopup', 'true');
      }, 30000); // 30 sekund

      return () => clearTimeout(timer);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 left-8 z-[250] max-w-[420px] w-full animate-in slide-in-from-left-full duration-700">
      <div className="bg-white rounded-[var(--radius-brand-card)] shadow-[0_30px_60px_-15px_rgba(10,46,92,0.25)] border border-slate-100 overflow-hidden relative">
        {/* Dekoracyjny pasek u góry */}
        <div className="h-2 w-full bg-gradient-to-r from-brand-blue to-brand-navy"></div>
        
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 p-2 text-slate-300 hover:text-brand-navy hover:bg-slate-50 rounded-full transition-all"
        >
          <X size={18} />
        </button>

        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-brand-light-blue rounded-[var(--radius-brand-button)] flex items-center justify-center text-brand-blue">
              <Zap size={20} className="fill-brand-blue" />
            </div>
            <span className="text-[11px] font-black text-brand-blue uppercase tracking-[0.2em]">Szybka weryfikacja</span>
          </div>

          <h3 className="text-2xl font-black text-brand-navy mb-3 leading-tight">
            Nie czekaj, aż Twój <br />
            dług <span className="text-brand-blue">"wystygnie"</span>.
          </h3>
          
          <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
            Statystycznie szansa na odzyskanie pieniędzy spada o <span className="font-black text-brand-navy">1.5% z każdym dniem zwłoki</span>. Sprawdź dłużnika teraz bez zobowiązań.
          </p>

          <div className="bg-slate-50 rounded-[var(--radius-brand-button)] p-4 mb-8 flex items-center gap-4 border border-slate-100">
            <TrendingUp className="text-green-500 shrink-0" size={24} />
            <div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Twoja korzyść</p>
              <p className="text-xs font-bold text-brand-navy">92% skuteczności w sprawach do 30 dni</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={() => {
                setIsVisible(false);
                onStart('timed_popup_cta');
              }}
              className="w-full py-4 bg-brand-navy text-white rounded-[var(--radius-brand-button)] font-black text-sm shadow-xl shadow-brand-navy/20 hover:bg-brand-blue transition-all flex items-center justify-center gap-2"
            >
              Dodaj fakturę <ArrowRight size={16} />
            </button>
            <button 
              onClick={() => setIsVisible(false)}
              className="w-full py-3 text-slate-400 font-black text-[11px] uppercase tracking-widest hover:text-brand-navy transition-colors"
            >
              Może później
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            <ShieldCheck size={12} className="text-slate-300" />
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-tighter">Obsługiwane przez RPMS Windykacja</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimedCTAPopup;
