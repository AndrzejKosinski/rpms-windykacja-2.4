import React, { useState } from 'react';
import Image from 'next/image';
import { Calendar, Building2, Mail, Phone, ArrowRight, Loader2, ChevronLeft, ShieldCheck, Lock, CheckCircle2, Sparkles, AlertCircle, LogIn, RefreshCw, Database, Cloud, Shield } from 'lucide-react';
import { OnboardingData } from './types';
import { authService } from '@/shared/api/apiClientFactory';
import { FormLabel } from '@/shared/ui/forms/FormLabel';

interface StepContactProps {
  data: OnboardingData;
  setData: (data: OnboardingData) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  isExtracting?: boolean;
  onSwitchToLogin?: () => void;
  onStatusDetected?: (status: 'NEW' | 'RETURNING' | 'AUTHENTICATED') => void;
  externalError?: string | null;
}

import { FormInput } from '@/shared/ui/forms/FormInput';

const SmartInput = ({ 
  id, label, icon: Icon, type = "text", value, onChange, placeholder, error, 
  isFocused, onFocus, onBlur, required = false, className = "" 
}: any) => {
  const hasValue = value && value.length > 0;

  return (
    <div className={`space-y-2 transition-all duration-300 ${className}`}>
      <FormLabel 
        htmlFor={id} 
        className={`transition-colors duration-300 ${
          error ? 'text-red-600' : isFocused ? 'text-brand-blue' : 'text-brand-navy'
        }`}
      >
        {label} {required && <span className="text-brand-blue">*</span>}
      </FormLabel>
      <FormInput
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => onFocus(id)}
        onBlur={onBlur}
        error={error}
        icon={<Icon 
          className={`transition-all duration-300 ${
            error ? 'text-red-400' : isFocused ? 'text-brand-blue scale-110' : 'text-slate-400'
          }`} 
          size={16} 
          aria-hidden="true" 
        />}
        className={`text-sm ${
          isFocused ? 'bg-white border-brand-blue ring-4 ring-brand-blue/10 shadow-xl shadow-brand-blue/5' : 
          hasValue ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50 border-slate-200 shadow-sm'
        } ${
          error ? 'border-red-400 focus:border-red-600' : 'border-slate-200 hover:border-slate-300'
        } placeholder:text-slate-400`}
      />
    </div>
  );
};

