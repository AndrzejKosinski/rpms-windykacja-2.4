import React from 'react';
import { Database, Plus, HardDrive, Zap, ShieldCheck, FileText, Eye, Edit3, Trash2 } from 'lucide-react';

export const RAGManager: React.FC = () => {
  const knowledgeFiles = [
    { name: 'pricing.txt', size: '1.2 KB', updated: '2024-10-25', status: 'Active' },
    { name: 'procedures.txt', size: '2.4 KB', updated: '2024-10-24', status: 'Active' },
    { name: 'regulations.txt', size: '5.6 KB', updated: '2024-09-12', status: 'Draft' },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Zarządzanie Kontekstem RAG</h1>
          <p className="text-slate-400 font-medium">Pliki tekstowe w katalogu /knowledge zasilające inteligencję Gemini RPMS.</p>
        </div>
        <button className="px-8 py-4 bg-white text-brand-navy rounded-[var(--radius-brand-button)] font-black flex items-center gap-2 hover:bg-slate-200 transition-all shadow-xl">
          <Plus size={20} /> Dodaj plik wiedzy
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-[#0f172a] p-8 rounded-[var(--radius-brand-card)] border border-slate-800 flex flex-col gap-4">
           <div className="w-12 h-12 bg-brand-blue/10 text-brand-blue rounded-[var(--radius-brand-button)] flex items-center justify-center">
              <HardDrive size={24} />
           </div>
           <div>
             <p className="text-4xl font-black text-white">3</p>
             <p className="text-xs font-black text-slate-500 uppercase tracking-widest mt-1">Aktywne pliki .txt</p>
           </div>
        </div>
        <div className="bg-[#0f172a] p-8 rounded-[var(--radius-brand-card)] border border-slate-800 flex flex-col gap-4">
           <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-[var(--radius-brand-button)] flex items-center justify-center">
              <Zap size={24} />
           </div>
           <div>
             <p className="text-4xl font-black text-white">100%</p>
             <p className="text-xs font-black text-slate-500 uppercase tracking-widest mt-1">Synchronizacja RAG</p>
           </div>
        </div>
        <div className="bg-[#0f172a] p-8 rounded-[var(--radius-brand-card)] border border-slate-800 flex flex-col gap-4">
           <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-[var(--radius-brand-button)] flex items-center justify-center">
              <ShieldCheck size={24} />
           </div>
           <div>
             <p className="text-4xl font-black text-white">Stable</p>
             <p className="text-xs font-black text-slate-500 uppercase tracking-widest mt-1">Status Silnika AI</p>
           </div>
        </div>
      </div>

      <div className="bg-[#0f172a] rounded-[var(--radius-brand-card)] border border-slate-800 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-900/50 border-b border-slate-800">
              <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-widest">Nazwa Pliku</th>
              <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-widest">Rozmiar</th>
              <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-widest">Ostatnia edycja</th>
              <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-widest">Status</th>
              <th className="p-8 text-right text-[11px] font-black text-slate-500 uppercase tracking-widest">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {knowledgeFiles.map((file, i) => (
              <tr key={i} className="border-b border-slate-800/50 hover:bg-white/5 transition-colors group">
                <td className="p-8 font-bold flex items-center gap-3">
                  <FileText size={18} className="text-brand-blue" /> {file.name}
                </td>
                <td className="p-8 text-slate-400 font-medium text-sm">{file.size}</td>
                <td className="p-8 text-slate-400 font-medium text-sm">{file.updated}</td>
                <td className="p-8">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${file.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-500'}`}>
                    {file.status}
                  </span>
                </td>
                <td className="p-8 text-right">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-white transition-colors"><Eye size={16} /></button>
                    <button className="p-2 text-slate-400 hover:text-white transition-colors"><Edit3 size={16} /></button>
                    <button className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
