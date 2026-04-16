"use client";

import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Gavel, Scale, FileCheck, Users2, Award } from 'lucide-react';
import { useModal } from '../../../context/ModalContext';
import { logCustomEvent } from '../../../utils/customLogger';

interface LegalSupportProps {
  id?: string;
}

const LegalSupport: React.FC<LegalSupportProps> = ({ id }) => {
  const { setActiveModal } = useModal();

  const handleOpenLawyer = () => {
    setActiveModal('lawyer');
    logCustomEvent({ event_name: 'modal_open_lawyer' });
  };

  return (
    <section id={id || 'legal_support'} className="py-32 bg-white relative overflow-hidden">
      {/* Subtelny gradient w tle dla głębi */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-brand-light-blue/20 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 -z-10"></div>
      
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
          
          {/* Lewa kolumna: Immersyjne zdjęcie z dowodami aktywności */}
          <div className="lg:w-1/2 relative group">
            <div className="relative z-10 rounded-[var(--radius-brand-card)] overflow-hidden shadow-[0_50px_100px_-20px_rgba(10,46,92,0.15)] border-[20px] border-slate-50 aspect-[4/5]">
              <Image 
                src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=1000" 
                alt="Zespół prawników RPMS Windykacja" 
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay: Status pracy ekspertów */}
              <div className="absolute top-8 left-8 right-8 flex justify-between items-start pointer-events-none">
                <div className="bg-white/90 backdrop-blur-md px-5 py-3 rounded-[var(--radius-brand-button)] shadow-xl flex items-center gap-3 animate-in slide-in-from-left duration-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                  <span className="text-[11px] font-black text-brand-navy uppercase tracking-widest">Zespół In-House Online</span>
                </div>
                <div className="bg-brand-navy/90 backdrop-blur-md p-4 rounded-[var(--radius-brand-button)] shadow-xl text-white animate-in slide-in-from-right duration-700">
                  <Award size={24} className="text-brand-blue" />
                </div>
              </div>

              {/* Dolna karta z cytatem/misją */}
              <div className="absolute bottom-10 left-10 right-10 bg-white/95 backdrop-blur-xl p-8 rounded-[var(--radius-brand-card)] shadow-2xl border border-white/20 transform group-hover:-translate-y-2 transition-transform duration-500">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="relative w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                        <Image 
                          src={`https://i.pravatar.cc/100?img=${i+10}`} 
                          alt="Ekspert" 
                          fill
                          sizes="40px"
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Wsparcie 25+ ekspertów</p>
                </div>
                <p className="text-brand-navy font-bold leading-relaxed italic text-sm lg:text-base">
                  "System RPMS daje nam szybkość, ale to nasze doświadczenie procesowe gwarantuje skuteczność przed sądem."
                </p>
              </div>
            </div>
            
            {/* Dekoracja za zdjęciem */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-blue/10 rounded-full -z-10 blur-2xl"></div>
          </div>

          {/* Prawa kolumna: Kompetencje i szczegóły */}
          <div className="lg:w-1/2">
            <div className="mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-light-blue text-brand-blue text-[11px] font-black rounded-full mb-6 uppercase tracking-[0.2em]">
                <ShieldCheck size={14} /> Gwarancja profesjonalizmu
              </div>
              <h2 className="text-4xl lg:text-6xl font-black text-brand-navy mb-8 leading-[1.1]">
                Realne wsparcie <br />
                <span className="text-brand-blue">Twojej kancelarii RPMS</span>
              </h2>
              <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl">
                W RPMS Windykacja system jest tylko narzędziem. Prawdziwą siłą są nasi radcowie prawni i adwokaci, którzy przejmują stery, gdy sprawa wymaga autorytetu.
              </p>
            </div>

            <div className="space-y-6">
              {[
                { 
                  icon: <Scale className="text-brand-blue" />, 
                  title: "Pełna reprezentacja w EPU", 
                  desc: "Nie musisz logować się do sądów. Nasi prawnicy składają pozwy i monitorują wydanie nakazu zapłaty w Twoim imieniu." 
                },
                { 
                  icon: <FileCheck className="text-brand-blue" />, 
                  title: "Merytoryczny audyt dowodów", 
                  desc: "Prawnik weryfikuje każdą fakturę i protokół odbioru. Eliminujemy błędy formalne, które mogłyby oddalić powództwo." 
                },
                { 
                  icon: <Gavel className="text-brand-blue" />, 
                  title: "Aktywny nadzór komorniczy", 
                  desc: "Nie czekamy biernie. Nasi specjaliści aktywnie współpracują z komornikami, wskazując majątek dłużnika wykryty przez nasze systemy RPMS." 
                }
              ].map((item, idx) => (
                <div key={idx} className="group flex gap-8 p-8 rounded-[var(--radius-brand-card)] bg-slate-50 hover:bg-white hover:shadow-[0_20px_50px_rgba(10,46,92,0.08)] border border-transparent hover:border-slate-100 transition-all duration-500">
                  <div className="w-14 h-14 bg-white rounded-[var(--radius-brand-button)] flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-500">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-brand-navy mb-3 group-hover:text-brand-blue transition-colors">{item.title}</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 flex flex-col sm:flex-row items-center gap-8">
              <button 
                onClick={handleOpenLawyer}
                className="px-10 py-5 bg-brand-navy text-white rounded-[var(--radius-brand-button)] font-black hover:bg-slate-800 transition-all shadow-xl shadow-brand-navy/20 flex items-center gap-3"
              >
                Porozmawiaj z Mecenasem <Users2 size={20} />
              </button>
              <div className="flex flex-col">
                <span className="text-brand-blue font-black text-lg">15 min.</span>
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Średni czas reakcji</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LegalSupport;
