"use client";

import React, { useState } from 'react';
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react';

interface ComparisonProps {
  id?: string;
}

const Comparison: React.FC<ComparisonProps> = ({ id }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const rows = [
    { label: "Wsparcie prawne (Pozwy)", trad: <Check className="text-green-500 mx-auto" />, saas: <X className="text-red-400 mx-auto" />, hybrid: <Check className="text-white mx-auto" /> },
    { label: "Czas startu windykacji", trad: "Kilka dni", saas: "Natychmiast", hybrid: "Natychmiast" },
    { label: "Panel Online 24/7", trad: <X className="text-red-400 mx-auto" />, saas: <Check className="text-green-500 mx-auto" />, hybrid: <Check className="text-white mx-auto" /> },
    { label: "Koszty stałe", trad: "Wysokie", saas: "Średnie", hybrid: "Niskie / Elastyczne" },
    { label: "Bezpieczeństwo prawne", trad: "Pełne", saas: "Brak gwarancji", hybrid: "Pełne (Gwarancja OC)" }
  ];

  // Show only first 2 rows when collapsed
  const visibleRows = isExpanded ? rows : rows.slice(0, 2);

  return (
    <section id={id || 'comparison'} className="py-24 bg-white">
      <div className="max-w-[1100px] mx-auto px-6 text-center">
        <h2 className="text-4xl lg:text-5xl text-brand-navy mb-16 leading-tight tracking-tight">
          Znalezienie punktu styku między <br className="hidden lg:block" />
          <span className="text-brand-blue relative inline-block">
            pewnością prawną a szybkością technologii
            <svg className="absolute -bottom-2 left-0 w-full h-3 text-brand-blue/20" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 25 0, 50 5 T 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
            </svg>
          </span>
        </h2>
        
        <div className="relative overflow-hidden rounded-[var(--radius-brand-card)] border border-slate-100 shadow-sm transition-all duration-500">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50">
                  <th className="p-8 text-left text-slate-400 font-black uppercase text-[11px] tracking-[0.2em]">Funkcjonalność</th>
                  <th className="p-8 text-brand-navy font-black text-sm uppercase tracking-tight">Tradycyjna Kancelaria</th>
                  <th className="p-8 text-brand-navy font-black text-sm uppercase tracking-tight">Aplikacja 'Zrób to sam'</th>
                  <th className="p-8 bg-brand-blue text-white font-black text-sm uppercase tracking-tight">Model Hybrydowy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleRows.map((row, idx) => (
                  <tr key={idx} className="group transition-colors animate-in fade-in slide-in-from-top-2 duration-300">
                    <td className="p-8 text-left font-black text-brand-navy text-sm uppercase tracking-tighter">{row.label}</td>
                    <td className="p-8 text-center text-slate-500 font-bold text-sm">{row.trad}</td>
                    <td className="p-8 text-center text-slate-500 font-bold text-sm">{row.saas}</td>
                    <td className="p-8 text-center font-black text-white bg-brand-blue/95 text-sm">{row.hybrid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Fade overlay when collapsed */}
          {!isExpanded && (
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
          )}
        </div>

        <div className="mt-8">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-50 text-brand-navy font-black rounded-[var(--radius-brand-button)] border border-slate-200 hover:bg-slate-100 transition-all group"
          >
            {isExpanded ? (
              <>
                Zwiń porównanie <ChevronUp size={20} className="group-hover:-translate-y-1 transition-transform" />
              </>
            ) : (
              <>
                Zobacz pełne porównanie <ChevronDown size={20} className="group-hover:translate-y-1 transition-transform" />
              </>
            )}
          </button>
        </div>
        
        <p className="mt-12 text-slate-400 text-sm font-medium italic">
          * Dane oparte na analizie średniej rynkowej z II kwartału 2024 r.
        </p>
      </div>
    </section>
  );
};

export default Comparison;
