import React from 'react';
import { Plus, Trash2, Edit, Database } from 'lucide-react';
import * as Icons from 'lucide-react';
import { ModalDefinition, WhyUsCard } from './WhyUsTypes';

interface ModalListProps {
  modals: ModalDefinition[];
  items: { assignedModalId?: string | null }[];
  onAddModal: () => void;
  onEditModal: (modalId: string) => void;
  onDeleteModal: (modalId: string) => void;
  onToggleVisibility?: (modalId: string, isVisible: boolean) => void;
}

export const ModalList: React.FC<ModalListProps> = ({
  modals,
  items,
  onAddModal,
  onEditModal,
  onDeleteModal,
  onToggleVisibility
}) => {
  const renderIcon = (iconName: string) => {
    const Icon = (Icons[iconName as keyof typeof Icons] as React.ElementType) || Icons.CheckCircle;
    return <Icon size={16} />;
  };

  return (
    <div className="bg-[#0f172a] border border-slate-800 rounded-[var(--radius-brand-card)] p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-black text-white">Baza Modali</h3>
          <p className="text-slate-400 text-sm">Zarządzaj treścią okien modalnych, które możesz przypisać do kart.</p>
        </div>
        <button
          onClick={onAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-[var(--radius-brand-button)] font-bold text-sm hover:bg-brand-light-blue transition-colors"
        >
          <Plus size={16} /> Dodaj Modal
        </button>
      </div>

      {modals.length === 0 ? (
        <div className="text-center py-12 bg-[#020617] rounded-[var(--radius-brand-button)] border border-slate-800 border-dashed">
          <Database size={48} className="mx-auto text-slate-600 mb-4" />
          <h4 className="text-lg font-bold text-white mb-2">Brak modali</h4>
          <p className="text-slate-400 text-sm mb-6">Nie utworzono jeszcze żadnego okna modalnego.</p>
          <button
            onClick={onAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-[var(--radius-brand-button)] font-bold text-sm hover:bg-brand-light-blue transition-colors"
          >
            <Plus size={16} /> Utwórz pierwszy modal
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {modals.map(modal => {
            const assignedCount = items.filter(c => c.assignedModalId === modal.id).length;
            return (
              <div key={modal.id} className="bg-[#020617] border border-slate-800 rounded-[var(--radius-brand-button)] p-4 flex justify-between items-center group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-800 rounded-[var(--radius-brand-input)] flex items-center justify-center text-brand-blue">
                    {renderIcon(modal.icon || 'FileText')}
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{modal.internalName}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-500 font-mono">ID: {modal.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${assignedCount > 0 ? 'bg-green-500/10 text-green-400' : 'bg-slate-800 text-slate-400'}`}>
                        {assignedCount > 0 ? `Przypisano do ${assignedCount} kart` : 'Nieprzypisany'}
                      </span>
                      
                      {/* Toggle widoczności w karuzeli */}
                      <div className="flex items-center gap-2 ml-2">
                        <button
                          onClick={() => onToggleVisibility && onToggleVisibility(modal.id, !modal.isVisibleInCarousel)}
                          className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none ${modal.isVisibleInCarousel ? 'bg-brand-blue' : 'bg-slate-700'}`}
                          title={modal.isVisibleInCarousel ? 'Ukryj w karuzeli' : 'Pokaż w karuzeli'}
                        >
                          <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${modal.isVisibleInCarousel ? 'translate-x-4' : 'translate-x-1'}`} />
                        </button>
                        <span className={`text-xs ${modal.isVisibleInCarousel ? 'text-blue-400' : 'text-slate-500'}`}>
                          {modal.isVisibleInCarousel ? 'Widoczny w karuzeli' : 'Tylko na żądanie'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onEditModal(modal.id)} 
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-[var(--radius-brand-button)] transition-colors"
                    title="Edytuj modal"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => onDeleteModal(modal.id)} 
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-[var(--radius-brand-button)] transition-colors"
                    title="Usuń modal"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