const StepContact: React.FC<StepContactProps> = ({ data, setData, onBack, onSubmit, isSubmitting, isExtracting, onSwitchToLogin, onStatusDetected, externalError }) => {
  const [subStep, setSubStep] = useState(data.isManual ? 1 : 2);
  const [showErrors, setShowErrors] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [accountStatus, setAccountStatus] = useState<'UNKNOWN' | 'ACTIVE' | 'NEW'>('UNKNOWN');
  const [formError, setFormError] = useState<string | null>(null);
  const [consents, setConsents] = useState({
    rodo: false,
    marketing: false
  });

  const checkEmail = async () => {
    if (!data.email || !data.email.includes('@')) return;
    setIsCheckingEmail(true);
    setFormError(null);
    try {
      const result = await authService.checkEmailStatus({ email: data.email });
      if (result.status === 'STATUS_ACTIVE') {
        setAccountStatus('ACTIVE');
        onStatusDetected?.('RETURNING'); 
      } else if (result.status === 'STATUS_LEAD') {
        setAccountStatus('NEW');
        onStatusDetected?.('RETURNING');
      } else {
        setAccountStatus('NEW');
        onStatusDetected?.('NEW');
        setData({ ...data, password: '' }); 
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCheckingEmail(false);
      setFocusedField(null);
    }
  };

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

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, amount: formatAmountDisplay(e.target.value) });
  };

  const handleDebtorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const displayVal = /^\d/.test(val.replace(/-/g, '')) ? formatNIPDisplay(val) : val;
    setData({ ...data, debtorName: displayVal });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length < 4 && data.phone.startsWith('+48')) {
      setData({ ...data, phone: '' });
      return;
    }
    let digits = val.replace(/\D/g, '');
    if (digits.startsWith('48')) digits = digits.substring(2);
    digits = digits.substring(0, 9);
    let formatted = '';
    if (digits.length > 0) {
      formatted = '+48 ' + digits.substring(0, 3);
      if (digits.length > 3) formatted += ' ' + digits.substring(3, 6);
      if (digits.length > 6) formatted += ' ' + digits.substring(6, 9);
    }
    setData({ ...data, phone: formatted });
  };

  const isStep1Valid = data.amount && data.dueDate && data.debtorName;

  const handleNextSubStep = () => {
    if (isStep1Valid) {
      setSubStep(2);
      setShowErrors(false);
    } else {
      setShowErrors(true);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

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

  const handleBackAction = () => {
    if (subStep === 2 && data.isManual) {
      setSubStep(1);
    } else {
      onBack();
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col flex-1 w-full relative">
      {subStep === 1 ? (
        <div className="flex flex-col lg:flex-row flex-1 -mx-6 md:-mx-12 -mt-8 md:-mt-10">
          <div 
            className="lg:w-[70%] px-6 md:px-12 py-8 md:py-10 animate-in fade-in slide-in-from-left-4 duration-500 flex flex-col justify-start relative"
            style={liquidFlowStyle}
          >
            <div className="mb-5 md:mb-6 relative z-10">
              <button 
                onClick={handleBackAction}
                className="flex items-center gap-2 text-slate-500 hover:text-brand-blue transition-colors group mb-2 md:mb-3 outline-none focus:ring-2 focus:ring-brand-blue rounded-[var(--radius-brand-input)] py-2 px-3 -ml-3"
              >
                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Wróć do wyboru metody</span>
              </button>

              <div className="text-left">
                <h2 className="text-3xl md:text-4xl font-black text-brand-navy mb-1 tracking-tight leading-tight">
                  Uruchom windykację <span className="text-brand-blue">w 60s</span>
                </h2>
                <h1 className="text-sm md:text-base text-slate-500 font-medium leading-relaxed max-w-xl mb-0">
                  Podaj kwotę i NIP dłużnika. To wystarczy, abyśmy natychmiast rozpoczęli procedurę odzyskiwania pieniędzy.
                </h1>
              </div>
            </div>

            <div className="bg-white p-6 lg:p-8 rounded-[var(--radius-brand-card)] shadow-[0_24px_48px_-12px_rgba(10,46,92,0.1)] border border-slate-100 max-w-2xl relative z-10">
              <form className={`space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 ${isShaking ? 'animate-shake' : ''}`}>
                <div className="space-y-2 transition-all duration-300">
                  <FormLabel 
                    htmlFor="amount" 
                    className={`transition-colors duration-300 ${
                      showErrors && !data.amount ? 'text-red-600' : focusedField === 'amount' ? 'text-brand-blue' : 'text-brand-navy'
                    }`}
                  >
                    Kwota zadłużenia brutto *
                  </FormLabel>
                  
                  <div className={`py-3 md:py-4 px-6 rounded-[var(--radius-brand-card)] border transition-all duration-500 flex items-center justify-between relative shadow-sm ${
                    showErrors && !data.amount ? 'border-red-400 bg-red-50/50' : 
                    focusedField === 'amount' ? 'bg-white border-brand-blue ring-4 ring-brand-blue/5 shadow-xl shadow-brand-blue/5' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <input 
                      id="amount"
                      type="text" 
                      placeholder="19 999"
                      className="w-full bg-transparent text-left text-3xl md:text-4xl text-brand-navy outline-none placeholder:text-slate-400 focus:text-brand-blue transition-all tracking-tighter"
                      style={{ fontWeight: 'var(--dds-form-input-weight, 700)' }}
                      value={data.amount} 
                      onChange={handleAmountChange}
                      onFocus={() => setFocusedField('amount')}
                      onBlur={() => setFocusedField(null)}
                    />

                    <div className="flex bg-slate-200/50 p-1 rounded-[var(--radius-brand-button)] border border-slate-200 shadow-sm shrink-0 h-fit self-center">
                      <button 
                        type="button"
                        onClick={() => setData({...data, currency: 'PLN'})}
                        className={`px-4 py-2 rounded-[var(--radius-brand-input)] text-xs font-black uppercase tracking-widest transition-all focus-visible:ring-2 focus-visible:ring-brand-blue outline-none ${
                          data.currency === 'PLN' ? 'bg-white text-brand-blue shadow-md ring-1 ring-brand-blue' : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        PLN
                      </button>
                      <button 
                        type="button"
                        onClick={() => setData({...data, currency: 'EUR'})}
                        className={`px-4 py-2 rounded-[var(--radius-brand-input)] text-xs font-black uppercase tracking-widest transition-all focus-visible:ring-2 focus-visible:ring-brand-blue outline-none ${
                          data.currency === 'EUR' ? 'bg-white text-brand-navy shadow-md ring-1 ring-brand-navy' : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        EUR
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <SmartInput 
                    id="dueDate"
                    label="Data płatności faktury"
                    icon={Calendar}
                    type="date"
                    value={data.dueDate}
                    onChange={(e: any) => setData({...data, dueDate: e.target.value})}
                    error={showErrors && !data.dueDate}
                    isFocused={focusedField === 'dueDate'}
                    onFocus={setFocusedField}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                  <SmartInput 
                    id="debtor"
                    label="Dłużnik (Nazwa lub NIP)"
                    icon={Building2}
                    placeholder="222-244-44-44"
                    value={data.debtorName}
                    onChange={handleDebtorChange}
                    error={showErrors && !data.debtorName}
                    isFocused={focusedField === 'debtor'}
                    onFocus={setFocusedField}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                </div>

                <div className="space-y-3">
                  <FormLabel id="is-contested-label" className="text-left block text-brand-navy transition-colors">
                    Czy dłużnik kwestionował wykonanie usługi/dostarczenie towaru?
                  </FormLabel>
                  <div 
                    className="flex bg-slate-100 p-1.5 rounded-[var(--radius-brand-button)] border-2 border-transparent transition-all"
                    role="radiogroup"
                    aria-labelledby="is-contested-label"
                  >
                    <button 
                      type="button"
                      onClick={() => setData({...data, isContested: 'NO'})}
                      role="radio"
                      aria-checked={data.isContested === 'NO'}
                      className={`flex-1 py-3.5 rounded-[var(--radius-brand-input)] font-black text-xs uppercase tracking-widest transition-all focus-visible:ring-2 focus-visible:ring-brand-blue outline-none ${
                        data.isContested === 'NO' 
                        ? 'bg-white text-brand-blue shadow-md ring-1 ring-brand-blue' 
                        : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      Nie
                    </button>
                    <button 
                      type="button"
                      onClick={() => setData({...data, isContested: 'YES'})}
                      role="radio"
                      aria-checked={data.isContested === 'YES'}
                      className={`flex-1 py-3.5 rounded-[var(--radius-brand-input)] font-black text-xs uppercase tracking-widest transition-all focus-visible:ring-2 focus-visible:ring-brand-blue outline-none ${
                        data.isContested === 'YES' 
                        ? 'bg-white text-amber-700 shadow-md ring-1 ring-amber-700' 
                        : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      Tak
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    type="button"
                    onClick={handleNextSubStep}
                    className="w-full py-4 bg-brand-blue text-white rounded-[var(--radius-brand-button)] font-black text-xs uppercase tracking-widest shadow-lg hover:bg-brand-navy transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    Dalej: Dane kontaktowe <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:w-[30%] relative overflow-hidden hidden lg:block animate-in fade-in slide-in-from-right-4 duration-700 flex flex-col">
            <Image 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000" 
              alt="Business Architecture" 
              fill
              sizes="(max-width: 1024px) 100vw, 30vw"
              className="object-cover grayscale-[0.2] brightness-[0.7] contrast-[1.1]"
              referrerPolicy="no-referrer"
            />
            
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-transparent to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-center text-center">
              <div className="bg-white/10 backdrop-blur-md border border-white/30 p-5 rounded-[var(--radius-brand-card)] w-full transform hover:scale-[1.02] transition-transform duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(255,255,255,0.1)]">
                <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-brand-blue rounded-full text-white text-[8px] font-black uppercase tracking-widest mb-3 shadow-lg">
                  <ShieldCheck size={10} /> LegalTech Standards
                </div>
                <p className="text-[10px] text-white font-bold leading-relaxed opacity-90">
                  Łączymy precyzję prawa z nowoczesną technologią, zapewniając najwyższy standard ochrony należności.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row flex-1 -mx-6 md:-mx-12 -mt-8 md:-mt-10">
          <div 
            className="lg:w-[70%] px-6 md:px-12 py-8 md:py-10 animate-in fade-in slide-in-from-left-4 duration-500 flex flex-col justify-start relative"
            style={liquidFlowStyle}
          >
            <div className="mb-5 md:mb-6 relative z-10">
              <button 
                onClick={handleBackAction}
                className="flex items-center gap-2 text-slate-500 hover:text-brand-blue transition-colors group mb-2 md:mb-3 outline-none focus:ring-2 focus:ring-brand-blue rounded-[var(--radius-brand-input)] py-2 px-3 -ml-3"
              >
                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Wróć do szczegółów sprawy</span>
              </button>

              <div className="text-left">
                <h2 className="text-3xl md:text-4xl font-black text-brand-navy mb-1 tracking-tight leading-tight">
                  Dane <span className="text-brand-blue">kontaktowe</span>
                </h2>
                <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed max-w-xl mb-0">
                  Gdzie mamy przesłać wyniki bezpłatnej analizy Twojej sprawy?
                </p>
              </div>
            </div>

            <div className="bg-white p-6 lg:p-8 rounded-[var(--radius-brand-card)] shadow-[0_24px_48px_-12px_rgba(10,46,92,0.1)] border border-slate-100 max-w-2xl relative z-10">
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="flex flex-col gap-6">
                  <SmartInput 
                    id="email"
                    label="E-mail służbowy"
                    icon={Mail}
                    type="email"
                    placeholder="np. jan.kowalski@firma.pl"
                    value={data.email}
                    onChange={(e: any) => setData({...data, email: e.target.value})}
                    isFocused={focusedField === 'email'}
                    onFocus={setFocusedField}
                    onBlur={checkEmail}
                    required
                  />

                  {/* Field Swap Logic: Phone is hidden and Password is shown for ACTIVE accounts */}
                  {accountStatus === 'ACTIVE' ? (
                    <div className="space-y-4 animate-in slide-in-from-top-2 duration-500">
                      <div className="px-2 flex items-center gap-2 text-amber-600">
                        <Sparkles size={14} className="animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Rozpoznano konto firmowe. Podaj hasło do Panelu</span>
                        <button type="button" onClick={onSwitchToLogin} className="ml-auto text-[9px] font-black text-brand-blue uppercase hover:underline">Inne konto?</button>
                      </div>
                      
                      <SmartInput 
                        id="auth_password"
                        label="Hasło do Panelu"
                        icon={Lock}
                        type="password"
                        placeholder="••••••••"
                        value={data.password || ''}
                        onChange={(e: any) => setData({...data, password: e.target.value})}
                        isFocused={focusedField === 'auth_password'}
                        onFocus={setFocusedField}
                        onBlur={() => setFocusedField(null)}
                        required
                        error={!!externalError}
                      />
                    </div>
                  ) : (
                    <SmartInput 
                      id="phone"
                      label="Telefon (opcjonalnie)"
                      icon={Phone}
                      type="tel"
                      placeholder="123 456 789"
                      value={data.phone}
                      onChange={handlePhoneChange}
                      isFocused={focusedField === 'phone'}
                      onFocus={setFocusedField}
                      onBlur={() => setFocusedField(null)}
                      required={false}
                    />
                  )}
                </div>

                <div className="p-4 bg-slate-50 rounded-[var(--radius-brand-button)] border border-slate-200/60 space-y-3 shadow-sm">
                  <label htmlFor="rodo" className="flex items-start gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      id="rodo" 
                      required
                      className="mt-1 w-4 h-4 rounded-[var(--radius-brand-button)] border-slate-300 text-brand-blue focus:ring-brand-blue cursor-pointer group-hover:border-brand-blue transition-colors"
                      checked={consents.rodo}
                      onChange={e => setConsents({...consents, rodo: e.target.checked})}
                    />
                    <span className="text-[10px] text-slate-700 font-medium leading-relaxed select-none group-hover:text-slate-900 transition-colors">
                      Akceptuję <span className="text-brand-navy font-bold underline decoration-brand-blue/30 underline-offset-4">Regulamin</span> oraz potwierdzam zapoznanie się z <span className="text-brand-navy font-bold underline decoration-brand-blue/30 underline-offset-4">Polityką Prywatności</span>. Moje dane są chronione tajemnicą zawodową.
                    </span>
                  </label>
                </div>

                {(formError || externalError) && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-[var(--radius-brand-button)] text-[10px] font-black uppercase text-center border border-red-100 animate-shake">
                    {formError || externalError}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isSubmitting || isCheckingEmail || !consents.rodo || isExtracting || (accountStatus === 'ACTIVE' && !data.password)}
                  className="w-full py-4 bg-brand-blue text-white rounded-[var(--radius-brand-button)] font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-blue/20 hover:bg-brand-navy focus:ring-4 focus:ring-brand-blue/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] overflow-hidden relative"
                >
                  {isExtracting ? (
                    <span className="flex items-center gap-2"><RefreshCw className="animate-spin" size={16} /> Analiza dokumentów...</span>
                  ) : isCheckingEmail ? (
                    <span className="flex items-center gap-2 animate-pulse"><RefreshCw className="animate-spin" size={16} /> Inicjowanie teczki sprawy...</span>
                  ) : isSubmitting ? (
                    <div className="flex flex-col items-center">
                       <span className="flex items-center gap-2 animate-pulse"><ShieldCheck className="animate-bounce" size={16} /> Inicjowanie procedury windykacyjnej...</span>
                    </div>
                  ) : accountStatus === 'ACTIVE' ? (
                    <>Zaloguj się i wyślij zgłoszenie <ArrowRight size={14} aria-hidden="true" /></>
                  ) : (
                    <>Uruchom procedurę windykacji <Lock size={14} aria-hidden="true" /></>
                  )}
                </button>
                
                {isSubmitting && (
                   <div className="mt-4 space-y-2 animate-in fade-in duration-500">
                      {[
                        { label: "Weryfikacja autoryzacji zgłoszenia", done: accountStatus === 'ACTIVE' },
                        { label: "Przetwarzanie danych wierzytelności", done: true },
                        { label: "Tworzenie cyfrowej teczki sprawy", done: true },
                        { label: "Formalna rejestracja w Kancelarii", done: false }
                      ].map((s, i) => (
                        <div key={i} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
                           <div className={`w-1.5 h-1.5 rounded-full ${s.done ? 'bg-green-500' : 'bg-slate-200 animate-pulse'}`}></div>
                           {s.label}
                        </div>
                      ))}
                   </div>
                )}
              </form>
            </div>
          </div>

          <div className="lg:w-[30%] bg-slate-50/50 border-l border-slate-100 lg:bg-transparent p-6 lg:p-8 mt-4 lg:mt-0 animate-in fade-in slide-in-from-right-4 duration-500 relative overflow-hidden flex flex-col items-center lg:items-start">
            <div className="absolute inset-0 bg-slate-50 opacity-30 -z-10 hidden lg:block" />
            
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left flex-1">
              <div className="relative mb-6">
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-[var(--radius-brand-button)] overflow-hidden shadow-lg border-2 border-white relative">
                  <Image 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300" 
                    alt="Mec. Anna Kowalska" 
                    fill
                    sizes="80px"
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse shadow-sm"></div>
              </div>

              <h4 className="text-lg lg:text-xl font-black text-brand-navy mb-1 italic">Mec. Anna Kowalska</h4>
              <p className="text-brand-blue font-black text-[9px] lg:text-[10px] uppercase tracking-[0.2em] mb-6">Legal Strategy Lead</p>

              <div className="relative p-5 bg-white rounded-[var(--radius-brand-card)] border border-slate-100 shadow-sm mb-6">
                <Sparkles className="absolute top-3 left-3 text-brand-blue/10" size={16} />
                <p className="text-slate-600 font-bold leading-relaxed text-[11px] lg:text-[12px] italic pl-1">
                  "Osobiście analizuję Twoje zgłoszenie. Przygotujemy bezpłatną opinię prawną w 15 minut."
                </p>
              </div>

              <div className="space-y-4 w-full">
                <div className="flex items-center gap-3 group cursor-default">
                  <div className="w-6 h-6 bg-brand-light-blue rounded-[var(--radius-brand-input)] flex items-center justify-center text-brand-blue">
                    <CheckCircle2 size={12} />
                  </div>
                  <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Analiza Real-Time</span>
                </div>
                <div className="flex items-center gap-3 group cursor-default">
                  <div className="w-6 h-6 bg-brand-light-blue rounded-[var(--radius-brand-input)] flex items-center justify-center text-brand-blue">
                    <ShieldCheck size={12} />
                  </div>
                  <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Tajemnica Prawna</span>
                </div>
              </div>

              <div className="mt-auto pt-8 w-full">
                <div className="p-4 bg-white border border-slate-100 rounded-[var(--radius-brand-button)] shadow-sm">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 text-center lg:text-left">Czas odpowiedzi</p>
                  <p className="text-lg font-black text-brand-navy text-center lg:text-left">~15 minut</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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

export default StepContact;
