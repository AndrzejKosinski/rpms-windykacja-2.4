import React from 'react';
import { Scale, ShieldAlert, Calculator, ArrowRightLeft, Landmark, ChevronRight } from 'lucide-react';

interface RpmsGroupCardsProps {
  id?: string;
}

const groupEntities = [
  { name: 'Kancelaria RPMS', desc: 'Kompleksowa obsługa prawna biznesu.', icon: Scale, href: '#' },
  { name: 'Windykacja RPMS', desc: 'Skuteczne odzyskiwanie należności.', icon: ShieldAlert, href: '#' },
  { name: 'Księgowość RPMS', desc: 'Nowoczesne biuro rachunkowe.', icon: Calculator, href: '#' },
  { name: 'Przekształcenia RPMS', desc: 'Reorganizacja i fuzje spółek.', icon: ArrowRightLeft, href: '#' },
  { name: 'Podatki RPMS', desc: 'Optymalizacja i doradztwo podatkowe.', icon: Landmark, href: '#' },
];

const RpmsGroupCards: React.FC<RpmsGroupCardsProps> = ({ id }) => {
  return (
    <section id={id || 'group-ecosystem'} className="pt-12 pb-16 bg-white relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Nagłówek sekcji spójny z WHY_US_V2 */}
        <div className="mb-16">
          <h2 className="text-4xl lg:text-7xl font-black text-brand-navy mb-8 leading-[1.1] tracking-tight">
            Siła Grupy <span className="text-brand-blue relative inline-block">
              RPMS
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-brand-blue/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 25 0, 50 5 T 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>
          </h2>
          <p className="text-base lg:text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
            Kompleksowe wsparcie dla Twojego biznesu w jednym miejscu. Poznaj wyspecjalizowane działy, które wspólnie pracują na Twoje bezpieczeństwo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {groupEntities.map((ent, i) => (
            <a 
              key={i} 
              href={ent.href} 
              className="group p-8 bg-white rounded-[var(--radius-brand-card)] border border-slate-100 hover:shadow-xl hover:shadow-slate-50 transition-all duration-500 cursor-pointer hover:-translate-y-2 flex flex-col"
            >
              {/* Box ikony spójny z WHY_US_V2 */}
              <div className="w-14 h-14 bg-slate-50 border border-slate-50 rounded-[var(--radius-brand-button)] flex items-center justify-center mb-6 group-hover:bg-brand-blue/5 group-hover:border-brand-blue/20 transition-all duration-300 shadow-sm">
                <ent.icon className="text-brand-blue" size={24} strokeWidth={1.5} />
              </div>
              
              <h3 className="text-lg lg:text-xl font-black text-brand-navy mb-2 group-hover:text-brand-blue transition-colors leading-tight">
                {ent.name}
              </h3>
              
              <p className="text-slate-500 leading-relaxed text-sm font-medium mb-6 flex-grow">
                {ent.desc}
              </p>
              
              <div className="mt-auto flex items-center gap-2 text-[10px] font-black text-brand-blue lg:opacity-0 group-hover:opacity-100 transition-all uppercase tracking-widest">
                Więcej 
                <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RpmsGroupCards;
