"use client";

import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { Building2, Loader2, CheckCircle2, Search } from 'lucide-react';
import { useNipLookup } from '../../../shared/hooks/useNipLookup';
import { useAppContext } from '../../../context/AppContext';

/**
 * Schemat walidacji danych firmy i rozliczeń.
 */
const companyDetailsSchema = z.object({
  nip: z.string().length(10, 'NIP musi składać się z 10 cyfr').regex(/^\d+$/, 'NIP może zawierać tylko cyfry'),
  companyName: z.string().min(1, 'Nazwa firmy jest wymagana'),
  address: z.string().min(1, 'Adres jest wymagany'),
  iban: z.string()
    .transform(val => val.replace(/\s/g, ''))
    .refine(val => /^PL\d{26}$/.test(val), {
      message: 'Nieprawidłowy format numeru konta IBAN (wymagane PL + 26 cyfr)'
    }),
  billingEmail: z.string().email('Nieprawidłowy adres e-mail').optional().or(z.literal(''))
});

type CompanyDetailsFormData = z.infer<typeof companyDetailsSchema>;

/**
 * Formatuje numer IBAN dodając spacje co 4 znaki po prefiksie PL.
 */
const formatIBAN = (value: string) => {
  // Usuwamy wszystko co nie jest literą lub cyfrą
  let cleanValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  
  // Jeśli puste, nie dodajemy nic, ale jeśli zaczyna pisać i nie ma PL, dodajemy PL
  if (cleanValue.length > 0 && !cleanValue.startsWith('PL')) {
    if (/^\d/.test(cleanValue)) {
      cleanValue = 'PL' + cleanValue;
    }
  }

  // Ograniczenie do PL + 26 cyfr
  if (cleanValue.startsWith('PL')) {
    cleanValue = 'PL' + cleanValue.substring(2, 28).replace(/[^0-9]/g, '');
  } else {
    cleanValue = cleanValue.substring(0, 28);
  }

  // Formatowanie: PLXX XXXX XXXX XXXX XXXX XXXX XXXX
  const parts = [];
  if (cleanValue.length > 0) {
    parts.push(cleanValue.substring(0, 2)); // PL
    const rest = cleanValue.substring(2);
    for (let i = 0; i < rest.length; i += 4) {
      parts.push(rest.substring(i, i + 4));
    }
  }
  return parts.join(' ');
};

/**
 * Komponent formularza do zarządzania danymi firmy i rozliczeniami.
 * Pozwala na pobranie danych z zewnętrznego rejestru (Biała Księga/GUS) za pomocą NIP.
 */
