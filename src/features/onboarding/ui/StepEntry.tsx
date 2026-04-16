import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, FileSignature, LayoutDashboard, ArrowRight, ShieldCheck } from 'lucide-react';

interface StepEntryProps {
  onFileSelect: () => void;
  onManualSelect: () => void;
  onPanelSelect: () => void;
  dragActive: boolean;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const StepEntry: React.FC<StepEntryProps> = ({ 
  onFileSelect, onManualSelect, onPanelSelect, 
  dragActive, handleDrag, handleDrop, 
  fileInputRef, handleFileChange 
}) => {
  const liquidFlowStyle = {
    backgroundColor: '#ffffff',
    backgroundImage: `
      url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' viewBox='0 0 1000 1000' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'%3E%3Cpath d='M-100 300 C 200 150, 400 500, 1100 200' fill='none' stroke='%23137fec' stroke-opacity='0.08' stroke-width='1.5'/%3E%3Cpath d='M-100 500 C 300 300, 600 700, 1100 400' fill='none' stroke='%23137fec' stroke-opacity='0.05' stroke-width='1.2'/%3E%3Cpath d='M-100 150 C 400 400, 700 100, 1100 300' fill='none' stroke='%23137fec' stroke-opacity='0.06' stroke-width='1'/%3E%3C/svg%3E"),
      radial-gradient(at 0% 0%, rgba(19, 127, 236, 0.05) 0px, transparent 50%),
      radial-gradient(at 100% 100%, rgba(19, 127, 236, 0.08) 0px, transparent 50%)
    `,
    backgroundSize: '100% 100%',
    backgroundAttachment: 'local'
  };

  return (
    <div 
      className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col h-full -mx-6 md:-mx-12 -mt-8 md:-mt-10 -mb-10 px-6 md:px-12 pt-8 md:pt-10"
      style={liquidFlowStyle}
    >
      <div className="text-center mb-6 md:mb-10 relative z-10">
        <h1 className="text-3xl md:text-5xl font-black text-brand-navy mb-6 tracking-tight leading-[1.2]">
          Odzyskaj pieniądze. <br /> <span className="text-brand-blue">Wybierz sposób zgłoszenia.</span>
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto text-sm md:text-xl font-medium leading-relaxed">
          Przekaż sprawę tak, jak Ci wygodnie. Twoim zgłoszeniem <br className="hidden md:block" /> zajmie się bezpośrednio zespół prawny RPMS.
        </p>
      </div>

      <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-3 gap-5 md:gap-6 -mx-6 px-6 md:mx-0 md:px-0 no-scrollbar items-stretch md:pt-4 md:pb-10 relative z-10">
        {/* Karta 1: Ręcznie (Przeniesiona na początek) */}
        <div 
          onClick={onManualSelect}
          className="min-w-[85vw] md:min-w-0 snap-center group flex flex-col items-center p-6 md:p-7 bg-white border-2 border-brand-blue/30 rounded-[var(--radius-brand-card)] hover:shadow-xl hover:border-brand-blue hover:bg-brand-blue/5/50 hover:-translate-y-2 transition-all duration-500 cursor-pointer shadow-[0_10px_30px_-10px_rgba(19,127,236,0.1)]"
        >
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-[var(--radius-brand-button)] bg-brand-blue/5 flex items-center justify-center text-brand-blue mb-4 shadow-sm group-hover:bg-brand-blue group-hover:text-white group-hover:scale-110 group-hover:shadow-lg transition-all duration-500">
            <FileSignature size={24} />
          </div>
          <h3 className="text-lg md:text-xl font-black text-brand-navy mb-6 text-center">Ręczne zgłoszenie wierzytelności</h3>
          <p className="text-slate-600 text-sm text-center mb-5 flex-grow leading-relaxed font-medium px-2">
            Podaj podstawowe informacje o dłużniku i kwocie. Wypełnienie formularza zajmie Ci nie więcej niż 60 sekund.
          </p>
          <button className="w-full py-4 bg-white border-2 border-brand-blue/30 text-brand-blue font-black text-xs uppercase tracking-[0.15em] rounded-[var(--radius-brand-button)] transition-all group-hover:bg-brand-navy group-hover:text-white group-hover:border-brand-navy group-hover:shadow-lg group-hover:shadow-brand-navy/20">
            Wypełnij zgłoszenie
          </button>
        </div>

        {/* Karta 2: Faktura (Przeniesiona na drugie miejsce) */}
        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`min-w-[85vw] md:min-w-0 snap-center group relative flex flex-col items-center p-6 md:p-7 bg-white border-2 rounded-[var(--radius-brand-card)] transition-all duration-500 cursor-pointer shadow-[0_10px_30px_-10px_rgba(19,127,236,0.15)] hover:shadow-xl hover:-translate-y-2 ${
            dragActive ? 'border-brand-blue bg-brand-blue/5/50 scale-[1.02]' : 'border-brand-blue/30 hover:border-brand-blue'
          }`}
          onClick={onFileSelect}
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-brand-blue text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg group-hover:scale-110 transition-transform whitespace-nowrap">
            NAJSZYBSZA DROGA
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,image/*" multiple />
          <div className={`w-12 h-12 md:w-14 md:h-14 rounded-[var(--radius-brand-button)] flex items-center justify-center mb-4 transition-all duration-500 ${
            dragActive ? 'bg-brand-blue text-white' : 'bg-brand-blue/5 text-brand-blue group-hover:bg-brand-blue group-hover:text-white'
          }`}>
            <Upload size={24} />
          </div>
          <h3 className="text-lg md:text-xl font-black text-brand-navy mb-6 text-center">Odzyskaj z faktury</h3>
          <p className="text-slate-600 text-sm text-center mb-5 flex-grow leading-relaxed font-medium">
            Wskaż fakturę oraz swoje dane kontaktowe. Nasi prawnicy zostaną powiadomieni o nowym zgłoszeniu.
          </p>
          <button className="w-full py-4 bg-brand-blue text-white font-black text-xs uppercase tracking-[0.15em] rounded-[var(--radius-brand-button)] transition-all shadow-lg shadow-brand-blue/10 group-hover:bg-brand-navy group-hover:shadow-brand-navy/20">
            DODAJ PLIK FAKTURY
          </button>
        </div>

        {/* Karta 3: Panel */}
        <div 
          onClick={onPanelSelect}
          className="min-w-[85vw] md:min-w-0 snap-center group relative flex flex-col items-center p-6 md:p-7 rounded-[var(--radius-brand-card)] shadow-lg shadow-brand-navy/10 hover:shadow-xl hover:shadow-brand-navy/40 overflow-hidden transform hover:-translate-y-2 transition-all duration-500 cursor-pointer bg-gradient-to-br from-brand-navy via-[#0c3162] to-brand-blue"
        >
          {/* Chorągiew (Ribbon) - Finalna korekta (Sweet Spot) dla idealnego osadzenia napisu */}
          <div className="absolute top-[34px] -right-[54px] bg-amber-400 text-brand-navy font-black text-[9px] uppercase tracking-[0.15em] py-1.5 w-[220px] text-center rotate-45 shadow-[0_0_15px_rgba(251,191,36,0.4)] z-20 pointer-events-none">
            BEZPŁATNY DOSTĘP
          </div>
          
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-brand-blue/10 blur-[40px] rounded-full"></div>
          <div className="relative z-10 w-12 h-12 md:w-14 md:h-14 rounded-[var(--radius-brand-button)] bg-white/10 backdrop-blur-md flex items-center justify-center text-brand-blue/80 mb-4 border border-white/10">
            <LayoutDashboard size={24} />
          </div>
          <h3 className="relative z-10 text-lg md:text-xl font-black mb-6 text-center" style={{ color: 'var(--color-text-inverse)' }}>Centrum Twoich <br /> Spraw Windykacyjnych</h3>
          <p className="relative z-10 text-sm text-center mb-5 flex-grow leading-relaxed font-medium" style={{ color: 'var(--color-text-inverse)', opacity: 0.8 }}>
            Zlecaj i monitoruj wiele spraw jednocześnie. Pełny wgląd w aktualny status Twoich spraw online.
          </p>
          <div className="relative z-10 w-full pt-2">
            <button className="w-full py-4 bg-brand-blue hover:bg-brand-blue/90 text-white font-black text-xs uppercase tracking-[0.15em] rounded-[var(--radius-brand-button)] transition-all flex items-center justify-center group/btn">
              Dodaj sprawę w Panelu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepEntry;
