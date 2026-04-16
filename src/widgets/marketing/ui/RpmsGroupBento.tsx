import React from 'react';
import { Scale, ShieldAlert, Calculator, ArrowRightLeft, Landmark, ChevronRight } from 'lucide-react';

const groupEntities = [
  { name: 'Kancelaria RPMS', desc: 'Kompleksowa obsługa prawna biznesu. Doradztwo strategiczne i reprezentacja przed sądami.', icon: Scale, href: '#' },
  { name: 'Windykacja RPMS', desc: 'Skuteczne odzyskiwanie należności.', icon: ShieldAlert, href: '#' },
  { name: 'Księgowość RPMS', desc: 'Nowoczesne biuro rachunkowe.', icon: Calculator, href: '#' },
  { name: 'Przekształcenia RPMS', desc: 'Reorganizacja i fuzje spółek.', icon: ArrowRightLeft, href: '#' },
  { name: 'Podatki RPMS', desc: 'Optymalizacja i doradztwo.', icon: Landmark, href: '#' },
];

const RpmsGroupBento = () => {
  return (
    <section className="py-16 bg-brand-navy text-white relative overflow-hidden">
      {/* Dynamiczne tło */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-blue/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-brand-blue/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="mb-12 text-center lg:text-left">
          <h2 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tight">
            Ekosystem Grupy <span className="text-brand-blue relative inline-block">
              RPMS
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-brand-blue/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 25 0, 50 5 T 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>
          </h2>
          <p className="text-slate-400 text-lg font-medium max-w-2xl leading-relaxed">
            Synergia ekspertów dla bezpieczeństwa Twojego biznesu. Poznaj nasze wyspecjalizowane działy, które tworzą kompletną tarczę prawną.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Kancelaria - Duży kafel */}
          <a 
            href={groupEntities[0].href} 
            className="group col-span-1 md:col-span-2 lg:col-span-2 row-span-2 p-8 rounded-[var(--radius-brand-card)] border bg-brand-blue/10 border-brand-blue/30 relative overflow-hidden hover:border-brand-blue/50 transition-all duration-500 flex flex-col justify-between min-h-[320px] backdrop-blur-sm"
          >
            <div className="w-14 h-14 bg-brand-blue/20 text-brand-blue border border-brand-blue/20 rounded-[var(--radius-brand-button)] flex items-center justify-center mb-6 relative z-10 shadow-lg shadow-brand-blue/10">
              <Scale size={28} strokeWidth={1.5} />
            </div>
            <div className="relative z-10">
              <h3 className="text-3xl lg:text-4xl font-black mb-4 leading-tight text-white">{groupEntities[0].name}</h3>
              <p className="text-slate-300 text-lg leading-relaxed font-medium mb-8 max-w-md">{groupEntities[0].desc}</p>
              <div className="flex items-center gap-2 text-[12px] font-black text-brand-blue uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
                Poznaj pełen zakres usług <ChevronRight size={16} />
              </div>
            </div>
            {/* Dekoracyjne tło wewnątrz karty */}
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
          </a>
          
          {/* Pozostałe 4 kafelki */}
          {groupEntities.slice(1).map((ent, i) => (
            <a 
              key={i} 
              href={ent.href} 
              className="group col-span-1 p-6 rounded-[var(--radius-brand-card)] border bg-white/[0.03] border-white/10 backdrop-blur-sm relative overflow-hidden hover:border-white/30 hover:bg-white/[0.06] transition-all duration-500 flex flex-col justify-between"
            >
              <div className="w-14 h-14 bg-white/5 border border-white/5 text-slate-300 group-hover:text-brand-blue group-hover:bg-brand-blue/10 group-hover:border-brand-blue/20 rounded-[var(--radius-brand-button)] flex items-center justify-center mb-6 transition-all duration-500 relative z-10 shadow-sm">
                <ent.icon size={24} strokeWidth={1.5} />
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-black mb-2 text-white group-hover:text-brand-blue transition-colors">{ent.name}</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-medium mb-6">{ent.desc}</p>
                <div className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] group-hover:text-brand-blue group-hover:gap-3 transition-all">
                  Więcej <ChevronRight size={14} />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RpmsGroupBento;
