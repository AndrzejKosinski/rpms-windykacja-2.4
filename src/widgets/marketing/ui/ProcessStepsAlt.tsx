import React from 'react';
import { FileText, Send, Gavel, CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface ProcessStepsProps {
  id?: string;
  onRegister?: (source?: string) => void;
}

const ProcessSteps: React.FC<ProcessStepsProps> = ({ id, onRegister }) => {
  const steps = [
    {
      icon: <FileText size={32} />,
      title: "Skan i Analiza AI",
      desc: "Wgrywasz fakturę do Panelu RPMS. Nasze AI błyskawicznie wyciąga dane i weryfikuje dłużnika w bazach gospodarczych.",
      color: "bg-brand-blue"
    },
    {
      icon: <Send size={32} />,
      title: "Wezwanie Przedsądowe",
      desc: "System automatycznie generuje i wysyła ostateczne wezwanie do zapłaty z pieczęcią Kancelarii RPMS. To sygnał, że żarty się skończyły.",
      color: "bg-amber-500"
    },
    {
      icon: <Gavel size={32} />,
      title: "Pozew i Nakaz Zapłaty",
      desc: "Jeśli dłużnik milczy, prawnicy RPMS kierują sprawę do EPU. Uzyskujemy nakaz zapłaty, który jest tytułem egzekucyjnym.",
      color: "bg-brand-navy"
    },
    {
      icon: <CheckCircle2 size={32} />,
      title: "Skuteczna Spłata",
      desc: "Nadzorujemy egzekucję komorniczą lub doprowadzamy do dobrowolnej spłaty. Pieniądze trafiają na Twoje konto.",
      color: "bg-green-500"
    }
  ];

  return (
    <section id={id || 'process'} className="py-24 lg:py-40 bg-white relative overflow-hidden">
      {/* Dekoracyjne tło */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-slate-100 -z-10"></div>
      
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-navy/5 text-brand-navy text-[11px] font-black rounded-full uppercase tracking-[0.2em] mb-6">
              <Zap size={14} className="text-brand-blue fill-brand-blue" /> Proces RPMS krok po kroku
            </div>
            <h2 className="text-4xl lg:text-7xl font-black text-brand-navy leading-tight tracking-tight">
              Od faktury do <br />
              <span className="text-brand-blue italic">przelewu na konto.</span>
            </h2>
          </div>
          <div 
            className="flex items-center gap-4 p-6 bg-slate-50 rounded-[var(--radius-brand-card)] border border-slate-100 cursor-pointer hover:bg-white hover:shadow-xl transition-all"
            onClick={() => onRegister?.('process_steps_badge')}
          >
             <ShieldCheck size={32} className="text-brand-blue" />
             <div>
                <p className="text-brand-navy font-black text-sm leading-none mb-1">Pełna transparentność</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Śledzisz postępy 24/7 w panelu</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative">
          {/* Linie łączące dla desktopu */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 -z-10"></div>
          
          {steps.map((step, idx) => (
            <div key={idx} className="group relative">
              <div 
                onClick={() => onRegister?.(`process_step_${idx + 1}`)}
                className="bg-white p-10 rounded-[var(--radius-brand-card)] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 flex flex-col h-full cursor-pointer"
              >
                <div className={`w-20 h-20 ${step.color} rounded-[var(--radius-brand-card)] flex items-center justify-center text-white mb-10 shadow-lg shadow-${step.color.split('-')[1]}-500/20 group-hover:scale-110 transition-transform duration-500`}>
                  {step.icon}
                </div>
                
                <div className="flex items-center gap-3 mb-6">
                   <span className="text-4xl font-black text-slate-100 group-hover:text-brand-blue/10 transition-colors">0{idx + 1}</span>
                   <h4 className="text-xl font-black text-brand-navy leading-tight">{step.title}</h4>
                </div>
                
                <p className="text-slate-500 font-medium leading-relaxed flex-1">
                  {step.desc}
                </p>

                <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                   <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Standard RPMS</span>
                   <ArrowRight size={16} className="text-slate-200 group-hover:text-brand-blue group-hover:translate-x-1 transition-all" />
                </div>
              </div>
              
              {/* Strzałka łącząca dla desktopu */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-4 -translate-y-1/2 z-20 w-8 h-8 bg-white border border-slate-100 rounded-full items-center justify-center text-slate-300 shadow-sm">
                  <ArrowRight size={14} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-24 text-center">
           <div className="inline-block p-8 bg-brand-navy rounded-[var(--radius-brand-card)] text-white shadow-2xl shadow-brand-navy/20">
              <p className="text-lg font-medium mb-6">Średni czas odzyskania należności w modelu hybrydowym:</p>
              <div className="flex items-center justify-center gap-8">
                 <div className="text-center">
                    <p className="text-4xl font-black text-brand-blue">14 dni</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Windykacja Polubowna</p>
                 </div>
                 <div className="w-px h-12 bg-white/10"></div>
                 <div className="text-center">
                    <p className="text-4xl font-black text-white">45 dni</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Ścieżka Sądowa (EPU)</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;
