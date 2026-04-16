'use client';

import React, { useState, Suspense, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { authService } from '@/shared/api/apiClientFactory';
import { Lock, Loader2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function ResetPasswordContent({ searchParamsPromise }: { searchParamsPromise?: Promise<{ [key: string]: string | string[] | undefined }> }) {
  // W Next.js 15 searchParams w Page są Promise. Używamy React.use() lub useSearchParams().
  const searchParams = useSearchParams();
  const resolvedParams = searchParamsPromise ? use(searchParamsPromise) : null;
  const token = resolvedParams?.token as string || searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setStatus('error');
      setMessage('Brak tokenu resetowania hasła.');
      return;
    }

    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Hasła nie są identyczne.');
      return;
    }

    if (password.length < 8) {
      setStatus('error');
      setMessage('Hasło musi mieć co najmniej 8 znaków.');
      return;
    }

    setStatus('submitting');
    setMessage('');

    try {
      const result = await authService.resetPassword({ token, newPassword: password });
      if (result.status === 'success') {
        setStatus('success');
        setMessage('Twoje hasło zostało pomyślnie zmienione.');
      } else {
        setStatus('error');
        setMessage(result.message || 'Nie udało się zmienić hasła. Token może być nieprawidłowy lub wygasł.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Wystąpił błąd podczas komunikacji z serwerem.');
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[var(--radius-brand-button)] shadow-xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900">Nieprawidłowy link</h2>
          <p className="text-slate-600 mt-2 mb-6">Brak tokenu w adresie URL. Upewnij się, że skopiowałeś pełny link z wiadomości e-mail.</p>
          <Link href="/" className="w-full inline-block bg-slate-100 text-slate-700 py-3 rounded-[var(--radius-brand-button)] font-bold hover:bg-slate-200 transition-colors">
            Wróć na stronę główną
          </Link>
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
          <h2 className="text-2xl font-bold text-slate-900">Hasło zmienione!</h2>
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
      <div className="max-w-md w-full bg-white rounded-[var(--radius-brand-button)] shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-brand-light-blue rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-brand-blue" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Ustaw nowe hasło</h2>
          <p className="text-slate-500 mt-2 text-sm">Wprowadź nowe hasło dla swojego konta.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Nowe hasło</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-[var(--radius-brand-button)] border border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
              placeholder="Min. 8 znaków"
              required
              minLength={8}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Powtórz nowe hasło</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-[var(--radius-brand-button)] border border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
              placeholder="Powtórz hasło"
              required
              minLength={8}
            />
          </div>

          {status === 'error' && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-[var(--radius-brand-input)] flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full bg-brand-blue text-white py-3 rounded-[var(--radius-brand-button)] font-bold hover:bg-brand-blue/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
          >
            {status === 'submitting' ? (
              <><Loader2 size={18} className="animate-spin" /> Zapisywanie...</>
            ) : (
              'Zmień hasło'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-brand-blue w-8 h-8" /></div>}>
      <ResetPasswordContent searchParamsPromise={searchParams} />
    </Suspense>
  );
}
