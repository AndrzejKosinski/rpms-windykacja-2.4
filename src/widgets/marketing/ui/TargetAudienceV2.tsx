"use client";

import React from 'react';
import * as Icons from 'lucide-react';
import { useModal } from '../../../context/ModalContext';
import { logCustomEvent } from '../../../utils/customLogger';

interface TargetAudienceV2Props {
  id?: string;
  data?: any;
}

const defaultIndustries = [
  {
    id: "services",
    icon: "Briefcase",
    title: "Usługi i Konsulting",
    subtitle: "Skuteczna obrona przed wymówkami",
    desc: "Dłużnik twierdzi, że usługa nie spełnia oczekiwań, by uniknąć zapłaty? Nasz zespół prawny przeprowadza audyt dowodowy i stosuje twardą mediację.",
    tag: "Weryfikacja Dowodowa"
  },
  {
    id: "production",
    icon: "Factory",
    title: "Handel i Produkcja",
    subtitle: "Ochrona łańcucha dostaw",
    desc: "Przy dużych zamówieniach zator płatniczy jednego kontrahenta może pogrążyć Twoją firmę. Wprowadzamy pieczęć prewencyjną i priorytetową ścieżkę egzekucji.",
    tag: "Ochrona Kapitału"
  },
  {
    id: "tsl",
    icon: "Truck",
    title: "Transport i Logistyka",
    subtitle: "Koniec z kredytowaniem spedycji",
    desc: "Terminy 60 lub 90 dni to w polskim TSL standard, ale przekraczanie ich to ryzyko dla Twojej floty. Stosujemy natychmiastowe wezwania z rygorem wpisu do rejestrów długów.",
    tag: "Płynność TSL"
  },
  {
    id: "construction",
    icon: "HardHat",
    title: "Budownictwo",
    subtitle: "Odpowiedzialność solidarna",
    desc: "Główny wykonawca zwleka z zapłatą? Wykorzystujemy przepisy Kodeksu Cywilnego, aby pociągnąć do odpowiedzialności Inwestora. Zabezpieczamy Twoje wynagrodzenie.",
    tag: "Ochrona Inwestycji"
  }
];

