"use client";

import React from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

const trustedCompanies = [
  { 
    name: 'Allegro', 
    logoUrl: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 60%22%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22system-ui, sans-serif%22 font-size=%2236%22 font-weight=%22800%22 fill=%22%230a2e5c%22%3EAllegro%3C/text%3E%3C/svg%3E'
  },
  { 
    name: 'InPost', 
    logoUrl: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 60%22%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22system-ui, sans-serif%22 font-size=%2236%22 font-weight=%22800%22 fill=%22%230a2e5c%22%3EInPost%3C/text%3E%3C/svg%3E'
  },
  { 
    name: 'Orlen', 
    logoUrl: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 60%22%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22system-ui, sans-serif%22 font-size=%2236%22 font-weight=%22800%22 fill=%22%230a2e5c%22%3EOrlen%3C/text%3E%3C/svg%3E'
  },
  { 
    name: 'PKO BP', 
    logoUrl: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 60%22%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22system-ui, sans-serif%22 font-size=%2236%22 font-weight=%22800%22 fill=%22%230a2e5c%22%3EPKO BP%3C/text%3E%3C/svg%3E'
  },
];

interface TrustBarV2Props {
  data?: {
    logos?: Array<{ name: string; logoUrl: string }>;
  };
}

const TrustBarV2: React.FC<TrustBarV2Props> = ({ data }) => {
  // Limit to first 9 logos
  const logos = (data?.logos || trustedCompanies).slice(0, 9);

  return (
    <div className="bg-white border-y border-slate-100 py-10 relative">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          <p className="text-brand-navy/40 text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap">Zaufali nam:</p>
          <div className="flex flex-nowrap items-center justify-center md:justify-end gap-8 md:gap-16 flex-grow overflow-x-auto no-scrollbar">
            {logos.map((company, index) => (
              <div key={index} className="h-8 shrink-0 flex items-center justify-center opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500 cursor-default group">
                <Image 
                  src={company.logoUrl} 
                  alt={`Logo ${company.name}`} 
                  width={120}
                  height={30}
                  className="max-h-full w-auto object-contain transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Cue */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-sm text-slate-400 animate-bounce">
        <ChevronDown size={16} />
      </div>
    </div>
  );
};

export default TrustBarV2;
