"use client";

import React from 'react';
import { Check } from 'lucide-react';
import { useModal } from '../../../context/ModalContext';
import { logCustomEvent } from '../../../utils/customLogger';

interface PricingProps {
  id?: string;
  data?: any;
}

const Pricing: React.FC<PricingProps> = ({ id, data }) => {
  const { setActiveModal } = useModal();

  const handleRegister = (source: string) => {
    setActiveModal('onboarding');
    logCustomEvent({ event_name: 'modal_open_onboarding', metadata: { source } });
  };

  return (
    <section id={id || 'pricing'} className="py-24 bg-slate-50">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl text-brand-navy mb-6">Przejrzyste modele rozliczeń</h2>
          <p className="text-slate-500 text-lg font-medium">Wybierz sposób, który najlepiej pasuje do Twojego biznesu.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          <div className="p-10 bg-white rounded-[var(--radius-brand-card)] border border-slate-200 hover:shadow-xl transition-all">
            <h3 className="text-xl font-black text-brand-navy mb-2">Abonament</h3>
            <p className="text-slate-400 text-sm font-bold mb-10">Dla firm z regularnym obrotem faktur.</p>
            <div className="text-4xl font-black text-brand-navy mb-10">od 199 PLN <span className="text-sm font-medium text-slate-400 tracking-normal">/mc</span></div>
            <ul className="space-y-5 mb-12">
              {[ "Nielimitowane monity", "Pełny Dashboard", "Integracje API" ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                  <Check size={18} className="text-brand-blue" /> {feature}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => {
                handleRegister('pricing_plan_subscription');
                logCustomEvent({ event_name: 'pricing_plan_subscription_clicked' });
              }}
              className="w-full py-4 border-2 border-slate-200 text-brand-navy font-black rounded-[var(--radius-brand-button)] hover:border-brand-navy transition-all"
            >
              Wybierz plan
            </button>
          </div>

          <div className="p-10 bg-brand-navy text-white rounded-[var(--radius-brand-card)] shadow-2xl scale-105 relative z-10 overflow-hidden">
            <div className="absolute top-0 right-0 bg-brand-blue text-white text-[11px] font-black px-10 py-2 uppercase tracking-widest translate-x-[30%] translate-y-[80%] rotate-45">Najczęściej wybierany</div>
            <h3 className="text-xl font-black mb-2 text-white">Success Fee</h3>
            <p className="text-slate-400 text-sm font-bold mb-10">Płacisz tylko od realnie odzyskanej kwoty.</p>
            <div className="text-5xl font-black mb-10">od 5% <span className="text-base font-bold text-slate-500 uppercase">prowizji</span></div>
            <ul className="space-y-5 mb-12">
              {[ "0 PLN kosztów stałych", "Pełna obsługa prawna", "Zero ryzyka finansowego" ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300 font-bold text-sm">
                  <Check size={18} className="text-brand-blue" /> {feature}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => {
                handleRegister('pricing_plan_success_fee');
                logCustomEvent({ event_name: 'pricing_plan_success_fee_clicked' });
              }}
              className="w-full py-5 bg-brand-blue rounded-[var(--radius-brand-button)] font-black text-lg hover:bg-brand-blue/90 transition-all shadow-xl shadow-brand-blue/30"
            >
              Zacznij windykację
            </button>
          </div>

          <div className="p-10 bg-white rounded-[var(--radius-brand-card)] border border-slate-200 hover:shadow-xl transition-all">
            <h3 className="text-xl font-black text-brand-navy mb-2">White Label</h3>
            <p className="text-slate-400 text-sm font-bold mb-10">Dla biur rachunkowych i grup kapitałowych.</p>
            <div className="text-4xl font-black text-brand-navy mb-10 italic">Indywidualnie</div>
            <ul className="space-y-5 mb-12">
              {[ "Twoje logo i domena", "Dedykowana obsługa", "Model partnerski" ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                  <Check size={18} className="text-brand-blue" /> {feature}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => {
                handleRegister('pricing_plan_white_label');
                logCustomEvent({ event_name: 'pricing_plan_white_label_clicked' });
              }}
              className="w-full py-4 border-2 border-slate-200 text-brand-navy font-black rounded-[var(--radius-brand-button)] hover:border-brand-navy transition-all"
            >
              Zapytaj o ofertę
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;

