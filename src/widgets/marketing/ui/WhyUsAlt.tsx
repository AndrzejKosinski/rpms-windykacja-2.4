import React from 'react';
import { ShieldCheck, Zap, Gavel, Scale, Clock, Users, BarChart3, Lock } from 'lucide-react';

interface WhyUsProps {
  id?: string;
  onOpenDetail?: (id: string) => void;
}

const WhyUs: React.FC<WhyUsProps> = ({ id, onOpenDetail }) => {
  const features = [
    {
      id: 'speed',
      icon: <Zap size={32} />,
      title: "Szybkość AI",
      desc: "Skanujemy i analizujemy faktury w sekundy. Windykacja startuje natychmiast po Twoim zatwierdzeniu.",
      color: "text-brand-blue",
      bg: "bg-brand-blue/10"
    },
    {
      id: 'power',
      icon: <Gavel size={32} />,
      title: "Moc Prawna",
      desc: "Każde pismo wychodzi z pieczęcią Kancelarii RPMS. Dłużnik wie, że sprawa trafiła do profesjonalistów.",
      color: "text-brand-navy",
      bg: "bg-brand-navy/5"
    },
    {
      id: 'security',
      icon: <Scale size={32} />,
      title: "Bezpieczeństwo",
      desc: "Pełna zgodność z RODO i standardami adwokackimi. Twoje dane i relacje z klientami są chronione.",
      color: "text-brand-blue",
      bg: "bg-brand-blue/10"
    },
    {
      id: 'time',
      icon: <Clock size={32} />,
      title: "Oszczędność Czasu",
      desc: "Automatyzujemy 90% procesów. Ty zajmujesz się biznesem, we odzyskujemy Twoje pieniądze.",
      color: "text-brand-navy",
      bg: "bg-brand-navy/5"
    },
    {
      id: 'human',
      icon: <Users size={32} />,
      title: "Ludzkie Wsparcie",
      desc: "W trudnych sprawach nasi prawnicy przejmują stery. Masz dostęp do realnych ekspertów, nie tylko botów.",
      color: "text-brand-blue",
      bg: "bg-brand-blue/10"
    },
    {
      id: 'transparency',
      icon: <BarChart3 size={32} />,
      title: "Transparentność",
      desc: "Śledzisz postępy każdej sprawy w czasie rzeczywistym. Pełne raporty i statystyki w Twoim panelu.",
      color: "text-brand-navy",
      bg: "bg-brand-navy/5"
    }
  ];

  return (
    <section id={id || 'usp'} className="py-24 lg:py-40 bg-white relative overflow-hidden">
      {/* Dekoracyjne tło */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#0A2E5C_1px,transparent_1px)] [background-size:40px_40px]"></div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-end justify-between mb-24 gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-navy/5 text-brand-navy text-[11px] font-black rounded-full uppercase tracking-[0.2em] mb-6">
              <ShieldCheck size={14} className="text-brand-blue" /> Dlaczego RPMS?
            </div>
            <h2 className="text-4xl lg:text-7xl font-black text-brand-navy leading-tight tracking-tight">
              Nowa era <br />
              <span className="text-brand-blue italic">windykacji biznesowej.</span>
            </h2>
          </div>
          <div className="lg:pb-4">
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-md">
              Zastąpiliśmy nieefektywne metody inteligentnym systemem, który nie odpuszcza dłużnikom, zachowując przy tym najwyższe standardy prawne.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              onClick={() => onOpenDetail?.(feature.id)}
              className="group p-12 bg-slate-50 rounded-[var(--radius-brand-card)] border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 cursor-pointer"
            >
              <div className={`w-20 h-20 ${feature.bg} ${feature.color} rounded-[var(--radius-brand-card)] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500`}>
                {feature.icon}
              </div>
              <h4 className="text-2xl font-black text-brand-navy mb-6 tracking-tight uppercase">{feature.title}</h4>
              <p className="text-slate-500 font-medium leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Dolny baner zaufania */}
        <div className="mt-24 p-12 bg-brand-navy rounded-[var(--radius-brand-card)] text-white flex flex-col lg:flex-row items-center justify-between gap-12 shadow-2xl shadow-brand-navy/20 overflow-hidden relative">
           <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
           
           <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-[var(--radius-brand-card)] flex items-center justify-center text-brand-blue border border-white/10">
                <Lock size={32} />
              </div>
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-black mb-2">Twoje dane są u nas bezpieczne.</h3>
                <p className="text-slate-400 font-medium">Stosujemy bankowe standardy szyfrowania i pełną ochronę RODO.</p>
              </div>
           </div>

           <div className="relative z-10 flex items-center gap-8">
              <div className="text-center">
                 <p className="text-3xl font-black text-white">256-bit</p>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Szyfrowanie AES</p>
              </div>
              <div className="w-px h-12 bg-white/10"></div>
              <div className="text-center">
                 <p className="text-3xl font-black text-white">ISO</p>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Standardy Bezpieczeństwa</p>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
