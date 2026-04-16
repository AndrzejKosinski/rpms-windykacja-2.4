"use client";

import React, { useState } from 'react';
import { FileText, Send, Mail, Layout, Users, Settings, PieChart, ArrowRight } from 'lucide-react';
import { useModal } from '../../../context/ModalContext';

interface DashboardPreviewProps {
  id?: string;
}

const DashboardPreview: React.FC<DashboardPreviewProps> = ({ id }) => {
  const { setActiveModal } = useModal();

  return (
    <section id={id || 'panel'} className="py-24 bg-slate-50">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl text-brand-navy">Pełna kontrola nad sprawą w jednym miejscu</h2>
        </div>

        <div className="bg-white rounded-[var(--radius-brand-card)] shadow-2xl border border-slate-200 overflow-hidden flex flex-col lg:flex-row h-full lg:h-[700px]">
          {/* Sidebar Mockup */}
          <div className="hidden lg:flex w-24 bg-brand-navy flex-col items-center py-10 gap-10">
            <div className="w-12 h-12 bg-brand-blue rounded-[var(--radius-brand-button)] flex items-center justify-center text-white shadow-lg shadow-brand-blue/30 cursor-pointer"><Layout size={24} /></div>
            <div className="w-12 h-12 bg-white/5 rounded-[var(--radius-brand-button)] flex items-center justify-center text-white/40 hover:bg-white/10 cursor-pointer transition-colors"><PieChart size={24} /></div>
            <div className="w-12 h-12 bg-white/5 rounded-[var(--radius-brand-button)] flex items-center justify-center text-white/40 hover:bg-white/10 cursor-pointer transition-colors"><Users size={24} /></div>
            <div className="w-12 h-12 bg-white/5 rounded-[var(--radius-brand-button)] flex items-center justify-center text-white/40 hover:bg-white/10 mt-auto cursor-pointer transition-colors"><Settings size={24} /></div>
          </div>

          <div className="flex-1 p-8 lg:p-14 text-left overflow-y-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
              <h4 className="text-2xl text-brand-navy">Podsumowanie portfela</h4>
              <div className="flex gap-4">
                <button className="px-6 py-2.5 bg-slate-100 text-slate-500 font-extrabold rounded-[var(--radius-brand-button)] text-sm hover:bg-slate-200 transition-all">Ostatnie 30 dni</button>
                <button className="px-8 py-2.5 bg-brand-navy text-white font-extrabold rounded-[var(--radius-brand-button)] text-sm shadow-lg shadow-brand-navy/10">Dodaj fakturę</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
              <div className="p-8 bg-slate-50 rounded-[var(--radius-brand-card)] border border-slate-100 shadow-sm">
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4">Odzyskane należności</p>
                <p className="text-4xl font-black text-brand-navy">245.890 PLN</p>
                <div className="h-2 w-full bg-slate-200 mt-8 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[78%]"></div>
                </div>
              </div>
              <div className="p-8 bg-slate-50 rounded-[var(--radius-brand-card)] border border-slate-100 shadow-sm">
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4">Średnia skuteczność</p>
                <p className="text-4xl font-black text-brand-navy">82%</p>
                <p className="text-green-600 text-sm font-black mt-6 flex items-center gap-1 uppercase tracking-tighter">
                   +5% względem rynkowej
                </p>
              </div>
              <div className="p-8 bg-slate-50 rounded-[var(--radius-brand-card)] border border-slate-100 shadow-sm">
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4">Czas odzyskiwania</p>
                <p className="text-4xl font-black text-brand-navy">14 dni</p>
                <p className="text-brand-blue text-sm font-black mt-6 uppercase tracking-tighter">Tryb: Przyspieszony</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Ostatnie akcje prawne</p>
              <div className="flex items-center gap-6 p-6 bg-white border border-slate-100 rounded-[var(--radius-brand-button)] shadow-sm hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-brand-blue/10 text-brand-blue rounded-[var(--radius-brand-button)] flex items-center justify-center shrink-0">
                  <FileText size={28} />
                </div>
                <div className="flex-1">
                  <p className="font-extrabold text-brand-navy text-lg">Pozew do EPU - Faktura #2024/012</p>
                  <p className="text-slate-400 text-sm font-medium">Zatwierdzono przez r. pr. Annę Kowalską • 2h temu</p>
                </div>
                <div className="px-5 py-2 bg-green-100 text-green-700 text-xs font-black rounded-full uppercase tracking-widest">Wysłano</div>
              </div>

              <div className="flex items-center gap-6 p-6 bg-white border border-slate-100 rounded-[var(--radius-brand-button)] shadow-sm hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-[var(--radius-brand-button)] flex items-center justify-center shrink-0">
                  <Mail size={28} />
                </div>
                <div className="flex-1">
                  <p className="font-extrabold text-brand-navy text-lg">Ostateczne wezwanie przedprocesowe</p>
                  <p className="text-slate-400 text-sm font-medium">Automatyczna wysyłka polecona • 1 dzień temu</p>
                </div>
                <div className="px-5 py-2 bg-slate-100 text-slate-500 text-xs font-black rounded-full uppercase tracking-widest">Odebrano</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-16 flex justify-center">
          <button 
            onClick={() => setActiveModal('register')}
            className="px-10 py-5 bg-brand-blue text-white rounded-[var(--radius-brand-button)] font-black text-lg uppercase tracking-widest shadow-2xl shadow-brand-blue/25 hover:bg-brand-navy hover:scale-105 transition-all flex items-center gap-4 group active:scale-95"
          >
            ZAŁÓŻ DARMOWE KONTO <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
