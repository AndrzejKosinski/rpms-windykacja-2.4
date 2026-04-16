'use client';

import React, { useState } from 'react';
import { Search, ChevronRight, Phone, Mail, LayoutDashboard, ArrowRight } from 'lucide-react';
import FaqAccordion from '../../../widgets/marketing/ui/FaqAccordion';
import Link from 'next/link';

const categories = [
  { id: 'all', label: 'Wszystkie' },
  { id: 'process', label: 'Proces' },
  { id: 'costs', label: 'Koszty' },
  { id: 'legal', label: 'Prawo' },
];

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section - Two Column Layout */}
      <div className="pt-32 pb-16 bg-white border-b border-slate-50">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-12">
            <div className="max-w-2xl">
              <h1 className="text-5xl lg:text-7xl font-black text-brand-navy leading-tight tracking-tighter mb-6">
                Centrum <span className="text-brand-blue">Pomocy</span>
              </h1>
              <p className="text-slate-500 text-xl font-medium leading-relaxed">
                Wszystko, co musisz wiedzieć o procesie windykacji z RPMS. Znajdź odpowiedzi na najczęściej zadawane pytania.
              </p>
            </div>

            {/* Search Bar - Right Side */}
            <div className="w-full lg:w-96 relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-blue transition-colors">
                <Search size={20} />
              </div>
              <input 
                type="text"
                placeholder="Szukaj odpowiedzi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 outline-none focus:border-brand-blue rounded-[var(--radius-brand-button)] transition-all text-brand-navy font-bold text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Grid Layout */}
      <div className="py-24 bg-slate-50/30">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            
            {/* Left Column: FAQ Accordion */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-[var(--radius-brand-card)] p-8 md:p-12 border border-slate-100 shadow-sm">
                <FaqAccordion 
                  showTitle={false} 
                  searchQuery={searchQuery}
                  category={activeCategory === 'all' ? undefined : activeCategory}
                />
              </div>
            </div>

            {/* Right Column: Sidebar */}
            <aside className="lg:col-span-4 space-y-12 sticky top-32 self-start">
              
              {/* Categories Sidebar */}
              <div className="bg-white rounded-[var(--radius-brand-card)] p-8 border border-slate-100 shadow-sm">
                <h3 className="text-xs font-black text-brand-blue uppercase tracking-[0.2em] mb-6">Kategorie</h3>
                <div className="flex flex-col gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex items-center justify-between px-4 py-3 rounded-[var(--radius-brand-button)] text-sm font-bold transition-all group ${
                        activeCategory === cat.id 
                          ? 'bg-brand-navy text-white shadow-md' 
                          : 'text-slate-500 hover:bg-slate-50 hover:text-brand-navy'
                      }`}
                    >
                      {cat.label}
                      <ChevronRight size={16} className={`transition-transform ${activeCategory === cat.id ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Need Help Box */}
              <div className="bg-brand-navy rounded-[var(--radius-brand-card)] p-8 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/10 rounded-full blur-2xl -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-black mb-4 text-white">Potrzebujesz pomocy?</h3>
                  <p className="text-brand-light-blue/70 text-sm font-medium mb-8 leading-relaxed">
                    Nasi eksperci są dostępni, aby odpowiedzieć na Twoje pytania bezpośrednio.
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <a href="tel:+48123456789" className="flex items-center gap-3 text-sm font-bold hover:text-brand-blue transition-colors">
                      <div className="w-8 h-8 bg-white/10 rounded-[var(--radius-brand-input)] flex items-center justify-center">
                        <Phone size={14} />
                      </div>
                      +48 123 456 789
                    </a>
                    <a href="mailto:kontakt@rpms.pl" className="flex items-center gap-3 text-sm font-bold hover:text-brand-blue transition-colors">
                      <div className="w-8 h-8 bg-white/10 rounded-[var(--radius-brand-input)] flex items-center justify-center">
                        <Mail size={14} />
                      </div>
                      kontakt@rpms.pl
                    </a>
                  </div>

                  <Link 
                    href="/#contact"
                    className="w-full py-4 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-[var(--radius-brand-button)] font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                    Napisz do nas
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              {/* Sidebar Banner: Panel Klienta */}
              <div className="bg-white rounded-[var(--radius-brand-card)] p-8 border border-slate-100 shadow-sm group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-blue/5 rounded-[var(--radius-brand-button)] flex items-center justify-center transition-colors group-hover:bg-brand-blue/10">
                    <LayoutDashboard className="text-brand-blue" size={20} />
                  </div>
                  <h3 className="text-base font-black text-brand-navy leading-tight">Twoje sprawy pod kontrolą 24/7</h3>
                </div>
                <p className="text-slate-500 text-sm font-medium mb-5 leading-relaxed">
                  Monitoruj postępy windykacji w czasie rzeczywistym dzięki Panelowi Klienta.
                </p>
                <Link 
                  href="/panel"
                  className="inline-flex items-center gap-2 text-brand-blue font-black text-sm group-hover:gap-3 transition-all"
                >
                  Sprawdź Panel Klienta
                  <ArrowRight size={18} />
                </Link>
              </div>

            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
