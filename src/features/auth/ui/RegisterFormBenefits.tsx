import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Check } from 'lucide-react';

const benefits = [
  {
    title: "Odzyskaj kontrolę",
    subtitle: "nad swoimi należnościami",
    description: "Dodaj fakturę, a zespół prawny RPMS natychmiast rozpocznie proces odzyskiwania Twoich pieniędzy."
  },
  {
    title: "Inteligentny import danych",
    subtitle: "Eliminacja błędów ręcznych",
    description: "System automatycznie pobiera dane z dodanych faktur. Możesz wgrać wiele dokumentów naraz i błyskawicznie przekazać je do windykacji."
  },
  {
    title: "Brak opłat wstępnych",
    subtitle: "Płacisz tylko za sukces",
    description: "Rozpoczynamy działania bez pobierania zaliczek. Nasze wynagrodzenie to prowizja od odzyskanej kwoty."
  }
];

export const RegisterFormBenefits: React.FC = () => {
  const [benefitIndex, setBenefitIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBenefitIndex((prev) => (prev + 1) % benefits.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden lg:flex lg:w-1/2 bg-brand-navy p-12 text-white flex-col justify-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/10 blur-[120px] rounded-full -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-blue/5 blur-[80px] rounded-full -ml-32 -mb-32" />
      
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={benefitIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/20 rounded-full text-brand-blue text-[10px] font-black uppercase tracking-widest mb-4">
              <ShieldAlert size={12} /> Dlaczego RPMS?
            </div>
            <h2 className="text-4xl font-black leading-tight" style={{ color: 'var(--color-text-inverse)' }}>
              {benefits[benefitIndex].title}
              <br />
              <span className="text-brand-blue">{benefits[benefitIndex].subtitle}</span>
            </h2>
            <p className="text-lg font-medium leading-relaxed" style={{ color: 'var(--color-text-inverse)', opacity: 0.8 }}>
              {benefits[benefitIndex].description}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 space-y-4">
          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 bg-white/5 rounded-[var(--radius-brand-button)] flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all">
              <Check size={20} strokeWidth={3} />
            </div>
            <span className="font-bold" style={{ color: 'var(--color-text-inverse)', opacity: 0.9 }}>Analiza AI w 60 sekund</span>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 bg-white/5 rounded-[var(--radius-brand-button)] flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all">
              <Check size={20} strokeWidth={3} />
            </div>
            <span className="font-bold" style={{ color: 'var(--color-text-inverse)', opacity: 0.9 }}>Brak opłat wstępnych</span>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 bg-white/5 rounded-[var(--radius-brand-button)] flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all">
              <Check size={20} strokeWidth={3} />
            </div>
            <span className="font-bold" style={{ color: 'var(--color-text-inverse)', opacity: 0.9 }}>Dostęp do Panelu 24/7</span>
          </div>
        </div>

        <div className="flex gap-2 mt-12">
          {benefits.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setBenefitIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${idx === benefitIndex ? 'w-8 bg-brand-blue' : 'w-2 bg-white/20'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
