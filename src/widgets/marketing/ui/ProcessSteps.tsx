import React from 'react';

interface ProcessStepsProps {
  id?: string;
  onRegister: (source?: string) => void;
}

const ProcessSteps: React.FC<ProcessStepsProps> = ({ id, onRegister }) => {
  const steps = [
    {
      id: "01",
      title: "Dodajesz fakturę",
      desc: "Przekazujesz nam dokument poprzez prosty panel – to zajmuje mniej niż minutę."
    },
    {
      id: "02",
      title: "Sprawa trafia do prawników",
      desc: "Nasi specjaliści analizują dokumentację i natychmiast inicjują procedurę odzyskiwania."
    },
    {
      id: "03",
      title: "Pełna informacja",
      desc: "W każdej chwili możesz sprawdzić postępy i korespondencję z dłużnikiem w swoim panelu."
    },
    {
      id: "04",
      title: "Kierujemy sprawę do sądu",
      desc: "Jeśli dłużnik nie reaguje, przejmujemy pełną reprezentację przed organami sądowymi.",
      highlight: true
    }
  ];

  return (
    <section id={id || 'how'} className="py-24 bg-brand-navy text-white relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          <div className="lg:w-1/3 text-center lg:text-left">
            <h2 className="text-4xl lg:text-5xl mb-8 leading-tight text-white">Jak szybko i skutecznie odzyskujemy Twoje należności</h2>
            <p className="text-slate-400 text-lg mb-10 font-medium">Zautomatyzowaliśmy to, co żmudne, zachowując ludzką precyzję tam, gdzie jest kluczowa.</p>
            <button 
              onClick={() => onRegister('process_steps_cta')}
              className="px-10 py-5 bg-brand-blue text-white rounded-[var(--radius-brand-button)] font-black hover:bg-brand-blue/90 transition-all shadow-xl shadow-brand-blue/20"
            >
              Dodaj pierwszą fakturę
            </button>
          </div>

          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {steps.map((step, idx) => (
              <div 
                key={idx} 
                className={`p-10 rounded-[var(--radius-brand-card)] border ${step.highlight ? 'bg-brand-blue/10 border-brand-blue/30' : 'bg-white/5 border-white/10'} relative overflow-hidden group hover:border-white/30 transition-all duration-300`}
              >
                <span className="text-7xl font-black text-white/5 absolute top-4 right-8 select-none pointer-events-none group-hover:text-white/10 transition-colors">
                  {step.id}
                </span>
                <h4 className="text-xl font-bold mb-4 relative z-10 text-white">{step.title}</h4>
                <p className={`${step.highlight ? 'text-slate-300' : 'text-slate-400'} text-sm leading-relaxed relative z-10 font-medium`}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;
