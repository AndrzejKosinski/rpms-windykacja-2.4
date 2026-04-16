import React, { useState } from 'react';
import { 
  Users, Clock, Gavel, Plus, RefreshCw, Check, ChevronDown, ChevronUp, 
  FileText, Download, AlertTriangle, Loader2, Edit3, Trash2, 
  ShieldCheck, Calendar, MessageSquare, ExternalLink,
  Building2, ArrowRight, Scale, Search, TrendingUp
} from 'lucide-react';
import { Debtor } from '../../debtor/model/types';
import { legalStages } from '../model/types';

interface CaseCardProps {
  debtor: Debtor;
  isProcessing: boolean;
  isDownloading: string | null;
  onUpdateStatus: (caseId: string, status: string) => void;
  onAddInvoice: (debtor: Debtor) => void;
  onDownload: (fileUrl: string, invoiceId: string) => void;
  onEdit: (debtor: Debtor) => void;
  onEditInvoice: (debtor: Debtor, invoice: any) => void;
  onDelete: (caseId: string) => void;
  onDeleteInvoice: (caseId: string, invoiceId: string) => void;
  defaultExpanded?: boolean;
}

const CaseCard: React.FC<CaseCardProps> = ({ 
  debtor, isProcessing, isDownloading, onUpdateStatus, 
  onAddInvoice, onDownload, onEdit, onEditInvoice, onDelete, onDeleteInvoice,
  defaultExpanded = false
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [activeTab, setActiveTab] = useState<'summary' | 'history' | 'documents'>('summary');
  
  const currentStageIdx = legalStages.indexOf(debtor.status);
  const safeIdx = currentStageIdx === -1 ? 0 : currentStageIdx;

  // Mapowanie statusów na etapy wizualne użytkownika
  const visualStages = [
    { label: "Analiza", icon: <Search size={14} /> },
    { label: "Wezwanie", icon: <FileText size={14} /> },
    { label: "Negocjacje", icon: <MessageSquare size={14} /> },
    { label: "Sąd", icon: <Scale size={14} /> },
    { label: "Odzyskano", icon: <TrendingUp size={14} /> }
  ];

  // Proste mapowanie indeksów (5 etapów wizualnych vs 5 etapów technicznych)
  const activeVisualIdx = safeIdx;

  const getStatusLabel = () => {
    if (safeIdx === 0) return 'Weryfikacja danych';
    if (safeIdx === 4) return 'Sprawa zakończona';
    return debtor.status;
  };

  const isNewCase = safeIdx === 0;
  const effectivelyExpanded = isNewCase || isExpanded;

  // Helper to format date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '---';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  // Helper to calculate days elapsed
  const getDaysElapsed = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const start = new Date(dateStr);
      if (isNaN(start.getTime())) return null;
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch (e) {
      return null;
    }
  };

  // Find dates from history if available, fallback to direct properties
  const getEventDate = (label: string) => {
    const event = debtor.history?.find(e => 
      e.label.toLowerCase().includes(label.toLowerCase()) || 
      (label === 'przekazano' && e.label.toLowerCase().includes('dodana'))
    );
    return event?.date;
  };

  const transferredAt = getEventDate('przekazano') || debtor.createdAt || debtor.timestamp;
  const demandSentAt = getEventDate('wezwanie') || debtor.demandSentAt;
  const daysSinceDemand = getDaysElapsed(demandSentAt);

  return (
    <div className={`bg-white rounded-[var(--radius-brand-card)] border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group ${isNewCase ? 'border-brand-blue/20 ring-1 ring-brand-blue/5' : 'border-slate-100'}`}>
      {/* Tabular Header Section */}
      <div 
        className={`p-4 lg:p-5 ${isNewCase ? 'cursor-default' : 'cursor-pointer'}`}
        onClick={() => !isNewCase && setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8">
          
          {/* Column 1: Debtor Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0 w-full">
            <div className={`w-12 h-12 rounded-[var(--radius-brand-button)] flex items-center justify-center shrink-0 ${isNewCase ? 'bg-brand-blue/5 text-brand-blue' : 'bg-brand-light-blue text-brand-blue'}`}>
              <Building2 size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className={`text-base font-black text-brand-navy tracking-tight group-hover:text-brand-blue transition-colors ${isNewCase ? '' : 'truncate'}`}>
                {debtor.debtorName}
              </h3>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                <span className="flex items-center gap-1">NIP: <span className="text-slate-600">{debtor.nip || '---'}</span></span>
                {debtor.krs && (
                  <>
                    <span className="w-1 h-1 bg-slate-200 rounded-full hidden sm:block" />
                    <span className="flex items-center gap-1">KRS: <span className="text-slate-600">{debtor.krs}</span></span>
                  </>
                )}
                <span className="w-1 h-1 bg-slate-200 rounded-full hidden sm:block" />
                <span className="text-brand-blue">{debtor.invoices.length} {debtor.invoices.length === 1 ? 'faktura' : 'faktury'}</span>
                <span className="w-1 h-1 bg-slate-200 rounded-full hidden sm:block" />
                <span className="flex items-center gap-1">Dodano: <span className="text-slate-600">{formatDate(debtor.createdAt)}</span></span>
              </div>
            </div>
          </div>

          {/* Column 2: Status Badge */}
          <div className="w-full lg:w-40 flex justify-start lg:justify-center">
            <span className={`px-3 py-1 text-[9px] font-black uppercase rounded-full border whitespace-nowrap ${
              isNewCase ? 'bg-brand-blue/5 text-brand-blue border-brand-blue/20' : 
              safeIdx === 4 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
              'bg-brand-light-blue text-brand-blue border-brand-blue/10'
            }`}>
              {getStatusLabel()}
            </span>
          </div>

          {/* Column 3: Finances */}
          <div className="w-full lg:w-48 flex flex-row lg:flex-col justify-between lg:justify-center items-center lg:items-end gap-1">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest lg:hidden">Zadłużenie:</p>
            <div className="flex items-baseline gap-1.5">
              <p className={`font-black text-brand-navy tracking-tighter ${isNewCase ? 'text-2xl' : 'text-xl'}`}>{debtor.totalAmount}</p>
              <span className="text-[9px] font-black text-slate-300 uppercase">PLN</span>
            </div>
          </div>

          {/* Column 4: Quick Toggle */}
          {!isNewCase && (
            <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
              <button 
                className="p-2.5 bg-slate-50 text-slate-500 rounded-[var(--radius-brand-button)] hover:bg-slate-100 transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest"
              >
                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                {isExpanded ? 'Zwiń' : 'Zarządzaj'}
              </button>
            </div>
          )}
          {isNewCase && (
            <div className="hidden lg:block w-32" /> // Spacer to maintain alignment
          )}
        </div>

        {/* Slim Progress Stepper - Visible only for active cases (not for 'Nowe') */}
        {!isNewCase && (
          <div className="mt-6 pt-4 border-t border-slate-50">
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute top-3.5 left-6 right-6 h-0.5 bg-slate-100 rounded-full hidden md:block">
                <div 
                  className="h-full bg-brand-blue transition-all duration-1000 ease-out rounded-full" 
                  style={{ width: `${(activeVisualIdx / (visualStages.length - 1)) * 100}%` }} 
                />
              </div>
              <div className="flex justify-between items-center relative z-10">
                {visualStages.map((stage, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <div className={`w-7 h-7 rounded-[var(--radius-brand-input)] border-2 border-white shadow-sm flex items-center justify-center transition-all duration-500 ${
                      i <= activeVisualIdx ? 'bg-brand-blue text-white scale-110' : 'bg-slate-100 text-slate-300'
                    }`}>
                      {i < activeVisualIdx ? <Check size={12} strokeWidth={3} /> : stage.icon}
                    </div>
                    <p className={`text-[7px] font-black uppercase tracking-widest ${
                      i <= activeVisualIdx ? 'text-brand-navy' : 'text-slate-300'
                    }`}>
                      {stage.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Expandable Section: Action Center & Invoices */}
      {effectivelyExpanded && (
        <div className={`border-t animate-in slide-in-from-top-2 duration-300 ${isNewCase ? 'bg-brand-light-blue/10 border-brand-blue/10 p-8 lg:p-10' : 'bg-slate-50/30 border-slate-50 p-6 lg:p-8'}`}>
          
          {/* Tabs Navigation (Only for active cases) */}
          {!isNewCase && (
            <div className="flex items-center gap-6 border-b border-slate-200 mb-8">
              <button
                onClick={(e) => { e.stopPropagation(); setActiveTab('summary'); }}
                className={`pb-3 text-[11px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'summary' ? 'border-brand-blue text-brand-navy' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                Podsumowanie
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setActiveTab('history'); }}
                className={`pb-3 text-[11px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'history' ? 'border-brand-blue text-brand-navy' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                Historia ({debtor.history?.length || 0})
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setActiveTab('documents'); }}
                className={`pb-3 text-[11px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'documents' ? 'border-brand-blue text-brand-navy' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                Dokumenty ({debtor.invoices?.length || 0})
              </button>
            </div>
          )}

          {/* SUMMARY TAB OR NEW CASE */}
          {(isNewCase || activeTab === 'summary') && (
            <div className="animate-in fade-in duration-300">
              {/* Timeline & Stats */}
              {!isNewCase && (
                <div className="flex flex-wrap items-center gap-6 mb-8 p-4 bg-white/50 rounded-[var(--radius-brand-button)] border border-slate-100">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Przekazano do windykacji</span>
                    <span className="text-xs font-bold text-brand-navy">{formatDate(transferredAt)}</span>
                  </div>
                  {demandSentAt && (
                    <>
                      <div className="h-8 w-px bg-slate-200 hidden sm:block" />
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Wysłano wezwanie</span>
                        <span className="text-xs font-bold text-brand-navy">{formatDate(demandSentAt)}</span>
                      </div>
                      <div className="h-8 w-px bg-slate-200 hidden sm:block" />
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-[var(--radius-brand-button)] flex items-center justify-center">
                          <Clock size={20} />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Czas obsługi wezwania</span>
                          <span className="text-sm font-black text-brand-navy">{daysSinceDemand} {daysSinceDemand === 1 ? 'dzień' : 'dni'}</span>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {/* Additional Fees from Metadata */}
                  {debtor.metadata?.demandFee && (
                    <>
                      <div className="h-8 w-px bg-slate-200 hidden sm:block" />
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Opłata za wezwanie</span>
                        <span className="text-xs font-bold text-brand-blue">{debtor.metadata.demandFee} PLN</span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Action Center - Large Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {isNewCase && (
                  <>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onUpdateStatus(debtor.caseId, legalStages[1]); }}
                      disabled={isProcessing}
                      className="p-4 bg-brand-navy text-white rounded-[var(--radius-brand-button)] font-black text-[11px] uppercase tracking-widest hover:bg-brand-blue transition-all flex flex-col items-center justify-center gap-3 shadow-lg shadow-brand-navy/10 group/btn"
                    >
                      <div className="w-10 h-10 bg-white/10 rounded-[var(--radius-brand-button)] flex items-center justify-center group-hover/btn:scale-110 transition-transform">
                        {isProcessing ? <RefreshCw className="animate-spin" size={20} /> : <Gavel size={20} />}
                      </div>
                      Uruchom Windykację
                    </button>
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); onAddInvoice(debtor); }}
                      className="p-4 bg-white border border-slate-200 text-brand-navy rounded-[var(--radius-brand-button)] font-black text-[11px] uppercase tracking-widest hover:border-brand-blue hover:text-brand-blue transition-all flex flex-col items-center justify-center gap-3 shadow-sm group/btn"
                    >
                      <div className="w-10 h-10 bg-brand-light-blue text-brand-blue rounded-[var(--radius-brand-button)] flex items-center justify-center group-hover/btn:scale-110 transition-transform">
                        <Plus size={20} />
                      </div>
                      Dodaj Fakturę
                    </button>

                    <button 
                      onClick={(e) => { e.stopPropagation(); onEdit(debtor); }}
                      className="p-4 bg-white border border-slate-200 text-brand-navy rounded-[var(--radius-brand-button)] font-black text-[11px] uppercase tracking-widest hover:border-brand-blue hover:text-brand-blue transition-all flex flex-col items-center justify-center gap-3 shadow-sm group/btn"
                    >
                      <div className="w-10 h-10 bg-slate-50 text-slate-500 rounded-[var(--radius-brand-button)] flex items-center justify-center group-hover/btn:scale-110 transition-transform">
                        <Edit3 size={20} />
                      </div>
                      Edytuj Dane
                    </button>
                  </>
                )}

                {safeIdx === 0 && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(debtor.caseId); }}
                    className="p-4 bg-white border border-red-100 text-red-500 rounded-[var(--radius-brand-button)] font-black text-[11px] uppercase tracking-widest hover:bg-red-50 transition-all flex flex-col items-center justify-center gap-3 shadow-sm group/btn"
                  >
                    <div className="w-10 h-10 bg-red-50 text-red-500 rounded-[var(--radius-brand-button)] flex items-center justify-center group-hover/btn:scale-110 transition-transform">
                      <Trash2 size={20} />
                    </div>
                    Usuń Sprawę
                  </button>
                )}
              </div>

              {/* Latest History Step (Only for summary tab) */}
              {!isNewCase && debtor.history && debtor.history.length > 0 && (
                <div className="mt-8 pt-8 border-t border-slate-100">
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center justify-between gap-2 mb-6">
                    <span className="flex items-center gap-2"><Clock size={14} /> Ostatnia aktywność</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveTab('history'); }}
                      className="text-[10px] font-black text-brand-blue hover:text-brand-navy uppercase tracking-widest transition-colors flex items-center gap-1"
                    >
                      Pełna historia <ArrowRight size={12} />
                    </button>
                  </h4>
                  <div className="space-y-4">
                    {(() => {
                      const lastEvent = [...debtor.history].reverse()[0];
                      return (
                        <div className="flex gap-4 group/item">
                          <div className="flex flex-col items-center">
                            <div className={`w-2.5 h-2.5 rounded-full mt-1.5 border-2 border-white shadow-sm ${
                              lastEvent.type === 'STATUS_CHANGE' ? 'bg-brand-blue' :
                              lastEvent.type === 'FEE_ADDED' ? 'bg-amber-500' :
                              lastEvent.type === 'PAYMENT' ? 'bg-emerald-500' :
                              'bg-slate-300'
                            }`} />
                          </div>
                          <div className="pb-4">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              {new Date(lastEvent.date).toLocaleString('pl-PL', { 
                                day: '2-digit', month: '2-digit', year: 'numeric', 
                                hour: '2-digit', minute: '2-digit' 
                              })}
                            </p>
                            <p className="text-xs font-black text-brand-navy mt-0.5">{lastEvent.label}</p>
                            {lastEvent.value && <p className="text-[10px] font-bold text-slate-500 mt-1">{lastEvent.value}</p>}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* HISTORY TAB */}
          {!isNewCase && activeTab === 'history' && (
            <div className="animate-in fade-in duration-300">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-6">
                <Clock size={14} /> Pełna historia sprawy
              </h4>
              {debtor.history && debtor.history.length > 0 ? (
                <div className="space-y-4">
                  {[...debtor.history].reverse().map((event, idx) => (
                    <div key={idx} className="flex gap-4 group/item">
                      <div className="flex flex-col items-center">
                        <div className={`w-2.5 h-2.5 rounded-full mt-1.5 border-2 border-white shadow-sm ${
                          event.type === 'STATUS_CHANGE' ? 'bg-brand-blue' :
                          event.type === 'FEE_ADDED' ? 'bg-amber-500' :
                          event.type === 'PAYMENT' ? 'bg-emerald-500' :
                          'bg-slate-300'
                        }`} />
                        {idx < debtor.history!.length - 1 && (
                          <div className="w-px flex-1 bg-slate-100 my-1" />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {new Date(event.date).toLocaleString('pl-PL', { 
                            day: '2-digit', month: '2-digit', year: 'numeric', 
                            hour: '2-digit', minute: '2-digit' 
                          })}
                        </p>
                        <p className="text-xs font-black text-brand-navy mt-0.5">{event.label}</p>
                        {event.value && <p className="text-[10px] font-bold text-slate-500 mt-1">{event.value}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">Brak historii sprawy.</p>
              )}
            </div>
          )}

          {/* DOCUMENTS TAB OR NEW CASE */}
          {(isNewCase || activeTab === 'documents') && (
            <div className={`${!isNewCase ? 'animate-in fade-in duration-300' : 'mt-8 pt-8 border-t border-slate-100'}`}>
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <FileText size={14} /> Wykaz dokumentów w sprawie
                </h4>
              </div>
              
              <div className="space-y-4">
                {debtor.invoices.map((inv) => (
                  <div key={inv.id} className="bg-white rounded-[var(--radius-brand-card)] p-6 border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-lg hover:shadow-brand-navy/5 transition-all duration-300 group/inv">
                    <div className="flex items-center gap-5 flex-1 w-full">
                      <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-[var(--radius-brand-button)] flex items-center justify-center group-hover/inv:bg-brand-light-blue group-hover/inv:text-brand-blue transition-colors">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-brand-navy">Faktura nr {inv.invoiceNumber || inv.id}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            <Calendar size={10} /> {inv.dueDate}
                          </p>
                          <div className="h-1 w-1 bg-slate-200 rounded-full" />
                          <p className="text-[10px] font-black text-brand-blue uppercase tracking-widest">{inv.amount}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                      {inv.fileUrl ? (
                        <button 
                          onClick={(e) => { e.stopPropagation(); onDownload(inv.fileUrl, inv.id); }}
                          disabled={isDownloading === inv.id}
                          className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-500 rounded-[var(--radius-brand-button)] font-black text-[10px] uppercase tracking-widest hover:bg-brand-blue hover:text-white transition-all"
                        >
                          {isDownloading === inv.id ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                          Pobierz
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-[var(--radius-brand-button)] font-black text-[10px] uppercase tracking-widest border border-amber-100">
                          <AlertTriangle size={14} /> Brak pliku
                        </div>
                      )}
                      
                      {safeIdx === 0 && (
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); onEditInvoice(debtor, inv); }}
                            className="p-2 text-slate-300 hover:text-brand-blue hover:bg-brand-light-blue rounded-[var(--radius-brand-input)] transition-all"
                            title="Edytuj"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onDeleteInvoice(debtor.caseId, inv.id); }}
                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-[var(--radius-brand-input)] transition-all"
                            title="Usuń"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CaseCard;
