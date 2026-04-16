
import React, { useState } from 'react';
import { Plus, Grid, List as ListIcon, FileText, Download, AlertTriangle, Loader2 } from 'lucide-react';
import { Debtor } from '../../../entities/debtor/model/types';

interface DocumentsViewProps {
  debtors: Debtor[];
  onAddDebt: () => void;
  onDownload: (fileUrl: string, invoiceId: string) => void;
  isDownloading: string | null;
}

const DocumentsView: React.FC<DocumentsViewProps> = ({ debtors, onAddDebt, onDownload, isDownloading }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // Spłaszczamy wszystkie faktury do jednej listy dokumentów
  const allDocuments = debtors.flatMap(d => d.invoices.map(inv => ({
    ...inv,
    debtorName: d.debtorName,
    nip: d.nip
  })));

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-black text-brand-navy mb-2">Manager Dokumentów</h2>
          <p className="text-slate-500 font-medium italic">Wszystkie faktury zsynchronizowane z Drive.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-[var(--radius-brand-button)] border border-slate-100 shadow-sm">
          <button 
            onClick={() => setViewMode('grid')} 
            className={`p-2 rounded-[var(--radius-brand-button)] ${viewMode === 'grid' ? 'bg-brand-light-blue text-brand-blue' : 'text-slate-300'}`}
          >
            <Grid size={20} />
          </button>
          <button 
            onClick={() => setViewMode('list')} 
            className={`p-2 rounded-[var(--radius-brand-button)] ${viewMode === 'list' ? 'bg-brand-light-blue text-brand-blue' : 'text-slate-300'}`}
          >
            <ListIcon size={20} />
          </button>
          <button 
            onClick={onAddDebt} 
            className="px-6 py-2 bg-brand-navy text-white text-sm font-black rounded-[var(--radius-brand-button)]"
          >
            <Plus size={18} /> Prześlij dokument
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[var(--radius-brand-card)] border border-slate-100 shadow-sm overflow-hidden">
        {viewMode === 'list' ? (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Status / Nazwa</th>
                <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Dłużnik</th>
                <th className="px-8 py-4 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {allDocuments.map((doc, idx) => (
                <tr key={idx} className="group hover:bg-slate-50/50">
                  <td className="px-8 py-5 flex items-center gap-4">
                    {doc.type === 'MANUAL' ? (
                      <AlertTriangle size={18} className="text-amber-500" />
                    ) : (
                      <FileText size={18} className="text-brand-blue" />
                    )}
                    <span className={`font-bold text-sm ${doc.type === 'MANUAL' ? 'text-amber-600 italic' : 'text-brand-navy'}`}>
                      {doc.type === 'MANUAL' ? 'Brak dokumentu (Zgłoszenie ręczne)' : doc.fileName || `Faktura_VAT_${doc.nip}.pdf`}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500 font-bold">{doc.debtorName}</td>
                  <td className="px-8 py-5 text-right">
                    {doc.fileUrl && (
                      <button 
                        onClick={() => onDownload(doc.fileUrl, doc.id)}
                        disabled={isDownloading === doc.id}
                        className="p-2 text-slate-400 hover:text-brand-blue disabled:opacity-30"
                      >
                        {isDownloading === doc.id ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {allDocuments.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center text-slate-400 font-medium">
                    Brak dokumentów w systemie.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allDocuments.map((doc, idx) => (
              <div key={idx} className="group p-6 bg-slate-50 border border-slate-100 rounded-[var(--radius-brand-card)] hover:bg-white hover:shadow-xl transition-all flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-[var(--radius-brand-button)] flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform ${doc.type === 'MANUAL' ? 'bg-amber-50 text-amber-500' : 'bg-white text-brand-blue'}`}>
                  {doc.type === 'MANUAL' ? <AlertTriangle size={32} /> : <FileText size={32} />}
                </div>
                <p className={`text-sm font-black mb-1 truncate w-full ${doc.type === 'MANUAL' ? 'text-amber-600' : 'text-brand-navy'}`}>
                  {doc.type === 'MANUAL' ? 'Oczekiwanie na plik' : doc.fileName || `FA_${doc.nip}.pdf`}
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4 truncate w-full">{doc.debtorName}</p>
                {doc.fileUrl && (
                  <button 
                    onClick={() => onDownload(doc.fileUrl, doc.id)}
                    disabled={isDownloading === doc.id}
                    className="p-3 bg-white border border-slate-100 rounded-[var(--radius-brand-button)] text-slate-400 hover:text-brand-blue hover:shadow-sm transition-all disabled:opacity-30"
                  >
                    {isDownloading === doc.id ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                  </button>
                )}
              </div>
            ))}
            {allDocuments.length === 0 && (
              <div className="col-span-full py-20 text-center text-slate-400 font-medium">
                Brak dokumentów w systemie.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsView;
