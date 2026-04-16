'use client';

import React, { useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';

interface FaqAccordionProps {
  id?: string;
  limit?: number;
  showTitle?: boolean;
  showLinkToAll?: boolean;
  searchQuery?: string;
  category?: string;
}

const faqData = [
  {
    question: "Czy zajmujecie się windykacją osób fizycznych?",
    answer: "Tak, prowadzimy windykację również wobec osób fizycznych.",
    category: "process"
  },
  {
    question: "Czy prowadzicie sprawy przeciwko dłużnikom z zagranicy?",
    answer: "Co do zasady nie. W większości przypadków konieczna jest lokalna kancelaria w kraju dłużnika. Wyjątki rozpatrujemy indywidualnie przy większych sprawach.",
    category: "process"
  },
  {
    question: "Co jeśli nie znam pełnych danych dłużnika?",
    answer: "Jeśli masz choćby PESEL lub adres, możemy ustalić pozostałe dane poprzez wniosek do urzędu. Koszt przygotowania wniosku to 200 zł netto.",
    category: "legal"
  },
  {
    question: "Jak wygląda cały proces windykacji?",
    answer: "Wysyłamy wezwanie do zapłaty, prowadzimy negocjacje, składamy pozew, uzyskujemy nakaz zapłaty, a następnie kierujemy sprawę do komornika i nadzorujemy egzekucję.",
    category: "process"
  },
  {
    question: "Jakie są koszty windykacji?",
    answer: (
      <ul className="list-disc pl-5 space-y-1 mt-2">
        <li><strong>Wezwanie do zapłaty:</strong> 200 zł netto</li>
        <li><strong>Pozew:</strong> od 400 zł netto</li>
        <li><strong>Opłaty sądowe:</strong> 1,25% lub 5% wartości sprawy</li>
        <li><strong>Egzekucja:</strong> zaliczka ok. 250 zł</li>
      </ul>
    ),
    category: "costs"
  },
  {
    question: "Czy success fee płacę dopiero po odzyskaniu pieniędzy?",
    answer: "Tak. Jeśli egzekucja okaże się nieskuteczna, nie pobieramy prowizji.",
    category: "costs"
  },
  {
    question: "Ile wynosi success fee?",
    answer: "Od 9% do 2% — w zależności od wartości sprawy.",
    category: "costs"
  },
  {
    question: "Czy skupujecie wierzytelności?",
    answer: "Nie. Możemy natomiast pomóc w sprzedaży wierzytelności i zadbać o bezpieczeństwo transakcji.",
    category: "legal"
  },
  {
    question: "Czy muszę się spotkać z prawnikiem lub brać udział w postępowaniu?",
    answer: "Nie. Cały proces możemy przeprowadzić zdalnie.",
    category: "process"
  },
  {
    question: "Gdzie działacie? Czy mogę się spotkać stacjonarnie?",
    answer: "Działamy w całej Polsce. Spotkanie stacjonarne jest możliwe, ale nie jest wymagane.",
    category: "process"
  },
  {
    question: "Jakie są szanse na odzyskanie pieniędzy?",
    answer: "To zależy od sytuacji majątkowej dłużnika. Weryfikujemy to na początku sprawy.",
    category: "process"
  },
  {
    question: "Ile trwa windykacja?",
    answer: "Czas zależy od postawy dłużnika i obciążenia sądu. Etap polubowny jest szybki, sądowy trwa dłużej.",
    category: "process"
  },
  {
    question: "Czy trzeba wysyłać kolejne wezwanie, jeśli już wysłałem swoje?",
    answer: "Nie, jeśli masz potwierdzenie nadania. Wezwanie z kancelarii często działa skuteczniej.",
    category: "legal"
  },
  {
    question: "Jakie dokumenty są potrzebne?",
    answer: "Faktura, umowa oraz korespondencja z dłużnikiem.",
    category: "legal"
  },
  {
    question: "Czy możecie przejąć sprawę, która już jest w sądzie lub u komornika?",
    answer: "Tak, możemy dołączyć na każdym etapie postępowania.",
    category: "legal"
  }
];

const FaqAccordion: React.FC<FaqAccordionProps> = ({ 
  id,
  limit, 
  showTitle = true, 
  showLinkToAll = false,
  searchQuery = '',
  category
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredData = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (typeof item.answer === 'string' && item.answer.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !category || item.category === category;
    return matchesSearch && matchesCategory;
  });

  const displayedData = limit ? filteredData.slice(0, limit) : filteredData;

  return (
    <section id={id || 'faq'} className={`bg-transparent relative ${showTitle ? 'py-24' : 'py-0'}`}>
      <div className="w-full px-0">
        {showTitle && (
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-brand-navy leading-tight tracking-tight mb-4">
              Najczęściej zadawane <span className="text-brand-blue italic">pytania</span>
            </h2>
            <p className="text-slate-500 text-lg">
              Wszystko, co musisz wiedzieć o procesie windykacji z RPMS.
            </p>
          </div>
        )}

        <div className="divide-y divide-slate-100">
          {displayedData.length > 0 ? displayedData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className="py-2 first:pt-0 last:pb-0"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between py-5 text-left focus:outline-none group"
                >
                  <span className={`font-bold text-lg pr-8 transition-colors ${isOpen ? 'text-brand-blue' : 'text-brand-navy group-hover:text-brand-blue'}`}>
                    {item.question}
                  </span>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-brand-blue/10 text-brand-blue rotate-180' : 'bg-slate-50 text-slate-400 group-hover:bg-brand-blue/5 group-hover:text-brand-blue'}`}>
                    <ChevronDown size={20} />
                  </div>
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                      <div className="pb-6 text-slate-500 text-base leading-relaxed font-medium">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }) : (
            <div className="text-center py-20 bg-slate-50 rounded-[var(--radius-brand-card)] border border-dashed border-slate-200">
              <p className="text-slate-400 font-medium">Nie znaleźliśmy odpowiedzi na Twoje zapytanie.</p>
              <button 
                onClick={() => {}} 
                className="mt-4 text-brand-blue font-bold hover:underline"
              >
                Zadaj nam pytanie bezpośrednio
              </button>
            </div>
          )}
        </div>

        {showLinkToAll && (
          <div className="mt-12 text-center">
            <Link 
              href="/faq" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 text-brand-navy font-bold rounded-full hover:border-brand-blue hover:text-brand-blue transition-all shadow-sm hover:shadow-md"
            >
              Zobacz wszystkie pytania <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FaqAccordion;
