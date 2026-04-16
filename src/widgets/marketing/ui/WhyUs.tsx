"use client";

import React, { useRef } from 'react';
import { Bolt, TrendingUp, Gavel, Eye, Verified, Mail, Scale, FileText, ShieldCheck, ChevronRight, ChevronLeft, ShieldAlert, FileSearch, SearchCode, Handshake, LockKeyhole } from 'lucide-react';

interface WhyUsProps {
  id?: string;
  onOpenDetail?: (id: string) => void;
}

const WhyUs: React.FC<WhyUsProps> = ({ id, onOpenDetail }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const cards = [
    {
      id: "speed",
      icon: <Bolt className="text-brand-blue" size={24} />,
      title: "Szybkość reakcji",
      desc: "Zatrzymujemy proces starzenia się długu, działając natychmiast."
    },
    {
      id: "efficiency",
      icon: <TrendingUp className="text-brand-blue" size={24} />,
      title: "Skuteczność",
      desc: "Przekładamy procedury na realny wpływ i spłatę środków."
    },
    {
      id: "shield",
      icon: <ShieldAlert className="text-brand-blue" size={24} />,
      title: "Pieczęć Kancelarii",
      desc: "Zwiększamy priorytet spłaty dzięki autorytetowi prawnemu."
    },
    {
      id: "transparency",
      icon: <Eye className="text-brand-blue" size={24} />,
      title: "Transparentność",
      desc: "Zapewniamy pełną kontrolę i przejrzystość każdego kroku."
    },
    {
      id: "legal",
      icon: <Gavel className="text-brand-blue" size={24} />,
      title: "Obsługa prawna",
      desc: "Przejmujemy odpowiedzialność, będąc Twoim działem prawnym."
    },
    {
      id: "monitoring",
      icon: <SearchCode className="text-brand-blue" size={24} />,
      title: "Monitoring Majątku",
      desc: "Lokalizujemy ukryte aktywa dłużnika dla komornika."
    },
    {
      id: "audit",
      icon: <FileSearch className="text-brand-blue" size={24} />,
      title: "Audyt Dowodowy",
      desc: "Weryfikujemy dokumenty pod kątem braków formalnych."
    },
    {
      id: "diplomacy",
      icon: <Handshake className="text-brand-blue" size={24} />,
      title: "Dyplomacja Prawna",
      desc: "Odzyskujemy środki bez palenia mostów relacyjnych."
    },
    {
      id: "responsibility",
      icon: <Verified className="text-brand-blue" size={24} />,
      title: "Odpowiedzialność",
      desc: "Gwarantujemy standardy etyki i ochronę Twojej marki."
    },
    {
      id: "security",
      icon: <LockKeyhole className="text-brand-blue" size={24} />,
      title: "Gwarancja",
      desc: "Działamy pod nadzorem samorządów prawniczych."
    }
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section id={id || 'usp'} className="pt-12 pb-16 bg-white relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Nagłówek sekcji z mb-12 (48px) zgodnie ze specyfikacją */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-12">
          <div className="lg:w-[60%]">
            <h2 className="text-4xl lg:text-7xl font-black text-brand-navy mb-8 leading-[1.1] tracking-tight">
              Dlaczego firmy wybierają nas, <span className="text-brand-blue relative inline-block">
                gdy liczy się efekt
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-brand-blue/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 25 0, 50 5 T 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h2>
            <p className="text-base lg:text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
              Zapewniamy wsparcie, które łączy dynamikę biznesową z najwyższym standardem obsługi prawnej.
            </p>
          </div>

          {/* Animacja po prawej stronie - bez zmian wizualnych */}
          <div className="lg:w-[35%] hidden lg:block">
            <div className="relative w-full h-[350px] flex items-center justify-center">
              <div className="absolute w-[260px] h-[260px] border border-slate-100 rounded-full animate-[spin_12s_linear_infinite]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 bg-white border border-slate-100 rounded-[var(--radius-brand-input)] flex items-center justify-center text-slate-300 animate-[counter-spin_12s_linear_infinite]">
                  <Mail size={12} />
                </div>
              </div>
              <div className="absolute w-[190px] h-[190px] border border-brand-blue/10 rounded-full animate-[spin_20s_linear_infinite_reverse]">
                <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 bg-white border-2 border-brand-blue/20 rounded-[var(--radius-brand-button)] flex items-center justify-center text-brand-blue shadow-sm animate-[counter-spin-reverse_20s_linear_infinite]">
                  <Scale size={14} />
                </div>
              </div>
              <div className="relative w-28 h-36 bg-white rounded-[var(--radius-brand-button)] shadow-[0_20px_50px_-10px_rgba(10,46,92,0.11)] border border-slate-100 p-4 flex flex-col justify-between group animate-[float_5s_ease-in-out_infinite]">
                <div className="space-y-1.5">
                  <div className="w-6 h-6 bg-brand-light-blue rounded-[var(--radius-brand-input)] flex items-center justify-center text-brand-blue mb-2">
                    <FileText size={14} />
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-[var(--radius-brand-button)]"></div>
                  <div className="w-2/3 h-1.5 bg-slate-100 rounded-[var(--radius-brand-button)]"></div>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-brand-blue rounded-full"></div>
                  </div>
                  <ShieldCheck className="text-brand-blue animate-pulse" size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Karuzela Slimline Horizontal */}
        <div className="relative group/carousel">
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory no-scrollbar scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {cards.map((card, idx) => (
              <div 
                key={idx} 
                onClick={() => onOpenDetail?.(card.id)}
                className="min-w-[260px] md:min-w-[280px] lg:min-w-[calc(20%-20px)] min-h-[320px] snap-center p-8 bg-white rounded-[var(--radius-brand-card)] border border-slate-100 hover:shadow-xl hover:shadow-slate-50 transition-all duration-500 group cursor-pointer hover:-translate-y-2 flex flex-col"
              >
                {/* Box ikony 56x56px z ikoną 24px */}
                <div className="w-14 h-14 bg-slate-50 border border-slate-50 rounded-[var(--radius-brand-button)] flex items-center justify-center mb-6 group-hover:bg-brand-blue/5 group-hover:border-brand-blue/20 transition-all duration-300 shadow-sm">
                  {card.icon}
                </div>
                <h3 className="text-lg lg:text-xl font-black text-brand-navy mb-2 group-hover:text-brand-blue transition-colors leading-tight">{card.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm font-medium mb-6 flex-grow">{card.desc}</p>
                
                <div className="mt-auto flex items-center gap-2 text-[10px] font-black text-brand-blue lg:opacity-0 group-hover:opacity-100 transition-all uppercase tracking-widest">
                  Poznaj korzyści 
                  <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          {/* Przyciski nawigacyjne */}
          <button 
            onClick={() => scroll('left')}
            className="absolute -left-4 top-1/2 -translate-y-1/2 p-3 bg-white border border-slate-100 text-slate-400 hover:bg-brand-blue hover:text-white rounded-[var(--radius-brand-button)] transition-all shadow-lg opacity-0 group-hover/carousel:opacity-100 hidden lg:flex"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="absolute -right-4 top-1/2 -translate-y-1/2 p-3 bg-white border border-slate-100 text-slate-400 hover:bg-brand-blue hover:text-white rounded-[var(--radius-brand-button)] transition-all shadow-lg opacity-0 group-hover/carousel:opacity-100 hidden lg:flex"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes counter-spin {
          from { transform: translateX(-50%) rotate(0deg); }
          to { transform: translateX(-50%) rotate(-360deg); }
        }
        @keyframes counter-spin-reverse {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default WhyUs;
