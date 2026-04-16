import React, { useState } from 'react';
import { Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ModalType } from '../../../context/ModalContext';
import { authService } from '@/shared/api/apiClientFactory';
import { FormLabel } from '@/shared/ui/forms/FormLabel';
import { FormInput } from '@/shared/ui/forms/FormInput';
import { FormButton } from '@/shared/ui/forms/FormButton';

interface ForgotPasswordFormProps {
  onSwitch: (type: ModalType) => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [showEmailError, setShowEmailError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isEmailValid) {
      setShowEmailError(true);
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const result = await authService.requestPasswordReset({ email });
      if (result.status === 'success') {
        setResetSent(true);
      } else {
        setError(result.message || 'Wystąpił błąd podczas wysyłania linku.');
      }
    } catch (err) {
      setError('Błąd połączenia z serwerem. Spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  };

  if (resetSent) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500 h-full">
        <div className="w-20 h-20 bg-brand-light-blue/30 text-brand-blue rounded-[var(--radius-brand-card)] flex items-center justify-center mb-8 shadow-xl shadow-brand-blue/10 rotate-3">
          <CheckCircle2 size={40} strokeWidth={2.5} />
        </div>
        <h4 className="text-2xl font-black text-brand-navy mb-3">Sprawdź skrzynkę</h4>
        <p className="text-slate-500 font-medium mb-10 max-w-[280px] mx-auto leading-relaxed">
          Wysłaliśmy link do resetu hasła na adres <span className="font-bold text-brand-navy">{email}</span>. Sprawdź folder spam, jeśli nie widzisz wiadomości.
        </p>
        <button 
          onClick={() => onSwitch('login')}
          className="w-full py-5 bg-brand-navy text-white font-black rounded-[var(--radius-brand-button)] hover:bg-brand-blue transition-all shadow-xl shadow-brand-navy/20 uppercase tracking-widest text-sm"
        >
          Wróć do logowania
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-8">
        <h3 className="text-2xl font-black text-brand-navy mb-3">Odzyskaj dostęp</h3>
        <p className="text-slate-500 font-medium">Podaj adres e-mail powiązany z Twoim kontem.</p>
      </div>

      <AnimatePresence mode="wait">
        {(error || (showEmailError && !isEmailValid)) && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="p-4 bg-red-50 text-red-600 rounded-[var(--radius-brand-button)] flex items-center gap-3 text-sm font-bold animate-shake">
              <AlertCircle size={18} />
              {error || 'Wprowadź poprawny adres e-mail.'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form className="flex-1 flex flex-col" onSubmit={handleSubmit}>
        <div className="flex-1 relative overflow-hidden">
          <motion.div
            key="forgot"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <div className="space-y-2">
              <FormLabel className="ml-1">Adres Email</FormLabel>
              <div className="relative group">
                <FormInput 
                  type="email" 
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setShowEmailError(false);
                    setError('');
                  }}
                  placeholder="email@twojafirma.pl"
                  icon={<Mail className={`transition-colors ${email ? 'text-brand-blue' : 'text-slate-300 group-focus-within:text-brand-blue'}`} size={18} />}
                  required
                  autoFocus
                  rightElement={isEmailValid ? (
                    <div className="text-green-500 animate-in zoom-in duration-300">
                      <CheckCircle2 size={18} />
                    </div>
                  ) : null}
                />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-auto pt-6">
          <div className="flex flex-col gap-4">
            <FormButton 
              type="submit" 
              disabled={isLoading}
              isLoading={isLoading}
              className="py-5 text-lg shadow-brand-navy/20 bg-brand-navy hover:bg-slate-800"
            >
              Wyślij link resetujący <ArrowRight size={20} />
            </FormButton>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-400 font-medium">
              Pamiętasz hasło?{' '}
              <button 
                type="button"
                onClick={() => onSwitch('login')} 
                className="text-brand-blue font-black hover:underline"
              >
                Wróć do logowania
              </button>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
