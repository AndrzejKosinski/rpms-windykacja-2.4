import React from 'react';
import { Trash2, ArrowUp, ArrowDown, Edit, Sparkles, Loader2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { WhyUsCard, ModalDefinition } from './WhyUsTypes';

interface CardEditorProps {
  card: WhyUsCard;
  index: number;
  totalCards: number;
  modals: ModalDefinition[];
  generatingModalIndex: number | null;
  availableIcons: string[];
  onUpdate: (index: number, field: keyof WhyUsCard, value: string) => void;
  onDelete: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onGenerateAI: (index: number) => void;
  onEditModal: (modalId: string) => void;
}

export const CardEditor: React.FC<CardEditorProps> = ({
  card,
  index,
  totalCards,
  modals,
  generatingModalIndex,
  availableIcons,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onGenerateAI,
  onEditModal
}) => {
  const renderIcon = (iconName: string) => {
    const Icon = (Icons[iconName as keyof typeof Icons] as React.ElementType) || Icons.CheckCircle;
    return <Icon size={16} />;
  };

  return (
    <div className="bg-[#020617] border border-slate-800 rounded-[var(--radius-brand-button)] p-4 flex gap-4 items-start group">
      <div className="flex flex-col gap-1 mt-1">
        <button 
          onClick={() => onMoveUp(index)} 
          disabled={index === 0}
          className="p-1 text-slate-600 hover:text-white disabled:opacity-30 transition-colors"
        >
          <ArrowUp size={14} />
        </button>
        <button 
          onClick={() => onMoveDown(index)} 
          disabled={index === totalCards - 1}
          className="p-1 text-slate-600 hover:text-white disabled:opacity-30 transition-colors"
        >
          <ArrowDown size={14} />
        </button>
      </div>
      
      <div className="flex-1 space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tytuł</label>
            <input
              type="text"
              value={card.title}
              onChange={(e) => onUpdate(index, 'title', e.target.value)}
              className="w-full bg-[#0f172a] border border-slate-800 rounded-[var(--radius-brand-input)] px-3 py-2 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">ID (do modala)</label>
            <input
              type="text"
              value={card.id}
              onChange={(e) => onUpdate(index, 'id', e.target.value)}
              className="w-full bg-[#0f172a] border border-slate-800 rounded-[var(--radius-brand-input)] px-3 py-2 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
              placeholder="np. kompleksowa"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ikona</label>
            <div className="relative">
              <select
                value={card.icon}
                onChange={(e) => onUpdate(index, 'icon', e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-800 rounded-[var(--radius-brand-input)] px-3 py-2 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all appearance-none pl-10"
              >
                {availableIcons.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-blue pointer-events-none">
                {renderIcon(card.icon)}
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Opis</label>
          <textarea
            value={card.desc}
            onChange={(e) => onUpdate(index, 'desc', e.target.value)}
            rows={2}
            className="w-full bg-[#0f172a] border border-slate-800 rounded-[var(--radius-brand-input)] px-3 py-2 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all resize-none"
          />
        </div>

        <div className="pt-2 border-t border-slate-800/50">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Przypisane okno modalne</label>
          <div className="flex items-center gap-2">
            <select
              value={card.assignedModalId || ""}
              onChange={(e) => onUpdate(index, 'assignedModalId', e.target.value)}
              className="flex-1 bg-[#0f172a] border border-slate-800 rounded-[var(--radius-brand-input)] px-3 py-2 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
            >
              <option value="">-- Brak przypisanego modala --</option>
              {modals.map(m => (
                <option key={m.id} value={m.id}>{m.internalName}</option>
              ))}
            </select>
            
            {card.assignedModalId ? (
              <button
                onClick={() => onEditModal(card.assignedModalId!)}
                className="p-2 bg-slate-800 text-white rounded-[var(--radius-brand-button)] hover:bg-slate-700 transition-colors"
                title="Edytuj przypisany modal"
              >
                <Edit size={16} />
              </button>
            ) : (
              <button
                onClick={() => onGenerateAI(index)}
                disabled={generatingModalIndex !== null}
                className="flex items-center gap-2 px-3 py-2 bg-brand-blue/10 text-brand-blue border border-brand-blue/20 rounded-[var(--radius-brand-button)] hover:bg-brand-blue/20 transition-all font-bold text-xs disabled:opacity-50"
              >
                {generatingModalIndex === index ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Sparkles size={14} />
                )}
                Generuj AI
              </button>
            )}
          </div>
        </div>
      </div>

      <button 
        onClick={() => onDelete(index)}
        className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-[var(--radius-brand-button)] transition-colors mt-6"
        title="Usuń kartę"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};
