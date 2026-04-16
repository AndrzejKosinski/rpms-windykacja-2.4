import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, CheckCircle2, ShieldCheck, Truck, HardHat, Briefcase, Factory, AlertTriangle, Scale, Zap, ChevronLeft, ChevronRight, Award, Quote } from 'lucide-react';

interface SolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  solutionId: string | null;
  onRegister: (source?: string) => void;
}

const SolutionModal: React.FC<SolutionModalProps> = ({ isOpen, onClose, solutionId, onRegister }) => {
  const solutionIds = ['tsl', 'construction', 'services', 'production'];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (solutionId) {
      const index = solutionIds.indexOf(solutionId);
      if (index !== -1) setCurrentIndex(index);
    }
  }, [solutionId, isOpen]);

  if (!isOpen) return null;

  const solutions: Record<string, any> = {
    tsl: {
      title: "Transport i Logistyka",
      subtitle: "Koniec kredytowania spedycji",
      icon: <Truck className="text-brand-blue" size={24} />,
      benefit: "Płynność floty to podstawa. Stosujemy blokady giełdowe i rygor odpowiedzialności osobistej zarządu (Art. 299 KSH), by wymusić płatność w 48h.",
      image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=800",
      points: [
        "Natychmiastowy wpis na giełdy transportowe",
        "Rygor odpowiedzialności osobistej zarządu",
        "Blokada ubezpieczenia OCP dłużnika"
      ]
    },
    construction: {
      title: "Budownictwo i OZE",
      subtitle: "Odpowiedzialność solidarna",
      icon: <HardHat className="text-brand-blue" size={24} />,
      benefit: "Przeskakujemy dłużnika i uderzamy do źródła. Wykorzystujemy Art. 647¹ KC, by Inwestor wypłacił Twoje środki bezpośrednio z budżetu budowy.",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800",
      points: [
        "Uruchomienie odpowiedzialności Inwestora",
        "Audyt techniczno-prawny usterek",
        "Zabezpieczenie roszczenia na majątku budowy"
      ]
    },
    services: {
      title: "Usługi i Konsulting",
      subtitle: "Obrona przed wymówkami",
      icon: <Briefcase className="text-brand-blue" size={24} />,
      benefit: "Koniec z grami na zwłokę. Audyt dowodowy logów i akceptacji cyfrowych pozwala nam uzyskać nakaz zapłaty EPU bez długotrwałych procesów.",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
      points: [
        "Analiza logów i akceptacji cyfrowych",
        "Mediacja prowadzona przez radcę prawnego",
        "Automatyczny pozew do e-sądu (EPU)"
      ]
    },
    production: {
      title: "Handel i Produkcja",
      subtitle: "Monitoring Majątku",
      icon: <Factory className="text-brand-blue" size={24} />,
      benefit: "Lokalizujemy ukryte mienie dłużnika poprzez OSINT. Zabezpieczamy towar komorniczo na magazynie, zanim dłużnik ogłosi upadłość.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
      points: [
        "Lokalizacja zapasów magazynowych",
        "Blokada rachunków split-payment",
        "Weryfikacja powiązań kapitałowych zarządu"
      ]
    }
  };

  const current = solutions[solutionIds[currentIndex]];

  const navigate = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentIndex((prev) => (prev === 0 ? solutionIds.length - 1 : prev - 1));
    } else {
      setCurrentIndex((prev) => (prev === solutionIds.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 overflow-hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      {/* Modal Container - ZMIENIONO max-w-[850px] na max-w-5xl */}
      <div className="relative w-full max-w-5xl bg-white rounded-[var(--radius-brand-card)] shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col lg:flex-row overflow-hidden max-h-[95vh] lg:h-[720px]">
        
        {/* Lewa kolumna: Treść stylizowana na Brief */}
        <div className="lg:w-3/5 flex flex-col h-full bg-white relative z-10">
          {/* Header Brief Style - ZWIĘKSZONO TYTUŁ I PODTYTUŁ */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10 shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-[var(--radius-brand-button)] flex items-center justify-center text-brand-blue shadow-sm shrink-0">
                {current.icon}
              </div>
              <div>
                <h3 className="text-2xl font-black text-brand-navy leading-none mb-1.5">{current.title}</h3>
                <p className="text-xs font-bold text-brand-blue uppercase tracking-widest">{current.subtitle}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 lg:hidden text-slate-300 hover:text-brand-navy transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Scrolled Content */}
          <div className="flex-1 overflow-y-auto p-5 lg:p-8 space-y-6">
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              {/* Sekcja: Certyfikat Autorytetu */}
              <div 
                className="relative p-7 bg-slate-50 rounded-[var(--radius-brand-card)] border border-slate-100 shadow-sm overflow-hidden min-h-[170px] flex flex-col justify-center"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23137fec' fill-opacity='0.03' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E")`
                }}
              >
                {/* Znak wodny tarczy */}
                <div className="absolute -top-4 -right-4 text-brand-blue opacity-[0.04] pointer-events-none">
                  <ShieldCheck size={160} strokeWidth={1} />
                </div>
                
                {/* Dekoracyjne cudzysłowy */}
                <Quote className="absolute top-4 left-4 text-brand-blue opacity-10" size={32} />
                
                <div className="relative z-10 pl-2">
                  <p className="text-brand-navy font-bold leading-relaxed text-sm lg:text-[15px] italic">
                    {current.benefit}
                  </p>
                  
                  <div className="mt-4 flex items-center gap-2">
                    <div className="w-6 h-px bg-brand-blue/30"></div>
                    <span className="text-[9px] font-black text-brand-blue uppercase tracking-[0.2em]">Strategia Branżowa</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Nasze uderzenie prawne</h4>
              <div className="grid grid-cols-1 gap-2">
                {current.points.map((p: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 bg-slate-50/50 rounded-[var(--radius-brand-button)] border border-slate-100 group hover:border-brand-blue/20 transition-colors">
                    <div className="mt-0.5 text-brand-blue shrink-0">
                      <CheckCircle2 size={15} />
                    </div>
                    <span className="text-xs font-bold text-brand-navy leading-snug">{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer z nawigacją */}
          <div className="p-5 border-t border-slate-100 bg-slate-50/50 shrink-0">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => navigate('prev')}
                  className="p-2 bg-white border border-slate-100 rounded-[var(--radius-brand-input)] text-slate-400 hover:text-brand-navy hover:shadow-sm transition-all"
                  title="Poprzednia branża"
                >
                  <ChevronLeft size={18} />
                </button>
                
                <div className="flex gap-2 px-2">
                  {solutionIds.map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-4 bg-brand-blue' : 'bg-slate-200'}`} 
                    />
                  ))}
                </div>
                
                <button 
                  onClick={() => navigate('next')}
                  className="p-2 bg-white border border-slate-100 rounded-[var(--radius-brand-input)] text-slate-400 hover:text-brand-navy hover:shadow-sm transition-all"
                  title="Następna branża"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              <button 
                onClick={() => { onRegister('solution_modal_cta'); onClose(); }}
                className="w-full sm:w-auto px-8 py-3.5 bg-brand-blue text-white rounded-[var(--radius-brand-button)] font-black text-sm hover:bg-brand-blue/90 transition-all shadow-lg shadow-brand-blue/20 flex items-center justify-center gap-2 group"
              >
                Uruchom proces windykacji <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Prawa kolumna: Obraz na całości wysokości */}
        <div className="hidden lg:block lg:w-2/5 relative">
          <Image 
            src={current.image} 
            alt={current.title} 
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover animate-in fade-in duration-700"
            key={currentIndex}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-brand-navy/20" />
          
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 p-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white hover:text-brand-navy transition-all z-20"
          >
            <X size={24} />
          </button>

          <div className="absolute bottom-12 left-10 right-10">
            <div className="p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-[var(--radius-brand-card)] text-white">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] mb-2 opacity-60 text-brand-light-blue">Standard Kancelarii</p>
              <p className="text-sm font-bold leading-relaxed">
                Łączymy twarde prawo z dynamiką biznesową, by Twoje faktury były opłacane w pierwszej kolejności.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SolutionModal;