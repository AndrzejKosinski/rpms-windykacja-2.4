'use client';

import React, { useState, useEffect, Suspense, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { authService } from '@/shared/api/apiClientFactory';
import { Loader2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function ActivateAccountContent({ searchParamsPromise }: { searchParamsPromise?: Promise<{ [key: string]: string | string[] | undefined }> }) {
  // W Next.js 15 searchParams w Page są Promise. Używamy React.use() lub useSearchParams().
  // Dla kompatybilności i reaktywności używamy obu podejść zależnie od potrzeb.
  const searchParams = useSearchParams();
  const resolvedParams = searchParamsPromise ? use(searchParamsPromise) : null;
  const token = resolvedParams?.token as string || searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const activate = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Brak tokenu aktywacyjnego.');
        return;
      }

      try {
        const result = await authService.activateAccount({ token });
        if (result.status === 'success') {
          setStatus('success');
          setMessage('Twoje konto zostało pomyślnie aktywowane.');
        } else {
          setStatus('error');
          setMessage(result.message || 'Nie udało się aktywować konta. Token może być nieprawidłowy lub wygasł.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Wystąpił błąd podczas komunikacji z serwerem.');
      }
    };

    activate();
  }, [token]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[var(--radius-brand-button)] shadow-xl p-8 text-center">
          <Loader2 className="w-12 h-12 text-brand-blue animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900">Aktywacja w toku...</h2>
          <p className="text-slate-600 mt-2">Proszę czekać, weryfikujemy Twój token.</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[var(--radius-brand-button)] shadow-xl p-8 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Konto aktywowane!</h2>
          <p className="text-slate-600 mt-2 mb-8">{message}</p>
          <Link href="/" className="w-full bg-brand-blue text-white py-3 rounded-[var(--radius-brand-button)] font-bold hover:bg-brand-blue/80 transition-colors flex items-center justify-center gap-2">
            Przejdź do logowania <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[var(--radius-brand-button)] shadow-xl p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Błąd aktywacji</h2>
        <p className="text-slate-600 mt-2 mb-6">{message}</p>
        <Link href="/" className="w-full inline-block bg-slate-100 text-slate-700 py-3 rounded-[var(--radius-brand-button)] font-bold hover:bg-slate-200 transition-colors">
          Wróć na stronę główną
        </Link>
      </div>
    </div>
  );
}

export default function ActivateAccountPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-brand-blue animate-spin" />
      </div>
    }>
      <ActivateAccountContent searchParamsPromise={searchParams} />
    </Suspense>
  );
}
