import React from 'react';
import Image from 'next/image';
import { ImageIcon, X, Search, Loader2 } from 'lucide-react';

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  setQuery: (query: string) => void;
  onSearch: () => void;
  results: any[];
  isSearching: boolean;
  onSelect: (url: string) => void;
}

export const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
  isOpen,
  onClose,
  query,
  setQuery,
  onSearch,
  results,
  isSearching,
  onSelect
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[#020617]/90 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-4xl bg-[#0f172a] border border-slate-800 rounded-[var(--radius-brand-card)] p-10 shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <ImageIcon size={28} className="text-brand-blue" /> Biblioteka Mediów (Unsplash)
          </h2>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearch()}
              placeholder="Szukaj profesjonalnych zdjęć biznesowych..."
              className="w-full pl-12 pr-6 py-4 bg-slate-900 border border-slate-800 rounded-[var(--radius-brand-button)] text-white font-bold outline-none focus:border-brand-blue transition-all"
            />
          </div>
          <button 
            onClick={onSearch}
            disabled={isSearching}
            className="px-8 py-4 bg-brand-blue text-white rounded-[var(--radius-brand-button)] font-black flex items-center gap-2 hover:bg-brand-blue/90 transition-all"
          >
            {isSearching ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
            Szukaj
          </button>
        </div>

        <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
          {results.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {results.map((img) => (
                <div 
                  key={img.id} 
                  onClick={() => onSelect(img.urls.regular)}
                  className="relative aspect-video group cursor-pointer rounded-[var(--radius-brand-button)] overflow-hidden border border-slate-800 hover:border-brand-blue transition-all"
                >
                  <Image 
                    src={img.urls.small} 
                    alt={img.alt_description || "Unsplash image"} 
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-brand-blue/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-brand-blue text-white px-3 py-1.5 rounded-[var(--radius-brand-input)] text-[10px] font-black uppercase tracking-widest">Wybierz</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-[8px] text-white/60 truncate">Autor: {img.user.name}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 py-20">
              <ImageIcon size={48} className="mb-4 opacity-20" />
              <p className="font-bold">Wpisz frazę i naciśnij Enter, aby wyszukać zdjęcia.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
