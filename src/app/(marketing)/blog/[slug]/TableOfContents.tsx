'use client';

import React, { useEffect, useState } from 'react';

interface Heading {
  level: number;
  text: string;
  id: string;
}

export const TableOfContents = ({ headings }: { headings: Heading[] }) => {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first intersecting entry
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      { rootMargin: '-100px 0px -60% 0px' }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="bg-slate-50 rounded-[var(--radius-brand-card)] p-8 border border-slate-100 shadow-sm">
      <h4 className="text-xs font-black text-brand-navy mb-6 uppercase tracking-widest">Spis treści</h4>
      <nav className="flex flex-col gap-4">
        {headings.map((heading, idx) => (
          <a
            key={idx}
            href={`#${heading.id}`}
            className={`text-sm font-medium transition-colors leading-snug ${
              heading.level === 3 ? 'ml-4' : ''
            } ${
              activeId === heading.id 
                ? 'text-brand-blue font-bold' 
                : 'text-slate-500 hover:text-brand-navy'
            }`}
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById(heading.id);
              if (element) {
                const y = element.getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({ top: y, behavior: 'smooth' });
              }
            }}
          >
            {heading.text}
          </a>
        ))}
      </nav>
    </div>
  );
};
