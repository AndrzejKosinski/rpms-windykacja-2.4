import React, { useState, useEffect } from 'react';
import { ShieldCheck, Loader2, ArrowRight, Check, X } from 'lucide-react';
import { FormLabel } from '@/shared/ui/forms/FormLabel';
import { FormInput } from '@/shared/ui/forms/FormInput';
import { FormButton } from '@/shared/ui/forms/FormButton';

interface StepPasswordProps {
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

const StepPassword: React.FC<StepPasswordProps> = ({ onSubmit, isSubmitting }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nip, setNip] = useState('');

  const requirements = [
    { id: 'length', label: 'Minimum 10 znaków', met: password.length >= 10 },
    { id: 'upper', label: 'Wielka litera', met: /[A-Z]/.test(password) },
    { id: 'lower', label: 'Mała litera', met: /[a-z]/.test(password) },
    { id: 'number', label: 'Cyfra', met: /\d/.test(password) },
    { id: 'special', label: 'Znak specjalny (@$!%*?&)', met: /[@$!%*?&]/.test(password) },
  ];

  const allMet = requirements.every(r => r.met);
  const passwordsMatch = password === confirmPassword && password !== '';
  const canSubmit = allMet && passwordsMatch && nip.length >= 10;

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-center max-w-sm mx-auto flex flex-col justify-center h-full">
      <div className="w-12 h-12 bg-brand-light-blue rounded-[var(--radius-brand-button)] flex items-center justify-center text-brand-blue mx-auto mb-6">
        <ShieldCheck size={28} />
      </div>
      <h3 className="text-2xl font-black text-brand-navy mb-1 tracking-tight">Zabezpiecz konto</h3>
      <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">Ustaw silne hasło dostępu do swojego Panelu Spraw.</p>

      <form onSubmit={onSubmit} className="space-y-4 text-left">
        <div className="space-y-1">
          <FormLabel className="text-brand-navy">NIP firmy</FormLabel>
          <FormInput 
            type="text" required placeholder="897-123-45-67"
            name="nip"
            value={nip}
            className="text-sm"
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').substring(0, 10);
              let formatted = val;
              if (val.length > 3) formatted = val.substring(0, 3) + '-' + val.substring(3);
              if (val.length > 6) formatted = val.substring(0, 3) + '-' + val.substring(3, 6) + '-' + val.substring(6);
              if (val.length > 8) formatted = val.substring(0, 3) + '-' + val.substring(3, 6) + '-' + val.substring(6, 8) + '-' + val.substring(8);
              setNip(formatted);
            }}
          />
        </div>
        <div className="space-y-1">
          <FormLabel className="text-brand-navy">Hasło</FormLabel>
          <FormInput 
            type="password" required placeholder="••••••••"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-sm"
          />
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 px-1">
            {requirements.map(req => (
              <div key={req.id} className={`flex items-center gap-1.5 text-[10px] font-bold ${req.met ? 'text-emerald-500' : 'text-slate-400'}`}>
                {req.met ? <Check size={10} strokeWidth={3} /> : <div className="w-2.5 h-2.5 rounded-full border border-slate-300" />}
                {req.label}
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-1">
          <FormLabel className="text-brand-navy">Powtórz hasło</FormLabel>
          <FormInput 
            type="password" required placeholder="••••••••"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="text-sm"
            error={confirmPassword && !passwordsMatch ? 'Hasła nie są identyczne' : undefined}
          />
        </div>

        <div className="pt-2">
          <FormButton 
            type="submit" disabled={isSubmitting || !canSubmit}
            isLoading={isSubmitting}
            className="bg-brand-navy hover:bg-slate-800 shadow-xl"
          >
            Zakończ konfigurację <ArrowRight size={18} />
          </FormButton>
        </div>
      </form>
    </div>
  );
};

export default StepPassword;
