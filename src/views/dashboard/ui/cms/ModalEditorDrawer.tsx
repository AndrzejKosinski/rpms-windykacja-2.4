import React from 'react';
import { X } from 'lucide-react';
import * as Icons from 'lucide-react';
import { ModalDefinition } from './WhyUsTypes';

interface ModalEditorDrawerProps {
  activeModalId: string | null;
  tempModalData: Partial<ModalDefinition>;
  availableIcons: string[];
  onClose: () => void;
  onSave: () => void;
  onChange: (data: Partial<ModalDefinition>) => void;
}

export const ModalEditorDrawer: React.FC<ModalEditorDrawerProps> = ({
  activeModalId,
  tempModalData,
  availableIcons,
  onClose,
  onSave,
  onChange
}) => {
  const [validationError, setValidationError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      const points = tempModalData.points || [];
      const hasLongPoint = points.some(point => point.length > 60);
      if (hasLongPoint) {
        setValidationError("Uwaga: Niektóre punkty są zbyt długie (>60 znaków) i mogą powodować zawijanie tekstu w oknie modalnym, co wpłynie na estetykę układu.");
      } else {
        setValidationError(null);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [tempModalData.points]);

  if (activeModalId === null) return null;

  const renderIcon = (iconName: string) => {
    const Icon = (Icons[iconName as keyof typeof Icons] as React.ElementType) || Icons.CheckCircle;
    return <Icon size={16} />;
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-3xl bg-[#0f172a] border-l border-slate-800 shadow-2xl flex flex-col h-full transform transition-transform duration-300 ease-in-out">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-800 bg-[#0f172a]">
          <div>
            <h2 className="text-xl font-bold text-white">Edycja modala</h2>
            <p className="text-sm text-slate-400 mt-1">Edytujesz treść, która może być przypisana do wielu kart.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Content (Editor) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-[#0f172a] space-y-10">
          
          {/* Sekcja: Konfiguracja Systemowa */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-brand-blue uppercase tracking-wider border-b border-slate-800 pb-2">Konfiguracja Systemowa</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nazwa robocza (tylko w CMS)</label>
                <input
                  type="text"
                  value={tempModalData.internalName || ''}
                  onChange={(e) => onChange({ ...tempModalData, internalName: e.target.value })}
                  className="w-full bg-[#020617] border border-slate-800 rounded-[var(--radius-brand-input)] px-4 py-3 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
                  placeholder="np. Modal - Płatność za efekt"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">ID Modala (unikalne)</label>
                <input
                  type="text"
                  value={tempModalData.id || ''}
                  onChange={(e) => onChange({ ...tempModalData, id: e.target.value })}
                  className="w-full bg-[#020617] border border-slate-800 rounded-[var(--radius-brand-input)] px-4 py-3 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-[#020617] border border-slate-800 rounded-[var(--radius-brand-input)]">
              <input
                type="checkbox"
                id="isVisibleInCarousel"
                checked={tempModalData.isVisibleInCarousel || false}
                onChange={(e) => onChange({ ...tempModalData, isVisibleInCarousel: e.target.checked })}
                className="w-5 h-5 rounded border-slate-700 text-brand-blue focus:ring-brand-blue bg-[#0f172a]"
              />
              <label htmlFor="isVisibleInCarousel" className="text-sm font-bold text-white cursor-pointer select-none">
                Widoczny w karuzeli (można do niego przewinąć strzałkami na stronie)
              </label>
            </div>
          </div>

          {/* Sekcja: Treść Główna */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-brand-blue uppercase tracking-wider border-b border-slate-800 pb-2">Treść Główna</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tytuł (w modalu)</label>
                <input
                  type="text"
                  value={tempModalData.title || ''}
                  onChange={(e) => onChange({ ...tempModalData, title: e.target.value })}
                  className="w-full bg-[#020617] border border-slate-800 rounded-[var(--radius-brand-input)] px-4 py-3 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Podtytuł</label>
                <input
                  type="text"
                  value={tempModalData.subtitle || ''}
                  onChange={(e) => onChange({ ...tempModalData, subtitle: e.target.value })}
                  className="w-full bg-[#020617] border border-slate-800 rounded-[var(--radius-brand-input)] px-4 py-3 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ikona</label>
                <div className="relative">
                  <select
                    value={tempModalData.icon || 'CheckCircle'}
                    onChange={(e) => onChange({ ...tempModalData, icon: e.target.value })}
                    className="w-full bg-[#020617] border border-slate-800 rounded-[var(--radius-brand-input)] px-4 py-3 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all appearance-none pl-12"
                  >
                    {availableIcons.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-blue pointer-events-none">
                    {renderIcon(tempModalData.icon || 'CheckCircle')}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">URL Obrazka (prawa strona)</label>
                <input
                  type="text"
                  value={tempModalData.imageUrl || ''}
                  onChange={(e) => onChange({ ...tempModalData, imageUrl: e.target.value })}
                  className="w-full bg-[#020617] border border-slate-800 rounded-[var(--radius-brand-input)] px-4 py-3 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
                />
              </div>
            </div>
          </div>

          {/* Sekcja: Szczegóły */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-brand-blue uppercase tracking-wider border-b border-slate-800 pb-2">Szczegóły</h3>
            
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Główna korzyść (Benefit)</label>
              <textarea
                value={tempModalData.benefit || ''}
                onChange={(e) => onChange({ ...tempModalData, benefit: e.target.value })}
                rows={3}
                className="w-full bg-[#020617] border border-slate-800 rounded-[var(--radius-brand-input)] px-4 py-3 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Standard operacyjny (krótki tekst)</label>
              <input
                type="text"
                value={tempModalData.standard || ''}
                onChange={(e) => onChange({ ...tempModalData, standard: e.target.value })}
                className="w-full bg-[#020617] border border-slate-800 rounded-[var(--radius-brand-input)] px-4 py-3 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Punkty standardów (oddzielone nową linią)</label>
              <textarea
                value={(tempModalData.points || []).join('\n')}
                onChange={(e) => onChange({ ...tempModalData, points: e.target.value.split('\n').filter(Boolean) })}
                rows={5}
                className={`w-full bg-[#020617] border ${validationError ? 'border-amber-500' : 'border-slate-800'} rounded-[var(--radius-brand-input)] px-4 py-3 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all resize-none`}
                placeholder="Punkt 1&#10;Punkt 2&#10;Punkt 3"
              />
              {validationError && (
                <div className="flex items-center gap-2 mt-2 text-amber-500 text-sm">
                  <Icons.AlertTriangle size={16} />
                  <span>{validationError}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="px-8 py-6 border-t border-slate-800 bg-[#020617] flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 rounded-[var(--radius-brand-button)] transition-all"
          >
            Anuluj
          </button>
          <button
            onClick={onSave}
            className="px-8 py-2.5 bg-brand-blue text-white rounded-[var(--radius-brand-button)] font-bold text-sm hover:bg-brand-light-blue transition-colors"
          >
            Zapisz zmiany
          </button>
        </div>
      </div>
    </div>
  );
};
