"use client";

import React from 'react';
import { useModal } from '../../../context/ModalContext';
import { logCustomEvent } from '../../../utils/customLogger';

interface FinalCTAProps {
  id?: string;
}

const FinalCTA: React.FC<FinalCTAProps> = ({ id }) => {
  const { setActiveModal } = useModal();

  const handleRegister = (source: string) => {
    setActiveModal('onboarding');
    logCustomEvent({ event_name: 'modal_open_onboarding', metadata: { source } });
  };

  return (
    <section id={id || 'final_cta'} className="py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="bg-brand-navy rounded-[var(--radius-brand-card)] p-12 lg:p-24 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl relative z-10">
            <h2 className="text-4xl lg:text-6xl text-white mb-8 leading-tight tracking-tight">
              Odzyskaj należności <br /> zanim się przedawnią.
            </h2>
            <p className="text-xl text-slate-400 font-bold leading-relaxed">
              Dołącz do ponad 1200 firm, które zautomatyzowały swoją windykację z pełnym wsparciem prawnym.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 relative z-10 shrink-0">
            <button 
              onClick={() => {
                handleRegister('final_cta_register');
                logCustomEvent({ event_name: 'final_cta_register_clicked' });
              }}
              className="px-12 py-6 bg-brand-blue text-white text-xl font-black rounded-[var(--radius-brand-button)] hover:bg-brand-blue/90 transition-all shadow-2xl shadow-brand-blue/40 active:scale-95"
            >
              Zacznij teraz
            </button>
            <button 
              onClick={() => {
                logCustomEvent({ event_name: 'final_cta_demo_clicked' });
              }}
              className="px-12 py-6 bg-white text-brand-navy text-xl font-black rounded-[var(--radius-brand-button)] hover:bg-slate-100 transition-all active:scale-95"
            >
              Zobacz demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;

