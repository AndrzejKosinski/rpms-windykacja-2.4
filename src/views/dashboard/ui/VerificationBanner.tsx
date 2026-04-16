'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { authService } from '@/shared/api/apiClientFactory';

export default function VerificationBanner() {
  const { currentUser } = useAppContext();
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [cooldown, setCooldown] = useState(0);

  // Wyświetlaj tylko jeśli użytkownik jest zalogowany i ma jawnie ustawioną flagę emailVerified na false.
  // Użytkownicy bez tej flagi (stare konta) są traktowani jako zweryfikowani.
  if (!currentUser || currentUser.emailVerified !== false) {
    return null;
  }

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;
    
    setIsResending(true);
    setResendStatus('idle');
    
    try {
      const result = await authService.resendActivationEmail({ email: currentUser.email });
      if (result.status === 'success') {
        setResendStatus('success');
        setCooldown(60); // 60 sekund blokady przed kolejną wysyłką
      } else {
        setResendStatus('error');
      }
    } catch (error) {
      setResendStatus('error');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="bg-amber-100 p-2 rounded-[var(--radius-brand-input)] shrink-0 mt-0.5 sm:mt-0">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-900">Wymagana weryfikacja adresu e-mail</h3>
            <p className="text-sm text-amber-700 mt-0.5">
              Aby uzyskać pełen dostęp do funkcji systemu (m.in. zlecanie windykacji), kliknij w link wysłany na adres <span className="font-semibold">{currentUser.email}</span>.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
          {resendStatus === 'success' && (
            <span className="text-xs font-medium text-green-600 flex items-center gap-1 animate-in fade-in">
              <CheckCircle2 size={14} /> Wysłano ponownie
            </span>
          )}
          {resendStatus === 'error' && (
            <span className="text-xs font-medium text-red-600 animate-in fade-in">
              Błąd wysyłki
            </span>
          )}
          <button
            onClick={handleResend}
            disabled={isResending || cooldown > 0}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-amber-300 text-amber-800 text-sm font-bold rounded-[var(--radius-brand-input)] hover:bg-amber-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Mail size={16} />
            )}
            {cooldown > 0 ? `Wyślij ponownie (${cooldown}s)` : 'Wyślij link ponownie'}
          </button>
        </div>
      </div>
    </div>
  );
}
