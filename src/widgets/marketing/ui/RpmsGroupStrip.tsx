import React from 'react';
import { Scale, ShieldAlert, Calculator, ArrowRightLeft, Landmark } from 'lucide-react';

const groupEntities = [
  { name: 'Kancelaria RPMS', icon: Scale, href: '#' },
  { name: 'Windykacja RPMS', icon: ShieldAlert, href: '#' },
  { name: 'Księgowość RPMS', icon: Calculator, href: '#' },
  { name: 'Przekształcenia RPMS', icon: ArrowRightLeft, href: '#' },
  { name: 'Podatki RPMS', icon: Landmark, href: '#' },
];

const RpmsGroupStrip = () => {
  return (
    <section className="py-16 bg-slate-50/50 border-y border-slate-200/50 relative overflow-hidden">
      {/* Subtelna tekstura w tle */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col items-center mb-10">
          <p className="text-[10px] font-black text-brand-blue uppercase tracking-[0.3em] mb-2">Ekosystem</p>
          <h3 className="text-sm font-black text-brand-navy uppercase tracking-[0.1em]">Grupa RPMS</h3>
          <div className="w-12 h-0.5 bg-brand-blue/20 mt-2"></div>
        </div>
        
        <div className="flex flex-wrap lg:flex-nowrap justify-center lg:justify-between items-center gap-y-8 gap-x-6 lg:gap-x-0">
          {groupEntities.map((ent, i) => (
            <React.Fragment key={i}>
              <a 
                href={ent.href} 
                className="group flex items-center gap-3 text-slate-400 hover:text-brand-blue hover:-translate-y-1 transition-all duration-500 whitespace-nowrap"
              >
                <div className="relative">
                  <ent.icon size={24} strokeWidth={1.5} className="relative z-10 transition-colors duration-500" />
                  <div className="absolute inset-0 bg-brand-blue/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <span className="font-black text-base xl:text-lg tracking-tight transition-colors duration-500">{ent.name}</span>
              </a>
              {/* Separator for desktop, hidden on last item */}
              {i < groupEntities.length - 1 && (
                <div className="hidden lg:block h-6 w-px bg-slate-200/60 mx-2"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RpmsGroupStrip;