export default function CompanyDetailsForm() {
  const [formData, setFormData] = useState<CompanyDetailsFormData>({
    nip: '',
    companyName: '',
    address: '',
    iban: '',
    billingEmail: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const { updateUserName, currentUser } = useAppContext();
  
  const { lookupNip, isFetching: isFetchingNip, error: nipError } = useNipLookup();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await fetch('/api/settings/company');
        const data = await res.json();
        if (res.ok && data.success && data.data) {
          setFormData({
            nip: data.data.nip || '',
            companyName: data.data.companyName || '',
            address: data.data.address || '',
            iban: formatIBAN(data.data.iban || ''),
            billingEmail: data.data.billingEmail || currentUser?.email || ''
          });
        } else if (currentUser?.email) {
          // Jeśli nie ma danych firmy, ale mamy e-mail użytkownika, ustawiamy go jako domyślny
          setFormData(prev => ({ ...prev, billingEmail: currentUser.email }));
        }
      } catch (error) {
        console.error('Błąd pobierania danych firmy:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const name = e.target.name;

    if (name === 'iban') {
      value = formatIBAN(value);
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNipLookup = async () => {
    if (formData.nip.length !== 10 || !/^\d+$/.test(formData.nip)) {
      setErrors(prev => ({ ...prev, nip: 'Wprowadź poprawny 10-cyfrowy NIP' }));
      return;
    }

    setErrors(prev => ({ ...prev, nip: '' }));
    setStatus(null);

    const result = await lookupNip(formData.nip);

    if (result) {
      setFormData(prev => ({
        ...prev,
        companyName: result.name || prev.companyName,
        address: result.address || prev.address,
      }));
      setStatus({ type: 'success', message: 'Dane firmy zostały pobrane z rejestru.' });
    } else if (nipError) {
      setStatus({ type: 'error', message: nipError });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    
    try {
      companyDetailsSchema.parse(formData);
      setErrors({});
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.issues.forEach(e => {
          if (e.path[0]) newErrors[e.path[0].toString()] = e.message;
        });
        setErrors(newErrors);
        return;
      }
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/settings/company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({ type: 'success', message: 'Dane firmy zostały pomyślnie zaktualizowane.' });
        // Aktualizacja nazwy użytkownika w kontekście (Nazwa firmy lub NIP)
        const newDisplayName = formData.companyName || formData.nip;
        updateUserName(newDisplayName);
      } else {
        setStatus({ type: 'error', message: data.message || 'Wystąpił błąd podczas aktualizacji danych.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Błąd połączenia z serwerem.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="bg-white rounded-[var(--radius-brand-card)] p-8 shadow-sm border border-slate-200 flex items-center justify-center min-h-[400px]">
        <Loader2 size={32} className="animate-spin text-brand-blue" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[var(--radius-brand-card)] p-8 shadow-sm border border-slate-200">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-brand-blue/10 text-brand-blue rounded-[var(--radius-brand-button)] flex items-center justify-center">
          <Building2 size={24} />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-800">Dane firmy i rozliczenia</h3>
          <p className="text-sm font-medium text-slate-500">Zarządzaj danymi do faktur oraz numerem konta bankowego.</p>
        </div>
      </div>

      {status && (
        <div className={`p-4 rounded-[var(--radius-brand-button)] mb-6 flex items-center gap-3 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
          {status.type === 'success' ? <CheckCircle2 size={20} /> : <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">!</div>}
          <p className="font-bold text-sm">{status.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">NIP</label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  name="nip"
                  value={formData.nip}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-slate-50 border ${errors.nip ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-brand-blue focus:ring-brand-blue/20'} rounded-[var(--radius-brand-button)] font-medium text-slate-800 focus:outline-none focus:ring-4 transition-all`}
                  placeholder="Wpisz 10 cyfr NIP"
                  maxLength={10}
                />
              </div>
              <button
                type="button"
                onClick={handleNipLookup}
                disabled={isFetchingNip || formData.nip.length !== 10}
                className="px-6 py-3 bg-slate-800 text-white rounded-[var(--radius-brand-button)] font-bold text-sm hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
              >
                {isFetchingNip ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                Pobierz z GUS
              </button>
            </div>
            {errors.nip && <p className="text-red-500 text-xs font-bold mt-2">{errors.nip}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Nazwa firmy</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-slate-50 border ${errors.companyName ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-brand-blue focus:ring-brand-blue/20'} rounded-[var(--radius-brand-button)] font-medium text-slate-800 focus:outline-none focus:ring-4 transition-all`}
              placeholder="Nazwa firmy"
            />
            {errors.companyName && <p className="text-red-500 text-xs font-bold mt-2">{errors.companyName}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Adres siedziby</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-slate-50 border ${errors.address ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-brand-blue focus:ring-brand-blue/20'} rounded-[var(--radius-brand-button)] font-medium text-slate-800 focus:outline-none focus:ring-4 transition-all`}
              placeholder="Ulica, kod pocztowy, miasto"
            />
            {errors.address && <p className="text-red-500 text-xs font-bold mt-2">{errors.address}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Numer konta bankowego (IBAN)</label>
            <input
              type="text"
              name="iban"
              value={formData.iban}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-slate-50 border ${errors.iban ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-brand-blue focus:ring-brand-blue/20'} rounded-[var(--radius-brand-button)] font-medium text-slate-800 focus:outline-none focus:ring-4 transition-all`}
              placeholder="PL00 0000 0000 0000 0000 0000 0000"
            />
            {errors.iban && <p className="text-red-500 text-xs font-bold mt-2">{errors.iban}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Adres e-mail do faktur</label>
            <input
              type="email"
              name="billingEmail"
              value={formData.billingEmail}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-slate-50 border ${errors.billingEmail ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-brand-blue focus:ring-brand-blue/20'} rounded-[var(--radius-brand-button)] font-medium text-slate-800 focus:outline-none focus:ring-4 transition-all`}
              placeholder="Wpisz inny e-mail, jeśli faktury mają trafiać gdzie indziej"
            />
            <p className="text-[10px] text-slate-400 font-medium mt-2">
              Domyślnie używamy Twojego adresu e-mail z konta ({currentUser?.email}). Wypełnij to pole tylko, jeśli chcesz wskazać inny adres do rozliczeń.
            </p>
            {errors.billingEmail && <p className="text-red-500 text-xs font-bold mt-2">{errors.billingEmail}</p>}
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto px-8 py-4 bg-brand-blue text-white rounded-[var(--radius-brand-button)] font-black uppercase tracking-widest text-sm hover:bg-brand-blue/90 transition-all shadow-lg shadow-brand-blue/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Zapisz dane firmy'}
          </button>
        </div>
      </form>
    </div>
  );
}
