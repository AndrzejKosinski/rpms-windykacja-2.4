import React from 'react';
import { Upload, FileSignature, Table } from 'lucide-react';

interface QuickActionsProps {
  onAddInvoiceScan: () => void;
  onManualEntry: () => void;
  onExcelImport: () => void;
  isEmailVerified?: boolean;
}

export const DashboardQuickActions: React.FC<QuickActionsProps> = ({ 
  onAddInvoiceScan, 
  onManualEntry, 
  onExcelImport, 
  isEmailVerified 
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
    <button 
      onClick={onAddInvoiceScan}
      disabled={isEmailVerified === false}
      className="group p-6 bg-white border border-slate-200 rounded-[var(--radius-brand-card)] hover:border-brand-blue hover:shadow-xl hover:shadow-brand-blue/10 transition-all duration-500 text-left flex flex-col h-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:shadow-none"
    >
      <div className="w-12 h-12 bg-brand-light-blue text-brand-blue rounded-[var(--radius-brand-button)] flex items-center justify-center mb-4 group-hover:bg-brand-blue group-hover:text-white transition-all duration-500 group-disabled:bg-slate-50 group-disabled:text-slate-300">
        <Upload size={24} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-black text-brand-navy">Dodaj Fakturę</h3>
          <span className="px-2 py-0.5 bg-amber-400 text-brand-navy text-[8px] font-black rounded-full uppercase tracking-widest">Najszybsza</span>
        </div>
        <p className="text-sm text-slate-500 font-medium leading-relaxed">System automatycznie pobierze dane z pliku PDF lub zdjęcia.</p>
      </div>
    </button>

    <button 
      onClick={onManualEntry}
      disabled={isEmailVerified === false}
      className="group p-6 bg-white border border-slate-200 rounded-[var(--radius-brand-card)] hover:border-brand-navy hover:shadow-xl hover:shadow-brand-navy/10 transition-all duration-500 text-left flex flex-col h-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:shadow-none"
    >
      <div className="w-12 h-12 bg-slate-50 text-brand-navy rounded-[var(--radius-brand-button)] flex items-center justify-center mb-4 group-hover:bg-brand-navy group-hover:text-white transition-all duration-500 group-disabled:bg-slate-50 group-disabled:text-slate-300">
        <FileSignature size={24} />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-black text-brand-navy mb-1">Wpis ręczny</h3>
        <p className="text-sm text-slate-500 font-medium leading-relaxed">Samodzielnie wprowadź dane dłużnika i kwotę należności.</p>
      </div>
    </button>

    <button 
      onClick={onExcelImport}
      disabled={isEmailVerified === false}
      className="group p-6 bg-white border border-slate-200 rounded-[var(--radius-brand-card)] hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-500 text-left flex flex-col h-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:shadow-none"
    >
      <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-[var(--radius-brand-button)] flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 group-disabled:bg-slate-50 group-disabled:text-slate-300">
        <Table size={24} />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-black text-brand-navy mb-1">Lista spraw Excel</h3>
        <p className="text-sm text-slate-500 font-medium leading-relaxed">Przekaż wiele spraw naraz za pomocą pliku Excel lub CSV.</p>
      </div>
    </button>
  </div>
);
