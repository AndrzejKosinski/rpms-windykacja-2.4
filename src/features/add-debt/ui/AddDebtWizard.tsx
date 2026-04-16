import React, { useRef, useState } from 'react';
import { X, Upload, RefreshCw, FileText, Check, Search, Mail, MapPin, Calendar, Building2, FileSignature, ChevronLeft, ShieldCheck, ArrowRight } from 'lucide-react';
import { ExtractedDebtData } from '../../../entities/invoice/model/types';
import { FormLabel } from '../../../shared/ui/forms/FormLabel';
import { FormButton } from '../../../shared/ui/forms/FormButton';

interface AddDebtWizardProps {
  step: number;
  isAnalyzing: boolean;
  isSyncing: boolean;
  extractedData: ExtractedDebtData | null;
  isEditMode?: boolean;
  editType?: 'DEBTOR' | 'INVOICE';
  onClose: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFinalize: () => void;
  onUpdateData?: (data: ExtractedDebtData) => void;
  setStep: (step: number) => void;
}

const AddDebtWizard: React.FC<AddDebtWizardProps> = ({ 
  step, isAnalyzing, isSyncing, extractedData, isEditMode, editType, 
  onClose, onFileUpload, onFinalize, onUpdateData, setStep 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFetchingNip, setIsFetchingNip] = useState(false);
  const [showCorrespondence, setShowCorrespondence] = useState(!!extractedData?.corrStreet);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showAddressPanel, setShowAddressPanel] = useState(false);
  const [nipError, setNipError] = useState<string | null>(null);

  const formatAmountDisplay = (val: string) => {
    let clean = val.replace(/[^\d,.]/g, '').replace('.', ',');
    if (!clean) return "";
    const parts = clean.split(',');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.slice(0, 2).join(',');
  };

  const formatNIPDisplay = (val: string) => {
    let clean = val.replace(/\D/g, '').substring(0, 10);
    let formatted = "";
    if (clean.length > 0) formatted += clean.substring(0, 3);
    if (clean.length > 3) formatted += "-" + clean.substring(3, 6);
    if (clean.length > 6) formatted += "-" + clean.substring(6, 8);
    if (clean.length > 8) formatted += "-" + clean.substring(8, 10);
    return formatted || val;
  };

  const handleFieldChange = (field: keyof ExtractedDebtData, value: any) => {
    if (onUpdateData && extractedData) {
      onUpdateData({ ...extractedData, [field]: value });
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFieldChange('amount', formatAmountDisplay(e.target.value));
  };

  const handleDebtorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const cleanVal = val.replace(/\D/g, '');
    const isNipFormat = /^\d/.test(val.trim().replace(/-/g, ''));
    
    if (isNipFormat) {
      const isNewNip = cleanVal !== extractedData?.nip;
      if (onUpdateData && extractedData) {
        onUpdateData({ 
          ...extractedData, 
          nip: cleanVal,
          debtorName: isNewNip ? '' : extractedData.debtorName
        });
      }
      if (isNewNip && cleanVal.length === 10) {
        fetchNipDataFromMF(cleanVal);
      }
    } else {
      if (onUpdateData && extractedData) {
        onUpdateData({ 
          ...extractedData, 
          debtorName: val, 
          nip: '' 
        });
      }
    }
  };

  const handleFinalizeWithValidation = () => {
    const isFormValid = extractedData?.amount && extractedData?.dueDate && extractedData?.debtorName;
    if (isFormValid) {
      setShowErrors(false);
      onFinalize();
    } else {
      setShowErrors(true);
      setIsShaking(true);
      if (!extractedData?.debtorName && extractedData?.nip) {
        setShowAddressPanel(true);
      }
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const fetchNipDataFromMF = async (nipToFetch?: string) => {
    const rawNip = (typeof nipToFetch === 'string' ? nipToFetch : String(extractedData?.nip || '')).replace(/\D/g, '');
    if (rawNip.length !== 10) return;
    setIsFetchingNip(true);
    setNipError(null);
    try {
      const response = await fetch(`/api/nip?nip=${rawNip}`);
      const result = await response.json();
      if (result.result?.subject && onUpdateData && extractedData) {
        const s = result.result.subject;
        const fullAddr = s.workingAddress || s.residenceAddress || '';
        onUpdateData({
          ...extractedData,
          debtorName: s.name || extractedData.debtorName,
          street: fullAddr.split(',')[0] || '',
          city: fullAddr.split(',').pop()?.trim().replace(/^\d{2}-\d{3}\s/, '') || '',
          zipCode: fullAddr.match(/\d{2}-\d{3}/)?.[0] || '',
          nip: rawNip,
          krs: s.krs || ''
        });
        setShowAddressPanel(true);
      } else {
        setShowAddressPanel(true);
        setNipError("Brak danych w rejestrze VAT. Prosimy o ręczne uzupełnienie adresu.");
      }
    } catch (err) { 
      console.error("MF Error:", err); 
      setShowAddressPanel(true);
      setNipError("Błąd połączenia z bazą MF. Prosimy o ręczne uzupełnienie adresu.");
    }
    finally { setIsFetchingNip(false); }
  };

  const isDebtorOnly = isEditMode && editType === 'DEBTOR';
  const isInvoiceOnly = isEditMode && editType === 'INVOICE';
  
  // Rozróżnienie ścieżek dla kroku 2 (Weryfikacja)
  const isScanVerification = !isEditMode && step === 2 && extractedData?.invoiceNumber !== "";
  const isManualEntry = !isEditMode && step === 2 && extractedData?.invoiceNumber === "";

  const getCleanAmount = (amount?: string) => {
    if (!amount) return '';
    return amount.replace(/\s*(PLN|EUR)$/i, '');
  };

  const inputContainerBase = `relative group border transition-all duration-200 rounded-[var(--radius-brand-button)] overflow-hidden h-14 flex items-center bg-slate-50 hover:border-slate-300`;
  const getInputClasses = (fieldId: string) => `${inputContainerBase} ${focusedField === fieldId ? 'border-brand-blue bg-white ring-2 ring-brand-blue/5' : 'border-slate-200'}`;
  const inputInnerStyle = `w-full h-full pl-5 pr-4 bg-transparent outline-none font-bold text-sm text-brand-navy placeholder:text-slate-300`;

  const liquidFlowStyle = {
    backgroundColor: '#ffffff',
    backgroundImage: `
      url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' viewBox='0 0 1000 1000' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'%3E%3Cpath d='M-100 300 C 200 150, 400 500, 1100 200' fill='none' stroke='%23137fec' stroke-opacity='0.08' stroke-width='1.5'/%3E%3Cpath d='M-100 500 C 300 300, 600 700, 1100 400' fill='none' stroke='%23137fec' stroke-opacity='0.05' stroke-width='1.2'/%3E%3Cpath d='M-100 150 C 400 400, 700 100, 1100 300' fill='none' stroke='%23137fec' stroke-opacity='0.06' stroke-width='1'/%3E%3C/svg%3E"),
      radial-gradient(at 0% 0%, rgba(19, 127, 236, 0.05) 0px, transparent 50%),
      radial-gradient(at 100% 100%, rgba(19, 127, 236, 0.08) 0px, transparent 50%)
    `,
    backgroundSize: '100% 100%',
    backgroundAttachment: 'local'
  };

  return (
    <div className="fixed inset-0 z-[150] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className={`w-full bg-white rounded-[var(--radius-brand-card)] shadow-2xl border border-slate-100 flex flex-col animate-in zoom-in-95 duration-300 overflow-hidden ${
        isScanVerification || isDebtorOnly ? 'max-w-4xl' : isManualEntry ? 'max-w-3xl' : 'max-w-2xl'
      }`}>
        {step !== 3 && !isManualEntry && (
          <div className="px-8 pt-8 pb-0 flex items-center justify-between shrink-0">
            <h3 className="text-lg font-black text-brand-navy italic tracking-tight leading-none">
              {isDebtorOnly ? 'Edycja danych podmiotu' : 
               isInvoiceOnly ? 'Dane faktury' : 
               isScanVerification ? 'Dane faktury' : 
               step === 0 ? 'Nowe Zlecenie' :
               step === 1 ? 'Dodaj fakturę' :
               'Dane faktury'}
            </h3>
            <button 
              onClick={() => !isSyncing && onClose()} 
              className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-[var(--radius-brand-button)] transition-all group"
              title="Zamknij i anuluj"
            >
              <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        )}
        
        <div className={`overflow-y-auto no-scrollbar max-h-[85vh] ${step === 0 ? 'rounded-b-[var(--radius-brand-card)]' : ''} ${isManualEntry ? 'p-0' : 'p-8'}`} style={step === 0 ? liquidFlowStyle : {}}>
          {step === 0 ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col py-4">
              <div className="text-center mb-10 relative z-10">
                <h1 className="text-3xl md:text-5xl font-black text-brand-navy mb-6 tracking-tight leading-[1.2]">
                  Odzyskaj pieniądze. <br /> <span className="text-brand-blue">Wybierz sposób zgłoszenia.</span>
                </h1>
                <p className="text-slate-500 max-w-xl mx-auto text-sm md:text-lg font-medium leading-relaxed">
                  Przekaż sprawę tak, jak Ci wygodnie. Twoim zgłoszeniem <br className="hidden md:block" /> zajmie się bezpośrednio zespół prawny RPMS.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full relative z-10 pb-10">
                {/* Karta 1: Ręcznie */}
                <div 
                  onClick={() => { if (onUpdateData) onUpdateData({ debtorName: '', nip: '', krs: '', street: '', zipCode: '', city: '', address: '', corrStreet: '', corrZipCode: '', corrCity: '', correspondenceAddress: '', isForeign: false, invoiceNumber: '', issueDate: '', dueDate: '', amount: '', netAmount: '', vatAmount: '', currency: 'PLN', description: '', isContested: 'NO' }); setStep(2); }}
                  className="group flex flex-col items-center p-8 bg-white border-2 border-brand-blue/30 rounded-[var(--radius-brand-card)] hover:shadow-xl hover:border-brand-blue hover:bg-brand-light-blue/50 hover:-translate-y-2 transition-all duration-500 cursor-pointer shadow-[0_10px_30px_-10px_rgba(19,127,236,0.1)]"
                >
                  <div className="w-14 h-14 rounded-[var(--radius-brand-button)] bg-brand-light-blue flex items-center justify-center text-brand-blue mb-4 shadow-sm group-hover:bg-brand-blue group-hover:text-white group-hover:scale-110 group-hover:shadow-lg transition-all duration-500">
                    <FileSignature size={28} />
                  </div>
                  <h3 className="text-xl font-black text-brand-navy mb-4 text-center leading-tight">Ręczne zgłoszenie wierzytelności</h3>
                  <p className="text-slate-600 text-sm text-center mb-8 flex-grow leading-relaxed font-medium px-2">
                    Podaj podstawowe informacje o dłużniku i kwocie. Wypełnienie formularza zajmie Ci nie więcej niż 60 sekund.
                  </p>
                  <button className="w-full py-4 bg-white border-2 border-brand-blue/30 text-brand-blue font-black text-xs uppercase tracking-[0.15em] rounded-[var(--radius-brand-button)] transition-all group-hover:bg-brand-navy group-hover:text-white group-hover:border-brand-navy group-hover:shadow-lg group-hover:shadow-brand-navy/20">
                    Wypełnij zgłoszenie
                  </button>
                </div>

                {/* Karta 2: Faktura */}
                <div 
                  className="group relative flex flex-col items-center p-8 bg-white border-2 border-brand-blue/30 rounded-[var(--radius-brand-card)] transition-all duration-500 cursor-pointer shadow-[0_10px_30px_-10px_rgba(19,127,236,0.15)] hover:shadow-xl hover:border-brand-blue hover:bg-brand-light-blue/50 hover:-translate-y-2"
                  onClick={() => setStep(1)}
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-brand-blue text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg group-hover:scale-110 transition-transform whitespace-nowrap">
                    NAJSZYBSZA DROGA
                  </div>
                  <div className="w-14 h-14 rounded-[var(--radius-brand-button)] bg-brand-light-blue text-brand-blue flex items-center justify-center mb-4 transition-all duration-500 group-hover:bg-brand-blue group-hover:text-white group-hover:scale-110 group-hover:shadow-lg">
                    <Upload size={28} />
                  </div>
                  <h3 className="text-xl font-black text-brand-navy mb-4 text-center leading-tight">Odzyskaj z faktury</h3>
                  <p className="text-slate-600 text-sm text-center mb-8 flex-grow leading-relaxed font-medium">
                    Wskaż fakturę oraz swoje dane kontaktowe. Nasi prawnicy zweryfikują dokument i przygotują wezwanie.
                  </p>
                  <button className="w-full py-4 bg-brand-blue text-white font-black text-xs uppercase tracking-[0.15em] rounded-[var(--radius-brand-button)] transition-all shadow-lg shadow-brand-blue/10 group-hover:bg-brand-navy group-hover:shadow-brand-navy/20">
                    DODAJ PLIK FAKTURY
                  </button>
                </div>
              </div>
            </div>
          ) : step === 1 ? (
                <div className="animate-in fade-in duration-500">
                  <div className="text-center py-6">
                    {isAnalyzing ? (
                      <div className="animate-pulse">
                        <div className="relative w-20 h-20 mx-auto mb-6">
                          <RefreshCw size={48} className="text-brand-blue animate-spin" />
                        </div>
                        <h3 className="text-xl font-black text-brand-navy italic mb-2">Trwa analiza dokumentu...</h3>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Wykorzystujemy zaawansowane modele AI do ekstrakcji danych</p>
                      </div>
                    ) : (
                      <div className="max-w-xl mx-auto w-full">
                        <input type="file" ref={fileInputRef} onChange={onFileUpload} className="hidden" accept=".pdf,image/*" />
                        <div 
                          onClick={() => fileInputRef.current?.click()} 
                          className="group border-4 border-dashed border-slate-100 rounded-[var(--radius-brand-card)] py-10 hover:bg-slate-50 hover:border-brand-blue/30 cursor-pointer transition-all duration-500 relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="relative z-10">
                            <div className="w-14 h-14 bg-brand-light-blue text-brand-blue rounded-[var(--radius-brand-button)] flex items-center justify-center mb-4 mx-auto group-hover:scale-110 group-hover:bg-brand-blue group-hover:text-white transition-all duration-500 shadow-sm">
                              <Upload size={28} />
                            </div>
                            <p className="text-lg font-black text-brand-navy uppercase tracking-tighter mb-1">Wybierz plik faktury</p>
                            <p className="text-slate-400 text-xs font-medium">Przeciągnij i upuść plik PDF lub zdjęcie tutaj</p>
                            <div className="mt-4 flex justify-center gap-2">
                              <div className="px-2 py-1 bg-white rounded-[var(--radius-brand-input)] border border-slate-100 text-[8px] font-black text-slate-400 uppercase tracking-widest shadow-sm">PDF</div>
                              <div className="px-2 py-1 bg-white rounded-[var(--radius-brand-input)] border border-slate-100 text-[8px] font-black text-slate-400 uppercase tracking-widest shadow-sm">JPG / PNG</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {!isAnalyzing && (
                    <div className="pt-6 flex items-center justify-start border-t border-slate-50 mt-6">
                      <button 
                        onClick={onClose} 
                        className="px-6 py-3 bg-slate-100 text-brand-navy rounded-[var(--radius-brand-button)] font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                      >
                        Anuluj
                      </button>
                    </div>
                  )}
                </div>
              ) : step === 2 ? (
                <div className="animate-in fade-in duration-500">
                  <div className="space-y-4">
                    {isDebtorOnly ? (
                      /* WIDOK EDYCJI DANYCH PODMIOTU */
                      <div className="space-y-4">
                        <div>
                          <FormLabel className="text-slate-400">Pełna nazwa firmy</FormLabel>
                          <div className={getInputClasses('name')}>
                            <input 
                              type="text"
                              value={extractedData?.debtorName || ''} 
                              onChange={(e) => handleFieldChange('debtorName', e.target.value)} 
                              onFocus={() => setFocusedField('name')} 
                              onBlur={() => setFocusedField(null)} 
                              className={inputInnerStyle} 
                              placeholder="Nazwa dłużnika..."
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <FormLabel className="text-slate-400">NIP</FormLabel>
                            <div className={getInputClasses('nip')}>
                              <input type="text" value={extractedData?.nip || ''} onChange={(e) => handleFieldChange('nip', e.target.value)} onFocus={() => setFocusedField('nip')} onBlur={() => setFocusedField(null)} className={inputInnerStyle} />
                              <button onClick={() => fetchNipDataFromMF()} className="absolute right-2 p-2 text-brand-blue hover:bg-slate-100 rounded-[var(--radius-brand-input)] transition-colors">{isFetchingNip ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}</button>
                            </div>
                          </div>
                          <div>
                            <FormLabel className="text-slate-400">KRS (Opcjonalnie)</FormLabel>
                            <div className={getInputClasses('krs')}>
                              <input type="text" value={extractedData?.krs || ''} onChange={(e) => handleFieldChange('krs', e.target.value)} onFocus={() => setFocusedField('krs')} onBlur={() => setFocusedField(null)} className={inputInnerStyle} />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-50">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 mb-1">
                              <MapPin size={12} className="text-brand-blue" />
                              <h4 className="text-[8px] font-black text-brand-navy uppercase tracking-[0.2em]">Adres Siedziby</h4>
                            </div>
                            <div>
                              <FormLabel className="text-slate-400">Ulica i nr</FormLabel>
                              <div className={getInputClasses('street')}>
                                <input type="text" value={extractedData?.street || ''} onChange={(e) => handleFieldChange('street', e.target.value)} onFocus={() => setFocusedField('street')} onBlur={() => setFocusedField(null)} className={inputInnerStyle} />
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="col-span-1">
                                <FormLabel className="text-slate-400">Kod</FormLabel>
                                <div className={getInputClasses('zip')}>
                                  <input type="text" value={extractedData?.zipCode || ''} onChange={(e) => handleFieldChange('zipCode', e.target.value)} onFocus={() => setFocusedField('zip')} onBlur={() => setFocusedField(null)} className={`${inputInnerStyle} text-center`} placeholder="00-000" />
                                </div>
                              </div>
                              <div className="col-span-2">
                                <FormLabel className="text-slate-400">Miejscowość</FormLabel>
                                <div className={getInputClasses('city')}>
                                  <input type="text" value={extractedData?.city || ''} onChange={(e) => handleFieldChange('city', e.target.value)} onFocus={() => setFocusedField('city')} onBlur={() => setFocusedField(null)} className={inputInnerStyle} />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Mail size={12} className="text-slate-400" />
                              <h4 className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Adres korespondencyjny</h4>
                            </div>
                            <div>
                              <FormLabel className="text-slate-400">Ulica i nr</FormLabel>
                              <div className={getInputClasses('c_street')}>
                                <input type="text" value={extractedData?.corrStreet || ''} onChange={(e) => handleFieldChange('corrStreet', e.target.value)} onFocus={() => setFocusedField('c_street')} onBlur={() => setFocusedField(null)} className={inputInnerStyle} placeholder="Opcjonalnie..." />
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="col-span-1">
                                <FormLabel className="text-slate-400">Kod</FormLabel>
                                <div className={getInputClasses('c_zip')}>
                                  <input type="text" value={extractedData?.corrZipCode || ''} onChange={(e) => handleFieldChange('corrZipCode', e.target.value)} onFocus={() => setFocusedField('c_zip')} onBlur={() => setFocusedField(null)} className={`${inputInnerStyle} text-center`} placeholder="00-000" />
                                </div>
                              </div>
                              <div className="col-span-2">
                                <FormLabel className="text-slate-400">Miejscowość</FormLabel>
                                <div className={getInputClasses('c_city')}>
                                  <input type="text" value={extractedData?.corrCity || ''} onChange={(e) => handleFieldChange('corrCity', e.target.value)} onFocus={() => setFocusedField('c_city')} onBlur={() => setFocusedField(null)} className={inputInnerStyle} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : isScanVerification ? (
                      /* WIDOK WERYFIKACJI SKANU */
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <div>
                            <FormLabel className="text-slate-400">Pełna nazwa firmy</FormLabel>
                            <div className={getInputClasses('name')}>
                              <input 
                                type="text"
                                value={extractedData?.debtorName || ''} 
                                onChange={(e) => handleFieldChange('debtorName', e.target.value)} 
                                onFocus={() => setFocusedField('name')} 
                                onBlur={() => setFocusedField(null)} 
                                className={inputInnerStyle} 
                                placeholder="Nazwa dłużnika..."
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <FormLabel className="text-slate-400">NIP</FormLabel>
                              <div className={getInputClasses('nip')}>
                                <input type="text" value={extractedData?.nip || ''} onChange={(e) => handleFieldChange('nip', e.target.value)} onFocus={() => setFocusedField('nip')} onBlur={() => setFocusedField(null)} className={inputInnerStyle} />
                              </div>
                            </div>
                            <div className="md:col-span-2">
                               <FormLabel className="text-slate-400">Ulica i nr</FormLabel>
                               <div className={getInputClasses('street')}>
                                 <input type="text" value={extractedData?.street || ''} onChange={(e) => handleFieldChange('street', e.target.value)} onFocus={() => setFocusedField('street')} onBlur={() => setFocusedField(null)} className={inputInnerStyle} />
                               </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <FormLabel className="text-slate-400">Kod pocztowy</FormLabel>
                              <div className={getInputClasses('zip')}>
                                <input type="text" value={extractedData?.zipCode || ''} onChange={(e) => handleFieldChange('zipCode', e.target.value)} className={`${inputInnerStyle} text-center`} />
                              </div>
                            </div>
                            <div className="md:col-span-2">
                              <FormLabel className="text-slate-400">Miejscowość</FormLabel>
                              <div className={getInputClasses('city')}>
                                <input type="text" value={extractedData?.city || ''} onChange={(e) => handleFieldChange('city', e.target.value)} className={inputInnerStyle} />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-brand-light-blue/10 rounded-[var(--radius-brand-card)] p-4 border border-brand-blue/5 space-y-3">
                          <div className="flex items-center gap-2 pb-1 border-b border-brand-blue/10">
                            <FileText size={12} className="text-brand-blue" />
                            <h4 className="text-[8px] font-black text-brand-blue uppercase tracking-[0.2em]">Dane Faktury</h4>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <FormLabel className="text-slate-400">Nr faktury</FormLabel>
                              <div className={`${inputContainerBase} border-brand-blue/10 bg-white h-12`}>
                                <input type="text" value={extractedData?.invoiceNumber || ''} onChange={(e) => handleFieldChange('invoiceNumber', e.target.value)} className={inputInnerStyle} />
                              </div>
                            </div>
                            <div>
                              <FormLabel className="text-slate-400">Termin płatności</FormLabel>
                              <div className={`${inputContainerBase} border-brand-blue/10 bg-white h-12`}>
                                <input type="date" value={extractedData?.dueDate || ''} onChange={(e) => handleFieldChange('dueDate', e.target.value)} className="w-full px-4 bg-transparent outline-none font-bold text-xs" />
                              </div>
                            </div>
                            <div>
                              <FormLabel className="text-brand-blue">Kwota BRUTTO</FormLabel>
                              <div className={`${inputContainerBase} border-brand-blue bg-white ring-4 ring-brand-blue/5 h-12`}>
                                <input type="text" value={getCleanAmount(extractedData?.amount)} onChange={(e) => handleFieldChange('amount', e.target.value)} className="w-full px-4 bg-transparent outline-none text-base text-brand-blue" style={{ fontWeight: 'var(--dds-form-input-weight, 700)' }} />
                                <span className="pr-4 font-black text-brand-blue text-[10px]">{extractedData?.currency || 'PLN'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : isInvoiceOnly ? (
                      /* EDYCJA SAMEJ FAKTURY */
                      <div className="max-w-lg mx-auto space-y-4">
                        <div className="bg-slate-50/50 rounded-[var(--radius-brand-card)] p-6 border border-slate-100 space-y-4">
                          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                            <FileText size={14} className="text-brand-blue" />
                            <h4 className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Szczegóły Faktury</h4>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <FormLabel className="text-slate-400">nr Faktury</FormLabel>
                              <div className={getInputClasses('inv_num')}>
                                <input type="text" value={extractedData?.invoiceNumber || ''} onChange={(e) => handleFieldChange('invoiceNumber', e.target.value)} onFocus={() => setFocusedField('inv_num')} onBlur={() => setFocusedField(null)} className={inputInnerStyle} />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <FormLabel className="text-slate-400">data wystawienia</FormLabel>
                                <div className={getInputClasses('iss_date')}>
                                  <input type="date" value={extractedData?.issueDate || ''} onChange={(e) => handleFieldChange('issueDate', e.target.value)} className="w-full px-5 bg-transparent outline-none font-bold text-sm" />
                                </div>
                              </div>
                              <div>
                                <FormLabel className="text-slate-400">termin płatności</FormLabel>
                                <div className={getInputClasses('due_date')}>
                                  <input type="date" value={extractedData?.dueDate || ''} onChange={(e) => handleFieldChange('dueDate', e.target.value)} className="w-full px-5 bg-transparent outline-none font-bold text-sm" />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <FormLabel className="text-slate-400">Kwota BRUTTO</FormLabel>
                              <div className="relative h-14 border-2 border-brand-blue/20 rounded-[var(--radius-brand-button)] bg-white flex items-center px-5 justify-between">
                                <input type="text" value={getCleanAmount(extractedData?.amount)} onChange={(e) => handleFieldChange('amount', e.target.value)} className="w-full bg-transparent outline-none text-xl text-brand-navy" style={{ fontWeight: 'var(--dds-form-input-weight, 700)' }} />
                                <div className="flex bg-slate-100 p-1 rounded-[var(--radius-brand-input)] border border-slate-200 shrink-0">
                                   <button onClick={() => handleFieldChange('currency', 'PLN')} className={`px-2 py-1 rounded-[var(--radius-brand-input)] text-[9px] font-black transition-all focus-visible:ring-2 focus-visible:ring-brand-blue outline-none ${extractedData?.currency === 'PLN' ? 'bg-white text-brand-blue shadow-sm ring-1 ring-brand-blue' : 'text-slate-500 hover:text-slate-700'}`}>PLN</button>
                                   <button onClick={() => handleFieldChange('currency', 'EUR')} className={`px-2 py-1 rounded-[var(--radius-brand-input)] text-[9px] font-black transition-all focus-visible:ring-2 focus-visible:ring-brand-blue outline-none ${extractedData?.currency === 'EUR' ? 'bg-white text-brand-blue shadow-sm ring-1 ring-brand-blue' : 'text-slate-500 hover:text-slate-700'}`}>EUR</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* WPIS RĘCZNY */
                      <div className="flex flex-col flex-1 w-full relative">
                        <div 
                          className="w-full px-4 md:px-8 py-3 md:py-4 flex flex-col justify-start relative"
                          style={liquidFlowStyle}
                        >
                          <div className="mb-3 relative z-10 flex justify-between items-start">
                            <div className="text-left">
                              <h2 className="text-xl md:text-2xl font-black text-brand-navy mb-1 tracking-tight leading-tight">
                                Dodaj nową sprawę
                              </h2>
                              <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed max-w-xl mb-0">
                                Wypełnij poniższy formularz, aby przekazać sprawę do windykacji.
                              </p>
                            </div>
                            <button 
                              onClick={() => !isSyncing && onClose()} 
                              className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-[var(--radius-brand-button)] transition-all group shrink-0"
                              title="Zamknij i anuluj"
                            >
                              <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                          </div>

                          <div className="bg-white p-3 lg:p-4 rounded-[var(--radius-brand-button)] shadow-[0_24px_48px_-12px_rgba(10,46,92,0.1)] border border-slate-100 w-full relative z-10">
                            <div className={`space-y-2 ${isShaking ? 'animate-shake' : ''}`}>
                              <div className="space-y-1 relative z-10">
                                <FormLabel className={
                                  showErrors && !extractedData?.amount ? 'text-red-600' : focusedField === 'amount' ? 'text-brand-blue' : 'text-brand-navy'
                                }>
                                  Kwota zadłużenia brutto *
                                </FormLabel>
                                <div className={`py-1.5 px-3 rounded-[var(--radius-brand-button)] border transition-all duration-500 flex items-center justify-between shadow-sm ${
                                  showErrors && !extractedData?.amount ? 'border-red-400 bg-red-50/50' : 
                                  focusedField === 'amount' ? 'bg-white border-brand-blue ring-4 ring-brand-blue/5 shadow-xl' : 'bg-slate-50 border-slate-200'
                                }`}>
                                  <input 
                                    type="text" 
                                    placeholder="19 999" 
                                    className="w-full bg-transparent text-left text-3xl text-brand-navy outline-none tracking-tighter placeholder:text-slate-300" 
                                    style={{ fontWeight: 'var(--dds-form-input-weight, 700)' }}
                                    value={extractedData?.amount || ''} 
                                    onChange={handleAmountChange}
                                    onFocus={() => setFocusedField('amount')}
                                    onBlur={() => setFocusedField(null)}
                                  />
                                  <div className="flex bg-slate-200/50 p-1 rounded-[var(--radius-brand-button)] border border-slate-200 shrink-0 h-fit self-center">
                                    <button 
                                      onClick={() => handleFieldChange('currency', 'PLN')}
                                      className={`px-4 py-2 rounded-[var(--radius-brand-input)] text-[10px] font-black uppercase transition-all focus-visible:ring-2 focus-visible:ring-brand-blue outline-none ${
                                        extractedData?.currency === 'PLN' ? 'bg-white text-brand-blue shadow-md ring-1 ring-brand-blue' : 'text-slate-500 hover:text-slate-700'
                                      }`}
                                    >PLN</button>
                                    <button 
                                      onClick={() => handleFieldChange('currency', 'EUR')}
                                      className={`px-4 py-2 rounded-[var(--radius-brand-input)] text-[10px] font-black uppercase transition-all focus-visible:ring-2 focus-visible:ring-brand-blue outline-none ${
                                        extractedData?.currency === 'EUR' ? 'bg-white text-brand-blue shadow-md ring-1 ring-brand-blue' : 'text-slate-500 hover:text-slate-700'
                                      }`}
                                    >EUR</button>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 relative z-10">
                                <div className="space-y-1">
                                  <FormLabel className={
                                    showErrors && !extractedData?.dueDate ? 'text-red-600' : focusedField === 'due_date' ? 'text-brand-blue' : 'text-brand-navy'
                                  }>Data płatności faktury *</FormLabel>
                                  <div className={`relative ${inputContainerBase} h-10 rounded-[var(--radius-brand-button)] ${
                                    showErrors && !extractedData?.dueDate ? 'border-red-400 bg-red-50/50' :
                                    focusedField === 'due_date' ? 'border-brand-blue bg-white ring-2 ring-brand-blue/5' : 'border-slate-200'
                                  }`}>
                                    <Calendar className={`absolute left-4 transition-colors ${showErrors && !extractedData?.dueDate ? 'text-red-400' : focusedField === 'due_date' ? 'text-brand-blue scale-110' : 'text-slate-400'}`} size={16} />
                                    <input 
                                      type="date" 
                                      className="w-full h-full pl-11 pr-4 bg-transparent outline-none font-bold text-sm"
                                      value={extractedData?.dueDate || ''}
                                      onChange={(e) => handleFieldChange('dueDate', e.target.value)}
                                      onFocus={() => setFocusedField('due_date')}
                                      onBlur={() => setFocusedField(null)}
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <FormLabel className={
                                    showErrors && !extractedData?.debtorName && !extractedData?.nip ? 'text-red-600' : focusedField === 'debtor' ? 'text-brand-blue' : 'text-brand-navy'
                                  }>Dłużnik (Nazwa lub NIP) *</FormLabel>
                                  <div className={`relative ${inputContainerBase} h-10 rounded-[var(--radius-brand-button)] ${
                                    showErrors && !extractedData?.debtorName && !extractedData?.nip ? 'border-red-400 bg-red-50/50' :
                                    focusedField === 'debtor' ? 'border-brand-blue bg-white ring-2 ring-brand-blue/5' : 'border-slate-200'
                                  }`}>
                                    <div className="absolute left-4">
                                      {isFetchingNip ? (
                                        <RefreshCw className="text-brand-blue animate-spin" size={16} />
                                      ) : extractedData?.nip?.length === 10 ? (
                                        <Check className="text-green-500" size={16} />
                                      ) : (
                                        <Building2 className={`transition-colors ${showErrors && !extractedData?.debtorName && !extractedData?.nip ? 'text-red-400' : focusedField === 'debtor' ? 'text-brand-blue scale-110' : 'text-slate-400'}`} size={16} />
                                      )}
                                    </div>
                                    <input 
                                      type="text" 
                                      placeholder="NIP lub Nazwa"
                                      className="w-full h-full pl-11 pr-4 bg-transparent outline-none font-bold text-sm"
                                      value={extractedData?.nip ? formatNIPDisplay(extractedData.nip) : (extractedData?.debtorName || '')}
                                      onChange={handleDebtorChange}
                                      onFocus={() => setFocusedField('debtor')}
                                      onBlur={() => setFocusedField(null)}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="relative z-10">
                                {!showAddressPanel ? (
                                  <button 
                                    type="button"
                                    onClick={() => setShowAddressPanel(true)}
                                    className="text-[10px] font-black text-brand-blue uppercase tracking-widest hover:bg-brand-blue/5 px-2 py-1.5 rounded-[var(--radius-brand-input)] transition-colors flex items-center gap-1 mt-1"
                                  >
                                    + Dodaj dokładny adres dłużnika (opcjonalnie)
                                  </button>
                                ) : (
                                  <div className="mt-2 p-4 bg-white rounded-[var(--radius-brand-button)] border border-brand-blue/10 shadow-sm space-y-3 animate-in slide-in-from-top-4 fade-in duration-300 relative">
                                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-50">
                                      <h4 className="text-[10px] font-black text-brand-navy uppercase tracking-widest flex items-center gap-1.5">
                                        <MapPin size={14} className="text-brand-blue" />
                                        Szczegóły podmiotu
                                      </h4>
                                      <button type="button" onClick={() => setShowAddressPanel(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-[var(--radius-brand-input)] transition-colors">
                                        <X size={14} />
                                      </button>
                                    </div>
                                    {nipError && (
                                      <div className="p-2 bg-amber-50 border border-amber-200 rounded-[var(--radius-brand-input)] text-[10px] font-bold text-amber-700 uppercase tracking-widest text-center">
                                        {nipError}
                                      </div>
                                    )}
                                    <div className="space-y-3">
                                       <div>
                                         <FormLabel className={showErrors && !extractedData?.debtorName ? 'text-red-500' : 'text-slate-400'}>Pełna nazwa firmy *</FormLabel>
                                         <input type="text" value={extractedData?.debtorName || ''} onChange={(e) => handleFieldChange('debtorName', e.target.value)} className={`w-full px-3 py-2.5 bg-slate-50 border ${showErrors && !extractedData?.debtorName ? 'border-red-400 bg-red-50/50' : 'border-slate-200'} rounded-[var(--radius-brand-button)] text-sm font-bold text-brand-navy outline-none focus:bg-white focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/5 transition-all shadow-sm`} placeholder="Nazwa firmy..." />
                                       </div>
                                       <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                                         <div className="md:col-span-2">
                                           <FormLabel className="text-slate-400">Ulica i nr</FormLabel>
                                           <input type="text" value={extractedData?.street || ''} onChange={(e) => handleFieldChange('street', e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-[var(--radius-brand-button)] text-sm font-bold text-brand-navy outline-none focus:bg-white focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/5 transition-all shadow-sm" placeholder="Ulica..." />
                                         </div>
                                         <div className="md:col-span-2">
                                           <FormLabel className="text-slate-400">Miejscowość</FormLabel>
                                           <input type="text" value={extractedData?.city || ''} onChange={(e) => handleFieldChange('city', e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-[var(--radius-brand-button)] text-sm font-bold text-brand-navy outline-none focus:bg-white focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/5 transition-all shadow-sm" placeholder="Miejscowość..." />
                                         </div>
                                         <div className="md:col-span-1">
                                           <FormLabel className="text-slate-400">Kod pocztowy</FormLabel>
                                           <input type="text" value={extractedData?.zipCode || ''} onChange={(e) => handleFieldChange('zipCode', e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-[var(--radius-brand-button)] text-sm font-bold text-brand-navy outline-none focus:bg-white focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/5 transition-all shadow-sm text-center" placeholder="00-000" />
                                         </div>
                                       </div>
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="space-y-1.5 relative z-10">
                                <FormLabel className="text-brand-navy">
                                  Czy dłużnik kwestionował wykonanie usługi/dostarczenie towaru?
                                </FormLabel>
                                <div className="flex bg-slate-100 p-1.5 rounded-[var(--radius-brand-button)] border-2 border-transparent">
                                  <button 
                                    onClick={() => handleFieldChange('isContested', 'NO')}
                                    className={`flex-1 py-3 rounded-[var(--radius-brand-button)] font-black text-xs uppercase tracking-widest transition-all focus-visible:ring-2 focus-visible:ring-brand-blue outline-none ${
                                      extractedData?.isContested === 'NO' ? 'bg-white text-brand-blue shadow-md ring-1 ring-brand-blue' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                                  >NIE</button>
                                  <button 
                                    onClick={() => handleFieldChange('isContested', 'YES')}
                                    className={`flex-1 py-3 rounded-[var(--radius-brand-button)] font-black text-xs uppercase tracking-widest transition-all focus-visible:ring-2 focus-visible:ring-brand-blue outline-none ${
                                      extractedData?.isContested === 'YES' ? 'bg-white text-amber-700 shadow-md ring-1 ring-amber-700' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                                  >TAK</button>
                                </div>
                              </div>

                              <div className="pt-4 pb-2">
                                <FormButton 
                                  onClick={handleFinalizeWithValidation}
                                  disabled={isSyncing}
                                  isLoading={isSyncing}
                                  className="uppercase tracking-widest shadow-lg shadow-brand-blue/20 hover:bg-brand-navy hover:shadow-brand-navy/20 active:scale-[0.98]"
                                >
                                  DODAJ SPRAWĘ DO WINDYKACJI <ArrowRight size={18} />
                                </FormButton>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {!isManualEntry && (
                    <div className="pt-6 flex items-center justify-between border-t border-slate-50 mt-6">
                      <FormButton 
                        variant="secondary"
                        onClick={onClose} 
                        className="w-auto px-6 py-3 font-black text-xs uppercase tracking-widest"
                      >
                        Anuluj
                      </FormButton>
                      <FormButton 
                        onClick={onFinalize} 
                        disabled={isSyncing} 
                        isLoading={isSyncing}
                        className="w-auto px-8 py-3 bg-brand-navy text-white font-black text-sm uppercase tracking-widest hover:bg-brand-blue shadow-lg shadow-brand-navy/20"
                      >
                        {isEditMode ? 'Zapisz zmiany' : 'Dodaj do sprawy'}
                      </FormButton>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center flex flex-col justify-center h-full py-10 animate-in zoom-in-95">
                  <div className="w-24 h-24 bg-green-500 text-white rounded-[var(--radius-brand-card)] flex items-center justify-center mb-8 mx-auto shadow-2xl shadow-green-200 rotate-12"><Check size={48} strokeWidth={3} /></div>
                  <h2 className="text-4xl font-black text-brand-navy mb-4 italic">Zlecenie przyjęte!</h2>
                  <p className="text-slate-500 font-medium mb-12 max-w-sm mx-auto">Twoja sprawa została przekazana do zespołu prawnego RPMS. Możesz teraz śledzić jej status w Dashboardzie.</p>
                  <FormButton onClick={onClose} className="w-auto px-12 py-5 bg-brand-navy text-white font-black text-lg hover:bg-brand-blue mx-auto uppercase tracking-widest shadow-xl shadow-brand-navy/20">Wróć do Dashboardu</FormButton>
                </div>
              )}
            </div>
          </div>
          <style>{`
            @media (prefers-reduced-motion: no-preference) {
              @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-4px); }
                75% { transform: translateX(4px); }
              }
              .animate-shake {
                animation: shake 0.15s ease-in-out 0s 2;
              }
            }
          `}</style>
        </div>
      );
    };

export default AddDebtWizard;