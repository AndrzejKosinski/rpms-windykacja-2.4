import React from 'react';
import Image from 'next/image';
import { ExternalLink, ShieldCheck, Mail, Phone } from 'lucide-react';

const LegalGuardianCard: React.FC = () => {
  return (
    <div className="bg-white rounded-[var(--radius-brand-card)] border border-slate-100 p-6 lg:p-8 shadow-sm hover:shadow-md transition-all duration-300 mb-12 group overflow-hidden relative">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-light-blue/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
      
      <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
        {/* Photo Section */}
        <div className="relative shrink-0">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-[var(--radius-brand-card)] overflow-hidden border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-500">
            <Image 
              src="https://rpms.pl/wp-content/uploads/2024/08/18.jpg.webp" 
              alt="Adrian Smętek - Opiekun Prawny"
              fill
              sizes="128px"
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-blue text-white rounded-[var(--radius-brand-button)] flex items-center justify-center shadow-lg border-2 border-white">
            <ShieldCheck size={20} />
          </div>
        </div>

        {/* Info Section */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
            <h2 className="text-2xl font-black text-brand-navy tracking-tight">Adrian Smętek</h2>
            <span className="inline-flex items-center px-3 py-1 bg-brand-light-blue text-brand-blue text-[10px] font-black uppercase tracking-widest rounded-full border border-brand-blue/10 self-center md:self-auto">
              PRAWNIK / TWÓJ OPIEKUN
            </span>
          </div>
          <p className="text-slate-500 font-medium max-w-xl leading-relaxed mb-6">
            Dedykowany opiekun prawny Twojej firmy. Czuwam nad przebiegiem wszystkich spraw egzekucyjnych i dbam o skuteczne odzyskanie Twoich należności.
          </p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <a 
              href="https://rpms.pl/zespol/adrian-smetek-prawnik-rpms/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-navy text-white rounded-[var(--radius-brand-button)] font-black text-[10px] uppercase tracking-widest hover:bg-brand-blue transition-all shadow-lg shadow-brand-navy/10 group/link"
            >
              Pełny profil <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-[var(--radius-brand-button)] font-black text-[10px] uppercase tracking-widest hover:border-brand-blue hover:text-brand-blue transition-all">
              <Mail size={14} /> Napisz wiadomość
            </button>
          </div>
        </div>

        {/* Quick Contact Badge */}
        <div className="hidden lg:flex flex-col items-end gap-2 pr-4">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Wsparcie prawne 24/7</p>
          <div className="flex items-center gap-3 text-brand-navy font-black">
            <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-[var(--radius-brand-input)] flex items-center justify-center">
              <Phone size={16} />
            </div>
            <span className="text-lg tracking-tighter">+48 61 307 09 91</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalGuardianCard;
