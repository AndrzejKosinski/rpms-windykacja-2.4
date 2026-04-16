import React from 'react';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Zap, Gavel, MessageSquare, Star } from 'lucide-react';
import HeroAnimation from './HeroAnimationAlt';

interface HeroProps {
  id?: string;
  onRegister: (source?: string) => void;
  onOpenLawyer?: () => void;
  data?: any;
}

const HeroAltV2: React.FC<HeroProps> = ({ id, onRegister, onOpenLawyer, data }) => {
  const title = data?.title || "Szybkie i skuteczne odzyskiwanie należności";
  const description = data?.description || "Połączyliśmy twardą wiedzę prawniczą Kancelarii RPMS z technologią AI. Skuteczność adwokacka w cenie i szybkości aplikacji.";

  return (
    <section id={id || 'hero'} className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-white">
      {/* Dekoracyjne elementy tła - odwrócone */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-brand-blue/5 rounded-full blur-[120px] -translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-brand-light-blue/20 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3"></div>
      
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full relative z-10">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-16 lg:gap-24">
          
          {/* Prawa kolumna (wcześniej lewa): Tekst i CTA */}
          <div className="lg:w-3/5 space-y-10 text-center lg:text-left">
            
            <h1 className="text-5xl lg:text-[100px] font-black text-brand-navy leading-[0.9] tracking-tighter animate-in fade-in slide-in-from-left duration-700 delay-100">
              {title.split(' ').map((word: string, i: number) => (
                <React.Fragment key={i}>
                  {word === 'Swoje' || word === 'Pieniądze' ? <span className="text-brand-blue italic">{word} </span> : word + ' '}
                  {(i === 1 || i === 2 || i === 3) && <br />}
                </React.Fragment>
              ))}
            </h1>
            
            <div className="flex justify-center lg:justify-start">
              <p className="text-xl lg:text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl animate-in fade-in slide-in-from-left duration-700 delay-200">
                {description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-4 animate-in fade-in slide-in-from-left duration-700 delay-300">
              <button 
                onClick={() => onRegister('hero_primary')}
                className="group relative px-10 py-6 bg-brand-blue text-white rounded-[var(--radius-brand-button)] font-black text-lg shadow-2xl shadow-brand-blue/30 hover:bg-brand-blue/90 transition-all overflow-hidden w-full sm:w-auto"
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  Przekaż sprawę do windykacji <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
              
              <button 
                onClick={onOpenLawyer}
                className="flex items-center gap-4 px-8 py-6 text-brand-navy font-black text-lg hover:text-brand-blue transition-colors group"
              >
                <div className="w-14 h-14 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center shadow-lg group-hover:border-brand-blue transition-all">
                  <MessageSquare size={20} className="text-brand-blue" />
                </div>
                Bezpłatna konsultacja
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-10 pt-10 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-500">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="relative w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                      <Image 
                        src={`https://i.pravatar.cc/100?img=${i+10}`} 
                        alt="User" 
                        fill
                        sizes="40px"
                        className="object-cover"
                        referrerPolicy="no-referrer"
                        priority
                      />
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex text-amber-400 mb-0.5">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill="currentColor" />)}
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">+2,500 Zadowolonych Klientów</p>
                </div>
              </div>
              
              <div className="h-10 w-px bg-slate-100 hidden sm:block"></div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-navy/5 rounded-[var(--radius-brand-button)] flex items-center justify-center text-brand-blue">
                  <ShieldCheck size={24} />
                </div>
                <div className="text-left">
                  <p className="text-brand-navy font-black text-sm leading-none mb-1">Gwarancja RPMS</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nadzór Adwokacki</p>
                </div>
              </div>
            </div>
          </div>

          {/* Lewa kolumna (wcześniej prawa): Animacja / Wizualizacja */}
          <div className="lg:w-2/5 relative animate-in zoom-in duration-1000 delay-200">
            <HeroAnimation />
            
            {/* Pływające karty statusu - odwrócone pozycje */}
            <div className="absolute -top-10 -left-10 p-6 bg-white/80 backdrop-blur-xl border border-white rounded-[var(--radius-brand-card)] shadow-2xl animate-float">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/10 text-green-600 rounded-[var(--radius-brand-button)] flex items-center justify-center">
                    <Zap size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status EPU</p>
                    <p className="text-brand-navy font-black">Nakaz Zapłaty Wydany</p>
                  </div>
               </div>
            </div>

            <div className="absolute -bottom-10 -right-10 p-6 bg-brand-navy text-white rounded-[var(--radius-brand-card)] shadow-2xl animate-float-delayed">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-[var(--radius-brand-button)] flex items-center justify-center">
                    <Gavel size={24} className="text-brand-blue" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Kancelaria RPMS</p>
                    <p className="font-black">Pełna Moc Prawna</p>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 6s ease-in-out infinite;
          animation-delay: 3s;
        }
      `}</style>
    </section>
  );
};

export default HeroAltV2;
