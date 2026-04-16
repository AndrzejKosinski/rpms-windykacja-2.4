import React, { useState } from 'react';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LoggedInUser } from '../../../context/AppContext';
import { ModalType } from '../../../context/ModalContext';
import { authService } from '@/shared/api/apiClientFactory';
import { FormButton } from '@/shared/ui/forms/FormButton';

import { RegisterFormStep1 } from './RegisterFormStep1';
import { RegisterFormStep2 } from './RegisterFormStep2';
import { RegisterFormBenefits } from './RegisterFormBenefits';

interface RegisterFormProps {
  onSwitch: (type: ModalType) => void;
  onLoginSuccess: (user: LoggedInUser) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitch, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [showStep1Error, setShowStep1Error] = useState(false);
  const [showStep2Error, setShowStep2Error] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [regStep, setRegStep] = useState(1);

  const requirements = [
    { id: 'length', label: 'Min. 10 znaków', met: password.length >= 10 },
    { id: 'upper', label: 'Wielka litera', met: /[A-Z]/.test(password) },
    { id: 'lower', label: 'Mała litera', met: /[a-z]/.test(password) },
    { id: 'number', label: 'Cyfra', met: /\d/.test(password) },
    { id: 'special', label: 'Znak specjalny', met: /[@$!%*?&]/.test(password) },
  ];

  const allMet = requirements.every(r => r.met);
  const passwordsMatch = password === confirmPassword && password !== '';
  
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isStep1Valid = isEmailValid && name.replace(/\D/g, '').length >= 10;
  const isStep2Valid = passwordsMatch && allMet;
  const canSubmit = isStep1Valid && isStep2Valid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (regStep === 1) {
      if (isStep1Valid) {
        setRegStep(2);
        setShowStep1Error(false);
      } else {
        setShowStep1Error(true);
      }
      return;
    }

    if (!isStep2Valid) {
      setShowStep2Error(true);
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const result = await authService.registerUser({
        email,
        password,
        name,
        role: 'Konto Aktywne',
        updateExistingCases: true
      });

      if (result.status === 'success') {
        await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name, role: 'Konto Aktywne' })
        });
        onLoginSuccess({ email, name, role: 'Konto Aktywne', emailVerified: false });
      } else {
        setError(result.message || 'Błąd podczas tworzenia konta.');
      }
    } catch (err) {
      setError('Błąd połączenia z serwerem. Spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full lg:w-1/2 p-8 lg:p-12 relative flex flex-col h-full">
        <div className="flex flex-col h-full">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-1">
                <div className={`h-1.5 rounded-full transition-all duration-300 ${regStep === 1 ? 'w-6 bg-brand-blue' : 'w-2 bg-slate-200'}`} />
                <div className={`h-1.5 rounded-full transition-all duration-300 ${regStep === 2 ? 'w-6 bg-brand-blue' : 'w-2 bg-slate-200'}`} />
              </div>
            </div>
            <h3 className="text-2xl font-black text-brand-navy mb-3">
              {regStep === 1 ? (
                <>Otwórz swoje <span className="text-brand-blue">darmowe</span> konto</>
              ) : 'Zabezpiecz konto'}
            </h3>
            <p className="text-slate-500 font-medium">
              {regStep === 1 ? 'Zyskaj pełną kontrolę i dostęp do Panelu Klienta 24/7.' : 'Ustaw silne hasło dostępu do Panelu.'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {(error || (showStep1Error && !isStep1Valid) || (showStep2Error && !isStep2Valid)) && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="p-4 bg-red-50 text-red-600 rounded-[var(--radius-brand-button)] flex items-center gap-3 text-sm font-bold animate-shake">
                  <AlertCircle size={18} />
                  {error || (regStep === 1 ? 'Wprowadź poprawne dane firmy.' : 'Hasło nie spełnia wymogów bezpieczeństwa.')}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form className="flex-1 flex flex-col" onSubmit={handleSubmit}>
            <div className="flex-1 relative overflow-hidden">
              <AnimatePresence mode="wait">
                {regStep === 1 ? (
                  <RegisterFormStep1 
                    name={name}
                    setName={(val) => { setName(val); setShowStep1Error(false); setError(''); }}
                    email={email}
                    setEmail={(val) => { setEmail(val); setShowStep1Error(false); setError(''); }}
                    isEmailValid={isEmailValid}
                  />
                ) : (
                  <RegisterFormStep2 
                    password={password}
                    setPassword={(val) => { setPassword(val); setShowStep2Error(false); setError(''); }}
                    confirmPassword={confirmPassword}
                    setConfirmPassword={(val) => { setConfirmPassword(val); setShowStep2Error(false); setError(''); }}
                    requirements={requirements}
                    allMet={allMet}
                    passwordsMatch={passwordsMatch}
                  />
                )}
              </AnimatePresence>
            </div>

            <div className="mt-auto pt-6">
              <div className="flex flex-col gap-4">
                <FormButton 
                  type="submit" 
                  disabled={isLoading}
                  isLoading={isLoading}
                  className="py-5 text-lg shadow-brand-navy/20 bg-brand-navy hover:bg-slate-800"
                >
                  {regStep === 1 ? 'Kontynuuj' : 'Utwórz konto'} <ArrowRight size={20} />
                </FormButton>
                
                {regStep === 2 && (
                  <button 
                    type="button"
                    onClick={() => setRegStep(1)}
                    className="text-sm font-bold text-slate-400 hover:text-brand-navy transition-colors"
                  >
                    Wróć do danych firmy
                  </button>
                )}
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-slate-400 font-medium">
                  Masz już konto?{' '}
                  <button 
                    type="button"
                    onClick={() => onSwitch('login')} 
                    className="text-brand-blue font-black hover:underline"
                  >
                    Zaloguj się tutaj
                  </button>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>

      <RegisterFormBenefits />
    </>
  );
};
