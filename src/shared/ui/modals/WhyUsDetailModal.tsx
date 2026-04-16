import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import * as Icons from 'lucide-react';
import { X, ShieldCheck, Quote, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';

interface WhyUsDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  detailId: string | null;
  onRegister: (source?: string) => void;
  modals?: any[];
}

const defaultModals = [
  {
    id: 'speed',
    internalName: 'Płynność finansowa',
    title: "Płynność finansowa",
    subtitle: "Działanie natychmiastowe",
    icon: "Zap",
    benefit: "Działamy natychmiast po zgłoszeniu sprawy, zatrzymując proces starzenia się długu. Już na etapie przedsądowym wysyłamy wezwanie do zapłaty opatrzone pieczęcią Kancelarii, co stanowi najszybszy i najmniej kosztowny sposób dochodzenia należności.",
    standard: "Reakcja operacyjna: 15 minut.",
    points: ["Natychmiastowe zatrzymanie przedawnienia", "Priorytetowa ścieżka płatności", "Weryfikacja strategii w czasie rzeczywistym"],
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600",
    isVisibleInCarousel: true
  },
  {
    id: 'efficiency',
    internalName: 'Nieuchronność spłaty',
    title: "Nieuchronność spłaty",
    subtitle: "Skuteczny wpływ",
    icon: "CheckCircle2",
    benefit: "Przekładamy procedury na realny wpływ – od analizy sprawy po egzekucję komorniczą. Dzięki kompleksowemu podejściu i obecności na każdym etapie postępowania zwiększamy nieuchronność spłaty Twoich środków.",
    standard: "92% skuteczności w sprawach B2B.",
    points: ["Autorytet Kancelarii od 1. dnia", "Scenariusze oparte na faktach", "Precyzyjne uderzenie w zatory"],
    imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=600",
    isVisibleInCarousel: true
  },
  {
    id: 'shield',
    internalName: 'Pieczęć Kancelarii',
    title: "Pieczęć Kancelarii",
    subtitle: "Psychologia nacisku",
    icon: "ShieldAlert",
    benefit: "Wezwania do zapłaty są wysyłane na firmowym papierze, podpisane przez radcę prawnego lub adwokata, co nadaje sprawie autorytet prawny już od pierwszego kontaktu z dłużnikiem. To zwiększa priorytet spłaty i skuteczność negocjacji.",
    standard: "Pieczęć prewencyjna od pierwszej minuty.",
    points: ["Oficjalna autoryzacja prawna", "Sygnał o gotowości procesowej", "Drastyczny wzrost wpłat polubownych"],
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600",
    isVisibleInCarousel: true
  },
  {
    id: 'audit',
    internalName: 'Audyt Dowodowy',
    title: "Audyt Dowodowy",
    subtitle: "Pancerna dokumentacja",
    icon: "FileSearch",
    benefit: "Weryfikujemy dokumentację pod kątem braków formalnych, co pozwala zbudować niepodważalną pozycję w sądzie. Dzięki temu minimalizujemy ryzyko oddalenia roszczenia i zwiększamy szanse na szybkie uzyskanie wyroku.",
    standard: "100% weryfikacja zgodności z KPC.",
    points: ["Sprawdzenie protokołów odbioru", "Wzmocnienie materiału dowodowego", "Gotowość do pozwu w 24h"],
    imageUrl: "https://images.unsplash.com/photo-1454165833767-027ffea9e77b?auto=format&fit=crop&q=80&w=600",
    isVisibleInCarousel: true
  },
  {
    id: 'legal',
    internalName: 'Bezpieczeństwo prawne',
    title: "Bezpieczeństwo prawne",
    subtitle: "Pełne odciążenie",
    icon: "Scale",
    benefit: "Przejmujemy pełną odpowiedzialność za proces windykacyjny – od analizy sprawy, przez działania sądowe, aż po egzekucję. Działamy jako Twój dział prawny, zapewniając bieżące doradztwo i reprezentację na każdym etapie.",
    standard: "Pełna reprezentacja przed EPU i sądami.",
    points: ["Dedykowany radca prawny", "Bezpieczeństwo procesowe", "Aktywny nadzór komorniczy"],
    imageUrl: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=600",
    isVisibleInCarousel: true
  },
  {
    id: 'monitoring',
    internalName: 'Monitoring Majątku',
    title: "Monitoring Majątku",
    subtitle: "Precyzyjne uderzenie",
    icon: "SearchCode",
    benefit: "Wskazujemy komornikowi konkretne składniki majątku dłużnika, w tym aktywa ukryte lub nieujawnione. Dzięki temu egzekucja jest szybsza i bardziej skuteczna, a wierzyciel zyskuje realną szansę na odzyskanie środków.",
    standard: "Lokalizacja aktywów in trybie proaktywnym.",
    points: ["Wykrywanie ukrytych nieruchomości", "Analiza powiązań kapitałowych", "Wskazanie mienia komornikowi"],
    imageUrl: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=600",
    isVisibleInCarousel: true
  },
  {
    id: 'transparency',
    internalName: 'Kontrola strategiczna',
    title: "Kontrola strategiczna",
    subtitle: "Przejrzystość 24/7",
    icon: "Clock",
    benefit: "Zapewniamy pełną przejrzystość działań na każdym etapie procesu windykacyjnego – od analizy sprawy po egzekucję. Klient ma stały dostęp do informacji i pełną kontrolę strategiczną nad przebiegiem sprawy.",
    standard: "Brak ukrytych kosztów i pełny wgląd.",
    points: ["Podgląd postępów Live", "Dostęp do pełnej dokumentacji", "Jasne raporty efektywności"],
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
    isVisibleInCarousel: true
  },
  {
    id: 'diplomacy',
    internalName: 'Dyplomacja Prawna',
    title: "Dyplomacja Prawna",
    subtitle: "Relacje pod ochroną",
    icon: "Handshake",
    benefit: "Odzyskujemy należności z poszanowaniem relacji biznesowych. Nasze działania are wyważone i profesjonalne – nie palimy mostów, lecz budujemy rozwiązania, które chronią reputację i przyszłą współpracę.",
    standard: "Negocjacje w asyście mediatora.",
    points: ["Profesjonalny ton komunikacji", "Mediacja przedsądowa", "Zachowanie reputacji wierzyciela"],
    imageUrl: "https://images.unsplash.com/photo-1521791136364-798a730bb361?auto=format&fit=crop&q=80&w=600",
    isVisibleInCarousel: true
  },
  {
    id: 'responsibility',
    internalName: 'Ochrona wizerunku',
    title: "Ochrona wizerunku",
    subtitle: "Etyka i autorytet",
    icon: "ShieldCheck",
    benefit: "Działamy zgodnie z najwyższymi standardami etyki zawodowej. Chronimy wizerunek Twojej marki, reprezentując ją w sposób profesjonalny i zgodny z zasadami odpowiedzialnego biznesu.",
    standard: "Ochrona wierzyciela ubezpieczeniem OC.",
    points: ["Standardy etyki adwokackiej", "Profesjonalny ton komunikacji", "Ochrona Twoich relacji biznesowych"],
    imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=600",
    isVisibleInCarousel: true
  },
  {
    id: 'security',
    internalName: 'Gwarancja Bezpieczeństwa',
    title: "Gwarancja Bezpieczeństwa",
    subtitle: "Poufność i standardy",
    icon: "LockKeyhole",
    benefit: "Jako kancelaria działająca pod nadzorem samorządów prawniczych gwarantujemy bezpieczeństwo danych i zgodność z obowiązującymi regulacjami. Twoja reputacja i poufność są dla nas priorytetem.",
    standard: "Gwarancja ubezpieczeniowa OC Kancelarii.",
    points: ["Tajemnica adwokacka i radcowska", "Szyfrowanie danych klasy bankowej", "Pełna odpowiedzialność cywilna"],
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600",
    isVisibleInCarousel: true
  }
];

