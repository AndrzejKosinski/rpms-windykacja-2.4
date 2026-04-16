"use client";

import React, { useEffect, useState } from 'react';
import { ShieldCheck, Gavel, FileText, CheckCircle2, Zap } from 'lucide-react';

const HeroAnimation: React.FC = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-[500px] mx-auto">
      {/* Centralny element - Tarcza RPMS */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-64 h-64">
          <div className="absolute inset-0 bg-brand-blue/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute inset-0 border-2 border-brand-blue/30 rounded-full animate-ping duration-3000"></div>
          <div className="relative w-full h-full bg-brand-navy rounded-[var(--radius-brand-card)] shadow-2xl flex items-center justify-center border border-white/10 overflow-hidden group">
            <ShieldCheck size={100} className="text-brand-blue animate-in zoom-in duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>
      </div>

      {/* Krążące elementy procesu */}
      <div className="absolute inset-0">
        {/* Krok 1: Analiza */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 transition-all duration-700 ${step === 0 ? 'scale-110 opacity-100' : 'scale-90 opacity-40'}`}>
          <div className="bg-white p-6 rounded-[var(--radius-brand-card)] shadow-xl border border-slate-100 flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-brand-blue/10 text-brand-blue rounded-[var(--radius-brand-button)] flex items-center justify-center">
              <FileText size={24} />
            </div>
            <p className="text-[10px] font-black text-brand-navy uppercase tracking-widest">Skan Faktury</p>
            {step === 0 && <div className="w-full h-1 bg-brand-blue rounded-full animate-in slide-in-from-left"></div>}
          </div>
        </div>

        {/* Krok 2: Wezwanie */}
        <div className={`absolute top-1/2 right-0 -translate-y-1/2 transition-all duration-700 ${step === 1 ? 'scale-110 opacity-100' : 'scale-90 opacity-40'}`}>
          <div className="bg-white p-6 rounded-[var(--radius-brand-card)] shadow-xl border border-slate-100 flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-600 rounded-[var(--radius-brand-button)] flex items-center justify-center">
              <Zap size={24} />
            </div>
            <p className="text-[10px] font-black text-brand-navy uppercase tracking-widest">Wezwanie</p>
            {step === 1 && <div className="w-full h-1 bg-amber-500 rounded-full animate-in slide-in-from-left"></div>}
          </div>
        </div>

        {/* Krok 3: Pozew */}
        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 transition-all duration-700 ${step === 2 ? 'scale-110 opacity-100' : 'scale-90 opacity-40'}`}>
          <div className="bg-white p-6 rounded-[var(--radius-brand-card)] shadow-xl border border-slate-100 flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-brand-navy text-white rounded-[var(--radius-brand-button)] flex items-center justify-center">
              <Gavel size={24} />
            </div>
            <p className="text-[10px] font-black text-brand-navy uppercase tracking-widest">Pozew EPU</p>
            {step === 2 && <div className="w-full h-1 bg-brand-navy rounded-full animate-in slide-in-from-left"></div>}
          </div>
        </div>

        {/* Krok 4: Sukces */}
        <div className={`absolute top-1/2 left-0 -translate-y-1/2 transition-all duration-700 ${step === 3 ? 'scale-110 opacity-100' : 'scale-90 opacity-40'}`}>
          <div className="bg-white p-6 rounded-[var(--radius-brand-card)] shadow-xl border border-slate-100 flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-green-500/10 text-green-600 rounded-[var(--radius-brand-button)] flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <p className="text-[10px] font-black text-brand-navy uppercase tracking-widest">Odzyskano</p>
            {step === 3 && <div className="w-full h-1 bg-green-500 rounded-full animate-in slide-in-from-left"></div>}
          </div>
        </div>
      </div>

      {/* Linie łączące (SVG) */}
      <svg className="absolute inset-0 w-full h-full -z-10 opacity-20" viewBox="0 0 500 500">
        <circle cx="250" cy="250" r="200" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 10" className="text-brand-blue animate-spin-slow" />
      </svg>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .duration-3000 {
          animation-duration: 3s;
        }
      `}</style>
    </div>
  );
};

export default HeroAnimation;
