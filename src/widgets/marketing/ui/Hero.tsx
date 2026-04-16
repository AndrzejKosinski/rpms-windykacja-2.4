"use client";

import React from 'react';
import Image from 'next/image';
import { Verified } from 'lucide-react';
import HeroAnimation from './HeroAnimation';
import { logCustomEvent } from '../../../utils/customLogger';
import { useModal } from '../../../context/ModalContext';

interface HeroProps {
  id?: string;
  data?: any;
}

const trustedCompanies = [
  { 
    name: 'Allegro', 
    logoUrl: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 60%22%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22system-ui, sans-serif%22 font-size=%2236%22 font-weight=%22800%22 fill=%22%230a2e5c%22%3EAllegro%3C/text%3E%3C/svg%3E'
  },
  { 
    name: 'InPost', 
    logoUrl: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 60%22%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22system-ui, sans-serif%22 font-size=%2236%22 font-weight=%22800%22 fill=%22%230a2e5c%22%3EInPost%3C/text%3E%3C/svg%3E'
  },
  { 
    name: 'Orlen', 
    logoUrl: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 60%22%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22system-ui, sans-serif%22 font-size=%2236%22 font-weight=%22800%22 fill=%22%230a2e5c%22%3EOrlen%3C/text%3E%3C/svg%3E'
  },
  { 
    name: 'PKO BP', 
    logoUrl: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 60%22%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22system-ui, sans-serif%22 font-size=%2236%22 font-weight=%22800%22 fill=%22%230a2e5c%22%3EPKO BP%3C/text%3E%3C/svg%3E'
  },
];

const Hero: React.FC<HeroProps> = ({ id, data }) => {
  const { setActiveModal } = useModal();

  const badgeText = data?.badge || "PARTNER PRAWNY DLA TWOJEGO BIZNESU";
  const titleText = data?.title || "[blue]Szybkie i skuteczne[/blue] [br] odzyskiwanie [br] należności.";
  const descriptionText = data?.description || "Połącz szybkość działania z pewnością prawną. Dodaj fakturę i powierz sprawę zespołowi prawników, którzy prowadzą ją od pierwszego kroku aż do odzyskania pieniędzy.";

  const renderTitle = (text: string) => {
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

  // Styl "Płynne Linie" - wyłącznie wzór SVG bez dodatkowych barwień
  const liquidFlowStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' viewBox='0 0 1000 1000' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'%3E%3Cpath d='M-100 300 C 200 150, 400 500, 1100 200' fill='none' stroke='%23137fec' stroke-opacity='0.08' stroke-width='1.5'/%3E%3Cpath d='M-100 500 C 300 300, 600 700, 1100 400' fill='none' stroke='%23137fec' stroke-opacity='0.05' stroke-width='1.2'/%3E%3Cpath d='M-100 150 C 400 400, 700 100, 1100 300' fill='none' stroke='%23137fec' stroke-opacity='0.06' stroke-width='1'/%3E%3C/svg%3E")`,
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <section 
      id={id || 'hero'}
      style={liquidFlowStyle}
      className="relative min-h-[100vh] lg:min-h-[calc(100vh-114px)] flex flex-col overflow-hidden bg-white pt-24 lg:pt-32"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full flex-grow relative z-10 flex flex-col md:flex-row">
        {/* Animation Column */}
        <div className="w-full md:w-[40%] flex flex-col relative shrink-0">
          <div className="flex-grow relative min-h-[350px] sm:min-h-[450px] md:min-h-0">
            <HeroAnimation />
          </div>
        </div>

        {/* Content Column */}
        <div className="w-full md:w-[60%] flex flex-col justify-center lg:pl-20 py-10 sm:py-16 md:py-12 lg:py-0 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-light-blue text-brand-blue text-[10px] sm:text-xs font-bold rounded-full mb-6 sm:mb-8 uppercase tracking-wider w-fit">
            <Verified size={14} className="fill-brand-blue text-white" />
            {badgeText}
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-7xl text-brand-navy leading-[1.1] mb-6 sm:mb-8 tracking-tight">
            {renderTitle(titleText)}
          </h1>

          <p className="text-sm sm:text-base lg:text-xl text-slate-500 font-medium leading-relaxed mb-10 sm:mb-12 max-w-xl">
            {descriptionText}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-stretch sm:items-start">
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  setActiveModal('onboarding');
                  logCustomEvent({ event_name: 'hero_cta_register_clicked', metadata: { source: 'hero_primary_cta' } });
                }}
                className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 bg-brand-blue text-white text-base sm:text-lg font-black rounded-[var(--radius-brand-button)] hover:bg-brand-blue/90 transition-all shadow-xl shadow-brand-blue/25 flex items-center justify-center gap-3 active:scale-95"
              >
                Przekaż sprawę do windykacji
              </button>
            </div>
            <button 
              onClick={() => {
                setActiveModal('lawyer');
                logCustomEvent({ event_name: 'hero_cta_lawyer_clicked' });
              }}
              className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 border-2 border-slate-200 text-brand-navy text-base sm:text-lg font-black rounded-[var(--radius-brand-button)] hover:border-brand-navy transition-all flex items-center justify-center active:scale-95"
            >
              Zapytaj eksperta
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