const TargetAudienceV2: React.FC<TargetAudienceV2Props> = ({ id, data }) => {
  const { setActiveModal, setSelectedSolution } = useModal();

  const handleConsult = () => {
    setActiveModal('lawyer');
    logCustomEvent({ event_name: 'modal_open_lawyer' });
  };

  const handleOpenSolution = (solutionId: string) => {
    setSelectedSolution(solutionId);
    setActiveModal('solution');
    logCustomEvent({ event_name: 'modal_open_solution', metadata: { solution_id: solutionId } });
  };

  const header = data?.header || {
    title: "Płynność finansowa[br]nie jest [blue]przypadkiem[/blue]",
    description: "W Polsce sektor MŚP to serce gospodarki, ale też obszar najbardziej narażony na zatory. Nasze podejście to merytoryczne wsparcie dopasowane do Twojej branży."
  };

  const industries = data?.industries || defaultIndustries;

  const cta = data?.cta || {
    title: "Potrzebujesz twardej ochrony prawnej?",
    description: "Nasi mecenasi specjalizują się w sporach gospodarczych o wysokim stopniu skomplikowania.",
    buttonText: "Konsultacja z mecenasem"
  };

  const renderIcon = (iconName: string, index: number) => {
    const Icon = (Icons[iconName as keyof typeof Icons] as React.ElementType) || Icons.Briefcase;
    const colors = [
      "text-brand-blue",
      "text-emerald-600",
      "text-amber-600",
      "text-slate-700"
    ];
    const colorClass = colors[index % colors.length];
    return <Icon className={colorClass} size={24} />;
  };

  const renderTitle = (text: string) => {
    if (!text) return null;
    const lines = text.split(/\[br\]/i);
    return lines.map((line, lineIndex) => {
      const parts = line.split(/\[blue\](.*?)\[\/blue\]/gi);
      return (
        <React.Fragment key={lineIndex}>
          {parts.map((part, partIndex) => {
            if (partIndex % 2 === 1) {
              return (
                <span key={partIndex} className="text-brand-blue relative inline-block">
                  {part}
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-brand-blue/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 25 0, 50 5 T 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                  </svg>
                </span>
              );
            }
            return part;
          })}
          {lineIndex < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <section id={id || 'target_audience_v2'} className="min-h-screen py-20 lg:py-24 bg-white relative overflow-hidden flex flex-col justify-center">
      {/* Dekoracyjne elementy tła */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-light-blue/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 text-center relative z-10">
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl lg:text-7xl text-brand-navy mb-8 leading-[1.1] tracking-tight whitespace-pre-line">
            {renderTitle(header.title)}
          </h2>
          <p className="text-base lg:text-xl text-slate-500 font-medium leading-relaxed">
            {header.description}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {industries.map((item: any, idx: number) => (
            <div 
              key={idx} 
              onClick={() => handleOpenSolution(item.id)}
              className="group p-6 lg:p-7 rounded-[var(--radius-brand-card)] lg:rounded-[var(--radius-brand-card)] bg-slate-50 border border-slate-100 flex flex-col items-start text-left hover:bg-white hover:shadow-[0_40px_80px_-15px_rgba(10,46,92,0.12)] transition-all duration-500 hover:-translate-y-2 cursor-pointer relative"
            >
              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-white rounded-[var(--radius-brand-button)] lg:rounded-[var(--radius-brand-button)] flex items-center justify-center mb-6 shadow-sm group-hover:shadow-lg group-hover:scale-110 transition-all duration-500">
                {renderIcon(item.icon, idx)}
              </div>
              
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-white border border-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 group-hover:text-brand-blue group-hover:border-brand-blue/20 transition-colors">
                  {item.tag}
                </span>
                <h3 className="text-xl lg:text-2xl font-black text-brand-navy mb-2 leading-tight">{item.title}</h3>
                <p className="text-[12px] font-bold text-brand-blue/70 mb-4">{item.subtitle}</p>
              </div>

              <p className="text-slate-500 text-xs lg:text-sm font-medium leading-relaxed mb-6">
                {item.desc}
              </p>

              <div className="mt-auto flex items-center gap-3 text-brand-navy font-black text-[10px] uppercase tracking-[0.2em] group-hover:text-brand-blue transition-all">
                Wybierz branżę 
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-all shadow-sm">
                  <Icons.ChevronRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 lg:p-14 bg-brand-navy rounded-[var(--radius-brand-card)] lg:rounded-[var(--radius-brand-card)] text-white flex flex-col lg:flex-row items-center justify-between gap-10 relative overflow-hidden shadow-2xl shadow-brand-navy/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="flex items-center gap-8 relative z-10">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-brand-blue rounded-[var(--radius-brand-button)] lg:rounded-[var(--radius-brand-card)] flex items-center justify-center shrink-0 shadow-lg shadow-brand-blue/20">
              <Icons.AlertCircle size={36} />
            </div>
            <div className="text-left">
              <h3 className="text-xl lg:text-3xl font-black mb-2 text-white">{cta.title}</h3>
              <p className="text-slate-400 font-medium text-sm lg:text-lg">{cta.description}</p>
            </div>
          </div>
          
          <button 
            onClick={handleConsult}
            className="w-full lg:w-auto px-12 py-6 bg-white text-brand-navy rounded-[var(--radius-brand-button)] lg:rounded-[var(--radius-brand-card)] font-black hover:bg-brand-light-blue transition-all whitespace-nowrap text-lg shadow-xl relative z-10 active:scale-95"
          >
            {cta.buttonText}
          </button>
        </div>
      </div>
    </section>
  );
};

export default TargetAudienceV2;
