import React from 'react';
import { Heading2, Heading3, Bold, Italic, List, ListOrdered, Quote, Link as LinkIcon, Code } from 'lucide-react';

interface MarkdownToolbarProps {
  onInsert: (prefix: string, suffix?: string) => void;
}

export const MarkdownToolbar: React.FC<MarkdownToolbarProps> = ({ onInsert }) => {
  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-900 border border-slate-800 rounded-[var(--radius-brand-button)]">
      <button onClick={() => onInsert('## ')} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-[var(--radius-brand-input)] transition-all" title="Nagłówek 2"><Heading2 size={16} /></button>
      <button onClick={() => onInsert('### ')} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-[var(--radius-brand-input)] transition-all" title="Nagłówek 3"><Heading3 size={16} /></button>
      <div className="w-px h-4 bg-slate-800 mx-1" />
      <button onClick={() => onInsert('**', '**')} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-[var(--radius-brand-input)] transition-all" title="Pogrubienie"><Bold size={16} /></button>
      <button onClick={() => onInsert('_', '_')} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-[var(--radius-brand-input)] transition-all" title="Kursywa"><Italic size={16} /></button>
      <div className="w-px h-4 bg-slate-800 mx-1" />
      <button onClick={() => onInsert('- ')} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-[var(--radius-brand-input)] transition-all" title="Lista punktowa"><List size={16} /></button>
      <button onClick={() => onInsert('1. ')} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-[var(--radius-brand-input)] transition-all" title="Lista numerowana"><ListOrdered size={16} /></button>
      <div className="w-px h-4 bg-slate-800 mx-1" />
      <button onClick={() => onInsert('> ')} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-[var(--radius-brand-input)] transition-all" title="Cytat"><Quote size={16} /></button>
      <button onClick={() => onInsert('[', '](url)')} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-[var(--radius-brand-input)] transition-all" title="Link"><LinkIcon size={16} /></button>
      <button onClick={() => onInsert('`', '`')} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-[var(--radius-brand-input)] transition-all" title="Kod"><Code size={16} /></button>
    </div>
  );
};