const WhyUsDetailModal: React.FC<WhyUsDetailModalProps> = ({ isOpen, onClose, detailId, onRegister, modals = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeModals = modals.length > 0 ? modals : defaultModals;

  // Filtruj modale do karuzeli
  const carouselModals = activeModals.filter(m => m.isVisibleInCarousel !== false);
  
  // Znajdź modal, który ma być wyświetlony (może być spoza karuzeli)
  const targetModal = activeModals.find(m => m.id === detailId);
  
  // Sprawdź, czy targetModal jest w karuzeli
  const isTargetInCarousel = targetModal ? carouselModals.some(m => m.id === targetModal.id) : false;

  useEffect(() => {
    if (detailId && isTargetInCarousel) {
      const index = carouselModals.findIndex(m => m.id === detailId);
      if (index !== -1) setCurrentIndex(index);
    }
  }, [detailId, isOpen, carouselModals.length, isTargetInCarousel]);

  if (!isOpen || !targetModal) return null;

  // Jeśli modal jest w karuzeli, używamy currentIndex, w przeciwnym razie wyświetlamy po prostu targetModal
  const current = isTargetInCarousel && carouselModals.length > 0 ? carouselModals[currentIndex] : targetModal;

  const navigate = (direction: 'prev' | 'next') => {
    if (!isTargetInCarousel || carouselModals.length <= 1) return;
    
    if (direction === 'prev') {
      setCurrentIndex((prev) => (prev === 0 ? carouselModals.length - 1 : prev - 1));
    } else {
      setCurrentIndex((prev) => (prev === carouselModals.length - 1 ? 0 : prev + 1));
    }
  };

  const renderIcon = (iconName: string) => {
    const Icon = (Icons[iconName as keyof typeof Icons] as React.ElementType) || Icons.CheckCircle;
    return <Icon size={24} />;
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 overflow-hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-white rounded-[var(--radius-brand-card)] shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col lg:flex-row overflow-hidden max-h-[95vh] lg:h-[720px]">
        
        {/* Lewa kolumna: Treść stylizowana na Brief */}
        <div className="lg:w-3/5 flex flex-col h-full bg-white relative z-10">
          {/* Header Brief Style */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10 shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-[var(--radius-brand-button)] flex items-center justify-center text-brand-blue shadow-sm shrink-0">
                {renderIcon(current.icon || 'FileText')}
              </div>
              <div>
                <h3 className="text-2xl font-black text-brand-navy leading-none mb-1.5">{current.title || current.internalName}</h3>
                <p className="text-xs font-bold text-brand-blue uppercase tracking-widest">{current.subtitle}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 lg:hidden text-slate-300 hover:text-brand-navy transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Scrolled Content */}
          <div className="flex-1 overflow-y-auto p-5 lg:p-8 space-y-8">
            {/* Sekcja: Wartość dla Twojej firmy - Styl 1: Certyfikat Autorytetu (bez nagłówka) */}
            {current.benefit && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
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
                      <span className="text-[9px] font-black text-brand-blue uppercase tracking-[0.2em]">Werdykt Kancelarii</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {current.points && current.points.length > 0 && (
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Standardy operacyjne</h4>
                <div className="grid grid-cols-1 gap-2.5">
                  {current.points.map((p: string, i: number) => (
                    <div key={i} className="flex items-start gap-3.5 p-4 bg-slate-50/50 rounded-[var(--radius-brand-button)] border border-slate-100 group hover:border-brand-blue/20 transition-colors">
                      <div className="mt-0.5 text-brand-blue shrink-0">
                        <CheckCircle2 size={16} />
                      </div>
                      <span className="text-xs font-bold text-brand-navy leading-snug">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="p-5 border-t border-slate-100 bg-slate-50/50 shrink-0">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              
              <div className="flex items-center gap-3">
                {isTargetInCarousel && carouselModals.length > 1 ? (
                  <>
                    <button 
                      onClick={() => navigate('prev')}
                      className="p-2 bg-white border border-slate-100 rounded-[var(--radius-brand-input)] text-slate-400 hover:text-brand-navy hover:shadow-sm transition-all"
                      title="Poprzedni brief"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    
                    <div className="flex gap-2 px-2">
                      {carouselModals.map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-4 bg-brand-blue' : 'bg-slate-200'}`} 
                        />
                      ))}
                    </div>
                    
                    <button 
                      onClick={() => navigate('next')}
                      className="p-2 bg-white border border-slate-100 rounded-[var(--radius-brand-input)] text-slate-400 hover:text-brand-navy hover:shadow-sm transition-all"
                      title="Następny brief"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                ) : (
                  <div className="text-xs text-slate-400 font-medium">Informacje szczegółowe</div>
                )}
              </div>

              <button 
                onClick={() => { onRegister('why_us_detail_cta'); onClose(); }}
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
            src={current.imageUrl || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600"} 
            alt={current.title || current.internalName} 
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover animate-in fade-in duration-700"
            key={current.id}
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
                {current.standard || "Łączymy twarde prawo z dynamiką biznesową, by Twoje faktury były opłacane w pierwszej kolejności."}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WhyUsDetailModal;