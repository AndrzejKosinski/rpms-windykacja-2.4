'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, ArrowRight } from 'lucide-react';

export const SidebarBanners = () => {
  return (
    <div className="flex flex-col gap-8 px-4">
      {/* Minimalist Banner: Panel Klienta */}
      <div className="group">
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
    </div>
  );
};
