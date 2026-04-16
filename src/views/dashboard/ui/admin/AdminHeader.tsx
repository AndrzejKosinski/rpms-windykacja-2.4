import React from 'react';
import { HardDrive, RefreshCw, ShieldCheck, Database } from 'lucide-react';

interface AdminHeaderProps {
  activeTab: string;
  isCmsTab: boolean;
  title: string;
  subtitle: string;
  isSaving: boolean;
  saveStatus: 'idle' | 'success' | 'error';
  onSave: () => void;
  onDownloadFallbackJSON: () => void;
  onDownloadFallbackTS: () => void;
  onAddSection: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab,
  isCmsTab,
  title,
  subtitle,
  isSaving,
  saveStatus,
  onSave,
  onDownloadFallbackJSON,
  onDownloadFallbackTS,
  onAddSection
}) => {
  return (
    <header className="h-24 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800 px-10 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h2 className="text-2xl font-black text-white italic">{title}</h2>
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        {isCmsTab && (
          <button
            onClick={onDownloadFallbackJSON}
            className="px-4 py-2 rounded-[var(--radius-brand-button)] font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2 border border-slate-800"
          >
            <HardDrive size={14} /> Pobierz Fallback (JSON)
          </button>
        )}

        {activeTab === 'layout' && (
          <>
            <button
              onClick={onDownloadFallbackTS}
              className="px-4 py-2 rounded-[var(--radius-brand-button)] font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2 border border-slate-800"
            >
              <HardDrive size={14} /> Pobierz Fallback (TS)
            </button>
            <button
              onClick={onAddSection}
              className="px-6 py-2 bg-slate-800 text-white rounded-[var(--radius-brand-button)] font-black text-[10px] uppercase tracking-widest hover:bg-slate-700 transition-all flex items-center gap-2"
            >
              <Plus size={14} /> Dodaj sekcję
            </button>
          </>
        )}

        {(isCmsTab || activeTab === 'layout' || activeTab === 'settings') && (
          <button
            onClick={onSave}
            disabled={isSaving}
            className={`px-6 py-2 rounded-[var(--radius-brand-button)] font-black text-[10px] uppercase tracking-widest transition-all shadow-lg flex items-center gap-2 ${
              saveStatus === 'success' ? 'bg-emerald-500 text-white shadow-emerald-500/20' :
              saveStatus === 'error' ? 'bg-red-500 text-white shadow-red-500/20' :
              'bg-brand-blue text-white hover:bg-brand-blue/90 shadow-brand-blue/20'
            }`}
          >
            {isSaving ? <RefreshCw size={14} className="animate-spin" /> :
             saveStatus === 'success' ? <ShieldCheck size={14} /> :
             <Database size={14} />}
            {isSaving ? 'Zapisywanie...' :
             saveStatus === 'success' ? 'Zapisano!' :
             'Zapisz zmiany'}
          </button>
        )}

        <div className="w-px h-8 bg-slate-800 mx-2"></div>

        <div className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-[var(--radius-brand-button)] border border-slate-700">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-black uppercase text-slate-400">System Online</span>
        </div>
        <div className="w-10 h-10 bg-brand-blue rounded-[var(--radius-brand-button)] flex items-center justify-center text-white font-black shadow-lg shadow-brand-blue/20">AD</div>
      </div>
    </header>
  );
};

// Helper for Plus icon since it's used in the header
import { Plus } from 'lucide-react';
