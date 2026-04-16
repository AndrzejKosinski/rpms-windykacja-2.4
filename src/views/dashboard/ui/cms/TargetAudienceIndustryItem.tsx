import React from 'react';
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { ModalDefinition } from './WhyUsTypes';

interface TargetAudienceIndustry {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  desc: string;
  tag: string;
  assignedModalId?: string;
}

interface TargetAudienceIndustryItemProps {
  industry: TargetAudienceIndustry;
  index: number;
  totalCount: number;
  modals: ModalDefinition[];
  availableIcons: string[];
  generatingModalIndex: number | null;
  onUpdate: (field: keyof TargetAudienceIndustry, value: string) => void;
  onDelete: () => void;
  onMove: (direction: 'up' | 'down') => void;
  onGenerateAI: () => void;
}

export const TargetAudienceIndustryItem: React.FC<TargetAudienceIndustryItemProps> = ({
  industry,
  index,
  totalCount,
  modals,
  availableIcons,
  generatingModalIndex,
  onUpdate,
  onDelete,
  onMove,
  onGenerateAI
}) => {
  const IconComponent = (Icons[industry.icon as keyof typeof Icons] as React.ElementType) || Icons.Briefcase;

  return (
    <div className="bg-[#020617] border border-slate-800 rounded-[var(--radius-brand-button)] p-4 flex gap-4 items-start group">
      <div className="flex flex-col gap-1 mt-1">
        <button 
          onClick={() => onMove('up')}
          disabled={index === 0}
          className="p-1 text-slate-600 hover:text-white disabled:opacity-30 transition-colors"
        >
          <ArrowUp size={14} />
        </button>
        <button 
          onClick={() => onMove('down')}
          disabled={index === totalCount - 1}
          className="p-1 text-slate-600 hover:text-white disabled:opacity-30 transition-colors"
        >
          <ArrowDown size={14} />
        </button>
      </div>

      <div className="flex-1 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tytuł</label>
            <input
              type="text"
              value={industry.title}
              onChange={(e) => onUpdate('title', e.target.value)}
              className="w-full bg-[#0f172a] border border-slate-800 rounded-[var(--radius-brand-input)] px-3 py-2 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Podtytuł</label>
            <input
              type="text"
              value={industry.subtitle}
              onChange={(e) => onUpdate('subtitle', e.target.value)}
              className="w-full bg-[#0f172a] border border-slate-800 rounded-[var(--radius-brand-input)] px-3 py-2 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">ID (unikalne)</label>
            <input
              type="text"
              value={industry.id}
              onChange={(e) => onUpdate('id', e.target.value)}
              className="w-full bg-[#0f172a] border border-slate-800 rounded-[var(--radius-brand-input)] px-3 py-2 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tag</label>
            <input
              type="text"
              value={industry.tag}
              onChange={(e) => onUpdate('tag', e.target.value)}
              className="w-full bg-[#0f172a] border border-slate-800 rounded-[var(--radius-brand-input)] px-3 py-2 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ikona</label>
            <div className="relative">
              <select
                value={industry.icon}
                onChange={(e) => onUpdate('icon', e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-800 rounded-[var(--radius-brand-input)] px-3 py-2 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all appearance-none pl-10"
              >
                {availableIcons.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-blue pointer-events-none">
                <IconComponent size={16} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Powiązany Modal</label>
            <select
              value={industry.assignedModalId || ""}
              onChange={(e) => onUpdate('assignedModalId', e.target.value)}
              className="w-full bg-[#0f172a] border border-slate-800 rounded-[var(--radius-brand-input)] px-3 py-2 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
            >
              <option value="">-- Brak modala --</option>
              {modals.map(modal => (
                <option key={modal.id} value={modal.id}>{modal.internalName}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={onGenerateAI}
              disabled={generatingModalIndex === index}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-[var(--radius-brand-button)] font-bold text-sm hover:bg-purple-500 hover:text-white transition-all disabled:opacity-50"
            >
              {generatingModalIndex === index ? (
                <span className="animate-pulse">Generowanie...</span>
              ) : (
                <>✨ Wygeneruj Modal przez AI</>
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Opis</label>
          <textarea
            value={industry.desc}
            onChange={(e) => onUpdate('desc', e.target.value)}
            className="w-full bg-[#0f172a] border border-slate-800 rounded-[var(--radius-brand-input)] px-3 py-2 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
            rows={2}
          />
        </div>
      </div>

      <button
        onClick={onDelete}
        className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-[var(--radius-brand-button)] transition-colors mt-6"
        title="Usuń branżę"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};
