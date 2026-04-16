import React, { useState, useMemo, useEffect } from 'react';
import { Plus, FileText, Scale, TrendingUp, Clock, Mail, Zap, Upload, FileSignature, Table, Filter, ListFilter, CheckCircle2, PlayCircle } from 'lucide-react';
import CaseCard from '../../../entities/case/ui/CaseCard';
import { Debtor } from '../../../entities/debtor/model/types';
import { legalStages } from '../../../entities/case/model/types';
import { DashboardSkeleton } from './DashboardSkeleton';
import { DashboardQuickActions } from './DashboardQuickActions';

interface DashboardViewProps {
  debtors: Debtor[];
  isLoading?: boolean;
  isProcessingAction: string | null;
  isDownloading: string | null;
  onUpdateStatus: (caseId: string, status: string) => void;
  onAddDebt: () => void;
  onAddInvoiceScan: () => void;
  onManualEntry: () => void;
  onExcelImport: () => void;
  onAddInvoiceToDebtor: (debtor: Debtor) => void;
  onDownload: (fileUrl: string, invoiceId: string) => void;
  onEditCase: (debtor: Debtor) => void;
  onEditInvoice: (debtor: Debtor, invoice: any) => void;
  onDeleteCase: (caseId: string) => void;
  onDeleteInvoice: (caseId: string, invoiceId: string) => void;
  userName: string;
  isEmailVerified?: boolean;
}

type TabType = 'NEW' | 'IN_PROGRESS' | 'FINISHED';

