"use client";

import React from 'react';
import Image from 'next/image';

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

interface TrustBarProps {
  data?: {
    logos?: Array<{ name: string; logoUrl: string }>;
  };
}

const TrustBar: React.FC<TrustBarProps> = ({ data }) => {
  const logos = data?.logos || trustedCompanies;

  return (
    <div className="bg-white border-y border-slate-100 py-10">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          <p className="text-brand-navy/40 text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap">Zaufali nam:</p>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-8 md:gap-16 flex-grow">
            {logos.map((company, index) => (
              <div key={index} className="h-8 flex items-center justify-center opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500 cursor-default group">
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
    </div>
  );
};

export default TrustBar;
