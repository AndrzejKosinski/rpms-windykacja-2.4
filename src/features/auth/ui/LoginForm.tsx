import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, AlertCircle, CheckCircle2, Loader2, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LoggedInUser } from '../../../context/AppContext';
import { ModalType } from '../../../context/ModalContext';
import { FormLabel } from '@/shared/ui/forms/FormLabel';
import { FormInput } from '@/shared/ui/forms/FormInput';
import { FormButton } from '@/shared/ui/forms/FormButton';

interface LoginFormProps {
  onSwitch: (type: ModalType) => void;
  onLoginSuccess: (user: LoggedInUser) => void;
  authData: any;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitch, onLoginSuccess, authData }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [showPasswordError, setShowPasswordError] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 8;
  const canSubmit = isEmailValid && isPasswordValid;

  const getEmailError = () => {
    if (!touched.email || !email) return '';
    if (!isEmailValid) return 'Wprowadź poprawny adres e-mail';
    return '';
  };

  const getPasswordError = () => {
    if (showPasswordError && !isPasswordValid) return 'Hasło musi mieć co najmniej 8 znaków';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    
    if (!isPasswordValid) {
      setShowPasswordError(true);
      return;
    }

    if (!isEmailValid) return;

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        onLoginSuccess({ 
          email: result.user.email, 
          name: result.user.name, 
          role: result.user.role,
          emailVerified: result.user.emailVerified
        });
      } else {
        setError(result.message || 'Błędny e-mail lub hasło.');
      }
    } catch (err) {
      setError('Błąd połączenia z serwerem. Spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-8">
        <h3 className="text-2xl font-black text-brand-navy mb-3">Witaj ponownie</h3>
        <p className="text-slate-500 font-medium">Zaloguj się do swojego panelu windykacyjnego.</p>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="p-4 bg-red-50 text-red-600 rounded-[var(--radius-brand-button)] flex items-center gap-3 text-sm font-bold animate-shake">
              <AlertCircle size={18} />
              {error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form className="flex-1 flex flex-col" onSubmit={handleSubmit}>
        <div className="flex-1 relative overflow-hidden">
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-5"
          >
            <div className="space-y-2">
              <FormLabel className="ml-1">Adres Email</FormLabel>
              <FormInput 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                placeholder="email@twojafirma.pl"
                error={getEmailError()}
                icon={
                  <motion.div
                    animate={{ scale: email ? 1.1 : 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Mail className={`transition-colors ${email ? 'text-brand-blue' : 'text-slate-300'}`} size={18} />
                  </motion.div>
                }
                rightElement={
                  isEmailValid && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-green-500"
                    >
                      <CheckCircle2 size={18} />
                    </motion.div>
                  )
                }
                className={email ? 'bg-white' : 'bg-slate-50'}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <FormLabel>Hasło</FormLabel>
                <button 
                  type="button" 
                  onClick={() => onSwitch('forgot-password')}
                  className="text-[13px] font-bold text-brand-blue hover:underline transition-all"
                >
                  Zapomniałeś hasła?
                </button>
              </div>
              <FormInput 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (showPasswordError) setShowPasswordError(false);
                }}
                onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                placeholder="••••••••"
                error={getPasswordError()}
                icon={
                  <motion.div
                    animate={{ scale: password ? 1.1 : 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Lock className={`transition-colors ${password ? 'text-brand-blue' : 'text-slate-300'}`} size={18} />
                  </motion.div>
                }
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-300 hover:text-brand-blue transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                className={password ? 'bg-white' : 'bg-slate-50'}
                required
              />
            </div>
          </motion.div>
        </div>

        <div className="mt-auto pt-6">
          <div className="flex flex-col gap-4">
            <FormButton 
              type="submit" 
              disabled={isLoading}
              isLoading={isLoading}
              className="py-5 text-lg shadow-brand-navy/20 bg-brand-navy hover:bg-slate-800 active:scale-[0.98] transition-transform"
            >
              Zaloguj się <ArrowRight size={20} />
            </FormButton>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-400 font-medium">
              Nie masz jeszcze konta?{' '}
              <button 
                type="button"
                onClick={() => onSwitch('register')} 
                className="text-brand-blue font-black hover:underline"
              >
                Zarejestruj się tutaj
              </button>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
