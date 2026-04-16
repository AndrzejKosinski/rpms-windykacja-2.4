
import React, { useState } from 'react';
import { Search, RefreshCw, Plus, Users, MoreVertical } from 'lucide-react';
import { Debtor } from '../../../entities/debtor/model/types';

interface DebtorsViewProps {
  debtors: Debtor[];
  isLoading: boolean;
  onRefresh: () => void;
  onAddDebt: () => void;
  onSelectDebtor: (debtor: Debtor) => void;
}

const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-8 py-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-100 rounded-[var(--radius-brand-button)]"></div>
        <div className="space-y-2">
          <div className="h-4 w-32 bg-slate-100 rounded-[var(--radius-brand-button)]"></div>
          <div className="h-3 w-20 bg-slate-50 rounded-[var(--radius-brand-button)]"></div>
        </div>
      </div>
    </td>
    <td className="px-8 py-6"><div className="h-4 w-24 bg-slate-100 rounded-[var(--radius-brand-button)]"></div></td>
    <td className="px-8 py-6"><div className="h-8 w-28 bg-slate-50 rounded-full"></div></td>
    <td className="px-8 py-6 text-right"><div className="h-4 w-4 bg-slate-100 rounded-[var(--radius-brand-button)] ml-auto"></div></td>
  </tr>
);

const DebtorsView: React.FC<DebtorsViewProps> = ({ debtors, isLoading, onRefresh, onAddDebt, onSelectDebtor }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDebtors = debtors.filter(d => 
    String(d.debtorName || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    String(d.nip || "").includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    switch (String(status).toUpperCase()) {
      case 'NOWA SPRAWA': return 'bg-brand-light-blue text-brand-blue border-brand-blue/20';
      case 'WERYFIKACJA PRAWNIKA': return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'EGZEKUCJA': return 'bg-green-50 text-green-600 border-green-200';
      default: return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-black text-brand-navy mb-2">Lista Dłużników</h2>
          <p className="text-slate-500 font-medium">Baza dłużników (Master Data) połączona z Arkuszem Google.</p>
        </div>
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Szukaj dłużnika..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-[var(--radius-brand-button)] outline-none text-sm focus:border-brand-blue transition-all shadow-sm" 
            />
          </div>
          <button 
            onClick={onRefresh} 
            className="p-3 bg-white border border-slate-200 rounded-[var(--radius-brand-button)] text-slate-400 hover:text-brand-blue transition-all shadow-sm"
          >
            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={onAddDebt} 
            className="px-6 py-3 bg-brand-navy text-white text-sm font-black rounded-[var(--radius-brand-button)] hover:bg-brand-blue transition-all flex items-center gap-2 shadow-lg"
          >
            <Plus size={18} /> Nowa faktura
          </button>
        </div>
      </div>
      <div className="bg-white rounded-[var(--radius-brand-card)] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Dłużnik / NIP</th>
              <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Suma Zadłużenia</th>
              <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">Akcje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : filteredDebtors.map((debtor, idx) => (
              <tr 
                key={idx} 
                className="group hover:bg-slate-50/50 cursor-pointer" 
                onClick={() => onSelectDebtor(debtor)}
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-[var(--radius-brand-button)] flex items-center justify-center text-slate-400 group-hover:bg-brand-blue/10 group-hover:text-brand-blue">
                      <Users size={20} />
                    </div>
                    <div>
                      <p className="font-black text-brand-navy">{debtor.debtorName}</p>
                      <p className="text-xs text-slate-400">NIP: {debtor.nip}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <p className="text-sm font-black text-brand-navy">{debtor.totalAmount}</p>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-4 py-1.5 rounded-full text-[11px] font-black border uppercase tracking-widest ${getStatusColor(debtor.status)}`}>
                    {debtor.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <MoreVertical size={18} className="ml-auto text-slate-400" />
                </td>
              </tr>
            ))}
            {!isLoading && filteredDebtors.length === 0 && (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-medium">
                  Nie znaleziono dłużników spełniających kryteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DebtorsView;