const DashboardView: React.FC<DashboardViewProps> = ({ debtors, isLoading, isProcessingAction, isDownloading, onUpdateStatus, onAddDebt, onAddInvoiceScan, onManualEntry, onExcelImport, onAddInvoiceToDebtor, onDownload, onEditCase, onEditInvoice, onDeleteCase, onDeleteInvoice, userName, isEmailVerified }) => {
  const [activeTab, setActiveTab] = useState<TabType>('NEW');

  // Sort debtors by timestamp (newest first)
  const sortedDebtors = useMemo(() => {
    return [...debtors].sort((a, b) => {
      const dateA = new Date(a.timestamp || 0).getTime();
      const dateB = new Date(b.timestamp || 0).getTime();
      return dateB - dateA;
    });
  }, [debtors]);

  const counts = useMemo(() => ({
    NEW: debtors.filter(d => d.status === legalStages[0]).length,
    IN_PROGRESS: debtors.filter(d => d.status !== legalStages[0] && d.status !== legalStages[legalStages.length - 1]).length,
    FINISHED: debtors.filter(d => d.status === legalStages[legalStages.length - 1]).length,
  }), [debtors]);

  // Intelligent tab switching logic
  useEffect(() => {
    if (isLoading) return;

    if (counts.NEW > 0) {
      // If there are new cases, always prioritize 'NEW' tab (e.g. after adding a new case)
      setActiveTab('NEW');
    } else if (counts.NEW === 0) {
      // If 'NEW' is empty, switch to 'IN_PROGRESS' if we are currently on 'NEW'
      if (activeTab === 'NEW') {
        setActiveTab('IN_PROGRESS');
      }
    }
  }, [counts.NEW, isLoading]);

  const filteredDebtors = useMemo(() => {
    return sortedDebtors.filter(debtor => {
      if (activeTab === 'NEW') return debtor.status === legalStages[0];
      if (activeTab === 'FINISHED') return debtor.status === legalStages[legalStages.length - 1];
      return debtor.status !== legalStages[0] && debtor.status !== legalStages[legalStages.length - 1];
    });
  }, [sortedDebtors, activeTab]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-12 pb-24">
        <div className="pt-8 space-y-4">
          <div className="h-8 w-64 bg-slate-100 rounded-[var(--radius-brand-input)] animate-pulse"></div>
          <div className="space-y-8">
            <DashboardSkeleton />
            <DashboardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (debtors.length === 0) {
    return (
      <div className="animate-in fade-in duration-700 max-w-5xl mx-auto space-y-12 pb-24">
        <div className="text-center pt-8">
          <h1 className="text-4xl sm:text-5xl font-black text-brand-navy mb-4 tracking-tight">Witaj, {String(userName || '')}!</h1>
          <p className="text-xl text-slate-500 font-medium mb-12">Jesteśmy tu, aby pomóc Ci szybko i skutecznie odzyskać należności.</p>
        </div>

        <DashboardQuickActions 
          onAddInvoiceScan={onAddInvoiceScan}
          onManualEntry={onManualEntry}
          onExcelImport={onExcelImport}
          isEmailVerified={isEmailVerified}
        />

        <div className="bg-white rounded-[var(--radius-brand-card)] border border-slate-100 p-10 lg:p-14 text-center">
          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-10">Jak to działa:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-10 left-[33%] w-[10%] border-t-2 border-dashed border-slate-100"></div>
            <div className="hidden md:block absolute top-10 left-[63%] w-[10%] border-t-2 border-dashed border-slate-100"></div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-brand-light-blue rounded-[var(--radius-brand-card)] flex items-center justify-center text-brand-blue mb-6 shadow-sm"><FileText size={32} /></div>
              <h5 className="font-black text-brand-navy mb-2">1. Dodajesz fakturę</h5>
              <p className="text-sm text-slate-400 font-medium">Prześlij plik – system wyciągnie dane.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-50 rounded-[var(--radius-brand-card)] flex items-center justify-center text-slate-400 mb-6"><Scale size={32} /></div>
              <h5 className="font-black text-brand-navy mb-2">2. Obsługa prawna</h5>
              <p className="text-sm text-slate-400 font-medium">Sprawą zajmuje się prawnik.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-50 rounded-[var(--radius-brand-card)] flex items-center justify-center text-slate-400 mb-6"><TrendingUp size={32} /></div>
              <h5 className="font-black text-brand-navy mb-2">3. Monitorujesz postęp</h5>
              <p className="text-sm text-slate-400 font-medium">Śledzisz każdy etap sprawy.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700 max-w-5xl mx-auto space-y-12 pb-24">
      <div className="pt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-brand-navy tracking-tight">Witaj, {String(userName || '')}!</h1>
            <p className="text-slate-500 font-medium">Zarządzaj swoimi wierzytelnościami w jednym miejscu.</p>
          </div>
        </div>

        <DashboardQuickActions 
          onAddInvoiceScan={onAddInvoiceScan}
          onManualEntry={onManualEntry}
          onExcelImport={onExcelImport}
          isEmailVerified={isEmailVerified}
        />

        <div className="mt-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-6">
            <h2 className="text-2xl font-black text-brand-navy tracking-tight">Twoje sprawy w toku</h2>
            
            {/* Tabs */}
            <div className="flex bg-slate-100 p-1.5 rounded-[var(--radius-brand-button)] w-full sm:w-auto">
              <button 
                onClick={() => setActiveTab('NEW')}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-[var(--radius-brand-button)] font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'NEW' ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <PlayCircle size={14} /> Nowe ({counts.NEW})
              </button>
              <button 
                onClick={() => setActiveTab('IN_PROGRESS')}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-[var(--radius-brand-button)] font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'IN_PROGRESS' ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Clock size={14} /> W toku ({counts.IN_PROGRESS})
              </button>
              <button 
                onClick={() => setActiveTab('FINISHED')}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-[var(--radius-brand-button)] font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'FINISHED' ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <CheckCircle2 size={14} /> Zakończone ({counts.FINISHED})
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredDebtors.length > 0 ? (
              filteredDebtors.map((debtor, index) => (
                <CaseCard 
                  key={debtor.caseId} 
                  debtor={debtor} 
                  defaultExpanded={index === 0}
                  isProcessing={isProcessingAction === debtor.caseId || debtor.invoices.some(inv => inv.id === isProcessingAction)}
                  isDownloading={isDownloading}
                  onUpdateStatus={onUpdateStatus}
                  onAddInvoice={onAddInvoiceToDebtor}
                  onDownload={onDownload}
                  onEdit={onEditCase}
                  onEditInvoice={onEditInvoice}
                  onDelete={onDeleteCase}
                  onDeleteInvoice={onDeleteInvoice}
                />
              ))
            ) : (
              <div className="bg-white rounded-[var(--radius-brand-card)] border border-dashed border-slate-200 p-16 text-center">
                <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ListFilter size={32} />
                </div>
                <h3 className="text-lg font-black text-brand-navy mb-2">Brak spraw w tej kategorii</h3>
                <p className="text-slate-400 font-medium max-w-xs mx-auto">Zmień filtr lub dodaj nową sprawę, aby zobaczyć ją na liście.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;