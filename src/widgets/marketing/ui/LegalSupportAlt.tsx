import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Gavel, Scale, FileText, CheckCircle2, Zap, Lock, Award } from 'lucide-react';

interface LegalSupportProps {
  id?: string;
  onOpenLawyer?: () => void;
}

const LegalSupport: React.FC<LegalSupportProps> = ({ id, onOpenLawyer }) => {
  return (
    <section id={id || 'legal_support'} className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          
          {/* Lewa kolumna: Treść */}
          <div className="lg:w-1/2 space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-blue/10 text-brand-blue text-[11px] font-black rounded-full uppercase tracking-[0.2em]">
              <Award size={14} className="text-brand-blue" /> Gwarancja Kancelarii RPMS
            </div>
            
            <h2 className="text-4xl lg:text-7xl font-black text-brand-navy leading-[1.1] tracking-tight">
              Twarda windykacja <br />
              <span className="text-brand-blue italic">z ludzką twarzą.</span>
            </h2>
            
            <p className="text-lg lg:text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
              W RPMS nie jesteś tylko numerem w systemie. Każda sprawa, choć wspierana przez AI, jest nadzorowana przez doświadczonych prawników. Łączymy nieuchronność działań prawnych z etyką biznesową.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 pt-6">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-brand-navy rounded-[var(--radius-brand-button)] flex items-center justify-center text-white shadow-lg">
                  <Gavel size={24} />
                </div>
                <h4 className="text-lg font-black text-brand-navy uppercase tracking-tighter">Pełnomocnictwo</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Reprezentujemy Cię przed sądami i komornikami w całej Polsce. Masz pewność, że Twoje interesy są chronione przez profesjonalistów.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-brand-blue rounded-[var(--radius-brand-button)] flex items-center justify-center text-white shadow-lg">
                  <Scale size={24} />
                </div>
                <h4 className="text-lg font-black text-brand-navy uppercase tracking-tighter">Etyka i Prawo</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Działamy zgodnie z najwyższymi standardami etyki adwokackiej i radcowskiej. Budujemy Twój wizerunek jako profesjonalnego wierzyciela.
                </p>
              </div>
            </div>

            <div className="pt-10 flex flex-col sm:flex-row items-center gap-10">
              <div className="flex items-center gap-6">
                <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="relative w-12 h-12 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-sm">
                        <Image 
                          src={`https://i.pravatar.cc/100?img=${i+20}`} 
                          alt="Prawnik RPMS" 
                          fill
                          sizes="48px"
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ))}
                </div>
                <div>
                    <p className="text-brand-navy font-black text-sm">Zespół 15+ ekspertów prawnych</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gotowych do działania w Twoim imieniu</p>
                </div>
              </div>

              <button 
                onClick={onOpenLawyer}
                className="px-8 py-4 bg-slate-50 text-brand-navy font-black text-xs uppercase tracking-widest rounded-[var(--radius-brand-button)] hover:bg-brand-blue hover:text-white transition-all border border-slate-100"
              >
                Porozmawiaj z prawnikiem
              </button>
            </div>
          </div>

          {/* Prawa kolumna: Wizualizacja certyfikatu/bezpieczeństwa */}
          <div className="lg:w-1/2 relative">
            <div className="relative z-10 bg-brand-navy rounded-[var(--radius-brand-card)] p-12 lg:p-20 text-white shadow-[0_50px_100px_-20px_rgba(10,46,92,0.4)] overflow-hidden">
              {/* Dekoracyjne poświaty */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/20 rounded-full blur-[100px]"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-brand-blue/10 rounded-full blur-[80px]"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-[var(--radius-brand-card)] flex items-center justify-center text-brand-blue border border-white/20 shadow-2xl animate-pulse">
                  <ShieldCheck size={48} />
                </div>
                
                <h3 className="text-3xl font-black italic tracking-tight">Certyfikat Bezpieczeństwa <br /> Prawnego RPMS</h3>
                
                <div className="w-full h-px bg-white/10"></div>
                
                <div className="grid grid-cols-2 gap-8 w-full">
                  <div className="text-center">
                    <p className="text-2xl font-black text-brand-blue mb-1">100%</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Zgodność z RODO</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-brand-blue mb-1">OC</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pełne Ubezpieczenie</p>
                  </div>
                </div>

                <p className="text-slate-400 font-medium text-sm leading-relaxed">
                  Każda operacja w systemie RPMS jest szyfrowana i archiwizowana zgodnie z wymogami tajemnicy zawodowej adwokackiej i radcowskiej.
                </p>

                <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-[var(--radius-brand-button)] border border-white/10">
                  <Lock size={16} className="text-brand-blue" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Szyfrowanie AES-256</span>
                </div>
              </div>
            </div>

            {/* Dekoracja za kartą */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-blue/10 rounded-full -z-10 blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-brand-navy/5 rounded-full -z-10 blur-3xl"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LegalSupport;
