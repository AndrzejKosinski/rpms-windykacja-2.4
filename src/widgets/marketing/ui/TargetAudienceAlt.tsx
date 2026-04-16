import React from 'react';
import { Building2, Users, Briefcase, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

interface TargetAudienceProps {
  id?: string;
  onConsult: () => void;
  onOpenSolution: (id: string) => void;
}

const TargetAudience: React.FC<TargetAudienceProps> = ({ id, onConsult, onOpenSolution }) => {
  const audiences = [
    {
      id: 'smb',
      icon: <Users size={32} />,
      title: "Małe i Średnie Firmy",
      desc: "Dla przedsiębiorców, którzy cenią czas i chcą szybko odzyskać płatności od nierzetelnych kontrahentów bez wysokich kosztów prawnych.",
      features: ["Windykacja polubowna", "Szybkie wezwania", "Panel online 24/7"],
      color: "bg-brand-blue"
    },
    {
      id: 'corp',
      icon: <Building2 size={32} />,
      title: "Duże Przedsiębiorstwa",
      desc: "Dla firm z dużym portfelem wierzytelności, wymagających automatyzacji procesów, integracji API i twardego wsparcia procesowego.",
      features: ["Masowa windykacja", "Integracja ERP/API", "Dedykowany prawnik"],
      color: "bg-brand-navy"
    },
    {
      id: 'legal',
      icon: <Briefcase size={32} />,
      title: "Kancelarie i Biura",
      desc: "Dla podmiotów profesjonalnych szukających wsparcia w zakresie automatyzacji EPU i monitoringu komorniczego dla swoich klientów.",
      features: ["Outsourcing EPU", "Monitoring 24/7", "Biała etykieta (White-label)"],
      color: "bg-slate-800"
    }
  ];

  return (
    <section id={id || 'audience'} className="py-24 lg:py-40 bg-slate-50 relative overflow-hidden">
      {/* Dekoracyjne tło */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#0A2E5C_1px,transparent_1px)] [background-size:60px_60px]"></div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-navy/5 text-brand-navy text-[11px] font-black rounded-full uppercase tracking-[0.2em] mb-6">
            <Zap size={14} className="text-brand-blue fill-brand-blue" /> Rozwiązania Szyte na Miarę
          </div>
          <h2 className="text-4xl lg:text-7xl font-black text-brand-navy mb-8 tracking-tight">
            Dla kogo jest <br />
            <span className="text-brand-blue italic">RPMS Windykacja?</span>
          </h2>
          <p className="text-xl text-slate-500 font-medium leading-relaxed">
            Niezależnie od skali Twojego biznesu, dostarczamy narzędzia i wsparcie prawne, które realnie przekładają się na odzyskane pieniądze.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {audiences.map((item) => (
            <div 
              key={item.id} 
              className="group bg-white rounded-[var(--radius-brand-card)] p-12 border border-slate-100 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 flex flex-col"
            >
              <div className={`w-20 h-20 ${item.color} text-white rounded-[var(--radius-brand-card)] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                {item.icon}
              </div>
              
              <h3 className="text-2xl font-black text-brand-navy mb-6 tracking-tight uppercase">{item.title}</h3>
              
              <p className="text-slate-500 font-medium leading-relaxed mb-10 flex-1">
                {item.desc}
              </p>

              <ul className="space-y-4 mb-12">
                {item.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold text-brand-navy uppercase tracking-tighter">
                    <CheckCircle2 size={18} className="text-brand-blue" />
                    {feat}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => onOpenSolution(item.id)}
                className="w-full py-5 bg-slate-50 text-brand-navy font-black rounded-[var(--radius-brand-button)] hover:bg-brand-blue hover:text-white transition-all flex items-center justify-center gap-3 group/btn"
              >
                Zobacz szczegóły <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <button 
            onClick={onConsult}
            className="inline-flex items-center gap-3 text-brand-navy font-black text-sm uppercase tracking-widest hover:text-brand-blue transition-colors group"
          >
            Nie wiesz co wybrać? Porozmawiaj z naszym ekspertem <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform text-brand-blue" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TargetAudience;
