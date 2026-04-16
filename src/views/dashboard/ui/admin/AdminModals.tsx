import React from 'react';
import { Database, RefreshCw } from 'lucide-react';

interface AdminModalsProps {
  showInitModal: boolean;
  isInitializing: boolean;
  onCloseInitModal: () => void;
  onConfirmInit: () => void;
  showAddSectionModal: boolean;
  availableComponents: string[];
  componentToAdd: string;
  onCloseAddSectionModal: () => void;
  onSetComponentToAdd: (comp: string) => void;
  onExecuteAddSection: () => void;
}

export const AdminModals: React.FC<AdminModalsProps> = ({
  showInitModal,
  isInitializing,
  onCloseInitModal,
  onConfirmInit,
  showAddSectionModal,
  availableComponents,
  componentToAdd,
  onCloseAddSectionModal,
  onSetComponentToAdd,
  onExecuteAddSection
}) => {
  return (
    <>
      {/* Modal Inicjalizacji CMS */}
      {showInitModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md" onClick={onCloseInitModal} />
          <div className="relative w-full max-w-lg bg-[#0f172a] border border-slate-800 rounded-[var(--radius-brand-card)] p-10 shadow-2xl animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-brand-blue/10 text-brand-blue rounded-[var(--radius-brand-button)] flex items-center justify-center mb-8">
              <Database size={32} />
            </div>
            <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Inicjalizacja Bazy CMS</h2>
            <p className="text-slate-400 font-medium mb-8 leading-relaxed">
              System utworzy nowy skoroszyt <span className="text-white font-bold">RPMS_CMS_DATABASE</span> na Twoim Google Drive i wypełni go aktualnymi danymi z pliku konfiguracyjnego. Czy chcesz kontynuować?
            </p>
            <div className="flex gap-4">
              <button 
                onClick={onCloseInitModal}
                disabled={isInitializing}
                className="flex-1 px-8 py-4 bg-slate-800 text-slate-400 rounded-[var(--radius-brand-button)] font-black hover:bg-slate-700 transition-all disabled:opacity-50"
              >
                Anuluj
              </button>
              <button 
                onClick={onConfirmInit}
                disabled={isInitializing}
                className="flex-1 px-8 py-4 bg-brand-blue text-white rounded-[var(--radius-brand-button)] font-black hover:bg-brand-blue/90 transition-all shadow-xl shadow-brand-blue/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isInitializing ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    Inicjalizacja...
                  </>
                ) : (
                  'Tak, zainicjalizuj'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Section Modal */}
      {showAddSectionModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md" onClick={onCloseAddSectionModal} />
          <div className="relative w-full max-w-md bg-[#0f172a] border border-slate-800 rounded-[var(--radius-brand-card)] p-8 shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-2xl font-black text-white mb-4">Dodaj nową sekcję</h3>
            <p className="text-slate-400 mb-6">Wybierz komponent, który chcesz dodać do układu strony.</p>
            <select 
              value={componentToAdd}
              onChange={(e) => onSetComponentToAdd(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-[var(--radius-brand-button)] p-4 mb-8 outline-none focus:border-brand-blue"
            >
              {availableComponents.map(comp => (
                <option key={comp} value={comp}>{comp}</option>
              ))}
            </select>
            <div className="flex gap-4">
              <button onClick={onCloseAddSectionModal} className="flex-1 px-6 py-3 bg-slate-800 text-slate-300 rounded-[var(--radius-brand-button)] font-bold hover:bg-slate-700 transition-colors">Anuluj</button>
              <button onClick={onExecuteAddSection} className="flex-1 px-6 py-3 bg-brand-blue text-white rounded-[var(--radius-brand-button)] font-bold hover:bg-brand-blue/90 transition-colors">Dodaj</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
