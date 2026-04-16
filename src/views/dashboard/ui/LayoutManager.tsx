import React, { useState } from 'react';
import { 
  GripVertical, Eye, EyeOff, Trash2, Plus, 
  ChevronUp, ChevronDown, Layout as LayoutIcon,
  Settings2, ChevronRight, HardDrive
} from 'lucide-react';
import { ComponentRegistry } from '../../../widgets/marketing/registry';
import { useCMSStore } from '../store/cmsStore';

interface LayoutManagerProps {
  onBack?: () => void;
}

const LayoutManager: React.FC<LayoutManagerProps> = ({ onBack }) => {
  const { localContent, setLocalContent } = useCMSStore();
  const layout = Array.isArray(localContent.pageLayout) ? localContent.pageLayout : [];
  const onUpdate = (newLayout: any[]) => setLocalContent({ ...localContent, pageLayout: newLayout });
  
  const availableComponents = Object.keys(ComponentRegistry);
  const [sectionToDelete, setSectionToDelete] = useState<number | null>(null);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newLayout = [...layout];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newLayout.length) {
      [newLayout[index], newLayout[targetIndex]] = [newLayout[targetIndex], newLayout[index]];
      onUpdate(newLayout);
    }
  };

  const toggleVisibility = (index: number) => {
    const newLayout = [...layout];
    newLayout[index].visible = !newLayout[index].visible;
    onUpdate(newLayout);
  };

  const confirmRemoveSection = (index: number) => {
    setSectionToDelete(index);
  };

  const executeRemoveSection = () => {
    if (sectionToDelete !== null) {
      const newLayout = layout.filter((_, i) => i !== sectionToDelete);
      onUpdate(newLayout);
      setSectionToDelete(null);
    }
  };

  const changeVariant = (index: number, newComponent: string) => {
    const newLayout = [...layout];
    newLayout[index].component = newComponent;
    onUpdate(newLayout);
  };

  return (
    <div className="animate-in fade-in duration-700 bg-[#020617]">
      <div className="w-full mx-auto px-8 pb-12 space-y-8 pt-8">
        <div className="space-y-4">
          {layout.map((item, index) => (
            <div 
              key={item.id}
              className={`group bg-[#0f172a] border ${item.visible ? 'border-slate-800' : 'border-slate-800/30 opacity-60'} rounded-[var(--radius-brand-card)] p-6 flex items-center gap-6 transition-all hover:border-brand-blue/50`}
            >
              <div className="flex flex-col gap-1 text-slate-600">
                <button 
                  onClick={() => moveItem(index, 'up')}
                  disabled={index === 0}
                  className="hover:text-white disabled:opacity-20 transition-colors"
                >
                  <ChevronUp size={20} />
                </button>
                <button 
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === layout.length - 1}
                  className="hover:text-white disabled:opacity-20 transition-colors"
                >
                  <ChevronDown size={20} />
                </button>
              </div>

              <div className={`w-14 h-14 ${item.visible ? 'bg-brand-blue/10 text-brand-blue' : 'bg-slate-800 text-slate-600'} rounded-[var(--radius-brand-button)] flex items-center justify-center shrink-0`}>
                <LayoutIcon size={24} />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-widest">ID: {item.id}</span>
                  {!item.visible && (
                    <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-[9px] font-black uppercase tracking-widest rounded-[var(--radius-brand-input)]">Ukryta</span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <select 
                    value={item.component}
                    onChange={(e) => changeVariant(index, e.target.value)}
                    className="bg-transparent text-xl font-black text-white outline-none cursor-pointer hover:text-brand-blue transition-colors border-b border-white/10 pb-1"
                  >
                    {availableComponents.map(comp => (
                      <option key={comp} value={comp} className="bg-[#0f172a]">{comp}</option>
                    ))}
                  </select>
                  <Settings2 size={16} className="text-slate-600" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => toggleVisibility(index)}
                  className={`p-4 rounded-[var(--radius-brand-button)] transition-all ${item.visible ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20'}`}
                  title={item.visible ? "Ukryj sekcję" : "Pokaż sekcję"}
                >
                  {item.visible ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
                <button 
                  onClick={() => confirmRemoveSection(index)}
                  className="p-4 bg-red-500/10 text-red-500 rounded-[var(--radius-brand-button)] hover:bg-red-500 hover:text-white transition-all"
                  title="Usuń sekcję"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-8 bg-brand-blue/5 border border-brand-blue/10 rounded-[var(--radius-brand-card)] flex items-center gap-6">
          <div className="w-12 h-12 bg-brand-blue/20 text-brand-blue rounded-[var(--radius-brand-button)] flex items-center justify-center shrink-0">
            <Settings2 size={24} />
          </div>
          <div>
            <p className="text-white font-black text-sm uppercase tracking-widest mb-1">Wskazówka dla Administratora</p>
            <p className="text-slate-400 text-sm font-medium">
              Możesz dodawać wiele wariantów tego samego komponentu (np. różne wersje Hero) i przełączać je w locie, aby testować skuteczność strony. 
              Zmiany zostaną zapisane w chmurze po kliknięciu głównego przycisku zapisu w CMS Managerze.
            </p>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {sectionToDelete !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md" onClick={() => setSectionToDelete(null)} />
          <div className="relative w-full max-w-md bg-[#0f172a] border border-slate-800 rounded-[var(--radius-brand-card)] p-8 shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-2xl font-black text-white mb-4">Usuń sekcję</h3>
            <p className="text-slate-400 mb-8">Czy na pewno chcesz usunąć tę sekcję z układu strony? Tej operacji nie można cofnąć.</p>
            <div className="flex gap-4">
              <button onClick={() => setSectionToDelete(null)} className="flex-1 px-6 py-3 bg-slate-800 text-slate-300 rounded-[var(--radius-brand-button)] font-bold hover:bg-slate-700 transition-colors">Anuluj</button>
              <button onClick={executeRemoveSection} className="flex-1 px-6 py-3 bg-red-500 text-white rounded-[var(--radius-brand-button)] font-bold hover:bg-red-600 transition-colors">Usuń</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LayoutManager;
