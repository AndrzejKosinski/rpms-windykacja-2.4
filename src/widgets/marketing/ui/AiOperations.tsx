"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Gavel, ShieldCheck, Zap, Scale, FileSearch, Search, Lock } from 'lucide-react';

interface AiOperationsProps {
  id?: string;
}

const AiOperations: React.FC<AiOperationsProps> = ({ id }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <section id={id || 'ai_operations'} className="py-24 lg:py-32 bg-slate-50 relative overflow-hidden">
      {/* Dekoracyjne poświaty w tle */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-light-blue/20 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2"></div>
      
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Lewa kolumna: Centrum dowodzenia i egzekucji */}
          <div className="lg:w-1/2 relative group">
            <div className="relative z-10 rounded-[var(--radius-brand-card)] overflow-hidden shadow-[0_50px_100px_-20px_rgba(10,46,92,0.2)] border-8 border-white bg-slate-200 min-h-[400px] flex items-center justify-center">
              {!imgError ? (
                <Image 
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200" 
                  alt="Centrum Dowodzenia RPMS Windykacja" 
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  onError={(e) => {
                    console.error("Image load error:", e);
                    setImgError(true);
                  }}
                  className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-brand-navy flex flex-col items-center justify-center p-12 text-white/20">
                  <Gavel size={64} className="mb-4 animate-pulse" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Kancelaria RPMS</p>
                </div>
              )}
              
              {/* Skaner monitoringu prawnego */}
              <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/20 to-transparent h-1/4 w-full animate-scan-legal pointer-events-none opacity-40"></div>
            </div>

            {/* Karta Skuteczności Operacyjnej */}
            <div className="absolute -bottom-10 -right-6 lg:-right-10 p-8 bg-white/90 backdrop-blur-xl border border-white rounded-[var(--radius-brand-card)] shadow-2xl z-20 animate-in slide-in-from-right duration-700 delay-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-brand-navy rounded-[var(--radius-brand-button)] flex items-center justify-center text-white shadow-lg">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status Egzekucji</p>
                  <p className="text-brand-navy font-black text-lg">98% Skuteczności EPU</p>
                </div>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= 4 ? 'bg-brand-blue' : 'bg-slate-200'}`}></div>
                ))}
              </div>
            </div>

            {/* Dekoracja za obrazem */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-navy/5 rounded-full -z-10 blur-3xl"></div>
          </div>

          {/* Prawa kolumna: Treść merytoryczna */}
          <div className="lg:w-1/2 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-navy/10 text-brand-navy text-[11px] font-black rounded-full uppercase tracking-[0.2em]">
              <Lock size={14} className="text-brand-navy" /> Bezpieczeństwo i Skuteczność RPMS
            </div>
            
            <h2 className="text-4xl lg:text-7xl font-black text-brand-navy leading-[1.1] tracking-tight">
              Centrum Dowodzenia <br />
              <span className="text-brand-blue italic">Egzekucyjnego RPMS</span>
            </h2>
            
            <p className="text-lg lg:text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
              Przekładamy merytoryczną wiedzę prawniczą na nieuchronność spłaty. Systemy RPMS eliminują błędy ludzkie w rutynowych działaniach, pozwalając prawnikom skupić się na twardej windykacji, zabezpieczaniu majątku i reprezentacji przed sądem.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
              <div className="space-y-4 group">
                <div className="flex items-center gap-3 text-brand-navy font-black text-sm uppercase tracking-widest group-hover:text-brand-blue transition-colors">
                  <Gavel size={20} className="text-brand-blue" /> Twarda Windykacja
                </div>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  Natychmiastowe kroki prawne: od ostatecznych wezwań po szybkie uzyskanie nakazu zapłaty w trybie EPU.
                </p>
              </div>
              <div className="space-y-4 group">
                <div className="flex items-center gap-3 text-brand-navy font-black text-sm uppercase tracking-widest group-hover:text-brand-blue transition-colors">
                  <Search size={20} className="text-brand-blue" /> Zajęcia Majątkowe
                </div>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  Precyzyjna lokalizacja aktywów dłużnika i aktywny nadzór nad działaniami komorniczymi 24/7 przez RPMS.
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-8">
               <div className="flex items-center gap-4 p-5 bg-white rounded-[var(--radius-brand-card)] border border-slate-100 shadow-sm">
                  <Zap size={24} className="text-amber-500 fill-amber-500" />
                  <div>
                    <p className="text-brand-navy font-black text-sm leading-none mb-1">Eliminacja Błędów</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Wsparcie IT dla Kancelarii</p>
                  </div>
               </div>
               <div>
                  <p className="text-brand-navy font-black text-sm italic">"Pewność prawna RPMS w zasięgu jednego kliknięcia."</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Standard Premium RPMS</p>
               </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes scan-legal {
          0% { transform: translateY(-50%); opacity: 0; }
          20% { opacity: 0.4; }
          80% { opacity: 0.4; }
          100% { transform: translateY(400%); opacity: 0; }
        }
        .animate-scan-legal {
          animation: scan-legal 5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </section>
  );
};

export default AiOperations;
