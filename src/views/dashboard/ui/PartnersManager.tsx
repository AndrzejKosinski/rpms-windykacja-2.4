import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Plus, Trash2, GripVertical, Link as LinkIcon, 
  Building2, ExternalLink, AlertCircle, CheckCircle2,
  Image as ImageIcon, Database, RefreshCw
} from 'lucide-react';
import { useCMSStore } from '../store/cmsStore';
import { cmsService } from '@/shared/api/apiClientFactory';
import { TrustBarLogo } from '../types/cms';

const PartnersManager: React.FC = () => {
  const logic = useCMSStore();
  const { localContent, setLocalContent } = logic;
  const partners = localContent.trustBar?.logos || [];

  const [newPartner, setNewPartner] = useState<TrustBarLogo>({ name: '', logoUrl: '' });
  const [isAdding, setIsAdding] = useState(false);

  const handleAddPartner = () => {
    if (!newPartner.name || !newPartner.logoUrl) return;
    if (partners.length >= 9) {
      alert("Osiągnięto limit 9 partnerów. Usuń jednego, aby dodać nowego.");
      return;
    }
    
    const updatedLogos = [...partners, newPartner];
    setLocalContent({
      ...localContent,
      trustBar: {
        logos: updatedLogos
      }
    });
    setNewPartner({ name: '', logoUrl: '' });
    setIsAdding(false);
  };

  const handleRemovePartner = (index: number) => {
    const updatedLogos = partners.filter((_, i) => i !== index);
    setLocalContent({
      ...localContent,
      trustBar: {
        logos: updatedLogos
      }
    });
  };

  const handleUpdatePartner = (index: number, field: keyof TrustBarLogo, value: string) => {
    const updatedLogos = [...partners];
    updatedLogos[index] = { ...updatedLogos[index], [field]: value };
    setLocalContent({
      ...localContent,
      trustBar: {
        logos: updatedLogos
      }
    });
  };

  const movePartner = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === partners.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedLogos = [...partners];
    const temp = updatedLogos[index];
    updatedLogos[index] = updatedLogos[newIndex];
    updatedLogos[newIndex] = temp;

    setLocalContent({
      ...localContent,
      trustBar: {
        logos: updatedLogos
      }
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-black text-white italic">Zarządzanie Partnerami</h3>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-widest mt-1">Logotypy wyświetlane w sekcji TrustBar</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => logic.handleSave(async (content) => { await cmsService.updateCMS(content); })}
            disabled={logic.isSaving}
            className={`px-6 py-3 rounded-[var(--radius-brand-button)] font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center gap-2 ${
              logic.saveStatus === 'success' ? 'bg-emerald-500 text-white shadow-emerald-500/20' :
              logic.saveStatus === 'error' ? 'bg-red-500 text-white shadow-red-500/20' :
              'bg-brand-blue text-white hover:bg-brand-blue/90 shadow-brand-blue/20'
            }`}
          >
            {logic.isSaving ? <RefreshCw size={16} className="animate-spin" /> :
             logic.saveStatus === 'success' ? <CheckCircle2 size={16} /> :
             <Database size={16} />}
            {logic.isSaving ? 'Zapisywanie...' :
             logic.saveStatus === 'success' ? 'Zapisano!' :
             'Zapisz zmiany'}
          </button>
          <button 
            onClick={() => setIsAdding(true)}
            disabled={partners.length >= 9}
            className="px-6 py-3 bg-slate-800 text-white rounded-[var(--radius-brand-button)] font-black text-xs uppercase tracking-widest hover:bg-slate-700 transition-all shadow-lg flex items-center gap-2 border border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            title={partners.length >= 9 ? "Osiągnięto limit 9 partnerów" : ""}
          >
            <Plus size={16} /> Dodaj Partnera
          </button>
        </div>
      </div>

      {/* Add Partner Form */}
      {isAdding && (
        <div className="mb-8 p-8 bg-[#0f172a] border border-brand-blue/30 rounded-[var(--radius-brand-card)] shadow-2xl animate-in zoom-in duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-brand-blue/10 text-brand-blue rounded-[var(--radius-brand-button)] flex items-center justify-center">
              <Plus size={20} />
            </div>
            <h4 className="text-lg font-black text-white">Nowy Partner</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Nazwa Firmy</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  placeholder="np. Aegon"
                  value={newPartner.name}
                  onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-800 focus:border-brand-blue text-white rounded-[var(--radius-brand-button)] py-4 pl-12 pr-4 outline-none transition-all font-bold"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">URL Logotypu (PNG/WebP)</label>
              <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  placeholder="https://rpms.pl/wp-content/..."
                  value={newPartner.logoUrl}
                  onChange={(e) => setNewPartner({ ...newPartner, logoUrl: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-800 focus:border-brand-blue text-white rounded-[var(--radius-brand-button)] py-4 pl-12 pr-4 outline-none transition-all font-bold"
                />
              </div>
            </div>
          </div>

          {newPartner.logoUrl && (
            <div className="mt-6 p-4 bg-slate-900/80 rounded-[var(--radius-brand-button)] border border-slate-800 flex items-center gap-6">
              <div className="w-24 h-12 bg-white/5 rounded flex items-center justify-center overflow-hidden p-2 relative">
                <Image 
                  src={newPartner.logoUrl} 
                  alt="Preview" 
                  fill
                  sizes="128px"
                  referrerPolicy="no-referrer"
                  className="object-contain p-2"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/120x40?text=Błąd+URL';
                    target.srcset = '';
                  }}
                />
              </div>
              <div>
                <p className="text-xs font-black text-white uppercase tracking-wider">Podgląd logotypu</p>
                <p className="text-[10px] text-slate-500 font-medium">Upewnij się, że logo ma przezroczyste tło.</p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 mt-8">
            <button 
              onClick={() => setIsAdding(false)}
              className="px-6 py-3 text-slate-500 hover:text-white font-black text-xs uppercase tracking-widest transition-all"
            >
              Anuluj
            </button>
            <button 
              onClick={handleAddPartner}
              disabled={!newPartner.name || !newPartner.logoUrl || partners.length >= 9}
              className="px-8 py-3 bg-brand-blue text-white rounded-[var(--radius-brand-button)] font-black text-xs uppercase tracking-widest hover:bg-brand-blue/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Dodaj do listy
            </button>
          </div>
        </div>
      )}

      {/* Partners List */}
      <div className="space-y-4">
        {partners.length === 0 ? (
          <div className="py-20 bg-[#0f172a] border border-dashed border-slate-800 rounded-[var(--radius-brand-card)] flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-900 text-slate-700 rounded-full flex items-center justify-center mb-4">
              <ImageIcon size={32} />
            </div>
            <h4 className="text-xl font-black text-slate-600 uppercase tracking-widest">Brak partnerów</h4>
            <p className="text-slate-500 text-sm max-w-xs mt-2">Dodaj pierwszego partnera, aby wyświetlić logotypy na stronie głównej.</p>
          </div>
        ) : (
          partners.map((partner, index) => (
            <div 
              key={index} 
              className="group bg-[#0f172a] border border-slate-800 hover:border-slate-700 rounded-[var(--radius-brand-card)] p-6 flex items-center gap-6 transition-all hover:shadow-2xl hover:shadow-black/50"
            >
              <div className="flex flex-col gap-1">
                <button 
                  onClick={() => movePartner(index, 'up')}
                  disabled={index === 0}
                  className="p-1 text-slate-600 hover:text-white disabled:opacity-0 transition-colors"
                >
                  <Plus size={14} className="rotate-45" />
                </button>
                <div className="cursor-grab active:cursor-grabbing text-slate-700 group-hover:text-slate-500 transition-colors">
                  <GripVertical size={20} />
                </div>
                <button 
                  onClick={() => movePartner(index, 'down')}
                  disabled={index === partners.length - 1}
                  className="p-1 text-slate-600 hover:text-white disabled:opacity-0 transition-colors"
                >
                  <Plus size={14} className="rotate-45" />
                </button>
              </div>

              <div className="w-32 h-16 bg-white/5 rounded-[var(--radius-brand-button)] flex items-center justify-center p-3 shrink-0 border border-slate-800/50 relative">
                <Image 
                  src={partner.logoUrl} 
                  alt={partner.name} 
                  fill
                  sizes="128px"
                  referrerPolicy="no-referrer"
                  className="object-contain opacity-60 group-hover:opacity-100 transition-opacity p-3"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/120x40?text=Błąd';
                    target.srcset = '';
                  }}
                />
              </div>

              <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-600">Nazwa Firmy</label>
                  <input 
                    type="text" 
                    value={partner.name}
                    onChange={(e) => handleUpdatePartner(index, 'name', e.target.value)}
                    className="w-full bg-transparent border-b border-slate-800 focus:border-brand-blue text-white py-1 outline-none transition-all font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-600">URL Logotypu</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={partner.logoUrl}
                      onChange={(e) => handleUpdatePartner(index, 'logoUrl', e.target.value)}
                      className="w-full bg-transparent border-b border-slate-800 focus:border-brand-blue text-slate-400 focus:text-white py-1 outline-none transition-all text-xs font-medium truncate"
                    />
                    <a href={partner.logoUrl} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-brand-blue transition-colors">
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleRemovePartner(index)}
                  className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-[var(--radius-brand-button)] transition-all"
                  title="Usuń partnera"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info Box */}
      <div className="mt-12 p-6 bg-brand-blue/5 border border-brand-blue/20 rounded-[var(--radius-brand-card)] flex items-start gap-4">
        <div className="text-brand-blue mt-1">
          <AlertCircle size={20} />
        </div>
        <div>
          <h5 className="text-sm font-black text-white uppercase tracking-widest mb-1">Wskazówka UX</h5>
          <p className="text-slate-400 text-xs leading-relaxed">
            Dla najlepszego efektu wizualnego używaj logotypów w formacie <span className="text-white font-bold">.png</span> lub <span className="text-white font-bold">.webp</span> z przezroczystym tłem. 
            Zalecana wysokość logotypu to około 60-100px. System automatycznie nałoży efekt skali szarości, który znika po najechaniu myszką.
            <br /><br />
            <span className="text-brand-blue font-bold uppercase tracking-tighter">Limit:</span> Maksymalnie <span className="text-white font-bold">9 partnerów</span> może być wyświetlanych jednocześnie dla zachowania optymalnego układu sekcji TrustBar.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PartnersManager;
