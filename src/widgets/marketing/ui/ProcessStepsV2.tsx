"use client";

import React from 'react';
import { FilePlus, Scale, FileSignature, Landmark, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useModal } from '../../../context/ModalContext';
import { logCustomEvent } from '../../../utils/customLogger';

interface ProcessStepsV2Props {
  id?: string;
}

const ProcessStepsV2: React.FC<ProcessStepsV2Props> = ({ id }) => {
  const { setActiveModal } = useModal();

  const handleRegister = (source: string) => {
    setActiveModal('onboarding');
    logCustomEvent({ event_name: 'modal_open_onboarding', metadata: { source } });
  };

  const steps = [
    {
      icon: <FilePlus size={28} />,
      title: "Zgłoszenie sprawy",
      desc: "Dodajesz fakturę ręcznie w Panelu Klienta. My natychmiast wysyłamy do dłużnika ostateczne przedsądowe wezwanie do zapłaty. Jeśli dłużnik chce rozmawiać — prowadzimy negocjacje.",
      color: "bg-brand-blue",
      shadow: "shadow-brand-blue/30"
    },
    {
      icon: <Scale size={28} />,
      title: "Pozew do sądu",
      desc: "Jeśli dłużnik nie reaguje, przygotowujemy pozew i składamy go do sądu (EPU lub tradycyjnie). O każdym kroku informujemy Cię mailowo i poprzez zmianę statusu w Panelu.",
      color: "bg-amber-500",
      shadow: "shadow-amber-500/30"
    },
    {
      icon: <FileSignature size={28} />,
      title: "Nakaz zapłaty",
      desc: "Po uzyskaniu nakazu zapłaty lub wyroku informujemy dłużnika o bezwzględnym obowiązku zapłaty. Jeśli nadal unika spłaty — przygotowujemy sprawę do egzekucji.",
      color: "bg-brand-navy",
      shadow: "shadow-brand-navy/30"
    },
    {
      icon: <Landmark size={28} />,
      title: "Egzekucja komornicza",
      desc: "Składamy wniosek do komornika i nadzorujemy cały proces. Ty na bieżąco widzisz postępy w Panelu 24/7, aż do momentu odzyskania środków.",
      color: "bg-green-500",
      shadow: "shadow-green-500/30"
    }
  ];

  return (
    <section id={id || 'process'} className="pt-12 pb-16 bg-white relative overflow-hidden">
      {/* Dekoracyjne tło */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-slate-100 -z-10"></div>
      
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-12 gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-navy/5 text-brand-navy text-[11px] font-black rounded-full uppercase tracking-[0.2em] mb-6">
              <Zap size={14} className="text-brand-blue fill-brand-blue" /> Proces windykacji
            </div>
            <h2 className="text-4xl lg:text-6xl font-black text-brand-navy leading-tight tracking-tight">
              Jak to działa? <br />
              <span className="text-brand-blue italic">4 proste kroki.</span>
            </h2>
          </div>
          <div 
            className="flex items-center gap-4 p-5 bg-slate-50 rounded-[var(--radius-brand-card)] border border-slate-100 cursor-pointer hover:bg-white hover:shadow-xl transition-all"
            onClick={() => handleRegister('process_steps_badge')}
          >
             <ShieldCheck size={28} className="text-brand-blue" />
             <div>
                <p className="text-brand-navy font-black text-sm leading-none mb-1">Pełna transparentność</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Śledzisz postępy 24/7 w panelu</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative">
          {/* Linie łączące dla desktopu */}
          <div className="hidden lg:block absolute top-[64px] left-0 w-full h-0.5 bg-slate-100 -z-10"></div>
          
          {steps.map((step, idx) => (
            <div key={idx} className="group relative">
              <div 
                onClick={() => handleRegister(`process_step_${idx + 1}`)}
                className="bg-white p-8 rounded-[var(--radius-brand-card)] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200 transition-all duration-500 flex flex-col h-full cursor-pointer"
              >
                <div className={`w-16 h-16 ${step.color} rounded-[var(--radius-brand-button)] flex items-center justify-center text-white mb-8 shadow-lg ${step.shadow} group-hover:scale-110 transition-transform duration-500`}>
                  {step.icon}
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                   <span className="text-3xl font-black text-slate-100 group-hover:text-brand-blue/10 transition-colors">0{idx + 1}</span>
                   <h3 className="text-lg font-black text-brand-navy leading-tight">{step.title}</h3>
                </div>
                
                <p className="text-slate-500 text-sm font-medium leading-relaxed flex-1">
                  {step.desc}
                </p>

                <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                   <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Standard RPMS</span>
                   <ArrowRight size={16} className="text-slate-200 group-hover:text-brand-blue group-hover:translate-x-1 transition-all" />
                </div>
              </div>
              
              {/* Strzałka łącząca dla desktopu */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-[64px] -right-4 -translate-y-1/2 z-20 w-8 h-8 bg-white border border-slate-100 rounded-full items-center justify-center text-slate-300 shadow-sm">
                  <ArrowRight size={14} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
           <div className="inline-block p-6 bg-brand-navy rounded-[var(--radius-brand-card)] text-white shadow-xl shadow-brand-navy/20">
              <p className="text-sm font-medium mb-4 text-slate-300">Średni czas odzyskania należności w modelu hybrydowym:</p>
              <div className="flex items-center justify-center gap-8">
                 <div className="text-center">
                    <p className="text-3xl font-black text-brand-blue">14 dni</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Windykacja Polubowna</p>
                 </div>
                 <div className="w-px h-10 bg-white/10"></div>
                 <div className="text-center">
                    <p className="text-3xl font-black text-white">45 dni</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Ścieżka Sądowa (EPU)</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessStepsV2;
