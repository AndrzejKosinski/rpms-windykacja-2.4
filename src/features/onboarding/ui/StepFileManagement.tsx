import React, { useRef, useState, useMemo } from 'react';
import { FileText, ChevronLeft, ArrowRight, HardDrive, Trash2, Plus, HelpCircle, Upload, RefreshCw, ShieldCheck, Clock, CheckCircle2, AlertCircle, Info, Edit3, Eye } from 'lucide-react';
import { OnboardingData, QueueItem } from './types';
import InvoiceDetailsModal from './InvoiceDetailsModal';

interface StepFileManagementProps {
  fileQueue: QueueItem[];
  onRemoveFile: (id: string) => void;
  onUpdateFile: (id: string, updatedData: any) => void;
  onAddFiles: (files: FileList | null) => void;
  onContinue: () => void;
  onBack: () => void;
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
}

const StepFileManagement: React.FC<StepFileManagementProps> = ({ fileQueue, onRemoveFile, onUpdateFile, onAddFiles, onContinue, onBack, data, setData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedItem, setSelectedItem] = useState<QueueItem | null>(null);

  const totalSize = fileQueue.reduce((acc, item) => acc + item.file.size, 0);
  const maxSize = 25 * 1024 * 1024; // 25 MB
  const isSizeExceeded = totalSize > maxSize;
  
  const completedCount = fileQueue.filter(it => it.status === 'completed').length;
  const isProcessingAny = fileQueue.some(it => it.status === 'processing' || it.status === 'queued');

  const summary = useMemo(() => {
    let totalAmount = 0;
    let currency = 'PLN'; // Defaulting to PLN for mixed currencies or if none specified
    
    fileQueue.filter(it => it.status === 'completed' && it.extractedData).forEach(item => {
      const amountStr = item.extractedData.amount;
      if (amountStr) {
        const amount = parseFloat(amountStr.replace(',', '.'));
        if (!isNaN(amount)) {
          totalAmount += amount;
        }
      }
      if (item.extractedData.currency) {
        currency = item.extractedData.currency;
      }
    });

    return {
      count: completedCount,
      totalAmount: totalAmount.toFixed(2),
      currency
    };
  }, [fileQueue, completedCount]);

  const handleSaveInvoiceDetails = (id: string, updatedData: any) => {
    onUpdateFile(id, updatedData);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onAddFiles(e.dataTransfer.files);
    }
  };

  const getStatusIcon = (status: QueueItem['status']) => {
    switch (status) {
      case 'processing': return <RefreshCw size={16} className="animate-spin text-brand-blue" />;
      case 'queued': return <Clock size={16} className="text-slate-300" />;
      case 'completed': return <CheckCircle2 size={16} className="text-green-500" />;
      case 'error': return <AlertCircle size={16} className="text-red-500" />;
      default: return <FileText size={16} className="text-slate-400" />;
    }
  };

  const liquidFlowStyle = {
    backgroundColor: '#ffffff',
    backgroundImage: `
      url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' viewBox='0 0 1000 1000' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'%3E%3Cpath d='M-100 300 C 200 150, 400 500, 1100 200' fill='none' stroke='%23137fec' stroke-opacity='0.08' stroke-width='1.5'/%3E%3Cpath d='M-100 500 C 300 300, 600 700, 1100 400' fill='none' stroke='%23137fec' stroke-opacity='0.05' stroke-width='1.2'/%3E%3Cpath d='M-100 150 C 400 400, 700 100, 1100 300' fill='none' stroke='%23137fec' stroke-opacity='0.06' stroke-width='1'/%3E%3C/svg%3E")
    `,
    backgroundSize: '100% 100%',
    backgroundAttachment: 'local'
  };

  return (
    <div 
      className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col h-full -mx-6 md:-mx-12 -mt-8 md:-mt-10 -mb-10 px-6 md:px-12 pt-8 md:pt-10"
      style={liquidFlowStyle}
    >
      <div className="text-left mb-5 md:mb-6 relative z-10 shrink-0">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-brand-blue transition-colors group mb-2 md:mb-3 outline-none focus:ring-2 focus:ring-brand-blue rounded-[var(--radius-brand-input)] py-2 px-3 -ml-3"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Wróć do wyboru metody</span>
        </button>
        <h2 className="text-3xl md:text-4xl font-black text-brand-navy mb-1 tracking-tight leading-tight">
          Potwierdź załączone <span className="text-brand-blue">faktury</span>
        </h2>
        <div className="flex items-center gap-2 group/subtitle w-fit cursor-help">
          <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed">
            Oryginały załączonych dokumentów trafią do kancelarii jako dowód
          </p>
          <div className="relative flex items-center">
            <Info size={16} className="text-slate-300 group-hover/subtitle:text-brand-blue transition-colors" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-brand-navy text-white text-[10px] font-bold rounded-[var(--radius-brand-button)] opacity-0 group-hover/subtitle:opacity-100 transition-all pointer-events-none shadow-2xl z-[100] leading-relaxed text-center">
              System automatycznie odczytuje dane z faktur dla Twojej wygody, jednak to oryginalne pliki zostaną przekazane prawnikom jako oficjalny dowód w procesie windykacji.
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-brand-navy"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-4 relative z-10 min-h-0 flex-1">
        <div className="lg:col-span-7 flex flex-col gap-3 h-full min-h-0">
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`flex flex-col bg-slate-50/50 rounded-[var(--radius-brand-card)] border-2 p-5 flex-1 min-h-[180px] transition-all duration-300 ${
              dragActive ? 'border-brand-blue bg-brand-light-blue/50' : 'border-slate-100'
            }`}
          >
          <div className="flex items-center justify-between mb-3 shrink-0">
            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
              Dokumenty w weryfikacji ({fileQueue.length})
            </h4>
            {isProcessingAny && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-brand-blue rounded-full animate-ping" />
                <span className="text-[8px] font-black text-brand-blue uppercase tracking-widest animate-pulse">Przetwarzanie...</span>
              </div>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto pr-1 no-scrollbar min-h-0">
            {fileQueue.length === 1 ? (
              <div className="h-full pb-2">
                {(() => {
                  const item = fileQueue[0];
                  return (
                    <div 
                      key={item.id}
                      className={`h-full flex flex-col bg-white rounded-[var(--radius-brand-button)] border ${item.isDuplicate ? 'border-amber-400 bg-amber-50/30' : 'border-slate-100'} shadow-sm p-5 relative overflow-hidden animate-in fade-in zoom-in-95`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`shrink-0 flex items-center justify-center rounded-2xl w-12 h-12 ${item.isDuplicate ? 'bg-amber-100 text-amber-600' : 'bg-slate-50'}`}>
                            {getStatusIcon(item.status)}
                          </div>
                          <div className="overflow-hidden">
                            <p className="font-black text-brand-navy text-sm truncate max-w-[180px] md:max-w-[220px] mb-1">
                              {item.file.name}
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">
                                {formatSize(item.file.size)}
                              </p>
                              {item.status === 'completed' && (
                                <span className="text-[9px] font-black text-green-500 uppercase tracking-tighter bg-green-50 px-2 py-0.5 rounded-full">Zweryfikowano</span>
                              )}
                              {item.status === 'error' && !item.isDuplicate && <span className="text-[9px] font-black text-red-500 uppercase tracking-tighter bg-red-50 px-2 py-0.5 rounded-full">{item.error}</span>}
                              {item.isDuplicate && <span className="text-[9px] font-black text-amber-600 uppercase tracking-tighter bg-amber-50 px-2 py-0.5 rounded-full">{item.error}</span>}
                              {item.status === 'queued' && <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter bg-slate-100 px-2 py-0.5 rounded-full">W kolejce</span>}
                              {item.status === 'processing' && <span className="text-[9px] font-black text-brand-blue uppercase tracking-tighter bg-brand-light-blue/30 px-2 py-0.5 rounded-full">Przetwarzanie...</span>}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                          {item.status === 'completed' && (
                            <button 
                              onClick={() => setSelectedItem(item)}
                              className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-brand-blue bg-brand-light-blue/20 hover:bg-brand-blue hover:text-white rounded-[var(--radius-brand-input)] transition-all"
                            >
                              <Eye size={14} /> <span className="hidden sm:inline">Podgląd</span>
                            </button>
                          )}
                          <button 
                            onClick={(e) => { e.stopPropagation(); onRemoveFile(item.id); }}
                            className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-[var(--radius-brand-input)] transition-all"
                          >
                            <Trash2 size={14} /> <span className="hidden sm:inline">Usuń</span>
                          </button>
                        </div>
                      </div>

                      {item.status === 'completed' && item.extractedData ? (
                        <div className="grid grid-cols-3 gap-3 mt-auto">
                          <div className="bg-slate-50 rounded-[var(--radius-brand-input)] p-3 border border-slate-100 flex flex-col justify-center">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Kwota brutto</p>
                            <p className="text-lg font-black text-brand-navy truncate">
                              {item.extractedData.amount} <span className="text-xs text-slate-500">{item.extractedData.currency || 'PLN'}</span>
                            </p>
                          </div>
                          <div className="bg-slate-50 rounded-[var(--radius-brand-input)] p-3 border border-slate-100 flex flex-col justify-center">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">NIP Dłużnika</p>
                            <p className="text-lg font-black text-brand-navy truncate">
                              {item.extractedData.debtorNip || item.extractedData.nip || '---'}
                            </p>
                          </div>
                          <div className="bg-slate-50 rounded-[var(--radius-brand-input)] p-3 border border-slate-100 flex flex-col justify-center">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Termin płatności</p>
                            <p className="text-lg font-black text-brand-navy truncate">
                              {item.extractedData.dueDate || '---'}
                            </p>
                          </div>
                        </div>
                      ) : item.status === 'processing' ? (
                        <div className="flex-1 flex flex-col items-center justify-center mt-2 bg-slate-50 rounded-[var(--radius-brand-input)] border border-slate-100">
                           <RefreshCw size={24} className="animate-spin text-brand-blue mb-3" />
                           <p className="text-[10px] font-black text-brand-navy uppercase tracking-widest">Analiza dokumentu...</p>
                           <p className="text-[9px] font-bold text-slate-400 mt-1">Trwa odczytywanie danych z faktury</p>
                        </div>
                      ) : (
                        <div className="flex-1 mt-2 bg-slate-50 rounded-[var(--radius-brand-input)] border border-slate-100 flex items-center justify-center">
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Oczekiwanie na przetworzenie...</p>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            ) : fileQueue.length > 1 ? (
              <div className="grid grid-cols-1 gap-2 pb-2">
                {fileQueue.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => item.status === 'completed' && setSelectedItem(item)}
                    className={`bg-white rounded-[var(--radius-brand-button)] border ${item.isDuplicate ? 'border-amber-400 bg-amber-50/30' : 'border-slate-100'} shadow-sm flex items-center p-3.5 group ${item.status === 'completed' ? 'hover:border-brand-blue/50 cursor-pointer' : ''} transition-all animate-in fade-in slide-in-from-bottom-1 relative overflow-hidden`}
                  >
                    <div className={`shrink-0 flex items-center justify-center rounded-[var(--radius-brand-button)] w-10 h-10 mr-3 ${item.isDuplicate ? 'bg-amber-100 text-amber-600' : 'bg-slate-50'}`}>
                      {getStatusIcon(item.status)}
                    </div>
                    
                    <div className="overflow-hidden w-full">
                      <p className="font-black text-brand-navy text-[11px] truncate mb-0">
                        {item.file.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-400 uppercase tracking-widest text-[8px]">
                          {formatSize(item.file.size)}
                        </p>
                        {item.status === 'completed' && (
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] font-black text-green-500 uppercase tracking-tighter">Zweryfikowano</span>
                            {item.extractedData && (
                              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 border-l border-slate-200 pl-2">
                                <span>{item.extractedData.amount} {item.extractedData.currency || 'PLN'}</span>
                                <span className="text-slate-300">•</span>
                                <span>NIP: {item.extractedData.debtorNip || item.extractedData.nip || '---'}</span>
                              </span>
                            )}
                          </div>
                        )}
                        {item.status === 'error' && !item.isDuplicate && <span className="text-[8px] font-black text-red-500 uppercase tracking-tighter">{item.error}</span>}
                        {item.isDuplicate && <span className="text-[8px] font-black text-amber-600 uppercase tracking-tighter">{item.error}</span>}
                        {item.status === 'queued' && <span className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">W kolejce</span>}
                      </div>
                    </div>

                    {item.status === 'completed' && (
                      <button 
                        className="ml-2 p-1.5 text-brand-blue/50 hover:text-brand-blue hover:bg-brand-blue/10 rounded-[var(--radius-brand-input)] transition-all opacity-0 group-hover:opacity-100"
                        title="Podgląd"
                      >
                        <Eye size={14} />
                      </button>
                    )}

                    <button 
                      onClick={(e) => { e.stopPropagation(); onRemoveFile(item.id); }}
                      className="ml-2 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-[var(--radius-brand-input)] transition-all opacity-0 group-hover:opacity-100"
                      title="Usuń dokument"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-[var(--radius-brand-button)] bg-white/50">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-3">
                  <Upload size={24} />
                </div>
                <p className="text-sm font-black text-brand-navy mb-1 uppercase tracking-tight">Lista pusta</p>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Dodaj dokumenty po prawej</p>
              </div>
            )}
          </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col h-full min-h-[180px]">
          <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Dodaj dokumenty</h4>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className={`flex-1 border-2 border-dashed rounded-[var(--radius-brand-card)] flex flex-col items-center justify-center gap-3 transition-all group border-slate-200 bg-white/50 hover:bg-brand-light-blue/10 hover:border-brand-blue hover:border-solid shadow-sm hover:shadow-lg hover:-translate-y-0.5`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all bg-brand-light-blue/30 text-brand-blue group-hover:bg-brand-blue group-hover:text-white shadow-sm`}>
              <Plus size={24} strokeWidth={3} />
            </div>
            <div className="text-center px-4">
              <span className="text-[11px] font-black text-brand-blue uppercase tracking-[0.2em] block mb-1">Dodaj kolejną fakturę</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-brand-navy/60 transition-colors">PDF, JPG, PNG do 5MB</span>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={(e) => { onAddFiles(e.target.files); e.target.value = ''; }} 
              className="hidden" 
              accept=".pdf,image/*" 
              multiple 
            />
          </button>
        </div>
      </div>

      <div className="mt-auto pt-6 pb-2 border-t border-slate-100 bg-white relative z-10 shrink-0">
        
        {/* Summary Section */}
        {summary.count > 0 && (
          <div className="mb-6 flex items-center justify-between bg-slate-50 rounded-[var(--radius-brand-button)] p-4 border border-slate-100">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Podsumowanie</p>
              <p className="text-sm font-black text-brand-navy">
                Do windykacji: <span className="text-brand-blue">{summary.count} {summary.count === 1 ? 'dokument' : (summary.count > 1 && summary.count < 5 ? 'dokumenty' : 'dokumentów')}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Łączna kwota</p>
              <p className="text-lg font-black text-brand-navy">
                {summary.totalAmount} <span className="text-sm text-slate-500">{summary.currency}</span>
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 px-1">
          <div className="flex items-center gap-2 group/info relative cursor-help">
            <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.1em] text-brand-navy leading-tight">
              Czy dłużnik kwestionował wykonanie usługi / towar?
            </p>
            <div className="relative">
              <HelpCircle size={14} className="text-slate-300 hover:text-brand-blue transition-colors" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-brand-navy text-white text-[10px] font-bold rounded-[var(--radius-brand-button)] opacity-0 group-hover/info:opacity-100 transition-all pointer-events-none shadow-2xl z-[100] leading-relaxed">
                Informacja o reklamacjach dłużnika pozwala nam na dobór właściwej strategii procesowej.
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-brand-navy"></div>
              </div>
            </div>
          </div>
          
          <div className="flex bg-slate-100 p-1.5 rounded-[var(--radius-brand-button)] border-2 border-transparent transition-all w-full md:w-48 h-11 items-stretch">
            <button 
              type="button"
              onClick={() => setData(prev => ({...prev, isContested: 'NO'}))}
              className={`flex-1 rounded-[var(--radius-brand-input)] font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center ${
                data.isContested === 'NO' 
                ? 'bg-white text-brand-blue shadow-md ring-1 ring-brand-blue' 
                : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Nie
            </button>
            <button 
              type="button"
              onClick={() => setData(prev => ({...prev, isContested: 'YES'}))}
              className={`flex-1 rounded-[var(--radius-brand-input)] font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center ${
                data.isContested === 'YES' 
                ? 'bg-white text-amber-700 shadow-md ring-1 ring-amber-700' 
                : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Tak
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-[var(--radius-brand-button)] flex items-center justify-center shadow-inner ${isSizeExceeded ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400'}`}>
              <HardDrive size={18} />
            </div>
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Weryfikacja pojemności</p>
              <p className={`text-xs font-black ${isSizeExceeded ? 'text-red-600' : 'text-brand-navy'}`}>
                {formatSize(totalSize)} <span className="text-slate-300 font-bold ml-0.5">/ 25 MB</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full md:w-[440px]">
            <button 
              onClick={onContinue}
              disabled={isSizeExceeded || fileQueue.length === 0 || completedCount === 0}
              className="w-full py-4 bg-brand-blue text-white rounded-[var(--radius-brand-button)] font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-blue/20 hover:bg-brand-navy transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 group"
            >
              {isProcessingAny ? (
                <>Weryfikacja dokumentów... <RefreshCw size={16} className="animate-spin" /></>
              ) : (
                <>Dalej: Dane kontaktowe <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
            {isProcessingAny && (
              <p className="text-[9px] font-black text-brand-blue uppercase tracking-widest text-center animate-pulse flex items-center justify-center gap-2">
                <ShieldCheck size={12} /> Wczytywanie i weryfikacja plików ({completedCount}/{fileQueue.length})...
              </p>
            )}
          </div>
        </div>
      </div>

      <InvoiceDetailsModal 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
        item={selectedItem} 
        onSave={handleSaveInvoiceDetails} 
      />
    </div>
  );
};

export default StepFileManagement;
